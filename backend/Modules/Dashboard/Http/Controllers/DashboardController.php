<?php

namespace Modules\Dashboard\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Modules\Dashboard\Entities\SystemGuideline;
class DashboardController extends Controller
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

    public function getInTrayItems(Request $request)
    {
          $res  =$this->getUserIntrayDashboard($request,true);
          return \response()->json($res);
    }
     public function getOutTrayItems(Request $request)
    {
        $res = $this->getOutTrayUserDetails($request,true);
        return \response()->json($res);
    }
    public function getExternalUserInTrayItems(Request $request)
    {
            $res  =$this->getUserIntrayDashboard($request,false);
          return \response()->json($res);
    }
    function getUserIntrayDashboard($request,$is_internaluser){

        $user_id = $this->user_id;
        //$limsusr_id = getLimsUserId($user_id);
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $branch_id = $request->input('branch_id');
        $application_status_id = $request->input('application_status_id');
        $is_management_dashboard = $request->input('is_management_dashboard');
        $start = $request->input('start');
        $limit = $request->input('limit');

        $whereClauses = array();
        $filter = $request->input('filter');
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
                            $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
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
            //DB::enableQueryLog();
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->leftJoin('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_submission_urgencies as t6', 't1.urgency', '=', 't6.id')
                ->leftJoin('users as t7', 't1.usr_from', '=', 't7.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->leftJoin('par_branches as t10', 't1.branch_id', '=', 't10.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id,t1.branch_id, t1.application_id as active_application_id, t2.name as process_name,t10.name as branch_name,t1.application_status_id,
                    t3.name as prev_stage, t4.name as workflow_stage,t4.is_general,t5.name as application_status,t6.name as urgencyName,t6.name as urgency_name,
                    CONCAT(decryptval(t7.first_name,".getDecryptFunParams()."),' ', decryptval(t7.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as to_user, working_days(date(date_received) , CURRENT_DATE) as time_span,
                    t9.name as applicant_name, '' as sample_analysis_status"))
                ->where('t4.stage_status','<>',3)
                ->where('is_done', 0);
           
               

                if($is_internaluser){
                    $assigned_groups = getUserGroups($user_id);
                    $is_super = belongsToSuperGroup($assigned_groups);
                      $assigned_stages = getAssignedProcessStages($user_id, $module_id);
                    if ($is_super) {
                        $qry->whereRaw('1=1');
                        $qry->limit(100);
                   } else {

                        //`$qry->where('t4.usr_to','=',$user_id);
                        $qry->where(function ($query) use ($user_id, $assigned_stages) {
                           $assigned_stages = convertArrayToString($assigned_stages);
                           $assigned_stages =rtrim($assigned_stages, ",");
                            $query->where('usr_to', $user_id)
                                    ->orWhereRaw("(t1.current_stage in ($assigned_stages) and t4.needs_responsible_user = 2)");
                        });
                    }
                }
                else{
                      $qry->where('t1.external_user_id', $user_id);
                }
            // $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);

            if (isset($section_id) && $section_id != '') {
                $qry->where('t1.section_id', $section_id);
            }
            if (isset($module_id) && $module_id != '') {
                $qry->where('t1.module_id', $module_id);
            }
            if (isset($sub_module_id) && $sub_module_id != '') {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.current_stage', $workflow_stage_id);
            }
            if (isset($branch_id) && $branch_id != '') {
                $qry->where('t1.branch_id', $branch_id);
            }
            if (isset($application_status_id) && $application_status_id != '') {
                $qry->where('t1.application_status_id', $application_status_id);
            }
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }else if(!validateIsNumeric($application_status_id) || !validateIsNumeric($module_id) || !validateIsNumeric($branch_id)){
              //  $qry->whereRAW(" if(t4.is_receipting_stage=1, t1.application_status_id = 11,1)");
            }
            $qry->orderBy('t1.is_fast_track', 'DESC');
            $qry2 = clone $qry;
            $total = $qry2->count();
            if(isset($start)&&isset($limit)){
                $results = $qry->skip($start)->take($limit)->get();
            }
            else{
                $results=$qry->get();
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well',
                'total' => $total
            );
        }
        catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;

    }
     public function getOutTrayUserDetails($request,$is_internaluser){

        $user_id = $this->user_id;
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        try {

        $whereClauses = array();
        $filter = $request->input('filter');
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'tracking_no' :
                            $whereClauses[] = "t1.tracking_no ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'reference_no' :
                            $whereClauses[] = "t1.reference_no ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'applicant_name' :
                            $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
                            break;
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->join('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->join('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_submission_urgencies as t6', 't1.urgency', '=', 't6.id')
                ->leftJoin('users as t7', 't1.usr_from', '=', 't7.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id, t1.application_id as active_application_id, t2.name as process_name,
                    t3.name as prev_stage, t4.name as workflow_stage,t5.name as application_status,t6.name as urgencyName,t6.name as urgency_name,
                    CONCAT(decryptval(t7.first_name,".getDecryptFunParams()."),decryptval(t7.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),decryptval(t8.last_name,".getDecryptFunParams().")) as to_user,
                    t9.name as applicant_name"))
                ->where('isComplete', 0);
            if($is_internaluser){
                $qry->where('usr_from',$user_id);

            }
            else{

                $qry->where('external_user_id',$user_id);
            }
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
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
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.current_stage', $workflow_stage_id);
            }
            $qry->orderBy('t1.id', 'desc');
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
        return $res;

    }
    public function getSystemGuidelines(Request $request)
    {
        $menu_id = $request->input('menu_id');
        try {
            $qry = SystemGuideline::where('menu_id', $menu_id);
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

    public function getDispatchedCorrespondence(Request $request)
    {
        $user_id = $this->user_id;
        try {
        $whereClauses = array();
        $filter = $request->input('filter');
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'tracking_no' :
                            $whereClauses[] = "t1.tracking_no ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'reference_no' :
                            $whereClauses[] = "t1.reference_no ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'applicant_name' :
                            $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
                            break;
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->join('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->join('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_submission_urgencies as t6', 't1.urgency', '=', 't6.id')
                ->leftJoin('users as t7', 't1.usr_from', '=', 't7.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->join('tra_dispatch_register as t10', 't1.application_code', '=', 't10.application_code')
                ->leftJoin('users as t11', 't10.dispatch_by', '=', 't11.id')
                ->leftJoin('par_modules as t12', 't1.module_id', '=', 't12.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id, t1.application_id as active_application_id, t2.name as process_name,
                    t3.name as prev_stage, t4.name as workflow_stage,t5.name as application_status,t6.name as urgencyName,t6.name as urgency_name,
                    CONCAT(decryptval(t7.first_name,".getDecryptFunParams()."),decryptval(t7.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),decryptval(t8.last_name,".getDecryptFunParams().")) as to_user,
                    t9.name as applicant_name, t10.dispatch_date, CONCAT(decryptval(t11.first_name,".getDecryptFunParams()."), ' ', decryptval(t11.last_name,".getDecryptFunParams().")) as dispatch_by, t12.name as module_name"))
                ->where('t4.stage_status', 3); //is final stage

            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
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
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.current_stage', $workflow_stage_id);
            }
            $qry->orderBy('t1.id', 'desc');
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

    public function saveDashCommonData(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    $res = updateRecord($table_name, $where, $table_data, $user_id);
                }
            } else {
                $res = insertRecord($table_name, $table_data, $user_id);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getCorrespondence(Request $request)
    {
        $user_id = $this->user_id;
        try {
        $whereClauses = array();
        $filter = $request->input('filter');
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'tracking_no' :
                            $whereClauses[] = "t1.tracking_no ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'reference_no' :
                            $whereClauses[] = "t1.reference_no ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'applicant_name' :
                            $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
                            break;
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->join('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->join('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_submission_urgencies as t6', 't1.urgency', '=', 't6.id')
                ->leftJoin('users as t7', 't1.usr_from', '=', 't7.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->leftJoin('tra_dispatch_register as t10', 't1.application_code', '=', 't10.application_code')
                ->leftJoin('par_modules as t11', 't1.module_id', '=', 't11.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id, t1.application_id as active_application_id, t2.name as process_name,
                    t3.name as prev_stage, t4.name as workflow_stage,t5.name as application_status,t6.name as urgencyName,t6.name as urgency_name,
                    CONCAT(decryptval(t7.first_name,".getDecryptFunParams()."),decryptval(t7.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),decryptval(t8.last_name,".getDecryptFunParams().")) as to_user,
                    t9.name as applicant_name, t11.name as module_name"))
                ->whereNull('t10.id') //is final stage
                ->where('t4.stage_status', 3); //is final stage

            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
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
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.current_stage', $workflow_stage_id);
            }
            $qry->orderBy('t1.id', 'desc');
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
        return $res;
    }
    public function dispatchCorrespondence(Request $req)
    {
        $module_id = $req->module_id;
        $sub_module_id = $req->sub_module_id;
        $application_code = $req->application_code;

        try{
            //getApplication details

            //update any statuses

            //send email notifications

            $log_data = array(
                'module_id'=>$module_id,
                'sub_module_id'=>$sub_module_id,
                'application_code'=>$application_code,
                'dispatch_by' => $this->user_id,
                'dispatch_date' => carbon::now()
            );

            $res = insertRecord('tra_dispatch_register', $log_data);

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
        return $res;
    }
      public function getOnlineApplicationDashboard(Request $request)
    {
        $user_id = $this->user_id;
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $zone_id = $request->input('zone_id');
        $online_status_id = $request->input('online_status_id');
        $is_management_dashboard = $request->input('is_management_dashboard');
        
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);

        $whereClauses = array();
        $filter = $request->input('filter');
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'tracking_no' :
                            $whereClauses[] = "(t1.tracking_no ILIKE '%" . ($filter->value) . "%' or t1.reference_no ILIKE '%" . ($filter->value) . "%')";
                            break;
                        case 'reference_no' :
                            $whereClauses[] = "(t1.tracking_no ILIKE '%" . ($filter->value) . "%' or t1.reference_no ILIKE '%" . ($filter->value) . "%')";
                            break;
                        case 'applicant_name' :
                            $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
                            break;
                        case 'time_span' :
                            $whereClauses[] = "TOTAL_WEEKDAYS(now(),date_submitted) > " . ($filter->value);
                            break;
                            
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
        // $portal_db = DB::connection('portal_db')->getDatabaseName();
        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);
            $qry = DB::table('tra_onlinesubmissions as t1')
                ->leftJoin('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->leftJoin('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('wb_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_zones as t6', 't1.zone_id', '=', 't6.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id, t1.application_id as active_application_id, t2.name as process_name,
                     t4.name as workflow_stage,t4.is_general,t5.name as application_status,1 as time_span,
                    t9.name as applicant_name, t6.name as zone_name"));
            if ($is_super || $is_management_dashboard ==1) {
                $qry->whereRaw('1=1');
            } else {
                $qry->where(function ($query) use ($user_id, $assigned_stages) {
                    $query->where('usr_to', $user_id)
                        ->orWhereIn('t1.current_stage', $assigned_stages);
                });
            }
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($module_id)) {
                $qry->where('t1.module_id', $module_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (validateIsNumeric($zone_id)) {
                $qry->where('t1.zone_id', $zone_id);
            }
            if (validateIsNumeric($online_status_id)) {
                $qry->where('t5.id', $online_status_id);
            }
            $qry->orderBy('t1.id', 'desc');
            $qry->where('onlinesubmission_status_id', 1);
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
    public function getQeuriedApplications(Request $request){
        $user_id = $this->user_id;
        //$limsusr_id = getLimsUserId($user_id);
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $is_management_dashboard = $request->input('is_management_dashboard');
        $start = $request->input('start');
        $limit = $request->input('limit');
        $whereClauses = array();
        $filter = $request->input('filter');
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
                            $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
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
            //DB::enableQueryLog();
            $qry = DB::table('tra_submissions as t1')
                ->join('wf_processes as t2', 't1.process_id', '=', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't1.previous_stage', '=', 't3.id')
                ->leftJoin('wf_workflow_stages as t4', 't1.current_stage', '=', 't4.id')
                ->leftJoin('par_system_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('par_submission_urgencies as t6', 't1.urgency', '=', 't6.id')
                ->leftJoin('users as t7', 't1.usr_from', '=', 't7.id')
                ->leftJoin('users as t8', 't1.usr_to', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.applicant_id', '=', 't9.id')
                ->leftJoin('par_branches as t10', 't1.branch_id', '=', 't10.id')
                ->leftJoin('par_modules as t11', 't1.module_id', '=', 't11.id')
                ->leftJoin('par_modules as t12', 't1.sub_module_id', '=', 't12.id')
                ->select(DB::raw("t1.*, t1.current_stage as workflow_stage_id,t1.branch_id, t1.application_id as active_application_id, t2.name as process_name,t10.name as branch_name,t1.application_status_id,
                    t3.name as prev_stage, t4.name as workflow_stage,t4.is_general,t5.name as application_status,t6.name as urgencyName,t6.name as urgency_name,t11.name as module,t12.name as sub_module,
                    CONCAT(decryptval(t7.first_name,".getDecryptFunParams()."),' ', decryptval(t7.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),' ',decryptval(t8.last_name,".getDecryptFunParams().")) as to_user, working_days(date(date_received) , CURRENT_DATE) as time_span,
                    t9.name as applicant_name, '' as sample_analysis_status"))
                ->where('t4.stage_category_id',16);
                //dd($qry);
                //->where('is_done', 0);

                // if($is_internaluser){
                //     $assigned_groups = getUserGroups($user_id);
                //     $is_super = belongsToSuperGroup($assigned_groups);
                //       $assigned_stages = getAssignedProcessStages($user_id, $module_id);
                //     if ($is_super) {
                //         $qry->whereRaw('1=1');
                //         $qry->limit(100);
                //    } else {

                //         //`$qry->where('t4.usr_to','=',$user_id);
                //         $qry->where(function ($query) use ($user_id, $assigned_stages) {
                //            $assigned_stages = convertArrayToString($assigned_stages);
                //            $assigned_stages =rtrim($assigned_stages, ",");
                //             $query->where('usr_to', $user_id)
                //                     ->orWhereRaw("(t1.current_stage in ($assigned_stages) and t4.needs_responsible_user = 2)");
                //         });
                //     }
                // }
                // else{
                //       $qry->where('t1.external_user_id', $user_id);
                // }
            // $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);

            if (isset($section_id) && $section_id != '') {
                $qry->where('t1.section_id', $section_id);
            }
            if (isset($module_id) && $module_id != '') {
                $qry->where('t1.module_id', $module_id);
            }
            if (isset($sub_module_id) && $sub_module_id != '') {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.current_stage', $workflow_stage_id);
            }
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            $qry->orderBy('t1.is_fast_track', 'DESC');
            $qry2 = clone $qry;
            $total = $qry2->count();
            if(isset($start)&&isset($limit)){
                $results = $qry->skip($start)->take($limit)->get();
            }
            else{
                $results=$qry->get();
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well',
                'total' => $total
            );
        }
        catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;

    }

}
