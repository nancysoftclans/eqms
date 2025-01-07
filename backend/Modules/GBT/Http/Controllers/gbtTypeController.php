<?php

namespace Modules\GBT\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\IssueManagement\Entities\IssueType;

class gbtTypeController extends Controller
{

    public function logAction($action, $request, $ref_id=null){
        $table_name = 'eqms_issue_types_logs';
        $user_id = Auth::user()->id;
        //$application_code = $request->input('application_code') ?? null;
        $ref_id = $request->input('id');
        $created_on = Carbon::now();
        $title = $request->input('title');
        $description = $request->input('description');
        $form_id = $request->input('form_id');
        $status_group_id = $request->input('status_group_id');
        $issue_type_category_id = $request->input('issue_type_category_id');
        $is_enabled = $request->input('is_enabled');

        $logData = [
            'user_id' => $user_id,
            //'application_code' => $application_code,
            'action' => $action,
            'ref_id' => $ref_id,
            'title' => $title,
            'description'=> $description,
            'form_id'=> $form_id,
            'status_group_id'=> $status_group_id,
            'is_enabled'=> $is_enabled,
            'issue_type_category_id' => $issue_type_category_id,
            'created_on' => $created_on,
        ];

        DB::table($table_name)->insert($logData);
    }
    public function index(Request $request)
    {
        $this->logAction('Viewed issue types', $request);

        $IssueType = IssueType::from('par_gbt_types as it')
            ->join('par_form_categories as fc', 'it.form_id', 'fc.id')
            ->leftJoin('par_issue_status_groups as isg', 'it.status_group_id', 'isg.id')
            ->leftJoin('par_issue_type_categories as itc', 'it.issue_type_category_id', 'itc.id')
            ->select('it.*', 'fc.name as form', 'isg.issue_status_ids', 'isg.title as status_group', 'itc.title as issue_type_category')
            ->get();
        return $IssueType;
    }

    public function store(Request $request)
    {
        $this->logAction('store issue types', $request);
        try {
            $id = $request->input('id');
            if (validateIsNumeric($id)) {
                //Update
                $rules = array(
                    'title' => 'required',
                );

                $validator = Validator::make($request->all(), $rules);

                if ($validator->fails()) {
                    $res = array(
                        "success" => false,
                        "message" => $validator->errors()->first()
                    );
                    return response()->json($res);
                }
                $IssueType = IssueType::find($id);
                $data = $request->all();
                $data['altered_by'] = Auth::user()->id;
                $data['dola'] = Carbon::now();
                $IssueType = $IssueType->update($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "results" => $IssueType
                );
            } else {
                //Create
                $rules = array(
                    'title' => 'required|unique:par_issue_types,title',
                );

                $validator = Validator::make($request->all(), $rules);

                if ($validator->fails()) {
                    $res = array(
                        "success" => false,
                        "message" => $validator->errors()->first()
                    );
                    return response()->json($res);
                }
                $IssueType = new IssueType;
                $data = $request->all();
                $data['created_by'] = Auth::user()->id;
                $data['altered_by'] = Auth::user()->id;
                $IssueType = $IssueType->create($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "id" => $id,
                    "results" => $IssueType
                );
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

    public function show($id, Request $request)
    {
        $this->logAction('show issue types', $request);
        $IssueType = IssueType::from('par_issue_types as it')
            ->join('par_form_categories as fc', 'it.form_id', 'fc.id')
            ->leftJoin('par_issue_status_groups as isg', 'it.status_group_id', 'isg.id')
            ->leftJoin('par_issue_type_categories as itc', 'it.issue_type_category_id', 'itc.id')
            ->select('it.*', 'fc.name as form', 'isg.issue_status_ids', 'isg.title as status_group', 'itc.title as issue_type_category')
            ->where('it.id', $id)
            ->first();
        return $IssueType;
    }

    public function update(Request $request, $id)
    {
        $this->logAction('updated issue types', $request);
        $rules = array(
            'title' => 'required',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $res = array(
                "success" => false,
                "message" => $validator->errors()->first()
            );
        } else {
            try {
                $IssueType = IssueType::find($id);
                $data = $request->all();
                $data['altered_by'] = Auth::user()->id;
                $IssueType = $IssueType->update($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "results" => $IssueType
                );
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
        }
        return response()->json($res);
    }

    public function destroy($id, Request $request)
    {
        $this->logAction('destroy issue types', $request);
        try {
            $IssueType = IssueType::find($id);

            $IssueType = $IssueType->delete();

            $res = array(
                "success" => true,
                "message" => 'Record deleted Successfully!!',
                "results" => $IssueType
            );
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
}
