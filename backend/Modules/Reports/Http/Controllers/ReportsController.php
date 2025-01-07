<?php
namespace Modules\Reports\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use PDF;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;

use Modules\Reports\Providers\PdfProvider;
use Modules\Reports\Providers\PdfLettersProvider;
use Modules\Reports\Providers\AuditReportProvider;
use Modules\Reports\Traits\ReportsTrait;
use \Mpdf\Mpdf as mPDF;
use DateTime;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;


class ReportsController extends Controller
{

    protected $user_id;
    protected $base_url;
    protected $sign_url;
    protected $sign_file;

    protected $zone_id;
use ReportsTrait;
    public function __construct()
    {
        $this->base_url = url('/');
        $this->sign_file = getPermitSignatorySignature();
        $this->sign_url = $this->base_url . Config('constants.signs_path') . $this->sign_file;
		if(isset(\Auth::user()->id)){
			$this->user_id = \Auth::user()->id;

		}
		else{
			$this->user_id = '0';
		}

    }
    public function index()
    {
        return view('reports::index');
    }

		public function generateApplicationInvoice(Request $request)
    {
        $invoice_id = $request->input('invoice_id');
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
		 $sub_module_id = $request->input('sub_module_id');
		 if(!validateIsNumeric($module_id)){
			 $module_details = getTableData('sub_modules', array('id' => $sub_module_id));
			 if($module_details){
				  $module_id = $module_details->module_id;

			 }

		 }
		if(!validateIsNumeric($invoice_id)){
			$invoice_record = DB::table('tra_application_invoices')->where('application_code',$application_code)->first();
			if($invoice_record){
					$invoice_id = $invoice_record->id;
			}
		 }
		//check the paymetn Control Number
		$rec = DB::table('tra_application_invoices as t1')
					->join('wb_trader_account as t2','t1.applicant_id', 't2.id')
					->leftJoin('par_countries as t3', 't2.country_id','t3.id')
					->leftJoin('par_regions as t4', 't2.region_id','t4.id')
					->leftJoin('modules as t5', 't1.module_id','t5.id')
					->leftJoin('sub_modules as t6', 't1.sub_module_id','t6.id')
					->select('t1.*','t2.name as applicant_name','t2.postal_address', 't2.email','t3.name as country_name','t4.name as region_name', 't5.name as module_name', 't6.name as sub_module')
					->where(array('t1.id'=>$invoice_id))->first();
		if($rec){
			$PayCntrNum = $rec->PayCntrNum;

					$params = array(
						'invoice_id' => $invoice_id,
						'application_code'=>$application_code
					);
				//new functionait
				PDF::setPrintHeader(false);
				PDF::setPrintFooter(false);
				PDF::AddPage();
				$org_rec = getSingleRecord('tra_organisation_information', array('id'=>1));
			$logo = getcwd() . '/resources/images/zamra-logo.png';
			//PDF:: Image($logo, 86, 40, 35, 25);
			$tbl = <<<EOD
<table cellspacing="2" cellpadding="1" border="1">

    <tr >
        <td rowspan="4" style="text-align:center"><img src="$logo"/><br/>$org_rec->name<br/>$org_rec->postal_address $org_rec->region_name , $org_rec->republic<br/> $org_rec->physical_address<br />$org_rec->telephone_nos<br />$org_rec->email_address $org_rec->website <br /></td>
        <td>Proforma Invoice</td>

    </tr>
    <tr>
       <td>Invoice Date:$rec->date_of_invoicing </td>
    </tr>
	 <tr>
		   <td>Invoice Number:$rec->invoice_no</td>
	</tr>
	<tr>
       <td>: Ref No: $rec->tracking_no $rec->reference_no</td>
    </tr>

</table>
EOD;

PDF::writeHTML($tbl, true, false, false, false, '');


				PDF::Cell(0,7,'Customer Details',0,1);
				PDF::Cell(0,7,$rec->applicant_name,0,1);
				PDF::Cell(0,7,$rec->postal_address.', '.$rec->region_name.', '.$rec->country_name,0,1);
				PDF::Cell(0,7,$rec->email,0,1);

				PDF::ln();
				PDF::Cell(0,7,'Invoice Details for '.$rec->module_name.' ('.$rec->sub_module.')',0,1,'');

				//invoice details
				PDF::Cell(15,10,'Sn',1,0);
				PDF::Cell(100,10,'Item Description',1,0,'C');
				PDF::Cell(40,10,'Price',1,0,'C');
				PDF::Cell(0,10,'Total',1,1,'C');
				$inv_rec = DB::table('tra_invoice_details as t1')
								->join('par_currencies as t2','t1.paying_currency_id','t2.id')
								->join('tra_element_costs as t3','t1.element_costs_id','t3.id')
								->join('par_cost_elements as t4','t3.element_id','t4.id')
								->join('par_fee_types as t5','t3.fee_type_id','t5.id')
								->join('par_cost_categories as t6','t3.cost_category_id','t6.id')
								->select(DB::raw(" t4.name AS cost_element, t5.name AS fee_type, t6.name AS cost_category, t1.total_element_amount AS invoice_amount, t1.paying_currency_id,t2.name as currency_name"))
								->where(array('t1.invoice_id'=>$invoice_id))
								->get();
				if($inv_rec){
					$i = 1;
					$total_amount = 0;
					$currency_name = '';
					$paying_currency_id = '';
					foreach($inv_rec as $inv){
						$currency_name = $inv->currency_name;
						$cost_item = $inv->fee_type." ".$inv->cost_category." ".$inv->cost_element;
						$paying_currency_id = $inv->paying_currency_id;
							$rowcount = max(PDF::getNumLines($cost_item, 92),PDF::getNumLines($inv->invoice_amount, 40));
						PDF::MultiCell(15,7*$rowcount,$i,1,'',0,0);
						PDF::MultiCell(100,7*$rowcount,$cost_item,1,'',0,0);
						PDF::MultiCell(40,7*$rowcount,formatMoney($inv->invoice_amount),1,'R',0,0);
						PDF::MultiCell(0,7*$rowcount,formatMoney($inv->invoice_amount),1,'R',0,1);
						$total_amount = $total_amount+$inv->invoice_amount;

						$i++;
					}

					PDF::MultiCell(155,10,'Sub-Total('.$currency_name.')',1,'R',0,0);
					PDF::MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);

					PDF::MultiCell(155,10,'Total('.$currency_name.')',1,'R',0,0);
					PDF::MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);

				}
				//get the Bank Details based on the paying currency

				$bank_rec = DB::table('tra_orgbank_accounts as t1')
								->leftJoin('par_banks as t2', 't1.bank_id', 't2.id')
								->leftJoin('par_bankbranches as t3', 't1.branch_id', 't3.id')
								->leftJoin('par_currencies as t4', 't1.currency_id', 't4.id')
								->select(DB::raw("t4.name as currency_name, t1.account_name, t1.account_no, t1.swft_code, t2.name AS bank_name, t3.name AS branch_name"))
								->where(array('t1.currency_id'=>$paying_currency_id))
								->get();
					if($bank_rec){
						PDF::MultiCell(0,7,'The amount due must be remitted to the following account:',0,'',0,1);
						$i = 1;
								foreach($bank_rec as $bank){
									PDF::MultiCell(100,7,$i.'. '.$bank->account_name.' '.$bank->bank_name." ".$bank->branch_name.' '.$bank->currency_name." Account: ".$bank->account_no. " Swift Code: ".$bank->swft_code,0,'',0,1);

								}
					}

				//bank name s*
				PDF::Output();
				exit();
					//$report = generateJasperReport('proforma_invoice/invoice', 'invoice_' . time(), 'pdf', $params);
					//return $report;


		}
		else{
			echo "<h4>Invoice details Not Found</h4>";
		}

    }
    public function generateApplicationReceiptPrev(Request $request)
    {

        $table_name = $request->input('table_name');
        $application_code = $request->input('application_code');
        $payment_id = $request->input('payment_id');
        $application_id = $request->input('application_id');
        $module_id = $request->input('module_id');
		if(validateIsNumeric($module_id)){
			$module_details = getTableData('modules', array('id' => $module_id));
            $table_name = $module_details->table_name;
		}

        if(validateIsNumeric($application_code)){
            $reference_no = getSingleRecordColValue($table_name, array('application_code' => $application_code), 'reference_no');
           // $payment_id = getSingleRecordColValue('tra_payments', array('application_code' => $application_code), 'id');
        }
        else{

            $reference_no = getSingleRecordColValue($table_name, array('id' => $application_id), 'reference_no');

        }
		$record = DB::table('tra_payments')->where('id',$payment_id)->first();
		if($record){
			$payment_type_id = $record->payment_type_id;
			if($payment_type_id == 3){
				$this->funcGenerateCreditNote($payment_id);

			}
			else{
			 $params = array(
					'payment_id' => $payment_id,
					 'receipt_id' => $payment_id,
					'reference_no' => $reference_no,
					'base_Url' => $this->base_url,
					 'base_url' => $this->base_url,
					'sign_url' => $this->sign_url
				);

				 $report = generateJasperReport('receiptReport', 'receipt_' . time(), 'pdf', $params);

        return $report;
			}


		}



    }
	public function generateApplicationReceipt(Request $request)
    {
         $table_name = $request->input('table_name');
        $application_code = $request->input('application_code');
        $payment_id = $request->input('payment_id');
        $application_id = $request->input('application_id');
        $module_id = $request->input('module_id');
		if(validateIsNumeric($module_id)){
			$module_details = getTableData('modules', array('id' => $module_id));
            $table_name = $module_details->table_name;
		}

        if(validateIsNumeric($application_code)){
            $reference_no = getSingleRecordColValue($table_name, array('application_code' => $application_code), 'reference_no');
           // $payment_id = getSingleRecordColValue('tra_payments', array('application_code' => $application_code), 'id');
        }
        else{

            $reference_no = getSingleRecordColValue($table_name, array('id' => $application_id), 'reference_no');

        }
		$payment_receivedby = '';

		//check the paymetn Control Number
		$rec = DB::table('tra_payments as t1')
					->join('wb_trader_account as t2','t1.applicant_id', 't2.id')
					->leftJoin('par_countries as t3', 't2.country_id','t3.id')
					->leftJoin('par_regions as t4', 't2.region_id','t4.id')
					->leftJoin('modules as t5', 't1.module_id','t5.id')
					->leftJoin('sub_modules as t6', 't1.sub_module_id','t6.id')
					->leftJoin('par_currencies as t7', 't1.currency_id','t7.id')
					->leftJoin('par_payment_modes as t8', 't1.payment_mode_id','t8.id')
					->leftJoin('users as t9', 't1.usr_id','t9.id')
					->select('t1.*','t2.name as applicant_name','t8.name as payment_mode', 't7.name as currency_name', 't2.postal_address', 't2.email','t3.name as country_name','t4.name as region_name', 't5.name as module_name', 't6.name as sub_module', DB::raw(" CONCAT_WS(' ',decrypt(t9.first_name),decrypt(t9.last_name)) as payment_receivedby"))
					->where(array('t1.id'=>$payment_id))->first();
		if($rec){
			$payment_type_id = $rec->payment_type_id;
			$payment_receivedby = $rec->payment_receivedby;
			if($payment_type_id == 3){
				$this->funcGenerateCreditNote($payment_id);

			}
			else{

				PDF::setPrintHeader(false);
				PDF::setPrintFooter(false);
				PDF::AddPage();
				$org_rec = getSingleRecord('tra_organisation_information', array('id'=>1));
			$logo = getcwd() . '/resources/images/zamra-logo.png';
			//PDF:: Image($logo, 86, 40, 35, 25);
			$tbl = <<<EOD
<table cellspacing="2" cellpadding="3" border="1">

    <tr >
        <td rowspan="4" style="text-align:center"><img src="$logo"/><br/>$org_rec->name<br/>$org_rec->postal_address $org_rec->region_name , $org_rec->republic<br/> $org_rec->physical_address<br />$org_rec->telephone_nos<br />$org_rec->email_address $org_rec->website <br /></td>
        <td>Receipt</td>

    </tr>
    <tr>
       <td>Payment Date:$rec->trans_date </td>
    </tr>
	 <tr>
		   <td>Receipt Number:$rec->receipt_no</td>
	</tr>
	<tr>
       <td>: Ref No: $rec->tracking_no $rec->reference_no</td>
    </tr>

</table>
EOD;
PDF::SetFont('times','B',11);
PDF::writeHTML($tbl, true, false, false, false, '');

				PDF::SetFont('times','B',11);
				PDF::Cell(0,7,'Account Payee(From)',0,1);
				PDF::Cell(0,7,$rec->applicant_name,0,1);
				PDF::Cell(0,7,$rec->postal_address.', '.$rec->region_name.', '.$rec->country_name,0,1);
				PDF::Cell(0,7,$rec->email,0,1);
				PDF::ln();
				PDF::SetFont('times','',11);
				PDF::Cell(70,10,'Payment Mode: '.$rec->payment_mode,0,0);
				PDF::Cell(0,10,'Amount : '.$rec->amount_paid .' ('.$rec->currency_name.')',0,1);

				PDF::MultiCell(0,10,'Received with thanks, the sum of : '. ucwords(convert_number_to_words($rec->amount_paid)).' Only',0,'',0,1);

						PDF::SetFont('times','',11);
				PDF::Cell(0,7,'Receipt/Payments Details for '.$rec->module_name.' ('.$rec->sub_module.')',0,1,'');

				//invoice details
				PDF::SetFont('times','B',11);
				PDF::Cell(15,10,'Sn',1,0);
				PDF::Cell(140,10,'Being Payment for: ',1,0,'C');
				PDF::Cell(0,10,'Total',1,1,'C');
				$inv_rec = DB::table('payments_references as t1')
								->join('par_currencies as t2','t1.currency_id','t2.id')
								->join('tra_element_costs as t3','t1.element_costs_id','t3.id')
								->join('par_cost_elements as t4','t3.element_id','t4.id')
								->join('par_fee_types as t5','t3.fee_type_id','t5.id')
								->join('par_cost_categories as t6','t3.cost_category_id','t6.id')
								->select(DB::raw(" t4.name AS cost_element, t5.name AS fee_type, t6.name AS cost_category, t1.amount_paid, t1.currency_id,t2.name as currency_name"))
								->where(array('t1.receipt_id'=>$payment_id))
								->get();

				if($inv_rec){
					$i = 1;
					$total_amount = 0;
					$currency_name = '';
					$currency_id = '';
					foreach($inv_rec as $inv){
						$currency_name = $inv->currency_name;
						$cost_item = $inv->fee_type." ".$inv->cost_category." ".$inv->cost_element;
						PDF::SetFont('times','',11);
							$rowcount = max(PDF::getNumLines($cost_item, 92),PDF::getNumLines($inv->amount_paid, 40));
						PDF::MultiCell(15,7*$rowcount,$i,1,'',0,0);
						PDF::MultiCell(140,7*$rowcount,$cost_item,1,'',0,0);
						PDF::MultiCell(0,7*$rowcount,formatMoney($inv->amount_paid),1,'R',0,1);
						$total_amount = $total_amount+$inv->amount_paid;

						$i++;
					}
					PDF::SetFont('times','B',11);
					PDF::MultiCell(155,10,'Sub-Total('.$currency_name.')',1,'R',0,0);
					PDF::MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);

					PDF::MultiCell(155,10,'Total('.$currency_name.')',1,'R',0,0);
					PDF::MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);

				}
				PDF::SetFont('times','i',11);
				PDF::MultiCell(100,7,'Received By: '.$payment_receivedby,1,'',0,0);
				PDF::MultiCell(0,7,'Print Date: '.Carbon::now(),1,'',0,1);

				PDF::Output();


			}

		}
		else{
			echo "<h4>Receipt details Not Found</h4>";
		}

    }

    public function printSampleSubmissionReport(Request $request)
    {

        $table_name = $request->input('table_name');
        $application_code = $request->input('application_code');

        $params = array(
            'application_code' => $application_code,
			 'base_url' => $this->base_url,
            'base_Url' => $this->base_url
        );

       $report = generateJasperReport('sampleReport', 'sampleSubmissionAck_' . time(), 'pdf', $params);

        return $report;
    }



    public function getPremisesOtherDetails($premise_id,$section_id){
        $textBusiness ='';
        $business_type ='';
        $business_type_details ='';
        $rec = DB::table('tra_premises_otherdetails as t1')
                    ->leftJoin('par_business_types as t2','t1.business_type_id','t2.id')
                    ->leftJoin('par_business_type_details as t3','t1.business_type_detail_id','t3.id')
                    ->select(DB::raw("GROUP_CONCAT(CONCAT(t3.name)) as business_type_details, t2.name as business_type"))
                    ->where('t1.premise_id',$premise_id)
                    ->first();
            if($rec){
                $business_type = $rec->business_type;
                $business_type_details = $rec->business_type_details;

            }
        if($section_id == 2){
                            $business_type = $rec->business_type;
                            $business_type_details = $rec->business_type_details;

							 if(strpos(strtolower($business_type),'wholesale') !== false && strpos(strtolower($business_type),'importation') !== false){
									//$business_type = "a ".ucwords(strtolower($business_type))." for Importation and";
									$business_type = "a ".ucwords(strtolower("wholesale"))." for Importation and";
									$business_type_details = "Selling of ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> <b>".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}else if(strpos(strtolower($business_type),'wholesale') !== false  && strpos(strtolower($business_type),'importation') == false){
									$business_type = "a ".ucwords(strtolower($business_type));
									$business_type_details = "of ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> <b>".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}


								//comment
								else if(strpos($business_type,'Warehouse') !== false){
									$business_type = "a ".ucwords(strtolower($business_type));
										if(strpos($business_type_details,'Raw') !== false){

											$business_type_details = "Storing ".ucwords(strtolower($business_type_details));

										}
										else{
											$business_type_details = "Storing Registered ".ucwords(strtolower($business_type_details));
										}

										$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> for <b>".$business_type_details;
										//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}
								else if(strpos(strtolower($business_type),'manufactur') !== false){

										$business_type = "to manufacture for sell <b>Registered ".ucwords(strtolower($business_type_details))."</b>";
										$textBusiness = "</b> region, have been registered ".$business_type;
										//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";

								}
								else if(strpos(strtolower($business_type),'retail') !== false){

									$business_type_details = "</b> to operate <b>a business of retail Pharmacy for sale of ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered <b>".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";

								}else if(strpos(strtolower($business_type),'dldm') !== false){
									$business_type = "a ".ucwords(strtolower($business_type))." for Importation and";
									$business_type_details = "an Accredited Drug Dispensing Outlet for retail sale of ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered <b>".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";

								}
								else if(strpos(strtolower($business_type),'distributor') !== false OR strpos(strtolower($business_type_details),'carrier') !== false){
									$premise_name = $applicantName ;


									if(strpos(strtolower($business_type_details),'carrier') !== false){

										$business_type = $business_type_details;
										$textBusiness = "</b> region, have been registered to be used as <b>".$business_type." ";
										//$textBusiness.= "</b> with registration number <b>$premise_reg_no</b>.";
									}
									else {
										$business_type = "a ".$business_type." for Importation and";
										$business_type .= "Selling ".$business_type_details;
										$textBusiness = "</b> region, have been registered to be used as <b>".$business_type." ";
									//	$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
									}

								}
								else{

									$business_type = "a ".ucwords(strtolower($business_type))." for Importation and";
									$business_type_details = "Selling ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered to be used as <b>".$business_type." ".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";

								}

							}

							else if($section_id == 4){
								if(strpos(strtolower($business_type),'warehouse') !== false){

										$business_type = "a ".ucwords(strtolower($business_type));
										$business_type_details = "Storing Registered ".ucwords(strtolower($business_type_details));
										$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> for <b>".$business_type_details;
										//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}
								else if(strpos(strtolower($business_type),'manufactur') !== false){

										$business_type = "to manufacture for sell <b> ".ucwords(strtolower($business_type_details))."</b>";
										$textBusiness = "</b> region, have been registered ".$business_type;
									//	$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";

								}
								else if(strpos(strtolower($business_type),'wholesale') !== false && strpos(strtolower($business_type),'importation') !== false){
									//$business_type = "a ".ucwords(strtolower($business_type))." for Importation and";
									$business_type = "a ".ucwords(strtolower("wholesale"))." for Importation and";
									$business_type_details = "Selling of ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> <b>".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}else if(strpos(strtolower($business_type),'wholesale') !== false  && strpos(strtolower($business_type),'importation') == false){
									$business_type = "a ".ucwords(strtolower($business_type));
									$business_type_details = "of ".ucwords(strtolower($business_type_details));
									$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> <b>".$business_type_details;
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}
								else if(strpos(strtolower($business_type),'distributor') !== false OR strpos(strtolower($business_type_details),'carrier') !== false){
									$premise_name = $applicantName ;


									if(strpos(strtolower($business_type_details),'carrier') !== false){

										$business_type = $business_type_details;
										$textBusiness = "</b> region, have been registered to be used as <b>".$business_type." ";
										//$textBusiness.= "</b> with registration number <b>$premise_reg_no</b>.";
									}
									else {
										$business_type = "a ".$business_type." for Importation and";
										$business_type .= "Selling ".$business_type_details;
										$textBusiness = "</b> region, have been registered to be used as <b>".$business_type." ";
										//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
									}

								}
								else if(strpos(strtolower($business_type),'retail') !== false){
									$textBusiness = "</b> to operate <b>a premises for dealing in ".ucwords(strtolower($business_type))." Selling of Registered ".ucwords(strtolower($business_type_details))."";
								}
								else{

									$business_type = "a ".ucwords(strtolower($business_type))." for Importation and";
									$business_type_details = "Selling Registered ".ucwords(strtolower($business_type_details));


									$textBusiness = "</b> region, have been registered to be used as <b>".$business_type."</b> <b>".ucwords(strtolower($business_type_details));
									//$textBusiness.= "</b> in premises with registration number <b>$premise_reg_no</b>.";
								}

                            }

        return $textBusiness;

    }
public function generatePremiseCertificate(Request $req){
	try{
				$application_code = $req->application_code;
				$record = DB::table('tra_premises_applications as t1')
										->leftJoin('tra_premises as t2', 't1.premise_id', 't2.id')
										->leftJoin('wb_trader_account as t3', 't1.applicant_id', 't3.id')
										->leftJoin('par_districts as t4', 't2.district_id', 't4.id')
										->leftJoin('par_regions	 as t5', 't2.region_id', 't5.id')
										->leftJoin('par_countries	 as t6', 't2.country_id', 't6.id')
										->leftJoin('par_premises_types	 as t7', 't2.premise_type_id', 't7.id')
										->select('t1.*','t2.*', 't8.*', 't3.name as applicant_name', 't4.name as district_name','t7.name as premise_type', 't7.permit_type_title', 't5.name as region_name', 't6.name as country_name', 't8.permit_signatory as permit_approval', 't7.*')
										->join('tra_approval_recommendations as t8', 't1.application_code','t8.application_code' )
										->where('t1.application_code',$application_code)
										->first();
				if($record){

					$decision_id = $record->decision_id;
					$premise_type_id = $record->premise_type_id;

							if($decision_id ==1){
									//Pharmaceutical License WholeSale
								//	Agro-Veterinary Shop
								//Health Shop
								//Hospital and Retail Pharmacy
								//Dispensing Certificate
								$org_info = $this->getOrganisationInfo();
															$pdf = new PdfProvider();

															$pdf->AddPage();
																$template_url = base_path('/');
																$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
																// import page 1
																$tplId = $pdf->importPage(1);
																$pdf->useTemplate($tplId,0,0);
																$pdf->setPageMark();

																$logo = getcwd() . '/resources/images/zamra-logo.png';
																$pdf->Image($logo, 86, 18, 40, 35);
																$style = array(
																	'border' => 0,
																	'vpadding' => 'auto',
																	'hpadding' => 'auto',
																	'fgcolor' => array(0,0,0),
																	'bgcolor' => false, //array(255,255,255)
																	'module_width' => 1, // width of a single module in points
																	'module_height' => 1 // height of a single module in points
															);
															$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$record->permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
																$pdf->SetFont('times','B',9);
															$pdf->SetFont('times','B',9);
															$pdf->Cell(0,1,'',0,1);

															$pdf->Cell(0,4,'FORM Iv',0,1,'R');
															$pdf->Cell(0,4,'(Regulation 6)',0,1,'R');
															$pdf->SetFont('times','B',13);
															$pdf->Cell(0,6,'',0,1);
															$pdf->Cell(0,12,'',0,1);
															$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

															$pdf->SetFont('times','B',12);
															$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
															//$pdf->Cell(0,30,'',0,1);
															$pdf->Cell(0,5,'',0,1);

															$regulation_title = "The Medicines and Allied Substances (Certificate of Registration) Regulations, 2017";

															$pdf->Cell(0,4,$regulation_title,0,1,'C');

															$pdf->Cell(0,5,'',0,1);

															$pdf->SetFont('times','B',13);	$pdf->ln();
															$pdf->Cell(0,5,'CERTIFICATE OF REGISTRATION',0,1,'C');
															$pdf->SetFont('times','B',11);
															$pdf->ln();
															$pdf->Cell(0,8,' No: '.$record->premise_reg_no,0,1,'R');
															$pdf->SetFont('times','',11);
															$pdf->SetFont('times','B',11);

															$pdf->setCellHeightRatio(2.4);
															$pdf->SetFont('times','',11);
															$template = "<p  align='justify'>This is to certify that (Name of ".$record->premise_type." ".$record->name ."  of (Physical Address) ".$record->physical_address.", ".$record->postal_address.", ".$record->region_name.", ".$record->country_name." is registered as a ".$record->premise_type;
															$pdf->WriteHTML($template, true, false, true, true);

															$pdf->SetFont('times','',11);
															$pdf->Cell(0,8,'The terms and conditions of the certificate or registration are attached herewith',0,1);
															$pdf->SetFont('times','',11);
															$pdf->ln();
															$pdf->ln();

															$pdf->Cell(0,8,'This Certificate is issued on '.formatDate($record->approval_date),0,0,'C');


																	$director_details = getPermitSignatoryDetails();
																	$dg_signatory = $director_details->director_id;
																	$director = $director_details->director;
																	$is_acting_director = $director_details->is_acting_director;

																	$permit_approval = $record->permit_approval;
																	$approved_by = $record->approved_by;
																	if($dg_signatory != $approved_by){
																		$signatory = $approved_by;
																	}
																	else{
																		$signatory = $dg_signatory;
																	}
																	$pdf->Ln();
																	$pdf->Ln();
															$signature = getUserSignatureDetails($signatory);
															$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
															$startY = $pdf->GetY();
																	$startX =$pdf->GetX();
															$pdf->Image($signature,$startX+75,$startY-8,30,12);

															$pdf->Cell(105,0,'',0,0);

																	$pdf->Ln();
																	$pdf->Cell(0,10,'...............................................................', 0,1,'C');

																	$title = "Director-General";
																	if($dg_signatory != $approved_by){
																		$title = 'Acting '.$title;
																	}else{
																		if($is_acting_director ==1){
																			$title = 'Acting '.$title;
																		}

																	}

																	$pdf->Cell(0,10,$title, 0,0,'C');
															$pdf->AddPage();

															$pdf->SetFont('times','B',11);
															$pdf->Cell(0,8,'TERMS AND CONDITIONS',0,1);

															$pdf->SetFont('times','',11);
															$pdf->MultiCell(11,11,'1.',0,'',0,0);

															$pdf->MultiCell(0,11,'The certificate of registration shall be displayed conspicuously on the premises ',0,'',0,1);

															$pdf->MultiCell(11,11,'2.',0,'',0,0);
															$pdf->MultiCell(0,11,'The holder of the certificate of registration share, withing 14 dayes of the changes occurring notify the Authority of any changes in the ownership physical address, structure of the place of business, name and oction of the pharmacy, change of personnel responsible for the management or control of the pharmacy.',0,'',0,1);

															$pdf->MultiCell(11,11,'3.',0,'',0,0);
															$pdf->MultiCell(0,11,'The holder of the certificate of registration shall submit annual returns of no change returns by 31st March of the following finacial Year.',0,'',0,1);
															$pdf->MultiCell(11,11,'4.',0,'',0,0);
															$pdf->MultiCell(0,11,'The certificate of registration is not transferrable without written approval of the Authority.',0,'',0,1);

															$pdf->MultiCell(11,11,'5.',0,'',0,0);
															$pdf->MultiCell(0,11,'Where the certificate of registration is surrendered, the certificate of registration shall be considred cancelled.',0,'',0,1);
															$pdf->MultiCell(11,11,'6.',0,'',0,0);
															$pdf->MultiCell(0,11,'Where the certificate of registration is cancelled, the holder of the certificate shall surrender it to the Authority.',0,'',0,1);

															$pdf->MultiCell(11,11,'7.',0,'',0,0);
															$pdf->MultiCell(0,11,'Non-compliance with the terms and conditions of the certificate of registration shall result in the suspension or cancellation of the certificate',0,'',0,1);
															$pdf->OutPut('Certificate of Registration.pdf');

							}
							else{

							//	Letter of Rejection
							}


				}
				else{

					$res = array('success'=>false, 'message'=>'Premises Application not found, contact system admin');
				}

		}catch (\Exception $exception) {
					$res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

		} catch (\Throwable $throwable) {
					$res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
		}
		return response()->json($res);


}
    public function genenerateImportExportPermit(Request $request)
    {

		$document_type_id = 25;
		$document_requirement_id = 254;

        $application_code = $request->input('application_code');
        $permit_watermark = '';//$request->input('permit_watermark');
        $is_permitupdate = $request->input('is_permitupdate');


		$this->generateImportExportPermit($application_code, $is_permitupdate, 'preview');
		//generateImportExportPermit($application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null)


    }
		function getCertificateSignatoryDetails($pdf){



		}
	function funcDownloadDMSReport($document_path){
		$file = file_get_contents($document_path);

					 return response($file)
					->header('Cache-Control', 'no-cache private')
					->header('Content-Description', 'File Transfer')
					->header('Content-Type', 'application/pdf')
					->header('Content-length', strlen($file))
					->header('Content-Disposition', 'inline; filename=Import/Export Permit.pdf')
					->header('Content-Transfer-Encoding', 'binary');
	}
   public function saveAppCertificateReupdateRequests(Request $req){

            try{
                $module_id = $req->module_id;
                $reference_no = $req->reference_no;
                $requested_by = $req->requested_by;
                $reason = $req->reason;

                $table_name =  getSingleRecordColValue('modules', array('id'=>$module_id), 'table_name');
				if($module_id == 4){
					  $approvaltable_name = "tra_managerpermits_review";
				}
				else{
						 $approvaltable_name = "tra_approval_recommendations";
				}
				 $record = DB::table($table_name.' as t1')
							->join($approvaltable_name.' as t2', 't1.application_code', 't2.application_code')
                            ->select(DB::raw("t1.*, t2.decision_id"))
                            ->where(function($query) use ($reference_no) {
                                $query->where('t1.reference_no', '=', $reference_no)
                                ->orWhere('t1.tracking_no', '=',$reference_no);
                              })
                              ->first();
                if($record){
					$decision_id = $record->decision_id;
					if($decision_id == 1 || $decision_id ==2){
						$application_code = $record->application_code;
						$request = new Request([
									  'application_code'   => $application_code,
									  'is_permitupdate'   => 1
								  ]);

						$this->genenerateImportExportPermit($request);
                        $table_data = array('application_code'=>$application_code,
                                      'reference_no'=>$record->reference_no,
                                      'tracking_no'=>$record->tracking_no,
										'requested_by'=>$req->requested_by,
                                        'reason'=>$req->reason,
                                        'module_id'=>$req->module_id,
                                        'requested_on'=>Carbon::now(),
                                        'created_by'=>$this->user_id,
                                        'created_on'=>Carbon::now(),
                                    );
                        $res = insertRecord('tra_appcertificate_reprintrequests', $table_data, $this->user_id);

					}
					else{
					 $res = array('success'=>false, 'message'=>'Application was rejected, kinldy contact the system admin for clarification.');

					}


                }
                else{
                    $res = array('success'=>false, 'message'=>'Application Not found, confirm the reference number for correctness or check the approval details.');
                }

            } catch (\Exception $exception) {
                $res = array(
                    'success' => false,
                    'message' => $exception->getMessage()
                );
            } catch (\Throwable $throwable) {
                $res = array(
                    'success' => false,
                    'message' => $throwable->getMessage()
                );
            }
            return \response()->json($res);


	}



    public function generateProductRegCertificate(Request $request)
    {
			try{

							$product_id = $request->input('product_id');
							$application_code =$request->application_code;

							if(validateIsNumeric($application_code)){

									//get the section id
									$rec = DB::table('tra_product_information as t1')
									->leftJoin('par_device_types as t2', 't1.device_type_id', '=','t2.id')
									->join('tra_product_applications as t3', 't1.id','t3.product_id')
									->select('t3.section_id','application_code', 't2.description as device_type', 't3.product_id')
									->where(array('t3.application_code'=>$application_code))
									->first();

							}
							else{
									//get the section id
									$rec = DB::table('tra_product_information as t1')
									->leftJoin('par_device_types as t2', 't1.device_type_id', '=','t2.id')
									->select('t3.section_id', 't2.description as device_type', 't1.id as product_id')
									->where(array('t1.id'=>$product_id))
									->first();
							}

							$approvalGrant = DB::table('tra_approval_recommendations as t1')
															->join('tra_product_applications as t2','t1.application_code','t2.application_code')
															->where('t1.application_code', $application_code)
															->select('t2.product_id','t2.module_id', 't1.decision_id','t2.sub_module_id', 't2.reference_no')
															->first();


							if(!empty($approvalGrant) &&  ($approvalGrant->decision_id == 1 || $approvalGrant->decision_id == 2)  ){
												$section_id = $rec->section_id;
												$device_type = $rec->device_type;
												$product_id = $rec->product_id;
												$sub_module_id = $approvalGrant->sub_module_id;
												$reference_no = $approvalGrant->reference_no;


											if($sub_module_id == 17){
												echo "Issue Letter of Withdrawal";
												return;
											}


											$user_id = 0;
											if(isset(\Auth::user()->id)){
												$user_id = \Auth::user()->id;//check if the request comes from a logged in user
											}

											if($sub_module_id == 9 ){
												//return approval letter
													$this->generateAmmendementApprovalletter($application_code, false, '');
											} else{

												if($section_id == 2){
													$pdf =$this->generateProductLetterofApproval($application_code);

													$res=	$this->medicinesProductRegistration($application_code,$request,$pdf );
												}
												else{
													$pdf = $this->generateAlliedSubLetterofApproval($application_code);
													$pdf->Output('Approval Letter.pdf','I');
												}
											}//endif


									}else{
										$module_id = $approvalGrant->module_id;
										$res =$this->generateLetterOfREjection($application_code,$request,$module_id);
									}
					} catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
	public function medicinesProductRegistration($application_code,$req,$pdf ){
		try{
			$document_type_id ='';

						$qry = DB::table('tra_product_applications as t1')
							->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
							->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
							->leftJoin('tra_product_information as t7', 't1.product_id', '=', 't7.id')
							->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
							->leftJoin('par_classifications as t14', 't7.classification_id', '=', 't14.id')
							->select('t1.*', 't3.name as trader_name','t3.postal_address', 't3.physical_address as trader_address','t10.name as region_name' , 't9.name as country_name','t4.name as application_status', 't6.name as dg_recommendation', 't5.decision_id as recommendation_id','t7.gmdn_term as gmdn_name','t7.gmdn_code','t7.physical_description','t7.shelf_life',
								't1.id as active_application_id', 't7.brand_name as brandName', 't8.name as common_names', 't14.name as classification','t5.expiry_date','t11.name as localAgentName','t11.physical_address as local_agent_address', 't5.certificate_no','t5.permit_signatory as approved_by','t5.permit_signatory', 't5.approval_date', 't13.name as manufacturer','t5.certificate_issue_date', 't16.name as distribution_category', 't17.name as dosage_form'
								)

							->leftJoin('tra_approval_recommendations as t5', 't1.application_code', '=', 't5.application_code')
							->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
							->leftJoin('par_regions as t10', 't3.region_id', '=', 't8.id')
							->leftJoin('par_countries as t9', 't3.country_id', '=', 't9.id')
							->leftJoin('wb_trader_account as t11', 't1.local_agent_id', '=', 't11.id')
							->leftJoin('tra_product_manufacturers as t12', 't1.product_id', '=', 't12.product_id')
							->leftJoin('tra_manufacturers_information as t13', 't12.manufacturer_id', '=', 't13.id')
							->leftJoin('par_distribution_categories as t16', 't7.propdistribution_category_id', '=', 't16.id')
							->leftJoin('par_dosage_forms as t17', 't7.dosage_form_id', '=', 't17.id')

							->where(array('t1.application_code' => $application_code));


						$record = $qry->first();

						$is_provisional =0;

						if($record){
							if($record->recommendation_id == 2){
								$is_provisional =1;
							}
							$org_info = $this->getOrganisationInfo();
							$data = array('user_id'=>'',
									'application_id'=>$record->id,
									'application_code'=>$application_code,
									'reference_no'=>$record->reference_no,
									'table_name'=>'tra_product_applications',
									'application_type'=>$record->module_id,
									'document_type'=>$document_type_id,
									'section_id'=>$record->section_id,
									'printed_on'=>Carbon::now(),
									'printed_by'=>''
								);
								funcReportGenerationLog($data,'');

										//$pdf = new PdfProvider();
										// add a page
										$pdf->AddPage();
										$pdf->SetLineWidth(0.4);
										$pdf->Rect(3,3,204,290);
										$pdf->SetLineWidth(1.2);
										$pdf->Rect(5,5,200,285);
										$pdf->SetLineWidth(0.4);
										$pdf->Rect(7,7,195,280);
										$pdf->setMargins(25,25,25,true);
										$template_url = base_path('/');
										$pdf->setSourceFile($template_url."resources/templates/ma_certificate.pdf");
										// import page 1
										$tplId = $pdf->importPage(1);
										$style = array(
											'border' => 0,
											'vpadding' => 'auto',
											'hpadding' => 'auto',
											'fgcolor' => array(0,0,0),
											'bgcolor' => false, //array(255,255,255)
											'module_width' => 1, // width of a single module in points
											'module_height' => 1 // height of a single module in points
									);

										// use the imported page and place it at point 10,10 with a width of 100 mm
										$pdf->useTemplate($tplId,0,0);
										$pdf->setPageMark();
										$pdf->SetFont('times','I',9);
									$pdf->write2DBarcode(strtoupper($record->trader_name).':'.$record->application_code.':'.$record->certificate_no, 'QRCODE,H',170, 35, 60, 60, $style, 'N');
										$logo = getcwd() . '/resources/images/zamra-logo.png';
										$pdf->ln();
									//	$pdf->Image($logo,90,25,45,40);

										$pdf->Cell(0,30,'',0,1);

										$pdf->SetFont('times','B',15);

										$pdf->ln();
										$pdf->SetFont('times','B',11);

										$pdf->SetFont('times','',11);
										$pdf->Cell(0,8,'Market Authorisation No: '.$record->certificate_no, 0,1,'R');


										$pdf->ln();
										$pdf->SetFont('times','B',11);
										$pdf->MultiCell(45,8,'Name of Medicine:',0,'',0,0);
										$pdf->SetFont('times','',11);
										$pdf->MultiCell(0,8,($record->brandName),0,'',0,1);
										$pdf->SetFont('times','B',11);
										$pdf->MultiCell(45,8,'Dosage form:',0,'',0,0);
										$pdf->SetFont('times','',11);
										$pdf->MultiCell(0,8,($record->dosage_form),0,'',0,1);
										$packaging = '';
										$container_name = '';
										$retail_packaging_size = '';

							$packaging_data = DB::table('tra_product_packaging as t1')
										->select(DB::raw("t1.*, t2.name as container_type, t3.name as container_name, t4.name as container_material, t5.name as closure_materials, t4.name as container_material, t5.name as closure_material, t6.name as seal_type, t7.name as packaging_unit, retail_packaging_size as retail_packaging"))
										->leftJoin('par_containers_types as t2', 't1.container_type_id', '=', 't2.id')
										->leftJoin('par_containers as t3', 't1.container_id', '=', 't3.id')
										->leftJoin('par_containers_materials as t4', 't1.container_material_id', '=', 't4.id')
										->leftJoin('par_closure_materials as t5', 't1.closure_material_id', '=', 't5.id')
										->leftJoin('par_seal_types as t6', 't1.seal_type_id', '=', 't6.id')
										->leftJoin('par_packaging_units as t7', 't1.packaging_units_id', '=', 't7.id')
										->where(array('t1.product_id' => $record->product_id))
										->get();

									if($packaging_data){
									$i = 1;
										foreach($packaging_data as $packaging_rec){
											$packaging_full_description = '';
											if($packaging_rec->packaging_full_description != ''){
												$packaging_full_description = '('.$packaging_rec->packaging_full_description.')';
											}
												$container_name = $packaging_rec->container_name. ' '.$packaging_full_description;

												$retail_packaging_size .=' '. $packaging_rec->retail_packaging. ' '.$packaging_rec->packaging_unit;


										}


									}
									$pdf->SetFont('times','b',11);
									$pdf->MultiCell(45,8,'Package:',0,'',0,0);
									$pdf->SetFont('times','',11);
									$pdf->MultiCell(0,8,($container_name),0,'',0,1);
									$pdf->SetFont('times','b',11);
									$pdf->MultiCell(60,8,'Pack size(s):',0,'',0,0);
									$pdf->MultiCell(60,8,'Shelf Life(Months)',0,'',0,0);
									$pdf->MultiCell(60,8,'Category of distribution',0,'',0,1);
									$pdf->SetFont('times','',11);
									$pdf->MultiCell(60,10,$retail_packaging_size,0,'',0,0);
									$pdf->MultiCell(60,10,$record->shelf_life,0,'',0,0);
									$pdf->MultiCell(60,10,$record->distribution_category,0,'',0,1);


								 $ingred_rows = DB::table('tra_product_ingredients as t1')
									->select('t1.*', 't6.name as reason_for_inclusion', 't2.name as ingredient_specification', 't3.name as si_unit', 't4.name as ingredient_name', 't5.name as ingredient_type')
									->leftJoin('par_specification_types as t2', 't1.specification_type_id', '=', 't2.id')
									->leftJoin('par_si_units as t3', 't1.ingredientssi_unit_id', '=', 't3.id')
									->leftJoin('par_ingredients_details as t4', 't1.ingredient_id', '=', 't4.id')
									->leftJoin('par_ingredients_types as t5', 't1.ingredient_type_id', '=', 't5.id')
									->leftJoin('par_inclusions_reasons as t6', 't1.inclusion_reason_id', '=', 't6.id')
									->where(array('t1.product_id' => $record->product_id, 'is_active_reason'=>1))
									->get();
	$pdf->SetFont('times','b',11);
									$pdf->MultiCell(60,8,'Name of active ingredient(s)',0,'',0,0);
									$pdf->MultiCell(60,8,'Quality standards',0,'',0,0);
									$pdf->MultiCell(60,8,'Strength',0,'',0,1);
										$pdf->SetFont('times','',11);
								if($ingred_rows){
									$pdf->SetFont('times','',11);
									foreach($ingred_rows as $ingred_row){

										$ingr_name=$ingred_row->ingredient_name;
										$strength=$ingred_row->strength;
										$ingredient_specification=$ingred_row->ingredient_specification;

										$pdf->MultiCell(60,8,($ingr_name),0,'',0,0);
										$pdf->MultiCell(60,8,$ingredient_specification,0,'',0,0);
										$pdf->MultiCell(60,8,($strength).' '.strtoupper($ingred_row->si_unit),0,'',0,1);

									}

								}else{

									$pdf->MultiCell(60,8,'',0,'',0,0);
									$pdf->MultiCell(60,8,'',0,'',0,0);
									$pdf->MultiCell(60,8,'',0,'',0,1);
								}
								$ma_address = '';
								if($record->trader_address != ''){

											$ma_address = $record->trader_address.', ';
																		}
																		if(($record->trader_address !=  $record->postal_address)){
																			$ma_address .= $record->postal_address;
																		}
								$trader_name = '<b>Name and address of holder of marketing authorisaton </b>'.$record->trader_name. ', '.$ma_address.', '.$record->region_name.', '.$record->country_name;

								$pdf->WriteHTML($trader_name  , true, 0, true, true,'');
								$pdf->ln();
								$pdf->SetFont('times','B',11);
								$pdf->Cell(45,8,'Valid  Until:',0,0,'L');
								$pdf->SetFont('times','B',11);
								$pdf->Cell(0,8,ucwords(date('F d, Y ',strtotime($record->expiry_date))),0,1,'L'); $pdf->ln();
								$pdf->SetFont('times','',12);
								$pdf->MultiCell(0,12,'The terms and conditions of the Marketing authorisaton are attached herewith:',0,'',0,1);
								$pdf->SetFont('times','B',11);
								$pdf->ln();
								$startY = $pdf->GetY();
								$startX =$pdf->GetX();


								$director_details = getPermitSignatoryDetails();
										$dg_signatory = $director_details->director_id;
										$director = $director_details->director;
										$is_acting_director = $director_details->is_acting_director;

										$approved_by = $record->permit_signatory;

										if($dg_signatory != $approved_by){
											$signatory = $approved_by;
										}
										else{
											$signatory = $dg_signatory;
										}
										//permit_approval
										$signature = getUserSignatureDetails($signatory);

										$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
										$pdf->Image($signature,$startX+60,$startY-8,30,12);

										 $pdf->Cell(0,8,'...............................................................', 0,1,'C');

										$title = "Director-General";
										if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
										}else{
											if($is_acting_director ==1){
												$title = 'Acting '.$title;
											}

										}
										$pdf->Cell(0,8,'SIGNATURE', 0,1,'C');
										 $pdf->Cell(0,8,$title, 0,0,'C');

										 $pdf->AddPage();

										$pdf->setMargins(18,25,18,true);
										 $pdf->Cell(100,5,'TERMS AND CONDITIONS OF THE MARKETING AUTHORISATION.', 0,1,'');
										 $pdf->Cell(100,5,'The holder of a marketing authorisation shall—', 0,1,'');
										 //get the conditions
										 $pdf->SetFont('times','',11);
										 $pdf->MultiCell(0,7,'(a) ensure that the medicine',0,'',0,1);
										$pdf->Cell(10,7,'',0,0);  $pdf->MultiCell(0,7,'(i) is manufactured incompliance with the current Good Manufacturing Practices (cGMP) as recommended by the World Health Organisation (WHO) or any other recognised entity; ',0,'',0,1);
										 $pdf->Cell(10,7,'',0,0); $pdf->MultiCell(0,7,'(ii) conforms with the quality standards, safety and efficacy and issuitable for the purpose for which it is intended; ',0,'',0,1);
										$pdf->Cell(10,7,'',0,0);  $pdf->MultiCell(0,7,'(iii) conforms to the summary of product characteristics;  ',0,'',0,1);

 										$pdf->MultiCell(0,7,'(b) ensure compliance with good distribution practices and that the medicine is supplied in accordance with the requirements applicable to the categories of distribution specified on this marketing authorisation and with regulations on labeling of medicine;   ',0,'',0,1);
 										$pdf->MultiCell(0,7,'(c) maintain an appropriate pharmacovigilance system for monitoring, detecting and reporting adverse drug reactions and the performance of products granted marketing authorisation; ',0,'',0,1);
 										$pdf->MultiCell(0,7,'(d) pay to the Authority the annual retention fees,sample analysis fees and other fees as prescribed; ',0,'',0,1);
 										$pdf->MultiCell(0,7,'(e) ensure that the marketing authorisation is not transferred without the written approval of the Authority ',0,'',0,1);
 										$pdf->MultiCell(0,7,'(f) for a foreign-based holder of marketing authorisation, appoint a local responsible person; ',0,'',0,1);
 										$pdf->MultiCell(0,7,'(g) notify the Authority of any change that requires an amendment to a marketing authorisation; ; ',0,'',0,1);
 										$pdf->MultiCell(0,7,'(h) when necessary or as directed by the Authority, withdraw any product from the market that is injurious to,or is likely to be injurious to public health; and ',0,'',0,1);
 										$pdf->Cell(10,7,'',0,0);$pdf->MultiCell(0,7,'(i) provide additional information or product sample when required to dosoby the Authority for purposes of the Act.',0,'',0,1);
 										$pdf->Cell(10,7,'',0,0);$pdf->MultiCell(0,7,'(i) provide additional information or product sample when required to do so by the Authority for purposes of the Act.',0,'',0,1);

										$pdf->Cell(0,5,'NOTE:', 0,1,'');

										$pdf->MultiCell(0,7,'Non-compliance with any of the terms or conditions of a marketing authorisation will result in suspension or revocation of the marketing authorisation.',0,'',0,1);

								$pdf->Output('Marketing Authorisation Certificate '.$record->trader_name.'.pdf');
						}




		} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}

        return response()->json($res);


	}
	public function generateAlliedSubLetterofApproval($application_code){
		try{
			$org_info = $this->getOrganisationInfo();

        $qry = DB::table('tra_product_applications as t1')
                ->join('tra_product_information as t2','t1.product_id','=','t2.id')
                ->leftJoin('tra_product_ingredients as t2a','t2.id','=','t2a.product_id')
                ->leftJoin('par_ingredients_details as t2b','t2a.ingredient_id','=','t2b.id')
                ->leftJoin('par_si_units as t2d','t2a.ingredientssi_unit_id','=','t2d.id')
                ->leftJoin('par_dosage_forms as t2c','t2.dosage_form_id','=','t2c.id') //dosage_form_id par_dosage_forms
                ->leftJoin('par_distribution_categories as t3c','t2.propdistribution_category_id','=','t3c.id') //dosage_form_id par_dosage_forms
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id','t3.id')
                ->leftJoin('par_countries as t3a', 't3.country_id','t3a.id')
                ->leftJoin('par_countries as t4a', 't3.region_id','t4a.id')
                ->join('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
                ->leftJoin('par_prodclass_categories as t9', 't2.prodclass_category_id','t9.id')
                ->leftJoin('par_classifications as t10', 't2.classification_id','t10.id')
                ->leftJoin('par_device_types as t11', 't2.device_type_id','t11.id')
                ->select('t1.application_code','t3c.name as distribution_category','t9.product_category_title', 't10.name as classification_name', 't2.prodclass_category_id', 't1.*', 't1.reference_no' , 't11.name as device_type',
                            DB::raw("GROUP_CONCAT(CONCAT(t2b.name,' ' ,t2a.strength, ' ', t2d.name) SEPARATOR ' + ') as common_name"),'t3.postal_address',
                            't2.brand_name','t3.name as applicant_name', 't3.physical_address', 't3a.name as country_name', 't3.email as applicant_email','t4.permit_signatory as approved_by', 't4.certificate_no','t4a.name as region_name',
                            't4.approval_date','t2c.name as dosage_form')
                ->where('t1.application_code', $application_code)
                ->groupBy('t2.id');
         $app_details = $qry->first();
         if (is_null($app_details)) {
              $res = 'The Reference provided does not match any record or Not yet approved!!';
              return $res;
          }
		  if($app_details ->prodclass_category_id ==3){
			  $retention_fee = '200.00';
			  $title = "APPLICATION FOR GRANT OF MARKETING AUTHORISATION FOR MEDICAL DEVICES";
			  $product_title = 'Medical Devices';
		  }
		  else{
			   $retention_fee = '200.00';
			  $title = "APPLICATION FOR GRANT OF MARKETING AUTHORISATION FOR AN ALLIED SUBSTANCE";
			   $product_title = 'Allied Substance';
		  }
		  if($app_details->sub_module_id == 7){
			  $title_desc = "your application for grant marketing authorization";
		  }
		  else{
			  $title_desc = "your application for renewal of marketing authorization";
		  }
          //application_no

			$org_info = $this->getOrganisationInfo();
			$pdf = new PdfLettersProvider();
			$pdf->AddPage();
			$template_url = base_path('/');
			$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
			$tplId = $pdf->importPage(1);
			$pdf->useTemplate($tplId,0,0);
			$pdf->setPageMark();

			$pdf->SetFont('times','B',9);
			$pdf->Cell(0,1,'',0,1);

			//$pdf->Cell(0,4,'FORM II',0,1,'R');
			//$pdf->Cell(0,4,'(Regulation 3)',0,1,'R');
			$pdf->SetFont('times','B',13);
			$pdf->Cell(0,23,'',0,1);

			$pdf->Cell(0,7,$org_info->org_name,0,1,'C');
			$pdf->Cell(0,7,'The Medicines and Allied Substances Act, 2013',0,1,'C');

			$pdf->SetFont('times','B',12);
			$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
			$application_no = 	$app_details->reference_no;
			$prodclass_category_id = 	$app_details->prodclass_category_id;
			$product_category_title = 	$app_details->product_category_title;
			$classification_name = 	$app_details->classification_name;
			$section_id = 	$app_details->section_id;


			$data = '{"tracking_no":'.$app_details->reference_no.',"module_id":'.$app_details->module_id.',"application_code":'.$app_details->application_code.'}';

			$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
																	// QRCODE,H : QR-CODE Best error correction name
			$pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);
			$pdf->SetFont('times','',12);

													//Letter heading
			$pdf->Cell(0,8,'To:',0,1);
			$pdf->Cell(0,8,$app_details->applicant_name.',',0,1);
			if($app_details->physical_address != ''){
				$pdf->Cell(0,8,$app_details->physical_address.',',0,1);

			}
			if($app_details->physical_address !=  $app_details->postal_address){

					$pdf->Cell(0,8,$app_details->postal_address.',',0,1);
			}
			$pdf->Cell(0,8,$app_details->region_name." ".$app_details->country_name,0,1);


			$pdf->SetFont('times','',11);
			$pdf->Cell(0,8,'Dear Sir/Madam,',0,1);

			$pdf->Cell(0,8,$title,0,1);
			$template = "Reference is made to ".$title_desc." for a ".$product_title.", you submitted in line with Section 39 of the Medicines and Allied Substances Act (No. 3) of 2013.";
			$pdf->WriteHTML($template, true, false, true, true, 'J');
			$pdf->ln();
			$pdf->SetFont('times','',11);
			$template = "We wish to advise that we have completed our evaluation of your application and are pleased to inform you that the Zambia Medicines Regulatory Authority considered your product application and, based on the submitted information, <b>granted approval for listing </b>of the product indicated below with the marketing authorisation number and category of distribution as indicated below.\n";

						$pdf->WriteHTML($template, true, false, true, true, 'J');$pdf->ln();
						$pdf->SetFont('times','B',11);

						$pdf->cell(10,7, 'No.', 1,0);
						$pdf->cell(45,7, 'Name of Product.', 1,0);
						$pdf->cell(45,7, 'Application No.', 1,0);

						$pdf->cell(45,7, $product_category_title, 1,0);
						$pdf->cell(0,7, 'MA No.', 1,1);
						$pdf->SetFont('times','',11);


						$brand_name = $app_details->brand_name;


						if($prodclass_category_id == 3 or $prodclass_category_id == 5){
							$classification_name = $app_details->classification_name;
							$brand_name .= '('.$app_details->device_type.')';
							//$pdf->MultiCell(45,12,$app_details->classification_name,1,'','',0);
						}
						else{

							$classification_name = $app_details->distribution_category;

						}
						$rowcount = max(PDF::getNumLines($brand_name, 43),PDF::getNumLines($application_no, 43),PDF::getNumLines($classification_name, 45));


						$pdf->MultiCell(10,6*$rowcount,'1',1,'','',0);
						$pdf->MultiCell(45,6*$rowcount,$brand_name,1,'','',0);
						$pdf->MultiCell(45,6*$rowcount,$application_no,1,'','',0);
						$pdf->MultiCell(45,6*$rowcount,$classification_name,1,'','',0);
						$pdf->MultiCell(0,6*$rowcount,$app_details->certificate_no,1,'','',1);

						/*$pdf->cell(0,7, $app_details->certificate_no, 1,1);
						$pdf->cell(45,7, $app_details->brand_name, 1,0);
						$pdf->cell(45,7,$application_no, 1,0);
						$pdf->cell(45,7, $app_details->distribution_category, 1,0);
						$pdf->cell(0,7, $app_details->certificate_no, 1,1);
					*/
						$pdf->SetFont('times','',11);
					$pdf->cell(0,7, 'Abbreviations:', 0,1);
						if($prodclass_category_id == 3 or $prodclass_category_id == 5){

						$pdf->cell(0,7, 'MA No. - Marketing Authorisation Number', 0,1);


						}
						else{

						$pdf->cell(0,7, 'CoD - Category of Distribution', 0,1);
						$pdf->cell(0,7, 'MA No. - Marketing Authorisation Number', 0,1);


						}

						$pdf->cell(0,8, 'Please note that approval is granted subject to the following conditions: ', 0,1);
						$retention_year =(date('Y')+1);
						$template = "1. The Marketing Authorisations for the above products are valid for Five (5) years from the date of this letter and shall be subject to renewal if the conditions are met; \n";
						$pdf->WriteHTML($template, true, false, true, true, 'J');
						$pdf->ln();
						$template = "2.	You are required to maintain an appropriate pharmacovigilance system for monitoring, detecting and reporting adverse reactions and the performance for the above products;";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$template = "3.	You should ensure that the Marketing Authorisation(s) are not transferred without written approval of the Authority; ";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$template = "4.	You should at all times have a Local Responsible Person with Power of Attorney who shall be responsible for the products on the market; ";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$template = "5.	You are obliged to notify the Authority of any change(s) or amendments that affect the products; ";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$template = "6.	Whenever required you will be expected to comply to compulsory amendment(s); ";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$template = "7.	When necessary or so directed by the Authority you will be required to withdraw any product(s) or particular problem batch(es) from the market and;  ";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$template = "8.	You should provide additional information or samples, when required to do so by the Authority.";
						$pdf->WriteHTML($template, true, false, true, true, 'J');


						$retention_year = date('Y',strtotime($app_details->approval_date));

						$due_retention_year = $retention_year+1;

						$pdf->ln();$pdf->AddPage();
						$template = "In addition, your attention is drawn to the requirements of Statutory Instrument No. 38 of 2016 on product retention fees for Allied Substances to be imported into Zambia. You are therefore requested to pay annual retention fees of USD 200.00 for the listed products effective 1st October ".$retention_year.". Please note that retention fees for the year ".$due_retention_year." should be paid in the last quarter of ".$retention_year.". The amount due may be paid into one of the following bank accounts:\n";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						//bank details
						$pdf->SetFont('times','B',11);

						$pdf->cell(43,7, 'Name of Account holder:', 0,0);
						$pdf->SetFont('times','',11);
						$pdf->cell(0,7, 'Zambia Medicines Regulatory Authority', 0,1);

						$pdf->SetFont('times','B',11);


						$pdf->cell(43,7, 'Name of Bank: ', 0,0);
						$pdf->SetFont('times','',11);
						$pdf->cell(0,7, 'Standard Chartered Bank, North-End Branch, Cairo Road, Lusaka, Zambia', 0,1);
							$pdf->SetFont('times','B',11);
						$pdf->cell(43,7, 'ZMK Bank Account No. ', 0,0);
						$pdf->SetFont('times','',11);
						$pdf->cell(0,7, '0100122033800', 0,1);
						$pdf->SetFont('times','B',11);
						$pdf->cell(43,7, 'US Dollar Account No.', 0,0);
						$pdf->SetFont('times','',11);
						$pdf->cell(0,7, '8700211468100', 0,1);
						$pdf->ln();
						if($prodclass_category_id == 3 or $prodclass_category_id == 5){
							$template = "Please note that listing of the above products does not imply final approval as all products are subject to review at a later date.";
							$pdf->WriteHTML($template, true, false, true, true, 'J');

							$template = "You are therefore advised to put in place an appropriate vigilance system for monitoring, detecting and reporting adverse events and the performance of the listed products in general.";
							$pdf->WriteHTML($template, true, false, true, true, 'J');
						}
						$template = "We wish to remind you that you must comply with labeling requirements by ensuring that products including labels and packaging materials have sufficient labeling information including among others; category of distribution, specific storage conditions, marketing authorisation number and physical address of the manufacturing site.";
						$pdf->WriteHTML($template, true, false, true, true, 'J');

						$pdf->Cell(0,8,'Should you have any questions, please do not hesitate to contact our secretariat.',0,1);
						$pdf->Cell(0,8,'Yours faithfully,',0,1);


																	$pdf->Cell(0,8,'for/Zambia Medicines Regulatory Authority,',0,1);

																	$pdf->ln();
																	$pdf->ln();

																	$startY = $pdf->GetY();
																	$startX =$pdf->GetX();
																	$director_details = getPermitSignatoryDetails();
																	$dg_signatory = $director_details->director_id;
																	$director = $director_details->director;
																	$is_acting_director = $director_details->is_acting_director;

																	$approved_by = $app_details->approved_by;
																	if($dg_signatory != $approved_by){
																		$signatory = $approved_by;
																	}
																	else{
																		$signatory = $dg_signatory;
																	}

																	$signatory = $dg_signatory;
																	$signature = getUserSignatureDetails($signatory);
								$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
								$pdf->Image($signature,$startX+1,$startY-8,30,12);

										 $pdf->Cell(0,8,'...............................................................', 0,1,'');

										$title = "Director-General";
										if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
										}else{
											if($is_acting_director ==1){
												$title = 'Acting '.$title;
											}

										}
										$pdf->Cell(0,8,'SIGNATURE', 0,1,'');
										 $pdf->Cell(0,8,$title, 0,0,'');

						//$pdf->Output('Approval Letter.pdf','I');
							return $pdf;
						//	PDF::Reset();



		} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}
			print_r($res);
			exit();
        return response()->json($res);


	}
	public function generateProductLetterofApproval($application_code){
		try{
			$org_info = $this->getOrganisationInfo();

        $qry = DB::table('tra_product_applications as t1')
                ->join('tra_product_information as t2','t1.product_id','=','t2.id')
                ->leftJoin('tra_product_ingredients as t2a','t2.id','=','t2a.product_id')
                ->leftJoin('par_ingredients_details as t2b','t2a.ingredient_id','=','t2b.id')
                ->leftJoin('par_si_units as t2d','t2a.ingredientssi_unit_id','=','t2d.id')
                ->leftJoin('par_dosage_forms as t2c','t2.dosage_form_id','=','t2c.id') //dosage_form_id par_dosage_forms
                ->leftJoin('par_distribution_categories as t3c','t2.propdistribution_category_id','=','t3c.id') //dosage_form_id par_dosage_forms
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id','t3.id')
                ->leftJoin('par_countries as t3a', 't3.country_id','t3a.id')
                ->leftJoin('par_countries as t4a', 't3.region_id','t4a.id')
                ->join('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
                ->leftJoin('par_prodclass_categories as t9', 't2.prodclass_category_id','t9.id')
                ->leftJoin('par_classifications as t10', 't2.classification_id','t10.id')
                ->select('t1.application_code','t3c.name as distribution_category','t9.product_category_title', 't10.name as classification_name', 't2.prodclass_category_id', 't1.*', 't1.reference_no' ,
                            DB::raw("GROUP_CONCAT(CONCAT(t2b.name,' ' ,t2a.strength, ' ', t2d.name) SEPARATOR ' + ') as common_name"),'t3.postal_address',
                            't2.brand_name','t3.name as applicant_name', 't3.physical_address', 't3a.name as country_name', 't3.email as applicant_email','t4.permit_signatory as approved_by', 't4.certificate_no','t4a.name as region_name',
                            't4.approval_date','t2c.name as dosage_form')
                ->where('t1.application_code', $application_code)
                ->groupBy('t2.id');
         $app_details = $qry->first();
         if (is_null($app_details)) {
              $res = 'The Reference provided does not match any record or Not yet approved!!';
              return $res;
          }
		  if($app_details ->section_id ==2){
			  $retention_fee = '800.00';
			  $title = "APPLICATION FOR GRANT OF MARKETING AUTHORISATION FOR PHARMACEUTICAL PRODUCT";
		  }
		  else{
			   $retention_fee = '200.00';
			  $title = "APPLICATION FOR GRANT OF MARKETING AUTHORISATION FOR ALLIED SUBSTANCE";
		  }
		  if($app_details->sub_module_id == 7){
			  $title_desc = "your application for marketing authorization";
		  }
		  else{
			  $title_desc = "your application for renewal of marketing authorization";
		  }
          //application_no

			$org_info = $this->getOrganisationInfo();
			$pdf = new PdfLettersProvider();
			$pdf->AddPage();
			$template_url = base_path('/');
			$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
			$tplId = $pdf->importPage(1);
			$pdf->useTemplate($tplId,0,0);
			$pdf->setPageMark();

			$pdf->SetFont('times','B',9);
			$pdf->Cell(0,1,'',0,1);

			$pdf->Cell(0,4,'',0,1,'R');
			$pdf->Cell(0,4,'',0,1,'R');

			$pdf->SetFont('times','B',13);
			$pdf->Cell(0,15,'',0,1);
			$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
			$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

			$pdf->SetFont('times','B',12);
			$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
			$application_no = 	$app_details->reference_no;
			$prodclass_category_id = 	$app_details->prodclass_category_id;
			$product_category_title = 	$app_details->product_category_title;
			$classification_name = 	$app_details->classification_name;
			$section_id = 	$app_details->section_id;


			$data = '{"tracking_no":'.$app_details->reference_no.',"module_id":'.$app_details->module_id.',"application_code":'.$app_details->application_code.'}';

			$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
																	// QRCODE,H : QR-CODE Best error correction name
			$pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);
			$pdf->SetFont('times','',12);
																	//Letter heading
			$pdf->Cell(0,8,'To:',0,1);
			$pdf->Cell(0,8,$app_details->applicant_name.',',0,1);
			if($app_details->physical_address != ''){
				$pdf->Cell(0,8,$app_details->physical_address.',',0,1);

			}
			if($app_details->physical_address !=  $app_details->postal_address){

					$pdf->Cell(0,8,$app_details->postal_address.',',0,1);
			}
			$pdf->Cell(0,8,$app_details->region_name." ".$app_details->country_name,0,1);

			$pdf->Cell(0,8,'Dear Sir/Madam,',0,1);

			$pdf->SetFont('times','',11);

			$pdf->Cell(0,8,$title,0,1);

			$template = "Reference is made to ".$title_desc." for a pharmaceutical product you submitted in terms of Section 39 of the Medicines and Allied Substances Act (No. 3) of 2013.";
						$pdf->WriteHTML($template, true, false, true, true, 'J');
						$pdf->ln();
							$pdf->SetFont('times','',11);
							$template = "We wish to advise that we have completed our review of the information and are pleased to inform you that the Zambia Medicines Regulatory Authority considered your product application and the corresponding evaluation reports and, based on the submitted information, <b>granted marketing authorisation</b> to the products below with the marketing authorisation numbers and category of distribution as indicated below.\n";


						$pdf->WriteHTML($template, true, false, true, true, 'J');$pdf->ln();
						$pdf->SetFont('times','B',11);

						$pdf->cell(10,5, 'No.', 1,0);
						$pdf->cell(52,5, 'Name of Product.', 1,0);
						$pdf->cell(45,5, 'Application No.', 1,0);

						$pdf->cell(45,5, $product_category_title, 1,0);
						$pdf->cell(0,5, 'Ma No..', 1,1);
						$pdf->SetFont('times','',11);


						$brand_name = $app_details->brand_name;


						if($prodclass_category_id == 3 or $prodclass_category_id == 5){
							$classification_name = $app_details->classification_name;

							//$pdf->MultiCell(45,12,$app_details->classification_name,1,'','',0);
						}
						else{

							$classification_name = $app_details->distribution_category;

						}
						$rowcount = max(PDF::getNumLines($brand_name, 50),PDF::getNumLines($application_no, 43),PDF::getNumLines($classification_name, 45));


						$pdf->MultiCell(10,5*$rowcount,'1',1,'','',0);
						$pdf->MultiCell(52,5*$rowcount,$brand_name,1,'','',0);
						$pdf->MultiCell(45,5*$rowcount,$application_no,1,'','',0);
						$pdf->MultiCell(45,5*$rowcount,$classification_name,1,'','',0);
						$pdf->MultiCell(0,5*$rowcount,$app_details->certificate_no,1,'','',1);

						/*$pdf->cell(0,7, $app_details->certificate_no, 1,1);
						$pdf->cell(45,7, $app_details->brand_name, 1,0);
						$pdf->cell(45,7,$application_no, 1,0);
						$pdf->cell(45,7, $app_details->distribution_category, 1,0);
						$pdf->cell(0,7, $app_details->certificate_no, 1,1);
					*/
						$pdf->SetFont('times','',11);

						$pdf->cell(0,4, 'Abbreviations:', 0,1);
						$pdf->cell(0,4, 'CoD - Category of Distribution', 0,1);
						$pdf->cell(0,4, 'Ma No. - Marketing Authorisation Number', 0,1);


						$pdf->cell(0,4, 'Please find attached the respective marketing authorisation with conditions', 0,1);

						$retention_year = date('Y',strtotime($app_details->approval_date));

						$nextretention_year =($retention_year+1);
						$template = "Your attention is drawn to the requirement of Statutory Instruments No. 38 of 2016 on product retention fees for pharmaceutical products to be imported into Zambia. You are therefore requested to pay annual retention fees of USD ".$retention_fee." effective 1st October ".$retention_year.". Please note that retention fees for the year $nextretention_year should be paid in the last quarter of $retention_year.\n";
						$pdf->WriteHTML($template, true, false, true, true, 'J');
						$pdf->ln();
						$template = "Please note that registration of the above products does not imply final approval as all products are subject to review at a later date.";
						$pdf->WriteHTML($template, true, false, true, true, 'J');
						$pdf->ln();
						$template = "We wish to remind ou that you must comply with labelling requirements as prescribed in the Statutory Instruments No 79 of 2019 by ensuring that products including labels and packaging materials have sufficient labelling information including among others, category of distribution, specific storage conditions, marketing authorisation number and physical address of the manufacturing site.\n";
						$pdf->WriteHTML($template, true, false, true, true, 'J');


						$pdf->ln();
						$pdf->Cell(0,4,'Should you have any questions, please do not hesitate to contact our secretariat.',0,1);
						$pdf->Cell(0,4,'Yours faithfully,',0,1);


																	$pdf->Cell(0,4,'for/Zambia Medicines Regulatory Authority,',0,1);

																	$pdf->ln();
																	$pdf->ln();

																	$startY = $pdf->GetY();
																	$startX =$pdf->GetX();
																	$director_details = getPermitSignatoryDetails();
																	$dg_signatory = $director_details->director_id;
																	$director = $director_details->director;
																	$is_acting_director = $director_details->is_acting_director;

																	$approved_by = $app_details->approved_by;
																	if($dg_signatory != $approved_by){
																		$signatory = $approved_by;
																	}
																	else{
																		$signatory = $dg_signatory;
																	}

																	$signatory = $dg_signatory;
																	$signature = getUserSignatureDetails($signatory);
								$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
								$pdf->Image($signature,$startX+1,$startY-8,30,12);

										 $pdf->Cell(0,4,'...............................................................', 0,1,'');

										$title = "Director-General";
										if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
										}else{
											if($is_acting_director ==1){
												$title = 'Acting '.$title;
											}

										}
										$pdf->Cell(0,8,'SIGNATURE', 0,1,'');
										 $pdf->Cell(0,5,$title, 0,0,'');

						//$pdf->Output('Approval Letter.pdf','I');
							return $pdf;
						//	PDF::Reset();



		} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}
			//print_r($res);
			//exit();
        return response()->json($res);

	}
     public function generateGMPCertificate(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $section_id = $request->input('section_id');

		if(validateIsNumeric($application_code)){

            //get the section id
            $rec = DB::table('tra_gmp_applications as t1')
            ->select('t1.*')
            ->where(array('t1.application_code'=>$application_code))
            ->first();
			$application_id = $rec->id;
			$section_id = $rec->section_id;
        }
        $approvalGrant = DB::table('tra_approval_recommendations as t2')
                        ->where('t2.application_id',$application_id)
                        ->first();
        if(!empty($approvalGrant) && $approvalGrant->decision_id == 1){
    		/* $details = $this->getGMPProductLineTableDetails($section_id);
             if($section_id == 4){

                $title = 'CERTIFICATE OF COMPLIANCE TO QUALITY AUDIT';
            }
            else{
                $title = 'CERTIFICATE OF COMPLIANCE TO GOOD MANUFACTURING PRACTICES (GMP)';
            }
            //PDF::Cell(0,4,'(For Medical Devices and Diagnostics Manufacturing Facilities)',0,1,'C');"repo:gmp_subReport.jrxml"
            $params = array(
                'application_id' => $application_id,
                'certificate_name' => $title,
                'document_type' => 'certificate',
                'col1_name' => $details->col1_name,
                'col2_name' => $details->col2_name,
                'col3_name' => $details->col3_name,
                'base_Url' => $this->base_url,
                'sign_Url' => $this->sign_url,
                'Authority' => 'Tanzania Medicines & Medical Devices Authority'
            );
            $report = generateJasperReport('gmpCertificateReport', 'permit_' . time(), 'pdf', $params);
						return $report;
						*/
					$record =  $qry = DB::table('tra_gmp_applications as t1')
													->join('tra_manufacturing_sites as t2', 't1.manufacturing_site_id', '=', 't2.id')
													->join('par_countries as t3', 't2.country_id','t3.id')
													->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
													->leftJoin('par_districts as t5','t2.district_id', 't5.id')
													->join('wb_trader_account as t6', 't1.applicant_id','t6.id')
													->leftJoin('par_regions as t7', 't6.region_id', 't7.id')
													->leftJoin('par_districts as t8','t6.district_id', 't8.id')
													->join('tra_approval_recommendations as t9', 't1.application_code','t9.application_code' )
													->select(DB::raw("t1.section_id,t9.certificate_issue_date,t9.expiry_date,t1.manufacturing_site_id as premiseID,t2.premise_reg_no,t2.name as premiseName,t2.physical_address as premise_phy_addr,t2.postal_address as premise_postal_addr,t1.date_added as date_registered,t9.permit_no,t6.name as applicantName, t5.name as premDistrictName,t4.name as premRegionName, t3.name as premCountryName, t6.postal_address,t6.physical_address, t6.name as countryName , t7.name as regionName, t8.name as districtName "))
													->where('t1.application_code',$application_code)
													->first();

					if($record){
						$row=$record;
						$applicantName=$row->applicantName;
						$premise_name=$row->premiseName;
						$permit_no=$row->permit_no;
						$date_added=$row->date_registered;
						$postal_address=$row->postal_address;
						$physical_address=$row->physical_address;
						$countryName=$row->countryName;
						$regionName=$row->regionName;
						$districtName=$row->districtName;
						$premiseID=$row->premiseID;
						$premise_reg_no=$row->permit_no;
						$expiry_date = $row->expiry_date;
						$section_id = $row->section_id;
						$registration_date = $row->certificate_issue_date;
						$org_info = $this->getOrganisationInfo();
						$manufacturing_site_id = $row->premiseID;
						$premise_phy_addr=$row->premise_phy_addr;
						$premise_postal_addr=$row->premise_postal_addr;
						$premDistrictName=$row->premDistrictName;
						$premCountryName=$row->premCountryName;
						$premRegionName=$row->premRegionName;
						//Get Premise Location

						$logo = getcwd() . '/resources/images/zamra-logo.png';
						$inspection_rec =  DB::table('assigned_gmpinspections as t1')
																		->join('tra_gmp_applications as t2', 't1.application_code', '=', 't2.application_code')
																		->leftJoin('inspectionteam_details as t3', 't1.inspection_id', '=', 't3.id')
																		->where('t1.application_code', $application_code)
																		->first();

						if($inspection_rec){
							$row = $inspection_rec;
							$inspection_timeline = $row->inspection_timeline;
							$actual_start_date = $row->actual_start_date;
							$actual_end_date = $row->actual_end_date;

							$inspection_start_date = $row->start_date;
							$inspection_end_date = $row->start_date;
							if($actual_start_date != '' && $actual_end_date !=''){
								$inspection_end_date = date('d<\s\u\p>S</\s\u\p> F\\, Y',strtotime($row->actual_end_date));
								$inspection_start_date = date('d<\s\u\p>S</\s\u\p>',strtotime($row->actual_start_date));
								$date_of_inspection = $inspection_start_date.' - '.$inspection_end_date;

							}
							else if($inspection_timeline != '' && $inspection_timeline != 0){
								$date_of_inspection = $inspection_timeline;
								$date_of_inspection = preg_replace('/<br\\s*?\\/?>\\s*$/', '', $date_of_inspection);

							}else if($inspection_start_date == $inspection_end_date){

								$date_of_inspection = $inspection_start_date;

							}
							else{
								$inspection_end_date = date('d<\s\u\p>S</\s\u\p> F\\, Y',strtotime($row->inspection_end_date));
								$inspection_start_date = date('d<\s\u\p>S</\s\u\p>',strtotime($row->inspection_start_date));
								$date_of_inspection = $inspection_start_date.' - '.$inspection_end_date;

							}

						}
						else{
							$date_of_inspection = 'N/A';
						}

						$data = " GMP Compliance: GMP Certificate No:".$premise_reg_no."; Manufacturing Site:".$premise_name.";Expiry Date:".$expiry_date;

							PDF::AddPage();
							$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
						// QRCODE,H : QR-CODE Best error correction
						PDF::write2DBarcode($data, 'QRCODE,H', 178, 37, 16, 16);


							PDF::SetMargins(13,5,13, true);
							PDF::SetFont('times','B',13);

							PDF::SetLineWidth(0.8);
							PDF::Rect(10,10,190,274);

							PDF::SetLineWidth(0.3);
							PDF::Rect(11,11,188,272);
							PDF::Cell(0,5,'',0,1);
							if($section_id == 1){
								PDF::SetFont('times','I',10);

								PDF::Cell(0,4,$org_info->org_acynm.'/DFS/FRE/CF/001',0,1,'R');

							}
							else if($section_id == 2){
								PDF::SetFont('times','I',10);

								PDF::Cell(0,4,$org_info->org_acynm.'/DMC/MCIE/CF/004',0,1,'R');

							}
							else if($section_id == 3){
								PDF::SetFont('times','I',10);

								PDF::Cell(0,4,$org_info->org_acynm.'/DMC/MDC/CF/004',0,1,'R');

							}
							else if($section_id == 4){
								PDF::SetFont('times','I',10);

								PDF::Cell(0,4,$org_info->org_acynm.'/DMC/MDC/CF/004',0,1,'R');

							}
							PDF::SetFont('times','B',14);

							PDF::Cell(0,7,$org_info->org_name,0,1,'C');

							PDF::Image($logo,85,30,43,19);
							PDF::Cell(0,25,'',0,1);
							PDF::SetFont('times','B',12);

							if($section_id == 4){
								PDF::Cell(0,7,'CERTIFICATE OF COMPLIANCE TO QUALITY AUDIT',0,1,'C');
							}
							else{
								PDF::Cell(0,7,'CERTIFICATE OF COMPLIANCE TO GOOD MANUFACTURING PRACTICES (GMP)',0,1,'C');
							}


							if($section_id == 1){
								PDF::SetFont('times','BI',9);

								PDF::Cell(0,4,'(For Infant Formulae, Complementary foods and Food Supplements Manufacturing Facilities)',0,1,'C');

							}
							else if($section_id == 2){
								PDF::SetFont('times','BI',9);

								PDF::Cell(0,4,'(For Medicines Manufacturing Facilities)',0,1,'C');


							}
							else if($section_id == 3){
								PDF::SetFont('times','BI',9);

								PDF::Cell(0,4,'(For Cosmetics Manufacturing Facilities)',0,1,'C');


							}
							else if($section_id == 4){
								PDF::SetFont('times','BI',9);

								PDF::Cell(0,4,'(For Medical Devices and Diagnostics Manufacturing Facilities)',0,1,'C');


							}
							PDF::SetFont('times','BI',9);

							PDF::Cell(0,4,'(Made under Section 20 (2a) of Tanzania Medicines and Medical Devices Act, Cap 219)',0,1,'C');
							PDF::Cell(10);
							PDF::SetFont('times','B',11);
							PDF::Cell(0,5,'',0,1);
							PDF::Cell(40,5,'GMP Certificate No.',0,0);
							PDF::Cell(50,5,$premise_reg_no,0,1);
							PDF::Cell(0,5,'',0,1);
							$complaince_statement = '';
						 if($section_id == 2){
								$complaince_statement = 'current Good Manufacturing Practice requirements for dosage forms and categories of medicines listed below:';

							}

							else{
								$complaince_statement = ' ISO 13485 requirements and Tanzania Medicines and Medical Devices (Control of Medical Devices) Regulations, 2015 for the following scope:';

							}PDF::SetFont('times','',11);
							PDF::WriteHTML("This is to certify that M/S ".strtoupper($premise_name)." located at ".strtoupper($premise_phy_addr.", ".$premCountryName)." has been found to comply with ".$complaince_statement , true, 0, true, true,'');
								PDF::Cell(0,4,'',0,1);
								//applicant details
								$qry = DB::table('gmp_productline_details as t1')
								->join('gmp_product_lines as t2', 't1.product_line_id', '=', 't2.id')
								->join('gmp_product_categories as t3', 't1.category_id', '=', 't3.id')
								->leftJoin('gmp_productlinestatus as t5', 't1.prodline_inspectionstatus_id', '=', 't5.id')
								->leftJoin('gmp_prodlinerecommenddesc as t6', 't1.product_line_status_id', '=', 't6.id')
								->where('t1.manufacturing_site_id', $manufacturing_site_id)
								->where('prodline_inspectionstatus_id',8)
								->select('t1.*', 't2.name as product_line', 't3.name as productline_categ', 't1.prodline_description as line_activity');
						$results = $qry->get();
							PDF::SetFont('times','',11);
							if($section_id == 2){

								PDF::SetLineWidth(0.09);
								PDF::SetFont('times','B',10);
								PDF::MultiCell(10,7,'S/N',1,'','',0);

								PDF::MultiCell(45,7,'Dosage Form(s)',1,'','',0);

								PDF::MultiCell(45,7,'Categories of Medicines',1,'','',0);

								PDF::MultiCell(70,7,'Manufacturing operations',1,'','',1);

								PDF::SetFont('times','',11);

								if($results){
								$i = 1;
									$dimensions = PDF::getPageDimensions();
										$hasborder = false;
										foreach($results as $rows){
											$rowcount = max(PDF::getNumLines($rows->product_line, 42),PDF::getNumLines($rows->productline_categ, 45),PDF::getNumLines($rows->line_activity, 68));

											PDF::MultiCell(10,$rowcount * 6,$i.'. ',1,'','',0);
											PDF::MultiCell(45,$rowcount * 6,$rows->product_line,1,'','',0);
											PDF::MultiCell(45,$rowcount * 6,$rows->productline_categ,1,'','',0);
											PDF::MultiCell(70,$rowcount * 6,$rows->line_activity,1,'','',1);
											$i++;
										}

								}



							}

							else if($section_id == 4){

								$table = '<table style="border-collapse:collapse;border:1px solid black;width:630px;"><thead style="font-weight:bold"><tr>';

								$table .= '<td style="width:30px;border:1px solid black;font-weight:bold">S/N</td>';

								$table .= '<td style="border:1px solid black;font-weight:bold">Types of Medical Device(s)</td>';

								//PDF::MultiCell(45,9,'Class of Medical Devices',1,'','',0);
								$table .= '<td style="border:1px solid black;font-weight:bold">Class of Medical Devices</td>';

								//PDF::MultiCell(70,9,'Manufacturing operations',1,'','',1);
								$table .= '<td style="border:1px solid black;font-weight:bold">Manufacturing operations</td>';

								$table .= '</tr></thead><tbody>';

								if($results){
									$i = 1;
										$dimensions = PDF::getPageDimensions();
											$hasborder = false;
											foreach($results as $rows){

											$table .= '<tr><td style="width:30px;border:1px solid black;">'.$i.'.</td>';

											$table .= '<td style="border:1px solid black;">'.$rows->product_line.'</td>';

											$table .= '<td style="border:1px solid black;">'.ucfirst($rows->productline_categ).'</td>';

											$table .= '<td style="border:1px solid black;">'.$rows->line_activity.'</td></tr>';

											$i++;
										}

								}


								$table .= '</tbody></table>';
								PDF::WriteHTML($table, true, 0, true, true,'');

							}
							PDF::Cell(0,4,'',0,1);
							$gmpSection = '';
							switch($section_id){
								case 2: $gmpSection = "pharmaceutical";break;
								case 4: $gmpSection = "medical devices";break;
							}
								PDF::WriteHTML('The responsibility for the quality of the individual batches of '.$gmpSection.' products manufactured lies with the manufacturer and /or local agent.', true, 0, true, true,'');
								PDF::Cell(0,7,'',0,1);//expiry_date


							$expiry_date = date('F d\\, Y',strtotime($expiry_date));//$section,$reference_no,$brandName,$certificate_no,$expiry_date
							$registration_date = date('F d\\, Y',strtotime($registration_date));//$section,$reference_no,$brandName,$certificate_no,$expiry_date

							PDF::SetFont('times','',11);

							$signatory= '';
							$designation='';
							PDF::Cell(0,8,'Issued On: '.$registration_date,0,1);
							PDF::Cell(0,8,'Expires On: '.$expiry_date,0,1);
							$permit_signitory = '';
							$title= '';
							PDF::ln();

							PDF::SetFont('times','B',12);
							$permit_signitory = '';
													$title= '';	PDF::ln();
													$approved_by= '';
													$startY = PDF::GetY();
													$startX = PDF::GetX();

													$signiture = getcwd() . '/resources/images/signatures/hi0kag.png';
													PDF::Image($signiture,$startX,$startY-7,30,12);
													PDF::SetFont('times','B',11);

													PDF::SetFont('times','B',12);
													PDF::Cell(0,8,'...................................................',0,1,'');

														PDF::Cell(0,8, ucwords(strtolower('A. M. Fimbo')),0,1,'');

														PDF::Cell(0,8,'DIRECTOR GENERAL',0,1,'');

							PDF::SetFont('times','B',12);

							($ref = "zamra0020/GMP/D/D/0089")?'':PDF::Cell(0,10,'',0,1);
							PDF::Cell(15,5,'Note:  ',0,0);
							PDF::SetFont('times','',12);

							 if($section_id == 2){

								PDF::MultiCell(0,7,"This certificate shall be invalid if the forms and operations herewith are changed or if the site is no longer considered to be in compliance with current GMP requirements.\n",0,'J','',1);


							}
							else if($section_id == 4){

								PDF::MultiCell(0,7,"This certificate shall be invalid if the scope certified herewith has changed or if the site is no longer considered to be in complaince with applicable ISO standards and zamra Medical Devices Regulations in-force.\n",0,'J','',1);


							}
							PDF::setPrintHeader(false);

							 	PDF::Output(date('Y').date('m').date('d').date('i').date('s').'.pdf','I');
					}else{
						PDF::SetFont('times','',10);
						PDF::MultiCell(0,5,'Premise Data for application with reference no:  {'.$rec->reference_no.'} was not found. Please contact your System administrator if the problem persists.',0,'L');
						 	PDF::Output(date('Y').date('m').date('d').date('i').date('s').'.pdf','I');
					}
        }else if($approvalGrant->decision_id == 4){
												$record =  $qry = DB::table('tra_gmp_applications as t1')
												->join('tra_manufacturing_sites as t2', 't1.manufacturing_site_id', '=', 't2.id')
												->join('par_countries as t3', 't2.country_id','t3.id')
												->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
												->leftJoin('par_districts as t5','t2.district_id', 't5.id')
												->join('wb_trader_account as t6', 't1.applicant_id','t6.id')
												->leftJoin('par_regions as t7', 't6.region_id', 't7.id')
												->leftJoin('par_districts as t8','t6.district_id', 't8.id')
												->join('tra_approval_recommendations as t9', 't1.application_code','t9.application_code' )
												->select(DB::raw("t1.section_id,t9.certificate_issue_date,t9.expiry_date,t1.manufacturing_site_id as premiseID,t2.premise_reg_no,t2.name as premiseName,t2.physical_address as premise_phy_addr,t2.postal_address as premise_postal_addr,t1.date_added as date_registered,t9.permit_no,t6.name as applicantName, t5.name as premDistrictName,t4.name as premRegionName, t3.name as premCountryName, t6.postal_address,t6.physical_address, t6.name as countryName , t7.name as regionName, t8.name as districtName "))
												->where('t1.application_code',$application_code)
												->first();

							if($record){
									$row=$record;
									$data = " GMP Compliance: GMP Certificate No:".$premise_reg_no."; Manufacturing Site:".$premise_name.";Expiry Date:".$expiry_date;
									PDF::setPrintHeader(false);
									PDF::setPrintFooter(false);
									PDF::AddPage();
									$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
									// QRCODE,H : QR-CODE Best error correction
									PDF::write2DBarcode($data, 'QRCODE,H', 178, 37, 16, 16);


									PDF::SetMargins(13,5,13, true);
									PDF::SetFont('times','B',13);
									$row=$record;
									$applicantName=$row->applicantName;
									$premise_name=$row->premiseName;
									$permit_no=$row->permit_no;
									$date_added=$row->date_registered;
									$postal_address=$row->postal_address;
									$physical_address=$row->physical_address;
									$countryName=$row->countryName;
									$regionName=$row->regionName;
									$districtName=$row->districtName;
									$premiseID=$row->premiseID;
									$premise_reg_no=$row->permit_no;
									$expiry_date = $row->expiry_date;
									$section_id = $row->section_id;
									$registration_date = $row->certificate_issue_date;
									$org_info = $this->getOrganisationInfo();
									$manufacturing_site_id = $row->premiseID;
									$premise_phy_addr=$row->premise_phy_addr;
									$premise_postal_addr=$row->premise_postal_addr;
									$premDistrictName=$row->premDistrictName;
									$premCountryName=$row->premCountryName;
									$premRegionName=$row->premRegionName;

									$this->getReportsletterheader();
									PDF::Cell(0,7,$applicantName,0,1);
									PDF::Cell(0,7,$physical_address,0,1);
									PDF::Cell(0,7,$postal_address,0,1);
									PDF::Cell(0,7,$regionName.','.$countryName,0,1);
									PDF::SetFont('times','B',11);
									PDF::Cell(0,7,'RE: EXTENSION OF GMP CERTIFICATE VALIDITY',0,1);

									$statement1 = "The COVID 19 pandemic has triggered national and international restrictions that have affected and prevented the conduct of on-site inspection of ".$premise_name." located at ".$premise_phy_addr.".";

									PDF::SetFont('times','',11);
									PDF::MultiCell(0,8,$statement1,0,'L',0,1);
									$statement2 = "In light of the severity of the current circumstances, the Tanzania Medicines and Medical Devices Authority (zamra) has extended the validity of your current GMP certificate until ".$expiry_date." upon payment of GMP renewal fee. No further action is required from you.";
									PDF::SetFont('times','',11);
									PDF::MultiCell(0,8,$statement2,0,'L',0,1);

									PDF::SetFont('times','',11);
									PDF::MultiCell(0,8,$statement1,0,'L',0,1);
									$statement2 = "Please note that this automatic extension does not cover any changes in the scope of the GMP certificate. It will support regulatory submissions and permit import of your products to Tanzania to avoid disruption in the availability of medicines.";
									PDF::SetFont('times','',11);
									PDF::MultiCell(0,8,$statement2,0,'L',0,1);
									$qry = DB::table('gmp_productline_details as t1')
									->join('gmp_product_lines as t2', 't1.product_line_id', '=', 't2.id')
									->join('gmp_product_categories as t3', 't1.category_id', '=', 't3.id')
									->leftJoin('gmp_productlinestatus as t5', 't1.prodline_inspectionstatus_id', '=', 't5.id')
									->leftJoin('gmp_prodlinerecommenddesc as t6', 't1.product_line_status_id', '=', 't6.id')
									->where('t1.manufacturing_site_id', $manufacturing_site_id)
									->where('prodline_inspectionstatus_id',8)
									->select('t1.*', 't2.name as product_line', 't3.name as productline_categ', 't1.prodline_description as line_activity');
							$results = $qry->get();
								PDF::SetFont('times','',11);
								if($section_id == 2){

									PDF::SetLineWidth(0.09);
									PDF::SetFont('times','B',10);
									PDF::MultiCell(10,7,'S/N',1,'','',0);

									PDF::MultiCell(45,7,'Dosage Form(s)',1,'','',0);

									PDF::MultiCell(45,7,'Categories of Medicines',1,'','',0);

									PDF::MultiCell(70,7,'Manufacturing operations',1,'','',1);

									PDF::SetFont('times','',11);

									if($results){
									$i = 1;
										$dimensions = PDF::getPageDimensions();
											$hasborder = false;
											foreach($results as $rows){
												$rowcount = max(PDF::getNumLines($rows->product_line, 42),PDF::getNumLines($rows->productline_categ, 45),PDF::getNumLines($rows->line_activity, 68));

												PDF::MultiCell(10,$rowcount * 6,$i.'. ',1,'','',0);
												PDF::MultiCell(45,$rowcount * 6,$rows->product_line,1,'','',0);
												PDF::MultiCell(45,$rowcount * 6,$rows->productline_categ,1,'','',0);
												PDF::MultiCell(70,$rowcount * 6,$rows->line_activity,1,'','',1);
												$i++;
											}

									}

								}
								else if($section_id == 4){

									$table = '<table style="border-collapse:collapse;border:1px solid black;width:630px;"><thead style="font-weight:bold"><tr>';

									$table .= '<td style="width:30px;border:1px solid black;font-weight:bold">S/N</td>';

									$table .= '<td style="border:1px solid black;font-weight:bold">Types of Medical Device(s)</td>';

									//PDF::MultiCell(45,9,'Class of Medical Devices',1,'','',0);
									$table .= '<td style="border:1px solid black;font-weight:bold">Class of Medical Devices</td>';

									//PDF::MultiCell(70,9,'Manufacturing operations',1,'','',1);
									$table .= '<td style="border:1px solid black;font-weight:bold">Manufacturing operations</td>';

									$table .= '</tr></thead><tbody>';

									if($results){
										$i = 1;
											$dimensions = PDF::getPageDimensions();
												$hasborder = false;
												foreach($results as $rows){

												$table .= '<tr><td style="width:30px;border:1px solid black;">'.$i.'.</td>';

												$table .= '<td style="border:1px solid black;">'.$rows->product_line.'</td>';

												$table .= '<td style="border:1px solid black;">'.ucfirst($rows->productline_categ).'</td>';

												$table .= '<td style="border:1px solid black;">'.$rows->line_activity.'</td></tr>';

												$i++;
											}

									}


									$table .= '</tbody></table>';
									PDF::WriteHTML($table, true, 0, true, true,'');

								}
								$statement3 = "Your obligation to comply with GMP is not waived by this extension. zamra remains vigilant to ensure your medicines made available to patients in Tanzania are safe, of good quality and efficacious.";
								PDF::SetFont('times','',11);
								PDF::MultiCell(0,8,$statement3,0,'L',0,1);
								$statement4 = "As soon as circumstances permit, an on-site inspection will be conducted according to risk-based inspection planning taking into account the date of the last inspection.";
								PDF::SetFont('times','',11);
								PDF::MultiCell(0,8,$statement4,0,'L',0,1);

								$statement4 = "Inspection of your site will be launched at any time and, in case of non compliance, appropriate regulatory actions will be triggered.";
								PDF::SetFont('times','',11);
								PDF::MultiCell(0,8,$statement4,0,'L',0,1);

								PDF::ln();
								PDF::ln();
								$approved_by= '';
								$startY = PDF::GetY();
								$startX = PDF::GetX();

								$signiture = getcwd() . '/resources/images/signatures/hi0kag.png';
								PDF::Image($signiture,$startX,$startY-7,30,12);
								PDF::SetFont('times','B',11);

								PDF::SetFont('times','B',12);
								PDF::Cell(0,8,'...................................................',0,1,'');

									PDF::Cell(0,8, ucwords(strtolower('Dr. Y. H. Mwalwisi')),0,1,'');

									PDF::Cell(0,8,'FOR: Director General',0,1,'');

							}

				}else{
					$this->generateLetterOfREjection($application_code,$req,$module_id);
        }

    }
	function getGmpInspectionDates($application_code){
					$inspection_rec =  DB::table('assigned_gmpinspections as t1')
					->join('tra_gmp_applications as t2', 't1.application_code', '=', 't2.application_code')
					->leftJoin('inspectionteam_details as t3', 't1.inspection_id', '=', 't3.id')
					->where('t1.application_code', $application_code)
					->first();

				if($inspection_rec){
				$row = $inspection_rec;
				$inspection_timeline = $row->inspection_timeline;
				$actual_start_date = $row->actual_start_date;
				$actual_end_date = $row->actual_end_date;

				$inspection_start_date = $row->start_date;
				$inspection_end_date = $row->start_date;
				if($actual_start_date != '' && $actual_end_date !=''){
				$inspection_end_date = date('d<\s\u\p>S</\s\u\p> F\\, Y',strtotime($row->actual_end_date));
				$inspection_start_date = date('d<\s\u\p>S</\s\u\p>',strtotime($row->actual_start_date));
				$date_of_inspection = $inspection_start_date.' - '.$inspection_end_date;

				}
				else if($inspection_timeline != '' && $inspection_timeline != 0){
				$date_of_inspection = $inspection_timeline;
				$date_of_inspection = preg_replace('/<br\\s*?\\/?>\\s*$/', '', $date_of_inspection);

				}else if($inspection_start_date == $inspection_end_date){

				$date_of_inspection = $inspection_start_date;

				}
				else{
				$inspection_end_date = date('d<\s\u\p>S</\s\u\p> F\\, Y',strtotime($row->inspection_end_date));
				$inspection_start_date = date('d<\s\u\p>S</\s\u\p>',strtotime($row->inspection_start_date));
				$date_of_inspection = $inspection_start_date.' - '.$inspection_end_date;

				}

				}
				else{
						$date_of_inspection = 'N/A';
				}

				return $date_of_inspection;
}
    public function getGMPProductLineTableDetails($section_id)
    {
        $qry = DB::table('par_gmpcert_linetable_details')
            ->where('section_id', $section_id);
        $details = $qry->first();
        return $details;
    }

   public function generateGmpApprovalLetter(Request $request)
    {
        $application_code = $request->input('application_code');
        $application_id = $request->input('application_id');
        $section_id = $request->input('section_id');

				$record =  $qry = DB::table('tra_gmp_applications as t1')
				->join('tra_manufacturing_sites as t2', 't1.manufacturing_site_id', '=', 't2.id')
				->join('par_countries as t3', 't2.country_id','t3.id')
				->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
				->leftJoin('par_districts as t5','t2.district_id', 't5.id')
				->join('wb_trader_account as t6', 't1.applicant_id','t6.id')
				->leftJoin('par_regions as t7', 't6.region_id', 't7.id')
				->leftJoin('par_districts as t8','t6.district_id', 't8.id')
				->leftJoin('par_countries as t10','t6.country_id','t10.id')
				->join('tra_approval_recommendations as t9', 't1.application_code','t9.application_code' )
				->select(DB::raw("t1.section_id,t9.certificate_issue_date,t9.expiry_date,t1.manufacturing_site_id as premiseID,t2.premise_reg_no,t2.name as premiseName,t2.physical_address as premise_phy_addr,t2.postal_address as premise_postal_addr,t1.date_added as date_registered,t9.permit_no,t1.reference_no, t6.name as applicantName, t5.name as premDistrictName,t4.name as premRegionName, t3.name as premCountryName, t6.postal_address,t6.physical_address, t10.name as countryName ,t9.approval_date, t7.name as regionName,t9.decision_id, t8.name as districtName,t1.application_code "))
				->where('t1.application_code',$application_code)
				->first();
				if($record){
					$application_code = $record->application_code;

					$inspection_date =$this->getGmpInspectionDates($application_code);

						if($record->decision_id == 1){
								PDF::SetMargins(13,10,13, true);
					PDF::AddPage();
					PDF::Cell(0,50,'',0,1);
					PDF::Cell(5);
					PDF::SetMargins(21,10,21, true);
					PDF::SetFont('times','B',11);
					PDF::Cell(60,5,$record->reference_no,0,0);
					PDF::Cell(0,5,date('D M, Y'),0,1,'R');
					PDF::Cell(0,3,'',0,1);
					PDF::Cell(0,5,strtoupper($record->applicantName),0,1);
					PDF::Cell(0,5,strtoupper($record->physical_address),0,1);
					PDF::Cell(0,5,strtoupper($record->regionName),0,1);
					PDF::Cell(0,5,strtoupper($record->countryName),0,1);
					PDF::Cell(0,5,'',0,1);
					if($record->section_id ==2){
							$letter_title = 'RE: GOOD MANUFACTURING PRACTICE AUDIT OF '.strtoupper($record->premiseName);
					}
					else{
						$letter_title = 'RE: QUALITY AUDIT AUDIT OF '.strtoupper($record->premiseName);
					}
							PDF::SetFont('times','B',12);
							//PDF::Cell(0,5,,0,1);

							PDF::MultiCell(0,5,$letter_title,0,'',0,1);
							PDF::Cell(0,5,'',0,1);
							PDF::SetFont('times','',11);

							$text1 = "Reference is made to the above captioned subject and the audit which was conducted at your pharmaceutical plant on ".$inspection_date." by the Tanzania Medicines & Medical Devices Authority (zamra). The audit was conducted as a result of your application(s) for registration of pharmaceutical products in Tanzania.\n";
							$text2 = "Based on the audit findings, (production lines which were inspected and complied) have been found to comply with the minimum requirements of the Tanzania Good Manufacturing Practice (GMP) Guidelines.\n ";
							$text3 = "The basis for reaching this decision has also been enumerated in the summary of basis for classifying non conformances and the detailed audit report attached to this letter.\n";

							PDF::Cell(5,2,'1. ',0,0);
							PDF::MultiCell(0,10,$text1,0,'J',0,1);

							PDF::Cell(0,5,'',0,1);
							PDF::Cell(5,2,'2. ',0,0);
							PDF::MultiCell(0,10,$text2,0,'J',0,1);

							PDF::Cell(0,5,'',0,1);
							PDF::Cell(5,2,'3. ',0,0);
							PDF::MultiCell(0,10,$text3,0,'J',0,1);

							PDF::Cell(0,10,'',0,1);

							PDF::Cell(0,5,'We anticipate your cooperation on this matter.',0,1);
							PDF::Cell(0,7,'',0,1);
							PDF::SetFont('times','B',11);
							PDF::Cell(0,5,'.........................................................',0,1);
							PDF::Cell(0,3,'',0,1);
							PDF::Cell(0,5,'For: DIRECTOR GENERAL',0,1);
								PDF::Output(date('Y').date('m').date('d').date('i').date('s').'.pdf','I');


			}
			else if($record->decision_id == 2){
PDF::SetMargins(13,10,13, true);
					PDF::AddPage();
					PDF::Cell(0,50,'',0,1);
					PDF::Cell(5);
					PDF::SetMargins(21,10,21, true);
					PDF::SetFont('times','B',11);
					PDF::Cell(60,5,$record->reference_no,0,0);
					PDF::Cell(0,5,date('D M, Y'),0,1,'R');
					PDF::Cell(0,3,'',0,1);
					PDF::Cell(0,5,strtoupper($record->applicantName),0,1);
					PDF::Cell(0,5,strtoupper($record->physical_address),0,1);
					PDF::Cell(0,5,strtoupper($record->regionName),0,1);
					PDF::Cell(0,5,strtoupper($record->countryName),0,1);
					PDF::Cell(0,5,'',0,1);
					if($record->section_id ==2){
							$letter_title = 'RE: GOOD MANUFACTURING PRACTICE AUDIT OF '.strtoupper($record->premiseName);
					}
					else{
						$letter_title = 'RE: QUALITY AUDIT AUDIT OF '.strtoupper($record->premiseName);
					}
				PDF::SetFont('times','B',12);
				PDF::MultiCell(0,5,	$letter_title,0,'',0,1);
				PDF::Cell(0,5,'',0,1);
				PDF::SetFont('times','',11);
				$text1 = "Reference is made to the above captioned subject and the audit which was conducted at your pharmaceutical plant on ".$inspection_date." by the Tanzania Medicines & Medical Devices Authority (zamra). The audit was conducted as a result of your application(s) for registration of pharmaceutical products in Tanzania.\n";
				$text2 = "Based on the audit findings, your pharmaceutical plant did not comply with the minimum requirements of the Tanzania Good Manufacturing Practice (GMP) Guidelines. \n";
				$text3 = "The basis for reaching this decision has also been enumerated in the summary of basis for classifying non compliances and the detailed audit report attached to this letter.\n";
				$text4 = "In view of the above, your products cannot be registered until such time when zamra is satisfied with GMP status of your facility. If you wish to continue with the registration of your products in Tanzania, you are required to rectify the non conformances stated in the report and pay GMP Inspection fee for re-auditing of the facility.\n";

				PDF::Cell(5,2,'1. ',0,0);
				PDF::MultiCell(0,10,$text1,0,'J',0,1);

				PDF::Cell(0,5,'',0,1);
				PDF::Cell(5,2,'2. ',0,0);
				PDF::MultiCell(0,10,$text2,0,'J',0,1);

				PDF::Cell(0,5,'',0,1);
				PDF::Cell(5,2,'3. ',0,0);
				PDF::MultiCell(0,10,$text3,0,'J',0,1);

				PDF::Cell(0,10,'',0,1);

				PDF::Cell(0,5,'We anticipate your cooperation on this matter.',0,1);


				PDF::Cell(0,7,'',0,1);
				PDF::SetFont('times','B',11);
				PDF::Cell(0,5,'.........................................................',0,1);
				PDF::Cell(0,3,'',0,1);
				PDF::Cell(0,5,'For: DIRECTOR GENERAL',0,1);
					PDF::Output(date('Y').date('m').date('d').date('i').date('s').'.pdf','I');
				exit();
			}
			else if($record->decision_id == 3){

					PDF::SetMargins(13,10,13, true);
					PDF::AddPage();
					PDF::Cell(0,50,'',0,1);
					PDF::Cell(5);
					PDF::SetMargins(21,10,21, true);
					PDF::SetFont('times','B',11);
					PDF::Cell(60,5,$record->reference_no,0,0);
					PDF::Cell(0,5,date('D M, Y'),0,1,'R');
					PDF::Cell(0,3,'',0,1);
					PDF::Cell(0,5,strtoupper($record->applicantName),0,1);
					PDF::Cell(0,5,strtoupper($record->physical_address),0,1);
					PDF::Cell(0,5,strtoupper($record->regionName),0,1);
					PDF::Cell(0,5,strtoupper($record->countryName),0,1);
					PDF::Cell(0,5,'',0,1);
					if($record->section_id ==2){
							$letter_title = 'RE: GOOD MANUFACTURING PRACTICE AUDIT OF '.strtoupper($record->premiseName);
					}
					else{
						$letter_title = 'RE: QUALITY AUDIT AUDIT OF '.strtoupper($record->premiseName);
					}

				PDF::SetFont('times','B',12);
				PDF::Cell(0,5,	$letter_title,0,1);
				PDF::Cell(0,5,'',0,1);
				PDF::SetFont('times','',11);
				$text1 = "Reference is made to the above captioned subject and the audit which was conducted at your pharmaceutical plant on ".$inspection_date.", by the Tanzania Medicines & Medical Devices Authority (zamra). The audit was conducted as a result of your application(s) for registration of pharmaceutical products in Tanzania.\n";
				$text2 = "Based on the audit findings, a decision on the compliance of your pharmaceutical plant with the minimum requirements of the Tanzania Good Manufacturing Practice (GMP) Guidelines will be made after the submission of a compliance report for major and minor non conformances enumerated in the GMP audit report. The compliance report shall be verified by the Authority for compliance with GMP.\n";
				$text3 = "The basis for reaching this decision has also been enumerated in the summary of basis for classifying non conformances and the detailed audit report attached to this letter.\n";

				PDF::Cell(5,2,'1. ',0,0);
				PDF::MultiCell(0,10,$text1,0,'J',0,1);

				PDF::Cell(0,5,'',0,1);
				PDF::Cell(5,2,'2. ',0,0);
				PDF::MultiCell(0,10,$text2,0,'J',0,1);

				PDF::Cell(0,5,'',0,1);
				PDF::Cell(5,2,'3. ',0,0);
				PDF::MultiCell(0,10,$text3,0,'J',0,1);

				PDF::Cell(0,10,'',0,1);

				PDF::Cell(0,5,'We anticipate your cooperation on this matter.',0,1);


				PDF::Cell(0,7,'',0,1);
				PDF::SetFont('times','B',11);
				PDF::Cell(0,5,'.........................................................',0,1);
				PDF::Cell(0,3,'',0,1);
				PDF::Cell(0,5,'For: DIRECTOR GENERAL',0,1);
					PDF::Output(date('Y').date('m').date('d').date('i').date('s').'.pdf','I');
				exit();

			}
			else if($record->decision_id == 4){

									$row=$record;
									$data = " GMP Provisional Approval Compliance";
									PDF::setPrintHeader(false);
									PDF::setPrintFooter(false);
									PDF::AddPage();
									$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
									// QRCODE,H : QR-CODE Best error correction
									//PDF::write2DBarcode($data, 'QRCODE,H', 178, 37, 16, 16);
									PDF::setCellHeightRatio(1.3);

									PDF::SetMargins(13,5,13, true);
									PDF::SetFont('times','B',13);
									$row=$record;
									$reference=$row->reference_no;
									$applicantName=$row->applicantName;
									$premise_name=$row->premiseName;
									$permit_no=$row->permit_no;
									$date_added=$row->date_registered;
									$postal_address=$row->postal_address;
									$physical_address=$row->physical_address;
									$countryName=$row->countryName;
									$regionName=$row->regionName;
									$districtName=$row->districtName;
									$premiseID=$row->premiseID;
									$premise_reg_no=$row->permit_no;
									$expiry_date = $row->expiry_date;
									$section_id = $row->section_id;
									$registration_date = $row->certificate_issue_date;
									$org_info = $this->getOrganisationInfo();
									$manufacturing_site_id = $row->premiseID;
									$premise_phy_addr=$row->premise_phy_addr;
									$premise_postal_addr=$row->premise_postal_addr;
									$premDistrictName=$row->premDistrictName;
									$premCountryName=$row->premCountryName;
									$premRegionName=$row->premRegionName;

									$this->getReportsletterheader();
									PDF::Cell(0,15,'',0,1);
									PDF::MultiCell(60,7,'Ref :'.$reference,0,'','',0);
									PDF::MultiCell(120,7,'Date : '.date('F d\\, Y',strtotime($registration_date)),0,'R','',0);
									PDF::Cell(0,3,'',0,1);
									PDF::Cell(0,7,strtoupper($applicantName),0,1);
									//PDF::Cell(0,7,strtoupper($physical_address),0,1);
									PDF::Cell(0,7,strtoupper($postal_address),0,1);
									PDF::Cell(0,7,strtoupper($regionName).', '.strtoupper($countryName),0,1);
									PDF::SetFont('times','B',11);
									PDF::Cell(0,7,'RE: ONE YEAR ON-SITE GMP INSPECTION WAIVER ',0,1,'C');
									//PDF::Cell(0,3,'',0,1);

									$statement1 ="  This is to inform you that, zamra has issued a one year GMP approval status (waiver) for <strong>".$premise_name."</strong> located at <strong>".$premise_phy_addr.", ".$premCountryName."</strong> for product category indicated below from the date of this letter to ".formatDaterpt($expiry_date).". The waiver for conducting on-site GMP inspection has been triggered by COVID-19 pandemic which has affected and prevented international travel to conduct on-site GMP inspections overseas.\n ";

									//PDF::SetFont('times','',11);
									//PDF::MultiCell(0,10,$statement1,0,'J',0,1);
									PDF::SetFont('times','',11);
									// PDF::Cell(0,3,'',0,1);
								//PDF::MultiCell(0,10,$statement3,0,'J',0,1);
									PDF::WriteHTML($statement1, true, 0, true, true,'');
									//PDF::Cell(0,3,'',0,1);
									$qry = DB::table('gmp_productline_details as t1')
									->join('gmp_product_lines as t2', 't1.product_line_id', '=', 't2.id')
									->join('gmp_product_categories as t3', 't1.category_id', '=', 't3.id')
									->leftJoin('gmp_productlinestatus as t5', 't1.prodline_inspectionstatus_id', '=', 't5.id')
									->leftJoin('gmp_prodlinerecommenddesc as t6', 't1.product_line_status_id', '=', 't6.id')
									->where('t1.manufacturing_site_id', $manufacturing_site_id)
									->where('prodline_inspectionstatus_id',8)
									->select('t1.*', 't2.name as product_line', 't3.name as productline_categ', 't1.prodline_description as line_activity');
							$results = $qry->get();
							PDF::Cell(0,3,'',0,1);
								PDF::SetFont('times','',10);
								if($section_id == 2){

									PDF::SetLineWidth(0.09);
									PDF::SetFont('times','B',10);
									PDF::MultiCell(10,7,'S/N',1,'','',0);

									PDF::MultiCell(45,7,'Dosage Form',1,'','',0);

									PDF::MultiCell(45,7,'Category',1,'','',0);

									PDF::MultiCell(0,7,'Activity',1,'','',1);

									PDF::SetFont('times','',10);

									if($results){
									$i = 1;
										$dimensions = PDF::getPageDimensions();
											$hasborder = false;
											foreach($results as $rows){
												$rowcount = max(PDF::getNumLines($rows->product_line, 42),PDF::getNumLines($rows->productline_categ, 45),PDF::getNumLines($rows->line_activity, 68));

												PDF::MultiCell(10,$rowcount * 6,$i.'. ',1,'','',0);
												PDF::MultiCell(45,$rowcount * 6,$rows->product_line,1,'','',0);
												PDF::MultiCell(45,$rowcount * 6,$rows->productline_categ,1,'','',0);
												PDF::MultiCell(0,$rowcount * 6,$rows->line_activity,1,'','',1);
												$i++;
											}

									}

								}
								else if($section_id == 4){

									$table = '<table style="border-collapse:collapse;border:1px solid black;width:630px;"><thead style="font-weight:bold"><tr>';

									$table .= '<td style="width:30px;border:1px solid black;font-weight:bold">S/N</td>';

									$table .= '<td style="border:1px solid black;font-weight:bold">Types of Medical Device(s)</td>';

									//PDF::MultiCell(45,9,'Class of Medical Devices',1,'','',0);
									$table .= '<td style="border:1px solid black;font-weight:bold">Class of Medical Devices</td>';

									//PDF::MultiCell(70,9,'Manufacturing operations',1,'','',1);
									$table .= '<td style="border:1px solid black;font-weight:bold">Manufacturing operations</td>';

									$table .= '</tr></thead><tbody>';

									if($results){
										$i = 1;
											$dimensions = PDF::getPageDimensions();
												$hasborder = false;
												foreach($results as $rows){

												$table .= '<tr><td style="width:30px;border:1px solid black;">'.$i.'.</td>';

												$table .= '<td style="border:1px solid black;">'.$rows->product_line.'</td>';

												$table .= '<td style="border:1px solid black;">'.ucfirst($rows->productline_categ).'</td>';

												$table .= '<td style="border:1px solid black;">'.$rows->line_activity.'</td></tr>';

												$i++;
											}

									}


									$table .= '</tbody></table>';
									PDF::SetFont('times','',10);
									PDF::WriteHTML($table, true, 0, true, true,'');

								}

								$statement3 = "<strong>2.</strong>	Please note that, this GMP approval will remain valid for the stipulated period of time and for the mentioned production line (category) only.\n";
								PDF::SetFont('times','',11);PDF::Cell(0,3,'',0,1);
								//PDF::MultiCell(0,10,$statement3,0,'J',0,1);
								PDF::WriteHTML($statement3, true, 0, true, true,'');
								PDF::Cell(0,5,'',0,1);
								$statement4 = "<strong>3.</strong>	It is expected that, the one-year waiver for on-site GMP inspection will support regulatory submissions and applications for import permits of your products to Tanzania. The zamra will remain vigilant to ensure medicines available to Tanzanians from your facility are safe, good quality and efficacious.\n";
								PDF::SetFont('times','',11);
								//PDF::MultiCell(0,10,$statement4,0,'J',0,1);
								PDF::WriteHTML($statement4, true, 0, true, true,'');
								PDF::Cell(0,3,'',0,1);
								$statement4 = "<strong>4.</strong>	Please also note that, as soon as practicable, an on-site GMP inspection will be scheduled once circumstances permit. \n";
								PDF::SetFont('times','',11);
								//PDF::MultiCell(0,10,$statement4,0,'J',0,1);
								PDF::WriteHTML($statement4, true, 0, true, true,'');
								PDF::Cell(0,5,'',0,1);

								$statement4 = "<strong>5.</strong>	Furthermore, be reminded that the decision to take any regulatory actions including conducting ad-hoc inspection of the facility at any time before end of the above mentioned extension period in case of products failure to meet safety and quality specifications remain solely on zamra.\n";
								PDF::SetFont('times','',11);
								//PDF::MultiCell(0,10,$statement4,0,'J',0,1);
								PDF::WriteHTML($statement4, true, 0, true, true,'');
								PDF::Cell(0,5,'',0,1);

								$statement4 = "<strong>6.</strong>	Thank you for your cooperation.\n";
								//PDF::SetFont('times','',11);
								//PDF::MultiCell(0,10,$statement4,0,'J',0,1);
								PDF::WriteHTML($statement4, true, 0, true, true,'');
								PDF::Cell(0,5,'',0,1);
								//PDF::Cell(0,5,'',0,1);
								$approved_by= '';
								$startY = PDF::GetY();
								$startX = PDF::GetX();

								$signiture = getcwd() . '/resources/images/signatures/dmc_v2.png';
								PDF::Image($signiture,$startX+60,$startY-7,60,12);
								PDF::SetFont('times','B',11);

								PDF::SetFont('times','B',12);
								PDF::Cell(0,5,'...................................................',0,1,'C');

									PDF::Cell(0,5, ucwords(strtolower('Dr. Y. H. Mwalwisi')),0,1,'C');

									PDF::Cell(0,8,'FOR: Director General',0,1,'C');
								PDF::Output(date('Y').date('m').date('d').date('i').date('s').'.pdf','I');
				exit();



			}


				}


    }


     public function generateClinicalTrialCertificate(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $approvalGrant = DB::table('tra_approval_recommendations')->where('application_code', $application_code)->first();
		if(!$approvalGrant){
			echo "The application has not been approved, contact the system administration.";
			exit();
		}
        if($approvalGrant->decision_id == 1){

						$record = DB::table('tra_clinical_trial_applications as t2')
                ->join('wb_trader_account as t3', 't2.applicant_id', '=', 't3.id')
                ->leftJoin('clinical_trial_personnel as t4', 't2.sponsor_id', '=', 't4.id')
                ->leftJoin('clinical_trial_personnel as t5', 't2.investigator_id', '=', 't5.id')
								->leftJoin('tra_approval_recommendations as t6', 't2.application_code', '=', 't6.application_code')
								->leftJoin('par_countries as t7', 't4.country_id', '=', 't7.id')
								->leftJoin('par_regions as t8', 't4.region_id', '=', 't7.id')
								->leftJoin('tra_clinicalstudy_participants as t9', 't1.id', '=', 't9.application_id')
                ->select(DB::raw("t2.*,t2.id as previous_id,t6.permit_no,t3.name as applicant_name,t4.name as sponsor,t5.name as investigator,
                    t3.id as applicant_id, t3.name as applicant_name, t3.contact_person, t3.tpn_no,t2.reference_no,t2.*,t6.expiry_date as regexpiry_date,t6.certificate_issue_date as regcertificate_issue_date, t6.certificate_no as registration_no,t7.name as sponsor_country, t7.name as sponsor_region,
                    t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id,t2.id as application_id,
                    t3.physical_address as app_physical_address, t3.postal_address as app_postal_address,t4.postal_address as sponsor_address ,t9.number_of_participants,
										t3.telephone_no as app_telephone,t3.fax as app_fax, t3.email as app_email, t3.website as app_website"))
										->where('t2.application_code',$application_code)
										->first();
						if($record){
							$row = $record;
							$principal_investigator= $row->investigator;
							$application_id = $row->application_id;
							$reference_no = $row->reference_no;	$protocol_no = $row->protocol_no;
							$data = "Clincial Trial Authorisation: Permit No:".$row->registration_no."; Protocol No:".$row->protocol_no.";Issued Date:".formatDate($row->regcertificate_issue_date);
							$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);

										$org_info = $this->getOrganisationInfo();
									PDF::AddPage();
										PDF::SetMargins(17,10,17, true);
										//registration certifcate
										PDF::SetFont('times','B',13);
										//PDF::Cell(0,10,'iirams',0,1);
										// QRCODE,H : QR-CODE Best error correction
									PDF::write2DBarcode($data, 'QRCODE,H', 178, 37, 16, 16);

										PDF::SetLineWidth(0.4);
										PDF::Rect(8,8,194,278);

									PDF::SetFont('times','B',13);
									//PDF::Cell(78);
									PDF::SetFont('times','',9);
									PDF::Cell(0,4,$org_info->org_acynm.'/DMC/CTP/CF/001',0,1,'R');

									PDF::Cell(0,12,'',0,1);
									PDF::SetFont('times','B',14);
									PDF::Cell(0,5,$org_info->org_name,0,1,'C');
									PDF::SetFont('times','BI',9);
									//serial nos

								$logo = getcwd() . '/resources/images/zamra-logo.png';
									PDF::Cell(0,0,$row->certificate_serial_no,0,1,'R');
									PDF::Image($logo,85,34,50,23);
									//serial no

									PDF::Cell(0,25,'',0,1);

									PDF::SetFont('times','B',12);

									PDF::Cell(0,5,'The Medicines and Allied Substances Act, 2013',0,1,'C');
									PDF::SetFont('times','BU',12);
									PDF::Cell(0,5,'(Act No. 3 of 2013)',0,1,'C');
									PDF::ln();
									PDF::Cell(0,5,'The Medicines and Allied Substances (Clinical Trial) Regulations, 2016',0,1,'C');
									PDF::Cell(0,5,'Clinical Trial No. '.$registration_no,0,1,'R');
									PDF::Cell(0,5,'CLINICAL TRIAL CERTIFICATE',0,1,'C');
									PDF::SetFont('times','BI',9);

									PDF::MultiCell(0,5,"Study Title: ".$row->study_title,0,'J',0,1);
									PDF::Cell(50,5,'Duration(Months):',0,0);
									PDF::Cell(50,5,$row->study_duration,0,0);
									PDF::Cell(50,5,'Sample Size: ',0,0);
									PDF::Cell(50,5,$row->number_of_participants,0,1);
									PDF::SetFont('times','',11);
									PDF::SetLineWidth(3.8);
									//get Study sites
									$study_siterec = DB::table('study_sites as t1')
									->join('par_countries as t2', 't1.country_id', '=', 't2.id')
									->leftJoin('par_regions as t3', 't1.region_id', '=', 't3.id')
									->join('clinical_trial_sites as t4', 't1.id', '=', 't4.study_site_id')

									->select('t1.*','t1.name as study_site_name', 't2.name as country_name', 't3.name as region_name')
									->where('t4.application_id',$application_id);
									$total_record = $study_siterec->count();
									$study_siterec = 	$study_siterec->get();
									$study_sites= '';

														$i = 1;
														if($study_siterec){

															foreach($study_siterec as $rows){
																if( $total_record == 1){
																	$study_sites.= $rows->study_site_name." ".$rows->physical_address." ".$rows->region_name." ";

																}
																else if($i == $total_record){
																	$study_sites.= " and ".$rows->study_site_name." ".$rows->physical_address." ".$rows->region_name." ";

																}
																else if(($i+1) == $total_record){
																	$study_sites.=$rows->study_site_name." ".$rows->physical_address." ".$rows->region_name." ";

																}
																else{
																	$study_sites.= $rows->study_site_name." ".$rows->physical_address." ".$rows->region_name.", ";

																}
																		$i++;
															}

														}
										PDF::SetFont('times','B',11);
									PDF::MultiCell(0,5,"Name and Address of Clinical Trial Site(s): ".$study_sites,0,'',0,1);
									PDF::SetFont('times','',11);


									PDF::setCellHeightRatio(1.5);
									PDF::Cell(0,5,'',0,1);
									PDF::SetFont('times','',11);
									PDF::Cell(60,5,'Name of Principal Investigator:  ',0,0);
									PDF::SetFont('times','B',11);
									PDF::MultiCell(0,5,($principal_investigator),0,'L');
									PDF::Cell(0,5,'',0,1);
									PDF::Cell(60,5,'Name of the Sponsor:   ',0,0);
									PDF::SetFont('times','B',11);
									PDF::MultiCell(0,5,($row->sponsor),0,'L');
									PDF::Cell(0,5,'',0,1);
									$expiry_date = date('j\<\s\u\p\>S\<\/\s\u\p\> F Y', strtotime($row->regexpiry_date));

									PDF::SetFont('times','',11);
									PDF::Cell(60,5,'Valid until: ',0,0);
									PDF::WriteHTML('<b>'.strtoupper($expiry_date),true,0,true,true);
									PDF::SetFont('times','',11);
									PDF::setCellHeightRatio(1.5);
									//$date_of_protocol = date('jS F, Y',strtotime(PDF::date_of_protocol));
									PDF::Cell(60,5,'Protocol Number: ',0,0);
									PDF::MultiCell(0,5,"Conditions imposed by the Zambia Medicines Regulatory Authority (refer to notes overleaf).\n",0,'',0,1);

									//signitory details
									$permit_signitory = '';
											$title= '';
											PDF::ln();

									PDF::Cell(0,8,'',0,1);
									$startY = PDF::GetY();
									$startX = PDF::GetX();

									$signiture = getcwd() . '/resources/images/signatures/hi0kag.png';
									PDF::Image($signiture,$startX,$startY-7,30,12);
									PDF::SetFont('times','B',11);

									PDF::SetFont('times','B',12);
									PDF::Cell(0,8,'...................................................',0,1,'');

										PDF::Cell(0,8, ucwords(strtolower('...........................')),0,1,'');

										PDF::Cell(0,8,'Director-General (Signature)	',0,1,'');


									PDF::AddPage();

											PDF::SetFont('times','Bi',13);
											PDF::Cell(0,5,'Overleaf notes',0,1);
											PDF::SetFont('times','B',13);
											PDF::Cell(0,5,'CLINICAL TRIAL CERTIFICATE TERMS AND CONDITIONS',0,1);

											PDF::SetFont('times','',11);
											PDF::Cell(0,2,'',0,1);

											$text1 = "Non-compliance with any of the conditions stated below will result in suspension or revocation of the clinical trial certificate:\n";
											PDF::MultiCell(0,10,$text1,0,'J',0,1);
											PDF::Cell(0,2,'',0,1);
											PDF::Cell(0,5,'The clinical trial certificate holder shall-',0,1);
											PDF::Cell(5,2,'(a) ',0,0);
											PDF::MultiCell(0,10,"ensure that the clinical trial is conducted in compliance with good clinical practices, the clinical trial protocol and applicable regulatory requirements;\n",0,'J',0,1);
											PDF::Cell(0,2,'',0,1);
											PDF::Cell(5,2,'(b) ',0,0);
											PDF::MultiCell(0,10,"establish and maintain a system for monitoring, detecting and reporting adverse drug reactions, serious adverse events and adverse events;\n",0,'J',0,1);

											PDF::Cell(5,2,'(c) ',0,0);
											PDF::MultiCell(0,10,"safeguard the health and wellbeing of participants in the clinical trial;\n",0,'J',0,1);
											PDF::Cell(0,2,'',0,1);

											PDF::Cell(5,2,'(d) ',0,0);
											PDF::MultiCell(0,10,"obtain authorisation from the Authority for any amendments to the protocol;\n",0,'J',0,1);
											PDF::Cell(0,2,'',0,1);
											PDF::Cell(5,2,'(e) ',0,0);
											PDF::MultiCell(0,10,"submit updates to the Authority on the progress of the trial including reports of the Independent Data Monitoring Committee within the stipulated timelines; \n",0,'J',0,1);
										PDF::Cell(0,2,'',0,1);
											PDF::Cell(5,2,'(f) ',0,0);
											PDF::MultiCell(0,10,"ensure accountability of the investigational medicinal product(s); \n",0,'J',0,1);
											PDF::Cell(0,2,'',0,1);
											PDF::Cell(5,2,'(g) ',0,0);
											PDF::MultiCell(0,10,"take appropriate urgent safety measures in order to protect the participant(s) of a clinical trial against any harm to their health or safety; and immediately, and in any event no later than 24 hours from the date the measures are taken, give written notice to the Authority of the measures taken and the circumstances giving rise to those measures; and \n",0,'J',0,1);

											PDF::Cell(0,2,'',0,1);
											PDF::Cell(5,2,'(h) ',0,0);
											PDF::MultiCell(0,10,"in case of conclusion or termination of a clinical trial, the clinical trial certificate holder shall notify the Authority in writing that the trial has ended within thirty days; and shall submit a summary of the final research report to the Authority within twelve months of the end of the clinical trial. \n",0,'J',0,1);

									//the other items


						}
						else{
								PDF::SetFont('times','B',12);
								PDF::Cell(0,5,'No Record Found',0,1);

						}
							 PDF::Output('Clinical trial Certificate '.date('Y').date('m').date('d').date('i').date('s').'.pdf','I');

        }else{
					$this->generateLetterOfREjection($application_code,$req,$module_id);
        }

    }






    public function generateProductNotificationApprovalLetterDeplecated(Request $request)
    {
        $product_id = $request->input('product_id');
        $document_number = 'BVS/099/45';
        $certificate_name = 'MEDICAL DEVICES NOTIFICATION LETTER OF APPROVAL';
        $params = array(
            'product_id' => $product_id,
            'document_number' => $document_number,
            'certificate_name' => $certificate_name,
            'certificate_regulation' => '(Made under Section 21(3) of the Tanzania Food, Drugs and Cosmetics Act, Cap 219)',
            'base_Url' => $this->base_url,
            'sign_Url' => $this->sign_url
        );
        $report_name = 'medicalDevicesNotificationApprovalLetterReport';
        $report = generateJasperReport($report_name, 'permit_' . time(), 'pdf', $params);
        return $report;

    }
    //rejection letter

    public function generateProductRejectionLetter(Request $request)
    {
        $product_id = $request->input('product_id');
        $document_number = 'BVS/099/45';
        $title = 'REJECTION LETTER';
        $params = array(
            'product_id' => $product_id,
            'document_number' => $document_number,
            'title' => $title,
            'base_Url' => $this->base_url,
            'sign_Url' => $this->sign_url
        );
        $report_name = 'productRejectionLetter';
        $report = generateJasperReport($report_name, 'permit_' . time(), 'pdf', $params);
        return $report;
    }
  public function funcExportInspectedpermits(Request $req){
        $table_name = 'tra_premises_applications';
        $section_id = $req->input('section_id');
        $inspection_recommendation_id = $req->input('inspection_recommendation_id');
        $filter = $req->input('filter');
        $start = $req->input('start');
        $limit = $req->input('limit');

        $inspected_from = $req->input('inspected_from');
        $inspected_to = $req->input('inspected_to');
        $inspection_type_id = $req->input('inspection_type_id');
        $approval_recommendation_id = $req->input('approval_recommendation_id');
        $section_id = $req->input('section_id');
        $zone_id = $req->input('zone_id');


        $approved_from_date = $req->input('approved_from_date');
        $approved_to_date = $req->input('approved_to_date');
        $type = $req->type;
        $inspection_status_id = $req->input('inspection_status_id');
        $port_id = $req->input('port_id');
        $whereClauses = array();
        try {
            $filter_string = '';
            if (isset($filter)) {
                $filters = json_decode($filter);
                if ($filters != NULL) {
                    foreach ($filters as $filter) {
                        switch ($filter->property) {
                            case 'reference_no' :
                                $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                                break;
                            case 'premise_name' :
                                $whereClauses[] = "t2.name like '%" . ($filter->value) . "%'";
                                break;
                            case 'region_name' :
                                $whereClauses[] = "t11.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'district_name' :
                                $whereClauses[] = "t12.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'physical_address' :
                                $whereClauses[] = "t2.physical_address like '%" . ($filter->value) . "%'";
                                break;
                                case 'applicant_name' :
                                $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'proforma_invoice_no' :
                                $whereClauses[] = "proforma_invoice_no like '%" . ($filter->value) . "%'";
                                break;
								case 'inspected_on' :
                                $whereClauses[] = "date_format(inspected_on,'%Y-%m-%d') = '" . ($filter->value) . "'";
                                break;
								   case 'tra_reg_number' :
                                $whereClauses[] = "t2.tra_reg_number like '%" . ($filter->value) . "%'";
                                break;
								  case 'inspection_status' :
                                $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'permit_section' :
	                                $whereClauses[] = "t5.name like '%" . ($filter->value) . "%'";
	                                break;

								case 'tracking_no' :
									$whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
									break;
									case 'permit_no' :
									$whereClauses[] = "t4.permit_no like '%" . ($filter->value) . "%'";
									break;
                        }
                    }
                    $whereClauses = array_filter($whereClauses);
                }
		        if (!empty($whereClauses)) {
		            $filter_string = implode(' AND ', $whereClauses);
		        }
            }
        if($type == 1){ //poe inpection type 2 and premise is 1
			$qry = DB::table($table_name . ' as t1')
			->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
			->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
			->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')

			->join('tra_premiseinspection_applications as t7', 't7.application_code', '=', 't1.application_code')
			->leftJoin('par_premiseinspection_recommendations as t6', 't7.approval_recommendation_id', '=', 't6.id')

			->leftJoin('par_business_types as t10', 't2.business_type_id', '=', 't10.id')
			->leftJoin('par_regions as t11', 't2.region_id', '=', 't11.id')

			->leftJoin('par_districts as t12', 't2.district_id', '=', 't12.id')
			->leftJoin('par_inspection_types as t14', 't7.inspection_type_id', '=', 't14.id')

			->leftJoin('par_premiseinspection_recommendations as t15', 't7.recommendation_id', '=', 't15.id')
			->leftJoin('tra_premise_inspection_details as t16', 't7.inspection_id', 't16.id')
                ->leftJoin('par_zones as t17', 't16.zone_id', 't17.id')
			->select( DB::raw("t1.reference_no as Reference_no,t1.tracking_no as Tracking_no,t2.physical_address,t11.name as region_name,t12.name as district_name, t2.name as premise_name, t3.name as applicant_name, t4.name as application_status,
			    t10.name as business_type,t14.name as inspection_type,t15.name as inspection_recommendation,date_format(t7.actual_start_date,'%Y-%m-%d') as actual_start_date,date_format(t7.actual_end_date,'%Y-%m-%d') as actual_end_date, t17.name as Inspection_Zone, IF(t6.id > 0,t6.name,'Pending Approval') as Approval_Status,t7.approval_remarks as Approval_Remarks"));
//

		    if(validateIsNumeric($inspection_type_id)){

		        $qry->where(array('t7.inspection_type_id'=>$inspection_type_id));

		    }if(validateIsNumeric($inspection_recommendation_id)){

		        $qry->where(array('t7.recommendation_id'=>$inspection_recommendation_id));
		    }if(validateIsNumeric($section_id)){

		        $qry->where(array('t1.section_id'=>$section_id));
		    }if(validateIsNumeric($approval_recommendation_id)){

		        $qry->where(array('t7.approval_recommendation_id'=>$approval_recommendation_id));
		    }
		    if(validateIsNumeric($zone_id)){

                        $qry->where(array('t16.zone_id'=>$zone_id));

                    }
		    // /the inspected
		    if($inspected_from != '' || $inspected_to){
		        $qry->whereRAW(" actual_start_date BETWEEN '".$inspected_from."' and '".$inspected_to."' ");
		        $qry->whereRAW(" actual_end_date BETWEEN '".$inspected_from."' and '".$inspected_to."' ");
		    }
		    if($approved_from_date != ''){
		        $qry->whereRAW(" approval_date >= '".$approved_from_date."' ");
		    }if($approved_to_date != ''){
		        $qry->whereRAW(" approval_date <= '".$approved_to_date."' ");
		    }
		    $heading='Inspected and Approved Premise Inspections';
		    $filename="Inspected_approval_Premise_Inspections";
		}
		else{//t1
	     $qry = DB::table('tra_importexport_applications as t1')
                ->leftJoin('tra_poe_applications as t2', 't1.application_code', '=','t2.application_code')
                ->leftJoin('par_poeinspection_statuses as t3', 't2.inspection_status_id','=','t3.id')
                ->join('tra_managerpermits_review as t4', 't1.application_code', '=', 't4.application_code')
                ->leftJoin('par_sections as t5', 't1.section_id', '=', 't5.id')
                ->leftJoin('par_ports_information as t6', 't1.port_id', '=', 't6.id')
                ->leftJoin('users as t7', 't2.inspected_by', '=', 't7.id')
                ->leftJoin('par_poeinspection_recommendation as t8', 't2.inspection_recommendation_id','=','t8.id')
                ->select(DB::raw("DISTINCT t2.tra_reg_number, t1.reference_no,t1.tracking_no, t4.permit_no,if(t2.inspection_status_id >0,t3.name, 'Not Inspected') as inspection_status, t1.proforma_invoice_no,t5.name as permit_section, t6.name as port_ofentryexit,CONCAT_WS(' ',decrypt(t7.first_name),decrypt(t7.last_name)) as inspection_by, t8.name as inspection_recommendation,date_format(t2.created_on,'%Y-%m-%d') as Inspected_on,tansad_no,tra_reg_date,remarks"));
				//,
                if(validateIsNumeric($port_id)){

                    $qry->where(array('t1.port_id'=>$port_id));

                }if(validateIsNumeric($inspection_recommendation_id)){

                    $qry->where(array('t2.inspection_recommendation_id'=>$inspection_recommendation_id));
                }if(validateIsNumeric($section_id)){

                    $qry->where(array('section_id'=>$section_id));
                }
                // /the inspected
                if($inspected_from != ''){
                    $qry->whereRAW(" inspected_on >= '".$inspected_from."' ");
                }if($inspected_to != ''){
                    $qry->whereRAW(" inspected_on <= '".$inspected_to."' ");
                }
             //report params
                $heading='Inspected and Approved POE Inspections';
		   		$filename="Inspected_approval_POE_Inspections";
            }

            if ($filter_string != '') {

                $qry->whereRAW($filter_string);
            }
            if(validateIsNumeric( $section_id)){

                $qry->where('t1.section_id',$section_id);
            }

        $data=$qry->get();
        $data_array = json_decode(json_encode($data), true);
		//application details
        $ProductSpreadsheet = new Spreadsheet();
        $sheet = $ProductSpreadsheet->getActiveSheet();
        $cell=0;

        if(isset($data_array[0])){
	        $header=array_keys($data_array[0]);
	        $length=count($header);
        }else{
	        $data_array=array();
	        $header=array();
	        $length=1;
	        $sheet->getCell('B8')->setValue("No data");
       }

//Main heading style
        $styleArray = [
                'font' => [
                    'bold' => true,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
                'borders' => [
                    'top' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                    'rotation' => 90,
                    'startColor' => [
                        'argb' => 'FFA0A0A0',
                    ],
                    'endColor' => [
                        'argb' => 'FFFFFFFF',
                    ],
                ]
            ];
          $styleHeaderArray = [
                'font' => [
                    'bold' => true,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
                'borders' => [
                    'top' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ]
            ];



        $sortedData=array();
        $i=0;
        $k=0;
        $temp=[];
        $length++;
        $letter=number_to_alpha($length,"");

            //get the columns
            foreach ($header as $uheader){
                             $temp[$i]=$uheader;
                          $i++;
                        }
           $total=count($temp);
           //match values
             foreach ($data as $udata)
                  {
                      $sortedData[$k][] = $k+1;
                      for($v=0;$v<$total;$v++){
                         $temp1=$temp[$v];
                         $sortedData[$k][]=$udata->$temp1;
                      }

                      $k++;
                 }
         //first heading
                $sheet->mergeCells('A1:'.$letter.'6')
                      ->getCell('A1')
                      ->setValue("Zambia Medicines Regulatory Authority (ZAMRA)\nP.O Box 31890 Lusaka, Off Kenneth Kaunda International Airport Road\nTel: +260 211 432 350, +260 211 432 351, +260 211 432 352.\nWebsite: www.zamra.co.zm Email: pharmacy@zamra.co.zm.\n".$heading);
                $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
                $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);
        //headers
               $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray);

        //set autosize\wrap true for all columns
            $size=count($sortedData)+7;
            $cellRange = 'A7:'.$letter.''.$size;
            if($length>26){
                  foreach(range('A','Z') as $column) {
                          $sheet->getColumnDimension($column)->setAutoSize(true);
                      }

                  $remainder=27;
                  while ($remainder <= $length) {
                    $column=number_to_alpha($remainder,"");
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                    $remainder++;
                  }

                }else{

                  foreach(range('A',$letter) as $column) {
                    //dd(range('A',$letter) );
                          $sheet->getColumnDimension($column)->setAutoSize(true);
                      }

                }

          //adding formats to header
                array_unshift($header, "S/N");
                $header = toUpperCase($header);
               $sheet->fromArray($header, null, "A7");
        //loop data while writting
               $sheet->fromArray( $sortedData, null,  "A8");
        //create file
            $writer = new Xlsx($ProductSpreadsheet);


           $response =  new StreamedResponse(
            function () use ($writer) {
                $writer->save('php://output');
            }
        );
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename='.$filename.'.xlsx');
        $response->headers->set('Cache-Control','max-age=0');
       return $response;

       } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return \response()->json($res);
    }
 public function funcExportInspectedPermitsProducts(Request $req){
        $table_name = 'tra_importexport_applications';
        $section_id = $req->input('section_id');
        $inspection_recommendation_id = $req->input('inspection_recommendation_id');
        $filter = $req->input('filter');
        $start = $req->input('start');
        $limit = $req->input('limit');

        $inspected_from = $req->input('inspected_from');
        $inspected_to = $req->input('inspected_to');
        $inspection_type_id = $req->input('inspection_type_id');
        $approval_recommendation_id = $req->input('approval_recommendation_id');
        $section_id = $req->input('section_id');


        $approved_from_date = $req->input('approved_from_date');
        $approved_to_date = $req->input('approved_to_date');
        $type = $req->type;
        $inspection_status_id = $req->input('inspection_status_id');
        $port_id = $req->input('port_id');
        $whereClauses = array();
        try {
            $filter_string = '';
            if (isset($filter)) {
                $filters = json_decode($filter);
                if ($filters != NULL) {
                    foreach ($filters as $filter) {
                        switch ($filter->property) {
                            case 'reference_no' :
                                $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                                break;
                            case 'premise_name' :
                                $whereClauses[] = "t2.name like '%" . ($filter->value) . "%'";
                                break;
                            case 'region_name' :
                                $whereClauses[] = "t11.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'district_name' :
                                $whereClauses[] = "t12.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'physical_address' :
                                $whereClauses[] = "t2.physical_address like '%" . ($filter->value) . "%'";
                                break;
                                case 'applicant_name' :
                                $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'proforma_invoice_no' :
                                $whereClauses[] = "proforma_invoice_no like '%" . ($filter->value) . "%'";
                                break;
								case 'inspected_on' :
                                $whereClauses[] = "date_format(inspected_on,'%Y-%m-%d') = '" . ($filter->value) . "'";
                                break;
								   case 'tra_reg_number' :
                                $whereClauses[] = "t2.tra_reg_number like '%" . ($filter->value) . "%'";
                                break;
								  case 'inspection_status' :
                                $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                                break;
                                case 'permit_section' :
	                                $whereClauses[] = "t5.name like '%" . ($filter->value) . "%'";
	                                break;

								case 'tracking_no' :
									$whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
									break;
									case 'permit_no' :
									$whereClauses[] = "t4.permit_no like '%" . ($filter->value) . "%'";
									break;

								 case 'brand_name' :
                                $whereClauses[] = "t11.brand_name like '%" . ($filter->value) . "%'";
                                break;
								  case 'common_name' :
                                $whereClauses[] = "t12.name like '%" . ($filter->value) . "%'";
                                break;
								  case 'prodcertificate_no' :
                                $whereClauses[] = "t9.prodcertificate_no like '%" . ($filter->value) . "%'";
                                break;
								  case 'batch_numbers' :
                                $whereClauses[] = "t13.batch_numbers like '%" . ($filter->value) . "%'";
                                break;
                        }
                    }
                    $whereClauses = array_filter($whereClauses);
                }
		        if (!empty($whereClauses)) {
		            $filter_string = implode(' AND ', $whereClauses);
		        }
            }

	     $qry = DB::table('tra_importexport_applications as t1')
                ->leftJoin('tra_poe_applications as t2', 't1.application_code', '=','t2.application_code')
                ->leftJoin('par_poeinspection_statuses as t3', 't2.inspection_status_id','=','t3.id')
                ->join('tra_managerpermits_review as t4', 't1.application_code', '=', 't4.application_code')
                ->leftJoin('par_sections as t5', 't1.section_id', '=', 't5.id')
                ->leftJoin('par_ports_information as t6', 't1.port_id', '=', 't6.id')
                ->leftJoin('users as t7', 't2.inspected_by', '=', 't7.id')
                ->leftJoin('par_poeinspection_recommendation as t8', 't2.inspection_recommendation_id','=','t8.id')
				->join('tra_permits_products as t9', 't1.application_code','=','t9.application_code')
				->join('tra_poe_permitsdata as t13', function ($join) {
							 $join->on('t13.poe_application_id', '=','t1.id')
								->on('t9.id', '=', 't13.permits_product_id');
				})
				 ->leftJoin('tra_product_information as t11', 't9.product_id','=','t11.id')
				->leftJoin('par_common_names as t12', 't11.common_name_id','=','t12.id')
				->leftJoin('par_packaging_units as t14', 't9.packaging_unit_id','=','t14.id')

                ->select(DB::raw("DISTINCT t2.tra_reg_number, t1.reference_no,t1.tracking_no, t4.permit_no,if(t2.inspection_status_id >0,t3.name, 'Not Inspected') as inspection_status, t1.proforma_invoice_no,t5.name as permit_section, t6.name as port_ofentryexit,CONCAT_WS(' ',decrypt(t7.first_name),decrypt(t7.last_name)) as inspection_by, t8.name as inspection_recommendation,date_format(t2.created_on,'%Y-%m-%d') as Inspected_on,tansad_no,tra_reg_date,t2.remarks as Inspected_permits_remarks, t9.quantity as permit_quantity , t13.poe_prod_quantity,t13.batch_numbers,t11.brand_name,t12.name as common_name, t9.prodcertificate_no, t14.name as packaging_units, t9.unit_price, (t9.unit_price * t9.quantity) as total_value,t13.remarks as Inspected_Products_Remarks "));
				//,
                if(validateIsNumeric($port_id)){

                    $qry->where(array('t1.port_id'=>$port_id));

                }if(validateIsNumeric($inspection_recommendation_id)){

                    $qry->where(array('t2.inspection_recommendation_id'=>$inspection_recommendation_id));
                }if(validateIsNumeric($section_id)){

                    $qry->where(array('section_id'=>$section_id));
                }
                // /the inspected
                if($inspected_from != ''){
                    $qry->whereRAW(" inspected_on >= '".$inspected_from."' ");
                }if($inspected_to != ''){
                    $qry->whereRAW(" inspected_on <= '".$inspected_to."' ");
                }
             //report params
                $heading='Inspected and Approved POE Inspections';
		   		$filename="Inspected_approval_POE_Inspections";

            if ($filter_string != '') {

                $qry->whereRAW($filter_string);
            }
            if(validateIsNumeric( $section_id)){

                $qry->where('t1.section_id',$section_id);
            }
                  dd($qry->toSql());
        $data=$qry->get();
        $data_array = json_decode(json_encode($data), true);
		//application details
        $ProductSpreadsheet = new Spreadsheet();
        $sheet = $ProductSpreadsheet->getActiveSheet();
        $cell=0;

        if(isset($data_array[0])){
	        $header=array_keys($data_array[0]);
	        $length=count($header);
        }else{
	        $data_array=array();
	        $header=array();
	        $length=1;
	        $sheet->getCell('B8')->setValue("No data");
       }

//Main heading style
        $styleArray = [
                'font' => [
                    'bold' => true,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
                'borders' => [
                    'top' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                    'rotation' => 90,
                    'startColor' => [
                        'argb' => 'FFA0A0A0',
                    ],
                    'endColor' => [
                        'argb' => 'FFFFFFFF',
                    ],
                ]
            ];
          $styleHeaderArray = [
                'font' => [
                    'bold' => true,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
                'borders' => [
                    'top' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ]
            ];



        $sortedData=array();
        $i=0;
        $k=0;
        $temp=[];
        $length++;
        $letter=number_to_alpha($length,"");

            //get the columns
            foreach ($header as $uheader){
                             $temp[$i]=$uheader;
                          $i++;
                        }
           $total=count($temp);
           //match values
             foreach ($data as $udata)
                  {
                      $sortedData[$k][] = $k+1;
                      for($v=0;$v<$total;$v++){
                         $temp1=$temp[$v];
                         $sortedData[$k][]=$udata->$temp1;
                      }

                      $k++;
                 }
         //first heading
                $sheet->mergeCells('A1:'.$letter.'6')
                      ->getCell('A1')
                      ->setValue("Zambia Medicines Regulatory Authority (ZAMRA)\nP.O Box 31890 Lusaka, Off Kenneth Kaunda International Airport Road\nTel: +260 211 432 350, +260 211 432 351, +260 211 432 352.\nWebsite: www.zamra.co.zm Email: pharmacy@zamra.co.zm.\n".$heading);
                $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
                $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);
        //headers
               $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray);

        //set autosize\wrap true for all columns
            $size=count($sortedData)+7;
            $cellRange = 'A7:'.$letter.''.$size;
            if($length>26){
                  foreach(range('A','Z') as $column) {
                          $sheet->getColumnDimension($column)->setAutoSize(true);
                      }

                  $remainder=27;
                  while ($remainder <= $length) {
                    $column=number_to_alpha($remainder,"");
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                    $remainder++;
                  }

                }else{

                  foreach(range('A',$letter) as $column) {
                    //dd(range('A',$letter) );
                          $sheet->getColumnDimension($column)->setAutoSize(true);
                      }

                }

          //adding formats to header
                array_unshift($header, "S/N");
                $header = toUpperCase($header);
               $sheet->fromArray($header, null, "A7");
        //loop data while writting
               $sheet->fromArray( $sortedData, null,  "A8");
        //create file
            $writer = new Xlsx($ProductSpreadsheet);


           $response =  new StreamedResponse(
            function () use ($writer) {
                $writer->save('php://output');
            }
        );
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename='.$filename.'.xlsx');
        $response->headers->set('Cache-Control','max-age=0');
       return $response;

       } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return \response()->json($res);
    }
    public function print_test_report(Request $req){

        $params = array(
            'username' => 1,
            'is_active' => 1
        );

        $report_name = 'ContractDetailsReport';
        $report = generateJasperReport($report_name, 'TestReport_' . time(), 'pdf', $params);
        return $report;
    } public function printProductInformationReport(Request $request)
    {

        $table_name = $request->input('table_name');
        $application_id = $request->input('application_id');

        $params = array(
            'application_id' => $application_id,
			 'base_url' => $this->base_url,
			'base_Url' => $this->base_url
        );

       $report = generateJasperReport('pir_form', 'Product Information Review' . time(), 'pdf', $params);

        return $report;
    }
    public function generateProductEvaluationReport(Request $request)
    {

        $table_name = $request->input('table_name');
        $application_code = $request->input('application_code');

        $params = array(
            'application_code' => $application_code,
			 'base_url' => $this->base_url,
			'base_Url' => $this->base_url
        );

       $report = generateJasperReport('productEvaluationReport', 'Product Evaluation Report' . time(), 'pdf', $params);

        return $report;
    }
    public function generateProductAuditReport(Request $request)
    {

        $table_name = $request->input('table_name');
        $application_code = $request->input('application_code');

        $params = array(
            'application_code' => $application_code,
			 'base_url' => $this->base_url,
			'base_Url' => $this->base_url
        );


       $report = generateJasperReport('productAuditingReport', 'Product Auditing Report' . time(), 'pdf', $params);

        return $report;
    }

	function getReportsletterheader(){
			// $org_info = DB::table('tra_organisation_information')->first();

			$org_info = $this->getOrganisationInfo();
			PDF::SetFont('times', 'B', 16);
			PDF::Cell(0, 6, $org_info->org_name, 0, 1, 'C');
			$logo = getcwd() . '/resources/images/zamra-logo.png';
			PDF::SetFont('times', 'B', 10);
			PDF::Image($logo, 84, 18, 30, 18);
			PDF::SetFont('times', '', 10);
			PDF::Cell(0, 10, '', 0, 1);
			PDF::Cell(20, 7, 'Email: ', 0, 0);
			PDF::Cell(128, 7, $org_info->email, 0, 0);
			PDF::Cell(0, 7, $org_info->street, 0, 1, 'l');

			PDF::Cell(20, 7, 'Tel: ', 0, 0);
			PDF::writeHTMLCell(128, 25, '', '', $org_info->telephone, 0, 0, '', '', 'L');
			PDF::Cell(0, 7, $org_info->location, 0, 1, '');
			PDF::Cell(40, 7, 'Toll Free: 0800 110 084 ', 0, 0);
			PDF::Cell(108);
			PDF::Cell(0, 7, 'P.O. Box 1253,', 0, 1, '');

			PDF::Cell(20, 7, 'Website: ', 0, 0);
			PDF::Cell(128, 7,$org_info->website, 0, 0);
			PDF::Cell(0, 7, $org_info->region_name, 0, 1, '');
			//PDF::Cell(148);

			//$left_address = "All letters should be addressed to the Director General<br/>In reply please quote our Ref No:";

			//PDF::writeHTMLCell(100, 5, '', '', $left_address, 0, 0, '', '', 'L');
			PDF::SetLineWidth(0.7);
			PDF::Line(0,67,350,67);
		}
		function getOrganisationInfo(){
			$data = array('org_name'=>strtoupper('Zambia Medicines Regulatory Authority'),
								'postal_address'=>'P.O. Box 31890,',
								'region_name'=>'Lusaka, Zambia',
								'email'=>'pharmacy@zamra.co.zm',
								'website'=>'www.zamra.co.zm',
								'street'=>'Off Kenneth Kaunda International Airport Road,',
								'location'=>' Plot No. 2350/M.',
								'act'=>'(The Medicines and Allied Substances Act, 2013)',
								'fax'=>'',
								'telephone'=>'+260 211 432 350, +260 211 432 351,+260 211 432 352',
								'org_acynm'=>'ZAMRA',
								'logo'=>'logo.jpg',

						);
			$org_info = (object)$data;
			return $org_info;
		}
		function getReportheader($title) {
			$org_info = $this->getOrganisationInfo();

			$logo = getcwd() . '/resources/images/zamra-logo.png';

			PDF:: SetFont('times', 'B', 12);
			PDF::Cell(0,6,'',0,1,'C');
			PDF:: Cell(0, 6, strtoupper($org_info->org_name), 0, 1, 'C');
			//$logo=getcwd().'/assets/images/logo.jpg';
			PDF:: SetFont('', 'B', 9);
			//PDF::Cell(0,5,'',0,2);
			PDF:: Cell(0, 6, $org_info->postal_address.' '.$org_info->region_name, 0, 1, 'C');
			PDF:: Cell(0, 6, 'Tel:       '.$org_info->telephone.' Fax: '.$org_info->fax, 0, 1, 'C');
			PDF:: Cell(0, 6, 'Website: '.$org_info->website.', Email: '.$org_info->email, 0, 1, 'C');
			PDF:: Cell(0, 5, '', 0, 2);
			PDF:: Image($logo, 86, 40, 35, 25);
			PDF:: Cell(0, 20, '', 0, 2);
			PDF:: SetFont('times', 'B', 11);
			PDF:: Cell(0, 5, $title, 0, 1, 'C');
			PDF:: SetFont('times', 'B', 11);

		}
		 public function generateProductNotificationCertificate(Request $request)
		{
				try{
					$application_code = $request->input('application_code');
					$document_number = 'BVS/099/45';
					$certificate_name = 'MEDICAL DEVICES NOTIFICATION CERTIFICATE';
					$qry = DB::table('tra_product_applications as t1')
							->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
							->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
							->leftJoin('tra_product_information as t7', 't1.product_id', '=', 't7.id')
							->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
							->leftJoin('par_classifications as t14', 't7.classification_id', '=', 't14.id')
							->select('t1.*', 't3.name as trader_name','t3.physical_address as trader_address','t10.name as region_name' , 't9.name as country_name','t4.name as application_status', 't6.name as dg_recommendation', 't5.decision_id as recommendation_id','t7.gmdn_term as gmdn_name','t7.gmdn_code',
								't1.id as active_application_id', 't7.brand_name', 't8.name as common_names', 't14.name as classification','t5.expiry_date','t11.name as localAgentName','t11.physical_address as local_agent_address', 't5.certificate_no', 't5.approval_date', 't13.name as manufacturer','t5.certificate_issue_date'
								)
							->join('tra_approval_recommendations as t5', function ($join) {
								$join->on('t1.id', '=', 't5.application_id')
									->on('t1.application_code', '=', 't5.application_code');
							})

							->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
							->leftJoin('par_regions as t10', 't3.region_id', '=', 't8.id')
							->leftJoin('par_countries as t9', 't3.country_id', '=', 't9.id')
							->leftJoin('wb_trader_account as t11', 't1.local_agent_id', '=', 't11.id')
							->leftJoin('tra_product_manufacturers as t12', 't1.product_id', '=', 't12.product_id')
							->leftJoin('tra_manufacturers_information as t13', 't12.manufacturer_id', '=', 't13.id')

							->where(array('t1.application_code' => $application_code));


						$row = $qry->first();

					if(!empty($row) && $row->recommendation_id == 1){
						$product_id =$row->product_id;
						PDF::AddPage();
					PDF::SetLineWidth(0.4);
								PDF::Rect(3,3,204,285);

								$logo2=getcwd() . '/assets/images/shield.jpg';
								$org_info = $this->getOrganisationInfo();
						$logo = getcwd() . '/resources/images/zamra-logo.png';
								PDF::Image($logo,80,15,55,18);

								PDF::SetFont('','B',14);
								PDF::Cell(0,28,'',0,1);
								//PDF::Cell(78);
								PDF::Cell(0,7,'THE UNITED REPUBLIC OF TANZANIA',0,1,'C');
								PDF::Cell(0,7,'MINISTRY OF HEALTH AND SOCIAL WELFARE',0,1,'C');
								PDF::Cell(0,7,$org_info->org_name,0,1,'C');
								PDF::Cell(0,5,'',0,1);
								PDF::Cell(0,7,'CERTIFICATE OF NOTIFICATION',0,1,'C');
								PDF::SetFont('times','',12);

								PDF::SetFont('','B',10, true);

								PDF::MultiCell(0,7,'Made under Section 53(4) (iii) of the Tanzania Food, Drugs and Cosmetics Act 2003)',0,'C');

								PDF::Cell(0,5,'',0,1);

								//reg No
								PDF::SetFont('times','',11);
								//PDF::Cell(0,10,'',0,1);
								PDF::Cell(2);
								PDF::Cell(70,0,'Product registration number:',0,0,'L');
								PDF::SetFont('times','B',11);
								//PDF::Cell(40);
								PDF::Cell(0,0,$row->certificate_no,0,1,'L');

								PDF::SetFont('times','',11);
								PDF::Cell(0,5,'',0,1);
								PDF::Cell(2);
								PDF::MultiCell(0,5,'This is to certify that the medical device described below has been registered in Tanzania.',0,'L');
								//Brand Name
								PDF::SetFont('times','',11);
								PDF::Cell(0,5,'',0,1);
								PDF::Cell(2);
								PDF::Cell(70,8,'Brand/Trade Name:',0,0,'L');
								PDF::SetFont('times','B',11);

								PDF::Cell(10,8,strtoupper($row->brand_name),0,1,'L');
								//Common Name
								PDF::SetFont('times','',11);
								//PDF::Cell(0,8,'',0,1);
								PDF::Cell(2);

								PDF::MultiCell(70,8,'Common Name:',0,'',0,0);
								PDF::SetFont('times','B',11);

								PDF::MultiCell(0,8,strtoupper($row->common_names),0,'',0,1);
								PDF::SetFont('times','',11);

								//Classification
								PDF::SetFont('times','',11);

								PDF::Cell(2);
								PDF::Cell(70,8,'Class of the device:',0,0,'L');
								PDF::SetFont('times','B',11);
								//PDF::Cell(40);
								PDF::Cell(20,8,strtoupper($row->classification),0,1,'L');

								//Classification
								PDF::SetFont('times','',11);

								PDF::Cell(2);
								PDF::Cell(70,8,'GMDN Code and Term:',0,0,'L');
								PDF::SetFont('times','B',11);
								$details = '-';
								 $gmdn_name = $row->gmdn_name;
								 $gmdn_code = $row->gmdn_code;
								if($gmdn_name != '' and $gmdn_name != '-'){
									$details = $gmdn_name.' & '.$gmdn_code;
								}


								PDF::MultiCell(0,8,strtoupper($details),0,'',0,1);
								//Classification
								PDF::SetFont('times','',11);
								/*
								PDF::Cell(2);

								PDF::MultiCell(70,8,'Commercial Presentation:',0,'',0,0);
								PDF::SetFont('times','B',11);
								PDF::MultiCell(0,8,strtoupper($commercial_repre),0,'',0,1);
								*/
								//Applicant Name
								PDF::SetFont('times','',11);

								PDF::Cell(2);
								//PDF::Cell(70,8,'Name of Registrant:',0,0,'L');
								PDF::MultiCell(70,8,'Name of Registrant:',0,'',0,0);
								PDF::SetFont('times','B',11);
								//PDF::Cell(40);
								$manufacturer_name='';
									$man_postal_address='';
									$man_physical_address='';
									$man_regionName='';
									$man_countryName='';
								PDF::MultiCell(0,8,strtoupper($row->trader_name),0,'',0,1);
								   $manrow = DB::table('tra_product_manufacturers as t1')
									->select('t1.*', 't2.email_address','t1.id as manufacturer_id', 't2.physical_address', 't2.name as manufacturer_name','t2.postal_address', 't3.name as country_name', 't4.name as region_name', 't5.name as district_name')
									->join('tra_manufacturers_information as t2', 't1.manufacturer_id', '=', 't2.id')
									->join('par_countries as t3', 't2.country_id', '=', 't3.id')
									->leftJoin('par_regions as t4', 't2.region_id', '=', 't4.id')
									->leftJoin('par_districts as t5', 't2.district_id', '=', 't5.id')
									->leftJoin('par_manufacturing_roles as t6', 't1.manufacturer_role_id', '=', 't6.id')
									->where(array('t1.product_id' => $product_id, 'manufacturer_type_id' => 1))
									->first();
								if($manrow){
									$manufacturer_name=$manrow->manufacturer_name;
									$man_postal_address=$manrow->postal_address;
									$man_physical_address=$manrow->physical_address;
									$man_regionName=$manrow->region_name;
									$man_countryName=$manrow->country_name;
								}
								PDF::SetFont('times','',11);

								//PDF::Cell(40);
								PDF::Cell(2);

								PDF::MultiCell(70,8,'Manufacturer Name:',0,'',0,0);
								PDF::SetFont('times','B',11);
								PDF::MultiCell(0,8,strtoupper($manufacturer_name),0,'',0,1);

								PDF::Cell(72);
								PDF::MultiCell(0,8,strtoupper($man_physical_address),0,'L');
								//PDF::Cell(0,5,'',0,2);
								PDF::Cell(72);
								PDF::Cell(0,8,strtoupper($man_postal_address),0,1,'L');

								PDF::Cell(72);
								PDF::Cell(0,8,strtoupper($man_regionName  .'  '.$man_countryName),0,1,'L');
								PDF::SetFont('times','',11);

								PDF::Cell(2);
								//PDF::Cell(70,8,'Local Responsible Person:',0,0,'L');
								PDF::MultiCell(70,8,'Local Responsible Person:',0,'',0,0);
								PDF::SetFont('times','B',11);
								//PDF::Cell(40);

								PDF::MultiCell(0,8,strtoupper($row->localAgentName),0,'',0,1);
								//Reg Date
								//$reg_date=date('F d\\, Y',strtotime($registration_date));
								$reg_date = ucwords(date('F d, Y ',strtotime($row->certificate_issue_date)));
								PDF::SetFont('times','',11);

								PDF::Cell(2);
								PDF::Cell(70,8,'Issued on:',0,0,'L');
								PDF::SetFont('times','B',11);
								//PDF::Cell(40);
								$expiry_date=date('F d\\, Y',strtotime($row->expiry_date));
								PDF::Cell(20,8,$reg_date,0,1,'L');
								//expiry on

								PDF::Cell(2);
								PDF::SetFont('times','',11);
								PDF::Cell(70,8,'Expiry Date:',0,0,'L');
								PDF::SetFont('times','B',11);
								//PDF::Cell(40);

								PDF::Cell(20,8,$expiry_date,0,1,'L');
								//Name
								PDF::SetFont('times','',11);

								PDF::Cell(0,2,'',0,1);

								$signatory= '';
								$designation='';

								PDF::SetFont('times','B',11);
								$title= 'ACTING';
								$title= '';
								$approved_by = '';
								$startY = PDF::GetY();
								$startX = PDF::GetX();
								$signiture = getcwd() . '/resources/images/signatures/hi0kag.png';
								PDF::Image($signiture,$startX,$startY-7,30,12);
								PDF::SetFont('times','B',11);
								PDF::Cell(30,7,'................................',0,1,'L');
								PDF::SetFont('times','B',10);
								PDF::Cell(0,7, 'A. M. FIMBO',0,1);
								PDF::Cell(20,7,$title.' DIRECTOR GENERAL',0,1,'L');
								PDF::ln();
								PDF::SetFont('times','',7);
								PDF::MultiCell(0,3,'The certificate must be returned to the Authority if cancelled, invalidated or if registration of the medicine is withdrawn or when requested to do so by the Director General.',0,'C',0,1);

								PDF::AddPage();
								//PDF::Cell(70);

								PDF::SetFont('times','BI',11);
								PDF::Cell(0,7,'Conditions of Registration',0,1,'L');
								PDF::SetFont('times','',10);
								PDF::Cell(0,6,'',0,1);
								PDF::Cell(10);
								PDF::MultiCell(0,7,'1. Registrant and local Responsible Person shall retain records of the distribution of all medical devices registered. The distribution records for class B, class C and class D shall be retained for a minimum of 3 years.',0,'L');

								PDF::Cell(0,6,'',0,1);
								PDF::Cell(10);
								PDF::MultiCell(0,7,'2. The registrant shall ensure that the manufacturing facilities where a registered medical device is produced comply at all times with Quality Management System Requirements.',0,'L');

								PDF::Cell(0,6,'',0,1);
								PDF::Cell(10);
								PDF::MultiCell(0,7,'3. Registrant and Local Responsible Person shall ensure that a medical device within their control is stored and transported in accordance with the instructions and information provided by the manufacturer.',0,'L');

								PDF::Cell(0,6,'',0,1);
								PDF::Cell(10);
								PDF::MultiCell(0,7,'4. All changes with regard to a registered medical device should be notified to the Authority by the registrant for approval prior to to their implementation.',0,'L');

								PDF::Cell(0,6,'',0,1);
								PDF::Cell(10);
								PDF::MultiCell(0,7,'5. Registered device can not be advertised without prior approval from the Authority.',0,'L');


					}else{
						$this->generateLetterOfREjection($application_code,$req,$module_id);
					}
				PDF::Output();
				return;
			} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}

        return response()->json($res);
		}

    	public function generateProductNotificationApprovalLetter(Request $req){
			try{
				$application_code = $req->application_code;

				PDF::setPrintHeader(false);
				PDF::setPrintFooter(false);
				PDF::AddPage();
				$this->getReportsletterheader();

				PDF::Cell(0,20,'',0,1);
				$qry = DB::table('tra_product_applications as t1')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->leftJoin('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('par_classifications as t14', 't7.classification_id', '=', 't14.id')
                ->select('t1.*', 't3.name as trader_name','t3.physical_address as trader_address','t10.name as region_name' , 't9.name as country_name','t4.name as application_status', 't6.name as dg_recommendation', 't5.decision_id as recommendation_id',
                    't1.id as active_application_id', 't7.brand_name', 't8.name as common_names', 't14.name as classification','t5.expiry_date','t11.name as local_agent','t11.physical_address as local_agent_address', 't5.certificate_no', 't5.approval_date', 't13.name as manufacturer'
                    )
                ->join('tra_approval_recommendations as t5', function ($join) {
                    $join->on('t1.id', '=', 't5.application_id')
                        ->on('t1.application_code', '=', 't5.application_code');
                })

                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                ->leftJoin('par_regions as t10', 't3.region_id', '=', 't8.id')
                ->leftJoin('par_countries as t9', 't3.country_id', '=', 't9.id')
				->leftJoin('wb_trader_account as t11', 't1.local_agent_id', '=', 't11.id')
				->leftJoin('tra_product_manufacturers as t12', 't1.product_id', '=', 't12.product_id')
				->leftJoin('tra_manufacturers_information as t13', 't12.manufacturer_id', '=', 't13.id')

                ->where(array('t1.application_code' => $application_code));


            $row = $qry->first();


				if($row){

					 PDF::SetFont('times','B',11);
					PDF::Cell(45,7,'Ref. No: '.$row->reference_no,0,0);
					PDF::Cell(0,7,'Date: '.date('F d, Y '),0,1,'R');
					PDF::SetFont('times','',11);
					//PDF::Cell(45,10,'Address of the Applicant:',0,1);
					PDF::Cell(0,7,strtoupper($row->trader_name),0,1);
					PDF::Cell(0,7,$row->trader_address.', '.$row->region_name.', '.$row->country_name,0,1);
					PDF::Cell(0,7,$row->country_name,0,1);
					$recommendation_id = $row->recommendation_id;
					if($recommendation_id == 1){
						PDF::Cell(8,2,'',0,1);

						$expiry_date=date('F d\\, Y',strtotime($row->expiry_date));
						PDF::SetFont('times','B',11);
						PDF::MultiCell(0,5,strtoupper('RE: APPROVAL OF NOTIFICATION TO  '.$row->brand_name.'('.$row->common_names.')'),0, '', 0, 1, '', '', true);
						PDF::Cell(8,2,'',0,1);
						PDF::SetFont('times','',11);
						PDF::Cell(8,5,'1. ',0,0);
						PDF::MultiCell(0,10,"Reference is made to  your application for notification of the above product manufactured by  ".$row->manufacturer.". \n",0, 'J', 0, 1, '', '', true);
						PDF::Cell(8,2,'',0,1);

						PDF::Cell(8,5,'2. ',0,0);
						PDF::MultiCell(0,10,"The Authority would like to inform you that, the above mentioned product has been granted notification approval with effect from  ".date('F d\\, Y',strtotime($row->approval_date))."\n",0, '', 0, 1, '', '', true);
						PDF::Cell(8,2,'',0,1);

						PDF::Cell(8,5,'3. ',0,0);
						PDF::MultiCell(0,10,"The product has been assigned with notification number ".$row->certificate_no." and you are allowed to market and sale the product in Tanzania for the period of three (3) years of which you will be required to submit an application for renewal of notification.\n",0, 'J', 0, 1, '', '', true);
						PDF::Cell(8,2,'',0,1);

						PDF::Cell(8,5,'4. ',0,0);
						PDF::MultiCell(0,10,"You are reminded to ensure that all aspects related to manufacture, use, storage and distribution of the product with regulation for control of medical devices in Tanzania throughout the authorization period.\n",0, 'J', 0, 1, '', '', true);
						PDF::Cell(8,2,'',0,1);
						PDF::Cell(8,5,'5. ',0,0);
						PDF::MultiCell(0,10,"We thank you for your cooperation.\n",0, 'J', 0, 1, '', '', true);

						PDF::Cell(8,2,'',0,1);

					}
					else{


					}
				}

				PDF::Output();
				return;
			} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}

        return response()->json($res);
		}
public function generateProductsNotificationRpt(Request $req){
            try{
                $application_code = $req->application_code;

                PDF::setPrintHeader(false);
                PDF::setPrintFooter(false);
                PDF::AddPage();
                //get the products dteails manufacturer_id
                $record = DB::connection('portal_db')->table('wb_product_applications as t1')
                                ->join('wb_product_information as t2', 't1.product_id', 't2.id')
                                ->join('wb_statuses as t3', 't1.application_status_id', 't3.id')
                                ->join('wb_trader_account as t4', 't1.trader_id', 't4.id')
                                ->join('wb_trader_account as t5', 't1.local_agent_id', 't5.id')
                                ->leftJoin('wb_product_manufacturers as t6', 't1.product_id', 't6.product_id')
                                ->select(DB::raw("t1.tracking_no,t2.brand_name, t4.name as trader_name, t4.physical_address,t4.telephone_no, t4.email as traderemail_address,t5.name as local_agent,t5.physical_address as localagent_address,t5.email as  localagentemail, t6.manufacturer_id, t2.common_name_id, t2.classification_id,intended_enduser_id,intended_use,gmdn_code,gmdn_term"))
                                ->where('t1.application_code', $application_code)
                                ->first();
                if($record){
                    $this->getReportsletterheader();
                    PDF::Cell(0,10,'',0,1);
                PDF::SetFont('times','B',13);
                PDF::ln();
                PDF::Cell(50,7,'IVD & MEDICAL DEVICES NOTIFICATION FORM',0,0);
                //the details
                PDF::ln();
				PDF::SetFont('times','',8);
				PDF::Cell(50,7,'Tracking No: '.$record->tracking_no,0,0);
				PDF::Cell(0,7,'Print Date: '.date('Y-m-d H:i:s'),0,1,'R');

				PDF::SetFont('times','',9);
				PDF::Cell(10,7,'1.',1,0);
				PDF::Cell(0,7,'Trader  Details',1,1);


				PDF::MultiCell(10,12,'1.2',1,'','',0);
				PDF::MultiCell(80,12,'Trader',1,'','',0);
				PDF::MultiCell(0,12,$record->trader_name,1,'','',1);

				PDF::MultiCell(10,12,'1.2',1,'','',0);
				PDF::MultiCell(80,12,'Full address and contact details (phone number, email address) of the applicant ',1,'','',0);
				PDF::MultiCell(0,12,$record->physical_address,1,'','',1);
                PDF::MultiCell(0,12,$record->telephone_no.' Email Address: '.$record->traderemail_address,1,'','',1);

				PDF::MultiCell(10,12,'1.3',1,'','',0);
				PDF::MultiCell(80,12,'Name of local responsible person (contact – phone, email)',1,'','',0);
				PDF::MultiCell(0,12,$record->local_agent.' Email Address: '.$record->localagentemail,1,'','',1);


				PDF::Cell(10,7,'2.',1,0);
				PDF::Cell(0,7,'Details of the Manufacturer',1,1);

				PDF::MultiCell(10,9,'2.1',1,'','',0);
				PDF::MultiCell(80,9,'Name of the Manufacturer',1,'','',0);

				$man_record = DB::connection('')
                                    ->table('tra_manufacturers_information as t1')
                                    ->select('t1.*', 't1.id as manufacturer_id', 't1.name as manufacturer_name', 't2.name as country', 't3.name as region', 't4.name as district')
                                    ->join('par_countries as t2', 't1.country_id', '=', 't2.id')
                                    ->join('par_regions as t3', 't1.region_id', '=', 't3.id')
                                    ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                                    ->where(array('t1.id' => $record->manufacturer_id))
                                    ->first();
                if($man_record){
                    PDF::MultiCell(0,9,$man_record->manufacturer_name,1,'','',1);
                    PDF::MultiCell(10,12,'2.2',1,'','',0);

                    PDF::MultiCell(80,12,'Full address and contact details (phone number, email address) of the manufacturer',1,'','',0);
                    PDF::MultiCell(0,12,$man_record->physical_address.' '.$man_record->country,1,'','',1);

                }
                else{
                    PDF::MultiCell(0,9,'',1,'','',1);
                    PDF::MultiCell(10,12,'2.2',1,'','',0);

                    PDF::MultiCell(80,12,'Full address and contact details (phone number, email address) of the manufacturer',1,'','',0);
                    PDF::MultiCell(0,12,'',1,'','',1);
                }

				PDF::Cell(10,7,'3.',1,0);
				PDF::Cell(0,7,'Details of the IVD Medical Device',1,1);

				PDF::MultiCell(10,9,'3.1',1,'','',0);
				PDF::MultiCell(80,9,'Brand name of the device',1,'','',0);
				PDF::MultiCell(0,9,$record->brand_name,1,'','',1);

				PDF::MultiCell(10,9,'3.2',1,'','',0);
				PDF::MultiCell(80,9,'Common name or Preferred name ',1,'','',0);
				PDF::MultiCell(0,9,getSingleRecordColValue('par_common_names', array('id' => $record->common_name_id ), 'name'),1,'','',1);

				PDF::MultiCell(10,9,'3.3',1,'','',0);
				PDF::MultiCell(80,9,'**Device class',1,'','',0);
				PDF::MultiCell(0,9,getSingleRecordColValue('par_classifications', array('id' => $record->classification_id ), 'name'),1,'','',1);

				PDF::MultiCell(10,9,'3.4',1,'','',0);
				PDF::MultiCell(80,9,'GMDN Name',1,'','',0);
				PDF::MultiCell(0,9,$record->gmdn_term,1,'','',1);

				PDF::MultiCell(10,9,'3.5',1,'','',0);
				PDF::MultiCell(80,9,'GMDN Code',1,'','',0);
				PDF::MultiCell(0,9,$record->gmdn_code,1,'','',1);

				PDF::MultiCell(10,9,'3.6',1,'','',0);
				PDF::MultiCell(80,9,'Intended use as stated by the manufacturer',1,'','',0);
				PDF::MultiCell(0,9,$record->intended_use,1,'','',1);

				PDF::MultiCell(10,9,'3.6',1,'','',0);
				PDF::MultiCell(80,9,'Intended user of the IVD medical device',1,'','',0);
				PDF::MultiCell(0,9,getSingleRecordColValue('par_intended_enduser', array('id' => $record->intended_enduser_id ), 'name'),1,'','',1);

				PDF::ln();
				PDF::MultiCell(100,6,'Name of authorized person:'.$record->trader_name,0,'','',0);
				PDF::MultiCell(40,6,'Signature:....................',0,'','',0);
				PDF::MultiCell(0,6,'Date:..........................',0,'','',1);
				//PDF::MultiCell(0,8,'Official Stamp:',0,'','',1);
				//the signatory details
				PDF::Cell(0,7,'CE: European Conformity',0,1);
				PDF::Cell(0,7,'**Device class: Classification as per GHTF Rules',0,1);
				PDF::Cell(0,7,'USFDA: United States Food and Drug Administration',0,1);
				PDF::Cell(0,7,'GMDN: Global Medical Device Nomenclature',0,1);
				PDF::Cell(0,7,'IFU: Instruction for Use',0,1);

                }
            	PDF::Output();
				return;
			} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}

        return response()->json($res);


        }
    function funcGenerateCreditNote($receipt_id){
		try{

			$record = DB::table('tra_payments as t1')
								->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
								->join('par_currencies as t3', 't1.currency_id', 't3.id')
								->join('par_countries as t4', 't2.country_id', 't4.id')
								->join('par_regions as t5', 't2.region_id', 't5.id')
								->select('t1.*', 't2.name as applicant_name','t2.postal_address','t4.name as countryName','t5.name as regionName', 't3.name as currency_name')
								->where('t1.id',$receipt_id)
								->first();
			if($record){
				PDF::setPrintHeader(false);
                PDF::setPrintFooter(false);
                PDF::AddPage();
				$this->getReportheader('Credit Note');

				PDF::Cell(0,4,'',0,1);
				PDF::Cell(117);
				PDF::SetFont('','',10);
				PDF::Cell(20,4,'Print Date: '.date('d/m/Y'),0,1);
				PDF::Cell(0,4,'',0,1);

				PDF::SetFont('','B',10);
				PDF::Cell(30,1,'Received From: ',0,0,'L');
				PDF::SetFont('','',10);
				//PDF::Cell(50);
				PDF::Cell(100,1,$record->applicant_name,0,0,'L');
				//PDF::Cell(120,0,'',0,0);
				PDF::SetFont('','B',10);
				PDF::Cell(20,1,'Date: ',0,0,'L');
				//PDF::Cell(135,0,'',0,0);
				PDF::SetFont('','',10);
				PDF::Cell(100,1,date('d-m-Y',strtotime($record->trans_date)),0,1,'L');

				PDF::Cell(0,3,'',0,1);
				//PDF::Cell(20,0,'',0,1);
				PDF::SetFont('','B',10);
				PDF::Cell(30,1,'Address: ',0,0,'L');
				PDF::SetFont('','',10);
				//PDF::Cell(20,0,'',0,0);
				PDF::Cell(100,1,$record->postal_address,0,0,'L');
				//PDF::Cell(120,0,'',0,0);
				PDF::SetFont('','B',10);
				PDF::Cell(20,1,'Time: ',0,0,'L');
				//PDF::Cell(135,0,'',0,0);
				PDF::SetFont('','',10);
				PDF::Cell(100,1,date('H:i:s',strtotime($record->trans_date)),0,1,'L');

				PDF::Cell(0,3,'',0,1);
				PDF::SetFont('','B',10);
				PDF::Cell(30,1,'',0,0,'L');
				PDF::SetFont('','',10);
				//PDF::Cell(20,0,'',0,0);
				PDF::Cell(100,1,$record->regionName,0,0,'L');
				//PDF::Cell(120,0,'',0,0);
				PDF::SetFont('','B',10);
				PDF::Cell(20,1,' No: ',0,0,'L');
				//PDF::Cell(135,0,'',0,0);
				PDF::SetFont('','',10);
				PDF::Cell(100,1,$record->receipt_no,0,1,'L');

				PDF::Cell(0,3,'',0,1);
				PDF::SetFont('','B',10);
				PDF::Cell(30,1,'',0,0,'L');
				PDF::SetFont('','',10);
				//PDF::Cell(20,0,'',0,0);
				PDF::Cell(100,1,$record->countryName,0,0,'L');
				//PDF::Cell(120,0,'',0,0);
				PDF::SetFont('','B',10);

				//PDF::Cell(135,0,'',0,0);
				PDF::SetFont('','',10);

				//PDF::Cell(100,1,$invoice_no,0,1,'L');

				PDF::Cell(0,15,'',0,1);
				PDF::Cell(0,4,'The sum of ',0,1,'L');
				PDF::SetFont('','B',10);
				//PDF::Cell(60,0,'',0,0);
				PDF::Cell(0,4,$record->currency_name.' '.$this->convert_number_to_words($record->amount_paid),0,1,'L');

				PDF::Cell(0,10,'',0,1);
				PDF::SetFont('','B',10);
				PDF::Cell(0,0,'Remarks: PAYMENTS REVIEWS -'.$record->reference_no .' '.$record->tracking_no,0,1);
				PDF::SetFont('','B',10);
				PDF::Cell(45,5,'',0,1);

				PDF::Cell(120,10,'Applicant Name',1,0);
				PDF::Cell(0,10,'Amount in '.$record->currency_name,1,1);
				PDF::SetFont('','',10);
				PDF::Cell(120,7,$record->applicant_name,1,0,'L');
				PDF::Cell(0,7,formatMoney($record->amount_paid).' '.$record->currency_name.' ',1,1);
				PDF::SetFont('','B',11);
				PDF::Cell(0,10,'',0,1);
				PDF::Cell(120,10,'Requested Received By',0,0);

				PDF::Cell(0,10,'For: Tanzania Medicines & Medical Devices Authority',0,1,'R');

				PDF::Output();


			}


				return;
			} catch (\Exception $exception) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $exception->getMessage()
				);
			} catch (\Throwable $throwable) {
				//DB::rollBack();
				$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
				);
			}
			print_r($res);

	}
	function getReportheaderLandscape($title) {

			$org_info = $this->getOrganisationInfo();
			PDF:: SetFont('', 'B', 12);
			//PDF:: Cell(0,6,strtoupper('Ministry of Health,Community Development,Gender,Eldery & Children'),0,1,'C');
			PDF:: Cell(0, 6, $org_info->org_name, 0, 1, 'C');
			$logo = getcwd() . '/resources/images/zamra-logo.png';
			PDF:: SetFont('', 'B', 9);
			//PDF::Cell(0,5,'',0,2);
			PDF:: Cell(0, 6, $org_info->postal_address.' '.$org_info->region_name, 0, 1, 'C');
			PDF:: Cell(0, 6, 'Tel:       '.$org_info->telephone.' Fax: '.$org_info->fax, 0, 1, 'C');
			PDF:: Cell(0, 6, 'Website: '.$org_info->website.', Email: '.$org_info->email, 0, 1, 'C');
			PDF:: Cell(0, 5, '', 0, 2);
			PDF:: Image($logo, 134, 34, 35, 14);
			PDF:: Cell(0, 10, '', 0, 2);
			PDF:: SetFont('', 'B', 11);
			PDF:: Cell(0, 5, $title, 0, 1, 'C');
			PDF:: SetFont('', 'B', 11);

		}
		public function generateSelectedRetentionInvoiceStatement(Request $req){
					try{

							$applicant_id = $req->applicant_id;
							$section_id = $req->section_id;
							$retention_yearfrom = $req->retention_yearfrom;
							$retention_yearto = $req->retention_yearto;
							$retention_ids = ltrim($req->retention_ids,',');//ltrim($str,"Hello");



							$applicant_record =DB::table('wb_trader_account as t1')
																->leftJoin('par_regions as t2', 't1.region_id', 't2.id')
																->leftJoin('par_countries as t3', 't1.country_id', 't3.id')
																->select('t1.name as applicant_name', 't2.name as region_name', 't3.name as country_name', 't1.postal_address')
																->where('t1.id',$applicant_id)
																->first();
							$retention_invoices = DB::table("tra_product_retentions as t1")
													->select(DB::raw("t4.reference_no,t1.id as retention_id, t2.registration_no as certificate_no, YEAR(t1.retention_year) AS retention_year, t1.reg_product_id,t3.brand_name,t4.invoice_no,t4.date_of_invoicing,t5.element_costs_id, t4.PayCntrNum as payment_controlno, t7.name AS currency, SUM(t5.element_amount) AS invoice_amount,t11.name as costs_element, SUM(t5.element_amount*t5.exchange_rate) AS  amount_in_tsh , t8.name AS retention_status,t9.name as applicant_name,t5.exchange_rate , t4.applicant_id"))
													->join("tra_registered_products as t2",'t1.reg_product_id','=','t2.id')
													->join("tra_product_information as t3",'t2.tra_product_id','=','t3.id')
													->join("tra_application_invoices as t4",'t1.invoice_id','=','t4.id')
													->join("tra_invoice_details as t5",'t4.id','=','t5.invoice_id')
													->join("par_currencies as t7",'t4.paying_currency_id','=','t7.id')
													->join("par_retention_statuses as t8",'t1.retention_status_id','=','t8.id')
													->leftJoin("wb_trader_account as t9",'t4.applicant_id','=','t9.id')
													->leftJoin("tra_element_costs as t10",'t5.element_costs_id','=','t10.id')
													->leftJoin("par_cost_elements as t11",'t10.element_id','=','t11.id')
													->where('t1.retention_status_id',1)
													->groupBy('t1.invoice_id');

								if($retention_ids != '' && !empty($retention_ids)){

									$retention_ids = explode(",",$retention_ids);

									$retention_invoices->whereIn('t1.id',$retention_ids );

								}
								else {
									if(validateIsNumeric($applicant_id)){
										$retention_invoices->where('t4.applicant_id',$applicant_id );
									}
								}
								if(validateIsNumeric($section_id)){
									$retention_invoices->where('t3.section_id',$section_id );
								}
								if(validateIsNumeric($retention_yearto)){
									$retention_invoices->whereRaw(" YEAR(t1.retention_year) <= '".$retention_yearto."'");

								}
								if(validateIsNumeric($retention_yearfrom)){
									$retention_invoices->whereRaw(" YEAR(t1.retention_year) >= '".$retention_yearfrom."'");

								}


$retention_invoices = $retention_invoices->get();
PDF::setPrintHeader(false);
											PDF::setPrintFooter(false);
											PDF::AddPage('L');
							PDF::setPrintHeader(false);
							PDF::setPrintFooter(false);

							PDF::SetFont('','B',11);
							$this->getReportheaderlandscape('Retention Fee Proforma Invoice');

							PDF::Cell(0,2,'',0,1);
							//PDF::Cell(117);
							PDF::SetFont('','',11);
							PDF::Cell(0,4,'Print Date: '.date('d/m/Y'),0,1,'R');
							PDF::SetFont('','B',10);
							//PDF::Cell(0,3,'',0,1);

							PDF::Cell(52,3,"Customer's Name: ",0,0,'L');
							PDF::SetFont('','',10);
							PDF::Cell(100,5,$applicant_record->applicant_name,0,1,'L');
							PDF::SetFont('','B',10);

							PDF::Cell(52,3,"Address: ",0,0,'L');
							PDF::SetFont('','',10);

							PDF::Cell(100,3,$applicant_record->postal_address.','.$applicant_record->region_name.', '.$applicant_record->country_name,0,1,'L');

						if($retention_invoices){

									PDF::Cell(0,2,'',0,1,'L');

									PDF::SetFont('','B',9);
									//PDF::Cell(10);

									$data=array();
									//reg_product_id
									$tot_rec_inv=0;
									$tot_inv_usd=0;
									$tot_inv_tshs=0;
									//the headings
									PDF::MultiCell(7, 8, 'No',1,'','',0);

														PDF::MultiCell(50, 8, 'Brand Name',1,'','',0);

														PDF::MultiCell(40, 8, 'Registration No',1,'','',0);
														PDF::MultiCell(40, 8, 'Description',1,'','',0);
														PDF::MultiCell(15, 8, 'Year',1,'','',0);
														PDF::MultiCell(30, 8,'Invoice No',1,'','',0);
														PDF::MultiCell(30, 8,'Payment Request No:',1,'','',0);
														PDF::MultiCell(20, 8,'Amount',1,'','',0);
														PDF::MultiCell(20, 8,'Currency',1,'','',0);
														PDF::MultiCell(0, 8, 'Amount(ZMW)',1,'','',1);

																//50 45 30 25 35

									$i = 1;
									$dimensions = PDF::getPageDimensions();
						$hasborder = false;

						$currency_usd = '';
						$currency_tshs = '';

									foreach($retention_invoices as $retention_invoice){

									PDF::SetFont('','',9);
										$row = $retention_invoice;
										$reg_product_id = $retention_invoice->reg_product_id;
										$retention_id = $retention_invoice->retention_id;


															$reference_no = $row->reference_no;
															$invoice_no = $row->invoice_no;
															$date_of_invoicing = $row->date_of_invoicing;
															$currency = $row->currency;
															$exchange_rate = $row->exchange_rate;
															$invoice_amount = $row->invoice_amount;
															$amount_in_tsh = $row->amount_in_tsh;
															$element_costs_id = $row->element_costs_id;
															$payment_controlno = $row->payment_controlno;
															//get invoice desription

															$retention_year = $row->retention_year;
															$costs_element = $row->costs_element;
															//get the product details
															$brand_name = $row->brand_name;
															$certificate_no = $row->certificate_no;


															$rowcount = 0;


																$rowcount = 0;

																	$rowcount = max(PDF::getNumLines($brand_name, 55),PDF::getNumLines($invoice_no, 35),PDF::getNumLines($amount_in_tsh, 30),PDF::getNumLines($certificate_no, 35),PDF::getNumLines($costs_element, 20),PDF::getNumLines($payment_controlno, 35));

																	$startY = PDF::GetY();
																	if (($startY + $rowcount * 5) + $dimensions['bm'] > ($dimensions['hk'])) {

																		if ($hasborder) {
																			$hasborder = false;
																		}else {
																			PDF::Ln();
																			PDF::Cell(0,5,'','T');
																			PDF::Ln();
																		}
																		$borders = 'LTR';
																	} elseif ((ceil($startY) + $rowcount * 5) + $dimensions['bm'] == floor($dimensions['hk'])) {

																		$borders = 'LRB';
																		$hasborder = true;
																	} else {
																		//normal cell
																		$borders = 'LR';
																	}


																PDF::MultiCell(7, $rowcount* 5, $i,1,'','',0);

																PDF::MultiCell(50, $rowcount* 5, $brand_name,1,'','',0);

																PDF::MultiCell(40, $rowcount* 5, $certificate_no,1,'','',0);

																PDF::MultiCell(40, $rowcount* 5, $costs_element,1,'','',0);
																PDF::MultiCell(15,  $rowcount* 5, $retention_year,1,'','',0);
																PDF::MultiCell(30, $rowcount* 5, $invoice_no,1,'','',0);
																PDF::MultiCell(30, $rowcount* 5, $payment_controlno,1,'','',0);
																PDF::MultiCell(20, $rowcount* 5, formatMoney($invoice_amount),1,'','',0);
																PDF::MultiCell(20, $rowcount* 5, $currency,1,'','',0);
																PDF::MultiCell(0, $rowcount* 5, formatMoney($amount_in_tsh),1,'','',1);

														$currency_tshs = 'ZMW';
																$tot_inv_tshs = $tot_inv_tshs+$amount_in_tsh;

														$i = $i+1;

									}

									PDF::SetFont('','B',9);
									PDF::Cell(35);
															PDF::Cell(20,3,'',0,0);
															PDF::Cell(140);
															PDF::Cell(35,5,'',0,0);
															PDF::Cell(20,5,'Total ZMW',0,0);
															PDF::Cell(5);
															PDF::Cell(20,5,formatMoney($tot_inv_tshs),'T',0);
															PDF::Cell(20,5,'',0,1);

									PDF::SetFont('','',10);
									PDF::Ln();
									//PDF::Cell(10);
									PDF::MultiCell(0,6,'1.We declare that this invoice shows the actual price of the goods/services described and that all particulars are true and correct.',0,'L');
									PDF:: Cell(0, 4, 'All payments are based on the government payment platform using the Control Number Indicated on the Invoice Statement.', 0, 1);

									PDF::Cell(0,3,'',0,1);

									PDF::Cell(0,3,'',0,1);

									PDF::Cell(0,6,'',0,1);



						}

						PDF::Output('Retention Statement.pdf');


							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);


				}
	public function generateBatchInvoiceStatement(Request $req){
		try{
			$invoice_no = $req->invoice_no;
			$invoice_id = $req->invoice_id;
			PDF::setPrintHeader(false);
							PDF::setPrintFooter(false);

							PDF::SetFont('','B',11);

							PDF::AddPage();
						$this->getReportheader('INVOICE');

						$row = DB::table('tra_batch_invoiceapp_details as t1')
									->join('tra_application_invoices as t2', 't1.batch_invoice_id', 't2.id')
									->join('tra_invoice_details as t3', 't2.id', 't3.invoice_id')
									->join('par_currencies as t4', 't3.paying_currency_id', 't4.id')

									->leftJoin('wb_trader_account as t5', 't2.applicant_id', 't5.id')
									->leftJoin('par_regions as t6', 't5.region_id', 't6.id')
									->leftJoin('par_countries as t7', 't5.country_id', 't7.id')
									->select(DB::raw("t2.*,t3.paying_exchange_rate,t3.paying_currency_id as currency_id,t4.name as currency_name,t3.total_element_amount as invoice_total_amount, t5.name as applicant_name,t5.physical_address, t5.postal_address, t7.name as country_name, t6.name as region_name "))
									->where(array('t1.batch_invoice_id'=>$invoice_id, 't2.id'=>$invoice_id))
									->first();


						if($row){
							$currency_name = $row->currency_name;
							$payinginvoice_amount = $row->invoice_total_amount;
							$invoicing_currency_id = $row->currency_id;
							$exchange_rate = $row->paying_exchange_rate;
							PDF::SetFont('','B',10);
							PDF::Cell(100,7,'Invoice No: '.$row->invoice_no,0,0,'');
							PDF::SetFont('','B',10);
							PDF::Cell(0,7,'Date of Invoicing: '.$row->date_of_invoicing,0,1,'R');

						//	PDF::Cell(0,7,'Payment Control Number: '.$row->PayCntrNum,0,1,'');

							PDF::SetFont('','B',11);

							PDF::SetFont('','',11);
							PDF::Cell(0,7,$row->applicant_name,0,1,'');
							PDF::Cell(0,7,$row->physical_address,0,1,'');
							PDF::Cell(0,7,$row->postal_address.','.$row->region_name .' '.$row->country_name,0,1,'');
							PDF::Cell(0,7,$row->country_name,0,1,'');
							PDF::SetFont('','B',11);

							($invoice_no != 101202019708) ? PDF::Cell(0,7,'Invoice Items',0,1,''):'';
							  $batch_invoices = DB::table("tra_application_invoices as t1")
													->select(DB::raw("t1.reference_no, t1.tracking_no,t5.paying_currency_id,t1.invoice_no,t1.date_of_invoicing,t5.element_costs_id, t1.PayCntrNum as payment_controlno, t7.name AS currency, SUM(t5.element_amount) AS invoice_amount,t11.name as costs_element, t5.total_element_amount, SUM(t5.total_element_amount*t5.paying_exchange_rate) AS  amount_in_tsh , t5.paying_exchange_rate , t1.applicant_id"))

													->join("tra_invoice_details as t5",'t1.id','=','t5.invoice_id')
													->join("par_currencies as t7",'t5.paying_currency_id','=','t7.id')
													->leftJoin("tra_element_costs as t10",'t5.element_costs_id','=','t10.id')
                                                    ->leftJoin("par_cost_elements as t11",'t10.element_id','=','t11.id')
                                                    ->leftJoin("tra_batch_invoices_records as t12",'t1.id','=','t12.app_invoice_id')
													->where('t12.batch_invoice_id',$invoice_id )
													->groupBy('t1.id')
													->get();

							if($batch_invoices){
								$i = 1;
								($invoice_no != 101202019708) ? PDF::SetFont('','B',8):'';
								$total_amount = 0;

								($invoice_no != 101202019708) ? PDF::MultiCell(7,10,'Sn',1,'','',0):'';
									//PDF::MultiCell(45,10,'Reference_no',1,'','',0);
									($invoice_no != 101202019708) ? PDF::MultiCell(65,10,'Reference No',1,'','',0):'';
									($invoice_no != 101202019708) ? PDF::MultiCell(35,10,'Invoice No',1,'','',0):'';
									($invoice_no != 101202019708) ? PDF::MultiCell(45,10,'Cost Description',1,'','',0):'';
									//PDF::MultiCell(20,10,'Currency',1,'','',0);
								if($invoice_no != 101202019708){
									PDF::MultiCell(0,10,'Invoice Amount',1,'','',1);
								}
								foreach($batch_invoices as $rows){
									PDF::SetFont('','',8);
									$currency_id = $rows->paying_currency_id;
									$currency_id = $rows->paying_currency_id;
									$total_element_amount = $rows->total_element_amount;
									$amount_in_tsh = $rows->amount_in_tsh;

									$exchange_rate = $rows->paying_exchange_rate;
									($invoice_no != 101202019708) ? PDF::MultiCell(7,10,$i,1,'','',0):'';
									if($rows->reference_no != ''){
										$reference_no = $rows->reference_no;
									}
									else{
										$reference_no = $rows->tracking_no;
									}
									if($invoice_no != 101202019708){
									PDF::MultiCell(65,10,$reference_no,1,'','',0);
									PDF::MultiCell(35,10,$rows->invoice_no,1,'','',0);
									PDF::MultiCell(45,10,$rows->costs_element,1,'','',0);
									}
									if($invoicing_currency_id == $currency_id && $invoicing_currency_id ==4){
										$invoice_amount =$rows->total_element_amount;

									}
									else if($invoicing_currency_id == $currency_id){

										$invoice_amount =$rows->invoice_amount;

									}
									else if($currency_id == 4 && $invoicing_currency_id == 1){
										$invoice_amount =$rows->invoice_amount/$exchange_rate;
									}
									else{
										$invoice_amount =$amount_in_tsh;
									}
									//if()
									($invoice_no != 101202019708) ? PDF::MultiCell(0,10,formatMoney($invoice_amount),1,'','',1):'';

									$total_amount = $total_amount+$invoice_amount;
									$i++;
								}




								PDF::SetFont('','B',10);
								PDF::Cell(152,7,'Total Amount',1,0);
									PDF::Cell(0,7,formatMoney($total_amount).' '.$currency_name,1,1,'R');
							}
							PDF::Ln();
							PDF::Cell(0,7,'Total Amount : '.formatMoney($payinginvoice_amount).' '.$currency_name,0,1,'R');
							PDF::SetFont('','',11);
						}
							PDF::SetFont('','',11);
							PDF::Ln();
							PDF:: MultiCell(0, 6, '1.We declare that this invoice shows the actual price of the goods/services described and that all particulars are true and correct.', 0, 'L');
                                PDF::Cell(0,1,'',0,1);



							PDF::Ln();


							PDF::Cell(0,8,'Prepared by: '.ucwords($row->prepared_by) ,0,1,'');

							PDF::Cell(0,8,'',0,1);

							$startY = PDF::GetY();
							$startX = PDF::GetX();

									$signiture = getcwd() . '/resources/images/signatures/ca_signature.jpg';
									PDF::Image($signiture,$startX,$startY-7,30,12);
									PDF::SetFont('','B',11);

									PDF::SetFont('','B',12);
									PDF::Cell(0,8,'...................................................',0,1,'');


							//PDF::Cell(30,6,'Prepared By: ',0,0,'L');
							PDF::SetFont('','',11);
							//PDF::Cell(60,6,$row->preparedBy,0,0,'L');

							PDF::Output('Batch Invoice requests Statement.pdf');


							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);



	}
	public function generateBatchPaymentsStatement(Request $req){
		try{
			$invoice_no = $req->invoice_no;
			$invoice_id = $req->invoice_id;
			$batch_control_number = $req->batch_control_number;
			PDF::setPrintHeader(false);
							PDF::setPrintFooter(false);

							PDF::SetFont('','B',11);

							PDF::AddPage();
						$this->getReportheader('BATCH INVOICE PAYMENT RECEIPT');

						$row = DB::table('tra_batch_invoiceapp_details as t1')
									->join('tra_application_invoices as t2', 't1.batch_invoice_id', 't2.id')
									->leftJoin('wb_trader_account as t5', 't2.applicant_id', 't5.id')
									->leftJoin('par_regions as t6', 't5.region_id', 't6.id')
									->leftJoin('par_countries as t7', 't5.country_id', 't7.id')
									->select(DB::raw("t2.*, t5.name as applicant_name,t5.physical_address, t5.postal_address, t7.name as country_name, t6.name as region_name "))
									->where(array('t1.batch_invoice_id'=>$invoice_id, 't2.id'=>$invoice_id))
									->first();

						if($row){
						$payment_controlno = $row->PayCntrNum;

							PDF::SetFont('','B',10);
							PDF::Cell(100,7,'Invoice No: '.$row->invoice_no,0,0,'');
							PDF::SetFont('','B',10);
							PDF::Cell(0,7,'Date of Invoicing: '.$row->date_of_invoicing,0,1,'R');
							PDF::Cell(0,7,'Payment Control Number: '.$row->PayCntrNum,0,1,'');

							PDF::SetFont('','B',11);

							PDF::SetFont('','',11);
							PDF::Cell(0,7,$row->applicant_name,0,1,'');
							PDF::Cell(0,7,$row->physical_address,0,1,'');
							PDF::Cell(0,7,$row->postal_address.','.$row->region_name .' '.$row->country_name,0,1,'');
							PDF::Cell(0,7,$row->country_name,0,1,'');
							PDF::SetFont('','B',11);

							PDF::Cell(0,7,'Payments Items',0,1,'');
							  $batch_payments = DB::table("tra_payments as t1")
													->select(DB::raw("t1.reference_no, t1.tracking_no,t1.currency_id,t1.module_id, t1.sub_module_id, t6.name as module_name, t8.name as sub_module, t1.receipt_no,t1.trans_date, t1.PayCtrNum as payment_controlno, t7.name AS currency_name , SUM(t1.amount_paid) AS amount_paid , SUM(t1.amount_paid*t1.exchange_rate) AS  amount_in_tsh , t1.applicant_id"))

													->join("modules as t6",'t1.module_id','=','t6.id')
													->join("sub_modules as t8",'t1.sub_module_id','=','t8.id')
													->join("par_currencies as t7",'t1.currency_id','=','t7.id')
													->where('t1.PayCtrNum',$payment_controlno )
													->groupBy('t1.id')
													->get();

							if($batch_payments->count() >0){
								$i = 1;
								PDF::SetFont('','B',8);
								$total_amount = 0;
								$currency_name = 0;
							PDF::MultiCell(7,10,'Sn',1,'','',0);
									PDF::MultiCell(65,10,'Reference No',1,'','',0);
									PDF::MultiCell(30,10,'Receipt No',1,'','',0);
									PDF::MultiCell(30,10,'Trans Date',1,'','',0);
									PDF::MultiCell(20,10,'Currency',1,'','',0);
									PDF::MultiCell(0,10,'Amount Paid',1,'','',1);
							$check_module = 0;

								foreach($batch_payments as $rows){
									PDF::SetFont('','',8);
									$currency_id = $rows->currency_id;
									$currency_name = $rows->currency_name;
									$sub_module_id = $rows->sub_module_id;
									if($check_module != $sub_module_id){
										PDF::MultiCell(0,7,$rows->module_name.':'.$rows->sub_module ,1,'','',1);
									}
									PDF::MultiCell(7,10,$i,1,'','',0);

									if($rows->reference_no != ''){
										$reference_no = $rows->reference_no;
									}
									else{
										$reference_no = $rows->tracking_no;
									}
									PDF::MultiCell(65,10,$reference_no,1,'','',0);
									PDF::MultiCell(30,10,$rows->receipt_no,1,'','',0);
									PDF::MultiCell(30,10,$rows->trans_date,1,'','',0);

										$amount_paid =$rows->amount_paid;

										PDF::MultiCell(20,10,$rows->currency_name,1,'','',0);
									PDF::MultiCell(0,10,formatMoney($amount_paid),1,'R','',1);
									$check_module = $sub_module_id;
									$total_amount = $total_amount+$amount_paid;
									$i++;
								}
								PDF::SetFont('','B',10);
								PDF::Cell(152,7,'Total Amount',1,0);
									PDF::Cell(0,7,formatMoney($total_amount).' '.$currency_name,1,1,'R');
							}
							else{
								PDF::Cell(152,7,'No Payment Remitted',0,1);
							}
							PDF::Ln();


						}
							PDF::SetFont('','',11);
							PDF::Ln();

							PDF::Cell(0,8,'',0,1);

							$startY = PDF::GetY();
							$startX = PDF::GetX();

									$signiture = getcwd() . '/resources/images/signatures/ca_signature.jpg';
									PDF::Image($signiture,$startX,$startY-7,30,12);
									PDF::SetFont('','B',11);

									PDF::SetFont('','B',12);
									PDF::Cell(0,8,'...................................................',0,1,'');

										PDF::Cell(0,8, 'CPA: Paschal Makoye',0,1,'');

										PDF::Cell(0,8,'FOR: DIRECTOR GENERAL',0,1,'');
							//PDF::Cell(30,6,'Prepared By: ',0,0,'L');
							PDF::SetFont('','',11);
							//PDF::Cell(60,6,$row->preparedBy,0,0,'L');

							PDF::Output('Batch Retention Payment Receipt.pdf');

							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);

	}
	public function generateRetentionBatchInvoiceStatement(Request $req){
		try{
			$invoice_no = $req->invoice_no;
			$invoice_id = $req->invoice_id;
			PDF::setPrintHeader(false);
							PDF::setPrintFooter(false);

							PDF::SetFont('','B',11);

							PDF::AddPage();
						$this->getReportheader('Invoice Statement');

						$row = DB::table('tra_batch_invoiceapp_details as t1')
									->join('tra_application_invoices as t2', 't1.batch_invoice_id', 't2.id')
									->join('tra_invoice_details as t3', 't2.id', 't3.invoice_id')
									->join('par_currencies as t4', 't3.paying_currency_id', 't4.id')
									->leftJoin('wb_trader_account as t5', 't2.applicant_id', 't5.id')
									->leftJoin('par_regions as t6', 't5.region_id', 't6.id')
									->leftJoin('par_countries as t7', 't5.country_id', 't7.id')
									->select(DB::raw("t2.*,t3.paying_exchange_rate,t3.paying_currency_id as currency_id,t4.name as currency_name,t3.total_element_amount as invoice_total_amount, t5.name as applicant_name,t5.physical_address, t5.postal_address, t7.name as country_name, t6.name as region_name"))
									->where(array('t1.batch_invoice_id'=>$invoice_id, 't2.id'=>$invoice_id))
									->first();


						if($row){
							$currency_name = $row->currency_name;
							$payinginvoice_amount = $row->invoice_total_amount;
							$invoicing_currency_id = $row->currency_id;
							$exchange_rate = $row->paying_exchange_rate;
							PDF::SetFont('','B',10);
							PDF::Cell(100,7,'Invoice No: '.$row->invoice_no,0,0,'');
							PDF::SetFont('','B',10);
							PDF::Cell(0,7,'Date of Invoicing: '.$row->date_of_invoicing,0,1,'R');

							PDF::Cell(0,7,'Payment Control Number: '.$row->PayCntrNum,0,1,'');
							PDF::Cell(0,7,'Reference No: '.$row->reference_no,0,1,'');

							PDF::SetFont('','B',11);

							PDF::SetFont('','',11);
							PDF::Cell(0,7,$row->applicant_name,0,1,'');
							PDF::Cell(0,7,$row->physical_address,0,1,'');
							PDF::Cell(0,7,$row->postal_address.','.$row->region_name .' '.$row->country_name,0,1,'');
							PDF::Cell(0,7,$row->country_name,0,1,'');
							PDF::SetFont('','B',11);

							PDF::Cell(0,7,'Invoice Items',0,1,'');

                            $retention_invoices = DB::table("tra_product_retentions as t1")
													->select(DB::raw(" t4.reference_no,t1.id as retention_id, t2.registration_no as certificate_no, YEAR(t1.retention_year) AS retention_year, t4.paying_currency_id,t1.reg_product_id,t3.brand_name,t4.invoice_no,t4.date_of_invoicing,t5.element_costs_id, t4.PayCntrNum as payment_controlno, t7.name AS currency, SUM(t5.total_element_amount) AS invoice_amount,t11.name as costs_element, SUM(t5.total_element_amount*t5.paying_exchange_rate) AS  amount_in_tsh , t8.name AS retention_status,t5.exchange_rate , t4.applicant_id"))
													->leftJoin("tra_registered_products as t2",'t1.reg_product_id','=','t2.id')
													->join("tra_product_information as t3",'t2.tra_product_id','=','t3.id')
													->join("tra_application_invoices as t4",'t1.invoice_id','=','t4.id')
													->join("tra_invoice_details as t5",'t4.id','=','t5.invoice_id')
													->leftJoin("par_currencies as t7",'t4.paying_currency_id','=','t7.id')
													->leftJoin("par_retention_statuses as t8",'t1.retention_status_id','=','t8.id')
													->leftJoin("tra_element_costs as t10",'t5.element_costs_id','=','t10.id')
                                                    ->leftJoin("par_cost_categories as t11",'t10.cost_category_id','=','t11.id')
                                                    ->leftJoin("tra_batch_invoices_records as t12",'t1.invoice_id','=','t12.app_invoice_id')
													->where('t12.batch_invoice_id',$invoice_id )
													->groupBy('t1.id')

													->get();


							if($retention_invoices){
								$i = 1;
								PDF::SetFont('','B',8);
								$total_amount = 0;

								PDF::MultiCell(7,10,'Sn',1,'','',0);
									PDF::MultiCell(40,10,'Brand Name',1,'','',0);
									PDF::MultiCell(35,10,'Registration No',1,'','',0);
									PDF::MultiCell(25,10,'Retention Year',1,'','',0);
									PDF::MultiCell(25,10,'Invoice No',1,'','',0);
									PDF::MultiCell(30,10,'Cost Description',1,'','',0);
									PDF::MultiCell(0,10,'Invoice Amount',1,'','',1);
								foreach($retention_invoices as $rows){
									PDF::SetFont('','',8);
									$currency_id = $rows->paying_currency_id;
									$exchange_rate =$rows->exchange_rate;//	getExchangeRate($currency_id) ;
									PDF::MultiCell(7,10,$i,1,'','',0);
									PDF::MultiCell(40,10,$rows->brand_name,1,'','',0);
									PDF::MultiCell(35,10,$rows->certificate_no,1,'','',0);
									PDF::MultiCell(25,10,$rows->retention_year,1,'','',0);
									PDF::MultiCell(25,10,$rows->invoice_no,1,'','',0);
									PDF::MultiCell(30,10,'Annual Retention fee',1,'','',0);
									//PDF::MultiCell(20,10,$rows->currency,1,'','',0);
									 if($invoicing_currency_id == $currency_id){
										$invoice_amount =$rows->invoice_amount;
									}
									else{
										$invoice_amount =$rows->invoice_amount*$exchange_rate;
									}

									PDF::MultiCell(0,10,formatMoney($invoice_amount),1,'','',1);

									$total_amount = $total_amount+$invoice_amount;
									$i++;
								}

								PDF::SetFont('','B',10);
								PDF::Cell(155,7,'Total AMount',1,0);
								PDF::Cell(0,7,formatMoney($total_amount).' '.$currency_name,1,1,'R');
							}
							PDF::Ln();
							PDF::Cell(0,7,'Total Amount : '.formatMoney($payinginvoice_amount).' '.$currency_name,0,1,'R');
							PDF::SetFont('','',11);
						}
							PDF::SetFont('','',11);
							PDF::Ln();
							PDF:: MultiCell(0, 6, '1.We declare that this invoice shows the actual price of the goods/services described and that all particulars are true and correct.', 0, 'L');
                                PDF::Cell(0,1,'',0,1);
				                PDF::MultiCell(0,6,'2.All Payments should be made using Control Number shown in the Profoma Invoice.',0,'L');

							PDF::Ln();
							PDF::Cell(0,8,'Prepared by: '.ucwords($row->prepared_by) ,0,1,'');

							PDF::Cell(0,8,'',0,1);

							$startY = PDF::GetY();
							$startX = PDF::GetX();

									$signiture = getcwd() . '/resources/images/signatures/ca_signature.jpg';
									PDF::Image($signiture,$startX,$startY-7,30,12);
									PDF::SetFont('','B',11);

									PDF::SetFont('','B',12);
									PDF::Cell(0,8,'...................................................',0,1,'');

							//PDF::Cell(30,6,'Prepared By: ',0,0,'L');
							PDF::SetFont('','',11);
							//PDF::Cell(60,6,$row->preparedBy,0,0,'L');


							PDF::Output('Batch payments  Receipt'.rand().'.pdf');

							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);




	}
	public function generateRetentionBatchPaymentsStatement(Request $req){
		try{
			$invoice_no = $req->invoice_no;
			$invoice_id = $req->invoice_id;
			PDF::setPrintHeader(false);
							PDF::setPrintFooter(false);

							PDF::SetFont('','B',11);

							PDF::AddPage();
						$this->getReportheader('Retention Payments Receipt');

						$row = DB::table('tra_batch_invoiceapp_details as t1')
									->join('tra_application_invoices as t2', 't1.batch_invoice_id', 't2.id')

									->leftJoin('wb_trader_account as t5', 't2.applicant_id', 't5.id')
									->leftJoin('par_regions as t6', 't5.region_id', 't6.id')
									->leftJoin('par_countries as t7', 't5.country_id', 't7.id')
									->select(DB::raw("t2.*, t5.name as applicant_name,t5.physical_address, t5.postal_address, t7.name as country_name, t6.name as region_name"))
									->where(array('t1.batch_invoice_id'=>$invoice_id, 't2.id'=>$invoice_id))
									->first();


						if($row){

							$payment_controlno = $row->PayCntrNum;

							PDF::SetFont('','B',10);
							PDF::Cell(100,7,'Batch Invoice No: '.$row->invoice_no,0,0,'');
							PDF::SetFont('','B',10);
							PDF::Cell(0,7,'Date of Invoicing: '.$row->date_of_invoicing,0,1,'R');

							PDF::Cell(0,7,'Payment Control Number: '.$row->PayCntrNum,0,1,'');
							PDF::Cell(0,7,'Reference No: '.$row->reference_no,0,1,'');

							PDF::SetFont('','B',11);

							PDF::SetFont('','',11);
							PDF::Cell(0,7,$row->applicant_name,0,1,'');
							PDF::Cell(0,7,$row->physical_address,0,1,'');
							PDF::Cell(0,7,$row->postal_address.','.$row->region_name .' '.$row->country_name,0,1,'');
							PDF::Cell(0,7,$row->country_name,0,1,'');
							PDF::SetFont('','B',11);

							PDF::Cell(0,7,'Payments Items',0,1,'');
                            $retention_invoices = DB::table("tra_product_retentions as t1")
													->select(DB::raw(" t5.reference_no,t1.id as retention_id, t2.registration_no as certificate_no, YEAR(t1.retention_year) AS retention_year, t5.exchange_rate ,t5.currency_id,t1.reg_product_id,t3.brand_name,t5.receipt_no,t5.trans_date, t5.PayCtrNum as payment_controlno, t7.name AS currency_name , SUM(t5.amount_paid) AS amount_paid, t8.name AS retention_status,t5.applicant_id"))
													->leftJoin("tra_registered_products as t2",'t1.reg_product_id','=','t2.id')
													->join("tra_product_information as t3",'t2.tra_product_id','=','t3.id')
													->join("tra_product_retentionspayments as t4",'t1.id','=','t4.retention_id')
													->join("tra_payments as t5",'t4.retention_receipt_id','=','t5.id')
													->leftJoin("par_currencies as t7",'t5.currency_id','=','t7.id')
													->leftJoin("par_retention_statuses as t8",'t1.retention_status_id','=','t8.id')
													->where('t5.PayCtrNum',$payment_controlno )
													->groupBy('t5.id')
													->get();

							if($retention_invoices->count() >0){
								$i = 1;
								PDF::SetFont('','B',8);
								$total_amount = 0;
								$currency_name  = 0;

								PDF::MultiCell(7,10,'Sn',1,'','',0);
									PDF::MultiCell(40,10,'Brand Name',1,'','',0);
									PDF::MultiCell(35,10,'Registration No',1,'','',0);
									PDF::MultiCell(20,10,'Retention Year',1,'','',0);
									PDF::MultiCell(20,10,'Receipt No',1,'','',0);
									PDF::MultiCell(20,10,'Trans Date ',1,'','',0);
									PDF::MultiCell(20,10,'Currency',1,'','',0);
									PDF::MultiCell(0,10,' Amount',1,'','',1);
								foreach($retention_invoices as $rows){
									PDF::SetFont('','',8);
									$currency_id = $rows->currency_id;
									$exchange_rate =$rows->exchange_rate;
									$currency_name = $rows->currency_name;
									PDF::MultiCell(7,10,$i,1,'','',0);
									PDF::MultiCell(40,10,$rows->brand_name,1,'','',0);
									PDF::MultiCell(35,10,$rows->certificate_no,1,'','',0);
									PDF::MultiCell(20,10,$rows->retention_year,1,'','',0);
									PDF::MultiCell(20,10,$rows->receipt_no,1,'','',0);
									PDF::MultiCell(20,10,$rows->trans_date,1,'','',0);
									PDF::MultiCell(20,10,$rows->currency_name,1,'','',0);

										$amount_paid =$rows->amount_paid;


									PDF::MultiCell(0,10,formatMoney($amount_paid),1,'R','',1);

									$total_amount = $total_amount+$amount_paid;
									$i++;
								}

								PDF::SetFont('','B',10);
								PDF::Cell(155,7,'Total AMount',1,0);
								PDF::Cell(0,7,formatMoney($total_amount).' '.$currency_name,1,1,'R');
							}
							else{
								PDF::Cell(152,7,'No Payment Remitted',0,1);
							}


						}
							PDF::SetFont('','',11);
							PDF::Ln();

							PDF::Cell(0,8,'',0,1);

							$startY = PDF::GetY();
							$startX = PDF::GetX();

									$signiture = getcwd() . '/resources/images/signatures/ca_signature.jpg';
									PDF::Image($signiture,$startX,$startY-7,30,12);
									PDF::SetFont('','B',11);

									PDF::SetFont('','B',12);
									PDF::Cell(0,8,'...................................................',0,1,'');

										PDF::Cell(0,8, 'CPA: Paschal Makoye',0,1,'');

										PDF::Cell(0,8,'FOR: DIRECTOR GENERAL',0,1,'');
							//PDF::Cell(30,6,'Prepared By: ',0,0,'L');
							PDF::SetFont('','',11);
							//PDF::Cell(60,6,$row->preparedBy,0,0,'L');

							PDF::Output('Batch Retention payments  Receipt'.rand().'.pdf');


							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);




	}
	function getNarcorticPermheader($title, $reference_no){
		//court_of_arm

		PDF:: AddPage();

		PDF:: SetFont('', 'B', 9);
		PDF::Cell(0,3,'FORM A',0,1);
		PDF::Cell(0,3,'Import Certificate Issued',0,1);
		PDF::Cell(0,3,'by the United Republic of Tanzania',0,1);

		PDF::Cell(0,5,'Permit No: '.$reference_no,0,1,'R');

		PDF::ln();	PDF:: SetFont('', 'B', 12);
		$logo = getcwd() . '/resources/images/court_of_arm.png';
		PDF::Cell(0,6,strtoupper('THE UNITED REPUBLIC OF TANZANIA'),0,1,'C');
		PDF::Cell(0,6,strtoupper('Ministry of Health,Community Development,Gender,Eldery'),0,1,'C');
		PDF::Cell(0,6,strtoupper('AND CHILDREN'),0,1,'C');
		PDF:: Image($logo, 86, 49, 25, 32);
		PDF::Cell(0,10,'',0,1);
		PDF:: SetFont('', '', 8);
		PDF::Cell(50,6,'E-mail:  Info@zamra.or.tz',0,0,'L');
		PDF::Cell(0,6,'TANZANIA MEDICINES AND MEDICAL DEVICES AUTHORITY',0,1,'R');

		PDF::Cell(50,6,'Telephone:  +255 22 2450793',0,0,'L');
		PDF::Cell(0,6,'P.O. Box 1253,',0,1,'R');
		PDF::Cell(50,6,'Fax No:       +255 22 2450793',0,0,'L');


		PDF::Cell(0,6,'DODOMA.',0,1,'R');
		PDF::Cell(0,6,'All letters should be addressed to ',0,1,'L');
		PDF::Cell(0,6,'The Director General In reply please quote: ',0,1,'L');
		PDF::ln();

}
 public function printHospitalNarcoticsPermit(Request $req)
    {
		try{
			$application_code = $req->application_code;
			$review_rec = DB::table('tra_managerpermits_review')->where('application_code',$application_code)->first();

			if($review_rec){
				$decision_id = $review_rec->decision_id;
				if($decision_id != 1){
					echo "Application has been rejected, kinldy print the Rejected Letter";
						exit();
				}
			}
			else{
				echo  "The is not recommendation for the following permit, return back for review";
				exit();
			}
			$record = DB::table('tra_importexport_applications as t1')
								->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
								->leftJoin('par_countries as t5', 't2.country_id', 't5.id')
								->leftJoin('par_regions as t3', 't2.region_id', 't3.id')
								->join('tra_permitsenderreceiver_data as t4', 't1.sender_receiver_id', 't4.id')
								->leftJoin('par_countries as t6', 't4.country_id', 't6.id')
								->leftJoin('par_regions as t7', 't4.region_id', 't7.id')
								->leftJoin('par_modesof_transport as t8', 't1.modesof_transport_id', 't8.id')
								->leftJoin('par_ports_information as t9', 't1.port_id', 't9.id')
								->leftJoin('par_narcoticsdrug_types as t10', 't1.narcoticsdrug_type_id', 't10.id')
								->leftJoin('tra_managerpermits_review as t11', 't1.application_code', 't11.application_code')
								->select(DB::raw("t1.reference_no,t10.name as drug_type, t2.postal_address, t7.name as importer_region,t6.name as importer_country , t4.physical_address as imp_address, t4.postal_address as imp_postal  ,t8.name as transporationmode, date_format(t1.date_added,'%Y-%m-%d') as date_registered, date_format(t1.proforma_invoice_date,'%Y-%m-%d') as invoice_date, t2.telephone_no as tel, t1.*,date_format(t1.proforma_invoice_date,'%Y-%m-%d') as invoice_date,proforma_invoice_no as invoice_no,  t1.applicant_id, t2.name , t5.name as country, t3.name as  region, t2.physical_address as phyAddr, t2.email, t4.id as importer_id, t4.name as importer_name,t1.hospital_registration_no as registration_no,t1.pharmacists_registration_no, t1.pharmacists_in_charge as pharmacist_name, t9.name as port, t11.certificate_issue_date as permit_issue_date,t11.approval_date, t11.expiry_date as permit_expiry_date"))
								->where('t1.application_code',$application_code)
								->first();

								if($record){

									$reference_no = $record->reference_no;
									PDF::setPrintHeader(false);
									PDF::setPrintFooter(false);
									$data = (array)$record;
									$logo = getcwd() . '/resources/images/zamra-logo.png';
															PDF::setPrintHeader(false);
									PDF::setPrintFooter(false);
									PDF::AddPage();
										$logo=getcwd().'/assets/images/logo.jpg';


									PDF::SetFont('','B',11);
									PDF::ln(45);
									//the details as a report
									PDF::SetFont('','B',10);
									PDF::Cell(65,8,'Ref. No: '.$reference_no,0,0,'');
									PDF::Cell(0,8,'Date: '.formatDaterpt($data['approval_date']),0,1,'R');
									PDF::SetFont('','b',11);
									PDF::ln();
									PDF::Cell(65,8,'HOSPITAL PERMIT FOR USE OF NARCOTIC DRUGS',0,1,'');
									PDF::SetFont('','',11);
									PDF::Cell(65,8,'Name of the Institution:',0,0,'');
									PDF::SetFont('','b',11);
									PDF::Cell(0,8,strtoupper($data['name']),0,1,'');
									PDF::SetFont('','',11);
									PDF::Cell(65,8,'Address:',0,0,'');
									PDF::SetFont('','b',11);
									PDF::Cell(0,8,strtoupper($data['postal_address']),0,1,'');
									PDF::SetFont('','',11);
									PDF::Cell(65,8,'Hospital registration No::',0,0,'');
									PDF::SetFont('','b',11);
									PDF::Cell(0,8,strtoupper($data['registration_no']),0,1,'');
									PDF::SetFont('','',11);
									PDF::Cell(65,8,'Situated at:',0,0,'');
									PDF::SetFont('','B',11);
									PDF::Cell(0,8,strtoupper($data['phyAddr']),0,1,'');
									PDF::SetFont('','',11);
									PDF::Cell(65,8,'Name of pharmacist in-charge:',0,0,'');
									PDF::SetFont('','b',11);
									PDF::MultiCell(0,8,strtoupper($data['pharmacist_name']).'(Pharmacists with Reg. No: '.strtoupper($data['pharmacists_registration_no']).')',0,'','',1);


									PDF::SetFont('','',11);
									PDF::MultiCell(0,5,'Is heareby authorise to purchase the following medical Narcotic(s) from :'.strtoupper($data['importer_name']).' for hospital uses only.',0,'','',1);
									PDF::ln(3);
									$records = DB::table('tra_narcoticimport_products as t1')
											->leftJoin('par_controlled_drugsdetails as t3', 't1.narcotics_product_id','=','t3.id')
											->leftJoin('par_currencies as t5', 't1.currency_id','=','t5.id')
											->leftJoin('par_packaging_units as t7', 't1.packaging_unit_id','=','t7.id')

											->leftJoin('par_dosage_forms as t8', 't1.dosage_form_id','=','t8.id')

											->leftJoin('par_specification_types as t9', 't1.specification_type_id','=','t9.id')
											->leftJoin('par_common_names as t12', 't1.common_name_id','=','t12.id')
											->leftJoin('par_currencies as t13', 't1.currency_id','=','t13.id')
											->select(DB::raw("t1.*, t1.section_id,t3.name as brand_name,t12.name as common_name, t7.name as packaging_units, t5.name as currency_name, t8.name as dosage_formname,t13.name as currency,  t9.name as specification_type_name, (unit_price*quantity) as  total_value"))
											->where(array('t1.application_code' => $application_code))
											->get();
									if($records){
										$i = 1;PDF::SetFont('','B',11);
										PDF::MultiCell(10,10,'Sn',1,'','',0);
										PDF::MultiCell(55,10,'Name, Dosage Form & Strength',1,'','',0);
										PDF::MultiCell(35,10,'Unit of Measure',1,'','',0);
										PDF::MultiCell(45,10,'Quantity Authorised for this year '.date('Y',strtotime($data['permit_expiry_date'])),1,'','',0);
										PDF::MultiCell(0,10,'Authorised quantity for this permit',1,'','',1);PDF::SetFont('','',11);
										foreach($records as $rows){

												$dimensions = PDF::getPageDimensions();

												$sample_name = $rows->brand_name.' '.$rows->dosage_formname.' '.$rows->strength;
												$rowcount = max(PDF::getNumLines($sample_name, 42),PDF::getNumLines($rows->authority_yearlyquantity, 35),PDF::getNumLines($rows->packaging_units, 35));

												PDF::MultiCell(10,6*$rowcount,$i,1,'','',0);
												PDF::MultiCell(55,6*$rowcount,$sample_name,1,'','',0);
												PDF::MultiCell(35,6*$rowcount,$rows->packaging_units,1,'','',0);
												PDF::MultiCell(45,6*$rowcount,$rows->authority_yearlyquantity,1,'','',0);
												PDF::MultiCell(0,6*$rowcount,$rows->quantity,1,'','',1);
												$i++;

										}
									}
									PDF::SetFont('','',11);
									$permit_expiry = date('d-F-Y',strtotime($data['permit_expiry_date']));
									PDF::Cell(70,8,'The validity of this permit expires on :',0,0,'');
									PDF::SetFont('','B',11);
									PDF::Cell(0,8,$permit_expiry,0,1,'');
									PDF::SetFont('','',11);

									PDF::ln(5);PDF::SetFont('','B',11);
									PDF::Cell(110,6,date('d\ F, Y'),0,0,'');
									$title= 'ACTING';
									PDF::ln();
									PDF::ln();
									$title= '';
									$approved_by = '';

									$startY = PDF::GetY();
									$startX = PDF::GetX();
									$signiture = getcwd() . '/resources/images/signatures/hi0kag.png';
									PDF::Image($signiture,$startX,$startY-7,30,12);
									PDF::SetFont('','B',11);
									PDF::Cell(30,7,'................................',0,1,'L');
									PDF::SetFont('','B',10);
									PDF::Cell(0,7, 'A. M. FIMBO',0,1);
									PDF::Cell(20,7,$title.' DIRECTOR GENERAL',0,1,'L');


									PDF::ln();
									PDF::SetFont('','BI',11);
									PDF::Cell(0,8,'Note: ',0,1,'');

									PDF::MultiCell(0,5,'The quarterly report of Narcotic Consumption should be submitted to the Director General Tanzania Medcines and Medical Devices Authority. Annual consumption estimates should be submitted before the end of April every year.',0,'','',1);


									PDF::Output('Narcotic Drug Permit.pdf');


								}



							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);


    }

	public function printNarcoticImportPermit(Request $req){
			try{
			$application_code = $req->application_code;
			$review_rec = DB::table('tra_managerpermits_review')->where('application_code',$application_code)->first();

			if($review_rec){
				$decision_id = $review_rec->decision_id;
				if($decision_id != 1){
					echo "Application has been rejected, kinldy print the Rejected Letter";
						exit();
				}
			}
			else{
				echo  "The is not recommendation for the following permit, return back for review";
				exit();
			}
			$record = DB::table('tra_importexport_applications as t1')
								->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
								->leftJoin('par_countries as t5', 't2.country_id', 't5.id')
								->leftJoin('par_regions as t3', 't2.region_id', 't3.id')
								->join('tra_permitsenderreceiver_data as t4', 't1.sender_receiver_id', 't4.id')
								->leftJoin('par_countries as t6', 't4.country_id', 't6.id')
								->leftJoin('par_regions as t7', 't4.region_id', 't7.id')
								->leftJoin('par_modesof_transport as t8', 't1.modesof_transport_id', 't8.id')
								->leftJoin('par_ports_information as t9', 't1.port_id', 't9.id')
								->leftJoin('par_narcoticsdrug_types as t10', 't1.narcoticsdrug_type_id', 't10.id')
								->leftJoin('tra_managerpermits_review as t11', 't1.application_code', 't11.application_code')
								->select(DB::raw("t1.reference_no,t10.name as drug_type, t2.postal_address, t7.name as importer_region,t6.name as importer_country , t4.physical_address as imp_address, t4.postal_address as imp_postal  ,t8.name as transporationmode, date_format(t1.date_added,'%Y-%m-%d') as date_registered, date_format(t1.proforma_invoice_date,'%Y-%m-%d') as invoice_date, t2.telephone_no as tel, t1.*,date_format(t1.proforma_invoice_date,'%Y-%m-%d') as invoice_date,proforma_invoice_no as invoice_no,  t1.applicant_id, t2.name , t5.name as country, t3.name as  region, t2.physical_address as phyAddr, t2.email, t4.id as importer_id, t4.name as importer_name, t9.name as port, t11.certificate_issue_date as permit_issue_date, t11.expiry_date"))
								->where('t1.application_code',$application_code)
								->first();

								if($record){
									$reference_no = $record->reference_no;
									PDF::setPrintHeader(false);
									PDF::setPrintFooter(false);
									//PDF::AddPage();
									$data = (array)$record;
			$logo = getcwd() . '/resources/images/zamra-logo.png';
									$this->getNarcorticPermheader('Narcotic Drugs Permit Details',$reference_no);
									PDF:: SetFont('', 'B', 12);
									PDF::Cell(0,6,'Certificate of Official Approval of Import',0,1,'C');
									PDF:: SetFont('', 'I', 10);
									PDF::Cell(0,6,'(Section 78 (1) Food Drug and Cosmetic Act, 2003)',0,1,'C');
									PDF:: SetFont('', '', 10);
									PDF::Cell(0,2,'',0,1);
									PDF::MultiCell(0,5,'I, being the person with the administration of the law relating to '.$data['drug_type'].' to which the International Convention on Precursors apply, hereby certify that I have approved the importation by: -',0,'','',1);

									PDF::Cell(0,2,'',0,1);
									PDF::Cell(15);
									PDF:: SetFont('', 'B', 10);

									PDF::MultiCell(0,5,$data['name'].', '.$data['phyAddr'].', '.$data['postal_address'].', '.$data['region'].', '.$data['country'] ,0,'','',1);
									PDF:: SetFont('', '', 10);
									PDF::Cell(5);PDF::Cell(0,6,'Of:',0,1);
									PDF:: SetFont('', 'B', 11);
									$records = DB::table('tra_narcoticimport_products as t1')
											->leftJoin('par_controlled_drugsdetails as t3', 't1.narcotics_product_id','=','t3.id')
											->leftJoin('par_currencies as t5', 't1.currency_id','=','t5.id')
											->leftJoin('par_packaging_units as t7', 't1.packaging_unit_id','=','t7.id')

											->leftJoin('par_dosage_forms as t8', 't1.dosage_form_id','=','t8.id')

											->leftJoin('par_specification_types as t9', 't1.specification_type_id','=','t9.id')
											->leftJoin('par_common_names as t12', 't1.common_name_id','=','t12.id')
											->leftJoin('par_currencies as t13', 't1.currency_id','=','t13.id')
											->select(DB::raw("t1.*, t1.section_id,t3.name as brand_name,t12.name as common_name, t7.name as packaging_units, t5.name as currency_name, t8.name as dosage_formname,t13.name as currency,  t9.name as specification_type_name, (unit_price*quantity) as  total_value"))
											->where(array('t1.application_code' => $application_code))
											->get();

									if($records){

										$i = 1;
										foreach($records as $rows){
											PDF::Cell(15);
											if($rows->product_strength == ''){
												$imp_data = $i.'. '.$rows->brand_name.' '.$rows->dosage_formname .' '.$rows->strength.' in '.$rows->packaging_size.' '.$rows->packaging_units.' ('.$rows->common_name.') * '.$rows->quantity;

											}
											else{
												$imp_data = $i.'. '.$rows->brand_name.' '.$rows->dosage_formname .' '.$rows->product_strength;

											}
											PDF::MultiCell(0,6,$imp_data,0,'','',1);

											$i++;
										}
									}


									PDF::Cell(15);
									PDF::MultiCell(0,5,'As per the Invoice number '.$data['invoice_no'].' dated '.date('d/m/Y',strtotime($data['invoice_date'])),0,'','',1);
									PDF::Cell(0,2,'',0,1);
									PDF:: SetFont('', '', 11);
									PDF::Cell(15,6,'From:',0,0);
									PDF:: SetFont('', 'B', 11);
									PDF::MultiCell(0,5,$data['importer_name'].', '.$data['imp_address'].', '.$data['imp_postal'].', '.$data['importer_region'].', '.$data['importer_country'] ,0,'','',1);
										 PDF:: SetFont('', '', 11);
									PDF::Cell(0,2,'',0,1);
									PDF::Cell(30,5,'Subject to conditions that: -',0,0);
									PDF::ln();


									PDF::Cell(10);
									$permit_issue_date = $data['permit_issue_date'];
									$to_date = date('M d, Y', strtotime("$permit_issue_date +6 month"));

									PDF::Cell(0,8,'i.	 The consignment shall be imported before the: '.$to_date,0,1);
									PDF::Cell(10);
									PDF::MultiCell(0,8,'ii.	The consignment shall be imported by '.$data['transporationmode'].' through '.$data['port'] ,0,'','',1);

									PDF::ln();
									$for_state = ' ';//4450 - 6050 2k
									PDF::Cell(125,6,'................................................',0,0);


									  PDF:: SetFont('', 'B', 11);
									PDF::Cell(0,6,'...................................................',0,1,'C');
									  PDF:: SetFont('', '', 11);
									  PDF::Cell(35,6,'Date',0,0,'C');
									PDF::Cell(85);
									PDF::Cell(0,6,'Signature and Stamp',0,1,'C');
									PDF::Cell(125);
									PDF::Cell(0,6,$for_state.'Director General, Tanzania Medicines ',0,1,'C');	PDF::Cell(125);
									PDF::Cell(0,6,'and Medical Devices Authority',0,1,'C');

									PDF::ln();
									PDF::ln();
									PDF:: SetFont('', 'B', 9);
									PDF::MultiCell(0,8,'This document is solely for production to the Government of the country from which the substances are proposed to be obtained.' ,0,'','',1);

									PDF::Output('Narcotic Drug Permit.pdf');


								}



							return;
						} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
						} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
						}
						print_r($res);
		}
	public function convert_number_to_words($number) {

			$hyphen      = '-';
			$conjunction = ' and ';
			$separator   = ', ';
			$negative    = 'negative ';
			$decimal     = ' point ';
			$dictionary  = array(
				0                   => 'zero',
				1                   => 'one',
				2                   => 'two',
				3                   => 'three',
				4                   => 'four',
				5                   => 'five',
				6                   => 'six',
				7                   => 'seven',
				8                   => 'eight',
				9                   => 'nine',
				10                  => 'ten',
				11                  => 'eleven',
				12                  => 'twelve',
				13                  => 'thirteen',
				14                  => 'fourteen',
				15                  => 'fifteen',
				16                  => 'sixteen',
				17                  => 'seventeen',
				18                  => 'eighteen',
				19                  => 'nineteen',
				20                  => 'twenty',
				30                  => 'thirty',
				40                  => 'fourty',
				50                  => 'fifty',
				60                  => 'sixty',
				70                  => 'seventy',
				80                  => 'eighty',
				90                  => 'ninety',
				100                 => 'hundred',
				1000                => 'thousand',
				1000000             => 'million',
				1000000000          => 'billion',
				1000000000000       => 'trillion',
				1000000000000000    => 'quadrillion',
				1000000000000000000 => 'quintillion'
			);

			if (!is_numeric($number)) {
				return false;
			}

			if (($number >= 0 && (int) $number < 0) || (int) $number < 0 - PHP_INT_MAX) {
				// overflow
				trigger_error(
					'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
					E_USER_WARNING
				);
				return false;
			}

			if ($number < 0) {
				return $negative . $this->convert_number_to_words(abs($number));
			}

			$string = $fraction = null;

			if (strpos($number, '.') !== false) {
				list($number, $fraction) = explode('.', $number);
			}

			switch (true) {
				case $number < 21:
					$string = $dictionary[$number];
					break;
				case $number < 100:
					$tens   = ((int) ($number / 10)) * 10;
					$units  = $number % 10;
					$string = $dictionary[$tens];
					if ($units) {
						$string .= $hyphen . $dictionary[$units];
					}
					break;
				case $number < 1000:
					$hundreds  = (int)($number / 100);
					$remainder = $number % 100;
					$string = $dictionary[$hundreds] . ' ' . $dictionary[100];
					if ($remainder) {
						$rem=$this->convert_number_to_words($remainder);
						$string .= $conjunction . $rem;
					}
					break;
				default:
					$baseUnit = pow(1000, floor(log($number, 1000)));
					$numBaseUnits = (int) ($number / $baseUnit);
					$remainder = $number % $baseUnit;
					$num=$this->convert_number_to_words($numBaseUnits);
					$string =  $num. ' ' . $dictionary[$baseUnit];
					if ($remainder) {
						$string .= $remainder < 100 ? $conjunction : $separator;
						$rem=$this->convert_number_to_words($remainder);
						$string .= $rem;
					}
					break;
			}

			if (null !== $fraction && is_numeric($fraction)) {
				$string .= $decimal;
				$words = array();
				foreach (str_split((string) $fraction) as $number) {
					$words[] = $dictionary[$number];
				}
				$string .= implode(' ', $words);
			}

			return $string;
		}
			public function	printRetentionPaymentsStatement(Request $req){
			try{
				PDF::setPrintHeader(false);
				PDF::setPrintFooter(false);
				PDF::AddPage('L');
				$applicant_id = $req->applicant_id;
				$section_id = $req->section_id;
				$retention_yearfrom = $req->retention_yearfrom;
				$retention_yearto = $req->retention_yearto;

				$trans_datefrom = $req->trans_datefrom;
				$trans_dateto = $req->trans_dateto;

				$trader_ids = $req->input('trader_ids');
        $applicant_ids = explode(',',$trader_ids);
$applicant_record =DB::table('wb_trader_account as t1')
									->leftJoin('par_regions as t2', 't1.region_id', 't2.id')
									->leftJoin('par_countries as t3', 't1.country_id', 't3.id')
									->select('t1.name as applicant_name', 't2.name as region_name', 't3.name as country_name', 't1.postal_address')
									->whereIn('t1.id',$applicant_ids)
									->first();

									$retention_payments = DB::table("tra_product_retentions as t1")
									->select(DB::raw("t4.reference_no,t1.id as retention_id,t2.id as reg_product_id , t2.registration_no as certificate_no, YEAR(t1.retention_year) AS retention_year,t5.PayCtrNum as payment_controlno, t3.brand_name,t4.invoice_no,t5.trans_date,t5.receipt_no , t4.PayCntrNum, t7.name AS currency, sum(t5.amount_paid) AS amount_paid,t5.exchange_rate , SUM(t5.amount_paid*t5.exchange_rate) AS amount_paidths, t8.name AS retention_status,t9.name as applicant_name, t4.applicant_id"))
									->join("tra_registered_products as t2",'t1.reg_product_id','=','t2.id')
									->join("tra_product_information as t3",'t2.tra_product_id','=','t3.id')
									->join("tra_application_invoices as t4",'t1.invoice_id','=','t4.id')
									->join("tra_product_retentionspayments as t10",'t4.id','=','t10.retentioninvoice_id')
									->join("tra_payments as t5",'t10.retention_receipt_id','=','t5.id')
									->join("par_currencies as t7",'t5.currency_id','=','t7.id')
									->join("par_retention_statuses as t8",'t1.retention_status_id','=','t8.id')
									->leftJoin("wb_trader_account as t9",'t4.applicant_id','=','t9.id')
									 ->groupBy('t5.invoice_id')
									->whereIn('t4.applicant_id',$applicant_ids);

/*
	if(validateIsNumeric($retention_yearto)){
		$retention_payments->whereRaw(" YEAR(t1.retention_year) <= '".$retention_yearto."'");

	}
	if(validateIsNumeric($retention_yearfrom)){
		$retention_payments->whereRaw(" YEAR(t1.retention_year) >= '".$retention_yearfrom."'");

	}
	*/
	 if( $retention_yearfrom != '' &&  $retention_yearto != ''){
                $where_filterdates  = " YEAR(t1.retention_year) BETWEEN '".$retention_yearfrom."' and  '".$retention_yearto."'";
            }
	if(validateIsNumeric($applicant_id)){
		$retention_payments->where('t4.applicant_id',$applicant_id );
	}
	$where_filterdates = '';
	if( $trans_dateto != '' &&  $trans_datefrom != ''){
			$where_filterdates  = " date_format(t5.trans_date, '%Y-%m-%d') BETWEEN '".$trans_datefrom."' and  '".$trans_dateto."'";
	}
	if ($where_filterdates != '') {
		$retention_payments->whereRAW($where_filterdates);
}
$retention_payments = $retention_payments->get();
PDF::setPrintHeader(false);
PDF::setPrintFooter(false);

PDF::SetFont('','B',11);
$this->getReportheaderlandscape('Retention Payment Receipt');

PDF::Cell(0,2,'',0,1);
//PDF::Cell(117);
PDF::SetFont('','',11);
PDF::Cell(0,4,'Print Date: '.date('d/m/Y'),0,1,'R');
PDF::SetFont('','B',10);
//PDF::Cell(0,3,'',0,1);

PDF::Cell(52,3,"Customer's Name: ",0,0,'L');
PDF::SetFont('','',10);
PDF::Cell(100,5,$applicant_record->applicant_name,0,1,'L');
PDF::SetFont('','B',10);

PDF::Cell(52,3,"Address: ",0,0,'L');
PDF::SetFont('','',10);

PDF::Cell(100,3,$applicant_record->postal_address.','.$applicant_record->region_name.', '.$applicant_record->country_name,0,1,'L');

if($retention_payments){

		PDF::Cell(0,2,'',0,1,'L');

		PDF::SetFont('','B',9);
		//PDF::Cell(10);

		$data=array();
		//reg_product_id
		$tot_rec_inv=0;
		$tot_inv_usd=0;
		$tot_inv_tshs=0;
		//the headings retention_invoices
		PDF::MultiCell(7, 8, 'No',1,'','',0);
							PDF::MultiCell(35, 8, 'Reference No',1,'','',0);

							PDF::MultiCell(35, 8, 'Registration No',1,'','',0);
							PDF::MultiCell(40, 8, 'Brand Name',1,'','',0);
							PDF::MultiCell(25, 8, 'Invoice No',1,'','',0);
							PDF::MultiCell(20, 8,'Receipt No',1,'','',0);
							PDF::MultiCell(25, 8,'Trans Date:',1,'','',0);
							PDF::MultiCell(30, 8,'Payment Control Number:',1,'','',0);
							PDF::MultiCell(20, 8,'Currency',1,'','',0);
							PDF::MultiCell(0, 8,'Amount',1,'','',1);
							//PDF::MultiCell(0, 8, 'Amount(tsh)',1,'','',1);

									$i = 1;
									$dimensions = PDF::getPageDimensions();
							$hasborder = false;

							$currency_usd = '';
							$currency_tshs = '';

									foreach($retention_payments as $retention_invoice){

									PDF::SetFont('','',9);
										$row = $retention_invoice;
										$reg_product_id = $retention_invoice->reg_product_id;
										$retention_id = $retention_invoice->retention_id;

															$reference_no = $retention_invoice->reference_no;
															$invoice_no = $retention_invoice->invoice_no;
															$trans_date = $retention_invoice->trans_date;
															$currency = $retention_invoice->currency;
															$exchange_rate = $retention_invoice->exchange_rate;
															$amount_paid = $retention_invoice->amount_paid;
															$amount_in_tsh = $retention_invoice->amount_paidths;
															$payment_controlno = $retention_invoice->payment_controlno;
															//get invoice desription

															$receipt_no = $retention_invoice->receipt_no;
															$retention_year =$retention_invoice->retention_year;
															//get the product details
															$brand_name = $retention_invoice->brand_name;
															$certificate_no = $retention_invoice->certificate_no;

															$rowcount = 0;

																$rowcount = 0;

																	$rowcount = max(PDF::getNumLines($brand_name, 38),PDF::getNumLines($invoice_no, 35),PDF::getNumLines($amount_in_tsh, 30),PDF::getNumLines($certificate_no, 35),PDF::getNumLines($receipt_no, 20),PDF::getNumLines($payment_controlno, 35));

																	$startY = PDF::GetY();
																	if (($startY + $rowcount * 5) + $dimensions['bm'] > ($dimensions['hk'])) {

																		if ($hasborder) {
																			$hasborder = false;
																		}else {
																			PDF::Ln();
																			PDF::Cell(0,5,'','T');
																			PDF::Ln();
																		}
																		$borders = 'LTR';
																	} elseif ((ceil($startY) + $rowcount * 5) + $dimensions['bm'] == floor($dimensions['hk'])) {

																		$borders = 'LRB';
																		$hasborder = true;
																	} else {
																		//normal cell
																		$borders = 'LR';
																	}


																PDF::MultiCell(7, $rowcount* 5, $i,1,'','',0);
																PDF::MultiCell(35, $rowcount* 5, $reference_no,1,'','',0);
																PDF::MultiCell(35, $rowcount* 5, $certificate_no,1,'','',0);
																PDF::MultiCell(40, $rowcount* 5, $brand_name,1,'','',0);

																PDF::MultiCell(25, $rowcount* 5, $invoice_no,1,'','',0);
																PDF::MultiCell(20,  $rowcount* 5, $receipt_no,1,'','',0);
																PDF::MultiCell(25, $rowcount* 5, formatDate($trans_date),1,'','',0);
																PDF::MultiCell(30, $rowcount* 5, $payment_controlno,1,'','',0);
																PDF::MultiCell(20, $rowcount* 5,  $currency,1,'','',0);
																PDF::MultiCell(0, $rowcount* 5,formatMoney($amount_paid) ,1,'','',1);
																//PDF::MultiCell(0, $rowcount* 5, formatMoney($amount_in_tsh),1,'','',1);

														$currency_tshs = $currency;
																$tot_inv_tshs = $tot_inv_tshs+$amount_paid;

														$i = $i+1;

									}

									PDF::SetFont('','B',9);
									PDF::Cell(35);

															PDF::Cell(187);
															PDF::Cell(25,5,'Total: '.$currency_tshs,0,0);
															PDF::Cell(5);
															PDF::Cell(20,5,formatMoney($tot_inv_tshs),'T',0);
															PDF::Cell(0,5,'',0,1);

									PDF::SetFont('','',10);
									PDF::Ln();
									//PDF::Cell(10);
									PDF::MultiCell(0,6,'1.We declare that this payments shows the actual details for the Paid Product retention Invoices.',0,'L');


									PDF::Cell(0,3,'',0,1);

									PDF::Cell(0,3,'',0,1);

									PDF::Cell(0,6,'',0,1);



							}

							PDF::Output('Retention Payment Receipt.pdf');


							return;
							} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
							} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
							}
							print_r($res);

		}
		public function printPremisesInspectionSchedules(Request  $req){

							try{
								$inspection_id = $req->inspection_id;
								PDF::setPrintHeader(false);
								PDF::setPrintFooter(false);
								PDF::AddPage('L');
								PDF::setPrintHeader(false);
								PDF::setPrintFooter(false);

								PDF::SetFont('','B',11);
								$this->getReportheaderlandscape('Premises Inspection Report');

								PDF::Cell(0,2,'',0,1);
								//PDF::Cell(117);
								PDF::SetFont('','',11);
								PDF::Cell(0,4,'Print Date: '.date('d/m/Y'),0,1,'R');
								PDF::SetFont('','B',10);
								//PDF::Cell(0,3,'',0,1);
								$qry = DB::table('tra_premise_inspection_details')->where('id',$inspection_id);
								$results = $qry->first();
								if($results){
									PDF::Cell(60,7,"Inspection Ref: ",0,0,'L');
									PDF::SetFont('','',10);
									PDF::Cell(0,7,$results->inspection_reference_no,0,1,'L');
									PDF::SetFont('','B',10);

									PDF::Cell(60,5,"Inspection Description/Remarks: ",0,0,'L');
									PDF::SetFont('','',10);

									PDF::MultiCell(0,7 ,$results->description,0,'','',1);
									PDF::SetFont('','B',10);

									PDF::Cell(52,7,"Date Of Inspection: ",0,0,'L');
									PDF::SetFont('','',10);
									PDF::Cell(0,7,formatDaterpt($results->start_date).'-'.formatDaterpt($results->end_date),0,1,'L');
									PDF::SetFont('','B',10);
									//inspectioned premises
									PDF::SetFont('','B',10);
									PDF::Cell(10,6,"Sn ",1,0,'L');
									PDF::Cell(40,6,"Premises Name ",1,0,'L');
									PDF::Cell(25,6,"Region Name ",1,0,'L');
									PDF::Cell(25,6,"District ",1,0,'L');
									PDF::Cell(40,6,"Physical Address ",1,0,'L');
									PDF::Cell(30,6,"Inspection Dates",1,0,'L');
									PDF::Cell(30,6,"Inspection Type ",1,0,'L');
									PDF::Cell(0,6,"Recommendation ",1,1,'L');
									$records = DB::table('tra_premises as t2')
										->leftJoin('tra_premises_applications as t1', 't1.premise_id', '=', 't2.id')
										->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
										->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
										->leftJoin('tra_approval_recommendations as t5', function ($join) {
											$join->on('t1.id', '=', 't5.application_id')
												->on('t1.application_code', '=', 't5.application_code');
										})
										->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
										->leftJoin('tra_premiseinspection_applications as t7', function ($join) use ($inspection_id) {
											$join->on('t1.application_code', '=', 't7.application_code');
										})
										->leftJoin('par_business_types as t10', 't2.business_type_id', '=', 't10.id')
										->leftJoin('par_regions as t11', 't2.region_id', '=', 't11.id')

										->leftJoin('par_districts as t12', 't2.district_id', '=', 't12.id')
										->leftJoin('par_inspection_types as t14', 't7.inspection_type_id', '=', 't14.id')

										->leftJoin('par_premiseinspection_recommendations as t15', 't7.recommendation_id', '=', 't15.id')
										->leftJoin('tra_premlegalityofstocked_products as t16', 't16.application_id', '=', 't1.id')
										->select('t1.*','t2.physical_address','t11.name as region_name','t12.name as district_name', 't2.name as premise_name', 't2.business_type_id', 't3.name as applicant_name', 't4.name as application_status','t7.actual_start_date','t7.actual_end_date','t16.has_illegal_stock','t16.legalitystock_remarks',
											't10.name as business_type','t7.id as app_inspection_id', 't7.inspection_id','t7.recommendation_id','t14.name as inspection_type','t15.name as inspection_recommendation',  't6.name as approval_status', 't5.decision_id', 't1.id as active_application_id')
										->where(array('t7.inspection_id'=>$inspection_id))
										->groupBy('t1.id')
										->get();
									if($records){
										PDF::SetFont('','',10);
										$i = 1;
											foreach($records as $rows){
												$rowcount = max(PDF::getNumLines($rows->premise_name, 40),PDF::getNumLines($rows->physical_address, 40),PDF::getNumLines($rows->inspection_type, 30));

												PDF::MultiCell(10,$rowcount * 6,$i.'. ',1,'','',0);
												PDF::MultiCell(40,$rowcount * 6,$rows->premise_name,1,'','',0);
												PDF::MultiCell(25,$rowcount * 6,$rows->region_name,1,'','',0);
												PDF::MultiCell(25,$rowcount * 6,$rows->district_name,1,'','',0);
												PDF::MultiCell(40,$rowcount * 6,$rows->physical_address,1,'','',0);
												PDF::MultiCell(30,$rowcount * 6,formatDaterpt($rows->actual_start_date).'-'.formatDaterpt($rows->actual_end_date),1,'','',0);
												PDF::MultiCell(30,$rowcount * 6,$rows->inspection_type,1,'','',0);
												PDF::MultiCell(0,$rowcount * 6,$rows->inspection_recommendation,1,'','',1);

												$i++;

											}
										//$premise_name
									}
								}

								PDF::OutPut('Premises Inspection Report');
							return;



							} catch (\Exception $exception) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $exception->getMessage()
							);
							} catch (\Throwable $throwable) {
							//DB::rollBack();
							$res = array(
								'success' => false,
								'message' => $throwable->getMessage()
							);
							}
							print_r($res);
		}
		public function generateDisposalpermit(Request $req){
			try {

					$application_code = $req->application_code;

					$logo=getcwd().'/assets/images/logo.jpg';

					$records = DB::table('tra_disposal_applications as t1')
										->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
										->leftJoin('par_regions as t3', 't2.region_id', 't3.id')
										->leftJoin('par_currencies as t4', 't1.currency_id', 't4.id')
										->leftJoin('par_weights_units as t5', 't1.weights_units_id', 't5.id')
										->join('tra_approval_recommendations as t6', 't1.application_code', 't6.application_code')
										->leftJoin('par_sections as t7', 't1.section_id', 't7.id')
										->select(DB::raw("t4.name as currency,total_weight,t5.name as weights_units ,t2.name as applicant, t3.name as region_name,t6.approval_date, t2.postal_address, t1.*, t6.decision_id, t7.name as section_name, t6.certificate_no, t6.approved_by as permit_approval, t6.approved_by "))
										->where(array('t1.application_code'=>$application_code))
										->first();



					if($records){
						$row = $records;
						if($row->decision_id == 1){
								$org_info = $this->getOrganisationInfo();

								$pdf = new PdfLettersProvider();
								$pdf->AddPage();
								$template_url = base_path('/');
								$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
																		// import page 1
								$tplId = $pdf->importPage(1);
								$pdf->useTemplate($tplId,0,0);
								$pdf->setPageMark();

								$pdf->SetFont('times','B',9);
								$pdf->Cell(0,1,'',0,1);

								//$pdf->Cell(0,4,'FORM II',0,1,'R');
								//$pdf->Cell(0,4,'(Regulation 3)',0,1,'R');
								//$pdf->SetFont('times','B',13);
								$pdf->Cell(0,25,'',0,1);
								$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
								$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

								$pdf->SetFont('times','B',12);
								$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
								$pdf->ln();
								if( $records->reference_no != ''){

									$reference_no  = $records->reference_no ;
								}
								else{

									$reference_no  = $records->tracking_no ;
								}
								$pdf->Cell(0,5,'',0,1,'C');
								$pdf->SetFont('','BI',10);
								//$pdf->Cell(40,5,'Ref No: '.$reference_no,0,0);
								$style = array(
											'border' => 0,
											'vpadding' => 'auto',
											'hpadding' => 'auto',
											'fgcolor' => array(0,0,0),
											'bgcolor' => false, //array(255,255,255)
											'module_width' => 1, // width of a single module in points
											'module_height' => 1 // height of a single module in points
									);
									if($records->certificate_no != ''){
									$certificate_no = $records->certificate_no;
								}
								else{
									$certificate_no =$reference_no;
								}
								$pdf->write2DBarcode(strtoupper($row->applicant).':'.$reference_no.':'.$certificate_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
								$pdf->SetFont('','',11);
								$pdf->ln();$pdf->ln();$pdf->ln();
								$pdf->SetFont('times','',10);

								$pdf->writeHTMLCell(0, '', '','', 'Date: '.date('j<\s\up>S</\s\up> F, Y',strtotime($row->approval_date)), 0, 1, 0, true, 'R', true);
								$pdf->ln();
								$pdf->SetFont('','B',12);
								$pdf->Cell(0,5,'CERTIFICATE',0,1,'C');
								$pdf->Cell(0,5,'',0,1);
								$pdf->MultiCell(0,8,'SAFE DISPOSAL OF OBSOLETE, UNWANTED OR EXPIRED MEDICINES, HERBAL MEDICINES OR ALLIED SUBSTANCES' ,0, 'C', 0, 1);
								$pdf->ln();

								$pdf->Cell(0,8,'Certificate No. '.$records->certificate_no,0,1,'C');
								$pdf->SetFont('','',11);
								$destruction_startdate = formatDaterpt($row->destruction_startdate);
								$destruction_enddate = formatDaterpt($row->destruction_enddate);
								if($destruction_startdate == $destruction_enddate){
									$date_of_destruction =  date('j<\s\up>S</\s\up> F, Y',strtotime($row->destruction_enddate));
								}
								else{
									$date_of_destruction =   date('j<\s\up>S</\s\up> F, Y',strtotime($row->destruction_startdate)).' to '.  date('j<\s\up>S</\s\up> F, Y',strtotime($row->destruction_enddate));
								}
								$products_data = DB::table('tra_disposal_products as t1')
																		->join('tra_product_information as t2', 't1.product_id', 't2.id')
																		->leftJoin('par_dosage_forms as t3', 't2.dosage_form_id', 't3.id')
																		->select('t2.brand_name', 't3.name as dosage_form')

																		->where(array('application_code'=>$application_code));
										$products = '';
								if($products_data->get()){
									$i = 1;
									$totals = $products_data->count();
									$results =$products_data->get();

									foreach($results as $rows){

										if($totals == $i && $i != 1){
											$products .= ' and '.$rows->brand_name.' '.$rows->dosage_form;
										}
										else{
											if(($i+1) == $totals ){
												$products .= $rows->brand_name.' '.$rows->dosage_form;
											}
											else{

												$products .= $rows->brand_name.' '.$rows->dosage_form.',';
											}

										}
										$i++;
									}

								}
								$lead_inspector = '';
								$inspector = DB::table('tra_disposal_inspectors as t1')
								->join('par_disposal_inspectors_titles as t2', 't1.inspectors_title_id', '=', 't2.id')
								->select(DB::raw("t2.name as inspector_name"))
								->where(array('t1.application_code' => $application_code, 't1.inspectors_title_id'=>1))
								->first();
								if($inspector){
									$lead_inspector = $inspector->inspector_name;
								}
								$text = "This is to certify that the Zambia Medicines Regulatory Authority Inspector ".$lead_inspector." supervised and witnessed the disposal of recalled ".$products." belonging to <b>".$row->applicant."</b> on ".$date_of_destruction.". The total quantity of the products was ".convert_number_to_words($row->total_weight).$row->weights_units." (".$row->total_weight.$row->weights_units.").";
								$pdf->setCellHeightRatio(2);
								$pdf->writeHTML($text, true, false, false, false, '');
									$pdf->SetFont('','',10);

								$methodsof_destructionsdata = DB::table('tra_methodsof_destructions as t1')
																		->join('par_destruction_methods as t2', 't1.destructionmethod_id', 't2.id')
																		->select('t2.name as disposal_method')

																		->where(array('application_code'=>$application_code));
										$methods = '';
								if($methodsof_destructionsdata->get()){
									$i = 1;
									$totals = $methodsof_destructionsdata->count();
										$results =$methodsof_destructionsdata->get();

									foreach($results as $rows){

										if($totals == $i && $i != 1){
											$methods .= ' and '.$rows->disposal_method;
										}
										else{
											if(($i+1) == $totals ){
												$methods .= $rows->disposal_method;
											}
											else{

												$methods .= $rows->disposal_method.',';
											}

										}
										$i++;
									}

								}
							$destruction_sites = DB::table('tra_destruction_exercisesites as t1')
																		->join('par_disposaldestruction_sites as t2', 't1.destruction_site_id', 't2.id')
																		->select('t2.name as destruction_site')

																		->where(array('application_code'=>$application_code));
										$destruction_site  = '';
								if($destruction_sites->get()){
									$i = 1;
									$totals = $destruction_sites->count();
										$results =$destruction_sites->get();

									foreach($results as $rows){

										if($totals == $i && $i != 1){
											$destruction_site .= ' and '.$rows->destruction_site;
										}
										else{
											if(($i+1) == $totals ){
												$destruction_site .= $rows->destruction_site;
											}
											else{

												$destruction_site .= $rows->destruction_site.',';
											}

										}
										$i++;
									}

								}

								$records = DB::table('tra_disposal_inspectors as t1')
								->join('par_disposal_inspectors_titles as t2', 't1.inspectors_title_id', '=', 't2.id')
								->select(DB::raw("count(t1.id) as counter, t2.name as title"))
								->where(array('t1.application_code' => $application_code))
								->groupBy('t2.id');
								$witness = '';
								if(	$records->get()){
									$i = 0;


									$totals = $records->count();
									//$i=$totals;

									$records = $records->get();
									foreach($records as $rows){
										$counter = '';
										if($rows->counter > 1){
											$counter = $rows->counter.' ';
										}

										if($totals == $i && $i != 1){
											$witness .= ' and '.$counter.$rows->title;
										}
										else{
											if(($i+1) == $totals ){
												$witness .= $counter.$rows->title;
											}
											else{
												$witness .= $counter.$rows->title.', ';
											}
										}
										$i++;
									}

								}//destruction_site
								$weight_consignement = $row->total_weight.' '. $row->weights_units;

								$pdf->Cell(0,2,'',0,1);
								$text2 = "The disposal exercise was conducted at ".strtoupper($destruction_site)." in the presence of ".strtoupper($witness).". ".strtoupper($methods)." method of disposal was used in line with good practices on safe disposal of Medicines and Allied Substances.";
								$pdf->writeHTML($text2, true, false, false, false, '');
								$pdf->Cell(0,2,'',0,1);
								$director_details = getPermitSignatoryDetails();
								$dg_signatory = $director_details->director_id;
								$director = $director_details->director;
								$is_acting_director = $director_details->is_acting_director;

								$permit_approval = $row->permit_approval;
								$approved_by = $row->approved_by;
								if($dg_signatory != $approved_by){
										$signatory = $approved_by;
								}
								else{
										$signatory = $dg_signatory;
								}
								$startY = PDF::GetY();
														$startX = PDF::GetX();

								$signature = getUserSignatureDetails($signatory);
								$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
								$pdf->Image($signature,$startX+25,$startY-8,30,12);

								$pdf->Cell(105,0,'',0,0);
								$pdf->Ln();

								$pdf->Cell(0,10,'...............................................................', 0,1,'C');

								$title = "Director-General";
																	if($dg_signatory != $approved_by){
																		$title = 'Acting '.$title;
																	}else{
																		if($is_acting_director ==1){
																			$title = 'Acting '.$title;
																		}

																	}

								$pdf->Cell(0,10,$title, 0,0,'C');



						}else{

						}
					}
						$pdf->Output('Disposal Certificate.pdf');


						return;
						} catch (\Exception $exception) {
						//DB::rollBack();
						$res = array(
							'success' => false,
							'message' => $exception->getMessage()
						);
						} catch (\Throwable $throwable) {
						//DB::rollBack();
						$res = array(
							'success' => false,
							'message' => $throwable->getMessage()
						);
						}
						print_r($res);
}
public function generatePromotionalRegCertificate(Request $req){
					try{
						$application_code = $req->application_code;
								$logo=getcwd().'/assets/images/logo.jpg';

								PDF::setPrintHeader(false);
								PDF::AddPage();

								PDF::setPrintHeader(false);
								PDF::setPrintFooter(false);

								PDF::SetFont('','',13);

								PDF::SetFont('','B',13);

										PDF::SetFont('','B',14);
										PDF::setPrintHeader(false);
										PDF::setPrintFooter(false);
								$this->getReportsletterheader();

								$records = DB::table('tra_promotion_adverts_applications as t1')
														->leftJoin('par_system_statuses as q', 't1.application_status_id', '=', 'q.id')
														->leftJoin('tra_approval_recommendations as t2','t1.application_code', 't2.application_code')
														->join('wb_trader_account as t3', 't1.applicant_id', 't3.id')
														->leftJoin('par_countries as t4', 't3.country_id', 't4.id')
														->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
														->leftJoin('par_sections as t6', 't1.section_id', 't6.id')
														->select(DB::raw("t2.decision_id as recommendation_id, t1.*, t3.name as applicant_name, t3.physical_address, t3.postal_address, t4.name as country_name, t5.name as region_name,t6.name as section_name, t1.id as application_id, t2.expiry_date "))
														->where('t1.application_code',$application_code)
														->first();
								if($records){
									$row = $records;
									$recommendation_id = $row->recommendation_id;
									$ref = $row->reference_no;
									$applicant_name = $row->applicant_name;
									$physical_address = $row->physical_address;
									$postal_address = $row->postal_address;
									$region_name = $row->region_name;
									$country_name = $row->country_name;
									$section_id = $row->section_id;
									$section_name = $row->section_name;
									$expiry_date = $row->expiry_date;
									//$intended_user = $row->intended_user;
									$application_id = $row->application_id;

									PDF::SetFont('','',11);
										PDF::Cell(0,20,'',0,1);
										PDF::Cell(60,5,'Ref.:'.$ref,0,0);
										PDF::Cell(0,5,'Date.:'.date('Y-m-d'),0,1,'R');
											PDF::ln();
											PDF::Cell(0,5,$applicant_name,0,1);
											PDF::Cell(7,5,'',0,0);
											PDF::Cell(0,5,$physical_address,0,1);
											PDF::Cell(7,5,'',0,0);
											PDF::Cell(0,5,$postal_address,0,1);
											PDF::Cell(7,5,'',0,0);
											PDF::Cell(0,5,$row->region_name.','.$row->country_name,0,1);
										//local agent
										PDF::ln();
										if($section_id == 2){
											$section_name = 'medicines';
										}
										PDF::SetLineWidth(3);
											PDF::SetFont('','B',11);
											if($recommendation_id == 1){

												PDF::Cell(7,7,'RE: APPLICATION FOR APPROVAL OF PROMOTIONAL MATERIAL FOR '.strtoupper($section_name),0,0);
											}
											else{
												PDF::Cell(7,7,'RE: REFUSAL OF APPLICATION FOR PROMOTIONAL MATERIAL FOR '.strtoupper($section_name),0,0);

											}
											PDF::SetFont('','',11);
											PDF::ln();
											PDF::ln();
											PDF::MultiCell(0,5,'1. This is in reference to your application with reference number '.$ref.' for approval of promotional material for medicinal product(s)'.".\n" ,0, 'J', 0, 1, '', '', true);
											PDF::Cell(7,5,'',0,1);
										$material_rec =	DB::table('tra_promotion_materials_details as t1')

												->join('par_promotion_material_items  as t2','t1.material_id','=','t2.id')
												->select(DB::raw("group_concat(concat(t2.name) separator ' / ') as promotion_material"))
												->where('t1.application_id',$application_id)
												->first();

											$promotion_material = '';
											if($material_rec){
												$promotion_material = $material_rec->promotion_material;

											}

											PDF::MultiCell(0,5,'2. We would like to inform you that information presented in the '.$promotion_material.' intended for promotion of  your product(s) as summarized in the table below has been assessed and found to comply with legal requirements for conducting medicines promotional  activities in the country as prescribed in the Tanzania Medicines and Medical Devices (Control of Drugs and Herbal Drugs Promotion) Regulations, 2010'.".\n" ,0, 'J', 0, 1, '', '', true);
											PDF::Cell(7,5,'',0,1);

											$adverttype_rec =DB::table('tra_promotion_prod_particulars as t1')
													->leftJoin('par_common_names as t2','t1.common_name_id','=','t2.id')
													->leftJoin('par_product_categories as t3','t1.product_category_id','=','t3.id')
													->leftJoin('par_subproduct_categories as t4','t1.product_subcategory_id','=','t4.id')
													->leftJoin('par_advertisement_types as t5','t1.type_of_advertisement_id','=','t5.id')
													->select(DB::raw('t1.*,t3.name as product_category_name,t4.name as product_subcategory_name,CONCAT_WS(" - ",t5.name,t1.other_details) as type_of_advertisement, t2.name as common_name'))
													->where('t1.application_id',$application_id)
													->get();
												$tbl = '
												<table width="100%" cellspacing="0" cellpadding="1" border = "0.4" >
													<tr style="font-weight:bold;" >
														<td width="5%">S/n</td>
														<td width="25%">Brand Name</td>
														<td width="26%">Generic Name</td>
														<td width="29%" >Advertisement Type</td>
														<td width="14%">Registration Number</td>
													</tr>';
													$i= 1;
											if($adverttype_rec){
												foreach($adverttype_rec as $rows1){
													$tbl .= '<tr style="font-weight:normal;" >
															<td width="5%">'.$i.'</td>
															<td width="25%" stype="">'.$rows1->brand_name.'</td>
															<td width="26%">'.$rows1->common_name.'</td>
															<td width="29%">'.$rows1->type_of_advertisement.'</td>
															<td width="14%">'.$rows1->registration_no.'</td>
														</tr>';
													$i++;
												}

											}
											$tbl .= "</table>
											";
											PDF::writeHTML($tbl, true, false, false, false, '');

									if($recommendation_id == 1){
										//the data

											PDF::MultiCell(0,5,'3. Approval is hereby granted for use of promotion of your product(s), as long as the product(s) continue to comply with registration requirements as prescribed in the Tanzania Medicines and Medical Devices Act, Cap 219. Validity of this permit expires on '.date('d-m-Y', strtotime($expiry_date)).".\n" ,0, 'J', 0, 1, '', '', true);
											PDF::Cell(7,5,'',0,1);

									}
									else{
											PDF::MultiCell(0,5,"3.	The advert has not been approved due to the following reason(s):-.\n" ,0, 'J', 0, 1, '', '', true);
											PDF::Cell(7,5,'',0,1);
											PDF::MultiCell(0,5,"4.	Note that the material should neither be imported nor used in the country for promotional purposes.\n" ,0, 'J', 0, 1, '', '', true);

									}
									PDF::Cell(0,5,'We thank you for your cooperation',0,1);
									PDF::ln();
									$permit_signitory = '';
														$title= '';	PDF::ln();
														$approved_by= '';
														$startY = PDF::GetY();
														$startX = PDF::GetX();

														$signiture = getcwd() . '/resources/images/signatures/hi0kag.png';
														PDF::Image($signiture,$startX,$startY-7,30,12);
														PDF::SetFont('','B',11);

														PDF::SetFont('','B',12);
														PDF::Cell(0,8,'...................................................',0,1,'');

															PDF::Cell(0,8, ucwords(strtolower('A. M. Fimbo')),0,1,'');

															PDF::Cell(0,8,'DIRECTOR GENERAL',0,1,'');

								}
									PDF::Output("Promotional Advertisement.pdf");

						return;
						} catch (\Exception $exception) {
								//PDF::rollBack();
								$res = array(
									'success' => false,
									'message' => $exception->getMessage()
								);
						} catch (\Throwable $throwable) {
								//PDF::rollBack();
								$res = array(
									'success' => false,
									'message' => $throwable->getMessage()
								);
						}
						print_r($res);



}
public function getServiceCharterReportDetails(Request $req){
		try{
			$data = array();
				$module_id = $req->module_id;
				$service_type_id  = $req->service_type_id;
				$section_id = $req->section_id;
				$zone_id = $req->zone_id;
				$received_from = $req->received_from;
				$received_to = $req->received_to;
				$service_charterdata = array();
				$records = DB::table('par_servicecharter_configurations as t1')
										->leftJoin('par_service_types as t2', 't1.service_type_id', 't2.id')
										->leftJoin('modules as t3', 't1.module_id', 't3.id')
										->select('t1.*', 't3.name as module_name','t1.standard_of_delivery as standard_servicedelivery', 't2.name as servicetype_details');

				if(validateIsNumeric($module_id)){
					$records->where('t1.module_id',$module_id);

				}
				if(validateIsNumeric($service_type_id)){
					$records->where('service_type_id',$service_type_id);

				}
				$records = $records->where('t1.is_enabled',1)->get();

				if($records){
						foreach($records as $rec){
							$sections_details = $rec->service_sections;
							$service_type_id = $rec->service_type_id;
							$received_app = $this->getApplicationqueryapps($req,$service_type_id,$section_id,$received_from,$received_to,1);


							if(!is_numeric($received_app)){
									$received_app = $this->returnappCounter($received_app);
							}
							//queried with no response sections_details

							$queriednoresponse_apps = (int)$this->getApplicationqueryapps($req,$service_type_id,$section_id,$received_from,$received_to,3,$rec->standard_servicedelivery);
							if(!is_numeric($queriednoresponse_apps) && $queriednoresponse_apps != ''){
								$queriednoresponse_apps = $this->returnappCounter($queriednoresponse_apps);

							}

							$complied_apps = $this->getApplicationqueryapps($req,$service_type_id,$section_id,$received_from,$received_to,2,$rec->standard_servicedelivery);
							if(!is_numeric($complied_apps)){

									$complied_apps = $this->returnappCounter($complied_apps);

							}

							$rate_of_complaice = 0;
							$noncomplied_apps = ($received_app)-$complied_apps;
							if($received_app != 0 && $complied_apps != 0){
															$divide_by= ($received_app);
															if($divide_by != 0){
																	$rate_of_complaice = round(($complied_apps/$divide_by) * 100,2);//($complied_apps/$received_apps) * 100;

															}

							}
							$data[] = array('standard_servicedelivery'=>$rec->standard_servicedelivery,
											 'module_name'=>$rec->module_name,
											 'servicetype_details'=>$rec->servicetype_details,
											 'received_samples'=>$received_app,
											 'complied_applications'=>$complied_apps,
											 'queried_no_response'=>$queriednoresponse_apps,
											 'non_complience_apps'=>$noncomplied_apps,
											 'rate_of_complaince'=>$rate_of_complaice
											 );



						}

				}
				$res = array(
					'success' => true,
					'results' => $data,
					'message' => 'All is well'
			);
	} catch (\Exception $exception) {
			$res = array(
					'success' => false,
					'message' => $exception->getMessage()
			);
	} catch (\Throwable $throwable) {
			$res = array(
					'success' => false,
					'message' => $throwable->getMessage()
			);
	}
	return \response()->json($res);
}
function returnappCounter($sql_statement){
	$count = 00;
	if(!validateIsNumeric($sql_statement)){
		$records = DB::select($sql_statement);

		if($records){
				$count = $records[0]->counter;
		}


	}

	return $count;
}
function getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,$option_id,$delivery_timeline = null,$min_value = null,$max_value = null){
	//for all the applciaitons as per their query and selected filter options //$option_id 1 for received, 2 for compiled
	$case_id ='';
	$$servicetype_details_id ='';

	$zone_id = $req->zone_id;
	$where_zone = '';
	if(validateisNumeric($zone_id)){
		$where_zone = " and t1.zone_id = '".$zone_id."'";

	}
	$where_section = '';
	if(validateisNumeric($section_id)){
		$where_section = " and t1.section_id = '".$section_id."'";

	}
	switch($servicetype_details_id) {
		case 1:{
			//New of business permits for manufacturing medicines and medical devices
			$table_name= 'tra_premises_applications';
			$grant_table = 'tra_approval_recommendations';
			$grant_datefield = 't2.approval_date';
			$where_business = " and t5.is_manufacturer = 1 and t1.sub_module_id =1";
				$sql_statement = 0;
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code inner join tra_premises_otherdetails t4 on t1.premise_id = t4.premise_id inner join par_business_types t5 on t4.business_type_id = t5.id where t2.trans_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone $where_business";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code inner join tra_premises_otherdetails t4 on t1.premise_id = t4.premise_id inner join par_business_types t5 on t4.business_type_id = t5.id where t3.trans_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline  $where_section $where_zone  $where_business";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code inner join tra_premises_otherdetails t4 on t1.premise_id = t4.premise_id inner join par_business_types t5 on t4.business_type_id = t5.id where t3.trans_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline  $where_section $where_zone  $where_business";

				}

				return $sql_statement;
				break;
		}
		case 2:{
			//New of business permits for manufacturing medicines and medical devices
			$table_name= 'tra_premises_applications';
			$grant_table = 'tra_approval_recommendations';
			$grant_datefield = 't2.approval_date';
			$where_business = " and t5.is_manufacturer != 1 and t1.sub_module_id =1";
				$sql_statement = 0;
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code inner join tra_premises_otherdetails t4 on t1.premise_id = t4.premise_id inner join par_business_types t5 on t4.business_type_id = t5.id where t2.trans_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone $where_business";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code inner join tra_premises_otherdetails t4 on t1.premise_id = t4.premise_id inner join par_business_types t5 on t4.business_type_id = t5.id where t3.trans_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline  $where_section $where_zone  $where_business";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code inner join tra_premises_otherdetails t4 on t1.premise_id = t4.premise_id inner join par_business_types t5 on t4.business_type_id = t5.id where t3.trans_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline  $where_section $where_zone  $where_business";

				}

				return $sql_statement;
				break;
		}

		case 33:{
				$table_name= 'tra_premises_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 't2.approval_date';

				$submission_date = 'trans_date';
				$sql_statement = 0;
				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";
				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";
				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";
				}
				return $sql_statement;
				break;
		}

		case 32:{
				$table_name= 'tra_gmp_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 't2.approval_date';

				$submission_date = 'trans_date';
				$sql_statement = 0;

				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";
				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";
				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";
				}
				return $sql_statement;
				break;
		}
		case 34:{
				$table_name= 'tra_gmp_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 't2.approval_date';

				$submission_date = 'trans_date';
				$sql_statement = 0;

				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";
				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";
				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";
				}
				return $sql_statement;
				break;
		}
		case 35:{
			$table_name= 'tra_premises_applications';
			$grant_table = 'tra_approval_recommendations';
			$grant_datefield = 't2.approval_date';

				$sql_statement = 0;
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where trans_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone and t1.sub_module_id = 2";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where trans_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline  $where_section $where_zone  and t1.sub_module_id = 2";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code where trans_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline  $where_section $where_zone  and t1.sub_module_id = 2";

				}
				return $sql_statement;
				break;
		}
		case 36:{
			$table_name= 'tra_premises_applications';
			$grant_table = 'tra_approval_recommendations';
			$grant_datefield = 't2.approval_date';

				$sql_statement = 0;
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where trans_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where trans_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline  $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code where trans_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline  $where_section $where_zone ";

				}
				return $sql_statement;
				break;
		}
		case 37:{
				$table_name= 'tra_gmp_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 't2.approval_date';

				$submission_date = 'trans_date';
				$sql_statement = 0;

				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";
				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";
				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";
				}
				return $sql_statement;
				break;
		}
		case 38:{
				$table_name= 'tra_gmp_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 't2.approval_date';

				$submission_date = 'trans_date';
				$sql_statement = 0;

				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone and t1.gmp_type_id = 1";
				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS(trans_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone  and t1.gmp_type_id = 1";
				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code inner join tra_payments t3 on t1.application_code = t3.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone  and t1.gmp_type_id = 1";
				}
				return $sql_statement;
				break;
		}
		case 39:{//Evaluation of medicinal products (domestic) including vaccines upon receipt of completed application.
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'submission_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id inner join tra_product_information t5 on t1.product_id = t5.id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone and t5.classification_id = 284";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id inner join tra_product_information t5 on t1.product_id = t5.id  where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}

					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id inner join tra_product_information t5 on t1.product_id = t5.id  where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline  $where_section $where_zone ";
				}
				else{
				 $sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id inner join tra_product_information t5 on t1.product_id = t5.id  where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";


				}
				return $sql_statement;
				break;

				}
		case 7:{
				//Registration of medicinal products from domestic manufacturers.
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";


				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";


				}
				else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";

				}
				else{
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  $where_section $where_zone ";


				}
				return $sql_statement;
			break;
		}
		case 8:{
			//Registration of imported medicinal products.
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';


				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 2 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";


				}
				else if($option_id == 2){
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 2 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";


				}
				else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 2 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";


				}
				else{
					$sql_statement=  "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 2 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				return $sql_statement;
			break;
		}
		case 9:{
			//Registration of priority medicines
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';


				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code   where t1.is_fast_track =1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";


				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code   where t1.is_fast_track =1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";


				} else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code   where t1.is_fast_track =1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline  $where_section $where_zone ";
				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  where t1.is_fast_track =1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone";

				}
				return $sql_statement;
			break;}
		case 10:{
				//Registration of complementary medicines
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_zone ";

				}
				else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $check_timeline $where_zone ";

				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				return $sql_statement;
			break;
		}
		case 12:{
				//Registration of Class A medical devices
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id  where t3.classification_id = 365 and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id inner join payments t4 on t1.reference_no = t4.reference_no where t3.classification_id = 365 and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date , $grant_datefield) <= $delivery_timeline  $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id  inner join tra_payments t4 on t1.application_code = t4.application_code where t3.classification_id = 365 and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline  $where_section $where_zone ";

				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id  inner join payments t4 on t1.reference_no = t4.reference_no where t3.classification_id = 365 and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				return $sql_statement;
			break;}
		case 13:{
				//Registration of Class B, C and D medical devices
				$table_name= 'tr_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id  where t3.classification_id in (366,367,368) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id  inner join tra_payments t4 on t1.application_code = t4.application_code where t3.classification_id in (366,367,368) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline  $where_section $where_zone ";

				}
				else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id  inner join payments t4 on t1.application_code = t4.application_code where t3.classification_id in (366,367,368) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline  $where_section $where_zone ";


				}
				else{

					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id  inner join payments t4 on t1.application_code = t4.application_code where t3.classification_id in (366,367,368) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  $where_section $where_zone ";

				}
				return $sql_statement;
			break;
		}

		case 16:{//renewal Medicinal products from domestic manufacturers.
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'submission_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}

					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline  $where_section $where_zone ";
				}
				else{
				 $sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join tra_product_applications t3 on t1.product_id = t3.product_id where t3.product_type_id = 1 and t1.section_id = 2 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";


				}
				return $sql_statement;
				break;

				}
		case 17:{//imported products
				$table_name= 'product_renewals';
				 $grant_table = 'evaluator_recommendations';
				$grant_datefield = 'added_on';


				$submission_date = 'submission_date';
				 if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 2 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 1 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 1 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";


				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join tra_product_information t3 on t1.product_id = t3.id where t3.product_type_id = 1 and t1.section_id = 2  and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				return $sql_statement;
				 break;
				}
		case 18:{//renewal Complementary medicines (herbal medicines, antiseptics and disinfectants).
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';
				$submission_date = 'trans_date';
				 if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where t1.sub_module_id = 8 and t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where  t1.sub_module_id = 8 and t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where  t1.sub_module_id = 8 and t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline $where_section $where_zone ";


				}
				else{

					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  inner join products t3 on t1.product_id = t3.id where  t1.sub_module_id = 8 and t3.classification_id in (1,383) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				return $sql_statement;
				break;}

		case 20:{//renewal medical devices
				$table_name= 'tra_product_applications';
				$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'trans_date';
				 if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where  t1.sub_module_id = 8 and t1.section_id = 4 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where  t1.sub_module_id = 8 and t1.section_id = 4 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline  $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where t1.section_id = 4 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline  $where_section $where_zone ";

				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  where t1.section_id = 4 and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'   $where_section $where_zone ";


				}
				 return $sql_statement;

				break;

				 }
		case 21:{//Issuance of clinical trial permits
			$table_name= 'tra_clinical_trial_applications';
			 $grant_table = 'granting_recommendations';
				$grant_datefield = 'approval_date';
				$submission_date = 'trans_date';
				if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline $where_section $where_zone ";

				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code where $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				 return $sql_statement;

		break;}

		case 23:{//Variation of a registered medicine, cosmetics and medical devices
				$table_name= 'tra_product_applications';
					$grant_table = 'tra_approval_recommendations';
				$grant_datefield = 'approval_date';

				$submission_date = 'trans_date';
				 if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_payments t2 on t1.application_code = t2.application_code  where sub_module_id = 9 and t1.section_id in (2,3,4) and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where sub_module_id = 9 and t1.section_id in (2,4) and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date , $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where sub_module_id = 9 and t1.section_id in (2,4) and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."'$check_timeline $where_section $where_zone ";
				}
				else{
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join tra_application_query_reftracker t2 on t1.application_code = t2.application_code  where  sub_module_id = 9 and t1.section_id in (2,4) and $submission_date  BETWEEN '".$received_from."' AND '".$received_to."' $where_section and t2.finished !=1 $where_zone ";

				}
				 return $sql_statement;
				break;
		}
		case 24:{//Import and export permits of registered food, medicines, cosmetics and medical devices
				$table_name= 'tra_importexport_applications';
				$grant_table = 'tra_managerpermits_review';
				$grant_datefield = 'approval_date';
				$submission_date = 'submission_date';
				$sql_statement = '';
				 if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1  where  sub_module_id in (12,16) and  $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code   where sub_module_id in (12,16) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' and TOTAL_WEEKDAYS($submission_date , $grant_datefield) <= $delivery_timeline  $where_section $where_zone ";


				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code   where    sub_module_id in (12,16) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $check_timeline  $where_section $where_zone ";

				}

				return $sql_statement;
				break;
		}
		case 25:{//Import and export permits of non-registrable products after receiving pre-shipment sample
			$table_name= 'tra_importexport_applications';
				$grant_table = 'tra_managerpermits_review';
				$grant_datefield = 'approval_date';
				$submission_date = 'submission_date';

				$sql_statement = '';
				 if($option_id == 1){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1  where sub_module_id in (13,14,15) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

				}
				else if($option_id == 2){
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where sub_module_id in (13,14,15) and  $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

				}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement= "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.application_code = t2.application_code  where sub_module_id in (13,14,15) and $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline $where_section $where_zone ";

				}

				return $sql_statement;
				break;
			}
		case 29:{//laboratory_samples
			$table_name= 'sample_applications';
			$grant_table = 'sample_compliance_recommendation';
				$grant_datefield = 'recommendation_date';

				$submission_date = 'reviewed_on';
				$sql_statement = '';
				$counter = '';
			if($option_id == 1){
				$sql_statement = "select count(DISTINCT t1.id) as counter from $table_name t1  where laboratory_no != '' and $submission_date BETWEEN '".$received_from."' AND '".$received_to."' $where_section $where_zone ";

			}
			else if($option_id == 2){

				$sql_statement = "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.sample_id = t2.sample_id  where  $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  and TOTAL_WEEKDAYS($submission_date, $grant_datefield) <= $delivery_timeline $where_section $where_zone ";

			}else if($option_id == 4){
					$check_timeline = '';
					if($max_value == 0){
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) >= $min_value";
					}
					else{
						$check_timeline = " and TOTAL_WEEKDAYS($submission_date, $grant_datefield) BETWEEN $min_value AND $max_value";
					}
					$sql_statement = "select count(DISTINCT t1.id) as counter from $table_name t1 inner join $grant_table t2 on t1.sample_id = t2.sample_id  where  $submission_date BETWEEN '".$received_from."' AND '".$received_to."'  $check_timeline $where_section $where_zone ";

				}
			if($sql_statement != ''){
				$sql_query = DB::connection('lims_db')->select($sql_statement);
				$counter = 0;
				if($sql_query){
					$counter = $sql_query->counter;
				}

			}

			return $counter;
			break;
			}
	}


}
public function funcPrintServiceCharterSectionsSummaryRpt(Request $req){
	try{
		PDF::setPrintHeader(false);
		PDF::setPrintFooter(false);
		PDF::AddPage('L');
		PDF::SetFont('','B',13);

		$this->getReportheaderLandscape('SERVICE STANDARDS');
		$module_id = $req->module_id;
		$servicetype_details_id = $req->servicetype_details_id;
		$service_type_id = $req->service_type_id;
		$section_id = $req->section_id;
		$received_from = $req->received_from;
		$received_to = $req->received_to;
		PDF::Cell(0,2,'',0,1);
		//PDF::Cell(117);
		PDF::SetFont('','',10);
		PDF::Cell(0,4,'Report for the Period: '.$received_from.' - '.$received_to,0,0,'');
		PDF::Cell(0,4,'Print Date: '.date('d/m/Y h:i:s a'),0,1,'R');
		PDF::ln();
		//get the table details
		$records = DB::table('par_servicecharter_configurations as t1')
									->leftJoin('par_service_types as t2', 't1.service_type_id', 't2.id')
									->leftJoin('modules as t3', 't1.module_id', 't3.id')
									->select('t1.*', 't3.name as module_name','t1.standard_of_delivery as standard_servicedelivery', 't2.name as servicetype_details');

			if(validateIsNumeric($module_id)){
				$records->where('t1.module_id',$module_id);

			}
			if(validateIsNumeric($service_type_id)){
				$records->where('service_type_id',$service_type_id);

			}
			$records = $records->where('t1.is_enabled',1)->get();

		$data = array();
		if($records){
									//columns
									PDF::Cell(10,5,'No.',1,0);
									PDF::Cell(80,5,'Type of services',1,0);
									PDF::Cell(52,5,'Stand. of Ser. Delivery',1,0);
									PDF::Cell(26,5,'Received',1,0);
									PDF::Cell(32,5,'Queried.(Non Resp)',1,0);
									PDF::Cell(28,5,'Complied',1,0);
									PDF::Cell(32,5,'Non-Complaince',1,0);
									PDF::Cell(0,5,'%',1,1);
									$check_rec = '';
									$check_servicetype = '';
									$i = 1;
									$dimensions = PDF::getPageDimensions();
													$hasBorder = false;
									foreach($records as $rows){
											$module_name = $rows->module_name;
											$sections_details = $rows->service_sections;
											$servicetype_details = $rows->servicetype_details;
										//	$servicetype_details_id = $rows->servicetype_details_id;
											$service_type_id = $rows->service_type_id;
											if($module_name != $check_rec ){

													PDF::SetFont('','B',10);
													PDF::Cell(10,5,$i,1,0);
													PDF::Cell(0,5,$module_name,1,1);
													$i++;

											}

											//check the service type details
											if($servicetype_details != $check_servicetype ){

													PDF::SetFont('','B',10);
													PDF::Cell(10,5,'',1,0);
													PDF::Cell(0,5,$servicetype_details,1,1);
													$i++;

											}
											//view the sections
											$sections = explode(',',$sections_details);
											$section_rec = DB::table('par_sections')->whereIn('id',$sections);

											if(validateisNumeric($section_id)){
													$section_rec ->where(array('id'=>$section_id));
											}
											$section_rec = 	$section_rec->get();

											foreach($section_rec as $section_row){
													$section_name = $section_row->name;
													$section_id = $section_row->id;

													$rowcount = max(PDF::getNumLines($section_name, 80),PDF::getNumLines($rows->standard_servicedelivery, 35));
													///
													$received_app = $this->getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,1);
															if(!is_numeric($received_app)){

																			$received_app = $this->returnappCounter($received_app);

															}
															$complied_apps = $this->getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,2,$rows->standard_servicedelivery);
															if(!is_numeric($complied_apps)){

																			$complied_apps = $this->returnappCounter($complied_apps);

															}
															//queried with no response
															$queriednoresponse_apps = $this->getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,3,$rows->standard_servicedelivery);
															if(!is_numeric($queriednoresponse_apps) && $queriednoresponse_apps != ''){
																	$queriednoresponse_apps = $this->returnappCounter($queriednoresponse_apps);
																	//echo $queriednoresponse_apps.';';
															//exit();
															}
															$rate_of_complaice = 0;
														 // $noncomplied_apps = ($received_app-$queriednoresponse_apps) -$complied_apps;
															$noncomplied_apps = ($received_app) -$complied_apps;

															if($received_app != 0 && $complied_apps != 0){
								//$divided_by = $received_app-$queriednoresponse_apps;
								$divided_by = $received_app;
								if($divided_by != 0){
																		 $rate_of_complaice = round((($complied_apps)/$divided_by) * 100,2);//($complied_apps/$received_apps) * 100;

								}
															}

															PDF::SetFont('','',10);
															PDF::MultiCell(10,$rowcount*5,'',1,'','',0);
															PDF::MultiCell(80,$rowcount*5,$section_name,1,'','',0,'');
															PDF::MultiCell(52,$rowcount*5,$rows->standard_servicedelivery.' days',1,'','',0);
															PDF::MultiCell(26,$rowcount*5,$received_app,1,'','',0);
															PDF::MultiCell(32,$rowcount*5,$queriednoresponse_apps,1,'','',0);
															PDF::MultiCell(28,$rowcount*5,$complied_apps,1,'','',0);
															PDF::MultiCell(32,$rowcount*5,$noncomplied_apps,1,'','',0);
															PDF::MultiCell(0,$rowcount*5,$rate_of_complaice.' %',1,'','',1);

											}//
											 $check_rec = $rows->module_name;
											 $check_servicetype = $servicetype_details;
									}

									PDF::output('Service Charter Report'.rand(0,100).'.pdf');
									exit();
		}

	}
catch (\Exception $exception) {
					$res = array(
							'success' => false,
							'message' => $exception->getMessage()
					);
			} catch (\Throwable $throwable) {
					$res = array(
							'success' => false,
							'message' => $throwable->getMessage()
					);
			} return \response()->json($res);
}
public function funcExportServiceCharterSummaryRpt(Request $req){
	try{

	}
catch (\Exception $exception) {
					$res = array(
							'success' => false,
							'message' => $exception->getMessage()
					);
			} catch (\Throwable $throwable) {
					$res = array(
							'success' => false,
							'message' => $throwable->getMessage()
					);
			} return \response()->json($res);
}

public function funcPrintServiceCharterSummaryRpt(Request $req){
	try{
		PDF::setPrintHeader(false);
		PDF::setPrintFooter(false);
		PDF::AddPage('L');
		PDF::SetFont('','B',13);

		$this->getReportheaderLandscape('SERVICE STANDARDS');
		$module_id = $req->module_id;
		$servicetype_details_id = $req->servicetype_details_id;
		$service_type_id = $req->service_type_id;
		$section_id = $req->section_id;
		$received_from = $req->received_from;
		$received_to = $req->received_to;
		PDF::Cell(0,2,'',0,1);
		//PDF::Cell(117);
		PDF::SetFont('','',10);
		PDF::Cell(0,4,'Report for the Period: '.$received_from.' - '.$received_to,0,0,'');
		PDF::Cell(0,4,'Print Date: '.date('d/m/Y h:i:s a'),0,1,'R');
		PDF::ln();
		//get the table details
		$records = DB::table('par_servicecharter_configurations as t1')
									->leftJoin('par_service_types as t2', 't1.service_type_id', 't2.id')
									->leftJoin('modules as t3', 't1.module_id', 't3.id')
									->select('t1.*', 't3.name as module_name','t1.standard_of_delivery as standard_servicedelivery', 't2.name as servicetype_details');

			if(validateIsNumeric($module_id)){
				$records->where('t1.module_id',$module_id);

			}
			if(validateIsNumeric($service_type_id)){
				$records->where('service_type_id',$service_type_id);

			}
			$records = $records->where('t1.is_enabled',1)->get();

		$data = array();
		if($records){
									//columns
									PDF::Cell(10,5,'No.',1,0);
									PDF::Cell(80,5,'Type of services',1,0);
									PDF::Cell(52,5,'Standards of Service Delivery',1,0);
									PDF::Cell(26,5,'Received',1,0);
									PDF::Cell(32,5,'Queried. Non Resp',1,0);
									PDF::Cell(28,5,'Complied',1,0);
									PDF::Cell(32,5,'Non-Complaince',1,0);
									PDF::Cell(0,5,'%',1,1);
									$check_rec = '';
									$check_servicetype = '';
									$i = 1;
									$dimensions = PDF::getPageDimensions();
													$hasBorder = false;
									foreach($records as $rows){
										$module_name = $rows->module_name;

										if($module_name != $check_rec ){
											PDF::SetFont('','B',10);
											PDF::Cell(10,5,$i,1,0);
											PDF::Cell(0,5,$module_name,1,1);
											$i++;
										}
										$rowcount = max(PDF::getNumLines($rows->servicetype_details, 80),PDF::getNumLines($rows->standard_servicedelivery, 35));
										///PDF::MultiCell(10,$rowcount*5,'',1,'','',0);
										$servicetype_details_id = $rows->service_type_id;
										$received_app = $this->getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,1);
											if(!is_numeric($received_app)){

													$received_app = $this->returnappCounter($received_app);

											}
											$complied_apps = $this->getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,2,$rows->standard_servicedelivery);
											if(!is_numeric($complied_apps)){

													$complied_apps = $this->returnappCounter($complied_apps);

											}
											//queried with no response
											$queriednoresponse_apps = $this->getApplicationqueryapps($req,$servicetype_details_id,$section_id,$received_from,$received_to,3,$rows->standard_servicedelivery);
											if(!is_numeric($queriednoresponse_apps) && $queriednoresponse_apps != ''){
												$queriednoresponse_apps = $this->returnappCounter($queriednoresponse_apps);
												//echo $queriednoresponse_apps.';';
											//exit();
											}
											$rate_of_complaice = 0;
											//$noncomplied_apps = ($received_app-$queriednoresponse_apps) -$complied_apps;
											$noncomplied_apps = ($received_app) -$complied_apps;
											if($received_app != 0 && $complied_apps != 0){
												$divide_by= ($received_app);
																			if($divide_by != 0){

																					$rate_of_complaice = round(($complied_apps/$divide_by) * 100,2);//($complied_apps/$received_apps) * 100;
																			}
											}
											PDF::SetFont('','',10);
																	PDF::MultiCell(10,$rowcount*6,'',1,'','',0);
																	PDF::MultiCell(80,$rowcount*6,$rows->servicetype_details,1,'','',0,'');
																	PDF::MultiCell(52,$rowcount*6,$rows->standard_servicedelivery.' days',1,'','',0);
																	PDF::MultiCell(26,$rowcount*6,$received_app,1,'','',0);
																	PDF::MultiCell(32,$rowcount*6,$queriednoresponse_apps,1,'','',0);
																	PDF::MultiCell(28,$rowcount*6,$complied_apps,1,'','',0);
																	PDF::MultiCell(32,$rowcount*6,$noncomplied_apps,1,'','',0);
																	PDF::MultiCell(0,$rowcount*6,$rate_of_complaice.' %',1,'','',1);
																	$check_rec = $rows->module_name;
									}

									PDF::output('Service Charter Report'.rand(0,100).'.pdf');
									exit();
		}

	}
catch (\Exception $exception) {
					$res = array(
							'success' => false,
							'message' => $exception->getMessage()
					);
			} catch (\Throwable $throwable) {
					$res = array(
							'success' => false,
							'message' => $throwable->getMessage()
					);
			} return \response()->json($res);


}
public function printSpecialRequestScreeningfrm(Request $req){
	try{
		PDF::setPrintHeader(false);
		PDF::setPrintFooter(false);
		PDF::AddPage('');
		PDF::SetFont('','B',13);
		$application_code = $req->application_code;
		$this->getReportheader('SPECIAL REQUEST SCREENING FORM');
		PDF::SetFont('','',9);
		PDF::Cell(0,4,'Print Date: '.date('d/m/Y h:i:s a'),0,1,'R');
		PDF::ln();

		PDF::Cell(50,8,'APPLICATION NUMBER: ',0,0);
		$rec = DB::table('tra_importexport_applications as t1')
                ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
                ->leftJoin('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
                ->leftJoin('tra_prechecking_recommendations as t5', 't1.application_code','t5.application_code')
                ->leftJoin('tra_managerpermits_review as t6', 't1.application_code','t6.application_code')
				->leftJoin('wb_trader_account as t7', 't1.applicant_id','t7.id')
				->leftJoin('par_countries as t8', 't7.country_id','t8.id')
				->leftJoin('par_regions as t9', 't7.region_id','t9.id')
				->leftJoin('par_evaluation_recommendations as t10', 't5.recommendation_id','t10.id')
				->leftJoin('par_permits_reviewrecommendations as t11', 't6.decision_id','t11.id')
				->leftJoin('par_permits_reviewrecommendations as t12', 't4.decision_id','t12.id')
				->leftJoin('users as t13', 't4.created_by', 't13.id')
				->leftJoin('users as t14', 't6.prepared_by_id', 't14.id')
				->leftJoin('users as t15', 't5.screened_by', 't15.id')
				->leftJoin('par_permit_category as t17', 't1.permit_category_id', 't17.id')
				->select(DB::raw("t1.*,t17.name as permit_category, CONCAT_WS(' ',decrypt(t13.first_name),decrypt(t13.last_name)) as approved_by, CONCAT_WS(' ',decrypt(t14.first_name),decrypt(t14.last_name)) as reviewed_by,CONCAT_WS(' ',decrypt(t15.first_name),decrypt(t15.last_name)) as screened_byname, t1.reference_no,t5.created_on as screened_on, t5.remarks as screening_remarks,t10.name as screening_recom, t4.comment as approval_comment, t6.comment as review_comment,t6.approval_date as review_date, t4.approval_date,t12.name as approval_recommendation, t11.name as review_recommendation, t7.name as request_from,t8.name as country_name, t9.name as region_name, t7.physical_address, t7.postal_address"))
				->where('t1.application_code', $application_code)
		//dd($rec->toSql());
				->first();
		if($rec){
			PDF::SetFont('','',11);
				PDF::Cell(0,8,'Ref No: '.$rec->tracking_no.' '.$rec->reference_no,0,1);

				PDF::SetFont('','B',11);
				PDF::Cell(45,8,'REQUEST FROM: ',0,1);
				PDF::SetFont('','',11);
				PDF::Cell(0,8,$rec->request_from,0,1);

				PDF::Cell(0,8,$rec->physical_address,0,1);
				PDF::Cell(0,8,$rec->postal_address.', '.$rec->region_name.', '.$rec->country_name,0,1);

				PDF::Cell(45,8,'1. Reasons for Special Applications: '.$rec->permit_category,0,1);

				if($rec->section_id == 2){
					$section_title = "Medicines Registration";
				}
				else{
					$section_title = 'Medical Devices and Diagnostics Registration';
				}
				PDF::SetFont('','B',11);
				PDF::Cell(0,8,'2. Assessment and recommendations from '.($section_title).' officer',0,1);
				PDF::SetFont('','',11);
				PDF::MultiCell(0,8,'Recommendation: '.$rec->screening_recom,0,'','',1);
				PDF::Cell(45,8,'Remarks:',0,1);

				PDF::MultiCell(0,10,$rec->screening_remarks,0,'','',1);

				PDF::Cell(45,8,'Name of Officer: '.strtoupper($rec->screened_byname),0,0);

				PDF::Cell(0,8,'Date: '.formatDate($rec->screened_on),0,1,'R');
				PDF::SetFont('','B',11);
				PDF::Cell(0,8,'3. Recommendation from Manager '.($section_title),0,1);
				PDF::SetFont('','',11);
				PDF::MultiCell(0,8,'Recommendation: '.$rec->review_recommendation,0,'','',1);
				PDF::Cell(45,8,'Remarks:',0,1);

				PDF::MultiCell(0,10,$rec->review_comment,0,'','',1);

				PDF::Cell(45,8,'Name of Manager :'.strtoupper($rec->reviewed_by),0,0);

				PDF::Cell(0,8,'Date: '.formatDate($rec->review_date),0,1,'R');
				PDF::SetFont('','B',11);
				PDF::Cell(0,8,'4. Director of Medicines and Complementaty Products',0,1);
				PDF::SetFont('','',11);
				PDF::Cell(45,8,'Recommendation: '.$rec->approval_recommendation,0,1);
				PDF::Cell(45,8,'Comments:',0,1);

				PDF::MultiCell(0,10,$rec->approval_comment,0,'','',1);
				PDF::Cell(45,8,'Name:'.$rec->approved_by,0,0);

				PDF::Cell(0,8,'Date: '.formatDate($rec->approval_date),0,1,'R');

				PDF::OutPut();
				return;

		}
		else{
			$res = array('success'=>false, 'message'=>"Application Not Found");
		}
	  }
	catch (\Exception $exception) {
			$res = array(
					'success' => false,
					'message' => $exception->getMessage()
			);
	   } catch (\Throwable $throwable) {
				$res = array(
						'success' => false,
						'message' => $throwable->getMessage()
				);
	   } return \response()->json($res);

}

public function printAssessmentTemplate(Request $req){
    try{
    	$application_code = $req->application_code;
        $operation = $req->operation;

        PDF::setPrintHeader(false);
        PDF::setPrintFooter(false);
        PDF::SetMargins(13,5,13, true);
        PDF::AddPage('');
        PDF::SetFont('','B',13);
        PDF::SetFont('','',9);
        PDF::Cell(0,4,'Print Date: '.date('d/m/Y h:i:s a'),0,1,'R');

        $logo = getcwd() . '/resources/images/zamra-logo.png';
        //$logo = getcwd() . '/resources/images/zamra-logo.png';
        $header = '
				<table border="0" cellpadding="1" cellspacing="1" style="width:500px;">
					<tbody>
						<tr>
							<td colspan="3" style="text-align: center;"><strong>TANZANIA MEDICINES AND MEDICAL DEVICES AUTHORITY</strong></td>
						</tr>
						<tr>
							<td>Email: info@zamra.go.tz</td>
							<td colspan="1" rowspan="4"><img src="'.$logo.'" ></td>
							<td>Abdul Jumbe Avenue,</td>
						</tr>
						<tr>
							<td>Tel: +255 26 2961989, 2061,990</td>
							<td>Block ZZ Plot No. 191.</td>
						</tr>
						<tr>
							<td>Toll Free: 0800 110 084</td>
							<td>P.O. Box 1253,</td>
						</tr>
						<tr>
							<td>Website: www.zamra.go.tz</td>
							<td>Dodoma, Tanzania</td>
						</tr>
					</tbody>
				</table>';

        //PDF::WriteHTML($header, true, 0, true, true);
        $sql = DB::table('tra_assessment_template as t1')
                ->leftjoin('users as t2','t1.eval_created_by','=','t2.id')
                ->leftjoin('users as t3','t1.audit_created_by','=','t3.id')
                ->select(DB::raw("t1.id,t1.evaluation,CONCAT_WS(' ',decrypt(t2.first_name),decrypt(t2.last_name)) as evaluator, t1.audit,CONCAT_WS(' ',decrypt(t3.first_name),decrypt(t3.last_name)) as auditor,isaudited"))
                ->where('application_code','=',$application_code)
                ->where('isactive',1);

        $result = $sql->first();

        if($operation==0){
        	$header=$header.'<br><br><strong>EVALUATION REPORT</strong>';
        	//$this->getReportsletterheader();
        	PDF::ln();

            if(!is_null($result)){
            	$evaluator = '<br><table><tr>Evaluator<td></td><td>'.$result->evaluator.'</td></tr></table>';
                 $template= $result->evaluation;
                 PDF::SetFont('','',11);
                 PDF::WriteHTML($header.'<br> <br>'.$template.$evaluator, true, 0, true, true);
                 PDF::OutPut();
                return;
            }else{
            	$res = array('success'=>false, 'message'=>"Application Not Found");
            }

        }else if($operation==1){
        	$header=$header.'<br><br><strong>AUDIT REPORT</strong>';
            if(!is_null($result)){
            	$evaluator = '<br><table><tr>Auditor<td></td><td>'.$result->auditor.'</td></tr></table>';
                 $template= $result->audit;
                 PDF::SetFont('','',11);
                 PDF::WriteHTML($header.'<br> <br>'.$template.$evaluator, true, 0, true, true);
                 PDF::OutPut();
                return;
            }else{
            	$res = array('success'=>false, 'message'=>"Application Not Found");
            }
        }
        else{
            $res = array('success'=>false, 'message'=>"Application Not Found");
        }
    }
   	catch (\Exception $exception) {
                    $res = array(
                            'success' => false,
                            'message' => $exception->getMessage()
                    );
    }
    catch (\Throwable $throwable) {
                    $res = array(
                            'success' => false,
                            'message' => $throwable->getMessage()
                    );
    }
    return \response()->json($res);

}
public function generateOnlineProductsApplicationRpt(Request $req){
	try{
				$org_info = $this->getOrganisationInfo();
				$pdf = new PdfLettersProvider();
				$pdf->AddPage();
				$pdf->Cell(0,4,'Product Applicatio Information',0,1,'C');



				$pdf->Output();

	}catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

}

public function generateAmmendementApprovalletter($application_code, $is_notification = false, $file_path = null){
       $qry = DB::table('tra_product_applications as t1')
                ->join('tra_product_information as t2','t1.product_id','=','t2.id')
                ->leftJoin('tra_product_ingredients as t2a','t2.id','=','t2a.product_id')
                ->leftJoin('par_ingredients_details as t2b','t2a.ingredient_id','=','t2b.id')
                ->leftJoin('par_si_units as t2d','t2a.ingredientssi_unit_id','=','t2d.id')
                ->leftJoin('par_dosage_forms as t2c','t2.dosage_form_id','=','t2c.id') //dosage_form_id par_dosage_forms
                ->leftJoin('par_distribution_categories as t3c','t2.propdistribution_category_id','=','t3c.id') //dosage_form_id par_dosage_forms
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id','t3.id')
                ->leftJoin('par_countries as t3a', 't3.country_id','t3a.id')
                ->leftJoin('par_countries as t4a', 't3.region_id','t4a.id')
                ->join('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
                ->select('t1.application_code','t3c.name as distribution_category', 't1.*', 't1.reference_no' ,
                            DB::raw("GROUP_CONCAT(CONCAT(t2b.name,' ' ,t2a.strength, ' ', t2d.name) SEPARATOR ' + ') as common_name"),
                            't2.brand_name','t3.name as applicant_name','t3.postal_address', 't3.physical_address', 't3a.name as country_name', 't3.email as applicant_email','t4.permit_signatory as  approved_by', 't4.certificate_no','t4a.name as region_name',
                            't4.approval_date','t2c.name as dosage_form')
                ->where('t1.application_code', $application_code)
                ->groupBy('t2.id');
         $app_details = $qry->first();
         if (is_null($app_details)) {
              $res = 'The Reference provided does not match any record or Not yet approved!!';
              return $res;
          }


          $title = "NOTIFICATION OF APPROVAL OF CHANGE(S) TO ".$app_details->brand_name." (".$app_details->common_name.") ".$app_details->dosage_form;

			$org_info = $this->getOrganisationInfo();
			$pdf = new PdfLettersProvider();
			$pdf->AddPage();
			$template_url = base_path('/');
			$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
			$tplId = $pdf->importPage(1);
			$pdf->useTemplate($tplId,0,0);
			$pdf->setPageMark();

			$pdf->SetFont('times','B',9);
			$pdf->Cell(0,1,'',0,1);

			$pdf->Cell(0,4,'FORM II',0,1,'R');
			$pdf->Cell(0,4,'(Regulation 3)',0,1,'R');
			$pdf->SetFont('times','B',13);
			$pdf->Cell(0,15,'',0,1);
			$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
			$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

			$pdf->SetFont('times','B',12);
			$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
			//title
			if($app_details->tracking_no != ''){

																		$application_no = 	$app_details->tracking_no;
			}
																	if($app_details->reference_no != ''){

																		$application_no = 	' '.$app_details->reference_no;
																	}
																	$pdf->Cell(0,10,'Application Reference:'.$application_no,0,1, 'R');

																	$data = '{"tracking_no":'.$app_details->reference_no.',"module_id":'.$app_details->module_id.',"application_code":'.$app_details->application_code.'}';

																	$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
																	// QRCODE,H : QR-CODE Best error correction
																	$pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);
																	$pdf->SetFont('times','',12);
																	//Letter heading
																	$pdf->Cell(0,8,'To:',0,1);
																	$pdf->Cell(0,8,$app_details->applicant_name.',',0,1);

																	$pdf->Cell(0,8,$app_details->physical_address.',',0,1);
																	$pdf->Cell(0,8,$app_details->postal_address.',',0,1);
																	$pdf->Cell(0,8,$app_details->region_name." ".$app_details->country_name,0,1);

																	$pdf->SetFont('times','BU',11);
																	$pdf->Cell(0,8,'RE:  APPLICATION FOR AMENDMENT TO A MARKETING AUTHORISATION ',0,1);
																	$pdf->SetFont('times','',11);
																	$template = "Reference is made to your application for amendment to marketing authorization for a pharmaceutical product, submitted in line with Section 39 of the Medicines and Allied Substances Act (No. 3) of 2013, for the product listed below:";

																	$pdf->WriteHTML($template, true, false, true, true);
																	$pdf->ln();
																	$pdf->SetFont('times','B',12);
																	$pdf->cell(10,7, 'No.', 1,0);
																	$pdf->cell(45,7, 'Name of Product.', 1,0);
																	$pdf->cell(45,7, 'Application No.', 1,0);
																	$pdf->cell(45,7, 'CoD.', 1,0);
																	$pdf->cell(0,7, 'Ma No..', 1,1);
																	$pdf->SetFont('times','',11);
																	$pdf->cell(10,7, '1', 1,0);
																	$pdf->cell(45,7, $app_details->brand_name, 1,0);
																	$pdf->cell(45,7,$application_no, 1,0);
																	$pdf->cell(45,7, $app_details->distribution_category, 1,0);
																	$pdf->cell(0,7, $app_details->certificate_no, 1,1);
																	$pdf->SetFont('times','',11);
																	$pdf->ln();
																	$pdf->cell(0,7, 'Abbreviations:', 0,1);
																	$pdf->cell(0,7, 'CoD - Category of Distribution', 0,1);
																	$pdf->cell(0,7, 'Ma No. - Marketing Authorisation Number', 0,1);

																	$pdf->Cell(0,8,'Abbreviation: MA No - Marketing Authorisation Number. ',0,1);

																	$rec = DB::table('tra_application_invoices as t1')
																			->leftJoin('tra_payments as t3', 't1.id', 't3.invoice_id')
																			->leftJoin('par_currencies as t4', 't3.currency_id', 't3.id')
																			->select(DB::Raw("sum(amount_paid) as amount_paid,t1.invoice_no, t1.date_of_invoicing,  t4.name as currency_name"))
																			->where(array('t1.application_code'=>$application_code))
																			->first();

																		if($rec){
																			$template = "We acknowledge receipt of payment of a total sum of ".$rec->currency_name.' '.convert_number_to_words($rec->amount_paid).' ('.$rec->currency_name.' '.$rec->amount_paid.") as per Invoice number ".$rec->invoice_no." dated ".formatDaterpt($rec->date_of_invoicing)." as amendment fees for the above mentioned product.";
																			$pdf->WriteHTML($template, true, false, true, true);
																		}
																		$pdf->ln();
																	$template = "We wish to advise that we have completed our review of the application and are pleased to inform you that approval has been granted. Our records have been updated accordingly.";
																	$pdf->WriteHTML($template, true, false, true, true);
																	$pdf->ln();
																	$pdf->Cell(0,7,'In this regard, you may proceed with implementation of the proposed amendment. ',0,1);
																	$pdf->Cell(0,7,'Should you have any questions, please do not hesitate to contact our secretariat.',0,1);
																	$pdf->Cell(0,7,'Yours faithfully,',0,1);
																	$pdf->Cell(0,7,'for/Zambia Medicines Regulatory Authority,',0,1);
																	$pdf->ln();
																	$pdf->ln();
																	$startY = $pdf->GetY();
																	$startX =$pdf->GetX();
																	$director_details = getPermitSignatoryDetails();
																	$dg_signatory = $director_details->director_id;
																	$director = $director_details->director;
																	$is_acting_director = $director_details->is_acting_director;

																	$approved_by = $app_details->approved_by;
																	if($dg_signatory != $approved_by){
																		$signatory = $approved_by;
																	}
																	else{
																		$signatory = $dg_signatory;
																	}
																	$signature = getUserSignatureDetails($signatory);
								$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
								$pdf->Image($signature,$startX+1,$startY-8,30,12);

										 $pdf->Cell(0,8,'...............................................................', 0,1,'');

										$title = "Director-General";
										if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
										}else{
											if($is_acting_director ==1){
												$title = 'Acting '.$title;
											}

										}
										$pdf->Cell(0,8,'SIGNATURE', 0,1,'');
										 $pdf->Cell(0,8,$title, 0,0,'');
        if($is_notification){
            $pdf->Output($file_path,'F');
        }else{
            $pdf->Output('Ammendment Letter.pdf','I');
        }
		PDF::Reset();

    }

public function printRequestForAdditionalInformation(Request $req)
{
	try{
	$application_code = $req->application_code;
		$module_id = $req->module_id;
		$query_id = $req->query_id;
		// $query_id = $req->query_id; [0]
		if(!validateIsNumeric($module_id)){
			$app_data = DB::table('tra_submissions')
            ->select('module_id')
			->where(array('application_code'=>$application_code))
            ->first();
			if($app_data){
						$module_id = $app_data->module_id;
					}
			}



			$module_data = getTableData('par_modules', ['id'=>$module_id]);

			// $requestadditionalinfo_timespan =getTableData('par_requestadditionalinfo_timespan', ['module_id'=>$module_id]);
			if(!isset($app_data->time_span)){
				$time_span =23;
			}else{

				$time_span =$app_data->time_span ;

			}
					if(!isset($module_data->tablename)){
						return "Module details not found";
					}
			//  $invoice_details = getInvoiceDetails($module_id, '',$application_code);
			//  $app_description= '';
			// if(isset($invoice_details)){
			// 	$app_description = $invoice_details['module_desc'];
			// }
			$app_data = DB::table($module_data->tablename.' as t1')
					->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
					->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
					->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
					->where('application_code', $application_code)
					->select('t1.applicant_id','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name');
			//clone for adjastment
			$c_query = clone $app_data;
			$app_data = $app_data->first();

			if(!$app_data){
				return "Application details not found";
			}

			$org_info = $this->getOrganisationInfo();
			$pdf = new mPDF([
					'mode' => 'utf-8',
					'format' => 'A4',
					'margin_header' => '50',
					'margin_top' => '50',
					'margin_bottom' => '20',
					'margin_footer' => '2',
					'tempDir'=> '/public/resources'
				]);
			$template_url = base_path('/');
			//header footer
			$pdf->SetHTMLHeader('<img src="'.$template_url.'resources/templates/header.png"/>');
			$pdf->SetHTMLFooter('<img src="'. $template_url.'resources/templates/footer.png"/>');
			// $pdf = new PdfLettersProvider();
			$pdf->setMargins(5,25,5,true);
			$pdf->AddPage('P','','','','',5,5,30,30,0,0);

				// $pdf->setSourceFile($template_url."resources/templates/query_letter.pdf");
				// import page 1
				// $tplId = $pdf->importPage(1);
				// $pdf->useTemplate($tplId,0,0);
			// 	$logo = getcwd() . '/resources/images/placeholder.png';
			// 	$pdf->Image($logo,90,15,34,30);
			// 	//$pdf->setPageMark();

			// // $pdf->SetFont('times','B',9);
			// // $pdf->Cell(0,1,'',0,1);

			// $pdf->Cell(0,4,'',0,1,'R');
			// // $pdf->Cell(0,4,'',0,1,'R');
			// $pdf->SetFont('times','B',12);
			// // $pdf->Cell(0,15,'',0,1);
			// $pdf->Cell(0,4,$org_info->org_name,0,1,'C');
			// $pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

			// $pdf->SetFont('times','B',12);
			// $pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
			//$pdf->Cell(0,30,'',0,1);


			 // $pdf->Cell(0,3,'',0,1);
			// $startY = $pdf->y;
			// $startX = $pdf->x;
			// $pdf->SetLineWidth(0.3);
			// $pdf->Line(0+55,$startY,160,$startY);
			// $pdf->Cell(0,3,'',0,1);
			// if($module_id == 4){
			// 		$regulation_title = "The Medicines and Allied Substances (Importation and Exportaion) Regulations, 2017";
			// 		$pdf->Cell(0,4,$regulation_title,0,1,'C');

			// }
			// else if($module_id == 2){
			// 	//get the premises types
			// 	$record = DB::table('tra_premises_applications as t1')
			// 					->join('tra_premises as t2', 't1.premise_id', 't2.id')
			// 					->leftJoin('par_premises_types	 as t7', 't2.premise_type_id', 't7.id')
			// 					->select('t7.act_name as premises_type')
			// 					->where('application_code',$application_code)
			// 					->first();
			// 		if($record){
			// 			$premise_type = $record->premises_type;

			// 		$regulation_title = $premise_type;
			// 		}else{

			// 		$regulation_title = "The Medicines and Allied Substances (Certificate of Registration) Regulations, 2017";
			// 		}
			// 		$pdf->Cell(0,4,$regulation_title,0,1,'C');

			// }
			// else{
				// $regulation_title = "The Medicines and Allied Substances";
				// $pdf->Cell(0,4,$regulation_title,0,1,'C');
				// $regulation_title = "Ref :";

				// $pdf->Cell(0,4,$regulation_title,0,1,'C');
			// }
			//query data
			$request_data = DB::table('tra_application_query_reftracker as t1')
							->leftJoin('users as t2','t1.approved_by', 't2.id')
							->select(DB::raw("t1.*, to_char(t1.queried_on::date, 'DD MM YYYY') as query_date, to_char(t1.queried_on::date, 'mm/dd/YYYY') as query_date_fmt, CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as approved_by"))
							->where('t1.id', $query_id)
							->first();

			$pdf->Cell(0,5,'',0,1);
			$pdf->SetFont('Gill Sans MT','',22);
$pdf->Cell(0, 10, 'KUNGU DE MAN', 0, 0, 'L');
			$pdf->Cell(0, 10, 'Ref: '.strtoupper($request_data->query_ref), 0, 0, 'L');
			// $pdf->SetFont('Gill Sans MT','',10);

			// $pdf->SetFont('Gill Sans MT','',10);
			$application_no = '';

			if($app_data->tracking_no != ''){

				$application_no = 	$app_data->tracking_no;

			}
			if($app_data->reference_no != ''){

				$application_no .= 	' '.$app_data->reference_no;
			}
			$pdf->Cell(0,10, $request_data->query_date,0,1, 'R');
				// $pdf->MultiCell(0,10,'Application Reference:<u>'.$app_data->tracking_no.'</u>',0,'R',0,1,'','',true,0,true);
			$data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

			$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
			// QRCODE,H : QR-CODE Best error correction
			// $pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);

			// $barcode = "<barcode code='".$data."' type='CODE11' height='0.66' text='1' />";
			//$pdf->writeBarcode('111111111',0, 178, 28);
			// $pdf->SetFont('Gill Sans MT','',12);
			//Letter heading
			$pdf->Cell(0,8,$app_data->name.',',0,1);
			if($app_data->physical_address != ''){
					$pdf->Cell(0,8,$app_data->physical_address.',',0,1);

				}
			if(($app_data->physical_address !=  $app_data->postal_address)){

					$pdf->Cell(0,8,$app_data->postal_address.',',0,1);
			}
			//$pdf->Cell(0,8,$app_data->physical_address.',',0,1);
			//$pdf->Cell(0,8,$app_data->postal_address.',',0,1);
			$pdf->Cell(0,8,$app_data->region_name." ".$app_data->country_name,0,1);

			// $pdf->SetFont('Gill Sans MT','',11);
			//$pdf->ln();
			$pdf->Cell(0,5,'',0,1);
			$pdf->Cell(0,8,'Dear Sir/Madam',0,1);
			$pdf->Cell(0,5,'',0,1);
			if($module_id == 1){
				$app_data = $c_query->join('tra_product_information as a1', 't1.product_id', 'a1.id')
						->leftJoin('par_dosage_forms as a2', 'a1.product_form_id', 'a2.id')
						->addSelect('a2.name as dosage_form', 'a1.brand_name', 'a1.common_name', 'a1.strength')
						->first();
				$ref = "<b><u>".$app_data->brand_name."(".$app_data->common_name.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b>";
				//add query header tag
				$template = "Reference is made to your screening application for the above-mentioned product. The supporting documentation for screening was reviewed and the following should be addressed before the application can be accepted for evaluation:";
			}else{
				$ref = "no ref";
				$template = "no template intro";
			}



			$pdf->WriteHTML($ref);
			$pdf->WriteHTML($template);
			// $pdf->SetFont('Gill Sans MT','B',12);
			//add query items
			//loop through requests
			//$pdf->ln();


			// $pdf->SetFont('Gill Sans MT','',11);

			$counter = 1;
			$is_live_signature=0;
			$sign_data='';
			$query_date = Carbon::now();
			$pdf->WriteHTML($request_data->query_txt);
			// foreach ($request_data as $data){
			// 	$query_date = $data->queried_on;


			// 	$pdf->SetTextColor(0,0,0);
			// 		//$query_data = $data->checklist_item.': '.$data->query;
			// 		$query_data = $data->query_txt;
			// 		$pdf->Cell(12,5,$counter.'. ',0,0);

			// 		// $pdf->WriteHTML($query_data, true, false, true, true);
			// 		if($query_data != ''){
			// 			$pdf->WriteHTML($query_data);
			// 			$pdf->ln();
			// 		}


			// 	$counter++;
			// }//setPageMark

			$dt =strtotime($request_data->query_date_fmt. '+30 days'); //gets dates instance
			$year = date("Y", $dt);
			$month = date("F", $dt);
			$day = date("d", $dt);


			$pdf->cell(10,3,'',0,1);
			$template = "<p  align='justify'>You are therefore required to submit a full updated dossier addressing the above queries and a new screening checklist in your submission for re-screening. Please quote the Screening number for any future communication regarding this screening.</b></p>";
			$pdf->WriteHTML($template);
			// $end_date = Carbon::createFromFormat('mm/dd/YYYY', $request_data->query_date_fmt)->addDays(30)->format("mm/dd/YYYY");
			$template = "<p  align='justify'>The queries should be addressed by ".$day." ".$month." ".$year." (30 days), failure of which will result in the application being closed. Should you wish to continue with the application for registration of this product, please note that the process will start from the beginning.</b></p>Your anticipated cooperation is highly appreciated.<br>Yours Sincerely";
			$pdf->WriteHTML($template);


			// $pdf->Cell(0, 0,'Printed on '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
			// $pdf->cell(0,8,'',0,1);
			$startY = $pdf->y;
			$startX =$pdf->x;
			// $signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
			//$pdf->Image($signiture,$startX+75,$startY-7,30,12);
			$pdf->cell(10,5,'',0,1);
			$pdf->Cell(1, 4, '----------------------------------',0,1);
			$pdf->cell(10,5,'',0,1);
			$pdf->Cell(1, 4, $request_data->approved_by,0,1);
			$pdf->WriteHTML('<b>FOR/CHIEF EXECUTIVE OFFICER</b>');

		}catch (\Exception $exception) {
			dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
        	dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
		return response($pdf->Output('Request for Additional Information('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
	//application details


}

public function generatePremisePermit(Request $req){
			try{
						$application_code = $req->application_code;
						$record = DB::table('tra_premises_applications as t1')
												->leftJoin('tra_premises as t2', 't1.premise_id', 't2.id')
												->leftJoin('wb_trader_account as t3', 't1.applicant_id', 't3.id')
												->leftJoin('par_districts as t4', 't2.district_id', 't4.id')
												->leftJoin('par_regions	 as t5', 't2.region_id', 't5.id')
												->leftJoin('par_countries	 as t6', 't2.country_id', 't6.id')
												->leftJoin('par_premises_types	 as t7', 't2.premise_type_id', 't7.id')
												->select('t1.*','t2.*', 't8.*', 't3.name as applicant_name', 't4.name as district_name','t7.name as premise_type', 't7.permit_type_title', 't5.name as region_name', 't6.name as country_name', 't8.permit_signatory as permit_approval', 't7.*')
												->join('tra_approval_recommendations as t8', 't1.application_code','t8.application_code' )
												->where('t1.application_code',$application_code)
												->first();
						if($record){
							$decision_id = $record->decision_id;
							$premise_type_id = $record->premise_type_id;

									if($decision_id ==1){
											//Pharmaceutical License WholeSale
										//	Agro-Veterinary Shop
										//Health Shop
										//Hospital and Retail Pharmacy
										//Dispensing Certificate
										$org_info = $this->getOrganisationInfo();
																	$pdf = new PdfProvider();
																	$pdf->AddPage();
																		$template_url = base_path('/');
																		$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
																		// import page 1
																		$tplId = $pdf->importPage(1);
																		$pdf->useTemplate($tplId,0,0);
																		$pdf->setPageMark();

																		$logo = getcwd() . '/resources/images/zamra-logo.png';
																		$pdf->Image($logo, 86, 18, 40, 35);
																		$style = array(
																			'border' => 0,
																			'vpadding' => 'auto',
																			'hpadding' => 'auto',
																			'fgcolor' => array(0,0,0),
																			'bgcolor' => false, //array(255,255,255)
																			'module_width' => 1, // width of a single module in points
																			'module_height' => 1 // height of a single module in points
																	);
																	$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$record->permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
																		$pdf->SetFont('times','B',9);
																	$pdf->SetFont('times','B',9);
																	$pdf->Cell(0,1,'',0,1);


																	$pdf->Cell(0,4,'FORM Iv',0,1,'R');
																	$pdf->Cell(0,4,'(Regulation 6)',0,1,'R');
																	$pdf->SetFont('times','B',13);
																	$pdf->Cell(0,6,'',0,1);
																	$pdf->Cell(0,12,'',0,1);
																	$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

																	$pdf->SetFont('times','B',12);
																	$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
																	//$pdf->Cell(0,30,'',0,1);
																	$pdf->Cell(0,5,'',0,1);

																	$regulation_title = "The Medicines and Allied Substances (".$record->premise_type.") Regulations, 2017";

																	$pdf->Cell(0,4,$regulation_title,0,1,'C');

																	$pdf->Cell(0,5,'',0,1);

																	$pdf->SetFont('times','B',13);
																	$pdf->Cell(0,5,strtoupper($record->permit_type_title),0,1,'C');

																	$pdf->SetFont('times','B',11);
																	$pdf->Cell(45,8,'Registration No',0,0);
																	$pdf->SetFont('times','',11);
																	$pdf->Cell(0,8,$record->premise_reg_no,0,1);
																	$pdf->SetFont('times','B',11);
																	$pdf->Cell(45,8,'Permit No',0,0);
																	$pdf->SetFont('times','',11);
																	$pdf->Cell(0,8,$record->permit_no,0,1);


																	$pdf->setCellHeightRatio(2.4);
																	$pdf->SetFont('times','',11);
																	$template = "<p  align='justify'>This is to certify that (Name of ".$record->premise_type." ".$record->name ."  of (Physical Address) ".$record->physical_address.", ".$record->postal_address.", ".$record->region_name.", ".$record->country_name." is registered to operate as ".$record->premise_type;
																	$pdf->WriteHTML($template, true, false, true, true);
																	$pdf->ln();
																	//, 'is_premises_responsibleperson'=>1
																	$pdf->SetFont('times','',11);
																	$personnel = "";
																	$prem_per = DB::table('tra_premises_personnel as t1')
																							->join('tra_personnel_information as t2', 't1.personnel_id','t2.id')
																							->join('par_personnel_positions as t3', 't1.position_id','t3.id')
																							->where(array('t1.premise_id'=>$record->premise_id))
																							->first();
																	if($prem_per){
																		$personnel = $prem_per->name;

																	}
																	$pdf->Cell(45,8,'Name of Responsible Person: '.$personnel,0,0);

																	$pdf->SetFont('times','B',11);
																	$pdf->ln();

																	$pdf->SetFont('times','',11);
																	$pdf->Cell(0,8,'The conditions of the '.$record->premise_type." as overleaf.",0,1);

																	$pdf->SetFont('times','',11);
																	$pdf->Cell(0,8,'This permit is valid until '.formatDate($record->expiry_date),0,0,'C');
																	$pdf->ln();
																	$pdf->ln();

																	$startY = $pdf->GetY();
																	$startX =$pdf->GetX();
																	$director_details = getPermitSignatoryDetails();
																	$dg_signatory = $director_details->director_id;
																	$director = $director_details->director;
																	$is_acting_director = $director_details->is_acting_director;

																	$permit_approval = $record->permit_approval;
																	$approved_by = $record->approved_by;
																	if($dg_signatory != $approved_by){
																		$signatory = $approved_by;
																	}
																	else{
																		$signatory = $dg_signatory;
																	}
															$signature = getUserSignatureDetails($signatory);
															$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
															$pdf->Image($signature,$startX+75,$startY-8,30,12);

															$pdf->Cell(105,0,'',0,0);
															$pdf->Ln();

																	$pdf->Cell(0,10,'...............................................................', 0,1,'C');

																	$title = "Director-General";
																	if($dg_signatory != $approved_by){
																		$title = 'Acting '.$title;
																	}else{
																		if($is_acting_director ==1){
																			$title = 'Acting '.$title;
																		}

																	}

																	$pdf->Cell(0,10,$title, 0,0,'C');

																	$pdf->AddPage();

																	$pdf->SetFont('times','B',11);
																	$pdf->Cell(0,8,'The conditions of the '.$record->premise_type,0,1);

																	$pdf->SetFont('times','',11);
																	$pdf->MultiCell(11,11,'1.',0,'',0,0);

																	$pdf->MultiCell(0,11,'Any Change in the reponsible person, location or condition of permit of the '.strtolower($record->premise_type).' shall be approved by the Authority.',0,'',0,1);

																	$pdf->MultiCell(11,11,'2.',0,'',0,0);
																	$pdf->MultiCell(0,11,'The '.strtolower($record->premise_type).' shall only stock and sell medical products that are on the prescribed list.',0,'',0,1);

																	$pdf->MultiCell(11,11,'3.',0,'',0,0);
																	$pdf->MultiCell(0,11,'The preises and the manner in which the business is to be conducted must comply with the requirements of the Medicines and Allied Substances Act, No. 3 or 2013, and any relevant written law.',0,'',0,1);
																	$pdf->MultiCell(11,11,'4.',0,'',0,0);
																	$pdf->MultiCell(0,11,'The '.strtolower($record->premise_type).' permit s not transferabe without written approval of the Authority.',0,'',0,1);

																	$pdf->MultiCell(11,11,'5.',0,'',0,0);
																	$pdf->MultiCell(0,11,'The '.strtolower($record->premise_type).' permit shall, upo grant, be displayed conspicuously at the front shop in a place vsible to the public.',0,'',0,1);

																	$pdf->OutPut('Business Permit.pdf');

									}
									else{

									//	Letter of Rejection
									}


						}
						else{

							$res = array('success'=>false, 'message'=>'Premises Application not found, contact system admin');
						}

				}catch (\Exception $exception) {
							$res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

				} catch (\Throwable $throwable) {
							$res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
				}
				return response()->json($res);


}
//let of rejection
public function generateLetterOfREjection($application_code,$req,$module_id)
{
	try{

																	$application_code = $req->application_code;

																	$query_id = $req->query_id;
																	$module_data = getTableData('modules', ['id'=>$module_id]);
																	if(!isset($module_data->table_name)){
																		return "Module details not found";
																	}
																	$app_data = DB::table($module_data->table_name.' as t1')
																				->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
																				->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
																				->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
																				->leftJoin('sub_modules as t5', 't1.sub_module_id', 't5.id')
																				->leftJoin('tra_apprejprovisional_recommendation as t7', 't1.application_code', 't7.application_code')
																				->where('t1.application_code', $application_code);

																	if($module_id ==1){
																		$app_data->join('tra_product_information as t6', 't1.product_id','t6.id')->select('t7.created_on as approval_date', 't7.reason_for_rejection','t1.applicant_id','t5.title as application_title','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name', 't6.brand_name');
																	}
																	else{
																		$app_data->select('t7.created_on as approval_date', 't7.reason_for_rejection','t1.applicant_id','t5.title as application_title','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name');
																	}
																	$app_data = $app_data->first();

																	if(!$app_data){
																		return "Application details not found";
																	}

																	$org_info = $this->getOrganisationInfo();
																	$pdf = new PdfLettersProvider();
																	$pdf->AddPage();
																	//$pdf->SetLineWidth(0.4);
																	//$pdf->Rect(3,3,204,285);
																		$template_url = base_path('/');
																		$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
																		// import page 1
																		$tplId = $pdf->importPage(1);

																		// use the imported page and place it at point 10,10 with a width of 100 mm
																		$pdf->useTemplate($tplId,0,0);
																		$pdf->setPageMark();
																	//use template

																	$logo = getcwd() . '/resources/images/zamra-logo.png';
																	$pdf->Image($logo, 86, 18, 40, 35);

																	$pdf->SetFont('times','B',9);


																	$pdf->Cell(0,4,'FORM II',0,1,'R');
																	$pdf->Cell(0,4,'(Regulation 3)',0,1,'R');
																	$pdf->SetFont('times','B',13);
																	$pdf->Cell(0,25,'',0,1);
																	$pdf->Cell(0,15,'',0,1);
																	$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
																	$pdf->SetFont('times','B',11);
																	$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');


																	$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
																	$pdf->SetFont('times','B',12);
																	$pdf->Cell(0,8,'The Medicines and Allied Substances',0,1,'C');
																	$pdf->SetFont('times','B',11);
																	if($module_id == 4){
																			$regulation_title = "The Medicines and Allied Substances (Importation and Exportaion) Regulations, 2017";

																	}
																	else if($module_id == 1){
																		$regulation_title = "(Marketing Authorisation of Medicines) Regulations, 2019";

																	}
																	$pdf->Cell(0,4,$regulation_title,0,1,'C');

																	$pdf->Cell(0,5,'',0,1);
																	$pdf->SetFont('times','B',13);
																	//application_title
																	$title = "NOTICE OF REJECTION OF ".$app_data->application_title;

																	$pdf->Cell(0,5,strtoupper($title),0,1,'C');
																	$pdf->SetFont('times','B',10);

																	$application_no = '';

																	if($app_data->tracking_no != ''){

																		$application_no = 	$app_data->tracking_no;
																	}
																	if($app_data->reference_no != ''){

																		$application_no = 	$app_data->reference_no;
																	}
																	$pdf->Cell(0,10,'Application No:'.$application_no,0,1, 'R');
																		// $pdf->MultiCell(0,10,'Application Reference:<u>'.$app_data->tracking_no.'</u>',0,'R',0,1,'','',true,0,true);
																	$data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

																	$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
																	// QRCODE,H : QR-CODE Best error correction
																	$pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);
																	$pdf->SetFont('times','',12);
																	//Letter heading
																	$pdf->Cell(0,8,'To:',0,1);
																	$pdf->Cell(0,8,$app_data->name.',',0,1);

																	$pdf->Cell(0,8,$app_data->physical_address.',',0,1);
																	$pdf->Cell(0,8,$app_data->postal_address.',',0,1);
																	$pdf->Cell(0,8,$app_data->region_name." ".$app_data->country_name,0,1);

																	$pdf->SetFont('times','',11);
																	$pdf->ln();

																	if($module_id ==1){

																		$template = "IN THE MATTER OF ".$application_no.' '.$app_data->brand_name." you are notified that your application for (3) a marketing authorisation/renewal of a marketing authorisation has been rejected by the Authority on the following grounds:";

																	}
																	else{
																		$template = "IN THE MATTER OF ".$application_no." you are notified that your application for ".$app_data->application_title." has been rejected by the Authority on the following grounds:";


																	}
																	$pdf->setCellHeightRatio(2);
																		$pdf->WriteHTML($template, true, false, true, true);
																		$pdf->WriteHTML($app_data->reason_for_rejection, true, false, true, true);
																	$pdf->SetFont('times','B',12);

																	$dt =strtotime($app_data->approval_date); //gets dates instance
																	$year = date("Y", $dt);
																	$month = date("m", $dt);
																	$day = date("d", $dt);

																		$pdf->Cell(0, 0,'Dated this '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);

																			$startY = $pdf->GetY();
																			$startX =$pdf->GetX();
																			$signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
																			$pdf->Image($signiture,$startX+75,$startY-7,30,12);
																			$pdf->Cell(0, 0, '___________________________',0,1,'C');
																			$pdf->Cell(0, 0, 'AG. Director-General',0,1,'C');
																			$pdf->Output('Letter of Rejection '.$application_no.'.pdf');

																}catch (\Exception $exception) {
																	$res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

															} catch (\Throwable $throwable) {
																	$res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
															}
															return response()->json($res);

}
public function printAdministrativeSubmissionResponses(Request $req)
    {
    try{
        $application_code = $req->application_code;
        $module_id = $req->module_id;
        if(validateIsNumeric($application_code)){
            $app_data = DB::table('tra_rmu_submissions as t1')
                ->leftJoin('par_rmu_submission_categories as t10', 't1.rmu_submission_category_id', 't10.id')
                ->leftJoin('par_departments as t11', 't1.department_id', 't11.id')
                ->leftJoin('par_rmu_agencies as t12', 't1.agency_id', 't12.id')
                ->leftJoin('par_rmu_record_group as t13', 't1.record_group_id', 't13.id')
                ->leftJoin('par_rmu_record_file as t14', 't1.file_name_id', 't14.id')
                ->leftJoin('tra_rmu_responses_approvals as t15', 't1.application_code', 't15.application_code')
                ->leftJoin('tra_rmu_administrative_responses as t16', 't1.application_code', 't16.application_code')
                ->leftJoin('users as t17', 't15.approved_by', 't17.id')
                ->leftJoin('par_titles as t18', 't17.title_id', 't18.id')
                ->where('t1.application_code', $application_code)
                ->select('t11.name as target_department', 't1.date_received','t1.remarks', 't1.tracking_no', 't10.name as submission_category', 't12.name as agency', 't12.physical_address', 't13.name as record_group', 't14.name as file', 't15.approval_date','t15.approved_by as approver_id', 't15.sign_file','t16.*', DB::raw("CONCAT(decryptval(t17.first_name,".getDecryptFunParams()."),' ',decryptval(t17.last_name,".getDecryptFunParams().")) as approved_by, to_char(t15.approval_date::date, 'mm/dd/YYYY') as approval_date, t18.name as title"));
            
            $app_data = $app_data->first();
            
            if(!$app_data){
                return "Application details not found";
            }

            // $org_info = $this->getOrganisationInfo(); query_id
            
            $pdf = new mPDF([
                    'mode' => 'utf-8',
                    'format' => 'A4',
                    'margin_header' => '5',
                    'orientation' => 'P',
                    'margin_top' => '5',
                    'margin_bottom' => '2',
                    'margin_footer' => '2',
                    'tempDir'=> '/public/resources'
                ]);
            $template_url = base_path('/');
            //header footer
            $pdf->SetHTMLHeader('<img src="'.$template_url.'resources/templates/header.png"/>');
            $pdf->SetHTMLFooter('<img src="'. $template_url.'resources/templates/footer.png"/>');
            // $pdf = new PdfLettersProvider();
            $pdf->setMargins(0,0,0,true);
            $pdf->AddPage('P','','','','',7,7,50,50,5,20);
            //query data
             $pdf->SetFont('Gill Sans MT','B',12);

            $pdf->Cell(0, 10, 'Ref: '.strtoupper($app_data->tracking_no), 0, 0, 'L');
             //$pdf->SetFont('Gill Sans MT','',10);
            $application_no = '';

            
            $pdf->Cell(0,10, $app_data->approval_date,0,1, 'R');

            //address
            if($app_data->address){
            	$address = '<p style="width: 75%;">'.str_replace(',', '<br>', $app_data->address).'</p>';
            	$pdf->WriteHTML($address);
            }
            
            //salutation
            $pdf->SetFont('Gill Sans MT','',11);
            //$pdf->ln();
            //$pdf->Cell(0,5,'',0,1);
            $pdf->Cell(0,10,$app_data->salutation,0,1);

            //subject
            if($app_data->subject){
            	$ref = "<b><u>".$app_data->subject."</u></b>";
            	$pdf->WriteHTML($ref);
            }
            
			$pdf->Cell(0,5,'',0,1);

			//response
			if($app_data->response){
				$pdf->WriteHTML($app_data->response);
			}
            
            //watermark
            if(!validateIsNumeric($app_data->approver_id)){
            	$pdf->SetWatermarkText('Pending Approval');
            	$pdf->showWatermarkText = true;
            }

            //signature Block
            $pdf->cell(0,5,'',0,1);
			$pdf->showImageErrors = true;
			$sign_file = $app_data->sign_file;
			// if($app_data->sign_file){
			// 	$stringBefore = substr($sign_file, 0, strpos($sign_file, ';'));
			// 	$sign_file = str_replace($stringBefore, 'data:image/png', $sign_file);
			// }
            if($app_data->approver_id == 54){
            	$role = 'CHIEF EXECUTIVE OFFICER';
            }else{
            	$role = 'FOR/CHIEF EXECUTIVE OFFICER';
            }
            
			$html = '
				<table style="width: 100%;">
				    <tr>
				        <td style="width: 70%; vertical-align: top;">
				            <!-- Left content -->
				            <b><img src="'.$sign_file.'" alt="Sign" width="100" height="50" style="border-bottom: 2px dashed #333;">
							<br>
							'.$app_data->title.' '.$app_data->approved_by.'<br><br>
							'.$role.'</b>
				        </td>
				        <td style="width: 30%; vertical-align: top; horizontal-align: right">
				            <!-- Right content -->
				            <img src="'.$template_url.'resources/templates/scanme.png" alt="Image" width="100" height="100">
				        </td>
				    </tr>
				</table>
			';
			$pdf->WriteHTML($html);
			
        }else{
            return "Failed to get Details";
        }

        }catch (\Exception $exception) {
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
        return response($pdf->Output('Administrative Response ('.$app_data->tracking_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
    }

    // public function printInspectionReport(Request $req)
    // {
    // try{
    //     $application_code = $req->application_code;
    //     $module_id = $req->module_id;
    //     if(validateIsNumeric($application_code)){
    //         $app_data = DB::table('tra_checklistitems_responses as t2')
    //             ->leftJoin('tra_application_query_reftracker as t1', 't1.checklist_item_id', 't2.checklist_item_id')
    //             ->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id')
    //             ->leftJoin('par_checklist_types as t4', 't3.checklist_type_id', 't4.id')
    //             ->leftJoin('par_compliance_risk_scale as t5', 't2.risk_type', 't5.id')
    //             ->join('tra_premises_applications as t6', 't1.application_code', 't6.application_code')
    //  			->join('wb_trader_account as t7', 't6.applicant_id', 't7.id')
    //  			->join('users as t8', 't2.created_by', 't8.id')
    //  			->join('users as t9', 't2.audit_created_by', 't9.id')
    //             ->where('t2.application_code', $application_code)
    //             // ->where('t1.status_id', 1)
    //             ->select(DB::raw("t4.name as requirement,t2.comment,CASE WHEN t1 IS NULL THEN 'None' ELSE t1.query_txt END dificiency, t5.name as category, t6.tracking_no, Concat(t7.name,',', t7.physical_address) as address, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as created_by, CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),' ',decryptval(t9.last_name,".getDecryptFunParams().")) as checked_by"));
            
    //         $app_data = $app_data->first();
            
    //         if(!$app_data){
    //             return "Application details not found";
    //         }
    //         $one_rec= $app_data[0];
    //         // $org_info = $this->getOrganisationInfo(); query_id
            
    //         $pdf = new mPDF([
    //                 'mode' => 'utf-8',
    //                 'format' => 'A4',
    //                 'margin_header' => '5',
    //                 'orientation' => 'P',
    //                 'margin_top' => '5',
    //                 'margin_bottom' => '2',
    //                 'margin_footer' => '2',
    //                 'tempDir'=> '/public/resources'
    //             ]);
    //         $template_url = base_path('/');
    //         //header footer
    //         $pdf->SetHTMLHeader('<img src="'.$template_url.'resources/templates/header.png"/>');
    //         $pdf->SetHTMLFooter('<img src="'. $template_url.'resources/templates/footer.png"/>');
    //         // $pdf = new PdfLettersProvider();
    //         $pdf->setMargins(0,0,0,true);
    //         $pdf->AddPage('P','','','','',7,7,50,50,5,20);
    //         //query data
    //          $pdf->SetFont('Gill Sans MT','B',12);

    //         $pdf->Cell(0, 10, 'Ref: '.strtoupper($one_rec->tracking_no), 0, 0, 'L');
    //          //$pdf->SetFont('Gill Sans MT','',10);
    //         $application_no = '';

            
    //         $pdf->Cell(0,10, Carbon::now()->format('Y-m-d'),0,1, 'R');

    //         //address
    //         if($one_rec->address){
    //         	$address = '<p style="width: 75%;">'.str_replace(',', '<br>', $one_rec->address).'</p>';
    //         	$pdf->WriteHTML($address);
    //         }
            
    //         // //salutation
    //         // $pdf->SetFont('Gill Sans MT','',11);
    //         // //$pdf->ln();
    //         // //$pdf->Cell(0,5,'',0,1);
    //         // $pdf->Cell(0,10,'Dear sir/Madam',0,1);

    //         // //subject
    //         // if($app_data->subject){
    //         // 	$ref = "<b><u>".$app_data->subject."</u></b>";
    //         // 	$pdf->WriteHTML($ref);
    //         // }
            
	// 		// $pdf->Cell(0,5,'',0,1);

	// 		//response
	// 		$table = '<table style="width: 100%;">
	// 				<tr>
	// 					<td style="width: 10%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            REQUIREMENT
	// 			        </td>
	// 			        <td style="width: 30%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            OBSERVATION
	// 			        </td>
	// 			        <td style="width: 30%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            DEFICIENCY
	// 			        </td>
	// 			        <td style="width: 20%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            REFERENCE
	// 			        </td>
	// 			        <td style="width: 10%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            CATEGORY
	// 			        </td>
	// 			     </tr>';
	// 		foreach ($app_data as $query) {
	// 			$table .= '<tr>
	// 					<td style="width: 10%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            '.$query->requirement.'
	// 			        </td>
	// 			        <td style="width: 30%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            '.$query->comment.'
	// 			        </td>
	// 			        <td style="width: 30%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            '.$query->dificiency.'
	// 			        </td>
	// 			        <td style="width: 20%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            N/A
	// 			        </td>
	// 			        <td style="width: 10%; vertical-align: top; horizontal-align: left">
	// 			            <!-- content -->
	// 			            '.$query->category.'
	// 			        </td>
	// 			     </tr>';
	// 		}
	// 		$table.='</table>';
	// 		$pdf->WriteHTML($table);
			
            
    //         //watermark
    //         // if(!validateIsNumeric($app_data->approver_id)){
    //         // 	$pdf->SetWatermarkText('Pending Signing');
    //         // 	$pdf->showWatermarkText = true;
    //         // }

    //         //signature Block
    //         $pdf->cell(0,5,'',0,1);
	// 		// $pdf->showImageErrors = true;
	// 		// $sign_file = $app_data->sign_file;
	// 		// if($app_data->sign_file){
	// 		// 	$stringBefore = substr($sign_file, 0, strpos($sign_file, ';'));
	// 		// 	$sign_file = str_replace($stringBefore, 'data:image/png', $sign_file);
	// 		// }
    //         // if($app_data->approver_id == 54){
    //         // 	$role = 'CHIEF EXECUTIVE OFFICER';
    //         // }else{
    //         // 	$role = 'FOR/CHIEF EXECUTIVE OFFICER';
    //         // }
    //         $template_url = base_path('/');
            
	// 		$html = '
	// 			<table style="width: 100%;">
	// 			    <tr>
	// 			        <td style="width: 70%; vertical-align: top;">
	// 			            <!-- Left content -->
	// 			            <b>-------------------------------------------
	// 						<br>
	// 						 '.$one_rec->created_by.'<br><br>
	// 						</b>
	// 			        </td>
	// 			        <td style="width: 30%; vertical-align: top; horizontal-align: right">
	// 			            <!-- Right content -->
	// 			            <img src="'.$template_url.'resources/templates/scanme.png" alt="Image" width="100" height="100">
	// 			        </td>
	// 			    </tr>
	// 			     <tr>
	// 			        <td style="width: 100%; vertical-align: top;">
	// 			            <!-- Left content -->
	// 			            <b>------------------------------------------
	// 						<br>
	// 						'.$one_rec->checked_by.'<br><br>
	// 						</b>
	// 			        </td>
	// 			        <td style="width: 100%; vertical-align: top;">
	// 			            <!-- Left content -->
	// 			            <b>------------------------------------------
	// 						<br>
	// 						'.$one_rec->approved_by.'<br><br>
	// 						</b>
	// 			        </td>
	// 			    </tr>
	// 			</table>
	// 		';
	// 		$pdf->WriteHTML($html);
			
    //     }else{
    //         return "Failed to get Details";
    //     }

    //     }catch (\Exception $exception) {
    //         dd($exception->getMessage());
    //         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

    //     } catch (\Throwable $throwable) {
    //         dd($throwable->getMessage());
    //         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
    //     }
    //     return response($pdf->Output('Administrative Response ('.$app_data->tracking_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
    // }
    public function printInspectionReport(Request $req)
    {
    try{
        $application_code = $req->application_code;
        $module_id = $req->module_id;
        if(validateIsNumeric($application_code)){
            $app_data = DB::table('tra_checklistitems_responses as t2')
                ->leftJoin('tra_application_query_reftracker as t1', 't1.checklist_item_id', 't2.id')
                ->leftJoin('par_checklist_items as t3', 't2.checklist_item_id', 't3.id')
                ->leftJoin('par_checklist_types as t4', 't3.checklist_type_id', 't4.id')
                ->leftJoin('par_compliance_risk_scale as t5', 't2.risk_type', 't5.id')
                ->join('tra_premises_applications as t6', 't2.application_code', 't6.application_code')
     			->leftJoin('wb_trader_account as t7', 't6.applicant_id', 't7.id')
     			->leftJoin('users as t8', 't2.created_by', 't8.id')
     			->leftJoin('users as t9', 't2.audit_created_by', 't9.id')
     			->leftJoin('par_premises_types as t10', 't6.premise_type_id', 't10.id')
     			->leftJoin('tra_approval_recommendations as t11', 't6.application_code', 't11.application_code')
     			->leftJoin('tra_premises as t12', 't6.premise_id', 't12.id')
                ->where('t2.application_code', $application_code)
                //->whereRaw('t1.status_id != 39')
                ->select(DB::raw("t3.reference, t4.name as requirement,t2.comment,CASE WHEN t1 IS NULL THEN 'None' ELSE t1.query_txt END dificiency, t5.name as category, t6.tracking_no, t6.premise_id, t6.reference_no, Concat(t7.name,',', t7.physical_address) as address, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as created_by, CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),' ',decryptval(t9.last_name,".getDecryptFunParams().")) as checked_by, t10.name as facility_type, t11.permit_no as license_no, to_char(t11.expiry_date::date, 'DD/MM/YYYY') as expiry_date, t6.sub_module_id, t12.name as premise_name, t12.physical_address as premise_physical_address, t12.postal_address as premise_postal_address, t12.telephone as premise_telephone_no"));
            
            $app_data = $app_data->get();
            if(!$app_data){
                return "Application details not found";//actual_
            }
            $one_rec= $app_data[0];

            $responsible_person = DB::table('tra_premises_applications as t1')
            				->leftJoin('tra_premises_personnel as t2', 't1.premise_id', 't2.premise_id')
            				->leftJoin('tra_personnel_information as t3', 't2.personnel_id', 't3.id')
            				->where(['t1.premise_id' => $one_rec->premise_id, 't2.position_id' => 7])->first();

            //last inspection details
            $prev_inspection = DB::table('tra_premiseinspection_applications as t1')
            			->join('tra_premiseinspection_inspectors as t2', 't1.inspection_id', 't2.id')
            			->join('users as t8', 't2.inspector_id', 't8.id')
            			->where('t1.premise_id', $one_rec->premise_id)
            			->orderBy('t1.id', 'DESC')
            			->select(DB::raw("STRING_AGG(CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")), ' AND ') as inspected_by, to_char(t1.actual_start_date::date, 'DD/MM/YYYY') as actual_start_date, t1.minor_compliances, t1.major_compliances, t1.critical_compliances"))
            			->groupBy('t1.id')
            			->skip(1)
            			->first();

            $curr_inspection = DB::table('tra_premiseinspection_applications as t1')
            			->where('t1.premise_id', $one_rec->premise_id)
            			->orderBy('t1.id', 'DESC')
            			->first();
            if(!isset($curr_inspection->id)){
            	return "Pending Inspection";
            }
            switch ($one_rec->sub_module_id) {
            	case 1:
            		$inspection_type = 'Pre Licensing';
            		break;
            	case 2:
            		$inspection_type = 'Renewal';
            		break;
            	case 3:
            		$inspection_type = 'Major Variations';
            		break;
            	case 78:
            		$inspection_type = 'Minor Variations';
            		break;
            	default:
            		$inspection_type = 'Pre Licensing';
            		break;
            }
            // $org_info = $this->getOrganisationInfo(); query_id
            
            $pdf = new mPDF([
                    'mode' => 'utf-8',
                    'format' => 'A4',
                    'margin_header' => '5',
                    'orientation' => 'P',
                    'margin_top' => '5',
                    'margin_bottom' => '2',
                    'margin_footer' => '2',
                    'tempDir'=> '/public/resources'
                ]);
            $template_url = base_path('/');
            //header footer
            $pdf->SetHTMLHeader('<img src="'.$template_url.'resources/templates/header.png"/>');
            $pdf->SetHTMLFooter('<img src="'. $template_url.'resources/templates/footer.png"/>');
            // $pdf = new PdfLettersProvider();
            $pdf->setMargins(0,0,0,true);
            $pdf->AddPage('P','','','','',7,7,50,50,5,20);
            //query data
             $pdf->SetFont('Gill Sans MT','B',12);

            $pdf->Cell(0, 10, 'Report: '.strtoupper($one_rec->tracking_no), 0, 0, 'L');
             //$pdf->SetFont('Gill Sans MT','',10);
            $application_no = '';

            
            $pdf->Cell(0,10, Carbon::now()->format('Y-m-d'),0,1, 'R');
			
			$pdf->WriteHTML('<p><b>General</p></b>');
			$pdf->WriteHTML('<p>The reason of this inspection is to assess compliance with the minimum requirements for operating a pharmaceutical business according to pharmacy practice standards, Good Distribution Practice, and adherence to Medicines and Related Substance Act 2013 and Regulation 2019.</p>');
			
			$report_details = '<table style="width: 100%; border-collapse: collapse;">
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date of Inspection</td>
							        <td style="padding: 8px; border: 1px solid #ddd; ">'.$curr_inspection->actual_start_date.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date of follow-up Inspection (if applicable)</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">NA</td>
							    </tr>
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name of Inspected Site</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->premise_name.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Physical Address</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->premise_physical_address.'</td>
							    </tr>
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Postal Address</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->premise_postal_address.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Telephone Number</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->premise_telephone_no.'</td>
							    </tr>
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">License number & Expiry date</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->license_no.' <br> Exp '.$one_rec->expiry_date.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name of Responsible Pharmacist</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$responsible_person->name.'</td>
							    </tr>
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">BHPC Registration no</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$responsible_person->registration_no.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$responsible_person->email_address.'</td>
							    </tr>
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Inspectors</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->created_by.' and '.$one_rec->checked_by.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Report No.</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$one_rec->reference_no.'</td>
							    </tr>
							    <tr style="background-color: #f2f2f2;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Minimum Requirements</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">BoMRA guideline for operating a '.$one_rec->facility_type.'</td>
							    </tr>
							    <tr style="background-color: #ffffff;">
							        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Type of Inspection</td>
							        <td style="padding: 8px; border: 1px solid #ddd;">'.$inspection_type.'</td>
							    </tr>
							    </table>';

			$pdf->WriteHTML($report_details);
			$pdf->AddPage();


			$pdf->WriteHTML('<p><b>Introduction</p></b>');
			if($one_rec->sub_module_id != 1 && isset($prev_inspection->inspected_by)){
				$pdf->WriteHTML('<p>The facility was previously inspected on '.$prev_inspection->actual_start_date.' by '.$prev_inspection->inspected_by.', in this inspection the facility had '.$prev_inspection->minor_compliances.' minor, '.$prev_inspection->major_compliances.' major and '.$prev_inspection->critical_compliances.' Critical deficiencies.</p>');
			}else{
				$pdf->WriteHTML('<p>This is the first inspection on the facility and subsequent inspection will reference historical inspections.</p>');
			}
			$pdf->WriteHTML('<p><b>Findings</p></b>');
			$pdf->WriteHTML('<p><b>Summary of Inspection</p></b>');
			if(isset($curr_inspection->remarks)){
				$pdf->WriteHTML('<p>'.$curr_inspection->remarks.'</p>');
			}else{
				$pdf->WriteHTML('<p>No remarks</p>');
			}
			

            //address
            if($one_rec->address){
            	$address = '<p style="width: 75%;">'.str_replace(',', '<br>', $one_rec->address).'</p>';
            	$pdf->WriteHTML($address);
            }
            $pdf->WriteHTML('<p><b>Inspection Detail</p></b>');
            // //salutation
            // $pdf->SetFont('Gill Sans MT','',11);
            // //$pdf->ln();
            // //$pdf->Cell(0,5,'',0,1);
            // $pdf->Cell(0,10,'Dear sir/Madam',0,1);

            // //subject
            // if($app_data->subject){
            // 	$ref = "<b><u>".$app_data->subject."</u></b>";
            // 	$pdf->WriteHTML($ref);
            // }
            
			// $pdf->Cell(0,5,'',0,1);

			//response
			$table = '<table style="width: 100%; border-collapse: collapse;">
					<tr style="border: 1px solid #ddd; padding: 8px; text-align: left;">
						<td style="border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            REQUIREMENT
				        </td>
				        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            OBSERVATION
				        </td>
				        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            DEFICIENCY
				        </td>
				        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            REFERENCE
				        </td>
				        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            CATEGORY
				        </td>
				     </tr>';
			foreach ($app_data as $query) {
				$table .= '<tr>
						<td style="width: 10%; border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            '.$query->requirement.'
				        </td>
				        <td style="width: 30%; border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            '.$query->comment.'
				        </td>
				        <td style="width: 30%; border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            '.$query->dificiency.'
				        </td>
				        <td style="width: 20%; border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            '.$query->reference.'
				        </td>
				        <td style="width: 10%; border: 1px solid #ddd; padding: 8px; text-align: left;">
				            <!-- content -->
				            '.$query->category.'
				        </td>
				     </tr>';
			}
			$table.='</table>';
			$pdf->WriteHTML($table);
			
            
            //watermark
            // if(!validateIsNumeric($app_data->approver_id)){
            // 	$pdf->SetWatermarkText('Pending Signing');
            // 	$pdf->showWatermarkText = true;
            // }

            //signature Block
            $pdf->cell(0,5,'',0,1);
			// $pdf->showImageErrors = true;
			// $sign_file = $app_data->sign_file;
			// if($app_data->sign_file){
			// 	$stringBefore = substr($sign_file, 0, strpos($sign_file, ';'));
			// 	$sign_file = str_replace($stringBefore, 'data:image/png', $sign_file);
			// }
            // if($app_data->approver_id == 54){
            // 	$role = 'CHIEF EXECUTIVE OFFICER';
            // }else{
            // 	$role = 'FOR/CHIEF EXECUTIVE OFFICER';
            // }
            $template_url = base_path('/');
            
			$html = '
				<table style="width: 100%;">
				    <tr>
				        <td style="width: 100%; vertical-align: top;">
				            <!-- Left content -->
				            <b>-------------------------------------------
							<br>
							 Inspected BY '.$one_rec->created_by.'<br><br>
							</b>
				        </td>
				    </tr>
				     <tr>
				        <td style="width: 100%; vertical-align: top;">
				            <!-- Left content -->
				            <b>------------------------------------------
							<br>
							Checked By: '.$one_rec->checked_by.'<br><br>
							</b>
				        </td>
				    </tr>
					<tr>
						<td style="width: 100%; vertical-align: top;">
				            <!-- Left content -->
				            <b>------------------------------------------
							<br>
							<br>Approved By<br>
							</b>
				        </td>
					</tr>
					<tr>
						<td style="width: 100%; vertical-align: top; text-align: center;">
				            <!-- Right content -->
				            <img src="'.$template_url.'resources/templates/scanme.png" alt="Image" width="100" height="100">
				        </td>
					</tr>
				</table>
			';
			$pdf->WriteHTML($html);
			
        }else{
            return "Failed to get Details";
        }

        }catch (\Exception $exception) {
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
        return response($pdf->Output('Administrative Response ('.$one_rec->tracking_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
    }
    public function getProcessApplicableChecklistItems(Request $request)
    {
        $checklist_type = $request->input('checklist_type');
        $checklist_category_id = $request->input('checklist_category_id');
        $application_code = $request->input('application_code');
        $is_previous = $request->input('is_previous');
        $process_id = $request->input('process_id');
        $workflow_stage = $request->input('workflow_stage');
        $query_id = $request->input('query_id');
        $pass_status = $request->pass_status;
        $is_auditor = $request->is_auditor;
        $is_structured = $request->is_structured;
        $filter = $request->input('filter');
        $submission_id = 0;
        //check for previously added checklist
        if(validateIsNumeric($query_id)){
            $query_data = DB::table('tra_application_query_reftracker')->where('id', $query_id)->first();
            $checklist_category_id = $query_data->checklist_category_id;
            $application_code = $query_data->application_code;
            $workflow_stage = $query_data->workflow_stage_id;
            $process_id = $query_data->process_id;
        }
        $submission_details = getLastApplicationSubmissionDetails($application_code);
        if($submission_details['success']){
            $submission_details = $submission_details['results'];
            $submission_id = $submission_details->id;
        }
        $where = array(
            'process_id' => $process_id
            //'stage_id' => $workflow_stage
        );
        if (validateIsNumeric($workflow_stage)) {
            $where['stage_id'] = $workflow_stage;
        }

        $whereClauses = array();
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'name' :
                            $whereClauses[] = "t1.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'pass_status' :
                            $whereClauses[] = "t2.pass_status = '" . ($filter->value) . "'";
                            break;
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
        if(validateIsNumeric($pass_status)){
            // $whereClauses[] = "t2.pass_status = '" . ($pass_status) . "'";
        }
        try {
            //module_id, sub_module_id and section_id
            $where2 = DB::table('wf_processes')
                ->select('module_id', 'sub_module_id', 'section_id','premise_type_id')
                ->where('id', $process_id)
                ->first();
            $where2 = convertStdClassObjToArray($where2);
            $module_id = $where2['module_id'];
            if($module_id == 4){
                $module_id = $where2['module_id'];
                $sub_module_id = $where2['sub_module_id'];
                $section_id = $where2['section_id'];
                $where2 = array('module_id'=>$module_id);
            }
            if($module_id == 2){
                $module_id = $where2['module_id'];
                $sub_module_id = $where2['sub_module_id'];
                $section_id = $where2['section_id'];
                $premise_type_id = $where2['premise_type_id'];
              //  dd($where2);
               // $where2 = array('module_id'=>$module_id);
            }
            else{
                $module_id = $where2['module_id'];
                $sub_module_id = $where2['sub_module_id'];
                $section_id = $where2['section_id'];
            }
            //get applicable checklist categories

            $qry1 = DB::table('tra_proc_applicable_checklists')
                ->select('checklist_category_id')
                ->where($where);

            $checklist_categories = $qry1->get();
            $checklist_categories = convertStdClassObjToArray($checklist_categories);
            $checklist_categories = convertAssArrayToSimpleArray($checklist_categories, 'checklist_category_id');
            // dd($checklist_categories);
            //get applicable checklist types
            $qry2 = DB::table('par_checklist_types as t1')
                ->select('t1.id')
                ->where($where2)
                ->whereIn('checklist_category_id', $checklist_categories);
            $checklist_types = $qry2->get();
          //  dd($checklist_types);
            $checklist_types = convertStdClassObjToArray($checklist_types);
            $checklist_types = convertAssArrayToSimpleArray($checklist_types, 'id');
// dd($checklist_types);
            $qry = DB::table('par_checklist_items as t1')
                ->leftJoin('tra_checklistitems_responses as t2', function ($join) use ($application_code, $query_id, $submission_id, $is_auditor) {

                    if (isset($query_id) && $query_id != '') {
                        $join->on('t2.checklist_item_id', '=', 't1.id')
                            ->where('t2.application_code', $application_code);
                    } else if(validateIsNumeric($is_auditor)){
                        $join->on('t2.checklist_item_id', '=', 't1.id')
                            ->where('t2.application_code', $application_code);
                    } else {
                        $join->on('t2.checklist_item_id', '=', 't1.id')
                            // ->where('t2.submission_id', $submission_id)
                            ->where('t2.application_code', $application_code);
                    }
                })
                ->leftJoin('tra_checklistitems_queries as t4', function ($join) use ($query_id) {
                    $join->on('t4.checklist_item_id', '=', 't1.id')
                        ->where('t4.query_id', $query_id);
                })
                ->join('par_checklist_types as t3', 't1.checklist_type_id', '=', 't3.id')

                ->join('par_checklist_categories as t5', 't3.checklist_category_id', '=', 't5.id')
                ->select(DB::raw("t1.*,t1.id as checklist_item_id, t2.id as item_resp_id,t2.pass_status, t2.comment,t2.observation, t2.auditor_comment, t3.name as checklist_type, t2.auditorpass_status, t2.risk_type, t2.risk_type_remarks, $module_id as module_id, $sub_module_id as sub_module_id,  t4.query, t4.query_response"));

            /*----------------------------------------------------
                 For unstructured queries they adopt
                 1. checklist type 102
            ------------------------------------------------------*/
            if (validateIsNumeric($query_id)) {
                $qry->where('t4.query_id', $query_id);
            }

            if(validateIsNumeric($is_structured) && $is_structured == 1){
                $qry->where('t5.is_query', 1);
            }
            else{
                if (validateIsNumeric($checklist_type)) {
                    $qry->where('t1.checklist_type_id', $checklist_type);
                } else {
                    $qry->whereIn('t1.checklist_type_id', $checklist_types);
                }
                if(validateIsNumeric($pass_status)){
                    // $qry->where('t2.pass_status', $pass_status);
                }
            }


            //is_structured

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = array(
                'success' => true,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => true,
                'message' => $throwable->getMessage()
            );
        }
        return \response()->json($res);
    }

    public function generateDocumentPermit(Request $req){
	try{
		$application_code = $req->application_code;
		$record = DB::table('tra_documentmanager_application as t1')
								 ->join('tra_permitsrelease_recommendation as t2', 't1.application_code','t2.application_code' )
								 ->join('users as t3', 't2.dg_signatory', 't3.id')
								 ->select(DB::raw("t1.tracking_no, t1.doc_title, t1.created_on as effective_date,t2.*,decrypt(t3.first_name) as firstname,decrypt(t3.last_name) as lastname"))
								->where('t1.application_code',$application_code);
								//->first();
			$record = $record->get();
			$records = convertStdClassObjToArray($record);

            $records = decryptArray($records);

            foreach ($records as &$record) {
            $record['fullname'] = $record['firstname'] . ' ' . $record['lastname'];
             }


			if($records){

			$decision_id = $records[0]['decision_id'];
		
			if($decision_id ==1){

			$document_number = $records[0]['document_number'];
			$issue_number = $records[0]['tracking_no'];
			$effective_date = $records[0]['effective_date'];
			$doc_title = $records[0]['doc_title'];
			$approval_date = $records[0]['approval_date'];
			$approved_by = $records[0]['fullname'];

					//Pharmaceutical License WholeSale
				//	Agro-Veterinary Shop
				//Health Shop
				//Hospital and Retail Pharmacy
				//Dispensing Certificate
				$org_info = $this->getOrganisationInfo();

				$pdf = new PdfProvider();

				$pdf->AddPage();
					$template_url = base_path('/');

					$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
					// import page 1
					$tplId = $pdf->importPage(1);
					$pdf->useTemplate($tplId,0,0);
					$pdf->setPageMark();

					$logo = getcwd() . '/resources/images/logo.jpg';
					$logo = str_replace('\\', '/', $logo);

					//dd($logo);
				//	$pdf->Image($logo, 86, 18, 40, 35);
					$style = array(
						'border' => 0,
						'vpadding' => 'auto',
						'hpadding' => 'auto',
						'fgcolor' => array(0,0,0),
						'bgcolor' => false, //array(255,255,255)
						'module_width' => 1, // width of a single module in points
						'module_height' => 1 // height of a single module in points
				);
				// $pdf->write2DBarcode(strtoupper($record->doc_title).':'.$application_code.':'.$record->permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
				// 	$pdf->SetFont('times','B',9);
				// $pdf->SetFont('times','B',9);
				// $pdf->Cell(0,1,'',0,1);

				// $pdf->Cell(0,4,'FORM Iv',0,1,'R');
				//$pdf->Cell(0,4,'(Regulation 6)',0,1,'R');
				$pdf->Image($logo,85,30,43,19);
				$pdf->SetFont('times','B',13);
				$pdf->Cell(0,6,'',0,1);
				$pdf->Cell(0,30,'',0,1);
				$pdf->Cell(0,4,'Botswana Medicines Regulatory Authority',0,1,'C');

				$pdf->SetFont('times','B',12);
				//$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
				//$pdf->Cell(0,30,'',0,1);
				$pdf->Cell(0,20,'',0,1);

				//$regulation_title = "The Medicines and Allied Substances (Certificate of Registration) Regulations, 2017";

				// Set y position to avoid overlapping with previous cell
				$currentY = $pdf->GetY();
				$pdf->SetY($currentY + 4);

				// Calculate the width for each part of the line
				$leftWidth = 60; // Adjust this value according to your needs
				$centerWidth = 60; // Adjust this value according to your needs
				$rightWidth = 60; // Adjust this value according to your needs

				// Set the x position and print each cell
				$pdf->SetX(10); // Adjust the starting x position if needed
				$pdf->Cell($leftWidth, 4, 'Document No. '.$document_number, 0, 0, 'L');

				$pdf->SetX(10 + $leftWidth); // Move x position to the center cell
				$pdf->Cell($centerWidth, 4, 'Issue No. '.$issue_number, 0, 0, 'C');

				$pdf->SetX(10 + $leftWidth + $centerWidth); // Move x position to the right cell

				$effective_date = \DateTime::createFromFormat('Y-m-d H:i:s', $effective_date)->format('d/m/Y');

				$pdf->Cell($rightWidth, 4, 'Effective Date: ' . $effective_date, 0, 0, 'R');

				$pdf->Cell(0,15,'',0,1);

				$pdf->SetFont('times','B',40);	$pdf->ln();
				$pdf->Cell(0,5,$doc_title,0,1,'C');
				$pdf->Cell(0,35,'',0,1);
				$pdf->SetFont('times','B',13);	$pdf->ln();
				// $pdf->SetFont('times','B',11);
				// $pdf->ln();
				// $pdf->Cell(0,8,' No: '.$record->tracking_no,0,1,'R');
				// $pdf->SetFont('times','',11);
				// $pdf->SetFont('times','B',11);

				// $pdf->setCellHeightRatio(2.4);
				// $pdf->SetFont('times','',11);
				// $template = "<p  align='justify'>This is to certify that (Name of ".$record->doc_title ."  of (Physical Address) ".$record->doc_title.", ".$record->doc_title.", ".$record->doc_title.", ".$record->doc_title." is registered as a ".$record->doc_title;
				// $pdf->WriteHTML($template, true, false, true, true);

				// $pdf->SetFont('times','',11);
				// $pdf->Cell(0,8,'The terms and conditions of the certificate or registration are attached herewith',0,1);
				// $pdf->SetFont('times','',11);
				// $pdf->ln();
				// $pdf->ln();

				//$pdf->Cell(0,8,'This Certificate is issued on '.formatDate($record->doc_title),0,0,'C');
						// $director_details = getPermitSignatoryDetails();

						// dd($director_details);
						// $dg_signatory = $director_details->director_id;
						// $director = $director_details->director;
						// $is_acting_director = $director_details->is_acting_director;

						//$permit_approval = $record->permit_approval;
						//$approved_by = $record->approved_by;
						// if($dg_signatory != $approved_by){
						// 	$signatory = $approved_by;
						// }
						// else{
						// 	$signatory = $dg_signatory;
						// }


				//$pdf->SetFont('Arial', 'B', 12);

				// Set initial y position
				$currentY = $pdf->GetY();
				$pdf->SetY($currentY + 4);

				// Set x positions for the sections
				$x1 = 10;
				$x2 = 110; // Adjust this value to position the second section as needed

				// Print the labels
				$pdf->SetX($x1);
				$pdf->Cell(40, 4, 'Approved By:   '.$approved_by, 0, 0, 'L');

				$pdf->SetX($x2);
				$approval_date = \DateTime::createFromFormat('Y-m-d H:i:s', $approval_date)->format('d/m/Y');
				$pdf->Cell(50, 4, 'Date of Approval:   '.$approval_date, 0, 0, 'L');

				// Draw lines beside the labels
				$lineY = $pdf->GetY() + 6; // Position the line a bit below the text
				$lineLength = 50; // Length of the line

				$pdf->Line($x1 + 30, $lineY, $x1 + 40 + $lineLength, $lineY);
				$pdf->Line($x2 + 38, $lineY, $x2 + 40 + $lineLength, $lineY);

				// Set y position below the lines
				$pdf->SetY($lineY + 1);

				// Print text below the lines
				//$pdf->SetFont('Arial', '', 12);
				//$pdf->SetTextColor(255, 0, 0);

				// $pdf->SetX($x2 + 50); // Position text below the line
				// $pdf->Cell($lineLength, 4, 'DD-MM-YYYY', 0, 2, 'L');

						// $pdf->Ln();
						// $pdf->Ln();
				//$signature = getUserSignatureDetails($signatory);
				//$signature = getcwd() . '/backend/resources/templates/signatures_uploads/'.$signature;
				// $startY = $pdf->GetY();
				// 		$startX =$pdf->GetX();
				//$pdf->Image($signature,$startX+75,$startY-8,30,12);

				// $pdf->Cell(105,0,'',0,0);

				// 		$pdf->Ln();
				// 		$pdf->Cell(0,10,'...............................................................', 0,1,'C');

				// 		$title = "Director-General";

						// if($dg_signatory != $approved_by){
						// 	$title = 'Acting '.$title;
						// }else{
						// 	if($is_acting_director ==1){
						// 		$title = 'Acting '.$title;
						// 	}

						// }

						//$pdf->Cell(0,10,$title, 0,0,'C');
				
				$pdf->OutPut('Document Permit.pdf');

				}
							// else{

							// //	Letter of Rejection
							// }


				}
				else{

					$res = array('success'=>false, 'message'=>'Document Application not found, contact system admin');
				}

		}catch (\Exception $exception) {
					$res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

		} catch (\Throwable $throwable) {
					$res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
		}
		return response()->json($res);


}


public function generateAuditReportWord(Request $req)  
{
    try {
        $application_code = $req->input('application_code');

        // Query to fetch the records
			$audit_records = DB::table('tra_auditsmanager_application as t1')
				->join('par_qms_audit_types as t7', 't1.audit_type_id', 't7.id')
				->join('users as t8', 't1.applicant_id', 't8.id')
				->join('par_system_statuses as t9', 't1.application_status_id', 't9.id')
			// ->join('tra_issue_management_related_issues as t13', 't11.id', 't13.related_id')
				->select(
					DB::raw("decrypt(t8.first_name) as first_name,decrypt(t8.last_name) as last_name"), 't1.audit_id', 't1.function_audited', 't1.audit_criteria', 't1.additional_auditor', 't1.audit_standard', 't1.audit_objectives',
						't1.application_code', 't1.audit_reference', 't1.audit_title', 't1.audit_start_date', 't1.audit_end_date', 't1.audit_summary', 't7.name as audit_type', 't9.name as status')  	
				->where('t1.application_code', $application_code)
				->get();

			// Convert the result into an array
			$records = convertStdClassObjToArray($audit_records);
			$records = decryptArray($records);


			$status_records = DB::table('tra_checklistitems_responses as t1')
				->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
				->join('par_checklist_items as t3', 't1.checklist_item_id', 't3.id')      
				->leftJoin('par_checklist_status as t4', function ($join) {
						$join->on('t1.pass_status', '=', 't4.id')
							->where('t1.checklist_item_id', '=', 't3.id');
					}) 
				->select(
						't1.pass_status', 't3.name')  	
				->where('t1.application_code', $application_code)
				->get();

				$status_records = convertStdClassObjToArray($status_records);
				$status_records = decryptArray($status_records);
				

		
			$comment_records = DB::table('tra_checklistitems_responses as t1')
							->leftJoin('tra_auditsmanager_application as t2', 't1.application_code', '=', 't2.application_code')
							->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', '=', 't3.id')
							->select(DB::raw("
								GROUP_CONCAT(t2.application_code) as application_codes, 
								GROUP_CONCAT(t2.tracking_no) as audit_ids, 
								GROUP_CONCAT(t2.audit_reference) as audit_references, 
								GROUP_CONCAT(DISTINCT t2.audit_title) as audit_titles, 
								GROUP_CONCAT(DISTINCT t2.audit_start_date) as audit_start_dates, 
								GROUP_CONCAT(DISTINCT t2.audit_end_date) as audit_end_dates, 
								GROUP_CONCAT(t1.comment) as comments
							"))
							->where('t1.application_code', $application_code)
							->groupBy('t1.checklist_item_id')
							->get();

						$comment_records = convertStdClassObjToArray($comment_records);
						$comment_records = decryptArray($comment_records);
						
						
						
			$question_records = DB::table('tra_checklistitems_responses as t1')
				->leftJoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
				->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id')
				->leftJoin('par_checklist_status as t4', 't1.pass_status', 't4.id')
				->leftJoin('tra_application_documents as t5', 't1.checklist_item_id', '=', 't5.checklist_item_id')
				->leftJoin('tra_application_uploadeddocuments as t6', function ($join) use ($application_code) {
					$join->on('t5.id', '=', 't6.application_document_id')
						->where('t6.application_code', '=', $application_code);
				})
				->select(DB::raw("
					GROUP_CONCAT(t2.application_code) as application_code,
					GROUP_CONCAT(t2.audit_reference) as audit_reference,
					GROUP_CONCAT(t2.audit_title) as audit_title,
					GROUP_CONCAT(t2.audit_start_date) as audit_start_date,
					GROUP_CONCAT(t2.audit_end_date) as audit_end_date,
					GROUP_CONCAT(t3.name) as name,
					GROUP_CONCAT(t4.name) as pass_status,
					GROUP_CONCAT(t1.comment) as comment
					"),
					DB::raw("GROUP_CONCAT(t6.initial_file_name SEPARATOR ', ') as evidence_files") // Combine evidence files for each question
				)
				->where('t1.application_code', $application_code)
				->groupBy('t1.checklist_item_id')
				->get();
			
			$question_records = convertStdClassObjToArray($question_records);
			$question_records = decryptArray($question_records);			
				
			
			
			$evidence_records = DB::table('tra_application_documents as t1')
								->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
								->leftjoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id') 
								->leftJoin('tra_application_uploadeddocuments as t4', function ($join) use ($application_code){
										$join->on('t1.id', '=', 't4.application_document_id')
											->where('t4.application_code', '=', $application_code);
									}) 
								->select(DB::raw("GROUP_CONCAT(t4.initial_file_name) as initial_file_name "))  	
								->where('t1.application_code', $application_code)
								->whereNotNull('t1.checklist_item_id')
								->groupBy('t1.checklist_item_id')
								->get();

							$evidence_records = convertStdClassObjToArray($evidence_records);
							$evidence_records = decryptArray($evidence_records);

        // Fetch findings
        $findings = DB::table('par_audit_findings as t1')
					->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
					->leftjoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id') 
					->select(DB::raw('COUNT(t1.id) as total_findings'))  
					->where('t1.application_code', $application_code)
					->get();

				$findings = convertStdClassObjToArray($findings);
				$findings = decryptArray($findings);

        // Fetch issues raised against findings
        $issue_raised_against_findings_record = DB::table('par_audit_findings as t1')
				->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
				->leftjoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id') 
				->leftjoin('tra_issue_management_applications as t4', 't1.issue_id', 't4.id') 
				->leftjoin('par_finding_types as t5', 't1.finding_type_id', 't5.id')
				->leftjoin('par_system_statuses as t6', 't2.application_status_id', 't6.id')
				->leftJoin('par_issue_types as t7', 't4.issue_type_id', 't7.id')
				->leftjoin('users as t8', 't4.created_by', 't8.id')
				->leftJoin('par_issue_statuses as t9', 't4.application_status_id', 't9.id')
				->select('t1.results','t1.id as finding_id', 't1.finding_title', 't2.created_on', 't2.dola as completed_on', 't2.audit_summary as description', 't4.tracking_no as raised_against', 't4.tracking_no as related_issue', 't4.id as issue_id', 't4.creation_date as issue_raised', 't4.date_closed', 't5.name as finding_type', 't6.name as raised_against_status', 't7.title as issue_type', 't7.title',
					DB::raw("decrypt(t8.first_name) as first_name,decrypt(t8.last_name) as last_name"), 't9.title as issue_status')	
				->where('t1.application_code', $application_code)
				->get();

				$issue_raised_against_findings_record = convertStdClassObjToArray($issue_raised_against_findings_record);
				$issue_raised_against_findings_record = decryptArray($issue_raised_against_findings_record);

        // Clean comments
        $cleanedComments = array_map(function($comment, $index) {
            return ($index + 1) . '. ' . nl2br(trim($comment));
        }, array_column($comment_records, 'comment'), array_keys($comment_records));

        $cleanedEvidence = array_map(function($evidence, $index) {
            return ($index + 1) . '. ' . nl2br(trim($evidence));
        }, array_column($evidence_records, 'initial_file_name'), array_keys($evidence_records));

        // Initializing PHPWord
        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        // Adding a section
        $section = $phpWord->addSection();
		$tableStyle = [
			            'borderSize' => 6, 
			            'borderColor' => '999999', 
			            'cellMargin' => 50
			        ];
		$cellStyle = ['valign' => 'center'];
		$headerCellStyle = ['bgColor' => 'd3d3d3', 'valign' => 'center'];


		
		$header = $section->addHeader();
		$headerTable = $header->addTable([
			'width' => 100,  
			'unit' => 'pct'       
		]);

		//logo row
		$headerTable->addRow();
		$headerTable->addCell(2000, ['align' => 'left'])->addText(
			'',
			['bold' => true, 'size' => 10],
			['align' => 'left']
		);

		$centerCell = $headerTable->addCell(6000, ['align' => 'center']);
		$centerCell->addImage(getcwd() . '/resources/images/logo.jpg', [
			'width' => 120,     
			//'height' => 50,   
			'align' => 'center'
		]);
		$centerCell->addText(
			'Botswana Medicines Regulatory Authority',
			['bold' => true, 'size' => 12],
			['align' => 'center']
		);
		$centerCell->addText(
			'Internal Audit Report',
			['bold' => true, 'size' => 12],
			['align' => 'center']
		);

		$headerTable->addCell(2000, ['align' => 'right'])->addText(
			'',
			['bold' => true, 'size' => 10],
			['align' => 'right']
		);

		$headerTable->addRow();

		$headerTable->addCell(3000, ['align' => 'left'])->addText(
			'BOMRA/QM/PO3/F02',
			['bold' => true, 'size' => 10],
			['align' => 'left']
		);

		
		$centerCell = $headerTable->addCell(6000, ['align' => 'center']);
		// Right column: Issue Number
		$headerTable->addCell(2000, ['align' => 'right'])->addText(
			'Issue No. 2.0',
			['bold' => true, 'size' => 10],
			['align' => 'right']
		);

		// footer section
		$footer = $section->addFooter();
		$footerTable = $footer->addTable([
			'width' => 100, 
			'unit' => 'pct',      
		]);

		$footerTable->addRow();
		$footerTable->addCell(5000)->addPreserveText('{DATE}', ['size' => 10], ['alignment' => 'left']);
		$footerTable->addCell(5000)->addPreserveText('Page {PAGE} of {NUMPAGES}', ['size' => 10], ['alignment' => 'right']);



        $section->addTextBreak(2);

        // table style
        $tableStyle = [
            'borderSize' => 10, 
            'borderColor' => '999999', 
            'cellMargin' => 50
        ];
        $cellStyle = ['valign' => 'center'];
        $headerCellStyle = ['bgColor' => 'd3d3d3', 'valign' => 'center'];

		foreach ($records as $record) {
			$phpWord->addTableStyle('AuditTable', $tableStyle);

			
			$table = $section->addTable('AuditTable');
			$table->addRow();
			$table->addCell(6000, $headerCellStyle)->addText("Audit Report Number", ['bold' => true]);
			$table->addCell(6000)->addText($record['audit_id']);
			$table->addCell(3000, $headerCellStyle)->addText("Audit Type", ['bold' => true]);
			$table->addCell(6000)->addText($record['audit_type']);
			$table->addRow();
			$table->addCell(6000, $headerCellStyle)->addText("Reference", ['bold' => true]);
			$table->addCell(3000)->addText($record['audit_reference']);
			$table->addCell(6000, $headerCellStyle)->addText("Title", ['bold' => true]);
			$table->addCell(3000)->addText($record['audit_title']);

			$table->addRow();
			$table->addCell(6000, $headerCellStyle)->addText("Auditor", ['bold' => true]);
			$table->addCell(3000)->addText($record['first_name']);
			$table->addCell(6000, $headerCellStyle)->addText("Status", ['bold' => true]);
			$table->addCell(3000)->addText($record['status']);

			$table->addRow();
			$table->addCell(6000, $headerCellStyle)->addText("Start Date", ['bold' => true]);
			$table->addCell(3000)->addText($record['audit_start_date']);
			$table->addCell(6000, $headerCellStyle)->addText("End Date", ['bold' => true]);
			$table->addCell(3000)->addText($record['audit_end_date']);
			
			$table->addRow();
			$table->addCell(3000, $headerCellStyle)->addText("Summary and Scope", ['bold' => true]);
			$table->addCell(18000, ['gridSpan' => 3])->addText($record['audit_summary'], 
				['bold' => false]
			);
		}


		$section->addTextBreak(1);// spacing

		$table = $section->addTable('AuditTable');
		$table->addRow();
        $table->addCell(6000, $headerCellStyle)->addText("Function Audited", ['bold' => true]);
        $table->addCell(6000)->addText($record['function_audited']);
        $table->addCell(6000, $headerCellStyle)->addText("Audit Standard", ['bold' => true]);
        $table->addCell(6000)->addText($record['audit_standard']);
		$table->addRow();
        $table->addCell(6000, $headerCellStyle)->addText("Audit Criteria", ['bold' => true]);
        $table->addCell(6000)->addText($record['audit_criteria']);
        $table->addCell(6000, $headerCellStyle)->addText("Audit Objectives", ['bold' => true]);
        $table->addCell(6000)->addText($record['audit_objectives']);

		$table->addRow();
		$table->addCell(3000, $headerCellStyle)->addText("Additional Auditor", ['bold' => true]);
		$table->addCell(18000, ['gridSpan' => 3])->addText($record['additional_auditor'], ['bold' => false]
		);


		//questionnaire
		$section->addTextBreak(1);
		$section->addText("Questionnaire",['bold' => true]);

		foreach ($question_records as $questionRecord) {

			$table = $section->addTable('AuditTable');

			$table->addRow();
			$cell = $table->addCell(12000, ['gridSpan' => 2, 'bgColor' => 'd3d3d3']); // Merges two columns
			$cell->addText($questionRecord['name'], ['bold' => true]);

			$table->addRow();
			$table->addCell(3000, $headerCellStyle)->addText("Status", ['bold' => true]);
			$table->addCell(6000)->addText($questionRecord['pass_status'], ['bold' => false]);

			$table->addRow();
			$table->addCell(3000, $headerCellStyle)->addText("Comments Notes", ['bold' => true]);
			$table->addCell(6000)->addText($questionRecord['comment'], ['bold' => false]);

			$table->addRow();
			$table->addCell(3000, $headerCellStyle)->addText("Evidence", ['bold' => true]);
			$table->addCell(6000)->addText($questionRecord['evidence_files'], ['bold' => false]);
			$section->addTextBreak(1);
		}


		$section->addTextBreak(1);
		//findings
		$section->addText("Findings", ['bold' => true, 'size' => 12]);
		$totalFindings = $findings[0]['total_findings']; 
		$section->addText("Total findings: $totalFindings", ['size' => 12]);

        $section->addTextBreak(1);

        // Findings Table
        $phpWord->addTableStyle('AuditTable', $tableStyle);

		foreach($issue_raised_against_findings_record as $finding_record){
			$findingsTable = $section->addTable('AuditTable');

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Finding ID", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['finding_id']);
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Type", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['finding_type']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Title", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($finding_record['finding_title']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Raised Against", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($record['audit_id']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Status", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($record['status']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Created", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($record['audit_start_date']);
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Completed", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($record['audit_end_date']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Description", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($record['audit_summary']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Finding", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($finding_record['results']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Related issue", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($finding_record['related_issue']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Issue ID", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['issue_id']);
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Type", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['issue_type']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Title", ['bold' => true]);
			$findingsTable->addCell(9000, ['gridSpan' => 3])->addText($finding_record['title']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Owner", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['first_name']);
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Status", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['raised_against_status']);

			$findingsTable->addRow();
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Raised", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['issue_raised']);
			$findingsTable->addCell(3000, $headerCellStyle)->addText("Closed", ['bold' => true]);
			$findingsTable->addCell(3000)->addText($finding_record['date_closed']);

        	$section->addTextBreak(1);
		}

        // Save the file
        $fileName = "Audit_Report_" . $application_code . ".docx";
        $filePath = storage_path('app/public/reports/' . $fileName);
        $phpWord->save($filePath, 'Word2007');

        return response()->download($filePath, $fileName)->deleteFileAfterSend(true);

    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()]);
    }
}


	public function generateAuditReport(Request $req)
	{
		try {
			// Retrieve the application code from the request
			$application_code = $req->input('application_code');

			// Query to fetch the records
			$audit_records = DB::table('tra_auditsmanager_application as t1')
				->join('par_qms_audit_types as t7', 't1.audit_type_id', 't7.id')
				->join('users as t8', 't1.applicant_id', 't8.id')
				->join('par_system_statuses as t9', 't1.application_status_id', 't9.id')
			// ->join('tra_issue_management_related_issues as t13', 't11.id', 't13.related_id')
				->select(
					DB::raw("decrypt(t8.first_name) as first_name,decrypt(t8.last_name) as last_name"), 't1.audit_id', 't1.function_audited', 't1.audit_criteria', 't1.additional_auditor', 't1.audit_standard', 't1.audit_objectives',
						't1.application_code', 't1.audit_reference', 't1.audit_title', 't1.audit_start_date', 't1.audit_end_date', 't1.audit_summary', 't7.name as audit_type', 't9.name as status')  	
				->where('t1.application_code', $application_code)
				->get();

			// Convert the result into an array
			$records = convertStdClassObjToArray($audit_records);
			$records = decryptArray($records);


			$status_records = DB::table('tra_checklistitems_responses as t1')
				->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
				->join('par_checklist_items as t3', 't1.checklist_item_id', 't3.id')      
				->leftJoin('par_checklist_status as t4', function ($join) {
						$join->on('t1.pass_status', '=', 't4.id')
							->where('t1.checklist_item_id', '=', 't3.id');
					}) 
				->select(
						't1.pass_status', 't3.name')  	
				->where('t1.application_code', $application_code)
				->get();

				$status_records = convertStdClassObjToArray($status_records);
				$status_records = decryptArray($status_records);
				

		
			$comment_records = DB::table('tra_checklistitems_responses as t1')
							->leftJoin('tra_auditsmanager_application as t2', 't1.application_code', '=', 't2.application_code')
							->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', '=', 't3.id')
							->select(DB::raw("
								GROUP_CONCAT(t2.application_code) as application_codes, 
								GROUP_CONCAT(t2.tracking_no) as audit_ids, 
								GROUP_CONCAT(t2.audit_reference) as audit_references, 
								GROUP_CONCAT(DISTINCT t2.audit_title) as audit_titles, 
								GROUP_CONCAT(DISTINCT t2.audit_start_date) as audit_start_dates, 
								GROUP_CONCAT(DISTINCT t2.audit_end_date) as audit_end_dates, 
								GROUP_CONCAT(t1.comment) as comments
							"))
							->where('t1.application_code', $application_code)
							->groupBy('t1.checklist_item_id')
							->get();

						$comment_records = convertStdClassObjToArray($comment_records);
						$comment_records = decryptArray($comment_records);
						
						
						
			$question_records = DB::table('tra_checklistitems_responses as t1')
				->leftJoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
				->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id')
				->leftJoin('par_checklist_status as t4', 't1.pass_status', 't4.id')
				->leftJoin('tra_application_documents as t5', 't1.checklist_item_id', '=', 't5.checklist_item_id')
				->leftJoin('tra_application_uploadeddocuments as t6', function ($join) use ($application_code) {
					$join->on('t5.id', '=', 't6.application_document_id')
						->where('t6.application_code', '=', $application_code);
				})
				->select(DB::raw("
					GROUP_CONCAT(t2.application_code) as application_code,
					GROUP_CONCAT(t2.audit_reference) as audit_reference,
					GROUP_CONCAT(t2.audit_title) as audit_title,
					GROUP_CONCAT(t2.audit_start_date) as audit_start_date,
					GROUP_CONCAT(t2.audit_end_date) as audit_end_date,
					GROUP_CONCAT(t3.name) as name,
					GROUP_CONCAT(t4.name) as pass_status,
					GROUP_CONCAT(t1.comment) as comment
					"),
					DB::raw("GROUP_CONCAT(t6.initial_file_name SEPARATOR ', ') as evidence_files") // Combine evidence files for each question
				)
				->where('t1.application_code', $application_code)
				->groupBy('t1.checklist_item_id')
				->get();
			
			$question_records = convertStdClassObjToArray($question_records);
			$question_records = decryptArray($question_records);			
				
			
			
			$evidence_records = DB::table('tra_application_documents as t1')
								->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
								->leftjoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id') 
								->leftJoin('tra_application_uploadeddocuments as t4', function ($join) use ($application_code){
										$join->on('t1.id', '=', 't4.application_document_id')
											->where('t4.application_code', '=', $application_code);
									}) 
								->select(DB::raw("GROUP_CONCAT(t4.initial_file_name) as initial_file_name "))  	
								->where('t1.application_code', $application_code)
								->whereNotNull('t1.checklist_item_id')
								->groupBy('t1.checklist_item_id')
								->get();

							$evidence_records = convertStdClassObjToArray($evidence_records);
							$evidence_records = decryptArray($evidence_records);

        // Fetch findings
        $findings = DB::table('par_audit_findings as t1')
					->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
					->leftjoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id') 
					->select(DB::raw('COUNT(t1.id) as total_findings'))  
					->where('t1.application_code', $application_code)
					->get();

				$findings = convertStdClassObjToArray($findings);
				$findings = decryptArray($findings);

        // Fetch issues raised against findings
        $issue_raised_against_findings_record = DB::table('par_audit_findings as t1')
				->leftjoin('tra_auditsmanager_application as t2', 't1.application_code', 't2.application_code')
				->leftjoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id') 
				->leftjoin('tra_issue_management_applications as t4', 't1.issue_id', 't4.id') 
				->leftjoin('par_finding_types as t5', 't1.finding_type_id', 't5.id')
				->leftjoin('par_system_statuses as t6', 't2.application_status_id', 't6.id')
				->leftJoin('par_issue_types as t7', 't4.issue_type_id', 't7.id')
				->leftjoin('users as t8', 't4.created_by', 't8.id')
				->leftJoin('par_issue_statuses as t9', 't4.application_status_id', 't9.id')
				->select('t1.results','t1.id as finding_id', 't1.finding_title', 't2.created_on', 't2.dola as completed_on', 't2.audit_summary as description', 't4.tracking_no as raised_against', 't4.tracking_no as related_issue', 't4.id as issue_id', 't4.creation_date as issue_raised', 't4.date_closed', 't5.name as finding_type', 't6.name as raised_against_status', 't7.title as issue_type', 't7.title',
					DB::raw("decrypt(t8.first_name) as first_name,decrypt(t8.last_name) as last_name"), 't9.title as issue_status')	
				->where('t1.application_code', $application_code)
				->get();

				$issue_raised_against_findings_record = convertStdClassObjToArray($issue_raised_against_findings_record);
				$issue_raised_against_findings_record = decryptArray($issue_raised_against_findings_record);
			
			// Check if there are any records returned
			// if (empty($records)) {
			//     return response()->json(['success' => false, 'message' => 'No records found for the given application code']);
			// }


				

				// $cleanedComments = array_map(function($comment) {
				//     // Remove unnecessary spaces and then convert newlines to <br> tags
				//     return nl2br(trim($comment));
				// }, array_column($comment_records, 'comment'));

		$cleanedComments = array_map(function($comment, $index) {
		// Remove unnecessary spaces and convert newlines to <br> tags
			return ($index + 1) . '. ' . nl2br(trim($comment));
		}, array_column($comment_records, 'comment'), array_keys($comment_records));

		$Evidence = array_map(function($comment, $index) {
		// Remove unnecessary spaces and convert newlines to <br> tags
			return ($index + 1) . '. ' . nl2br(trim($comment));
		}, array_column($evidence_records, 'initial_file_name'), array_keys($evidence_records));

				//$comments = array_column($comment_records, 'comment');
				$commentsWithBreaks = implode('<br>', $cleanedComments);
				$EvidenceWithBreaks = implode('<br>', $Evidence);


			// Initialize the PDF provider
			$pdf = new AuditReportProvider();
			//$pdf->setImportHeader($records[0]['audit_id'],$issue_raised_against_findings_record[0]['issue_id']);
			$pdf->setImportHeader('',$issue_raised_against_findings_record[0]['issue_id']);
			$pdf->AddPage();
			$pdf->SetFont('Times', '', 12);
			
			

		// function checkPageBreak($pdf, $contentHeight) {
		//     // Use a hardcoded value for top margin if necessary
		//     $topMargin = 20; // Adjust as needed
		//     if ($pdf->GetY() + $contentHeight > $pdf->GetPageHeight() - $topMargin) {
		//         $pdf->AddPage();
		//     }
		// }
			//$rowHeight = 20;
			// Add an image centered above the header text
		
			// $logo = getcwd() . '/resources/images/logo.jpg';
			// $logo = str_replace('\\', '/', $logo);
			// $pdf->Image($logo,85,25,43,19); // Adjust position and size as necessary
			// // Set the position for the header text
			// $pdf->SetY(42); // Adjust vertical position after image

			// // Define page width for alignment calculations
			// $pageWidth = $pdf->GetPageWidth();

			// // Left-aligned header text
			// $pdf->SetX(10);
			// $pdf->Cell(0, 10, 'BOMRA/'. $records[0]['audit_id'], 0, 0, 'L');

			// // Center-aligned header text
			// $pdf->SetX(($pageWidth / 2) - (80)); // Adjust X position to center text (50 is approximate width of the text block)
			// $pdf->Cell(0, 10, 'Botswana Medicines Regulatory Authority', 0, 0, 'C');
			
			// // Center-aligned second line of header text
			// $pdf->SetX(($pageWidth / 2) - (80)); // Adjust X position to center text
			// $pdf->Cell(0, 20, 'Internal Audit Report', 0, 0, 'C');

			// // Right-aligned header text
			// $pdf->SetX($pageWidth - 90); // Adjust X position for right-aligned text (90 is approximate width of the text block)
			// $pdf->Cell(0, 10, 'Issue No. '. $records[0]['issue_no'], 0, 0, 'R');

			// // Add some space before the content starts
			// $pdf->Ln(30);
		

			// Start building HTML content


		foreach ($records as $record) {  
				
			$html = '<h3></h3>';
			$html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; page-break-inside: avoid;">';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Audit Report Number</th><td>' . htmlspecialchars($record['audit_id']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Audit Type</th><td>' . htmlspecialchars($record['audit_type']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Reference</th><td>' . htmlspecialchars($record['audit_reference']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Title</th><td>' . htmlspecialchars($record['audit_title']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Auditor</th><td>' . htmlspecialchars($record['first_name']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Status</th><td>' . htmlspecialchars($record['status']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Start Date</th><td>' . htmlspecialchars($record['audit_start_date']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">End Date</th><td>' . htmlspecialchars($record['audit_end_date']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Summary & Scope</th><td colspan="3">' . htmlspecialchars($record['audit_summary']) . '</td>';
			$html .= '</tr>';
			$html .= '</table>';
		}



			$html .= '<h3></h3>';
			$html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; page-break-inside: avoid;">';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Function Audited:</th><td>' . htmlspecialchars($record['function_audited']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Audit Standard:</th><td>' . htmlspecialchars($record['audit_standard']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Audit Criteria:</th><td>' . htmlspecialchars($record['audit_criteria']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Audit Objectives:</th><td>' . htmlspecialchars($record['audit_objectives']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Additional Auditor:</th><td colspan="3">' . htmlspecialchars($record['additional_auditor']) . '</td>';
			$html .= '</tr>';
			$html .= '</table>';
			

			$html .= '<br><br>';

			$html .= '<h3 style="margin: 0; padding: 0; border-bottom: 1px solid gray;">Questionnaire</h3>';
			$html .= '<div style="margin-bottom: 600px;"></div>';
			//$html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; page-break-inside: avoid;">';
			
			//questions
			foreach ($question_records as $questionRecord) {
				$html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse; page-break-inside: avoid;">';
			
				
				$html .= '<tr>';
				//$html .= '<td style="width: 30%; font-weight: bold; background-color: #f9f9f9;">Question</td>';
				$html .= '<td style="background-color: #ffffff; font-weight: bold;">' . htmlspecialchars($questionRecord['name']) . '</td>';
				$html .= '</tr>';
			
				// Status Section
				$html .= '<tr>';
				$html .= '<td style="width: 30%; font-weight: bold; background-color: #f9f9f9;">Status</td>';
				$html .= '<td style="background-color: #ffffff;">' . htmlspecialchars($questionRecord['pass_status']) . '</td>';
				$html .= '</tr>';
			
				// Notes Section
				$html .= '<tr>';
				$html .= '<td style="width: 30%; font-weight: bold; background-color: #f9f9f9;">Notes</td>';
				$html .= '<td style="background-color: #ffffff;">' . htmlspecialchars($questionRecord['comment']) . '</td>';
				$html .= '</tr>';
			
				// Evidence Section
				$html .= '<tr>';
				$html .= '<td style="width: 30%; font-weight: bold; background-color: #f9f9f9;">Evidence</td>';
				$html .= '<td style="background-color: #ffffff;">';
				if (!empty($questionRecord['evidence_files'])) {
					$html .= htmlspecialchars($questionRecord['evidence_files']);
				} else {
					$html .= '<span style="color: #888888;">No evidence available</span>';
				}
				$html .= '</td>';
				$html .= '</tr>';
			
				$html .= '</table>';
				$html .= '<br><br>';
				$html .= '<br><br>';
			}

			$html .= '<br></br>';

			$html .= '<h3 style="margin: 0, padding: 0; border-bottom: 1px solid gray;">Findings</h3>';
			$html .= '<div style="margin-bottom: 600px;"></div>'; 
			$html .= '<p style="font-weight:bold;">Total number of findings: <span style="font-weight:normal;">' . htmlspecialchars($findings[0]['total_findings']) . '</span></p>';

			$html .= '<br></br>';



		foreach($issue_raised_against_findings_record as $finding_record){
			$html .= '<h3></h3>';
			$html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%">';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Finding ID</th><td>' . htmlspecialchars($finding_record['finding_id']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Type</th><td>' . htmlspecialchars($finding_record['finding_type']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Title</th><td colspan="3">' . htmlspecialchars($finding_record['finding_title']) . '</td>';  
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Raised Against</th><td colspan="3">' . htmlspecialchars($record['audit_id']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Status</th><td colspan="3">' . htmlspecialchars($record['status']) . '</td>';
			$html .= '</tr>';

			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Created</th><td>' . htmlspecialchars($record['audit_start_date']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Completed</th><td colspan="3">' . htmlspecialchars($record['audit_end_date']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Description</th><td colspan="3">' . htmlspecialchars($record['audit_summary']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Finding</th><td colspan="3">' . htmlspecialchars($finding_record['results']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold;">Related Issue</th><td colspan="3">' . htmlspecialchars($finding_record['related_issue']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Issue ID</th><td>' . htmlspecialchars($finding_record['issue_id']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Type</th><td colspan="3">' . htmlspecialchars($finding_record['issue_type']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Title</th><td colspan="3">' . htmlspecialchars($finding_record['title']) . '</td>';
			$html .= '</tr>';
			$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Owner</th><td>' . htmlspecialchars($finding_record['first_name']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Status</th><td colspan="3">' . htmlspecialchars($finding_record['raised_against_status']) . '</td>';
			$html .= '</tr>';
				$html .= '<tr>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Raised</th><td>' . htmlspecialchars($finding_record['issue_raised']) . '</td>';
			$html .= '<th style="font-weight:bold; background-color: #d3d3d3;">Closed</th><td colspan="3">' . htmlspecialchars($finding_record['date_closed']) . '</td>';
			$html .= '</tr>';
			$html .= '</table>';
		
	}

			$pdf->writeHTML($html, true, false, true, false, '');

			// Output the PDF as a downloadable file
			return response()->stream(
				function () use ($pdf) {
					$pdf->Output('Audit_Report.pdf', 'I'); 
				},
				200,
				[
					'Content-Type' => 'application/pdf',
					'Content-Disposition' => 'inline; filename="Audit_Report.pdf"',
					'X-Fullscreen' => 'true', 
				]
			);

		} catch (\Exception $exception) {
			$res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
			return response()->json($res);
		} catch (\Throwable $throwable) {
			$res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
			return response()->json($res);
		}
	}
	

}

