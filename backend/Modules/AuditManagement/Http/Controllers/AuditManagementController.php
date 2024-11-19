<?php

namespace Modules\AuditManagement\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use PhpParser\Node\Stmt\TryCatch;
use Psy\Readline\Hoa\Console;
use Response;


class AuditManagementController extends Controller
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

                
                $method = $request->route()->getActionMethod();

                $this->user_id = \Auth::user()->id;
                $module_id = $request->input('module_id');
                $sub_module_id = $request->input('sub_module_id');
                $application_code = $request->input('application_code');
                $process_id = $request->input('process_id');
                $application_status_id = $request->input('application_status_id');
                $id = $request->input('id');
                $table = $request->input('table_name');
                $audit_type_id = $request->input('audit_type_id');                        
                $curr_stage_id = $request->input('curr_stage_id');
                $current_stage_name = $request->input('current_stage_name');
                $application_status = $request->input('application_status');
                $responsible_user = $request->input('responsible_user');
                $code = $request->input('code');
                $name = $request->input('name');
                $prefix = $request->input('prefix');
                $is_enabled = $request->input('is_enabled');
                $method = $request->route()->getActionMethod();
                // $post_data = $request->post();

                $action = '';
               
                switch ($method) {
                    case 'saveAuditType':
                        
                        if($id){
                            $action = "updated audit type";
                        } else {
                            $action = "created audit type";
                        }
                        
                        break;
                    case 'saveNewAuditPlanDetails':
                        if ($id){
                            $action = 'updated audit plan details';
                        } else {
                            $action = 'created new audit plan details';
                        }
                        break;
                    case 'deleteConfigRecord':
                        $action = "deleted record";
                        break;
                    case 'saveAuditFinding':
                        if ($id){
                            $action = 'updated audit finding';
                        } else {
                            $action = 'created new audit finding';
                        }
                        break;
                    default:
                        break;
                }

                $table_data = null;
                switch ($table) {
                    case "par_finding_types":
                        $table_name = "audit_finding_types_logs";
                        break;
                    case "par_qms_audit_types":
                        $table_name = "par_qms_audit_type_logs";
                        $table_data = array(
                            'user_id' => $this->user_id,
                            //'application_code' => $application_code,
                            'action' => $action,
                            'created_on' => Carbon::now(),
                            'ref_id' => $id,
                            //'ref_id' => $record_id,
                            'code' => $code,
                            'name' => $name,
                            'prefix' => $prefix,
                            'is_enabled' => $is_enabled,
                            'submitted_by' => $this->user_id,
                        );
                        break;
                    case "tra_auditsmanager_application":
                        $table_name = "eqms_audit_management_logs";
                        $table_data = array(
                            'user_id' => $this->user_id,
                            'application_code' => $application_code,
                            'action' => $action,
                            'created_on' => Carbon::now(),
                            'ref_id' => $id,
                            'module_id' => $module_id,
                            'sub_module_id' => $sub_module_id,
                            'process_id' => $process_id,
                            'audit_type_id' => $audit_type_id,
                            'current_stage_name' => $current_stage_name,
                            'application_status' => $application_status,
                            'curr_stage_id' => $curr_stage_id,
                            'application_status_id' => $application_status_id,
                            'responsible_user' => $responsible_user,
                            'submitted_by' => $this->user_id,
                        );
                    default:
                        break;
                }

                if ($table_data) {
                    DB::table($table_name)->insert($table_data);
                }
                
                return $next($request);
            });
        }
  
    }


    // private function ActionLog($method, $request, $res)
    // {
    //     $user_id = \Auth::user()->id;
    //     $module_id = $request->input('module_id');
    //     $sub_module_id = $request->input('sub_module_id');
    //     $application_code = $request->input('application_code');
    //     $process_id = $request->input('process_id');
    //     $workflow_stage_id = $request->input('workflow_stage_id');
    //     $active_application_id = $request->input('active_application_id'); 
    //     $application_status_id = $request->input('application_status_id');
    //     //$id = $request->input('id');
    //     $table = $request->input('table_name');
    //     $audit_title = $request->input('audit_title');
    //     $audit_type_name = $request->input('audit_type_name');
    //     $audit_type_id = $request->input('audit_type_id');
    //     $audit_summary = $request->input('audit_summary');
    //     $is_full_day = $request->input('is_full_day');
    //     $audit_start_date = $request->input('audit_start_date');
    //     $audit_end_date = $request->input('audit_end_date');
    //     $start_time = $request->input('start_time');
    //     $end_time = $request->input('end_time');
    //     $curr_stage_id = $request->input('curr_stage_id');
    //     $current_stage_name = $request->input('current_stage_name');
    //     $application_status = $request->input('application_status');
    //     $responsible_user = $request->input('responsible_user');
    //     $code = $request->input('code');
    //     $name = $request->input('name');
    //     $prefix = $request->input('prefix');
    //     $is_enabled = $request->input('is_enabled');
    //     $id = $res['record_id'];

    //     // Determine action based on method
    //     $action = '';
    //     switch ($method) {
    //         case 'saveAuditType':
    //             $action = 'saved audit type';
    //             break;
    //         case 'saveNewAuditPlanDetails':
    //             $action = $id ? 'updated audit plan details' : 'created new audit plan details';
    //             break;
    //         case 'deleteConfigRecord':
    //             $action = "deleted configurations record";
    //             break;
    //         case 'saveAuditFinding':
    //             $action = $id ? 'updated audit finding' : 'created new audit finding';
    //             break;
    //         default:
    //             break;
    //     }

    //     // Determine table and prepare log data
    //     $table_data = null;
    //     switch ($table) {
    //         case "par_finding_types":
    //             $table_name = "audit_finding_types_logs";
    //             break;
    //         case "par_qms_audit_types":
    //             $table_name = "par_qms_audit_type_logs";
    //             $table_data = [
    //                 'user_id' => $user_id,
    //                 'action' => $action,
    //                 'created_on' => now(),
    //                 'ref_id' => $id,
    //                 'code' => $code,
    //                 'name' => $name,
    //                 'prefix' => $prefix,
    //                 'is_enabled' => $is_enabled,
    //                 'submitted_by' => $user_id,
    //             ];
    //             break;
    //         case "tra_auditsmanager_application":
    //             $table_name = "eqms_audit_management_logs";
    //             $table_data = [
    //                 'user_id' => $user_id,
    //                 'application_code' => $application_code,
    //                 'action' => $action,
    //                 'created_on' => now(),
    //                 'ref_id' => $id,
    //                 'module_id' => $module_id,
    //                 'sub_module_id' => $sub_module_id,
    //                 'process_id' => $process_id,
    //                 'audit_type_id' => $audit_type_id,
    //                 'current_stage_name' => $current_stage_name,
    //                 'application_status' => $application_status,
    //                 'curr_stage_id' => $curr_stage_id,
    //                 'application_status_id' => $application_status_id,
    //                 'responsible_user' => $responsible_user,
    //                 'submitted_by' => $user_id,
    //             ];
    //             break;
    //         default:
    //             break;
    //     }

    //     // Insert log if table_data is set
    //     if ($table_data) {
    //         DB::table($table_name)->insert($table_data);
    //     }
    // }



    public function saveAuditType(Request $req) {

        
        
          try {
             DB::beginTransaction();
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];

            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);

            $table_data = $post_data;
            //dd($table_data);
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;


            $where = array(
                'id' => $id
            );

            //$table_data = $this->uploadDocumentRequirementTemplate($req,$table_data);

            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {

                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data);
                    
                    if($res['success'] == false) {

                    DB::rollBack();
                    $res = array(   
                        'success' => false,
                        'message' => 'Details Not Updated',
                        'error' => $res['message']
                    );
                }
                else {
                    DB::commit();
                    $res = array(
                        'success' => true,
                        'message' => 'Details SuccessFully Updated',
                        'record_id' => $res['record_id']
                    );
                }
                }
            } else {
                $table_data['dola'] = Carbon::now();
                $res = insertRecord($table_name, $table_data);

                if($res['success'] == false) {

                    DB::rollBack();
                    $res = array(   
                        'success' => false,
                        'message' => 'Details Not Updated',
                        'error' => $res['message']
                    );
                }
                else {
                    DB::commit();
                    $res = array(
                        'success' => true,
                        'message' => 'Details SuccessFully Updated',
                        'record_id' => $res['record_id']
                    );
                }

            }
            //save the documetn extension types
            //$this-> ActionLog('saveAuditType', $req, $res);
         

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        
        return response()->json($res);

    }

    public function getAuditTypes(Request $req) {

        try{
           
            $audit_types_data = DB::table('par_qms_audit_types as t1')
            ->select('t1.*','t1.name as audit_type_name', 't1.id as audit_type_id', 't1.code')->get();
            
            $res = array(
                'success' => true,
                'results' => $audit_types_data,
            );

        }
        catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }


    public function getAuditTypeLogs(Request $request) {
        
        try {
            $ref_id = $request->input('ref_id');
            $name = $request->input('name');
        
            if ($ref_id) {

                //log entries
                $logs = DB::table('par_qms_audit_type_logs as logs')
                ->join('users as user', 'logs.user_id', '=', 'user.id') 
                ->select(
                    'user.email as user_id', 'logs.action', 'logs.created_on',
                    'user.email as submitted_by','user.email as responsible_user', 'logs.ref_id', 'logs.code', 'logs.name', 'logs.prefix', 'logs.is_enabled'
                )
                ->where('logs.ref_id', '=', $ref_id)
                ->orderBy('created_on', 'desc') // order by created_on
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


    // finding type logs
    public function getFindingTypeLogs(Request $request){
        try {
            $ref_id = $request->input('ref_id');
           
            if ($ref_id) {

                //log entries
                $logs = DB::table('par_finding_types_logs as logs')
                ->join('users as user', 'logs.user_id', '=', 'user.id') 
                ->select(
                    'user.email as user_id','logs.ref_id', 'logs.name', 'logs.action', 'logs.created_on',
                    'user.email as submitted_by', 'user.email as responsible_user', 'logs.is_enabled'
                )
                ->where('logs.ref_id', '=', $ref_id)
                ->orderBy('created_on', 'desc') // order by created_on
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


    //fetch audit logs
    public function getAuditLogs(Request $request) {
        
        try {
            $application_code = $request->input('application_code');
           //check if application code is present
            if ($application_code) {

                //log entries
                $audit_logs = DB::table('eqms_audit_management_logs as logs')
                ->join('users as user', 'logs.user_id', '=', 'user.id')

                ->select(
                    'user.email as user_id','logs.application_code', 'logs.action', 'logs.created_on','logs.module_id',
                    'logs.sub_module_id','logs.process_id','logs.audit_type_id','user.email as  submitted_by','logs.current_stage_name',
                    'logs.application_status','logs.curr_stage_id','logs.application_status_id','user.email as responsible_user'
                )
                ->where('logs.application_code', '=', $application_code)
                
                // ->unionAll(
                //     DB::table('eqms_workflow_management_logs as workflow')
                //     ->join('users as user','workflow.user_id','=', 'user.id')
                //         ->select(
                //             'user.email as user_id', 'workflow.application_code', 'workflow.action', 'workflow.created_on',
                //             'workflow.module_id','workflow.sub_module_id','workflow.process_id','workflow.audit_type_id',
                //             'user.email as submitted_by','workflow.current_stage_name','workflow.application_status',
                //             'workflow.curr_stage_id','workflow.application_status_id','user.email as responsible_user'
                //         )
                //         ->where('workflow.application_code', '=', $application_code)
                
                //)
                ->orderBy('created_on', 'desc') // order by created_on
                ->get();
            } else {
               
                $audit_logs = collect([]);
            }
    
            $res = [
                'success' => true,
                'results' => $audit_logs,
            ];
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
    
        return response()->json($res);
    }
    
    
   
    public function getAuditTypeMetadata(Request $req) {
        $audit_type_id = $req->audit_type_id;
        try{
            $audit_type_meta_data = DB::table('par_audit_custom_form_fields as t1')->get();

            $res = array(
                'success' => true,
                'results' => $audit_type_meta_data);
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveAuditTypeMetaData(Request $req) {
        $user_id = \Auth::user()->id;
        $record_id = $req->id;
        $table_name = 'par_audit_custom_form_fields';
        $data = array (

            'audit_type_id' => $req->audit_type_id,
            'field_name' => $req->field_name,
            'label' => $req->label,
            'form_field_type_id' => $req->form_field_type_id
        );
        try{
            DB::beginTransaction();

            if(validateIsNumeric($record_id)) {
                $where_clause  = array('id' => $record_id);
                $resp = updateRecord($table_name,$where_clause,$data,$user_id);

                if($resp['success'] == false) {

                    DB::rollBack();
                    $res = array(   
                        'success' => false,
                        'message' => 'Details Not Updated',
                        'error' => $resp['message']
                    );
                }
                else {
                    DB::commit();
                    $res = array(
                        'success' => true,
                        'message' => 'Details SuccessFully Updated',
                        'record_id' => $record_id
                    );
                }
            }
            else {
                $resp = insertRecord($table_name,$data,$user_id);

                if($resp['success'] == false) {

                    DB::rollBack();
                    $res = array(   
                        'success' => false,
                        'message' => 'Details Not Saved',
                        'error' => $resp['message']
                    );
                }
                else {
                    DB::commit();
                    $res = array(
                        'success' => true,
                        'message' => 'Details SuccessFully Saved',
                        'record_id' => $record_id
                    );
                }
            }
        }
        catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

     public function getAuditFindings(Request $req) {
        
         $application_code = $req->input('application_code');
        try{
           
            $audit_types_data = DB::table('par_audit_findings as t1')
                                ->leftJoin('par_finding_types as t2', 't1.finding_type_id', '=', 't2.id')
                                ->leftJoin('tra_issue_management_applications as t3', 't1.issue_id', '=', 't3.id')
                                ->leftJoin('par_issue_statuses as t4', 't3.issue_status_id', '=', 't4.id')
                                ->leftJoin('par_checklist_items as t5', 't1.checklist_item_id', '=', 't5.id')
                                ->select('t1.*', 't1.finding_title', 't1.id as finding_id', 't2.name as finding_type', 't3.title', 't3.created_on as raised_date', 't3.complainant_name', 't4.title as issue_status', 't5.name as checklist_item')
                                ->where('t1.application_code', $application_code)
                                ->get();
            
            $res = array(
                'success' => true,
                'results' => $audit_types_data,
            );

        }
        catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function saveNewAuditPlanDetails(Request $request)
    {

        try {
            $application_code = $request->input('application_code');
            $process_id = $request->input('process_id');
            $workflow_stage_id = $request->input('workflow_stage_id');
            $application_status_id = $request->input('application_status_id');
            $zone_id = $request->input('zone_id');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            $applications_table = $request->input('table_name');
            
            $user_id = $this->user_id;

            $app_data = array(
                "process_id" => $request->input('process_id'),
                "workflow_stage_id" => $request->input('workflow_stage_id'),
                "applicant_id" => $user_id,
                "sub_module_id" => $sub_module_id,
                "module_id" => $module_id,
                "application_status_id" => $request->input('application_status_id'),
                "audit_reference" => $request->input('audit_reference'),
                "audit_title" => $request->input('audit_title'),
                "audit_type_id" => $request->input('audit_type_id'),
                "audit_summary" => $request->input('audit_summary'),
                "is_full_day" => $request->input('is_full_day'),
                "audit_start_date" => $request->input('audit_start_date'),
                "audit_end_date" => $request->input('audit_end_date'),
                "start_time" => $request->input('start_time'),
                "end_time" => $request->input('end_time'),
               

            );
            if (validateIsNumeric($application_code)) {
                //update
                $app_data['dola'] = Carbon::now();
                $app_data['altered_by'] = $user_id;
                $app_details = array();
                $where_app['application_code'] = $application_code;



                if (recordExists($applications_table, $where_app)) {

                    $apps_tableData = getTableData($applications_table, $where_app);
                  
                    $app_details = getPreviousRecords($applications_table, $where_app);
                   
 
                    if ($app_details['success'] == false) {
                        return $app_details;
                    }
                    $app_details = $app_details['results'];

                    $res =  updateRecord($applications_table, $where_app,  $app_data, $user_id);
                    
                }
                   $res['application_code'] = $app_details[0]['application_code'];
                   $res['tracking_no'] = $app_details[0]['tracking_no'];
                   $ref_number = $app_details[0]['reference_no']; //$app_details->reference_no; 
            } else {
                $zone_code = getSingleRecordColValue('par_zones', array('id' => $zone_id), 'zone_code');
                $apptype_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
                // $apptype_categorycode = getSingleRecordColValue('par_permit_typecategories', array('id' => $import_typecategory_id ), 'code');


                $codes_array = array(
                    // 'section_code' => $section_code,
                    'zone_code' => $zone_code,
                    'apptype_code' => $apptype_code
                );


                $application_code = generateApplicationCode($sub_module_id, $applications_table);

                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id');


                $ref_number = generateProductsRefNumber($ref_id, $codes_array, date('Y'), $process_id, $zone_id, $user_id);

                $view_id = generateApplicationViewID();
                //  'view_id'=>$view_id,
                $app_data['view_id'] = $view_id;
                $app_data['reference_no'] = $ref_number;
                $app_data['tracking_no'] = $ref_number;
                $app_data['application_code'] = $application_code;
                $app_data['reg_serial'] = $application_code;
                $app_data['application_status_id'] = $application_status->status_id;
                $app_data['created_by'] = \Auth::user()->id;
                $app_data['created_on'] = Carbon::now();

                $res = insertRecord($applications_table, $app_data, $user_id);

                $active_application_id = $res['record_id'];

                //add to submissions table
                $submission_params = array(
                    'application_id' => $active_application_id,
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
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );

                $res = insertRecord('tra_submissions', $submission_params, $user_id);


                $res['active_application_id'] = $active_application_id;
                $res['application_code'] = $application_code;

                $res['ref_no'] = $ref_number;
                $res['tracking_no'] = $ref_number;
                //dms function 
                $nodetracking = str_replace("/", "-", $ref_number);

                $node_details = array(
                    'name' => $nodetracking,
                    'nodeType' => 'cm:folder'
                );


                if ($res['success']) {
                 initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
                

                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'error, contact system admin'
                    );
                }
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

    public function getAuditManagementDetails(Request $req)
    {
     
        try {
         $results = DB::table('tra_auditsmanager_application as t1')
        ->leftJoin('wf_workflow_stages as t2', 't1.workflow_stage_id', '=', 't2.id')
        ->leftJoin('par_qms_audit_types as t3', 't1.audit_type_id', '=', 't3.id')
        ->leftJoin('users as t4', 't3.owner_user_id', '=', 't4.id')
        ->leftJoin('par_groups as t5', 't3.owner_group_id', '=', 't5.id')
        ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
        ->leftJoin('par_audit_findings as t7', 't1.application_code', '=', 't7.application_code')
       
        ->select(
            DB::raw("decrypt(t4.first_name) as first_name,decrypt(t4.last_name) as last_name"),
            't1.*',
            't2.name as workflow_stage',
            't3.name as audit_type_name',
            't5.name AS group_owner',
            't6.name as application_status',
             DB::raw("IFNULL(COUNT(t7.id), 0) as findings")

        )->groupBy('t1.id')->get();

            $results = convertStdClassObjToArray($results);
            $res = decryptArray($results);

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', _CLASS_), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', _CLASS_), \Auth::user()->id);
        }
        return $res;
    }

    
    public function prepapreAuditApplicationReceiving(Request $req)
    {
        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        // //call log function in prepare audit receiving
        // $this->getAuditLogs($application_code);
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_auditsmanager_application as t1')
            ->leftJoin('wf_workflow_stages as t2', 't1.workflow_stage_id', '=', 't2.id')
            ->leftJoin('par_qms_audit_types as t3', 't1.audit_type_id', '=', 't3.id')
            ->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
            ->leftJoin('wf_processes as t5', 't1.process_id', '=', 't5.id')
            ->select( 
            
                't1.*',
                't2.name as workflow_stage',
                't3.name as audit_type_name',
                't4.name as application_status',
                't5.name as process_name',

            )
            ->where('t1.application_code', $application_code);

            $results = $main_qry->first();


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

    public function saveAuditFinding(Request $req) {
          try {
             //DB::beginTransaction();
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];

            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);

            //$table_data = $post_data;
            //dd($table_data);
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            
            $table_data = array(
                "application_code" => $post_data['application_code'],
                "finding_type_id" => $post_data['finding_type_id'],
                "finding_title" => $post_data['finding_title'],
                "description" => $post_data['description'],
                "results" => $post_data['results'],
                "issue_id"=> $post_data['issue_id'],
                "checklist_item_id" => $post_data['checklist_item_id'],

            );

            $where = array(
                'id' => $id
            );
            //$table_data = $this->uploadDocumentRequirementTemplate($req,$table_data);

           // if (isset($id) && $id != "") {

                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data);
                    if($res['success'] == false) {

                    DB::rollBack();
                    $res = array(   
                        'success' => false,
                        'message' => 'Details Not Updated',
                        'error' => $res['message']
                    );
                }
                else {
                    DB::commit();
                    $res = array(
                        'success' => true,
                        'message' => 'Details SuccessFully Updated',
                        'record_id' => $res['record_id']
                    );
                }
                }
           // }
             else {
                $table_data['dola'] = Carbon::now();
                $res = insertRecord($table_name, $table_data);



                if($res['success'] == false) {

                    DB::rollBack();
                    $res = array(   
                        'success' => false,
                        'message' => 'Details Not Updated',
                        'error' => $res['message']
                    );
                }
                else {
                    DB::commit();
                    $res = array(
                        'success' => true,
                        'message' => 'Details SuccessFully Updated',
                        'record_id' => $res['record_id']
                    );
                }

            }
            //save the documetn extension types
         

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    
   
}
