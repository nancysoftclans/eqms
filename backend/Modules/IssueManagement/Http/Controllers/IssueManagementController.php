<?php

namespace Modules\IssueManagement\Http\Controllers;

use App\Models\WfProcess;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\IssueManagement\Entities\IssueStatus;
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
        $application_code = $request->input('application_code');
        $active_application_id = $request->input('active_application_id');
        $user_id = $this->user_id;
        $view_id = generateApplicationViewID();
        $zone_id = $request->input('zone_id');
        $dateString = $request->target_resolution_date;
        $date = Carbon::createFromFormat('d M Y', $dateString);

        try {
            if (validateIsNumeric($active_application_id)) {
                //Update
                $IssueManagement = IssueManagement::findOrFail($active_application_id);
                $IssueManagement->fill([
                    'title'                 => $request->title,
                    'issue_type_id'         => $request->issue_type_id,
                    'description'           => $request->description,
                    'target_resolution_date' => $date->format('Y-m-d'),
                    'section_ids'            => $request->section_ids,
                    'issue_status_id'       => $request->issue_status_id,
                    'complainant_name'       => $request->complainant_name,
                    'complainant_address'   => $request->complainant_address,
                    'organisation_name'    => $request->organisation_name,
                    'complainant_telephone' => $request->complainant_telephone,
                    'complaint_mode_id'     => $request->complaint_mode_id,
                    'complaint_type_id'     => $request->complaint_type_id,
                    'workflow_stage_id'     => $request->workflow_stage_id,
                    'dola'                   => Carbon::now(),
                    'altered_by'             => $user_id,
                    'application_code' => $application_code
                ]);
                $IssueManagement->save();
                //End Update

                $IssueManagement = IssueManagement::from('tra_issue_management_applications as t1')
                    ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                    ->where('t1.id', $active_application_id)->select('t1.*', 't2.*', 't1.id as active_application_id')->first();
                if ($IssueManagement) {
                    $res = array(
                        "success" => true,
                        "message" => 'Data Updated Successfully!!',
                        "results" => $IssueManagement
                    );
                    $ref_number = $IssueManagement->reference_no;
                    initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
                }
            } else {
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
                    'created_by' => $user_id
                );
                $res = insertRecord('tra_submissions', $submission_params);

                $data = $request->all();
                $issue_data = array(
                    'submission_id' => $res['record_id'],
                    'issue_type_id' => $data['issue_type_id'],
                    'title' => $data['title'],
                    'description' => $data['description'],
                    'target_resolution_date' => $date->format('Y-m-d'),
                    'section_ids' => $data['section_ids'],
                    'issue_status_id' => $data['issue_status_id'],
                    'complainant_address' => $data['complainant_address'],
                    'complainant_name' => $data['complainant_name'],
                    'organisation_name' => $data['organisation_name'],
                    'complainant_telephone' => $data['complainant_telephone'],
                    'complaint_mode_id' => $data['complaint_mode_id'],
                    'complaint_type_id' => $data['complaint_type_id'],
                    'created_on' => Carbon::now(),
                    'dola' => Carbon::now(),
                    'created_by' => $user_id,
                    'altered_by' => $user_id,
                    'application_code' => $application_code,
                    'workflow_stage_id' => $data['workflow_stage_id'],
                    'application_status_id' => $application_status->status_id,
                );


                $IssueManagement = new IssueManagement();
                $IssueManagement->create($issue_data);
                if ($IssueManagement) {
                    $IssueManagement = IssueManagement::from('tra_issue_management_applications as t1')
                        ->join('tra_submissions as t2', 't1.submission_id', 't2.id')
                        ->where('t1.submission_id', $res['record_id'])->select('t1.*', 't2.*', 't1.id as active_application_id')->first();

                    $res = array(
                        "success" => true,
                        "message" => 'Data Saved Successfully!!',
                        "results" => $IssueManagement
                    );
                    initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
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
        return \response()->json($res);
    }


    public function getIssueManagementDetails(Request $request)
    {
        try {
            $results = IssueManagement::from('tra_issue_management_applications as t1')
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
                    't5.name as issue_status',
                    't1.id as active_application_id',
                    't1.workflow_stage_id',
                    't1.created_on as creation_date',
                    DB::raw("decrypt(t6.first_name) as first_name,decrypt(t6.last_name) as last_name")
                )
                ->get();

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

    public function getIssueManagementDetailsById($active_application_id)
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
                    't1.created_on as creation_date',
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

    public function submitIssueManagementApplication(Request $request)
    {
        try {
            $application_code = $request->application_code;
            $workflow_stage_id = $request->workflow_stage_id;
            $active_application_id = $request->active_application_id;

            $IssueManagement = IssueManagement::findOrFail($active_application_id);
            $IssueStatus = IssueStatus::where('name', 'In Progress')->first();

            if ($IssueManagement && $IssueStatus) {
                $IssueManagement->fill([
                    'issue_status_id'       => $IssueStatus->id,
                    'dola'                   => Carbon::now(),
                    'altered_by'             => $this->user_id,
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
}
