<?php

namespace Modules\IssueManagement\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\IssueManagement\Entities\IssueStatusGroups;

class IssueStatusGroupsController extends Controller
{
    public function index()
    {
        $IssueStatusGroups = IssueStatusGroups::all();
        return $IssueStatusGroups;
    }

    public function store(Request $request)
    {
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
                $IssueStatusGroups = IssueStatusGroups::find($id);
                $data = $request->all();
                $data['altered_by'] = Auth::user()->id;
                $IssueStatusGroups = $IssueStatusGroups->update($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "results" => $IssueStatusGroups
                );
            } else {
                //Create
                $rules = array(
                    'title' => 'required|unique:par_issue_status_groups,title',
                );

                $validator = Validator::make($request->all(), $rules);

                if ($validator->fails()) {
                    $res = array(
                        "success" => false,
                        "message" => $validator->errors()->first()
                    );
                    return response()->json($res);
                }
                $IssueStatusGroups = new IssueStatusGroups;
                $data = $request->all();
                $data['created_by'] = Auth::user()->id;
                $data['altered_by'] = Auth::user()->id;
                $IssueStatusGroups = $IssueStatusGroups->create($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "results" => $IssueStatusGroups
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

    public function show($id)
    {
        $IssueStatusGroups = IssueStatusGroups::find($id);
        return $IssueStatusGroups;
    }

    public function update(Request $request, $id)
    {
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
                $IssueStatusGroups = IssueStatusGroups::find($id);
                $data = $request->all();
                $data['altered_by'] = Auth::user()->id;
                $IssueStatusGroups = $IssueStatusGroups->update($data);

                $res = array(
                    "success" => true,
                    "message" => 'Data Saved Successfully!!',
                    "results" => $IssueStatusGroups
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

    public function destroy($id)
    {
        try {
            $IssueStatusGroups = IssueStatusGroups::find($id);

            $IssueStatusGroups = $IssueStatusGroups->delete();

            $res = array(
                "success" => true,
                "message" => 'Record deleted Successfully!!',
                "results" => $IssueStatusGroups
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