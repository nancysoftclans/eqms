<?php
/**
 * Created by PhpStorm.
 * Date: 4/9/2019
 * Time: 8:41 PM
 */

namespace Modules\Reports\Traits;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use \Mpdf\Mpdf as mPDF;

use PDF;


use App\Modules\Reports\Providers\PdfProvider;
use App\Modules\Reports\Providers\PdfLettersProvider;
use App\Modules\Reports\Providers\PdfPlainLettersProvider;
trait ReportsTrait
{
	protected $user_id;
    protected $base_url;
    protected $sign_url;
    protected $sign_file;
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
    public function generatePremisePermit($premise_id)
    {
        $params = array(
            'premise_id' => $premise_id,
            'document_type' => 'permit'
        );
        $report = generateJasperReport('premisePermitReport', 'permit_' . time(), 'pdf', $params);
        return $report;
    }

    public function generatePremiseCertificate($premise_id)
    {
        $params = array(
            'premise_id' => $premise_id,
            'document_type' => 'certificate'
        );
        $report = generateJasperReport('certificateReport', 'certificate_' . time(), 'pdf', $params);
        return $report;
    }
	
	
	public function printOrderforSupplyDangeruousDrg($application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null)
    {
		$document_type_id = 25;
		$document_requirement_id = 254;
		
        $permit_watermark = '';//$request->input('permit_watermark');
       
		$record = DB::table('tra_importexport_applications as t1')
					->leftJoin('sub_modules as t2','t1.sub_module_id','t2.id')
					->leftJoin('wb_trader_account as t3','t1.applicant_id', 't3.id')
					->leftJoin('par_countries as t4', 't3.country_id', 't4.id')
					->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
					->leftJoin('tra_managerpermits_review as t7', 't1.application_code', 't7.application_code')
					->leftJoin('users as t8', 't7.prepared_by_id', 't8.id')
					->leftJoin('tra_permitsenderreceiver_data as t9','t1.sender_receiver_id', 't9.id')
					->leftJoin('par_countries as t10', 't9.country_id', 't10.id')
					->leftJoin('par_regions as t11', 't9.region_id', 't11.id')
					->leftJoin('par_user_designations as t12', 't8.user_designation_id', 't12.id')
					->select('t2.title','t2.title as permit_title', 't1.sub_module_id', 't1.*','t3.name as applicant_name','t2.action_title','t7.decision_id as recommendation_id', 't7.comment as remarks', 't3.*', 't4.name as country_name', 't5.name as region_name', 't7.approval_date', DB::raw("concat(decrypt(t8.first_name),' ',decrypt(t8.last_name)) as permit_approval, t9.name as suppler_name, t9.physical_address as suppler_address, t10.name as supplier_country, t11.name as supplier_region,t7.prepared_by_id as approved_by, t9.postal_address as supplier_postal_address, t12.name as user_designation"))
					->where('t1.application_code',$application_code)
					->first();
					
					
		if($record){
				//check the recommendation
				
				if($record->recommendation_id == 1){
					$data = array('user_id'=>'', 
									'application_id'=>$record->id,
									'application_code'=>$application_code,
									'reference_no'=>$record->reference_no,
									'table_name'=>'tra_importexport_applications', 
									'application_type'=>$record->module_id, 
									'document_type'=>$document_type_id, 
									'section_id'=>$record->section_id, 
									'printed_on'=>Carbon::now(),
									'printed_by'=>''
								);
								$permit_no = $record->reference_no;
								funcReportGenerationLog($data,'');
											$params = array(
											'application_code' => $application_code,
											'app_code' => $application_code,
											'permit_watermark' => $permit_watermark,
											'document_type' => 'permit',
											'inc_header' => 1,
											'base_Url' => $this->base_url,
											'sign_Url' => $this->sign_url
										);
										$pdf = new PdfProvider();
										// add a page
										$pdf->AddPage();
										$pdf->SetLineWidth(0.4);
										//$pdf->Rect(3,3,204,290);
										$pdf->SetLineWidth(1.2);
										//$pdf->Rect(5,5,200,285);
										$pdf->SetLineWidth(0.4);
									//	$pdf->Rect(7,7,195,280);
										$pdf->setMargins(20,25,20,true);
										$template_url = base_path('/');
										$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
										// import page 1
										$tplId = $pdf->importPage(1);	
									
										// use the imported page and place it at point 10,10 with a width of 100 mm
										$pdf->useTemplate($tplId,0,0);
										$pdf->setPageMark();
										$pdf->SetFont('times','I',9);
										$pdf->Cell(0,5,'', 0,1,'R');
										$pdf->Cell(0,5,'', 0,1,'R');
										$logo = getcwd() . '/resources/images/zamra-logo.png';
										$pdf->ln();
										$pdf->ln();
										$pdf->ln();
										$pdf->Image($logo,90,15,34,30);
										$pdf->SetFont('times','B',14);
										$style = array(
												'border' => 0,
												'vpadding' => 'auto',
												'hpadding' => 'auto',
												'fgcolor' => array(0,0,0),
												'bgcolor' => false, //array(255,255,255)
												'module_width' => 1, // width of a single module in points
												'module_height' => 1 // height of a single module in points
										);
										$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
										$pdf->SetFont('times','B',13);
									$pdf->ln();
										$pdf->ln();
										
										$pdf->Cell(0,5,'ZAMBIA MEDICINES REGULATORY AUTHORITY', 0,1,'C');	
										
										
										$pdf->SetFont('times','b',11);
										$pdf->Cell(0,5,strtoupper('ORDER FOR LOCAL SUPPLY OF DANGEROUS DRUGS'), 0,1,'C');
										$pdf->SetFont('times','b',10);
										$pdf->ln();
										$pdf->SetFont('times','I',9);
										$pdf->Cell(55,5,$record->reference_no, 0,0,'');
										$pdf->Cell(0,8,'DATE: '.formatDaterpt($record->approval_date), 0,1,'R');
										
										$pdf->SetFont('times','',10);
										$pdf->Cell(0,5,'TO(Name and Address of Supplier)', 0,1,'');
										$pdf->SetFont('times','b',10);
										$pdf->Cell(0,5,$record->suppler_name, 0,1,'');
										$pdf->MultiCell(0,5, preg_replace( "/\r|\n/", "", $record->suppler_address ),0,'',0,1);
										$pdf->Cell(0,5,$record->supplier_postal_address, 0,1,'');
										$pdf->Cell(0,5,$record->supplier_region.' '.$record->supplier_country, 0,1,'');
										$pdf->ln();
										$pdf->SetFont('times','',10);
										$pdf->Cell(0,5,'Please supply the following to (Name and Address of Buyer)', 0,1,'');
										$pdf->SetFont('times','b',10);
										$pdf->Cell(0,5,$record->applicant_name, 0,1,'');
										$pdf->MultiCell(0,5,$record->physical_address,0,'',0,1);
										$pdf->Cell(0,5,$record->postal_address, 0,1,'');
										$pdf->Cell(0,5,$record->region_name.' '.$record->country_name, 0,1,'');
										//prduct details 
										$pdf->SetFont('times','',10);
										$prod_rec = DB::table('tra_permits_products as t1')
													->leftJoin('tra_product_information as t2', 't1.product_id', 't2.id')
													->leftJoin('par_dosage_forms as t3', 't1.dosage_form_id', 't3.id')
													->leftJoin('par_packaging_units as t4', 't1.packaging_unit_id', 't4.id')
													->leftJoin('par_common_names as t5', 't1.common_name_id', 't5.id')
													->leftJoin('par_si_units as t6', 't1.unitpack_unit_id', 't6.id')
													->select('t1.*','t4.name as packaging_unit','t1.product_strength','t5.name as generic_name', 't2.brand_name', 't3.name as dosage_form', 't6.name as si_unit', 't1.unitpack_size')
													->where(array('application_code'=>$record->application_code))
													->get();$pdf->ln();
										$pdf->SetFont('times','B',10);
										$pdf->MultiCell(15,10,'No.',1,'',0,0);
										$pdf->MultiCell(100,10,'ITEM DESCRIPTION(NAME, STRENGTH, DOSAGE FORM AND PACK SIZE)',1,'',0,0);
										$pdf->MultiCell(30,10,'QUANTITY ORDERED',1,'',0,0);
										$pdf->MultiCell(0,10,'SUPPLIED',1,'',0,1);
										$pdf->SetFont('times','',10);
										$prod_counter = $prod_rec->count();
										if($prod_counter >0){
											$i=1;
												foreach($prod_rec as $rec){
													if($rec->permitbrand_name != ''){
															$permit_brandname = $rec->permitbrand_name;
													}
													else{
														$permit_brandname = $rec->brand_name;

													}
													$product_desc = ($permit_brandname).' '.($rec->dosage_form).' '.($rec->product_strength);
													
													$product_desc = $product_desc.' '.$rec->unitpack_size.' '.$rec->si_unit;
													
													$packaging_data = number_format($rec->quantity).' '.$rec->packaging_unit;
													$rowcount = max(PDF::getNumLines($product_desc, 100),PDF::getNumLines($packaging_data, 40));
											
													$pdf->MultiCell(15,5*$rowcount,$i,1,'',0,0);
													$pdf->MultiCell(100,5*$rowcount,$product_desc,1,'',0,0);
													$pdf->MultiCell(30,5*$rowcount,$packaging_data,1,'C',0,0);
													$pdf->MultiCell(0,5*$rowcount,'',1,'C',0,1);
														if($i == 14){
															$pdf->AddPage();
														}
														$i++;
												}
											//	
												if($prod_counter < 5){
													$start = $prod_counter;
													$x_t = $pdf->GetX()+25; $y = $pdf->GetY();
													
													for($x = $prod_counter; $x <= 4; $x++ ){
														$pdf->MultiCell(15,5,$i,1,'',0,0);
														$pdf->MultiCell(100,5,'',1,'',0,0);
														$pdf->MultiCell(30,5,'',1,'',0,0);
		
														$pdf->MultiCell(0,5,'',1,'',0,1);
															$i++;
													}
													$x_b = $pdf->GetX(); $y_b = $pdf->GetY();
													$pdf->Line($x_t, $y, $x_b+160, $y_b);

												}
										}
										else{
											$i=1;
											for($x = 1; $x <= 4; $x++ ){
												$pdf->MultiCell(15,5,$i,1,'',0,0);
												$pdf->MultiCell(100,5,'',1,'',0,0);
												$pdf->MultiCell(30,5,'',1,'',0,0);
												$pdf->MultiCell(0,5,'',1,'',0,1);

													$i++;
											}
										}
										$pdf->ln();
										$pdf->SetFont('times','B',11);
										$pdf->Cell(45,6,'ORDERED BY: ', 0,1,'');
										
										$pdf->SetFont('times','U',11);
										$pdf->MultiCell(0,6,strtoupper($record->ordered_by),0,'',0,1);
										
										$pdf->SetFont('times','',11);
										
										$pdf->Cell(0,7,strtoupper($record->qualifications).' (Qualification)', 0,1,'');
										
										$pdf->Cell(70,7,strtoupper($record->qualification_license_no).' (HPCZ or VAZ License Number)', 0,1,'');
										//$pdf->Cell(0,7,'Applicant', 0,1,'C');
										
										$pdf->SetFont('times','B',11);
										$pdf->ln();
										$pdf->Cell(45,6,'APPROVED BY: ', 0,1,'');
										
										$pdf->SetFont('times','',11);
										$pdf->MultiCell(0,7,strtoupper($record->permit_approval),0,'',0,1);
										
										//$pdf->MultiCell(0,7,'...................................................................',0,'',0,1);
										$signature = getUserSignatureDetails($record->approved_by);
										$signature = getcwd().'/backend/resources/templates/signatures_uploads/'.$signature;
										$pdf->ln();
										//screened_on
								$startY = $pdf->GetY();
								$startX =$pdf->GetX();
										$pdf->Image($signature,$startX+4,$startY-8,30,12);
					$pdf->Cell(8,7,'', 0,1,'');
										$pdf->Cell(0,7,'Signature', 0,1,'');
										$pdf->Cell(0,7,strtoupper($record->user_designation), 0,1,'');
										
										$pdf->Cell(70,7,'(Designation)', 0,1,'');
										///$pdf->Cell(0,7,'For / Permanent Secretary Ministry of Health', 0,1,'C');
										
										
							
							if($permit_previewoption =='notify'){
								$pdf->Output($upload_directory, "F"); 
										}
										else{
											$pdf->OutPut('Order for Supply of Dangeruous Drugs.pdf');
										
										}
				}
				else{
					if($record->recommendation_id < 1){
						echo "The Approvel recommendation has not been set";
						
					}
					else{
						$this->permitLetterofRejection($record->approval_date,$record->remarks,$application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null);
					}
					
					
				}
			
		}
		
		
	}
	
	public function generatePrecursorDrugsLicensePermit($application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null){
		//PdfPlainLettersProvider
		$document_type_id = 25;
		$document_requirement_id = 254;
		$permit_watermark = '';
        $approvalGrant = DB::table('tra_managerpermits_review')->where('application_code',$application_code)->first();
        
        if(!empty($approvalGrant) && $approvalGrant->decision_id == 1){
			//getPermitSignatory()
				$pdf = new PdfPlainLettersProvider();
										// add a page
					$pdf->AddPage();	
					$this->returnPrecursorDrugsApprovaLCertificate($pdf,'Certificate of official approval of import of dangerous drugs', 'Form D.D.2','1m Q268 11/85 S',$approvalGrant,$application_code);
					
					$pdf->OutPut('Certificate of Approval to Import to Import Dangerous Drugs');				
		}
		else{
				//rejection
			
			
		}
	}
	
	public function generateDangerousDrugsLicensePermit($application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null){
		//PdfPlainLettersProvider
		$document_type_id = 25;
		$document_requirement_id = 254;
		$permit_watermark = '';
        $approvalGrant = DB::table('tra_managerpermits_review')->where('application_code',$application_code)->first();
        
        if(!empty($approvalGrant) && $approvalGrant->decision_id == 1){
			//getPermitSignatory()
				$pdf = new PdfPlainLettersProvider();
										// add a page
					$pdf->AddPage();	
					$this->returnDangerousGoodPermitsLic($pdf,'Licence to Import Dangerous Drugs', 'Form D.D.3','1m Q269 12/85 S',$approvalGrant ,$application_code);
					$pdf->AddPage();	
					$this->returnDangerousGoodPermitsLic($pdf,'Certificate of official approval of import of dangerous drugs', 'Form D.D.2','1m Q268 11/85 S',$approvalGrant,$application_code);
					
					$pdf->OutPut('Licence to Import Dangerous Drugs');				
		}
		else{
				//rejection
			
			
		}
	}
	function returnPrecursorDrugsApprovaLCertificate($pdf,$title, $form_name,$form_no,$approvalGrant,$application_code ){
			$document_type_id = 25;
			$document_requirement_id = 254;
			$permit_watermark = '';
			$permit_no = $approvalGrant->permit_no;
			$expiry_date = $approvalGrant->expiry_date;
			$approval_date = $approvalGrant->approval_date;
			$record = DB::table('tra_importexport_applications as t1')
						->join('sub_modules as t2','t1.sub_module_id','t2.id')
						->leftJoin('wb_trader_account as t3','t1.applicant_id', 't3.id')
						->join('par_countries as t4', 't3.country_id', 't4.id')
						->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
						->leftJoin('par_ports_information as t6', 't1.port_id', 't6.id')
						->leftJoin('tra_permitsrelease_recommendation as t7', 't1.application_code', 't7.application_code')
						->leftJoin('users as t8', 't7.permit_signatory', 't8.id')
						->leftJoin('tra_permitsenderreceiver_data as t9','t1.sender_receiver_id', 't9.id')
						->leftJoin('par_countries as t10', 't9.country_id', 't10.id')
						->leftJoin('par_regions as t11', 't9.region_id', 't11.id')
						->leftJoin('par_modesof_transport as t12', 't1.mode_oftransport_id', 't12.id')
						->select('t2.title','t2.title as permit_title', 't1.sub_module_id', 't1.*','t3.name as applicant_name','t2.action_title','t6.name as port_entry', 't3.*', 't4.name as country_name', 't5.name as region_name','t7.permit_signatory as approved_by', 't7.approval_date', DB::raw("concat(decrypt(t8.first_name),' ',decrypt(t8.last_name)) as permit_approval, t9.name as suppler_name, t9.physical_address as suppler_address, t10.name as supplier_country, t11.name as supplier_region, t9.postal_address as supplier_postal_address, t12.name as mode_of_transport"))
						->where('t1.application_code',$application_code)->first();

						$sub_module_id = $record->sub_module_id;
						$permit_title = $record->permit_title;
						$action_title = $record->action_title;
						if($record->approval_date != ''){
								$approval_date = $record->approval_date;
						}
						
						// add a page
										$pdf->SetLineWidth(0.4);
										//$pdf->Rect(3,3,204,290);
										$pdf->SetLineWidth(1.2);
										//$pdf->Rect(5,5,200,285);
										$pdf->SetLineWidth(0.4);
									//	$pdf->Rect(7,7,195,280);
										$pdf->setMargins(20,25,20,true);
										$template_url = base_path('/');
										$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
										// import page 1
										$tplId = $pdf->importPage(1);	
									
										// use the imported page and place it at point 10,10 with a width of 100 mm
										$pdf->useTemplate($tplId,0,0);
										$pdf->setPageMark();
						$data = array('user_id'=>'', 
									'application_id'=>$record->id,
									'application_code'=>$application_code,
									'reference_no'=>$record->reference_no,
									'table_name'=>'tra_importexport_applications', 
									'application_type'=>$record->module_id, 
									'document_type'=>$document_type_id, 
									'section_id'=>$record->section_id, 
									'printed_on'=>Carbon::now(),
									'printed_by'=>''
								);
								funcReportGenerationLog($data,'');
											$params = array(
											'application_code' => $application_code,
											'app_code' => $application_code,
											'permit_watermark' => $permit_watermark,
											'document_type' => 'permit',
											'inc_header' => 1,
											'base_Url' => $this->base_url,
											'sign_Url' => $this->sign_url
										);
														
					$style = array(
												'border' => 0,
												'vpadding' => 'auto',
												'hpadding' => 'auto',
												'fgcolor' => array(0,0,0),
												'bgcolor' => false, //array(255,255,255)
												'module_width' => 1, // width of a single module in points
												'module_height' => 1 // height of a single module in points
										);
					$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
					
					$pdf->setMargins(20,25,20,true);
					$pdf->SetFont('times','I',9);
					
					$pdf->Cell(0,5,'', 0,1,'R');
										$logo = getcwd() . '/resources/images/zamra-logo.png';
										$pdf->ln();
										$pdf->Image($logo,90,15,34,30);
										$pdf->SetFont('times','B',14);
										$pdf->ln();
										
										
										$pdf->ln();
										$pdf->Cell(0,5,'ZAMBIA MEDICINES REGULATORY AUTHORITY', 0,1,'C');
					$pdf->SetFont('times','',11);
					$pdf->Cell(0,5,'Date          : '.formatDaterpt($approval_date), 0,1,'R');
					$pdf->Cell(0,5,'Reference No  : '.$record->tracking_no, 0,1,'R');
					$pdf->Cell(0,5,'Certificate No: '.$permit_no, 0,1,'R');
					
					$pdf->SetFont('times','B',15);
					$pdf->ln();
					$pdf->Cell(0,8,'TO WHOM IT MAY CONCERN', 0,1,'C');
					$pdf->Cell(0,8,'IMPORT AUTHORISATION', 0,1,'C');
					$pdf->ln();
					
					$pdf->SetFont('times','',11);
					$pdf->setCellHeightRatio(2.2);	
					$pdf->WriteHTML("Authority is hereby granted to <b>".$record->applicant_name."</b> to import the following medicines from <b>".$record->suppler_name.", ".$record->suppler_address.", ". $record->supplier_region.", ".$record->supplier_country.":</b>", true, 0, true, true,'');
					$pdf->ln();
					$prod_rec = DB::table('tra_permits_products as t1')
									->leftJoin('tra_product_information as t2', 't1.product_id', 't2.id')
									->leftJoin('par_dosage_forms as t3', 't1.dosage_form_id', 't3.id')
									->leftJoin('par_controlled_drugssubstances as t7', 't1.controlled_drugssubstances_id', 't7.id')
									->leftJoin('par_controlleddrugs_basesalts as t8', 't1.controlleddrugs_basesalt_id', 't8.id')
									->leftJoin('par_drugspackaging_types as t9', 't1.drugspackaging_type_id', 't9.id')
									->leftJoin('par_gramsbasesiunits_configs as t10', 't1.gramsbasesiunit_id', 't10.id')
									->leftJoin('par_controlleddrug_baseunits as t11', 't1.controlleddrug_baseunit_id', 't11.id')
									->leftJoin('par_si_units as t6', 't1.unitpack_unit_id', 't6.id')
									->select('t1.*','t9.name as packaging_unit','t1.product_strength','t7.name as drug_name', 't3.name as dosage_form', 't10.name as gramsbasesiunit','t6.name as pack_units', 't1.unitpack_size','t8.name as base_salt', 't11.name as controlleddrug_baseunit')
									->where(array('application_code'=>$record->application_code))
									->get();
					if($prod_rec){
						
						$pdf->SetFont('times','B',10);
						
					$pdf->setCellHeightRatio(1.3);
						$pdf->MultiCell(10,15,'No.',1,'',0,0);
						$pdf->MultiCell(70,15,'Name of Substance or Preparation',1,'',0,0);
						$pdf->MultiCell(45,15,'Quantity of Substance or Preparation',1,'',0,0);
						$pdf->MultiCell(0,15,'Total Quantity of the controlled Substance content',1,'',0,1);
						$pdf->SetFont('times','',10);
						$i=1;
					$pdf->setCellHeightRatio(1.3);
					
						foreach($prod_rec as $rec){
							
							//$product_details = strtoupper($rec->conversion_unit.' X '.$rec->quantity.' '. $rec->drug_name.' '.$rec->base_salt.' '.$rec->product_strength.' '.$rec->gramsbasesiunit.' '.$rec->packaging_unit.' '.$rec->dosage_form.' EQUIVALENT TO '.$rec->strength_asgrams.' GRAMS BASE.'); gramsbasesiunit_id
							$controlleddrug_baseunit = 'grams';
							if(validateIsNumeric($rec->controlleddrug_baseunit_id)){
								$controlleddrug_baseunit = $rec->controlleddrug_baseunit;
								
							}
							$product_details = strtoupper($rec->permitbrand_name.' '.$rec->dosage_form.' '.$rec->pack_unit.' '.$rec->pack_units.' '.$rec->packaging_unit.' containing '.$rec->product_strength.$rec->gramsbasesiunit.' of '.$rec->drug_name.' '.$rec->base_salt);
							
							$product_quantity = $rec->product_strength.$rec->gramsbasesiunit." X ".$rec->quantity.' '.$rec->packaging_unit;
							$controlleddrug_base = $rec->controlleddrug_base;
							$rowcount = max(PDF::getNumLines($product_details, 70),PDF::getNumLines($product_quantity, 45));
											
							$pdf->MultiCell(10,5*$rowcount,$i,1,'',0,0);
							$pdf->MultiCell(70,5*$rowcount,$product_details,1,'',0,0);
							$pdf->MultiCell(45,5*$rowcount,$product_quantity,1,'C',0,0);
							$pdf->MultiCell(0,5*$rowcount,$controlleddrug_base.' '.$controlleddrug_baseunit,1,'C',0,1);
							$i++;
							
						}
						
					}
					$pdf->setCellHeightRatio(2.5);	
					$pdf->WriteHTML("The importer is a licensed pharmaceutical establishment located at <b>".$record->physical_address.", ".$record->region_name.", ".$record->country_name, true, 0, true, true,'');
					
					
					$pdf->WriteHTML("This import authorisation is valid for one shipment only and expires on ".formatDaterpt($expiry_date), true, 0, true, true,'');
					$pdf->SetFont('times','B',10);
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
					$pdf->Image($signature,$startX+4,$startY-8,30,12);
								
					$pdf->Cell(0,7,'...............................................................', 0,1);
					
										
					$title = "Director-General";
					if($dg_signatory != $approved_by){
							$title = 'Acting '.$title;
					}else{
						if($is_acting_director ==1){
							$title = 'Acting '.$title;
						}
											
					}
										
					$pdf->Cell(85,7,$permit_approval, 0,1);
					$pdf->Cell(85,7,$title, 0,0);
					
	}
	function returnDangerousGoodPermitsLic($pdf,$title, $form_name,$form_no,$approvalGrant,$application_code ){
			$document_type_id = 25;
		$document_requirement_id = 254;
		$permit_watermark = '';
				$permit_no = $approvalGrant->permit_no;
				$expiry_date = $approvalGrant->expiry_date;
				$approval_date = $approvalGrant->approval_date;
				$record = DB::table('tra_importexport_applications as t1')
						->join('sub_modules as t2','t1.sub_module_id','t2.id')
						->leftJoin('wb_trader_account as t3','t1.applicant_id', 't3.id')
						->join('par_countries as t4', 't3.country_id', 't4.id')
						->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
						->leftJoin('par_ports_information as t6', 't1.port_id', 't6.id')
						->leftJoin('tra_permitsrelease_recommendation as t7', 't1.application_code', 't7.application_code')
						->leftJoin('users as t8', 't7.permit_signatory', 't8.id')
						->leftJoin('tra_permitsenderreceiver_data as t9','t1.sender_receiver_id', 't9.id')
						->leftJoin('par_countries as t10', 't9.country_id', 't10.id')
						->leftJoin('par_regions as t11', 't9.region_id', 't11.id')
						->leftJoin('par_modesof_transport as t12', 't1.mode_oftransport_id', 't12.id')
						->select('t2.title','t2.title as permit_title', 't1.sub_module_id', 't1.*','t3.name as applicant_name','t2.action_title','t6.name as port_entry', 't3.*', 't4.name as country_name', 't5.name as region_name','t7.permit_signatory as approved_by', 't7.approval_date', DB::raw("concat(decrypt(t8.first_name),' ',decrypt(t8.last_name)) as permit_approval, t9.name as suppler_name, t9.physical_address as suppler_address, t10.name as supplier_country, t11.name as supplier_region, t9.postal_address as supplier_postal_address, t12.name as mode_of_transport"))
						->where('t1.application_code',$application_code)->first();

						$sub_module_id = $record->sub_module_id;
						$permit_title = $record->permit_title;
						$action_title = $record->action_title;
						if($record->approval_date != ''){
								$approval_date = $record->approval_date;
						}
						
						$data = array('user_id'=>'', 
									'application_id'=>$record->id,
									'application_code'=>$application_code,
									'reference_no'=>$record->reference_no,
									'table_name'=>'tra_importexport_applications', 
									'application_type'=>$record->module_id, 
									'document_type'=>$document_type_id, 
									'section_id'=>$record->section_id, 
									'printed_on'=>Carbon::now(),
									'printed_by'=>''
								);
								funcReportGenerationLog($data,'');
											$params = array(
											'application_code' => $application_code,
											'app_code' => $application_code,
											'permit_watermark' => $permit_watermark,
											'document_type' => 'permit',
											'inc_header' => 1,
											'base_Url' => $this->base_url,
											'sign_Url' => $this->sign_url
										);
														
					$style = array(
												'border' => 0,
												'vpadding' => 'auto',
												'hpadding' => 'auto',
												'fgcolor' => array(0,0,0),
												'bgcolor' => false, //array(255,255,255)
												'module_width' => 1, // width of a single module in points
												'module_height' => 1 // height of a single module in points
										);
					$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
					
					$pdf->setMargins(20,25,20,true);
					$pdf->SetFont('times','I',9);
					$pdf->Cell(0,5,$form_name, 0,1,'R');
					$pdf->Cell(0,5,$form_no, 0,1,'R');
					$logo = getcwd() . '/resources/images/court_of_arms.png';
					
					$pdf->Image($logo,90,15,34,30);
					$pdf->SetFont('times','B',14);
					
					$pdf->Cell(0,5,'REPUBLIC OF ZAMBIA', 0,1,'C');	
					
					$pdf->SetFont('times','',10);			
										
					$pdf->Cell(0,5,'Reference No  : '.$record->tracking_no, 0,1,'R');
					$pdf->Cell(0,5,'Certificate No: '.$permit_no, 0,1,'R');
					$pdf->Cell(0,5,'Date          : '.formatDaterpt($approval_date), 0,1,'R');
					$pdf->SetFont('times','',11);
					$pdf->Cell(0,7,'THE DANGEROUS DRUGS ACT', 0,1,'C');
					$pdf->SetFont('times','',10);
					$pdf->Cell(0,7,'(LAWS VOL. VII CAP.95)', 0,1,'C');
					$pdf->SetFont('times','B',14);
				
					$pdf->Cell(0,6,$title, 0,1,'C');
					
					$pdf->SetFont('times','',11);
					$pdf->setCellHeightRatio(2);	
					$pdf->WriteHTML("I hereby certify that the Minister of Health, being the Minister charged with the administration of the law relating to the dangerous drugs to which the Single Convention on Narcotic Drugs 1961 applies, has approved the importation by" , true, 0, true, true,'');
					$pdf->SetFont('times','B',11);
					if($record->physical_address)
					$applicant_data = $record->applicant_name.','.$record->physical_address. $record->region_name.', '.$record->country_name;
					
					$pdf->MultiCell(0,7,$applicant_data,0,'C',0,1);
					$supplier_data = $record->suppler_name.','.$record->suppler_address. ', '.$record->supplier_region.', '.$record->supplier_country;
					
					$prod_rec = DB::table('tra_permits_products as t1')
									->leftJoin('tra_product_information as t2', 't1.product_id', 't2.id')
									->leftJoin('par_dosage_forms as t3', 't1.dosage_form_id', 't3.id')
									->leftJoin('par_controlled_drugssubstances as t7', 't1.controlled_drugssubstances_id', 't7.id')
									->leftJoin('par_controlleddrugs_basesalts as t8', 't1.controlleddrugs_basesalt_id', 't8.id')
									->leftJoin('par_drugspackaging_types as t9', 't1.drugspackaging_type_id', 't9.id')
									->leftJoin('par_gramsbasesiunits_configs as t10', 't1.gramsbasesiunit_id', 't10.id')
									->leftJoin('par_si_units as t6', 't1.unitpack_unit_id', 't6.id')
									->select('t1.*','t9.name as packaging_unit','t1.product_strength','t7.name as drug_name', 't3.name as dosage_form', 't10.name as gramsbasesiunit', 't1.unitpack_size','t8.name as base_salt' )
									->where(array('application_code'=>$record->application_code))
									->get();
					if($prod_rec){
						foreach($prod_rec as $rec){
							$product_details = strtoupper($rec->quantity.' X '. $rec->permitbrand_name.' '.  $rec->drug_name.' '.$rec->base_salt.' '.$rec->product_strength).' '.$rec->gramsbasesiunit.' '.strtoupper($rec->packaging_unit.' '.$rec->dosage_form.' EQUIVALENT TO '.$rec->controlleddrug_base.' GRAMS BASE.');
							$pdf->MultiCell(0,7,$product_details,0,'',0,1);
							
						}
						
						
					}
					
							$pdf->MultiCell(0,7,'from '.$supplier_data,0,'C',0,1);
						$pdf->SetFont('times','',10);
					$pdf->Cell(0,7,'Subject to the conditions that –', 0,1,'');
					$pdf->Cell(15);
					$pdf->Cell(0,7,"(i)  the consignment shall be imported before ".formatDaterpt($expiry_date)."; and", 0,1,'');
					$pdf->Cell(15);
					$pdf->Cell(0,7,"(ii) the consignment shall be imported by ".$record->mode_of_transport." via: ".$record->port_entry, 0,1,'');
                                               
					$pdf->MultiCell(0,7,"And hereby grants to the aforementioned importer a licence to import the drugs specified herein, subject to the conditions stated overleaf.\n",0,'J',0,1);
					$pdf->Cell(0,7,'Signed on behalf of the Minister of Health', 0,1,'C');
					$pdf->ln();
					$pdf->SetFont('times','B',10);
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
					
					$pdf->Image($signature,$startX+65,$startY-8,30,12);
									
					$title = "Director-General";
					if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
					}else{
						if($is_acting_director ==1){
							$title = 'Acting '.$title;
						}
											
					}
					
					$pdf->SetFont('times','',10);
					$pdf->ln();
					$pdf->Cell(120,5,'MINISTRY OF HEALTH', 0,0,'');
					$pdf->Cell(0,5,$permit_approval, 0,1,'');
					    
					$pdf->Cell(120,5,'P O Box 30205', 0,0,'');
					$pdf->Cell(0,5,$title, 0,1,'');
					$pdf->Cell(120,5,'LUSAKA, ', 0,0,'');
					
					$pdf->Cell(0,5,'for/Permanent Secretary', 0,1,'');
					$pdf->Cell(120,5,'ZAMBIA', 0,0,'');
					
					$pdf->Cell(0,5,'Ministry of Health', 0,1,'');
					
		
	}
	public function generateImportExportPermit($application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null)
    {
    	
		$document_type_id = 25;
		$document_requirement_id = 254;
		
        $permit_watermark = '';//$request->input('permit_watermark');
       $payment_recordcheck = DB::table('tra_payments')->where('application_code',$application_code)->first();
		
		
        $approvalGrant = DB::table('tra_managerpermits_review')->where('application_code',$application_code)->first();
        
        
        if(!empty($approvalGrant) && $approvalGrant->decision_id == 1){
			//getPermitSignatory()
								$permit_no = $approvalGrant->permit_no;
								$expiry_date = $approvalGrant->expiry_date;
								$approval_date = $approvalGrant->approval_date;
								$record = DB::table('tra_importexport_applications as t1')
											->join('sub_modules as t2','t1.sub_module_id','t2.id')
											->leftJoin('wb_trader_account as t3','t1.applicant_id', 't3.id')
											->leftJoin('par_countries as t4', 't3.country_id', 't4.id')
											->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
											->leftJoin('par_ports_information as t6', 't1.port_id', 't6.id')
											->leftJoin('tra_permitsrelease_recommendation as t7', 't1.application_code', 't7.application_code')
											->leftJoin('users as t8', 't7.permit_signatory', 't8.id')
											->leftJoin('reg_importexport_registry as t9', 't1.reg_importexport_id', 't9.id')
											->leftJoin('tra_consignee_data as t10', 't1.consignee_id', 't10.id')
											->select('t2.title','t2.title as permit_title', 't9.app_sub_module_id', 't1.*','t3.name as applicant_name','t2.action_title','t6.name as port_entry', 't3.*', 't4.name as country_name', 't5.name as region_name','t7.permit_signatory as approved_by', 't7.approval_date','t10.name as consignee_name', 't1.consignee_id', DB::raw("concat(decrypt(t8.first_name),' ',decrypt(t8.last_name)) as permit_approval"))
											->where('t1.application_code',$application_code)->first();


											$process_id = $record->process_id;
											$sub_module_id = $record->app_sub_module_id;
											$permit_title = $record->permit_title;
											$action_title = $record->action_title;
											$consignee_id = $record->consignee_id;
											if($record->approval_date != ''){
												$approval_date = $record->approval_date;
											}
											if($process_id == 141){
													if (strpos($permit_no, '/A') === false) {
														$permit_no = $permit_no.'/A1';
													}
											}
								if($sub_module_id == 13 || $sub_module_id == 16){
									$impexp_title = ucwords(strtolower('import')).'ing';
								}
								else{
									$impexp_title = ucwords(strtolower('export')).'ing';
								}
								$data = array('user_id'=>'', 
									'application_id'=>$record->id,
									'application_code'=>$application_code,
									'reference_no'=>$record->reference_no,
									'table_name'=>'tra_importexport_applications', 
									'application_type'=>$record->module_id, 
									'document_type'=>$document_type_id, 
									'section_id'=>$record->section_id, 
									'printed_on'=>Carbon::now(),
									'printed_by'=>''
								);
								funcReportGenerationLog($data,'');
											$params = array(
											'application_code' => $application_code,
											'app_code' => $application_code,
											'permit_watermark' => $permit_watermark,
											'impexp_title' => $impexp_title,
											'document_type' => 'permit',
											'inc_header' => 1,
											'base_Url' => $this->base_url,
											'sign_Url' => $this->sign_url
										);
										$pdf = new PdfProvider();
										// add a page
										$pdf->AddPage();
										$pdf->SetLineWidth(0.4);
										//$pdf->Rect(3,3,204,290);
										$pdf->SetLineWidth(1.2);
										//$pdf->Rect(5,5,200,285);
										$pdf->SetLineWidth(0.4);
									//	$pdf->Rect(7,7,195,280);
										$pdf->setMargins(20,25,20,true);
										$template_url = base_path('/');
										$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
										// import page 1
										$tplId = $pdf->importPage(1);	
									
										// use the imported page and place it at point 10,10 with a width of 100 mm
										$pdf->useTemplate($tplId,0,0);
										$pdf->setPageMark();
										$pdf->SetFont('times','I',9);
										$pdf->Cell(0,5,'', 0,1,'R');
										$pdf->Cell(0,5,'', 0,1,'R');
										$logo = getcwd() . '/resources/images/zamra-logo.png';
										$pdf->ln();
										$pdf->Image($logo,90,15,34,30);
										$pdf->SetFont('times','B',14);
										$pdf->ln();
										$consignee_name = '</b>';
										if(validateIsNumeric($consignee_id)){
											$consignee_name = '</b> on behalf of <b>'.strtoupper($record->consignee_name).'</b>';
											
										}
										
										$pdf->ln();
										$pdf->Cell(0,5,'ZAMBIA MEDICINES REGULATORY AUTHORITY', 0,1,'C');	
										$style = array(
												'border' => 0,
												'vpadding' => 'auto',
												'hpadding' => 'auto',
												'fgcolor' => array(0,0,0),
												'bgcolor' => false, //array(255,255,255)
												'module_width' => 1, // width of a single module in points
												'module_height' => 1 // height of a single module in points
										);
										$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
										$pdf->SetFont('times','',10);
									
										$pdf->ln();
										$pdf->Cell(0,5,'Permit No: '.$permit_no, 0,1,'R');
										$pdf->ln();
										$pdf->ln();
										$pdf->SetFont('times','',12);
										$pdf->Cell(0,5,'The Medicines and Allied Substances', 0,1,'C');
										$pdf->Cell(0,5,'(Importation and Exportation) Regulations, 2017', 0,1,'C');
										$pdf->ln();
										$pdf->SetFont('times','B',13);
										$pdf->Cell(0,5,strtoupper($permit_title).'ATION PERMIT', 0,1,'C');
										$pdf->ln();
									
										$pdf->SetFont('times','',11);
										
										$pdf->WriteHTML("This is to certify the (Name of permit holder)<b> ".strtoupper($record->applicant_name)."</b> of (Physical Address) <b>".strtoupper($record->physical_address.", ".$record->postal_address.", ".$record->region_name.", ".$record->country_name).$consignee_name." is authorised to : " , true, 0, true, true,'');
											
										$pdf->SetFont('times','',10);
										$pdf->ln();
										$prod_rec = DB::table('tra_permits_products as t1')
																		->leftJoin('tra_product_information as t2', 't1.product_id', 't2.id')
																		->leftJoin('par_dosage_forms as t3', 't1.dosage_form_id', 't3.id')
																		->leftJoin('par_packaging_units as t4', 't1.packaging_unit_id', 't4.id')
																		->leftJoin('par_common_names as t5', 't1.common_name_id', 't5.id')
																		->leftJoin('par_si_units as t6', 't1.unitpack_unit_id', 't6.id')
																		->select('t1.*','t4.name as packaging_unit','t1.product_strength','t5.name as generic_name', 't2.brand_name', 't3.name as dosage_form', 't6.name as si_unit', 't1.unitpack_size')
																		->where(array('application_code'=>$record->application_code))
																		->get();
																		$pdf->SetFont('times','B',10);
										$pdf->MultiCell(15,10,'No.',1,'',0,0);
										$pdf->MultiCell(120,10,ucwords(strtolower($permit_title)).' the following *medicines(s) allied substance(s).',1,'',0,0);
										$pdf->MultiCell(0,10,'Quantity',1,'',0,1);
										$pdf->SetFont('times','',10);
										$prod_counter = $prod_rec->count();
										if($prod_counter >0){
											$i=1;
												foreach($prod_rec as $rec){
													if($rec->permitbrand_name != ''){
															$permit_brandname = $rec->permitbrand_name.' '.$rec->generic_name;
													}
													else{
														$permit_brandname = $rec->brand_name.' '.$rec->generic_name;

													}
													$product_desc = strtoupper($permit_brandname).' '.strtoupper($rec->dosage_form).' '.strtoupper($rec->product_strength);
													//$packaging = rtrim($rec->packaging_unit, "s");
													//$packaging = rtrim($packaging, "es");
													$product_desc = $product_desc.' '.$rec->unitpack_size.' '.$rec->si_unit;
													
													$packaging_data = number_format($rec->quantity).' '.$rec->packaging_unit;
													$rowcount = max(PDF::getNumLines($product_desc, 120),PDF::getNumLines($packaging_data, 40));
											
													$pdf->MultiCell(15,5*$rowcount,$i,1,'',0,0);
													$pdf->MultiCell(120,5*$rowcount,$product_desc,1,'',0,0);
													$pdf->MultiCell(0,5*$rowcount,$packaging_data,1,'C',0,1);
														if($i == 14 || ($i % 28) == 0){
															$pdf->AddPage();
															$pdf->ln();
														}
														$i++;
												}
											//	
												if($prod_counter < 8){
													$start = $prod_counter;
													$x_t = $pdf->GetX()+25; $y = $pdf->GetY();
													
													for($x = $prod_counter; $x <= 7; $x++ ){
														$pdf->MultiCell(15,10,$i,1,'',0,0);
														$pdf->MultiCell(120,10,'',1,'',0,0);
														$pdf->MultiCell(0,10,'',1,'',0,1);
		
															$i++;
													}
													$x_b = $pdf->GetX(); $y_b = $pdf->GetY();
													$pdf->Line($x_t, $y, $x_b+160, $y_b);

												}
										}
										else{
											$i=1;
											for($x = 1; $x <= 7; $x++ ){
												$pdf->MultiCell(15,10,$i,1,'',0,0);
												$pdf->MultiCell(120,10,'',1,'',0,0);
												$pdf->MultiCell(0,10,'',1,'',0,1);

													$i++;
											}
										}
									
										$pdf->MultiCell(0,8,'Port of  '.$action_title.' '.strtoupper($record->port_entry),0,'',0,1);
										$pdf->MultiCell(0,8,'This permit is valid until '.formatDaterpt($expiry_date),0,'',0,1);   
										$pdf->MultiCell(0,8,'Terms and conditions imporsed by the Zambia Medicines Regulatory Authority (refer to notes overleaf)',0,'',0,1); 
										$pdf->ln();
										//$pdf->ln();
											$pdf->SetFont('times','B',10);
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
								$pdf->Image($signature,$startX+25,$startY-8,30,12);
								
								$pdf->Cell(105,0,'',0,0);
								$pdf->Cell(0,0,formatDaterpt($approval_date),0,1, 'C');
										 $pdf->Cell(85,5,'...............................................................', 0,0,'C');
										 $pdf->Cell(20,5,'', 0,0,'C');
										 $pdf->Cell(0,5,'...............................................................', 0,1,'C');
										
										$title = "Director-General";
										if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
										}else{
											if($is_acting_director ==1){
												$title = 'Acting '.$title;
											}
											
										}
										
										
										 $pdf->Cell(85,5,$title, 0,0,'C');

										 $pdf->Cell(20,5,'', 0,0,'C');
										 $pdf->Cell(0,5,'Date of Issue', 0,1,'C');
										$pdf->AddPage();
$pdf->SetFont('times','B',11);
										$pdf->Cell(100,5,'TERMS AND CONDITIONS OF IMPORTATION/EXPORTATION PERMIT.', 0,1,'');
										//get the conditions 
										$pdf->SetFont('times','',11);
										$pdf->MultiCell(11,11,'1.',0,'',0,0); 
										$pdf->MultiCell(0,11,'This permit is not transferable or renewable.',0,'',0,1);
$pdf->MultiCell(11,11,'2.',0,'',0,0); 
										$pdf->MultiCell(0,11,'The holder of the permit shall produce the permit together with other approved or endorsed documents to an inspector and customers officer at the time of importation or exportation.',0,'',0,1);

$pdf->MultiCell(11,11,'3.',0,'',0,0); 
										$pdf->MultiCell(0,11,'Theholder of the permit shall keep records relating to the importation or exportation of medicines or allied substances and avail the records to an inspector for inspection.',0,'',0,1);

										$pdf->MultiCell(11,11,'4.',0,'',0,0); 
										$pdf->MultiCell(0,11,'Non-complaince with any of the terms and conditions of the permit shall result in suspension or revocation of the permit.',0,'',0,1);
										if($permit_previewoption =='preview'){
											$pdf->Output($record->applicant_name.' Permit.pdf');  
										}
										else{
											$pdf->Output($upload_directory, "F"); 
											
										//	return $pdf->Output('Permit.pdf','S'); 
;
										}
										 
										

		}else if($approvalGrant->decision_id== 2 || $approvalGrant->decision_id== 3){
			$approval_date = $approvalGrant->approval_date;
			$reason_forrejection = $approvalGrant->comment;
			$this->permitLetterofRejection($approval_date,$reason_forrejection,$application_code, $is_permitupdate, $permit_previewoption,$upload_directory=null);
			
		}else{
           echo "No approval recommendation, contact the system admin";
			
        }
        
    }
	function permitLetterofRejection($approval_date,$reason_forrejection,$application_code, $is_permitupdate, $permit_previewoption=null,$upload_directory=null){
		
		$document_type_id = 25;
		$document_requirement_id = 254;
		
			
								$record = DB::table('tra_importexport_applications as t1')
											->join('sub_modules as t2','t1.sub_module_id','t2.id')
											->leftJoin('wb_trader_account as t3','t1.applicant_id', 't3.id')
											->join('par_countries as t4', 't3.country_id', 't4.id')
											->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
											->leftJoin('par_ports_information as t6', 't1.port_id', 't6.id')
											->leftJoin('tra_permitsrelease_recommendation as t7', 't1.application_code', 't7.application_code')
											->leftJoin('users as t8', 't7.permit_signatory', 't8.id')
											->select('t2.title','t2.title as permit_title', 't1.sub_module_id', 't1.*','t3.name as applicant_name','t2.action_title','t6.name as port_entry', 't3.*', 't4.name as country_name', 't5.name as region_name','t7.permit_release_remarks', 't7.permit_signatory as approved_by', 't7.approval_date', DB::raw("concat(decrypt(t8.first_name),' ',decrypt(t8.last_name)) as permit_approval"))
											->where('t1.application_code',$application_code)->first();

											$sub_module_id = $record->sub_module_id;
											$permit_title = $record->permit_title;
											$action_title = $record->action_title;
											if($approval_date == ''){
												$approval_date = $record->approval_date;
											}
											
								if($sub_module_id == 13 || $sub_module_id == 16){
									$impexp_title = ucwords(strtolower('import')).'ing';
								}
								else{
									$impexp_title = ucwords(strtolower('export')).'ing';
								}
								$permit_no = $record->reference_no;
								$reason_forrejection = $record->permit_release_remarks;
								$data = array('user_id'=>'', 
									'application_id'=>$record->id,
									'application_code'=>$application_code,
									'reference_no'=>$record->reference_no,
									'table_name'=>'tra_importexport_applications', 
									'application_type'=>$record->module_id, 
									'document_type'=>$document_type_id,  
									'printed_on'=>Carbon::now(),
									'printed_by'=>''
								);
								funcReportGenerationLog($data,'');
										$params = array(
											'application_code' => $application_code,
											'app_code' => $application_code,
											'impexp_title' => $impexp_title,
											'document_type' => 'permit',
											'inc_header' => 1,
											//'base_Url' => $this->base_url,
											//'sign_Url' => $this->sign_url
										);
										$pdf = new PdfProvider();
										// add a page
										$pdf->AddPage();
										$pdf->SetLineWidth(0.4);
										//$pdf->Rect(3,3,204,290);
										$pdf->SetLineWidth(1.2);
										//$pdf->Rect(5,5,200,285);
										$pdf->SetLineWidth(0.4);
									//	$pdf->Rect(7,7,195,280);
										$pdf->setMargins(20,25,20,true);
										$template_url = base_path('/');
										$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
										// import page 1
										$tplId = $pdf->importPage(1);	
										
										$pdf->SetFont('times','',10);
										// use the imported page and place it at point 10,10 with a width of 100 mm
										$pdf->useTemplate($tplId,0,0);
										$pdf->setPageMark();
										$pdf->SetFont('times','I',9);
										$pdf->Cell(0,5,'', 0,1,'R');
										$pdf->Cell(0,5,'', 0,1,'R');
										$logo = getcwd() . '/resources/images/zamra-logo.png';
										$pdf->ln();
										$pdf->ln();
										$pdf->ln();
										$pdf->Image($logo,90,10,35,30);$style = array(
												'border' => 0,
												'vpadding' => 'auto',
												'hpadding' => 'auto',
												'fgcolor' => array(0,0,0),
												'bgcolor' => false, //array(255,255,255)
												'module_width' => 1, // width of a single module in points
												'module_height' => 1 // height of a single module in points
										);
										$pdf->write2DBarcode(strtoupper($record->applicant_name).':'.$application_code.':'.$permit_no, 'QRCODE,H',170, 18, 20, 20, $style, 'N');
										
										$pdf->SetFont('times','B',14);
										$pdf->ln();
										$pdf->ln(5);
										$pdf->ln();
										$pdf->Cell(0,5,'ZAMBIA MEDICINES REGULATORY AUTHORITY', 0,1,'C');	
										
									
										$pdf->ln();
										$pdf->ln();
										$pdf->SetFont('times','',12);
										$pdf->Cell(0,5,'The Medicines and Allied Substances Act, 2013', 0,1,'C');
										$pdf->Cell(0,5,'(Act No. 3 or 2013)', 0,1,'C');
										
										$pdf->ln();
										$pdf->Cell(0,5,'The Medicines and Allied Substances(Importation and Exportation) Regulations, 2017', 0,1,'C');
										$pdf->ln();
										$pdf->SetFont('times','B',13);
										$pdf->Cell(0,5,'NOTICE OF REJECTION OF APPLICATION', 0,1,'C');
										$pdf->ln();
										$pdf->SetFont('times','',11);
										$pdf->WriteHTML("To<b> ".strtoupper($record->applicant_name)."</b> of (Physical Address) <b>".strtoupper($record->physical_address.", ".$record->postal_address.", ".$record->region_name.", ".$record->country_name)."</b>." , true, 0, true, true,'J');
										
											$pdf->ln();
										$pdf->Cell(0,5,'In the matter of Permit No. '.$permit_no, 0,1,'');
										$pdf->ln();
										$pdf->WriteHTML("You are hereby notified that your application for <b> ".($record->permit_title)."</b> has been rejected by the Authority on the following grounds:" , true, 0, true, true,'J');
										$pdf->ln();
										$pdf->Cell(15,0,'',0,0);$pdf->WriteHTML("(a) ".$reason_forrejection , true, 0, true, true,'');
										$pdf->ln();
										$pdf->ln();
										
										$pdf->SetFont('times','',11);
										
										$pdf->Cell(0,0,'Dated this '.formatDaterpt($approval_date),0,1, '');
										$pdf->ln();
										 $pdf->Cell(20,5,'', 0,0,'C');
										
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
										$title = "Director-General";
										if($dg_signatory != $approved_by){
											$title = 'Acting '.$title;
										}else{
											if($is_acting_director ==1){
												$title = 'Acting '.$title;
											}
											
										}
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
										$pdf->Image($signature,$startX+45,$startY-2,30,12);
								
										$pdf->ln();
										$pdf->ln();
										 $pdf->Cell(0,5,'...............................................................', 0,1,'C');
										 
										$pdf->SetFont('times','B',10);
										$pdf->ln();
										 $pdf->Cell(0,5,$title, 0,0,'C');
										if($permit_previewoption =='preview'){
											$pdf->Output($record->applicant_name.' Letter of Rejection.pdf');  
										}
										else{
											$pdf->Output($upload_directory, "F"); 
										}
		
		
	}
	public function printClinicalTrialCertificate($application_id,$application_code)
    {
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
								->leftJoin('par_regions as t10', 't3.region_id', '=', 't10.id')
								->leftJoin('par_regions as t11', 't3.country_id', '=', 't11.id')
								->leftJoin('tra_clinicalstudy_participants as t9', 't2.id', '=', 't9.application_id')
								->select(DB::raw("t2.*,t2.id as previous_id,t6.approved_by, t6.permit_no,t3.name as applicant_name,t4.name as sponsor,t5.name as investigator,t10.name as applicant_region, t11.name as applicant_country,
                    t3.id as applicant_id, t3.name as applicant_name, t3.contact_person, t2.reference_no,t2.*,t6.expiry_date as regexpiry_date,t6.certificate_issue_date as regcertificate_issue_date, t6.certificate_no as registration_no,t7.name as sponsor_country, t7.name as sponsor_region,
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
													
							$pdf->SetFont('times','B',13);
							$pdf->Cell(0,23,'',0,1);
						
							$pdf->Cell(0,7,$org_info->org_name,0,1,'C');
							$pdf->Cell(0,7,'The Medicines and Allied Substances Act, 2013',0,1,'C');
																								
							$pdf->SetFont('times','B',12);
							$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');		
							$data = '{"tracking_no":'.$record->reference_no.',"module_id":'.$record->module_id.',"application_code":'.$record->application_code.'}';

							$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
																					// QRCODE,H : QR-CODE Best error correction name
							$pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);
							$pdf->SetFont('times','',12);
																	
							
							$pdf->Cell(0,8,'To:',0,1);
							$pdf->Cell(0,8,$record->applicant_name.',',0,1);
							if($record->app_physical_address != ''){
								$pdf->Cell(0,8,$record->app_physical_address.',',0,1);

							}		
							if($record->app_physical_address !=  $record->app_postal_address){
								
									$pdf->Cell(0,8,$record->app_postal_address.',',0,1);
							}
							$pdf->Cell(0,8,$record->applicant_region." ".$record->applicant_country,0,1);
							$pdf->Cell(0,8,'Email: '.$record->app_email,0,1);
							$pdf->Cell(0,8,'Phone: '.$record->app_telephone,0,1);
							$ref = "RE:	APPLICATION FOR AUTHORISATION OF CLINICAL TRIAL: ".strtoupper($record->study_title);
							
							
							$pdf->SetFont('times','',11);
							$pdf->Cell(0,8,'Dear Sir/Madam,',0,1);	
							$pdf->MultiCell(0,6,$ref,0,'','',1);
							$pdf->Ln();
							$template = "Reference is made to your application to conduct the above stated clinical trial.";
							$pdf->WriteHTML($template, true, false, true, true, 'J');
							
							$template = "We wish to advise that we have completed our review of the submission and are pleased to inform you that the Zambia Medicines Regulatory Authority (ZAMRA) considered the additional information and the corresponding evaluation report and based on the submitted information, approved the conduct of the above-mentioned study with protocol version ".$record->version_no." as indicated below:";
							$pdf->WriteHTML($template, true, false, true, true, 'J');
							$pdf->Ln();
							$pdf->SetFont('times','B',11);
							$pdf->MultiCell(10,7,'No.',1,'','',0);
							$pdf->MultiCell(75,7,'Name of Clinical Trial',1,'','',0);
							$pdf->MultiCell(55,7,'ZAMRA Clinical Trial No.',1,'','',0);
							$pdf->MultiCell(0,7,'Protocol version',1,'','',1);
							$protocol_details = $record->protocol_no.' '.$record->version_no.' '.formatDaterpt($record->date_of_protocol);
							
							$pdf->SetFont('times','',11);
							$rowcount = max(PDF::getNumLines($record->study_title, 75),PDF::getNumLines($protocol_details, 40),PDF::getNumLines($record->registration_no, 55));
							
							
							$pdf->MultiCell(10,6*$rowcount,'1',1,'','',0);
							$pdf->MultiCell(75,6*$rowcount,$record->study_title,1,'','',0);
							$pdf->MultiCell(55,6*$rowcount,$record->registration_no,1,'','',0);
							$pdf->MultiCell(0,6*$rowcount,$protocol_details,1,'','',1);
							$pdf->Ln();
							$template = "We wish to advise that you are required to provide periodic updates on the study and report any adverse events that may occur during the study. Furthermore, ZAMRA will carry out clinical site inspections as may be deemed necessary. ";
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
																	
							$approved_by = $record->approved_by;
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
        
						}
						else{
								$pdf->SetFont('times','B',12);
								$pdf->Cell(0,5,'No Record Found',0,1);
						
						}
							 $pdf->Output('Clinical trial Approval Letter '.date('Y').date('m').date('d').date('i').date('s').'.pdf','I');
						
        }else{
					$this->generateLetterOfREjection($application_code,$req,$module_id);
        }
        
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
																	$reason_for_rejection = $app_data->reason_for_rejection;
																	if($reason_for_rejection == ''){
																		$data = DB::connection('portal_db')->table('wb_rejection_remarks')->where('application_code',$application_code)->first();
																		$reason_for_rejection = $data->remark;
																		$pdf->setCellHeightRatio(2);
																		$pdf->WriteHTML($template, true, false, true, true);
																		$pdf->WriteHTML($reason_for_rejection, true, false, true, true);
																		$pdf->SetFont('times','B',12);
																	}else{
																		
																		$pdf->setCellHeightRatio(2);
																		$pdf->WriteHTML($template, true, false, true, true);
																		$pdf->WriteHTML($reason_for_rejection, true, false, true, true);
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
																	}
																	
																	
																			$pdf->Output('Letter of Rejection '.$application_no.'.pdf');
																			
																}catch (\Exception $exception) {
																	$res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
											
															} catch (\Throwable $throwable) {
																	$res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
															}
															return response()->json($res);									
																	
}
public function printPromotionalRegCertificate($req){
	try{
		$org_info = $this->getOrganisationInfo();
				
		$application_code = $req->application_code;
								$logo=getcwd().'/assets/images/logo.jpg';
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
								$pdf->Cell(0,4,'DMS/7/9/22/PR/155',0,1,'R');
								$pdf->Cell(0,4,'',0,1,'R');
								$pdf->SetFont('times','B',13);
								$pdf->Cell(0,15,'',0,1);
								$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
								$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');
									
								
								$records = DB::table('tra_promotion_adverts_applications as t1')
														->leftJoin('par_system_statuses as q', 't1.application_status_id', '=', 'q.id')
														->leftJoin('tra_approval_recommendations as t2','t1.application_code', 't2.application_code')
														->join('wb_trader_account as t3', 't1.applicant_id', 't3.id')
														->leftJoin('par_countries as t4', 't3.country_id', 't4.id')
														->leftJoin('par_regions as t5', 't3.region_id', 't5.id')
														->leftJoin('par_sections as t6', 't1.section_id', 't6.id')
														->leftJoin('par_advertisement_types as t7', 't1.advertisement_type_id', 't7.id')
														->select(DB::raw("t2.decision_id as recommendation_id, t1.*, t3.name as applicant_name,t7.target_group, t3.physical_address,t3.email as email_address, t3.postal_address, t4.name as country_name, t5.name as region_name,t6.name as section_name, t1.id as application_id, t2.expiry_date, t2.approval_date, t2.approved_by"))
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
								
									$pdf->SetFont('','',11);
										$pdf->Cell(0,10,'',0,1);
										$pdf->Cell(60,5,'Ref.:'.$ref,0,0);
										$pdf->Cell(0,5,'Date.:'.formatDaterpt($row->approval_date),0,1,'R');
										
										$pdf->Cell(0,5,$applicant_name,0,1);
										$pdf->Cell(7,5,'',0,0);
										$pdf->Cell(0,5,$physical_address,0,1);
										$pdf->Cell(7,5,'',0,0);
										$pdf->Cell(0,5,$postal_address,0,1);
										$pdf->Cell(7,5,'',0,0);
										$pdf->Cell(0,5,$row->region_name.','.$row->country_name,0,1);
										$pdf->Cell(0,5,$row->email_address,0,1);
										//local agent
										$pdf->ln();
										
										$pdf->Cell(0,5,'Dear Sir/Madam,',0,1);
										$pdf->SetLineWidth(3);
											$pdf->SetFont('','B',11);
											if($recommendation_id == 1){
												
												$pdf->Cell(7,7,'RE: APPLICATION FOR FOR PROMOTIONAL MATERIAL',0,0);
											}
											else{
												$pdf->Cell(7,7,'RE: REFUSAL OF APPLICATION FOR PROMOTIONAL MATERIAL',0,0);
											
											}
											$pdf->SetFont('','',11);
											$pdf->ln();
											$payment_details = $this->getApplicationPaymentRemittance($application_code);
											if($payment_details){
												$pdf->MultiCell(0,5,"We acknowledge receipt of your application for advertising authorisation for ".$ref." and the total sum of Zambian Kwacha ".formatMoney($payment_details->amount_paid)." Only (ZMK ".$payment_details->amount_paid.") as per our receipt number ".$payment_details->receipt_no." dated ".formatDaterpt($payment_details->trans_date)." as advertisement fees.".".\n" ,0, 'J', 0, 1, '', '', true);
											}
											else{
												
												$pdf->MultiCell(0,5,"We acknowledge receipt of your application for advertising authorisation for ".$ref.".\n" ,0, 'J', 0, 1, '', '', true);
											}
											

											$pdf->MultiCell(0,5,"We further acknowledge receipt of the proposed promotional information submitted in support of your application to promote product(s) listed in the table below:"."\n" ,0, 'J', 0, 1, '', '', true);
											
											
											$pdf->Cell(7,5,'',0,1);
										$material_rec =	DB::table('tra_promotion_materials_details as t1')
			 
												->join('par_promotion_material_items  as t2','t1.material_id','=','t2.id')
												->select(DB::raw("group_concat(concat(t2.name) separator ' / ') as promotion_material")) 
												->where('t1.application_id',$application_id)
												->first();
										
											
											
											PDF::Cell(7,5,'',0,1);
											
											$adverttype_rec =DB::table('tra_promotion_prod_particulars as t1')
													->leftJoin('par_common_names as t2','t1.common_name_id','=','t2.id')
												
													->leftJoin('par_advertisement_types as t5','t1.type_of_advertisement_id','=','t5.id')
													->select(DB::raw('t1.*,CONCAT_WS(" - ",t5.name,t1.other_details) as type_of_advertisement, t2.name as common_name'))
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
											$pdf->writeHTML($tbl, true, false, false, false, '');
											 
									if($recommendation_id == 1){
										//the data 
											
											$pdf->MultiCell(0,5,'The Authority has completed the review of the submitted information and approved implementation of the advertisement. You may therefore proceed to advertise and promote the product to '.$row->target_group.".\n" ,0, 'J', 0, 1, '', '', true);
											
											PDF::Cell(7,5,'',0,1);
											
									}
									else{
											$pdf->MultiCell(0,5,"3.	The advert has not been approved due to the following reason(s):-.\n" ,0, 'J', 0, 1, '', '', true);
											$pdf->Cell(7,5,'',0,1);
											$pdf->MultiCell(0,5,"4.	Note that the material should neither be imported nor used in the country for promotional purposes.\n" ,0, 'J', 0, 1, '', '', true);
											
									}
									
									$pdf->Cell(0,5,'Should you have any questions, please do not hesitate to contact the undersigned.',0,1);
									$pdf->ln();
															
									$pdf->Cell(0,8,'for/Zambia Medicines Regulatory Authority,',0,1);
									$pdf->ln();
									$pdf->ln();
									$startY = $pdf->GetY();
									$startX =$pdf->GetX();
									$director_details = getPermitSignatoryDetails();
									$dg_signatory = $director_details->director_id;
									$director = $director_details->director;
									$is_acting_director = $director_details->is_acting_director;
									$approved_by = $row->approved_by;
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
        			
								}
									$pdf->Output("Promotional Advertisement.pdf");
		
	
	
		
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
                            't2.brand_name','t3.name as applicant_name', 't3.physical_address', 't3a.name as country_name', 't3.email as applicant_email','t4.permit_signatory as approved_by', 't4.certificate_no','t4a.name as region_name','t4.expiry_date',
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
			$pdf->Cell(0,8,formatDaterpt($app_details->approval_date),0,1, 'R');
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
						$pdf->cell(0,7, 'Approval Date: '.formatDaterpt($app_details->approval_date), 0,1);
						$pdf->cell(0,7, 'Expiry Date: '.formatDaterpt($app_details->expiry_date), 0,1);
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
						
						$pdf->ln();
						//check if its on the second page 
						if ($pdf->PageNo() ==1) {
							
							$pdf->AddPage();
						}
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
                            't2.brand_name','t3.name as applicant_name', 't3.physical_address', 't3a.name as country_name', 't3.email as applicant_email','t4.permit_signatory as approved_by', 't4.certificate_no','t4a.name as region_name','t4.expiry_date',
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
			$pdf->Cell(0,13,'',0,1);
			$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
			$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');
																				
			$pdf->SetFont('times','B',11);
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
			$pdf->SetFont('times','',10);
																	//Letter heading 
			$pdf->Cell(0,6,'To:',0,1);
			$pdf->Cell(0,6,$app_details->applicant_name.',',0,1);
			if($app_details->physical_address != ''){
				$pdf->Cell(0,6,$app_details->physical_address.',',0,1);

			}		
			if($app_details->physical_address !=  $app_details->postal_address){
				
					$pdf->Cell(0,6,$app_details->postal_address.',',0,1);
			}
			$pdf->Cell(0,6,$app_details->region_name." ".$app_details->country_name,0,1);
											
			$pdf->Cell(0,6,'Dear Sir/Madam,',0,1);
					
			$pdf->SetFont('times','',10);
			
			$pdf->Cell(0,8,$title,0,1);
			
			$template = "Reference is made to ".$title_desc." for a pharmaceutical product you submitted in terms of Section 39 of the Medicines and Allied Substances Act (No. 3) of 2013.";						
						$pdf->WriteHTML($template, true, false, true, true, 'J');
						$pdf->ln();
							$pdf->SetFont('times','',10);
							$template = "We wish to advise that we have completed our review of the information and are pleased to inform you that the Zambia Medicines Regulatory Authority considered your product application and the corresponding evaluation reports and, based on the submitted information, <b>granted marketing authorisation</b> to the product below with the marketing authorisation number and category of distribution as indicated.\n";
								
								
						$pdf->WriteHTML($template, true, false, true, true, 'J');$pdf->ln();
						$pdf->SetFont('times','B',10);
						
						$pdf->cell(10,5, 'No.', 1,0);
						$pdf->cell(62,5, 'Name of Product.', 1,0);
						$pdf->cell(35,5, 'Application No.', 1,0);
						
						$pdf->cell(45,5, $product_category_title, 1,0);
						$pdf->cell(0,5, 'MA No.', 1,1);
						$pdf->SetFont('times','',10);
						
						
						$brand_name = $app_details->brand_name;
						
						
						if($prodclass_category_id == 3 or $prodclass_category_id == 5){
							$classification_name = $app_details->classification_name;
						
							//$pdf->MultiCell(45,12,$app_details->classification_name,1,'','',0);
						}
						else{
							
							$classification_name = $app_details->distribution_category;
						
						}
						$rowcount = max(PDF::getNumLines($brand_name, 60),PDF::getNumLines($application_no, 36),PDF::getNumLines($classification_name, 45));
						
						
						$pdf->MultiCell(10,4*$rowcount,'1',1,'','',0);
						$pdf->MultiCell(62,4*$rowcount,$brand_name,1,'','',0);
						$pdf->MultiCell(35,4*$rowcount,$application_no,1,'','',0);
						$pdf->MultiCell(45,4*$rowcount,$classification_name,1,'','',0);
						$pdf->MultiCell(0,4*$rowcount,$app_details->certificate_no,1,'','',1);
						
						/*$pdf->cell(0,7, $app_details->certificate_no, 1,1);
						$pdf->cell(45,7, $app_details->brand_name, 1,0);
						$pdf->cell(45,7,$application_no, 1,0);
						$pdf->cell(45,7, $app_details->distribution_category, 1,0);
						$pdf->cell(0,7, $app_details->certificate_no, 1,1);
					*/	
						$pdf->SetFont('times','',10);
						$pdf->cell(0,4, 'Approval Date: '.formatDaterpt($app_details->approval_date), 0,1);
						$pdf->cell(0,4, 'Expiry Date: '.formatDaterpt($app_details->expiry_date), 0,1);
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
	function printApplicationInvoice($request, $permit_previewoption,$upload_directory=null){
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
		 else{
			$invoice_record = DB::table('tra_application_invoices')->where('id',$invoice_id)->first();
			if($invoice_record){
					$module_id = $invoice_record->module_id;
					$application_id = $invoice_record->application_id;
					$application_code = $invoice_record->application_code;
			}
		 }
		 $invoice_details = getInvoiceDetails($module_id, $application_id,$application_code);
		 $app_description= '';
		if(isset($invoice_details)){
            $app_description = $invoice_details['module_desc'];
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
			$sub_module_id = $rec->sub_module_id;
			
					$params = array(
						'invoice_id' => $invoice_id,
						'application_code'=>$application_code
					);
					
				$org_info = $this->getOrganisationInfo();
				$pdf = new PdfLettersProvider();
				$pdf->AddPage();
				$pdf->SetAutoPageBreak(TRUE, 15); 
				
				$template_url = base_path('/');
				$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
																		// import page 1
				$tplId = $pdf->importPage(1);	
				$pdf->useTemplate($tplId,0,0);
				$pdf->setPageMark();
							
							
				$pdf->SetFont('times','B',9);
				$pdf->Cell(0,1,'',0,1);
				//$pdf->setPrintHeader(false);
				//$pdf->setPrintFooter(false);
				
				$org_rec = getSingleRecord('tra_organisation_information', array('id'=>1));
				$logo = getcwd() . '/resources/images/zamra-logo.png';
				$pdf->SetFont('times', 'B', 12);
				$this->returnReportHeader($pdf,$org_rec,$rec, 'PROFORMA INVOICE');
				
			   
				$pdf->Cell(0,7,'Customer Details',0,1);
				$pdf->SetFont('times', '', 11);
				
				$pdf->Cell(0,7,$rec->applicant_name,0,1);
				$pdf->Cell(0,7,$rec->postal_address.', '.$rec->region_name.', '.$rec->country_name,0,1);
				$pdf->Cell(0,7,$rec->email,0,1);
				$pdf->SetFont('times', 'B', 11);
			   
				$pdf->Cell(0,7,'Invoice Details',0,1);
				$pdf->SetFont('times', '', 11);
			   
				$pdf->Cell(0,7,'Ref No:'. $rec->tracking_no .' '.$rec->reference_no,0,1, '');
				$pdf->Cell(60,7,'Invoice Number: '.$rec->invoice_no,0,0);
				$pdf->Cell(0,7,'Invoice Date:'.$rec->date_of_invoicing,0,1, 'R');
				$pdf->ln();
				$pdf->MultiCell(0,7,'Invoice Details for '.$rec->module_name.' ('.$rec->sub_module.') '.$app_description,0,'',0,1);
				
			$pdf->SetFont('times', 'B', 10);
			   
				$pdf->SetLineWidth(0.1);
				//invoice details 
				$pdf->Cell(15,10,'Sn',1,0);
				$pdf->Cell(100,10,'Item Description',1,0,'C');
				$pdf->Cell(40,10,'Price',1,0,'C');
				$pdf->Cell(0,10,'Total',1,1,'C');
				if($sub_module_id == 67){
					$inv_rec = DB::table('tra_invoice_details as t1')
								->leftJoin('par_currencies as t2','t1.paying_currency_id','t2.id')
								->leftJoin('tra_element_costs as t3','t1.element_costs_id','t3.id')
								->leftJoin('par_cost_elements as t4','t3.element_id','t4.id')
								->leftJoin('par_fee_types as t5','t3.fee_type_id','t5.id')
								->leftJoin('par_cost_categories as t6','t3.cost_category_id','t6.id')
								->leftJoin('par_cost_sub_categories as t11','t3.sub_cat_id','t11.id')
								->leftJoin('tra_product_retentions as t7','t1.id','t7.invoice_element_id')
								->leftJoin('tra_registered_products as t8','t7.reg_product_id','t8.id')
								->leftJoin('tra_product_applications as t9','t7.application_code','t9.application_code')
								->leftJoin('tra_product_information as t10','t9.product_id','t10.id')
								->select(DB::raw("t8.registration_no as ma_no,t9.reference_no as application_no,t11.name as cost_subcategory, t10.product_strength,t10.brand_name,   t4.name AS cost_element, t5.name AS fee_type, t6.name AS cost_category, t1.total_element_amount AS invoice_amount, t1.paying_currency_id,t2.name as currency_name"))
								->where(array('t1.invoice_id'=>$invoice_id))
								->get();
				}
				else{
					$inv_rec = DB::table('tra_invoice_details as t1')
								->join('par_currencies as t2','t1.paying_currency_id','t2.id')
								->join('tra_element_costs as t3','t1.element_costs_id','t3.id')
								->join('par_cost_elements as t4','t3.element_id','t4.id')
								->join('par_fee_types as t5','t3.fee_type_id','t5.id')
								->leftJoin('par_cost_categories as t6','t3.cost_category_id','t6.id')
								->select(DB::raw(" t4.name AS cost_element, t5.name AS fee_type, t6.name AS cost_category, t1.total_element_amount AS invoice_amount, t1.paying_currency_id,t2.name as currency_name"))
								->where(array('t1.invoice_id'=>$invoice_id))
								->get();
				}
				
				if($inv_rec){
					
					
					$i = 1;
					$total_amount = 0;
					$currency_name = '';
					$paying_currency_id = '';
					$pdf->SetFont('times', '', 10);
					foreach($inv_rec as $inv){
						$currency_name = $inv->currency_name;
						if($sub_module_id == 67){
							$cost_item = $inv->fee_type." ".$inv->cost_subcategory." ".$inv->brand_name." ".$inv->ma_no." ".$inv->product_strength;
						
						}
						else{
							$cost_item = $inv->fee_type." ".$inv->cost_category." ".$inv->cost_element;
						
							
						}
						$paying_currency_id = $inv->paying_currency_id;
						$rowcount = max($pdf->getNumLines($cost_item, 100),$pdf->getNumLines($inv->invoice_amount, 40));
						$pdf->MultiCell(15,5*$rowcount,$i,1,'',0,0);
						$pdf->MultiCell(100,5*$rowcount,$cost_item,1,'',0,0);
						$pdf->MultiCell(40,5*$rowcount,formatMoney($inv->invoice_amount),1,'R',0,0);
						$pdf->MultiCell(0,5*$rowcount,formatMoney($inv->invoice_amount),1,'R',0,1);
						$total_amount = $total_amount+$inv->invoice_amount;
						//$x = $pdf->width;
						$y = $pdf->GetY();

						if (($y) >= 260) {
							$pdf->AddPage();
							$y = 0; // should be your top margin
						}
						
						$i++;
					}
					
					$pdf->MultiCell(155,10,'Sub-Total('.$currency_name.')',1,'R',0,0);
					$pdf->MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);
						
					$pdf->MultiCell(155,10,'Total('.$currency_name.')',1,'R',0,0);
					$pdf->MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);
						
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
						$pdf->MultiCell(0,7,'The amount due must be remitted to the following account:',0,'',0,1);	
						$i = 1;
								foreach($bank_rec as $bank){
									$pdf->MultiCell(100,7,$i.'. '.$bank->account_name.' '.$bank->bank_name." ".$bank->branch_name.' '.$bank->currency_name." Account: ".$bank->account_no. " Swift Code: ".$bank->swft_code,0,'',0,1);	
									
								}
					}						
						if($permit_previewoption =='preview'){
											
											$pdf->Output($rec->tracking_no.' Proforma Invoice.pdf');											
										}
										else{
											$pdf->Output($upload_directory, "F"); 
										}		
				
		}
		else{
			///echo "<h4>Invoice details Not Found</h4>";
		}
       
		
		
	}
	function returnReportHeader($pdf,$org_rec,$rec,$title){
		$pdf->Cell(0,25,'',0,1);
               $pdf->Cell(0, 6, strtoupper($org_rec->name), 0, 1, 'C');
              $pdf->SetFont('times', 'B', 9);
               $pdf->Cell(0, 6, $org_rec->postal_address.', '.$org_rec->region_name.', '.$org_rec->republic, 0, 1, 'C');
               $pdf->Cell(0, 6, 'Tel: '.$org_rec->telephone_nos.' Fax: '.$org_rec->fax, 0, 1, 'C');
               $pdf->Cell(0, 6, $org_rec->physical_address, 0, 1, 'C');
               $pdf->Cell(0, 6, 'Website: '.$org_rec->website.', Email: '.$org_rec->email_address, 0, 1, 'C');
               $pdf->Cell(0, 5, '', 0, 2);
             //  $pdf->Image($logo, 86, 40, 35, 14);
               $pdf->SetFont('times', 'B', 13);
			   if(isset($rec->invoice_no)){
				   	   $data = '{"invoice_no":'.$rec->invoice_no.',"module_id":'.$rec->module_id.',"application_code":'.$rec->application_code.'}';
			   }
			   else{
				   	   $data = '{"receipt_no":'.$rec->receipt_no.',"module_id":'.$rec->module_id.',"application_code":'.$rec->application_code.'}';
				   
			   }
		

				$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
																							
				$pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);
               $pdf->Cell(0, 7, strtoupper($title), 0, 2, 'C');
				$pdf->SetFont('times', 'B', 11);
		
	}
	function printApplicationReceipt($payment_id,$request, $permit_previewoption,$upload_directory=null){
			

		$table_name = $request->input('table_name');
        $application_code = $request->input('application_code');
       
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
			$module_id = $rec->module_id;
			$payment_receivedby = $rec->payment_receivedby;
			$application_id = $rec->application_id;
			$application_code = $rec->application_code;
			
			$details = getInvoiceDetails($module_id, $application_id,$application_code);
			 $app_description= '';
			if(isset($details)){
				$app_description = $details['module_desc'];
			}
			
			
			if($payment_type_id == 3){
				$this->funcGenerateCreditNote($payment_id);
				
			}
			else{
				$pdf = new PdfLettersProvider();
				$pdf->AddPage('');
				$template_url = base_path('/');
				$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
																		// import page 1
				$tplId = $pdf->importPage(1);	
				$pdf->useTemplate($tplId,0,0);
				$pdf->setPageMark();
							
				$pdf->setPrintHeader(false);
				$pdf->setPrintFooter(false);
				$org_rec = getSingleRecord('tra_organisation_information', array('id'=>1));
				$logo = getcwd() . '/resources/images/zamra-logo.png';
				$org_rec = getSingleRecord('tra_organisation_information', array('id'=>1));
				$logo = getcwd() . '/resources/images/zamra-logo.png';
				$pdf->SetFont('times', 'B', 12);
				$this->returnReportHeader($pdf,$org_rec,$rec,'RECEIPT');
				
				
				
				$pdf->SetFont('times','B',11);
				$pdf->Cell(70,7,strtoupper('Account Payee(From)'),0,0); 
				$pdf->Cell(0,7,strtoupper('Receipt Details'),0,1,'R');
				$pdf->SetFont('times', '', 11);
				$pdf->Cell(70,7,strtoupper($rec->applicant_name),0,0);
				$pdf->Cell(0,7,strtoupper('Payment Date:'.$rec->trans_date),0,1, 'R');
				$pdf->Cell(70,7,strtoupper($rec->postal_address.', '.$rec->region_name.', '.$rec->country_name),0,0);
				$pdf->Cell(0,7,strtoupper('Receipt Number: '.$rec->receipt_no),0,1,'R');
				$pdf->Cell(70,7,strtoupper($rec->email),0,0);
				$pdf->Cell(0,7,strtoupper('Payment Mode: '.$rec->payment_mode),0,1, 'R');
				
				$pdf->SetFont('times', 'b', 11);
				
				$pdf->Cell(0,7,strtoupper('Ref No:'. $rec->tracking_no .' '.$rec->reference_no),0,1, 'R');
				
				$pdf->ln();
				
				$pdf->SetFont('times', 'b', 11);
				
				$pdf->SetFont('times','',11);
				
						$pdf->SetFont('times','B',11);
				$pdf->MultiCell(0,7,'Receipt/Payments Details for  '.$rec->module_name.' ('.$rec->sub_module.') '.$app_description,0,'',0,1);
				
				//invoice details 
				$pdf->SetLineWidth(0.1);
				$pdf->SetFont('times','B',11);
				$pdf->Cell(15,10,'Sn',1,0);
				$pdf->Cell(140,10,'Being Payment for: ',1,0,'C');
				$pdf->Cell(0,10,'Total',1,1,'C');
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
					$currency_id = '';$pdf->SetLineWidth(0.1);
					foreach($inv_rec as $inv){
						$currency_name = $inv->currency_name;
						$cost_item = $inv->fee_type." ".$inv->cost_category." ".$inv->cost_element;
						$pdf->SetFont('times','',11);
							$rowcount = max($pdf->getNumLines($cost_item, 92),$pdf->getNumLines($inv->amount_paid, 40));
						$pdf->MultiCell(15,7*$rowcount,$i,1,'',0,0);
						$pdf->MultiCell(140,7*$rowcount,$cost_item,1,'',0,0);
						$pdf->MultiCell(0,7*$rowcount,formatMoney($inv->amount_paid),1,'R',0,1);
						$total_amount = $total_amount+$inv->amount_paid;
						
						$i++;
					}
					$pdf->SetFont('times','B',11);
					$pdf->MultiCell(155,10,'Sub-Total('.$currency_name.')',1,'R',0,0);
					$pdf->MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);
						
					$pdf->MultiCell(155,10,'Total Amount('.$currency_name.')',1,'R',0,0);
					$pdf->MultiCell(0,10,formatMoney($total_amount),1,'R',0,1);
						
				}
				$pdf->SetFont('times','i',11);
				$pdf->MultiCell(0,7,'Amount in words '.ucwords(convert_number_to_words($rec->amount_paid)).'('.$currency_name.')'.' Only',1,'',0,1);
				$pdf->MultiCell(100,7,'Received By: Zambia Medicines Regulatory Authority',1,'',0,0);
				$pdf->MultiCell(0,7,'Print Date: '.Carbon::now(),1,'',0,1);
					
			if($permit_previewoption =='preview'){
											
											$pdf->Output($rec->tracking_no.' Payment Receipt.pdf');											
										}
										else{
											$pdf->Output($upload_directory, "F"); 
										}	
			}
			
		}
		else{
			//echo "<h4>Receipt details Not Found</h4>";
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
function getGMPproductLines($manufacturing_site_id){
	$product_line = '';
	$qry = DB::table('gmp_productline_details as t1')
									->join('gmp_product_lines as t2', 't1.product_line_id', '=', 't2.id')
									->join('gmp_product_categories as t3', 't1.category_id', '=', 't3.id')
									->leftJoin('gmp_productlinestatus as t5', 't1.prodline_inspectionstatus_id', '=', 't5.id')
									->leftJoin('gmp_prodlinerecommenddesc as t6', 't1.product_line_status_id', '=', 't6.id')
									->where('t1.manufacturing_site_id', $manufacturing_site_id)
									->select('t1.*', 't2.name as product_line', 't3.name as productline_categ', 't1.prodline_description as line_activity');
							$results = $qry->get();
	foreach($results as $rec){
		
		$product_line = $product_line.$rec->product_line.', ';
		
	}
	return $product_line;
	
}
	function generateGMPCAPARequests($req){
		$application_code = $req->application_code;
		$module_id = $req->module_id;
		$query_id = $req->query_id;
		if(!validateIsNumeric($module_id)){
			$app_data = DB::table('tra_submissions')
            ->select('module_id')
			->where(array('application_code'=>$application_code))
            ->first();
			if($app_data){
						$module_id = $app_data->module_id;
					}
			}
			
			$module_data = getTableData('modules', ['id'=>$module_id]);
			
			$requestadditionalinfo_timespan =getTableData('par_requestadditionalinfo_timespan', ['module_id'=>$module_id]);
			if(!isset($requestadditionalinfo_timespan->time_span)){
				$time_span =30;
			}else{
				
				$time_span =$requestadditionalinfo_timespan->time_span ;
				
			}
					if(!isset($module_data->table_name)){
						return "Module details not found";
					}
			 $invoice_details = getInvoiceDetails($module_id, '',$application_code);
			 $app_description= '';
			if(isset($invoice_details)){
				$app_description = $invoice_details['module_desc'];
			}
			$app_data = DB::table($module_data->table_name.' as t1')
						->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
						->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
						->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
						->join('tra_manufacturing_sites as t5', 't1.manufacturing_site_id', 't5.id')
						->leftJoin('par_countries as t6', 't5.country_id', 't6.id')
						->leftJoin('par_regions as t7', 't5.region_id', 't7.id')
						->where('application_code', $application_code)
						->select('t1.applicant_id','t1.reference_no', 't1.tracking_no','t2.name as applicant_name', 't2.*','t1.manufacturing_site_id', 't3.name as country_name', 't5.name as manufacturing_site', 't6.name as man_country','t7.name as man_region', 't5.physical_address as man_physical_address' ,'t4.name as region_name')
						->first();
			if(!$app_data){
				return "Application details not found";
			}

			$org_info = $this->getOrganisationInfo();
			$pdf = new mPDF( [
					'mode' => 'utf-8',
					'format' => 'A4',
					'margin_header' => '3',
					'margin_top' => '20',
					'margin_bottom' => '20',
					'margin_footer' => '2',
					'tempDir'=> '/opt/lampp/htdocs/mis/backend/public/resources'
				]); 
			// $pdf = new PdfLettersProvider();
			$pdf->setMargins(5,25,5,true);
			$pdf->AddPage();$pdf->Cell(0,4,'LET_LSE/GMP/0014/06/22',0,1,'R');
				$template_url = base_path('/');
				$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
				// import page 1
				$tplId = $pdf->importPage(1);	
				$pdf->useTemplate($tplId,0,0);
				$logo = getcwd() . '/resources/images/zamra-logo.png';
				$pdf->Image($logo,90,15,34,30);
			
			$pdf->Cell(0,4,'',0,1,'R');
			$pdf->SetFont('times','B',12);
			$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
			
			 $pdf->Cell(0,3,'',0,1);
				$startY = $pdf->y;
			$startX = $pdf->x;
			$pdf->SetLineWidth(0.3);
			$pdf->Line(0+55,$startY,160,$startY);
				$pdf->Cell(0,3,'',0,1);
			$inspection_date =$this->getGmpInspectionDates($application_code);
			
			$product_line = $this->getGMPproductLines($app_data->manufacturing_site_id);
			
			if($app_data->tracking_no != ''){
				
				$application_no = 	$app_data->tracking_no;
				
			}
			if($app_data->reference_no != ''){

				$application_no .= 	' '.$app_data->reference_no;
			}
			$pdf->SetFont('times','B',10);
			$pdf->Cell(0,10,'All correspondence should be addressed to the Director General',0,1, '');
			$pdf->Cell(0,10,'Reference:'.$application_no,0,1, '');
				
			$pdf->Cell(0,7,'The Director,',0,1);
			$pdf->Cell(0,7,$app_data->applicant_name,0,1);
			$pdf->Cell(0,7,$app_data->physical_address,0,1);
			$pdf->Cell(0,7,$app_data->country_name,0,1);
			$pdf->Cell(0,7,'Dear Sir/Madam',0,1);
			$pdf->SetFont('times','B',12);
			
			$pdf->WriteHTML("RE: GMP INSPECTION OUTCOME - ".$app_data->manufacturing_site.', '.$app_data->man_physical_address.' in '.$app_data->man_country); 
			$pdf->SetFont('times','B',10);

			$pdf->SetFont('times','',10);
			$application_no = '';

			
				$query_date = Carbon::now();
			$data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

			$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
			
			$pdf->SetFont('times','',12);
			
			$template1 = "Reference is made to the above subject matter and the GMP inspection that was conducted at your site from 2 – 4 May, 2022.";
				$pdf->ln();

			$pdf->WriteHTML($template1);
			$template2 = "Please be informed that based on the areas inspected, the persons interviewed and the documents reviewed, and considering the findings of the inspection, including the deficiencies listed in the Inspection Report, The decision on the compliance of ".$app_data->manufacturing_site.", ".$app_data->man_country." with WHO GMP guidelines for the manufacture of ".$product_line." will be made after the manufacturer's response to the observations has been assessed. ";
	$pdf->ln();

			$pdf->WriteHTML($template2);
			
			$template3 = "You are expected to respond to all deficiencies and for each include a description of the corrective action implemented or planned to be implemented, and the date of completion or target date for completion.  In addition, for deficiencies classified as `critical` and `major`, supporting documentation should be submitted with the response as objective evidence of completion of corrective actions. The acceptability of corrective actions will be assessed during. ";
	$pdf->ln();

			$pdf->WriteHTML($template3);
			
			
			$template3 = "You are advised to submit the Corrective and Preventive Action (CAPAs) Plan within ".$time_span." days from the date of receipt of this communication. The acceptability of corrective actions will be assessed through evaluation of the response to each deficiency. ";
	$pdf->ln();

			$pdf->WriteHTML($template3);
			
			$template4 = "Should you have any clarifications on this matter, please do not hesitate to contact us.";
	$pdf->ln();

			$pdf->WriteHTML($template4);
			
			
			$pdf->SetFont('times','B',12);
			
			$dt =strtotime($query_date); //gets dates instance
			$year = date("Y", $dt);
			$month = date("F", $dt);
			$day = date("d", $dt);
$pdf->ln();
				$pdf->Cell(0, 0,'Dated this '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
			$pdf->cell(0,8,'',0,1);
					$startY = $pdf->y;
			$startX =$pdf->x;
			$signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
			$pdf->ln();
			$pdf->Cell(0, 0, 'For/Zambia Medicines Regulatory Authority',0,1,'');
			
			
			//add the inspection reports to the letter 
			$inspection_reports = DB::table('tra_application_uploadeddocuments')->where(array('application_code'=>$application_code, 'document_requirement_id'=>289))->get();
			
			foreach($inspection_reports as $insp_report){
				$node_ref = $insp_report->node_ref;
				$initial_file_name = $insp_report->initial_file_name;
					
				$url = downloadDocumentUrl($node_ref, '');
					set_time_limit(0); 
					$public_dir=public_path().'/resources/uploads';
					$file = file_get_contents($url);
					$filetopath=$public_dir.'/'.$initial_file_name;
					file_put_contents($filetopath, $file);
					ini_set('memory_limit', '-1');
					if(file_exists($filetopath)){
						$pageCount = $pdf->setSourceFile($filetopath);
						for ($i = 1; $i <= $pageCount; $i++) {
							$tplIdx = $pdf->importPage($i, '/MediaBox');
							$pdf->AddPage();
							$pdf->useTemplate($tplIdx);
						}
						
					}
					
				
			}
			
			return response($pdf->Output('Request for CAPA Response('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
			
		
	}
	function generateRequestForReinspection($req){
		$application_code = $req->application_code;
		$module_id = $req->module_id;
		$query_id = $req->query_id;
		if(!validateIsNumeric($module_id)){
			$app_data = DB::table('tra_submissions')
            ->select('module_id')
			->where(array('application_code'=>$application_code))
            ->first();
			if($app_data){
						$module_id = $app_data->module_id;
					}
			}
			
			
			
			$module_data = getTableData('modules', ['id'=>$module_id]);
			
			$requestadditionalinfo_timespan =getTableData('par_requestadditionalinfo_timespan', ['module_id'=>$module_id]);
			if(!isset($requestadditionalinfo_timespan->time_span)){
				$time_span =23;
			}else{
				
				$time_span =$requestadditionalinfo_timespan->time_span ;
				
			}
					if(!isset($module_data->table_name)){
						return "Module details not found";
					}
			 $invoice_details = getInvoiceDetails($module_id, '',$application_code);
			 $app_description= '';
			if(isset($invoice_details)){
				$app_description = $invoice_details['module_desc'];
			}
			$app_data = DB::table($module_data->table_name.' as t1')
						->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
						->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
						->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
						->where('application_code', $application_code)
						->select('t1.applicant_id','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name')
						->first();
			if(!$app_data){
				return "Application details not found";
			}

			$org_info = $this->getOrganisationInfo();
			$pdf = new mPDF( [
					'mode' => 'utf-8',
					'format' => 'A4',
					'margin_header' => '3',
					'margin_top' => '20',
					'margin_bottom' => '20',
					'margin_footer' => '2',
					'tempDir'=> '/opt/lampp/htdocs/mis/backend/public/resources'
				]); 
			
			$pdf->setMargins(5,25,5,true);
			$pdf->AddPage();
				$template_url = base_path('/');
				$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
				// import page 1
				$tplId = $pdf->importPage(1);	
				$pdf->useTemplate($tplId,0,0);
				$logo = getcwd() . '/resources/images/zamra-logo.png';
				$pdf->Image($logo,90,15,34,30);
				
			$pdf->Cell(0,4,'',0,1,'R');
			// $pdf->Cell(0,4,'',0,1,'R');
			$pdf->SetFont('times','B',11);
			
			$pdf->Cell(0,4,$org_info->org_name,0,1,'C');
			$pdf->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');

			$pdf->SetFont('times','B',11);
			$pdf->Cell(0,4,'(Act No. 3 of 2013)',0,1,'C');
			//$pdf->Cell(0,30,'',0,1);


			 $pdf->Cell(0,3,'',0,1);
				$startY = $pdf->y;
			$startX = $pdf->x;
			$pdf->SetLineWidth(0.3);
			$pdf->Line(0+55,$startY,160,$startY);
				$pdf->Cell(0,3,'',0,1);
			
				$record = DB::table('tra_premises_applications as t1')
								->join('tra_premises as t2', 't1.premise_id', 't2.id')
								->leftJoin('par_premises_types	 as t7', 't2.premise_type_id', 't7.id')
								->select('t7.act_name as premises_type')
								->where('application_code',$application_code)
								->first();
					if($record){
						$premise_type = $record->premises_type;
						
					$regulation_title = $premise_type;
					}else{
						
					$regulation_title = "The Medicines and Allied Substances (Certificate of Registration) Regulations, 2017";
					}
					$pdf->Cell(0,4,$regulation_title,0,1,'C');

			

			$pdf->Cell(0,5,'',0,1);
			$pdf->SetFont('times','B',10);
			
			$pdf->WriteHTML('REQUEST FOR RE-INSPECTION FOR '.strtoupper($app_description)); 
			$pdf->SetFont('times','B',10);

			$pdf->SetFont('times','',10);
			$application_no = '';

			if($app_data->tracking_no != ''){
				
				$application_no = 	$app_data->tracking_no;
				
			}
			if($app_data->reference_no != ''){

				$application_no .= 	' '.$app_data->reference_no;
			}
			$pdf->Cell(0,10,'Application Reference:'.$application_no,0,1, '');
				
			$data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

			$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
			
			$pdf->SetFont('times','',12);
			//Letter heading 
			$pdf->Cell(0,8,'To:',0,1);
			$pdf->Cell(0,8,$app_data->name.',',0,1);
			if($app_data->physical_address != ''){
					$pdf->Cell(0,8,$app_data->physical_address.',',0,1);

				}		
				if(($app_data->physical_address !=  $app_data->postal_address)){
					
						$pdf->Cell(0,8,$app_data->postal_address.',',0,1);
				}
		
			$pdf->Cell(0,8,$app_data->region_name." ".$app_data->country_name,0,1);

			$pdf->SetFont('times','',11);
			
			$template = "Reference to the inspection undertaken as your premises, various finding and queiries have resulted to Re-Inspection Request as listed below:";

			$pdf->WriteHTML($template);
			$pdf->SetFont('times','B',12);
			//add query items
			//loop through requests
			//$pdf->ln();

			$pdf->Cell(0,5,'',0,1);
			$request_data = DB::table('reinspectiontitems_queries as t1')
							->join('tra_appreinspectionrequest_reftracker as t2', 't1.query_id', 't2.id')
							->select('t1.query', 't1.comment', 't2.queried_on', 't2.is_live_signature', 't2.sign_file')
							->where('t2.id', $query_id)
							->get();

			$pdf->SetFont('times','',11);

			$counter = 1;
			$is_live_signature=0;
			$sign_data='';
			
				$query_date = Carbon::now();
			foreach ($request_data as $data){
				$query_date = $data->queried_on;
			
			
				$pdf->SetTextColor(0,0,0);
					//$query_data = $data->checklist_item.': '.$data->query;
					$query_data = $data->query;
					$pdf->Cell(12,5,$counter.'. ',0,0);

					// $pdf->WriteHTML($query_data, true, false, true, true);
					if($query_data != ''){
						$pdf->WriteHTML($query_data); 
						
					}
					

				$counter++;
			}//setPageMark

			$pdf->cell(10,3,'',0,1);
			$template = "<p  align='justify'>The Re-Inspection Application should be accompanied by the proof of payment based on the Premises Fees.</b></p>";
			$pdf->WriteHTML($template); 
			$pdf->ln();

			$dt =strtotime($query_date); //gets dates instance
			$year = date("Y", $dt);
			$month = date("F", $dt);
			$day = date("d", $dt);

				$pdf->Cell(0, 0,'Dated this '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
			$pdf->cell(0,8,'',0,1);
					$startY = $pdf->y;
			$startX =$pdf->x;
			$signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
			//$pdf->Image($signiture,$startX+75,$startY-7,30,12);
					//$pdf->Cell(0, 0, '___________________________',0,1,'C');
					$pdf->Cell(0, 0, 'On behalf of ZAMRA',0,1,'');
			return response($pdf->Output('Request for Re-Inspection ('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
																			
				
		
		
		
	}
	function generateRequestForAdditionalInformation($req){
		
		$application_code = 101718; //$req->application_code;
		$module_id = 1; //$req->module_id;
		$query_id = 60; //$req->query_id;
		// $query_id = $req->query_id;
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
					if(!isset($module_data->table_name)){
						return "Module details not found";
					}
			//  $invoice_details = getInvoiceDetails($module_id, '',$application_code);
			//  $app_description= '';
			// if(isset($invoice_details)){
			// 	$app_description = $invoice_details['module_desc'];
			// }
			$app_data = DB::table($module_data->table_name.' as t1')
						->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
						->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
						->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
						->where('application_code', $application_code)
						->select('t1.applicant_id','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name')
						->first();
			if(!$app_data){
				return "Application details not found";
			}

			$org_info = $this->getOrganisationInfo();
			$pdf = new mPDF( [
					'mode' => 'utf-8',
					'format' => 'A4',
					'margin_header' => '3',
					'margin_top' => '20',
					'margin_bottom' => '20',
					'margin_footer' => '2',
					'tempDir'=> '/public/resources'
				]); 
			// $pdf = new PdfLettersProvider();
			$pdf->setMargins(5,25,5,true);
			$pdf->AddPage();
				$template_url = base_path('/');
				$pdf->setSourceFile($template_url."resources/templates/certificate_template.pdf");
				// import page 1
				$tplId = $pdf->importPage(1);	
				$pdf->useTemplate($tplId,0,0);
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


			 $pdf->Cell(0,3,'',0,1);
			$startY = $pdf->y;
			$startX = $pdf->x;
			$pdf->SetLineWidth(0.3);
			$pdf->Line(0+55,$startY,160,$startY);
				$pdf->Cell(0,3,'',0,1);
			if($module_id == 4){
					$regulation_title = "The Medicines and Allied Substances (Importation and Exportaion) Regulations, 2017";
					$pdf->Cell(0,4,$regulation_title,0,1,'C');

			}
			else if($module_id == 2){
				//get the premises types 
				$record = DB::table('tra_premises_applications as t1')
								->join('tra_premises as t2', 't1.premise_id', 't2.id')
								->leftJoin('par_premises_types	 as t7', 't2.premise_type_id', 't7.id')
								->select('t7.act_name as premises_type')
								->where('application_code',$application_code)
								->first();
					if($record){
						$premise_type = $record->premises_type;
						
					$regulation_title = $premise_type;
					}else{
						
					$regulation_title = "The Medicines and Allied Substances (Certificate of Registration) Regulations, 2017";
					}
					$pdf->Cell(0,4,$regulation_title,0,1,'C');

			}
			else{
				$regulation_title = "The Medicines and Allied Substances";
				$pdf->Cell(0,4,$regulation_title,0,1,'C');
				$regulation_title = "(Marketing Authorisation of Medicines) Regulations, 2019";
				
				$pdf->Cell(0,4,$regulation_title,0,1,'C');
			}
			

			$pdf->Cell(0,5,'',0,1);
			$pdf->SetFont('times','B',12);
			
			$pdf->WriteHTML('REQUEST FOR ADDITIONAL INFORMATION FOR '.strtoupper($app_description)); 
			$pdf->SetFont('times','B',10);

			$pdf->SetFont('times','',10);
			$application_no = '';

			if($app_data->tracking_no != ''){
				
				$application_no = 	$app_data->tracking_no;
				
			}
			if($app_data->reference_no != ''){

				$application_no .= 	' '.$app_data->reference_no;
			}
			$pdf->Cell(0,10,'Application Reference:'.$application_no,0,1, 'R');
				// $pdf->MultiCell(0,10,'Application Reference:<u>'.$app_data->tracking_no.'</u>',0,'R',0,1,'','',true,0,true);
			$data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

			$styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
			// QRCODE,H : QR-CODE Best error correction
			// $pdf->write2DBarcode($data, 'QRCODE,H', 178, 28, 16, 16);

			// $barcode = "<barcode code='".$data."' type='CODE11' height='0.66' text='1' />";
			//$pdf->writeBarcode('111111111',0, 178, 28);
			$pdf->SetFont('times','',12);
			//Letter heading 
			$pdf->Cell(0,8,'To:',0,1);
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

			$pdf->SetFont('times','',11);
			//$pdf->ln();

			//add query header tag
			$template = "You are requested to furnish, the following information or documents in request of your application for ".$module_data->name." within ".$time_span." days of this request.";

			$pdf->WriteHTML($template);
			$pdf->SetFont('times','B',12);
			//add query items
			//loop through requests
			//$pdf->ln();

			$pdf->Cell(0,5,'',0,1);
			$request_data = DB::table('checklistitems_queries as t1')
							->join('tra_application_query_reftracker as t2', 't1.query_id', 't2.id')
							->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', 't3.id')
							->select('t1.query', 't1.comment', 't2.queried_on', 't2.is_live_signature','t3.name as checklist_item', 't2.sign_file')
							->where('t2.id', $query_id)
							->get();

			$pdf->SetFont('times','',11);

			$counter = 1;
			$is_live_signature=0;
			$sign_data='';
			dd($request_data);
				$query_date = Carbon::now();
			foreach ($request_data as $data){
				$query_date = $data->queried_on;
			
			
				$pdf->SetTextColor(0,0,0);
					//$query_data = $data->checklist_item.': '.$data->query;
					$query_data = $data->query;
					$pdf->Cell(12,5,$counter.'. ',0,0);

					// $pdf->WriteHTML($query_data, true, false, true, true);
					if($query_data != ''){
						$pdf->WriteHTML($query_data); 
						$pdf->ln();
					}
					

				$counter++;
			}//setPageMark

			$pdf->cell(10,3,'',0,1);
			$template = "<p  align='justify'>If you fail to furnish the requested information within the stipulated period, your application will be treated as invalid and be rejected</b></p>";
			$pdf->WriteHTML($template); 
			$pdf->ln();

			$dt =strtotime($query_date); //gets dates instance
			$year = date("Y", $dt);
			$month = date("F", $dt);
			$day = date("d", $dt);

				$pdf->Cell(0, 0,'Dated this '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
			$pdf->cell(0,8,'',0,1);
					$startY = $pdf->y;
			$startX =$pdf->x;
			$signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
			//$pdf->Image($signiture,$startX+75,$startY-7,30,12);
					//$pdf->Cell(0, 0, '___________________________',0,1,'C');
					$pdf->Cell(0, 0, 'On behalf of ZAMRA',0,1,'');
			return response($pdf->Output('Request for Additional Information('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');
																			
						
		
		
	}
}