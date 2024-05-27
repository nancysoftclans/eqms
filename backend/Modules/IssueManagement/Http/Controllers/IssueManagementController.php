<?php

namespace Modules\IssueManagement\Http\Controllers;

use App\Models\WfProcess;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\IssueManagement\Entities\IssueManagement;

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
                return $next($request);
            });
        }
    }


    public function saveNewReceivingBaseDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $process_id = $request->input('process_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $user_id = $this->user_id;
        $view_id = generateApplicationViewID();
        $zone_id = $request->input('zone_id');

        DB::beginTransaction();
        try {
            $applications_table = 'tra_issue_management_applications';
            $apptype_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
            $zone_code = getSingleRecordColValue('par_zones', array('id' => $zone_id), 'zone_code');
            $apptype_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
            $application_code = generateApplicationCode($sub_module_id, $applications_table);
            $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id');

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
                'created_by' => $user_id
            );
            $res = insertRecord('tra_submissions', $submission_params);

            $data = $request->all();

            $issue_data = array(
                'submission_id' => $res['record_id'],
                'issue_type_id' => $data['issue_type_id'],
                'title' => $data['title'],
                'description' => $data['description'],
                'target_resolution_date' => $data['target_resolution_date'],
                // 'follow_up_on' => $data['follow_up_on'],
                'section_ids' => $data['section_ids'],
                'issue_status_id' => $data['issue_status_id'],
                'complainant_address' => $data['complainant_address'],
                'complainant_name' => $data['complainant_name'],
                'complainant_telephone' => $data['complainant_telephone'],
                'complaint_mode_id' => $data['complaint_mode_id'],
                'complaint_type_id' => $data['complaint_type_id'],
                'created_on' => Carbon::now(),
                'dola' => Carbon::now(),
                'created_by' => $user_id,
                'altered_by' => $user_id,
            );

            $IssueManagement = IssueManagement::updateOrInsert(['submission_id' => $issue_data['submission_id']], $issue_data);
            if ($IssueManagement) {
                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "record_id" => $res['record_id']
                );
            }

            DB::commit();
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
        return \response()->json($res);
    }


    public function getIssueManagementDetails(Request $request)
    {
        try {
            $results = IssueManagement::from('tra_issue_management_applications as t1')
                ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                ->leftjoin('wf_processes as t4', 't2.process_id', '=', 't4.id')
                ->join('par_issue_statuses as t5', 't1.issue_status_id', 't5.id')
                ->join('users as t6', 't1.created_by', 't6.id')
                ->select(
                    't2.*',
                    't1.*',
                    't3.name as workflow_stage',
                    't4.name as process_name',
                    't1.created_on as raised_date',
                    't5.name as issue_status',
                    't1.id as active_application_id',
                    't2.current_stage as workflow_stage_id',
                    DB::raw("CONCAT_WS(' ',decrypt(t6.first_name),decrypt(t6.last_name)) as owner")
                )
                ->get();
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

    public function getIssueManagementDetailsById(Request $request)
    {
        $active_application_id = $request->active_application_id;
        try {
            $results = IssueManagement::from('tra_issue_management_applications as t1')
                ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                ->leftJoin('wf_workflow_stages as t3', 't2.current_stage', '=', 't3.id')
                ->leftjoin('wf_processes as t4', 't2.process_id', '=', 't4.id')
                ->join('par_issue_statuses as t5', 't1.issue_status_id', 't5.id')
                ->join('users as t6', 't1.created_by', 't6.id')
                ->select(
                    't2.*',
                    't1.*',
                    't3.name as workflow_stage',
                    't4.name as process_name',
                    't1.created_on as raised_date',
                    't5.name as issue_status',
                    't1.id as active_application_id',
                    't2.current_stage as workflow_stage_id',
                    DB::raw("CONCAT_WS(' ',decrypt(t6.first_name),decrypt(t6.last_name)) as owner")
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
}
