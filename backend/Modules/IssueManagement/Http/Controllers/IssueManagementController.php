<?php

namespace Modules\IssueManagement\Http\Controllers;

use App\Models\WfProcess;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\Reports\Providers\PdfProvider;
use Modules\IssueManagement\Entities\IssueStatus;
use Modules\IssueManagement\Entities\IssueManagement;
use Modules\IssueManagement\Entities\IssueManagementAudit;
use Modules\IssueManagement\Entities\IssueManagementOrgArea;
use Modules\IssueManagement\Entities\IssueManagementDocument;
use Modules\IssueManagement\Entities\IssueManagementRelatedIssue;

class IssueManagementController extends Controller
{
    protected $user_id;
    public function __construct(Request $req)
    {
        $is_mobile = $req->input('is_mobile');
        if (is_numeric($is_mobile) && $is_mobile > 0) {
            $this->user_id = $req->input('user_id');
        } else {
            $this->middleware(function ($request, $next) {
                if (!Auth::check()) {
                    $res = array(
                        'success' => false,
                        'message' => '<p>NO SESSION, SERVICE NOT ALLOWED!!<br>PLEASE RELOAD THE SYSTEM!!</p>'
                    );
                    echo json_encode($res);
                    exit();
                }
                $this->user_id = Auth::user()->id;

                $method = $request->route()->getActionMethod();
                
                $req = $request;                
                $table_name = 'eqms_issue_management_logs';
                $user_id = $this->user_id;
                $application_code = $request->input('application_code') ?? $req->input('application_code') ?? null;
                $workflow_stage_id = $request->input('workflow_stage_id');
                $module_id = $request->input('module_id');
                $sub_module_id = $request->input('sub_module_id');
                $application_status_id = $request->input('application_status-id');
                $issue_status_id = $request->input('issue_status_id');
                $issue_type_id = $request->input('issue_type_id');
                $created_on = Carbon::now();
                $id = $request->input('id');

                $action = '';
                switch ($method) {
                    case 'saveIssueDetails':
                        $action = 'Saved issue details';
                        break;
                    case 'submitIssueManagementApplication':
                        $action = 'submitted issue management application';
                        break;
                    case 'saveIssueManagementDocuments':
                        $action = 'saved issue management documents';
                        break;
                    case 'saveIssueManagementRelatedIssues':
                        $action = 'saved issue management related issues';
                        break;
                    case 'saveIssueManagementAudits':
                        $action = 'saved issue management audits';
                        break;
                    default:
                        break;
                }

                
                if ($action != ''){
                    $table_data = array(
                        'user_id' => $user_id,
                        'application_code' => $application_code,
                        'action' => $action,
                        'ref_id' => $id,
                        'workflow_stage_id' => $workflow_stage_id,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'application_status_id' => $application_status_id,
                        'issue_status_id' => $issue_status_id,
                        'issue_type_id' => $issue_type_id,
                        'created_on' => $created_on,
                    );
    
                    DB::table($table_name)->insert($table_data);
                }
                

                return $next($request);
            });
        }

    }


    //  private function ActionLog($method, $request, $res)
    // {
    //     $this->user_id = Auth::user()->id;

    //             $method = $request->route()->getActionMethod();
                
    //             $req = $request;                
    //             $table_name = 'eqms_issue_management_logs';
    //             $user_id = $this->user_id;
    //             $application_code = $request->input('application_code') ?? $req->input('application_code') ?? null;
    //             $workflow_stage_id = $request->input('workflow_stage_id');
    //             $module_id = $request->input('module_id');
    //             $sub_module_id = $request->input('sub_module_id');
    //             $application_status_id = $request->input('application_status-id');
    //             $issue_status_id = $request->input('issue_status_id');
    //             $issue_type_id = $request->input('issue_type_id');
    //             $created_on = Carbon::now();
    //             //$id = $request->input('id');
    //             $id = $res['record_id'];

    //             $action = '';
    //             switch ($method) {
    //                 case 'saveIssueDetails':
    //                     $action = 'Saved issue details';
    //                     break;
    //                 case 'submitIssueManagementApplication':
    //                     $action = 'submitted issue management application';
    //                     break;
    //                 case 'saveIssueManagementDocuments':
    //                     $action = 'saved issue management documents';
    //                     break;
    //                 case 'saveIssueManagementRelatedIssues':
    //                     $action = 'saved issue management related issues';
    //                     break;
    //                 case 'saveIssueManagementAudits':
    //                     $action = 'saved issue management audits';
    //                     break;
    //                 default:
    //                     break;
    //             }

                
    //             if ($action != ''){
    //                 $table_data = array(
    //                     'user_id' => $user_id,
    //                     'application_code' => $application_code,
    //                     'action' => $action,
    //                     'ref_id' => $id,
    //                     'workflow_stage_id' => $workflow_stage_id,
    //                     'module_id' => $module_id,
    //                     'sub_module_id' => $sub_module_id,
    //                     'application_status_id' => $application_status_id,
    //                     'issue_status_id' => $issue_status_id,
    //                     'issue_type_id' => $issue_type_id,
    //                     'created_on' => $created_on,
    //                 );
    
    //                 DB::table($table_name)->insert($table_data);
    //             }
    // }


    public function getIssueTypeLogs(Request $request)
    {
        try {
            //$application_code = $request->input('application_code');
            $ref_id = $request->input('ref_id');
            if ($ref_id) {

                //get log entries
                $logs = DB::table('eqms_issue_types_logs as logs')
                    ->join('users as user', 'logs.user_id', '=', 'user.id')
                    ->join('par_issue_type_categories as categories', 'logs.issue_type_category_id', '=', 'categories.id')
                    ->select('logs.id as log_id', 
                             'user.email as user_name',
                             'logs.user_id', 
                             'logs.ref_id', 
                             'logs.title',
                             'logs.action',
                             'logs.description',
                             'logs.status_group_id',
                             'categories.title as issue_type_category_id',
                             //'user.email as submitted_by',
                             //'logs.is_enabled', 
                             'logs.created_on')
                //filter logs by id
                
                    ->where('logs.ref_id', '=', $ref_id)
                    ->orderBy('logs.created_on', 'desc')
                    ->get();
            } else {
               
                $logs = collect([]);
            }
    
            $res = [
                'success' => true,
                'results' => $logs,
            ];
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
    
        return response()->json($res);
    }


    public function getIssueLogs(Request $request)
    {
        try {
            $application_code = $request->input('application_code');
            //$ref_id = $request->input('ref_id');
            if ($application_code) {

                //get log entries
                $logs = DB::table('eqms_issue_management_logs as logs')
                    ->join('users as user', 'logs.user_id', '=', 'user.id')
                    ->leftJoin('wf_workflow_stages as workflow', 'logs.next_stage', '=', 'workflow.id')
                    ->leftJoin('par_issue_statuses as status', 'logs.issue_status_id', '=', 'status.id')
                    ->leftJoin('par_issue_types as types', 'logs.issue_type_id', '=', 'types.id')
                    ->select('logs.id as log_id', 
                             'user.email as user_name',
                             'logs.user_id', 
                             'logs.ref_id',
                             'logs.application_code',
                             'logs.process_name',
                             'logs.current_stage_name',
                             'user.email as responsible_user', 
                             'workflow.name as next_stage',
                             'workflow.name as workflow_stage_id',
                             'logs.application_status_id',
                             'status.title as issue_status_id',
                             'logs.action',
                             'types.title as issue_type_id',
                             //'logs.is_enabled', 
                             'logs.created_on')
                //filter logs by id
                
                    ->where('logs.application_code', '=', $application_code)
                    ->orderBy('logs.created_on', 'desc')
                    ->get();
            } else {
               
                $logs = collect([]);
            }
    
            $res = [
                'success' => true,
                'results' => $logs,
            ];
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
    
        return response()->json($res);
    }


    public function getIssueTypeCategoriesLogs(Request $request)
    {
        try {
            //$application_code = $request->input('application_code');
            $ref_id = $request->input('ref_id');
            if ($ref_id) {

                //get log entries
                $logs = DB::table('eqms_issue_types_categories_logs as logs')
                    ->join('users as user', 'logs.user_id', '=', 'user.id')
                    ->select('logs.id as log_id', 
                             'user.email as user_name',
                             'logs.user_id', 
                             'logs.ref_id', 
                             'logs.title',
                             'logs.action',
                             'user.email as submitted_by',
                             //'logs.is_enabled', 
                             'logs.created_on')
                //filter logs by id
                
                    ->where('logs.ref_id', '=', $ref_id)
                    ->orderBy('logs.created_on', 'desc')
                    ->get();
            } else {
               
                $logs = collect([]);
            }
    
            $res = [
                'success' => true,
                'results' => $logs,
            ];
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
    
        return response()->json($res);
    }


    public function getIssueStatusesLogs(Request $request)
    {
        try {
            //$application_code = $request->input('application_code');
            $ref_id = $request->input('ref_id');
            if ($ref_id) {

                //get log entries
                $logs = DB::table('eqms_issue_statuses_logs as logs')
                    ->join('users as user', 'logs.user_id', '=', 'user.id')
                    ->join('par_issue_states as state', 'logs.issue_state_id', '=', 'state.id')
                    ->select('logs.id as log_id', 
                             'user.email as user_name',
                             'logs.user_id', 
                             'logs.ref_id', 
                             'logs.title',
                             'logs.action',
                             'state.title as issue_state_id',
                             'user.email as submitted_by',
                             //'logs.is_enabled', 
                             'logs.created_on')
                //filter logs by id
                
                    ->where('logs.ref_id', '=', $ref_id)
                    ->orderBy('logs.created_on', 'desc')
                    ->get();
            } else {
               
                $logs = collect([]);
            }
    
            $res = [
                'success' => true,
                'results' => $logs,
            ];
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
    
        return response()->json($res);
    }


    public function getIssueStatusGroupsLogs(Request $request)
    {
        try {
            
            $ref_id = $request->input('ref_id');
            if ($ref_id) {

                //get log entries
                $logs = DB::table('eqms_issue_status_groups_logs as logs')
                    ->join('users as user', 'logs.user_id', '=', 'user.id')
                    ->select('logs.id as log_id', 
                             'user.email as user_name',
                             'logs.user_id', 
                             'logs.ref_id', 
                             'logs.title',
                             'logs.action',
                             //'logs.is_enabled', 
                             'logs.created_on')
                //filter logs by id
                
                    ->where('logs.ref_id', '=', $ref_id)
                    ->orderBy('logs.created_on', 'desc')
                    ->get();
            } else {
               
                $logs = collect([]);
            }
    
            $res = [
                'success' => true,
                'results' => $logs,
            ];
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
    
        return response()->json($res);
    }


    public function saveIssueDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $process_id = $request->input('process_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $WfProcess = WfProcess::where('sub_module_id', $sub_module_id)->first();
        $section_id = $WfProcess->section_id;
        $application_code = $request->input('application_code');
        $active_application_id = $request->input('active_application_id');
        $user_id = $this->user_id;
        $view_id = generateApplicationViewID();
        $zone_id = $request->input('zone_id');

        $targetDateString = $request->target_resolution_date;
        $creationDateString = $request->creation_date;

        if ($request->follow_up_on) {
            $followupDateString = $request->follow_up_on;
            $followupDateString = Carbon::parse($followupDateString);
        }
        $targetDateString = Carbon::parse($targetDateString);
        $creationDateString = Carbon::parse($creationDateString);

        $issue_data = $request->all();

        try {
            if (validateIsNumeric($active_application_id)) {
                //Update
                $IssueManagement = IssueManagement::findOrFail($active_application_id);
                $issue_data['creation_date'] = $creationDateString->format('Y-m-d');
                $issue_data['target_resolution_date'] = $targetDateString->format('Y-m-d');
                $issue_data['dola'] = Carbon::now();
                $issue_data['altered_by'] = $user_id;
                $IssueManagement->update($issue_data);

            
                //End Update

                $IssueManagement = IssueManagement::from('tra_issue_management_applications as t1')
                    ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                    ->where('t1.id', $active_application_id)->select('t1.*', 't2.*', 't1.id as active_application_id')->first();
                if ($IssueManagement) {
                    $ref_number = $IssueManagement->reference_no;
                    
                    initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
                    $res = array(
                        "success" => true,
                        "message" => 'Data Updated Successfully!!',
                        "results" => $IssueManagement
                    );
                }
            } else {
                $applications_table = 'tra_issue_management_applications';
                $apptype_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code', '');
                $zone_code = getSingleRecordColValue('par_zones', array('id' => $zone_id), 'zone_code', '');
                $apptype_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code', '');
                $application_code = generateApplicationCode($sub_module_id, $applications_table, '');
                $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id', '');

                $codes_array = array(
                    'zone_code' => $zone_code,
                    'apptype_code' => $apptype_code
                );

                $ref_number = generateProductsRefNumber($ref_id, $codes_array, date('Y'), $process_id, $zone_id, $user_id);

                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                if ($application_status->status_id == '') {
                    $res = array(
                        'success' => false,
                        'message' => 'Please set initial application status of the application!!'
                    );
                    return \response()->json($res);
                }

                $submission_params = array(
                    'application_id' => $application_id,
                    'view_id' => $view_id,
                    'process_id' => $process_id,
                    'application_code' => $application_code,
                    'reference_no' => $ref_number,
                    'tracking_no' => $ref_number,
                    'usr_from' => $user_id,
                    'usr_to' => $user_id,
                    'previous_stage' => $workflow_stage_id,
                    'current_stage' => $workflow_stage_id,
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'application_status_id' => $application_status->status_id,
                    'urgency' => 1,
                    'applicant_id' => 0,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id,
                    'section_id' => $section_id
                );
                $res = insertRecord('tra_submissions', $submission_params, $user_id, '');

                $IssueManagement = new IssueManagement();
                $issue_data['creation_date'] = $creationDateString->format('Y-m-d');
                $issue_data['target_resolution_date'] = $targetDateString->format('Y-m-d');
                $issue_data['created_on'] = Carbon::now();
                $issue_data['dola'] = Carbon::now();
                $issue_data['created_by'] = $user_id;
                $issue_data['altered_by'] = $user_id;
                $issue_data['application_code'] = $application_code;
                $issue_data['submission_id'] = $res['record_id'];
                $issue_data['workflow_stage_id'] = $request->workflow_stage_id;
                $issue_data['application_status_id'] = $application_status->status_id;
                $issue_data['reference_no'] = $ref_number;
                $issue_data['tracking_no'] = $ref_number;
                $issue_data['process_id'] = $process_id;
                $IssueManagement->create($issue_data);
                if ($IssueManagement) {
                    $IssueManagement = IssueManagement::from('tra_issue_management_applications as t1')
                        ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                        ->where('t1.submission_id', $res['record_id'])->select('t1.*', 't2.*', 't1.id as active_application_id')->first();

                    initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
                    $res = array(
                        "success" => true,
                        "message" => 'Data Saved Successfully!!',
                        "results" => $IssueManagement
                    );
                }
            }
        } catch (\Exception $exception) {
            DB::rollback();
            $res = array(
                "success" => false,
                "message" => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }


    public function getIssueManagementDetails(Request $request)
    {
        $issue_type_id = $request->input("issue_type_id");
        try {
            $qry = IssueManagement::from('tra_issue_management_applications as t1')
                ->leftjoin('tra_submissions as t2', 't1.submission_id', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                ->leftjoin('wf_processes as t4', 't2.process_id', '=', 't4.id')
                ->join('par_issue_statuses as t5', 't1.issue_status_id', 't5.id')
                ->join('users as t6', 't1.created_by', 't6.id')
                ->select(
                    't2.*',
                    't1.*',
                    't3.name as workflow_stage',
                    't4.name as process_name',
                    't1.created_on as raised_date',
                    't5.title as issue_status',
                    't1.id as active_application_id',
                    't1.workflow_stage_id',
                    't1.id as issue_id',
                    't6.first_name',
                    't6.last_name'
                );
            if (validateIsNumeric($issue_type_id)) {
                $qry->where('t1.issue_type_id', $issue_type_id);
            }
            $results = $qry->get();

            $results = convertStdClassObjToArray($results);
            $results = decryptArray($results);

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well!!'
            );
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }


    public function getCorrectiveIssueManagementDetails(Request $request)
    {
        $issue_type_id = $request->input("issue_type_id");
        try {
            $qry = IssueManagement::from('tra_issue_management_applications as t1')
                ->leftjoin('tra_submissions as t2', 't1.submission_id', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                ->leftjoin('wf_processes as t4', 't2.process_id', '=', 't4.id')
                ->join('par_issue_statuses as t5', 't1.issue_status_id', 't5.id')
                ->join('users as t6', 't1.created_by', 't6.id')
                ->select(
                    't2.*',
                    't1.*',
                    't3.name as workflow_stage',
                    't4.name as process_name',
                    't1.created_on as raised_date',
                    't5.title as issue_status',
                    't1.id as active_application_id',
                    't1.workflow_stage_id',
                    't1.id as issue_id',
                    't6.first_name',
                    't6.last_name'
                )
                ->where('t1.issue_type_id', 4)
                ->get();
            if (validateIsNumeric($issue_type_id)) {
                $qry->where('t1.issue_type_id', $issue_type_id);
            }
            //$results = $qry->get();

            $results = convertStdClassObjToArray($qry);
            $results = decryptArray($results);

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well!!'
            );
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function getIssueManagementDetailsById($active_application_id)
    {
        try {
            $results = IssueManagement::from('tra_issue_management_applications as t1')
                ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                ->leftjoin('wf_processes as t4', 't2.process_id', '=', 't4.id')
                ->join('par_issue_statuses as t5', 't1.issue_status_id', 't5.id')
                ->join('users as t6', 't1.created_by', 't6.id')
                ->select(
                    't2.*',
                    't1.*',
                    't3.name as workflow_stage',
                    't4.name as process_name',
                    't1.created_on as raised_date',
                    't5.title as issue_status',
                    't1.id as active_application_id',
                    't2.current_stage as workflow_stage_id',
                    't6.first_name',
                    't6.last_name'
                )
                ->where('t1.id', $active_application_id)
                ->first();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well!!'
            );
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function getIssueProcessDetails(Request $request)
    {
        $rules = array(
            'issue_type_id' => 'required'
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $results = WfProcess::where('issue_type_id', $request->issue_type_id)->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well!!'
            );
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function submitIssueManagementApplication(Request $request)
    {
        try {
            $active_application_id = $request->active_application_id;

            $IssueManagement = IssueManagement::findOrFail($active_application_id);
            $issue_status_id = 1;
            if ($IssueManagement->complaint_fully_addressed == "1") {
                $IssueStatus = IssueStatus::where('title', 'Closed')->first();
                $issue_status_id = $IssueStatus->id ?: 7;
                $date_closed = Carbon::now();
            } else {
                $IssueStatus = IssueStatus::where('title', 'In Progress')->first();
                $issue_status_id = $IssueStatus->id ?: 2;
                $date_closed = null;
            }

            if ($IssueManagement) {
                $IssueManagement->fill([
                    'issue_status_id' => $issue_status_id,
                    'dola' => Carbon::now(),
                    'altered_by' => $this->user_id,
                    'date_closed' => $date_closed
                ]);
                $IssueManagement->save();

                $res = array('success' => true, 'message' => 'validated');
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getIssueManagementDocuments(Request $request)
    {
        try {
            $res = IssueManagementDocument::from('tra_issue_management_documents as t1')
                ->leftJoin('tra_issue_management_applications as t2', 't1.issue_id', 't2.id')
                ->leftJoin('tra_documentmanager_application as t3', 't1.document_id', 't3.id')
                ->leftJoin('tra_application_uploadeddocuments as t4', 't1.upload_id', 't4.id')
                ->where('issue_id', $request->issue_id)
                ->select(
                    't1.*',
                    DB::raw('COALESCE(t3.doc_title, t4.initial_file_name) as title'),
                    't3.reference_no',
                    't3.doc_version as version',
                    't4.initial_file_name',
                    't4.application_code',
                    't4.node_ref'
                )
                ->get();

        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }
    public function saveIssueManagementDocuments(Request $request)
    {
        try {
            $active_application_id = $request->active_application_id;
            $application_id = $request->application_id;
            $application_code = $request->application_code;
            $type = $request->type;
            if (is_numeric($application_id) && is_numeric($application_code)) {
                $documentdata = DB::table('tra_application_uploadeddocuments')->where('id', $application_id)->first();
                $issuedata = IssueManagement::where('application_code', $application_code)->first();
                $data = array(
                    'issue_id' => $issuedata->id,
                    'upload_id' => $application_id,
                    'type' => 'Attached file',
                    'dola' => Carbon::now(),
                    'altered_by' => $this->user_id,
                );
                $IssueManagementDocument = new IssueManagementDocument();
                $IssueManagementDocument->create($data);
            }
            if (is_numeric($active_application_id)) {
                $document_data = json_decode($request->document_ids, true);
                foreach ($document_data as $document) {
                    $data = array(
                        'issue_id' => $active_application_id,
                        'document_id' => $document,
                        'type' => $type,
                        'dola' => Carbon::now(),
                        'altered_by' => $this->user_id,
                    );
                    $IssueManagementDocument = new IssueManagementDocument();
                    $IssueManagementDocument->create($data);
                }
            }
            $IssueManagementDocument = IssueManagementDocument::all();
            $res = array(
                'success' => true,
                'message' => 'Saved Successfully!!',
                'results' => $IssueManagementDocument
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getIssueManagementRelatedIssues(Request $request)
    {
        try {
            $qry = IssueManagementRelatedIssue::from('tra_issue_management_related_issues as t1')
                ->leftJoin('tra_issue_management_applications as t2', 't1.issue_id', 't2.id')
                ->leftjoin('par_issue_statuses as t3', 't2.issue_status_id', 't3.id')
                ->leftjoin('par_issue_types as t4', 't2.issue_type_id', 't4.id')
                ->leftjoin('users as t5', 't2.created_by', 't5.id')
                ->where('t1.issue_id', $request->issue_id)
                ->select(
                    't1.*',
                    't2.reference_no',
                    't2.title',
                    't2.creation_date as raised_date',
                    't3.title as issue_status',
                    't4.title as issue_type',
                    't5.first_name',
                    't5.last_name'
                )
                ->get();
            $results = convertStdClassObjToArray($qry);
            $res = decryptArray($results);
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function saveIssueManagementRelatedIssues(Request $request)
    {
        try {
            $active_application_id = $request->active_application_id;
            if (is_numeric($active_application_id)) {
                $issue_data = json_decode($request->issue_ids, true);
                foreach ($issue_data as $issue) {
                    //Check if it exists
                    $IssueManagementRelatedIssue = IssueManagementRelatedIssue::where('issue_id', $active_application_id)
                        ->where('related_id', $issue)->first();
                    if ($IssueManagementRelatedIssue) {

                    } else {
                        $data = array(
                            'issue_id' => $active_application_id,
                            'related_id' => $issue,
                            'dola' => Carbon::now(),
                            'altered_by' => $this->user_id,
                        );
                        $IssueManagementRelatedIssue = new IssueManagementRelatedIssue();
                        $IssueManagementRelatedIssue->create($data);
                    }
                }
                $IssueManagementRelatedIssue = IssueManagementRelatedIssue::all();

                $res = array(
                    'success' => true,
                    'message' => 'Saved Successfully!!',
                    'results' => $IssueManagementRelatedIssue
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getIssueManagementAudits(Request $request)
    {
        try {
            $res = IssueManagementAudit::from('tra_issue_management_audits as t1')
                ->leftJoin('tra_auditsmanager_application as t2', 't1.audit_id', 't2.id')
                ->leftJoin('par_system_statuses as t3', 't2.application_status_id', 't3.id')
                ->leftJoin('par_qms_audit_types as t4', 't2.audit_type_id', 't4.id')
                ->leftJoin('par_audit_findings as t5', 't2.application_code', 't5.application_code')
                ->where('t1.issue_id', $request->issue_id)
                ->select(
                    't1.*',
                    't2.reference_no',
                    't2.audit_reference',
                    't2.audit_title',
                    't3.name as status',
                    't4.name as audit_type',
                    // DB::raw("IFNULL(COUNT(t5.id), 0) as findings")
                )
                ->get();
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function saveIssueManagementAudits(Request $request)
    {
        try {
            $active_application_id = $request->active_application_id;
            if (is_numeric($active_application_id)) {
                $issue_data = json_decode($request->audit_ids, true);
                foreach ($issue_data as $issue) {
                    //Check if it exists
                    $IssueManagementAudit = IssueManagementAudit::where('issue_id', $active_application_id)
                        ->where('audit_id', $issue)->first();
                    if ($IssueManagementAudit) {

                    } else {
                        $data = array(
                            'issue_id' => $active_application_id,
                            'audit_id' => $issue,
                            'dola' => Carbon::now(),
                            'altered_by' => $this->user_id,
                        );
                        $IssueManagementAudit = new IssueManagementAudit();
                        $IssueManagementAudit->create($data);
                    }
                }
                $IssueManagementAudit = IssueManagementAudit::all();

                $res = array(
                    'success' => true,
                    'message' => 'Saved Successfully!!',
                    'results' => $IssueManagementAudit
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getIssueManagementOrganisationalAreas(Request $request)
    {
        try {
            $res = IssueManagementOrgArea::from('tra_issue_management_organisational_areas as t1')
                ->leftJoin('par_departments as t2', 't1.department_id', 't2.id')
                ->where('t1.issue_id', $request->issue_id)
                ->select(
                    't1.*',
                    't2.name as title'
                )
                ->get();
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function saveIssueManagementOrganisationalAreas(Request $request)
    {
        try {
            $active_application_id = $request->active_application_id;
            if (is_numeric($active_application_id)) {
                $issue_data = json_decode($request->department_ids, true);
                foreach ($issue_data as $department_id) {
                    //Check if it exists
                    $IssueManagementOrgArea = IssueManagementOrgArea::where('issue_id', $active_application_id)
                        ->where('department_id', $department_id)->first();
                    if ($IssueManagementOrgArea) {

                    } else {
                        $data = array(
                            'issue_id' => $active_application_id,
                            'department_id' => $department_id,
                            'dola' => Carbon::now(),
                            'altered_by' => $this->user_id,
                        );
                        $IssueManagementOrgArea = new IssueManagementOrgArea();
                        $IssueManagementOrgArea->create($data);
                    }

                }
                $IssueManagementOrgArea = IssueManagementOrgArea::all();

                $res = array(
                    'success' => true,
                    'message' => 'Saved Successfully!!',
                    'results' => $IssueManagementOrgArea
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getActivity(Request $request)
    {
        try {
            $res = IssueManagement::from('tra_issue_management_applications as t1')
                ->join('tra_applications_transitions as t2', 't1.application_code', 't2.application_code')
                ->join('wf_workflow_stages as t3', 't2.from_stage', 't3.id')
                ->join('wf_workflow_stages as t4', 't2.to_stage', 't4.id')
                ->join('users as t5', 't2.author', 't5.id')
                ->where('t1.application_code', $request->application_code)
                ->select(
                    't2.id',
                    't3.name as from_stage',
                    't4.name as to_stage',
                    't5.first_name',
                    't5.last_name',
                    't2.remarks',
                    't2.created_on'
                )
                ->get();
            $res = convertStdClassObjToArray($res);
            $res = decryptArray($res);
        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                "success" => false,
                "message" => $throwable->getMessage()
            );
        }

        return \response()->json($res);
    }

    public function generateIssueReport(Request $request)
    {
        try {
            $application_code = $request->input('application_code');

            // Query to fetch the Issue
            $records = IssueManagement::from('tra_issue_management_applications as t1')
                ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                ->leftjoin('wf_processes as t4', 't2.process_id', '=', 't4.id')
                ->join('par_issue_statuses as t5', 't1.issue_status_id', 't5.id')
                ->join('users as t6', 't1.created_by', 't6.id')
                ->join('par_complaint_modes as t7', 't1.complaint_mode', 't7.id')
                ->join('par_departments as t8', 't1.office_assigned_to', 't8.id')
                ->select(
                    't2.*',
                    't1.*',
                    't7.name as complaint_mode',
                    't8.name as office_assigned',
                    't3.name as workflow_stage',
                    't4.name as process_name',
                    't1.created_on as raised_date',
                    't5.title as issue_status',
                    't1.id as active_application_id',
                    't2.current_stage as workflow_stage_id',
                    't6.first_name',
                    't6.last_name'
                )
                ->where('t1.application_code', $application_code)
                ->get();

            // Convert the result into an array
            $records = convertStdClassObjToArray($records);
            $records = decryptArray($records);

            // Check if there are any records returned
            if (empty($records)) {
                return response()->json(['success' => false, 'message' => 'No records found for the given application code']);
            }

            // Initialize the PDF provider
            $pdf = new PdfProvider();
            $pdf->AddPage();
            $pdf->SetFont('Times', '', 12);

            // Add an image centered above the header text (adjust paths as necessary)
            $logo = getcwd() . '/resources/images/logo.jpg';
            $logo = str_replace('\\', '/', $logo);
            $pdf->Image($logo, 85, 25, 43, 19);

            // Set the position for the header text
            $pdf->SetY(42);
            $pageWidth = $pdf->GetPageWidth();

            // Left-aligned header text
            $pdf->SetX(10);
            $pdf->Cell(0, 10, 'BOMRA/QM/P03/F01', 0, 0, 'L');

            // Center-aligned header text
            $pdf->SetX(($pageWidth / 2) - 80);
            $pdf->Cell(0, 10, 'Botswana Medicines Regulatory Authority', 0, 0, 'C');

            // Center-aligned second line of header text
            $pdf->SetX(($pageWidth / 2) - 80);
            $pdf->Cell(0, 20, 'Customer Complaints and Appeals Form', 0, 0, 'C');

            // Right-aligned header text
            $pdf->SetX($pageWidth - 90);
            $pdf->Cell(0, 10, 'Issue No. 4.0', 0, 0, 'R');

            $pdf->Ln(20);

            $html = '<table border="0" cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse;">';
            $html .= '<tr><th style="font-weight: bold;">Date:</th><td><u>' . date('Y-m-d') . '</u></td><th style="font-weight: bold;">Complaint No:</th><td>' . htmlspecialchars($records[0]['application_code']) . '</td></tr>';
            $html .= '<tr><th style="font-weight: bold;">Name of Complainant:</th><td><u>' . htmlspecialchars($records[0]['complainant_name']) . '</u></td>';
            $html .= '<th style="font-weight: bold;">Name of Organization:</th><td><u>' . htmlspecialchars($records[0]['complainant_organisation']) . '</u></td></tr>';
            $html .= '<tr><th style="font-weight: bold;">Address:</th><td><u>' . htmlspecialchars($records[0]['complainant_address']) . '</u></td>';
            $html .= '<th style="font-weight: bold;">Telephone:</th><td><u>' . htmlspecialchars($records[0]['complainant_telephone']) . '</u></td></tr>';
            $html .= '<tr><th style="font-weight: bold;">E-mail:</th><td colspan="3"><u>' . htmlspecialchars($records[0]['complainant_email']) . '</u></td></tr>';
            $html .= '<tr><th style="font-weight: bold;">Mode of Complaint:</th><td colspan="3"><u>' . htmlspecialchars($records[0]['complaint_mode']) . '</u></td></tr>';
            $html .= '</table>';



            $html .= '<br><table border="1" cellpadding="5" cellspacing="0" width="100%">';

            $html .= '<tr><td colspan="4"><b>Details of the complaint.</b><br>' . nl2br(htmlspecialchars($records[0]['description'])) . '</td></tr>';


            // Initial Review
            $html .= '<tr><td colspan="1"><b>Initial Review By Quality Office:</b></td><td colspan="3">Office Assigned to: <u>' . htmlspecialchars($records[0]['office_assigned']) . '</u></td></tr>';

            $html .= '<tr><td colspan="1"><b>Initial Review by:</b></td><td colspan="2">' . htmlspecialchars($records[0]['office_assigned']) . '</td><td><b>Date: </b>' . htmlspecialchars($records[0]['target_resolution_date']) . '</td></tr>';


            // Root Cause Analysis
            $html .= '<tr><td colspan="4"><b>Root Cause Analysis:</b> Complete Non-Conformity Form – <b>BOMRA/QM/P08/F01.</b></td></tr>';

            // Resolution and Approval
            $html .= '<tr><td colspan="4"><b>Resolution reached and communicated to the customer.</b><br>' . htmlspecialchars($records[0]['issue_resolution']) . '</td></tr>';


            // Verification of Effectiveness of Actions
            $html .= '<tr><td colspan="1"><b>Assigned Officer:</b></td><td colspan="2"></td><td><b>Date: </b>' . htmlspecialchars($records[0]['target_resolution_date']) . '</td></tr>';


            // End of table
            $html .= '</table>';

            // Appeals section
            $html .= '<h3>Appeals</h3>';
            $html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%">';
            // $html .= '<tr><th>Appeal Date:</th><td>' . htmlspecialchars($records[0]['appeal_date']) . '</td>';
            // $html .= '<th>Appeal No:</th><td>' . htmlspecialchars($records[0]['appeal_no']) . '</td></tr>';
            // $html .= '<tr><th>Details of the Appeal:</th><td colspan="3">' . htmlspecialchars($records[0]['appeal_details']) . '</td></tr>';
            // $html .= '<tr><th>Appeal Status:</th><td>' . htmlspecialchars($records[0]['appeal_status']) . '</td></tr>';
            $html .= '</table>';

            // Appeal verification
            $html .= '<h3>Verification by Quality Office</h3>';
            $html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%">';
            // $html .= '<tr><th>Verification by:</th><td>' . htmlspecialchars($records[0]['verification_by']) . '</td>';
            // $html .= '<th>Date:</th><td>' . htmlspecialchars($records[0]['verification_date']) . '</td></tr>';
            $html .= '</table>';

            // Write the HTML content to the PDF
            $pdf->writeHTML($html, true, false, true, false, '');

            // Output the PDF as a downloadable file
            return response()->stream(
                function () use ($pdf) {
                    $pdf->Output('Issue_Report.pdf', 'I'); // 'I' for inline display in browser
                },
                200,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="Issue_Report.pdf"',
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
