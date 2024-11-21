<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\User;

use Modules\Surveillance\Traits\SurveillanceTrait;


class commonController extends Controller
{
    use SurveillanceTrait;
 // use RmuController;

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
                }
                $this->user_id =1;// \Auth::user()->id;


                // $method = $request->route()->getActionMethod();
                // $inputTable = $request->input('table_name');
                // $module_id = $request->input('module_id');
                // $sub_module_id = $request->input('sub_module_id');
                // $curr_stage_id = $request->input('curr_stage_id');
                // $current_stage_name = $request->input('current_stage_name');
                // $application_status = $request->input('application_status');
                // $application_status_id = $request->input('application_status_id');
                // $responsible_user = $request->input('responsible_user');
                // $process_id = $request->input('process_id');
                // $id = $request->input('id');

                // $action = '';
                // $table_name = 'eqms_workflow_management_logs';
                // switch ($method) {
                //     case 'saveApplicationChecklistDetails':
                //         if ($module_id == '29') {
                //             $table_name = 'eqms_audit_management_logs';
                            
                //             $action = 'Submit audit';
                            
                //         } else if ($module_id == '28') {
                //             $table_name = 'eqms_issue_management_logs';
                            
                //             $action = 'Submit audit';
                //         }
                //         break;
                //     case 'saveEditedConfigCommonData':

                //         $action = 'saved edited configuration common data';
                //         break;
                //     case 'deleteConfigRecord':
                //         $action = 'deleted configuration record';
                //         break;
                //     case 'saveDocumentTypes':
                //         $action = 'saved document types';
                //         break;
                //     case 'navigatorFolder':
                //         $action = 'saved navigator folder';
                //         break;
                //     default:
                //         break;
                // }

                // if ($action != '') {
                //     $dbtable = $table_name;
                //     $user_id = $this->user_id;
                //     $application_code = $request->input('application_code') ?? null;
                //     $created_on = Carbon::now();
                
                //     $table_data = array(
                //         'user_id' => $user_id,
                //         'application_code' => $application_code,
                //         'module_id'=>$module_id,
                //         'sub_module_id'=>$sub_module_id,
                //         'action' => $action,
                //         'curr_stage_id' => $curr_stage_id,
                //         'current_stage_name' => $current_stage_name,
                //         'application_status' => $application_status,
                //         'application_status_id' => $application_status_id,
                //         'responsible_user' => $responsible_user,
                //         'process_id' => $process_id,
                //         'submitted_by' => $user_id,
                //         'created_on' => $created_on,
                //     );
                //     // Insert to the database
                //     DB::table($dbtable)->insert($table_data);
                // }              
                return $next($request);
            });
        }
    }

   

    public function saveApplicationChecklistDetails(Request $request)
    {
        $application_code = $request->input('application_code');
        $screening_details = $request->input('screening_details');
        $screening_details = json_decode($screening_details);
        $table_name = 'tra_checklistitems_responses';
        $user_id = $this->user_id;

        try {
            foreach ($screening_details as $screening_detail) {
                $id = $screening_detail->item_resp_id;

                $insert_params = [
                    'application_code' => $application_code,
                    'checklist_item_id' => $screening_detail->checklist_item_id,
                    'pass_status' => $screening_detail->pass_status,
                    'comment' => $screening_detail->comment,
                    'observation' => $screening_detail->observation,
                    'risk_type' => $screening_detail->risk_type,
                    'risk_type_remarks' => $screening_detail->risk_type_remarks,
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id,
                ];

                if (validateIsNumeric($id)) {
                    $where = ['id' => $id];
                    if (recordExists($table_name, $where)) {
                        $prev_data = getPreviousRecords($table_name, $where);

                        if ($prev_data['success'] == false) {
                            return $prev_data;
                        }

                        $prev_data = $prev_data['results'][0];
                        $res = updateRecord($table_name, $where, $insert_params, $user_id);
                    }
                } else {
                    // Insert the new record
                    if (!empty($insert_params)) {
                        DB::table($table_name)->insert($insert_params);
                    }
                }
            }

            $res = [
                'success' => true,
                'message' => 'Screening details saved successfully!',
            ];
        } catch (\Exception $exception) {
            $res = [
                'success' => false,
                'message' => $exception->getMessage(),
            ];
        } catch (\Throwable $throwable) {
            $res = [
                'success' => false,
                'message' => $throwable->getMessage(),
            ];
        }

        return response()->json($res);
    }


    public function getApplicationChecklistQueries(Request $request)
    {
        $item_resp_id = $request->input('item_resp_id');
        $application_code = $request->input('application_code');
        $process_id = $request->input('process_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        try {
            $qry = DB::table('tra_application_query_reftracker as t1')
                ->leftJoin('par_query_types as t2', 't1.query_type_id', 't2.id')
                ->leftJoin('par_checklist_categories as t3', 't1.checklist_category_id', 't3.id')
                ->select('t1.id as query_id', 't1.*', 't2.name as query_type', 't3.name as checklist_category', 't1.query_remark as comment')
                ->groupBy('t1.id', 't2.name', 't3.name');
            if (validateIsNumeric($application_code)) {
                $qry->where('t1.application_code', $application_code);
            }
            if (validateIsNumeric($process_id)) {
                $qry->where('t1.process_id', $process_id);
            }
            /*     if(validateIsNumeric($workflow_stage_id)){
                     $qry->where('t1.workflow_stage_id', $workflow_stage_id);
                 }
     */
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function approveQueryLetters($req, $user_id){
        $query_id = $req->query_id;
        $decision_id = $req->decision_id;
        $sign_file = $req->sign_file;
        $update_data = array(
                    'status_id' => 5,
                    'manager_remark' => $req->comment,
                    'sign_file' => $sign_file
                );
        $update_data['approved_on'] = Carbon::now();
        $update_data['approved_by'] = $user_id;
        $update_data['approval_decision_id'] = $decision_id;
        $res = updateRecord('tra_application_query_reftracker', array('id' => $query_id), $update_data, $user_id);
        return $res;

    }
    public function saveChecklistApplicationQuery(Request $req)
    {
        try {
            $user_id = $this->user_id;
            $module_id = $req->module_id;
            $sub_module_id = $req->sub_module_id;
            $section_id = $req->section_id;
            $application_code = $req->application_code;
            $workflow_stage_id = $req->workflow_stage_id;
            $process_id = $req->process_id;
            $query_id = $req->query_id;
            $table_name = $req->table_name;
            $query_remark = $req->query_remark;
            $is_structured = $req->is_structured;
            $query_txt = $req->query_txt;
            $queried_on = Carbon::now();
            $queried_by = $user_id;
            $queryref_status_id = 1;
            $query_processstage_id = $req->query_processstage_id;
            $query_type_id = $req->query_type_id;
            $status_id = $req->status_id;
            $is_manager_review = $req->is_manager_review;
            $manager_remark = $req->manager_remark;
            $approval_decision_id = $req->approval_decision_id;
            $query_response = $req->query_response;
            $query_response_comments = $req->query_response_comments;
            $responded_on = $req->responded_on;
            if($is_manager_review != 1){
               $status_id = 1;
            }

            //process query status_id
            //---------------------------------------------

            if (validateIsNumeric($query_id)) {
                //update query
                $previous_data = getPreviousRecords('tra_application_query_reftracker', array('id' => $query_id));
                if ($previous_data['success'] == false) {
                    return \response()->json($previous_data);
                }
                $previous_data = $previous_data['results'];
                //update data
                $update_data = array(
                    'query_remark' => $query_remark,
                    'query_processstage_id' => $query_processstage_id,
                    'query_type_id' => $query_type_id,
                    'query_txt' => $query_txt,
                    'queryref_status_id' => $queryref_status_id,
                    'status_id' => $status_id,
                    'manager_remark' => $manager_remark
                );
                if(validateIsNumeric($approval_decision_id)){
                    $update_data['approved_on'] = Carbon::now();
                    $update_data['approved_by'] = $user_id;
                    $update_data['approval_decision_id'] = $approval_decision_id;
                }
                if($query_response != ''){
                    $update_data['query_response'] = $query_response;
                    $update_data['query_response_comments'] = $query_response_comments;
                    $update_data['responded_on'] = $responded_on;
					$update_data['status_id'] = 2;
                }
                $res = updateRecord('tra_application_query_reftracker', array('id' => $query_id), $update_data, $user_id);
                $res['checklist_category_id'] = $previous_data[0]['checklist_category_id'];
            } else {
                //get query type from stage
                $checklist_category_id = getStageQueryChecklistCategory($workflow_stage_id);
                // if (!validateIsNumeric($checklist_category_id)) {
                //     return \response()->json(array('success' => false, 'message' => 'No checklist category Found'));
                // }
                //save new query
                $module_table = getTableName($module_id);
                if($sub_module_id == 50){
                    $module_table = 'tra_premiseinspection_applications';
                }
                $app_details = getSingleRecord($module_table, ['application_code' => $application_code]);
                $count = DB::table('tra_application_query_reftracker')->where('application_code', $application_code)->count();
                $query_ref = $app_details->tracking_no.'/Q'.$count+1;
                $query_data = array(
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_code' => $application_code,
                    'query_remark' => $query_remark,
                    'query_txt' => $query_txt,
                    'is_structured' => $is_structured,
                    'queried_on' => $queried_on,
                    'queried_by' => $queried_by,
                    'query_type_id' => $query_type_id,
                    'process_id' => $process_id,
					'approval_decision_id' => $approval_decision_id,
					'approved_by' => $user_id,
                    'query_processstage_id' => $query_processstage_id,
                    'query_ref' => $query_ref,
                    'checklist_category_id' => $checklist_category_id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'queryref_status_id' => $queryref_status_id
                );

                $res = insertRecord('tra_application_query_reftracker', $query_data, $user_id);
                $res['checklist_category_id'] = $checklist_category_id;
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }

        return \response()->json($res);
    }

    public function closeApplicationQuery(Request $request)
    {
        $query_id = $request->input('query_id');
        $item_resp_id = $request->input('item_resp_id');
        $user_id = $this->user_id;
        // $table_name = 'tra_checklistitems_queries';
        $where = array(
            'id' => $query_id
        );
        $table_data = array(
            'status_id' => 4
        );
        try {
            $res = updateRecord('tra_application_query_reftracker', $where, $table_data, $user_id);

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function saveUnstructuredApplicationQuery(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];
            $application_code = $post_data['application_code'];
            $checklist_item_id = $post_data['checklist_item_id'];
            $application_section_id = $post_data['application_section_id'];
            $query = $post_data['query'];
            $comment = $post_data['comment'];
            $reference_id = $post_data['reference_id'];
            $reference_section = $post_data['reference_section'];
            $manager_query_comment = $post_data['manager_query_comment'];
            $manager_queryresp_comment = $post_data['manager_queryresp_comment'];
            $query_id = $post_data['query_id'];
            if($table_name == ''){
                $table_name = 'tra_checklistitems_queries';
            }
            $table_data = array(
                'application_code' => $application_code,
                'checklist_item_id' => $checklist_item_id,
                'application_section_id' => $application_section_id,
                'query' => $query,
                'query_id' => $query_id,
                'comment' => $comment,
                'reference_id' => $reference_id,
                'reference_section' => $reference_section,
                'manager_query_comment' => $manager_query_comment,
                'manager_queryresp_comment' => $manager_queryresp_comment
            );
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    $res = updateRecord($table_name, $where, $table_data, $user_id);
                }else{
                    $res = ['success'=>false, 'message'=>'Query not found'];
                }
            } else {
                $table_data['created_on'] = Carbon::now();
                $table_data['created_by'] = $user_id;
                $res = insertRecord($table_name, $table_data, $user_id);
            }
            if (isset($res['success']) && $res['success']) {
                $res = array(
                    'success' => true,
                    'results' => $res,
                    'message' => 'Query details Saved Successfully!!'
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getTcMeetingParticipants(Request $request)
    {
        $meeting_id = $request->input('meeting_id');
        try {
            $qry = DB::table('tc_meeting_participants as t1')
                ->select('t1.*')
                ->where('t1.meeting_id', $meeting_id);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function syncTcMeetingParticipants(Request $request)
    {
        $selected = $request->input('selected');
        $meeting_id = $request->input('meeting_id');
        $selected_users = json_decode($selected);
        $where = array(
            'meeting_id' => $meeting_id
        );
        try {
            DB::transaction(function () use ($selected_users, $meeting_id, $where) {
                $params = array();
                foreach ($selected_users as $selected_user) {
                    $check = array(
                        'user_id' => $selected_user->user_id,
                        'meeting_id' => $meeting_id
                    );
                    if (DB::table('tc_meeting_participants')
                            ->where($check)->count() == 0) {
                        $params[] = array(
                            'meeting_id' => $meeting_id,
                            'user_id' => $selected_user->user_id,
                            'participant_name' => $selected_user->participant_name,
                            'phone' => $selected_user->phone,
                            'email' => $selected_user->email,
                            'created_by' => $this->user_id
                        );
                    }
                }
                insertMultipleRecords('tc_meeting_participants', $params);
                //DB::table('tc_meeting_participants')
                //   ->insert($params);
            }, 5);
            $res = array(
                'success' => true,
                'message' => 'Participants saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getmeetingSchedulesLogs(Request $req)
    {
        $module_id = $req->input('module_id');
        try {
            $qry = DB::table('par_meeting_schedules as t1')
                ->leftJoin('par_modules as t2', 't1.module_id', 't2.id')
                ->select('t1.meeting_name', 't1.meeting_desc', 't1.meeting_venue', 't1.meeting_time', 't1.date_requested', 't2.name as module_name');
            if (validateIsNumeric($module_id)) {
                $qry->where('module_id', $module_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function saveRecommendationDetails(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_evaluation_recommendations';
            $id = $post_data['recommendation_record_id'];
            $stage_category_id = $post_data['stage_category_id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['recommendation_record_id']);
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }

            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data);
                }
            } else {
                $res = insertRecord($table_name, $table_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
     public function saveMeetingMembersRecommendationDetails(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_rc_meeting_recommendations';
            $id = $post_data['recommendation_record_id'];
            $stage_category_id = $post_data['stage_category_id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['recommendation_record_id']);
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }

            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data);
                }
            } else {
                $res = insertRecord($table_name, $table_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function updateMeetingAttendance(Request $req)
    {
        $meeting_id = $req->meeting_id;
        $selected = $req->selected;
        $personnel_id = $req->personnel_id;
        $selected_recs = json_decode($selected);
        $res = array('success' => true, 'message' => 'No record to update');
        try {
            foreach ($selected_recs as $selected) {
                $attendance = $selected->has_attended;
                $personnel_id = $selected->personnel_id;
                if ($attendance == false || $attendance == 0) {
                    $attendance = 0;
                }
                if ($attendance == true || $attendance == 1) {
                    $attendance = 1;
                }
                $update_data = array(
                    'has_attended' => $attendance,
                );
                $where = array(
                    'meeting_id' => $meeting_id,
                    'id' => $personnel_id
                );
                $res = updateRecord('tc_meeting_participants', $where, $update_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getRcRecommendationLogs(Request $req)
    {

        $application_code = $req->input('application_code');
        $stage_category_id = $req->input('stage_category_id');
        $module_id = $req->input('module_id');
        $meeting_id = $req->input('meeting_id');
        try {
            $qry = DB::table('tra_rc_meeting_recommendations as t1')
                ->leftJoin('par_recommendations as t2', 't1.recommendation_id', 't2.id')
                ->leftJoin('users as t3', 't1.created_by', 't3.id')
                ->select('t1.*', 't2.name as recommendation', 't1.created_on as recommendation_date', DB::raw("CONCAT(decryptval(t3.first_name," . getDecryptFunParams() . "),decryptval(t3.last_name," . getDecryptFunParams() . ")) as participant_name"));
            if (validateIsNumeric($application_code)) {
                $qry->where('application_code', $application_code);
            }
            if (validateIsNumeric($stage_category_id)) {
                $qry->where('stage_category_id', $stage_category_id);
            }
            if (validateIsNumeric($module_id)) {
                $qry->where('module_id', $module_id);
            }
            if (validateIsNumeric($meeting_id)) {
                // $qry->where('meeting_id', $meeting_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getApplicationRecommendationLogs(Request $req)
    {

        $application_code = $req->input('application_code');
        $module_id = $req->input('module_id');

        try {
            $qry = DB::table('tra_evaluation_recommendations as t1')
                ->leftJoin('par_recommendations as t2', 't1.recommendation_id', 't2.id')
                ->leftJoin('users as t3', 't1.created_by', 't3.id')
                ->leftJoin('wf_stage_categories as t4', 't1.stage_category_id', 't4.id')
                ->select('t1.*', 't2.name as recommendation', 't1.created_on as recommendation_date', DB::raw("CONCAT(decryptval(t3.first_name," . getDecryptFunParams() . "),decryptval(t3.last_name," . getDecryptFunParams() . ")) as recommended_by"), 't4.name as stage_name');

            $qry->where('application_code', $application_code);
            $qry->where('module_id', $module_id);

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function saveApplicationApprovalDetails(Request $request, $approved_by = null)
    {
        $approval_id = $request->approval_id;
        $application_code = $request->application_code;
        $sub_module_id = $request->sub_module_id;
        $module_id = $request->module_id;
        $decision_id = $request->decision_id;
        $approval_date = $request->approval_date;
        $expiry_date = $request->expiry_date;
        $remarks = $request->remarks;

        $table_name = getTableName($module_id);

        $qry = DB::table($table_name)
            ->where('application_code', $application_code);

        $app_details = $qry->first();
        if (is_null($app_details)) {
            $res = array(
                'success' => false,
                'message' => 'Problem encountered while getting application details!!'
            );
            return response()->json($res);
        }
        // $module_id = $app_details->module_id;
        $sub_module_id = $app_details->sub_module_id;
        if(validateIsNumeric($request->query_id)){
            $res = $this->approveQueryLetters($request, $approved_by);
        }
        else if ($module_id == 1) {//Products
            $res = $this->saveProductApplicationApprovalDetails($request, $sub_module_id);
        } else if ($module_id == 2) {//Premises
            $res = $this->savePremiseApplicationApprovalDetails($request, $sub_module_id, $app_details,$approved_by);
        } else if ($module_id == 3) {//Gmp
            $res = $this->saveGmpApplicationApprovalDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 7) {//Clinical Trial
            $res = $this->saveClinicalTrialApplicationApprovalDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 8) {//enforcement
            $res = $this->saveEnforcementApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 11) {//schedule Inspections
            $res = $this->onSavePmsProgramApprovalDecision($request, $approved_by);
        } else if ($module_id == 14) {//promotion and advertisement
            $res = $this->savePromoAdvertsApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 6) {//promotion and advertisement
            $res = $this->saveProductNotificationApprovalDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 4) {//promotion and advertisement
            $res = $this->saveImpExpApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 15) {//promotion and advertisement
            $res = $this->saveDisposalpApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        } else if ($module_id == 20) {//promotion and advertisement
            $res = $this->saveImpExpApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        }else if ($module_id == 20) {//promotion and advertisement
            $res = $this->saveImpExpApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        }else if ($module_id == 26) {
            $res = $this->saveDocumentApplicationRecommendationDetails($request, $sub_module_id, $app_details);
        }
		else if ($module_id == 24) {//RMU Administrative
            $res = $this->saveResponseApproval($request, $approved_by = null);
        }
        return \response()->json($res);
    }

    public function getApplicationApprovalDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        try {
            $where = array(
                't1.application_id' => $application_id,
                't1.application_code' => $application_code
            );

            $qry = DB::table('tra_approval_recommendations as t1')
                ->select('t1.*', 't1.id as recommendation_id')
                ->orderBy('t1.id', 'DESC')
                ->where($where);

            $results = $qry->first();
			if(isset($results->sign_file)){
				unset($results->sign_file);
			}
			
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }

    public function prepareApplicationTCMeetingSchedulingStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $table_name = $request->input('table_name');
        $module_id = $request->input('module_id');
        $meeting_id = $request->input('meeting_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $stage_category_id = '';
        try {
        $qry = DB::table($table_name . ' as t1')
                ->join('tc_meeting_applications as t2', function ($join) use ($application_code) {
                    $join->on('t1.application_code', '=', 't2.application_code');
                })
                ->join('tc_meeting_details as t3', 't2.meeting_id', '=', 't3.id')
                ->select(DB::raw("t3.*"))
                ->where('t1.application_code', $application_code);

            if(validateIsNumeric($module_id)){
                    $table_name = getSingleRecordColValue('par_modules', array('id'=>$module_id), 'tablename');
                }
            if(validateIsNumeric($workflow_stage_id)){
                    $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
                    $stage_category_id = $stage_data->stage_category_id;
                }
            if(validateIsNumeric($meeting_id)){
                $qry = DB::table('tc_meeting_details as t3')
                ->select(DB::raw("t3.*"));
                $qry->where('t3.id', $meeting_id);
            }
            if($stage_category_id == 6 || $stage_category_id == 7){
                $qry->whereRaw("(stage_category_id = 6 OR stage_category_id = 7)");
            } 
            if($stage_category_id == 8 || $stage_category_id == 9){
                $qry->whereRaw("(stage_category_id = 8 OR stage_category_id = 9)");
            }
            $results = $qry->first();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getTcMeetingAgendas(Request $request)
    {
        $meeting_id = $request->input('meeting_id');
        try {
            $qry = DB::table('tc_meeting_agendas as t1')
                ->select('t1.*')
                ->where('t1.meeting_id', $meeting_id);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getApplicationVariationRequests(Request $request)
    {
        $isOnline = $request->input('isOnline');//PORTAL
        try {
            $results = array();
            if (validateIsNumeric($isOnline) && $isOnline == 1) {
                $results = $this->getOnlineApplicationVariationRequests($request);
            } else {
                $results = $this->getMISApplicationVariationRequests($request);
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getOnlineApplicationVariationRequests(Request $request)
    {
        $application_code = $request->input('application_code');
        $portal_db = DB::Connection('portal_db');
        $qry = $portal_db->table('wb_application_variationsdata as t1')
            ->select('t1.*')
            ->where('t1.application_code', $application_code);
        $results = $qry->get();
        foreach ($results as $key => $result) {
            $appuploaded_document_id = $result->variation_category_id;

            $document_records = DB::table('tra_application_uploadeddocuments')
            ->where(array('application_code'=>$application_code, 'id'=>$appuploaded_document_id))
            ->first();

            if($document_records){
                $results[$key]->node_ref = $document_records->node_ref;
                $results[$key]->uploaded_on = $document_records->uploaded_on;
                $results[$key]->uploaded_by = $document_records->uploaded_by;
                $results[$key]->initial_file_name = $document_records->initial_file_name;
            }
            else{
                $results[$key]->node_ref = '';
            }
            $results[$key]->variation_category = getSingleRecordColValue('par_variations_categories', array('id' => $result->variation_category_id), 'name');
            $results[$key]->variation_type = getSingleRecordColValue('par_typeof_variations', array('id' => $result->variation_type_id), 'name');
        }
        return $result;
    }
    public function getMISApplicationVariationRequests(Request $request)
    {
        $application_code = $request->input('application_code');
        $qry = DB::table('tra_application_variationsdata as t1')
            ->leftJoin('par_variations_categories as t2', 't1.variation_category_id', '=', 't2.id')
            ->leftJoin('par_typeof_variations as t3', 't1.variation_type_id', '=', 't3.id')
            ->leftJoin('tra_application_uploadeddocuments as t4', 't1.appuploaded_document_id','=','t4.id')
            ->select('t1.*', 't2.name as variation_category', 't3.name as variation_type', 't2.module_id', 't2.section_id', 't4.node_ref', 't4.initial_file_name')
            ->where('t1.application_code', $application_code);
        $results = $qry->get();
        return $results;
    }
    public function saveCommonData(Request $req)
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
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            if($table_name == 'tra_applications_comments'){
                $post_data['assessment_by'] = $user_id;
                $post_data['is_current'] = 1;
                /*-----------------------------------------------------
                    For application comment reset the is_current
                ------------------------------------------------------*/
                if(isset($post_data['comment_type_id'])){
                    DB::table('tra_applications_comments')
                        ->where(array('application_code' => $post_data['application_code'], 'comment_type_id' => $post_data['comment_type_id']))
                        ->update(array('is_current' => 0));
                }

            }
            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    // $previous_data = getPreviousRecords($table_name, $where);
                    // if ($previous_data['success'] == false) {
                    //     return $previous_data;
                    // }
                    // $previous_data = $previous_data['results'];
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
    public function deleteCommonRecord(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
            // $previous_data = getPreviousRecords($table_name, $where);
            // if ($previous_data['success'] == false) {
            //     return $previous_data;
            // }
            // $previous_data = $previous_data['results'];
            $res = deleteRecord($table_name,$where, $user_id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveApplicationWithdrawalReasons(Request $request)
    {

        try {
            $application_code = $request->input('application_code');
            $reason_id = $request->input('withdrawal_category_id');
            $remark = $request->input('reason_for_withdrawal');
            $id = $request->input('id');
            $user_id = $this->user_id;

            //chech for portal update
            // $where_portal = array(
            //     'application_code' => $application_code,
            //     'id' => $id
            // );
            // $record = DB::connection('portal_db')
            //             ->table('wb_application_withdrawaldetails')
            //             ->where($where_portal)
            //             ->count();
            // if($record >0){
            //     $params = array(
            //             'application_code' => $application_code,
            //             'withdrawal_category_id' => $reason_id,
            //             'reason_for_withdrawal' => $remark
            //         );
            //     DB::connection('portal_db')->table('wb_application_withdrawaldetails')->where($where_portal)->update($params);
            //     $res = array('success'=>true, 'message'=>'Saved successfully');
            // }
            // else{
                    $table_name = 'tra_application_withdrawaldetails';
                    $where1 = array(
                        'application_code' => $application_code,
                        'withdrawal_category_id' => $reason_id
                    );
                    $params = array(
                        'application_code' => $application_code,
                        'withdrawal_category_id' => $reason_id,
                        'reason_for_withdrawal' => $remark
                    );
                    if (validateIsNumeric($id)) {
                        $where2 = array(
                            'id' => $id
                        );
                        $params['dola'] = Carbon::now();
                        $params['altered_by'] = $user_id;
                        // $previous_data = getPreviousRecords($table_name, $where2);
                        // if ($previous_data['success'] == false) {
                        //     return $previous_data;
                        // }

                        // $previous_data = $previous_data['results'];
                        $res = updateRecord($table_name, $where2, $params, $user_id);
                    } else {
                        if (recordExists('tra_application_withdrawaldetails', $where1)) {
                            $res = array(
                                'success' => false,
                                'message' => 'Already added!!'
                            );
                            return \response()->json($res);
                        }
                        $params['created_on'] = Carbon::now();
                        $params['date_added'] = Carbon::now();
                        $params['created_by'] = $user_id;
                        $res = insertRecord($table_name, $params, $user_id);
                    }

            // }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveApplicationSuspensionReasons(Request $request)
    {

        try {
            $application_code = $request->input('application_code');
            $reason_id = $request->input('suspension_category_id');
            $remark = $request->input('reason_for_suspension');
            $id = $request->input('id');
            $user_id = $this->user_id;

            //chech for portal update
            // $where_portal = array(
            //     'application_code' => $application_code,
            //     'id' => $id
            // );
            // $record = DB::connection('portal_db')
            //             ->table('wb_application_suspensiondetails')
            //             ->where($where_portal)
            //             ->count();
            // if($record >0){
            //     $params = array(
            //             'application_code' => $application_code,
            //             'suspension_category_id' => $reason_id,
            //             'reason_for_suspension' => $remark
            //         );
            //     DB::connection('portal_db')->table('wb_application_suspensiondetails')->where($where_portal)->update($params);
            //     $res = array('success'=>true, 'message'=>'Saved successfully');
            // }
            // else{
                    $table_name = 'tra_application_suspensiondetails';
                    $where1 = array(
                        'application_code' => $application_code,
                        'suspension_category_id' => $reason_id
                    );
                    $params = array(
                        'application_code' => $application_code,
                        'suspension_category_id' => $reason_id,
                        'reason_for_suspension' => $remark
                    );
                    if (validateIsNumeric($id)) {
                        $where2 = array(
                            'id' => $id
                        );
                        $params['dola'] = Carbon::now();
                        $params['altered_by'] = $user_id;
                        // $previous_data = getPreviousRecords($table_name, $where2);
                        // if ($previous_data['success'] == false) {
                        //     return $previous_data;
                        // }

                        // $previous_data = $previous_data['results'];
                        $res = updateRecord($table_name, $where2, $params, $user_id);
                    } else {
                        if (recordExists('tra_application_suspensiondetails', $where1)) {
                            $res = array(
                                'success' => false,
                                'message' => 'Already added!!'
                            );
                            return \response()->json($res);
                        }
                        $params['created_on'] = Carbon::now();
                        $params['date_added'] = Carbon::now();
                        $params['created_by'] = $user_id;
                        $res = insertRecord($table_name, $params, $user_id);
                    }

            // }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getApplicationWithdrawalReasons(Request $request)
    {
        $isOnline = $request->input('isOnline');//PORTAL

        try {
            if (validateIsNumeric($isOnline) && $isOnline == 1) {
                $results = $this->getOnlineApplicationWithdrawalReasons($request);
            } else {
                $results = $this->getMISApplicationWithdrawalReasons($request);
                // if(count($results) ==0 ){
                // $results = $this->getOnlineApplicationWithdrawalReasons($request);
                // }
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getApplicationSuspensionReasons(Request $request)
    {
        $isOnline = $request->input('isOnline');//PORTAL

        try {
            if (validateIsNumeric($isOnline) && $isOnline == 1) {
                $results = $this->getOnlineApplicationWithdrawalReasons($request);
            } else {
                $results = $this->getMISApplicationSuspensionReasons($request);
                // if(count($results) ==0 ){
                // $results = $this->getOnlineApplicationWithdrawalReasons($request);
                // }
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getMISApplicationWithdrawalReasons(Request $request)
    {
        $application_code = $request->input('application_code');
        $qry = DB::table('tra_application_withdrawaldetails as t1')
            ->join('par_withdrawal_categories as t2', 't1.withdrawal_category_id', '=', 't2.id')
            ->select('t1.*', 't2.name as reason', 't2.module_id')
            ->where('t1.application_code', $application_code);
        $results = $qry->get();
        return $results;

    }

    public function getMISApplicationSuspensionReasons(Request $request)
    {
        $application_code = $request->input('application_code');
        $qry = DB::table('tra_application_suspensiondetails as t1')
            ->join('par_suspension_categories as t2', 't1.suspension_category_id', '=', 't2.id')
            ->select('t1.*', 't2.name as reason', 't2.module_id')
            ->where('t1.application_code', $application_code);
        $results = $qry->get();
        return $results;

    }
    public function getOnlineApplicationWithdrawalReasons(Request $request)
    {
        $application_code = $request->input('application_code');
        $portal_db = DB::Connection('portal_db');
        $qry = $portal_db->table('wb_application_withdrawaldetails as t1')
            ->select('t1.*')
            ->where('t1.application_code', $application_code);
        $results = $qry->get();
        foreach ($results as $key => $result) {
            $results[$key]->reason = getSingleRecordColValue('par_withdrawal_categories', array('id' => $result->withdrawal_category_id), 'name');
        }
        return $results;
    }
    public function cloneSingleWorkflow(Request $req)
    {
        $old_workflow_id = $req->old_workflow_id;
        $new_workflow_id = $req->new_workflow_id;

        $res = array('success'=>true, 'message'=>'synchronization was successfull');
        try{
            DB::beginTransaction();
            if(!validateIsNumeric($old_workflow_id) ){
                return array('success'=>false, 'error'=>'One or more Parameters were not supplied');
            }

            //get workflow
            $wf = DB::table('wf_workflows')->where(['id' => $old_workflow_id])->get()->first();

            $stages = DB::table('wf_workflow_stages')->where('workflow_id', $wf->id)->get();
            //add workflow to new table
            // $wf_data = convertStdClassObjToArray($wf);
            // $old_workflow_id = $workflow_id;
            // unset($wf_data['id']);
            // $new_workflow_id = DB::table('wf_workflows')->insertGetId($wf_data);
            //create and poplate mock transitions
           DB::statement("create table temp_transitions as select * from wf_workflow_transitions with no data");
           //get
            $trans_data = DB::table('wf_workflow_transitions')->where('workflow_id', $old_workflow_id)->get();
            //feed

            foreach ($trans_data as $trans) {
                $trans_d = convertStdClassObjToArray($trans);
                unset($trans_d['id']);
                $trans_d['workflow_id'] = $new_workflow_id;
                DB::table('temp_transitions')->insert($trans_d);
            }

            foreach ($stages as $stage){
//add stage
                $stage_data = convertStdClassObjToArray($stage);
                $old_stage_id = $stage_data['id'];
                unset($stage_data['id']);
                $stage_data['workflow_id'] = $new_workflow_id;
                $new_stage_id = DB::table('wf_workflow_stages')->insertGetId($stage_data);
                //get actions
                $actions = DB::table('wf_workflow_actions')->where('stage_id', $stage->id)->get();
                //update dump transaction table

                DB::table('temp_transitions')->where('stage_id', $old_stage_id)->update(['stage_id'=>$new_stage_id]);
                DB::table('temp_transitions')->where('nextstage_id',$old_stage_id)->update(['nextstage_id'=>$new_stage_id]);

                foreach ($actions as $action) {
                    //populate the new db
                    //actions
                    $action_data = convertStdClassObjToArray($action);
                    $old_action_id = $action_data['id'];
                    unset($action_data['id']);
                    $action_data['stage_id'] = $new_stage_id;
                    $new_action_id = DB::table('wf_workflow_actions')->insertGetId($action_data);

                    //update dump trasitions
                    DB::table('temp_transitions')->where('action_id',$old_action_id)->update(['action_id'=>$new_action_id]);

                }
            }
            //populate actual transition table
            $tran_details = DB::table('temp_transitions')->get();
            foreach ($tran_details as $tran_detail) {
                $details = convertStdClassObjToArray($tran_detail);
                unset($details['id']);
                DB::table('wf_workflow_transitions')->insert($details);
            }
            DB::unprepared('DROP TABLE temp_transitions');
            DB::commit();
        }
        catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }

    public function cloneFormByCategoryForAllTypes(Request $req)
    {
        $form_category_id = $req->form_category_id;

        $res = array('success'=>true, 'message'=>'synchronization was successfull');
        try{
            DB::beginTransaction();
            if(!validateIsNumeric($form_category_id) ){
                return array('success'=>false, 'error'=>'One or more Parameters were not supplied');
            }
            //form details
            $form = getSingleRecord('par_form_categories', ['id'=>$form_category_id]);
            $module_id=$form->module_id;
            $sub_module_id=$form->sub_module_id;
            $section_id=$form->section_id;
            $prodclass_category_id=$form->prodclass_category_id;
            $form = convertStdClassObjToArray($form);
            //applicable prodclass categories
            $prodclass_categories = DB::table('par_prodclass_categories')->where(['section_id'=>$section_id, 'sub_module_id'=>$sub_module_id])->get();
            //applicable sub modules
            $sub_modules = DB::table('par_sub_modules')->where(['is_enabled'=>1,'module_id'=>$module_id])->get();
            //loops for all categories

            foreach ($prodclass_categories as $prodcat) {
                // $j = 1;
                foreach ($sub_modules as $sub_module) {
                    //confirm its not exemptions
                     if($sub_module->id != 75){

                        //prepare data
                        $c_sub_module_id=$sub_module->id;
                        $c_prodclass_category_id=$prodcat->id;


                        //reset readonly
                        if($c_sub_module_id != 7){
                            $readOnly = 1;
                        }else{
                            $readOnly = 0;
                        }
                        //create form from clone
                        //dd($form);
                        $form['sub_module_id'] = $c_sub_module_id;
                        $form['prodclass_category_id'] = $c_prodclass_category_id;
                        unset($form['id']);
                        //get relation
                        $relations = DB::table('par_formfield_relations')->where('form_category_id', $form_category_id)->get();
                        //get fields
                        $fields = DB::table('par_formtype_fields')->where('form_category_id', $form_category_id)->get();

                        //delete exisiting forms
                        $del_form_categories =  DB::table('par_form_categories')->where(['sub_module_id'=>$c_sub_module_id, 'prodclass_category_id'=>$c_prodclass_category_id, 'section_id'=>$section_id])->get();

                        foreach ($del_form_categories as $del_form_category) {
                            // delete logics
                            DB::table('par_formfield_relations')->where('form_category_id', $del_form_category->id)->delete();
                            //delete fields
                            DB::table('par_formtype_fields')->where('form_category_id', $del_form_category->id)->delete();
                            //delete form
                            DB::table('par_form_categories')->where('id', $del_form_category->id)->delete();
                        }
                        //create form
                        $new_form = DB::table('par_form_categories')->insertGetId($form);
                        if(!validateIsNumeric($new_form)){
                            DB::rollback();
                            return $new_form;
                        }
                        //get new form
                        $n_form_category_id = $new_form;
                        //populate the fields
                        $cloned_field = [];
                        foreach ($fields as $field) {
                            $field = convertStdClassObjToArray($field);
                            // change category
                            $field['form_category_id'] = $n_form_category_id;
                            $field['is_readOnly'] = $readOnly;
                            unset($field['id']);
                            $cloned_field = $field;
                            DB::table('par_formtype_fields')->insert($field);
                        }
                        if($c_sub_module_id != 7){
                            //add tra and reg product id
                            $cloned_field['field_id']=23;
                            $cloned_field['is_hidden']=1;
                            DB::table('par_formtype_fields')->insert($cloned_field);
                            $cloned_field['field_id']=24;
                            $cloned_field['is_hidden']=1;
                            DB::table('par_formtype_fields')->insert($cloned_field);
                        }
                        //populate the relations
                        // dd($relations);
                        foreach ($relations as $relation) {
                            $relation = convertStdClassObjToArray($relation);
                            // change category
                            $relation['form_category_id'] = $n_form_category_id;
                            unset($relation['id']);
                            DB::table('par_formfield_relations')->insert($relation);
                        }

                     }
                }

            }

            DB::commit();
        }
        catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }
    
    public function cloneSingleFormToAnother(Request $req){
        $from_form_category_id = $req->from_form_category_id;
        $to_form_category_id = $req->to_form_category_id;

        $res = array('success'=>true, 'message'=>'synchronization was successfull');
        try{
            //get from fields relations
            $from_fields_relations = DB::table('par_formfield_relations')->where(['form_category_id'=>$from_form_category_id])->get();
            //get from fields
            $from_fields = DB::table('par_formtype_fields')->where(['form_category_id'=>$from_form_category_id])->get();

            //get fields
            $to_form_category = getSingleRecord('par_form_categories', ['id'=>$to_form_category_id]);
            $to_id = $to_form_category->id;
            $to_sub_module_id = $to_form_category->sub_module_id;
            $cloned_field = [];

            //reset readonly
            if($to_sub_module_id != 7){
                $readOnly = 1;
            }else{
                $readOnly = 0;
            }

            //delete and update
            DB::table('par_formfield_relations')->where('form_category_id', $to_id)->delete();
            //delete fields
            DB::table('par_formtype_fields')->where('form_category_id', $to_id)->delete();

            //insert fields
            foreach ($from_fields as $field) {
                $fieldz = convertStdClassObjToArray($field);
                $fieldz['form_category_id'] = $to_id;
                // $fieldz['is_readOnly'] = $readOnly;
                unset($fieldz['id']);
                $cloned_field = $fieldz;
                DB::table('par_formtype_fields')->insert($fieldz);
            }

            //insert fields relations
            foreach ($from_fields_relations as $field_relation) {
                $relation = convertStdClassObjToArray($field_relation);
                $relation['form_category_id'] = $to_id;
                unset($relation['id']);
                DB::table('par_formfield_relations')->insert($relation);
            }

            //add reg and trans dates
            if($to_sub_module_id != 7){
                //add tra and reg product id
                $cloned_field['field_id']=23;
                $cloned_field['is_hidden']=1;
                DB::table('par_formtype_fields')->insert($cloned_field);
                $cloned_field['field_id']=24;
                $cloned_field['is_hidden']=1;
                DB::table('par_formtype_fields')->insert($cloned_field);
            }

            DB::commit();
        }
        catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }

    public function checkApplicationRespondedUnclosedQueries(Request $request)
    {
        $application_code = $request->input('application_code');
        try {
            $hasUnStructuredQueries = $this->checkUnstructuredApplicationRaisedQueries($application_code, array(2));
            $hasStructuredQueries = $this->checkChecklistBasedApplicationRaisedQueries($application_code, array(2));
            if ($hasUnStructuredQueries == 1 || $hasStructuredQueries == 1) {
                $hasQueries = 1;
            } else {
                $hasQueries = 0;
            }
            $res = array(
                'success' => true,
                'hasQueries' => $hasQueries
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function refreshCounters()
    {
        $user_id = \Auth::user()->id;
        $scheduledtcmeeting_counter = getUserScheduledtcmeetingCounter($user_id);
        $notifications_counter = getUserNotificationsCounter($user_id);

        $res = array(
            'success'=> true,
            'notifications' => $notifications_counter,
            'meetings' => $scheduledtcmeeting_counter
        );
        return \response()->json($res);
    }
    public function getVariationRecommendationComment(Request $req)
    {

        $application_code = $req->input('application_code');
        $field_id = $req->input('field_id');
        $module_id = $req->input('module_id');
        $variation_type_id = $req->input('variation_type_id');
        try {
            $qry = DB::table('tra_premise_variation_recommendations as t1')
                ->leftJoin('par_recommendations as t2', 't1.recommendation_id', 't2.id')
                ->leftJoin('users as t3', 't1.created_by', 't3.id')
                ->leftJoin('wf_stage_categories as t4', 't1.stage_category_id', 't4.id')
                ->select('t1.*','t1.remarks as comment', 't2.name as recommendation_name', 't1.created_on as recommendation_date','t4.name as stage_category', DB::raw("CONCAT(decryptval(t3.first_name," . getDecryptFunParams() . "),decryptval(t3.last_name," . getDecryptFunParams() . ")) as author"));

            if (validateIsNumeric($application_code)) {
                $qry->where('application_code', $application_code);
            }
            if (validateIsNumeric($variation_type_id)) {
                $qry->where('variation_type_id', $variation_type_id);
            }
            if (validateIsNumeric($module_id)) {
                $qry->where('module_id', $module_id);
            }
            if (validateIsNumeric($field_id)) {
                $qry->where('field_id', $field_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveVariationFieldApproval(Request $req)
    {
        try{
            $application_code = $req->input('application_code');
            $field_id = $req->input('field_id');
            $module_id = $req->input('module_id');
            $variation_type_id = $req->input('variation_type_id');
            $decision_id = $req->input('decision_id');
            $remarks = $req->input('remarks');
            $id = $req->input('id');
            $premise_id = 0;
            $data = array(
                'application_code' =>$application_code,
                'field_id' =>$field_id,
                'module_id' =>$module_id,
                'variation_type_id' =>$variation_type_id,
                'decision_id' =>$decision_id,
                'remarks' =>$remarks,
            );
            //log approval decisions
            if(validateIsNumeric($id)){
                $res = updateRecord('tra_premise_variation_approvals', ['id'=>$id], $data);
            }else{
                $res = insertRecord('tra_premise_variation_approvals', $data);
            }
            //update the records in variation entry if decision is approval
            if($decision_id == 1){
                if($variation_type_id == 1){//edit to grid records
                    $table_name = getSingleRecordColValue('par_variation_points', ['id'=>$field_id], 'table_name');
                    $original_table = str_replace("_variations","",$table_name);
                    //special conditions for each module
                    if($module_id == 2){ //premises checks
                        $premise_id = getSingleRecordColValue('tra_premises_applications', ['application_code'=>$application_code], 'premise_id');
                        $where = array('premise_id'=>$premise_id);
                    }else{
                        //update where
                        $where=array('application_code'=>$application_code);
                    }
                    //remove entry from original cloned entry
                    deleteRecord($original_table, $where);
                    //get variated records and add entry to original table
                    $var_records = DB::table($table_name)->where('application_code', $application_code)->get();
                    foreach($var_records as $rec) {
                       $var_data = convertStdClassObjToArray($rec);
                       //checks on what not to carry
                       if($module_id == 2){//for premises maintain just premise id
                            unset($var_data['application_code']);
                            unset($var_data['id']);
                            //add entry
                            if($table_name == 'tra_contact_person_variations'){
                                //update primary premise table
                                $update_data = array(
                                    'contact_person_id' => $var_data['contact_person_id'],
                                    'contact_person_startdate' => $var_data['contact_person_startdate'],
                                    'contact_person_enddate'=> $var_data['contact_person_enddate']
                                );
                                $res = updateRecord('tra_premises', ['id'=>$premise_id], $update_data);
                            }else{
                                $res = insertRecord($original_table, $var_data);
                            }

                       }else{
                           unset($var_data['id']);
                           //add entry
                           $res = insertRecord($original_table, $var_data);
                       }
                    }
                }else if($variation_type_id == 2){ //edit to form fields
                    //filter special conditions for each module
                    if($module_id == 2){ //premises checks
                        $premise_id = getSingleRecordColValue('tra_premises_applications', ['application_code'=>$application_code], 'premise_id');
                    }
                    //default filter
                    $where=array('application_code'=>$application_code, 'module_id'=>$module_id, 'field_id'=>$field_id);
                    //get variation record
                    $rec = DB::table('tra_application_variationsdata as t1')
                            ->join('par_formfield_designs as t2', 't1.field', 't2.field_name')
                            ->where('t1.application_code', $application_code)
                            ->where('t2.id', $field_id)
                            ->first();

                    $var_data = array(
                        $rec->field => $rec->new_value
                    );
                    //on each module update respective table
                    if($module_id == 2){
                       $res = updateRecord('tra_premises', ['id'=>$premise_id], $var_data);
                    }
                }
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }
    public function saveTCMeetingDetails(Request $request)
    {
        $id = $request->input('id');
        $application_code = $request->input('application_code');
        $meeting_name = $request->input('meeting_name');
        $meeting_desc = $request->input('meeting_desc');
        $date_requested = $request->input('date_requested');

        $workflow_stage_id = $request->input('workflow_stage_id');

        $meeting_time = $request->input('meeting_time');

        $meeting_venue = $request->input('meeting_venue');

        $module_id = $request->input('module_id');

        $sub_module_id = $request->input('sub_module_id');

        $section_id = $request->input('section_id');
        $selected = $request->input('selected');
        $selected_codes = json_decode($selected);
        $user_id = $this->user_id;
        if(!validateIsNumeric($workflow_stage_id)){
            return array('success'=>false, 'message'=>'No workflow information was shared');
        }
        $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
        $stage_category_id = $stage_data->stage_category_id;
        try {
            DB::beginTransaction();
            $params = array(
                'meeting_name' => $meeting_name,
                'meeting_desc' => $meeting_desc,
                'meeting_time' => $meeting_time,
                'meeting_venue' => $meeting_venue,
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'meeting_venue' => $meeting_venue,
                'date_requested' => $date_requested

            );
            if (validateIsNumeric($id)) {
                $params['altered_by'] = $user_id;
                // DB::table('tc_meeting_details')
                //     ->where('id', $id)
                //     ->update($params);
                updateRecord('tc_meeting_details', ['id'=>$id], $params);
            } else {
                $params['created_by'] = $user_id;
                $insert_res = insertRecord('tc_meeting_details', $params, $user_id);
                if(!isset($insert_res['success']) && $insert_res['success'] == false){
                    DB::rollback();
                    return $insert_res;
                }
                $id = $insert_res['record_id'];
                // $app_meeting = array(
                //     'application_code' => $application_code,
                //     'meeting_id' => $id,
                //     'stage_category_id' => $stage_category_id,
                //     'created_by' => $user_id
                // );
                // $meet_res = insertRecord('tc_meeting_applications', $app_meeting, $user_id);
                // if(!isset($meet_res['success']) && $meet_res['success'] == false){
                //     DB::rollback();
                //     return $meet_res;
                // }

            }
            $params2 = array();
            foreach ($selected_codes as $selected_code) {
                $params2[] = array(
                    'meeting_id' => $id,
                    'application_code' => $selected_code,
                    'stage_category_id' => $stage_category_id,
                    'created_by' => $this->user_id
                );
            }
            DB::table('tc_meeting_applications')
                ->where('meeting_id', $id)
                ->delete();
            // DB::table('tc_meeting_applications')
            //     ->insert($params2);
            insertMultipleRecords('tc_meeting_applications', $params2);
            //load participants based on assignment for surveillance
            if($module_id == 5 && $sub_module_id = 38){
                $this->addPMSMeetingParticipantsBasedOnAssignment($id, $selected_codes);
            }
            $res = array(
                'success' => true,
                'record_id' => $id,
                'message' => 'Details saved successfully!!'
            );
            DB::commit();
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function prepareRegMeetingStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $meeting_id = $request->input('meeting_id');
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $table_name = $request->input('table_name');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $stage_category_id = '';
        if(validateIsNumeric($module_id)){
            $table_name = getSingleRecordColValue('par_modules', array('id'=>$module_id), 'tablename');
        }
        if(validateIsNumeric($workflow_stage_id)){
            $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
            $stage_category_id = $stage_data->stage_category_id;
        }


        try {

            if(validateIsNumeric($meeting_id)){
                $qry = DB::table('tc_meeting_details as t3')
                ->select(DB::raw("t3.*"));
                $qry->where('t3.id', $meeting_id);
            }else{
                $qry = DB::table($table_name . ' as t1')
                ->join('tc_meeting_applications as t2', function ($join) use ($application_code) {
                    $join->on('t1.application_code', '=', 't2.application_code');
                })
                ->join('tc_meeting_details as t3', 't2.meeting_id', '=', 't3.id')
                ->select(DB::raw("t3.*"));
                $qry->where('t1.id', $application_id);
            }
            if($stage_category_id == 6 || $stage_category_id == 7){
                $qry->whereRaw("(stage_category_id = 6 OR stage_category_id = 7)");
            }
            if($stage_category_id == 8 || $stage_category_id == 9){
                $qry->whereRaw("(stage_category_id = 8 OR stage_category_id = 9)");
            }
            $results = $qry->first();
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
    public function getAllApplicationQueries(Request $request)
    {
        try {
            $application_code = $request->application_code;
            $process_id = $request->process_id;
            $results = array();
            $user_id = \Auth::user()->id;
            // if(validateIsNumeric($application_code)){
            //    $structuredQueries = convertStdClassObjToArray($this->getAllApplicationStructuredQueries($request));
            //  $unStructuredQueries = convertStdClassObjToArray($this->getAllApplicationUnstructuredQueries($request));
            //  $results = array_merge($structuredQueries, $unStructuredQueries);
            //}
            $qry = DB::table('tra_application_query_reftracker as t1')
                    ->leftJoin('par_query_types as t2', 't1.query_type_id', 't2.id')
                    ->leftJoin('par_checklist_categories as t3', 't1.checklist_category_id', 't3.id')
                    ->leftJoin('users as t4', 't1.queried_by', 't4.id')
                    ->leftJoin('par_query_statuses as t5', 't1.status_id', 't5.id')
                    ->leftJoin('tra_query_invoices as t6', 't1.id', 't6.query_id')
                    // ->leftJoin('tra_checklistitems_queries as t7', 't1.id', 't7.query_id')
                    //get stage category
                    ->leftJoin('tra_submissions as t8', function ($join) {
                        $join->on('t1.application_code', '=', 't8.application_code')
                            ->orderBy('id', 'DESC')
                            ->where('t8.is_done', 0)
                            ->where('t8.isComplete', 0)
                            ->limit(1);
                    })
                    ->leftJoin('wf_workflow_stages as t9', 't8.current_stage', 't9.id')
                    ->select('t1.id as query_id', 't1.*', 't2.name as query_type','t3.name as checklist_category',
                     't1.query_remark as comment','t1.status_id as status', 't5.name as query_status', 't6.invoice_id', 't9.stage_category_id','t1.queried_by as queried_by_id',
                     DB::raw("CONCAT(decryptval(t4.first_name," . getDecryptFunParams() . "),decryptval(t4.last_name," . getDecryptFunParams() . ")) as queried_by, $user_id as current_user_id, 0 as sign_file"));
                    // ->groupBy('t1.id,t2.name');
            if(validateIsNumeric($application_code)){
                $qry->where('t1.application_code', $application_code);
            }
            if(validateIsNumeric($process_id)){
                $qry->where('t1.process_id', $process_id);
            }
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
    public function addPMSMeetingParticipantsBasedOnAssignment($meeting_id, $selected_codes){
        $application_ids = DB::table('tra_surveillance_sample_details')
                        ->whereIn('application_code', $selected_codes)
                        ->select('id','application_id')
                        ->get();
        $application_id_arrays = convertStdClassObjToArray($application_ids);
        $app_ids = convertAssArrayToSimpleArray($application_id_arrays, 'id');
        //commit assignment makes them available for specific sample application
        $original_app_ids = convertAssArrayToSimpleArray($application_id_arrays, 'application_id');
        $all_without_reasignemnts = DB::table('tra_surveillance_sample_details as t1')
                                    ->leftJoin('tra_sample_collectors_assignments as t2', function ($join) {
                                            $join->on('t1.pms_plan_id', 't2.pms_plan_id')
                                                ->on('t1.id', 't2.application_id');
                                        })
                                    ->whereIn('t1.application_code', $selected_codes)
                                    ->whereNull('t2.id') //all that are not assigned
                                    ->select(DB::raw("DISTINCT ON (1) t1.id, t1.pms_plan_id"))
                                    ->get();
        $manager_assigned_collectors = [];
        $collectors=[];
        if(!$all_without_reasignemnts->isEmpty()){
            $manager_assigned_collectors = DB::table('tra_sample_collectors_assignments as t1')
                                ->whereIn('application_id', $original_app_ids)
                                ->select(DB::raw("DISTINCT ON (1) user_id"))
                                ->get();
            //delete the original mappings
            DB::table('tra_sample_collectors_assignments')->whereIn('application_id', $original_app_ids)->delete();
        }
        foreach ($all_without_reasignemnts as $sample_details) {
            foreach ($manager_assigned_collectors as $manager_assigned_collector) {
                 $collectors[] = array(
                        'application_id' => $sample_details->id,
                        'pms_plan_id' => $sample_details->pms_plan_id,
                        'user_id' => $manager_assigned_collector->user_id
                        // 'is_commited' => 1
                    );
            }
        }
        //insert assignments by manager afresh
        if(count($collectors) > 0){
           insertMultipleRecords('tra_sample_collectors_assignments', $collectors);
        }

        //proceed to map meeting participants
        $params = [];
        $assigned_collectors = DB::table('tra_sample_collectors_assignments as t1')
                                ->join('users as t2', 't1.user_id', 't2.id')
                                ->whereIn('application_id', $app_ids)
                                ->select(DB::raw("DISTINCT ON (1) user_id, CONCAT(decryptval(t2.first_name," . getDecryptFunParams() . "),decryptval(t2.last_name," . getDecryptFunParams() . ")) as participant_name, decryptval(t2.phone," . getDecryptFunParams() . ") as phone, t2.email"))
                                ->get();

        //map participants
         foreach ($assigned_collectors as $assigned_collector) {
            $check = array(
                'user_id' => $assigned_collector->user_id,
                'meeting_id' => $meeting_id
            );
            if (DB::table('tc_meeting_participants')
                    ->where($check)->count() == 0) {
                $params[] = array(
                    'meeting_id' => $meeting_id,
                    'user_id' => $assigned_collector->user_id,
                    'participant_name' => $assigned_collector->participant_name,
                    'phone' => $assigned_collector->phone,
                    'email' => $assigned_collector->email,
                    'created_by' => $this->user_id
                );
            }
        }
        if(count($params) > 0){
            $res = insertMultipleRecords('tc_meeting_participants', $params);
            return $res;
        }
        return array(
            'message'=> 'Already set',
            'success' => true,
            'affected_rows' => false
        );
    }
     function validateRequiredApplicationDetails($table_name, $application_code, $title){

        $record = DB::table($table_name)->where('application_code',$application_code)->first();
        if($record){
            $res = array('success'=>true, 'message'=>'');
        }
        else{
            $res = array('success'=>true, 'message'=>$title);
        }
        return $res;
    }
    public function checkApprovalREcommendationDEtails(Request $req){
        try {

                $res = $this->validateRequiredApplicationDetails('tra_approval_recommendations', $req->application_code, 'Approval Recommendation has been filled successfully');

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function checkIfHasGeneratedInvoiceDEtails(Request $req){
        try {

                $res = $this->validateRequiredApplicationDetails('tra_application_invoices', $req->application_code, 'Generate Application invoice to proceed.');


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
     public function validateHasUploadedDocumentsDetils(Request $req){
        try {
                $res = $this->validateRequiredApplicationDetails('tra_application_uploadeddocuments', $req->application_code, 'Upload te Required Documents');
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        $res = array('success'=>true, 'message'=>'');
        return \response()->json($res);
    }
    public function checkApplicationChecklistDetails(Request $request){

        try {
                $res = $this->validateApplicationChecklistDetails($request);

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
    public function validateApplicationChecklistDetails($request){
        $checklist_type = $request->input('checklist_type');
        $checklist_category_id = $request->input('checklist_category_id');
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $process_id = $request->input('process_id');
        $section_id = $request->input('section_id');
        $is_previous = $request->input('is_previous');
        $workflow_stage = $request->input('workflow_stage');
        if($module_id == 4){
            $sub_module_id = 12;
            $where2 = array(
                'module_id' => $module_id
            );
        }else{
            $where2 = array(
                'sub_module_id' => $sub_module_id
            );
        }

       if(validateIsNumeric($section_id)){
            $where2['section_id'] = $section_id;
        }
        else{
            $section_id =0;
        }


        $where = array(
            'process_id' => $process_id,
            'stage_id' => $workflow_stage
        );

        try {
     $where2 = DB::table('wf_processes')
                ->select('module_id', 'sub_module_id', 'section_id')
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
            $checklist_categoriesdata = $qry1->get();


            $checklist_categories = convertStdClassObjToArray($checklist_categories);
            $checklist_categories = convertAssArrayToSimpleArray($checklist_categories, 'checklist_category_id');
            //get applicable checklist types
            $qry2 = DB::table('par_checklist_types as t1')
                ->select('t1.id')
                ->where($where2)
                ->whereIn('checklist_category_id', $checklist_categories);
            $checklist_types = $qry2->get();

            $checklist_types = convertStdClassObjToArray($checklist_types);
            $checklist_types = convertAssArrayToSimpleArray($checklist_types, 'id');

            $qry = DB::table('par_checklist_items as t1')
                ->leftJoin('tra_checklistitems_responses as t2', function ($join) use ($application_code, $is_previous) {
                    $join->on('t2.checklist_item_id', '=', 't1.id')
                        ->where('t2.application_code', $application_code);
                })
                ->join('par_checklist_types as t3', 't1.checklist_type_id', '=', 't3.id')
                ->select(DB::raw("t1.*,t2.id as item_resp_id,t2.pass_status,t2.comment,t2.observation,t2.auditor_comment,t3.name as checklist_type,
                            $module_id as module_id,$sub_module_id as sub_module_id"));

            if (isset($checklist_type) && $checklist_type != '') {
                $qry->where('t1.checklist_type_id', $checklist_type);
            } else {
                $qry->whereIn('t1.checklist_type_id', $checklist_types);
            }
            $results = $qry->get();

            if(count($results) >0){
                 $hasValidatedChecklist = true;

                    if (validateIsNumeric($checklist_category_id)) {
                            foreach($results as $rec){
                                $item_resp_id = $rec->item_resp_id;
                                if( $item_resp_id == ''){
                                    //$hasValidatedChecklist = false;
                                }
                            }
                    }else{
                        foreach($results as $rec){
                                $item_resp_id = $rec->item_resp_id;
                                if( $item_resp_id == ''){
                                    //$hasValidatedChecklist = false;
                                }
                            }
                    }
            }
            else{
                    $hasValidatedChecklist = false;
            }

            $res = array(
                'success' => true,
                'hasValidatedChecklist' => $hasValidatedChecklist,
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


        return $res;
    }
    public function getImporPermitApplicationApprovalDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $approval_table = $request->input('approval_table');
        $application_code = $request->input('application_code');
        if($approval_table == ''){
            $approval_table = 'tra_managerpermits_review';
        }
        try {
            $where = array(
                't1.application_id' => $application_id,
                't1.application_code' => $application_code
            );
            $qry = DB::table($approval_table.' as t1')
                ->select('t1.*', 't1.id as recommendation_id')
                ->where($where)
                ->orderBy('t1.id', 'DESC');
            $results = $qry->first();
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
    public function checkReviewREcommendationDEtails(Request $req){
        try {

            $res = $this->validateRequiredApplicationDetails('tra_managerpermits_review', $req->application_code, 'Manager Review Recommendation not filled successfully');


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getPermitReleaseRecommendationDetails(Request $req){

        $application_code = $req->input('application_code');
        try {
            $where = array(
            't1.application_code' => $application_code
            );
            $qry = DB::table('tra_permitsrelease_recommendation as t1')
            ->select('t1.*', 't1.id as recommendation_id')
            ->where($where)
            ->orderBy('t1.id', 'DESC');
            $results = $qry->first();
            $res = array(
            'success' => true,
            'results' => $results,
            'message' => 'All is well'
            );
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getApplicationPaymentDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $where = array(
         //   'application_id' => $application_id,
            'application_code' => $application_code
        );

        try {
            $qry = DB::table('tra_payments as t1')
                ->leftJoin('par_payment_modes as t2', 't1.payment_mode_id', '=', 't2.id')
                ->leftJoin('par_currencies as t3', 't1.currency_id', '=', 't3.id')
                ->leftJoin('par_receipt_types as t4', 't1.receipt_type_id', '=', 't4.id')
                ->select(DB::raw("t1.*,t2.name as payment_mode,t3.name as currency,t4.name as receipt_type"))
                ->where($where);
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


    public function testApi(Request $req){
        $data = $req->fullname;
        return array('success'=>true, 'message'=> $data);
    }
    public function getCaseDecisionsLogs(Request $req)
    {

        $application_code = $req->input('application_code');
        $module_id = $req->input('module_id');
        try {
            $qry = DB::table('tra_case_recommendations as t1')
                ->leftJoin('par_recommendations as t2', 't1.recommendation_id', 't2.id')
                ->leftJoin('users as t3', 't1.created_by', 't3.id')
                ->leftJoin('wf_stage_categories as t4', 't1.stage_category_id', 't4.id')
                ->leftJoin('par_case_decisions as t5', 't1.case_decision_id', 't5.id')
                ->select('t1.*', 't2.name as recommendation','t5.name as decision', 't1.created_on as recommendation_date', DB::raw("CONCAT(decryptval(t3.first_name," . getDecryptFunParams() . "),decryptval(t3.last_name," . getDecryptFunParams() . ")) as recommended_by"), 't4.name as stage_name');

            $qry->where('application_code', $application_code);
            $qry->where('module_id', $module_id);

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function updateChecklistItemsQueries(Request $req){
        $query_data = $req->query_data;
        $queries = json_decode($query_data);

        foreach ($queries as $query) {
            $checklist_item_id = $query->checklist_item_id;
            dd($checklist_item_id);
        }

    }
    public function submitJointOperationActivities(Request $req)
    {
        try {
            //par_joint_activities_details
            $activity_date = Carbon::now();
            $user_id = \Auth::user()->id;
            $table_name = 'par_joint_activities_details';
            $check = array(
                            'start_date' => $activity_date
                        );
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }

            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();
            //check stage category
            if(!validateIsNumeric($workflow_stage_id)){
                return array('success'=>false, 'message'=> "Faild to fetch stage details");
            }
            $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
            $stage_category_id = $stage_data->stage_category_id;
            $table_data['stage_category_id'] = $stage_category_id;
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data);
                }
            } else {
                $res = insertRecord($table_name, $table_data);
            }
        } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
//  DB::transaction(function () use ($selected_users, $meeting_id, $where) {
//     $params = array();
    // foreach ($selected_users as $selected_user) {
    //     $check = array(
    //         'user_id' => $selected_user->user_id,
    //         'meeting_id' => $meeting_id
    //     );
    //     if (DB::table('tc_meeting_participants')
    //             ->where($check)->count() == 0) {
    //         $params[] = array(
    //             'meeting_id' => $meeting_id,
    //             'user_id' => $selected_user->user_id,
    //             'participant_name' => $selected_user->participant_name,
    //             'phone' => $selected_user->phone,
    //             'email' => $selected_user->email,
    //             'created_by' => $this->user_id
    //         );
    //     }
    // }

    public function getPlannedActivities(Request $req)
    {
    $activity_date = Carbon::now();
        $res = array('success'=>true, 'message'=>'synchronization was successfull');

        try {
            $qry = DB::table('par_joint_activities_details as t1')
                ->leftJoin('tra_jointOperation_information as t2', 't1.application_code', 't2.application_code')
                ->leftJoin('tra_enforcement_applications as t3', 't1.application_code', 't3.application_code')

                ->select('t1.*','t2.*','t3.*');

            $qry->where('t1.start_date', $activity_date);

            $results = $qry->get();
            // dd($results);
            foreach ($results as $results) {
                $submission_params = array(
                    'application_id' => $results->id,
                    'view_id' =>  $results->view_id,
                    'process_id' => $results->process_id,
                    'application_code' => $results->application_code,
                    'tracking_no' => $results->tracking_no,
                    'reference_no' => $results->reference_no,
                    'usr_to' => $results->officer,
                    'previous_stage' => $results->workflow_stage_id,
                    //'current_stage' => $results->workflow_stage_id,
                    'current_stage' =>1175,
                    //1175
                    'module_id' => $results->module_id,
                    'sub_module_id' => $results->sub_module_id,
                    'section_id' => $results->section_id,
                    'application_status_id' => $results->application_status_id,
                    'usr_from' => $results->created_by,
                    'urgency' => 1,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                'created_by' => $results->created_by,
                );
                DB::table('tra_submissions')
                    ->insert($submission_params);

        }
            DB::commit();
        }
        catch (\Exception $exception) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return response()->json($res);
    }
    public function submitPlannedActivities(Request $request)
    {
        $activity_date = Carbon::now();
        $res = array('success'=>true, 'message'=>'synchronization was successfull');
        try {
                $qry = DB::table('par_joint_activities_details as t1')
                ->leftJoin('tra_jointOperation_information as t2', 't1.application_code', 't2.application_code')
                ->leftJoin('tra_enforcement_applications as t3', 't1.application_code', 't3.application_code')

                ->select('t1.*','t2.*','t3.*','t3.id as application_id','t3.applicant_id as applicant_id');
            // $qry->where('t1.start_date', $activity_date);
            $results = $qry->get();
        //dd($results);
        foreach($results as $results){
            $enforcement_data = array(
        'enforcement_id'=>$results->enforcement_id,
        'department_name'=>$results->department_name,
        'organizing_officer'=>$results->organizing_officer,
        'organizing_officer_title'=>$results->organizing_officer_title,
        'email'=>$results->email,
        'address'=>$results->address,
        'phone'=>$results->phone,
        'activity'=>$results->activity,
        'objective'=>$results->objective,
        'scope'=>$results->scope,
        'start_date'=>$results->start_date,
        'end_date'=>$results->end_date,
        );
        $officer=$results->officer;
        $active_application_id='';
        $applicant_id=$results->applicant_id;
        //dd($results);
        $section_id=$results->section_id;
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $process_id=$results->process_id;
        $workflow_stage_id=$results->workflow_stage_id;
        $enforcement_id=$results->enforcement_id;
        $user_id = $this->user_id;

            //dd($workflow_stage_id);
            DB::beginTransaction();
            $applications_table = 'tra_enforcement_applications';
            $enforcement_table='tra_jointOperation_information';

            //   $where_app = array(
            //       'id' => $active_application_id
            //   );
            //Edit enforcement Application
            //   if ($active_application_id != "") {

            //       $application_params = array(
            //           'applicant_id' => $applicant_id
            //       );
                //   $where_app = array(
                //       'id' => $active_application_id
                //   );

                $where_enforcement = array(
                    'id' => $enforcement_id
                );

            //       if (recordExists($applications_table, $where_app)) {

            //           $app_details = getPreviousRecords($applications_table, $where_app);

            //           if ($app_details['success'] == false) {
            //               DB::rollBack();
            //               return $app_details;
            //           }
            //           $app_details = $app_details['results'];

            //           $app_res = updateRecord($applications_table, $where_app, $application_params, $user_id);
            //           if ($app_res['success'] == false) {
            //               DB::rollBack();
            //               return $app_res;
            //           }

            //       }

            //       $application_code = $app_details[0]['application_code'];//$app_details->application_code;
            //       $tracking_no = $app_details[0]['tracking_no'];
            //       $reference_no = $app_details[0]['reference_no'];

            //       // EDIT
            //       if(recordExists($enforcement_table, $where_enforcement)){
            //           $enforcement_data['dola'] = Carbon::now();
            //           $enforcement_data['altered_by'] = $user_id;
            //           $previous_data = getPreviousRecords($enforcement_table, $where_enforcement);
            //           if ($previous_data['success'] == false) {
            //               DB::rollBack();
            //               return $previous_data;
            //           }

            //           $previous_data = $previous_data['results'];
            //           $res = updateRecord($enforcement_table, $where_enforcement, $enforcement_data, $user_id);

            //           // initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
            //           $res['active_application_id'] = $active_application_id;
            //           $res['active_application_code'] = $application_code;
            //           $res['enforcement_id'] = $enforcement_id;
            //           $res['reference_no'] = $reference_no;
            //           $res['tracking_no'] = $tracking_no;
            //           DB::commit();
            //       }
            //   }
            //   else
            //   {
                //Insert
                $enforcement_res = insertRecord($enforcement_table, $enforcement_data, $user_id);

                if ($enforcement_res['success'] == false) {
                    DB::rollBack();
                    return $enforcement_res;
                }

                //tracking the application
                $enforcement_id=$enforcement_res['record_id'];

                //Application_create
                $codes_array =  $this->getEnforcementApplicationReferenceCodes($request);
                $view_id = generateApplicationViewID();
                $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id,1, $user_id);
                $application_code = generateApplicationCode($sub_module_id, $applications_table);
                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                if ($tracking_details['success'] == false) {
                    DB::rollBack();
                    return \response()->json($tracking_details);
                }

                $tracking_no = $tracking_details['tracking_no'];
                $reference_no = $tracking_details['tracking_no'];
                $reference_no = str_replace("TRC", 'BMR', $reference_no);


                $application_params = array(
                    'view_id' => $view_id,
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_code' => $application_code,
                    'process_id' => $process_id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'tracking_no' => $tracking_no,
                    'reference_no' => $reference_no,
                    'enforcement_id' => $enforcement_id,
                    'application_status_id' => $application_status->status_id,
                    "date_added" => Carbon::now(),
                    "created_by" => \Auth::user()->id,
                    "created_on" => Carbon::now()
                );

                $res = insertRecord($applications_table, $application_params, $user_id);

                if(!isset($res['record_id'])){
                    DB::rollBack();
                    return $res;
                }

                $active_application_id = $res['record_id'];

                // createInitialRegistrationRecord('tra_enforcement_applications', $applications_table, $reg_params, $application_id, 'reg_premise_id');
                //DMS

            //   initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no, $user_id);
                // add to submissions table
                $submission_params = array(
                    'application_id' => $active_application_id,
                    'view_id' => $view_id,
                    'process_id' => $process_id,
                    'application_code' => $application_code,
                    'tracking_no' => $tracking_no,
                    'reference_no' => $reference_no,
                    'usr_from' => $user_id,
                    'usr_to' => $officer,
                    'previous_stage' => $workflow_stage_id,
                    'current_stage' => 1175,
                    //1175
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_status_id' => $application_status->status_id,
                    'urgency' => 1,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );
                DB::table('tra_submissions')
                    ->insert($submission_params);
        //   }
            DB::commit();

            $res['active_application_id'] = $active_application_id;
            $res['process_id'] = $process_id;
            $res['application_code'] = $application_code;
            $res['tracking_no'] = $tracking_no;
            $res['reference_no'] = $reference_no;
            $res['enforcement_id'] = $enforcement_id;
            $res['msg'] = 'Record Saved Successfully';
            $res['success']=true;
            }

                } catch (\Exception $exception) {
                    DB::rollBack();
                    $res = array(
                        'success' => false,
                        'message' => $exception->getMessage()
                    );
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        }
        return \response()->json($res);
    }
    public function getEnforcementApplicationReferenceCodes($application_details)
    {
        $section_code = getSingleRecordColValue('par_sections', array('id' => $application_details->section_id), 'code');

        $codes_array = array(
            'section_code' => $section_code,
        );

        return $codes_array;
    }
    static function getSingleRecordColValue($table, $where, $col, $con)
    {
        $val = DB::connection($con)->table($table)->where($where)->value($col);
        return $val;
    }
    public function callback(Request $req){
        $data = $req->all();
        dd($data);
        return true;
    }
    public function Initiate(Request $req){
        //encryption key set in the Merchant Access Portal
        $encryptionKey = 'iXtdAEksEJi4';
        $tracking_no = $req->tracking_no;
        $amount = $req->amount;

        $DateTime = Carbon::now();

        $data = array(
            'PAYGATE_ID'        => 1047816100012,
            'REFERENCE'         => $tracking_no,
            'AMOUNT'            => $amount,
            'CURRENCY'          => 'BWP',
            'RETURN_URL'        => 'https://2ba2-41-90-178-34.in.ngrok.io/BOMRA-IRMIS/development/mis/api/callback',
            'TRANSACTION_DATE'  => $DateTime->format('Y-m-d H:i:s'),
            'LOCALE'            => 'en-za',
            'COUNTRY'           => 'BWA',
            'EMAIL'             => 'kunguadvert@gmail.com',
            // 'PAY_METHOD'        => 'CC',
            'NOTIFY_URL'        => 'https://2ba2-41-90-178-34.in.ngrok.io/BOMRA-IRMIS/development/mis/api/callback'
        );

        $checksum = md5(implode('', $data) . $encryptionKey);

        $data['CHECKSUM'] = $checksum;

        $fieldsString = http_build_query($data);

        //open connection
        $ch = curl_init();

        //set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, 'https://secure.paygate.co.za/payweb3/initiate.trans');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, false);
        curl_setopt($ch, CURLOPT_REFERER, $_SERVER['HTTP_HOST']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fieldsString);

        //execute post
        $result = curl_exec($ch);

        //close connection
        curl_close($ch);
        parse_str($result, $res);
        if(isset($res['PAY_REQUEST_ID'])){
            $res = array(
                'success' => true,
                'PAY_REQUEST_ID' => $res['PAY_REQUEST_ID'],
                'CHECKSUM' => $res['CHECKSUM']
            );
        }else{
            $res = $result;
        }
        
        return $res;
    }
    public function getTransactionDetails(Request $req){
        //encryption key set in the Merchant Access Portal
        $encryptionKey = 'iXtdAEksEJi4';

        $data = array(
            'PAYGATE_ID'        => 1047816100012,
            'PAY_REQUEST_ID'    => $req->PAY_REQUEST_ID, //'A844276E-778E-A657-8B09-E3ED04E75EEE',
            'REFERENCE'         => $req->tracking_no //'TRC0014322'
        );

        $checksum = md5(implode('', $data) . $encryptionKey);

        $data['CHECKSUM'] = $checksum;

        $fieldsString = http_build_query($data);

        //open connection
        $ch = curl_init();

        //set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, 'https://secure.paygate.co.za/payweb3/query.trans');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_NOBODY, false);
        curl_setopt($ch, CURLOPT_REFERER, $_SERVER['HTTP_HOST']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fieldsString);

        //execute post
        $result = curl_exec($ch);
        parse_str($result, $res);
        //close connection
        curl_close($ch);

        if(isset($res['TRANSACTION_STATUS'])){
            if($res['TRANSACTION_STATUS'] == 1){
                $res = array(
                    'success' => true,
                    'is_cleared' => 1,
                    'message' => 'Cleared'
                );
            }else if($res['TRANSACTION_STATUS'] == 2 || $res['TRANSACTION_STATUS'] == 3 || $res['TRANSACTION_STATUS'] == 4){
                $res = array(
                    'success' => true,
                    'is_cleared' => 0,
                    'message' => 'Cancelled/Declined'
                );
            }
        }
        else{
            $res = array(
                'success' => false
            );
        }

        return $res;
    }
    public function test(){
        $menus = array(
            ['text'=>'Home', 'path'=> '/home', 'icon'=> 'home'],
            ['text'=>'Product Registration', 'icon'=> 'folder',
                'items'=> [
                    ['text' => 'Product Dashboard','path' => '/public', 'icon'=> 'chart'],
                    ['text' => 'Your Products','path' => '/tasks', 'icon'=> 'aligncenter'],
                ],
            ],
            ['text'=>'Account Management', 'icon'=> 'user',
                'items'=> [
                    ['text' => 'User Profile','path' => '/profile', 'icon'=> 'user'],
                    ['text' => 'Authorised User Accounts','path' => '/users', 'icon'=> 'aligncenter'],
                ],
            ],
        );
        return \response()->json($menus);
    }
    public function submitApplicationForInvestigation($application_code, $investigate_action_id, $app_details){
    // dd($app_details);
        //dd($joint_operation_id);
        //joint_operation_id
        {
            //applicant_id
            //workflow_stage_id
            // $active_application_id = $request->input('active_application_id');
            // $process_id = $request->input('process_id');
            // $workflow_stage_id = $request->input('workflow_stage_id');
            // $section_id = $request->input('section_id');
            // $module_id = $request->input('module_id');
            // $sub_module_id = $request->input('sub_module_id');
            // $applicant_id = $request->input('applicant_id');
            // $suspect_name = $request->input('suspect_name');

            // $enforcement_data = array(
            //     'report_type_id'=>$request->report_type_id,
            //     'section_id'=>$request->section_id,
            //     //internal
            //     'reported_by_id'=>$request->reported_by_id,
            //     'department'=>$request->department,
            //     'reporter_designation'=>$request->reporter_designation,
            //     'fullnames'=>$request->fullnames,
            //     'department_name'=>$request->department_name,
            //     'approved_by_id'=>$request->approved_by_id,
            //     'approver_designation'=>$request->approver_designation,
            //     'email'=>$request->email,
            //     'phone'=>$request->phone,
            //     'gender'=>$request->gender,
            //     'age'=>$request->age,
            //     );

            try {
                $joint_operation_id=$app_details->joint_operation_id;
                $sub_module_id =86;
                $module_id =8;
                $section_id =2;
                $workflow_stage_id=1131;
                $process_id=175;
                $init_enforcement_id = $app_details->joint_operation_id;

                $qry = DB::table('tra_jointOperation_information as t1')
                ->leftJoin('tra_enforcement_applications as t3', 't1.application_code', 't3.application_code')
                ->select('t1.*','t3.*','t3.id as application_id','t3.applicant_id as applicant_id');
            $qry->where('t1.id', $joint_operation_id);
            $results = $qry->first();
            //dd($results);

            $enforcement_data=array(
                'start_date'=>$results->start_date,
                'end_date'=>$results->end_date,
                'organizing_officer'=>$results->organizing_officer,
                'organizing_officer_title'=>$results->organizing_officer_title,
                'address'=>$results->address,
                'email'=>$results->email,
                'number'=>$results->number,
                'activity'=>$results->activity,
                'scope'=>$results->scope,
                'objective'=>$results->objective,
                'department_name'=>$results->department_name,
                'phone'=>$results->phone,
                'internal_operative'=>$results->internal_operative,
                'external_operative'=>$results->external_operative,
            );
                DB::beginTransaction();
                $applications_table = 'tra_enforcement_applications';
                //$enforcement_table='tra_enforcement_information';
                $enforcement_table='tra_jointOperation_information';

                $where_enforcement = array(
                    'id' => $init_enforcement_id
                );
            // dd($enforcement_table);
                //Edit enforcement Application

                    //Insert
                    // $anyOngoingApps = checkForOngoingApplications($init_enforcement_id, $applications_table, 'joint_operation_id', $process_id);
                    // dd($anyOngoingApps);
                    // if ($anyOngoingApps['exists'] == true) {
                    //     DB::rollBack();
                    //     $res = array(
                    //         'success' => false,
                    //         'message' => 'There is an applicaiton ongoing for the selected premise of Tracking Number '.$anyOngoingApps['tracking_no']. ' and Reference Number ' .$anyOngoingApps['ref_no']
                    //     );
                    //     return \response()->json($res);
                    // }

                    $init_enforcement_params = getTableData($enforcement_table, $where_enforcement);
                //dd($init_enforcement_params);
                    if (is_null($init_enforcement_params)) {
                        DB::rollBack();
                        $res = array(
                            'success' => false,
                            'message' => 'Problem encountered while fetching target enforcement details!!'
                        );
                    // return \response()->json($res);
                    }
                    $enforcement_data = $init_enforcement_params;
                    //dd($enforcement_data);
                    //$enforcement_data = convertStdClassObjToArray($enforcement_data);
                    //$enforcement_data['joint_oid'] = $init_enforcement_id;
                    // $enforcement_data['created_on'] = Carbon::now();
                    //$enforcement_data['created_by'] = $user_id;
                    //unset($enforcement_data['id']);
                // dd('user_id');
                    $enforcement_res = insertRecord($enforcement_table, $enforcement_data, $user_id);
                    dd($enforcement_res);
                    if ($enforcement_res['success'] == false) {
                        DB::rollBack();
                        return \response()->json("failed to save enforcement details");
                        exit();
                    }
                    //tracking the application
                    $enforcement_id=$enforcement_res['record_id'];

                    //Application_create
                    $view_id = generateApplicationViewID();
                    $codes_array =  $this->getEnforcementApplicationReferenceCodes($request);
                    $tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $process_id,1, $user_id);
                    $application_code = generateApplicationCode($sub_module_id, $applications_table);
                    $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                    if ($tracking_details['success'] == false) {
                        DB::rollBack();
                        return \response()->json($tracking_details);
                    }

                    $init_enforcement = DB::table('tra_enforcement_applications as t1')
                        ->select(DB::raw("t1.*"))
                        ->where('t1.joint_operation_id', $init_enforcement_id)
                        ->get();
                    $init_enforcement = convertStdClassObjToArray($init_enforcement);

                    $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id');
                        $where_statement = array('sub_module_id' => 85, 't1.enforcement_id' => $enforcement_id);
                        $primary_reference_no = getProductPrimaryReferenceNo($where_statement, 'tra_enforcement_applications');

                        $codes_array = array(
                            'ref_no' => $primary_reference_no
                        );

                        $ref_number = generateProductsSubRefNumber(null, $applications_table, $ref_id, $codes_array, $sub_module_id, $user_id);

                        if (!validateIsNumeric($ref_id )) {
                            return \response()->json(array('success'=>false, 'message'=>'Reference No Format has not been set, contact the system administrator'));
                        }
                        else if( $ref_number == ''){
                            return \response()->json(array('success'=>false,'tracking_no'=>$ref_number, 'message'=>$ref_number));
                        }
                    $tracking_no = $tracking_details['tracking_no'];
                    $reference_no = $init_enforcement[0]['reference_no'];
                    $application_id = $init_enforcement[0]['id'];


                    $application_params = array(
                        'view_id' => $view_id,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'section_id' => $section_id,
                        'application_code' => $application_code,
                        'applicant_id'=>$applicant_id,
                        'process_id' => $process_id,
                        'workflow_stage_id' => $workflow_stage_id,
                        'tracking_no' => $tracking_no,
                        'reference_no' => $reference_no,
                        'joint_operation_id' => $enforcement_id,
                        'application_status_id' => $application_status->status_id,
                        'case_status_id' => 1,
                        "case_opened" => Carbon::now(),
                        "date_added" => Carbon::now(),
                        "created_by" => \Auth::user()->id,
                        "created_on" => Carbon::now()
                    );

                    $where_app = array(
                        'id' => $application_id
                    );
                    // dd( $where_app);
                    $res = updateRecord($applications_table, $where_app, $application_params, $user_id);

                    // $res = insertRecord($applications_table, $application_params, $user_id);

                    if(!isset($res['record_id'])){
                        DB::rollBack();
                        return $res;
                    }
                    $active_application_id = $res['record_id'];

                    // createInitialRegistrationRecord('tra_enforcement_applications', $applications_table, $reg_params, $application_id, 'reg_premise_id');
                    //DMS
                // initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no, $user_id);
                    // add to submissions table
                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'view_id' => $view_id,
                        'process_id' => $process_id,
                        'application_code' => $application_code,
                        'tracking_no' => $tracking_no,
                        'reference_no' => $reference_no,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'section_id' => $section_id,
                        'application_status_id' => $application_status->status_id,
                        'urgency' => 1,
                        'remarks' => 'Initial save of the application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => $user_id
                    );
                    DB::table('tra_submissions')
                        ->insert($submission_params);
                //}

                $res['active_application_id'] = $active_application_id;
                // $res['process_id'] = $process_id;
                $res['application_code'] = $application_code;
                $res['tracking_no'] = $tracking_no;
                $res['reference_no'] = $reference_no;
                $res['enforcement_id'] = $enforcement_id;
                $res['msg'] = 'Record Saved Successfully';
                $res['success']=true;
            DB::commit();
            } catch (\Exception $exception) {
                DB::rollBack();
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }

    }
    public function mobileLogin(Request $req)
    {
        //authenticate
         $credentials = $req->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
         //get user details
         $email = $req->email;
         $password = $req->password;
         $user = User::where('email',$req->email)->first();

         //log unknown user attemps
         if (is_null($user) || $user == null || empty($user) || (!$user->exists())) {
            $attemptLoginParams = array(
                'email' => $email,
                'password' => $password,
                'ip_address' => request()->ip(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'time' => Carbon::now(),//date('Y-m-d H:i:s'),
                'attempt_status' => 1,//date('Y-m-d H:i:s')
                'mobile_login' => 1,
            );
            // dd($attemptLoginParams);
            insertRecord('tra_login_attempts', $attemptLoginParams, 1);
            $res = array(
                'success' => false,
                'message' => 'Authentication Failed...User or Password Mismatch!!'
            );
             return $res;
         }
         //check if account is blocked
        $check = DB::table('tra_blocked_accounts')->where('account_id', $user->id)->count();
        if($check > 0){
            $res = array(
                'success' => false,
                'message' => 'Your account has been blocked...Please contact system Admin/ICT!!'
            );
            return $res;
        }
         //register for web
         $credentials = array(
            'email' => $email,
            'password' => hashPwd($req->email, $user->uuid, $req->password)
         );

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $http = new \GuzzleHttp\Client();
            //clear or rather update the attempt count to 0
            $update = array(
                'attempt_status' => 2
            );
            $where = array('account_id'=>$user->id);
            updateRecord('tra_failed_login_attempts', $where, $update, 1);
            //register with passport authenticator for access token
            $response = $http->post(url('/').'/oauth/token', [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' =>config('constants.client_id'),
                    'client_secret' => config('constants.client_secret'),
                    'username' =>$req->email,
                    'password' => hashPwd($req->email, $user->uuid, $req->password),
                    'scope' => '*'
                ]
            ]);
            if($response->getStatusCode() == 200){
                $res = json_decode((string) $response->getBody(), true);
                //log successfull login
                $login_log = array(
                    'user_id' => $user->id,
                    'login_ip' => request()->ip(),
                    'login_device' => $_SERVER['HTTP_USER_AGENT'],
                    'login_time' => Carbon::now(),
                    'mobile_login' => 1
                );
                insertRecord('tra_login_logs', $login_log);
                if(isset($res['access_token'])){

                    $req->session()->put('token', funcEncrypt($res['access_token']));
                  
                    $response = ['success' => true, 'user' => $user, 'token' => $res['access_token']];
                }else{
                    $response = ['success' => false, 'user' => $user, 'token_issue' => $res];
                }

            }else{
                $response = ['message' => 'Client authorization failed', 'success' => false];
            }
            return $response;
        }else{
            //log login failed attempts for correct usernames
             $attemptsCount = DB::table('tra_failed_login_attempts')->where(array('account_id' => $user->id,'attempt_status' => 1))->orderBy('id', 'DESC')->first();

            if (!empty($attemptsCount) || (!is_null($attemptsCount))) {
                $no_of_attempts = $attemptsCount->attempts;
                $time1 =  Carbon::now()->format('Y-m-d H:i:s');//Carbon::now();//date('Y-m-d H:i:s');
                $time2 = $attemptsCount->time;
                //now check for time span
                $timeSpan = getTimeDiffHrs($time1, $time2);

                if ($timeSpan > 24) {
                    //clear or rather update the attempt count to 1
                    $update = array(
                        'attempt_status' => 2
                    );
                    $where = array('account_id'=>$user->id);
                    updateRecord('tra_failed_login_attempts', $where, $update, 1);
                    $no_of_attempts = 0;
                }
                //increment the counter
                //if counter is 4 then this was the last attempt so block the account
                if ($no_of_attempts == 3 || $no_of_attempts == '3' || $no_of_attempts > 3 || $no_of_attempts == 3 || $no_of_attempts == '3') {
                    $blockedAccountParams = array(
                        'account_id' => $user->id,
                        'email' => $email,
                        'date' => date('Y-m-d H:i:s'),
                        'reason' => 'Failed login attempts 3 times within 24hrs'
                    );
                    insertRecord('tra_blocked_accounts', $blockedAccountParams, 1);
                    $res = array(
                        'success' => false,
                        'message' => 'Authentication Failed...Your account has been blocked!!'
                    );
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Authentication Failed...You have ' . (3 - ($no_of_attempts + 1)) . ' attempts remaining!!'
                    );
                }
                //update
                $where = array('account_id' => $user->id,'attempt_status'=>1);
                $ee = updateRecord('tra_failed_login_attempts', $where, array('attempts' => $no_of_attempts + 1), 1);

                $response = $res;
            }
            //if its the first attemp
            else{
            //no attempts so fresh logging
                $attempts = 1;
                $loginAttemptsParams = array(
                    'account_id' => $user->id,
                    'email' => $email,
                    'ip_address' => request()->ip(),
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                    'attempts' => $attempts,
                    'time' => date('Y-m-d H:i:s'),
                    'attempt_status' => 1
                );
                insertRecord('tra_failed_login_attempts', $loginAttemptsParams, 1);
                $response = array(
                    'success' => false,
                    'message' => 'Authentication Failed...You have ' . (3 - $attempts) . ' attempts remaining!!!!'
                );
            }

            return $response;
        }
    }

    //PREMISE & GMP
    public function getInspectionApplications(Request $request)
    {
        $user_id = $request->user_id;
        $module_id = $request->module_id;
        $stage_category_id = $request->stage_category_id;
        $token = $request->bearerToken();
        
        try {
           
            if($token != null){
               
                //TABLES
                $risk_type = DB::table('par_risk_premise_types as t1')
                        ->select('t1.id','t1.name');
                $risk_type = $risk_type->get();
                    
                $facility_role = DB::table('par_risk_premise_types_roles as t1')
                        ->select('t1.id','t1.name','t1.risk_premise_type_id');
                $facility_role = $facility_role->get();
                    
                $facility_type = DB::table('par_risk_premise_types_mapping as t1')
                        ->leftjoin('par_premises_types as t2','t1.premise_type_id', '=', 't2.id')
                        ->select('t1.id as risk_premise_type','t2.name','t1.risk_premise_type_id');
                $facility_type = $facility_type->get();
                    
                $tables = array(
                    'facity_risk_type' => $risk_type,
                    'facility_type' => $facility_type,
                    'facility_role' => $facility_role,
                );
                
                //FACILITY
                if($module_id == 2){
                    if($stage_category_id == 3){
                        $facility_details_inspection = DB::table('tra_premises_applications as t1')
                            ->leftJoin('tra_submissions as t2', 't1.application_code', '=', 't2.application_code')
							 ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                            ->select('t1.*','t2.*')
                            ->where(array('t2.usr_to' => $user_id,'t2.is_done' => 0,'t3.stage_category_id' => 3,'t2.current_stage'=>61));
                        $main_facility = $facility_details_inspection->get();
                    }else if ($stage_category_id == 13){
                        $facility_details_inspection = DB::table('tra_premises_applications as t1')
                        ->leftJoin('tra_submissions as t2', 't1.application_code', '=', 't2.application_code')
                         ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                        ->select('t1.*','t2.*',)
                        ->where(array('t2.is_done' => 0,'t1.sub_module_id'=>1,'t2.current_stage'=>61,'t3.stage_category_id' => 13));
                    $main_facility = $facility_details_inspection->get();
                        $main_facility = $facility_details_coInspector->get();
                    }else{
                        $res = array(
                            'success' => true,
                            'message' => 'Inavild Facility category for Inspection or Co-inspection'
                        );
                        return $res;
                        
                    }

                    if(count($main_facility) > 0){
                        foreach($main_facility as $facility){
                            $premise_id = $facility->premise_id;
                            $application_code= $facility->application_code;
                            $process_id= $facility->process_id;
							$current_stage = $facility->current_stage;
                            $section_id=$facility->section_id; 
                            $module_id=$facility->module_id; 
                            $sub_module_id=$facility->sub_module_id; 
                            $workflow_stage=$facility->current_stage; 
                            $premise_type_id=$facility->premise_type_id; 
							$user_id = $request->user_id;

                            $main_premise_details = DB::table('tra_premises_applications as t1')
                                ->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
                                ->leftJoin('tra_premiseinspection_applications as t3','t1.application_code','=','t3.application_code')
                                ->join('tra_submissions as t15', 't1.application_code', '=', 't15.application_code')
                                ->join('wf_workflow_transitions as t17', 't15.current_stage', '=', 't17.stage_id')
                                ->select('t1.id as application_id','t1.premise_id','t1.application_code','t3.inspection_id','t1.*','t2.*','t15.usr_to','t15.usr_from','t15.current_stage','t17.nextstage_id as next_stage')
                                ->where(array('t1.premise_id'=> $premise_id,'t1.application_code'=> $application_code,'t15.current_stage'=> $current_stage));
                            $main_details = $main_premise_details->first();
								
                            $personnel = DB::table('tra_premises_personnel as t3')
                                ->leftJoin('tra_premises_applications as t4', 't3.premise_id', '=', 't4.premise_id')
                                ->leftJoin('tra_personnel_information as t5','t3.personnel_id','=','t5.id')
                                ->select('t3.*','t4.premise_id','t4.application_code','t5.*')
                                ->where(array('t4.premise_id'=>$premise_id,'t4.application_code'=>$application_code));
                            $main_personnel= $personnel->get();

                            $new_personnel = DB::table('tra_inspection_premise_personnel as t3')
                            ->leftJoin('tra_premises_applications as t4', 't3.premise_id', '=', 't4.premise_id')
                            ->select('t3.*')
                            ->where(array('t3.premise_id'=>$premise_id,'t4.application_code'=>$application_code));
                            $new_personnel= $new_personnel->get();

                            $contact_person = DB::table('tra_premises_applications as t6')
                                ->leftJoin('wb_trader_account as t7', 't6.applicant_id', '=', 't7.id')
                                ->select('t6.premise_id','t7.*','t7.name as applicant_name')
                                ->where(array('t6.premise_id'=>$premise_id,'t6.application_code'=>$application_code));
                            $main_contact_person = $contact_person->get();
                  
                            // $checklist = DB::table('tra_application_query_reftracker as t1')
                            // ->leftJoin('par_query_types as t2', 't1.query_type_id', 't2.id')
                            // ->leftJoin('par_checklist_categories as t3', 't1.checklist_category_id', 't3.id')
                            // ->select('t1.id as query_id','t1.*','t2.name as query_type','t3.name as checklist_category','t1.query_remark as comment')
                            // ->groupBy('t1.id', 't2.name', 't3.name')
                            // ->where(array('t1.workflow_stage_id'=>$workflow_stage_id,'t1.process_id'=>$process_id));

                            // $checklist = $checklist->get();

                            $workflow_stage = $current_stage;
                            $checklist = $this->getProcessApplicableChecklistItems($application_code,$process_id,$workflow_stage);
					   
							//submission_details
							$next_stage = DB::table('wf_workflow_transitions as t1')
								->select('t1.nextstage_id')
								->where('t1.stage_id',$workflow_stage);
							$next_stage = $next_stage->first();

							$next_stage_id = $next_stage->nextstage_id;
							$action = $action_details = $this->getWorkflowActions($workflow_stage);
							$responsible_users = $this->getSubmissionResponsibleUsers($next_stage_id);
							$submission_details = array(
								'action'=> $action,
								'responsible_users'=> $responsible_users,
							);

                            $assigned_inspectors = DB::table('tra_premiseinspection_applications as t10')
                                ->leftJoin('tra_premiseinspection_inspectors as t11', 't10.inspection_id', '=', 't11.inspection_id')
                                ->leftJoin('users as t12', 't11.inspector_id', '=', 't12.id')
                                ->leftJoin('par_inspectors_roles as t13', 't11.role_id', '=', 't13.id')
                                ->select(DB::raw("CONCAT(decryptval(t12.first_name," . getDecryptFunParams() . "),decryptval(t12.last_name," . getDecryptFunParams() . ")) as inspector_name"),'t13.name as inspector_role',
                                't10.premise_id','t10.inspection_id','t11.inspector_id')
                                ->where(array('t10.premise_id'=>$premise_id,'t10.application_code'=>$application_code));

                            $assigned_inspectors = $assigned_inspectors->get();

                            $inspection_recommendation = DB::table('tra_evaluation_recommendations as t1')
                                ->leftJoin('users as t2', 't1.created_by', '=', 't2.id')
                                ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                                ->leftJoin('par_recommendations as t4', 't1.recommendation_id', '=', 't4.id')
                                ->select(DB::raw("t1.*,CONCAT(decryptval(t2.first_name," . getDecryptFunParams() . "),decryptval(t2.last_name," . getDecryptFunParams() . ")) as author ,
                                t3.name as stage_name, t4.name as recommendation,t2.id as author_id, $user_id as current_user"),)
                                ->where('t1.application_code',$application_code);
                            $inspection_recommendation = $inspection_recommendation->get();
							
                            $documents = $this->onLoadApplicationDocumentsUploads($application_code,$process_id,$section_id,$module_id,$sub_module_id,$workflow_stage,$premise_type_id,$user_id);

                            // $documents = DB::table('tra_proc_applicable_doctypes as t1')
                            //     ->leftJoin('wf_processes as t2', 't1.process_id', '=', 't2.id')
                            //     ->leftJoin('wf_workflow_stages as t3', 't1.stage_id', '=', 't3.id')
                            //     ->leftJoin('par_document_types as t4', 't1.doctype_id', '=', 't4.id')
                            //     ->select('t1.*','t2.name as process_name','t3.name as stage_name','t4.name as document_type')
                            //     ->where('t1.stage_id',61);
                            // $documents = $documents->get();

                            $one_facility [] = array(
                                'main_details' => $main_details,
                                'personnels' => $main_personnel,
                                'new_personnel' => $new_personnel,
                                'assigned_inspectors' => $assigned_inspectors,
                                'main_contact_person' => $main_contact_person,
                                'checklist_items' => $checklist,
                                'inspection_recommendation' => $inspection_recommendation,
                                'documents' => $documents,
								'submission_details' => $submission_details,
								'tables'=>$tables
                            );
                        }

                        $premises = $one_facility;

                         //submission_details
                        $next_stage = DB::table('wf_workflow_transitions as t1')
                            ->select('t1.nextstage_id')
                            ->where('t1.stage_id',$workflow_stage);
                        $next_stage = $next_stage->first();

                        $next_stage_id = $next_stage->nextstage_id;
                        $action = $action_details = $this->getWorkflowActions($workflow_stage);
                        $responsible_users = $this->getSubmissionResponsibleUsers($next_stage_id);

                        $submission_details [] = array(
                            'action'=> $action,
                            'responsible_users'=> $responsible_users,
                        );
                       
                        $res = array(
                            'success' => true,
                            'tables'=>$tables,
                            'results' => $premises,
                            'submission_details' => $submission_details,
                            'message' => 'All is well'
                        );

                    }else{
                        $res = array(
                            'success' => true,
                            'message' => 'No Facility Information'
                        );
                    }
                    //GMP
                }else if ($module_id == 3){
                    if($stage_category_id == 2){//physical inspection
                        $gmp_inspection_details = DB::table('tra_gmp_applications as t1')
							->leftJoin('tra_submissions as t2', 't1.application_code', '=', 't2.application_code')
							->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
							->select('t1.application_code','t1.id as application_id','t1.manufacturing_site_id','t1.gmp_type_id','t1.*','t2.current_stage')
							->where(array('t1.module_id' => 3,'t2.is_done' => 0,'t3.stage_category_id' => 2,'t2.current_stage'=>527));
                        $main_gmp = $gmp_inspection_details->get();
						
                    }else{
                        $res = array(
                            'success' => false,
                            'message' => 'Invalid GMP category for Inspection or Co-inspection'
                        );
                        return $res;
                        
                    }
                    if(count($main_gmp) > 0){
                        foreach($main_gmp as $gmp){
                            $manufacturing_site_id = $gmp->manufacturing_site_id;
                            $workflow_stage_id= $gmp->current_stage;
                            $application_code= $gmp->application_code;
                            $process_id= $gmp->process_id;
                            $section_id=$gmp->section_id; 
                            $module_id=$gmp->module_id; 
                            $sub_module_id=$gmp->sub_module_id; 
                            $gmp_type_id=$gmp->gmp_type_id; 
							$gmp_type_id=$gmp->gmp_type_id; 
                            $premise_type_id=""; 

                            
                            $main_qry = DB::table('tra_gmp_applications as t1')
                                ->leftJoin('tra_submissions as t2', 't1.application_code', 't2.application_code')
                                ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                                ->join('wf_workflow_transitions as t4', 't2.current_stage', '=', 't4.stage_id')
                                ->select('t1.application_code','t1.id as application_id','t1.manufacturing_site_id','t1.gmp_type_id','t1.*','t2.current_stage','t4.nextstage_id as next_stage')
                                ->where(array('t1.manufacturing_site_id' => $manufacturing_site_id,'t1.application_code' => $application_code,'t2.current_stage'=> $workflow_stage_id));
                            $main_details = $main_qry->get();

                            $man_site_details_qry= DB::table('tra_gmp_applications as t1')
                                ->join('tra_manufacturing_sites as t2', 't1.manufacturing_site_id', '=', 't2.id')
                                ->leftJoin('tra_approval_recommendations as t5', 't2.permit_id', '=', 't5.id')
                                ->leftJoin('tra_manufacturers_information as t7', 't2.manufacturer_id', '=', 't7.id')
                                ->select('t2.name as manufacturer_site_name','t2.country_id as manufacturer_site_country_id','t2.region_id as manufacturer_site_region_id',
                                    't2.city_id as manufacturer_site_city_id','t2.street as manufacturer_site_street','t2.telephone_no as manufacturer_site_telephone','t2.fax as manufacturer_site_fax',
                                    't2.email_address as manufacturer_site_email','t2.website as manufacturer_site_website','t2.physical_address as manufacturer_site_physical_address',
                                    't2.postal_address as manufacturer_site_postal_address,','t2.business_scale_id','t2.business_category_id','t2.longitude','t2.latitude','t2.id as manufacturing_site_id',
                                    't5.permit_no', 't5.permit_no as gmp_cert_no','t2.id as manufacturer_id','t7.name as manufacturer_name', 't7.email_address as manufacturer_email_address',
                                    't7.physical_address as manufacturer_physical_address', 't7.country_id as manufacturer_country_id','t1.manufacturing_type_id','t1.inspection_type_id','t1.facility_location_id')
                                ->where(array('t1.manufacturing_site_id'=> $manufacturing_site_id));

                            $man_site_details = $man_site_details_qry->get();

                            $ltrDetail = DB::table('tra_gmp_applications as t1')
                                ->join('tra_manufacturing_sites as t2', 't1.manufacturing_site_id', '=', 't2.id')
                                ->leftJoin('wb_trader_account as t3', 't2.ltr_id', '=', 't3.id')
                                ->select('t3.id as ltr_id', 't3.name as ltr_name', 't3.contact_person',
                                    't3.tpin_no', 't3.country_id as ltr_country_id', 't3.region_id as ltr_region_id', 't3.district_id as ltr_district_id', 't3.physical_address as ltr_physical_address',
                                't3.postal_address as ltr_postal_address', 't3.telephone_no as ltr_telephone', 't3.fax as ltr_fax', 't3.email as ltr_email', 't3.website as ltr_website')
                                ->where(array('t1.manufacturing_site_id'=> $manufacturing_site_id));

                            $ltrDetails = $ltrDetail->get();
                            
                            $contactPersonDetail = DB::table('tra_gmp_applications as t1')
                                ->join('tra_manufacturing_sites as t2', 't1.manufacturing_site_id', '=', 't2.id')
                                ->leftJoin('tra_personnel_information as t3', 't2.contact_person_id', '=', 't3.id')
                                ->select('t3.*', 't3.name as contact_name', 't3.postal_address as contact_postal_address', 't3.telephone_no as contact_telephone_no', 't3.email_address as contact_email_address',
                                    't2.applicant_contact_person', 't2.contact_person_startdate as start_date', 't2.contact_person_enddate as end_date')
                                ->where(array('t1.manufacturing_site_id'=> $manufacturing_site_id));

                            $contactPersonDetails = $contactPersonDetail->get();

                            $keyPersonnel = DB::table('tra_manufacturing_sites_personnel as t1')
                                ->leftJoin('tra_personnel_information as t2', 't1.personnel_id', '=', 't2.id')
                                ->leftJoin('par_personnel_studyfield as t3', 't1.study_field_id', '=', 't3.id')
                                ->leftJoin('par_personnel_qualifications as t4', 't1.qualification_id', '=', 't4.id')
                                ->leftJoin('par_personnel_positions as t5', 't1.position_id', '=', 't5.id')
                                ->select('t1.*','t1.start_date', 't1.registration_no', 't1.institution', 't2.name','t2.postal_address','t2.telephone_no',
                                    't3.name as study_field','t4.name as qualification','t5.name as position')
                                ->where(array('t1.manufacturing_site_id'=> $manufacturing_site_id));

                            $keyPersonnels = $keyPersonnel->get();
                            
                            $new_personnel = DB::table('tra_gmp_key_personnel as t1')
                                ->leftJoin('par_personnel_studyfield as t2', 't1.field_study', '=', 't2.id')
                                ->leftJoin('par_personnel_qualifications as t3', 't1.qualification_id', '=', 't3.id')
                                ->leftJoin('par_personnel_positions as t4', 't1.position_id', '=', 't4.id')
                                ->select('t1.*','t2.name as study_field','t3.name as qualification','t4.name as position')
                                ->where('t1.manufacturing_site_id',$manufacturing_site_id);
                            $new_keyPersonnel= $new_personnel->get();
                           
                            $premiseProprietor = DB::table('tra_premises_proprietors as t1')
                                ->leftJoin('par_countries as t2', 't1.nationality_id', '=', 't2.id')
                                ->leftJoin('par_gender as t3', 't1.sex_id', '=', 't3.id')
                                ->leftJoin('par_identification_types as t4', 't1.identification_type_id', '=', 't4.id')
                                ->select('t1.*', 't2.name as nationality', 't3.name as gender','t4.name as identification_type')
                                ->where(array('t1.manufacturing_site_id'=> $manufacturing_site_id));

                            $premiseProprietors = $premiseProprietor->get();

                            $workflow_stage = $workflow_stage_id;
                            $checklist = $this->getProcessApplicableChecklistItems($application_code,$process_id,$workflow_stage);
                            
                            $inspection_recommendation = DB::table('tra_evaluation_recommendations as t1')
                                ->leftJoin('users as t2', 't1.created_by', '=', 't2.id')
                                ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                                ->leftJoin('par_recommendations as t4', 't1.recommendation_id', '=', 't4.id')
                                ->select(DB::raw("t1.*,CONCAT(decryptval(t2.first_name," . getDecryptFunParams() . "),decryptval(t2.last_name," . getDecryptFunParams() . ")) as author ,
                                    t3.name as stage_name, t4.name as recommendation,t2.id as author_id, $user_id as current_user"),)
                                ->where('t1.application_code',$application_code);
                    
                            $inspection_recommendation = $inspection_recommendation->get();

                            $documents = $this->onLoadApplicationDocumentsUploads($application_code,$process_id,$section_id,$module_id,$sub_module_id,$workflow_stage,$premise_type_id,$user_id);
                            // $documents = DB::table('tra_proc_applicable_doctypes as t1')
                            //     ->leftJoin('wf_processes as t2', 't1.process_id', '=', 't2.id')
                            //     ->leftJoin('wf_workflow_stages as t3', 't1.stage_id', '=', 't3.id')
                            //     ->leftJoin('par_document_types as t4', 't1.doctype_id', '=', 't4.id')
                            //     ->select('t1.*','t2.name as process_name','t3.name as stage_name','t4.name as document_type')
                            //     ->where('t1.stage_id',61);
                            // $documents = $documents->get();

                            
                            $one_gmp [] = array(
                                'main_details' => $main_details,
                                'man_site_details' => $man_site_details,
                                'local_technical_representative' => $ltrDetails,
                                'contact_person' => $contactPersonDetails,
                                'key_personnel' => $keyPersonnels,
                                'New key personnel' => $new_keyPersonnel,
                                'premise_Proprietors' => $premiseProprietors,
                                'checklist_items' => $checklist,
                                'inspection_recommendation' => $inspection_recommendation,
                                // 'documents' => $documents
                            );
                        }
                        $gmps = $one_gmp;
            
                        $res = array(
                            'success' => true,
                            'results' => $gmps,
                            'message' => 'All is well'
                        );

                    }else{

                        $res = array(
                            'success' => true,
                            'message' => 'No GMP Information'
                        );
                    }
                }else{
                    $res = array(
                        'success' => false,
                        'message' => 'Module Not defined'
                    );
                }
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'Access denied'
                );
            }
        
        } catch (\Exception $exception) {
            dd($exception);
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
		DB::table('par_banks')->insert(['name'=>$module_id, 'description'=>json_encode($res)]);
        return \response()->json($res);
    }
    public function getRiskBasedInspectionApplication(Request $request)
    {
        //savePremiseScheduleInspectionDetails
        //getPremisesinspectionreviewrecomdetails
        //preparePremisesInspectionReviewreComPnl
        
        $workflow_stage = $request->workflow_stage;
        $user_to = $request->user_id;
        $user_id = $request->user_id;
        $token = $request->bearerToken();
 
        try{                
            if($token != null){
            //tables 
            $risk_scale = DB::table('par_compliance_risk_scale as t1')
                ->select('t1.id','t1.name');
            $risk_scale = $risk_scale->get();
            
            $pass_status = DB::table('par_confirmations as t1')
                ->select('t1.flag','t1.name');
            $pass_status = $pass_status->get();
            
            $risk_type = DB::table('par_risk_premise_types as t1')
                ->select('t1.id','t1.name');
            $risk_type = $risk_type->get();
            
            $facility_role = DB::table('par_risk_premise_types_roles as t1')
                ->select('t1.id','t1.name','t1.risk_premise_type_id');
            $facility_role = $facility_role->get();
            
            $facility_type = DB::table('par_risk_premise_types_mapping as t1')
                ->leftjoin('par_premises_types as t2','t1.premise_type_id', '=', 't2.id')
                ->select('t1.id as risk_premise_type','t2.name','t1.risk_premise_type_id');
            $facility_type = $facility_type->get();
            
            $tables [] = array(
                'checklist_risk_scale'=> $risk_scale,
                'checklist_pass_status'=> $pass_status,
                'facity_risk_type' => $risk_type,
                'facility_type' => $facility_type,
                'facility_role' => $facility_role,
            );

            //inspection_details
            $inspection_details = DB::table('tra_premiseinspection_applications as t1')
                ->leftJoin('tra_submissions as t2','t1.application_code', '=', 't2.application_code')
                ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                ->where(array('t2.current_stage'=>$workflow_stage,'t2.usr_to'=>$user_to,'t2.is_done'=>0));  
            $inspection_details = $inspection_details->get();
           
            if(count($inspection_details) > 0){
                foreach($inspection_details as $inspection_detail)
                {
                    $stage_category_id= $inspection_detail->stage_category_id;
                    $premise_id= $inspection_detail->premise_id;
                    $inspection_id= $inspection_detail->inspection_id;
                    $application_code= $inspection_detail->application_code;
                    $process_id= $inspection_detail->process_id; 
                    $application_id = $inspection_detail->application_id;
                    $section_id = $inspection_detail->section_id;
                    $module_id = $inspection_detail->module_id;
                    $sub_module_id = $inspection_detail->sub_module_id;
                    $premise_type_id = $inspection_detail->premise_type_id;
                    
                    $main_details = DB::table('tra_premiseinspection_applications as t1')
                        ->leftJoin('tra_submissions as t2','t1.application_code', '=', 't2.application_code')
                        ->leftJoin('tra_premise_inspection_details as t3','t1.inspection_id', '=', 't3.id')
                        ->leftJoin('wf_workflow_stages as t4', 't2.current_stage', '=', 't4.id')
                        ->join('wf_workflow_transitions as t5', 't2.current_stage', '=', 't5.stage_id')
                        ->where(array('t1.application_code'=>$application_code,'t1.premise_id'=>$premise_id,'t2.usr_to'=>$user_to)) 
                        ->select('t1.*','t2.current_stage','t5.nextstage_id as next_stage','t2.usr_to','t5.stage_id');
                    $main_details = $main_details->get();

                    $premises = DB::table('tra_premiseinspection_applications as t1')
                        ->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
                        ->leftJoin('tra_premises_applications as t7', 't2.id', 't7.premise_id')
                        ->leftJoin('tra_facility_inspectors_assignments as t77', function ($join) use ($inspection_id) {
                            $join->on('t1.premise_id', '=', 't77.premise_id');
                            $join->where('t77.inspection_id', $inspection_id)->limit(1);
                        })
                        ->leftJoin('par_premises_types as t10', 't7.premise_type_id', '=', 't10.id')
                        ->leftJoin('par_regions as t11', 't2.region_id', '=', 't11.id')
                        ->leftJoin('par_districts as t12', 't2.district_id', '=', 't12.id')
                        ->leftJoin('tra_submissions as t19', function ($join) {
                            $join->on('t1.application_code', '=', 't19.application_code')
                                ->on('t1.workflow_stage_id', '=', 't19.current_stage')
                                ->where('t19.is_done', 0)->limit(1);
                            })
                        ->select('t77.inspection_id','t2.name as facility_name','t7.premise_type_id','t2.physical_address','t11.name as region_name','t12.name as district_name','t2.business_type_id','t2.distance_kms');
                    $premises = $premises->get();

                    $inspectors = DB::table('tra_facility_inspectors_assignments as t1')
                        ->leftjoin('par_inspectors_roles as t2','t1.role_id','=','t2.id')
                        ->leftjoin('users as t3','t1.user_id','=','t3.id')
                        ->where(array('t1.premise_id'=>$premise_id,'t1.inspection_id'=>$inspection_id))
                        ->select(DB::raw("CONCAT(decryptval(t3.first_name," . getDecryptFunParams() . "),decryptval(t3.last_name," . getDecryptFunParams() . ")) as inspector_name"),
                        't2.name as inspector_role','t1.user_id');
                    $inspectors = $inspectors->get();
                  
                    $facility_schedule = DB::table('tra_premiseinspection_applications as t1')
                        ->join('tra_premise_inspection_details as t2', 't1.inspection_id', 't2.id')
                        ->where('t1.id', $application_id)
                        ->select('t2.*',DB::raw('RIGHT(LEFT(t2.implementation_id::json::text ,-1),-1) as implementation_id'));
                    $facility_schedule = $facility_schedule->get();
                    
                    $checklist = $this->getProcessApplicableChecklistItems($application_code,$process_id,$workflow_stage);
                    
                    $inspection_recommendation = DB::table('tra_checklistitems_responses as t1')
                        ->select('t1.*')
                        ->where('t1.application_code',$application_code);
                    $inspection_recommendation = $inspection_recommendation->get();

                    $documents = $this->onLoadApplicationDocumentsUploads($application_code,$process_id,$section_id,$module_id,$sub_module_id,$workflow_stage,$premise_type_id,$user_id);
        
                    $inspections [] = array(
                        'main_details' => $main_details,
                        'inspectors' => $inspectors,
                        'facility_schedule' => $facility_schedule,
                        'checklist_items' => $checklist,
                        'inspection_recommendation' => $inspection_recommendation,
                        'documents' => $documents
                    );
                }

                $inspection = $inspections;

                //submission_details
                $next_stage = DB::table('wf_workflow_transitions as t1')
                    ->select('t1.nextstage_id')
                    ->where('t1.stage_id',$workflow_stage);
                $next_stage = $next_stage->first();

                $next_stage_id = $next_stage->nextstage_id;
                $action = $action_details = $this->getWorkflowActions($workflow_stage);
                $responsible_users = $this->getSubmissionResponsibleUsers($next_stage_id);

                $submission_details [] = array(
                    'action'=> $action,
                    'responsible_users'=> $responsible_users,
                );
                
                $res = array(
                    'success' => true,
                    'tables' => $tables,
                    'inspection_details' => $inspection,
                    'submission_details' => $submission_details,
                    'message' => 'All is well'
                );

            }else{
                $res = array(
                    'success' => false,
                    'message' => 'No Inspection Assigned.'
                );
                return $res;   
        }
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'Access denied'
                );
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getRiskBasedInspectionApplication_replacedabove(Request $request)
    {
        
        $workflow_stage = $request->workflow_stage;
        $user_to = $request->user_id;
        $user_id = $request->user_id;
        $token = $request->bearerToken();
 
        try {
            if($token != null){
                //tables 
                $risk_scale = DB::table('par_compliance_risk_scale as t1')
                    ->select('t1.id','t1.name');
                $risk_scale = $risk_scale->get();
                
                $pass_status = DB::table('par_confirmations as t1')
                    ->select('t1.flag','t1.name');
                $pass_status = $pass_status->get();
                
                $risk_type = DB::table('par_risk_premise_types as t1')
                    ->select('t1.id','t1.name');
                $risk_type = $risk_type->get();
                
                $facility_role = DB::table('par_risk_premise_types_roles as t1')
                    ->select('t1.id','t1.name','t1.risk_premise_type_id');
                $facility_role = $facility_role->get();
                
                $facility_type = DB::table('par_risk_premise_types_mapping as t1')
                    ->leftjoin('par_premises_types as t2','t1.premise_type_id', '=', 't2.id')
                    ->select('t1.id as risk_premise_type','t2.name','t1.risk_premise_type_id');
                $facility_type = $facility_type->get();
                
                $tables [] = array(
                    'checklist_risk_scale'=> $risk_scale,
                    'checklist_pass_status'=> $pass_status,
                    'facity_risk_type' => $risk_type,
                    'facility_type' => $facility_type,
                    'facility_role' => $facility_role,
                );

                //inspection_details
                $inspection_details = DB::table('tra_premiseinspection_applications as t1')
                    ->leftJoin('tra_submissions as t2','t1.application_code', '=', 't2.application_code')
                    ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                    ->where(array('t2.current_stage'=>$workflow_stage,'t2.usr_to'=>$user_to,'t2.is_done'=>0));  
                $inspection_details = $inspection_details->get();

                if(count($inspection_details) > 0){
                    foreach($inspection_details as $inspection_detail)
                    {
                        $stage_category_id= $inspection_detail->stage_category_id;
                        $premise_id= $inspection_detail->premise_id;
                        $inspection_id= $inspection_detail->inspection_id;
                        $application_code= $inspection_detail->application_code;
                        $process_id= $inspection_detail->process_id; 
                        $application_id = $inspection_detail->application_id;
                        $section_id = $inspection_detail->section_id;
                        $module_id = $inspection_detail->module_id;
                        $sub_module_id = $inspection_detail->sub_module_id;
                        $premise_type_id = $inspection_detail->premise_type_id;
                        
                        $main_details = DB::table('tra_premiseinspection_applications as t1')
                            ->leftJoin('tra_submissions as t2','t1.application_code', '=', 't2.application_code')
                            ->leftJoin('tra_premise_inspection_details as t3','t1.inspection_id', '=', 't3.id')
                            ->leftJoin('wf_workflow_stages as t4', 't2.current_stage', '=', 't4.id')
                            ->join('wf_workflow_transitions as t5', 't2.current_stage', '=', 't5.stage_id')
                            ->where(array('t1.application_code'=>$application_code,'t1.premise_id'=>$premise_id,'t2.usr_to'=>$user_to)) 
                            ->select('t1.*','t2.current_stage','t5.nextstage_id as next_stage','t2.usr_to','t5.stage_id');
                        $main_details = $main_details->get();

                        $premises = DB::table('tra_premiseinspection_applications as t1')
                            ->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
                            ->leftJoin('tra_premises_applications as t7', 't2.id', 't7.premise_id')
                            ->leftJoin('tra_facility_inspectors_assignments as t77', function ($join) use ($inspection_id) {
                                $join->on('t1.premise_id', '=', 't77.premise_id');
                                $join->where('t77.inspection_id', $inspection_id)->limit(1);
                            })
                            ->leftJoin('par_premises_types as t10', 't7.premise_type_id', '=', 't10.id')
                            ->leftJoin('par_regions as t11', 't2.region_id', '=', 't11.id')
                            ->leftJoin('par_districts as t12', 't2.district_id', '=', 't12.id')
                            ->leftJoin('tra_submissions as t19', function ($join) {
                                $join->on('t1.application_code', '=', 't19.application_code')
                                    ->on('t1.workflow_stage_id', '=', 't19.current_stage')
                                    ->where('t19.is_done', 0)->limit(1);
                                })
                            ->select('t77.inspection_id','t2.name as facility_name','t7.premise_type_id','t2.physical_address','t11.name as region_name','t12.name as district_name','t2.business_type_id','t2.distance_kms');
                        $premises = $premises->get();

                        $inspectors = DB::table('tra_facility_inspectors_assignments as t1')
                            ->leftjoin('par_inspectors_roles as t2','t1.role_id','=','t2.id')
                            ->leftjoin('users as t3','t1.user_id','=','t3.id')
                            ->where(array('t1.premise_id'=>$premise_id,'t1.inspection_id'=>$inspection_id))
                            ->select(DB::raw("CONCAT(decryptval(t3.first_name," . getDecryptFunParams() . "),decryptval(t3.last_name," . getDecryptFunParams() . ")) as inspector_name"),
                            't2.name as inspector_role','t1.user_id');
                        $inspectors = $inspectors->get();
                    
                        $facility_schedule = DB::table('tra_premiseinspection_applications as t1')
                            ->join('tra_premise_inspection_details as t2', 't1.inspection_id', 't2.id')
                            ->where('t1.id', $application_id)
                            ->select('t2.*',DB::raw('RIGHT(LEFT(t2.implementation_id::json::text ,-1),-1) as implementation_id'));
                        $facility_schedule = $facility_schedule->get();
                        
                        $checklist = $this->getProcessApplicableChecklistItems($application_code,$process_id,$workflow_stage);
                        
                        $inspection_recommendation = DB::table('tra_checklistitems_responses as t1')
                            ->select('t1.*')
                            ->where('t1.application_code',$application_code);
                        $inspection_recommendation = $inspection_recommendation->get();

                        $documents = $this->onLoadApplicationDocumentsUploads($application_code,$process_id,$section_id,$module_id,$sub_module_id,$workflow_stage,$premise_type_id,$user_id);
            
                        $inspections [] = array(
                            'main_details' => $main_details,
                            'inspectors' => $inspectors,
                            'facility_schedule' => $facility_schedule,
                            'checklist_items' => $checklist,
                            'inspection_recommendation' => $inspection_recommendation,
                            'documents' => $documents
                        );
                    }

                    $inspection = $inspections;

                    //submission_details
                    $next_stage = DB::table('wf_workflow_transitions as t1')
                        ->select('t1.nextstage_id')
                        ->where('t1.stage_id',$workflow_stage);
                    $next_stage = $next_stage->first();

                    $next_stage_id = $next_stage->nextstage_id;
                    $action = $action_details = $this->getWorkflowActions($workflow_stage);
                    $responsible_users = $this->getSubmissionResponsibleUsers($next_stage_id);

                    $submission_details [] = array(
                        'action'=> $action,
                        'responsible_users'=> $responsible_users,
                    );
                    
                    $res = array(
                        'success' => true,
                        'tables' => $tables,
                        'inspection_details' => $inspection,
                        'submission_details' => $submission_details,
                        'message' => 'All is well'
                    );

                }else{
                    $res = array(
                        'success' => false,
                        'message' => 'No Inspection Assigned.'
                    );
                    return $res;   
                }
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'Access denied'
                );
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveRiskBasedInspectionDetails(Request $request)
    {
        $application_code = $request->input('application_code');
        $table_name = 'tra_premiseinspection_applications';
        $user_id = $request->input('user_id');
        $token = $request->bearerToken();

        try {
            $qry = DB::table($table_name . ' as t1')
                ->select('t1.*')
                ->where('t1.application_code',$application_code);
            $results = $qry->first();

            $record_id = $results->id;
			$premise_id = $results->premise_id;
			 
            $where = array(
                'id' => $record_id
            );
           
            $params = array(
                'actual_start_date' => $request->input('actual_start_date'),
                'actual_end_date' => $request->input('actual_end_date'),
                'recommendation_id' => $request->input('recommendation_id'),
                'inspection_type_id' => $request->input('inspection_type_id'),
                'remarks' => $request->input('remarks'),
                'premise_type_id' =>  $request->premise_type_id,
                'inspector_id' => $request->user_id,
                
            );
			
            if($request->input('manager_recommendation') != ''){
               $params['approval_recommendation_id'] = 1;
               $params['manager_recommendation'] = $request->manager_recommendation;
                $params['reviewed_by'] = $this->user_id;
            }
			// DB::table($table_name)
            //     ->where($where)
            //     ->update($params);
            $res = updateRecord($table_name, $where, $params, $user_id);
			
            if ($res['success'] == false) {
                    return \response()->json($res);
                }
			
            $update_p = array(
                'risk_premise_type_id' => $request->risk_premise_type_id,
                'premise_type_id' => $request->premise_type_id,
                'risk_premise_type_role_id' => $request->risk_premise_type_role_id
            );
			
            //$premise_id = getSingleRecordColValue('tra_premiseinspection_applications', $where, 'premise_id');
          
            
            $wherep = array(
                'id' => $premise_id
            );
            //DB::table('tra_premises')
            //    ->where($where)
            //    ->update($update_p);
				
			$res = updateRecord('tra_premises', $wherep, $update_p, $user_id);
			if ($res['success'] == false) {
                    return \response()->json($res);
                }
            $premise_types = array(
                'premise_type_id' =>  $request->premise_type_id
            );
			
            //DB::table('tra_premises_applications')
            //    ->where(['premise_id' => $premise_id])
            //   ->update($premise_types);
			$wherepr = array(
                'premise_id' => $premise_id
            );
			$res = updateRecord('tra_premises_applications', $wherepr, $premise_types, $user_id);
			if ($res['success'] == false) {
                    return \response()->json($res);
                }
				
            $res = array(
                'success' => true,
                'message' => 'Details saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getProcessApplicableChecklistItems($application_code,$process_id,$workflow_stage)
    {
        
        $checklist_type = null;
        $checklist_category_id = null;
        $is_previous = null;
        $query_id = null;
        $pass_status = null;
        $is_auditor = null;
        $is_structured = null;
        $filter = null;
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
                ->select('module_id', 'sub_module_id', 'section_id', 'premise_type_id', 'prodclass_category_id')
                ->where('id', $process_id)
                ->first();
            $where2 = convertStdClassObjToArray($where2);
            $module_id = $where2['module_id'];
            $section_id = $where2['section_id'];
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
            }
            if($module_id == 1){
                if($section_id == 3){
                    $module_id = $where2['module_id'];
                    $sub_module_id = $where2['sub_module_id'];
                    $section_id = $where2['section_id'];
                    $prodclass_category_id = $where2['prodclass_category_id'];
                } else{
                    $module_id = $where2['module_id'];
                    $sub_module_id = $where2['sub_module_id'];
                    $section_id = $where2['section_id'];
                }
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

            $results = $qry->orderBy('checklist_type_id', 'ASC')->get();
            // dd( $results);
            // $res = array(
            //     'success' => true,
            //     'results' => $results,
            //     'message' => returnMessage($results)
            // );
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
        return $results;
    }
    public function onLoadApplicationDocumentsUploads($application_code,$process_id,$section_id,$module_id,$sub_module_id,$workflow_stage,$premise_type_id,$user_id)
    {
    
        $doc_type_id = null;
        $portal_uploads = null;
        $portal_status_id = null;
        $isvalidate_uploaded_by = null;
        $prodclass_category_id = null;
        $product_id = null;
        $parent_id = null;
        $uploaded_by = $user_id;
        $reg_serial = null;
        $results=collect();

        //$uploaded_by = 25;
        if(!validateIsNumeric($isvalidate_uploaded_by)){
                $isvalidate_uploaded_by =0;
        }
        try {
            $where = array(
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id
            );
            if (validateIsNumeric($prodclass_category_id)) {
                $where['prodclass_category_id'] = $prodclass_category_id;
            }
            if (validateIsNumeric($premise_type_id)) {
                $where['premise_type_id'] = $premise_type_id;
            }
            if(validateIsNumeric($section_id)){
            // $where['section_id'] = $section_id;
            }

            if(!validateIsNumeric($process_id)){
                $process_id = getSingleRecordColValue('wf_processes', $where, 'id');
            }

            //get applicable document types
            $qry1 = DB::table('tra_proc_applicable_doctypes')
                ->select('*');
            if (isset($process_id) && $process_id != '') {
                $qry1->where('process_id', $process_id);
            }
            if (isset($workflow_stage) && $workflow_stage != '') {
                $qry1->where('stage_id', $workflow_stage);
            }
            if (validateIsNumeric($doc_type_id)) {
                $qry1->where('doctype_id', $doc_type_id);
            }
            $docTypes = $qry1->get();
            $docTypes = convertStdClassObjToArray($docTypes);
            $docTypes = convertAssArrayToSimpleArray($docTypes, 'doctype_id');

            //document filters
            if (validateIsNumeric($doc_type_id)) {
                $where['t1.document_type_id'] = $doc_type_id;
            }
            /*-------------------------------------------------
            confirm document type is not from query window
                1. document type 39
            --------------------------------------------------------*/
            // if($doc_type_id != 39) {
            //     $where['t1.document_type_id'] = $docTypes;
            // }
            // dd($where);

            //get documents based on
            if(validateIsNumeric($parent_id)){
                $qry = DB::table('tra_application_uploadeddocuments as t1')
                    ->leftJoin('tra_application_documents as t2', 't1.application_document_id', 't2.id')
                    ->leftJoin('tra_documentupload_requirements as t4', 't2.document_requirement_id', 't4.id')
                    ->leftJoin('par_document_types as t3', 't4.document_type_id', 't3.id')
                    ->leftJoin('users as t5', 't2.uploaded_by', '=', 't5.id')
                    ->select(DB::raw("t2.*, t1.*,t1.initial_file_name as file_name, t2.remarks, t4.module_id, t4.sub_module_id,t4.section_id,t1.file_type, t2.uploaded_on, CONCAT(decryptval(t5.first_name,".getDecryptFunParams()."),' ',decryptval(t5.last_name,".getDecryptFunParams().")) as uploaded_by,t4.is_mandatory, t4.document_type_id,t3.name as document_type, t4.name as document_requirement, case when (select count(id) from tra_application_uploadeddocuments q where q.parent_id = t1.id) = 0 then true else false end leaf"))
                    ->where('t1.parent_id', $parent_id)
                    ->where('t4.is_enabled', 1);
                $results = $qry->get();
            }else{
                $doc_requirments = DB::table('tra_documentupload_requirements as t1')
                                ->where($where)
                                ->whereIn('document_type_id', $docTypes)
                                ->get();
                foreach ($doc_requirments as $doc_req) {
                    $qry = DB::table('tra_application_documents as t1')
                        ->join('tra_documentupload_requirements as t2', 't1.document_requirement_id', 't2.id')
                        ->join('par_document_types as t3', 't2.document_type_id', 't3.id')
                        ->leftJoin('tra_application_uploadeddocuments as t4', function ($join) use ($application_code,$isvalidate_uploaded_by,$uploaded_by, $reg_serial) {
                            if(validateIsNumeric($reg_serial)){
                                $join->on("t1.id", "=", "t4.application_document_id")
                                ->where("t4.reg_serial", $reg_serial)
                                ->whereRaw("CASE WHEN $isvalidate_uploaded_by =1  THEN t1.uploaded_by = $uploaded_by ELSE 1 = 1 END");
                            }else{
                                $join->on("t1.id", "=", "t4.application_document_id")
                                ->whereRaw("CASE WHEN $isvalidate_uploaded_by =1  THEN t1.uploaded_by = $uploaded_by ELSE 1 = 1 END");
                            }

                        })
                        ->leftJoin('users as t5', 't1.uploaded_by', '=', 't5.id')
                        ->select(DB::raw("t1.*,t4.remarks,t4.application_document_id,
                        t4.node_ref,t4.initial_file_name,t4.file_name,t4.initial_file_name as file_name, t2.module_id,t2.sub_module_id,t2.section_id,t4.file_type,t1.uploaded_on,CONCAT(decryptval(t5.first_name,".getDecryptFunParams()."),' ',decryptval(t5.last_name,".getDecryptFunParams().")) as uploaded_by,t2.is_mandatory,
                        t2.document_type_id,t3.name as document_type, t2.name as document_requirement, t4.id,t4.is_directory, case when (select count(id) from tra_application_uploadeddocuments q where q.parent_id = t4.id) = 0 then true else false end leaf"))
                        ->where(['t1.document_requirement_id'=> $doc_req->id, 't1.application_code'=>$application_code])
                        ->where('t4.parent_id', 0);

                    $res = $qry->get();
                    if($res->isEmpty()){
                        $res = DB::table('tra_documentupload_requirements as t1')
                                ->join('par_document_types as t3', 't1.document_type_id', 't3.id')
                                ->where('t1.id', $doc_req->id)
                                ->selectRaw("t1.name as file_name, true as leaf, t1.name as document_requirement, t3.name as document_type")
                                ->get();
                    }
                    $results = $results->merge($res);
                }
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $results;
    }
    public function saveInspectionRecommendation(Request $request)
    {
        $data = $request->all();
        $table = 'tra_evaluation_recommendations';
        $workflow_stage_id = $data['workflow_stage_id'];
        $application_code = $request->input('application_code');
        $user_id = $this->user_id;

        //unset unnecessary values
        unset($data['_token']);


        try{
            if(!validateIsNumeric($workflow_stage_id)){
                return array('success'=>false, 'message'=> "Failed to fetch stage details");
            }

            $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
            $stage_category_id = $stage_data->stage_category_id;
            $data['stage_category_id'] = $stage_category_id;

            $existing_recommendation = DB::table($table)
                ->where(array('application_code'=>$application_code,'workflow_stage_id'=>$workflow_stage_id))
                ->get();

            if (count($existing_recommendation) == 0) {
                $data['created_on']=Carbon::now();
                $data['created_by']=$user_id;
                
                $res =insertRecord($table, $data, $user_id);
                if ($res['success'] == false) {
                    return \response()->json($res);
                }
            }else{
                $where_app=array(
                    'application_code'=>$application_code,
                    'workflow_stage_id'=>$workflow_stage_id);

                $data['altered_by']=$user_id;
                $res = updateRecord($table, $where_app, $data, $user_id);
            }

            $res = array(
                'success' => true,
                'message' => "Saved Recommendation Successfully"
            );

        } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getSubmissionResponsibleUsers($next_stage)
    {
        //added
        $is_inspection = 2;
        $inspection_id = null;
        $module_id = 2;

        //end
        try {
            if ($is_inspection == 1) {
                $results = $this->getInspectionSubmissionResponsibleUsers($inspection_id, $module_id);
            } else {
                //query 1
                $qry1 = DB::table('wf_stages_groups as t1')
                    ->select('t1.group_id')
                    ->where('stage_id', $next_stage);
                $stage_groups = $qry1->get();
                $stage_groups = convertStdClassObjToArray($stage_groups);
                $stage_groups = convertAssArrayToSimpleArray($stage_groups, 'group_id');
                //query 2

                $qry2 = DB::table('users as t2')
                    ->select(DB::raw("t2.id,CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as name"))
                    ->whereIn('t2.id', function ($query) use ($stage_groups) {
                        $query->select(DB::raw('t3.user_id'))
                            ->from('tra_user_group as t3')
                            ->whereIn('t3.group_id', $stage_groups);
                    })
                    ->orWhereIn('t2.id', function ($query) use ($stage_groups) {
                        $date_today = Carbon::now();
                        $query->select(DB::raw('t4.user_id'))
                            ->from('tra_actingposition_management as t4')
                            ->whereRaw("acting_date_to >= '".formatDate($date_today)."' ")
                            ->whereIn('t4.group_id', $stage_groups);
                    });
                $results = $qry2->get();
            }
            //return
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
        return $results;
    }
    public function saveNewInspectionPremisePersonnel(Request $request)
    {
        $data=$request->all();
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $premise_id = $request->input('premise_id');
        $table= 'tra_inspection_premise_personnel';
        
        unset($data['token']);
        unset($data['id']);

        try{
            $personnel_exists = DB::table('tra_inspection_premise_personnel')
                ->where(array('premise_id'=>$premise_id,'application_code'=>$application_code))
                ->get();

            if(count( $personnel_exists) == 0){
                $data['created_on']=Carbon::now();
                $data['created_by']=$user_id;
                
                $res =insertRecord($table, $data, $user_id);
                if ($res['success'] == false) {
                    return \response()->json($res);
                }
            }else{
                $where_app=array(
                    'premise_id'=>$premise_id,
                    'application_code'=>$application_code
                );

                $data['altered_by']=$user_id;
                $res = updateRecord($table, $where_app, $data, $user_id);
                if ($res['success'] == false) {
                    return \response()->json($res);
                }
            }

            $res = array(
                'success' => true,
                'message' => "Saved Successfully"
            );

        }catch(\Exception $exception){

            //defaults
            $function = "failed to fetch";
            //class
            $class_array = explode('\\', __CLASS__);
            if(isset($class_array[5])){
                $class = $class_array[5];
            }else{
                $class = "Failed to fetch";
            }
            //specifics
            $me = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
            if(isset($me[0]['function'])){
                $function = $me[0]['function'];
            }
            if(isset($me[0]['class'])){
                $class = $me[0]['class'];
            }
            $res = sys_error_handler($exception->getMessage(), 2, "function-->".$function." class-->".$class, \Auth::user()->id);

        }catch(\Exception $throwable){

            //defaults
            $function = "failed to fetch";
            //class
            $class_array = explode('\\', __CLASS__);
            if(isset($class_array[5])){
                $class = $class_array[5];
            }else{
                $class = "Failed to fetch";
            }
            //specifics
            $me = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
            if(isset($me[0]['function'])){
                $function = $me[0]['function'];
            }
            if(isset($me[0]['class'])){
                $class = $me[0]['class'];
            }
            $res = sys_error_handler($exception->getMessage(), 2, "function-->".$function." class-->".$class, \Auth::user()->id);
        }

        return \response()->json($res);
    }
    public function saveNewGMPKeyPersonnel(Request $request)
    {
        $data=$request->all();
        $user_id = $this->user_id;
        $manufacturing_site_id = $request->input('manufacturing_site_id');
        $application_code = $request->input('application_code');
        $table= 'tra_gmp_key_personnel';
        
        unset($data['token']);
  
        try{
            $personnel_exists = DB::table($table)
                ->where(array('manufacturing_site_id'=>$manufacturing_site_id,'application_code'=>$application_code))
                ->get();

            if(count( $personnel_exists) == 0){
                $data['created_on']=Carbon::now();
                $data['created_by']=$user_id;
                $res =insertRecord($table, $data, $user_id);
                if ($res['success'] == false) {
                    return \response()->json($res);
                }
            }else{
                $where_app=array(
                    'manufacturing_site_id'=>$manufacturing_site_id,
                    'application_code'=>$application_code);

                $data['altered_by']=$user_id;
                $res = updateRecord($table, $where_app, $data, $user_id);
                
            }

            $res = array(
                'success' => true,
                'message' => "Saved Key Personnel Successfully"
            );

        }catch(\Exception $exception){

            //defaults
            $function = "failed to fetch";
            //class
            $class_array = explode('\\', __CLASS__);
            if(isset($class_array[5])){
                $class = $class_array[5];
            }else{
                $class = "Failed to fetch";
            }
            //specifics
            $me = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
            if(isset($me[0]['function'])){
                $function = $me[0]['function'];
            }
            if(isset($me[0]['class'])){
                $class = $me[0]['class'];
            }
            $res = sys_error_handler($exception->getMessage(), 2, "function-->".$function." class-->".$class, \Auth::user()->id);

        }catch(\Exception $throwable){

            //defaults
            $function = "failed to fetch";
            //class
            $class_array = explode('\\', __CLASS__);
            if(isset($class_array[5])){
                $class = $class_array[5];
            }else{
                $class = "Failed to fetch";
            }
            //specifics
            $me = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
            if(isset($me[0]['function'])){
                $function = $me[0]['function'];
            }
            if(isset($me[0]['class'])){
                $class = $me[0]['class'];
            }
            $res = sys_error_handler($exception->getMessage(), 2, "function-->".$function." class-->".$class, \Auth::user()->id);
        }

        return \response()->json($res);
    }
	public function savePremisePersonnelInspectionDetails(Request $request)
    {
       $user_id = $this->user_id;
       $application_id = $request->input('application_id');
       $application_code = $request->input('application_code');
       $personnel_id = $request->input('personnel_id');
       $premise_id = $request->input('premise_id');
       $signature = $request->input('signature');
       $table_name = 'tra_inspection_exist_premise_personnel';
       unset($data['token']);
        
       try {
            $insert_params = array();
            DB::beginTransaction();

            $personnel_exists = DB::table('tra_inspection_exist_premise_personnel')
                ->where(array('personnel_id'=>$personnel_id,'premise_id'=>$premise_id,'application_code'=>$application_code))
                ->get();
				
                if (count($personnel_exists) == 0) {
					$insert_params = array(
                        'application_id' => $application_id,
                        'application_code' => $application_code,
                        'personnel_id' => $personnel_id,
                        'premise_id' => $premise_id,
                        'signature' => $signature,
                        'created_on' => Carbon::now(),
                        'created_by' => $user_id,
                    );
					
					$res = insertRecord($table_name, $insert_params, $user_id);
					
					if(!isset($res['success']) || $res['success'] == false){
						DB::rollback();
						return $res;
					}
                   
                } else {
					
					 $update_params = array(
                        'application_id' => $application_id,
                        'application_code' => $application_code,
                        'personnel_id' => $personnel_id,
                        'premise_id' => $premise_id,
                        'signature' => $signature,
                        'dola' => Carbon::now(),
                        'altered_by' => $user_id
                    );
                    
                    $where = array(
                        'personnel_id' => $personnel_id,
                        'premise_id' => $premise_id,
                
                    );
					
                    $updatedRecord = updateRecord($table_name, $where, $update_params, $user_id);
					
					if(!isset($updatedRecord['success']) || $updatedRecord['success'] == false){
						DB::rollback();
						return $updatedRecord;
					}
                }

            DB::commit();
            $res = array(
                'success' => true,
                'message' => 'Signature saved successfully!!'
            );
        } catch (\Exception $exception) {
            DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveGMPPersonnelInspectionDetails(Request $request)
    {
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $personnel_id = $request->input('personnel_id');
        $manufacturing_site_id = $request->input('manufacturing_site_id');
        $data=$request->all();
        $table_name = 'tra_gmp_exist_key_personnel';
        unset($data['token']);

        try {
         
            DB::beginTransaction();
            
            $personnel_exists = DB::table($table_name)
                ->where(array('manufacturing_site_id'=>$manufacturing_site_id,'personnel_id'=>$personnel_id))
                ->get();

            if (count($personnel_exists) == 0) {
				
                $data['created_on']=Carbon::now();
                $data['created_by']=$user_id;
				
                $res =insertRecord($table_name, $data, $user_id);
                if ($res['success'] == false) {
                    return \response()->json($res);
                }
            }else{
                $where = array(
                    'personnel_id' => $personnel_id,
                    'manufacturing_site_id' => $manufacturing_site_id
                );
				$data['altered_by']=$user_id;
				
                $updatedRecord = updateRecord($table_name, $where, $data, $user_id);
                
				if(!isset($updatedRecord['success']) || $updatedRecord['success'] == false){
					DB::rollback();
					return $updatedRecord;
				}
            }

            DB::commit();
            $res = array(
                'success' => true,
                'message' => 'GMP Signature saved successfully!!'
            );
        } catch (\Exception $exception) {
            DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    // public function saveApplicationChecklistDetails(Request $request)
    // {
    //     $application_id = $request->input('application_id');
    //     $application_code = $request->input('application_code');
    //     $screening_details = $request->input('screening_details');
    //     $module_id = $request->input('module_id');
    //     $sub_module_id = $request->input('sub_module_id');
    //     $screening_details = json_decode($screening_details);
    //     $table_name = 'tra_checklistitems_responses';
    //     $user_id = $this->user_id;
    //     $submission_details = getLastApplicationSubmissionDetails($application_code);
    //     $submission_id = 0;
    //     $workflow_stage_id = 0;
    //     if($submission_details['success']){
    //         $submission_details = $submission_details['results'];
    //         $submission_id = $submission_details->id;
    //         $workflow_stage_id = $submission_details->current_stage;
    //     }

    //     try {
    //         $insert_params = array();
    //         DB::beginTransaction();
    //         foreach ($screening_details as $screening_detail) {
    //             $auditor_comment = '';
    //             $auditorpass_status = '';
    //             $audit = '';
    //             $auditorpass_status = '';
    //             $audit_created_by = '';
    //             $audit_altered_by = '';
    //             $audit_altered_on = '';
    //             $audit_created_on = '';
    //             if (property_exists($screening_detail, 'auditor_comment')) {
    //                 $auditor_comment = $screening_detail->auditor_comment;

    //                 $audit_created_on = Carbon::now();

    //                 $audit_altered_by = $user_id;
    //                 $audit_altered_on = Carbon::now();
    //             }
    //              if (property_exists($screening_detail, 'auditorpass_status')) {

    //                 $auditorpass_status = $screening_detail->auditorpass_status;
    //                 $audit_altered_by = $user_id;
    //                 $audit_altered_on = Carbon::now();
    //              }
    //             $item_resp_id = $screening_detail->item_resp_id;
    //             if (isset($item_resp_id) && $item_resp_id != '') {
    //                 $where = array(
    //                     'id' => $item_resp_id
    //                 );
    //                 $pass_status = $screening_detail->pass_status;
    //                 if (DB::table('tra_checklistitems_queries')
    //                         ->where('item_resp_id', $item_resp_id)
    //                         ->where('status', '<>', 4)
    //                         ->count() > 0) {
    //                    // $pass_status = ;
    //                 }

    //                 $update_params = array(
    //                     'pass_status' => $pass_status,
    //                     'comment' => $screening_detail->comment,
    //                     'observation' => $screening_detail->observation,
    //                     'auditorpass_status'=>$auditorpass_status,
    //                     'auditor_comment' => $auditor_comment,
    //                     'audit_altered_on' => $audit_altered_on,
    //                     'audit_altered_by' => $audit_altered_by,
    //                     'dola' => Carbon::now(),
    //                     'altered_by' => $user_id
    //                 );
    //                 if(isset($screening_detail->risk_type)){
    //                    $update_params['risk_type'] = $screening_detail->risk_type;
    //                    $update_params['risk_type_remarks'] = $screening_detail->risk_type_remarks;
    //                 }
    //                 // $prev_data = getPreviousRecords($table_name, $where);
    //                 updateRecord($table_name, $where, $update_params, $user_id);
    //                 if($auditorpass_status != ''){

    //                 }
    //             } else {
    //                 if(!isset($screening_detail->risk_type)){
    //                     $insert_params[] = array(
    //                         'application_id' => $application_id,
    //                         'application_code' => $application_code,
    //                         'checklist_item_id' => $screening_detail->checklist_item_id,
    //                         'risk_type' => null,
    //                         'risk_type_remarks' => null,
    //                         'pass_status' => $screening_detail->pass_status,
    //                         'comment' => $screening_detail->comment,
    //                         'auditorpass_status'=>$auditorpass_status,
    //                         'auditor_comment' => $auditor_comment,
    //                         'observation' => $screening_detail->observation,
    //                         'created_on' => Carbon::now(),
    //                         'created_by' => $user_id,
    //                         'submission_id' => $submission_id
    //                     );
    //                 }else{
    //                     $insert_params[] = array(
    //                         'application_id' => $application_id,
    //                         'application_code' => $application_code,
    //                         'risk_type' => $screening_detail->risk_type,
    //                         'risk_type_remarks' => $screening_detail->risk_type_remarks,
    //                         'checklist_item_id' => $screening_detail->checklist_item_id,
    //                         'pass_status' => $screening_detail->pass_status,
    //                         'comment' => $screening_detail->comment,
    //                         'auditorpass_status'=>$auditorpass_status,
    //                         'auditor_comment' => $auditor_comment,
    //                         'observation' => $screening_detail->observation,
    //                         'created_on' => Carbon::now(),
    //                         'created_by' => $user_id,
    //                         'submission_id' => $submission_id
    //                         );
    //                     }
                    
    //             }
    //         }
    //         if (count($insert_params) > 0) {
    //             //DB::table($table_name)
    //               //  ->insert($insert_params);
    //             $res = insertMultipleRecords($table_name, $insert_params);
    //             if(!isset($res['success']) || $res['success'] == false){
    //                 DB::rollback();
    //                 return $res;
    //             }
    //             //log entry
    //             $log_data = array(
    //                 'submission_id' => $submission_id,
    //                 'workflow_stage_id' => $workflow_stage_id,
    //                 'application_code' => $application_code,
    //                 'user_id' => $user_id
    //             );
    //             $res = insertRecord('tra_applicationchecklist_logs', $log_data, $user_id);
    //             if(!isset($res['success']) || $res['success'] == false){
    //                  DB::rollback();
    //                 return $res;
    //             }
    //         }
    //         if($module_id == 2 && $sub_module_id == 50){
    //             $where = ['t1.application_id' => $application_id, 't1.application_code' => $application_code];
    //             $minor = DB::table('tra_checklistitems_responses as t1')
    //                     ->join('par_checklist_items as t2', 't1.checklist_item_id', 't2.id')
    //                     ->join('par_checklist_types as t3', 't2.checklist_type_id', 't3.id')
    //                     ->where($where)
    //                     ->where('risk_type', 1)
    //                     ->where('pass_status', 2)
    //                     ->count();
    //             $major = DB::table('tra_checklistitems_responses as t1')
    //                     ->join('par_checklist_items as t2', 't1.checklist_item_id', 't2.id')
    //                     ->join('par_checklist_types as t3', 't2.checklist_type_id', 't3.id')
    //                     ->where($where)
    //                     ->where('risk_type', 2)
    //                     ->where('pass_status', 2)
    //                     ->count();
    //             $critical = DB::table('tra_checklistitems_responses as t1')
    //                     ->join('par_checklist_items as t2', 't1.checklist_item_id', 't2.id')
    //                     ->join('par_checklist_types as t3', 't2.checklist_type_id', 't3.id')
    //                     ->where($where)
    //                     ->where('risk_type', 3)
    //                     ->where('pass_status', 2)
    //                     ->count();
                
    //             $risk_compliance = array(
    //                 'minor_compliances' => $minor,
    //                 'major_compliances' => $major,
    //                 'critical_compliances' => $critical,
    //             );
    //             $res = updateRecord('tra_premiseinspection_applications', ['id' => $application_id], $risk_compliance);
    //             if(!isset($res['record_id'])){
    //                 return $res;
    //             }
    //             updateFacilityRiskScore();
    //             //complete pending inspections from the licensing module
    //             $premise_id = getSingleRecordColValue('tra_premiseinspection_applications', ['id' => $application_id], 'premise_id');
    //             $premise_submission_list = DB::table("tra_premises_applications as t1")
    //                     ->join('tra_submissions as t2', 't1.application_code', 't2.application_code')
    //                     ->join('wf_workflow_stages as t3', 't2.current_stage', 't3.id')
    //                     ->where(['t3.stage_category_id'=> 17,'is_done' => 0, 't1.premise_id' => $premise_id])
    //                     ->select('t2.id as submission_id')
    //                     ->get();
    //             $submission_ids = convertStdClassObjToArray($premise_submission_list);
    //             if(count($submission_ids) > 0){
    //                 DB::table('tra_submissions')->where($submission_ids)->update(['is_done'=>1, 'remarks'=> 'Cleared by inspections conducted on the facility via routine inspections']);
    //             }
    //         }
    //         DB::commit();
    //         $res = array(
    //             'success' => true,
    //             'message' => 'Screening details saved successfully!!'
    //         );
    //     } catch (\Exception $exception) {
    //          DB::rollback();
    //         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    //     } catch (\Throwable $throwable) {
    //          DB::rollback();
    //         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    //     }
    //     return \response()->json($res);
    // }
    public function submitInspectionDetails(Request $request){
        $module_id = $request->input('module_id');
        try{
            if($module_id == 2){
                $this->processPremiseApplicationSubmission($request);
            }else if($module_id == 3){
                $this->processGmpApplicationsSubmission($request);
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'SUBMIT ONLY FOR FACILITY AND GMP'
                );
                return $res;
            }
            
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
    }
    public function processPremiseApplicationSubmission(Request $request)
    {
        $application_id = $request->input('application_id');
        $process_id = $request->input('process_id');
        $table_name = "tra_premises_applications";
        $module_id = $request->input('module_id');
		$sub_module_id = $request->input('sub_module_id');
        $action = $request->input('action');
        // $prev_stage = $request->input('previous_stage');
        $from_stage = $request->input('curr_stage_id');
        $to_stage = 0;
        $directive_id = $request->input('directive_id');
        $is_dataammendment_request = $request->input('is_dataammendment_request');
        $is_inspection_submission = $request->input('is_inspection_submission');
        $remarks = $request->input('remarks');
        $responsible_user = $request->input('responsible_user');
		$urgency = $request->input('urgency');
        $external_user_id= $request->input('external_user_id');
        $user_id =1;// $request->input('user_id');
        
        //DB::beginTransaction();
        
        try{
            //todo: get application details
            if($sub_module_id == 50){ //for inspection based applications
                $application_details = DB::table('tra_premiseinspection_applications as t1')
                    ->where('t1.id', $application_id)
                    ->first();
					
            }else{
                $application_details = DB::table($table_name.' as t1')
                    ->join('tra_premises as t2', 't1.premise_id', 't2.id')
                    ->where('t1.id', $application_id)
                    ->first();
            }
            
            if (is_null($application_details)) {
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching application details!!'
                );
                echo json_encode($res);
                exit();
            }
         // json_encode($application_details);
		 
            $branch_id = $application_details->branch_id;
            //$refno_generated = $application_details->refno_generated;
			
            $reference_no = $application_details->reference_no;
            $application_code = $application_details->application_code;
            $ref_no = $application_details->reference_no;
            $tracking_no = $application_details->tracking_no;
            //$is_fast_track = $application_details->is_fast_track;
            $view_id = $application_details->view_id;
            $applicant_id = $application_details->applicant_id;
            $sub_module_id = $application_details->sub_module_id;
            $section_id = $application_details->section_id;
            $premise_type_id = $application_details->facility_type_id;

            //todo: get workflow action details
            $action_details = DB::table('wf_workflow_actions')
                ->where('id', $action)
                ->first();
            if (is_null($action_details)) {
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered getting action details!!'
                );
                echo json_encode($res);
                exit();
            }
			
            $keep_status = $action_details->keep_status;
            $action_type = $action_details->action_type_id;
            $has_process_defination = $action_details->has_process_defination;
            $appprocess_defination_id = $action_details->appprocess_defination_id;
            $has_appdate_defination = $action_details->has_appdate_defination;
            $appdate_defination_id = $action_details->appdate_defination_id;
            $has_email_notification = $action_details->has_email_notification;

            $is_inspection_submission = 0;
            $prodclass_category_id = 0;
            if(isset($action_details->is_inspection_submission)){
                $is_inspection_submission = $action_details->is_inspection_submission;
            }

            if ($action_details->generate_refno == 1) {
                if ($refno_generated != 1 && ($reference_no == '' or is_null($reference_no))) {
                    $codes_array = $this->getPremiseApplicationReferenceCodes($application_details);
                    $refno_details = generateApplicationRefNumber($application_id, $table_name, $sub_module_id, 1, $codes_array, $process_id, $branch_id, $user_id);
                        if ($refno_details['success'] == false) {
                            echo json_encode($refno_details);
                            exit();
                        }
                }
            }
            if ($action_details->update_checklistref == 1) {
                $proceed = updateApplicationChecklistsRef($from_stage, $application_code, $tracking_no, $user_id, $table_name);
                if ($proceed['success'] == false) {
                    echo json_encode($proceed);
                    exit();
                }
            }

            if ($action_type == 2) {//initial query
                $this->processReceivingQueriedApplicationSubmission($request);
            } else if ($action_type == 3) {//initial rejection
                 $this->processReceivingRejectedApplicationSubmission($request);
            } else if ($action_type == 6) {//recommendation submission
                $recommendation_table = $action_details->recommendation_table;
                $this->processRecommendationApplicationSubmission($request, $recommendation_table);
            } else if ($action_type == 9) {//directive return submission
                if ($directive_id == 2) {//redo inspection
                    $this->processPremiseReturnApplicationSubmissionsWithChecklists($request, 3);
                } else if ($directive_id == 4) {//redo evaluation
                    $this->processPremiseReturnApplicationSubmissionsWithChecklists($request, 2);
                } else {
                    $this->processNormalApplicationSubmission($request);
                }
            }else{
				
                $where_app_status = array(
                    't1.stage_id' => $from_stage,
                    't1.action_id' => $action
                );
                
                $tranist_details = DB::table('wf_workflow_transitions as t1')
                    ->select('t1.*')
                    ->where($where_app_status);
                $tranist_detail = $tranist_details->first();
                
                $application_status_id = $tranist_detail->application_status_id ;
                $is_multi_submission = $tranist_detail->is_multi_submission;
                $multinextstage_id = $tranist_detail->multinextstage_id;
                $to_stage = $tranist_detail->nextstage_id;

                $where = array(
                    'id' => $application_id
                );
                if($is_dataammendment_request != 1){
                    $app_update = array(
                        'workflow_stage_id' => $to_stage,
                        'application_status_id' => $application_status_id
                    );
                   
                    $prev_data = getPreviousRecords($table_name, $where);
                    if ($prev_data['success'] == false) {
                        echo json_encode($prev_data);
                        exit();
                    }
                    $update_res = updateRecord($table_name, $where, $app_update,$user_id);
                    
                    if ($update_res['success'] == false) {
                        echo json_encode($update_res);
                        exit();
                    }
                }
                
                //process detailsd
                $process_details = DB::table('wf_processes')
                    ->where('id', $process_id)
                    ->first();
                if (is_null($process_details)) {
                    DB::rollBack();
                    $res = array(
                        'success' => false,
                        'message' => 'Problem encountered while fetching process details!!'
                    );
                    echo json_encode($res);
                    exit();
                }
          
                $appdate_defination = getSingleRecordColValue('par_appprocess_definations', array('id'=>$appdate_defination_id),'code');
                $application_processdefdata = array();
				
                if($has_appdate_defination == 1){
                    $application_processdefdata =   array('application_code'=>$application_code,
                        'appprocess_defination_id'=>$appprocess_defination_id,
                        'process_date'=>Carbon::NOW(),
                        'created_by'=>$user_id,
                        'created_on'=>Carbon::NOW());
                }
                    //end
                    $transition_params = array(
                    'application_id' => $application_id,
                    'application_code' => $application_code,
                    'application_status_id' => $application_status_id,
                    'process_id' => $process_id,
                    'from_stage' => $from_stage,
                    'to_stage' => $to_stage,
                    'author' => $user_id,
                    'remarks' => $remarks,
                    //'directive_id' => $directive_id,
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );

                insertRecord('tra_applications_transitions', $transition_params ,$user_id);
                //submissions
               
                $submission_params = array(
                    'application_id' => $application_id,
                    'process_id' => $process_id,
                    //'is_fast_track' => $is_fast_track,
                    'view_id' => $view_id,
                    'application_code' => $application_code,
                    'reference_no' => $ref_no,
                    'tracking_no' => $tracking_no,
                    'usr_from' => $user_id,
                    'prodclass_category_id' => $prodclass_category_id,
                    'usr_to' => $responsible_user,
                    'premise_type_id' => $premise_type_id,
                    'previous_stage' => $from_stage,
                    'current_stage' => $to_stage,
                    'module_id' => $module_id,
                    'external_user_id'=>$external_user_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_status_id' => $application_status_id,
                    //'urgency' => $urgency,
                    'applicant_id' => $applicant_id,
                    'branch_id' => $branch_id,
                    'remarks' => $remarks,
                    //'directive_id' => $directive_id,
                    'created_by' => $user_id
                );
              
                if(validateIsNumeric($external_user_id)){
                    $submission_params['usr_to'] = $external_user_id;
                    //send and email to the Extrenal user
                    $module_name = getSingleRecordColValue('par_modules', array('id'=>$module_id), 'name');
                    $process_name = getSingleRecordColValue('wf_processes', array('id'=>$process_id), 'name');
                    $process_stage = getSingleRecordColValue('wf_workflow_stages', array('id'=>$to_stage), 'name');
                    $email_address = getSingleRecordColValue('users', array('id'=>$external_user_id), 'email');
                    $vars = array(
                        '{module_name}' => $module_name,
                        '{process_name}' => $process_name,
                        '{process_stage}' => $process_stage,
                    );
                    sendTemplatedApplicationNotificationEmail(16, $email_address,$vars);
                    //send an email to the rest of the users

                }
                if($has_email_notification == 1){
                    if($module_id == 8){
                        $email_address = DB::table('tra_enforcement_information', array('id'=>$application_details->enforcement_id), 'app_email');
                        $vars = array(
                                '{application_no}' => $tracking_no.': Application No '.$ref_no
                        );
                        sendTemplatedApplicationNotificationEmail(10, $email_address,$vars);
                        //send an email to the rest of the users
                    }
                }

                if ($action_details->has_submission_notification == 1 && validateIsNumeric($responsible_user)) {

                    $module_name = getSingleRecordColValue('par_modules', array('id'=>$module_id), 'name');
                    $process_name = getSingleRecordColValue('wf_processes', array('id'=>$process_id), 'name');
                    $process_stage = getSingleRecordColValue('wf_workflow_stages', array('id'=>$to_stage), 'name');
                    $email_address = getSingleRecordColValue('users', array('id'=>$responsible_user), 'email');
                    $vars = array(
                        '{module_name}' => $module_name,
                        '{process_name}' => $process_name,
                        '{process_stage}' => $process_stage,
                        '{application_no}' => $tracking_no.': Application No '.$ref_no,
                    );

                    sendTemplatedApplicationNotificationEmail(12, $email_address,$vars);
                    //send an email to the rest of the users

                }
               
                if($is_inspection_submission == 1){

                    $inspectors = $this->getInspectorsIDList($module_id, $application_code);

                    //loop through while updating submissions data
                    foreach ($inspectors as $inspector) {
                        //change usr_to
                        $submission_params['usr_to'] = $inspector->inspector_id;
                        //update submissions
                        insertRecord('tra_submissions', $submission_params, 1,'pgsql');
                    }
                } else {
                    DB::table('tra_submissions')
                        ->insert($submission_params);  
                }
              
                if ($action_details->update_portal_status == 1) {
                    $portal_status_id = $action_details->portal_status_id;
                    $table_name = getSingleRecordColValue('par_modules', array('id' => $module_id), 'tablename');
                   
                    $portal_table = getPortalApplicationsTable($module_id);
                   
                    // $proceed = updatePortalApplicationStatus($application_id, $portal_status_id, $table_name, $portal_table);
                  
                }
                if($has_appdate_defination == 1){
                    $appdate_defination = array($appdate_defination=>Carbon::now(),'dola'=>Carbon::now());
                }
                if(count($application_processdefdata) >0){
                    insertRecord('tra_applications_processdefinations', $application_processdefdata, 1,'pgsql');
                }
                
                //check if Application is from inspection Submission
                $this->setIsDoneIFInspectionApplicationSubmission($application_code, $from_stage);

                updateInTraySubmissions($application_id, $application_code, $from_stage, $user_id);
              
                DB::commit(); 
              
                $res = array(
                    'success' => true,
                    'message' => 'Application Submitted Successfully!!'
                );
            }
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        echo json_encode($res);
        return true;
    }
    public function getActionTransitionDetails($action_id){
        $rec = DB::table('wf_workflow_transitions as t1')
            ->select('t1.*')
            ->where(array('action_id'=>$action_id))
            ->first();
        return $rec;
    }
    public function setIsDoneIFInspectionApplicationSubmission($application_code, $pre_stage)
    {
        $pre_prev_stage = DB::table('tra_submissions')
            ->where('application_code',$application_code)
            ->where('current_stage',$pre_stage)
            ->orderBy('id','DESC')
            ->select('previous_stage')
            ->first();
        if($pre_prev_stage){
            $actions = DB::table('wf_workflow_stages as t1')
                ->join('wf_workflow_actions as t2', 't1.id', '=', 't2.stage_id')
                ->where('t1.id',$pre_prev_stage->previous_stage)
                ->select('t2.is_inspection_submission')
                ->first();
            $latest_entry = DB::table('tra_submissions')
                ->where('application_code',$application_code)
                ->orderBy('id','DESC')
                ->select('id')
                ->first();

            $is_inspection_submission = 0;
            if(isset($action_details->is_inspection_submission)){
                $is_inspection_submission = $action_details->is_inspection_submission;
            }
            if($is_inspection_submission == 1){
                $update = DB::table('tra_submissions')
                    ->where('application_code', $application_code)
                    ->where('id','<',$latest_entry->id)
                    ->update(array('is_done'=> 1));
            }

        }

    }
    public function processGmpApplicationsSubmission(Request $request)
    {
        $action = $request->input('action');
        $application_id = $request->input('application_id');
        $sub_module_id = $request->input('sub_module_id');
        $module_id = $request->input('module_id');
        $process_id = $request->input('process_id');
        $table_name = $request->input('table_name');
        $user_id = $this->user_id;
        $table_name = $request->input('table_name');

        if($table_name == ''){
            $table_name = getSingleRecordColValue('par_modules', array('id' => $module_id), 'table_name');

        }
        //todo: get application details
        $application_details = DB::table($table_name)
            ->where('id', $application_id)
            ->first();
        if (is_null($application_details)) {
            $res = array(
                'success' => false,
                'message' => 'Problem encountered while fetching application details!!'
            );
            echo json_encode($res);
            exit();
        }

        $zone_id = $application_details->zone_id;
        $refno_generated = $application_details->refno_generated;
        $portal_id = $application_details->portal_id;
        $reference_no = $application_details->reference_no;
        //todo get workflow action details
        $action_details = DB::table('wf_workflow_actions')
            ->where('id', $action)
            ->first();
        if (is_null($action_details)) {
            $res = array(
                'success' => false,
                'message' => 'Problem encountered getting action details!!'
            );
            echo json_encode($res);
            exit();
        }

        $keep_status = $action_details->keep_status;
        $action_type = $action_details->action_type_id;

        if ($action_details->generate_refno == 1) {
            if ($refno_generated != 1 && ($reference_no == '' or is_null($reference_no))) {

                $codes_array = $this->getGmpApplicationReferenceCodes($sub_module_id, $application_details, $table_name);

                $refno_details = generateApplicationRefNumber($application_id, $table_name, $sub_module_id, 1, $codes_array, $process_id, $zone_id, $user_id);
                dd($refno_details);
                if ($refno_details['success'] == false) {
                    echo json_encode($refno_details);
                    exit();
                }
                $portal_params = array(
                    'reference_no' => $refno_details['ref_no']
                );
                $portal_where = array(
                    'id' => $portal_id
                );
                //updatePortalParams('wb_premises_applications', $portal_params, $portal_where);
            }
        }
        if ($action_details->update_portal_status == 1) {
            /*$portal_status_id = $action_details->portal_status_id;
            $proceed = updatePortalApplicationStatus($application_id, $portal_status_id, $table_name, 'wb_gmp_applications');
            if ($proceed == false) {
                echo json_encode($proceed);
                exit();
            }*/
        }
        if ($action_type == 2) {//initial query
            $this->processReceivingQueriedApplicationSubmission($request);
        } else if ($action_type == 3) {//initial rejection
            $this->processReceivingRejectedApplicationSubmission($request);
        } else if ($action_type == 6) {//recommendation submission
            $recommendation_table = $action_details->recommendation_table;
            $this->processRecommendationApplicationSubmission($request, $recommendation_table);
        } else {
            $this->processNormalApplicationSubmission($request, $keep_status);
        }
    }

    //getTable contents
    public function getConfigParamFromTable(Request $req)
    {
        try {
            $filters = $req->filters;
            $is_config = $req->is_config;
            $table_name = $req->table_name;
            $qry = DB::table($table_name. ' as t1');

            //conditional selection based on table
            if($table_name == 'par_form_categories'){
                $qry->Join('par_modules as t4','t1.module_id','=','t4.id')
                    ->Join('par_sub_modules as t5','t1.sub_module_id','=','t5.id')
                    ->leftJoin('par_sections as t6','t1.section_id','=','t6.id')
                    ->leftJoin('par_prodclass_categories as t7','t1.prodclass_category_id','=','t7.id')
                    ->leftJoin('par_premises_types as t8','t1.premise_type_id','=','t8.id')
                    ->select('t1.*', 't4.name as module_name', 't5.name as sub_module_name', 't6.name as section_name', 't7.name as section_category', 't8.name as premise_type');
            }
            else if($table_name== 'par_maindetails_variation_points'){
                $qry->Join('par_modules as t4','t1.module_id','=','t4.id')
                ->Join('par_sub_modules as t5','t1.sub_module_id','=','t5.id')
                ->leftJoin('par_sections as t6','t1.section_id','=','t6.id')
                ->leftJoin('par_prodclass_categories as t7','t1.prodclass_category_id','=','t7.id')
                ->leftJoin('par_premises_types as t8','t1.premise_type_id','=','t8.id')
                ->leftJoin('par_typeof_variations as t9','t1.variationtype_id','=','t9.id')
                ->leftJoin('par_form_categories as t10','t1.form_categories_id','=','t10.id')
                ->leftJoin('par_formfield_designs as t11','t1.form_fields_id','=','t11.id')
                ->select('t1.*', 't4.name as module_name', 't5.name as sub_module_name', 't6.name as section_name', 't7.name as section_category', 't8.name as premise_type','t9.name as variation_type','t10.name as form_name','t11.field_name as field_name');
            }
            else if($table_name == 'par_formtype_fields'){
                $qry->Join('par_formfield_designs as t4','t1.field_id','=','t4.id')
                    ->select('t1.*', 't4.label as field_name', 't4.label');
                //order
                $qry->orderBy('order_no', 'ASC');
            }
            else if($table_name == 'par_formfield_designs'){
                $qry->Join('par_form_field_types as t5','t1.form_field_type_id','=','t5.id')
                    ->select('t1.*', 't5.name as field_type');
            }
            else if($table_name == 'tra_otherstates_productgmpinspections'){
                $qry->Join('par_continent_regions as t5','t1.continent_region_id','=','t5.id')
                    ->Join('par_countries as t6','t1.country_id','=','t6.id')
                    ->select('t1.*', 't5.name as continent_region', 't6.name as country');

            } else if($table_name == 'tra_variation_requests'){
            
                $qry->leftJoin('par_typeof_variations as t5','t1.variation_type_id','=','t5.id')
                    ->leftJoin('par_variation_points as t6','t1.variation_point_id','=','t6.id')
                    ->select('t1.*', 't5.name as variation_type', 't6.name as variation_point');
                if(validateIsNumeric($req->application_code)){
                    $qry->where('application_code', $req->application_code);
                }else{
                    $qry->whereRaw("0=1");
                }
            }

            else if($table_name == 'tra_product_ingredients'){
                $qry->Join('par_ingredients_details as t5','t1.ingredient_id','=','t5.id')
                    ->leftjoin('par_inclusions_reasons as t6','t1.inclusion_reason_id','=','t6.id')
                    ->select('t1.*', 't5.name as ingredient_name', 't1.ingredient_id as active_ingredient_id');
                if(validateIsNumeric($req->is_active_reason)){
                    $qry->where('is_active_reason', 1);
                }
            }
            else if($table_name == 'par_ageanalysisdays_span'){
                $qry->leftjoin('par_modules as t2', 't1.module_id','t2.id')
                ->select('t1.*','t2.name as module_name') ;

            }
            else if ($table_name == 'tra_element_costs') {
                    $qry->leftJoin('par_cost_elements as t3','t1.element_id','=','t3.id')
                        ->leftJoin('par_currencies as t4','t1.currency_id','=','t4.id')
                        ->select('t1.*','t3.name as name','t4.name as currency_name');

                }
            else if ($table_name == 'tra_pharmacy_details') {
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4','t1.district_id','=','t4.id')
                        //->leftJoin('par_cities as t5','t1.sub_district_id','=','t5.id')
                        ->select('t1.*','t3.name as region','t4.name as district');

                }
            else if ($table_name == 'tra_personnel_qualifications') {
                    $qry->leftJoin('par_qualifications as t3','t1.qualification_id','=','t3.id')
                        ->select('t1.*','t3.name as qualification');

                }
            else if($table_name == 'tra_personnel_information'){
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->select('t1.*','t1.id as personnel_id','t3.name as region', 't4.name as district');
                }
            else if($table_name == 'par_study_sites'){
                    $qry->leftJoin('par_countries as t6','t1.country_id','=','t6.id')
                        ->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->select('t1.*','t6.name as country','t3.name as region', 't4.name as district');
                }
                else if($table_name == 'par_exceluploads_config'){
                    $qry->leftjoin('par_modules as t2', 't1.module_id','t2.id')
                        ->leftjoin('par_sub_modules as t3', 't1.sub_module_id','t3.id')
                        ->leftJoin('par_adr_types as t4','t1.adrtype_id','=','t4.id')
                        ->leftJoin('par_exceluploads_config_type as t5','t1.excel_config_type_id','=','t5.id')
                        ->select('t1.*','t5.name as type_name','t2.name as module_name','t3.name as sub_module_name','t4.name as adr_type' );
                }
                else if($table_name == 'tra_impdistributor_details'){
                    $qry->join('wb_trader_account as t2', 't1.importer_id','t2.id')
                        ->leftjoin('par_countries as t3', 't2.country_id','t3.id')
                        ->leftJoin('par_regions as t4','t2.region_id','=','t4.id')
                        ->leftJoin('par_districts as t5','t2.district_id','=','t5.id')
                        ->select('t1.*', 't2.*', 't3.name as country', 't4.name as region', 't5.name as district', 't2.id as importer_id', 't2.name as applicant_name', 't2.country_id as app_country_id', 't2.region_id as app_region_id', 't2.district_id as app_district_id', 't2.physical_address as app_physical_address', 't2.postal_address as app_postal_address', 't2.telephone_no as app_telephone', 't2.email as app_email');
                }
                else if($table_name == 'tra_md_assessment_history'){
                    $qry->join('users as t2', 't1.assessment_by','t2.id')
                    ->select(DB::raw("t1.*,CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as assessment_by"));
                }
                else if($table_name == 'par_containers_types'){
                    $qry->whereIN('id', [1,2]);
                }
                else if($table_name == 'par_confirmations'){
                    $qry->whereIN('id', [1,2]);
                }
                else if($table_name == 'tra_otherstates_productregistrations'){
                    $qry->where('application_code', $req->application_code);
                    $qry->Join('par_continent_regions as t5','t1.continent_region_id','=','t5.id')
                    ->Join('par_countries as t6','t1.country_id','=','t6.id')
                    ->select('t1.*', 't5.name as continent_region', 't6.name as country');
                }
                else if($table_name == 'tra_trial_ethic_committees'){
                    $qry->join('par_research_organizations as t5','t1.ethic_committee_id','=','t5.id')
                        ->select('t1.*', 't5.name');
                }
                else if($table_name == 'tra_impproduct_otherstate_registration_status'){
                    $qry->Join('par_countries as t5','t1.country_id', 't5.id')
                        ->Join('par_registration_statuses as t6','t1.registration_status', 't6.id')
                        ->select('t1.*', 't5.name as country_name', 't6.name as status');
                }
                else if($table_name == 'tra_trial_ethic_committees'){
                    $qry->join('par_research_organizations as t5','t1.ethic_committee_id','=','t5.id')
                        ->select('t1.*', 't5.name');
                }

                // else if($table_name == 'par_medical_device_assesment_answers'){
                //     $qry->get();
                // }

            //filters for product related data
            $product_id= $req->product_id;
            if(validateIsNumeric($product_id)){
                $qry->where('product_id', $product_id);
            }

            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $filters = array_filter($filters);

                //load regions for the local country
                if($table_name == 'par_regions' && isset($filters['is_local'])){
                    $qry->join('par_countries as t7', 't1.country_id', 't7.id')->select('t1.*');
                }
                else if($table_name == 'par_classification_rules'){
                    if(isset($filters['classification_id']) && isset($filters['device_type_id'])){
                        $qry->join('par_product_classificationrules as t3', 't1.id', 't3.class_rule_id');
                    }
                }
                else if($table_name == 'par_premises_types'){
                    if(isset($filters['site_level_id'])){
                        $qry->join('pms_premise_type_levels as t3', 't1.id', 't3.premise_type_id');
                    }
                }
                //get data
                $results = $qry->where($filters);
                // if($table_name == 'par_classifications' && isset($filters['prodclass_category_id'])){
                //     $qry->leftJoin('par_prodcat_classifications as t2','t1.id', 't2.classification_id')
                //         ->select('t1.*')
                //         ->where('t2.prodclass_category_id', $filters['prodclass_category_id']);
                // }

                // else{
                //     $results = $qry->where($filters);tra_impdistributor_details
                // }
            }
        $filter = $req->filter;
            if ($filter != '') {
                $filters = (array)json_decode($filter);
                $filters = array_filter($filters);

                //load regions for the local country
                if($table_name == 'par_regions' && isset($filters['is_local'])){
                    $qry->join('par_countries as t7', 't1.country_id', 't7.id')->select('t1.*');
                }
                //get data
                $qry->where($filters);
            }
            $query = $req->input('query');
            if($query != ''){
                if($table_name == 'par_gmdn_codes'){
                    $qry->where('t1.code', 'ilike', '%' .$query . '%')->orWhere('t1.name', 'ilike', '%' .$query . '%');
                }
            }
            if($table_name == 'par_sections'){
                $qry->whereIn('id',[2, 3, 4, 7, 8, 10, 5]);
            }



            if(!validateIsnumeric($is_config)){
                $qry->where('t1.is_enabled', 1);
            }
            $comboFilter = $req->comboFilter;
            if($comboFilter != ''){
            $qry->where('t1.code', 'ilike', '%' . $comboFilter . '%')->orWhere('t1.name', 'ilike', '%' .$comboFilter . '%');
            }
            // //paginate 
            $total=$qry->count();
            $start=$req->start;
            $limit=$req->limit;
            if(isset($start)&&isset($limit) && $table_name == 'par_gmdn_codes'){
                $results = $qry->skip($start)->take($limit)->get();
            }
            else{
                $results=$qry->get();
            }

            //$results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'total' => $total,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getUserDetails(Request $request){
        $user_id = $request->user_id;
        $token = $request->bearerToken();

        try{
            if($token != null){
                $qry = DB::table('users as t1')
                    ->leftJoin('par_titles as t2', 't1.title_id', '=', 't2.id')
                    ->leftJoin('par_gender as t3', 't1.gender_id', '=', 't3.id')
                    ->leftJoin('par_departments as t4', 't1.department_id', '=', 't4.id')
                    ->select(DB::raw("t1.id as user_id,CONCAT(t2.name,'',decryptval(t1.first_name,".getDecryptFunParams()."),' ', decryptval(t1.last_name,".getDecryptFunParams().")) as Name,
                    t1.email,t3.name as Gender,t4.name as Department,decryptval(t1.phone,".getDecryptFunParams().") as phone,decryptval(t1.mobile,".getDecryptFunParams().") as mobile"))
                    ->where('t1.id',$user_id);
                $user_details =$qry ->get();

                if(count($user_details)> 0){           
                    $res = array(
                        'success' => true,
                        'User' => $user_details,
                        'message' => 'All is well'
                    );
                    return $res;
                }else{
                    $res = array(
                        'success' => false,
                        'message' => 'USER WITH THAT ID NOT FOUND'
                    );
                    return $res;
                }
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'Access denied'
                );
            }
            
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
    }

    public function getWorkflowActions($stage_id)
    {
        DB::connection()->enableQueryLog();
        $application_status_id = null;
        $is_status_tied = null;
        $pms_recommendation_id = null;
        $pms_analysis_type_id = null;
        $gmpinspection_type_id = null;
        $premiseinspection_recomm_id = null;
        $workflowaction_type_id = null;
        $has_queries = null;
        $is_submission = 1;

        try {
            $qry = DB::table('wf_workflow_actions as t1')
                ->leftJoin('wf_workflow_stages as t2', 't1.stage_id', '=', 't2.id')
                ->leftJoin('wf_workflowaction_types as t3', 't1.action_type_id', '=', 't3.id')
                ->select('t1.*', 't2.name as stage_name', 't3.name as action_type')
                ->where('stage_id', $stage_id);
            if (isset($is_status_tied) && $is_status_tied == 1) {
                $qry->where('application_status_id', $application_status_id)
                    ->where('is_status_tied', '=', 1);
            }
            if (validateIsNumeric($pms_analysis_type_id)) {
                $where = array(
                    't1.pms_analysis_type_id' => $pms_analysis_type_id,
                    't1.pms_recommendation_id' => $pms_recommendation_id
                );
                $qry->where($where);
            }
            if (validateIsNumeric($workflowaction_type_id)) {
                $where = array(
                    't1.action_type_id' => $workflowaction_type_id
                );
                $qry->where($where);
            }
            if (validateIsNumeric($gmpinspection_type_id)) {
                $where = array(
                    't1.gmp_inspection_type_id' => $gmpinspection_type_id
                );
                $qry->where(function ($query) use ($where) {
                    $query->where($where)
                        ->orWhere('t1.gmp_inspection_type_id', '=', 0)
                        ->orWhereNull('t1.gmp_inspection_type_id');
                });
            }
            if (validateIsNumeric($premiseinspection_recomm_id)) {
                $where = array(
                    't1.preminspection_recomm_id' => $premiseinspection_recomm_id
                );
                $qry->where(function ($query) use ($where) {
                    $query->where($where)
                        ->orWhere('t1.preminspection_recomm_id', '=', 0)
                        ->orWhereNull('t1.preminspection_recomm_id');
                });
            }
            if (validateIsNumeric($has_queries)) {
               /* $qry->where('t1.query_raised_submission', 1);*/

            } else {
                if (validateIsNumeric($is_submission) && $is_submission == 1) {
                    $qry->where(function ($query) {
                    $query->where('t1.query_raised_submission', 2)
                    ->orWhereNull('t1.query_raised_submission');
                     });
                }
            }

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
        return  $results;
    }
    

    //

    public function uploadMobileDocuments(Request $req, $file='')
    {
        try {
            $user_id = $req->user_id;
            $application_code = $req->application_code;
            $module_id = $req->module_id;
            $record_id = $req->id;
            $node_ref = $req->node_ref;
            $sub_module_id = $req->sub_module_id;
            $document_type_id = $req->document_type_id;
            $document_requirement_id = $req->document_requirement_id;
            $assessment_start_date = $req->assessment_start_date;
            $assessment_end_date = $req->assessment_end_date;
            $assessment_by = $req->assessment_by;
            $query_ref_id = $req->query_ref_id;
            $view_module_id = $req->view_module_id;

            if($file == ''){
                $file = $req->file('uploaded_doc');
            }


            $app_rootnode = getApplicationRootNode($application_code);
            $app_rootnode = getDocumentTypeRootNode($app_rootnode->dms_node_id, $application_code, $document_type_id, $user_id);
            $table_name = 'tra_application_uploadeddocuments';
            $mis_application_id = 0;
            $reg_serial = 0;
            //for products add product id
            if(validateIsNumeric($module_id)){
                $app_table = getTableName($module_id);
                $reg_serial = getSingleRecordColValue($app_table, ['application_code'=>$application_code], 'reg_serial');
            }else if(validateIsNumeric($view_module_id)){
                $app_table = getTableName($view_module_id);
                $reg_serial = getSingleRecordColValue($app_table, ['application_code'=>$application_code], 'reg_serial');
            }
            if ($app_rootnode) {
                if ($file) {
                    $origFileName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $docextension_check = $this->validateDocumentExtension($extension,$document_requirement_id);
                    $is_allowedextension = $docextension_check['is_allowedextension'];

                    if(!$is_allowedextension){
                            $allowed_filetypes = $docextension_check['allowed_filetypes'];
                            $res = array('success'=>false, 'message'=>'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions:.'.$allowed_filetypes);

                    }
                    else{

                            $fileSize = $file->getSize();
                            $file_path = $file->getPathName();
                            $document_rootupload =  Config('constants.dms.doc_rootupload');

                            $destination = getcwd() . $document_rootupload;
                            $savedName = str_random(3) . time() . '.' . $extension;

                            //$file->move($destination, $savedName);
                            $document_path = $destination . $savedName;
                            //check if tje dpcument type has been mapped and not autoCreate the folder
                            $document_requirement = getParameterItem('tra_documentupload_requirements', $document_requirement_id);

                            //get the application root folder

                            $uploadfile_name = $document_requirement . str_random(5) . '.' . $extension;
                            $destination_node = $app_rootnode->node_ref;

                            if (validateIsNumeric($record_id)) {

                                $response = dmsUploadNodeDocument($destination_node, $file_path, $uploadfile_name, $node_ref);

                                $node_ref = $response['nodeRef'];
                                $document_data = array('application_code' => $application_code,
                                    'document_requirement_id' => $document_requirement_id,
                                    'uploaded_on' => Carbon::now(),
                                    'uploaded_by' => $user_id,
                                    'file_name' => $uploadfile_name,
                                    'initial_file_name' => $origFileName,
                                    'file_type' => $extension,
                                    'node_ref' => $node_ref,
                                    'query_ref_id' => $query_ref_id,
                                    'dola' => Carbon::now(),
                                    'altered_by' => $user_id,
                                    'assessment_start_date' => $assessment_start_date,
                                    'assessment_end_date' => $assessment_end_date,
                                    'assessment_by'=>$assessment_by,
                                    'reg_serial' => $reg_serial
                                );

                                $where = array('id' => $record_id);

                                if (recordExists($table_name, $where)) {

                                    $previous_data = getPreviousRecords('tra_application_uploadeddocuments', $where);
                                    $previous_data = $previous_data['results'];
                                    $res = updateRecord('tra_application_uploadeddocuments', $where, $document_data, $user_id);

                                    $previous_data = $previous_data[0];
                                    $document_upload_id = $previous_data['id'];
                                    unset($previous_data['id']);
                                    $previous_data['document_upload_id'] = $document_upload_id;
                                    $re = insertRecord('tra_documents_prevversions', $previous_data, $user_id);

                                }
                            } else {
                                $response = dmsUploadNodeDocument($destination_node, $file_path, $uploadfile_name, '');

                                $node_ref = $response['nodeRef'];
                                $document_data = array('application_code' => $application_code,
                                    'document_requirement_id' => $document_requirement_id,
                                    'document_type_id' => $document_type_id,
                                    'uploaded_on' => Carbon::now(),
                                    'uploaded_by' => $user_id,
                                    'file_name' => $uploadfile_name,
                                    'initial_file_name' => $origFileName,
                                    'file_type' => $extension,
                                    'node_ref' => $node_ref,
                                    'query_ref_id' => $query_ref_id,
                                    'created_on' => Carbon::now(),
                                    'created_by' => $user_id,
                                    'assessment_start_date' => $assessment_start_date,
                                    'assessment_end_date' => $assessment_end_date,
                                    'assessment_by'=>$assessment_by,
                                    'reg_serial' => $reg_serial
                                );
                                $res = insertRecord('tra_application_uploadeddocuments', $document_data, $user_id);

                                if ($res['success']) {

                                    $res['message'] = 'Document Uploaded Successfully';

                                } else {
                                    $res['message'] = 'Document Upload failed, try again or contact the system admin';

                                }
                            }
                    }

                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'No document attachement for upload'
                    );
                }

            } else {
                $res = array(
                    'success' => false,
                    'message' => 'DMS Document Type Node not configured, contact the system Admin'
                );

            }
            unlink($file->getPathname());

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    //PMS
    public function getPMSApplicationDetails(Request $request)
    {
        $token = $request->bearerToken();
        $user_id = $request->user_id;
        // getSurveillanceApplications
        //saveSurveillanceSampleDetails -for sample collection
        try{
            if($token != null){
                $pms_application_details = DB::table('tra_submissions as t1')
                        ->leftJoin('wf_workflow_stages as t2', 't1.current_stage', 't2.id')
                        ->leftJoin('tra_surveillance_sample_details as t3', 't1.application_code', '=', 't3.application_code')
                        ->leftJoin('tra_surveillance_applications as t4', 't3.application_id', '=', 't4.id')
                        ->leftJoin('tra_pms_sampling_sites as t5', 't3.sampling_site_id', '=', 't5.id')
                        ->leftJoin('tra_sample_collectors_assignments as t6', 't3.pms_plan_id', 't6.pms_plan_id')
                        ->select('t1.*','t3.pms_plan_id','t3.application_id','t3.application_code','t3.sampling_site_id','t3.tracking_no','t5.premise_id','t6.user_id')
                        ->where(array('t1.module_id' => 5,'t1.is_done' => 0,'t6.user_id'=>$user_id)); //'t1.current_stage'=>1120,
                $main_pms = $pms_application_details->get();
            
                if(count($main_pms) > 0){
                    foreach($main_pms as $pms){
                        $application_code= $pms->application_code;
                        $pms_plan_id= $pms->pms_plan_id;
                        $premise_id= $pms->premise_id;

                        $main_details = DB::table('tra_surveillance_sample_details as t1')
                            ->leftJoin('tra_surveillance_applications as t2', 't1.application_id', '=', 't2.id')
                            ->leftjoin('tra_pms_sampling_sites as t3', 't1.sampling_site_id', '=', 't3.id')
                            ->select('t1.pms_plan_id','t1.application_id','t1.application_code','t1.sampling_site_id','t1.tracking_no','t2.*')
                            ->where(array('t1.application_code'=> $application_code));
                        $main_details = $main_details->get();

                        $assigned_samples = DB::table('tra_pms_sampling_sites as tt7')
                            ->join('pms_program_plans as tt3', 'tt7.pms_plan_id', 'tt3.id')
                            ->join('tra_surveillance_sample_details as tt1', 'tt1.sampling_site_id', 'tt7.id')
                            ->leftJoin('tra_sample_collectors_assignments as t2', 'tt1.pms_plan_id', 't2.pms_plan_id')
                            ->leftJoin('tra_product_applications as a4', 'tt3.product_id', 'a4.product_id')
                            ->leftJoin('tra_product_information as p4', 'tt3.product_id', 'p4.id')
                            ->leftJoin('par_dosage_forms as t4', 'tt3.dosage_form_id', 't4.id')
                            ->leftJoin('par_common_names as t5', 'p4.common_name_id', 't5.id')
                            ->leftJoin('par_si_units as t6', 'tt3.si_unit_id', '=', 't6.id')
                            ->leftJoin('tra_sample_collection_log as t7', 'tt7.id', 't7.sampling_site_id')
                            ->leftJoin('tra_premises as t8', 'tt7.premise_id', 't8.id')
                            ->leftJoin('par_regions as t9', 't8.region_id', 't9.id')
                            ->leftJoin('par_districts as t10', 't8.district_id', 't10.id')
                            ->leftJoin('par_containers as t11', 'tt7.container_id', 't11.id')
                            ->leftJoin('par_packaging_units as t12', 'tt7.primary_container_id', 't12.id')
                            ->leftJoin('par_packaging_units as tt12', 'tt7.secondary_container_id', 'tt12.id')
                            ->leftJoin('par_packaging_units as ttt12', 'tt7.tertiary_container_id', 'ttt12.id')
        
                            //processing
                            ->leftJoin('tra_pir_recommendation as t13', function ($join) use($pms_plan_id) {
                                $join->on('tt7.pms_plan_id', '=', 't13.pms_plan_id')
                                    ->on('t7.sampling_site_id', '=', 't13.sampling_site_id');
                            })
                            ->leftJoin('wf_workflow_stages as t14', 'tt1.workflow_stage_id', 't14.id')
                            ->leftJoin('tra_registered_products as t15', 'a4.id', 't15.tra_product_id')
        
                            ->select(DB::raw("DISTINCT ON (tt7.id) CONCAT(tt3.strength,t6.name) as strength_txt, CONCAT(tt7.collection_samples, ' ', t12.name) as primary_units, CONCAT(tt7.secondary_sample_size, ' ', tt12.name) as secondary_units, CONCAT(tt7.tertiary_sample_size, ' ', ttt12.name) as tertiary_units, CASE WHEN tt7.packaging_level_id = 1 THEN CONCAT((tt7.collection_samples), ' ', t12.name) WHEN tt7.packaging_level_id = 2 THEN CONCAT((tt7.collection_samples*tt7.secondary_sample_size), ' ', tt12.name) ELSE CONCAT((tt7.collection_samples*tt7.secondary_sample_size*tt7.tertiary_sample_size), ' ', ttt12.name) END as total_samples"), 't4.name as dosage_form','p4.brand_name as product','tt7.collection_samples','tt7.unit_pack','t8.id as premise_id','t8.physical_address', 't8.postal_address','t8.name','t8.telephone as telephone_no','t8.email', 't9.name as region','t10.name as district', 't11.name as container_name', 't12.name as packaging_unit','tt1.application_code','tt7.packaging_unit_id', 'tt1.reference_no', 'tt3.program_id', 'tt3.program_implementation_id', 'tt7.container_id','tt1.pms_plan_id', 'tt1.application_code', 'tt1.id as application_id', 'tt7.id as record_id','tt1.id', 'tt1.module_id', 'tt1.sub_module_id', 't13.id as pir_recommendation_id','t13.decision_id as pir_decision_id',
                            't13.comments as pir_comment', 't14.stage_category_id','tt7.id as sampling_site_id','t7.is_collected', 'tt7.primary_container_id','tt7.secondary_container_id','tt7.tertiary_container_id','tt7.secondary_sample_size', 'tt7.tertiary_sample_size', 'tt7.packaging_level_id','tt7.collection_samples as sample_size','t15.registration_no as certificate_no', 't15.registration_date', 'tt7.is_altenative','tt3.region_id', 't2.id as collector_assignment_id')
                            ->where('tt7.pms_plan_id', $pms_plan_id);
                        $assigned_samples = $assigned_samples ->get();

                        $personnel = DB::table('tra_premises_personnel as t1')
                            ->join('tra_personnel_information as t2','t1.personnel_id','=','t2.id')
                            ->select('t1.registration_no','t1.study_field','t1.institution','t1.start_date','t1.end_date','t2.*')
                            ->where('t1.premise_id',$premise_id);
                        $responsible_personnel = $personnel->get();

                        $pms_details [] = array(
                            'main_details' => $main_details,
                            'assigned_samples' => $assigned_samples,
                            'responsible_personnel' => $responsible_personnel
                        );
                        $pms = $pms_details;

                        $res = array(
                            'success' => true,
                            'results' => $pms,
                            'message' => 'All is well'
                        );               
                    }

                }else{
                    $res = array(
                        'success' => true,
                        'message' => 'No PMS Applications'
                    );
                }
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'Access Denied !!'
                );
            }

        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function saveSampleDetails(Request $request)
    {
        $sampling_site_id = $request->input('sampling_site_id');
        $sample_collection_id = $request->input('sample_collection_id');
        $primary_container_id = $request->primary_container_id;
        $secondary_sample_size = $request->secondary_sample_size;
        $secondary_container_id = $request->secondary_container_id;
        $tertiary_container_id = $request->tertiary_container_id;
        $tertiary_sample_size = $request->tertiary_sample_size;
        $packaging_level_id = $request->packaging_level_id;
        $pms_plan_id = $request->pms_plan_id;
        $is_altenative = $request->is_altenative;
        $product_id = $request->product_id;
        $altenative_reason = $request->altenative_reason;

        if(isset($request->is_altenative)){
            $is_altenative = 1;
        }
        $post_data = $request->input();
        $user_id = $this->user_id;

        
        $sample_data = array(
            'collectionsite_storage_condition' => $request->collectionsite_storage_condition,
            'product_description' => $request->product_description,
            'expiry_date' => $request->expiry_date,
            'storage_condition_id' => $request->storage_condition_id,
            'seal_condition_id' => $request->seal_condition_id,
            'date_collected' => Carbon::now(),
            'container_id' => $request->container_id,
            'unit_pack' => $request->unit_pack,
            'packaging_unit_id' => $request->packaging_unit_id,
            'collection_samples' => $request->sample_size,
            'batch_no' => $request->batch_no,
            'dosage_form_id' => $request->dosage_form_id,
            'is_collected' => 1,
            'sample_collector_id' => $user_id,
            'sampling_site_id' => $sampling_site_id,
            'primary_container_id' => $primary_container_id,
            'secondary_sample_size' => $secondary_sample_size,
            'secondary_container_id' => $secondary_container_id,
            'tertiary_container_id' => $tertiary_container_id,
            'tertiary_sample_size' => $tertiary_sample_size,
            'packaging_level_id' => $packaging_level_id,
            'is_altenative' => $is_altenative,
            'product_id' => $product_id,
            'altenative_reason' => $altenative_reason,
            'sample_collection_id' => $request->sample_collection_id, 
            'sample_id' => $request->sample_id, 
            'pms_plan_id' => $request->pms_plan_id, 
            'product' => $request->product, 
            'common_name' => $request->common_name, 
            'reference_no' => $request->reference_no, 
            'is_registered' => $request->is_registered, 
            'registration_no_shown' => $request->registration_no_shown, 
            'batch_no' => $request->batch_no, 
            'manufacturing_date' => $request->manufacturing_date,
            'device_type_id' => $request->device_type_id,  
            'discrepancies' => $request->discrepancies, 
            'product_name_present_external_check' => $request->product_name_present_external_check, 
            'inn_present_external_check' => $request->inn_present_external_check, 
            'strength_present_external_check' => $request->strength_present_external_check, 
            'batch_no_present_external_check' => $request->batch_no_present_external_check, 
            'manufacturing_date_present_external_check' => $request->manufacturing_date_present_external_check, 
            'expiry_date_present_external_check' => $request->expiry_date_present_external_check, 
            'manufacturer_details_present_external' => $request->manufacturer_details_present_external, 
            'product_name_present_primary_check' => $request->product_name_present_primary_check, 
            'unit_dose_primary_present_check' => $request->unit_dose_primary_present_check, 
            'strength_present_primary_check' => $request->strength_present_primary_check, 
            'batch_no_present_primary_check' => $request->batch_no_present_primary_check, 
            'manufacturing_date_present__primary_check' => $request->manufacturing_date_present__primary_check, 
            'expiry_date_present__primary_check' => $request->expiry_date_present__primary_check, 
            'has_different_manuacturer_details_in_primary' => $request->has_different_manuacturer_details_in_primary, 
            'manufacturer_details_primary_present' => $request->manufacturer_details_primary_present, 
            'has_leaflet_check' => $request->has_leaflet_check, 
            'leaflet_languages_composition_check' => $request->leaflet_languages_composition_check, 
            'has_different_manuacturer_details_in_leaflet' => $request->has_different_manuacturer_details_in_leaflet, 
            'manufacturer_details_leaflet_present' => $request->manufacturer_details_leaflet_present, 
            'has_different_storage_condition_in_leaflet' => $request->has_different_storage_condition_in_leaflet, 
            'has_different_storage_condition_in_leaflet' => $request->storage_condition_in_leaflet 

        );
        
        $table_name = 'tra_sample_collection_log';
        $where = array('id'=>$sample_collection_id);
        
        try {
            if(validateIsNumeric($sample_collection_id)){
                $res = updateRecord($table_name, $where, $sample_data, $user_id);
            }else{
                $res = insertRecord($table_name, $sample_data,$user_id);
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function saveAltenativeSampleDetails(Request $req)
    {
        //parameters
        $user_id = $this->user_id;
        $sample_application_code = $req->sample_application_code;
        $plan_id = $req->pms_plan_id;

        //unset uneccesary site details
        unset($req->sample_application_code);
        try{
            DB::beginTransaction();
        
            //save site 
            $res = $this->saveSurveillanceCommonData($req);
        
            $res = json_decode($res->getContent());
            if(!isset($res->record_id)){
                DB::rollback();
                return response()->json($res);
            }
            //get Application details
            
            $sample_application_details = DB::table('tra_surveillance_sample_details')->where('application_code', $sample_application_code)->first();
            if (is_null($sample_application_details)) {
                DB::rollback();
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching sample application details!!'
                );
                return json_encode($res);
            }
            $application_details = DB::table('tra_surveillance_applications')->where('id', $sample_application_details->application_id)->first();
            if (is_null($application_details)) {
                DB::rollback();
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching sur application details!!'
                );
                return json_encode($res);
            }
            //prepare variables
            $application_id = $application_details->id;
            $sampling_site_id = $res->record_id;
            //get serial
            $other_sample_details = DB::table('tra_surveillance_sample_details')
                    ->where('application_id', $application_id)
                    ->select(DB::raw("pms_plan_id, process_id, module_id,sub_module_id,section_id"))
                    ->groupBy('application_id', 'pms_plan_id', 'process_id','module_id','sub_module_id','section_id')
                    ->first();
            if (is_null($other_sample_details)) {
                DB::rollback();
                $res = array(
                    'success' => false,
                    'message' => 'Problem encountered while fetching sample details!!'
                );
                return json_encode($res);
            }
            $serial_no = DB::table('tra_surveillance_sample_details')->where('application_id', $application_id)->count();
            $process_id = $other_sample_details->process_id;
            $module_id = $other_sample_details->module_id;
            $sub_module_id = $other_sample_details->sub_module_id;
            $section_id = $other_sample_details->section_id;
            $application_status_id = $sample_application_details->application_status_id;
            $to_stage = $sample_application_details->workflow_stage_id;
            //make a sample application
            $serial_no = $serial_no + 1;

            $view_id = generateApplicationViewID();
            $sample_application_code = $application_details->application_code.'0'.$plan_id.'0'.$serial_no;
            $sample_ref = $application_details->reference_no.'/plan-'.$plan_id.'/'.$serial_no;
            $sample_tracking = $application_details->tracking_no.'/plan-'.$plan_id.'/'.$serial_no;

            $sample_app = array(
                'application_id' => $application_details->id,
                'view_id' => $view_id,
                'process_id' => $process_id,
                'application_code' => $sample_application_code,
                'reference_no' => $sample_ref,
                'tracking_no' => $sample_tracking,
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'section_id' => $section_id,
                'application_status_id' => $application_status_id,
                'applicant_id' => $application_details->applicant_id,
                'workflow_stage_id' => $to_stage,
                'pms_plan_id'=> $plan_id,
                'sampling_site_id' => $sampling_site_id
            );

            //insert to sample applications
            $res = insertRecord('tra_surveillance_sample_details', $sample_app);
            if(!isset($res['record_id'])){
                DB::rollback();
                return response()->json($res);
            }
            $sample_application_id = $res['record_id'];
            //prepare submission
            $submission_params = array(
                'application_id' => $sample_application_id,
                'view_id' => $view_id,
                'process_id' => $process_id,
                'application_code' => $sample_application_code,
                'reference_no' => $sample_ref,
                'tracking_no' => $sample_tracking,
                'usr_from' => $user_id,
                'usr_to' => $user_id,
                'previous_stage' => $to_stage,
                'current_stage' => $to_stage,
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'section_id' => $section_id,
                'application_status_id' => $application_status_id,
                'urgency' => 1,
                'applicant_id' => $application_details->applicant_id,
                'remarks' => 'Altenative Sample Addition',
                'date_received' => Carbon::now(),
                'created_on' => Carbon::now(),
                'created_by' => $user_id
            );
            //insert submission record
            DB::table('tra_submissions')->insert($submission_params);
            //log assignments
            $samples_assignment_details = array(
                'pms_plan_id' => $plan_id,
                'sampling_site_id' => $sampling_site_id,
                'user_id' => $user_id
            );
            // Insert sample
            $insert_rec = insertRecord('tra_sample_collectors_assignments', $samples_assignment_details);
            if(!isset($insert_rec['record_id'])){
                DB::rollback();
                return response()->json($insert_rec);
            }
            DB::commit();
            $res = array(
                'success' => true,
                'results' => $res,
                'message' => 'Site Added Successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveSurveillanceCommonData(Request $req)
    {
        try {
            $user_id = $this->user_id;
            $post_data = $req->all();
            $table_name = 'tra_pms_sampling_sites';
            $id = $post_data['id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['sample_application_code']);

            $table_data = $post_data;
        
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            $res = array();

            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
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
    public function getPOEInspectionApplication(Request $request)
    {
        $token = $request->bearerToken();
        $user_id = $request->user_id;

        try{
            if($token != null){
                $main_qry = DB::table('tra_importexport_applications as t1')
                ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
                ->leftJoin('tra_managerpermits_review as v', 'v.application_code', 't1.application_code')
                ->join('tra_poe_applications as t2', 't1.application_code', '=','t2.imp_application_code')
                ->select('t1.*','t2.*','t2.id as application_id','t2.id as active_application_id','t2.id as poe_application_id', 't2.port_id as poeport_id','v.permit_no','v.expiry_date as permit_expiry_date');
                // ->where('t2.id', $application_id);
            $poe_details = $main_qry->get();
                if(count($poe_details) > 0){
                    foreach($poe_details as $poe){
                        $application_id= $poe->application_id;
                        $premise_id= $poe->premise_id;
                        $sender_receiver_id= $poe->sender_receiver_id;

                        $main_details = DB::table('tra_importexport_applications as t1')
                        ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
                        ->leftJoin('tra_managerpermits_review as v', 'v.application_code', 't1.application_code')
                        ->join('tra_poe_applications as t2', 't1.application_code', '=','t2.imp_application_code')
                        ->select('t1.*','t2.*','t2.id as application_id','t2.id as active_application_id','t2.id as poe_application_id', 't2.port_id as poeport_id','v.permit_no','v.expiry_date as permit_expiry_date')
                        ->where('t2.id', $application_id);
                        $main_details =$main_details ->get();

                        $senderReceiverDetails = DB::table('tra_permitsenderreceiver_data as t3')
                            ->select('t3.id as trader_id', 't3.name as applicant_name', 't3.contact_person','t3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                                't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone',  't3.email_address as app_email')
                            ->where(array('id'=>$sender_receiver_id));
                        $senderReceiverDetails = $senderReceiverDetails->get();

                        $contact_person = DB::table('tra_poe_applications as t6')
                        ->leftJoin('wb_trader_account as t7', 't6.applicant_id', '=', 't7.id')
                        ->select('t7.*','t7.name as applicant_name')
                        ->where('t6.application_code',$application_code);
                        $main_contact_person = $contact_person->get();

                        $premisesDetails = DB::table('tra_premises as t3')
                        ->select('t3.*')
                        ->where(array('id'=>$premise_id));
                        $premisesDetails = $premisesDetails->get();

                        $productDetails = DB::table('tra_permits_products as t1')
                            ->leftJoin('tra_product_information as t3', 't1.product_id','=','t3.id')
                            ->leftJoin('tra_exemption_products as t33', 't1.product_id','=','t33.id')
                            ->leftJoin('tra_product_applications as t4', 't1.application_code', 't4.application_code')
                            ->leftJoin('par_currencies as t5', 't1.currency_id','=','t5.id')
                            ->leftJoin('par_packaging_units as t7', 't1.packaging_unit_id','=','t7.id')
                            ->leftJoin('par_prodclass_categories as t9', 't1.prodclass_category_id','=','t9.id')
                            ->leftJoin('par_sections as t10', 't1.section_id','=','t10.id')
                            ->leftJoin('par_common_names as t12', 't1.common_name_id','=','t12.id')
                            ->leftJoin('tra_poe_quantity_log as t13', 't1.id', 't13.permits_product_id')
                            ->leftJoin('tra_importexport_applications as t14', 't1.application_code', 't14.application_code')
                            ->select(DB::raw("DISTINCT ON (t1.id) t1.*, t1.permitbrand_name,t10.name as section_name, CASE WHEN t9.sub_module_id = 75 THEN t33.common_name ELSE t12.name END permitcommon_name,  t1.product_registration_no as certificate_no, t7.name as packaging_units,t7.name as product_packaging, t5.name as currency_name,t9.name as product_classcategory, (t1.unit_price*t1.quantity) as  total_value, t13.consignment_quantity, t13.consignment_packaging_unit_id, t14.importexport_permittype_id"))
                            ->where(array('t1.application_code' => $application_code));
                    $productDetails = $productDetails->get();

                        // $verification_status = getSingleRecordColValue('par_poeinspection_verificationrecommends', ['id'=>$results->permit_verificationstatus_id], 'name');

                        $poe_inspection [] = array(
                            'main_details' => $main_details,
                            'senderReceiverDetails' => $senderReceiverDetails,
                            'main_contact_person' => $main_contact_person,
                            'premisesDetails' => $premisesDetails,
                            'productDetails' => $productDetails,
                        ); 
                    }

                    $POE = $poe_inspection;
                        $res = array(
                            'success' => true,
                            'results' => $POE,
                            'message' => 'All is well'
                        );
                }else{
                    $res = array(
                        'success' => true,
                        'message' => 'No POE Inspection Application'
                    );
                    return $res;
                }   
            }else{
                $res = array(
                    'success' => false,
                    'message' => 'Access denied'
                );
            }
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
    }

    //MONITORING 
    public function getMonitoringAndComplianceDetails(Request $req){
        $user_id = $req->input('user_id');

        try {
            $monitoring_details = DB::table('tra_submissions as t1')
                ->leftJoin('wf_workflow_stages as t2', 't1.current_stage', 't2.id')
                ->leftJoin('tra_enforcement_applications as t3', 't1.application_code', '=', 't3.application_code')
                ->select('t1.*','t2.*','t2.stage_category_id','t3.enforcement_id')
                ->where(array('t1.usr_to' => $user_id,'t1.is_done' => 0,'t3.sub_module_id' => 88));

            $main_monitoring_compliance = $monitoring_details->get();
            dd($main_monitoring_compliance);

            if(count($main_facility) > 0){
                foreach($main_facility as $facility){
                    $premise_id = $facility->premise_id;
                    $workflow_stage_id= $facility->current_stage;
                    $stage_category_id= $facility->stage_category_id;

                    $facility_details = DB::table('tra_premises_applications as t1')
                    ->join('tra_premises as t2', 't1.premise_id', '=', 't2.id')
                    ->leftJoin('tra_premiseinspection_applications as t3','t1.application_code','=','t3.application_code')
                    ->join('tra_submissions as t15', 't1.application_code', '=', 't15.application_code')
                    ->join('wf_workflow_stages as t16', 't15.current_stage', '=', 't16.id')
                    ->select('t1.*','t1.premise_id','t3.inspection_id','t2.*','t15.usr_to','t15.usr_from','t16.stage_category_id')
                    ->where(array('t1.premise_id'=> $premise_id,'t15.usr_to' =>$user_id));

                    $main_details = $facility_details->get();


                    $one_facility [] = array(
                        'main_details' => $main_details,
                        'personnel' => $main_personnel,
                        'assigned_inspectors' => $assigned_inspectors,
                        'main_contact_person' => $main_contact_person,
                        'checklist_items' => $checklist_items
                    );
                }

                $premises = $one_facility;

                $res = array(
                    'success' => true,
                    'results' => $premises,
                    'message' => 'All is well'
                );


            }else{

                $res = array(
                    'success' => true,
                    'message' => 'No data'
                );
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function emmptyTraTable(Request $req){
        try{
            $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'tra_%'");
            //loop and trancate
            foreach ($tables as $table) {
                if($table->table_name != 'transforms' && $table->table_name != 'tra_menu_access_permissions' && $table->table_name != 'tra_user_group'){
                    DB::table($table->table_name)->truncate();
                }
            }
            $res = array(
                'success' => true,
                'message' => 'Trancated all tables'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    //
    }
    public function updateListingApproval(Request $req){
        try{
            $datas = DB::table("tra_product_applications")->where('sub_module_id', 79)->where('is_migrated', 1)->get();
            //loop and trancate
            $update_rec = [];
            foreach ($datas as $data) {
                $update_rec[] = array(
                    'application_code' => $data->application_code,
                    'decision_id' => 1,
                    'comment' => 'Migrated'
                );
            }
            //screening register operations
                $screening_register_collection = collect($update_rec);
                $screening_register_chunks = $screening_register_collection->chunk(50);

                foreach($screening_register_chunks as $chunk){
                    DB::table('tra_listing_approvals')->insert($chunk->toArray());
                }
            // $res = insertMultipleRecords('tra_listing_approvals', $update_rec);
            $res = array(
                'success' => true,
                'message' => 'Updated approval record'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    // tra_listing_approvals
    }
    public function manualDMSInitialiation(Request $req){
        $section_id = $req->module_id;
        $module_id = $req->module_id;
        $sub_module_id = $req->sub_module_id;
        $application_code = $req->application_code;
        $tracking_no = $req->tracking_no;
        $user_id = $req->user_id;
        initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
    }
public function getApplicationunstructuredqueries(Request $request)
    {
        $application_code = $request->input('application_code');
        $status = $request->input('status');
        if ($status != '') {
            $status = explode(',', $status);
        }
        try {
            $qry = DB::table('tra_checklistitems_queries as t1')
                ->leftJoin('par_query_statuses as t2', 't1.status', '=', 't2.id')
                ->leftJoin('tra_checklistitems_queryresponses as t3', 't1.id', '=', 't3.query_id')
                ->leftJoin('par_application_sections as t4', 't1.application_section_id', '=', 't4.id')
                ->select(DB::raw("t11.name as reference_details,t1.*,t1.created_on as queried_on, t2.name as query_status, t3.response as last_response,t4.application_section,t6.id as query_type_id, t6.name as query_type,t7.name as query_category,t5.name as queried_item, t8.email as queried_by, t10.query_ref as query_reference_no,t6.sub_module_id,t6.module_id,t6.section_id,t1.application_code, t12.response as query_response"))
                ->leftJoin('par_checklist_items as t5', 't1.checklist_item_id', '=', 't5.id')
                ->leftJoin('par_checklist_types as t6', 't5.checklist_type_id', '=', 't6.id')
                ->leftJoin('par_checklist_categories as t7', 't6.checklist_category_id', '=', 't7.id')
                ->leftJoin('users as t8', 't1.created_by', '=', 't8.id')
                ->leftJoin('tra_queries_referencing as t9', 't1.id', '=', 't9.id')
                ->leftJoin('tra_application_query_reftracker as t10', 't9.query_ref_id', '=', 't10.id')
                ->leftJoin('par_query_guidelines_references as t11', 't1.reference_id', '=', 't11.id')
                ->leftJoin('tra_checklistitems_queryresponses as t12', 't1.id', '=', 't12.query_id')
                ->where('t1.application_code', $application_code);
                
           // $qry->where(array('is_query' => 1));
            if (is_array($status) && count($status) > 0) {
                $qry->whereIn('status', $status);
            }
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
        return response()->json($res);
    }
    public function checkPrecheckingrecommendation(Request $req){
        try {
                $application_code = $req->application_code;
                $record = DB::table('tra_prechecking_recommendations')->where('application_code',$application_code)->first();
                if($record){
                    $res = array('success'=>true, 'message'=>'Prechecking Recommendation has been filled successfully');
                }
                else{
                    $res = array('success'=>false, 'message'=>'Prechecking Recommendation not filled successfully');
                }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function syncTcMeetingGroupParticipants(Request $request)
    {
        $meeting_id = $request->input('meeting_id');
        $group_id = $request->input('group_id');
        $data = array();
      
        try {
         $qry = DB::table('par_meeting_groups as t1')
                ->select('t1.*')
                ->where('t1.id',$group_id);
                     $results = $qry->first(); 
                        $participant_id = json_decode($results->participant_id);
                       //dd($participant_id);
                        foreach($participant_id as $user){
                            $new_qry = DB::table('users as t1')
                                    ->select(DB::raw("t1.email,t1.id as user_id,CONCAT_WS(' ',decryptval(t1.first_name,".getDecryptFunParams()."),decryptval(t1.last_name,".getDecryptFunParams().")) as participant_name,decryptval(t1.phone,".getDecryptFunParams().") as phone"))
                                    ->where('t1.id',$user);
                                    
                            $new_res = $new_qry->get(); 
                           foreach ($new_res as $data) {
                            $params = array(
                                'meeting_id' => $meeting_id,
                                'user_id' => $data->user_id,
                                'participant_name' => $data->participant_name,
                                'phone' => $data->phone,
                                'email' => $data->email,
                                'created_by' => $this->user_id
                            );
                            $res=insertMultipleRecords('tc_meeting_participants', $params); 
                          
                           } 
                      
                        }
        
            $res = array(
                'success' => true,
                'message' => 'Participants saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function cleanDitrictsDuplicates (Request $req){
        DB::beginTransaction();
        try {
            $districts = DB::table('par_districts as t1')->select(DB::raw("DISTINCT ON (t1.id) t1.id, t1.name, t1.region_id, t1.country_id, t1.latitude, t1.longitude"))->get();
            $data = convertStdClassObjToArray($districts);

            DB::table('par_districts')->truncate();
            //empty sequence
            $statement = "ALTER SEQUENCE par_districts_seq RESTART WITH 1";
            DB::unprepared($statement);
            //insert
            $data = collect($data);
            $data_chunk = $data->chunk(10000);

            foreach($data_chunk as $chunk){
                DB::table('par_districts')->insert($chunk->toArray());
            }
            $res = array(
                'success' => true,
                'message' => 'Participants saved successfully!!'
            );
            DB::commit();
        } catch (\Exception $exception) {
             dd($exception->getMessage());
          

        } catch (\Throwable $throwable) {
            dd($throwable->getMessage());
        }
        return \response()->json($res);
    }
    public function autoGenerateChecklistBasedQueries(Request $req){
        $application_code = $req->application_code;
        $workflow_stage_id = $req->workflow_stage_id;
        $module_id = $req->module_id;
        $section_id = $req->section_id;
        $application_id = $req->application_id;
        $sub_module_id = $req->sub_module_id;
        $process_id = $req->process_id;
        $user_id = $this->user_id;
        try{
            //get failed checklist items
            $queries = DB::table('tra_checklistitems_responses as t1')
                    ->leftJoin('par_checklist_items as t3', 't1.checklist_item_id', '=', 't3.id')
                    ->where('t1.application_code', $application_code)
                    ->where('t1.pass_status', DB::raw(2))
                    ->select('t3.name as query', 't1.*')
                    ->get();

            
             //get query type from stage
            $checklist_category_id = getStageQueryChecklistCategory($workflow_stage_id);
            // if (!validateIsNumeric($checklist_category_id)) {
            //     return \response()->json(array('success' => false, 'message' => 'No checklist category Found'));
            // }
            //save new query
            $module_table = getTableName($module_id);
            if($sub_module_id == 50){
                $module_table = 'tra_premiseinspection_applications';
            }
            $app_details = getSingleRecord($module_table, ['application_code' => $application_code]);
            $count = DB::table('tra_application_query_reftracker')->where('application_code', $application_code)->count();
            $query_data = [];
            foreach ($queries as $query) {
                $query_ref = $app_details->tracking_no.'/Q'.$count+1;
                $query_data[] = array(
                    'module_id' => $module_id,
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id,
                    'application_code' => $application_code,
                    'query_remark' => '',
                    'query_txt' => $query->comment,
                    'is_structured' => 1,
                    'queried_on' => Carbon::now(),
                    'queried_by' => $user_id,
                    'query_type_id' => $query->risk_type,
                    'process_id' => $process_id,
                    'query_processstage_id' => 2,
                    'query_ref' => $query_ref,
                    'checklist_category_id' => $checklist_category_id,
                    'checklist_item_id' => $query->id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'queryref_status_id' => 1
                );
                $count++;
                deleteRecord('tra_application_query_reftracker', ['query_txt'=>$query->comment,'application_code' => $application_code,'workflow_stage_id' => $workflow_stage_id]);
            }
             $res = insertMultipleRecords('tra_application_query_reftracker', $query_data);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getCSRFToken(Request $req){
        return  csrf_token();
    }
    public function printMobileLog(Request $req){
        $data = $req->all();
        DB::table('par_mobile_logs')->insert(['log'=>$data, 'created_on'=> Carbon::now()]);
    }
}
