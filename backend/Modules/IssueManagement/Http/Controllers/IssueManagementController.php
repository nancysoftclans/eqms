<?php

namespace Modules\IssueManagement\Http\Controllers;

use App\Models\WfProcess;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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
                return $next($request);
            });
        }

    }
    public function saveIssueDetails(Request $request)
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

                    $res = array(
                        "success" => true,
                        "message" => 'Data Saved Successfully!!',
                        "results" => $IssueManagement
                    );
                    // initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
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
                    DB::raw("decrypt(t6.first_name) as first_name,decrypt(t6.last_name) as last_name")
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
                    DB::raw("decrypt(t6.first_name) as first_name,decrypt(t6.last_name) as last_name")
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
                    DB::raw("decrypt(t5.first_name) as first_name,decrypt(t5.last_name) as last_name")
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
                    $data = array(
                        'issue_id' => $active_application_id,
                        'related_id' => $issue,
                        'dola' => Carbon::now(),
                        'altered_by' => $this->user_id,
                    );
                    $IssueManagementRelatedIssue = new IssueManagementRelatedIssue();
                    $IssueManagementRelatedIssue->create($data);
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
                ->where('t1.issue_id', $request->issue_id)
                ->select(
                    't1.*',
                    't2.reference_no',
                    't2.audit_reference',
                    't2.audit_title'
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
                    $data = array(
                        'issue_id' => $active_application_id,
                        'audit_id' => $issue,
                        'dola' => Carbon::now(),
                        'altered_by' => $this->user_id,
                    );
                    $IssueManagementAudit = new IssueManagementAudit();
                    $IssueManagementAudit->create($data);
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
                foreach ($issue_data as $issue) {
                    $data = array(
                        'issue_id' => $active_application_id,
                        'department_id' => $issue,
                        'dola' => Carbon::now(),
                        'altered_by' => $this->user_id,
                    );
                    $IssueManagementOrgArea = new IssueManagementOrgArea();
                    $IssueManagementOrgArea->create($data);
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
}
