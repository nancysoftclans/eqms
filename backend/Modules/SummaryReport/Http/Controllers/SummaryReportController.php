<?php

namespace Modules\SummaryReport\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use PDF;
use \Mpdf\Mpdf as mPDF;
use Hash;
use DateTime;
// use Excel;
// use Symfony\Component\HttpFoundation\StreamedResponse;
// use PhpOffice\PhpSpreadsheet\Spreadsheet;
// use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
// use PhpOffice\PhpSpreadsheet\Style\Fill;
// use PDF;
class SummaryReportController extends Controller
{
  protected $user_id;
  public function __construct(Request $req)
  {
      $is_mobile = $req->input('is_mobile');
      if (is_numeric($is_mobile) && $is_mobile > 0) {
          $this->user_id = $req->input('user_id');
      } else {
          $this->middleware(function ($request, $next) {
              if (!\Auth::check()) {
                  $res = array(
                      'success' => false,
                      'message' => '<p>NO SESSION, SERVICE NOT ALLOWED!!<br>PLEASE RELOAD THE SYSTEM!!</p>'
                  );
                  //echo json_encode($res);
                  //exit();
                  $this->user_id = 1;
              }
             // $this->user_id = \Auth::user()->id;
              return $next($request);
          });
      }
  }
  public function getEnquiries(request $request){
    $reference=$request->reference;
    $start=$request->start;
    $limit=$request->limit;
   try{
    $qry=DB::table('tra_submissions as t1')
        ->leftJoin('users as t2','t1.usr_from','t2.id')
        ->leftJoin('users as t3','t1.usr_to','t3.id')
        ->leftJoin('users as t4','t1.released_by','t4.id')
        ->leftJoin('wb_trader_account as t5','t1.applicant_id','t5.id')
        ->leftJoin('wf_workflow_stages as t6','t1.previous_stage','t6.id')
        ->leftJoin('wf_workflow_stages as t7','t1.current_stage','t7.id')
        ->leftJoin('wf_processes as t8','t1.process_id','t8.id')
        ->select(DB::raw("t1.reference_no,t1.tracking_no,t1.date_released,t1.date_received,t1.date_submitted,t1.is_read,t1.is_done,
        CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),decryptval(t2.last_name,".getDecryptFunParams().")) as from_user,
        CONCAT(decryptval(t3.first_name,".getDecryptFunParams()."),decryptval(t3.last_name,".getDecryptFunParams().")) as to_user,
        CONCAT(decryptval(t4.first_name,".getDecryptFunParams()."),decryptval(t4.last_name,".getDecryptFunParams().")) as submitted_by,
        t5.name as applicant,t6.name as previous_process,t7.name as current_process,working_days(date(t1.date_received),date(t1.date_released)) as total_days,t8.name as Process"));
        // ->select(DB::raw("t1.reference_no,t1.tracking_no,t1.date_released,t1.date_received,t1.date_submitted,t1.isDone,t1.isRead"));

     if(isset($reference)){
          $qry->where('t1.reference_no', '=',$reference)
               ->orWhere('t1.tracking_no','=',$reference);
     }
      // dd($qry->toSql());
        $total=$qry->count();

         if(isset($start)&&isset($limit)){
                $results = $qry->skip($start)->take($limit)->get();
             }
            else{
                $results=$qry->get();
             }
//merge 
     //  check in the previous MIS 
      
                    
            $res = array(
                'success' => true,
                'results' => $results,
                'total'=>$total,
                'message' => 'All is well',
    
            );

           }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
          return \response()->json($res);
    

    }
    public function getOnlineSubmissionStatuses(request $req){
  
      $con=DB::Connection('portal_db');
      $results=$con->table('wb_statuses as t1')->get();
  
      return \response()->json($results);
    }
    public function getScheduledTcMeetingDetails(Request $req){
      try{
          $data_today = formatDate(Carbon::now());
          $user_id = $this->user_id;
          $results = DB::table('tc_meeting_details as t1')
                          ->join('tc_meeting_participants as t2', 't1.id', 't2.meeting_id')
                          ->leftJoin('par_modules as t3', 't1.module_id', 't3.id')
                          ->leftJoin('par_sub_modules as t4', 't1.sub_module_id', 't4.id')
                          ->leftJoin('tc_meeting_applications as t5', 't1.id', 't5.meeting_id')
                          ->join('tra_submissions as t6', function ($join) {
                                $join->on('t5.application_code', 't6.application_code');
                                $join->where('is_done', 0);
                                $join->orderBy('id', 'DESC');
                                $join->limit(1);
                            })
                          ->select(DB::raw("t1.*, t3.name as process, t4.name as sub_process, (select count(id) from tc_meeting_applications q where q.meeting_id = t1.id) as no_of_applications, t1.id as meeting_id, t5.application_code, t6.current_stage as workflow_stage_id")) 
                          ->where(array('user_id'=>$user_id, 'meeting_status_id'=>2))
                          //->whereRaw("to_char(date_requested, 'DD Mon YYYY') >= '".$data_today."'")
                          ->groupBy('t1.id','t3.name','t4.name', 't5.application_code', 't6.current_stage')
                          ->get();
  
  
          $res = array(
              'success' => true,
              'results' => $results,
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
    
    public function getCommonParamFromTable(Request $request)
    {
        $table_name = $request->input('table_name');
        $strict_mode = $request->input('strict_mode');
        $is_config = $request->input('is_config');
        $filters = $request->input('filters');
        $con = $request->input('con');
        $db_con = 'mysql';
        if (isset($con) && $con != '') {
            $db_con = $con;
        }
        $filters = (array)json_decode($filters);
        $filters=array_filter($filters);
        try {
            
            if($table_name == 'pms_program_details'){
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->join('par_sections as t2','t1.section_id','=','t2.id')
                        ->select('t1.*','t2.name as section_name');
            }
            else if($table_name == 'par_business_type_details'){
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->join('par_business_types as t3','t1.business_type_id','=','t3.id')
                        ->join('par_sections as t2','t3.section_id','=','t2.id')
                        ->select('t1.*','t3.section_id', 't2.name as section_name', 't3.name as business_type_name');
            }else if($table_name == 'par_countries'){
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_countries_continents as t3','t1.countries_continent_id','=','t3.id')
                        ->leftJoin('par_countries_subregions as t4','t1.countries_subregion_id','=','t4.id')
                        ->select('t1.*','t4.name as region_name','t3.name as countries_continent' );
            }else if ($table_name == 'par_directorate_emails') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_directorates as t3','t1.directorate_id','=','t3.id')
                        ->select('t1.*','t3.name as directorate_name');
            }
            else if ($table_name == 'par_pmsevaluation_decisions' || $table_name == 'par_pmstcmeeting_decisions' ) {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_pmssamples_stages as t3','t1.samples_nextstage_id','=','t3.id')
                        ->select('t1.*','t3.name as next_stage');
            }
             else if ($table_name == 'par_departments') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_directorates as t3','t1.directorate_id','=','t3.id')
                        ->select('t1.*','t3.name as directorate_name');
            }
            else if ($table_name == 'tra_organisation_information') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_zones as t3','t1.zone_id','=','t3.id')
                        ->select('t1.*','t3.name as zone');
            }else if ($table_name == 'par_appprocess_definations') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_date_options as t3','t1.date_option_id','=','t3.id')
                        ->select('t1.*','t3.name as date_option_name');
            }
            else if ($table_name == 'par_expirynotification_timespan' || $table_name == 'par_auditreport_config' || $table_name == 'par_service_types') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('modules as t3','t1.module_id','=','t3.id')
                        ->select('t1.*','t3.name as module_name');
            }
            else if ($table_name == 'par_inventorysection_levels') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_inventorystore_sections as t3','t1.store_section_id','=','t3.id')
                        ->select('t1.*','t3.name as section_name');
            }
            else if ($table_name == 'par_inventorystore_sections') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_inventory_stores as t3','t1.store_id','=','t3.id')
                        ->select('t1.*','t3.name as store_name');
            }
            else if ($table_name == 'tra_element_costs') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_cost_elements as t3','t1.element_id','=','t3.id')
                        ->leftJoin('par_currencies as t4','t1.currency_id','=','t4.id')
                        ->select('t1.*','t3.name as name','t4.name as currency_name');

            }
            else if ($table_name == 'par_cost_elements') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_fee_types as t3','t1.fee_type_id','=','t3.id')
                        ->select('t1.*','t3.name as fee_type_name');
            } 
            else if ($table_name == 'par_controldocument_masterlist') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_controldocument_types as t3','t1.controldocument_type_id','=','t3.id')
                        ->leftJoin('par_directorates as t4','t1.directorate_id','=','t4.id')
                        ->leftJoin('par_directorate_units as t5','t1.directorate_unit_id','=','t5.id')
                        ->leftJoin('refnumbers_formats as t6','t1.ref_format_id','=','t6.id')
                        ->select('t1.*','t3.name as controldocument_type_name','t1.id as controldoc_master_id','t1.name as control_document_name', 't1.code as document_no','t4.name as directorate_name','t5.name as directorate_unit_name','t6.name as ref_format');
            }
            else if ($table_name == 'par_directorate_units') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_directorates as t3','t1.directorate_id','=','t3.id')
                        ->select('t1.*','t3.name as directorate_name');
            }
            else if ($table_name == 'users') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->select(DB::raw("CONCAT_WS(' ',decrypt(t1.first_name),decrypt(t1.last_name)) as fullnames,t1.*"));
                $is_config = 1;
            }
             else if ($table_name == 'par_exchange_rates') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_currencies as t3','t1.currency_id','=','t3.id')
                        ->select('t1.*','t3.name as currency_name');
            }else if ($table_name == 'par_servicecharter_configurations') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('modules as t3','t1.module_id','=','t3.id')
                        ->leftJoin('par_service_types as t4','t1.service_type_id','=','t4.id')
                        ->select('t1.*','t3.name as module_name', 't4.name as service_type');
            }else if ($table_name == 'par_distributiondirective_units') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_document_directorate as t4','t1.document_directorate_id','=','t4.id')
                        ->select('t1.*', 't4.name as directorate_name');
            }else if ($table_name == 'tra_manufacturers_information' || $table_name == 'par_clinical_researchorganisations' ) {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_countries as t4','t1.country_id','=','t4.id')
                        ->leftJoin('par_regions as t5','t1.region_id','=','t5.id')
                        ->select('t1.*', 't4.name as country_name', 't5.name as region_name');
            }
            else if ($table_name == 'par_audited_tables') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_audit_table_types as t4','t1.table_type_id','=','t4.id')
                        ->select('t1.*', 't4.name as table_type');
            }
            else if ($table_name == 'par_default_currencies') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->Join('par_currencies as t4','t1.currency_id','=','t4.id')
                        ->select('t4.*', 't1.id', 't4.id as currency_id');
            }
            else if ($table_name == 'par_formfield_designs') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->Join('par_form_field_types as t5','t1.form_field_type_id','=','t5.id')
                        ->select('t1.*', 't5.name as field_type');
            }else if ($table_name == 'par_form_categories') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->Join('modules as t4','t1.module_id','=','t4.id')
                        ->Join('sub_modules as t5','t1.sub_module_id','=','t5.id')
                        ->leftJoin('par_sections as t6','t1.section_id','=','t6.id')
                        ->leftJoin('par_prodclass_categories as t7','t1.prodclass_category_id','=','t7.id')
                        ->leftJoin('par_premises_types as t8','t1.premise_type_id','=','t8.id')
                        ->select('t1.*', 't4.name as module_name', 't5.name as sub_module_name', 't6.name as section_name', 't7.name as prodclass_category_name', 't8.name as premise_type');
            }else if ($table_name == 'par_formtype_fields') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->Join('par_formfield_designs as t4','t1.field_id','=','t4.id')
                        ->select('t1.*', 't4.label as field_name', 't4.label');
                //order
                $qry->orderBy('order_no', 'ASC');
            }else if ($table_name == 'tra_otherstates_productgmpinspections' || $table_name == 'tra_otherstates_productregistrations') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->Join('par_countries as t4','t1.country_id','t4.id')
                        ->Join('par_recognisedassessments_ctrregions as t5','t1.recognisedassessments_ctrregion_id','t5.id')
                        ->select('t1.*', 't4.name as country', 't5.name as recognisedassessments_ctrregion');
               
            }else if ($table_name == 'tra_productreg_clinicalresearchsdetails') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_clinical_researchorganisations as t2','t1.clinical_researchorganisation_id','t2.id')
                        ->select('t1.*', 't2.name as clinical_researchorganisation');
            }
            else if ($table_name == 'registered_premises') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->join('tra_premises as t2','t1.tra_premise_id','t2.id')
                        ->select('t1.*', 't2.name');
            } else if ($table_name == 'par_controlleddrugsconv_factorsconfig') {
                $qry = DB::connection($db_con)
                        ->table('par_controlleddrugsconv_factorsconfig as t1')
                        ->join('par_controlleddrugs_types as t2','t1.controlleddrugs_type_id','t2.id')
                        ->join('par_controlled_drugssubstances as t3','t1.controlled_drugssubstances_id','t3.id')
                        ->join('par_controlleddrugs_basesalts as t4','t1.controlleddrugs_basesalt_id','t4.id')
                        ->select('t1.*', 't2.name as controlleddrugs_type', 't3.name as controlled_drugssubstances', 't4.name as controlleddrugs_basesalt');
            }else if ($table_name == 'par_controlleddrugsannual_ceilingconfig') {
                $qry = DB::connection($db_con)
                        ->table('par_controlleddrugsannual_ceilingconfig as t1')
                        ->join('par_controlleddrugs_types as t2','t1.controlleddrugs_type_id','t2.id')
                        ->join('par_controlled_drugssubstances as t3','t1.controlled_drugssubstances_id','t3.id')
                       
                        ->select('t1.*', 't2.name as controlleddrugs_type', 't3.name as controlled_drugssubstances');
            }else if ($table_name == 'par_checklist_categories') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->leftJoin('par_checklist_category_groups as t2','t1.category_group_id','t2.id')
                        ->select('t1.*', 't2.name as category_group');
            }else if ($table_name == 'tra_applicationinvoicedata_queries' || $table_name == 'wb_applicationinvoicedata_queries') {
                $qry = DB::connection($db_con)
                        ->table($table_name .' as t1')
                        ->join('modules as t4','t1.module_id','=','t4.id')
                        ->leftJoin('sub_modules as t5','t1.sub_module_id','=','t5.id')
                        ->leftJoin('par_sections as t6','t1.section_id','=','t6.id')
                        ->select('t1.*', 't4.name as module_name', 't5.name as sub_module_name', 't6.name as section_name');
            } 
            else{
                $qry = DB::connection($db_con)->table($table_name.' as t1');
            }
             if($table_name =='par_sections'){
                $qry->whereIn('id',[2,4,5,6,7,12]);
            }
           
            if (count((array)$filters) > 0) {
                if($table_name == 'par_countries'){
                    if(isset($filters['id'])){
                        $id = $filters['id'];
                        $qry->where(array('t1.id'=>$id));
                    }
                    if(isset($filters['is_local'])){
                        $qry->where('is_local', 1);
                    }
                }
                else if($table_name == 'par_product_subcategories' && isset($filters['prodclass_category_id'])){
                    $qry->leftJoin('par_prodclass_subcategories as t2','t1.id', 't2.product_subcategory_id')
                        ->select('t1.*')
                        ->where('t2.prodclass_category_id', $filters['prodclass_category_id']);
                }else if($table_name == 'par_classifications' && isset($filters['prodclass_category_id'])){
                    $qry->leftJoin('par_prodcat_classifications as t2','t1.id', 't2.classification_id')
                        ->select('t1.*')
                        ->where('t2.prodclass_category_id', $filters['prodclass_category_id']);
                }else{
                    $qry->where($filters);
                }
            }
            //filter combo remotely
            $query = $request->input('query');
            if($query != ''){
                $qry->where('t1.name', 'like', '%'.$query.'%');
            }
           // $qry->where('t1.is_enabled',1);
           if(!validateIsnumeric($is_config)){
                $qry->where('t1.is_enabled', 1);
            }
            //paginate if set
            $limit = $request->input('limit');
            $start = $request->input('start');
            $total = $qry->count();
            if(isset($start)&&isset($limit)){
                $results = $qry->skip($start)->take($limit)->get();
             }
             else{
                $results=$qry->get();
             }
            $res = array(
                'success' => true,
                'results' => $results,
                'total'=>$total,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getSubmissionEnquiriesApplications(request $req){
      $sub_module_id = $req->sub_module_id;
      $module_id = $req->module_id;
      $filter = $req->filter;
      $status_id = $req->status_id;
      $section_id = $req->section_id;
      if(validateIsNumeric($module_id)){
      $table_name = $this->getTableName($module_id);
      $con=DB::Connection('portal_db');
      $qry=$con->table($table_name.' as t1')
            ->leftJoin('wb_trader_account as t2','t1.trader_id','t2.id')
            ->leftJoin('wb_statuses as t3','t1.application_status_id','t3.id')
            
            ->select(DB::raw("t1.reference_no as Reference_No, t1.tracking_no as Tracking_No,date_format(t1.created_on, '%Y%/%m/%d') as Date_Added, t1.submission_date as Date_Submitted, t2.name as Applicant_Name, t2.postal_address as Applicant_Postal_Address, t2.email as Applicant_Email,t2.contact_person as Contact_Person, t2.telephone_no as Applicant_Telephone, t3.name as Current_Status"));
  
      if(validateIsNumeric($section_id)){
        $qry->where('t1.section_id',$section_id);
      }
      if(validateIsNumeric($sub_module_id)){
        $qry->where('t1.sub_module_id',$sub_module_id);
      }
      if(validateIsNumeric($status_id)){
        $qry->where('t1.application_status_id',$status_id);
      }
  
     $whereClauses = array();
     $filter_string = '';
      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                    switch ($filter->property) {
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'submission_date' :
                          $whereClauses[] = "date_format(t1.submission_date, '%Y%-%m-%d') = '" . formatDate($filter->value) . "'";
                          break;
                      case 'applicant_name' :
                          $whereClauses[] = "t2.name like '%" . ($filter->value) . "%'";
                          break;
                }
            }
          }
  
         $whereClauses = array_filter($whereClauses);
       }
      if (!empty($whereClauses)) 
        {
            $filter_string = implode(' AND ', $whereClauses);
        }
  
      if ($filter_string != '') 
        {
            $qry->whereRAW($filter_string);
        }
  
      
  
       //distinct fields for different modules
      switch ($module_id) {
        case 1:
          $qry->addSelect('t1.product_id');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getProductDetailsFromTable($result->product_id);
  
            $result->Brand_Name = $getDetails['Brand_Name'];
            $result->Product_Strength = $getDetails['Product_Strength'];
            $result->Common_Name = $getDetails['Common_Name'];
            $result->Product_Form = $getDetails['Product_Form'];
  
            unset($result->product_id);
          }
          break;
        case 2:
          $qry->addSelect('t1.premise_id');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getPremiseDetailsFromTable($result->premise_id);
  
            $result->Premise_Name = $getDetails['Premise_Name'];
            $result->Country = $getDetails['Country'];
            $result->Region = $getDetails['Region'];
            $result->Business_Type = $getDetails['Business_Type'];
            $result->Business_Scale = $getDetails['Business_Scale'];
  
            unset($result->premise_id);
          }
          break;
        case 3:
          $qry->addSelect('t1.assessment_type_id','t1.manufacturing_site_id');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getGmpDetailsFromTable($result->manufacturing_site_id, $result->assessment_type_id);
  
            $result->Assessment_procedure = $getDetails['assessment_procedure'];
            $result->Manufacturing_site = $getDetails['manufacturing_site'];
            $result->Premise_reg_no = $getDetails['premise_reg_no'];
            $result->Manufacturer_name = $getDetails['manufacturer_name'];
            $result->Country = $getDetails['country'];
  
            unset($result->assessment_type_id);
            unset($result->manufacturing_site_id);
          }
          break;
        case 4:
          $qry->addSelect('t1.sub_module_id','t1.permit_category_id','t1.import_typecategory_id','t1.permit_reason_id', 't1.port_id');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getIEDetailsFromTable($result->sub_module_id,$result->permit_category_id,$result->import_typecategory_id,$result->permit_reason_id, $result->port_id);
  
            $result->Application_Type = $getDetails['type'];
            $result->Permit_Category = $getDetails['category'];
            $result->Permit_Type_Category = $getDetails['typecategory'];
            $result->Permit_Reason = $getDetails['permitreason'];
            $result->Port = $getDetails['port'];
  
            unset($result->sub_module_id);
            unset($result->permit_category_id);
            unset($result->import_typecategory_id);
            unset($result->permit_reason_id);
            unset($result->port_id);
          }
          break;
        case 7:
          $qry->addSelect('t1.duration_desc','t1.sponsor_id','t1.investigator_id','t1.study_title as Study_Title');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getClinicalTrialDetailsFromTable($result->duration_desc,$result->sponsor_id,$result->investigator_id);
  
            $result->Duration_Desc = $getDetails['duration_desc'];
            $result->Sponsor = $getDetails['Sponsor'];
            $result->Sponsor_Email = $getDetails['Semail_address'];
            $result->Investigator = $getDetails['investigator'];
            $result->Investigator_Email = $getDetails['Iemail_address'];
  
            unset($result->duration_desc);
            unset($result->sponsor_id);
            unset($result->investigator_id);
          }
          break;
        case 14:
          $qry->addSelect('t1.classification_id','t1.sponsor_id','t1.product_type_id');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getPromAdvertDetailsFromTable($result->classification_id,$result->sponsor_id,$result->product_type_id);
  
            $result->Classification = $getDetails['Classification'];
            $result->Sponsor = $getDetails['Sponsor'];
            $result->Sponsor_Email = $getDetails['Semail_address'];
            $result->Product_Type = $getDetails['Product_Type'];
  
            unset($result->classification_id);
            unset($result->sponsor_id);
            unset($result->product_type_id);
          }
          break;
        case 15:
          $qry->addSelect('t1.quantity as Disposal_Quantity','t1.total_weight as Disposal_Weight','t1.market_value as Market_Value','t1.application_code','t1.packaging_unit_id','t1.weights_units_id');
          $results=$qry->get();
  
          foreach ($results as $result) {
            $getDetails = (array) $this->getDisposalDetailsFromTable($result->application_code,$result->packaging_unit_id,$result->weights_units_id);
  
            $result->Destruction_Site = $getDetails['destruction_site'];
            $result->Destruction_Method = $getDetails['destruction_method'];
            $result->Packaging_Unit = $getDetails['packaging_unit'];
            $result->Weight_Unit = $getDetails['weight_unit'];
            $result->Inspector_Name = $getDetails['inspector_name'];
            $result->Inspector_Title = $getDetails['inspector_title'];
  
            unset($result->application_code);
            unset($result->packaging_unit_id);
            unset($result->weights_units_id);
          }
          break;
      }
  
  
      $res = array(
                  'success' => true,
                  'results' => $results,
                  'message' => 'All is well',
      
              );
  
      }else{
         $res = array(
                    'success' => true,
                    'message' => 'No Module defined',
        
                );
     }
    return \response()->json($res);
    }
    public function getOnlineAppsSubmissionCounter(Request $request){
      $user_id = $this->user_id;
      $section_id = $request->input('section_id');
      $module_id = $request->input('module_id');
      $sub_module_id = $request->input('sub_module_id');
      
      $assigned_groups = getUserGroups($user_id);
      $is_super = belongsToSuperGroup($assigned_groups);
  
      $whereClauses = array();
     
      try {
          $assigned_stages = getAssignedProcessStages($user_id, $module_id);
          $qry = DB::table('tra_onlinesubmissions as t1')
              ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
              ->join('modules as t3', 't1.module_id', '=', 't3.id')
              ->join('sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
              ->join('par_sections as t5', 't1.section_id', '=', 't5.id')
              ->join('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
              ->select(DB::raw("t2.name as process_name, t3.name as module_name, t4.name as sub_module_name, t6.name as application_status, t5.name as section_name, count(t1.id) as application_counter"));
              
          if ($is_super) {
              $qry->whereRaw('1=1');
          } else {
              $qry->where(function ($query) use ($user_id, $assigned_stages) {
                  $query->where('usr_to', $user_id)
                      ->orWhereIn('t1.current_stage', $assigned_stages);
              });
          }
          
          if (isset($section_id) && $section_id != '') {
              $qry->where('t1.section_id', $section_id);
          }
          if (isset($module_id) && $module_id != '') {
              $qry->where('t1.module_id', $module_id);
          }
          if (isset($sub_module_id) && $sub_module_id != '') {
              $qry->where('t1.sub_module_id', $sub_module_id);
          }
          
          $qry->groupBy('t1.module_id','t1.sub_module_id', 't1.section_id', 't1.application_status_id');
  
          $results = $qry->get();
          $res = array(
              'success' => true,
              'results' => $results,
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
    /**
     * Display a listing of the resource.
     * @return Response
     */

//    function GetChartProductApplications(request $req){
//        $filters = $this->getProductsSummaryFilters($req);
//         $module_id = $req->module_id;
//         $section_id = $req->section_id;
//         $sub_module_id = $req->sub_module_id;
//         if(!isset($sub_module_id)){
//             $sub_module_id=0;
//         }
//       //get received approved rejected queried <div class="">
//         $where_section = array();
//         if(validateIsNumeric($section_id)){
//         $where_section = array('id'=>$section_id);
//         }
       
//         $data = array();
//         $section_data = DB::table('par_sections')
//         ->where($where_section)
//     ->whereIn('id',[2,4])
//         ->get();

//         $table=$this->getTableName($module_id);

//         foreach($section_data as $sec_data){
//         //second loop for the sub+modules 
//         $section_id = $sec_data->id;
//         $approved_applications = $this->funcGetApprovedApplications($table, $sec_data->id, $sub_module_id,$filters);
//         if($module_id!=6){
//         $data[] = array('section_name'=>$sec_data->name, 
//             'received_applications'=>$this->funcGetReceivedApplications($table, $sec_data->id, $sub_module_id,$filters),
//             'granted_applications'=> $approved_applications['approved'],
//             'rejected'=> $approved_applications['rejected'],
//             'queried'=>$this->funcGetQueriedApplications($table, $sec_data->id, $sub_module_id,$filters),
//             'fast_tracked'=>$this->funcGetFastTrackedApplications($table, $sec_data->id, $sub_module_id,$filters),
//             'query_response'=>$this->funcGetQueryResponseApplications($table, $sec_data->id, $sub_module_id,$filters)
//               );
//           }else{
//             $data[] = array('section_name'=>$sec_data->name, 
//             'received_applications'=>$this->funcGetReceivedApplications($table, $sec_data->id, $sub_module_id,$filters),
//             'granted_applications'=> $approved_applications['approved'],
//             'rejected'=> $approved_applications['rejected'],
//             'queried'=>$this->funcGetQueriedApplications($table, $sec_data->id, $sub_module_id,$filters),
//             'query_response'=>$this->funcGetQueryResponseApplications($table, $sec_data->id, $sub_module_id,$filters)
//               );
//           }
//         }

//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }

//   function getProductsSummaryFilters($req){
//     $filter = $req->input('filters');       
//                $filter_string='';
//                $filters = (array)json_decode($filter);
//                $whereClauses=array();
//                if($filters != ''){
//                 if(isset($filters['to_date']) && isset($filters['from_date'])){
//                   if($filters['to_date']!=null && $filters['from_date']!=null){
//                        $to_date=$filters['to_date'];
//                        $from_date=$filters['from_date'];

//                    foreach ($filters as $key => $value) {

//                     switch ($key) {
//                           case 't1.zone_id' :
//                               if(validateIsNumeric($value)){
//                               $whereClauses[] = "t1.zone_id =" .$value;
//                                 }
//                               break;
//                           case 'receivedOpt' :
//                                   if($value!=''){
//                                     $whereClauses[] = "date_format(t1.".$value.", '%Y%-%m-%d')<='" . formatDate($to_date) . "'";
//                                     $whereClauses[] = "date_format(t1.".$value.", '%Y%-%m-%d')>='" . formatDate($from_date) . "'";
//                                   }
//                                     break; 
//                           case 'approvalOpt' :
//                                  if($value!=''){
//                                     $whereClauses[] = "date_format(t2.".$value.", '%Y%-%m-%d')<='" . formatDate($to_date) . "'";
//                                     $whereClauses[] = "date_format(t2.".$value.", '%Y%-%m-%d')>='" . formatDate($from_date) . "'";
//                                   }
//                                     break; 
//                         }
//                      }
//                    }

//                 }
//                 if (!empty($whereClauses)) {
//                      $filter_string = implode(' AND ', $whereClauses);
//                     }
//                }

             
//           return $filter_string;

//   }
//   function funcGetReceivedApplications($table_name, $section_id, $sub_module_id,$filters){
//             if($sub_module_id!=0){
//             $count = DB::table($table_name.' as t1')
//                      ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//             ->where(array('section_id'=>$section_id, 'sub_module_id'=>$sub_module_id));
//             if($filters!=''){
//               $count->whereRAW($filters);
//             }
//           }else{
//             $count = DB::table($table_name.' as t1')
//                      ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//             ->where('section_id',$section_id);
//             if($filters!=''){
//               $count->whereRAW($filters);
//             }
//           }

//             return $count->count();

//         }
//    function funcGetFastTrackedApplications($table_name, $section_id, $sub_module_id,$filters){

//           if($sub_module_id!=0){
//             $count = DB::table($table_name.' as t1')
//                   ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//                   ->where(array('section_id'=>$section_id, 'sub_module_id'=>$sub_module_id,'is_fast_track'=>1));

//             if($filters!=''){
//               $count->whereRAW($filters);
//             }

//           }else{
//             $count = DB::table($table_name.' as t1')
//                    ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//             ->where(array('section_id'=>$section_id,'is_fast_track'=>1));
//             if($filters!=''){
//               $count->whereRAW($filters);
//             }
//           }

//             return $count->count();

//         }

//   function funcGetApprovedApplications($table_name, $section_id, $sub_module_id,$filters){
//           if($sub_module_id!=0){
//         $qry=DB::table($table_name.' as t1')
//              ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//              ->join('par_approval_decisions as t3','t2.decision_id','t3.id')
//              ->where('t1.sub_module_id',$sub_module_id)
//              ->where('t1.section_id',$section_id)
//              ->select(DB::raw('count(t1.id) as total,t3.id as ID'))
//              ->groupBy('t3.id');
//              if($filters!=''){
//               $qry->whereRAW($filters);
//             }
//            }else{
//             $qry=DB::table($table_name.' as t1')
//              ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//              ->join('par_approval_decisions as t3','t2.decision_id','t3.id')
//              ->where('t1.section_id',$section_id)
//              ->select(DB::raw('count(t1.id) as total,t3.id as ID'))
//              ->groupBy('t3.id');
//              if($filters!=''){
//               $qry->whereRAW($filters);
//             }
//            }
             
//              $all=$qry->get();
//               $approved=0;
//               $rejected=0;

//               foreach($all as  $value) {
//                 $decision=$value->ID;
//                 $total=$value->total;
//                 if($decision==1){
//                   $approved=$total;
//                 }else if($decision==2){
//                   $rejected=$total;
//                 }
//               }
            
//             $data = array('approved'=>$approved,'rejected'=>$rejected);

//             return $data;

//             }
//   function funcGetQueryResponseApplications($table_name,$section_id, $sub_module_id,$filters){

//     //modify filters
//     $filters=str_replace('approval_date','response_received_on',$filters);
//     $filters=str_replace('created_on','response_received_on',$filters);

//          if($sub_module_id != 0){
//         $count=DB::table($table_name.' as t1')
//              ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//              ->where(array('t1.section_id'=>$section_id, 't1.sub_module_id'=>$sub_module_id,'t2.query_type_id'=>2));
//              if($filters!=''){
//               $count->whereRAW($filters);
//             }
//            }else{
//         $count=DB::table($table_name.' as t1')
//              ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//              ->where(array('t1.section_id'=>$section_id,'t2.query_type_id'=>2));
//              if($filters!=''){
//               $count->whereRAW($filters);
//             }
//             } 
//           return $count->count();
            
//            }
//  function funcGetQueriedApplications($table_name,$section_id, $sub_module_id,$filters){
//     //modify filters
//     $filters=str_replace('approval_date','responded_on',$filters);
//     $filters=str_replace('created_on','response_received_on',$filters);

//          if($sub_module_id != 0){
//         $count=DB::table($table_name.' as t1')
//              ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//              ->where(array('t1.section_id'=>$section_id, 't1.sub_module_id'=>$sub_module_id,'t2.query_type_id'=>1));
//              if($filters!=''){
//               $count->whereRAW($filters);
//             }
//            }else{
//        $count=DB::table($table_name.' as t1')
//              ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//              ->where(array('t1.section_id'=>$section_id,'t2.query_type_id'=>1));
//              if($filters!=''){
//               $count->whereRAW($filters);
//             }
//             } 
//           return $count->count();
            
//            }

//   function getTableName($module){

//           $qry=DB::table('modules')
//                 ->where('id',$module)->first();

//           $table=$qry->table_name;

//         return $table;
//    }

// public function getSummaryReports(Request $req){

//         $filters = $this->getProductsSummaryFilters($req);
//         $module_id = $req->module_id;
//         $section_id = $req->section_id;
//         $sub_module_id = $req->sub_module_id;
        
//       //get received approved rejected queried <div class="">
//         $where_section = array();
//         if(validateIsNumeric($section_id)){
//         $where_section = array('id'=>$section_id);
//         }
//         $where_submodule = array();
//         if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//         }

//         $data = array();
//         $section_data = DB::table('par_sections')
//         ->where($where_section)
//     ->whereIn('id',[2,4])
//         ->get();

//         $table=$this->getTableName($module_id);

//         foreach($section_data as $sec_data){
//         //second loop for the sub+modules 
//         $section_id = $sec_data->id;
//         $submod_data = DB::table('sub_modules')
//         ->where($where_submodule)
//         ->where('module_id',$module_id)
//         ->get();

//         foreach($submod_data as $sub_data){
//          $approved_applications = $this->funcGetApprovedApplications($table, $sec_data->id, $sub_data->id,$filters);
//             if($module_id!=6){
//               $data[] = array('Section'=>$sec_data->name, 
//               'sub_module_name'=>$sub_data->name,
//               'received_applications'=>$this->funcGetReceivedApplications($table, $sec_data->id, $sub_data->id,$filters),
//               'granted_applications'=> $approved_applications['approved'],
//               'rejected'=> $approved_applications['rejected'],
//               'queried'=>$this->funcGetQueriedApplications($table, $sec_data->id, $sub_data->id,$filters),
//               'fast_tracked'=>$this->funcGetFastTrackedApplications($table, $sec_data->id, $sub_data->id,$filters),
//               'query_response'=>$this->funcGetQueryResponseApplications($table, $sec_data->id, $sub_data->id,$filters)
//                 );
//             }else{
//               $data[] = array('Section'=>$sec_data->name, 
//               'sub_module_name'=>$sub_data->name,
//               'received_applications'=>$this->funcGetReceivedApplications($table, $sec_data->id, $sub_data->id,$filters),
//               'granted_applications'=> $approved_applications['approved'],
//               'rejected'=> $approved_applications['rejected'],
//               'queried'=>$this->funcGetQueriedApplications($table, $sec_data->id, $sub_data->id,$filters),
//               'query_response'=>$this->funcGetQueryResponseApplications($table, $sec_data->id, $sub_data->id,$filters)
//             );
//             }
//          }
 

        
//       }
//     return json_encode($data);


//    }
//    //payement/revenue details
//    public function getPaymentDetails($module_id,$section_id, $sub_module_id,$req){
//        $filters=$req->filters;
//        $filter_clause[]='';
//        //filters for the payments
//        if(isset($filters)){
//          $prepFilters=json_decode($filters,true);
//          $zone_id=$prepFilters['t1.zone_id'];
//          $to_date=$prepFilters['to_date'];
//          $from_date=$prepFilters['from_date'];
//        }
       
   
//       $qry=DB::table('tra_payments as t1')
//              ->select(DB::raw('sum(t1.amount_paid*t1.exchange_rate) as total,t1.payment_type_id as IDs'))
//              ->groupBy('t1.payment_type_id');

//              if($sub_module_id!=0){
//              $qry->where(array('t1.section_id'=>$section_id, 't1.sub_module_id'=>$sub_module_id, 't1.module_id'=>$module_id));
//               }else{
//              $qry->where(array('t1.section_id'=>$section_id, 't1.module_id'=>$module_id));
//               }

//              if($filters!=''){
//           //   $qry->whereBetween('t1.trans_date',[$from_date,$to_date]);
       
//           $qry->whereRaw("date_format(t1.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//                }
//                if($zone_id!=0){
//                 $qry->where('t1.zone_id',$zone_id);
//                }

//              $all=$qry->get();
//               $payment=0;
//               $credit_notes=0;
//               $retention_payment=0;
            
//               foreach($all as $value) {
//                    $id=$value->IDs;
//                    $total=$value->total;
             
//                 if($id==1){
//                   $payment=$total;
//                 }else if($id==3){
//                   $credit_notes=$total;
//                 }else if($id==2){
//                   $retention_payment=$total;
//                 }
//               }
                
//             $results=array('payment'=>$payment,'retention_payment'=>$retention_payment,'credit_notes'=>$credit_notes);


//              return $results;
//    }
//    public function getGridRevenueReport(request $req){
//        // $filters = $this->getProductsSummaryFilters($req);
//         $module_id = $req->module_id;
//         $section_id = $req->section_id;
//         $sub_module_id = $req->sub_module_id;

        
//       $where_section = array();
//         if(validateIsNumeric($section_id)){
//         $where_section = array('id'=>$section_id);
//         }
//         $where_submodule = array();
//         if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//         }

//         $data = array();
//         $section_data = DB::table('par_sections')
//         ->where($where_section)
    
//     ->whereIn('id',[2,4])
//         ->get();
        
//         foreach($section_data as $sec_data){
//         //second loop for the sub+modules 
//         $section_id = $sec_data->id;
//         $submod_data = DB::table('sub_modules')
//         ->where($where_submodule)
//         ->where('module_id',$module_id)
//         ->get();

//         foreach($submod_data as $sub_data){
//              $payment_types_details=$this->getPaymentDetails($module_id,$sec_data->id, $sub_data->id,$req);
   
//                    $data[] = array(
//                        'Section'=>$sec_data->name, 
//                        'sub_module_name'=>$sub_data->name,
//                        'payments'=>$payment_types_details['payment'],
//                        'retention_payment'=>$payment_types_details['retention_payment'],
//                        'credit_notes'=>$payment_types_details['credit_notes']
//                      );
                  

//                 }

         
//        }
 
//     return json_encode($data);
//    }
//     public function getChatRevenueReport(request $req){
//        // $filters = $this->getProductsSummaryFilters($req);
//         $module_id = $req->module_id;
//         $section_id = $req->section_id;
//         $sub_module_id = $req->sub_module_id;

        
//       $where_section = array();
//         if(validateIsNumeric($section_id)){
//         $where_section = array('id'=>$section_id);
//         }
//         $where_submodule = array();
//         if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//         }

//         $data = array();
//         $section_data = DB::table('par_sections')
//         ->where($where_section)
    
//     ->whereIn('id',[2,4])
//         ->get();
        
//         foreach($section_data as $sec_data){
//         //second loop for the sub+modules 
//         $section_id = $sec_data->id;
//         $submod_data = DB::table('sub_modules')
//         ->where($where_submodule)
//         ->where('module_id',$module_id)
//         ->get();

//              $payment_types_details=$this->getPaymentDetails($module_id,$sec_data->id, 0,$req);
   
//                    $data[] = array(
//                        'Section'=>$sec_data->name, 
//                        'payments'=>$payment_types_details['payment'],
//                        'retention_payment'=>$payment_types_details['retention_payment'],
//                        'credit_notes'=>$payment_types_details['credit_notes'],
//                        //'total'=>$total
//                      );
                  

                

         
//        }
 
//     return json_encode($data);
//    }
// //get all uploaded documents
// public function getAllUploadedDocumentDetails(request $request){
//        $start=$request->start;
//        $limit=$request->limit;
//        $Reference=$request->Reference;
//        $module_id=$request->module_id;
//        $doc_type=$request->doc_type;
//        $sub_module_id=$request->sub_module_id;
       
//        $qry=DB::table('tra_application_uploadeddocuments as t1')
//              ->leftJoin('tra_documentmanager_application as t3','t1.document_requirement_id','t3.id')
//              ->leftJoin('tra_application_documentsdefination as t44','t1.application_code','t44.application_code')
//              ->leftJoin('wb_trader_account as t4','t1.uploaded_by','t4.id')
//              ->leftJoin('par_document_types as t5','t3.document_type_id','t5.id')
//              ->leftJoin('modules as t6','t3.module_id','t6.id')
//              ->leftJoin('sub_modules as t7','t3.module_id','t7.id')
//              ->select('t1.application_code','t44.reference_no','t1.file_name','t1.initial_file_name','t1.file_type','t1.remarks','t1.uploaded_on','t5.name as document_type','t4.name as uploaded_by','t6.name as module_name','t7.name as sub_module_name');

       
      
//        $where_clause = array();
//        $filter_string = '';
//        if(validateIsNumeric($doc_type)){
//          $where_clause[]="t3.document_type_id =". $doc_type; 

//         }
//         if(validateIsNumeric($module_id)){
//          $where_clause[]="t3.module_id =". $module_id; 

//         }
//         if(validateIsNumeric($sub_module_id)){
//          $where_clause[]="t3.sub_module_id =". $sub_module_id; 

//         }
//         if(isset($Reference)){
//        $where_clause[]="(t44.reference_no LIKE '%".$Reference."%' OR t44.tracking_no LIKE '%".$Reference."%') ";
        
//         }
//         $whereClauses = array_filter($where_clause);
//          if (!empty($whereClauses)) {
//                         $filter_string = implode(' AND ', $whereClauses);
//                     }
//          if ($filter_string != '') {
//                 $qry->whereRAW($filter_string);
//                       }
        
//             $results = $qry->skip($start)->take($limit)->get();
            
//             $total=$qry->count();
//             $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well',
//                 'totalResults'=>$total
//             );
//   return \response()->json($res);
// }
// //uploaded document by module
// public function getUploadedDocumentDetails(request $request){
//        $start=$request->start;
//        $limit=$request->limit;
//        $Reference=$request->Reference;
//        $module_id=$request->module_id;
//        $doc_type=$request->doc_type;
//        $application_code=$request->application_code;

//        $table=$this->getTableName($module_id);
       
//        if(isset($Reference) || isset($doc_type)){
//        $qry=DB::table($table.' as t1')
//              ->join('tra_application_uploadeddocuments as t2','t1.application_code','t2.application_code')
//              ->leftJoin('tra_documentmanager_application as t3','t2.document_requirement_id','t3.id')
//              ->leftJoin('wb_trader_account as t4','t2.uploaded_by','t4.id')
//              ->leftJoin('par_document_types as t5','t3.document_type_id','t5.id')
//              ->select('t1.application_code','t1.reference_no','t2.node_ref','t2.file_name','t2.initial_file_name','t2.file_type','t2.remarks','t2.uploaded_on','t5.name as document_type','t4.name as uploaded_by','t5.name as doc_type');

       
      
//        $where_clause = array();
//        $filter_string = '';
//        if(isset($doc_type)){
//          $where_clause[]="t3.document_type_id =". $doc_type; 

//         }
//         if(isset($Reference)){
//        $where_clause[]="(t1.reference_no = '".$Reference."' OR t1.tracking_no = '".$Reference."') ";
        
//         }
//         $whereClauses = array_filter($where_clause);
//          if (!empty($whereClauses)) {
//                         $filter_string = implode(' AND ', $whereClauses);
//                     }
//          if ($filter_string != '') {
//                 $qry->whereRAW($filter_string);
//                       }
       
//             $results = $qry->get();
            
//             $total=$qry->count();
//             $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well',
//                 'totalResults'=>$total
//             );
//         }else{
//           $res=array(
//               'success'=>false,
//               'results'=>null,
//               'message'=>'No filters set'
//           );
//         }
//   return \response()->json($res);
// }


// public function getArrayColumns($array){
//   $temp=array();
//   if(!empty($array[1])){
//       foreach ($array[1] as $key=>$udata){
//       //
//         //  $temp[]=strtoupper(str_replace("_"," ",strtoupper($key)));
//       $temp[] =$key;
//           }
//     }
//   else if(!empty($array[0])){
//     foreach ($array[0] as $key=>$udata){
//         $temp[]=$key;
//         }
//     }
  
//   return $temp;
   
//    }



   
//    public function exportPaymentDetails(request $request) {

//     //get data variables
//     $module_id = $request->module_id;
//     $section_id = $request->section_id;
//     $sub_module_id = $request->sub_module_id;
//     $zone_id = $request->issueplace;
//     $to_date=$request->to_date;
//     $from_date=$request->from_date;
//     $revenue_types=$request->revenue_types;
//     $classification=$request->Classification;
//     $filename=$request->filename;
  
//   if($filename == 'PaymentReversalSummaryReport'){
//     $payment_table = 'tra_payments_reversals';
//      $heading="DETAILED REPORT OF ALL PAYMENTS REVERSALS";
//   }else{
//     $payment_table = 'tra_payments';
//      $heading="DETAILED REPORT OF ALL PAYMENTS DONE";
//   }


//     $qry=DB::table($payment_table.' as t1')
       
//          ->leftJoin('par_currencies as t5','t1.currency_id','t5.id')
//          ->leftJoin('tra_application_invoices as t6','t1.invoice_id','t6.id')
//          ->leftJoin('par_sections as t7','t1.section_id','t7.id')
//          ->leftJoin('modules as t8','t1.module_id','t8.id')
//          ->leftJoin('sub_modules as t9','t1.sub_module_id','t9.id')
//          ->leftJoin('par_payment_modes as t10','t1.payment_mode_id','t10.id')
//          ->leftJoin('par_banks as t11','t1.bank_id','t11.id')
//          ->leftJoin('par_zones as t12','t1.zone_id','t12.id')
//          ->select(DB::raw('t1.applicant_name,t1.receipt_no,t1.trans_ref,t1.drawer,t1.PayCtrNum,t1.payment_ref_no,t1.transaction_id,t1.pay_phone_no,t6.invoice_no,t6.tracking_no,t6.reference_no,t7.name as section_name,t8.name as module_name,t9.name as sub_module_name,t1.amount_paid,t5.name as Currency,t1.exchange_rate,t10.name as Payment_mode,t11.name as Bank,t1.trans_date,t12.name as zone,(t1.amount_paid*t1.exchange_rate) as Total_Amount_Tsh'));
           
//            //sub modules
//           if(validateIsNumeric($sub_module_id)){
//            $qry->where('t1.sub_module_id',$sub_module_id);
//             }
//           if(validateIsNumeric($section_id)){
//               $qry->where('t1.section_id',$section_id);
//             }
//           if(validateIsNumeric($zone_id)){
//               $qry->where('t1.zone_id',$zone_id);
//             }
//              if(isset($revenue_types)){
//                 if($revenue_types=='All Payments'){
//                      $qry->where('t1.payment_type_id','!=',1);
//                      $qry->orWhere('t1.payment_type_id','!=',2);
//                 }
//                 if($revenue_types=='All Payments(Exclusive of Retentions)'){
//                      $qry->where('t1.payment_type_id','!=',1);
//                 }
               
//             }
//       else{
//         $qry->where('t1.payment_type_id','!=',3);
//       }
//              if(validateIsNumeric($classification)){
//               $qry->where('t3.classification_id',$classification);
//             }

//              if(validateIsNumeric($classification)){
//               $qry->where('t3.classification_id',$classification);
//             }
//              if(validateIsNumeric($module_id)){
//               $qry->where('t1.module_id',$module_id);
//             }
          
//           if(isset($to_date)&&isset($from_date)){
//            $qry->whereRAW("date_format(t1.trans_date, '%Y%-%m-%d')>='" . formatDate($from_date) . "' AND date_format(t1.trans_date, '%Y%-%m-%d')<='" . formatDate($to_date). "'");
//                }

//     //send request to function
//  $products=$qry->get();
//    //get set headers and encode them to an array
   
//  $header=$this->getArrayColumns($products); 
 
//     $k=0;
//     $sortedData=array();
//     $total=count($header);
//     //convert to allowed format
//     foreach ($products as $udata)
//       {
//              for($v=0;$v<$total;$v++){
//              $temp1=$header[$v];
//              $sortedData[$k][]=$udata->$temp1;

//         }
         
//         $k++;  
//        }
   
  
//     $export = new GridExport($sortedData,$header,$heading);

//     $file=Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
   
// $response =  array(
//    'name' => "Payments.xlsx", //no extention needed
//    'file' => "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,".base64_encode($file) //mime type of used format
// );

// return response()->json($response);
  
//       }

//   // public function getProductSubmissionDatesIntervals($section,$sub_module,$classification,$type,$filters,$lower_limit,$upper_limit,$from_date,$to_date,$to_opt,$from_opt,$opt){
    
//   //      $qry=DB::table('tra_product_applications as t1')
//   //           ->join('tra_product_information as t2','t1.product_id','t2.id')
//   //           ->where(array('t1.section_id'=>$section,'t1.sub_module_id'=>$sub_module,'t2.classification_id'=>$classification,'t2.product_type_id'=>$type));
            
//   //       if($upper_limit!=0){
//   //            $qry->whereRAW("TOTAL_WEEKDAYS((SELECT process_date FROM tra_applications_processdefinations q WHERE q.application_code=t1.application_code AND q.appprocess_defination_id='".$from_opt."' AND date_format(q.process_date, '%Y%-%m-%d') >= '".formatDate($from_date)."' ORDER BY q.id ".$opt." LIMIT 1),(SELECT process_date FROM tra_applications_processdefinations q2 WHERE q2.application_code=t1.application_code AND q2.appprocess_defination_id='".$to_opt."' AND date_format(q2.process_date, '%Y%-%m-%d') < '".formatDate($to_date)."' ORDER BY q2.id ".$opt." LIMIT 1)) BETWEEN ".$lower_limit." AND ".$upper_limit."");
            
//   //          }else{
//   //            $qry->whereRAW("TOTAL_WEEKDAYS((SELECT process_date FROM tra_applications_processdefinations q WHERE q.application_code=t1.application_code AND q.appprocess_defination_id='".$from_opt."' AND date_format(q.process_date, '%Y%-%m-%d') >= '".formatDate($from_date)."' ORDER BY q.id ".$opt." LIMIT 1),(SELECT process_date FROM tra_applications_processdefinations q2 WHERE q2.application_code=t1.application_code AND q2.appprocess_defination_id='".$to_opt."' AND date_format(q2.process_date, '%Y%-%m-%d') < '".formatDate($to_date)."' ORDER BY q2.id ".$opt." LIMIT 1)) > ".$lower_limit."");
//   //          }

//   //           if($filters!=''){
//   //             $qry->whereRAW($filters);
//   //           }
         
            
//   //           $total=$qry->count();
       
//   //           return $total;


 
//   // }

//   // public function ageAnalysisDatelimiter($module,$section,$sub_module,$classification,$type,$filters,$from_date,$to_date,$to_opt,$from_opt,$opt){
//   //        $data_span=DB::table('par_ageanalysisdays_span')
//   //             ->where('module_id',$module)
//   //             ->get();
//   //         $order_array=array();
//   //         foreach ($data_span as $span) {
//   //           $order=$span->order_no;
//   //           $lower_limit=$span->min_days;
//   //           $upper_limit=$span->max_days;
//   //           $order_array[]=[$order." " => $this->getProductSubmissionDatesIntervals($section,$sub_module,$classification,$type,$filters,$lower_limit,$upper_limit,$from_date,$to_date,$to_opt,$from_opt,$opt)];
//   //         }
         
//   //         return $order_array;
//   //        // return array_filter($order_array);    
//   // }

//   //   public function getAgeAnalysis(request $req){
//   //       $module_id = $req->module_id;
//   //       $section_id = $req->section_id;
//   //       $sub_module_id = $req->sub_module_id;
//   //       $zone_id = $req->zone_id;
//   //       $to_date = $req->to_date;
//   //       $from_date = $req->from_date;
//   //       $to_opt = $req->to_opt;
//   //       $from_opt = $req->from_opt;
//   //       $opt = $req->opt;
//   //       $queried_type=$req->queried_type;
        
//   //       //prepare filters
//   //       $whereClauses=array();
//   //       $filters='';
//   //       if(validateIsNumeric($zone_id)){
//   //         $whereClauses[]="t1.zone_id = ".$zone_id;
//   //       }
//   //       if(validateIsNumeric($sub_module_id)){
//   //         $whereClauses[]="t1.sub_module_id = ".$sub_module_id;
//   //       }
//   //       if(validateIsNumeric($section_id)){
//   //         $whereClauses[]="t1.section_id = ".$section_id;
//   //       }
//   //       if(validateIsNumeric($queried_type)){
//   //         $whereClauses[]="t1.last_query_ref_id = ".$queried_type;
//   //       }
//   //        if (!empty($whereClauses)) {
//   //                    $filters = implode(' AND ', $whereClauses);
//   //                   }
        
//   //       $where_section = array();
//   //       if(validateIsNumeric($section_id)){
//   //       $where_section = array('id'=>$section_id);
//   //       }
//   //       $where_submodule = array();
//   //       if(validateIsNumeric($sub_module_id)){
//   //       $where_submodule = array('id'=>$sub_module_id);
//   //       }

//   //       $data = array();
//   //       $final_Array=array();

//   //       $section_data = DB::table('par_sections')
//   //       ->where($where_section)
//   //       ->get();
//   //    //  $table=$this->getTableName($module_id);
        
//   //       foreach($section_data as $sec_data){
//   //       //second loop for the sub+modules 
//   //       $section_id = $sec_data->id;
//   //       $submod_data = DB::table('sub_modules')
//   //       ->where($where_submodule)
//   //       ->where('module_id',$module_id)
//   //       ->get();
        
//   //       //sub modules data for third loop
//   //         foreach ($submod_data as $sub_data) {
            
//   //       // classification for forth loop
//   //           $class_data=DB::table('par_classifications')
//   //             ->where('section_id',$section_id)
//   //             ->get();
//   //               foreach ($class_data as $c_data) {
                  

//   //                  //for all product types
//   //                  $product_types_data=DB::table('par_product_types')->get();
//   //                    foreach ($product_types_data as $type) {
//   //                       $span_array=$this->ageAnalysisDatelimiter($module_id,$sec_data->id,$sub_data->id,$c_data->id,$type->id,$filters,$from_date,$to_date,$to_opt,$from_opt,$opt);
                        
//   //                       if(!empty($span_array)){
//   //                           $classification=$c_data->name;
//   //                           $sub_module=$sub_data->name;
//   //                           $section=$sec_data->name;
//   //                           $prod_type=$type->name;
//   //                           $data=[
//   //                            'section'=>$section,
//   //                            'sub_module'=>$sub_module,
//   //                            'classification'=>$classification,
//   //                            'product_type'=>$prod_type
//   //                           ];

//   //                           //convert array of arrays to a single array
//   //                         $span_array=call_user_func_array('array_merge',$span_array);
//   //                         //get total and add it to the array
//   //                         $total=0;
//   //                          foreach ($span_array as $key => $value) {
//   //                            $temp=$total+$value;
//   //                            $total=$temp;
//   //                          }
//   //                          $span_array+=['total'=>$total];
//   //                           //combine the array to a favourable format
//   //                         $final_Array[]=array_merge($span_array,$data);
//   //                       }
//   //                    }

//   //               }
//   //             }
//   //           }

           
          
//   // return json_encode($final_Array);

//   //   }

//     public function exportSummaryAgeAnalysis(request $request){
//        //get data variables
//         $module_id = $request->module_id;
//         $section_id = $request->section_id;
//         $sub_module_id = $request->sub_module_id;
//         $zone_id = $request->zone_id;
//         $to_date = $request->to_date;
//         $from_date = $request->from_date;
//         $to_opt = $request->to_opt;
//         $from_opt = $request->from_opt;
//         $queried_type=$request->queried_type;
//         $product_type=$request->product_type;
//         $classification=$request->classification;

//       $qry=DB::table('tra_payments as t1')
//            ->leftJoin('tra_product_applications as t2','t1.application_code','t2.application_code')
//            ->leftJoin('tra_product_information as t3','t2.product_id','t3.id')
//            ->leftJoin('par_common_names as t4','t3.common_name_id','t4.id')
//            ->leftJoin('par_currencies as t5','t1.currency_id','t5.id')
//            ->leftJoin('tra_application_invoices as t6','t1.invoice_id','t6.id')
//            ->leftJoin('par_sections as t7','t1.section_id','t7.id')
//            ->leftJoin('modules as t8','t1.module_id','t8.id')
//            ->leftJoin('sub_modules as t9','t1.sub_module_id','t9.id')
//            ->leftJoin('par_payment_modes as t10','t1.payment_mode_id','t10.id')
//            ->leftJoin('par_banks as t11','t1.bank_id','t11.id')
//            ->leftJoin('par_zones as t12','t1.zone_id','t12.id')
//            ->select(DB::raw('t3.brand_name,t4.name as Common_name,t1.applicant_name,t1.receipt_no,t1.trans_ref,t1.drawer,t1.PayCtrNum,t1.payment_ref_no,t1.transaction_id,t1.pay_phone_no,t6.invoice_no,t6.tracking_no,t6.reference_no,t7.name as section_name,t8.name as module_name,t9.name as sub_module_name,t1.amount_paid,t5.name as Currency,t1.exchange_rate,t10.name as Payment_mode,t11.name as Bank,t1.trans_date,t12.name as zone,(t1.amount_paid*t1.exchange_rate) as Total_Amount_Tsh'));
             
//              //sub modules
//             if(validateIsNumeric($sub_module_id)){
//              $qry->where('t1.sub_module_id',$sub_module_id);
//               }
//             if(validateIsNumeric($section_id)){
//                 $qry->where('t1.section_id',$section_id);
//               }
//             if(validateIsNumeric($zone_id)){
//                 $qry->where('t1.zone_id',$zone_id);
//               }
//               if(validateIsNumeric($queried_type)){
//                 $qry->where('t2.last_query_ref_id',$queried_type);
//               }
//               if(validateIsNumeric($product_type)){
//                 $qry->where('t2.product_type_id',$product_type);
//               }
              
//               if(validateIsNumeric($classification)){
//                 $qry->where('t3.classification_id',$classification);
//               }
           
//      //mabdatory filters
//              $qry->where('t1.module_id',$module_id);
//              $qry->whereRAW("date_format(t1.trans_date, '%Y%-%m-%d')>='" . formatDate($from_date) . "' AND date_format(t1.trans_date, '%Y%-%m-%d')<='" . formatDate($to_date). "'");

 
//                   //send request to function
//              $products=$qry->get();
//                  //get set headers and encode them to an array
               
//              $header=$this->getArrayColumns($products); 
             
//                   $k=0;
//                   $sortedData=array();
//                   $total=count($header);
//                   //convert to allowed format
//                   foreach ($products as $udata)
//                         {
//                                    for($v=0;$v<$total;$v++){
//                                    $temp1=$header[$v];
//                                    $sortedData[$k][]=$udata->$temp1;

//                             }
                           
//                             $k++;  
//                        }
                 
//                  $heading="DETAILED REPORT OF ALL PAYMENTS DONE";
//                   $export = new GridExport($sortedData,$header,$heading);

//                   $file=Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
                 
//             $response =  array(
//                'name' => "SummaryReportAgeAnalysisReport.xlsx", //no extention needed
//                'file' => "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,".base64_encode($file) //mime type of used format
//             );
//             return response()->json($response);
  
//         }


//   //revenue reports
//      public function getRevenueDetails($module_id,$section_id, $sub_module_id,$req){
//        $zone_id=$req->zone_id;
//        $to_date=formatDate($req->to_date);
//        $from_date=formatDate($req->from_date);
    
//       $qry=DB::table('tra_payments as t1')
//              ->select(DB::raw('sum(t1.amount_paid*t1.exchange_rate) as total,t1.payment_type_id as IDs'));
//             // ->groupBy('t1.payment_type_id');
      

//              if($sub_module_id!=0){
//              $qry->where(array('t1.section_id'=>$section_id, 't1.sub_module_id'=>$sub_module_id));
//               }else{
//              $qry->where(array('t1.section_id'=>$section_id, 't1.module_id'=>$module_id));
//               }

//              if(validateIsNumeric($zone_id)){
//                  $qry->where('t1.zone_id',$zone_id);
//                }

//              if(isset($to_date)&&isset($from_date)){
//                 //  $qry->whereBetween('t1.trans_date',[$from_date,$to_date]);
//                   $qry->whereRaw("date_format(t1.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//                 }

//              $all=$qry->whereIn('t1.payment_type_id',[1,2])->get();
//               $payment=0;
//               $credit_notes=0;
//               $retention_payment=0;

//               foreach($all as $value) {
//                    $id=$value->IDs;
//                    $total=$value->total;
             
//                 if($id==1 || $id==2){
//                   $payment=$total;
//                 }
                
        
//                 else if($id==3){
//                   $credit_notes=$total;
//                 }
//               }
                
//             $results=array('payment'=>$payment,'retention_payment'=>$retention_payment,'credit_notes'=>$credit_notes);


//              return $results;

//    }
//     public function getRevenueSummaryReports(request $request){
        
//         $module_id=$request->module_id;
//         $section_id=$request->section_id;
//         $sub_module_id=$request->sub_module_id;
//         $zone_id=$request->zone_id;

       

//         $where_section = array();
//         if(validateIsNumeric($section_id)){
//         $where_section = array('id'=>$section_id);
//         }
     
//         $where_submodule = array();
//         if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//         }

//         $where_module = array();
//         if(validateIsNumeric($module_id)){
//         $where_module = array('id'=>$module_id);
//         }
 
//         $data=array();
//         $module_data = DB::table('modules')
//         ->where($where_module)
//     ->where('modhas_payment_processing',1)
//         ->get();
       
//           //loop the modules for sub modules
//           foreach ($module_data as $mod_data) {
// $module_id = $mod_data->id;
//             $submod_data = DB::table('sub_modules')
//               ->where($where_submodule)
//               ->where('module_id',$mod_data->id)
//         ->where('has_payment_processing',1)
//               ->get();

//                  //loop the sub modules for sections
//                 foreach ($submod_data as $sub_data) {
          
          
//           if($module_id == 7){
//                              $section_data = DB::table('par_sections')
//                                           ->where($where_section)
//                                           ->whereIn('id',[5])
//                                           ->get();
//                         }
//             else if($module_id==17){
//               $section_data = DB::table('par_sections')
//                                           ->where($where_section)
//                                           ->whereIn('id',[2,4,5,6,12])
//                                           ->get();
//             }
//                         else{
//                              $section_data = DB::table('par_sections')
//                                           ->where($where_section)
//                                           ->whereIn('id',[2,4])
//                                           ->get();
//                         }
                
//                     //loop section data
//                     foreach ($section_data as $sec_data) {

//                        $payment_types_details=$this->getRevenueDetails($mod_data->id,$sec_data->id, $sub_data->id,$request);
//                        $data[] = array(
//                            'Section'=>$sec_data->name, 
//                            'Module'=>$mod_data->name, 
//                            'sub_module_name'=>$sub_data->name,
//                            'payments'=>$payment_types_details['payment'],
//                            'retention_payment'=>$payment_types_details['retention_payment'],
//                            'credit_notes'=>$payment_types_details['credit_notes']
//                          );
//                     }
//                 }
//           }

//        return json_encode($data);
//     }
    
// //reversal payment applicationis
//       public function getPaymentReversalDetails($module_id,$section_id, $sub_module_id,$req){
//        $zone_id=$req->zone_id;
//        $to_date=$req->to_date;
//        $from_date=$req->from_date;
//        $Total=0;
//        $reversals=0;
//        $requests=0;
//        $where=array();
       
//        $table_name=$this->getTableName($module_id);

//        if($sub_module_id!=0){
//              $where[]=array('t1.section_id'=>$section_id, 't1.sub_module_id'=>$sub_module_id, 't1.module_id'=>$module_id);
//            }else{
//             $where[]=array('t1.section_id'=>$section_id, 't1.module_id'=>$module_id);
//          }
//        if(validateIsNumeric($zone_id)){
//            $where[]=array('t1.zone_id'=>$zone_id);
//          }


//       $totalqry=DB::table('tra_payments_reversals as t1')
//              ->select(DB::raw('sum(t1.amount_paid*t1.exchange_rate) as total'));

//              $totalqry->where(array($where));
//                 if(isset($to_date)&&isset($from_date)){
//                //     $totalqry->whereBetween('t1.trans_date',[$from_date,$to_date]);
//            $totalqry->whereRaw("date_format(t1.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//                   }

//              $reversalscounterqry=DB::table('tra_payments_reversals as t1');
//              $reversalscounterqry->where(array($where));
//                 if(isset($to_date)&&isset($from_date)){
//                    // $reversalscounterqry->whereBetween('t1.trans_date',[$from_date,$to_date]);
//            $reversalscounterqry->whereRaw("date_format(t1.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//                   }

//              $requestcounterqry=DB::table('tra_paymentreversal_requests as t2')
//                                 ->leftJoin($table_name.' as t1','t2.application_code','t1.application_code')
//                                 ->groupBy('t2.application_code');
//                 $requestcounterqry->where(array($where));
//                 if(isset($to_date)&&isset($from_date)){
//                   //  $requestcounterqry->whereBetween('t2.requested_on',[$from_date,$to_date]);
//            $requestcounterqry->whereRaw("date_format(t2.requested_on, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//                   }

//              $total=$totalqry->get();
//               foreach($total as $value) {
//                  $Total=$value->total+$Total;
//               }

//               $reversals=$reversalscounterqry->get()->count();
//               $requests=$requestcounterqry->get()->count();

//             $results=array('total'=>$Total,'reversals'=>$reversals,'requests'=>$requests);


//              return $results;

//    }

//     public function getPaymentReversalsSummaryReports(request $request){
        
//         $module_id=$request->module_id;
//         $section_id=$request->section_id;
//         $sub_module_id=$request->sub_module_id;
//         $zone_id=$request->zone_id;

       

//         $where_section = array();
//         if(validateIsNumeric($section_id)){
//         $where_section = array('id'=>$section_id);
//         }
     
//         $where_submodule = array();
//         if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//         }

//         $where_module = array();
//         if(validateIsNumeric($module_id)){
//         $where_module = array('id'=>$module_id);
//         }
 
//         $data=array();
//         $modules = DB::table('modules')
//         ->where($where_module);
//         if(empty($where_module)){
//           $modules->whereRAW('id IN (1,2,3,4,5,7,14,15)');
//         }

//         $module_data=$modules->get();
       
//           //loop the modules for sub modules
//           foreach ($module_data as $mod_data) {

//             $submod_data = DB::table('sub_modules')
//               ->where($where_submodule)
//               ->where('module_id',$mod_data->id)
//               ->get();

//                  //loop the sub modules for sections
//                 foreach ($submod_data as $sub_data) {

//                  $section_data = DB::table('par_sections')
//                   ->where($where_section)
//                   ->get();
//                     //loop section data
//                     foreach ($section_data as $sec_data) {

//                        $payment_types_details=$this->getPaymentReversalDetails($mod_data->id,$sec_data->id, $sub_data->id,$request);
//                        $data[] = array(
//                            'Section'=>$sec_data->name, 
//                            'Module'=>$mod_data->name, 
//                            'sub_module_name'=>$sub_data->name,
//                            'reversal_requests'=>$payment_types_details['requests'],
//                            'handled_request'=>$payment_types_details['reversals'],
//                            'amount_reversed'=>$payment_types_details['total']
//                          );
//                     }
//                 }
//           }

//        return json_encode($data);
//     }
// //dailry transactions
//     public function getDailyFinanceTrans(request $req){

//        $qry= DB::table('tra_payments as t1')
//             ->leftJoin('par_currencies as t2','t1.currency_id','t2.id')
//             ->leftJoin('par_receipt_types as t3','t1.receipt_type_id','t3.id')
//             ->leftJoin('tra_application_invoices as t4','t1.invoice_id','t4.id')
//             ->leftJoin('par_payment_types as t5','t1.payment_type_id','t5.id')
//             ->leftJoin('par_payment_modes as t6','t1.payment_mode_id','t6.id')
//             ->leftJoin('par_banks as t7','t1.bank_id','t7.id')
//             ->select(DB::raw('t1.receipt_no,t1.applicant_name,t1.trans_date,t1.trans_ref,t1.drawer,t1.PayCtrNum,t1.amount_paid as amt_paid,t1.payment_ref_no,t1.pay_phone_no as pay_phn,t1.exchange_rate,t2.name as currency,t3.name as receipt_type,t4.invoice_no,t5.name as payment_type,t6.name as payment_mode,t7.name as bank,(t1.amount_paid*t1.exchange_rate) as total'));


//             //filters
//           $to_date=$req->to_date;
//           $from_date=$req->from_date;
//           $module_id=$req->module_id;
//           $section_id=$req->section_id;
//           $sub_module_id=$req->sub_module_id;
//           $start=$req->start;
//           $limit=$req->limit;

//           if(validateIsNumeric($module_id)){
//                $qry->where('t1.module_id',$module_id);
//           }
//           if(validateIsNumeric($sub_module_id)){
//                $qry->where('t1.sub_module_id',$sub_module_id);
//           }
//           if(validateIsNumeric($section_id)){
//                $qry->where('t1.section_id',$section_id);
//           }

//           if(isset($to_date) && isset($from_date)){
//             //   $qry->whereBetween('t1.trans_date',[$from_date,$to_date]);
//           $qry->whereRaw("date_format(t1.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//           }
//           $filter = $req->input('filter');
//                $whereClauses = array();
//                $filter_string = '';
//                 if (isset($filter)) {
//                     $filters = json_decode($filter);
//                     if ($filters != NULL) {
//                         foreach ($filters as $filter) {
//                             switch ($filter->property) {
//                                 case 'trans_ref' :
//                                     $whereClauses[] = "t1.trans_ref like '%" . ($filter->value) . "%'";
//                                     break;
//                                 case 'payment_ref_no' :
//                                     $whereClauses[] = "t1.payment_ref_no like '%" . ($filter->value) . "%'";
//                                     break;
//                                 case 'applicant_name' :
//                                     $whereClauses[] = "t1.applicant_name like '%" . ($filter->value) . "%'";
//                                     break;
//                                 case 'invoice_no' :
//                                     $whereClauses[] = "t4.invoice_no like '%" . ($filter->value) . "%'";
//                                     break;
//                                 case 'bank' :
//                                     $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
//                                     break;
//                                  }
//                         }
//                         $whereClauses = array_filter($whereClauses);
//                     }
//                     if (!empty($whereClauses)) {
//                         $filter_string = implode(' AND ', $whereClauses);
//                     }
//                 }

//               if ($filter_string != '') {
//                 $qry->whereRAW($filter_string);
//                       }

//           //pagination
//         if(isset($start)&&isset($limit)){
//               $results=$qry->skip($start)->take($limit)->get();
//             }else{
//                $results=$qry->get(); 
//             }

//            //response
//         return json_encode($results);

//     }

//     public function getGLCodedRevenueReport(request $req){

//        $qry=DB::table('payments_references as t1')
//       ->join('tra_payments as t2','t1.receipt_id','t2.id')
//       ->leftJoin('element_costs as t3','t1.element_costs_id','t3.id') 
//       ->leftJoin('par_gl_accounts as t4','t3.gl_code_id','t4.id') 
//       ->select(DB::raw('DISTINCT t1.id,sum(t1.amount_paid*t1.exchange_rate) as gl_codeamount, t4.code as GL_Code , t4.name as description, t4.tfda_code  as GL_Code_Reference'));
//       $qry->groupBy('t4.id');
      
//   //filters
//           $to_date=formatDate($req->to_date);
//           $from_date=formatDate($req->from_date);
//           $zone_id = $req->zone_id;
//           $section_id=$req->section_id;
//           $gl_account=$req->gl_account;
          
//           if(validateIsNumeric($zone_id)){
//                $qry->where('t2.zone_id',$zone_id);
//           }

//           if(validateIsNumeric($gl_account)){
//                $qry->where('t3.gl_code_id',$gl_account);
//           }

//           if(validateIsNumeric($section_id)){
//                $qry->where('t2.section_id',$section_id);
//           }

//           if(isset($to_date) && isset($from_date)){
//              //   $qry->whereBetween('t1.paid_on',[formatDate($from_date),formatDate($to_date)]);
        
//           $qry->whereRaw("date_format(t2.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//           }
//           $filter = $req->input('filter');
//                $whereClauses = array();
//                $filter_string = '';
//                 if (isset($filter)) {
//                     $filters = json_decode($filter);
//                     if ($filters != NULL) {
//                         foreach ($filters as $filter) {
//                             switch ($filter->property) {
//                                 case 'GL_Code' :
//                                     $whereClauses[] = "t4.tfda_code like '%" . ($filter->value) . "%'";
//                                     break;
//                                  }
//                         }
//                         $whereClauses = array_filter($whereClauses);
//                     }
//                     if (!empty($whereClauses)) {
//                         $filter_string = implode(' AND ', $whereClauses);
//                     }
//                 }

//               if ($filter_string != '') {
//                 $qry->whereRAW($filter_string);
//                       }

//         $results=$qry->get();

//            //response
//         return json_encode($results);

//     }

//      public function ExportGLCodedReport(request $req)
//     {
//         $qry=DB::table('payments_references as t1')
//             ->join('element_costs as t2','t1.element_costs_id','t2.id') 
//             ->join('par_gl_accounts as t3','t2.gl_code_id','t3.id') 
//             ->leftJoin('cost_elements as t5','t2.element_id','t5.id')
//             ->leftJoin('par_currencies as t6','t1.currency_id','t6.id')
//             ->join('tra_payments as t8','t1.receipt_id','t8.id')
//             ->select(DB::raw('t3.name as Gl_Code,t3.description as Description,t3.tfda_code as GL_Code_Reference,t8.reference_no,t8.tracking_no,t8.receipt_no,t5.name as Element,t1.amount_paid,t6.name as Currency,t1.exchange_rate as Exchange_Rate,(t1.amount_paid*t1.exchange_rate) as Total'));
//           //filters
//           $to_date=$req->to_date;
//           $from_date=$req->from_date;
//           $zone_id=$req->zone_id;
//           $section_id=$req->section_id;
//           $gl_account=$req->gl_account;
         

//           if(validateIsNumeric($gl_account)){
//                $qry->where('t2.gl_code_id',$gl_account);
//           }

//           if(validateIsNumeric($zone_id)){
//                $qry->where('t8.zone_id',$zone_id);
//           }

//           if(validateIsNumeric($section_id)){
//                $qry->where('t8.section_id',$section_id);
//           }

//           if(isset($to_date) && isset($from_date)){
//               // $qry->whereBetween('t1.paid_on',[formatDate($from_date),formatDate($to_date)]);
         
//           $qry->whereRaw("date_format(t1.paid_on, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//           }
//           $filter = $req->input('filter');
//                $whereClauses = array();
//                $filter_string = '';
//                 if (isset($filter)) {
//                     $filters = json_decode($filter);
//                     if ($filters != NULL) {
//                         foreach ($filters as $filter) {
//                             switch ($filter->property) {
//                                 case 'GL_Code' :
//                                     $whereClauses[] = "t3.tfda_code like '%" . ($filter->value) . "%'";
//                                     break;
//                                  }
//                         }
//                         $whereClauses = array_filter($whereClauses);
//                     }
//                     if (!empty($whereClauses)) {
//                         $filter_string = implode(' AND ', $whereClauses);
//                     }
//                 }

//               if ($filter_string != '') {
//                 $qry->whereRAW($filter_string);
//                       }
     

//        //get in subgroups
//             $pr=collect();
//              $products=$qry->orderBy('t1.id')->chunk(100000,function($record) use (&$pr){
                 
//                      $pr->push($record);
//              });

           

//             //collapse back to one collection
//              $records=$pr->collapse();
//                  //get set headers and encode them to an array
            
//              $header=$this->getArrayColumns($records); 
             
//                   $k=0;
//                   $sortedData=array();
//                   $total=count($header);

//                   //convert to allowed format
//                   foreach ($records as $udata)
//                         {
                          
//                                    for($v=0;$v<$total;$v++){
//                                    $temp1=$header[$v];
//                                    $sortedData[$k][]=$udata->$temp1;

//                             }
                           
//                             $k++;  
//                        }
                   
//                  $heading="DETAILED REVENUE GL_CODE PAYMENTS";
//                   $export = new GridExport($sortedData,$header,$heading);

//                   $file=Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
                 
//             $response =  array(
//                'success'=>true,
//                'name' => "DetailedRevenueReportOnGLCode.xlsx", //no extention needed
//                'file' => "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,".base64_encode($file) //mime type of used format
//             );
           
//             return response()->json($response);
  
//         }

//         public function exportDailyTransactions(request $req){
//           $records=json_decode($this->getDailyFinanceTrans($req));
               
//            $header=$this->getArrayColumns($records); 
            
//                   $k=0;
//                   $sortedData=array();
//                   $total=count($header);
//                   //convert to allowed format
//                   foreach ($records as $udata)
//                         {
//                                    for($v=0;$v<$total;$v++){
//                                    $temp1=$header[$v];
//                                    $sortedData[$k][]=$udata->$temp1;

//                             }
                           
//                             $k++;  
//                        }
                
//                  $heading="DETAILED REVENUE GL_CODE PAYMENTS";
//                   $export = new GridExport($sortedData,$header,$heading);

//                   $file=Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
                 
//             $response =  array(
//                'name' => "DairyTransactionsSummaryReport.xlsx", //no extention needed
//                'file' => "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,".base64_encode($file) //mime type of used format
//             );
//             return response()->json($response);
  
//         }




// //new report designs Product
//  public function getProductRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
//       $section_id=$req->section_id;
//       $classification_category=$req->classification_category;
//       $product_class_category=$req->product_class_category;
//       $module_id=$req->module_id;
//       $directorate_id=$req->directorate_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //classification filters
//         $where_class = array();
//         if(validateIsNumeric($classification_category)){
//             $where_class[] ='id = '.$classification_category;
//           }
//         if(validateIsNumeric($product_class_category)){
//             $where_class[] ='prodclass_category_id = '.$product_class_category;
//           }
//         if(validateIsNumeric($section_id)){
//             $where_class[] ='section_id = '.$section_id;
//         } 
//         if(validateIsNumeric($directorate_id)){
//             $sections=$this->getSectionsByDirectorate($directorate_id);
//             if($sections!=''){
//               $where_class[]="section_id IN (".$sections.")";
//             }
//         }

//        $where_class=array_filter($where_class);
//        $clause='';
//        if (!empty($where_class)) {
//              $clause = implode(' AND ', $where_class);
//           }
//         $where_class=$clause;

//        //classification data
//         $qry = DB::table('par_classifications');
//         if($where_class!=''){
//             $qry->whereRAW($where_class);
//           }
//         $classification_data=$qry->get();


//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='';
//       if($table=='tra_product_applications'){
//             $table2='tra_product_information';
//             $field= 'product_id';
//           }
//         foreach($classification_data as $class_data){
//         //second loop for the sub+modules 
//         $classification_id = $class_data->id;
//         $subFilters=array('t3.classification_id'=>$classification_id);
//         $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//         //$pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'classification_name'=>$class_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,''),
//             'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//             //'brought_forward'=>$pushed['brought'],
//             //'carried_forward'=>$pushed['carried']
//               );
//           }

//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }

//  public function getProductGridRegistrationReport(request $req){
//   //filters
//       $classification_category=$req->classification_category;
//       $sub_module_id=$req->sub_module_id;
//       $product_class_category=$req->product_class_category;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $product_type=$req->product_type;
//       $zone_id=$req->zone_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $device_type_id=$req->device_type_id;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
     
//      //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       //other filters for loops
//       $where_cat=array();
//       if(validateIsNumeric($product_class_category)){
//           $where_cat=array('id'=>$product_class_category);
//       }
//       $where_class=array();
//       if(validateIsNumeric($classification_category)){
//           $where_class=array('id'=>$classification_category);
//       }
//       $where_prodType=array();
//       if(validateIsNumeric($product_type)){
//           $where_prodType=array('id'=>$product_type);
//       }
//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='tra_product_information';
//       $field='product_id';
    
// //looping

//       foreach ($sub_data as $sub) {
//         foreach($directorate_data as $dir_data){
//             $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();  
//           foreach ($sec_data as $sec) {
//               $cat_data=DB::table('par_prodclass_categories')->where($where_cat)->where('section_id',$sec->id)->get();
//               foreach ($cat_data as $cat) {
//                   if($sub->id == 30){
            
//                    $class_data=DB::table('par_classifications')->where(array('id'=>365))->where('prodclass_category_id',$cat->id)->get();
  
//           }
//           else{
              
//                    $class_data=DB::table('par_classifications')->where($where_class)->where('prodclass_category_id',$cat->id)->get();

//           }
//                    foreach ($class_data as $class) {
//                        $product_types_data=DB::table('par_product_types')->where($where_prodType)->get();

//                        foreach ($product_types_data as $type_data) {
//                            $classification_id=$class->id;
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters=array('t3.classification_id'=>$classification_id,'t3.product_type_id' =>$type_data->id);
//                             if(validateIsNumeric($device_type_id)){
//                               $subFilters['t3.device_type_id'] = (int)$device_type_id;
//                             }
//               if(validateIsNumeric($zone_id)){
//                     $subFilters['t1.zone_id']=$zone_id;
//                   }
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                             //$pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                             //$total_brought_forward = $pushed['brought'];
//                             //$total = $total_brought_forward+$total_received;

//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 'directorate_name'=>$dir_data->name,
//                                 'section_name'=>$sec->name,
//                                 'product_category_name'=>$cat->name,
//                                 'product_class_name'=>$class->name, 
//                                 'product_type_name'=>$type_data->name,                               
//                                 'received_applications'=>$total_received,
//                                 //'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                 //'brought_forward'=> $total_brought_forward,
//                                 //'carried_forward'=>$pushed['carried'],
//                                 //'total' => $total
//                                   );
//                           }
//                       }
//                   }
//               }
//           }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       if(validateIsNumeric($req->type)){
//         return $res;
//       }

//       return \response()->json($res);
//  }

// //premises
// public function getPremiseRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
   
//       $premise_type=$req->premise_type;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //classification filters
//         $where_premise = array();
//         if(validateIsNumeric($premise_type)){
//             $where_premise=array("id"=>$premise_type);
//           }

//        //classification data
//         $qry = DB::table('par_premises_types');
//         if($where_premise!=''){
//             $qry->where($where_premise);
//           }

//         $premise_type_data=$qry->get();

         
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='tra_premises';
//         $field= 'premise_id';

//         foreach($premise_type_data as $type_data){
//         //second loop for the sub+modules 
//         $premise_type_id = $type_data->id;
//         //sub filters for this loop
//         $subFilters=array('t3.premise_type_id'=>$premise_type_id);
//         $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//         $pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'premise_type'=>$type_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,''),
//             'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'brought_forward'=>$pushed['brought'],
//             'carried_forward'=>$pushed['carried']
//               );
//           }
//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }


//  public function getPremiseGridRegistrationReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $business_type=$req->business_type;
//       $business_scale=$req->business_scale;
//       $directorate_id=$req->directorate_id;
//       $section_id=$req->section_id;
//       $premise_type=$req->premise_type;
//       $module_id=$req->module_id;
//       $zone_id=$req->zone_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();


//       $where_Ptype=array();
//       if(validateIsNumeric($premise_type)){
//           $where_Ptype=array('id'=>$premise_type);
//       }
//       $Ptype_data=DB::table('par_premises_types')->where($where_Ptype)->get();

//       $where_Btype=array();
//       if(validateIsNumeric($business_type)){
//           $where_Btype=array('id'=>$business_type);
//       }


//       $where_Bscale=array();
//       if(validateIsNumeric($business_scale)){
//           $where_Bscale=array('id'=>$business_scale);
//       }
//       $Bscale_data=DB::table('par_business_scales')->where($where_Bscale)->get();
    
//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
    
//       $table2='tra_premises';
//       $field='premise_id';
      
// //looping

//       foreach ($sub_data as $sub) {
//         foreach($directorate_data as $dir_data){
//             $sec_data=DB::table('par_sections')->whereIn('id', [2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();
//           foreach ($sec_data as $sec) {
             
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters = array();
//               if(validateIsNumeric($zone_id)){
//                 $subFilters['t1.zone_id'] = $zone_id;
//               }
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
                          
//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
                          
//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 'directorate_name'=>$dir_data->name,
//                                 'section_name'=>$sec->name,
//                               //  'business_type_name'=>$Btype->name,
//                                 //'business_scale_name'=>$Bscale->name, 
//                                // 'premise_type_name'=>$Ptype->name,                               
//                                 'received_applications'=>$total_received,
//                                 //'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                // 'brought_forward'=>$total_brought_forward,
//                                 //'carried_forward'=>$pushed['carried'],
//                                 //'total' => $total
//                                   );
//                          // }
//                      // }
//                  // }
//               }
//           }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//  }

// //gmp
//  public function getGmpRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
   
//       $facility_location=$req->facility_location;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //where_facility filters
//         $where_facility = array();
//         if(validateIsNumeric($facility_location)){
//             $where_facility=array("id"=>$facility_location);
//           }

//        //where_facility data
//         $qry = DB::table('par_facility_location');
//         if($where_facility!=''){
//             $qry->where($where_facility);
//           }

//         $facility_location_data=$qry->get();

         
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='par_gmplocation_details';
//         $field= 'gmp_type_id';

//         foreach($facility_location_data as $facility_data){
//         //second loop for the sub+modules 
//         $facility_id = $facility_data->id;
//         //sub filters for this loop
//         $subFilters=array('t1.gmp_type_id'=>$facility_id);
//         $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//         $pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'facility_location'=>$facility_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,''),
//             'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'brought_forward'=>$pushed['brought'],
//             'carried_forward'=>$pushed['carried']
//               );
//           }
//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }


//  public function getGmpGridRegistrationReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $facility_location=$req->facility_location;
//       $module_id=$req->module_id;
//       $zone_id=$req->zone_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }

//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       $where_facility=array();
//       if(validateIsNumeric($facility_location)){
//           $where_facility=array('id'=>$facility_location);
//       }
//     //  $facility_location_data=DB::table('par_gmplocation_details')->where($where_facility)->get();

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='par_gmplocation_details';
//       $field= 'gmp_type_id';
      
// //looping

//       foreach ($sub_data as $sub) {
//         foreach($directorate_data as $dir_data){
//             $sec_data=DB::table('par_sections')->whereIn('id', [2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();
//           foreach ($sec_data as $sec) {
//             //  foreach ($facility_location_data as $location_data) {
//                           // $facility_location_id=$location_data->id;
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters=array();
//               if(validateIsNumeric($zone_id)){
//                 $subFilters['t1.zone_id'] = $zone_id;
//               }
                           
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                            // $pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                             $total_brought_forward = 0;//$pushed['brought'];
//                             $total = $total_brought_forward+$total_received;

//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 'directorate_name'=>$dir_data->name,
//                                 'section_name'=>$sec->name,
//                                 'facility_location'=>'GMP',                               
//                                 'received_applications'=>$total_received,
//                               //  'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                 'brought_forward'=>$total_brought_forward,
//                               //  'carried_forward'=>$pushed['carried'],
//                                 'total' => $total
//                                   );
//                    // }
//               }
//           }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//  }

//  //clinical trial
//  public function getClinicalTrialRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
   
//       $clinical_category=$req->clinical_category;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //where_facility filters
//         $where_category = '';
//         if(validateIsNumeric($clinical_category)){
//             $where_category=array("id"=>$clinical_category);
//           }

//        //where_facility data
//         $qry = DB::table('par_investigationproduct_sections');
//         if($where_category!=''){
//             $qry->where($where_category);
//           }

//         $category_data=$qry->get();

         
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='modules';
//         $field= 'module_id';

//         foreach($category_data as $cat_data){
//         //second loop for the sub+modules 
//         $category_id = $cat_data->id;
//         //sub filters for this loop
//         $subFilters=array('t1.clinical_prodsection_id'=>$category_id);
//         $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//         $pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'clinical_category'=>$cat_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters, ''),
//             'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'brought_forward'=>$pushed['brought'],
//             'carried_forward'=>$pushed['carried']
//               );
//           }
//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }



//  public function getClinicalTrialGridRegistrationReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $clinical_category=$req->clinical_category;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $zone_id=$req->zone_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       $where_category=array();
//       if(validateIsNumeric($clinical_category)){
//           $where_category=array('id'=>$clinical_category);
//       }
//       $category_data=DB::table('par_investigationproduct_sections')->where($where_category)->get();

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='';
//       $field= '';
      
// //looping

//       foreach ($sub_data as $sub) {
//        // foreach($directorate_data as $dir_data){
//           //   $sec_data=DB::table('par_sections')->where($where_sec)->where('directorate_id',$dir_data->id)->get();
//           // foreach ($sec_data as $sec) {
//              // foreach ($category_data as $cat_data) {
//                           // $category_id=$cat_data->id;
//                            $filters="t1.sub_module_id = ".$sub->id;
//                             $subFilters=array();
//                            if(validateIsNumeric($zone_id)){
//                  $subFilters['t1.zone_id'] = $zone_id;
//                }
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                            // $pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                          //   $total_brought_forward = $pushed['brought'];
//                             $total = $total_received;

//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 //'directorate_name'=>$dir_data->name,
//                                 'section_name'=>'Clinical Trial',
//                                 //'clinical_category'=>$cat_data->name,                               
//                                 'received_applications'=>$total_received,
//                 'evaluated_applications'=>0,
//                                // 'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                // 'brought_forward'=>$total_brought_forward,
//                                // 'carried_forward'=>$pushed['carried'],
//                                 'total' => $total
//                                   );
//                    // }
           
//             //  }
//         //  }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//  }

//  //import Export
//  public function getImportExportRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
   
//       $type_category=$req->type_category;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //where_facility filters
//         $where_category = '';
//         if(validateIsNumeric($type_category)){
//             $where_category=array("id"=>$type_category);
//           }

//        //where_facility data
//         $qry = DB::table('par_permit_typecategories');
//         if($where_category!=''){
//             $qry->where($where_category);
//           }

//         $category_data=$qry->get();

         
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='';
//         $field= '';

//         foreach($category_data as $cat_data){
//         //second loop for the sub+modules 
//         $category_id = $cat_data->id;
//         //sub filters for this loop
//         $subFilters=array('t1.import_typecategory_id'=>$category_id);
//         $approved_applications = $this->funcGetApprovedImportExportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//        // $pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'type_category'=>$cat_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             //'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             //'brought_forward'=>$pushed['brought'],
//             //'carried_forward'=>$pushed['carried']
//               );
//           }
//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }


//  public function funcGetApprovedImportExportApplications($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date){
        
//         $qry=DB::table($table_name.' as t1')
//              ->join('tra_managerpermits_review as t2','t1.application_code','t2.application_code')
//              ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
//              ->select(DB::raw('count(t1.id) as total,t4.id as ID'))
//              ->where($subFilters)
//              ->groupBy('t4.id');

//              if($from_date!=''){
//               $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//             }
//            if($filters!=''){
//               $qry->whereRAW($filters);
//             }

//              $all=$qry->get();
//               $approved=0;
//               $rejected=0;

//               foreach($all as  $value) {
//                 $decision=$value->ID;
//                 $total=$value->total;
//                 if($decision==1 || $decision == 2){
//                   $approved=$total+$approved;
//                 }else {
//                   $rejected=$total+$rejected;
//                 }
//               }
            
//             $data = array('approved'=>$approved,'rejected'=>$rejected);

//             return $data;

//             }
// public function dateAddedFilter(request $req){
//     $received_date_opt=$req->received_opt;
//     $from_date=$req->from_date;
//     $to_date=$req->to_date;
//     $where_raw=array();

//     if($from_date != '' && $to_date != ''){
     
//        $where_raw[]="date_format(date_added, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//       }

//     $filter_string='';
//     if (!empty($where_raw)) {
//                      $filter_string = implode(' AND ', $where_raw);
//                     }
//   return $filter_string;

// }
//  public function getImportExportGridRegistrationReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $type_category=$req->type_category;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $zone_id=$req->zone_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->dateAddedFilter($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
      

//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       $where_category=array();
//       if(validateIsNumeric($type_category)){
//           $where_category=array('id'=>$type_category);
//       }
//       $category_data=DB::table('par_permit_typecategories')->where($where_category)->get();

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='';
//       $field= '';
      
// //looping

//       foreach ($sub_data as $sub) {
//         foreach($directorate_data as $dir_data){

//             $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();
           
//           foreach ($sec_data as $sec) {
//              // foreach ($category_data as $cat_data) {
//                            //$category_id=$cat_data->id;
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters=array();
//                            if(validateIsNumeric($zone_id)){
//                  $subFilters['t1.zone_id'] = $zone_id;
//                }
//                            $approved_applications = $this->funcGetApprovedImportExportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                             //$pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,0);
//                             //$total_brought_forward = $pushed['brought'];
//                             //$total = $total_brought_forward+$total_received;

//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 'directorate_name'=>$dir_data->name,
//                                 'section_name'=>$sec->name,
//                                 'type_category'=>$sub->name   ,                            
//                                 'received_applications'=>$total_received,
//                                 //'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                 //'brought_forward'=>$total_brought_forward,
//                                 //'carried_forward'=>$pushed['carried'],
//                                 //'total' => $total
//                                   );
//                   //  }
//               }
//           }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//  }
// //promotion and advert
//  public function getPromAdvertRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
   
//       $classification_id=$req->classification_id;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //where_facility filters
//         $where_class = '';
//         if(validateIsNumeric($classification_id)){
//             $where_class=array("id"=>$classification_id);
//           }

//        //where_facility data
//         $qry = DB::table('par_classifications');
//         if($where_class!=''){
//             $qry->where($where_class);
//           }

//         $class_data=$qry->get();

         
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='par_classifications';
//         $field= 'classification_id';

//         foreach($class_data as $c_data){
//         //second loop for the sub+modules 
//         $class_id = $c_data->id;
//         //sub filters for this loop
//         $subFilters=array('t1.classification_id'=>$class_id);
//         $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//         $pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'classification_name'=>$c_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'brought_forward'=>$pushed['brought'],
//             'carried_forward'=>$pushed['carried']
//               );
//           }
//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }


//  public function getPromAdvertGridRegistrationReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $classification_id=$req->classification_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $zone_id=$req->zone_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
      

//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       $where_class=array();
//       if(validateIsNumeric($classification_id)){
//           $where_class="id = ".$classification_id;
//           $class_data=DB::table('par_classifications')->whereRAW($where_class)->get();
//       }else if(validateIsNumeric($section_id)){
//           $where_class="id IN (".$this->getClassBySection($section_id).")";
//           $class_data=DB::table('par_classifications')->whereRAW($where_class)->get();
//       }else{
//         $class_data=DB::table('par_classifications')->get();
//       }
      

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='par_classifications';
//       $field= 'classification_id';
      
// //looping

//       foreach ($sub_data as $sub) {
//         foreach($directorate_data as $dir_data){

//             $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();
           
//           foreach ($sec_data as $sec) {
//               foreach ($class_data as $c_data) {
//                            $class_id=$c_data->id;
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters=array('t1.classification_id'=>$class_id);
//                            if(validateIsNumeric($zone_id)){
//                  $subFilters['t1.zone_id'] = $zone_id;
//                }
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                             $pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                             $total_brought_forward = $pushed['brought'];
//                             $total = $total_brought_forward+$total_received;

//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 'directorate_name'=>$dir_data->name,
//                                 'section_name'=>$sec->name,
//                                 'classification_name'=>$c_data->name,                               
//                                 'received_applications'=>$total_received,
//                                 'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                 'brought_forward'=>$total_brought_forward,
//                                 'carried_forward'=>$pushed['carried'],
//                                 'total' => $total
//                                   );
//                     }
//               }
//           }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//  }

//  //disposal
//  public function getDisposalRegistrationCartesianReport(request $req){
//   //filters
//       $filters=$this->registrationreportfilters($req,'on');
//       $datefilters=$this->addedDateFilters($req);
//       $directorate_id = $req->directorate_id;
//       $section_id=$req->section_id;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data

//       //where type filters
//         $where_type = '';
//         if(validateIsNumeric($section_id)){
//             $where_type="id = ".$section_id;
//            }else if(validateIsNumeric($directorate_id)){
//                   $sections=$this->getSectionsQuery($directorate_id);
//                 if($sections!=''){
//                    $where_type='id IN ('.$sections.')';
//                 }
//               }

//        //where type data
//         $qry = DB::table('par_sections');
//         if($where_type!=''){
//             $qry->whereRAW($where_type);
//           }

//         $type_data=$qry->get();
         
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='tra_premises';
//         $field= 'premise_id';

//         foreach($type_data as $t_data){
//         //second loop for the sub+modules 
//         $type_id = $t_data->id;
//         //sub filters for this loop
//         $subFilters=array('t1.section_id'=>$type_id);
//         $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//         $pushed=$this->getRegistrationReportChartBroughtCariedForwardApplication($table,$table2,$field,$subFilters,$req);

//         $data[] = array(
//             'product_type'=>$t_data->name, 
//             'received_applications'=>$this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//             'rejected'=> $approved_applications['rejected'],
//             'approved'=> $approved_applications['approved'],
//             'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters),
//             'brought_forward'=>$pushed['brought'],
//             'carried_forward'=>$pushed['carried']
//               );
//           }
//             $res = array(
//                           'success' => true,
//                           'results' => $data,
//                           'message' => 'All is well'
                          
//                       );
//          return \response()->json($res);
//         }


//  public function getDisposalGridRegistrationReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//      $where_type = '';
//         if(validateIsNumeric($section_id)){
//             $where_type="id = ".$section_id;
//            }
//         else if(validateIsNumeric($directorate_id)){
//                 $sections=$this->getSectionsQuery($directorate_id);
//               if($sections!=''){
//                  $where_type='id IN ('.$sections.')';
//               }
//             }
      

//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();
      

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='tra_premises';
//       $field= 'premise_id';
      
// //looping

//       foreach ($sub_data as $sub) {
//         foreach($directorate_data as $dir_data){
//             if($where_type == ''){
//             $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where('directorate_id',$dir_data->id)->get();
//               }else{
//             $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->whereRAW($where_type)->where('directorate_id',$dir_data->id)->get();
//             }
           
//           foreach ($sec_data as $sec) {
//                            $filters="t1.sub_module_id = ".$sub->id;
//                             $subFilters=array('t1.section_id'=>$sec->id);
                           
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                             $pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                              $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                             $total_brought_forward = $pushed['brought'];
//                             $total = $total_brought_forward+$total_received;

//                             $data[] = array(
//                                 'SubModule'=>$sub->name,
//                                 'directorate_name'=>$dir_data->name,
//                                 'product_type'=>$sec->name,                              
//                                 'received_applications'=>$total_received,
//                                 'evaluated_applications'=>$this->funcGetEvaluatedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date),
//                                 'rejected'=> $approved_applications['rejected'],
//                                 'approved'=> $approved_applications['approved'],
//                                 'queried'=>$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters),
//                                 'brought_forward'=>$total_brought_forward,
//                                 'carried_forward'=>$pushed['carried'],
//                                 'total' => $total
//                                   );
//                     }
//           }
//       }
//           $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//  }

//  //helper functions
// public function addedDateFilters(request $req){
//     $received_date_opt=$req->received_opt;
//     $from_date=$req->from_date;
//     $to_date=$req->to_date;
//     $where_raw=array();

//     if($from_date != '' && $to_date != ''){
//         // if($received_date_opt==1){
//         //   $received_date_opt='date_added';
//         // }else{
//         //   $received_date_opt='submission_date';
//         // }
//        // $where_raw[]="date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//        $where_raw[]="date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//       }
//     $filter_string='';
//     if (!empty($where_raw)) {
//                      $filter_string = implode(' AND ', $where_raw);
//                     }
//   return $filter_string;

// }

// public function registrationreportfilters(request $req, $sec_switch='off'){
//       $sub_module_id=$req->sub_module_id;
//       $module_id=$req->module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
      
//       $evaluation_date_opt=$req->evaluation_opt;
      
//       //product unique
//       $product_type=$req->product_type;
//       //premise unique
//       $business_type=$req->business_type;
//       $business_scale=$req->business_scale;
//       $premise_type=$req->premise_type;
//       //gmp unique
//       $facility_location=$req->facility_location;
//       //clinical trial
//       $clinical_category=$req->clinical_category;
//       //import export
//       $type_category=$req->type_category;

//       $where_raw=array();

//       if(validateIsNumeric($sub_module_id)){
//         $where_raw[]='t1.sub_module_id = '.$sub_module_id;
//       }else{
//         $where_raw[]='t1.sub_module_id IN ('.$this->getSubModulesQuery($module_id).')';
//       }

//       if($sec_switch == 'off'){
//           if(validateIsNumeric($section_id)){
//             $where_raw[]='t1.section_id = '.$section_id;
//           }else if(validateIsNumeric($directorate_id)){
//               $sections=$this->getSectionsQuery($directorate_id);
//             if($sections!=''){
//                $where_raw[]='t1.section_id IN ('.$sections.')';
//             }
//           }
//        }

//       //product unique
//       if(validateIsNumeric($product_type)){
//         $where_raw[]='t3.product_type_id = '.$product_type;
//       }
//       else if(isset($product_type)){
//         $where_raw[]='t3.product_type_id IS NOT NULL ';
//       }

//       //premises unique
//        if(validateIsNumeric($business_scale)){
//         $where_raw[]='t3.business_scale_id = '.$business_scale;
//       }
//        if(validateIsNumeric($business_type)){
//         $where_raw[]='t3.business_type_id = '.$business_type;
//       }
//        if(validateIsNumeric($premise_type)){
//         $where_raw[]='t3.premise_type_id = '.$premise_type;
//       }

//       //gmp unique
//       if(validateIsNumeric($facility_location)){
//         $where_raw[]='t1.gmp_type_id = '.$facility_location;
//       }

//       //clinical trial
//       if(validateIsNumeric($clinical_category)){
//         $where_raw[]='t1.clinical_prodsection_id = '.$clinical_category;
//       }

//       //import export
//       if(validateIsNumeric($type_category)){
//         $where_raw[]='t1.import_typecategory_id = '.$type_category;
//       }

      

//         $filter_string='';
//        if (!empty($where_raw)) {
//                      $filter_string = implode(' AND ', $where_raw);
//                     }
//   return $filter_string;
// }

//   public function getSubModulesQuery($module_id){
//     $qry=DB::table('sub_modules')->where('module_id',$module_id)->select('id')->get();
//     $subArray=array();
//       foreach ($qry as $sub_module) {
//           $subArray[]=$sub_module->id;
//       }
//       $sub=implode(",",$subArray);
//    return $sub;
//   }

//    public function getSectionsQuery($directorate_id){
//     $qry=DB::table('par_sections')->where('directorate_id',$directorate_id)->select('id')->get();
//     $subArray=array();
//       foreach ($qry as $sub_module) {
//           $subArray[]=$sub_module->id;
//       }
//       if(!empty($subArray)){
//            $sub=implode(",",$subArray);
//        }
//        else{
//             $sub='';
//        }
//    return $sub;
//   }
// public function funcGetEvaluatedRegistrationReportApplications($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_date_opt,$from_date,$to_date){
//     if($table_name=='tra_importexport_applications'){
//         $count=DB::table($table_name ." as t1")
//                      ->join('tra_managerpermits_review as t5','t1.application_code','t5.application_code')
//                      ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//                      ->orderBy('t5.application_code')
//                      ->where($subFilters);
//                if($filters!=''){
//                   $count->whereRAW($filters);
//                 }
//                 if($datefilters!=''){
//                   $count->whereRAW($datefilters);
//                 }
              
//           if(validateIsNumeric($evaluation_date_opt)){
//               $count->whereRAW("date_format(t5.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//             }
//     }else{  
//           $count=DB::table($table_name ." as t1")
//                ->join('tra_applications_comments as t5','t1.application_code','t5.application_code')
//                ->join('tra_payments as tp','t1.application_code','tp.application_code')
//                ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//                ->select(DB::raw('DISTINCT(tp.application_code),DISTINCT(t5.application_code)'))
//                ->where($subFilters);
//          if($filters!=''){
//             $count->whereRAW($filters);
//           }
//           if($datefilters!=''){
//             $count->whereRAW($datefilters);
//           }
//     if(validateIsNumeric($evaluation_date_opt)){
//       if($evaluation_date_opt == 5){
//         $evaluation_opt = 'assessment_start_date';
//       }else{
//         $evaluation_opt = 'assessment_end_date';
//       }

//         $count->whereRAW("date_format(t5.".$evaluation_opt.", '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//       }
// }

//         //$data= $count->get();

//        return $count->count();

//  }


//  public function funcGetReceivedRegistrationReportApplications($table_name,$table2,$field,$subFilters,$filters,$datefilters,$has_payment_processing = null){
    
//           if($table2 == ''){
//             $count=DB::table($table_name." as t1")
//                   ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
//                   ->select(DB::raw('DISTINCT t1.application_code'))
//                   ->orderBy('tp.id', 'DESC')
//                   ->where($subFilters);
//           }else{
//             $count=DB::table($table_name." as t1")
//                   ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//                   ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
//                   ->select(DB::raw('DISTINCT t1.application_code '))
//                   ->orderBy('tp.id', 'DESC')
//                   ->where($subFilters);
//           }
          
//           if($filters!=''){
//             $count->whereRAW($filters);
//           }
//        //dates
//      //chek if has payment 
//      if($has_payment_processing != 1){
//        if($datefilters!=''){
//         $datefilters = str_replace('tp.trans_date','t1.date_added',$datefilters);
        
        
//         $count->whereRAW($datefilters);
//           }
//      }
//      else{
       
//       if($datefilters!=''){
//             $count->whereRAW($datefilters);
//       $count->whereIn('tp.payment_type_id', [1,3]);
//           } 
//      }
//           //$results=$count->get();
//         $data=$count->count();
//    return $data;

//  }

//  public function funcGetApprovedRegistrationReportApplications($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date){
//         if($table2 != ''){
//         $qry=DB::table($table_name.' as t1')
//              ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//              ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//              ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
//              ->select(DB::raw('count(Distinct t1.id) as total,t4.id as ID'))
//              ->where($subFilters)
//              ->groupBy('t4.id');
//     }
//     else{
//         $qry=DB::table($table_name.' as t1')
//              ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//              ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
//              ->select(DB::raw('count(Distinct t1.id) as total,t4.id as ID'))
//              ->where($subFilters)
//              ->groupBy('t4.id');
//     }
      

//              if($from_date!=''){
//               $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//             }
//            if($filters!=''){
//               $qry->whereRAW($filters);
//             }

//              $all=$qry->get();
//               $approved=0;
//               $rejected=0;

//               foreach($all as  $value) {
//                 $decision=$value->ID;
//                 $total=$value->total;
//                 if($decision==1 || $decision == 2){
//                   $approved=$total+$approved;
//                 }else {
//                   $rejected=$total+$rejected;
//                 }
//               }
            
//             $data = array('approved'=>$approved,'rejected'=>$rejected);

//             return $data;


//             }
//     public function funcGetQueriedRegistrationReportApplications($table_name,$table2,$field,$subFilters,$filters,$datefilters){
//         if($table2 == ''){
//           $count=DB::table($table_name.' as t1')
//                  ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//                  ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
//                  ->select(DB::raw('DISTINCT(tp.application_code)'))
//                  ->groupBy('t1.application_code')
//                  ->where($subFilters);
//            }else{
//             $count=DB::table($table_name.' as t1')
//                    ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
           
//                   ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//                    ->leftJoin('tra_payments as tp','t1.application_code','tp.application_code')
//                    ->select(DB::raw('DISTINCT(tp.application_code)'))
//                    ->groupBy('t1.application_code')
//                    ->where($subFilters);
//            }

//             if($filters!=''){
//               $count->whereRAW($filters);
//             }
//             if($datefilters!=''){
//         //$datefilters=str_replace('tp.trans_date','t2.queried_on',$datefilters);
//         $datefilters=str_replace('date_added','t2.queried_on',$datefilters);
//               $count->whereRAW($datefilters);
//             }
//             //$results=$count->get();
//       return $count->count();
            
//            }


//  public function getRegistrationReportGridBroughtCariedForwardApplication($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt_id,$from_date,$to_date){
//         if($table2 == ''){
//           $qry=DB::table($table_name.' as t1')
//                ->join('tra_payments as tp','t1.application_code','tp.application_code')
//                ->leftJoin('tra_applications_comments as t5','t1.application_code','t5.application_code')
//                ->where($subFilters)
//                ->select(DB::raw('DISTINCT(tp.application_code)'));
//            }else{
//             $qry=DB::table($table_name.' as t1')
//                  ->join($table2.' as t3','t1.'.$field,'t3.id')
//                  ->join('tra_payments as tp','t1.application_code','tp.application_code')
//                  ->leftJoin('tra_applications_comments as t5','t1.application_code','t5.application_code')
//                  ->where($subFilters)
//                  ->select(DB::raw('DISTINCT(tp.application_code)'));
//            }


//            if($filters!=''){
//               $qry->whereRAW($filters);
//             }


//           $qry2=clone $qry;

//           if(validateIsNumeric($received_date_opt)){
//               if($received_date_opt==1){
//                 $received_date_opt='date_added';
//               }else{
//                 $received_date_opt='submission_date';
//               }
//                 $qry->whereRAW("date_format(tp.trans_date, '%Y%-%m-%d') < '".formatDate($from_date)."' AND t5.application_code IS NULL");

//                 $qry2->whereRAW("date_format(tp.trans_date, '%Y%-%m-%d') < '".formatDate($to_date)."' AND t5.application_code IS NULL");
            
//             }

//              $carried=$qry2->count();
//              $brought=$qry->count();

            
//             $data = array('carried'=>$carried,'brought'=>$brought);

//             return $data;

//             }


//   public function getRegistrationReportChartBroughtCariedForwardApplication($table_name,$table2,$field, $subFilters,$req){
//         if($table2 == ''){
//           $qry=DB::table($table_name.' as t1')
//              ->join('tra_payments as tp','t1.application_code','tp.application_code')
//              ->leftJoin('tra_applications_comments as t5','t1.application_code','t5.application_code')
//              ->select(DB::raw('DISTINCT(tp.application_code)'))
//              ->where($subFilters);
//         }else{
//           $qry=DB::table($table_name.' as t1')
//              ->join($table2.' as t3','t1.'.$field,'t3.id')
//              ->join('tra_payments as tp','t1.application_code','tp.application_code')
//              ->leftJoin('tra_applications_comments as t5','t1.application_code','t5.application_code')
//              ->select(DB::raw('DISTINCT(tp.application_code)'))
//              ->where($subFilters);
//         }
        

//              //filters
//             $sub_module_id=$req->sub_module_id;
//             $module_id=$req->module_id;
//             $section_id=$req->section_id;
//             $product_type=$req->product_type;
//             $received_date_opt=$req->received_opt;
//             $evaluation_opt_id=$req->evaluation_opt;
//             $from_date=$req->from_date;
//             $to_date=$req->to_date;


//             $where_raw=array();

//             if(validateIsNumeric($sub_module_id)){
//               $where_raw[]='t1.sub_module_id = '.$sub_module_id;
//             }else{
//               $where_raw[]='t1.sub_module_id IN ('.$this->getSubModulesQuery($module_id).')';
//             }
//             if(validateIsNumeric($section_id)){
//               $where_raw[]='t1.section_id = '.$section_id;
//             }
//             if(validateIsNumeric($product_type)){
//               $where_raw[]='t3.product_type_id = '.$product_type;
//             }else if(isset($product_type)){
//               $where_raw[]='t3.product_type_id IS NOT NULL';
//             }

//             $filter_string='';
//             if (!empty($where_raw)) {
//                      $filter_string = implode(' AND ', $where_raw);
//                 }
//             if($filter_string!=''){
//               $qry->whereRAW($filter_string);
//             }


//           $qry2=clone $qry;

//           if(validateIsNumeric($received_date_opt)){
//               // if($received_date_opt==1){
//               //   $received_date_opt='date_added';
//               // }else{
//               //   $received_date_opt='submission_date';
//               // }
//                 $qry->whereRAW("date_format(tp.trans_date, '%Y%-%m-%d') < '". formatDate($from_date). "' AND t5.application_code IS NULL");

//                $qry2->whereRAW("date_format(tp.trans_date, '%Y%-%m-%d') < '".formatDate($to_date)."' AND t5.application_code IS NULL");
            
//             }
           
//              $carried=$qry2->count();
//              $brought=$qry->count();

            
//             $data = array('carried'=>$carried,'brought'=>$brought);

//             return $data;

//             }
//     public function getRegistrationReportDatesIntervals($table_name,$table2,$field,$section,$sub_module,$filters,$lower_limit,$upper_limit,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt){
    
//        $qry=DB::table($table_name.' as t1')
//             ->join($table2.' as t2','t1.'.$field,'t2.id')
//             ->where(array('t1.section_id'=>$section,'t1.sub_module_id'=>$sub_module))
//             ->where($filters);
            
//         if($upper_limit!=0){
//              $qry->whereRAW("TOTAL_WEEKDAYS((date_format(t1.".$received_opt.", '%Y%-%m-%d') >= '".formatDate($from_date)."'),(SELECT process_date FROM tra_applications_processdefinations q2 WHERE q2.application_code=t1.application_code AND q2.appprocess_defination_id='".$evaluation_opt."' AND date_format(q2.process_date, '%Y%-%m-%d') < '".formatDate($to_date)."' ORDER BY q2.id ".$sort_opt." LIMIT 1)) BETWEEN ".$lower_limit." AND ".$upper_limit."");
            
//            }else{
//              $qry->whereRAW("TOTAL_WEEKDAYS((date_format(t1.".$received_opt.", '%Y%-%m-%d') >= '".formatDate($from_date)."'),(SELECT process_date FROM tra_applications_processdefinations q2 WHERE q2.application_code=t1.application_code AND q2.appprocess_defination_id='".$evaluation_opt."' AND date_format(q2.process_date, '%Y%-%m-%d') < '".formatDate($to_date)."' ORDER BY q2.id ".$sort_opt." LIMIT 1)) > ".$lower_limit."");
//            }
         
            
//             $total=$qry->count();
       
//             return $total;


 
//   }

//   public function RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module,$section,$sub_module,$filters,$received_date_opt,$evaluation_opt,$from_date,$to_date,$sort_opt="DESC"){
//          $data_span=DB::table('par_ageanalysisdays_span')
//               ->where('module_id',$module)
//               ->get();
//           $order_array=array();
//           foreach ($data_span as $span) {
//             $order=$span->order_no;
//             $lower_limit=$span->min_days;
//             $upper_limit=$span->max_days;
//             $order_array[]=[$order." " => $this->getRegistrationReportDatesIntervals($table_name,$table2,$field,$section,$sub_module,$filters,$lower_limit,$upper_limit,$received_date_opt,$evaluation_opt,$from_date,$to_date,$sort_opt)];
//           }
         
//           return $order_array;
//          // return array_filter($order_array);    
//   }

//    public function getProductRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $classification_category=$req->classification_category;
//       $sub_module_id=$req->sub_module_id;
//       $product_class_category=$req->product_class_category;
//       $section_id=$req->section_id;
//       $product_type=$req->product_type;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $sort_opt=$req->sort_opt;
//       $to_date=$req->to_date;
//       $device_type_id=$req->device_type_id;
      

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();
//       //other filters for loops
//       $where_cat=array();
//       if(validateIsNumeric($product_class_category)){
//           $where_cat=array('id'=>$product_class_category);
//       }
//       $where_class=array();
//       if(validateIsNumeric($classification_category)){
//           $where_class=array('id'=>$classification_category);
//       }
//       $where_prodType=array();
//       if(validateIsNumeric($product_type)){
//           $where_prodType=array('id'=>$product_type);
//       }
//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//        $table2='';
//       if($table_name=='tra_product_applications'){
//             $table2='tra_product_information';
//             $field='product_id';
//           }
// //looping
//       foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//               $cat_data=DB::table('par_prodclass_categories')->where($where_cat)->where('section_id',$sec->id)->get();
//               foreach ($cat_data as $cat) {
//                   $class_data=DB::table('par_classifications')->where($where_class)->where('prodclass_category_id',$cat->id)->get();
//                   foreach ($class_data as $class) {
//                       $product_types_data=DB::table('par_product_types')->where($where_prodType)->get();
//                       foreach ($product_types_data as $type_data) {
//                         $filters=array('t2.classification_id'=>$class->id,'t2.product_type_id'=>$type_data->id);
//                         if(validateIsNumeric($device_type_id)){
//                             $filters['t2.device_type_id']=(int)$device_type_id;
//                           }
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $classification=$class->name;
//                             $sub_module=$sub->name;
//                             $section=$sec->name;
//                             $prod_type=$type_data->name;
//                             $data=[
//                              'product_class_name'=>$classification,
//                              'section_name'=>$section,
//                              'SubModule'=>$sub_module,
//                              'product_type_name'=>$prod_type,
//                              'product_category_name'=>$cat->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }
//                       }
//                   }
//               }
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

//  public function getPremiseRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $premise_type=$req->premise_type;
//       $sub_module_id=$req->sub_module_id;
//       $business_type=$req->business_type;
//       $section_id=$req->section_id;
//       $business_scale=$req->business_scale;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $sort_opt=$req->sort_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();

//       $where_Ptype=array();
//       if(validateIsNumeric($premise_type)){
//           $where_Ptype=array('id'=>$premise_type);
//       }
//       $Ptype_data=DB::table('par_premises_types')->where($where_Ptype)->get();

//       $where_Btype=array();
//       if(validateIsNumeric($business_type)){
//           $where_Btype=array('id'=>$business_type);
//       }
//       $where_Bscale=array();
//       if(validateIsNumeric($business_scale)){
//           $where_Bscale=array('id'=>$business_scale);
//       }
//       $Bscale_data=DB::table('par_business_scales')->where($where_Bscale)->get();

//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//             $table2='tra_premises';
//             $field='premise_id';
       
// //looping
//        foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//               $Btype_data=DB::table('par_business_types')->where($where_Btype)->where('section_id',$sec->id)->get();
//               foreach ($Ptype_data as $Ptype) {
//                    foreach ($Btype_data as $Btype) {
//                        foreach ($Bscale_data as $Bscale) {
//                         $filters=array('t2.premise_type_id'=>$Ptype->id,'t2.business_scale_id'=>$Bscale->id, 't2.business_type_id'=>$Btype->id);
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $premise_type=$Ptype->name;
//                             $sub_module=$sub->name;
//                             $section=$sec->name;
//                             $business_type=$Btype->name;
//                             $data=[
//                              'premise_type_name'=>$premise_type,
//                              'section_name'=>$section,
//                              'SubModule'=>$sub_module,
//                              'business_type_name'=>$business_type,
//                              'business_scale_name'=>$Bscale->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }
//                       }
//                   }
//               }
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

//  //GMP
//  public function getGmpRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $facility_location=$req->facility_location;
//       $section_id=$req->section_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $sort_opt=$req->sort_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();

//       $where_facility=array();
//       if(validateIsNumeric($facility_location)){
//           $where_facility=array('id'=>$facility_location);
//       }
//       $facility_location_data=DB::table('par_gmplocation_details')->where($where_facility)->get();


//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//             $table2='par_gmplocation_details';
//             $field='gmp_type_id';
       
// //looping
//        foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//               foreach ($facility_location_data as $location_data) {
//                         $filters=array('t1.gmp_type_id'=>$location_data->id);
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $data=[
//                              'facility_location'=>$location_data->name,
//                              'section_name'=>$sec->name,
//                              'SubModule'=>$sub->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }
                      
//               }
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

// //Clinical trial
//  public function getClinicalTrialRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $clinical_category=$req->clinical_category;
//       $section_id=$req->section_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $sort_opt=$req->sort_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[5])->where($where_sec)->get();

//       $where_category=array();
//       if(validateIsNumeric($clinical_category)){
//           $where_category=array('id'=>$clinical_category);
//       }
//       $category_data=DB::table('par_investigationproduct_sections')->where($where_category)->get();


//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//             $table2='clinical_trial_products';
//             $field='id';
       
// //looping
//        foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//               foreach ($category_data as $cat_data) {
//                         $filters=array('t1.clinical_prodsection_id'=>$cat_data->id);
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $data=[
//                              'clinical_category'=>$cat_data->name,
//                              'section_name'=>$sec->name,
//                              'SubModule'=>$sub->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }
                      
//               }
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

//  //import export
//  public function getImportExportRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $type_category=$req->type_category;
//       $section_id=$req->section_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $sort_opt=$req->sort_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();

//       $where_category=array();
//       if(validateIsNumeric($type_category)){
//           $where_category=array('id'=>$type_category);
//       }
//       $category_data=DB::table('par_permit_typecategories')->where($where_category)->get();


//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//             $table2='par_permit_typecategories';
//             $field='import_typecategory_id';
       
// //looping
//        foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//               foreach ($category_data as $cat_data) {
//                         $filters=array('t1.import_typecategory_id'=>$cat_data->id);
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $data=[
//                              'type_category'=>$cat_data->name,
//                              'section_name'=>$sec->name,
//                              'SubModule'=>$sub->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }
                      
//               }
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

//  //promotion advertisement
//  public function getPromAdvertRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $classification_id=$req->classification_id;
//       $section_id=$req->section_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $sort_opt=$req->sort_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();

//      $where_class=array();
//       if(validateIsNumeric($classification_id)){
//           $where_class="id = ".$classification_id;
//           $class_data=DB::table('par_classifications')->whereRAW($where_class)->get();
//       }else if(validateIsNumeric($section_id)){
//           $where_class="id IN (".$this->getClassBySection($section_id).")";
//           $class_data=DB::table('par_classifications')->whereRAW($where_class)->get();
//       }else{
//         $class_data=DB::table('par_classifications')->get();
//       }


//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//             $table2='par_classifications';
//             $field='classification_id';
       
// //looping
//        foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//               foreach ($class_data as $c_data) {
//                         $filters=array('t1.classification_id'=>$c_data->id);
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $data=[
//                              'classification_name'=>$c_data->name,
//                              'section_name'=>$sec->name,
//                              'SubModule'=>$sub->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }
                      
//               }
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

// public function getDisposalRegistrationAgeAnalysisReport(request $req){
//   //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $sort_opt=$req->sort_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;

//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       $sec_data=DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();



//       if(validateIsNumeric($received_opt)){
//           if($received_opt==1){
//             $received_opt='date_added';
//           }else{
//             $received_opt='submission_date';
//           }
//       }
     
//       $data = array();
//       $final_Array= array();
//       $table_name=$this->getTableName($module_id);
//             $table2='tra_premises';
//             $field='premise_id';
       
// //looping
//        foreach ($sub_data as $sub) {
//           foreach ($sec_data as $sec) {
//                         $filters=array();
//                            $span_array=$this->RegistrationReportAgeAnalysisDatelimiter($table_name,$table2,$field,$module_id,$sec->id,$sub->id,$filters,$received_opt,$evaluation_opt,$from_date,$to_date,$sort_opt);
                        
//                         if(!empty($span_array)){
//                             $data=[
//                              'product_type'=>$sec->name,
//                              'SubModule'=>$sub->name
//                             ];

//                             //convert array of arrays to a single array
//                           $span_array=call_user_func_array('array_merge',$span_array);
//                           //get total and add it to the array
//                           $total=0;
//                            foreach ($span_array as $key => $value) {
//                              $temp=$total+$value;
//                              $total=$temp;
//                            }
//                            $span_array+=['total'=>$total];
//                             //combine the array to a favourable format
//                           $final_Array[]=array_merge($span_array,$data);
//                         }  
              
//           }
//       }
         
//       return \response()->json($final_Array);
//  }

//  //exort by process classifications
// public function getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date){
//     if($table_name == 'tra_importexport_applications'){
//         $join_table = 'tra_managerpermits_review';
//     }
//     else{
//         $join_table = 'tra_approval_recommendations';
//     }
//    $qry=DB::table($table_name.' as t1')
//              ->leftJoin($join_table.' as t2','t1.application_code','t2.application_code')
//              ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//              ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
//              ->where('t4.id',1)
//              ->select('t2.approval_date as Approval_Date');

//             if($subFilters != ""){
//                  $qry->whereRAW($subFilters);
//               }

//              if($from_date!=''){
//               $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//             }
//              if($filters!=''){
//               $qry->whereRAW($filters);
//             }
//           return  $qry;



//  }
//   public function getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date){
//      if($table_name == 'tra_importexport_applications'){
//         $join_table = 'tra_managerpermits_review';
//     }
//     else{
//         $join_table = 'tra_approval_recommendations';
//     }
//    $qry=DB::table($table_name.' as t1')
//              ->join($join_table.' as t2','t1.application_code','t2.application_code')
//              ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//              ->join('par_approval_decisions as t4','t2.decision_id','t4.id')
//              ->where('t2.id',2)
//              ->select('t2.approval_date as Rejected_On');

//              if($subFilters != ""){
//                   $qry->whereRAW($subFilters);
//               }

//              if($from_date!=''){
//               $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//             }
//              if($filters!=''){
//               $qry->whereRAW($filters);
//             }

//           return  $qry;

//  }

//  public function getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters){
//           $count=DB::table($table_name." as t1")
//                   ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//                   ->leftJoin('tra_payments as tp', 't1.application_code', 'tp.application_code')
//                   ->groupBy('t1.application_code');

//               if($subFilters != ""){
//                    $count->whereRAW($subFilters);
//                }
               
//               if($filters!=''){
//                 $count->whereRAW($filters);
//               }
//            //dates
//               if($datefilters!=''){
//                 $count->whereRAW($datefilters);
//               }
//           return  $count;
//  }

// public function getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_date_opt,$from_date,$to_date){
//           $count=DB::table($table_name ." as t1")
//                ->join('tra_applications_processdefinations as t5','t1.application_code','t5.application_code')
//                ->leftJoin($table2.' as t3','t1.'.$field,'t3.id')
//                ->orderBy('t5.id','DESC')
//                ->select(DB::raw('DISTINCT(t1.application_code),t5.process_date as Evaluated_On'));
//           if($subFilters != ""){
//               $count->whereRAW($subFilters);
//            }
//          if($filters!=''){
//             $count->whereRAW($filters);
//           }
//           if($datefilters!=''){
//             $count->whereRAW($datefilters);
//           }
//           if(validateIsNumeric($evaluation_date_opt)){
//               $count->whereRAW("t5.appprocess_defination_id = '".$evaluation_date_opt."' AND date_format(t5.process_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//           }else{
//             $count->where("t5.appprocess_defination_id",3);
//           }

//     return  $count;

//  }


//  public function getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters){
      
//         $count=DB::table($table_name.' as t1')
//              ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//              ->leftJoin('users','t2.queried_by','users.id')
//              ->join($table2.' as t3','t1.'.$field,'t3.id')
//               ->select(DB::raw('DISTINCT(t1.application_code),t2.queried_on as Queried_On,users.username as Queried_By'));

//       if($subFilters != ""){
//               $count->whereRAW($subFilters);
//       }
//             if($filters!=''){
//               $count->whereRAW($filters);
//             }
//             if($datefilters!=''){
//               $count->whereRAW($datefilters);
//             }

//     return  $count;


// }

//  public function getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt_id,$from_date,$to_date){
         
//         $qry=DB::table($table_name.' as t1')
//              ->join($table2.' as t3','t1.'.$field,'t3.id')
//              ->leftJoin('tra_applications_processdefinations as t5','t1.application_code','t5.application_code')
//              ->select('t1.id');

//           if($subFilters != ""){
//               $qry->whereRAW($subFilters);
//            }

//            if($filters!=''){
//               $qry->whereRAW($filters);
//             }
//           if(validateIsNumeric($received_date_opt)){
//               if($received_date_opt==1){
//                 $received_date_opt='date_added';
//               }else{
//                 $received_date_opt='submission_date';
//               }

//                 $qry->whereRAW("date_format(t1.".$received_date_opt.", '%Y%-%m-%d') < '".formatDate($from_date)."' AND (t5.appprocess_defination_id != '".$evaluation_opt_id."' OR t5.appprocess_defination_id is null)");
            
//             }
//     return  $qry;

// }
// public function getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt_id,$from_date,$to_date){
         
//         $qry=DB::table($table_name.' as t1')
//              ->join($table2.' as t3','t1.'.$field,'t3.id')
//              ->leftJoin('tra_applications_processdefinations as t5','t1.application_code','t5.application_code')
//              ->select('t1.id');

//           if($subFilters != ""){
//                 $qry->whereRAW($subFilters);
//              }

//           if($filters!=''){
//               $qry->whereRAW($filters);
//             }

//           if(validateIsNumeric($received_date_opt)){
//               if($received_date_opt==1){
//                 $received_date_opt='date_added';
//               }else{
//                 $received_date_opt='submission_date';
//               }
//                 $qry->whereRAW("date_format(t1.".$received_date_opt.", '%Y%-%m-%d') < '".formatDate($to_date)."' AND (t5.appprocess_defination_id != '".$evaluation_opt_id."' OR t5.appprocess_defination_id IS NULL)");
            
//             }

//     return  $qry;

//     }
//     public function exportProductDefinedColumns(Request $req,$inCall='0'){
//       $filter_string='';
//       $process_class=$req->process_class;
//       $filters = (array)json_decode($req->filters);
//       $module_id = $req->module_id;
//       $heading='';
//       $product_class_category = '';
//       $section_id = '';
//       $directorate_id = '';
//       $from_date = '';
//       $to_date = '';
//       $classification_category = '';
//       $sub_module_id = '';
//       $whereRAW=array();
//       if(!empty($filters)){
//         foreach ($filters as $key => $value) {
//           if($key=='t1.section_id' && validateIsNumeric($value)){
//                  $whereRAW[]="t1.section_id = ".$value;
//                  $section_id = $value;
//             }
//           if($key=='directorate_id' && validateIsNumeric($value)){
//                  $directorate_id = $value;
//             }
//           if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                  $whereRAW[]="t1.sub_module_id = ".$value;
//                  $sub_module_id = $value;
//             }
//           if($key=='from_date'){
//                  $from_date = $value;
//             }
//           if($key=='to_date'){
//                  $to_date = $value;
//             }
//           if($key=='product_type' && validateIsNumeric($value)){
//                  $whereRAW[]="t3.product_type_id = ".$value;
//             }
//           if($key=='classification_id' && validateIsNumeric($value)){
//                  $classification_category = $value;
//             }
//           if($key=='product_class_category' && validateIsNumeric($value)){
//                  $product_class_category = $value;
//             }
//           if($key=='zone_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.zone_id = ".$value;
//               }
//           if($key=='device_type_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t3.device_type_id = ".$value;
//               }
//         }
//      }

//      if(validateIsNumeric($directorate_id)){
//          if(!validateIsNumeric($section_id)){
//             $sections=$this->getSectionsByDirectorate($directorate_id);
//             if($sections!=''){
//               $whereRAW[]="t1.section_id IN (".$sections.")";
//             }
//           }
//         }
//        //classification filters
//         $where_class = array();
//         if(validateIsNumeric($classification_category)){
//             $where_class[] ='id = '.$classification_category;
//           }
//         if(validateIsNumeric($product_class_category)){
//             $where_class[] ='prodclass_category_id = '.$product_class_category;
//           }
//         if(validateIsNumeric($section_id)){
//             $where_class[] ='section_id = '.$section_id;
//           }
//         if(validateIsNumeric($directorate_id)){
//             if(!validateIsNumeric($section_id)){
//                 $sections=$this->getSectionsByDirectorate($directorate_id);
//                 if($sections != ''){
//                   $where_class[]="section_id IN (".$sections.")";
//                 }
//             }
//         }
//        $where_class=array_filter($where_class);
//        $clause='';
//        if (!empty($where_class)) {
//              $clause = implode(' AND ', $where_class);
//           }
//         $where_class=$clause;

//        //classification data
//         $query = DB::table('par_classifications')->select('id');
//         if($where_class!=''){
//             $query->whereRAW($where_class);
//           }

//         $classification_data=$this->implodeArrayToString($query->get(),'id');

//       //reports
//         if($classification_data!=''){
//            $subFilters="t3.classification_id IN (".$classification_data.")";
//           }
//         else{
//             $subFilters = "";
//         }
//         $whereRAW = array_filter($whereRAW);
//         if (!empty($whereRAW)) {
//             $filter_string = implode(' AND ', $whereRAW);
//         }
//         $filters=$filter_string;
//         if($to_date){
//            $datefilters = "date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//            $Mddatefilters = "date_format(t1.date_added, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."' AND t1.sub_module_id = 30";
//          }else{
//           $datefilters = "";
//           $Mddatefilters = "";
//          }
       
//         $data = array();
//         $table_name='tra_product_applications';
//         $table2='tra_product_information';
//         $field= 'product_id';
//         $mdqry = '';
//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications Report';
//              break;
//            case 2:
//             if($datefilters != ""){
//                 $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//                 $mdqry = $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$Mddatefilters);
//               }else{
//                 $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//               }
             
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           if($datefilters != ""){
//                 $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//                 $mdqry = $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$Mddatefilters);
//               }else{
//                 $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//               }
//              $heading='Report On All Products';
//          }
//            $qry->LeftJoin('par_classifications as t33','t3.classification_id','t33.id')
//                 ->LeftJoin('par_common_names as t44','t3.common_name_id','t44.id')
//                  ->LeftJoin('par_product_categories as t55','t3.product_category_id','t55.id')
//                  ->LeftJoin('par_subproduct_categories as t6','t3.product_subcategory_id','t6.id')
//                  ->LeftJoin('par_productspecial_categories as t7','t3.special_category_id','t7.id')
//                  ->LeftJoin('par_storage_conditions as t8','t3.storage_condition_id','t8.id')
//                  ->LeftJoin('par_product_forms as t9','t3.product_form_id','t9.id')
//                  ->LeftJoin('par_intended_enduser as t10','t3.intended_enduser_id','t10.id')
//                  ->LeftJoin('par_zones as t11','t1.zone_id','t11.id')
//                  ->LeftJoin('par_product_types as t12','t3.product_type_id','t12.id')
//                  ->LeftJoin('wb_trader_account as t13','t1.applicant_id','t13.id')
//                  ->LeftJoin('wb_trader_account as t14','t1.local_agent_id','t14.id')
//                  ->LeftJoin('par_countries as t15','t13.country_id','t15.id')
//                  ->LeftJoin('par_regions as t16','t13.region_id','t16.id')
//                  ->LeftJoin('par_countries as t17','t14.country_id','t17.id')
//                  ->LeftJoin('par_regions as t18','t14.region_id','t18.id')
//                  ->LeftJoin('tra_approval_recommendations as t19','t1.application_code','t19.application_code')
//                  ->LeftJoin('par_approval_decisions as t20','t19.decision_id','t20.id')
//                  ->LeftJoin('tra_registered_products as t21','t1.product_id','t21.tra_product_id')
//                  ->LeftJoin('par_validity_statuses as t22','t19.appvalidity_status_id','t22.id')
//                  ->LeftJoin('par_registration_statuses as t23','t19.appregistration_status_id','t23.id')
//                  ->LeftJoin('par_application_statuses as t24','t1.application_status_id','t24.id')
//                  ->LeftJoin('par_system_statuses as t25','t24.status_id','t25.id')
//                  ->LeftJoin('par_assessment_procedures as t30','t1.assessment_procedure_id','t30.id')
//                  ->LeftJoin('tra_product_retentions as t31','t1.application_code','t31.application_code')
//                  ->LeftJoin('par_retention_statuses as t32','t31.retention_status_id','t32.id')
//                  ->LeftJoin('par_atc_codes as tc','t44.atc_code_id','tc.id')

//                  ->addSelect('t1.tracking_no','t1.reference_no','t1.submission_date','t1.submission_date as ReceivedFrom','t1.submission_date as ReceivedTo','t3.brand_name', 't3.warnings','t3.shelf_life','t3.shelf_lifeafter_opening','t3.instructions_of_use','t3.physical_description', 't33.name as Classification', 't44.name as commonName','t55.name as Category','t6.name as SubCategory','t7.name as SpecialCategory','t8.name as StorageCondition','t9.name as ProductForm','t10.name as IntendedUsers','t3.shelflifeduration_desc','t11.name as issueplace','t12.name as ProductType','t13.name as Trader','t13.postal_address as TraderPostalA','t13.physical_address as TraderPhysicalA','t13.email_address as TraderEmail','t13.telephone_no as TraderTell','t13.mobile_no as TraderMobile','t14.name as LocalAgent','t14.postal_address as LocalAgentPostalA','t14.physical_address as LocalAgentPhysicalA','t14.email_address as 
//                     LocalAgentEmail','t14.telephone_no as LocalAgentTell','t14.mobile_no as AgentMobile','t15.name as TraderCountry','t16.name as TraderRegion','t17.name as AgentCountry','t18.name as AgentRegion','t19.certificate_issue_date as CertIssueDate','t19.expiry_date as CertExpiryDate','t19.certificate_issue_date as IssueFrom','t19.certificate_issue_date as IssueTo','t19.certificate_no','t23.name as registration_status', 't22.name as validity_status','t25.name as application_status', 't30.name as assessment_procedure', 't3.product_strength', 't32.name as retention_status', 'tc.name as atc_code', 'tc.description as atc_code_defination');

//         $results=$qry->get();
//         if($mdqry != ''){
//           $mdqry->LeftJoin('par_classifications as t33','t3.classification_id','t33.id')
//                 ->LeftJoin('par_common_names as t44','t3.common_name_id','t44.id')
//                  ->LeftJoin('par_product_categories as t55','t3.product_category_id','t55.id')
//                  ->LeftJoin('par_subproduct_categories as t6','t3.product_subcategory_id','t6.id')
//                  ->LeftJoin('par_productspecial_categories as t7','t3.special_category_id','t7.id')
//                  ->LeftJoin('par_storage_conditions as t8','t3.storage_condition_id','t8.id')
//                  ->LeftJoin('par_product_forms as t9','t3.product_form_id','t9.id')
//                  ->LeftJoin('par_intended_enduser as t10','t3.intended_enduser_id','t10.id')
//                  ->LeftJoin('par_zones as t11','t1.zone_id','t11.id')
//                  ->LeftJoin('par_product_types as t12','t3.product_type_id','t12.id')
//                  ->LeftJoin('wb_trader_account as t13','t1.applicant_id','t13.id')
//                  ->LeftJoin('wb_trader_account as t14','t1.local_agent_id','t14.id')
//                  ->LeftJoin('par_countries as t15','t13.country_id','t15.id')
//                  ->LeftJoin('par_regions as t16','t13.region_id','t16.id')
//                  ->LeftJoin('par_countries as t17','t14.country_id','t17.id')
//                  ->LeftJoin('par_regions as t18','t14.region_id','t18.id')
//                  ->LeftJoin('tra_approval_recommendations as t19','t1.application_code','t19.application_code')
//                  ->LeftJoin('par_approval_decisions as t20','t19.decision_id','t20.id')
//                  ->LeftJoin('tra_registered_products as t21','t1.product_id','t21.tra_product_id')
//                  ->LeftJoin('par_validity_statuses as t22','t19.appvalidity_status_id','t22.id')
//                  ->LeftJoin('par_registration_statuses as t23','t19.appregistration_status_id','t23.id')
//                  ->LeftJoin('par_application_statuses as t24','t1.application_status_id','t24.id')
//                  ->LeftJoin('par_system_statuses as t25','t24.status_id','t25.id')
//                  ->LeftJoin('par_assessment_procedures as t30','t1.assessment_procedure_id','t30.id')
//                  ->LeftJoin('tra_product_retentions as t31','t1.application_code','t31.application_code')
//                  ->LeftJoin('par_retention_statuses as t32','t31.retention_status_id','t32.id')
//                  ->LeftJoin('par_atc_codes as tc','t44.atc_code_id','tc.id')

//                  ->addSelect('t1.tracking_no','t1.reference_no','t1.submission_date','t1.submission_date as ReceivedFrom','t1.submission_date as ReceivedTo','t3.brand_name', 't3.warnings','t3.shelf_life','t3.shelf_lifeafter_opening','t3.instructions_of_use','t3.physical_description', 't33.name as Classification', 't44.name as commonName','t55.name as Category','t6.name as SubCategory','t7.name as SpecialCategory','t8.name as StorageCondition','t9.name as ProductForm','t10.name as IntendedUsers','t3.shelflifeduration_desc','t11.name as issueplace','t12.name as ProductType','t13.name as Trader','t13.postal_address as TraderPostalA','t13.physical_address as TraderPhysicalA','t13.email_address as TraderEmail','t13.telephone_no as TraderTell','t13.mobile_no as TraderMobile','t14.name as LocalAgent','t14.postal_address as LocalAgentPostalA','t14.physical_address as LocalAgentPhysicalA','t14.email_address as 
//                     LocalAgentEmail','t14.telephone_no as LocalAgentTell','t14.mobile_no as AgentMobile','t15.name as TraderCountry','t16.name as TraderRegion','t17.name as AgentCountry','t18.name as AgentRegion','t19.certificate_issue_date as CertIssueDate','t19.expiry_date as CertExpiryDate','t19.certificate_issue_date as IssueFrom','t19.certificate_issue_date as IssueTo','t19.certificate_no','t23.name as registration_status', 't22.name as validity_status','t25.name as application_status', 't30.name as assessment_procedure', 't32.name as retention_status', 'tc.name as atc_code', 'tc.description as atc_code_defination');
//             $Mdresults=$mdqry->get();
//             $results = $results->merge($Mdresults);
//         }
        
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }

//     public function getExportProductApplications(request $req,$inCall='0'){
//          //filters
//       $filters=$this->registrationreportfilters($req);
//       $datefilters=$this->addedDateFilters($req);
//       $classification_category=$req->classification_category;
//       $product_class_category=$req->product_class_category;
//       $module_id=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       //get data


//       //classification filters
//         $where_class = array();
//         if(validateIsNumeric($classification_category)){
//             $where_class[] ='id = '.$classification_category;
//           }
//         if(validateIsNumeric($product_class_category)){
//             $where_class[] ='prodclass_category_id = '.$product_class_category;
//           }
//        $where_class=array_filter($where_class);
//        $clause='';
//        if (!empty($where_class)) {
//              $clause = implode(' AND ', $where_class);
//           }
//         $where_class=$clause;

//        //classification data
//         $query = DB::table('par_classifications')->select('id');
//         if($where_class!=''){
//             $query->whereRAW($where_class);
//           }
//         $classification_data=$this->implodeArrayToString($query->get(),'id');


//         $data = array();
//         $table_name='tra_product_applications';
//         $table2='tra_product_information';
//         $field= 'product_id';
          
//       $subFilters="t3.classification_id IN (".$classification_data.")";

//      $process_class=$req->process_class;
//      $heading='';
//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications Report';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
       
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All Products';
//          }
//             $qry->LeftJoin('par_classifications as t33','t3.classification_id','t33.id')
//                 ->LeftJoin('par_common_names as t44','t3.common_name_id','t44.id')
//                  ->LeftJoin('par_product_categories as t55','t3.product_category_id','t55.id')
//                  ->LeftJoin('par_subproduct_categories as t6','t3.product_subcategory_id','t6.id')
//                  ->LeftJoin('par_productspecial_categories as t7','t3.special_category_id','t7.id')
//                  ->LeftJoin('par_storage_conditions as t8','t3.storage_condition_id','t8.id')
//                  ->LeftJoin('par_product_forms as t9','t3.product_form_id','t9.id')
//                  ->LeftJoin('par_intended_enduser as t10','t3.intended_enduser_id','t10.id')
//                  ->LeftJoin('par_zones as t11','t1.zone_id','t11.id')
//                  ->LeftJoin('par_product_types as t12','t3.product_type_id','t12.id')
//                  ->LeftJoin('wb_trader_account as t13','t1.applicant_id','t13.id')
//                  ->LeftJoin('wb_trader_account as t14','t1.local_agent_id','t14.id')
//                  ->LeftJoin('par_countries as t15','t13.country_id','t15.id')
//                  ->LeftJoin('par_regions as t16','t13.region_id','t16.id')
//                  ->LeftJoin('par_countries as t17','t14.country_id','t17.id')
//                  ->LeftJoin('par_regions as t18','t14.region_id','t18.id')
//                  ->LeftJoin('tra_approval_recommendations as t19','t1.application_code','t19.application_code')
//                  ->LeftJoin('par_approval_decisions as t20','t19.decision_id','t20.id')

//                  ->addSelect('t1.product_id','t1.submission_date','t1.submission_date as ReceivedFrom','t1.submission_date as ReceivedTo','t1.section_id','t3.brand_name', 't3.warnings','t3.shelf_life','t3.shelf_lifeafter_opening','t3.instructions_of_use','t3.physical_description', 't33.name as Classification', 't44.name as commonName','t55.name as Category','t6.name as SubCategory','t7.name as SpecialCategory','t8.name as StorageCondition','t9.name as ProductForm','t10.name as IntendedUsers','t3.shelflifeduration_desc','t11.name as issueplace','t12.name as ProductType','t13.name as Trader','t13.postal_address as TraderPostalA','t13.physical_address as TraderPhysicalA','t13.email_address as TraderEmail','t13.telephone_no as TraderTell','t13.mobile_no as TraderMobile','t14.name as LocalAgent','t14.postal_address as LocalAgentPostalA','t14.physical_address as LocalAgentPhysicalA','t14.email_address as 
//                     LocalAgentEmail','t14.telephone_no as LocalAgentTell','t14.mobile_no as AgentMobile','t15.name as TraderCountry','t16.name as TraderRegion','t17.name as AgentCountry','t18.name as AgentRegion','t19.certificate_issue_date as CertIssueDate','t19.expiry_date as CertExpiryDate','t19.certificate_issue_date as IssueFrom','t19.certificate_issue_date as IssueTo');

//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }
//     }

//     public function exportPremiseDefinedColumns(request $req,$inCall='0'){
//       $filter_string='';
//       $premise_type_id='';
//       $business_type_id='';
//       $business_scale_id='';
//       $whereRAW=array();
//       $filter=$req->filters;
//       $datefilters='';
//       $sub_module_id = $req->sub_module_id;
//       $datefiltersArray=array();
//       $premise_type=$req->premise_type;
//       $business_type=$req->business_type;
//       $business_scale=$req->business_scale;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $section_id = $req->section_id;
//       $filters = (array)json_decode($filter);

//       if(isset($filters)){

//            foreach($filters as $key => $value) {
        
//               if($key=='t1.section_id' && validateIsNumeric($value)){
//                    $whereRAW[]="t1.section_id = ".$value;
//                    $section_id = $value;
//               }
//                if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.sub_module_id = ".$value;
//               }
//               if($key=='zone_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.zone_id = ".$value;
//               }
//               //dates
//               if($key=='from_date'){
//                     $from_date = $value;
//                 }
//               if($key=='to_date'){
//                     $to_date = $value;
//                 }
//               // if($key=='evaluation_opt' && $value != ''){
//               //    $evaluation_opt=$value;
//               // }
//               // if($key=='premise_type' && validateIsNumeric($value)){
//               //   $premise_type=$value;
//               // }
//               // if($key=='business_type' && validateIsNumeric($value)){
//               //   $business_type=$value;
//               // }else if($key=='business_scale' && validateIsNumeric($value)){
//               //     $business_scale=$value;
//               // }
//               if($key=='directorate_id' && validateIsNumeric($value)){
//                 if(!validateIsNumeric($section_id)){
//                   $sections=$this->getSectionsByDirectorate($value);
//                   if($sections != ''){
//                      $whereRAW[]="t1.section_id IN (".$sections.")";
//                   }
//                 }
//               }
//             }    
//         }
//         if(validateIsNumeric($req->section_id)){
//             $whereRAW[] ="t1.section_id = ".$req->section_id;
//           }

//         if(validateIsNumeric($sub_module_id)){
//             $whereRAW[] ="t1.sub_module_id = ".$sub_module_id;
//           }

//         $whereRAW = array_filter($whereRAW);
//         if (!empty($whereRAW)) {
//             $filter_string = implode(' AND ', $whereRAW);
//         }

//          if($to_date){
//            $datefilters = "date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//          }

//          $filters=$filter_string;

//     //premise type filters
//        //  $where_ptype = array();
//        //  if(validateIsNumeric($premise_type)){
//        //      $where_ptype[] =array('id'=>$premise_type);
//        //    }
//        //  $where_Btype = array();
//        //  if(validateIsNumeric($business_type)){
//        //      $where_Btype[] =array('id'=>$business_type);
//        //    }
//        //  if(validateIsNumeric($section_id)){
//        //      $where_Btype[] =array('section_id'=>$section_id);
//        //    }
//        //  $where_Bscale = array();
//        //  if(validateIsNumeric($business_scale)){
//        //      $where_Bscale[] =array('id'=>$business_scale);
//        //    }

//        // //premise data
//        //  $premquery = DB::table('par_premises_types')->select('id');
//        //  if(!empty($where_ptype)){
//        //      $premquery->where(array($where_ptype));
//        //    }
//        //  $premiseType_data=$this->implodeArrayToString($premquery->get(),'id');

//        //  //business data
//        //  $where_Btype=array_filter($where_Btype);
//        //  $Bsnquery = DB::table('par_business_types')->select('id');
//        //  if(!empty($where_Btype)){
//        //      $Bsnquery->where(array($where_Btype));
//        //    }

//        //  $bsnType_data=$this->implodeArrayToString($Bsnquery->get(),'id');

//        //   //business Scale
//        //  $scalequery = DB::table('par_business_scales')->select('id');
//        //  if(!empty($where_Bscale)){
//        //      $scalequery->where(array($where_Bscale));
//        //    }
//        //  $bsnScale_data=$this->implodeArrayToString($scalequery->get(),'id');

//         $data = array();
//         $table_name=$this->getTableName(2);
//         $table2='tra_premises';
//         $field= 'premise_id';
          
//       $subFilters="";

//      $process_class=$req->process_class;
//      $heading='';
//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All Premises';
//          }
//              $qry->LeftJoin('par_countries as t22','t3.country_id','t22.id')
//                  ->LeftJoin('par_regions as t33','t3.region_id','t33.id')
//                  ->LeftJoin('par_districts as t44','t3.district_id','t44.id')
//                  ->LeftJoin('par_business_types as t55','t3.business_type_id','t55.id')
//                  ->LeftJoin('par_business_scales as t6','t3.business_scale_id','t6.id')
//                  ->LeftJoin('par_business_categories as t7','t3.business_category_id','t7.id')
//                  ->LeftJoin('wb_trader_account as t8','t3.applicant_id','t8.id')
//                  ->LeftJoin('tra_personnel_information as t9','t3.contact_person_id','t9.id')
//                  ->LeftJoin('tra_premises_otherdetails as t10','t3.id','t10.premise_id')
//                  ->LeftJoin('par_business_type_details as t11','t10.business_type_detail_id','t11.id')
//                  ->LeftJoin('par_zones as t12','t1.zone_id','t12.id')
//                  ->leftJoin('par_countries as t13','t8.country_id','t13.id')
//                  ->leftJoin('par_regions as t14','t8.region_id','t14.id')
//                  ->leftJoin('tra_approval_recommendations as t15','t1.application_code','t15.application_code')
//                  ->leftJoin('par_premises_types as t16','t3.premise_type_id','t16.id')
//                  ->LeftJoin('par_approval_decisions as t17','t15.decision_id','t17.id')
//                  ->LeftJoin('par_registration_statuses as t23','t15.appregistration_status_id','t23.id')
//                  ->LeftJoin('par_validity_statuses as t24','t15.appvalidity_status_id','t24.id')
                    

//                 ->addselect('t1.tracking_no','t1.reference_no','t3.name','t3.email','t3.postal_address','t3.physical_address','t3.telephone','t3.mobile_no','t3.contact_person_startdate','t3.contact_person_enddate','t3.gps_coordinate','t22.name as Precountry','t33.name as PreRegion','t44.name as PreDistrict','t55.name as BsnType','t7.name as BsnCategory','t6.name as BsnScale','t8.name as Trader','t8.postal_address as TraderPostalA','t8.physical_address as TraderPhysicalA','t8.email_address as TraderEmail','t8.telephone_no as TraderTell','t8.mobile_no as TraderMobile','t9.name as ContactPerson','t9.telephone_no as ContactTell','t9.email_address as ContactEmail','t11.name as BsnTypeDetails','t12.name as issueplace','t13.name as TraderCountry','t14.name as TraderRegion','t15.expiry_date as CertExpiryDate','t15.certificate_issue_date as CertIssueDate','t16.name as PremiseCategory','t15.certificate_issue_date as IssueFrom','t15.certificate_issue_date as IssueTo','t1.date_added as ReceivedFrom','t1.date_added as ReceivedTo', 't15.certificate_no', 't23.name as registration_status', 't24.name as validity_status')
//                 ->groupBy('t1.application_code');

//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }
//     //GMP registration
//       public function exportGmpDefinedColumns(request $req,$inCall='0'){
//       $filter_string='';
//       $facility_location='';
//       $whereRAW=array();
//       $filter=$req->filters;
//       $datefilters='';
//       $section_id = '';
//       $datefiltersArray=array();
//       $facility_location=$req->facility_location;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $filters = (array)json_decode($filter);

//       if(isset($filters)){

//            foreach($filters as $key => $value) {
        
//               if($key=='t1.section_id' && validateIsNumeric($value)){
//                    $whereRAW[]="t1.section_id = ".$value;
//                    $section_id = $value;
//               }
//                if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.sub_module_id = ".$value;
//               }
//               if($key=='zone_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.zone_id = ".$value;
//               }
//               //dates
//               if($key=='from_date'){
//                        $from_date = $value;
//                   }
//               if($key=='to_date'){
//                      $to_date = $value;
//                 }
//               // if($key=='facility_location' && validateIsNumeric($value)){
//               //   $facility_location=$value;
//               // }
//               if($key=='directorate_id' && validateIsNumeric($value)){
//                 if(!validateIsNumeric($section_id)){
//                     $sections=$this->getSectionsByDirectorate($value);
//                     if($sections!=''){
//                       $whereRAW[]="t1.section_id IN (".$sections.")";
//                     }
//                   }
//                 }
//             }
              
//         }

//         $whereRAW = array_filter($whereRAW);
//               if (!empty($whereRAW)) {
//                   $filter_string = implode(' AND ', $whereRAW);
//               }
          
//         $filters=$filter_string;
//         if($to_date){
//            $datefilters = "date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//          }

//     //gmp type filters
//         $where_facility = array();
//         if(validateIsNumeric($facility_location)){
//             $where_facility[] =array('id'=>$facility_location);
//           }

//        //gmp data
//        //  $qry = DB::table('par_facility_location')->select('id');
//        //  if(!empty($where_facility)){
//        //      $qry->where(array($where_facility));
//        //    }
//        // $facility_location_data=$this->implodeArrayToString($qry->get(),'id');

//         $data = array();
//         $table_name=$this->getTableName(3);
//         $table2='par_gmplocation_details';
//         $field= 'gmp_type_id';
//       //$subFilters="t1.gmp_type_id IN (".$facility_location_data.")";
//       $subFilters="";

//      $process_class=$req->process_class;
//      $heading='';

//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All GMP Applications';
//          }
//           $qry->LeftJoin('par_gmp_assessment_types as t22','t1.assessment_type_id','t22.id')
//                ->LeftJoin('tra_manufacturing_sites as t33','t1.manufacturing_site_id','t33.id')
//                ->LeftJoin('tra_manufacturers_information as t44','t33.manufacturer_id','t44.id')
//                ->LeftJoin('par_countries as t55','t33.country_id','t55.id')
//                ->LeftJoin('par_regions as t6','t33.region_id','t6.id')
//                ->LeftJoin('par_districts as t7','t33.district_id','t7.id')
//                ->LeftJoin('par_business_types as t8','t33.business_type_id','t8.id')
//                ->LeftJoin('par_zones as t9','t1.zone_id','t9.id')
//                ->LeftJoin('wb_trader_account as t10','t33.applicant_id','t10.id')
//                ->LeftJoin('wb_trader_account as t11','t33.ltr_id','t11.id')
//                ->LeftJoin('tra_manufacturing_sites_personnel as t12','t33.contact_person_id','t12.id')
//                ->LeftJoin('par_countries as t14','t10.country_id','t14.id')
//                ->LeftJoin('par_regions as t15','t10.region_id','t15.id')
//                ->LeftJoin('par_countries as t16','t11.country_id','t16.id')
//                ->LeftJoin('par_regions as t17','t11.region_id','t17.id')
//                ->LeftJoin('tra_approval_recommendations as t18','t1.application_code','t18.application_code')
//                ->LeftJoin('par_device_types as t19','t1.device_type_id','t18.id')
               
//                ->LeftJoin('par_gmpapproval_decisions as t21','t18.decision_id','t21.id')
//                ->LeftJoin('par_validity_statuses as tv','t18.appvalidity_status_id','tv.id')
//                ->LeftJoin('par_registration_statuses as tr','t18.appregistration_status_id','tr.id')
//               ->LeftJoin('par_system_statuses as t25','t1.application_status_id','t25.id')

//             ->select('t1.tracking_no','t1.reference_no','t22.name as assessment_procedure','t33.name as manufacturing_site','t33.gps_coordinate','t33.premise_reg_no','t44.name as manufacturer_name','t44.postal_address','t44.physical_address','t44.email_address','t44.mobile_no','t44.telephone_no','t55.name as country','t6.name as region','t7.name as district','t8.name as business_type',DB::raw("(select GROUP_CONCAT(' ', d.name) as BsnTypeDetails from par_business_type_details d inner join tra_mansite_otherdetails site on d.id = site.business_type_detail_id where site.manufacturing_site_id = t33.id) as BsnTypeDetails"),'t9.name as issueplace','t10.name as Trader','t10.physical_address as TraderPhysicalA','t10.postal_address as TraderPostalA','t10.telephone_no as TraderTell','t10.mobile_no as TraderMobile','t10.email_address as TraderEmail','t14.name as TraderCountry','t15.name as TraderRegion','t11.name as LocalAgent','t11.postal_address as LocalAgentPostalA','t11.physical_address as LocalAgentPhysicalA','t11.telephone_no as LocalAgentTell','t11.mobile_no as AgentMobile','t11.email_address as LocalAgentEmail','t16.name as AgentCountry','t17.name as AgentRegion','t12.name as contact_person','t12.postal_address as contact_personPostalA','t12.telephone as contact_personTell','t3.name as FacilityLocation','t18.expiry_date as CertExpiryDate','t18.certificate_issue_date as CertIssueDate','t19.name as DeviceType','t18.certificate_issue_date as IssueFrom','t18.certificate_issue_date as IssueTo','t1.date_added as ReceivedFrom','t1.date_added as ReceivedTo', 't18.certificate_no', 'tv.name as validity_status','tr.name as registration_status', 't21.name as approval_recommendation', 't25.name as application_status')
//              ->groupBy('t1.application_code');

//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }



//  //Import Export registration
    
//      //Import Export registration
//     //Import Export registration
//     //Import Export registration
//     public function exportImportExportDefinedColumns(request $req,$inCall='0'){
//       $filter_string='';
//       $type_category='';
//       $whereRAW=array();
//       $filter=$req->filters;
//       $datefilters='';
//       $section_id = '';
//       $datefiltersArray=array();
//       $type_category=$req->type_category;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $filters = (array)json_decode($filter);

//       if(isset($filters)){

//            foreach($filters as $key => $value) {
        
//               if($key=='t1.section_id' && validateIsNumeric($value)){
//                    $whereRAW[]="t1.section_id = ".$value;
//                    $section_id = $value;
//               }
//                if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.sub_module_id = ".$value;
//               }
//               if($key=='zone_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.zone_id = ".$value;
//               }
//               //dates
//                if($key=='from_date'){
//                        $from_date = $value;
//                   }
//               if($key=='to_date'){
//                      $to_date = $value;
//                 }
      
//               // if($key=='receivedOpt' && $value != ''){
//               //   $received_date_opt=$value;
//               //   if($value==1){
//               //       $value='date_added';
//               //    }else if($value==3){
//               //      $value='submission_date';
//               //    }
//               //     $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//               //     $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               // }
//               // if($key=='approvalOpt' && $value != ''){
//               //    $whereRAW[]="date_format(t17.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//               //    $whereRAW[]="date_format(t17.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               // }
//               // if($key=='evaluation_opt' && $value != ''){
//               //    $evaluation_opt=$value;
//               // }
//               // if($key=='type_category' && validateIsNumeric($value)){
//               //   $type_category=$value;
//               // }
//               if($key=='directorate_id' && validateIsNumeric($value)){
//                 if(!validateIsNumeric($section_id)){
//                     $sections=$this->getSectionsByDirectorate($value);
//                     if($sections!=''){
//                       $whereRAW[]="t1.section_id IN (".$sections.")";
//                     }
//                   }
//                 }
//               }
              
//         }

//         $whereRAW = array_filter($whereRAW);
//               if (!empty($whereRAW)) {
//                   $filter_string = implode(' AND ', $whereRAW);
//               }
          
//         $filters=$filter_string;
//         if($to_date){
//            $datefilters = "date_format(t1.date_added, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//          }
//     //gmp type filters
//        //  $where_type = array();
//        //  if(validateIsNumeric($type_category)){
//        //      $where_type[] =array('id'=>$type_category);
//        //    }

//        // //gmp data
//        //  $qry = DB::table('par_permit_typecategories')->select('id');
//        //  if(!empty($where_type)){
//        //      $qry->where(array($where_type));
//        //    }
//        // $type_category_data=$this->implodeArrayToString($qry->get(),'id');

//         $data = array();
//         $table_name=$this->getTableName(4);
//         $table2='par_permit_typecategories';
//         $field= 'import_typecategory_id';
//      // $subFilters="t1.import_typecategory_id IN (".$type_category_data.")";
//       $subFilters="";

//      $process_class=$req->process_class;
//      $heading='';

//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All Import Exports';
//          }
//        $qry->LeftJoin('sub_modules as t22','t1.sub_module_id','t22.id')
//            ->LeftJoin('par_permit_category as t33','t1.permit_category_id','t33.id')
//            ->LeftJoin('par_permit_reasons as t55','t1.permit_reason_id','t55.id')
//            ->LeftJoin('par_ports_information as t6','t1.port_id','t6.id')
//            ->LeftJoin('par_currencies as t7','t1.paying_currency_id','t7.id')
//            ->LeftJoin('par_consignee_options as t8','t1.consignee_options_id','t8.id')
//            ->LeftJoin('tra_consignee_data as t9','t1.consignee_id','t9.id')
//            ->LeftJoin('tra_permitsenderreceiver_data as t10','t1.sender_receiver_id','t10.id')
//            ->LeftJoin('tra_premises as t11','t1.premise_id','t11.id')
//            ->LeftJoin('par_zones as t12','t1.zone_id','t12.id')
//            ->LeftJoin('par_countries as t13','t10.country_id','t13.id')
//            ->LeftJoin('par_regions as t14','t10.region_id','t14.id')
//            ->LeftJoin('par_countries as t15','t9.country_id','t15.id')
//            ->LeftJoin('par_regions as t16','t9.region_id','t16.id')
//            ->LeftJoin('tra_managerpermits_review as t17','t1.application_code','t17.application_code')
//            ->leftJoin('wb_trader_account as t18','t1.applicant_id','t18.id')
//            ->leftJoin('par_countries as t19','t18.country_id','t19.id')
//            ->leftJoin('par_regions as t20','t18.region_id','t20.id')
//            ->LeftJoin('par_approval_decisions as t21','t17.decision_id','t21.id')
//          //  ->LeftJoin('par_validity_statuses as tv','t17.appvalidity_status_id','tv.id')
//            //->LeftJoin('par_registration_statuses as tr','t17.appregistration_status_id','tr.id')


//           ->select('t1.proforma_invoice_no','t1.tracking_no','t1.reference_no','t1.application_code','t1.proforma_invoice_date','t22.name as type','t33.name as category','t33.name as typecategory','t55.name as permitreason','t6.name as port','t7.name as currency','t8.name as consigneeoption','t9.name as consignee','t9.postal_address as Cpostal_address','t9.physical_address as Cphysical_address','t9.telephone_no as Ctelephone_no','t9.mobile_no as Cmobile_no','t9.email_address as Cemail_address','t15.name as Ccountry','t16.name as Cregion','t10.name as senderreceiver','t10.physical_address as SRphysical_address','t10.postal_address as SRpostal_address','t10.telephone_no as SRtelephone_no','t10.mobile_no as SRmobile_no','t10.email as SRemail_address','t13.name as SRcountry','t14.name as SRregion','t11.name as premisename','t11.postal_address as premisePostalA','t11.physical_address as premisePhysicalA','t11.telephone as premiseTell','t11.mobile_no as premiseMobile','t11.expiry_date as premiseExpiryDate','t12.name as issueplace','t17.expiry_date as CertExpiryDate','t17.certificate_issue_date as CertIssueDate','t18.name as Trader','t18.postal_address as TraderPostalA','t18.physical_address as TraderPhysicalA','t18.telephone_no as TraderTell','t18.mobile_no as TraderMobile','t18.email_address as TraderEmail','t19.name as TraderCountry','t20.name as TraderRegion','t17.certificate_issue_date as IssueFrom','t17.certificate_issue_date as IssueTo','t1.submission_date as ReceivedFrom','t1.submission_date as ReceivedTo','t17.permit_no as certificate_no','t17.appregistration_status_id as validity_status', 't17.appvalidity_status_id as registration_status')
//           ->groupBy('t1.application_code');;
// //'tv.name as validity_status', 'tr.name as registration_status'
//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }
// //Import Export registration
//    //Import Export registration
//      public function exportPromAdvertDefinedColumns(request $req,$inCall='0'){
//       $filter_string='';
//       $classification_id='';
//       $section_id='';
//       $whereRAW=array();
//       $filter=$req->filters;
//       $datefilters='';
//       $datefiltersArray=array();
//       $classification_id=$req->classification_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $filters = (array)json_decode($filter);

//       if(isset($filters)){

//            foreach($filters as $key => $value) {
        
//               if($key=='t1.section_id' && validateIsNumeric($value)){
//                    $whereRAW[]="t1.section_id = ".$value;
//                    $section_id=$value;
//               }
//                if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.sub_module_id = ".$value;
//               }
//               if($key=='zone_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.zone_id = ".$value;
//               }
//               //dates
//               if($key=='from_date'){
//                        $from_date = $value;
//                   }
//               if($key=='to_date'){
//                      $to_date = $value;
//                 }
      
//               // if($key=='receivedOpt' && $value != ''){
//               //   $received_date_opt=$value;
//               //   if($value==1){
//               //       $value='date_added';
//               //    }else if($value==3){
//               //      $value='submission_date';
//               //    }
//               //     $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//               //     $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               // }
//               // if($key=='approvalOpt' && $value != ''){
//               //    $whereRAW[]="date_format(t17.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//               //    $whereRAW[]="date_format(t17.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               // }
//               // if($key=='evaluation_opt' && $value != ''){
//               //    $evaluation_opt=$value;
//               // }
//               // if($key=='classification_id' && validateIsNumeric($value)){
//               //   $classification_id=$value;
//               // }
//               if($key=='directorate_id' && validateIsNumeric($value)){
//                 if(!validateIsNumeric($section_id)){
//                     $sections=$this->getSectionsByDirectorate($value);
//                     if($sections!=''){
//                       $whereRAW[]="t1.section_id IN (".$sections.")";
//                     }
//                   }
//                 }
//              }
              
//         }

//         $whereRAW = array_filter($whereRAW);
//               if (!empty($whereRAW)) {
//                   $filter_string = implode(' AND ', $whereRAW);
//               }
        
          
//         $filters=$filter_string;
//         if($to_date){
//            $datefilters = "date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//          }
//        //promad data
//       //    $where_class=array();
//       // if(validateIsNumeric($classification_id)){
//       //     $where_class="id = ".$classification_id;
//       //     $class_data=DB::table('par_classifications')->whereRAW($where_class)->get();
//       // }else if(validateIsNumeric($section_id)){
//       //     $where_class="id IN (".$this->getClassBySection($section_id).")";
//       //     $class_data=DB::table('par_classifications')->whereRAW($where_class)->get();
//       // }else{
//       //   $class_data=DB::table('par_classifications')->get();
//       // }

//       //  $type_class_data=$this->implodeArrayToString($class_data,'id');

//         $data = array();
//         $table_name=$this->getTableName(14);
//         $table2='par_classifications';
//         $field= 'classification_id';
//       //$subFilters="t1.classification_id IN (".$type_class_data.")";
//       $subFilters="";

//      $process_class=$req->process_class;
//      $heading='';

//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All Promotion And Adverticement';
//          }
//        $qry->LeftJoin('par_product_types as t33','t1.product_type_id','t33.id')
//            ->LeftJoin('wb_trader_account as t44','t1.applicant_id','t44.id')
//            ->LeftJoin('par_regions as t55','t44.region_id','t55.id')
//            ->LeftJoin('par_countries as t6','t44.country_id','t6.id')
//            ->leftJoin('tra_promotionaladvert_personnel as t7','t1.sponsor_id','t7.id')
//            ->LeftJoin('par_regions as t8','t7.region_id','t8.id')
//            ->LeftJoin('par_countries as t9','t7.country_id','t9.id')
//            ->LeftJoin('par_zones as t10','t1.zone_id','t10.id')
//            ->LeftJoin('tra_approval_recommendations as t11','t1.application_code','t11.application_code')
//            ->LeftJoin('par_approval_decisions as t12','t11.decision_id','t12.id')
//            ->LeftJoin('par_validity_statuses as tv','t11.appvalidity_status_id','tv.id')
//            ->LeftJoin('par_registration_statuses as tr','t11.appregistration_status_id','tr.id')


//            ->addselect('t1.tracking_no','t1.reference_no','t3.name as classification','t33.name as type','t44.name as Trader','t44.postal_address as TraderPostalA','t44.physical_address as TraderPhysicalA','t44.telephone_no as TraderTell','t44.mobile_no as TraderMobile','t44.email_address as TraderEmail','t55.name as TraderRegion','t6.name as TraderCountry','t7.name as Sponsor','t7.postal_address as SPostalA','t7.physical_address as SPhysicalA','t7.telephone_no as STell','t7.mobile_no as SMobile','t7.email as SEmail','t8.name as SRegion','t9.name as SCountry','t10.name as CertIssuePlace','t11.certificate_issue_date as CertIssueDate','t11.expiry_date as CertExpiryDate','t11.certificate_issue_date as IssueFrom','t11.certificate_issue_date as IssueTo','t1.submission_date as ReceivedFrom','t1.submission_date as ReceivedTo', 't11.certificate_no', 'tv.name as validity_status', 'tr.name as registration_status')
//            ->groupBy('t1.application_code');

//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }

//    //Clinical Trial registration
//      public function exportClinicalTrialDefinedColumns(request $req,$inCall='0'){
//       $filter_string='';
//       $clinical_category='';
//       $whereRAW=array();
//       $filter=$req->filters;
//       $datefilters='';
//       $datefiltersArray=array();
//       $clinical_category=$req->clinical_category;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $filters = (array)json_decode($filter);

//       if(isset($filters)){

//            foreach($filters as $key => $value) {
        
//               // if($key=='t1.section_id' && validateIsNumeric($value)){
//               //      $whereRAW[]="t1.section_id = ".$value;
//               // }
//                if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.sub_module_id = ".$value;
//               }
//               if($key=='zone_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.zone_id = ".$value;
//               }
//               //dates
//               if($key=='from_date'){
//                  $from_date = $value;
//                 }
//               if($key=='to_date'){
//                      $to_date = $value;
//                 }
      
//               // if($key=='receivedOpt' && $value != ''){
//               //   $received_date_opt=$value;
//               //   if($value==1){
//               //       $value='date_added';
//               //    }else if($value==3){
//               //      $value='submission_date';
//               //    }
//               //     $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//               //     $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               // }
//               // if($key=='approvalOpt' && $value != ''){
//               //    $whereRAW[]="date_format(t17.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//               //    $whereRAW[]="date_format(t17.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               // }
//               // if($key=='evaluation_opt' && $value != ''){
//               //    $evaluation_opt=$value;
//               // }
//               // if($key=='clinical_category' && validateIsNumeric($value)){
//               //   $clinical_category=$value;
//               // }
//               if($key=='directorate_id' && validateIsNumeric($value)){
//                 $sections=$this->getSectionsByDirectorate($value);
//                 if($sections!=''){
//                   $whereRAW[]="t1.section_id IN (".$sections.")";
//                 }
//               }
//             }
              
//         }

//         $whereRAW = array_filter($whereRAW);
//               if (!empty($whereRAW)) {
//                   $filter_string = implode(' AND ', $whereRAW);
//               }
          
//         $filters=$filter_string;
//         if($to_date){
//            $datefilters = "date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//          }
//     //ct type filters
//        //  $where_type = array();
//        //  if(validateIsNumeric($clinical_category)){
//        //      $where_type[] =array('id'=>$clinical_category);
//        //    }

//        // //ct data
//        //  $qryType = DB::table('par_investigationproduct_sections')->select('id');
//        //  if(!empty($where_type)){
//        //      $qryType->where(array($where_type));
//        //    }
//        // $clinical_category_data=$this->implodeArrayToString($qryType->get(),'id');

//         $data = array();
//         $table_name=$this->getTableName(7);
//       $table2='clinical_trial_products';
//       $field= 'id';
//       //$subFilters="t1.clinical_prodsection_id IN (".$clinical_category_data.")";
//       $subFilters="";

//      $process_class=$req->process_class;
//      $heading='';

//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All Clinical Trials';
//          }
//        $qry->LeftJoin('clinical_trial_duration_desc as t22','t1.duration_desc','t22.id')
//            ->LeftJoin('clinical_trial_personnel as t33','t1.sponsor_id','t33.id')
//            ->LeftJoin('clinical_trial_personnel as t44','t1.investigator_id','t44.id')
//            ->leftJoin('tra_application_invoices as t55','t1.application_code','t55.application_code')
//            ->LeftJoin('par_currencies as t6','t55.paying_currency_id','t6.id')
//            ->LeftJoin('par_zones as t7', 't1.zone_id','t7.id')
//            ->LeftJoin('par_countries as t8','t33.country_id','t8.id')
//            ->LeftJoin('par_regions as t9','t33.region_id','t9.id')
//            ->LeftJoin('par_countries as t10','t44.country_id','t10.id')
//            ->LeftJoin('par_regions as t11','t44.region_id','t11.id')
//            ->LeftJoin('tra_approval_recommendations as t12','t1.application_code','t12.application_code')
//            ->LeftJoin('par_approval_decisions as t13','t12.decision_id','t13.id')
//            ->LeftJoin('par_validity_statuses as tv','t12.appvalidity_status_id','tv.id')
//            ->LeftJoin('par_registration_statuses as tr','t12.appregistration_status_id','tr.id')
//            ->LeftJoin('wb_trader_account as t25','t1.applicant_id','t25.id')
//            ->LeftJoin('par_regions as t26','t25.region_id','t26.id')
//            ->LeftJoin('par_countries as t27','t25.country_id','t27.id')

//            ->select('t1.study_title','t1.tracking_no','t1.reference_no','t1.protocol_no','t1.version_no','t1.study_start_date','t1.study_end_date','t1.date_of_protocol','t1.study_duration','t1.clearance_no','t22.name as duration_desc','t33.name as Sponsor','t33.postal_address as Spostal_address','t33.physical_address as Sphysical_address','t33.mobile_no as Smobile_no','t33.telephone as Stelephone_no','t33.email as Semail_address','t8.name as Scountry','t9.name as Sregion','t44.name as investigator','t44.postal_address as Ipostal_address','t44.physical_address as Iphysical_address','t44.mobile_no as Imobile_no','t44.telephone as Itelephone','t44.email as Iemail_address','t10.name as Icountry','t11.name as Iregion','t6.name as paying_currency','t7.name as CertIssuePlace','t12.certificate_issue_date as CertIssueDate','t12.expiry_date as CertExpiryDate','t12.certificate_issue_date as IssueFrom','t12.certificate_issue_date as IssueTo','t1.submission_date as ReceivedFrom','t1.submission_date as ReceivedTo','t12.certificate_no','tv.name as validity_status', 'tr.name as registration_status', 't25.name as applicant','t25.postal_address as applicant_postal_address','t25.physical_address as applicant_physical_address','t25.email_address as applicant_email_address','t25.telephone_no as applicant_telephone','t25.mobile_no as applicant_mobile_no', 't26.name as applicant_region', 't27.name as applicant_country')

//             ->groupBy('t1.application_code');
        
//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }


//     //Disposal registration
//    //Disposal registration
//    //Disposal registration
//     public function exportDisposalDefinedColumns(request $req,$inCall='0'){
//       $filter_string='';
//       $section_id='';
//       $whereRAW=array();
//       $filter=$req->filters;
//       $datefilters='';
//       $datefiltersArray=array();
//       $section_id=$req->section_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $received_date_opt=$req->received_date_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $filters = (array)json_decode($filter);

//       if(isset($filters)){

//            foreach($filters as $key => $value) {
        
//                if($key=='t1.sub_module_id' && validateIsNumeric($value)){
//                   $whereRAW[]="t1.sub_module_id = ".$value;
//               }
//               //dates
//               if(isset($filters['to_date'])!=null && $filters['from_date']!=null){
//                    $to_date=$filters['to_date'];
//                    $from_date=$filters['from_date'];
      
//               if($key=='receivedOpt' && $value != ''){
//                 $received_date_opt=$value;
          
//                     $value='date_added';
                 
//                   $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//                   $datefiltersArray[]="date_format(t1.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               }
//               if($key=='approvalOpt' && $value != ''){
//                  $whereRAW[]="date_format(t19.".$value.", '%Y%-%m-%d')>= '" . formatDate($from_date) . "'";
//                  $whereRAW[]="date_format(t19.".$value.", '%Y%-%m-%d')<= '" . formatDate($to_date) . "'";
//               }
//               if($key=='evaluation_opt' && $value != ''){
//                  $evaluation_opt=$value;
//               }
//               if($key=='section_id' && validateIsNumeric($value)){
//                 $section_id=$value;
//               }
//             }
              
//         }

//         $whereRAW = array_filter($whereRAW);
//               if (!empty($whereRAW)) {
//                   $filter_string = implode(' AND ', $whereRAW);
//               }
//          $datefiltersArray = array_filter($datefiltersArray);
//               if (!empty($datefiltersArray)) {
//                   $datefilters = implode(' AND ', $datefiltersArray);
//               }
//           }
//         $filters=$filter_string;

//     //disposal type filters
//         $where_type = array();
//         if(validateIsNumeric($section_id)){
//             $where_type[] =array('id'=>$section_id);
//           }

//        //disposal data
//         $qryType = DB::table('par_sections')->select('id');
//         if(!empty($where_type)){
//             $qryType->where(array($where_type));
//           }
//        $section_data=$this->implodeArrayToString($qryType->get(),'id');

//         $data = array();
//         $table_name=$this->getTableName(15);
//       $table2='tra_disposal_products';
//       $field= 'id';
//       $subFilters="t1.section_id IN (".$section_data.")";

//      $process_class=$req->process_class;
//      $heading='';

//      if(validateIsNumeric($process_class)){
//          switch ($process_class) {
//            case 1:
//              $qry=$this-> getBroughtForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Brought Forward Applications';
//              break;
//            case 2:
//              $qry=$this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Received Applications Report';
//              break;
//            case 3:
//              $qry=$this-> getEvaluatedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters,$evaluation_opt,$from_date,$to_date);
//              $heading='Evaluated Applications Reports';
//              break;
//            case 4:
//               $qry=$this-> getApprovedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $heading='Approved Applications Reports';
//              break;
//            case 5:
//              $qry= $this-> getRejectedApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//              $heading='Rejected Applications Reports';
//              break;
//            case 6:
//              $qry= $this-> getQueriedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Queried Applications Reports';
//              break;
//            case 7:
//              $qry= $this-> getCarriedForwardApplicationsQuery($table_name,$table2,$field,$filters,$subFilters,$received_date_opt,$evaluation_opt,$from_date,$to_date);
//              $heading='Carried Forward Applications';
//              break;
//          }}else{
//           $qry= $this-> getReceivedApplicationsQuery($table_name,$table2,$field,$subFilters,$filters,$datefilters);
//              $heading='Report On All Disposal Applications';
//          }
//        $qry->LeftJoin('tra_destruction_exercisesites as t22','t1.application_code','t22.application_code')
//             ->LeftJoin('par_disposaldestruction_sites as t33','t22.destruction_site_id','t33.id')
//             ->LeftJoin('tra_methodsof_destructions as t44','t1.application_code','t44.application_code')
//              ->LeftJoin('par_destruction_methods as t55','t44.destructionmethod_id','t55.id')
//              ->LeftJoin('par_packaging_units as t6','t1.packaging_unit_id','t6.id')
//              ->LeftJoin('par_weights_units as t7','t1.weights_units_id','t7.id')
//              ->LeftJoin('par_currencies as t8','t1.currency_id','t8.id')
//              ->LeftJoin('tra_premises as t9','t1.premise_id','t9.id')
//              ->LeftJoin('tra_disposal_inspectors as t10','t22.application_code','t10.application_code')
//              ->LeftJoin('par_disposal_inspectors_titles as t11','t10.inspectors_title_id','t11.id')
//              ->LeftJoin('par_organisations as t12','t10.organisation_id','t12.id')
//              ->LeftJoin('wb_trader_account as t13','t1.trader_id','t13.id')
//              ->LeftJoin('par_countries as t14','t9.country_id','t14.id')
//              ->LeftJoin('par_countries as t15','t13.country_id','t15.id')
//              ->LeftJoin('par_regions as t16','t13.region_id','t16.id')
//              ->LeftJoin('par_zones as t17','t1.zone_id','t17.id')
//              ->LeftJoin('par_sections as t18','t1.section_id','t18.id')
//              ->LeftJoin('tra_approval_recommendations as t19','t1.application_code','t19.application_code')
            
             
//               ->addselect('t1.tracking_no','t1.reference_no','t1.reason_for_disposal','t1.quantity','t1.total_weight','t1.market_value','t1.submission_date','t33.name as destruction_site', 't55.name as destruction_method','t6.name as packaging_unit','t7.name as weight_unit','t8.name as currency','t9.name as premise_name','t9.premise_reg_no','t9.email as premise_email','t9.telephone as premise_tell','t9.physical_address as premise_physical_address','t9.postal_address as premise_postal_address','t10.inspector_name as inspector_name','t11.name as inpsector_title','t12.name as inpsector_organisation','t13.name as trader_name','t13.postal_address as trader_postal_address','t13.physical_address as trader_physical_address','t13.email_address as trader_email_address','t13.telephone_no as trader_telephone','t13.mobile_no as trader_mobile_no','t14.name as premise_country','t15.name as trader_country','t16.name as trader_region','t17.name as CertIssuePlace','t18.name as product_type','t19.certificate_issue_date as CertIssueDate','t19.expiry_date as CertExpiryDate','t19.certificate_no');
    
//         $results=$qry->get();
//         if($inCall==0){
//                 $res = array(
//                           'success' => true,
//                           'results' => $results,
//                           'message' => 'All is well'
//                       );
//                return \response()->json($res);
//               }
//               else{
//                 $res = array(
//                           'results' => $results,
//                           'heading' => $heading
//                       );
//                 return $res;
//               }


//     }
// // //helper
//     public function implodeArrayToString($array,$field){
//       $data=array();
//       $StringArray='';
//       foreach ($array as $value) {
//         $data[]=$value->$field;
//       }
//       array_filter($data);
//       if(!empty($data!='')){
//         $StringArray=implode(",", $data);
//       }else{
//         $StringArray='';
//       }

//       return $StringArray;
//     }
//     public function getSectionsByDirectorate($dir){
//       $qry=DB::table('par_sections')->where('directorate_id',$dir)->select('id')->get();
//       $sec=$this->implodeArrayToString($qry,'id');
      
//       return $sec;
//     }
//     public function getClassBySection($sec){
//       $qry=DB::table('par_classifications')->where('section_id',$sec)->select('id')->get();
//       $sec=$this->implodeArrayToString($qry,'id');
      
//       return $sec;
//     }
// function toAlpha($num){
//     return chr(substr("000".($num+65),-3));
// }
// function number_to_alpha($num,$code)
// {   
//     $alphabets = array('', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');

//     $division = floor($num / 26);
//     $remainder = $num % 26; 

//     if($remainder == 0)
//     {
//         $division = $division - 1;
//         $code .= 'Z';
//     }
//     else
//         $code .= $alphabets[$remainder];

//     if($division > 26)
//         return number_to_alpha($division, $code);   
//     else
//         $code .= $alphabets[$division];     

//     return strrev($code);
// }

//      public function exportData(request $req){
        
//   //data capture
//         $function=$req->function;
//         $response=$this->$function($req,1);
//         $data=$response['results'];
//         $heading=$response['heading'];
//         $data_array = json_decode(json_encode($data), true);

// //product application details
//         $ProductSpreadsheet = new Spreadsheet();
//         $sheet = $ProductSpreadsheet->getActiveSheet();
//        // $ProductSpreadsheet->getActiveSheet()->setTitle($heading);
//         $cell=0;


        
// //Main heading style
//         $styleArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ],
//                 'fill' => [
//                     'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
//                     'rotation' => 90,
//                     'startColor' => [
//                         'argb' => 'FFA0A0A0',
//                     ],
//                     'endColor' => [
//                         'argb' => 'FFFFFFFF',
//                     ],
//                 ]
//             ];
//           $styleHeaderArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ]
//             ];

//       if(isset($data_array[0])){
//           $header=array_keys($data_array[0]);
//           $length=count($header);
//        }
//        else{
//           $data_array=array();
//           $header=array();
//           $length=1;
//           $sheet->getCell('A2')->setValue("No data");
//        }

//        $size=count($data_array)+7;

//   //add sn column
//        $sheet->insertNewColumnBefore('A', 1);

//   //adding formats to header
//        array_unshift($header,"S/N");
//        $sheet->fromArray($header, null, "A7");

//   //loop data while writting
//        $sheet->fromArray( $data_array, null,  "B8");

//   //add S/N counter 
//        for($i=8; $i <= $size; $i++){
//           $sheet->getCell('A'.$i)->setValue($i-7);
//        }
//         $length = $length+1; //add one for the new column added 
//         $letter=$this->number_to_alpha($length,"");
      
//   //set cell text wrap true for all columns
//         $cellRange = 'A7:'.$letter.''.$size;
//         $sheet->getStyle($cellRange)->getAlignment()->setWrapText(true);
//         $sheet->getColumnDimension('A')->setAutoSize(true);

//   //add heading title
//         $sheet->mergeCells('A1:'.$letter.'6')
//             ->getCell('A1')
//             ->setValue("TANZANIAN MEDICINE AND MEDICAL DEVICES AGENCY\nP.O. Box 77150, Nelson Mandela Road,Mabibo External\nTell : +255 22 2450512/2450751/2452108 Fax : +255 28 2541484\nWebsite: www.tfda.go.tzEmail: info@tfda.go.tz\n".$heading);
//         $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
//         $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);

//       //format row headers 
//        $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray);

//       //create file
//        $writer = new Xlsx($ProductSpreadsheet);
         

//       $response =  new StreamedResponse(
//           function () use ($writer) {
//               $writer->save('php://output');
//           }
//       );
//       $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       $response->headers->set('Content-Disposition', 'attachment;filename='.$req->filename.'.xlsx');
//       $response->headers->set('Cache-Control','max-age=0');


//      return $response;
//             }
//    public function exportDefinedColumnData(request $req){
       
//         //data
//         $function=$req->function;
//         $header=$req->header;

//         $response=$this->$function($req,1);
//         $data=$response['results'];
//         $heading=$response['heading'];
//         $data_array = json_decode(json_encode($data), true);
 
// //product application details
//         $ProductSpreadsheet = new Spreadsheet();
//         $sheet = $ProductSpreadsheet->getActiveSheet();
//       //  $ProductSpreadsheet->getActiveSheet()->setTitle($heading);
//         $cell=0;


        
// //Main heading style
//         $styleArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ],
//                 'fill' => [
//                     'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
//                     'rotation' => 90,
//                     'startColor' => [
//                         'argb' => 'FFA0A0A0',
//                     ],
//                     'endColor' => [
//                         'argb' => 'FFFFFFFF',
//                     ],
//                 ]
//             ];
//           $styleHeaderArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ]
//             ];

    
    
//         $sortedData=array();
//         $i=0;
//         $k=0;
//         $temp=[];
//         if(!empty($header)){
//               $header=  json_decode($header, true); 
//             }else{
//               $header=array();
//             }
        
//        $length=count($header);

//         $letter=$this->number_to_alpha($length,"");     
          
//             //get the columns
//             foreach ($header as $uheader){
//                              $temp[$i]=$uheader;
//                           $i++;
//                         }
//            $total=count($temp);
         
//            //match values
//              foreach ($data as $udata)
//                   {
//                              for($v=0;$v<$total-1;$v++){
//                              $temp1=$temp[$v];
//                              $sortedData[$k][]=$udata->$temp1;
//                       }
                     
//                       $k++;  
//                  }
//          //first heading
//                 $sheet->mergeCells('A1:'.$letter.'6')
//                       ->getCell('A1')
//                       ->setValue("TANZANIAN MEDICINE AND MEDICAL DEVICES AGENCY\nP.O. Box 77150, Nelson Mandela Road,Mabibo External\nTell : +255 22 2450512/2450751/2452108 Fax : +255 28 2541484\nWebsite: www.tfda.go.tzEmail: info@tfda.go.tz\n".$heading);
//                 $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
//                 $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);
//         //headers 
//                $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray);

//         //set autosize\wrap true for all columns
//             $size=count($sortedData)+7;
//             $cellRange = 'A7:'.$letter.''.$size;
//             if($length > 11){
//                 $sheet->getStyle($cellRange)->getAlignment()->setWrapText(true);
//             }
//             else{
//                 if($length>26){
//                   foreach(range('A','Z') as $column) {
//                           $sheet->getColumnDimension($column)->setAutoSize(true);
//                       }

//                   $remainder=27;
//                   while ($remainder <= $length) {
//                     $column=$this->number_to_alpha($remainder,"");
//                     $sheet->getColumnDimension($column)->setAutoSize(true);
//                     $remainder++;
//                   }

//                 }else{

//                   foreach(range('A',$letter) as $column) {
//                     //dd(range('A',$letter) );
//                           $sheet->getColumnDimension($column)->setAutoSize(true);
//                       }

//                 }
//             }

//           //adding formats to header
//                $sheet->fromArray($header, null, "A7");
//         //loop data while writting
//                $sheet->fromArray( $sortedData, null,  "A8");
//         //create file
//             $writer = new Xlsx($ProductSpreadsheet);
         

//            $response =  new StreamedResponse(
//             function () use ($writer) {
//                 $writer->save('php://output');
//             }
//         );
//         $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         $response->headers->set('Content-Disposition', 'attachment;filename='.$req->filename.'.xlsx');
//         $response->headers->set('Cache-Control','max-age=0');


//        return $response;

// // $response =  array(
// //    'name' => "ApplicationExport.Xlsx", //no extention needed
// //    'file' => "data:application/vnd.ms-excel.spreadsheetml.sheet;base64,".base64_encode($response) //mime type of used format
// // );
// // return $response;
// //         return $response;

//             }


//     //additional reports 
//    public function getPremiseZonalGridReports(Request $req){
// $sub_module_id = $req->sub_module_id;
// $section_id = $req->section_id;
// $zone_id = $req->zone_id;
// $from_date = $req->from_date;
// $received_opt = $req->received_opt;
// $evaluation_opt = $req->evaluation_opt;
// $to_date = $req->to_date;
// $business_type_category_id = $req->business_type_category_id;

// $receivedDateFilters=$this->addedDateFilters($req);

// $approvalDateFilters = "date_format(t5.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";

// $where_sub=array();
// if(validateIsNumeric($sub_module_id)){
// $where_sub = array('id'=>$sub_module_id);
// }
// $sub_data = DB::table('sub_modules')->where($where_sub)->get();

// $where_sec=array();
// if(validateIsNumeric($section_id)){
// $where_sec = array('id'=>$section_id);
// }
// $sec_data = DB::table('par_sections')->where($where_sec)->get();

// $where_zone=array();
// if(validateIsNumeric($zone_id)){
// $where_zone = array('id'=>$zone_id);
// }
// $zone_data = DB::table('par_zones')->where($where_zone)->get();

// $where_bsnCat=array();
// if(validateIsNumeric($business_type_category_id)){
// $where_bsnCat = array('id'=>$business_type_category_id);
// }
// $bsnCat_data = DB::table('par_businesstype_categories')->where($where_bsnCat)->get();

// $results = array();
// foreach ($sub_data as $sub) {
// foreach ($sec_data as $sec) {
// foreach ($zone_data as $zone) {
// foreach ($bsnCat_data as $bsnCat) {
// $large_scale=$this->getPremiseCountByScale($sub->id,$sec->id,$zone->id,$bsnCat->id,$receivedDateFilters,$approvalDateFilters,'3');
// $medium_scale=$this->getPremiseCountByScale($sub->id,$sec->id,$zone->id,$bsnCat->id,$receivedDateFilters,$approvalDateFilters,'2');
// $small_scale=$this->getPremiseCountByScale($sub->id,$sec->id,$zone->id,$bsnCat->id,$receivedDateFilters,$approvalDateFilters,'1');
// $total=$small_scale+$large_scale+$medium_scale;
// $results[] = array(
// 'sub_module'=>$sub->name,
// 'section_name'=>$sec->name,
// 'zone_name'=>$zone->name,
// 'business_category_type'=>$bsnCat->name,
// 'small_scale'=>$small_scale,
// 'medium_scale'=>$medium_scale,
// 'large_scale'=>$large_scale,
// 'total'=>$total
// );
// }
// }
// }
// }
// $res = array(
// 'success'=>true,
// 'results'=>$results,
// 'message'=>'All is well'
// );
// return $res;
// }
//  public function getProductAssessmentGridReports(Request $req){
//           $sub_module_id = $req->sub_module_id;
//           $section_id = $req->section_id;
//           $classification_id = $req->classification_id;
//           $from_date = $req->from_date;
//           $received_opt = $req->received_opt;
//           $evaluation_opt = $req->evaluation_opt;
//           $to_date = $req->to_date;
//           $assessment_procedures = $req->assessment_procedures;

//           $receivedDateFilters=$this->addedDateFilters($req);

//           $approvalDateFilters = "date_format(t5.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";

//           $where_sub=array();
//           if(validateIsNumeric($sub_module_id)){
//               $where_sub = array('id'=>$sub_module_id); 
//           }
//           $sub_data = DB::table('sub_modules')->where($where_sub)->get();

//           $where_sec=array();
//           if(validateIsNumeric($section_id)){
//               $where_sec = array('id'=>$section_id); 
//           }
//           $sec_data = DB::table('par_sections')->where($where_sec)->get();

//           $where_class=array();
//           if(validateIsNumeric($classification_id)){
//               $where_class = array('id'=>$classification_id); 
//           }

//           $where_assesment=array();
//           if(validateIsNumeric($assessment_procedures)){
//               $where_assesment = array('id'=>$assessment_procedures); 
//           }

//           $results = array();
//           foreach ($sub_data as $sub) {

//               foreach ($sec_data as $sec) {
//                   $assesment_data=DB::table('par_assessment_procedures')->where($where_assesment)->where('section_id',$sec->id)->get();

//                  foreach ($assesment_data as $a_data) {
//                       $class_data = DB::table('par_classifications')->where($where_class)->where('section_id',$sec->id)->get();

//                      foreach ($class_data as $c_data) {
//                       $received=$this->getProductQueriedAppByAssesment($sub->id,$sec->id,$c_data->id,$a_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
//                       $queried=$this->getProductReceivedAppByAssesment($sub->id,$sec->id,$c_data->id,$a_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
//                       $total=$received+$queried;
//                        $results[] = array(
//                             'sub_module'=>$sub->name,
//                             'section_name'=>$sec->name,
//                             'classification_name'=>$c_data->name,
//                             'assessment_procedure'=>$a_data->name,
//                             'received_applications'=>$received,
//                             'queried_applications'=>$queried,
//                             'total'=>$total
//                        );
//                     }
//                  }
//               }
//           }
//           $res = array(
//              'success'=>true,
//              'results'=>$results,
//              'message'=>'All is well'
//           );
//   return $res;
//     }

//   public function getProductClassificationGridReports(Request $req){
//           $sub_module_id = $req->sub_module_id;
//           $section_id = $req->section_id;
//           $classification_id = $req->classification_id;
//           $from_date = $req->from_date;
//           $received_opt = $req->received_opt;
//           $evaluation_opt = $req->evaluation_opt;
//           $to_date = $req->to_date;
//           $assessment_procedures = $req->assessment_procedures;

//           $receivedDateFilters=$this->addedDateFilters($req);

//           $where_sub=array();
//           if(validateIsNumeric($sub_module_id)){
//               $where_sub = array('id'=>$sub_module_id); 
//           }
//           $sub_data = DB::table('sub_modules')->where($where_sub)->get();

//           $where_sec=array();
//           if(validateIsNumeric($section_id)){
//               $where_sec = array('id'=>$section_id); 
//           }
//           $sec_data = DB::table('par_sections')->where($where_sec)->get();

//           $where_class=array();
//           if(validateIsNumeric($classification_id)){
//               $where_class = array('id'=>$classification_id); 
//           }

//           $where_assesment=array();
//           if(validateIsNumeric($assessment_procedures)){
//               $where_assesment = array('id'=>$assessment_procedures); 
//           }

//           $results = array();
//           foreach ($sub_data as $sub) {

//               foreach ($sec_data as $sec) {
//                   $class_data = DB::table('par_classifications')->where($where_class)->where('section_id',$sec->id)->get();

//                  foreach ($class_data as $c_data) {
//                     $assesment_data=DB::table('par_assessment_procedures')->where($where_assesment)->where('section_id',$sec->id)->get();

//                     foreach ($assesment_data as $a_data) {
//                       $received=$this->getProductQueriedAppByAssesment($sub->id,$sec->id,$c_data->id,$a_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
//                       $queried=$this->getProductReceivedAppByAssesment($sub->id,$sec->id,$c_data->id,$a_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
//                       $total=$received+$queried;
//                        $results[] = array(
//                             'sub_module'=>$sub->name,
//                             'section_name'=>$sec->name,
//                             'classification_name'=>$c_data->name,
//                             'assessment_procedure'=>$a_data->name,
//                             'received_applications'=>$received,
//                             'queried_applications'=>$queried,
//                             'total'=>$total
//                        );
//                     }
//                  }
//               }
//           }
//           $res = array(
//              'success'=>true,
//              'results'=>$results,
//              'message'=>'All is well'
//           );
//   return $res;
//     }

//   public function getDisposalTypeGridReports(Request $req){
//           $product_type = $req->product_type;
//           $disposal_type = $req->disposal_type;
//           $from_date = $req->from_date;
//           $received_opt = $req->received_opt;
//           $evaluation_opt = $req->evaluation_opt;
//           $to_date = $req->to_date;

//           $receivedDateFilters=$this->addedDateFilters($req);

//           $where_prod=array();
//           if(validateIsNumeric($product_type)){
//               $where_prod = array('id'=>$product_type); 
//           }

//           $where_disposal=array();
//           if(validateIsNumeric($disposal_type)){
//               $where_disposal = array('id'=>$disposal_type); 
//           }

//           $results = DB::table('tra_disposal_applications as t1')
//                     ->leftJoin('par_packaging_units as t2','t1.packaging_unit_id','t2.id')
//                     ->leftJoin('par_currencies as t3','t1.currency_id','t3.id')
//                     ->leftJoin('par_sections as t4','t1.section_id','t4.id')
//                    // ->leftJoin('par_currencies as t5','t1.paying_currency_id','t5.id')

//                     ->select('t4.name as product_type','t1.total_weight','t1.market_value','t2.name as packaging_unit','t3.name as currency')
//                     ->get();
          
//           $res = array(
//              'success'=>true,
//              'results'=>$results,
//              'message'=>'All is well'
//           );
//   return $res;
//     }

// public function getImportExportPermitGridReports(Request $req){
//           $sub_module_id = $req->sub_module_id;
//           $section_id = $req->section_id;
//           $category_type = $req->category_type;
//           $from_date = $req->from_date;
//           $received_opt = $req->received_opt;
//           $evaluation_opt = $req->evaluation_opt;
//           $to_date = $req->to_date;

//           $receivedDateFilters=$this->addedDateFilters($req);

//           $where_sub=array();
//           if(validateIsNumeric($sub_module_id)){
//               $where_sub = array('id'=>$sub_module_id); 
//           }
//           $sub_data = DB::table('sub_modules')->where($where_sub)->where('module_id',4)->get();

//           $where_sec=array();
//           if(validateIsNumeric($section_id)){
//               $where_sec = array('id'=>$section_id); 
//           }
//           $sec_data = DB::table('par_sections')
//     ->whereIn('id',[2,4])->where($where_sec)->get();

//           $where_cat=array();
//           if(validateIsNumeric($category_type)){
//               $where_cat = array('id'=>$category_type); 
//           }

//           $results = array();
//           foreach ($sub_data as $sub) {

//               foreach ($sec_data as $sec) {
//                   $cat_data = DB::table('par_permit_typecategories')->where($where_cat)->where('section_id',$sec->id)->get();

//                  foreach ($cat_data as $c_data) {
//                       $received=$this->getReceivedImportExpotPermit($sub->id,$sec->id,$c_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
//                       $approved=$this->getApprovedImportExpotPermit($sub->id,$sec->id,$c_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
//                       $inspected=$this->getInspectedImportExpotPermit($sub->id,$sec->id,$c_data->id,$receivedDateFilters,$evaluation_opt,$to_date,$from_date);
                      
//                        $results[] = array(
//                             'sub_module_name'=>$sub->name,
//                             'section_name'=>$sec->name,
//                             'category_name'=>$c_data->name,
//                             'received_applications'=>$received,
//                             'approved_applications'=>$approved,
//                             'inspected_applications'=>$inspected
//                        );
//                  }
//               }
//           }
//           $res = array(
//              'success'=>true,
//              'results'=>$results,
//              'message'=>'All is well'
//           );
//   return $res;
//     }

// //more helpers functions
//         public function getPremiseCountByScale($sub,$sec,$zone,$bsnCat,$receivedDateFilters,$approvalDateFilters,$scale){

//         $qry=DB::table('tra_premises_applications as t1')
//               ->join('tra_premises as t2','t1.premise_id','t2.id')
//               ->leftJoin('par_business_types as t3','t2.business_type_id','t3.id')
//               ->join('tra_approval_recommendations as t5','t1.application_code','t5.application_code')
//               ->join('tra_payments as tp','t1.application_code','tp.application_code')
//               ->where(array('t1.sub_module_id'=>$sub,'t1.section_id'=>$sec,'t1.zone_id'=>$zone,'t3.business_typecategory_id'=>$bsnCat))
//               ->where('t2.business_scale_id',$scale);
//         //date filters
         
//          if($receivedDateFilters!= ''){
//             $qry->whereRAW($receivedDateFilters);
//             $qry->whereRAW($approvalDateFilters);
//           }
         
//          $total=$qry->get()->count();

//          return $total;
//     }

//      public function getProductQueriedAppByAssesment($sub,$sec,$class,$assesment_procedure,$receivedDateFilters,$evaluation_opt,$to_date,$from_date){

//         $qry=DB::table('tra_product_applications as t1')
//               ->join('tra_application_query_reftracker as t2','t1.application_code','t2.application_code')
//               ->join('tra_product_information as t3','t1.product_id','t3.id')

//               ->where(array('t1.sub_module_id'=>$sub,'t1.section_id'=>$sec,'t3.classification_id'=>$class,'t1.assessment_procedure_id'=>$assesment_procedure));
        
//         //date filters
//          if($receivedDateFilters!= ''){
//             $qry->whereRAW($receivedDateFilters);
//             $qry->whereRAW("date_format(t2.".$evaluation_opt.", '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//           }
         
//          $total=$qry->get()->count();

//          return $total;
//     }

//      public function getProductReceivedAppByAssesment($sub,$sec,$class,$assesment_procedure,$receivedDateFilters,$evaluation_opt,$to_date,$from_date){

//         $qry=DB::table('tra_product_applications as t1')
//               ->join('tra_product_information as t2','t1.product_id','t2.id')
//               ->where(array('t1.sub_module_id'=>$sub,'t1.section_id'=>$sec,'t2.classification_id'=>$class,'t1.assessment_procedure_id'=>$assesment_procedure));
//         //date filters
         
//          if($receivedDateFilters!= ''){
//             $qry->whereRAW($receivedDateFilters);
//             //$qry->whereRAW($approvalDateFilters);
//           }
         
//          $total=$qry->get()->count();

//          return $total;
//     }
//      public function getReceivedImportExpotPermit($sub,$sec,$category,$receivedDateFilters,$evaluation_opt,$to_date,$from_date){

//         $qry=DB::table('tra_importexport_applications as t1')
//               ->where(array('t1.sub_module_id'=>$sub,'t1.section_id'=>$sec,'t1.import_typecategory_id'=>$category));
//         //date filters
         
//          if($receivedDateFilters!= ''){
//             $qry->whereRAW($receivedDateFilters);
//           }
         
//          $total=$qry->get()->count();

//          return $total;
//     }
//      public function getApprovedImportExpotPermit($sub,$sec,$category,$receivedDateFilters,$evaluation_opt,$to_date,$from_date){

//         $qry=DB::table('tra_importexport_applications as t1')
//               ->join('tra_managerpermits_review as t2','t1.application_code','t2.application_code')
//               ->where(array('t1.sub_module_id'=>$sub,'t1.section_id'=>$sec,'t1.import_typecategory_id'=>$category));
//         //date filters
         
//          if($receivedDateFilters!= ''){
//             $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
           
//           }
         
//          $total=$qry->get()->count();

//          return $total;
//     }

//      public function getInspectedImportExpotPermit($sub,$sec,$category,$receivedDateFilters,$evaluation_opt,$to_date,$from_date){

//         $qry=DB::table('tra_importexport_applications as t1')
//               ->join('tra_poe_applications as t2','t1.application_code','t2.application_code')
//               ->where(array('t1.sub_module_id'=>$sub,'t1.section_id'=>$sec,'t1.import_typecategory_id'=>$category));
//         //date filters
//          if($receivedDateFilters!= ''){
//             $qry->whereRAW("date_format(t2.".$evaluation_opt.", '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//           }
         
//          $total=$qry->get()->count();

//          return $total;
//     }


// //registered Applications
//   public function getRegisteredApplicationsGridReports(Request $req){
//       $sub_module_id = $req->sub_module_id;
//       $section_id = $req->section_id;
//       $module_id = $req->module_id;
//       $from_date = $req->from_date;
//       $registration_date = $req->registration_date;
//       $approval_opt = $req->approval_opt;
//       $to_date = $req->to_date;
//       $expiry_date = $req->expiry_date;
//       $validity_status_id = $req->validity_status_id;
//       $registration_status_id = $req->registration_status_id;
//       $filters = $req->filter;


//       if(validateIsNumeric($module_id)){
//           switch ($module_id) {
//             case 1:
//               $reg_table = 'tra_registered_products';
//               $application_table = 'tra_product_applications';
//               $app_field = "reg_product_id";
//               $reg_field = "tra_product_id";
//               break;
//              case 2:
//               $reg_table = 'registered_premises';
//               $application_table = 'tra_premises_applications';
//               $app_field = "reg_premise_id";
//               $reg_field = "tra_premise_id";
//               break;
//              case 3:
//               $reg_table = 'tra_registered_products';
//               $application_table = 'tra_gmp_applications';
//               $app_field = "tra_site_id";
//               $reg_field = "reg_site_id";
//               break;
//              case 5:
//               $reg_table = 'registered_surveillance';
//               $application_table = 'tra_surveillance_applications';
//               $app_field = "reg_surveillance_id";
//               $reg_field = "tra_surveillance_id";
//               break;
//             case 7:
//               $reg_table = 'registered_clinical_trials';
//               $application_table = 'tra_clinical_trial_applications';
//               $app_field = "reg_clinical_trial_id";
//               $reg_field = "tra_clinical_trial_id";
//               break;
//             default:
//               $res = array(
//                   'success' =>false,
//                   'message' =>"Module not Applicable"
//                 );
//               return $res;
//               break;
//           }
//           if($module_id == 1){
//              $getRegistered = DB::table($reg_table.' as t1')
//                           ->join($application_table.' as t2','t1.'.$reg_field,'t2.'.$app_field)
//                           ->join("tra_approval_recommendations as t3",'t2.application_code','t3.application_code')
//                           ->leftJoin("par_validity_statuses as t4",'t1.validity_status_id','t4.id')
//                           ->leftJoin("par_registration_statuses as t5",'t1.registration_status_id','t5.id')
//                           ->leftJoin("wb_trader_account as t6",'t2.applicant_id','t6.id')
//                           ->leftJoin("par_sections as t7",'t2.section_id','t7.id')
//                           ->leftJoin("sub_modules as t8",'t2.sub_module_id','t8.id')
//                           ->select('t6.name as applicant_name','t1.registration_date','t2.reference_no','t2.tracking_no','t3.certificate_issue_date','t3.certificate_no','t3.approval_date','t3.expiry_date','t4.name as validity_status','t5.name as registration_status','t6.name as applicant_name','t7.name as section_name','t8.name as sub_module_name');
//                 if(validateIsNumeric($validity_status_id)){
//                         $getRegistered->where('t1.validity_status_id', $validity_status_id);
//                     }
//                 if(validateIsNumeric($registration_status_id)){
//                         $getRegistered->where('t1.registration_status_id', $registration_status_id);
//                     }
//              }
//             else{
//               $getRegistered = DB::table($reg_table.' as t1')
//                           ->join($application_table.' as t2','t1.'.$reg_field,'t2.'.$app_field)
//                           ->join("tra_approval_recommendations as t3",'t2.application_code','t3.application_code')
//                           ->leftJoin("par_validity_statuses as t4",'t1.validity_status','t4.id')
//                           ->leftJoin("par_registration_statuses as t5",'t1.registration_status','t5.id')
//                           ->leftJoin("wb_trader_account as t6",'t2.applicant_id','t6.id')
//                           ->leftJoin("par_sections as t7",'t2.section_id','t7.id')
//                           ->leftJoin("sub_modules as t8",'t2.sub_module_id','t8.id')
//                           ->select('t6.name as applicant_name','t1.registration_date','t2.reference_no','t2.tracking_no','t3.certificate_issue_date','t3.certificate_no','t3.approval_date','t3.expiry_date','t4.name as validity_status','t5.name as registration_status','t6.name as applicant_name','t7.name as section_name','t8.name as sub_module_name');
//                 if(validateIsNumeric($validity_status_id)){
//                     $getRegistered->where('t1.validity_status', $validity_status_id);
//                   }
//                 if(validateIsNumeric($registration_status_id)){
//                       $getRegistered->where('t1.registration_status', $registration_status_id);
//                   }
//              }
          

//           //filters
//           $where_clause = array();
//           if(validateIsNumeric($sub_module_id)){
//              $getRegistered->where('t2.sub_module_id', $sub_module_id);
//           }
//            if(validateIsNumeric($section_id)){
//               $getRegistered->where('t2.section_id', $section_id);
//           }
           

//           //dates
//            if(validateIsNumeric($approval_opt)){
//               $getRegistered->whereRAW("date_format(t3.approval_date, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//           }
//           if(validateIsNumeric($registration_date)){
//               $getRegistered->whereRAW("date_format(t1.registration_date, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//           }
//            if(validateIsNumeric($expiry_date)){
//               $getRegistered->whereRAW("date_format(t3.expiry_date, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//           }


//           //grid filter plugins
//           $filters = (array)json_decode($filters);

//                 if(isset($filters)){

//                             foreach($filters as $key => $value) {

//                                 if($key=='approval_date' && $value != ''){
//                                       $getRegistered->whereRAW("date_format(t3.approval_date, '%Y%-%m-%d') = '" . formatDate($value->value) . "'");
//                                   }
//                                 if($key=='expiry_date' && $value != ''){
//                                       $getRegistered->whereRAW("date_format(t3.expiry_date, '%Y%-%m-%d') = '" . formatDate($value->value) . "'");
//                                   }
//                                 if($key=='certificate_issue_date' && $value != ''){
//                                     $getRegistered->whereRAW("date_format(t3.certificate_issue_date, '%Y%-%m-%d') = '" . formatDate($value->value) . "'");
//                                 }
//                                 if($key=='certificate_no' && $value != ''){
//                                     $getRegistered->whereRAW("t3.certificate_no = '" . formatDate($value->value) . "'");
//                                 }
//                               }
                                
//                           }
//       $results = $getRegistered->get();
//       $res = array(
//           'success' => true,
//           'results' => $results,
//           'message' => "All is well"
//       );
                     

//       }else{
//         $res = array(
//           'success' =>false,
//           'message' =>"Please select a module"
//         );
//       }

//       return json_encode($res);
//   }

//   public function getRegisteredApplicationsCounterGridReports(Request $req){
//        $sub_module_id = $req->sub_module_id;
//       $section_id = $req->section_id;
//       $module_id = $req->module_id;
//       $from_date = $req->from_date;
//       $registration_date = $req->registration_date;
//       $approval_opt = $req->approval_opt;
//       $expiry_date = $req->expiry_date;
//       $validity_status_id = $req->validity_status_id;
//       $registration_status_id = $req->registration_status_id;
//       $to_date = $req->to_date;


//       if(validateIsNumeric($module_id)){
//           switch ($module_id) {
//             case 1:
//               $reg_table = 'tra_registered_products';
//               $application_table = 'tra_product_applications';
//               $app_field = "reg_product_id";
//               $reg_field = "tra_product_id";
//               break;
//              case 2:
//               $reg_table = 'registered_premises';
//               $application_table = 'tra_premises_applications';
//               $app_field = "reg_premise_id";
//               $reg_field = "tra_premise_id";
//               break;
//              case 3:
//               $reg_table = 'tra_registered_products';
//               $application_table = 'tra_gmp_applications';
//               $app_field = "tra_site_id";
//               $reg_field = "reg_site_id";
//               break;
//              case 5:
//               $reg_table = 'registered_surveillance';
//               $application_table = 'tra_surveillance_applications';
//               $app_field = "reg_surveillance_id";
//               $reg_field = "tra_surveillance_id";
//               break;
//             case 7:
//               $reg_table = 'registered_clinical_trials';
//               $application_table = 'tra_clinical_trial_applications';
//               $app_field = "reg_clinical_trial_id";
//               $reg_field = "tra_clinical_trial_id";
//               break;
//             default:
//               $res = array(
//                   'success' =>false,
//                   'message' =>"Module not Mapped"
//                 );
//               return $res;
//               break;
//           }
//           if($module_id == 1){
//              $getRegistered = DB::table($reg_table.' as t1')
//                           ->Join($application_table.' as t2','t1.'.$reg_field,'t2.'.$app_field)
//                           ->Join("tra_approval_recommendations as t3",'t2.application_code','t3.application_code')
//                           ->leftJoin("par_sections as t7",'t2.section_id','t7.id')
//                           ->leftJoin("par_validity_statuses as t4",'t1.validity_status_id','t4.id')
//                           ->leftJoin("par_registration_statuses as t5",'t1.registration_status_id','t5.id')
//                           ->leftJoin("sub_modules as t8",'t2.sub_module_id','t8.id')
//                           ->groupBy('t2.section_id')
//                           ->select(DB::raw('count(t2.section_id) as registered_applications, t7.name as section_name, t8.name as sub_module_name,t5.name as registration_status, t4.name as validity_status'));
//               if(validateIsNumeric($validity_status_id)){
//                     $getRegistered->where('t1.validity_status_id', $validity_status_id);
//                   }
//               if(validateIsNumeric($registration_status_id)){
//                       $getRegistered->where('t1.registration_status_id', $registration_status_id);
//                   }
//           }else{
//               $getRegistered = DB::table($reg_table.' as t1')
//                           ->Join($application_table.' as t2','t1.'.$reg_field,'t2.'.$app_field)
//                           ->Join("tra_approval_recommendations as t3",'t2.application_code','t3.application_code')
//                           ->leftJoin("par_sections as t7",'t2.section_id','t7.id')
//                           ->leftJoin("par_validity_statuses as t4",'t1.validity_status','t4.id')
//                           ->leftJoin("par_registration_statuses as t5",'t1.registration_status','t5.id')
//                           ->leftJoin("sub_modules as t8",'t2.sub_module_id','t8.id')
//                           ->groupBy('t2.section_id')
//                           ->select(DB::raw('count(t2.section_id) as registered_applications, t7.name as section_name, t8.name as sub_module_name,t5.name as registration_status, t4.name as validity_status'));
//               if(validateIsNumeric($validity_status_id)){
//                     $getRegistered->where('t1.validity_status', $validity_status_id);
//                   }
//               if(validateIsNumeric($registration_status_id)){
//                       $getRegistered->where('t1.registration_status', $registration_status_id);
//                   }
//           }

//           //filters
//           $where_clause = array();
//           if(validateIsNumeric($sub_module_id)){
//              $getRegistered->where('t2.sub_module_id', $sub_module_id);
//           }
//            if(validateIsNumeric($section_id)){
//               $getRegistered->where('t2.section_id', $section_id);
//           }

//           //dates
//            if(validateIsNumeric($approval_opt)){
//               $getRegistered->whereRAW("date_format(t3.approval_date, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//           }
//           if(validateIsNumeric($registration_date)){
//               $getRegistered->whereRAW("date_format(t1.registration_date, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//           }
//            if(validateIsNumeric($expiry_date)){
//               $getRegistered->whereRAW("date_format(t3.expiry_date, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//           }

//       $results = $getRegistered->get();
//       $res = array(
//           'success' => true,
//           'results' => $results,
//           'message' => "All is well"
//       );
                     

//       }else{
//         $res = array(
//           'success' =>false,
//           'message' =>"Please select a module"
//         );
//       }

//       return json_encode($res);
//   }
//   public function getRegistrationApplicableModules(Request $req){
//       $modules = DB::table('modules')->whereRAW('id in (1,2,3,5,7)')->get();
//     return $modules;
//   }
//   public function getAnnualPMSImplementationReport(Request $req){
//     try {
//       //get filters
//       $filters = json_decode($req->filters);

//         $implementation_id = $filters->implementation_id;
//         $region_id = $filters->region_id;
//         $site_level_id = $filters->site_level_id;
//         $site_id = $filters->site_id;
//         $product_category_id = $filters->product_category_id;
//         $dosage_form_id = $filters->dosage_form_id;
//         $product_id = $filters->product_id;  
//         $result = '';
//         $from_date = $filters->date_from;
//         $to_date = $filters->date_to;
//         $pms_plan_id = $req->pms_plan_id;
//         $result = array();
//         $implementation_qry = DB::table('pms_program_details as t1')
//                               ->join('pms_program_implementationplan as t2', 't1.id','t2.program_id')
//                               ->join('pms_program_plans as t3', 't2.id','t3.program_implementation_id')
//                               ->select(DB::raw(' t1.name as program_name, t2.program_implementation, t2.year_of_implementation,t3.id as pms_plan_id, t3.sampling_site_id, t3.site_level_id,t3.program_implementation_id, t3.region_id, t3.product_id, t3.product_category_id, t3.dosage_form_id,SUM(t3.number_of_brand*t3.number_of_batch*t3.number_of_unitpack) as number_ofsamplestobecollected'))
//                               ->groupBy('t2.program_implementation','t3.sampling_site_id', 't3.site_level_id', 't3.region_id', 't3.product_id', 't3.product_category_id', 't3.dosage_form_id');
//         if(validateIsNumeric($pms_plan_id)){
//            $implementation_qry->where('t3.id',$pms_plan_id);
//          }                     
//          if(validateIsNumeric($implementation_id)){
//             $implementation_qry->where('t2.id',$implementation_id);
//           }
//          if(validateIsNumeric($region_id)){
//             $implementation_qry->where('t3.region_id',$region_id);
//           }
//          if(validateIsNumeric($site_level_id)){
//             $implementation_qry->where('t3.site_level_id',$site_level_id);
//           }
//          if(validateIsNumeric($site_id)){
//             $implementation_qry->where('t3.sampling_site_id',$site_id);
//           }
//          if(validateIsNumeric($product_category_id)){
//             $implementation_qry->where('t3.product_category_id',$product_category_id);
//           }
//           if(validateIsNumeric($dosage_form_id)){
//             $implementation_qry->where('t3.dosage_form_id',$dosage_form_id);
//           }
//          if(validateIsNumeric($product_id)){
//             $implementation_qry->where('t3.product_id',$product_id);
//           }
//         // dd($implementation_qry->toSql());
//         $implementation_data = $implementation_qry->get();

//         foreach ($implementation_data as $implementation) {
//           $result[] = DB::table('tra_surveillance_applications as t1')
//                     ->leftjoin('tra_surveillance_sample_details as t2','t1.id','t2.application_id')
//                     ->leftJoin('par_regions as t4','t1.region_id','t4.id')
//                     ->leftJoin('par_business_types as t5','t1.sample_site_id','t5.id')
//                     ->leftJoin('pms_program_samplingsites as t6','t1.sampling_site_id','t6.id')
//                     ->leftJoin('par_site_levels as t7', 't6.site_level_id', 't7.id')
//                     ->leftJoin('pms_program_plans as t9', 't1.program_implementation_id','t9.program_implementation_id')
//                     ->leftJoin('par_common_names as t8', 't9.product_id', 't8.lims_common_name_id')
//                     ->leftJoin('par_classifications as t10', 't9.product_category_id', 't10.lims_classification_id')
//                     ->leftJoin('par_dosage_forms as t11', 't2.dosage_form_id', 't11.lims_dosage_form_id')

//                     ->select(DB::raw("CONCAT_WS(' : ','".$implementation->year_of_implementation."','".$implementation->program_implementation."') as implementation,'".$implementation->program_name."' as program_name, t4.name as region_name,t5.name as site_name,t7.name as site_level,t8.name as product_name,t10.name as product_category, t11.name as dosage_form,'".$implementation->number_ofsamplestobecollected."' as samples_tobe_collected,SUM(t2.collected_samples) as collected_samples,".$implementation->pms_plan_id." as pms_plan_id"))

                       

//                     ->where(array('t1.program_implementation_id'=> $implementation->program_implementation_id,'t1.region_id'=>$implementation->region_id, 't1.sample_site_id'=>$implementation->sampling_site_id, 't6.site_level_id'=>$implementation->site_level_id,'t2.dosage_form_id'=>$implementation->dosage_form_id,'t9.product_category_id'=>$implementation->product_category_id,'t9.product_id'=>$implementation->product_id))
                    
//                     ->whereRAW("date_format(t1.date_collected, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'")
//                     ->first();
//         }
// //dd($result->toSql());

        
//         $res = array(
//                 'success' => true,
//                 'results' => $result,
//                 'message' => 'All is well'
//             );
//         if(validateIsNumeric($pms_plan_id)){
//           return $result;
//         }

//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return \response()->json($res);
//     }
//      public function getPMSManufacturerReport(Request $req){
//     try {
//       //get filters
//       $filters = json_decode($req->filters);

//         $implementation_id = $filters->implementation_id;
//         $country_id = $filters->country_id;
//         $manufacturer_id = $filters->manufacturer_id;
//         $product_category_id = $filters->product_category_id;
//         $result = '';
//         $from_date = $filters->date_from;
//         $to_date = $filters->date_to;

//         $qry = DB::table('tra_surveillance_sample_details as t1')
//               ->leftJoin('tra_manufacturers_information as t2','t1.manufacturer_id','t2.id')
//               ->leftJoin('pms_program_plans as t3','t1.pms_plan_id','t3.id')
//               ->leftJoin('par_countries as t4','t2.country_id','t4.id')
//               ->leftJoin('par_product_categories as t5','t3.product_category_id','t5.id')
//               ->leftJoin('pms_program_implementationplan as t6','t3.program_implementation_id','t6.id')
//               ->select('t1.manufacturer_id','t1.date_collected','t2.name as manufacturer_name','t4.name as country_name','t5.name as product_category','t6.program_implementation as implementation');

//         if(validateIsNumeric($implementation_id)){
//           $qry->where('t3.program_implementation_id',$implementation_id);
//         }
//         if(validateIsNumeric($country_id)){
//           $qry->where('t2.country_id',$country_id);
//         }
//         if(validateIsNumeric($manufacturer_id)){
//           $qry->where('t1.manufacturer_id',$manufacturer_id);
//         }
//         if(validateIsNumeric($product_category_id)){
//           $qry->where('t3.product_category_id',$product_category_id);
//         }
//         if($from_date != '' && $to_date != ''){
//           $qry->whereRAW("date_format(t1.date_collected, '%Y%-%m-%d') BETWEEN '" . formatDate($from_date) . "' AND '".formatDate($to_date)."'");
//         }

//         $result = $qry->get();

//         $res = array(
//                 'success' => true,
//                 'results' => $result,
//                 'message' => 'All is well'
//             );

//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return \response()->json($res);
//     }
//   public function ExportPmsReport(Request $req){
//     $pms_plan_id = $req->pms_plan_id;

//     $sample_details =  DB::table('tra_surveillance_sample_details as t1')
//             ->join('tra_surveillance_applications as t2', 't1.application_id', '=', 't2.id')
//             ->leftJoin('tra_manufacturers_information as t5', 't1.manufacturer_id', '=', 't5.id')
//             ->leftJoin('par_storage_conditions as t6', 't1.storage_condition_id', '=', 't6.id')
//             ->leftJoin('par_seal_types as t7', 't1.seal_condition_id', '=', 't7.id')
//             ->leftJoin('par_samplingreasons as t8', 't1.sampling_reason_id', '=', 't8.id')
//             ->leftJoin('users as t9', 't1.sample_collector_id', '=', 't9.id')
//             ->leftJoin('par_sample_application_types as t10', 't1.sample_application_id', '=', 't10.id')
            
//             ->leftJoin('pms_program_plans as t11', 't1.pms_plan_id', '=', 't11.id')
            
//             ->leftJoin('par_business_types as t12', 't11.sampling_site_id', '=', 't12.id')
//             ->leftJoin('par_common_names as t13', 't11.product_id', '=', 't13.id')
//             ->select(DB::raw("t12.name as sampling_site,t13.name as product,  t1.sample_name as brand_name, t5.name as manufacturer, t6.name as storage, 
//                     t7.name as seal_condition, t8.name as sampling_reason, CONCAT_WS(' ',decrypt(t9.first_name),decrypt(t9.last_name)) as collector,t10.name as sample_type, t1.batch_no as batchno,t1.manufacturing_date as manufacturedate, t1.expiry_date as expirydate, t1.packaging_size as pack_size"))
//             ->where('t1.pms_plan_id',$pms_plan_id)
            
//             ->get();

   

//     //data
//         $data=$this->getAnnualPMSImplementationReport($req);
//         //$data=$response['result'];
//         $heading="PMS Sample Collection Report";
//         $data_array = json_decode(json_encode($data), true);

// //product application details
//         $PmsSpreadsheet = new Spreadsheet();
//         $sheet = $PmsSpreadsheet->getActiveSheet();
//        // $ProductSpreadsheet->getActiveSheet()->setTitle($heading);
//         $cell=0;


        
// //Main heading style
//         $styleArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ],
//                 'fill' => [
//                     'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
//                     'rotation' => 90,
//                     'startColor' => [
//                         'argb' => 'FFA0A0A0',
//                     ],
//                     'endColor' => [
//                         'argb' => 'FFFFFFFF',
//                     ],
//                 ]
//             ];
//           $styleHeaderArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ]
//             ];

//       if(isset($data_array[0])){
//         $header=array_keys($data_array[0]);
//         $length=count($header);
//        }else{
//         $data_array=array();
//         $header=array();
//         $length=1;
//         $sheet->getCell('A2')->setValue("No data");
//        }

//         $letter=$this->number_to_alpha($length,"");
        
//          //first heading
//                  $sheet->mergeCells('A1:'.$letter.'6')
//                       ->getCell('A1')
//                       ->setValue("TANZANIAN MEDICINE AND MEDICAL DEVICES AGENCY\nP.O. Box 77150, Nelson Mandela Road,Mabibo External\nTell : +255 22 2450512/2450751/2452108 Fax : +255 28 2541484\nWebsite: www.tfda.go.tzEmail: info@tfda.go.tz\n".$heading);
//                 $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
//                 $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);
//         //headers 
//                $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray);
//         //set autosize true for all columns
//            $size=count($data_array)+7;
//             $cellRange = 'A7:'.$letter.''.$size;
//             if($length > 11){
//                 $sheet->getStyle($cellRange)->getAlignment()->setWrapText(true);
//             }
//             else{
//                 if($length>26){
//                   foreach(range('A','Z') as $column) {
//                           $sheet->getColumnDimension($column)->setAutoSize(true);
//                       }

//                   $remainder=27;
//                   while ($remainder <= $length) {
//                     $column=$this->number_to_alpha($remainder,"");
//                     $sheet->getColumnDimension($column)->setAutoSize(true);
//                     $remainder++;
//                   }

//                 }else{

//                   foreach(range('A',$letter) as $column) {
                    
//                           $sheet->getColumnDimension($column)->setAutoSize(true);
//                       }

//                 }
//               }

//           //adding formats to header
//                $sheet->fromArray($header, null, "A7");
//         //loop data while writting
//                $sheet->fromArray( $data_array, null,  "A8");

//         //heading two
//         $cell = $size+2;
//         $sample_data_array = json_decode(json_encode($sample_details), true);

//         if(isset($sample_data_array[0])){
//             $sample_header=array_keys($sample_data_array[0]);
//             $length=count($sample_header);
//           }else{
//             $sample_data_array=array();
//             $sample_header=array();
//             $length=1;
//             $sheet->getCell('A'.$cell)->setValue("No data");
//         }
//         $letter=$this->number_to_alpha($length,"");
//         //second heading
//         $sheet->mergeCells("A".$cell.":".$letter."".$cell)
//               ->getCell("A".$cell)
//               ->setValue('Collected Samples Report');
//         $sheet->getStyle("A".$cell.":B".$cell)->applyFromArray($styleArray);
//         $cell++;
//          //adding formats to header
//         $sheet->fromArray($sample_header, null, "A".$cell);
//         //headers style
//         $sheet->getStyle('A'.$cell.':'.$letter.''.$cell)->applyFromArray($styleHeaderArray);
//         $cell++;
//         //write
//         $sheet->fromArray( $sample_data_array, null,  "A".$cell  );


//         //create file
//             $writer = new Xlsx($PmsSpreadsheet);
         

//            $response =  new StreamedResponse(
//             function () use ($writer) {
//                 $writer->save('php://output');
//             }
//         );
//         $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         $response->headers->set('Content-Disposition', 'attachment;filename=PMS_Implementation_Report.xlsx');
//         $response->headers->set('Cache-Control','max-age=0');


//        return $response;

//   }
//   public function ExportPmsManufacturerReport(Request $req){
//     $manufacturer_id = $req->manufacturer_id;

//     $product_details =  DB::table('tra_surveillance_sample_details as t1')
//             ->join('tra_surveillance_applications as t2', 't1.application_id', '=', 't2.id')
//             ->leftJoin('par_storage_conditions as t6', 't1.storage_condition_id', '=', 't6.id')
//             ->leftJoin('par_seal_types as t7', 't1.seal_condition_id', '=', 't7.id')
//             ->leftJoin('par_samplingreasons as t8', 't1.sampling_reason_id', '=', 't8.id')
//             ->leftJoin('users as t9', 't1.sample_collector_id', '=', 't9.id')
//             ->leftJoin('par_sample_application_types as t10', 't1.sample_application_id', '=', 't10.id')
            
//             ->leftJoin('pms_program_plans as t11', 't1.pms_plan_id', '=', 't11.id')
            
//             ->leftJoin('par_business_types as t12', 't11.sampling_site_id', '=', 't12.id')
//             ->leftJoin('par_common_names as t13', 't11.product_id', '=', 't13.id')
//             ->select(DB::raw("t12.name as sampling_site,t13.name as product,  t1.sample_name as brand_name, t6.name as storage, 
//                     t7.name as seal_condition, t8.name as sampling_reason, CONCAT_WS(' ',decrypt(t9.first_name),decrypt(t9.last_name)) as collector,t10.name as sample_type, t1.batch_no as batchno,t1.manufacturing_date as manufacturedate, t1.expiry_date as expirydate"))
//             ->where('t1.manufacturer_id',$manufacturer_id)
            
//             ->get();


//     //data
//         $man_data=DB::table('tra_manufacturers_information as t1')
//                   ->leftJoin('par_countries as t2','t1.country_id','t2.id')
//                   ->leftJoin('par_regions as t3','t1.region_id','t3.id')
//                   ->leftJoin('par_districts as t4','t1.district_id','t4.id')
//                   ->select('t1.name as Manufacturer_Name', 't1.contact_person', 't1.physical_address', 't1.postal_address', 't1.telephone_no', 't1.mobile_no', 't1.email_address', 't1.website','t2.name as Country','t3.name as Region','t4.name as District')
//                   ->where('t1.id',$manufacturer_id)
//                   ->get();

//         //$data=$response['result'];
//         $heading="PMS Sample Manufacturer Report";
//         $data_array = json_decode(json_encode($man_data), true);

// //product application details
//         $PmsSpreadsheet = new Spreadsheet();
//         $sheet = $PmsSpreadsheet->getActiveSheet();
//        // $ProductSpreadsheet->getActiveSheet()->setTitle($heading);
//         $cell=0;


        
// //Main heading style
//         $styleArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ],
//                 'fill' => [
//                     'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
//                     'rotation' => 90,
//                     'startColor' => [
//                         'argb' => 'FFA0A0A0',
//                     ],
//                     'endColor' => [
//                         'argb' => 'FFFFFFFF',
//                     ],
//                 ]
//             ];
//           $styleHeaderArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ]
//             ];

//       if(isset($data_array[0])){
//         $header=array_keys($data_array[0]);
//         $length=count($header);
//        }else{
//         $data_array=array();
//         $header=array();
//         $length=1;
//         $sheet->getCell('A2')->setValue("No data");
//        }

//         $letter=$this->number_to_alpha($length,"");
        
//          //first heading
//                  $sheet->mergeCells('A1:'.$letter.'6')
//                       ->getCell('A1')
//                       ->setValue("TANZANIAN MEDICINE AND MEDICAL DEVICES AGENCY\nP.O. Box 77150, Nelson Mandela Road,Mabibo External\nTell : +255 22 2450512/2450751/2452108 Fax : +255 28 2541484\nWebsite: www.tfda.go.tzEmail: info@tfda.go.tz\n".$heading);
//                 $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
//                 $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);
//         //headers 
//                $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray);
//         //set autosize true for all columns
//            $size=count($data_array)+7;
//             $cellRange = 'A7:'.$letter.''.$size;
//             if($length > 11){
//                 $sheet->getStyle($cellRange)->getAlignment()->setWrapText(true);
//             }
//             else{
//                 if($length>26){
//                   foreach(range('A','Z') as $column) {
//                           $sheet->getColumnDimension($column)->setAutoSize(true);
//                       }

//                   $remainder=27;
//                   while ($remainder <= $length) {
//                     $column=$this->number_to_alpha($remainder,"");
//                     $sheet->getColumnDimension($column)->setAutoSize(true);
//                     $remainder++;
//                   }

//                 }else{

//                   foreach(range('A',$letter) as $column) {
                    
//                           $sheet->getColumnDimension($column)->setAutoSize(true);
//                       }

//                 }
//               }

//           //adding formats to header
//                $sheet->fromArray($header, null, "A7");
//         //loop data while writting
//                $sheet->fromArray( $data_array, null,  "A8");

//         //heading two
//         $cell = $size+2;
//         $sample_data_array = json_decode(json_encode($product_details), true);

//         if(isset($sample_data_array[0])){
//             $sample_header=array_keys($sample_data_array[0]);
//             $length=count($sample_header);
//           }else{
//             $sample_data_array=array();
//             $sample_header=array();
//             $length=1;
//             $sheet->getCell('A'.$cell)->setValue("No data");
//         }
//         $letter=$this->number_to_alpha($length,"");
//         //second heading
//         $sheet->mergeCells("A".$cell.":".$letter."".$cell)
//               ->getCell("A".$cell)
//               ->setValue('Collected Samples Report');
//         $sheet->getStyle("A".$cell.":B".$cell)->applyFromArray($styleArray);
//         $cell++;
//          //adding formats to header
//         $sheet->fromArray($sample_header, null, "A".$cell);
//         //headers style
//         $sheet->getStyle('A'.$cell.':'.$letter.''.$cell)->applyFromArray($styleHeaderArray);
//         $cell++;
//         //write
//         $sheet->fromArray( $sample_data_array, null,  "A".$cell  );


//         //create file
//             $writer = new Xlsx($PmsSpreadsheet);
         

//            $response =  new StreamedResponse(
//             function () use ($writer) {
//                 $writer->save('php://output');
//             }
//         );
//         $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         $response->headers->set('Content-Disposition', 'attachment;filename=PMS_Manufacturer_Report.xlsx');
//         $response->headers->set('Cache-Control','max-age=0');


//        return $response;

//   }
//   public function getApplicationReceiptsReport(Request $req){
//     $doc_type = $req->doc_type;
//     $ref_no = $req->reference_no;
//     $module_id = $req->module_id;
//     try{
//     if(validateIsNumeric($doc_type)){
    
//           $results = DB::table('tra_payments as t1')
//                     ->leftJoin('users as t2','t1.created_by','t2.id')
//                     ->leftJoin('par_currencies as t3','t1.currency_id','t3.id')
                    
//                     ->select('t1.*',DB::raw("t1.receipt_no,t2.username as generated_by,concat('',t1.amount_paid,' ',t3.name) as amount_paid,t1.manual_receipt_no,t1.trans_date"))
//                      ->where(function($query) use ($ref_no) {
//               $query->where('reference_no', '=', $ref_no)
//               ->orWhere('tracking_no', '=',$ref_no);
//             })
//                     ->get();
//           foreach ($results as $result) {
//             $table_name = $this->getTableName($result->module_id);
//             $result->table_name = $table_name;
//           }
//          $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well'
//             );           
          
//     }else{
//       $res = array(
//                 'success' => false,
//                 'message' => 'Document Type Not Defined'
//             );
//     }
     

//         } catch (\Exception $exception) {
//             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//         } catch (\Throwable $throwable) {
//             $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//         }
//         return \response()->json($res);
//   }
//   public function generatedSystemReport(Request $req, ReportsController $rpt){
//     $module_id = $req->module_id;
//     $reference_no = $req->reference_no;
//     $doc_type = $req->doc_type;
//     switch ($doc_type) {
//       case 27://invoice
//         $rpt_params = DB::table('tra_application_invoices as t1')
//             ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//         $invoice_id =  $rpt_params->id;
//         $application_id =  $rpt_params->application_id;
//         $application_code =  $rpt_params->application_code;
//         $module_id =  $rpt_params->module_id;
//         $sub_module_id =  $rpt_params->sub_module_id;
//         $request = new Request([
//             'invoice_id'   => $invoice_id,
//             'application_id'   => $application_id,
//             'application_code'   => $application_code,
//             'module_id'   => $module_id,
//             'sub_module_id'   => $sub_module_id
//           ]);
    
//         return $rpt->generateApplicationInvoice($request);
//         break;
//       case 28://cert
//     if(!validateIsNumeric($module_id)){
//       $module_id = 1;
//     }
//         return $this->generateCertificatesReport($rpt, $module_id,$reference_no);
//         break;
//     //receipt_id
//     case 29://invoice
//         $rpt_params = DB::table('tra_payments as t1')
//             ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//         $payment_id =  $rpt_params->id;
//         $application_id =  $rpt_params->application_id;
//         $application_code =  $rpt_params->application_code;
//         $module_id =  $rpt_params->module_id;
//         $sub_module_id =  $rpt_params->sub_module_id;
//         $request = new Request([
//             'payment_id'   => $payment_id,
//             'application_id'   => $application_id,
//             'application_code'   => $application_code,
//             'module_id'   => $module_id,
//             'sub_module_id'   => $sub_module_id
//           ]);
    
//         return $rpt->generateApplicationReceipt($request);
//         break;
//       case 30://permit
//         switch ($module_id) {
//           case 2:
//             $rpt_params = DB::table('tra_premises_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//             $request = new Request([
//               'premise_id'   => $rpt_params->premise_id,
//               'application_code'   => $rpt_params->application_code
//             ]);
//             return $rpt->generatePremisePermit($request);
//             break;
//           case 4:
//             $rpt_params = DB::table('tra_importexport_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
              
//             $request = new Request([
//               'application_code'   => $rpt_params->application_code
//               ]);
//             return $rpt->genenerateImportExportPermit($request);
//             break;
//           default:
//             return "No Permit config set for the module";
//             break;
//         }

//         break;
//       case 31://gmp appr letter
//          $rpt_params = DB::table('tra_gmp_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'application_id'   => $rpt_params->id,
      
//             'application_code'   => $rpt_params->application_code,
//             'section_id'   => $rpt_params->section_id
//           ]);
      
//         return $rpt->generateGmpApprovalLetter($request);
//         break;
//     case 32://prod appr letter
//     switch ($module_id) {
//     case 1:
//     $app_details = DB::table('tra_product_applications')
//     ->where('reference_no', $reference_no)
//     ->orWhere('tracking_no', $reference_no)
//     ->first();
//     if(!empty($app_details)){
//     if($app_details->sub_module_id == 30){
//     $request = new Request([
//     'application_code' => $app_details->application_code
//     ]);
//     return $rpt->generateProductNotificationApprovalLetter($request);
//     }else{
//     return "No approval set for the sub module";
//     }
//     }
//     else{
//     return "The Reference/Tracking Number entered has zero entries";
//     }
//     break;
//     default:
//     return "No Approval letter set for the module";
//     break;
//     }
//     break;
//       // case 32://prod appr letter
//       //  $ct_details = DB::table('generateClinicalTrialCertificate')->where('application_code', $application_code)->first();
//       //  $request = new Request([
//       //       'application_id'   => $ct_details->id,
//       //       'application_code'   => $application_code
//       //     ]);
       
//       //   return $rpt->generateClinicalTrialCertificate($request);
//       //   break;
//       case 33://prod note appr letter
//          $rpt_params = DB::table('tra_product_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//           $request = new Request([
//             'product_id'   => $rpt_params->product_id
//           ]);
       
//         return $rpt->generateProductNotificationApprovalLetter($request);
//         break;
//       case 34://prod rejection letter
//         $rpt_params = DB::table('tra_product_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'product_id'   => $rpt_params->product_id
//           ]);
       
//         return $rpt->generateProductRejectionLetter($request);
//         break;
//     //  default:
//     case 8://prod rejection letter
//         $rpt_params = DB::table('tra_product_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'application_code'   => $rpt_params->application_code,
//             'sub_module_id'   => $rpt_params->sub_module_id
//           ]);
       
       
//         return $rpt->generateProductEvaluationReport($request);
//         break;
//     //default:
//     case 9://prod rejection letter
//         $rpt_params = DB::table('tra_product_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                       ->first();
//         if(!$rpt_params){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'application_code'   => $rpt_params->application_code,
//             'sub_module_id'   => $rpt_params->sub_module_id
//           ]);
       
//         return $rpt->generateProductAuditReport($request);
//         break;
//       default:
//         return "Document type not mapped";
//         break;
//     }
//   }
//   public function generateCertificatesReport($rpt,$module_id, $reference_no){
//     switch ($module_id) {
//       case 1://prod
//         $cert_param = DB::table('tra_product_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                     ->first();
//         if(!$cert_param){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'application_code'   => $cert_param->application_code
//           ]);
    
//         return $rpt->generateProductRegCertificate($request);
//         break;
//       case 2://prem
//         $cert_param = DB::table('tra_premises_applications')
//                      ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                     ->first();
//         if(!$cert_param){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'premise_id'   => $cert_param->premise_id,
//             'application_code'   => $cert_param->application_code
//           ]);
       
//         return $rpt->generatePremiseCertificate($request);
//         break;
//       case 3://gmp
//         $cert_param = DB::table('tra_gmp_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                     ->first();
//         if(!$cert_param){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'application_id'   => $cert_param->id,
//             'application_code'   => $cert_param->application_code
//           ]);
       
//         return $rpt->generateGMPCertificate($request);
//         break;
//       case 4://ie
//         $cert_param = DB::table('tra_importexport_applications')
//                      ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                     ->first();
//         if(!$cert_param){
//           return "The Reference Number entered has zero entries";
//         }
//         $request = new Request([
//             'permit_watermark'   => 'reports_generated',
//             'application_code'   => $cert_param->application_code
//           ]);
       
//         return $rpt->genenerateImportExportPermit($request);
//         break;
//       case 6://prod note 
//        $cert_param = DB::table('tra_product_applications')
//                      ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                     ->first();
//         if(!$cert_param){
//           return "The Reference Number entered has zero entries";
//         }
//        $request = new Request([
//             'product_id'   => $cert_param->product_id
//           ]);
       
//         return $rpt->generateProductNotificationCertificate($request);
//         break;
//       case 7://ct
//        $cert_param = DB::table('tra_clinical_trial_applications')
//                       ->where(function($query) use ($reference_no) {
//               $query->where('reference_no', '=', $reference_no)
//               ->orWhere('tracking_no', '=',$reference_no);
//             })
//                     ->first();
//         if(!$cert_param){
//           return "The Reference Number entered has zero entries";
//         }
//        $request = new Request([
//             'application_id'   => $cert_param->id,
//             'application_code'   => $cert_param->application_code
//           ]);
       
//         return $rpt->generateClinicalTrialCertificate($request);
//         break;
//       default:
//          return "No Certificates set for this module";
//         break;
//     }
//   }

//   public function getPremiseRegisterReport(Request $req)
//   {
//     $sub_module_id = $req->sub_module_id;
//     $zone_id = $req->zone_id;
//     $section_id = $req->section_id;
//     $to_date = $req->to_date;
//     $from_date = $req->from_date;

//      $sub_modules = DB::table('sub_modules')->where('module_id', 2); 
//     $sections = DB::table('par_sections')->whereIn('id',[2,4]);
//     $zones = DB::table('par_zones');


//     if(validateIsNumeric($sub_module_id)){
//       $sub_modules->where('id',$sub_module_id);
//     }
//     if(validateIsNumeric($section_id)){
//       $sections->where('id',$section_id);
//     }
//     if(validateIsNumeric($zone_id)){
//       $zones->where('id',$zone_id);
//     }

//     $sub_modules = $sub_modules->get();
//     $sections = $sections->get();
//     $zones = $zones->get();
//     $results = array();
//     foreach ($sub_modules as $sub_module) {
//       foreach ($sections as $section) {
//         foreach ($zones as $zone) {
//            $qry = DB::table('tra_premises_applications as t1')
//                   ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//                   ->select(DB::raw('count(t1.id) as total_count,t2.decision_id'))
//                   ->where(array('t1.sub_module_id'=>$sub_module->id,'t1.section_id'=>$section->id,'t1.zone_id'=>$zone->id))
//                   ->groupBy('t2.decision_id');
//              if($to_date != '' || $from_date != ''){
//                  // if($to_date != '' || $from_date != ''){
//                   $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND date_format(t2.approval_date, '%Y%-%m-%d')");
                
//                 }

//               $data = $qry->get();
//               $approved = 0;
//               $rejected = 0;
//               foreach ($data as $result) {
//                 if($result->decision_id != 1 ){
//                   $rejected = $result->total_count;
//                 }else{
//                   $approved = $approved+$result->total_count;
//                 }
//               }
//               $results[] = array(
//                 'sub_module_name' => $sub_module->name,
//                 'section_name' => $section->name,
//                 'zone_name' => $zone->name,
//                 'approved' => $approved,
//                 'rejected' => $rejected
//               );
//         }
//       }
//     }
//     $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well'
//             ); 
//      return \response()->json($res);
//   }
//   public function getPremiseRegisterChart(Request $req)
//   {
//     $sub_module_id = $req->sub_module_id;
//     $zone_id = $req->zone_id;
//     $section_id = $req->section_id;
//     $to_date = $req->to_date;
//     $from_date = $req->from_date;

//     $zones = DB::table('par_zones');
//     if(validateIsNumeric($zone_id)){
//       $zones->where('id',$zone_id);
//     }
//     $zones = $zones->get();
//     $results = array();
//     foreach ($zones as $zone) {
     
//      $qry = DB::table('tra_premises_applications as t1')
//                   ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//                   ->select(DB::raw('count(t1.id) as total_count,t2.decision_id'))
//                   ->where('t1.zone_id',$zone->id)
//                   ->groupBy('t2.decision_id');
//              if($to_date != '' || $from_date != ''){
//                   $qry->whereRAW("date_format(t1.date_added, '%Y%-%m-%d') >= '".formatDate($from_date)."' AND date_format(t1.date_added, '%Y%-%m-%d') <= '".formatDate($to_date)."'");
//                 }
//     if(validateIsNumeric($sub_module_id)){
//       $qry->where('t1.sub_module_id',$sub_module_id);
//     }
//     if(validateIsNumeric($section_id)){
//       $qry->where('t1.section_id',$section_id);
//     }
    
//       $data = $qry->get();
//       $approved = 0;
//       $rejected = 0;
//       foreach ($data as $result) {
//         if($result->decision_id != 1){
//           $rejected = $result->total_count;
//         }else{
//           $approved = $approved+$result->total_count;
//         }
//       }
//       $results[] = array(
//         'zone_name' => $zone->name,
//         'approved' => $approved,
//         'rejected' => $rejected
//       );
//     }
//     $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well'
//             ); 
//      return \response()->json($res);
//   }
//   public function getBusinessTypeScaleReport(Request $req){
    
//     $business_type_id = $req->business_type;
//     $business_scale_id = $req->business_scale;
//     $section_id = $req->section_id;
//     $to_date = $req->to_date;
//     $from_date = $req->from_date;

//     $business_scale = DB::table('par_business_scales');
//     $business_type = DB::table('par_business_types');
//     $sections = DB::table('par_sections');


//     if(validateIsNumeric($business_scale_id)){
//       $business_scale->where('id',$business_scale_id);
//     }
//     if(validateIsNumeric($section_id)){
//       $sections->where('id',$section_id);
//     }
//     if(validateIsNumeric($business_type_id)){
//       $business_type->where('id',$business_type_id);
//     }

//     $business_scales = $business_scale->get();
//     $sections = $sections->get();
//     $business_types = $business_type->get();
//     $results = array();
//     foreach ($sections as $section) {
//       foreach ($business_types as $business_type) {
//         foreach ($business_scales as $business_scale) {
//            $qry = DB::table('tra_premises_applications as t1')
//                   ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//                   ->join('tra_premises as t3','t1.premise_id','t3.id')
//                   ->where(array('t3.business_scale_id'=>$business_scale->id,'t1.section_id'=>$section->id,'t3.business_type_id'=>$business_type->id))
//                   ->whereRAW('(t2.decision_id = 1 or t2.decision_id = 2)');

//              if($to_date != '' || $from_date != ''){
//                   $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') >= '".formatDate($from_date)."' AND date_format(t2.approval_date, '%Y%-%m-%d') <= '".formatDate($to_date)."'");
//                 }

//               $total = $qry->count();
//               $results[] = array(
//                 'business_type' => $business_type->name,
//                 'section_name' => $section->name,
//                 'business_scale' => $business_scale->name,
//                 'counter' => $total
//               );
//         }
//       }
//     }
//     $res = array(
//                 'success' => true,
//                 'results' => $results,
//                 'message' => 'All is well'
//             ); 
//      return \response()->json($res);
//   }
//  function generateReportsHeader($title){
//    $org_info = DB::table('tra_organisation_information')->first();
//              PDF::setPrintHeader(false);
    
//       $logo = getcwd() . '/resources/images/zamra-logo.png';
//       PDF::SetFont('times', 'B', 12);
//       PDF::Cell(0,6,strtoupper($org_info->ministry),0,1,'C');
//       PDF::Cell(0, 6, strtoupper($org_info->name), 0, 1, 'C');
//       PDF::SetFont('times', 'B', 9);
//       PDF::Cell(0, 6, $org_info->postal_address.' '.$org_info->region_name, 0, 1, 'C');
//       PDF::Cell(0, 6, 'Tel:       '.$org_info->telephone_nos.' Fax: '.$org_info->fax, 0, 1, 'C');
//       PDF::Cell(0, 6, 'Website: '.$org_info->website.', Email: '.$org_info->email_address, 0, 1, 'C');
//       PDF::Cell(0, 5, '', 0, 2);
//       PDF::Image($logo, 86, 40, 35, 14);
//       PDF::Cell(0, 10, '', 0, 2);
//       PDF::SetFont('times', 'B', 11);
//       PDF::Cell(0, 5, $title, 0, 1, 'C');
//       PDF::SetFont('times', 'B', 11);
   
   
//  }
 
//   function generateReportsLandScapeHeader($title){
//    $org_info = DB::table('tra_organisation_information')->first();
//              PDF::setPrintHeader(false);
    
//       $logo = getcwd() . '/resources/images/zamra-logo.png';
//       PDF::SetFont('times', 'B', 12);
//       PDF::Cell(0,6,strtoupper($org_info->ministry),0,1,'C');
//       PDF::Cell(0, 6, strtoupper($org_info->name), 0, 1, 'C');
//       PDF::SetFont('times', 'B', 9);
//       PDF::Cell(0, 6, $org_info->postal_address.' '.$org_info->region_name, 0, 1, 'C');
//       PDF::Cell(0, 6, 'Tel:       '.$org_info->telephone_nos.' Fax: '.$org_info->fax, 0, 1, 'C');
//       PDF::Cell(0, 6, 'Website: '.$org_info->website.', Email: '.$org_info->email_address, 0, 1, 'C');
//       PDF::Cell(0, 5, '', 0, 2);
//       PDF::Image($logo, 125, 40, 35, 14);
//       PDF::Cell(0, 10, '', 0, 2);
//       PDF::SetFont('times', 'B', 11);
//       PDF::Cell(0, 5, $title, 0, 1, 'C');
//       PDF::SetFont('times', 'B', 11);
   
   
//  }
//  public function printGlSummaryReport(Request $req){
 
//        $qry=DB::table('payments_references as t1')
//       ->join('tra_payments as t2','t1.receipt_id','t2.id')
//       ->leftJoin('element_costs as t3','t1.element_costs_id','t3.id') 
//       ->leftJoin('par_gl_accounts as t4','t3.gl_code_id','t4.id') 
//       ->select(DB::raw('DISTINCT t1.id,sum(t1.amount_paid*t1.exchange_rate) as gl_codeamount, t4.code as GL_Code , t4.name as description, t4.tfda_code  as GL_Code_Reference'));
//       $qry->groupBy('t4.id');
// //filters
//    $to_date=$req->to_date;
//    $from_date=$req->from_date;
//    $zone_id = $req->zone_id;
//    $section_id=$req->section_id;
//    $gl_account=$req->gl_account;
   
//    if(validateIsNumeric($zone_id)){
//                $qry->where('t2.zone_id',$zone_id);
//           }

//           if(validateIsNumeric($gl_account)){
//                $qry->where('t3.gl_code_id',$gl_account);
//           }

//           if(validateIsNumeric($section_id)){
//                $qry->where('t2.section_id',$section_id);
//           }

//           if(isset($to_date) && isset($from_date)){
//              //   $qry->whereBetween('t1.paid_on',[formatDate($from_date),formatDate($to_date)]);
        
//           $qry->whereRaw("date_format(t2.trans_date, '%Y-%m-%d') between '".$from_date."' and '".$to_date."'");
//           }
//   //   dd($qry->toSql());
//    $filter = $req->input('filter');
//         $whereClauses = array();
//         $filter_string = '';
//          if (isset($filter)) {
//              $filters = json_decode($filter);
//              if ($filters != NULL) {
//                  foreach ($filters as $filter) {
//                      switch ($filter->property) {
//                          case 'GL_Code' :
//                              $whereClauses[] = "t4.tfda_code like '%" . ($filter->value) . "%'";
//                              break;
//                           }
//                  }
//                  $whereClauses = array_filter($whereClauses);
//              }
//              if (!empty($whereClauses)) {
//                  $filter_string = implode(' AND ', $whereClauses);
//              }
//          }

//        if ($filter_string != '') {
//          $qry->whereRAW($filter_string);
//                }
//         $results=$qry->get();
//         $title = 'Gl-Coded Revenue Summary Report as from '.$from_date.' '.$to_date;
//         PDF::SetTitle( $title);
//         PDF::setFont('times','',10);
//         PDF::AddPage('L');
//         $this->generateReportsLandScapeHeader( $title);
       
//         PDF::cell(10,7,'Sn',1,0);
//         PDF::cell(95,7,'Gl Description',1,0);
//         PDF::cell(95,7,'Gl Code',1,0);
//         PDF::cell(35,7,'Gl Reference Code',1,0);
//         PDF::cell(0,7,'Total Amount(tshs)',1,1);
// $total_amount =0;
// $i=1; PDF::setFont('times','',10);
//         foreach($results as $rec){
//             PDF::cell(10,7,$i,1,0);
//             PDF::cell(95,7,$rec->description,1,0);
//             PDF::cell(95,7,$rec->GL_Code,1,0);
//             PDF::cell(35,7,$rec->GL_Code_Reference,1,0);
//             PDF::cell(0,7,formatMoney($rec->gl_codeamount),1,1,'R');
//             $total_amount += $rec->gl_codeamount;
//       $i++;
//         }
//         PDF::setFont('times','B',10);
//         PDF::cell(235,7,'Total Amount',1,0,'R');
//         PDF::cell(0,7,formatMoney($total_amount),1,1,'R');
//         PDF::Output('Gl_coded Revenue Summary Report.pdf','I');
//  }
//     public function printRevenueSummaryReport(Request $request){
      
//  $title = 'Revenue Summary Report as from '. $request->from_date.' to '.$request->to_date;
      
//             PDF::SetTitle( $title);
//             PDF::AddPage();
//             $this->generateReportsHeader( $title);
//             PDF::setFont('times','I',15);
//             $i = 1;
//             $module_id=$request->module_id;
//             $section_id=$request->section_id;
//             $sub_module_id=$request->sub_module_id;
//             $zone_id=$request->zone_id;
//             $where_section = array();
//             if(validateIsNumeric($section_id)){
//             $where_section = array('id'=>$section_id);
//             }
         
//             $where_submodule = array();
//             if(validateIsNumeric($sub_module_id)){
//             $where_submodule = array('id'=>$sub_module_id);
//             }
    
//             $where_module = array();
//             if(validateIsNumeric($module_id)){
//             $where_module = array('id'=>$module_id);
//             }
     
//             $data=array();
//             $module_data = DB::table('modules')
//                     ->where($where_module)
//                     ->where('modhas_payment_processing',1)
//                     ->get();
//                PDF::setFont('times','B',11);
//            PDF::cell(10,7,'Sn',1,0);
//            PDF::cell(80,7,'Process',1,0);
//            PDF::cell(40,7,'Section',1,0);
//            PDF::cell(0,7,'Total Amount(tshs)',1,1);
//               //loop the modules for sub modules
//               PDF::setFont('times','',11);
//               //loop the modules for sub modules
//             $total_amount = 0;
//             $total_moduleamount = 0;
//               foreach ($module_data as $mod_data) {
//                 $total_moduleamount =0;
//                 $module_id = $mod_data->id;
//                 PDF::cell(0,7,$mod_data->name,1,1);
//                 $submod_data = DB::table('sub_modules')
//                   ->where($where_submodule)
//                   ->where('module_id',$mod_data->id)
//                   ->where('has_payment_processing',1)
//                   ->get();
    
//                      //loop the sub modules for sections
//                     foreach ($submod_data as $sub_data) {
//                           PDF::setFont('times','',11);
//                         if($module_id == 7){
//                              $section_data = DB::table('par_sections')
//                                           ->where($where_section)
//                                           ->whereIn('id',[5])
//                                           ->get();
//                         }
//             else if($module_id==17){
//               $section_data = DB::table('par_sections')
//                                           ->where($where_section)
//                                           ->whereIn('id',[2,4,5,6,12])
//                                           ->get();
//             }
//                         else{
//                              $section_data = DB::table('par_sections')
//                                           ->where($where_section)
//                                           ->whereIn('id',[2,4])
//                                           ->get();
//                         }
                    
//                         //loop section data
//                         foreach ($section_data as $sec_data) {
    
//                            $payment_types_details=$this->getRevenueDetails($mod_data->id,$sec_data->id, $sub_data->id,$request);
                          
//                              PDF::cell(10,7,$i,1,0);
//                             PDF::cell(80,7,$sub_data->name,1,0);
//                             PDF::cell(40,7,$sec_data->name,1,0);
//                             PDF::cell(0,7,formatMoney($payment_types_details['payment']),1,1,'R');
//                             $total_amount += $payment_types_details['payment'];
//                             $total_moduleamount += $payment_types_details['payment'];
//               $i++;
//                         }
//                     }
//             PDF::setFont('times','B',11);
//                     PDF::cell(130,7,'Sub-Total for '.$mod_data->name,1,0,'R');
//                     PDF::cell(0,7,formatMoney($total_moduleamount),1,1,'R');
//               }
//           PDF::setFont('times','B',11);
//               PDF::cell(130,7,'Total Amount',1,0,'R');
//               PDF::cell(0,7,formatMoney($total_amount),1,1,'R');
//             PDF::Output('Revenue Summary Report.pdf','I');
      
      
//     }
  
//  public function printProductRegSummary(request $req){
        
//         $title = 'Product Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
        
//         PDF::SetTitle( $title );
//         PDF::AddPage();
           
//         $this->generateReportsHeader( $title);
             
//         PDF::Ln();
//           //loop the modules for sub modules
//           //filters
//           $classification_category=$req->classification_category;
//           $sub_module_id=$req->sub_module_id;
//           $product_class_category=$req->product_class_category;
//           $section_id=$req->section_id;
//           $directorate_id=$req->directorate_id;
//           $product_type=$req->product_type;
//           $module_id=$req->module_id;
//           $received_opt=$req->module_id;
//           $evaluation_opt=$req->evaluation_opt;
//           $from_date=$req->from_date;
//           $to_date=$req->to_date;
//           $device_type_id=$req->device_type_id;
//           $datefilters=$this->addedDateFilters($req);
//           $i = 1;
//           //sub-module data
//           $where_sub=array();
//           if(validateIsNumeric($sub_module_id)){
//               $where_sub=array('id'=>$sub_module_id);
//           }
      
//           $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//           //section data
//           $where_sec=array();
//           if(validateIsNumeric($section_id)){
//               $where_sec=array('id'=>$section_id);
//           }
         
//          //directorate data
//           $where_directorate=array();
//           if(validateIsNumeric($directorate_id)){
//               $where_directorate=array('id'=>$directorate_id);
//           }
//           $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//           //other filters for loops
//           $where_cat=array();
//           if(validateIsNumeric($product_class_category)){
//               $where_cat=array('id'=>$product_class_category);
//           }
//           $where_class=array();
//           if(validateIsNumeric($classification_category)){
//               $where_class=array('id'=>$classification_category);
//           }
//           $where_prodType=array();
//           if(validateIsNumeric($product_type)){
//               $where_prodType=array('id'=>$product_type);
//           }
//           $received_date_opt='date_added';
//           $data = array();
//           $table=$this->getTableName($module_id);
//           $table2='tra_product_information';
//           $field='product_id';
//           $sub_total = 0;
//           $app_sub_total = 0;
//           $rej_sub_total = 0;
//           $queried_sub_total = 0;
//           $rec_sub_total = 0;
//           $cummurative_total = 0;
//           $app_total = 0;
//           $rej_total = 0;
//           $queried_total = 0;
//           $rec_total = 0;
//       //looping
//           foreach ($sub_data as $sub) {
//             foreach($directorate_data as $dir_data){
//                 $sec_data=DB::table('par_sections')->where($where_sec)->where('directorate_id',$dir_data->id)->get();
//               foreach ($sec_data as $sec) {
//                   $cat_data=DB::table('par_prodclass_categories')->where($where_cat)->where('section_id',$sec->id)->get();
//                   foreach ($cat_data as $cat) {
//                     PDF::SetFont('times','B',9);
//                     PDF::cell(190,7,$sub->name,1,1,'B');
//                     PDF::cell(190,7,$sec->name,1,1,'B');
//                     PDF::cell(190,7,$cat->name,1,1,'B');
//                     PDF::MultiCell(10, 10, "No", 1,'','',0);
//                     PDF::MultiCell($w_1, 10, "Product", 1,'','',0);
//                     PDF::MultiCell($w, 10, "Received", 1,'','',0);
//                     PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//                     PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//                     PDF::MultiCell($w, 10, "Queried", 1,'','',1);
//                     PDF::SetFont('times','',9);
//                     $class_data=DB::table('par_classifications')->where($where_class)->where('prodclass_category_id',$cat->id)->get();

//                        foreach ($class_data as $class) {
//                            $product_types_data=DB::table('par_product_types')->where($where_prodType)->get();
//                PDF::cell(190,7,$class->name,1,1,'B');
//                            foreach ($product_types_data as $type_data) {
//                                $classification_id=$class->id;
//                                $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                                 $subFilters=array('t3.classification_id'=>$classification_id,'t3.product_type_id' =>$type_data->id);
//                                 if(validateIsNumeric($device_type_id)){
//                                   $subFilters['t3.device_type_id'] = (int)$device_type_id;
//                                 }

//                                $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);

//                                 $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                                 $queried=$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
//                                 $rowcount = max(PDF::getNumLines($total_received, 35), PDF::getNumLines($type_data->name, 35));
//                                 PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                                 PDF::MultiCell($w_1, $rowcount *5, $type_data->name,1,'','',0);
//                                 PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//                                 PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//                                 PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//                                 PDF::MultiCell($w, $rowcount *5, $queried,1,'','',1);
                                
//                                 $app_sub_total = $app_sub_total+$approved_applications['approved'];
//                                 $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//                                 $queried_sub_total = $queried_sub_total+$queried;
//                                 $rec_sub_total = $rec_sub_total+$total_received;
//                                 $i++;
//                               }
//                           }
//               PDF::SetFont('times','B',9);
//               PDF::MultiCell(50, 10, "Submodule Total",1,'','',0);
//               PDF::MultiCell($w, 10, $rec_sub_total,1,'','',0);
//               PDF::MultiCell($w, 10, $app_sub_total,1,'','',0);
//               PDF::MultiCell($w, 10, $rej_sub_total,1,'','',0);
//               PDF::MultiCell($w, 10, $queried_sub_total,1,'','',1);
              
//               $app_total = $app_sub_total+$app_total;
//               $rej_total = $rej_sub_total+$rej_total;
//               $queried_total = $queried_sub_total+$queried_total;
//               $rec_total = $rec_sub_total+$rec_total;

//               $app_sub_total = 0;
//               $rej_sub_total = 0;
//               $queried_sub_total = 0;
//               $rec_sub_total = 0;
//                       }
//                   }
//               }
//           }
          
//         PDF::SetFont('times','B',9);
//         PDF::MultiCell(50, 10, "Total",1,'','',0);
//         PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//         PDF::MultiCell($w, 10, $app_total,1,'','',0);
//         PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//         PDF::MultiCell($w, 10, $queried_total,1,'','',1);
//         PDF::Output('product Summary Report.pdf','I');
//         }
//   public function printPremiseRegistrationReport(Request $req){
//     $title = 'Premise Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//             PDF::SetTitle( $title );
//             PDF::AddPage();
           
//             $this->generateReportsHeader( $title);
             
//               PDF::Ln();
//      //filters
//       $sub_module_id=$req->sub_module_id;
//       $business_type=$req->business_type;
//       $business_scale=$req->business_scale;
//       $directorate_id=$req->directorate_id;
//       $section_id=$req->section_id;
//       $premise_type=$req->premise_type;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $zone_id=$req->zone_id;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       //directorate data
//       // $where_directorate=array();
//       // if(validateIsNumeric($directorate_id)){
//       //     $where_directorate=array('id'=>$directorate_id);
//       // }
//       // $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();


//       // $where_Btype=array();
//       // if(validateIsNumeric($business_type)){
//       //     $where_Btype=array('id'=>$business_type);
//       // }
    
//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
    
//       $table2='tra_premises';
//       $field='premise_id';
//       $sub_total = 0;
//       $cummurative_total = 0;
//       $app_sub_total = 0;
//       $rej_sub_total = 0;
//       $queried_sub_total = 0;
//       $rec_sub_total = 0;
//       $cummurative_total = 0;
//       $app_total = 0;
//       $rej_total = 0;
//       $queried_total = 0;
//       $rec_total = 0;
//       $i = 1;
// //looping


//       foreach ($sub_data as $sub) {
//         //foreach($directorate_data as $dir_data){
//             $sec_data=DB::table('par_sections')->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',2)->get();
//             PDF::SetFont('times','B',9);
//             PDF::cell(185,7,$sub->name,1,1,'B');
//             //PDF::cell(190,7,$sec->name,1,1,'B');
//             PDF::MultiCell(10, 10, "No", 1,'','',0);
//             //PDF::MultiCell($w_1, 10, "Business Type", 1,'','',0);
//             PDF::MultiCell($w, 10, "Section", 1,'','',0);
//             PDF::MultiCell($w, 10, "Received", 1,'','',0);
//             PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//             PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//             PDF::MultiCell($w, 10, "Queried", 1,'','',1);
//             PDF::SetFont('times','',9);
//           foreach ($sec_data as $sec) {
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters=array();
//               if(validateIsNumeric($zone_id)){
//                 $subFilters['t1.zone_id'] = $zone_id;
//               }
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                             $queried=$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
//                             $rowcount = max(PDF::getNumLines($sub->name, 25), PDF::getNumLines($sec->name, 25));
//                             PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $sec->name,1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $queried,1,'','',1);
                            
//                             $app_sub_total = $app_sub_total+$approved_applications['approved'];
//                             $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//                             $queried_sub_total = $queried_sub_total+$queried;
//                             $rec_sub_total = $rec_sub_total+$total_received;
//                            $i++;
//                   }
//                   PDF::SetFont('times','B',9);
//                   //PDF::MultiCell(10, 10, "",0,'','',0);
//                   PDF::MultiCell($w+10, 10, "SubModule Total",1,'','',0);
//                   PDF::MultiCell($w, 10, $rec_sub_total,1,'','',0);
//                   PDF::MultiCell($w, 10, $app_sub_total,1,'','',0);
//                   PDF::MultiCell($w, 10, $rej_sub_total,1,'','',0);
//                   PDF::MultiCell($w, 10, $queried_sub_total,1,'','',1);
//                  // PDF::Ln();

//                   $app_total = $app_sub_total+$app_total;
//                   $rej_total = $rej_sub_total+$rej_total;
//                   $queried_total = $queried_sub_total+$queried_total;
//                   $rec_total = $rec_sub_total+$rec_total;

//                   $app_sub_total = 0;
//                   $rej_sub_total = 0;
//                   $queried_sub_total = 0;
//                   $rec_sub_total = 0;
//               //}
//           }
//       PDF::SetFont('times','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//       PDF::MultiCell($w, 10, $app_total,1,'','',0);
//       PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//       PDF::MultiCell($w, 10, $queried_total,1,'','',1);
       
//       PDF::Output('Premise Summary Report.pdf','I');
//   }
//   public function printPremiseRegister(Request $req){
//     $title = 'Premise Register Report';
//         $w = 20; 
//         $w_1 = 50;
//         $w_2 = 30;
//         $h = 15;
//         $border = 1;
//         $align = 'L';
//         $fill = 0;
//         $ln = 0;
//         $x = '';
//         $y= '';
//         $reseth = true; 
//         $stretch= 1;
//         $ishtml = true;
//         $autopadding = true;
//         $maxh = 0;
//             PDF::SetTitle( $title );
//             //$width = PDF::pixelsToUnits(400); 
//             //$height = PDF::pixelsToUnits(300);

//            // $resolution= array($width, $height);
//             PDF::AddPage();
           
//             $this->generateReportsHeader( $title);
             
//               PDF::Ln();
//     $sub_module_id = $req->sub_module_id;
//     $zone_id = $req->zone_id;
//     $section_id = $req->section_id;
//     $to_date = $req->to_date;
//     $from_date = $req->from_date;

//     $sub_modules = DB::table('sub_modules')->where('module_id', 2);
//     $sections = DB::table('par_sections')->whereIn('id',[2,4]);
//     $zones = DB::table('par_zones');

//     if(validateIsNumeric($sub_module_id)){
//       $sub_modules->where('id',$sub_module_id);
//     }
//     if(validateIsNumeric($section_id)){
//       $sections->where('id',$section_id);
//     }
//     if(validateIsNumeric($zone_id)){
//       $zones->where('id',$zone_id);
//     }

//     $sub_modules = $sub_modules->get();
//     $sections = $sections->whereIn('id',[2,4])->get();
//     $zones = $zones->get();
//     $results = array();
//     $app_sub_total=0;
//     $rej_sub_total=0;
//     $app_cummurative_total=0;
//     $rej_cummurative_total=0;
//     foreach ($sub_modules as $sub_module) {
//       PDF::SetFont('times','B',9);
//       PDF::MultiCell($w_1, $h, "Sub Module", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh, 'B');
//       PDF::MultiCell($w_1, $h, "Section", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh, 'B');
//       PDF::MultiCell($w_1, $h, "Zone", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);

//       PDF::MultiCell($w, $h, "Approved", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//       PDF::MultiCell($w, $h, "Rejected", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//       PDF::Ln();
//       PDF::SetFont('times','',9);
//       foreach ($sections as $section) {
//         foreach ($zones as $zone) {
//            $qry = DB::table('tra_premises_applications as t1')
//                   ->join('tra_approval_recommendations as t2','t1.application_code','t2.application_code')
//                   ->select(DB::raw('count(t1.id) as total_count,t2.decision_id'))
//                   ->where(array('t1.sub_module_id'=>$sub_module->id,'t1.section_id'=>$section->id,'t1.zone_id'=>$zone->id))
//                   ->groupBy('t2.decision_id');
//              if($to_date != '' || $from_date != ''){
//                   $qry->whereRAW("date_format(t2.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//                 }
//               $data = $qry->get();
//               $approved = 0;
//               $rejected = 0;

//               foreach ($data as $result) {
                
//                 if($result->decision_id == 1 || $result->decision_id == 2){
//                   $approved = $approved+$result->total_count;
//                 }else{

//                   $rejected = $rejected+$result->total_count;
//                 }
//               }
//                PDF::MultiCell($w_1, $h, $sub_module->name, $border, $align, $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//                 PDF::MultiCell($w_1, $h, $section->name, $border, $align, $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//                 PDF::MultiCell($w_1, $h, $zone->name, $border, $align, $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);

//                 PDF::MultiCell($w, $h, $approved, $border, $align, $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//                 PDF::MultiCell($w, $h, $rejected, $border, $align, $fill, 1, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//                 $app_sub_total = $app_sub_total+$approved;
//                 $rej_sub_total = $rej_sub_total+$rejected;
//               // $results[] = array(
//               //   'sub_module_name' => $sub_module->name,
//               //   'section_name' => $section->name,
//               //   'zone_name' => $zone->name,
//               //   'approved' => $approved,
//               //   'rejected' => $rejected
//               // );
//         }
//       }
//       PDF::SetFont('times','B',9);
//       PDF::MultiCell(150, 10, "Submodule Total", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//       PDF::MultiCell(20, 10, $app_sub_total, $border, 'C', $fill, 0, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//       PDF::MultiCell(20, 10, $rej_sub_total, $border, 'C', $fill, 1, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);

//           $app_cummurative_total = $app_cummurative_total + $app_sub_total;
//           $rej_cummurative_total = $rej_cummurative_total + $rej_sub_total;
//           $rej_sub_total = 0;
//           $app_sub_total = 0;
//     }
//     PDF::SetFont('times','B',9);
//      PDF::MultiCell(150, 10, "Total Applications", $border, 'C', $fill, $ln, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//      PDF::MultiCell(20, 10, $app_cummurative_total, $border, 'C', $fill, 0, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//       PDF::MultiCell(20, 10, $rej_cummurative_total, $border, 'C', $fill, 1, $x, $y, $reseth, $stretch, $ishtml, $autopadding, $maxh);
//     PDF::Output('Premise Register Report.pdf','I');
//   }
//   public function printIERegSummaryReport(Request $req){
//     $title = 'Import Export Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//     //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $zone_id=$req->zone_id;
//       $type_category=$req->type_category;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->dateAddedFilter($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
      

//       //directorate data
//       // $where_directorate=array();
//       // if(validateIsNumeric($directorate_id)){
//       //     $where_directorate=array('id'=>$directorate_id);
//       // }
//       // $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       $where_category=array();
//       if(validateIsNumeric($type_category)){
//           $where_category=array('id'=>$type_category);
//       }
//      // $category_data=DB::table('par_permit_typecategories')->where($where_category)->get();

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='';
//       $field= '';
//       $sub_total = 0;
//       $cummurative_total = 0;
//       $app_sub_total = 0;
//       $rej_sub_total = 0;
//       $queried_sub_total = 0;
//       $rec_sub_total = 0;
//       $cummurative_total = 0;
//       $app_total = 0;
//       $rej_total = 0;
//       $queried_total = 0;
//       $rec_total = 0;
//       $i = 1;

// //looping
//  PDF::MultiCell(10, 10, "No", 1,'','',0);
//               PDF::MultiCell($w, 10, "Section", 1,'','',0);
//               PDF::MultiCell($w, 10, "Received", 1,'','',0);
//               PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//               PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//               PDF::MultiCell($w, 10, "Queried", 1,'','',1);
//               PDF::SetFont('','',9);
//       foreach ($sub_data as $sub) {
//         //foreach($directorate_data as $dir_data){
//         PDF::SetFont('','B',9);
//               PDF::cell(185,7,$sub->name,1,1,'B');
              
//           $sec_data=DB::table('par_sections')->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',2)->get();
            
//           foreach ($sec_data as $sec) {
//           // PDF::cell(185,7,$sec->name,1,1,'B');
//              PDF::SetFont('','',9);
//              // foreach ($category_data as $cat_data) {
//                            //$category_id=$cat_data->id;
//                            $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                             $subFilters=array();
//                            if(validateIsNumeric($zone_id)){
//                  $subFilters['t1.zone_id'] = $zone_id;
//                }
//                            $approved_applications = $this->funcGetApprovedImportExportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//                             //$pushed=$this->getRegistrationReportGridBroughtCariedForwardApplication($table,$table2,$field,$filters,$subFilters,$req->received_opt,$evaluation_opt,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,0);
//                             $queried=$this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
//                             //$total_brought_forward = $pushed['brought'];
//                             //$total = $total_brought_forward+$total_received;

//                             //print
//                             $rowcount =1;// max(PDF::getNumLines($sub->name, 25), PDF::getNumLines($sec->name, 25));
//                             PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $sec->name,1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//                             PDF::MultiCell($w, $rowcount *5, $queried,1,'','',1);
              
//                             $app_sub_total = $app_sub_total+$approved_applications['approved'];
//                             $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//                             $queried_sub_total = $queried_sub_total+$queried;
//                             $rec_sub_total = $rec_sub_total+$total_received;
              
//                            $i++;

                            
//                    // }
//                   PDF::SetFont('','B',9);
          
//                   $app_total = $app_total+$approved_applications['approved'];
//                   $rej_total = $rej_total+$approved_applications['rejected'];
//                   $queried_total = $queried_total+$queried;
//                   $rec_total = $rec_total+$total_received;

                  
//               }
//          //PDF::MultiCell(10, 10, "",0,'','',0);
//           PDF::SetFont('','',9);
//                   PDF::MultiCell($w+10, 10, "Sub-Module Total",1,'','',0);
//                   PDF::MultiCell($w, 10, $rec_sub_total,1,'','',0);
//                   PDF::MultiCell($w, 10, $app_sub_total,1,'','',0);
//                   PDF::MultiCell($w, 10, $rej_sub_total,1,'','',0);
//                   PDF::MultiCell($w, 10, $queried_sub_total,1,'','',1);
//           $app_sub_total = 0;
//                   $rej_sub_total = 0;
//                   $queried_sub_total = 0;
//                   $rec_sub_total = 0;
          
//           //}
//       }
//       PDF::SetFont('','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//       PDF::MultiCell($w, 10, $app_total,1,'','',0);
//       PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//       PDF::MultiCell($w, 10, $queried_total,1,'','',1);
//       PDF::Output('Import Export Summary Report.pdf','I');
//   }
//    public function printGMPRegSummaryReport(Request $req){
//     $title = 'GMP Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//         $sub_module_id=$req->sub_module_id;
//         $section_id=$req->section_id;
//         $directorate_id=$req->directorate_id;
//         $facility_location=$req->facility_location;
//         $module_id=$req->module_id;
//         $zone_id=$req->zone_id;
//         $received_opt=$req->module_id;
//         $evaluation_opt=$req->evaluation_opt;
//         $from_date=$req->from_date;
//         $to_date=$req->to_date;
//         $datefilters=$this->addedDateFilters($req);
//         //sub-module data
//         $where_sub=array();
//         if(validateIsNumeric($sub_module_id)){
//             $where_sub=array('id'=>$sub_module_id);
//         }
//         $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//         //section data
//         $where_sec=array();
//         if(validateIsNumeric($section_id)){
//             $where_sec=array('id'=>$section_id);
//         }

//         //directorate data
//         $where_directorate=array();
//         if(validateIsNumeric($directorate_id)){
//             $where_directorate=array('id'=>$directorate_id);
//         }
//         $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//         $where_facility=array();
//         if(validateIsNumeric($facility_location)){
//             $where_facility=array('id'=>$facility_location);
//         }
//         $facility_location_data=DB::table('par_gmplocation_details')->where($where_facility)->get();

//         $received_date_opt='date_added';
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='';
//         $field= '';
//         $cummurative_total = 0;
//         $app_sub_total = 0;
//         $rej_sub_total = 0;
//         $queried_sub_total = 0;
//         $rec_sub_total = 0;
//         $cummurative_total = 0;
//         $app_total = 0;
//         $rej_total = 0;
//         $queried_total = 0;
//         $rec_total = 0;
//         $i = 1;
//   //looping
//      PDF::MultiCell(10, 10, "No", 1,'','',0);
//               PDF::MultiCell($w_1, 10, "Section", 1,'','',0);
//              // PDF::MultiCell($w, 10, "Facility Location", 1,'','',0);
//               PDF::MultiCell($w, 10, "Received", 1,'','',0);
//               PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//               PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//               PDF::MultiCell(0, 10, "Queried", 1,'','',1);
//         foreach ($sub_data as $sub) {
//       PDF::SetFont('','B',9);
//               PDF::cell(0,7,$sub->name,1,1,'B');
//           //foreach($directorate_data as $dir_data){
//               $sec_data=DB::table('par_sections')->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',2)->get();
//             foreach ($sec_data as $sec) {
              
//             //  PDF::cell(185,7,$sec->name,1,1,'B');
             
       
//               PDF::SetFont('','',9);
//                // foreach ($facility_location_data as $location_data) {
//                            //  $facility_location_id=$location_data->id;
//                              $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                               $subFilters=array();
//                              if(validateIsNumeric($zone_id)){
//                  $subFilters['t1.zone_id'] = $zone_id;
//                }
//                              $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);

//                               $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                               $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
                                   
// //print
//                             $rowcount = PDF::getNumLines($sec->name, 25);
//                               PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                              PDF::MultiCell($w_1, $rowcount *5, $sec->name,1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//                               PDF::MultiCell(0, $rowcount *5, $queried,1,'','',1);

//                               $app_sub_total = $app_sub_total+$approved_applications['approved'];
//                               $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//                               $queried_sub_total = $queried_sub_total+$queried;
//                               $rec_sub_total = $rec_sub_total+$total_received;
//                              $i++;    
//                     //  }
//                   PDF::SetFont('','B',9);
//                   //PDF::MultiCell(10, 10, "",0,'','',0);w_1
//                  // PDF::MultiCell($w+10, 10, "Section Total",1,'','',0);
//                   //PDF::MultiCell($w, 10, $rec_sub_total,1,'','',0);
//                   //PDF::MultiCell($w, 10, $app_sub_total,1,'','',0);
//                   //PDF::MultiCell($w, 10, $rej_sub_total,1,'','',0);
//                   //PDF::MultiCell($w, 10, $queried_sub_total,1,'','',1);
//                  // PDF::Ln(); location

//                   $app_total = $app_sub_total+$app_total;
//                   $rej_total = $rej_sub_total+$rej_total;
//                   $queried_total = $queried_sub_total+$queried_total;
//                   $rec_total = $rec_sub_total+$rec_total;

//                   $app_sub_total = 0;
//                   $rej_sub_total = 0;
//                   $queried_sub_total = 0;
//                   $rec_sub_total = 0;
//                 }
        
//             }
//             PDF::SetFont('','B',9);
//            // PDF::MultiCell(10, 10, "",0,'','',0);
//             PDF::MultiCell($w_1+10, 10, "Total",1,'','',0);
//             PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//             PDF::MultiCell($w, 10, $app_total,1,'','',0);
//             PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//             PDF::MultiCell(0, 10, $queried_total,1,'','',1);
//             PDF::Output('GMP Summary Report.pdf','I');
        
//       }
//   public function printCTRegSummaryReport(Request $req){
//     $title = 'Clinical Trial Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//         //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $zone_id=$req->zone_id;
//       $directorate_id=$req->directorate_id;
//       $clinical_category=$req->clinical_category;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//       //section data
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }
//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//       $where_category=array();
//       if(validateIsNumeric($clinical_category)){
//           $where_category=array('id'=>$clinical_category);
//       }
//       $category_data=DB::table('par_investigationproduct_sections')->where($where_category)->get();

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='';
//       $field= '';
//       $cummurative_total = 0;
//       $app_sub_total = 0;
//       $rej_sub_total = 0;
//       $queried_sub_total = 0;
//       $rec_sub_total = 0;
//       $cummurative_total = 0;
//       $app_total = 0;
//       $rej_total = 0;
//       $queried_total = 0;
//       $rec_total = 0;
//       $i = 1;
// //looping
//       PDF::SetFont('','B',9);
//               //PDF::cell(185,7,$sub->name,1,1,'B');
//              // PDF::cell(185,7,$sec->name,1,1,'B');
//               PDF::MultiCell(10, 10, "No", 1,'','',0);
//               PDF::MultiCell($w, 10, "Process", 1,'','',0);
//               PDF::MultiCell($w, 10, "Received", 1,'','',0);
//               PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//               PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//               PDF::MultiCell($w, 10, "Queried", 1,'','',1);
//               PDF::SetFont('','',9);
//       foreach ($sub_data as $sub) {
//       //  foreach($directorate_data as $dir_data){
//           //   $sec_data=DB::table('par_sections')->where($where_sec)->where('directorate_id',$dir_data->id)->get();
//           // foreach ($sec_data as $sec) {
              
//                      // foreach ($category_data as $cat_data) {
//                           // $category_id=$cat_data->id;
//                            $filters="t1.sub_module_id = ".$sub->id;
//                             $subFilters=array();
//                            if(validateIsNumeric($zone_id)){
//                  $subFilters['t1.zone_id'] = $zone_id;
//                }
//                            $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);

//                             $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                             $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
//                              $rowcount = 2;
//                               PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5,$sub->name ,1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//                               PDF::MultiCell($w, $rowcount *5, $queried,1,'','',1);

//                               $app_sub_total = $app_sub_total+$approved_applications['approved'];
//                               $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//                               $queried_sub_total = $queried_sub_total+$queried;
//                               $rec_sub_total = $rec_sub_total+$total_received;
//                              $i++;
                  

//                   $app_total = $app_sub_total+$app_total;
//                   $rej_total = $rej_sub_total+$rej_total;
//                   $queried_total = $queried_sub_total+$queried_total;
//                   $rec_total = $rec_sub_total+$rec_total;

//                   $app_sub_total = 0;
//                   $rej_sub_total = 0;
//                   $queried_sub_total = 0;
//                   $rec_sub_total = 0;
//               //}
//           }
      
//           PDF::SetFont('','B',9);
//            // PDF::MultiCell(10, 10, "",0,'','',0);
//             PDF::MultiCell($w+10, 10, "Total",1,'','',0);
//             PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//             PDF::MultiCell($w, 10, $app_total,1,'','',0);
//             PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//             PDF::MultiCell($w, 10, $queried_total,1,'','',1);
//             PDF::Output('Clinical Trial Summary Report.pdf','I');


//       }
//     public function printPromAdvertRegSummaryReport(Request $req){
//     $title = 'Promotion And Adverticement Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//         $sub_module_id=$req->sub_module_id;
//         $section_id=$req->section_id;
//         $directorate_id=$req->directorate_id;
//         $classification_id=$req->classification_id;
//         $module_id=$req->module_id;
//         $received_opt=$req->received_opt;
//         $evaluation_opt=$req->evaluation_opt;
//         $from_date=$req->from_date;
//         $to_date=$req->to_date;
//         $datefilters=$this->addedDateFilters($req);
//         //sub-module data
//         $where_sub=array();
//         if(validateIsNumeric($sub_module_id)){
//             $where_sub=array('id'=>$sub_module_id);
//         }
//         $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();

//         //section data
//         $where_sec=array();
//         if(validateIsNumeric($section_id)){
//             $where_sec=array('id'=>$section_id);
//         }

//         //directorate data
//         $where_directorate=array();
//         if(validateIsNumeric($directorate_id)){
//             $where_directorate=array('id'=>$directorate_id);
//         }
//         $directorate_data=DB::table('par_directorates')->where($where_directorate)->get();

//         $received_date_opt='date_added';
//         $data = array();
//         $table=$this->getTableName($module_id);
//         $table2='';
//         $field= '';
//         $cummurative_total = 0;
//         $app_sub_total = 0;
//         $rej_sub_total = 0;
//         $queried_sub_total = 0;
//         $rec_sub_total = 0;
//         $cummurative_total = 0;
//         $app_total = 0;
//         $rej_total = 0;
//         $queried_total = 0;
//         $rec_total = 0;
//         $i = 1;
//   //looping
//       PDF::MultiCell(10, 10, "No", 1,'','',0);
//       PDF::MultiCell($w_1, 10, "Section", 1,'','',0);
//       PDF::MultiCell($w, 10, "Received", 1,'','',0);
//       PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//       PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//       PDF::MultiCell(0, 10, "Queried", 1,'','',1);
//       foreach ($sub_data as $sub) {
//           PDF::SetFont('','B',9);
//           PDF::cell(0,7,$sub->name,1,1,'B');

//           foreach($directorate_data as $dir_data){
//             $sec_data=DB::table('par_sections')->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();

//             foreach ($sec_data as $sec) {
//               PDF::SetFont('','',9);
//               $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                 $subFilters=array();
               
//               $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);

//               $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//                 $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
                     
// //print
//               $rowcount = PDF::getNumLines($sec->name, 25);
//               PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//               PDF::MultiCell($w_1, $rowcount *5, $sec->name,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//               PDF::MultiCell(0, $rowcount *5, $queried,1,'','',1);

//               $app_sub_total = $app_sub_total+$approved_applications['approved'];
//               $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//               $queried_sub_total = $queried_sub_total+$queried;
//               $rec_sub_total = $rec_sub_total+$total_received;
//              $i++;    
//             }
//           PDF::SetFont('','B',9);

//           $app_total = $app_sub_total+$app_total;
//           $rej_total = $rej_sub_total+$rej_total;
//           $queried_total = $queried_sub_total+$queried_total;
//           $rec_total = $rec_sub_total+$rec_total;

//           $app_sub_total = 0;
//           $rej_sub_total = 0;
//           $queried_sub_total = 0;
//           $rec_sub_total = 0;
//         }

//       }
//       PDF::SetFont('','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w_1+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//       PDF::MultiCell($w, 10, $app_total,1,'','',0);
//       PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//       PDF::MultiCell(0, 10, $queried_total,1,'','',1);
//       PDF::Output('Promotion And Adverticement Summary Report.pdf','I');
//   }
//    public function printPremiseZonalSummaryReport(Request $req){
//     $title = 'Premise Zonal Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//         $sub_module_id = $req->sub_module_id;
//         $section_id = $req->section_id;
//         $zone_id = $req->zone_id;
//         $from_date = $req->from_date;
//         $received_opt = $req->received_opt;
//         $evaluation_opt = $req->evaluation_opt;
//         $to_date = $req->to_date;
//         $business_type_category_id = $req->business_type_category_id;

//         $receivedDateFilters=$this->addedDateFilters($req);

//         $approvalDateFilters = "date_format(t5.approval_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";

//         $where_sub=array();
//         if(validateIsNumeric($sub_module_id)){
//         $where_sub = array('id'=>$sub_module_id);
//         }
//         $sub_data = DB::table('sub_modules')->where($where_sub)->get();

//         $where_sec=array();
//         if(validateIsNumeric($section_id)){
//         $where_sec = array('id'=>$section_id);
//         }
//         $sec_data = DB::table('par_sections')->where($where_sec)->get();

//         $where_zone=array();
//         if(validateIsNumeric($zone_id)){
//         $where_zone = array('id'=>$zone_id);
//         }
//         $zone_data = DB::table('par_zones')->where($where_zone)->get();

//         $where_bsnCat=array();
//         if(validateIsNumeric($business_type_category_id)){
//         $where_bsnCat = array('id'=>$business_type_category_id);
//         }
//         $bsnCat_data = DB::table('par_businesstype_categories')->where($where_bsnCat)->get();

//         $results = array();
//         $received_date_opt='date_added';
//         $data = array();
//         $table2='';
//         $field= '';
//         $cummurative_total = 0;
//         $small_scale_total = 0;
//         $medium_scale_total = 0;
//         $large_scale_total = 0;
//         $grant_total = 0;
//         $cummurative_total = 0;
//         $small_scale_sub_total = 0;
//         $medium_scale_sub_total = 0;
//         $large_scale_sub_total = 0;
//         $total_sub_total = 0;
//         $i = 1;
//   //looping
//         PDF::MultiCell(10, 10, "No", 1,'','',0);
//         PDF::MultiCell($w_1, 10, "Business Category Type", 1,'','',0);
//         PDF::MultiCell($w, 10, "Small Scale", 1,'','',0);
//         PDF::MultiCell($w, 10, "Medium Scale", 1,'','',0);
//         PDF::MultiCell($w, 10, "Large Scale", 1,'','',0);
//         PDF::MultiCell(0, 10, "Total", 1,'','',1);
//         foreach ($zone_data as $zone) {
//             PDF::SetFont('times','B',9);
//             PDF::cell(0,7,$zone->name,1,1,'B');
//           foreach ($sub_data as $sub) {
//             PDF::cell(0,7,$sub->name,1,1,'B');
//             foreach ($sec_data as $sec) {
//               PDF::cell(0,7,$sec->name,1,1,'B');
//               PDF::SetFont('times','',9);
//               foreach ($bsnCat_data as $bsnCat) {
//                 $large_scale=$this->getPremiseCountByScale($sub->id,$sec->id,$zone->id,$bsnCat->id,$receivedDateFilters,$approvalDateFilters,'3');
//                 $medium_scale=$this->getPremiseCountByScale($sub->id,$sec->id,$zone->id,$bsnCat->id,$receivedDateFilters,$approvalDateFilters,'2');
//                 $small_scale=$this->getPremiseCountByScale($sub->id,$sec->id,$zone->id,$bsnCat->id,$receivedDateFilters,$approvalDateFilters,'1');
//                 $total=$small_scale+$large_scale+$medium_scale;
//                 $rowcount = PDF::getNumLines($bsnCat->name, 25);
//                 PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                 PDF::MultiCell($w_1, $rowcount *5, $bsnCat->name,1,'','',0);
//                 PDF::MultiCell($w, $rowcount *5, $small_scale,1,'','',0);
//                 PDF::MultiCell($w, $rowcount *5, $medium_scale,1,'','',0);
//                 PDF::MultiCell($w, $rowcount *5, $large_scale,1,'','',0);
//                 PDF::MultiCell(0, $rowcount *5, $total,1,'','',1);

//                 $small_scale_sub_total = $small_scale_sub_total+$small_scale;
//                 $medium_scale_sub_total = $medium_scale_sub_total+$medium_scale;
//                 $large_scale_sub_total = $large_scale_sub_total+$large_scale;
//                 $total_sub_total = $total_sub_total+$total;
//                $i++;    
//               }
//             PDF::SetFont('times','B',9);

//             $small_scale_total = $small_scale_sub_total+$small_scale_total;
//             $medium_scale_total = $medium_scale_sub_total+$medium_scale_total;
//             $large_scale_total = $large_scale_sub_total+$large_scale_total;
//             $grant_total = $total_sub_total+$grant_total;

//             $small_scale_sub_total = 0;
//             $medium_scale_sub_total = 0;
//             $large_scale_sub_total = 0;
//             $total_sub_total = 0;
//           }
//         }
//       }
//       PDF::SetFont('','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w_1+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $small_scale_total,1,'','',0);
//       PDF::MultiCell($w, 10, $medium_scale_total,1,'','',0);
//       PDF::MultiCell($w, 10, $large_scale_total,1,'','',0);
//       PDF::MultiCell(0, 10, $grant_total,1,'','',1);
//       PDF::Output('Premise Zonal Summary Report.pdf','I');
//   }
//    public function exportPremiseZonalSummaryData(request $req){
        
//         $heading ="Premise Zonal Report";
//         $filename ="PremiseZonalReport";
//         $sub_module_id = $req->sub_module_id;
//         $section_id = $req->section_id;
//         $zone_id = $req->zone_id;
//         $from_date = $req->from_date;
//         $to_date = $req->to_date;
//         $business_type_category_id = $req->business_type_category_id;
//         $row = 8;
//         $styleHeaderArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ]
//             ];
//     $ApplicationSpreadsheet = new Spreadsheet();
//     $sheet = $ApplicationSpreadsheet->getActiveSheet();
//     $where_zone=array();
//     if(validateIsNumeric($zone_id)){
//       $where_zone = array('id'=>$zone_id);
//     }
//     $zone_data = DB::table('par_zones')->where($where_zone)->get();
//     foreach ($zone_data as $zone) {
//       $qry= DB::table('tra_premises_applications as t1')
//            ->LeftJoin('tra_premises as t1b','t1.premise_id','t1b.id')
//            ->LeftJoin('par_countries as t2','t1b.country_id','t2.id')
//            ->LeftJoin('par_regions as t3','t1b.region_id','t3.id')
//            ->LeftJoin('par_districts as t4','t1b.district_id','t4.id')
//            ->LeftJoin('par_business_types as t5','t1b.business_type_id','t5.id')
//            ->LeftJoin('par_business_scales as t6','t1b.business_scale_id','t6.id')
//            ->LeftJoin('par_business_categories as t7','t1b.business_category_id','t7.id')
//            ->LeftJoin('wb_trader_account as t8','t1b.applicant_id','t8.id')
//            ->LeftJoin('tra_personnel_information as t9','t1b.contact_person_id','t9.id')
//            ->LeftJoin('tra_premises_otherdetails as t10','t1b.id','t10.premise_id')
//            ->LeftJoin('par_business_type_details as t11','t10.business_type_detail_id','t11.id')
//            ->LeftJoin('par_zones as t12','t1.zone_id','t12.id')
//            ->leftJoin('par_countries as t13','t8.country_id','t13.id')
//            ->leftJoin('par_regions as t14','t8.region_id','t14.id')
//            ->leftJoin('tra_approval_recommendations as t15','t1.application_code','t15.application_code')
//            ->leftJoin('par_premises_types as t16','t1b.premise_type_id','t16.id')
//            ->LeftJoin('par_approval_decisions as t17','t15.decision_id','t17.id')
//            ->LeftJoin('par_registration_statuses as t23','t15.appregistration_status_id','t23.id')
//             ->LeftJoin('par_validity_statuses as t24','t15.appvalidity_status_id','t24.id')
//             ->LeftJoin('tra_payments as tp','t1.application_code','tp.application_code')


//           ->select('t1.reference_no','t1.tracking_no','t1b.name','t1b.email','t1b.postal_address','t1b.physical_address','t1b.telephone','t1b.mobile_no','t1b.contact_person_startdate','t1b.contact_person_enddate','t1b.gps_coordinate','t2.name as Precountry','t3.name as PreRegion','t4.name as Premise_District','t5.name as Business_Type','t7.name as Business_Category','t6.name as Business_Scale','t8.name as Trader','t8.postal_address as trader_postal_address','t8.physical_address as trader_physical_address','t8.email_address as trader_email_address','t8.telephone_no as Trader_Tell','t8.mobile_no as TraderMobile','t9.name as ContactPerson','t9.telephone_no as ContactPerson_Tell','t9.email_address as ContactPerson_Email','t11.name as Business_Type_Details','t12.name as issueplace','t13.name as TraderCountry','t14.name as TraderRegion','t15.expiry_date as CertExpiryDate','t15.certificate_issue_date as CertIssueDate','t16.name as PremiseCategory','t15.certificate_no','t23.name as registration_status', 't24.name as validity_status')
//         ->groupBy('t1.application_code');
//         if(validateIsNumeric($sub_module_id)){
//            $qry->where('t1.sub_module_id', $sub_module_id);
//           }
//         if(validateIsNumeric($section_id)){
//            $qry->where('t1.section_id',$section_id);
//           }
//         if(validateIsNumeric($business_type_category_id)){
//            $qry->where('t1b.business_category_id',$business_type_category_id);
//           }
//         if((isset($from_date) && isset($to_date)) && ($from_date != '' && $to_date != '')){
//           $qry->whereRAW("date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'");
//           }
//       $qry->where('t1.zone_id',$zone->id);
//       $response = $qry->get();
//       if(isset($response[0])){
//         $array = json_decode(json_encode($response[0]), true);
//       }else{
//         $array = array('No data');
//         $temp = $row+1;
//         $sheet->getCell('A'.$temp)->setValue('Zero Applications');
//       }
      
//       $header=array_keys($array);
//       $letter=$this->number_to_alpha(count($header),"");
//       $sheet->mergeCells('A'.$row.':'.$letter.''.$row);
//       $sheet->getCell('A'.$row)->setValue($zone->name);
//       $row++;
//       $sheet->getStyle('A'.$row.':'.$letter.''.$row)->applyFromArray($styleHeaderArray);
//       $sheet->fromArray($header, null, "A".$row);
//       $row++;
//       foreach ($response as $res) {
//         $data = (array)$res;
//         $sheet->fromArray($data, null, "A".$row);

//         $row++;
//       }
//       $row++;
//     }
  
// //Main heading style
//         $styleArray = [
//                 'font' => [
//                     'bold' => true,
//                 ],
//                 'alignment' => [
//                     'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
//                 ],
//                 'borders' => [
//                     'top' => [
//                         'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
//                     ],
//                 ],
//                 'fill' => [
//                     'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
//                     'rotation' => 90,
//                     'startColor' => [
//                         'argb' => 'FFA0A0A0',
//                     ],
//                     'endColor' => [
//                         'argb' => 'FFFFFFFF',
//                     ],
//                 ]
//             ];
         
      
//       //set cell text wrap true for all columns
//         $cellRange = 'A7:'.$letter.''.$row;
//         $sheet->getStyle($cellRange)->getAlignment()->setWrapText(true);
//         $sheet->getColumnDimension('A')->setAutoSize(true);

          
//       //add heading title
//         $sheet->mergeCells('A1:'.$letter.'6')
//             ->getCell('A1')
//             ->setValue("TANZANIAN MEDICINE AND MEDICAL DEVICES AGENCY\nP.O. Box 77150, Nelson Mandela Road,Mabibo External\nTell : +255 22 2450512/2450751/2452108 Fax : +255 28 2541484\nWebsite: www.tfda.go.tzEmail: info@tfda.go.tz\n".$heading);
//         $sheet->getStyle('A1:'.$letter.'6')->applyFromArray($styleArray);
//         $sheet->getStyle('A1:'.$letter.'6')->getAlignment()->setWrapText(true);

//       //format row headers 
//        $sheet->getStyle('A7:'.$letter.'7')->applyFromArray($styleHeaderArray); 
//         //create file
//             $writer = new Xlsx($ApplicationSpreadsheet);
         

//            $response =  new StreamedResponse(
//             function () use ($writer) {
//                 $writer->save('php://output');
//             }
//         );
//         $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         $response->headers->set('Content-Disposition', 'attachment;filename=PremiseZonalReport.xlsx');
//         $response->headers->set('Cache-Control','max-age=0');


//        return $response;

//   }
//   public function getModuleRegReport(Request $req){
//       //filters
//       $sub_module_id = $req->sub_module_id;
//       $section_id = $req->section_id;
//       $module_id = $req->module_id;
//       $zone_id = $req->zone_id;
//       $from_date = $req->from_date;
//       $to_date = $req->to_date;
//       $data = array();
//       //filters where
//       $where_submodule = array();
//       if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//       }
//       $where_zone = array();
//       if(validateIsNumeric($zone_id)){
//         $where_zone = array('t1.zone_id'=>$zone_id);
//       }
//       $datefilters = '';
//       if($from_date != '' && $to_date != ''){
//         $datefilters="date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//       }

//       //mod data
//       $where_mod = array();
//       if(validateIsNumeric($module_id)){
//         $where_mod = array('id'=>$module_id);
//       }
//       $mod_data = DB::table('modules')->where($where_mod)->where('is_application',1)->get();

//       //sec data
//       $where_sec = array();
//       if(validateIsNumeric($section_id)){
//         $where_sec = array('id'=>$section_id);
//       }

//       //loop data
//       foreach ($mod_data as $mod) {
//         $sub_data = DB::table('sub_modules')->where($where_submodule)->where('module_id',$mod->id)->get();
//         $section_data = $this->getSectionDataByModule($where_sec, $mod->id);
//         foreach ($sub_data as $sub) {
//           foreach ($section_data as $sec) {
//             $filters = "t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//             $subFilters = $where_zone;
//             $table = $this->getTableName($mod->id);
//             $table2 = '';
//             $field = '';
//             $has_payment_processing = 1;
//             if($sub->id == 30){
//               $has_payment_processing = 0;
//             }
//             $received_applications = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$has_payment_processing);
//             $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//             $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
//             $data[] = array(
//               'received_applications' => $received_applications,
//               'approved_applications' => $approved_applications['approved'],
//               'rejected_applications' => $approved_applications['rejected'],
//               'Queried' => $queried,
//               'module_name' => $mod->name,
//               'section_name' => $sec->name,
//               'sub_module_name' => $sub->name
//             );
//           }
//         }
//       }
//       $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//   }
//   public function getSectionRegReport(Request $req){
//       //filters
//       $sub_module_id = $req->sub_module_id;
//       $section_id = $req->section_id;
//       $module_id = $req->module_id;
//       $zone_id = $req->zone_id;
//       $from_date = $req->from_date;
//       $to_date = $req->to_date;
//       $data = array();
//       //filters where
//       $where_submodule = array();
//       if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//       }
//       $where_zone = array();
//       if(validateIsNumeric($zone_id)){
//         $where_zone = array('t1.zone_id'=>$zone_id);
//       }
//       $datefilters = '';
//       if($from_date != '' && $to_date != ''){
//         $datefilters="date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//       }

//       //mod data
//       $where_mod = array();
//       if(validateIsNumeric($module_id)){
//         $where_mod = array('id'=>$module_id);
//       }
//       $mod_data = DB::table('modules')->where($where_mod)->where('is_application',1)->get();

//       //sec data
//       $where_sec = array();
//       if(validateIsNumeric($section_id)){
//         $where_sec = array('id'=>$section_id);
//       }

//       //loop data
//       foreach ($mod_data as $mod) {
//         $sub_data = DB::table('sub_modules')->where($where_submodule)->where('module_id',$mod->id)->get();
//         $section_data = $this->getSectionDataByModule($where_sec, $mod->id);
//         foreach ($section_data as $sec) {
//           foreach ($sub_data as $sub) {
//             $filters = "t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//             $subFilters = $where_zone;
//             $table = $this->getTableName($mod->id);
//             $table2 = '';
//             $field = '';
//             $has_payment_processing = 1;
//             if($sub->id == 30){
//               $has_payment_processing = 0;
//             }
//             $received_applications = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field,$subFilters,$filters,$datefilters,$has_payment_processing);
//             $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//             $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
//             $data[] = array(
//               'received_applications' => $received_applications,
//               'approved_applications' => $approved_applications['approved'],
//               'rejected_applications' => $approved_applications['rejected'],
//               'Queried' => $queried,
//               'module_name' => $mod->name,
//               'section_name' => $sec->name,
//               'sub_module_name' => $sub->name
//             );
//           }
//         }
//       }
//       $res = array(
//                     'success' => true,
//                     'results' => $data,
//                     'message' => 'All is well'
                        
//                     );
//       return \response()->json($res);
//   }
//    public function printModuleRegReport(Request $req){
//     $title = 'Module Based Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//      //filters
//       $sub_module_id = $req->sub_module_id;
//       $section_id = $req->section_id;
//       $module_id = $req->module_id;
//       $zone_id = $req->zone_id;
//       $from_date = $req->from_date;
//       $to_date = $req->to_date;
//       $data = array();
//       //filters where
//       $where_submodule = array();
//       if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//       }
//       $where_zone = array();
//       if(validateIsNumeric($zone_id)){
//         $where_zone = array('t1.zone_id'=>$zone_id);
//       }
//       $datefilters = '';
//       if($from_date != '' && $to_date != ''){
//         $datefilters="date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//       }

//       //mod data
//       $where_mod = array();
//       if(validateIsNumeric($module_id)){
//         $where_mod = array('id'=>$module_id);
//       }
//       $mod_data = DB::table('modules')->where($where_mod)->where('is_application',1)->get();

//       //sec data
//       $where_sec = array();
//       if(validateIsNumeric($section_id)){
//         $where_sec = array('id'=>$section_id);
//       }
      
//       $data = array();
//       $cummurative_total = 0;
//       $app_sub_total = 0;
//       $rej_sub_total = 0;
//       $queried_sub_total = 0;
//       $rec_sub_total = 0;
//       $cummurative_total = 0;
//       $app_total = 0;
//       $rej_total = 0;
//       $queried_total = 0;
//       $rec_total = 0;
//       $i = 1;
//   //looping
//         PDF::MultiCell(10, 10, "No", 1,'','',0);
//         PDF::MultiCell($w_1, 10, "Section", 1,'','',0);
//         PDF::MultiCell($w, 10, "Received", 1,'','',0);
//         PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//         PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//         PDF::MultiCell(0, 10, "Queried", 1,'','',1);
//         foreach ($mod_data as $mod) {
//             PDF::SetFont('','B',9);
//             PDF::cell(0,7,$mod->name,1,1,'B');
//             $sub_data = DB::table('sub_modules')->where($where_submodule)->where('module_id',$mod->id)->get();
//             $section_data = $this->getSectionDataByModule($where_sec, $mod->id);
//           foreach ($sub_data as $sub) {
//             PDF::cell(0,7,$sub->name,1,1,'B');
//             foreach ($section_data as $sec) {
//                 $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                 $subFilters=$where_zone;
//                 $table = $this->getTableName($mod->id);
//                 $table2 = '';
//                 $field = '';
//                 $has_payment_processing = 1;
//                 if($sub->id == 30){
//                   $has_payment_processing = 0;
//                 }
//               $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//               $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
                     
// //print
//               $rowcount = PDF::getNumLines($sec->name,40);
//               PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//               PDF::MultiCell($w_1, $rowcount *5, $sec->name,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//               PDF::MultiCell(0, $rowcount *5, $queried,1,'','',1);

//               $app_sub_total = $app_sub_total+$approved_applications['approved'];
//               $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//               $queried_sub_total = $queried_sub_total+$queried;
//               $rec_sub_total = $rec_sub_total+$total_received;
//              $i++;    
//                 }
//               PDF::SetFont('','B',9);

//               $app_total = $app_sub_total+$app_total;
//               $rej_total = $rej_sub_total+$rej_total;
//               $queried_total = $queried_sub_total+$queried_total;
//               $rec_total = $rec_sub_total+$rec_total;

//               $app_sub_total = 0;
//               $rej_sub_total = 0;
//               $queried_sub_total = 0;
//               $rec_sub_total = 0;
//             }
//         }
//       PDF::SetFont('','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w_1+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//       PDF::MultiCell($w, 10, $app_total,1,'','',0);
//       PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//       PDF::MultiCell(0, 10, $queried_total,1,'','',1);
//       PDF::Output('Module Based Summary Report.pdf','I');
//   }
//   public function printSectionRegReport(Request $req){
//     $title = 'Section Based Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//      //filters
//       $sub_module_id = $req->sub_module_id;
//       $section_id = $req->section_id;
//       $module_id = $req->module_id;
//       $zone_id = $req->zone_id;
//       $from_date = $req->from_date;
//       $to_date = $req->to_date;
//       $data = array();
//       //filters where
//       $where_submodule = array();
//       if(validateIsNumeric($sub_module_id)){
//         $where_submodule = array('id'=>$sub_module_id);
//       }
//       $where_zone = array();
//       if(validateIsNumeric($zone_id)){
//         $where_zone = array('t1.zone_id'=>$zone_id);
//       }
//       $datefilters = '';
//       if($from_date != '' && $to_date != ''){
//         $datefilters="date_format(tp.trans_date, '%Y%-%m-%d') BETWEEN '".formatDate($from_date)."' AND '".formatDate($to_date)."'";
//       }

//       //mod data
//       $where_mod = array();
//       if(validateIsNumeric($module_id)){
//         $where_mod = array('id'=>$module_id);
//       }
//       $mod_data = DB::table('modules')->where($where_mod)->where('is_application',1)->get();

//       //sec data
//       $where_sec = array();
//       if(validateIsNumeric($section_id)){
//         $where_sec = array('id'=>$section_id);
//       }
      
//       $data = array();
//       $cummurative_total = 0;
//       $app_sub_total = 0;
//       $rej_sub_total = 0;
//       $queried_sub_total = 0;
//       $rec_sub_total = 0;
//       $cummurative_total = 0;
//       $app_total = 0;
//       $rej_total = 0;
//       $queried_total = 0;
//       $rec_total = 0;
//       $i = 1;
//   //looping
//         PDF::MultiCell(10, 10, "No", 1,'','',0);
//         PDF::MultiCell($w_1, 10, "Section", 1,'','',0);
//         PDF::MultiCell($w, 10, "Received", 1,'','',0);
//         PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//         PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//         PDF::MultiCell(0, 10, "Queried", 1,'','',1);
//         foreach ($mod_data as $mod) {
//             PDF::SetFont('','B',9);
//             PDF::cell(0,7,$mod->name,1,1,'B');
//             $sub_data = DB::table('sub_modules')->where($where_submodule)->where('module_id',$mod->id)->get();
//             $section_data = $this->getSectionDataByModule($where_sec, $mod->id);
//           foreach ($section_data as $sec) {
//             PDF::cell(0,7,$sec->name,1,1,'B');
//             foreach ($sub_data as $sub) {
//                 $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id;
//                 $subFilters=$where_zone;
//                 $table = $this->getTableName($mod->id);
//                 $table2 = '';
//                 $field = '';
//                 $has_payment_processing = 1;
//                 if($sub->id == 30){
//                   $has_payment_processing = 0;
//                 }
//               $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);
//               $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//               $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
                     
// //print
//               $rowcount = PDF::getNumLines($sub->name,40);
//               PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//               PDF::MultiCell($w_1, $rowcount *5, $sub->name,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//               PDF::MultiCell(0, $rowcount *5, $queried,1,'','',1);

//               $app_sub_total = $app_sub_total+$approved_applications['approved'];
//               $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//               $queried_sub_total = $queried_sub_total+$queried;
//               $rec_sub_total = $rec_sub_total+$total_received;
//              $i++;    
//                 }
//               PDF::SetFont('','B',9);

//               $app_total = $app_sub_total+$app_total;
//               $rej_total = $rej_sub_total+$rej_total;
//               $queried_total = $queried_sub_total+$queried_total;
//               $rec_total = $rec_sub_total+$rec_total;

//               $app_sub_total = 0;
//               $rej_sub_total = 0;
//               $queried_sub_total = 0;
//               $rec_sub_total = 0;
//             }
//         }
//       PDF::SetFont('','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w_1+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//       PDF::MultiCell($w, 10, $app_total,1,'','',0);
//       PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//       PDF::MultiCell(0, 10, $queried_total,1,'','',1);
//       PDF::Output('Section Based Summary Report.pdf','I');
//   }
//    public function printDisposalSummaryReport(Request $req){
//     $title = 'Disposal Summary Report';
//         $w = 35; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//         //filters
//       $sub_module_id=$req->sub_module_id;
//       $section_id=$req->section_id;
//       $directorate_id=$req->directorate_id;
//       $module_id=$req->module_id;
//       $received_opt=$req->module_id;
//       $evaluation_opt=$req->evaluation_opt;
//       $zone_id=$req->zone_id;
//       $from_date=$req->from_date;
//       $to_date=$req->to_date;
//       $module_id = 15;
//       $datefilters=$this->addedDateFilters($req);
//       //sub-module data
//       $where_sub=array();
//       if(validateIsNumeric($sub_module_id)){
//           $where_sub=array('id'=>$sub_module_id);
//       }
//       $sub_data=DB::table('sub_modules')->where($where_sub)->where('module_id',$module_id)->get();
//       //zone
//       $where_zone=array();
//       if(validateIsNumeric($zone_id)){
//           $where_zone=array('id'=>$zone_id);
//       }
//       $zone_data=DB::table('par_zones')->where($where_zone)->get();
//       //sec
//       $where_sec=array();
//       if(validateIsNumeric($section_id)){
//           $where_sec=array('id'=>$section_id);
//       }

//       //directorate data
//       $where_directorate=array();
//       if(validateIsNumeric($directorate_id)){
//           $where_directorate=array('id'=>$directorate_id);
//       }
//       $directorate_data=DB::table('par_directorates')->where($where_directorate)->whereIn('id', [2,4])->get();
      

//       $received_date_opt='date_added';
//       $data = array();
//       $table=$this->getTableName($module_id);
//       $table2='';
//       $field= '';
//       $cummurative_total = 0;
//       $app_sub_total = 0;
//       $rej_sub_total = 0;
//       $queried_sub_total = 0;
//       $rec_sub_total = 0;
//       $cummurative_total = 0;
//       $app_total = 0;
//       $rej_total = 0;
//       $queried_total = 0;
//       $rec_total = 0;
//       $i = 1;
//         $i = 1;
//   //looping
//         PDF::MultiCell(10, 10, "No", 1,'','',0);
//         PDF::MultiCell($w_1, 10, "Section", 1,'','',0);
//         PDF::MultiCell($w, 10, "Received", 1,'','',0);
//         PDF::MultiCell($w, 10, "Approved", 1,'','',0);
//         PDF::MultiCell($w, 10, "Rejected", 1,'','',0);
//         PDF::MultiCell(0, 10, "Queried", 1,'','',1);
//         foreach ($sub_data as $sub) {
//             PDF::SetFont('','B',9);
//             PDF::cell(0,7,$sub->name,1,1,'B');
//           foreach ($directorate_data as $dir_data) {
//             PDF::cell(0,7,$dir_data->name,1,1,'B');
//             $sec_data=DB::table('par_sections')->whereIn('id',[2,4])->where($where_sec)->where('directorate_id',$dir_data->id)->get();
//             foreach ($zone_data as $zone) {
//               PDF::cell(0,7,$zone->name,1,1,'B');
//               PDF::SetFont('','',9);
//               foreach ($sec_data as $sec) {
//                    $filters="t1.sub_module_id = ".$sub->id." AND t1.section_id = ".$sec->id." AND t1.zone_id = ".$zone->id;
//                 $subFilters=array();
               
//               $approved_applications = $this->funcGetApprovedRegistrationReportApplications($table,$table2,$field,$filters,$subFilters,$from_date,$to_date);

//               $total_received = $this->funcGetReceivedRegistrationReportApplications($table,$table2,$field, $subFilters,$filters,$datefilters,$sub->has_payment_processing);
//               $queried = $this->funcGetQueriedRegistrationReportApplications($table,$table2,$field, $subFilters, $filters,$datefilters);
                     
// //print
//               $rowcount = PDF::getNumLines($sec->name, 25);
//               PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//               PDF::MultiCell($w_1, $rowcount *5, $sec->name,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $total_received,1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['approved'],1,'','',0);
//               PDF::MultiCell($w, $rowcount *5, $approved_applications['rejected'],1,'','',0);
//               PDF::MultiCell(0, $rowcount *5, $queried,1,'','',1);

//               $app_sub_total = $app_sub_total+$approved_applications['approved'];
//               $rej_sub_total = $rej_sub_total+$approved_applications['rejected'];
//               $queried_sub_total = $queried_sub_total+$queried;
//               $rec_sub_total = $rec_sub_total+$total_received;
//              $i++;    
//                 }
//               PDF::SetFont('','B',9);

//               $app_total = $app_sub_total+$app_total;
//               $rej_total = $rej_sub_total+$rej_total;
//               $queried_total = $queried_sub_total+$queried_total;
//               $rec_total = $rec_sub_total+$rec_total;

//               $app_sub_total = 0;
//               $rej_sub_total = 0;
//               $queried_sub_total = 0;
//               $rec_sub_total = 0;
//             }
//           }
//         }
//       PDF::SetFont('','B',9);
//      // PDF::MultiCell(10, 10, "",0,'','',0);
//       PDF::MultiCell($w_1+10, 10, "Total",1,'','',0);
//       PDF::MultiCell($w, 10, $rec_total,1,'','',0);
//       PDF::MultiCell($w, 10, $app_total,1,'','',0);
//       PDF::MultiCell($w, 10, $rej_total,1,'','',0);
//       PDF::MultiCell(0, 10, $queried_total,1,'','',1);
//       PDF::Output('Disposal Summary Report.pdf','I');
//   }
//   public function exportModuleRegReportData(Request $req){
//     $module_id = $req->module_id;
//     $sub_module_id = $req->sub_module_id;
//     $zone_id = $req->zone_id;
//     $section_id = $req->section_id;
//     $to_date = $req->to_date;
//     $from_date = $req->from_date;
//     $process_class = $req->process_class;
    
    
//     switch ($module_id) {
//       case 1:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportProductDefinedColumns',
//             'filename' => 'Product_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       case 2:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportPremiseDefinedColumns',
//             'filename' => 'Premise_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       case 3:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportGmpDefinedColumns',
//             'filename' => 'Gmp_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       case 4:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportImportExportDefinedColumns',
//             'filename' => 'ImportExport_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       case 14:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportPromAdvertDefinedColumns',
//             'filename' => 'PromotionAdvertisement_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       case 7:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportClinicalTrialDefinedColumns',
//             'filename' => 'ClinicalTrial_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       case 15:
//           $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportDisposalDefinedColumns',
//             'filename' => 'Disposal_Applications_Report'
//           ]);
//           return $this->exportdata($request);
//         break;
//       default:
//         return "Module Not set";
//         break;
//     }
//   }
//   public function getSectionDataByModule($where_sec, $module_id){
//     if($module_id == 7){
//       $res = DB::table('par_sections')->where($where_sec)->whereIn('id', [5])->get();
//     }else{
//       $res = DB::table('par_sections')->where($where_sec)->whereIn('id', [2,4])->get();
//     }
//     return $res;
//   }
//   public function getRequestCreditNoteSummaryReport(Request $req, $inCall = 0){
//     try{
//         $requested_by = $req->requested_by;
//         $requested_from = $req->requested_from;
//         $requested_to = $req->requested_to;
//         $approved_by = $req->approved_by;
//         $approved_from = $req->approved_from;
//         $approved_to = $req->approved_to;
//         $filters = $req->filter;
//         $where_raw = array();

        
//         if(validateIsNumeric($requested_by)){
//           $where_raw[] = "t1.requested_by_id = ".$requested_by;
//         }
//         if(validateIsNumeric($approved_by)){
//           $where_raw[] = "t1.approved_by_id = ".$approved_by;
//         }
//         if(isset($requested_from) && formatDate($requested_from) != '' ){
//           $where_raw[] = "date_format(t1.requested_on, '%Y-%m-%d') >= '".formatDate($requested_from)."'";
//         }
//         if(isset($requested_to) && formatDate($requested_to) != '' ){
//           $where_raw[] = "date_format(t1.requested_on, '%Y-%m-%d') <= '".formatDate($requested_to)."'";
//         }
//         if(isset($approved_from) && formatDate($approved_from) != '' ){
//           $where_raw[] = "date_format(t1.approved_on, '%Y-%m-%d') >= '".formatDate($approved_from)."'";
//         }
//         if(isset($approved_to) && formatDate($approved_to) != '' ){
//           $where_raw[] = "date_format(t1.approved_on, '%Y-%m-%d') <= '".formatDate($approved_to)."'";
//         }
//         $filter = $req->input('filter');
//         $filter_string = '';

//         if (isset($filter)) {
//             $filters = json_decode($filter);
//             if ($filters != NULL) {
//                 foreach ($filters as $filter) {
//                     switch ($filter->property) {
//                         case 'invoice_no' :
//                             $where_raw[] = "t3.invoice_no like '%".($filter->value)."%'";
//                             break;
//                         case 'credit_note_no' :
//                             $where_raw[] = "t2.receipt_no like '%".($filter->value)."%'";
//                             break;
//                         case 'credit_note_amount' :
//                             $where_raw[] = "t1.credit_note_amount like '%".($filter->value)."%'";
//                             break;
//                         case 'trans_date' :
//                             $where_raw[] = "date_format(t3.trans_date, '%Y-%m-%d') = '".formatDate($filter->value)."'";
//                             break;
//                         case 'reference_no' :
//                             $where_raw[] = "t3.reference_no like '%".($filter->value)."%'";
//                             break;
//                         case 'tracking_no' :
//                             $where_raw[] = "t3.tracking_no like '%".($filter->value)."%'";
//                             break;
//                     }
//                 }
//             }
//         }
       
//         $whereClauses = array_filter($where_raw);
//         if (!empty($whereClauses)) {
//               $filter_string = implode(' AND ', $whereClauses);
//           }            
//         $qry = DB::table('tra_paymentcreditnote_requests as t1')
//               ->leftjoin('tra_payments as t2','t1.receipt_id', 't2.id')
//               ->leftjoin('tra_application_invoices as t3','t1.invoice_id', 't3.id')
//               ->leftjoin('users as t4','t1.requested_by_id', 't4.id')
//               ->leftjoin('users as t5','t1.approved_by_id', 't5.id')
//               ->leftjoin('wb_trader_account as t6','t3.applicant_id', 't6.id')
//               ->leftjoin('par_currencies as t7','t1.currency_id', 't7.id')
//               ->select('t3.reference_no','t3.tracking_no','t3.invoice_no', 't2.receipt_no as credit_note_no','t1.credit_note_amount', 't1.exchange_rate','t7.name as currency', 't3.date_of_invoicing as trans_date','t6.name as applicant_name', DB::raw("(t1.credit_note_amount * t1.exchange_rate) as amount_in_tsh, CONCAT_WS(' ', decrypt(t4.first_name), decrypt(t4.last_name)) as requested_by, CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as approved_by, date_format(t1.requested_on, '%Y-%m-%d') as requested_on ,date_format(t1.approved_on, '%Y-%m-%d') as approved_on"), 't1.reason_for_request as reason');
//         if ($filter_string != '') {
//              $qry->whereRAW($filter_string);
//          } 

//       $results = $qry->get();
//       $res = array(
//                 'success'=>true,
//                 'results' => $results,
//                 'message' => 'All is well'
//                 );
//     }catch (\Exception $exception) {
//         $res = array(
//             'success' => false,
//             'message' => $exception->getMessage()
//         );
//     } catch (\Throwable $throwable) {
//         $res = array(
//             'success' => false,
//             'message' => $throwable->getMessage()
//         );
//     }
//     if($inCall == 1){
//       return array('heading' => 'Credit Note Report', 'results' => $results);
//     }
//     return response()->json($res);
// }
// public function getApprovedCreditNoteSummaryReport(Request $req, $inCall = 0){
//     try{
//         $requested_by = $req->requested_by;
//         $requested_from = $req->requested_from;
//         $requested_to = $req->requested_to;
//         $approved_by = $req->approved_by;
//         $approved_from = $req->approved_from;
//         $approved_to = $req->approved_to;
//         $filters = $req->filter;
//         $where_raw = array();

        
//         if(validateIsNumeric($requested_by)){
//           $where_raw[] = "t1.requested_by_id = ".$requested_by;
//         }
//         if(validateIsNumeric($approved_by)){
//           $where_raw[] = "t1.approved_by_id = ".$approved_by;
//         }
//         if(isset($requested_from) && formatDate($requested_from) != '' ){
//           $where_raw[] = "date_format(t1.requested_on, '%Y-%m-%d') >= '".formatDate($requested_from)."'";
//         }
//         if(isset($requested_to) && formatDate($requested_to) != '' ){
//           $where_raw[] = "date_format(t1.requested_on, '%Y-%m-%d') <= '".formatDate($requested_to)."'";
//         }
//         if(isset($approved_from) && formatDate($approved_from) != '' ){
//           $where_raw[] = "date_format(t1.approved_on, '%Y-%m-%d') >= '".formatDate($approved_from)."'";
//         }
//         if(isset($approved_to) && formatDate($approved_to) != '' ){
//           $where_raw[] = "date_format(t1.approved_on, '%Y-%m-%d') <= '".formatDate($approved_to)."'";
//         }
//         $filter = $req->input('filter');
//         $filter_string = '';

//         if (isset($filter)) {
//             $filters = json_decode($filter);
//             if ($filters != NULL) {
//                 foreach ($filters as $filter) {
//                     switch ($filter->property) {
//                         case 'invoice_no' :
//                             $where_raw[] = "t3.invoice_no like '%".($filter->value)."%'";
//                             break;
//                         case 'credit_note_no' :
//                             $where_raw[] = "t2.receipt_no like '%".($filter->value)."%'";
//                             break;
//                         case 'credit_note_amount' :
//                             $where_raw[] = "t3.invoice_amount like '%".($filter->value)."%'";
//                             break;
//                         case 'trans_date' :
//                             $where_raw[] = "date_format(t3.date_of_invoicing, '%Y-%m-%d') = '".formatDate($filter->value)."'";
//                             break;
//                         case 'reference_no' :
//                             $where_raw[] = "t3.reference_no like '%".($filter->value)."%'";
//                             break;
//                         case 'tracking_no' :
//                             $where_raw[] = "t3.tracking_no like '%".($filter->value)."%'";
//                             break;
                            
//                     }
//                 }
//             }
//         }
       
//         $whereClauses = array_filter($where_raw);
//         if (!empty($whereClauses)) {
//               $filter_string = implode(' AND ', $whereClauses);
//           }            
//         $qry = DB::table('tra_paymentcreditnote_requests as t1')
//               ->join('tra_payments as t2','t1.receipt_id', 't2.id')
//               ->join('tra_application_invoices as t3','t1.invoice_id', 't3.id')
//               ->leftjoin('users as t4','t1.requested_by_id', 't4.id')
//               ->leftjoin('users as t5','t1.approved_by_id', 't5.id')
//               ->leftjoin('wb_trader_account as t6','t3.applicant_id', 't6.id')
//               ->leftjoin('par_currencies as t7','t3.paying_currency_id', 't7.id')
//               ->select('t3.reference_no','t3.tracking_no', 't3.invoice_no', 't2.receipt_no as credit_note_no','t3.invoice_amount as credit_note_amount', 't3.paying_exchange_rate as exchange_rate', 't7.name as currency', 't3.date_of_invoicing as trans_date','t6.name as applicant_name', DB::raw("(t3.invoice_amount * t3.paying_exchange_rate) as amount_in_tsh, CONCAT_WS(' ', decrypt(t4.first_name), decrypt(t4.last_name)) as requested_by, CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as approved_by, date_format(t1.requested_on, '%Y-%m-%d') as requested_on ,date_format(t1.approved_on, '%Y-%m-%d') as approved_on"), 't1.reason_for_request as reason');
//         if ($filter_string != '') {
//              $qry->whereRAW($filter_string);
//          } 

//       $results = $qry->get();
//       $res = array(
//                 'success'=>true,
//                 'results' => $results,
//                 'message' => 'All is well'
//                 );
//     }catch (\Exception $exception) {
//         $res = array(
//             'success' => false,
//             'message' => $exception->getMessage()
//         );
//     } catch (\Throwable $throwable) {
//         $res = array(
//             'success' => false,
//             'message' => $throwable->getMessage()
//         );
//     }
//     if($inCall == 1){
//       return array('heading' => 'Credit Note Report', 'results' => $results);
//     }
//     return response()->json($res);
// }
// function exportCreditNoteReport($req){
//   $filters = json_encode(array('t1.sub_module_id'=>$sub_module_id, 't1.section_id'=>$section_id, 'zone_id'=>$zone_id, 'to_date'=>$to_date, 'from_date'=>$from_date));
          
//           $request = new Request([
//             'process_class'   => $process_class,
//             'module_id'   => $module_id,
//             'filters'   => $filters,
//             'function' => 'exportPremiseDefinedColumns',
//             'filename' => 'Premise_Applications_Report'
//           ]);
//           return $this->exportdata($request);
// }
// public function getPMSZonalReport(Request $req){
//   $zone_id = $req->zone_id;
//   $region_id = $req->region_id;
//   $classification_id = $req->classification_id;
//   $from_date = $req->from_date;
//   $to_date = $req->to_date;

//   $qry = DB::table('tra_surveillance_applications as t1')
//           ->join('tra_surveillance_sample_details as t2', 't1.id', 't2.application_id')
//           ->join('par_zones as t3', 't1.zone_id', 't3.id')
//           ->join('par_regions as t4', 't1.region_id', 't4.id')
//           ->join('pms_program_plans as t7', 't2.pms_plan_id', 't7.id')
//           ->join('par_common_names as t8', 't7.product_id', 't8.id')
//         ->select(DB::raw('t2.created_on, t3.name AS zone_name, t4.name AS region_name, t8.name AS product_name, t2.classification_id as classification, COUNT(t1.id) as total'))
//         ->groupBy('t1.zone_id', 't1.region_id', 't2.classification_id', 't7.product_id');
//   if(validateIsNumeric($zone_id)){
//     $qry->where('t1.zone_id', $zone_id);
//   }
//   if(validateIsNumeric($region_id)){
//     $qry->where('t1.region_id', $region_id);
//   }
//   $where_class = array();
//   if(validateIsNumeric($classification_id)){
//     $where_class = array('id'=> $classification_id);
//   }
//   if($from_date != '' && $to_date != ''){
//      $qry->whereRaw("date_format(t2.created_on, '%Y-%m-%d') between '".formatDate($from_date)."' and '".formatDate($to_date)."'");
//   }
//   $filter = $req->input('filter');
//   if (isset($filter)) {
//       $filters = json_decode($filter);
//       if ($filters != NULL) {
//           foreach ($filters as $filter) {
//               switch ($filter->property) {
//                   case 'product_name' :
//                       $qry->whereRAW("t8.name like '%".($filter->value)."%'");
//                       break;
//                     }
//                   }
//                 }
//               }
//   $results = $qry->get();

//   foreach ($results as $result) {
//     $result->classification = getSingleRecordColValue('classification', array('id' => $result->classification), 'name', 'lims_db');
//   }

//   $res = array(
//                 'success'=>true,
//                 'results' => $results,
//                 'message' => 'All is well'
//                 );
//   return $res;
// }
// public function printPMSZonalReport(Request $req){
//     $title = 'PMS Zonal Summary Report';
//         $w = 150; 
//         $w_1 = 40;
//         $w_2 = 25;
//         $h = 25;
//         PDF::SetTitle( $title );
//         PDF::AddPage();
       
//         $this->generateReportsHeader( $title);
         
//         PDF::Ln();
//         //filters
//       $zone_id = $req->zone_id;
//       $region_id = $req->region_id;
//       $classification_id = $req->classification_id;
//       $from_date = $req->from_date;
//       $to_date = $req->to_date;
//       $filter = $req->filter;
//       //zone
//       $where_zone=array();
//       if(validateIsNumeric($zone_id)){
//           $where_zone=array('id'=>$zone_id);
//       }
//       $zone_data=DB::table('par_zones')->where($where_zone)->get();
//       //sec
//       $where_reg=array();
//       if(validateIsNumeric($region_id)){
//           $where_reg=array('id'=>$region_id);
//       }
//       $reg_data=DB::table('par_regions')->where($where_reg)->get();
//       //clas
//       $where_class=array();
//       if(validateIsNumeric($classification_id)){
//           $where_class=array('id'=>$classification_id);
//       }
//       $class_data=DB::Connection('lims_db')->table('classification')->where($where_class)->get();

//         $i = 1;
//   //looping
//         PDF::MultiCell(10, 10, "No", 1,'','',0);
//         PDF::MultiCell($w, 10, "Product", 1,'','',0);
//         PDF::MultiCell(0, 10, "Total", 1,'','',1);
//           foreach ($zone_data as $zone) {
//             PDF::SetFont('','B',9);
//             PDF::cell(0,7,$zone->name,1,1,'B');
//             foreach ($reg_data as $region) {
//               PDF::cell(0,7,$region->name,1,1,'B');
//               PDF::SetFont('','',9);
//               foreach ($class_data as $class) {
//                    $results = DB::table('tra_surveillance_applications as t1')
//                           ->join('tra_surveillance_sample_details as t2', 't1.id', 't2.application_id')
//                           ->join('par_zones as t3', 't1.zone_id', 't3.id')
//                           ->join('par_regions as t4', 't1.region_id', 't4.id')
//                           ->join('pms_program_plans as t7', 't2.pms_plan_id', 't7.id')
//                           ->join('par_common_names as t8', 't7.product_id', 't8.id')
//                         ->select(DB::raw('t2.created_on, t3.name AS zone_name, t4.name AS region_name, t8.name AS product_name, t2.classification_id as classification, COUNT(t1.id) as total'))
//                         ->where(array('t1.zone_id'=>$zone->id, 't1.region_id'=>$region->id, 't2.classification_id'=>$class->id))
//                         ->groupBy('t1.zone_id', 't1.region_id', 't2.classification_id', 't7.product_id');

//                   if (isset($filter)) {
//                       $filters = json_decode($filter);
//                       if ($filters != NULL) {
//                           foreach ($filters as $filter) {
//                               switch ($filter->property) {
//                                   case 'product_name' :
//                                       $results->whereRAW("t8.name like '%".($filter->value)."%'");
//                                       break;
//                                     }
//                                   }
//                                 }
//                               }
//                   $results = $results->get();
//                 PDF::cell(0,7,$class->name,1,1,'B');
//             foreach ($results as $result) {
//                 $rowcount = PDF::getNumLines($result->product_name, 25);
//                 PDF::MultiCell(10, $rowcount *5, $i,1,'','',0);
//                 PDF::MultiCell($w, $rowcount *5, $result->product_name,1,'','',0);
//                 PDF::MultiCell(0, $rowcount *5, $result->total,1,'','',1);
//                 $i++;
//               }

//             PDF::SetFont('','B',9);
//             }
//           }
//         }
//       PDF::Output('Disposal Summary Report.pdf','I');
//   }
  public function generateSpreadsheeetviewData(Request $req, $in_call = 0) {
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
    //dd($module_id);
    if($module_id == 1){
        $res = $this->loadProductDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 2){
        $res = $this->loadFacilityLicensingDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if($module_id == 3){
        $qry= DB::table('tra_gmp_applications as t1')
               ->LeftJoin('par_gmp_assessment_types as t2','t1.assessment_type_id','t2.id')
               ->LeftJoin('tra_manufacturing_sites as t3','t1.manufacturing_site_id','t3.id')
               ->LeftJoin('tra_manufacturers_information as t4','t3.manufacturer_id','t4.id')
               ->LeftJoin('par_countries as t5','t3.country_id','t5.id')
               ->LeftJoin('par_regions as t6','t3.region_id','t6.id')
               ->LeftJoin('par_districts as t7','t3.district_id','t7.id')

               ->select('t1.reference_no','t1.application_code','t1.tracking_no','t2.name as assessment_procedure','t3.name as manufacturing_site','t3.gps_coordinate','t3.premise_reg_no','t4.name as manufacturer_name','t4.postal_address','t4.physical_address','t4.email_address','t4.mobile_no','t4.telephone_no','t5.name as country','t6.name as region','t7.name as district');

        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();
        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return \response()->json($res);
    }else if ($module_id == 4){
        $res = $this->loadImportExportDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 5){
        $res = $this->loadSurveillanceDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 7){
        $res = $this->loadClinicalTrialDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 8){
        $res = $this->loadEnforcementDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 12){
        $res = $this->loadImportExportDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 14){
        $res = $this->loadPromotionAdvertismentDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 16){
        $res = $this->loadRevenueDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 21){
        $res = $this->loadPVDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 22){
        $res = $this->loadMIRDataLibrabry($req, $in_call);
        return \response()->json($res);
    }else if ($module_id == 23){
        $res = $this->loadPmsProgramDataLibrabry($req, $in_call);
        return \response()->json($res);
     }    
  }
  public function loadFacilityLicensingDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
   
    //getting data qry
    $qry = DB::table('tra_premises_applications as t1')
                ->join('tra_premises as t2', function ($join) {
                    $join->on('t1.premise_id', '=', 't2.id')
                        ->groupBy('t1.application_code');
                })
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->LeftJoin('par_countries as t4','t3.country_id', '=', 't4.id')
        ->LeftJoin('par_regions as t5','t3.region_id', '=', 't5.id')
        ->LeftJoin('par_districts as t6','t3.district_id', '=','t6.id')
        ->LeftJoin('par_premises_types as t7','t1.premise_type_id', '=','t7.id')
        ->leftJoin('tra_approval_recommendations as t8', 't1.application_code', '=', 't8.id')
        ->leftJoin('tra_personnel_information as t9', 't3.id', '=', 't9.trader_id')
        ->leftJoin('tra_premises_personnel as t10', 't2.id', '=', 't10.premise_id')
        ->leftJoin('par_personnel_positions as t11', 't10.position_id', '=', 't11.id')
        ->leftJoin('par_personnel_qualifications as t12', 't10.qualification_id', '=', 't12.id')
        ->leftJoin('tra_personnel_information as t13', 't10.personnel_id', '=', 't13.id')
        ->leftJoin('tra_premises_proprietors as t14', 't1.premise_id', '=', 't14.id')
        ->select(DB::raw("t1.date_added as Application_Date,t1.application_code,t1.premise_id,t1.reference_no,t1.tracking_no,t1.submission_date,t1.submission_date as Received_From,t1.submission_date as Received_To,t1.section_id,
        t2.name as Premise_Name,t2.telephone,t2.fax,t2.email,t2.website,t2.physical_address,t2.postal_address,
        t3.name as Applicant,t3.postal_address as Applicant_Postal_Address,t3.physical_address as Applicant_Physical_Address,t3.email as Applicant_Email,t3.telephone_no as Applicant_Tell,t3.mobile_no as Applicant_Mobile,
        t7.name as Premise_Type,t9.name as Contact_Person,t9.postal_address as Contact_Postal_Address,t9.telephone_no as Contact_Telephone_No,t9.email_address as Contact_Email,
        t10.registration_no as Registration_No,t13.name as Personnnel_Name,t13.postal_address as Personnel_Postal_Address,t13.telephone_no as Personnel_telephone, t13.email_address as Personnel_Email"));
    $results = $qry->first();

        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];

   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Registration Date':
          $qry->whereBetween(DB::raw("t8.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Expiry Date':
          $qry->whereBetween(DB::raw("t8.expiry_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'premise_name' :
                          $whereClauses[] = "t2.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'telephone' :
                          $whereClauses[] = "t2.telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'email' :
                          $whereClauses[] = "t2.email like '%" . ($filter->value) . "%'";
                          break;
                      case 'physical_address' :
                          $whereClauses[] = "t2.physical_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'postal_address' :
                          $whereClauses[] = "t2.postal_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'instructions_of_use' :
                          $whereClauses[] = "t2.instructions_of_use like '%" . ($filter->value) . "%'";
                          break;
                      case 'PhysicalDescription' :
                          $whereClauses[] = "t2.physical_description like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.postal_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPhysicalAddress' :
                          $whereClauses[] = "t3.physical_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.email_address like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantTell' :
                          $whereClauses[] = "t3.telephone_no like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantMobile' :
                          $whereClauses[] = "t3.mobile_no like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t4.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t5.name like '%" . ($filter->value) . "%'";
                          break; 
                      case 'PremiseType' :
                          $whereClauses[] = "t7.name like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ContactPerson' :
                          $whereClauses[] = "t9.name like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ContactPostalAddress' :
                          $whereClauses[] = "t9.postal_address like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ContactTelephoneNo' :
                          $whereClauses[] = "t9.telephone_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'ContactEmail' :
                          $whereClauses[] = "t9.email_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'PersonnnelName' :
                          $whereClauses[] = "t13.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'PersonnelPostalAddress' :
                          $whereClauses[] = "t13.postal_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'PersonnelTelephone' :
                          $whereClauses[] = "t13.telephone_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'PersonnelEmail' :
                          $whereClauses[] = "t13.email_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'premise_id' :
                          $whereClauses[] = "t1.premise_id::text ILIKE '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Facility Report", "filename"=>"facilityReport");
        }
        return $res;
    }else{
       //capture schema
    
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //premise personnel
        $ing_columns = ['name','postal_address','telephone_no','email_address'];
        $additional_data[]=array('title'=>'Premise Personnel','column'=>array_reverse($ing_columns), 'url'=>'premiseregistration/getPremisePersonnelDetails', 'filter_column'=>'premise_id');
        //premise proprietors
        $pack_columns = ['name', 'telephone_no','email_address','physical_address','nationality', 'identification_no','identification_type'];
        $additional_data[]=array('title'=>'Premise Proprietors','column'=>array_reverse($pack_columns), 'url'=>'premiseregistration/getPremiseProprietorsDetails', 'filter_column'=>'premise_id');
        //manufacturer
       
        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadImportExportDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
 //dd($form_filters);
        
    //getting data qry
    $qry = DB::table('tra_importexport_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->leftJoin('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->leftJoin('tra_managerpermits_review as t6', 't1.application_code','t6.application_code')
        ->leftJoin('tra_permitsenderreceiver_data as t7', 't1.consignee_id','t7.id')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t4.decision_id as approval_recommendation_id','t5.recommendation_id as prechecking_recommendation_id', 't6.decision_id as review_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website','t7.name as consignee_name'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Registration Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Expiry Date':
          $qry->whereBetween(DB::raw("t4.expiry_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                      case 'ConsigneeName' :
                           $whereClauses[] = "t7.name like '%" . ($filter->value) . "%'";
                           break;
                      case 'premise_id' :
                          $whereClauses[] = "t1.premise_id::text ILIKE '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Import Export Report", "filename"=>"ImportExportReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
        $ing_columns = ['permitbrand_name','product_registration_no','permitcommon_name','section_name','product_classcategory','quantity','product_packaging','currency_name','unit_price','total_value'];
        $additional_data[]=array('title'=>' Permit Product Details','column'=>array_reverse($ing_columns), 'url'=>'importexportpermits/getImportexportpermitsproductsDetails', 'filter_column'=>'product_id');
        
        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadClinicalTrialDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
  
        
    //getting data qry
    $qry = DB::table('tra_clinical_trial_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->leftJoin('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->leftJoin('tra_managerpermits_review as t6', 't1.application_code','t6.application_code')
        ->leftJoin('clinical_trial_personnel as t7', 't1.sponsor_id','t7.id')
        ->leftJoin('tra_clinicalstudy_participants as t8', 't1.id','t8.application_id')
        ->leftJoin('tra_clinical_trial_monitors as t9', 't1.id','t9.application_id')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t4.decision_id as approval_recommendation_id','t5.recommendation_id as prechecking_recommendation_id', 't6.decision_id as review_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website','t7.name as consignee_name',
        't7.name as clinical_trial_personnel','t8.name as clinical_study_participant'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Registration Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Expiry Date':
          $qry->whereBetween(DB::raw("t4.expiry_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                      case 'ClinicalTrialPersonnel' :
                           $whereClauses[] = "t7.name like '%" . ($filter->value) . "%'";
                           break;
                      case 'ClinicalStudyParticipant' :
                            $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                            break;
                      case 'premise_id' :
                          $whereClauses[] = "t1.premise_id::text ILIKE '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Clinical Trial", "filename"=>"ClinicalTrial");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        
        // Investigators
        $ing_columns = ['name','physical_address','postal_address','study_site','contact_person','tpin_no','tin_no','contact_person','category','country_name','email','fax',''];
        $additional_data[]=array('title'=>' Clinical Trial Other Investigators','column'=>array_reverse($ing_columns), 'url'=>'clinicaltrial/getClinicalTrialOtherInvestigators', 'filter_column'=>'application_id');
        // Monitors
        $ing_columns = ['name','contact_person','physical_address','physical_address','country_name','region_name','email','fax','mobile_no'];
        $additional_data[]=array('title'=>' Clinical Trial Monitors','column'=>array_reverse($ing_columns), 'url'=>'clinicaltrial/getClinicalTrialMonitors', 'filter_column'=>'application_id');
        // Study Sites
        $ing_columns = ['name','physical_address','region_name','application_reference_no','approving_instution','responsible_ethics_committee','approval_date','country_name'];
        $additional_data[]=array('title'=>'Clinical Study Sites','column'=>array_reverse($ing_columns), 'url'=>'clinicaltrial/getClinicalStudySites', 'filter_column'=>'application_id');
        // Import Products
        $ing_columns = ['brand_name','common_name','category_name','classification_name','dosage_form','admin_route','identification_mark','product_desc','product_strength','product_strength_txt','registration_no'];
        $additional_data[]=array('title'=>' Import Product','column'=>array_reverse($ing_columns), 'url'=>'clinicaltrial/getImpProducts', 'filter_column'=>'application_id');
        // Import Products Ingredients
        $ing_columns = ['ingredient_id','specification_id','strength','si_unit_id','inclusion_reason_id'];
        $additional_data[]=array('title'=>' Import Product Ingredients','column'=>array_reverse($ing_columns), 'url'=>'clinicaltrial/getImpProductIngredients', 'filter_column'=>'product_id');
        // Regulatory Status
        $ing_columns = ['country','approving_authority','current_registrationstatus','date_of_registration','registration_ref'];
        $additional_data[]=array('title'=>' Clinical Trial Regulatory Status','column'=>array_reverse($ing_columns), 'url'=>'clinicaltrial/getClinicalTrialRegulatoryStatus', 'filter_column'=>'application_id');

        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadPromotionAdvertismentDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
  
        
    //getting data qry
    $qry = DB::table('tra_promotion_adverts_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->leftJoin('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->leftJoin('tra_managerpermits_review as t6', 't1.application_code','t6.application_code')
        ->leftJoin('tra_promotionaladvert_personnel as t7', 't1.sponsor_id','t7.id')
        ->leftJoin('par_advertisement_types as t8', 't1.advertisement_type_id','t8.id')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t4.decision_id as approval_recommendation_id','t5.recommendation_id as prechecking_recommendation_id', 't6.decision_id as review_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website','t7.name as consignee_name',
        't8.name as advertisement_type','t7.name as promotion_personnel'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Registration Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Expiry Date':
          $qry->whereBetween(DB::raw("t4.expiry_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                      case 'AdvertType' :
                           $whereClauses[] = "t7.name like '%" . ($filter->value) . "%'";
                           break;
                      case 'PromomtionPersonnel' :
                          $whereClauses[] = "t8.name LIKE '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Import Export Report", "filename"=>"ImportExportReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //Product Particulars
        $ing_columns = ['product_registered','registration_no','brand_name','common_name','manufacturing_site','manufacturing_physical_address','other_details','type_of_advertisement_name'];
        $additional_data[]=array('title'=>' Product Particulars','column'=>array_reverse($ing_columns), 'url'=>'promotionmaterials/getPromotionMaterialsProductParticular', 'filter_column'=>'application_id');
        //Promotion Materials
        $ing_columns = ['promotion_material_name','remarks','material_id'];
        $additional_data[]=array('title'=>' Promotion Materials','column'=>array_reverse($ing_columns), 'url'=>'promotionmaterials/getPromotionMaterialsDetails', 'filter_column'=>'application_id');
       
        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadMIRDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
  
        
    //getting data qry
    $qry = DB::table('tra_mir_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->leftJoin('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->leftJoin('tra_managerpermits_review as t6', 't1.application_code','t6.application_code')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t4.decision_id as approval_recommendation_id','t5.recommendation_id as prechecking_recommendation_id', 't6.decision_id as review_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website','t7.name as consignee_name'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Registration Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Expiry Date':
          $qry->whereBetween(DB::raw("t4.expiry_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                      
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Import Export Report", "filename"=>"ImportExportReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //Medical History
        $ing_columns = ['start_date','end_date','is_under_medication','dosage','condition'];
        $additional_data[]=array('title'=>' Medical History','column'=>array_reverse($ing_columns), 'url'=>'mir/onLoadMirMedicalHistory', 'filter_column'=>'application_code');
        
        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
   public function previewCorrespondence(){
      return redirect()->away('http://10.0.0.12:889/home/invoice?invoice_no=10120220007');
      //return "http://192.168.225.100:8009/home/letter";
  }
  
  public function getCorrespodenceUrl(Request $req)
  {
    $application_code = $req->application_code;
    $module_id = $req->module_id;
    $correspondence_name = $req->correspondence_name;
    $user_id = $this->user_id;
    $params = $req->params;
    $params =(array)json_decode($params);
    $is_altered = $req->is_altered;
    $sub_module_id = 0;
    $section_id = 0;
    $payload = (array)json_decode($req->payload);
    if(isset($params['sub_module_id'])){
        $sub_module_id = $params["sub_module_id"];
        $decision_id = 0;
        if(isset($params["decision_id"])){
            $decision_id = $params["decision_id"];
        }
        if(!validateIsNumeric($decision_id)){
        $decision_id = $this->checkApprovalDecision($application_code,$sub_module_id);
    }
        if(isset($payload['decision_id']) && validateIsNumeric($payload['decision_id'])){
            $decision_id = $payload['decision_id'];
        }
    }
    if(isset($params['section_id'])){
        $section_id = $params["section_id"];
    }
    if($correspondence_name == ''){
        $correspondence_name='correspodence';
    }
    $server_url = 'https://brimsreport.bomra.co.bw:8009/home/';
    $report_application_table = 'par_brims_report_application';
    $url = "";
    $url_name = '';
    $report_id = 0;
    if(validateIsNumeric($application_code)){
        $has_query = DB::table('tra_application_query_reftracker')->whereRaw("(application_code = $application_code and status_id = 1 ) OR (application_code = $application_code and status_id = 3)")->exists();
    }
    if(isset($payload['query_id'])){
        $correspondence_name = 'queryletter';
        $params["query_id"] = $payload['query_id'];
    }
   //SALES QUOTE
    if($correspondence_name == 'salesQuote'){
        $invoice_no=$params['invoice_no'];
        $url_name = "salesQuote";
        if(isset($invoice_no)){
            $url = $server_url."quote?quote_no=".$invoice_no;

        }else{
            $res = array(
                'success'=>false,
                'message'=>'Please approve the quote first'
            );
        } 
    }
    //QUERY LETTER
    else if($correspondence_name == 'queryletter' || $has_query){
        if(!isset($params["query_id"])){
            $query_id = DB::table('tra_application_query_reftracker')->where(array('application_code'=>$application_code, 'status_id'=>5))->orderBy('id', 'DESC')->value('id');
            $params["query_id"] = $query_id;
        }
        if($module_id == 1){
            if($decision_id == 2){
                $url = url('/')."/reports/printProductRejectionLetter?application_code=".$application_code.'&module_id=1';
            }else{
            $url = url('/')."/reports/printRequestForAdditionalInformation?application_code=".$application_code."&query_id=".$params["query_id"]."&module_id=".$module_id;
            }
        }else if ($correspondence_name == 'InspectionReport'){
            $url = url('/')."/reports/printInspectionReport?application_code=".$application_code;
        }else{
            $url = $server_url."queryLetter?application_code=".$application_code;
        }
        //$check=Http::get($url);
        
    }
    //INVOICE
    else if($correspondence_name == 'invoice'){
        $url_name = "invoice";
        $invoice_no=$params['invoice_no'];
        if(isset($params['invoice_no'])){
            $url = $server_url."invoice?invoice_no=".$invoice_no;

        }else{
            $res = array(
                'success'=>false,
                'message'=>'Please confirm invoice generation or contact System Admin'
            );
        }
        
    }
    //RECEIPT
    else if($correspondence_name == 'receipt'){
        $receipt_no=$params['receipt_no'];
        $url_name = "receipt";
        if(isset($receipt_no)){
            $check = Http::get($server_url."receipt?receipt_no=".$receipt_no);
            $url = $server_url."receipt?receipt_no=".$receipt_no;

        }else{
            $res = array(
                'success'=>false,
                'message'=>'Receipt Not Available'
            );
        }
    
    }
    else if($correspondence_name == 'InspectionReport'){
        $url = url('/')."/reports/printInspectionReport?application_code=".$application_code;
    
    }
    //Schedule Approval
    else if($module_id == 11){
        $url = $server_url."ProductScreeningApproval?application_code=0";
        $url_name = "";
        // $res = array(
        //     'success'=>true,
        //     'message'=>'all is well',
        //     'url'=>  $server_url."ProductScreeningApproval?application_code=0"
        // );
    }
    //QUERY LETTER
    // else if($correspondence_name == 'queryletter'){
    //     $check=Http::get($server_url."queryLetter?application_code=".$application_code);
    //     $url = $server_url."queryLetter?application_code=".$application_code;
        
    // }
    
    //RMU/administrative correspodences
    else if($module_id == 24){
        $url = url('/')."/reports/printAdministrativeSubmissionResponses?application_code=".$application_code;
        $url_name = "";
        // $res = array(
        //     'success'=>true,
        //     'message'=>'all is well',
        //     'url'=>  $server_url."ProductScreeningApproval?application_code=0"
        // );
    }

    //CORRESPONDENCE 
    else if($correspondence_name == 'correspodence'){
        //Products
          if($module_id == 1){
            if($sub_module_id == 7){ //Product screening
                if($decision_id == 1){
                    $url_name = "screening_approval";
                    $url =  $server_url."ProductScreeningApproval?application_code=".$application_code;
                }else if ($decision_id == 2){
                    $url_name = "screening_rejection";
                    $url = url('/')."/reports/printProductRejectionLetter?application_code=".$application_code.'&module_id=1';
                    // $url = $server_url."ProductScreeningRejection?application_code=".$application_code;
                }else{
                    $url_name = "screening_approval";
                    $url = $server_url."ProductScreeningApproval?application_code=".$application_code;
                }
            }else if ($sub_module_id == 70){//Product Registration
                if($decision_id == 1){
                    $url_name = "product_letter"; 
                    $url = $server_url."ProductRegistrationLetter?application_code=".$application_code;
                }else if ($decision_id == 2){
                    $url_name = "product_reg_rejection";
                    $url = $server_url."ProductRegistrationRejection?application_code=".$application_code;
                }else{
                    $url_name = "product_letter";
                    $url = $server_url."ProductRegistrationLetter?application_code=".$application_code;
                }
            }else if ($sub_module_id == 8){//product renewals
                if($decision_id == 1){
                    $url_name = "product_renewal_approval"; 
                    $url = $server_url."ProductRenewalApproval?application_code=".$application_code;
    
                }else if ($decision_id == 2){
                    $url_name = "product_renewal_rejection"; 
                    $url = $server_url."ProductRenewalRejection?application_code=".$application_code;
    
                }else{
                    $url_name = "product_renewal_approval"; 
                    $url = $server_url."ProductRenewalApproval?application_code=".$application_code;
                }
            }else if ($sub_module_id == 17){//product Withdrawals
                if($decision_id == 1){
                    $url_name = "product_withdrawal_approval"; 
                    $url = $server_url."ProductWithdrawalApproval?application_code=".$application_code ;
            
                }else if ($decision_id == 2){
                    $url_name = "product_withdrawal_rejection"; 
                    $url = $server_url."ProductWithdrawalRejection?application_code=".$application_code;
                }else{
                    $url_name = "product_withdrawal_approval"; 
                    $url = $server_url."prodWithdrawal?application_code=".$application_code;
                }
            }else if ($sub_module_id == 9){//product Alteration/Variation
                if($decision_id == 1){
                    $url_name = "product_var_approval"; 
                    $url = $server_url."ProductVariationApproval?application_code=".$application_code;
            
                }else if ($decision_id == 2){
                    $url_name = "product_var_rejection"; 
                    $url = $server_url."ProductVariationRejection?application_code=".$application_code;
    
                }else{
                    $url_name = "product_var_approval"; 
                    $url = $server_url."ProductVariationApproval?application_code=".$application_code;
                }
            }else if ($sub_module_id == 75){//product Exemptions
                if($decision_id == 1){
                    $url_name = "product_exemp_approval"; 
                    $url = $server_url."ProductExemptionApproval?application_code=".$application_code;
            
                }else if ($decision_id == 2){
                    $url_name = "product_exemp_rejection"; 
                    $url = url('/')."/reports/printProductExemptionRejectionLetter?application_code=".$application_code."&module_id=".$module_id;
                    //$url = $server_url."ProductExemptionRejection?application_code=".$application_code;
    
                }else{
                    $url_name = "product_exemp_approval";
                    $url = $server_url."ProductExemptionApproval?application_code=".$application_code;    
                }
            }else{ //if no such submodule found
                $res = array(
                    'success'=>false,
                    'message'=>'No Applicable Product Report'
                );
            }
        }
        //Facility
        else if ($module_id == 2){
            if($sub_module_id == 1){ //New Facility
                if($decision_id == 1){
                    $url = $server_url."license?application_code=".$application_code;
                }else if($decision_id == 2){
                    $url = $server_url."FacilityRegRejection?application_code=".$application_code;
                }else{
                    $url = $server_url."license?application_code=0";

                    $res = array(
                        'success'=>false,
                        'message'=>'Missing finial Decision'
                    );
                    return $res;
                }
            }else if($sub_module_id == 2){//renewal
                if($decision_id == 1){
                    $url_name = "premise_letter";
                    $url = $server_url."premiseLetter?application_code=".$application_code;
                }else if($decision_id == 2){
                    $url_name = "premise_letter";
                    $url = $server_url."FacilityRegRejection?application_code=".$application_code;
                }else{
                    $url_name = "premise_letter";
                    $url = $server_url."premiseLetter?application_code=0";

                    $res = array(
                    'url'=>$url,
                        'success'=>false,
                        'message'=>'Missing finial Decision'
                    );
                    return $res;
                }
            }else if($sub_module_id == 4){//widrawall

            }else{
                $res = array(
                    'success'=>false,
                    'message'=>'No Applicable Facility Report'
                );
            }
        }
        //GMP
        else if ($module_id == 3){
            if($sub_module_id == 5){ //new GMP
                if($decision_id == 1){ //permit_approval
                    $url = $server_url."premisePermit?application_code=".$application_code;
                }else if ($decision_id == 2){
                    $url = $server_url."premisePermit?application_code=".$application_code;
                }else {
                    $url = $server_url."premisePermit?application_code=0";

                    $res = array(
                        'success'=>false,
                        'message'=>'No Final Decision'
                    );
                }
            }else if($sub_module_id == 6){//renewal

            }else if($sub_module_id == 39){//withdrawal

            }else if($sub_module_id == 40){//variation

            }else if($sub_module_id == 52){//appeal

            }else{
                $check = Http::get($server_url."genericLetter");
                $url = $server_url."genericLetter";
            }
        }
        //IMPORT EXPORT
        else if ($module_id == 4){
            if ($sub_module_id == 12){ //Import Permit Application
                $url_name = "import_permit";
                $url=$server_url."importPermit?application_code=".$application_code;
            }else if ($sub_module_id == 16){ //Export Permit Application
                $url_name = "export_permit";
                $url=$server_url."exportPermit?application_code=".$application_code;
            }else if ($sub_module_id == 94){//Transit Permit
                $url_name = "transit_permit";
                $url=$server_url."transitPermit?application_code=".$application_code;
            }else{
                $res = array(
                    'success'=>false,
                    'message'=>'No Applicable POE Report'
                );
            }
        } 
        
        //CT
        else if ($module_id == 7){
            $url=$server_url."ClinicalTrialApproval?application_code=".$application_code;

            //CT acknowledgement Letter
            // $url=$server_url."CTAcknowledgementLetter?application_code=".$application_code;
        }
        //ENFORCEMENT
        else if($module_id == 8){
            if($sub_module_id == 86){
                $url_name = "enforcement_investigation_report";
                $url=$server_url."InvestigationForm?application_code=".$application_code;
            }
        }

        //PROMOTION & ADVERT
        else if ($module_id == 14){
            if($decision_id == 1){
                $url_name = "PA_approval";
                $url=$server_url."PromotionAdvertismentApproval?application_code=".$application_code;
            }else if($decision_id == 2){
                $url_name = "PA_rejection";
                $url=$server_url."PromotionAdvertismentRejection?application_code=".$application_code;
            }else{
                $url_name = "PA_approval";
                $url=$server_url."PromotionAdvertismentApproval?application_code=".$application_code; 
            }
        }else if($module_id == 12){ //HFD
            $url_name = "hfd_permit";
            $url=$server_url."HFDPermit?application_code=".$application_code;
        }
        //Enforcement
        else if($module_id == 8){
            if($sub_module_id == 86){
                $url_name = "enforcement_investigation_report";
                $url=$server_url."InvestigationForm?application_code=".$application_code;
            }
        }else{
            $url = $server_url."genericLetter";
        }
  
    }
        //Enforcement
    else if($correspondence_name == 'investigationReport' ){
        $url_name = "enforcement_investigation_report";
        $url=$server_url."InvestigationForm?application_code=".$application_code;
    }else if($correspondence_name == 'feedbackForm' ){
        $url_name = "enforcement_feedback_form";
        $url=$server_url."feedbackForm?application_code=".$application_code;
    }

    //PRODUCT CERT
    else if($correspondence_name == 'product_cert'){//cert/Letter
        $url = $server_url."Letter?application_code=".$application_code;

        // if($sub_module_id == 1){ //new facility
        //     if($decision_id == 1){
        //         $url = $server_url."Letter?application_code=".$application_code;
        //     }else{
        //         $url = $server_url."RejectionLetter?application_code=".$application_code;
        //     }
        // }
    }

    //GMP LICENSE
    else if($correspondence_name == 'facility_license'){
        $url_name = "gmp_license";
        $url = $server_url."license?application_code=".$application_code;
    }

    //PREMISE PERMIT
    else if($correspondence_name == 'premise_permit'){
        $url_name = "premise_permit";
        $url = $server_url."premisePermit?application_code=".$application_code;
    }


    //GMP Inspection Letter
    else if($correspondence_name == 'inspection_letter'){
        $url = $server_url."GMPInspectionLetter?application_code=".$application_code;
    }

    //GMP Desk review
    else if($correspondence_name == 'desk_review'){
        $url = $server_url."deskReview?application_code=".$application_code;
    }
        //Enforcement
    else if($correspondence_name == 'investigationReport' ){
        $url_name = "enforcement_investigation_report";
        $url=$server_url."InvestigationForm?application_code=".$application_code;
    }else if($correspondence_name == 'feedbackForm' ){
        $url_name = "enforcement_feedback_form";
        $url=$server_url."feedbackForm?application_code=".$application_code;
    }

    // IF ALL REPORTS FAIL
    else{
        $url = $server_url."genericLetter";
    }
    
        //$savereport = $this -> saveReportDetails($url_name,$application_code);
    
        $qry_report = DB::table('par_brims_reports as t1')
                ->select('t1.*')
                ->where('t1.correspondence_name', $url_name);
        $results = $qry_report->first();
        if($results){
            $report_id =$results->id;

            $where = array(
                "application_code" => $application_code,
                "report_id" =>$report_id
            );

            if(!recordExists($report_application_table,$where)){
                $report_params = array(
                    'application_code' => $application_code,
                    'correspondence_name' => $url_name,
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'report_id' => $report_id,
                    'created_by' => $user_id,
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    );  
                $res = insertRecord($report_application_table, $report_params);    
                $url = $url.'&is_altered=0'; 
            }else{
                $sign_rec = DB::table('tra_esignrequest_log')->where($where)->first();
                $meta_hash = '';
                $last_id = 0;
                if(isset($sign_rec->id)){
                    $meta_hash = $sign_rec->doc_meta_data_hash;
                    $last_id = $sign_rec->id;
                }
                if($module_id == 1){
                        if($sub_module_id == 75){
                            $app_details = DB::table('tra_product_applications as t1')
                                ->join('tra_exemption_products as t4', 't1.application_code', 't4.application_code')
                                ->join('wb_trader_account as t3', 't1.applicant_id', 't3.id')
                                ->where('t1.application_code', $application_code)
                                ->select('t1.application_code','t1.tracking_no', 't1.sub_module_id','t1.section_id','t3.name as applicant', 't3.physical_address',DB::raw("STRING_AGG(t4.brand_name || ' ' || t4.strength , ',') as products"))
                                ->groupBy('t1.application_code', 't1.tracking_no', 't1.sub_module_id','t1.section_id','t3.name', 't3.physical_address')
                                ->first();

                            $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $app_details->tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id,'applicant' => $app_details->applicant,'physical_address' => $app_details->physical_address,'products' => $app_details->products]);
                            $url = $url.'&is_altered=0';
                        }
                        else{
                    $app_details = DB::table('tra_product_applications as t1')
                            ->join('tra_product_information as t4', 't1.product_id', 't4.id')
                            ->leftJoin('par_dosage_forms as t6', 't4.dosage_form_id', 't6.id')
                            ->join('wb_trader_account as t3', 't1.applicant_id', 't3.id')
                            ->where('application_code', $application_code)
                            ->select('t1.application_code','t1.tracking_no', 't1.sub_module_id','t1.section_id','t3.name as applicant', 't3.physical_address','t4.brand_name AS product_name','t4.common_name AS comm_name','t4.strength AS strength','t6.name AS dosage_name')
                            ->first();

                    $doc_meta_data = json_encode(['application_code'=> $app_details->application_code, 'tracking_no' => $app_details->tracking_no, 'sub_module_id'=>$app_details->sub_module_id, 'section_id' => $app_details->section_id,'applicant' => $app_details->applicant,'physical_address' => $app_details->physical_address,'product_name' => $app_details->product_name,'comm_name' => $app_details->comm_name,'strength' => $app_details->strength,'dosage_name' => $app_details->dosage_name]);
                    $current_hash = hash('sha256', $doc_meta_data);
                    if(($last_id != 0) && $current_hash != $meta_hash){
                        $url = $url.'&is_altered=0';//should be 1 to ensure the letter content never changes after signing
                        //updateRecord('tra_esignrequest_log', $where, ['status_id'=>4]);
                    }
                    else{
                            $url = $url.'&is_altered=0';
                        }
                    }
                }
            }
        }else{
            $url = $url.'&is_altered=0';
        }
  
    if($url == ""){
        $res = array(
            'success'=>false,
            'message'=>'Missing correspodence'
        );
    }else{
        $res = array(
            'success'=>true,
            'message'=>'all is well',
            'url'=>$url,
            'report_id' => $report_id
        );
    }
    
    return \response()->json($res);
  }    public function saveReportDetails($url_name,$application_code)
  {

    $report_application_table = 'par_brims_report_application';

    try{
        $qry_report = DB::table('par_brims_reports as t1')
                ->select('t1.*')
                ->where('t1.correspondence_name', $url_name);
        $results = $qry_report->first();
        $report_id =$results->id;

        $where = array(
            "application_code" => $application_code,
            "report_id" =>$report_id
        );

        if(!recordExists($report_application_table,$where)){
            $report_params = array(
                'application_code' => $application_code,
                'correspondence_name' => $url_name,
                'report_id' => $report_id,
                //'created_by' => $user_id,
                'date_received' => Carbon::now(),
                'created_on' => Carbon::now(),
                );  
            $res = insertRecord($report_application_table, $report_params);      
        }
        
    }catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return response()->json($res);
  }

  public function checkApprovalDecision($application_code,$sub_module_id)
  {
    if($sub_module_id == 7 || $sub_module_id == 75 || $sub_module_id == 9){
        $decision_id = getSingleRecordColValue('tra_product_screening_approvals',['application_code'=>$application_code], 'decision_id');
    }else{
        $decision_id = getSingleRecordColValue('tra_approval_recommendations',['application_code'=>$application_code], 'decision_id');
    }
      return $decision_id;
  }
  public function loadProductDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
  
        
    //getting data qry
    $qry = DB::table('tra_product_applications as t1')
                ->join('tra_product_information as t2', function ($join) {
                    $join->on('t1.product_id', '=', 't2.id')
                        ->groupBy('t1.application_code');
                  })
                ->LeftJoin('par_classifications as t3','t2.classification_id','t3.id')
                ->LeftJoin('par_common_names as t4','t2.common_name_id','t4.id')
                 ->LeftJoin('par_prodclass_categories as t5','t1.prodclass_category_id','t5.id')
                 ->LeftJoin('par_dosage_forms as t9','t2.dosage_form_id','t9.id')
                 ->LeftJoin('par_intended_enduser as t10','t2.intended_enduser_id','t10.id')
                 ->LeftJoin('par_product_origins as t12','t2.product_type_id','t12.id')
                 ->LeftJoin('wb_trader_account as t13','t1.applicant_id','t13.id')
                 ->LeftJoin('wb_trader_account as t14','t1.local_agent_id','t14.id')
                 ->LeftJoin('par_countries as t15','t13.country_id','t15.id')
                 ->LeftJoin('par_regions as t16','t13.region_id','t16.id')
                 ->LeftJoin('par_countries as t17','t14.country_id','t17.id')
                 ->LeftJoin('par_regions as t18','t14.region_id','t18.id')
                 ->LeftJoin('tra_approval_recommendations as t19','t1.application_code','t19.application_code')
                 ->LeftJoin('par_approval_decisions as t20','t19.decision_id','t20.id')
                 ->LeftJoin('par_system_statuses as t25','t1.application_status_id','t25.id')
                 ->LeftJoin('par_assessment_procedures as t30','t1.assessment_procedure_id','t30.id')

                  ->select(DB::raw("t1.date_added as Application_Date, t1.application_code,t1.product_id,t1.reference_no,t1.tracking_no,t1.submission_date,t1.submission_date as Received_From,t1.submission_date as Received_To,t1.section_id,t2.brand_name, t2.warnings,t2.shelf_life,t2.shelf_lifeafter_opening,t2.instructions_of_use,t2.physical_description, t3.name as Classification, t4.name as common_Name,t5.name as Category,t2.storage_condition as Storage_Condition,t9.name as Product_Form,t10.name as Intended_Users,t2.shelflifeduration_desc,t12.name as Product_Type,t13.name as Applicant,t13.postal_address as Applicant_Postal_Address,t13.physical_address as Applicant_Physical_Address,t13.email as Applicant_Email,t13.telephone_no as Applicant_Tell,t13.mobile_no as Applicant_Mobile,t14.name as Local_Agent,t14.postal_address as Local_Agent_Postal_Address,t14.physical_address as Local_Agent_Physical_Address,t14.email as 
                    Local_Agent_Email,t14.telephone_no as Local_Agent_Tell,t14.mobile_no as Agent_Mobile,t15.name as Applicant_Country,t16.name as Applicant_Region,t17.name as Agent_Country,t18.name as Agent_Region,t19.certificate_issue_date as Cert_Issue_Date,t19.expiry_date as Cert_Expiry_Date,t19.certificate_issue_date as Issue_From,t19.certificate_issue_date as Issue_To,t19.certificate_no, t25.name as application_status, t30.name as assessment_procedure, t2.strength"));

        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Registration Date':
          $qry->whereBetween(DB::raw("t19.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Expiry Date':
          $qry->whereBetween(DB::raw("t19.expiry_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'brand_name' :
                          $whereClauses[] = "t2.brand_name like '%" . ($filter->value) . "%'";
                          break;
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'warnings' :
                          $whereClauses[] = "t2.warnings like '%" . ($filter->value) . "%'";
                          break;
                      case 'shelf_life' :
                          $whereClauses[] = "t2.shelf_life like '%" . ($filter->value) . "%'";
                          break;
                      case 'shelf_lifeafter_opening' :
                          $whereClauses[] = "t2.shelf_lifeafter_opening like '%" . ($filter->value) . "%'";
                          break;
                      case 'instructions_of_use' :
                          $whereClauses[] = "t2.instructions_of_use like '%" . ($filter->value) . "%'";
                          break;
                      case 'physical_description' :
                          $whereClauses[] = "t2.physical_description like '%" . ($filter->value) . "%'";
                          break;   
                      case 'Classification' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'commonName' :
                          $whereClauses[] = "t4.name like '%" . ($filter->value) . "%'";
                          break;  
                      case 'Category' :
                          $whereClauses[] = "t5.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'SubCategory' :
                          $whereClauses[] = "t6.name like '%" . ($filter->value) . "%'";
                          break; 
                      case 'SpecialCategory' :
                          $whereClauses[] = "t7.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'StorageCondition' :
                          $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ProductForm' :
                          $whereClauses[] = "t9.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'IntendedUsers' :
                          $whereClauses[] = "t10.name like '%" . ($filter->value) . "%'";
                          break;   
                      case 'shelflifeduration_desc' :
                          $whereClauses[] = "t2.shelflifeduration_desc like '%" . ($filter->value) . "%'";
                          break;
                      case 'issueplace' :
                          $whereClauses[] = "t11.name like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ProductType' :
                          $whereClauses[] = "t12.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Applicant' :
                          $whereClauses[] = "t13.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalA' :
                          $whereClauses[] = "t13.postal_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPhysicalA' :
                          $whereClauses[] = "t13.physical_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t13.email_address like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantTell' :
                          $whereClauses[] = "t13.telephone_no like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantMobile' :
                          $whereClauses[] = "t13.mobile_no like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t15.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t16.name like '%" . ($filter->value) . "%'";
                          break; 
                      case 'LocalAgent' :
                          $whereClauses[] = "t14.name like '%" . ($filter->value) . "%'";
                          break; 
                      case 'LocalAgentPostalA' :
                          $whereClauses[] = "t14.postal_address like '%" . ($filter->value) . "%'";
                          break; 
                      case 'LocalAgentPhysicalA' :
                          $whereClauses[] = "t14.physical_address like '%" . ($filter->value) . "%'";
                          break; 
                      case 'LocalAgentEmail' :
                          $whereClauses[] = "t14.email_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'LocalAgentTell' :
                          $whereClauses[] = "t14.telephone_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'AgentMobile' :
                          $whereClauses[] = "t14.mobile_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'AgentCountry' :
                          $whereClauses[] = "t17.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'AgentRegion' :
                          $whereClauses[] = "t18.name like '%" . ($filter->value) . "%'";
                          break;  
                      case 'CertIssueDate' :
                          $whereClauses[] = "date_format(t19.certificate_issue_date, '%Y%-%m-%d')= '" . formatDate($filter->value) . "'";
                          break;  
                      case 'CertExpiryDate' :
                          $whereClauses[] = "date_format(t19.expiry_date, '%Y%-%m-%d')= '" . formatDate($filter->value) . "'";
                          break;
                      case 'ReceivedFrom' :
                          $whereClauses[] = "date_format(t1.submission_date, '%Y%-%m-%d')>= '" . formatDate($filter->value) . "'";
                          break;  
                      case 'ReceivedTo' :
                          $whereClauses[] = "date_format(t1.submission_date, '%Y%-%m-%d')<= '" . formatDate($filter->value) . "'";
                          break;  
                      case 'IssueFrom' :
                          $whereClauses[] = "date_format(t19.certificate_issue_date, '%Y%-%m-%d')>='" . formatDate($filter->value) . "'";
                          break;  
                      case 'IssueTo' :
                          $whereClauses[] = "date_format(t19.certificate_issue_date, '%Y%-%m-%d')<='" . formatDate($filter->value) . "'";
                          break;
                      case 'submission_date' :
                          $whereClauses[] = "date_format(t1.submission_date, '%Y%-%m-%d') ='" . formatDate($filter->value) . "'";
                          break;
                      case 'certificate_no' :
                          $whereClauses[] = "t19.certificate_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'Manufacturer' :
                          $whereClauses[] = "t27.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerPostalA' :
                          $whereClauses[] = "t27.postal_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerPhysicalA' :
                          $whereClauses[] = "t27.physical_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerTell' :
                          $whereClauses[] = "t27.telephone_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerMobile' :
                          $whereClauses[] = "t27.mobile_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerCountry' :
                          $whereClauses[] = "t28.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerRegion' :
                          $whereClauses[] = "t29.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'ManufacturerEmail' :
                          $whereClauses[] = "t27.email_address like '%" . ($filter->value) . "%'";
                          break;
                      case 'product_strength' :
                          $whereClauses[] = "t2.product_strength::text like '%" . ($filter->value) . "%'";
                          break;
                      case 'product_id' :
                          $whereClauses[] = "t1.product_id::text ILIKE '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Product Report", "filename"=>"productsReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
        $ing_columns = ['ingredient_name', 'ingredient_specification','reason_for_inclusion', 'strength','si_unit'];
        $additional_data[]=array('title'=>'Ingredients Details','column'=>array_reverse($ing_columns), 'url'=>'productregistration/onLoadproductIngredients', 'filter_column'=>'product_id');
        //packaging
        $pack_columns = ['container_type', 'container_name','container_material', 'closure_materials','closure_material','seal_type','packaging_units','retail_packaging'];
        $additional_data[]=array('title'=>'Packaging Details','column'=>array_reverse($pack_columns), 'url'=>'productregistration/onLoadproductPackagingDetails', 'filter_column'=>'product_id');
        //manufacturer
        $man_columns = ['manufacturer_name','manufacturing_role', 'physical_address','email_address','manufacturing_site','country_name','region_name','district_name'];
        $additional_data[]=array('title'=>'Manufacturer Details','column'=>array_reverse($man_columns), 'url'=>'productregistration/onLoadproductManufacturer', 'filter_column'=>'product_id');
        //api manufacturer
        $man_columns = ['ingredient_name', 'manufacturer_name', 'physical_address','email_address','country_name','region_name','district_name'];
        $additional_data[]=array('title'=>'API Manufacturer Details','column'=>array_reverse($man_columns), 'url'=>'productregistration/onLoadproductApiManufacturer', 'filter_column'=>'product_id');

        $filter_columns = ['Registration Date','Expiry Date','Discharge Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function getDataBrowserDocuments(request $request){
       $start=$request->start;
       $limit=$request->limit;
       $doc_type=$request->doc_type;
       $application_code=$request->application_code;
       $appType = $request->appType;

       if(isset($application_code)){
       $qry=DB::table('tra_application_documents as t1')
             ->join('tra_application_uploadeddocuments as t2','t2.application_document_id','t1.id')
             ->leftJoin('tra_documentmanager_application as t3','t2.document_requirement_id','t3.id')
             ->leftJoin('wb_trader_account as t4','t1.uploaded_by','t4.id')
             ->leftJoin('par_document_types as t5','t3.document_type_id','t5.id')
             ->where('t1.application_code',$application_code)
             ->select('t2.file_name','t2.initial_file_name','t2.file_type','t2.remarks','t1.uploaded_on','t5.name as document_type','t4.name as uploaded_by','node_ref','t2.id as uploadeddocuments_id','t1.application_code','t3.section_id',DB::raw("0 as reference_no") );

       if(validateIsNumeric($doc_type)){
         $qry->where("t3.document_type_id", $doc_type);

        }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        }else{
          $res=array(
              'success'=>false,
              'results'=>null,
              'message'=>'Application Code is not set'
          );
        }
  return \response()->json($res);
}
public function loadPVDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
 //dd($form_filters);
        
    //getting data qry
    $qry = DB::table('tra_pv_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->leftJoin('tra_pv_published_logs as t4', 't1.application_code','t4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t5.recommendation_id as prechecking_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Published Date':
          $qry->whereBetween(DB::raw("t4.published_on::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"PV ADR Report", "filename"=>"ADRReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
       $ing_columns = ['brand_name','manufacturer_name','batch_no','use_reasons'];
        $additional_data[]=array('title'=>' Other Drugs Details','column'=>array_reverse($ing_columns), 'url'=>'pv/onLoadSuspectedDrugs', 'filter_column'=>'application_code');
        
        $filter_columns = ['Submission Date','Publish Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
         'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadSurveillanceDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
 //dd($form_filters);
        
    //getting data qry
    $qry = DB::table('tra_surveillance_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
       ->leftJoin('tra_approval_recommendations as t4', 't1.application_code', '=', 't4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t5.recommendation_id as prechecking_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Approval Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Surveillance Report", "filename"=>"SurveillanceReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
        $ing_columns = ['site_level','program_name','program_description','sampling_site'];
        $additional_data[]=array('title'=>'Surveillance Sample Details Details','column'=>array_reverse($ing_columns), 'url'=>'surveillance/getPmsProgramsImplementationDetails', 'filter_column'=>'program_implementation_id');
        
        $filter_columns = ['Registration Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadEnforcementDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
 //dd($form_filters);
        
    //getting data qry
    $qry = DB::table('tra_enforcement_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
       ->leftJoin('tra_approval_recommendations as t4', 't1.application_code', '=', 't4.application_code')
       ->leftJoin('tra_enforcement_information as t6', 't1.enforcement_id', '=', 't6.id')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->select(DB::raw('t1.*','t6.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t5.recommendation_id as prechecking_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address','t1.id as application_id', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Closure Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Report Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
          
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Law Enforcement Report", "filename"=>"enforcementreport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
        $ing_columns = ['details','place','offence_date'];
        $additional_data[]=array('title'=>' Offence Details','column'=>array_reverse($ing_columns), 'url'=>'enforcement/getSuspectedOffenceDetails', 'filter_column'=>'application_id');
        
        $filter_columns = ['Registration Date','Reporting Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadPmsProgramDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
 //dd($form_filters);
        
    //getting data qry
    $qry = DB::table('tra_pmsprogram_applications as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
       ->leftJoin('tra_approval_recommendations as t4', 't1.application_code', '=', 't4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t5.recommendation_id as prechecking_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Approval Date':
          $qry->whereBetween(DB::raw("t4.approval_date::date"),[$date_from, $date_to]);
          break;
        case 'Submission Date':
          $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Pms Program Report", "filename"=>"PmsProgramReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
        $ing_columns = ['site_level','program_name','program_description','sampling_site'];
        $additional_data[]=array('title'=>'Surveillance Sample Details Details','column'=>array_reverse($ing_columns), 'url'=>'surveillance/getPmsProgramsImplementationDetails', 'filter_column'=>'program_implementation_id');
        
        $filter_columns = ['Registration Date','Submission Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
          'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function loadRevenueDataLibrabry($req, $in_call){
    $module_id = $req->module_id;
    $gridCall = $req->gridCall;
    $filter = $req->filter;
    $limit = $req->limit;
    $start = $req->start;
    $form_filters = $req->form_filters;
 //dd($form_filters);
        
    //getting data qry
    $qry = DB::table('tra_revenue_details as t1')
        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
        ->leftjoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
        ->leftJoin('tra_invoice_refund_approvals as t4', 't1.application_code','t4.application_code')
        ->leftJoin('tra_evaluation_recommendations as t5', 't1.application_code','t5.application_code')
        ->select(DB::raw('t1.*','q.name as application_status', 't1.id as active_application_id',
        't3.name as applicant_name', 't3.contact_person','t5.recommendation_id as prechecking_recommendation_id',
        't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
        't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax','t4.created_on as approval_date', 't3.email as app_email', 't3.website as app_website'));


        //filters
    $form_filters = json_decode($form_filters, true); //to be used to separate sub sections and other filters
    if(isset($form_filters['filter_column'])){
          $date_column = json_decode($form_filters['filter_column'], true);
    }else{
        $date_column = [];
    }
   $date_from = $form_filters['date_from'];
   $date_to = $form_filters['date_to'];
   $module_id = $form_filters['module_id'];
   //filter by date
   if(!empty($date_column)){
        foreach ($date_column as $col) {
      switch ($col) {
        case 'Submission Date':
            $qry->whereBetween(DB::raw("t1.date_added::date"),[$date_from, $date_to]);
            break;
        case 'Approval Date':
          $qry->whereBetween(DB::raw("t4.created_on::date"),[$date_from, $date_to]);
          break;
        
        default:
          # code...
          break;
      }
     }
   }
   //grid column filters
     $filter = $req->input('filter');
     $whereClauses = array();
     $filter_string = '';

      if (isset($filter)) {
          $filters = json_decode($filter);
          if ($filters != NULL) {
              foreach ($filters as $filter) {
                  switch ($filter->property) {
                      case 'tracking_no' :
                          $whereClauses[] = "t1.tracking_no like '%" . ($filter->value) . "%'";
                          break;
                      case 'reference_no' :
                          $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantName' :
                          $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                          break;
                      case 'Contactperson' :
                          $whereClauses[] = "t3.contact_person like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantCountry' :
                          $whereClauses[] = "t3.app_country_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantRegion' :
                          $whereClauses[] = "t3.app_region_id like '%" . ($filter->value) . "%'";
                          break; 
                      case 'ApplicantDistrict' :
                          $whereClauses[] = "t3.app_district_id like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantPostalAddress' :
                          $whereClauses[] = "t3.app_postal_address like '%" . ($filter->value) . "%'";
                          break;  
                      case 'ApplicantTelephone' :
                          $whereClauses[] = "t3.app_telephone like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantFax' :
                          $whereClauses[] = "t3.app_fax like '%" . ($filter->value) . "%'";
                          break;   
                      case 'ApplicantEmail' :
                          $whereClauses[] = "t3.app_email like '%" . ($filter->value) . "%'";
                          break;
                      case 'ApplicantWebsite' :
                          $whereClauses[] = "t3.app_website like '%" . ($filter->value) . "%'";
                          break;
                  }
              }
              $whereClauses = array_filter($whereClauses);
          }
          if (!empty($whereClauses)) {
              $filter_string = implode(' AND ', $whereClauses);
          }
      }
     //  sub_module_id
      if ($filter_string != '') {
           $qry->whereRAW($filter_string);
       }
     // }
  if($gridCall == 1 || $gridCall === 1 || $gridCall == '1' || $in_call==1){
      //count
        $total = $qry->count();
        if(isset($start)&&isset($limit)){
            $results = $qry->skip($start)->take($limit)->get();
          }
          else{
            $results=$qry->get();
          }
        $res = array (
          'success'=> true,
          'message'=> "done",
          'total'=> $total,
          'results' => $results
        );
        //when the call is within this function(called by export function)
        if($in_call){
            return array("data"=>$data, "title"=>"Revenue Details", "filename"=>"RevenueReport");
        }
        return $res;
    }else{
       //capture schema
        $first_rec = $qry->first();
        $main_data = array_keys((array)$first_rec);
        $additional_data = array();//title, columns, title
        //ingredients
       $ing_columns = ['','','',''];
        $additional_data[]=array('title'=>' Other Details','column'=>array_reverse($ing_columns), 'url'=>'', 'filter_column'=>'application_code');
        
        $filter_columns = ['Submission Date','Approval Date'];
        $res = array (
          'success'=>true,
          'message'=>"done",
          'main_data'=>$main_data,
         'additional_data'=>$additional_data,
          'filter_columns'=>$filter_columns,
          'results' => array()
        );
        return $res;
    }
  }
  public function getHFDConsumptionLog(request $request){
    $controlleddrugs_type_id=$request->controlleddrugs_type_id;
    $controlled_drugssubstances_id=$request->controlled_drugssubstances_id;
    $year=$request->year;
    $controlleddrugs_basesalt_id=$request->controlleddrugs_basesalt_id;
    $start=$request->start;
    $limit=$request->limit;
   try{
    $qry=DB::table('tra_importexport_applications as t1')
        ->Join('tra_permits_products as t2','t1.application_code','t2.application_code')
        ->Join('par_controlleddrugs_basesalts as t3','t2.controlleddrugs_basesalt_id','t3.id')
        ->leftJoin('par_controlled_drugssubstances as t4','t3.controlled_drugssubstances_id','t4.id')
        ->leftJoin('par_controlleddrugs_types as t5','t4.controlleddrug_type_id','t5.id')

        ->select(DB::raw("t2.controlleddrug_base as quantity, 0 as quota_quantity, date_part('year', t1.expected_arrival_date) as year, t3.name as controlled_drug_salt, t4.name as controlled_drug_substance, t5.name as controlled_drug"));
        // ->groupBy('t3.id');
     if(validateIsNumeric($controlleddrugs_type_id)){
        $qry->where('t5.id', $controlleddrugs_type_id);
     }
     if(validateIsNumeric($controlleddrugs_basesalt_id)){
        $qry->where('t2.controlleddrugs_basesalt_id', $controlleddrugs_basesalt_id);
     }
     if(validateIsNumeric($controlled_drugssubstances_id)){
        $qry->where('t3.controlled_drugssubstances_id', $controlled_drugssubstances_id);
     }
     if(isset($year)){
        // $qry->whereDate('t1.expected_arrival_date', $year.'::date');
     }
          $results = $qry->get();       
            $res = array(
                'success' => true,
                'results' => $results,
                // 'total'=>$total,
                'message' => 'All is well',
    
            );

           }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
          return \response()->json($res);
    

    }
    // public function printRequestForAdditionalInformation(Request $req)
    // {
    //     //application details
    //     $application_code = $req->application_code;
    //         $module_id = $req->module_id;
    //         $query_id = $req->query_id;
    //         $record = DB::table('tra_application_query_reftracker')
    //                     ->where(array('id'=>$query_id, 'application_code'=>$application_code))
    //                     ->first();
    //         if($record){
    //             $query_processstage_id = $record->query_processstage_id;
    //             if($query_processstage_id == 3){
    //                     $this->generateGMPCAPARequests($req);
        
    //             }
    //             else{
                    
    //                     $this->generateRequestForAdditionalInformation($req);
        
    //             }
                
                
    //         }
                                                            
    // }
 public function printRequestForAdditionalInformation(Request $req)
    {
    try{ 
      $template_url = base_path('');


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
            
            
            
            $module_data = getTableData('par_modules', ['id'=>$module_id]);
       
            if(!isset($app_data->time_span)){
                $time_span =23;
            }else{
                
                $time_span =$app_data->time_span ;
                
            }
                    if(!isset($module_data->tablename)){
                        return "Module details not found";
                    }
            $app_data = DB::table($module_data->tablename.' as t1')
                    ->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
                    ->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
                    ->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
                    ->where('application_code', $application_code)
                    ->select('t1.section_id','t1.product_id','t1.applicant_id','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name');
            //clone for adjastment 
            $c_query = clone $app_data;
            $app_data = $app_data->first();

            if(!$app_data){
                return "Application details not found";
            }

            // $org_info = $this->getOrganisationInfo();
            $pdf = new mPDF([
                    'mode' => 'utf-8',
                    'format' => 'A4',
                    'margin_header' => '5',
                    'orientation' => 'P',
                    'margin_top' => '5',
                    'margin_bottom' => '2',
                    'margin_footer' => '2',
                    'tempDir'=> $template_url.'/public/resources'
                ]); 
            //$template_url = base_path('/');
            //header footer
            //dd($template_url.'/resources/templates/header.png');
            $pdf->SetHTMLHeader('<img src="https://livebrims.bomra.co.bw/backend/resources/templates/headerm.png"/>');
            $pdf->SetHTMLFooter('<img src="https://livebrims.bomra.co.bw/backend/resources/templates/footer.png"/>');
            // $pdf = new PdfLettersProvider();
            $pdf->setMargins(0,0,0,true);
            $pdf->AddPage('P','','','','',7,7,40,50,5,20);
            //query data
            $request_data = DB::table('tra_application_query_reftracker as t1')
                            ->leftJoin('users as t2','t1.approved_by', 't2.id')
                            ->select(DB::raw("t1.*, to_char(t1.approved_on::date, 'DD/MM/YYYY') as approved_on, to_char(t1.queried_on::date, 'DD MM YYYY') as query_date, to_char(t1.queried_on::date, 'mm/dd/YYYY') as query_date_fmt, CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as approved_by"))
                            ->where('t1.application_code', $application_code)
                            ->where('t1.status_id','!=', 4);
                            //->get();
             //check approval
            $check = DB::table('tra_application_query_reftracker as t1')
                    ->join('tra_esignrequest_log as t2', 't1.application_code', 't2.application_code')
                   // ->where(['t1.application_code' => $application_code, 't2.report_id' => 9, 't1.status_id'=> 5])
                    ->where(['t1.application_code' => $application_code, 't1.status_id'=> 2])
                    ->count();
            if($check > 0){
                //
            }else{
               // $request_data->where('t1.status_id', 1);
            }
            $request_data = $request_data->get();
            //dd($check);
            $query_details = $request_data[0];

            // if($query_details->approval_decision_id == 1){
            //     $pdf->SetWatermarkText('Pending Approval');
            //     $pdf->showWatermarkText = true;
            // }
            //$pdf->Cell(0,5,'',0,1);
            $pdf->SetFont('gilsun','B',12);
            $section_code =getSingleRecordColValue('par_section_code', ['sub_module_id' =>$query_details->sub_module_id, 'section_id' => $query_details->section_id ], 'section_code');
            $pdf->Cell(0, 10, 'REF: '.$section_code.' ('.strtoupper(substr($query_details->query_ref, 6, 3)).')', 0, 0, 'L'); 
            $pdf->SetFont('gilsun','',12);

            $pdf->SetFont('gilsun','',12);
            $application_no = '';

            if($app_data->tracking_no != ''){
                
                $application_no =   $app_data->tracking_no;
                
            }
            if($app_data->reference_no != ''){

                $application_no .=  ' '.$app_data->reference_no;
            }
            $pdf->SetFont('gilsun','B',12);
            $pdf->Cell(0,10, $query_details->approved_on,0,1, 'R');
            $pdf->SetFont('gilsun','',12);
            $data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

            $styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
            $pdf->SetFont('gilsun','',12);

            //Letter heading 
            //$pdf->Cell(0,8,$app_data->name.',',0,1); <p style="font-family: gilsun; font-size: 47px;">
            $address = '<br/><p style="width: 75%;margin: 0; font-family: gilsun; font-size: 16px;">'.$app_data->name.'<br>';
            if($app_data->physical_address != ''){
                $address .= $app_data->physical_address.'<br>';
                //$pdf->WriteHTML($address);
                    //$pdf->WriteCell(10,8,$app_data->physical_address.',',0,1);

                }       
            if(($app_data->physical_address !=  $app_data->postal_address)){
             //   $address .= $app_data->postal_address.'<br>';
                //$pdf->WriteHTML($address);
                 //$pdf->Cell(0,8,$app_data->postal_address.',',0,1);
            }
            //$address .= $app_data->region_name." ".$app_data->country_name.'</p>';
            $pdf->WriteHTML($address.'<br/>');
            //$pdf->Cell(0,8,$app_data->region_name." ".$app_data->country_name,0,1);

            $pdf->SetFont('gilsun','',12);
            //$pdf->ln();
            //$pdf->Cell(0,5,'',0,1);
            $pdf->Cell(0,8,'Dear Sir/Madam',0,1);
          //  $pdf->Cell(0,5,'',0,1);
            if($module_id == 1){
                $app_data = $c_query->join('tra_product_information as a1', 't1.product_id', 'a1.id')
                        ->leftJoin('par_dosage_forms as a2', 'a1.dosage_form_id', 'a2.id')
                        ->addSelect('a2.name as dosage_form', 'a1.brand_name', 'a1.common_name', 'a1.strength')
                        ->first();
                if($app_data->section_id == 3){
                    $actives = DB::table('tra_product_ingredients as t1')
                            ->join('par_ingredients_details as t2', 't1.ingredient_id', 't2.id')
                            ->where('t1.product_id', $app_data->product_id)
                            ->select(DB::raw("STRING_AGG(t2.name, ',') as ingredient"))
                            ->groupBy('t1.id', 't2.id')
                            ->first();
                    if(isset($actives->ingredient)){
                        $actives = $actives->ingredient;
                    }else{
                        $actives = 'N/A';
                    }
                    $ref = "<b><u>".$app_data->brand_name." (".$actives.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b>";
                }else{
                    $ref = "<b><u>".$app_data->brand_name." (".$app_data->common_name.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b>";
                }
                //$ref ='<p style="font-family: gilsun; font-size: 16px;">'."<b><u>".$app_data->brand_name."(".$app_data->common_name.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b></p>";
                //add query header tag
                $template = '<p style="margin: 0; font-family: gilsun; font-size: 16px;">'."Reference is made to your screening application for the above-mentioned product. The supporting documentation for screening was reviewed and the following should be addressed before the application can be accepted for evaluation:</p>";
            }else{
                $ref = "no ref";
                $template = "no template intro";
            }
            
            

            $pdf->WriteHTML('<br/>'.$ref);
            $pdf->WriteHTML('<br/>'.$template);

            $pdf->SetFont('gilsun','',12);

            $counter = 1;
            $is_live_signature=0;
            $sign_data='';
            $query_date = Carbon::now();
            //update multiple queries 
            $ul = '<p style="margin: 0;">';
            $check_if_watermarked = false;
            foreach ($request_data as $rd) {
                if($rd->approval_decision_id != 1 && ! $check_if_watermarked){
                    $pdf->SetWatermarkText('Pending Approval');
                    $pdf->showWatermarkText = true;
                    $check_if_watermarked = true;
                }
                $query_txt = $rd->query_txt;
                $query_txt = str_replace('font','f', $query_txt);
                $ul .= "<p>". $query_txt ."</p>";
            }
            $ul .= '</p>';
            $ul = "<div style='margin: 0; align:justify; font-family: gilsun; font-size: 16px;'>".$ul."</div><br/>";
            $pdf->WriteHTML($ul); 
            
            //$dt =strtotime($query_details->approved_on. '+30 days'); //gets dates instance
            $ft =  DateTime::createFromFormat("DD/MM/YYYY", $query_details->approved_on);
            $dt = strtotime($ft . '+30 days');
            $year = date("Y", $dt);
            $month = date("F", $dt);
            $day = date("d", $dt);
            
           // $pdf->cell(10,3,'',0,1);
            $template = "<p style='margin: 0; align:justify; font-family: gilsun; font-size: 16px;'>You are therefore required to submit a full updated dossier addressing the above queries and a new screening checklist in your submission for re-screening. Please quote the Screening number for any future communication regarding this screening.</b></p>";
            $pdf->WriteHTML($template); 
            // $end_date = Carbon::createFromFormat('mm/dd/YYYY', $request_data->query_date_fmt)->addDays(30)->format("mm/dd/YYYY");
            $template = "<p  style='align:justify;font-family: gilsun; font-size: 16px;' >The queries should be addressed by ".$day." ".$month." ".$year." (30 days), failure of which will result in the application being closed. Should you wish to continue with the application for registration of this product, please note that the process will start from the beginning.</b><br>Your anticipated cooperation is highly appreciated.</p><br>Yours Sincerely";
            $pdf->WriteHTML($template);

            
            // $pdf->Cell(0, 0,'Printed on '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
            // $pdf->cell(0,8,'',0,1);
            $startY = $pdf->y;
            $startX =$pdf->x;
            // $signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
            //$pdf->Image($signiture,$startX+75,$startY-7,30,12);
            $pdf->Image($query_details->sign_file,$startX+7,$startY+7,30,18);
            $pdf->cell(10,5,'',0,1);
            $pdf->Cell(1, 4, '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _',0,1);
            $pdf->cell(10,5,'',0,1);
            //$pdf->Cell(1, 4, $query_details->approved_by,0,1);
            $pdf->WriteHTML('<b>'.$query_details->approved_by.'</b>');
            $pdf->cell(5, 3,'',0,1);
            $pdf->WriteHTML('<b>FOR/CHIEF EXECUTIVE OFFICER</b>');

        }catch (\Exception $exception) {
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
        return response($pdf->Output('Request for Additional Information('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');                                                           
    }
    public function getActiveApplicationsList(Request $req){
        $reference = $req->reference;
        $status_id = $req->status_id;
        $module_id = $req->module_id;
        $sub_module_id = $req->sub_module_id;
        $section_id = $req->section_id;
        $user_id = $req->user_id;
        $start = $req->start;
        $limit = $req->limit;
        try{
           $qry=DB::table('tra_submissions as t1')
                ->leftJoin('users as t2','t1.usr_from','t2.id')
                ->leftJoin('users as t3','t1.usr_to','t3.id')
                ->leftJoin('users as t4','t1.released_by','t4.id')
                ->leftJoin('wb_trader_account as t5','t1.applicant_id','t5.id')
                ->leftJoin('wf_workflow_stages as t6','t1.previous_stage','t6.id')
                ->leftJoin('wf_workflow_stages as t7','t1.current_stage','t7.id')
                ->leftJoin('wf_processes as t8','t1.process_id','t8.id')
                ->leftJoin('par_sections as t9','t1.section_id','t9.id')
                ->leftJoin('wb_statuses as t10','t1.application_status_id','t10.id')
                ->leftJoin('tra_product_applications as t13','t1.application_code','t13.application_code')
                ->leftJoin('tra_product_information as t14','t13.product_id','t14.id')
               ->leftJoin('tra_product_applications as t11','t1.application_code','t11.application_code')
                ->select(DB::raw("DISTINCT ON (t1.tracking_no) t1.tracking_no, t1.reference_no,t1.date_released,t1.date_received,t1.date_submitted,t1.is_read,t1.is_done,
                CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ', decryptval(t2.last_name,".getDecryptFunParams().")) as from_user,
                CONCAT(decryptval(t3.first_name,".getDecryptFunParams()."),' ', decryptval(t3.last_name,".getDecryptFunParams().")) as to_user,
                t5.name as applicant,t6.name as previous_stage,t7.name as workflow_stage,working_days(date(t1.date_received),date(t1.date_released)) as total_days,t8.name as Process, t9.name as section, t1.process_id, t1.current_stage as workflow_stage_id, t1.section_id, t10.name as submission_status,t11.mgr_application_no, t14.brand_name as reference_no"));

            $qry->where('t1.is_done', 0);
            if(isset($reference)){
                  $qry->whereRAW("(t1.reference_no ilike '%".$reference."%' OR t1.tracking_no ilike '%".$reference."%' OR t11.mgr_application_no ilike '%".$reference."%')");
             }
             if(validateIsNumeric($status_id)){
                $qry->where('t1.application_status_id', $status_id);
             }
             if(validateIsNumeric($module_id)){
                $qry->where('t1.module_id', $module_id);
             }
             if(validateIsNumeric($sub_module_id)){
                $qry->where('t1.sub_module_id', $sub_module_id);
             }
             if(validateIsNumeric($section_id)){
                $qry->where('t1.section_id', $section_id);
             }
             if(validateIsNumeric($user_id)){
                $qry->where('t1.usr_to', $user_id);
             }

            $total=$qry->count();

            if(isset($start)&&isset($limit)){
                $results = $qry->skip($start)->take($limit)->get();
            }
            else{
                $results=$qry->get();
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'total'=>$total,
                'message' => 'All is well',

            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function printProductRejectionLetter(Request $req)
    {
    try{
         $template_url = base_path('');
    //dd($template_url);
        $application_code = $req->application_code;
        $module_id = $req->module_id;
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
       
            if(!isset($app_data->time_span)){
                $time_span =23;
            }else{
                
                $time_span =$app_data->time_span ;
                
            }
                    if(!isset($module_data->tablename)){
                        return "Module details not found";
                    }
            $app_data = DB::table($module_data->tablename.' as t1')
                    ->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
                    ->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
                    ->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
                    ->where('t1.application_code', $application_code)
                    ->select('t1.section_id','t1.sub_module_id','t1.product_id','t1.applicant_id','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name');
            //clone for adjastment 
            $c_query = clone $app_data;
            $app_data = $app_data->first();

            if(!$app_data){
                return "Application details not found";
            }
            //last query
            $last_query = DB::table('tra_application_query_reftracker as t1')
                        ->select(DB::raw("to_char(t1.approved_on::date, 'DD/MM/YYYY') as approved_on, t1.section_id, t1.sub_module_id, t1.query_ref"))
                        ->whereNotNull('t1.sign_file')
                        ->orderBy('id', 'DESC')
                        ->first();
            $section_code = getSingleRecordColValue('par_section_code', ['sub_module_id' =>$app_data->sub_module_id, 'section_id' => $app_data->section_id ], 'section_code');
            $last_query_ref = $section_code.' ('.strtoupper(substr($last_query->query_ref, 6, 3)).' )';
            $ft =  DateTime::createFromFormat("DD/MM/YYYY", $last_query->approved_on);
            $dt = strtotime($ft);
            $year = date("Y", $dt);
            $month = date("F", $dt);
            $day = date("d", $dt);
            // $org_info = $this->getOrganisationInfo();
            $template_url = base_path('');
            $pdf = new mPDF([
                    'mode' => 'utf-8',
                    'format' => 'A4',
                    'margin_header' => '5',
                    'orientation' => 'P',
                    'margin_top' => '5',
                    'margin_bottom' => '2',
                    'margin_footer' => '2',
                    'tempDir'=> $template_url.'/public/resources'
                ]); 
    $pdf->showImageErrors = true;
           // $template_url = base_path('');
            //header footers    
      
            $pdf->SetHTMLHeader('<img src="'.$template_url.'/resources/templates/header.png"/>');   
      $pdf->SetHTMLFooter('<img src="'. $template_url.'/resources/templates/footer.png"/>');
            // $pdf = new PdfLettersProvider();
            $pdf->setMargins(0,0,0,true);
            $pdf->AddPage('P','','','','',7,7,40,50,5,20);
            //letter data
            $ref = '';
            if($module_id == 1){
                $app_data = $c_query->join('tra_product_information as a1', 't1.product_id', 'a1.id')
                        ->leftJoin('par_dosage_forms as a2', 'a1.dosage_form_id', 'a2.id')
                        ->leftJoin('tra_approval_recommendations as a3', 't1.application_code', 'a3.application_code')
                        ->leftJoin('par_brims_report_application as a4', 't1.application_code', 'a4.application_code')
                        ->leftJoin('users as a5', 'a3.approved_by', 'a5.id')

                        ->addSelect('a2.name as dosage_form', 'a1.brand_name', 'a1.common_name', 'a1.strength','a3.reason_for_rejection', 'a4.letter_no', DB::raw("to_char(a3.approval_date::date, 'DD/MM/YYYY') as approved_on, a3.decision_id, CONCAT(decryptval(a5.first_name,".getDecryptFunParams()."),' ', decryptval(a5.last_name,".getDecryptFunParams().")) as approved_by, a3.sign_file"))
                        ->first();
                if($app_data->section_id == 3){
                    $actives = DB::table('tra_product_ingredients as t1')
                            ->join('par_ingredients_details as t2', 't1.ingredient_id', 't2.id')
                            ->where('t1.product_id', $app_data->product_id)
                            ->select(DB::raw("STRING_AGG(t2.name, ',') as ingredient"))
                            ->groupBy('t1.id', 't2.id')
                            ->first();
                    if(isset($actives->ingredient)){
                        $actives = $actives->ingredient;
                    }else{
                        $actives = 'N/A';
                    }
                    $ref = "<b><u> Failed Screening For ".$app_data->brand_name." (".$actives.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b>";
                }else{
                    $ref = "<b><u>Failed Screening For ".$app_data->brand_name." (".$app_data->common_name.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b>";
                }
                //$ref ='<p style="font-family: gilsun; font-size: 16px;">'."<b><u>".$app_data->brand_name."(".$app_data->common_name.") ".$app_data->strength." ".$app_data->dosage_form."; ".$app_data->tracking_no."</u></b></p>";
                //add query header tag
                $template = '<p style="font-family: gilsun; font-size: 16px;">The application was screened, and the following deficiencies were not addressed:</p>';
            }else{
                $ref = "no ref";
                $template = "no template intro";
            }
            $reason_for_rejection = $app_data->reason_for_rejection;
            $reason_for_rejection = str_replace('font','f', $reason_for_rejection);
            $reason_for_rejection = "<div style='margin: 0; align:justify; font-family: gilsun; font-size: 16px;'>".$reason_for_rejection."</div><br/>";
            

            // if($query_details->approval_decision_id == 1){
            //     $pdf->SetWatermarkText('Pending Approval');
            //     $pdf->showWatermarkText = true;
            // }
            //$pdf->Cell(0,5,'',0,1);
            $pdf->SetFont('gilsun','B',12);
            
            $pdf->Cell(0, 10, 'REF: '.$section_code.' ('.$app_data->letter_no.')', 0, 0, 'L'); 
            $pdf->SetFont('gilsun','',12);

            $pdf->SetFont('gilsun','',12);
            $application_no = '';

            if($app_data->tracking_no != ''){
                
                $application_no =   $app_data->tracking_no;
                
            }
            if($app_data->reference_no != ''){

                $application_no .=  ' '.$app_data->reference_no;
            }
            $pdf->SetFont('gilsun','B',12);
            $pdf->Cell(0,10, $app_data->approved_on,0,1, 'R');
            $pdf->SetFont('gilsun','',12);
            $data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

            $styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
            $pdf->SetFont('gilsun','',12);

            //Letter heading 
            //$pdf->Cell(0,8,$app_data->name.',',0,1); <p style="font-family: gilsun; font-size: 47px;">
            $address = '<br/><p style="width: 75%;margin: 0; font-family: gilsun; font-size: 16px;">'.$app_data->name.'<br>';
            if($app_data->physical_address != ''){
                $address .= $app_data->physical_address;
            }    
            $pdf->WriteHTML($address.'<br/>'.'<br/>');

            $pdf->SetFont('gilsun','',12);
            $pdf->Cell(0,8,'Dear Sir/Madam',0,1);
            $pdf->WriteHTML('<br/>'.$ref);
            $pdf->WriteHTML('<br/>'.$template);
            $pdf->WriteHTML($reason_for_rejection);

            $pdf->SetFont('gilsun','',12);

            $counter = 1;
            $is_live_signature=0;
            $sign_data='';
            $query_date = Carbon::now();
            //update multiple queries 
            $ul = '<p style="margin: 0; font-family: gilsun; font-size: 16px;">';
            if($app_data->decision_id != 2 ){
                $pdf->SetWatermarkText('Pending Approval');
                $pdf->showWatermarkText = true;
                $check_if_watermarked = true;
            } 
            
            $template = "<p style='margin: 0; align:justify; font-family: gilsun; font-size: 16px;'>The application has therefore failed screening.  Should you wish to continue with the application for registration of this product, please note that the process will start from the beginning. <br/>Your anticipated cooperation is highly appreciated.</b></p>";
            $pdf->WriteHTML($template); 


            
            // $pdf->Cell(0, 0,'Printed on '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
            // $pdf->cell(0,8,'',0,1);
            $startY = $pdf->y;
            $startX =$pdf->x;
            // $signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
            //$pdf->Image($signiture,$startX+75,$startY-7,30,12);
            $pdf->Image($app_data->sign_file,$startX+7,$startY+7,30,12);
            $pdf->cell(10,5,'',0,1);
            $pdf->Cell(1, 4, '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _',0,1);
            $pdf->cell(10,5,'',0,1);
            $pdf->WriteHTML('<b>'.$app_data->approved_by.'</b>');
            $pdf->cell(5, 3,'',0,1);
            $pdf->WriteHTML('<b>FOR/CHIEF EXECUTIVE OFFICER</b>');

        }catch (\Exception $exception) {
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
        return response($pdf->Output('Rejection Letter ('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');                                                           
    }
   
   public function printProductExemptionRejectionLetter(Request $req)
    {
    try{
            $application_code = $req->application_code;
            $module_id = $req->module_id;
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
       
            if(!isset($app_data->time_span)){
                $time_span =23;
            }else{
                
                $time_span =$app_data->time_span ;
                
            }
            if(!isset($module_data->tablename)){
                return "Module details not found";
            }
            $app_data = DB::table($module_data->tablename.' as t1')
                    ->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
                    ->leftJoin('par_countries as t3', 't2.country_id', 't3.id')
                    ->leftJoin('par_regions as t4', 't2.region_id', 't4.id')
                    ->leftJoin('tra_approval_recommendations as a3', 't1.application_code', 'a3.application_code')
                    ->leftJoin('users as a5', 'a3.approved_by', 'a5.id')
                    ->where('t1.application_code', $application_code)
                    ->select('a3.decision_id','t1.section_id','t1.sub_module_id','t1.product_id','t1.applicant_id','t1.reference_no', 't1.tracking_no', 't2.*', 't3.name as country_name', 't4.name as region_name', DB::raw("to_char(a3.approval_date::date, 'DD/MM/YYYY') as approved_on, CONCAT(decryptval(a5.first_name,".getDecryptFunParams()."),' ', decryptval(a5.last_name,".getDecryptFunParams().")) as approved_by, a3.sign_file"));
            //clone for adjastment 
            $c_query = clone $app_data;
            $app_data = $app_data->first();

            if(!$app_data){
                return "Application details not found";
            }
            //last query
            $reason_for_rejection = DB::table('tra_evaluation_recommendations as t1')
                        ->where('t1.application_code',  $application_code)
                        ->where('t1.stage_category_id',  3)
                        ->orderBy('id', 'DESC')
                        ->first();

            $section_code = getSingleRecordColValue('par_section_code', ['sub_module_id' =>$app_data->sub_module_id, 'section_id' => $app_data->section_id ], 'section_code');

            $tracking_no = $app_data->tracking_no;

            $template_url = base_path('');
            // $org_info = $this->getOrganisationInfo();y
            $pdf = new mPDF([
                    'mode' => 'utf-8',
                    'format' => 'A4',
                    'margin_header' => '5',
                    'orientation' => 'P',
                    'margin_top' => '5',
                    'margin_bottom' => '2',
                    'margin_footer' => '2',
                    'tempDir'=> $template_url.'/public/resources'
                ]); 
            $template_url = base_path('/');
            //header footer
            $pdf->SetHTMLHeader('<img src="https://livebrims.bomra.co.bw/backend/resources/templates/headerm.png"/>');
            $pdf->SetHTMLFooter('<img src="https://livebrims.bomra.co.bw/backend/resources/templates/footer.png"/>');
            // $pdf = new PdfLettersProvider();
            $pdf->setMargins(0,0,0,true);
            $pdf->AddPage('P','','','','',7,7,40,50,5,20);
            //letter data
            $ref = '';
            if($module_id == 1){
                if($app_data->section_id == 4){
                    $Products = DB::table('tra_exemption_products as t1')
                            ->leftJoin('tra_manufacturers_information as t3', 't1.manufacturer_id', 't3.id')
                            ->leftJoin('tra_approval_recommendations as a3', 't1.application_code', 'a3.application_code')
                            ->where('t1.application_code', $application_code)
                            ->select(DB::raw("t3.name as manufacturer, t1.*, to_char(a3.approval_date::date, 'DD/MM/YYYY') as approved_on"))
                            ->get();

                    
                    $ref ='<p style="font-family: gilsun; font-size: 16px;">'."<b><u> RE: Rejection of Request for Exemption from Registration in Botswana</u></b></p>";
                }else{
                    $Products = [];
                     $ref ='<p style="font-family: gilsun; font-size: 16px;">'."<b><u> RE: Rejection of Request for Exemption from Registration in Botswana</u></b></p>";
                }
               
                //add query header tag
                $template = '<p style="margin: 0; font-family: gilsun; font-size: 16px;">'."Please be advised that your registration exemption request for the products above has been rejected because the of following:</p>";

                $table = '
                    <table border="1" style="width: 100%;">
                        <tbody>
                        <tr>
                            <td>SN</td>
                            <td>Name of Medical Device</td>
                            <td>Name of Manufacturer (s)</td>
                            <td>Quantity</td>
                        </tr>';
                $sn = 1;
                foreach ($Products as $Product) {
                     $table .='
                            <tr>
                                <td>'.$sn.'</td>
                                <td>'.$Product->brand_name.' ('.$Product->common_name.') '.'</td>
                                <td>'.$Product->manufacturer.'</td>
                                <td>'.$Product->quantity_requested.'</td>
                            </tr>';
                    $sn++;
                }
                $table .= '</tbody></table>';

            }else{
                $ref = "no ref";
                $template = "no template intro";
                $table = '
                    <table border="1">
                        <tbody>
                        <tr>
                            <td>SN</td>
                            <td>Name of Medical Device</td>
                            <td>Name of Manufacturer (s)</td>
                            <td>Quantity</td>
                        </tr>
                        </tbody></table>';
            }
            $reason_for_rejection = $reason_for_rejection->remarks;
            $reason_for_rejection = str_replace('font','f', $reason_for_rejection);
            $reason_for_rejection = "<div style='margin: 0; align:justify; font-family: gilsun; font-size: 16px;'>".$reason_for_rejection."</div><br/>";
            
            $ft =  DateTime::createFromFormat("DD/MM/YYYY", $app_data->approved_on);
            $dt = strtotime($ft);
            $year = date("Y", $dt);
            $month = date("F", $dt);
            $day = date("d", $dt);
            // if($query_details->approval_decision_id == 1){
            //     $pdf->SetWatermarkText('Pending Approval');
            //     $pdf->showWatermarkText = true; last_query
            // }
            //$pdf->Cell(0,5,'',0,1);
            $pdf->SetFont('gilsun','B',12);
            
            $pdf->Cell(0, 10, 'REF: '.$section_code.' ('.$app_data->tracking_no.')', 0, 0, 'L'); 
            $pdf->SetFont('gilsun','',12);

            $pdf->SetFont('gilsun','',12);
            $application_no = '';

            if($app_data->tracking_no != ''){
                
                $application_no =   $app_data->tracking_no;
                
            }
            if($app_data->reference_no != ''){

                $application_no .=  ' '.$app_data->reference_no;
            }
            $pdf->SetFont('gilsun','B',12);
            $pdf->Cell(0,10, $app_data->approved_on,0,1, 'R');
            $pdf->SetFont('gilsun','',12);
            $data = '{"tracking_no":'.$app_data->tracking_no.',"module_id":'.$module_id.',"application_code":'.$application_code.'}';

            $styleQR = array('border' => false, 'padding' => 0, 'fgcolor' => array(0, 0, 0), 'bgcolor' => false);
            $pdf->SetFont('gilsun','',12);

            //Letter heading 
            //$pdf->Cell(0,8,$app_data->name.',',0,1); <p style="font-family: gilsun; font-size: 47px;">
            $address = '<br/><p style="width: 75%;margin: 0; font-family: gilsun; font-size: 16px;">'.$app_data->name.'<br>';
            if($app_data->physical_address != ''){
                $address .= $app_data->physical_address;
            }    
            $pdf->WriteHTML($address.'<br/>'.'<br/>');

            $pdf->SetFont('gilsun','',12);
            $pdf->Cell(0,8,'Dear Sir/Madam',0,1);
            $pdf->WriteHTML('<br/>'.$ref);
            $pdf->WriteHTML($table);
            $pdf->WriteHTML('<br/>'.$template);
            $pdf->WriteHTML($reason_for_rejection);

            $pdf->SetFont('gilsun','',12);

            $counter = 1;
            $is_live_signature=0;
            $sign_data='';
            $query_date = Carbon::now();
            //update multiple queries 
            $ul = '<p style="margin: 0; font-family: gilsun; font-size: 16px;">';
            if($app_data->decision_id != 2 ){
                $pdf->SetWatermarkText('Pending Approval');
                $pdf->showWatermarkText = true;
                $check_if_watermarked = true;
            } 
            
            $template = "<p style='margin: 0; align:justify; font-family: gilsun; font-size: 16px;'>Your anticipated cooperation is highly appreciated.</b></p>";
            $pdf->WriteHTML($template); 


            
            // $pdf->Cell(0, 0,'Printed on '.$day.' day of '.$month.', '.$year, 0, 1, '', 0, '', 3);
            // $pdf->cell(0,8,'',0,1);
            $startY = $pdf->y;
            $startX =$pdf->x;
            // $signiture = getcwd() . '/backend/resources/templates/signatures_uploads/dg_sinatory.png';
            //$pdf->Image($signiture,$startX+75,$startY-7,30,12);
            $pdf->Image($app_data->sign_file,$startX+7,$startY+7,30,12);
            $pdf->cell(10,5,'',0,1);
            $pdf->Cell(1, 4, '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _',0,1);
            $pdf->cell(10,5,'',0,1);
            $pdf->WriteHTML('<b>'.$app_data->approved_by.'</b>');
            $pdf->cell(5, 3,'',0,1);
            $pdf->WriteHTML('<b>FOR/CHIEF EXECUTIVE OFFICER</b>');

        }catch (\Exception $exception) {
            dd($exception->getMessage());
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            dd($throwable->getMessage());
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
        }
        return response($pdf->Output('Rejection Letter ('.$application_no.').pdf',"I"),200)->header('Content-Type','application/pdf');                                                           
    }
  
}

