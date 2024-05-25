<?php

namespace Modules\IssueManagement\Http\Controllers;

use App\Models\WfProcess;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
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
                if (!\Auth::check()) {
                    $res = array (
                        'success' => false,
                        'message' => '<p>NO SESSION, SERVICE NOT ALLOWED!!<br>PLEASE RELOAD THE SYSTEM!!</p>'
                    );
                    echo json_encode($res);
                    exit ();
                }
                $this->user_id = \Auth::user()->id;
                return $next($request);
            });
        }
    }


    public function saveNewReceivingBaseDetails(Request $request)
    {


        $application_id = $request->input('application_id');
        $complaint_id = $request->input('id');
        $process_id = $request->input('process_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');




        $user_id = $this->user_id;



        $complaint_details_params = array(
            'name' => $request->input('name'),
            'organization_name' => $request->input('organization_name'),
            'address' => $request->input('address'),
            'phone_no' => $request->input('phone_no'),
            'email' => $request->input('email'),
            'mode_id' => $request->input('mode_id'),
            'date_of_complaint' => $request->input('date_of_complaint'),
            'details_of_complaint' => $request->input('details_of_complaint'),
        );


        DB::beginTransaction();
        try {
            $complaint_details_table = 'tra_complaints';
            $applications_table = 'tra_issuemanagement_applications';

            $where_application = array(
                'id' => $application_id
            );

            $where_complaint = array(
                'id' => $complaint_id
            );

            if (validateIsNumeric($application_id)) {

                $application_params = array(
                    'complaint_id' => $complaint_id
                );

                // dd($application_params);
                $app_details = array();
                // results
                if (recordExists($complaint_details_table, $where_complaint)) {
                    $complaint_details_params['dola'] = Carbon::now();
                    $complaint_details_params['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($complaint_details_table, $where_complaint);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    $complaint_details_res = updateRecord($complaint_details_table, $previous_data, $where_complaint, $complaint_details_params, $user_id);
                    Db::commit();

                } else {
                    $complaint_details_res = insertRecord($complaint_details_table, $complaint_details_params, $user_id);
                    if ($complaint_details_res['success'] == false) {
                        return \response()->json($complaint_details_res);
                    }
                    $complaint_id = $complaint_details_res['record_id'];
                    $application_params['complaint_id'] = $complaint_id;
                    DB::commit();
                }

                if (recordExists($applications_table, $where_application)) {
                    $app_details = getPreviousRecords($applications_table, $where_application);
                    if ($app_details['success'] == false) {
                        return $app_details;
                    }


                    $app_details = $app_details['results'];
                    $application_res = updateRecord($applications_table, $app_details, $where_application, $application_params, $user_id);
                    if ($application_res['success'] == false) {
                        return $application_res;
                    }

                    Db::commit();
                    $application_res = $application_res['record_id'];



                }

                $application_code = $app_details[0]['application_code'];
                $ref_no = $app_details[0]['reference_no'];

                $res = array(
                    'record_id' => $application_res,
                    'application_code' => $application_code,
                    'complaint_id' => $complaint_id,
                    'reference_no' => $ref_no,
                    'message' => 'Data updated successfully',
                    'success' => true
                );


            } else {
                // Create a new  Complaint

                $complaint_details_res = insertRecord($complaint_details_table, $complaint_details_params, $user_id);
                if ($complaint_details_res['success'] == false) {
                    return \response()->json($complaint_details_res);
                }
                $complaint_id = $complaint_details_res['record_id'];

                $sub_module_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');

                $codes_array = array(
                    'sub_module_code' => $sub_module_code
                );

                $view_id = generateApplicationViewID();
                $reference_type_id = '1';

                // $sub_module_id = intval($sub_module_id);

                // FIXME Generate application tracking number resolves to null, and I have tried everything.
                // FIXME Fixed it last minute ref_id now resolves to sth.

                $reference_details = generateApplicationTrackingNumber($sub_module_id, $reference_type_id, $codes_array, $section_id = '8', $process_id, $branch_id = '0', $user_id, true);

                // generateApplicationTrackingNumber($sub_module_id, $reference_type_id, $codes_array, $section_id, $process_id, $branch_id, $user_id, $is_refno);
                //dd($reference_details);
                if ($reference_details['success'] == false) {
                    return \response()->json($reference_details);
                }
                $ref_no = $reference_details['tracking_no'];
                $application_code = generateApplicationCode($sub_module_id, $applications_table);

                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                if ($application_status->status_id == '') {
                    $res = array(
                        'success' => false,
                        'message' => 'Please set initial application status of the application!!'
                    );
                    return \response()->json($res);

                }
                $application_params = array(
                    'module_id' => $module_id,
                    'view_id' => $view_id,
                    'sub_module_id' => $sub_module_id,
                    'application_code' => $application_code,
                    'complaint_id' => $complaint_id,
                    'process_id' => $process_id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'reference_no' => $ref_no,
                    'stage_id' => 1,
                    "tracking_no" => $ref_no,
                    'application_status_id' => $application_status->status_id
                );

                $res = insertRecord($applications_table, $application_params, $user_id);

                if ($res['success'] == false) {
                    return $res;
                }

                $application_id = $res['record_id'];

                $reg_params = array(
                    'tra_surveillance_id' => $application_id,
                    'created_by' => $user_id
                );

                //createInitialRegistrationRecord('registered_surveillance', $applications_table, $reg_params, $application_id, 'reg_surveillance_id');

                $submission_params = array(
                    'application_id' => $application_id,
                    'view_id' => $view_id,
                    'process_id' => $process_id,
                    'application_code' => $application_code,
                    'reference_no' => $ref_no,
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

            }
            Db::commit();
            $res['record_id'] = $application_id;
            $res['application_code'] = $application_code;
            $res['complaint_id'] = $complaint_id;
            $res['reference_no'] = $ref_no;
        } catch (\Exception $exception) {
            DB::rollback();
            $res = array(
                "success" => false,
                "message" => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            Db::rollback();
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
            $results = IssueManagement::all();

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
