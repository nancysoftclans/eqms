<?php

namespace Modules\IssueManagement\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Modules\IssueManagement\Entities\IssueType;

class IssueTypeController extends Controller
{
    public function index()
    {
        $IssueType = IssueType::from('par_issue_types as it')->join('par_form_categories as fc', 'it.form_id', 'fc.id')->select('it.*', 'fc.name as form')->get();
        return $IssueType;
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
                $IssueType = IssueType::find($id);
                $data = $request->all();
                $data['altered_by'] = Auth::user()->id;
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

    public function show($id)
    {
        $IssueType = IssueType::find($id);
        return $IssueType;
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

    public function destroy($id)
    {
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