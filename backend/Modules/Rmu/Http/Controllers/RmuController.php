<?php

namespace Modules\Rmu\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RmuController extends Controller
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
                    echo json_encode($res);
                    exit();
                }
                $this->user_id = \Auth::user()->id;
                return $next($request);
            });
        }
    }
    public function getRMUReceivedSubmissions(Request $request)
    {
        $module_id = $request->input('module_id');
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $user_id = $this->user_id;
        $is_initial = $request->is_initial;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);
            $qry = DB::table('tra_rmu_submissions as t1')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t1.application_code', '=', 't7.application_code')
                        ->on('t1.workflow_stage_id', '=', 't7.current_stage');
                })
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('wf_processes as t4', 't7.process_id', '=', 't4.id')
                ->leftJoin('wf_workflow_stages as t5', 't7.current_stage', '=', 't5.id')
                ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->leftJoin('users as t8', 't7.usr_from', '=', 't8.id')
                ->leftJoin('users as t9', 't7.usr_to', '=', 't9.id')
                ->leftJoin('par_rmu_submission_categories as t10', 't1.rmu_submission_category_id', 't10.id')
                ->select(DB::raw("t7.date_received, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),' ',decryptval(t9.last_name,".getDecryptFunParams().")) as to_user,  t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id,
                    t6.name as application_status, t3.name as applicant_name, t4.name as process_name, t5.name as workflow_stage, t5.is_general, t3.contact_person,
                    t3.tpin_no, t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id, t3.physical_address as app_physical_address,
                    t3.postal_address as app_postal_address, t3.telephone_no as app_telephone, t3.fax as app_fax, t3.email as app_email, t3.website as app_website,t10.name as submission_category, working_days(date(t7.date_received) , CURRENT_DATE) as total_days,
                    t1.*"))
                ->where('t5.stage_status','<>',3)
                ->where('is_done', 0);

            $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (validateIsNumeric($workflow_stage_id)) {

                $qry->where('t7.current_stage', $workflow_stage_id);
            }
            if (validateIsNumeric($is_initial)) {

                $qry->where('t1.application_status_id', 1);
            }

            $qry->where('t7.is_done', 0);
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }
    public function saveRMUReceivingBaseDetails(Request $req){
        $process_id = $req->process_id;
        $workflow_stage_id = $req->workflow_stage_id;
        $active_application_id = $req->active_application_id;
        $applicant_id = $req->applicant_id;
        $module_id = $req->module_id;
        $sub_module_id = $req->sub_module_id;
        $section_id = $req->section_id;
        $rmu_id = $req->rmu_id;
        $rmu_submission_category_id = $req->rmu_submission_category_id;
        $remarks = $req->remarks;
        $table_name = $req->table_name;
        $reg_serial = $req->reg_serial;
        $data = $req->all();
        $user_id = $this->user_id;
        //unset data 
        unset($data['active_application_id']);
        unset($data['_token']);
        unset($data['rmu_id']);
        unset($data['table_name']);
        unset($data['local_applicant_id']);

        try{
            if (validateIsNumeric($active_application_id)) {
                //update
                $applications_table = 'tra_rmu_submissions';
                $where_app = array(
                    'id' => $active_application_id
                );
                $app_details = array();
                if (recordExists($applications_table, $where_app)) {
                    //update data
                    updateRecord($applications_table, $where_app, $data, $user_id);
                }

                //get existing data
                $app_details = getPreviousRecords($applications_table, $where_app);
                if ($app_details['success'] == false) {
                    DB::rollBack();
                    return $app_details;
                }
                $app_details = $app_details['results'];

                $application_code = $app_details[0]['application_code'];//$app_details->application_code;
                $tracking_no = $app_details[0]['tracking_no'];
                $ref_number = $app_details[0]['reference_no'];//$app_details->reference_no;

                initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);

                $res['active_application_id'] = $active_application_id;
                $res['active_application_code'] = $application_code;
                $res['ref_no'] = $tracking_no;
                $res['tracking_no'] = $tracking_no;
                $res['success'] = true;
                $res['message'] = 'All is well';
                DB::commit();
            } else {

                    $data['created_by'] = \Auth::user()->id;
                    $data['created_on'] = Carbon::now();
                    $applications_table = 'tra_rmu_submissions';

                    $application_code = generateApplicationCode($sub_module_id, $applications_table);
                    $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                    $codes_array = array(
                        'section_code' => getSingleRecordColValue('par_sections', array('id' => $section_id), 'code'),
                        'category_code' => getSingleRecordColValue('par_rmu_submission_categories', array('id' => $req->rmu_submission_category_id), 'code'),
                        'file_no' => getSingleRecordColValue('par_rmu_record_file', array('id' => $req->file_name_id), 'code')
                    );

                   $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id, 1, $user_id);
                    if ($tracking_details['success'] == false) {
                        DB::rollBack();
                        return \response()->json($tracking_details);
                    }
                    $tracking_no = $tracking_details['tracking_no'];
                    

                    //registration serial
                    if(!validateIsNumeric($reg_serial)){
                        $reg_serial = getRegistrationSerial($module_id);
                    }                    
                    $view_id = generateApplicationViewID();
                    
                    //add autogenerated data
                    $data['application_code'] = $application_code;
                    $data['tracking_no'] = $tracking_no;
                    $data['view_id'] = $view_id;
                    $data['reg_serial'] = $reg_serial;
                    $data['date_added'] = Carbon::now();
                    $data['application_status_id'] = $application_status->status_id;

                    //application details
                    $res = insertRecord('tra_rmu_submissions', $data, $user_id);
                    if ($res['success'] == false) {
                            DB::rollBack();
                            return $res;
                        }
                    //duplicate to portal
                    // insertRecord('wb_product_applications', $app_data, $user_id, 'portal_db');

                    $active_application_id = $res['record_id'];
                   
                    //add to submissions table
                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => $process_id,
                        'application_code' => $application_code,
                        "tracking_no" => $tracking_no,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'section_id' => $section_id,
                        'application_status_id' => $application_status->status_id,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => 1,
                        'remarks' => 'Initial save of the submission',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'is_fast_track' => 2,
                        'created_by' => $user_id
                    );

                    $sub_res = insertRecord('tra_submissions', $submission_params);
                    if(!$sub_res['success']){
                        return $sub_res;
                    }
                    $res['active_application_id'] = $active_application_id;
                    $res['active_application_code'] = $application_code;
                    $res['rmu_id'] = $active_application_id;
                    $res['ref_no'] = $tracking_no;
                    $res['tracking_no'] = $tracking_no;

                    DB::commit();

                    // initialize function
                   initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
            }

        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function prepareNewRMUReceivingStage(Request $req)
    {

        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_rmu_submissions as t1')
                ->select('t1.*', 't1.id as mir_id')
                ->where('t1.id', $application_id);

            $qry1 = clone $main_qry;
            $qry1->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('tra_application_invoices as t4', function ($join) use ($application_code) {
                    $join->on('t1.id', '=', 't4.application_id')
                        ->on('t4.application_code', '=', 't4.application_code');
                })
                ->leftJoin('wf_workflow_stages as t5', 't1.workflow_stage_id', 't5.id')
                ->select('t1.*','t1.id as rmu_id', 't1.id as active_application_id',
                    't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't4.id as invoice_id', 't4.invoice_no', 't5.stage_category_id');

            $results = $qry1->first(); 

            $qry2 = clone $main_qry;
            $qry2->join('wb_trader_account as t3', 't1.local_agent_id', '=', 't3.id')
                ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            $ltrDetails = $qry2->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'ltrDetails' => $ltrDetails,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getRMUSubmissionActions(Request $req){
        $application_code = $req->input('application_code');

        try{
            $qry = DB::table('tra_rmu_submission_actions as t1')
                ->leftJoin('users as t8', 't1.created_by', '=', 't8.id')
                ->select(DB::raw("t1.*, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as author"));

            $results = $qry->get();
            
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getAdministrativeSubmissions(Request $req){
        $module_id = $req->input('module_id');
        $section_id = $req->input('section_id');
        $sub_module_id = $req->input('sub_module_id');
        $workflow_stage_id = $req->input('workflow_stage_id');
        $user_id = $this->user_id;
        $is_initial = $req->is_initial;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);
            $qry = DB::table('tra_rmu_submissions as t1')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t1.application_code', '=', 't7.application_code')
                        ->on('t1.workflow_stage_id', '=', 't7.current_stage');
                })
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('wf_processes as t4', 't7.process_id', '=', 't4.id')
                ->leftJoin('wf_workflow_stages as t5', 't7.current_stage', '=', 't5.id')
                ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->leftJoin('users as t8', 't7.usr_from', '=', 't8.id')
                ->leftJoin('users as t9', 't7.usr_to', '=', 't9.id')
                ->leftJoin('par_rmu_submission_categories as t10', 't1.rmu_submission_category_id', 't10.id')
                ->leftJoin('par_departments as t11', 't1.department_id', 't11.id')
                ->leftJoin('tra_rmu_administrative_responses as t12', 't1.application_code', 't12.application_code')
                ->leftJoin('tra_rmu_responses_approvals as t13', 't1.application_code', 't13.application_code')
                ->leftJoin('par_rmu_agencies as t14', 't1.agency_id', 't14.id')
                ->select(DB::raw("t7.date_received, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as submitted_by,CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),' ',decryptval(t9.last_name,".getDecryptFunParams().")) as to_user,  t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t1.date_added,t11.name as department_name,
                    t6.name as application_status, t3.name as applicant_name, t4.name as process_name, t5.name as workflow_stage, t5.is_general,t5.stage_category_id, t3.contact_person,
                    t3.tpin_no, t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id, t3.physical_address as app_physical_address,
                    t3.postal_address as app_postal_address, t3.telephone_no as app_telephone, t3.fax as app_fax, t3.email as app_email, t3.website as app_website,t10.name as category, working_days(date(t7.date_received) , CURRENT_DATE) as total_days, t7.date_received as submitted_on, CASE WHEN t12.id > 0 THEN true ELSE false end has_response,t12.response ,t12.subject, t12.salutation, t12.address, t13.id as approval_id,t13.comment, t13.reason_for_rejection, t13.sign_file, t13.approval_date, t13.decision_id, CONCAT(t14.name, ',', t14.physical_address) as default_address, t1.*"))
                ->where('t5.stage_status','<>',3)
                ->where('is_done', 0);

            $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (validateIsNumeric($workflow_stage_id)) {

                $qry->where('t7.current_stage', $workflow_stage_id);
            }
            if (validateIsNumeric($is_initial)) {

                $qry->where('t1.application_status_id', 1);
            }

            $qry->where('t7.is_done', 0);
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveResponse(Request $req){
        $application_code = $req->input('application_code');
        $response = $req->response;
        $subject = $req->subject;
        $address = $req->address;
        $salutation = $req->salutation;
        $user_id = $this->user_id;
        try{
            //delete response if exist
            deleteRecord('tra_rmu_administrative_responses', ['application_code'=>$application_code]);
            //insert
            $data = [
                'application_code'=>$application_code, 
                'prepared_by' => $user_id, 
                'response'=>$response, 
                'subject' => $subject,
                'salutation' => $salutation,
                'address' => $address
            ];
            $res = insertRecord('tra_rmu_administrative_responses', $data);
            
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getRMUApplicationMoreDetails(Request $request)
    {
        $application_code = $request->input('application_code');

        try {
            $qry = DB::table('tra_rmu_submissions as t1')
                ->select('t1.id as rmu_id', 't1.*')
                ->where('t1.application_code', $application_code);

            $rmu_details = $qry->first();
            if(isset($rmu_details->applicant_id)){
                $qry2 = DB::table('wb_trader_account as t3')
                    ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website')
                    ->where('id', $rmu_details->applicant_id);

                $applicant_details = $qry2->first();
            }else{
                $applicant_details = [];
            }
            
            $res = array(
                'success' => true,
                'rmu_details' => $rmu_details,
                'applicant_details' => $applicant_details,
                'branch_id' => 1,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
   public function saveResponseApproval(Request $req) {
        $application_code = $req->input('application_code');
        $comment = $req->comment;
        $reason_for_rejection = $req->reason_for_rejection;
        $sign_file = $req->sign_file;
        $approval_id = $req->approval_id;
        $user_id = $this->user_id;

        $data = array(
            'comment' =>$comment,
            'reason_for_rejection' => $reason_for_rejection,
            'sign_file' => $sign_file,
            'approval_date' => Carbon::now(),
            'approved_by' => $user_id,
            'application_code' =>$req->application_code,
            'decision_id' =>$req->decision_id
        ); 
        
        try{
            if(validateIsNumeric($approval_id)){//update
                $res = updateRecord('tra_rmu_responses_approvals', ['id'=>$approval_id], $data);
            }else{//insert
                $res = insertRecord('tra_rmu_responses_approvals', $data);
            }
            
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getAdministrativeSubmissionsRegister(Request $req){
        $module_id = $req->input('module_id');
        $section_id = $req->input('section_id');
        $sub_module_id = $req->input('sub_module_id');
        $workflow_stage_id = $req->input('workflow_stage_id');
        $record_group_id = $req->input('record_group_id');
        $file_name_id = $req->input('file_name_id');
        $rmu_submission_category_id = $req->input('rmu_submission_category_id');
        $department_id = $req->input('department_id');
        $agency_id = $req->input('agency_id');
        $user_id = $this->user_id;
       // $is_initial = $req->is_initial;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $filter = $req->input('filter');
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'tracking_no' :
                            $whereClauses[] = "(t1.tracking_no ILIKE '%" . ($filter->value) . "%' OR t1.reference_no ILIKE '%" . ($filter->value) . "%' )";
                            break;
                        case 'reference_no' :
                            $whereClauses[] = "(t1.tracking_no ILIKE '%" . ($filter->value) . "%' OR t1.reference_no ILIKE '%" . ($filter->value) . "%' )";
                            break;
                        case 'applicant_name' :
                            $whereClauses[] = "t3.name ILIKE '%" . ($filter->value) . "%'";
                            break;

                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
                
            }
        }
        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);
            $qry = DB::table('tra_rmu_submissions as t1')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t1.application_code', '=', 't7.application_code')
                        ->on('t1.workflow_stage_id', '=', 't7.current_stage');
                })
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('wf_processes as t4', 't7.process_id', '=', 't4.id')
                ->leftJoin('wf_workflow_stages as t0', 't7.previous_stage', '=', 't0.id')
                ->leftJoin('wf_workflow_stages as t5', 't7.current_stage', '=', 't5.id')
                ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->leftJoin('users as t8', 't7.usr_from', '=', 't8.id')
                ->leftJoin('users as t9', 't7.usr_to', '=', 't9.id')
                ->leftJoin('par_rmu_submission_categories as t10', 't1.rmu_submission_category_id', 't10.id')
                ->leftJoin('par_departments as t11', 't1.department_id', 't11.id')
                ->leftJoin('tra_rmu_administrative_responses as t12', 't1.application_code', 't12.application_code')
                ->leftJoin('tra_rmu_responses_approvals as t13', 't1.application_code', 't13.application_code')
                ->leftJoin('par_rmu_record_file as t14', 't1.file_name_id', 't14.id')
                ->leftJoin('par_rmu_record_group as t15', 't1.record_group_id', 't15.id')
                ->leftJoin('par_rmu_agencies as t16', 't1.agency_id', 't16.id')
                ->select(DB::raw("t7.date_received, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),' ',decryptval(t9.last_name,".getDecryptFunParams().")) as to_user,  t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t1.date_added,t11.name as department_name,
                    t6.name as application_status, t3.name as applicant_name, t4.name as process_name, t5.name as workflow_stage,t0.name as prev_stage, t5.is_general,t5.stage_category_id, t3.contact_person,
                    t3.tpin_no, t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id, t3.physical_address as app_physical_address,
                    t3.postal_address as app_postal_address, t3.telephone_no as app_telephone, t3.fax as app_fax, t3.email as app_email, t3.website as app_website,t10.name as category,t15.name as record_group,t14.name as file,t16.name as agency,working_days(date(t7.date_received) , CURRENT_DATE) as total_days, t7.date_received as submitted_on, CASE WHEN t12.id > 0 THEN true ELSE false end has_response,t12.response, t13.id as approval_id,t13.comment, t13.reason_for_rejection, t13.sign_file, t13.approval_date, t13.decision_id,
                    t1.*"));
                // ->where('t5.stage_status','<>',3)
                // ->where('is_done', 0);

            $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (validateIsNumeric($workflow_stage_id)) {

                $qry->where('t7.current_stage', $workflow_stage_id);
            }
            if (validateIsNumeric($record_group_id)) {

                $qry->where('t1.record_group_id', $record_group_id);
            }
            if (validateIsNumeric($file_name_id)) {

                $qry->where('t1.file_name_id', $file_name_id);
            }
            if (validateIsNumeric($rmu_submission_category_id)) {

                $qry->where('t1.rmu_submission_category_id', $rmu_submission_category_id);
            }
            if (validateIsNumeric($department_id)) {

                $qry->where('t1.department_id', $department_id);
            }
            if (validateIsNumeric($agency_id)) {

                $qry->where('t1.agency_id', $agency_id);
            }

            //$qry->where('t7.is_done', 0);
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
}
