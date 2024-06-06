<?php

namespace Modules\AuditManagement\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;


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
                $this->user_id = \Auth::user()->id;
                return $next($request);
            });
        }
    }

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
         

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function getAuditTypes(Request $req) {
         
        try{
           
            $audit_types_data = DB::table('par_qms_audit_types as t1')->get();
            
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
}
