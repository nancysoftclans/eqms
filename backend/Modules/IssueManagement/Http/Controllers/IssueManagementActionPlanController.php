<?php

namespace Modules\IssueManagement\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\IssueManagement\Entities\IssueType;
use Modules\IssueManagement\Entities\IssueManagementActionPlan;

class IssueManagementActionPlanController extends Controller
{
    public function index(Request $request)
    {
        $IssueManagementActionPlan = IssueManagementActionPlan::where('issue_id', $request->issue_id)->get();
        return $IssueManagementActionPlan;
    }

    public function store(Request $request)
    {
        try {
            $id = $request->input('id');
            $active_application_id = $request->active_application_id;
            if (validateIsNumeric($id)) {
                //Update
                $IssueManagementActionPlan = IssueManagementActionPlan::find($id);
                $data = $request->all();
                $data['altered_by'] = Auth::user()->id;
                $data['dola'] = Carbon::now();
                $data['start_date'] = Carbon::parse($request->start_date);
                $data['completion_date'] = Carbon::parse($request->completion_date);
                $IssueManagementActionPlan = $IssueManagementActionPlan->update($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "results" => $IssueManagementActionPlan
                );
            } else {
                // Create
                if (is_numeric($active_application_id)) {
                    $issue_data = $request->all();
                    $issue_data['issue_id'] = $active_application_id;
                    $issue_data['created_on'] = Carbon::now();
                    $issue_data['dola'] = Carbon::now();
                    $issue_data['created_by'] = Auth::user()->id;
                    $issue_data['altered_by'] = Auth::user()->id;
                    $issue_data['start_date'] = Carbon::parse($request->start_date);
                    $issue_data['completion_date'] = Carbon::parse($request->completion_date);

                    $IssueManagementActionPlan = new IssueManagementActionPlan();
                    $IssueManagementActionPlan->create($issue_data);

                    $res = array(
                        'success' => true,
                        'message' => 'Saved Successfully!!',
                        'results' => $IssueManagementActionPlan
                    );
                }
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return \response()->json($res);
    }
}
