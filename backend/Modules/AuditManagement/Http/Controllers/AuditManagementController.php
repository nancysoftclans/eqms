<?php

namespace Modules\AuditManagement\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;


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
        $user_id = \Auth::user()->id;
        try{
            $record_id = $req->id;
            $audit_type_data = array(
                'audit_type_code' => $req->audit_type_code,
                'audit_title' => $req->audit_title,
                'audit_prefix_id' => $req->audit_prefix_id,
            );
            $con = DB::connection();

            $table_name = 'qms_audit_types';
            $con->beginTransaction();
            if(validateIsNumeric($record_id)) {
                $previous_data = getPreviousRecords($table_name,['id'=>$record_id]);
                // dd($previous_data);
                $where_clause = array('id' => $record_id);
                $resp = updateRecord($table_name,$where_clause,$audit_type_data,$user_id);
                
                if($resp['success']) {
                    $res = array
                    (
                        'success' => true,
                        'message' => 'record successfully updated',
                        'record_id' => $record_id,
                    );
                    $con->commit();
                }
                else{

                    $res = array(
                        'success' => false,
                        'message' => 'record not updated',
                        'error' => $resp['error']
                    );
                    $con->rollBack();
                }

            }
            else {
                
                $resp = insertRecord($table_name,$audit_type_data,$user_id);
                if($resp['success']) {
                   
                    $record_id = $resp['record_id'];
                    $res = array
                    (
                        'success' => true,
                        'message' => 'record successfully updated',
                        'record_id' => $record_id,
                    );
                    $con->commit();
                }
                else{

                    $res = array(
                        'success' => false,
                        'message' => 'record not updated',
                        'error' => $resp['error']
                    );
                    $con->rollBack();
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

    public function getAuditTypes(Request $req) {
         
        try{
           
            $audit_types_data = DB::table('qms_audit_types as t1')
            ->leftJoin('par_audit_types as t2','t1.audit_prefix_id','t2.id')
            ->select(DB::raw('t1.*,t2.name as audit_prefix_type'))
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
}
