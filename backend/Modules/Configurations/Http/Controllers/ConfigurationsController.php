<?php

namespace Modules\Configurations\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as ReaderXlsx;
use Illuminate\Support\Facades\File as FacadesFile;

class ConfigurationsController extends Controller
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

    public function index()
    {
        return view('configurations::index');
    }

    public function saveConfigCommonData(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $db_con = 'mysql';
            $table_name = $post_data['table_name'];
            $is_variation = $req->is_variation;



            if (isset($post_data['db_con']) && $post_data['db_con'] != '') {
                $db_con = $post_data['db_con'];
            }
            unset($post_data['db_con']);

            if($table_name == 'tra_element_costs'){

                unset($post_data['section_id']);
            }
            //add serial no from last entry
            if($table_name == 'par_checklist_items'){
                if(isset($post_data['auto_serial']) && $post_data['auto_serial'] == 1){

                    $items_details = DB::table('par_checklist_items')->count();
                    $post_data['serial_no'] = $post_data['checklistitem_parent_id'].'.'.$items_details+1;//0.1
                }
            }
            else if($table_name == 'tra_premise_variation_recommendations'){
                $application_code = $req->application_code;
                $module_id = $req->module_id;
                $trans_data = DB::table('tra_submissions as t1')
                            ->join('wf_workflow_stages as t2', 't1.current_stage', 't2.id')
                            ->where('application_code', $application_code)
                            ->where('is_done', 0)
                            ->orderBy('t1.id', 'DESC')
                            ->select('t2.stage_category_id')
                            ->first();

                if(isset($trans_data->stage_category_id)){
                    $post_data['stage_category_id'] = $trans_data->stage_category_id;
                }
            }
            else if($table_name == 'tra_pv_suspected_drugs'){
                foreach ($post_data as $key => $value) {
                    if($value){
                        $post_data[$key] = strip_tags($value);
                    }
                }
            }
            else if($table_name == 'par_refremapping_log'){
                //check if exists
                $from_serial = $req->from_serial;
                $to_serial = $req->to_serial;
                if(recordExists('par_brims_report_application', ['id' => $from_serial])){
                    return ['success'=>false, 'message' => 'Reference not found please confirm the serial again'];
                }
                if(recordExists('par_brims_report_application', ['id' => $to_serial])){
                    return ['success'=>false, 'message' => 'Reference Already assaigned to another letter'];
                }
                //update
                updateRecord('par_brims_report_application', ['id'=>$from_serial], ['id'=>$to_serial]);

                //update
                $table_data['action_by'] = $this->user_id;

            }

            //application code if its a variation save
            if(validateIsNumeric($is_variation) && validateIsNumeric($req->premise_id)){
                $application_code = getSingleRecordColValue('tra_premises_applications', ['premise_id'=> $req->premise_id], 'application_code');
                $post_data['application_code'] = $application_code;
            }

            $id = $req->id;
            $unsetData = $req->input('unset_data');

            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            unset($post_data['is_variation']);


            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;

            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            if(validateIsNumeric($is_variation)){
                $table_name= $table_name.'_variations';

            }
            if (validateIsNumeric($id)) {

                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name, $where, $table_data);
                }else{
                    $res = "Update record not found";
                }
            } else {

                $res = insertRecord($table_name, $table_data);
            }
        }catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function saveEditedConfigCommonData(Request $request){
        $request->request->remove('ruleField');
        return $this->saveConfigCommonData($request);

    }
    public function saveDocDefinationrequirement(Request $req){
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $table_name = $post_data['table_name'];
            $file = $req->file('document_template');

        $document_extension_ids = $req->input('document_extension_ids');
        $document_extension_ids = json_decode($document_extension_ids);

            $id = $post_data['id'];
            $unsetData = $req->input('unset_data');
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['document_template']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']); unset($post_data['document_extension_ids']);
            unset($post_data['unset_data']);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
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
                }
            } else {

                $res = insertRecord($table_name, $table_data);

                $id = $res['record_id'];

            }
            //save the documetn extension types
            DB::table('tra_docupload_reqextensions')
                    ->where('documentupload_requirement_id', $id)
                    ->delete();
                if (count($document_extension_ids) > 0) {
                    foreach ($document_extension_ids as $document_extension_id) {
                        $params[] = array(
                            'documentupload_requirement_id' => $id,
                            'document_extensionstype_id' => $document_extension_id,
                            'created_on' => Carbon::now(),
                            'created_by' => \Auth::user()->id
                        );
                    }
                     insertMultipleRecords('tra_docupload_reqextensions', $params);
                }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
        //



        //

    }
    function uploadDocumentRequirementTemplate($req,$params){
        $file = $req->file('document_template');
        $user_id = $this->user_id;
        if ($req->hasFile('document_template')) {

            $origFileName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $fileSize = $file->getClientSize();

            $origFileName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $fileSize = $file->getClientSize();
            //$folder = '\resources\uploads';
            $document_root = $_SERVER['DOCUMENT_ROOT'];

            $upload_directory =     $document_root.'/'.Config('constants.dms.system_uploaddirectory');

            $folder = 'document_requirements';

            $destination = $upload_directory.$folder;

            $savedName = str_random(5) . time() . '.' . $extension;

            if($file->move($destination, $savedName)){
                    $document_root = $_SERVER['DOCUMENT_ROOT'];
                    // resize image to fixed size

                    $params['initial_file_name'] = $origFileName;
                    $params['file_name'] = $savedName;
                    $params['file_size'] = formatBytes($fileSize);
                    $params['filetype'] = $extension;
                    $params['document_folder'] = $folder;
                    $params['created_on'] = Carbon::now();
                    $params['created_by'] = $user_id;
                    $params['uploaded_on'] = Carbon::now();
                    $params['uploaded_by'] = $user_id;

            }

    }
    return $params;
    }
    public function saveSystemModuleData(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            $table_name = 'par_modules';
            $id = $post_data['id'];
            $unsetData = $req->input('unset_data');
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;

                    $res = updateRecord($table_name, $where, $table_data);
                }
            } else {
                $res = insertRecord($table_name, $table_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getConfigParamFromModel(Request $request)
    {
        $model_name = $request->input('model_name');
        $strict_mode = $request->input('strict_mode');
        try {
            $model = 'App\\Modules\\Configurations\\Entities\\' . $model_name;
            if (isset($strict_mode) && $strict_mode == 1) {
                $results = $model::where('is_enabled', 1)
                    ->get()
                    ->toArray();
            } else {
                $results = $model::all()
                    ->toArray();
            }
            //$results = decryptArray($results);
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getChecklistTypes(Request $request)
    {
        $checklist_category = $request->input('checklist_category');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $premise_type_id = $request->input('premise_type_id');
        $prodclass_category_id = $request->input('prodclass_category_id');
        $product_type_id = $request->input('product_type_id');
        try {
            $qry = DB::table('par_checklist_types as t1')
                ->join('par_checklist_categories as t2', 't1.checklist_category_id', '=', 't2.id')
                ->join('par_modules as t3', 't1.module_id', '=', 't3.id')
                ->join('par_sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
                ->leftJoin('par_sections as t5', 't1.section_id', '=', 't5.id')
                ->leftJoin('par_device_types as t6', 't1.device_type_id', '=', 't6.id')
                ->select('t1.*', 't2.name as category_name', 't3.name as module', 't4.name as sub_module', 't5.name as section', 't6.name as device_type_name');
            if (isset($checklist_category) && $checklist_category != '') {
                $qry->where('t1.checklist_category_id', $checklist_category);
            }
            if (isset($module_id) && $module_id != '') {
                $qry->where('t1.module_id', $module_id);
            }
            if (isset($sub_module_id) && $sub_module_id != '') {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (isset($section_id) && $section_id != '') {
                $qry->where('t1.section_id', $section_id);
            }
            if (isset($premise_type_id) && $premise_type_id != '') {
                $qry->where('t1.premise_type_id', $premise_type_id);
            }
            if (isset($prodclass_category_id) && $prodclass_category_id != '') {
                $qry->where('t1.prodclass_category_id', $prodclass_category_id);
            }
            if (isset($product_type_id) && $product_type_id != '') {
                $qry->where('t1.product_type_id', $product_type_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getChecklistItems(Request $request)
    {
        $checklist_type = $request->input('checklist_type');
        $checklist_category_id = $request->input('checklist_category_id');
        $checklist_type_id = $request->input('checklist_type_id');
        try {
            $qry = DB::table('par_checklist_items as t1')
                ->join('par_checklist_types as t2', 't1.checklist_type_id', '=', 't2.id')
                ->leftjoin('par_compliance_risk_scale as t3', 't1.risk_type', '=', 't3.id')
                ->select('t1.*', 't2.name as type_name','t3.name as risk','t2.checklist_category_id');
            if (isset($checklist_type) && $checklist_type != '') {
                $qry->where('t1.checklist_type_id', $checklist_type);
            }
            if(validateIsNumeric($checklist_category_id)){
                $qry->where('t2.checklist_category_id', $checklist_category_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function deleteConfigRecord(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
            $res = deleteRecord($table_name, $where, $user_id);
            if($res['success']){
                if($table_name == 'par_formfield_designs'){
                    DB::table('par_formfield_relations')->where('form_fielddesign_id', $record_id)->orWhere('parent_field_id', $record_id)->delete();
                }
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function softDeleteConfigRecord(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
            $res = softDeleteRecord($table_name, $where, $user_id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function undoConfigSoftDeletes(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
            $previous_data = getPreviousRecords($table_name, $where);
            if ($previous_data['success'] == false) {
                return $previous_data;
            }
            $previous_data = $previous_data['results'];
            $res = undoSoftDeletes($table_name, $previous_data, $where, $user_id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getAllApplicationStatuses(Request $request)
    {
        $module_id = $request->input('module_id');
        try {
            $qry = DB::table('par_application_statuses as t1')
                ->join('par_modules as t2', 't1.module_id', '=', 't2.id')
                ->leftJoin('par_sub_modules as t3', 't1.sub_module_id', '=', 't3.id')
                ->leftJoin('par_confirmations as t4', 't1.status', '=', 't4.id')
                ->leftjoin('par_system_statuses as t5', 't1.status_id', '=', 't5.id')
                ->select('t1.*', 't5.name as status_name', 't2.name as module_name', 't4.name as is_initial','t3.name as sub_module_name');
            if (validateIsNumeric($module_id)) {
                $qry->where('t1.module_id', $module_id);
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getPortalAppsInitialStatuses(Request $request)
    {
        $module_id = $request->input('module_id');
        try {
            $qry = DB::table('par_portalapps_initialmis_statuses as t1')
                ->join('par_modules as t2', 't1.module_id', '=', 't2.id')
                //->leftJoin('par_sub_modules as t3', 't1.sub_module_id', '=', 't3.id')
                ->join('par_system_statuses as t5', 't1.status_id', '=', 't5.id')
                ->select('t1.*', 't5.name as status_name', 't2.name as module_name');
            if (validateIsNumeric($module_id)) {
                $qry->where('t1.module_id', $module_id);
            }
            $results = $qry->get();
            foreach ($results as $key => $result) {
                $results[$key]->portal_status_type = getSingleRecordColValue('wb_statuses_types', array('id' => $result->portal_statustype_id), 'name', 'portal_db');
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getAlterationParameters()
    {
        try {
            $qry = DB::table('par_alteration_setup as t1')
                ->join('par_confirmations as t2', 't1.is_form_tied', '=', 't2.id')
                ->leftJoin('par_key_forms as t3', 't1.form_id', '=', 't3.id')
                ->join('par_modules as t4', 't1.module_id', '=', 't4.id')
                ->select('t1.*', 't2.name as form_specific', 't3.name as form_name', 't4.name as module_name');
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getNonrefParameter(Request $req)
    {
        try {

            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->select('t1.*');

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }


    public function getPayingCurrency(Request $req)
    {
        try {

            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->select('t1.*')
                ->where('is_paying_currency', 1);

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    //function to fetch the registration conditions details
    public function getRegistrationApplicationParameters(Request $req)
    {
        try {

            $filters = $req->input('filters');
            $table_name = $req->table_name . ' as t1';

            if($req->table_name == 'par_product_classificationrules'){


                $qry = DB::table($table_name);

                $qry->join('par_classification_rules as t2', 't1.class_rule_id','=','t2.id')
                                    ->select('t1.*', 't2.name as class_rule', 't2.description as rule_description');
                if ($filters != '') {
					$filters = (array)json_decode($filters);
					$device_type_id = $filters['device_type_id'];
					unset($filters['device_type_id']);
					$results = $qry->where($filters)->where('t1.device_type_id',$device_type_id);
				}
            }else if ($req->table_name == 'par_controlleddrugs_basesalts'){
				$qry = DB::table($table_name)->select('*', 'percentage_within_the_drug as percentage_content');
				if ($filters != '') {
					$filters = (array)json_decode($filters);
					if(array_key_exists('controlled_drugssubstances_id', $filters)){
						$filters['controlled_drug_substance_id'] = $filters['controlled_drugssubstances_id'];
						unset($filters['controlled_drugssubstances_id']);
						$qry->where($filters);
					}
				}
			}
            else{
                $qry = DB::table($table_name)
                             ->select('t1.*');
                             if ($filters != '') {
                                $filters = (array)json_decode($filters);
                                $results = $qry->where($filters);

                            }
            }

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    //function to retrieve the certification conditions
    public function getCertificateConditionsApplicationParameters(Request $req)
    {
        try {

            $filters = $req->input('filters');
            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->join('par_sections as t2', 't1.section_id', '=', 't2.id')
                ->join('par_sub_modules as t3', 'sub_module_id', '=', 't3.id')
                ->join('par_modules as t4', 't1.module_id', '=', 't4.id')
                ->join('par_document_types as t5', 't1.document_type_id', '=', 't5.id')
                ->join('tra_registration_regulations as t6', 't1.regulation_id', '=', 't6.id')
                ->select('t1.*', 't2.name as section_name', 't3.NAME as sub_module_name', 't4.NAME as module_name', 't5.NAME as document_name', 't6.name as regulation_name');

            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $results = $qry->where($filters);
            }
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getGenericNamesAtcCodes(Request $req)
    {
        try {
            $filters = $req->filters;
            $common_name_id = $req->common_name_id;

            $qry = DB::table('par_atc_codes as t1')
                ->select('t1.*')
                ->where('common_name_id', $common_name_id);


            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);


    }

    public function getproductApplicationParameters(Request $req)
    {
        try {
            $filters = $req->filters;
            $table_name = $req->table_name . ' as t1';

            if ($req->table_name == 'par_common_names') {
                $qry = DB::table($table_name)
                    ->leftJoin('par_sections as t2', 't1.section_id', '=', 't2.id')
                    ->leftJoin('par_atc_codes as t3', 't1.atc_code_id', '=', 't3.id')
                    ->select('t1.*', 't2.name as section_name', 't3.name as atc_code', 't3.description as atc_code_description');


            } else if ($req->table_name == 'par_classifications') {
                $qry = DB::table($table_name)
                    ->leftJoin('par_sections as t2', 't1.section_id', '=', 't2.id')
                    ->leftJoin('par_prodclass_categories as t3', 't1.prodclass_category_id', '=', 't3.id')
                    ->leftJoin('par_cost_categories as t4','t1.cost_category_id','t4.id')
                    ->select('t1.*', 't2.name as section_name', 't3.name as product_class_category_name','t4.name as cost_category_name');
            }else if ($req->table_name == 'par_business_types') {
                $qry = DB::table($table_name)
                    ->leftJoin('par_sections as t2', 't1.section_id', '=', 't2.id')
                    ->leftJoin('par_businesstype_categories as t3', 't1.business_typecategory_id', '=', 't3.id')
                    ->select('t1.*', 't2.name as section_name', 't3.name as business_typecategory_name');
            }
             else {

                $qry = DB::table($table_name)
                    ->leftJoin('par_sections as t2', 't1.section_id', '=', 't2.id')
                    ->select('t1.*', 't2.name as section_name');


            }
            if ($req->table_name == 'par_classifications') {
                if ($filters != '') {
                    $section_id = 2;
                    $filters = (array)json_decode($filters);
                    if($filters['section_id']){

                        $section_id = $filters['section_id'];
                       // unset($filters['section_id']);
                       // $filters['t1.section_id'] =  $section_id;

                    }
                    unset($filters['section_id']);
                        $filters['t1.section_id'] =  $section_id;
                    $results = $qry->where($filters);
                }
            }
            else if($req->table_name == 'par_common_names'){
                if ($filters != '') {
                    $filters = (array)json_decode($filters);
                    if($filters['section_id']){

                        $section_id = $filters['section_id'];
                       // unset($filters['section_id']);
                       // $filters['t1.section_id'] =  $section_id;

                    }
                    unset($filters['section_id']);
                        $filters['t1.section_id'] =  $section_id;
                    $results = $qry->where($filters);
                }
            }
            else  if ($filters != '') {
                $filters = (array)json_decode($filters);
                $results = $qry->where($filters);
            }
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getConfigParamFromTable(Request $req)
    {
        try {
            $filters = $req->filters;
            $is_config = $req->is_config;
            $table_name = $req->table_name;
			if($table_name=='par_advt_types'){
				 $table_name = 'par_advertisement_types';
			}
	        if($table_name=='par_advt_category'){
				 $table_name ='par_advertisement_category'; 
			}
			$qry = DB::table($table_name. ' as t1');
            //conditional selection based on table
            if($table_name == 'wb_bomraprocesses'){
                $qry = DB::connection('portal_db')->table('wb_bomraprocesses as t1');
            }

            // DB::raw("(SELECT GROUP_CONCAT(CONCAT(j.name, '.', j.extension) SEPARATOR ',') 
            //                 FROM tra_docupload_reqextensions t 
            //                 INNER JOIN par_document_extensionstypes j ON t.document_extensionstype_id = j.id 
            //                 WHERE t.documentupload_requirement_id = t1.id) AS allowed_extensions")


            else if($table_name == 'par_form_categories'){
                $qry->Join('par_modules as t4','t1.module_id','=','t4.id')
                    // ->Join('par_sub_modules as t5','t1.sub_module_id','=','t5.id')
                    // ->leftJoin('par_sections as t6','t1.section_id','=','t6.id')
                    // ->leftJoin('par_prodclass_categories as t7','t1.prodclass_category_id','=','t7.id')
                    // ->leftJoin('par_premises_types as t8','t1.premise_type_id','=','t8.id')
                    ->select('t1.*', 
                         DB::raw("CASE WHEN (SELECT COUNT(id) FROM tra_documentupload_requirements q WHERE q.docparent_id = t1.id) = 0 THEN TRUE ELSE FALSE END AS leaf"),
              
                't4.name AS sub_module',
                't4.name as module_name',

                DB::raw("(SELECT GROUP_CONCAT(CONCAT(j.name, '.', j.extension) SEPARATOR ',') 
                            FROM tra_docupload_reqextensions t 
                            INNER JOIN par_document_extensionstypes j ON t.document_extensionstype_id = j.id 
                            WHERE t.documentupload_requirement_id = t1.id) AS allowed_extensions"));
            }
            else if($table_name== 'par_maindetails_variation_points'){
                $qry->Join('par_modules as t4','t1.module_id','=','t4.id')
                ->Join('par_sub_modules as t5','t1.sub_module_id','=','t5.id')
                ->leftJoin('par_sections as t6','t1.section_id','=','t6.id')
                ->leftJoin('par_prodclass_categories as t7','t1.prodclass_category_id','=','t7.id')
                ->leftJoin('par_premises_types as t8','t1.premise_type_id','=','t8.id')
                ->leftJoin('par_typeof_variations as t9','t1.variationtype_id','=','t9.id')
                ->leftJoin('par_form_categories as t10','t1.form_categories_id','=','t10.id')
                ->leftJoin('par_formfield_designs as t11','t1.form_fields_id','=','t11.id')
                ->select('t1.*', 't4.name as module_name', 't5.name as sub_module_name', 't6.name as section_name', 't7.name as section_category', 't8.name as premise_type','t9.name as variation_type','t10.name as form_name','t11.field_name as field_name');
            }
            else if($table_name == 'par_formtype_fields'){
                $qry->Join('par_formfield_designs as t4','t1.field_id','=','t4.id')
                    ->select('t1.*', 't4.label as field_name', 't4.label');
                //order
                $qry->orderBy('order_no', 'ASC');
            }
            else if($table_name == 'par_formfield_designs'){
                $qry->Join('par_form_field_types as t5','t1.form_field_type_id','=','t5.id')
                    ->select('t1.*', 't5.name as field_type');
            }
            else if($table_name == 'tra_otherstates_productgmpinspections'){
                $qry->Join('par_continent_regions as t5','t1.continent_region_id','=','t5.id')
                    ->Join('par_countries as t6','t1.country_id','=','t6.id')
                    ->select('t1.*', 't5.name as continent_region', 't6.name as country');

            } else if($table_name == 'tra_variation_requests'){

                $qry->leftJoin('par_typeof_variations as t5','t1.variation_type_id','=','t5.id')
                     ->leftJoin('par_variation_points as t6','t1.variation_point_id','=','t6.id')
                    ->select('t1.*', 't5.name as variation_type', 't6.name as variation_point');
                if(validateIsNumeric($req->application_code)){
                    $qry->where('application_code', $req->application_code);
                }else{
                    $qry->whereRaw("0=1");
                }
            }

            else if($table_name == 'tra_product_ingredients'){
                $qry->Join('par_ingredients_details as t5','t1.ingredient_id','=','t5.id')
                    ->leftjoin('par_inclusions_reasons as t6','t1.inclusion_reason_id','=','t6.id')
                    ->select('t1.*', 't5.name as ingredient_name', 't1.ingredient_id as active_ingredient_id');
                if(validateIsNumeric($req->is_active_reason)){
                    $qry->where('is_active_reason', 1);
                }
            }
            else if($table_name == 'par_ageanalysisdays_span'){
                $qry->leftjoin('par_modules as t2', 't1.module_id','t2.id')
                ->select('t1.*','t2.name as module_name') ;

            }
            else if ($table_name == 'tra_element_costs') {
                    $qry->leftJoin('par_cost_elements as t3','t1.element_id','=','t3.id')
                        ->leftJoin('par_currencies as t4','t1.currency_id','=','t4.id')
                        ->select('t1.*','t3.name as name','t4.name as currency_name');

                }
                
            else if ($table_name == 'tra_pharmacy_details') {
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4','t1.district_id','=','t4.id')
                        //->leftJoin('par_cities as t5','t1.sub_district_id','=','t5.id')
                        ->select('t1.*','t3.name as region','t4.name as district');
                        if(validateIsNumeric($req->application_code)){
                            $qry->where('t1.application_code', $req->application_code);
                        }else{
                           
                        }

                }
            else if ($table_name == 'tra_personnel_qualifications') {
                    $qry->leftJoin('par_qualifications as t3','t1.qualification_id','=','t3.id')
                        ->select('t1.*','t3.name as qualification');

                }
            else if($table_name == 'tra_personnel_information'){
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->leftJoin('par_gender as t5', 't1.gender_id', 't5.id')
                        ->select('t1.*','t1.id as personnel_id','t3.name as region', 't4.name as district','t5.name as gender');
                }
            else if($table_name == 'tra_prescriber_information'){
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->select('t1.*','t1.id as personnel_id','t3.name as region', 't4.name as district');
                }
            else if($table_name == 'par_study_sites'){
                    $qry->leftJoin('par_countries as t6','t1.country_id','=','t6.id')
                        ->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->select('t1.*','t6.name as country','t3.name as region', 't4.name as district');
                }
                else if($table_name == 'par_exceluploads_config'){
                    $qry->leftjoin('par_modules as t2', 't1.module_id','t2.id')
                         ->leftjoin('par_sub_modules as t3', 't1.sub_module_id','t3.id')
                        ->leftJoin('par_adr_types as t4','t1.adrtype_id','=','t4.id')
                        ->leftJoin('par_exceluploads_config_type as t5','t1.excel_config_type_id','=','t5.id')
                        ->select('t1.*','t5.name as type_name','t2.name as module_name','t3.name as sub_module_name','t4.name as adr_type' );
                }
                else if($table_name == 'tra_impdistributor_details'){
                    $qry->leftjoin('wb_trader_account as t2', 't1.importer_id','t2.id')
                        ->leftjoin('par_countries as t3', 't1.country_id','t3.id')
                        ->leftJoin('par_regions as t4','t1.region_id','=','t4.id')
                        ->leftJoin('par_districts as t5','t1.district_id','=','t5.id')
                        ->select('t2.*','t1.*',  't3.name as country', 't4.name as region', 't5.name as district', 
                        't2.id as importer_id', 't1.name as applicant_name', 't2.country_id as app_country_id', 
                        't2.region_id as app_region_id', 't2.district_id as app_district_id', 
                        't1.physical_address as app_physical_address', 't1.postal_address as app_postal_address', 
                        't1.telephone_no as app_telephone', 't1.email as app_email')
                        ->where('t1.application_code', $req->application_code);
                    }
                else if($table_name == 'tra_md_assessment_history'){
                    $qry->join('users as t2', 't1.assessment_by','t2.id')
                     ->select(DB::raw("t1.*,CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as assessment_by"));
                }
                else if($table_name == 'par_containers_types'){
                    $qry->whereIN('id', [1,2]);
                }
                else if($table_name == 'tra_otherstates_productregistrations'){
                    $qry->where('application_code', $req->application_code);
                    $qry->Join('par_continent_regions as t5','t1.continent_region_id','=','t5.id')
                    ->Join('par_countries as t6','t1.country_id','=','t6.id')
                    ->select('t1.*', 't5.name as continent_region', 't6.name as country');
                }
                else if($table_name == 'tra_trial_ethic_committees'){
                    $qry->join('par_research_organizations as t5','t1.ethic_committee_id','=','t5.id')
                        ->select('t1.*', 't5.name');
                }
                else if($table_name == 'tra_impproduct_otherstate_registration_status'){
                    $qry->Join('par_countries as t5','t1.country_id', 't5.id')
                        ->Join('par_registration_statuses as t6','t1.registration_status', 't6.id')
                        ->select('t1.*', 't5.name as country_name', 't6.name as status');
                }
                else if($table_name == 'tra_trial_ethic_committees'){
                    $qry->join('par_research_organizations as t5','t1.ethic_committee_id','=','t5.id')
                        ->select('t1.*', 't5.name');
                }
                else if($table_name == 'tra_variation_ethic_committees'){
                    $qry->join('par_research_organizations as t5','t1.ethic_committee_id','=','t5.id')
                        ->select('t1.*', 't5.name');
                }
                else if($table_name == 'par_risk_premise_types_mapping'){
                    $qry->join('par_premises_types as t5','t1.premise_type_id','=','t5.id')
                        ->select('t1.*', 't5.name as premise_type_name');
                }
                else if($table_name == 'list_of_facilities'){
                    $qry = DB::table('tra_premises as t1')
                            ->select('t1.name', 't1.id');
                }
				else if($table_name == 'tra_prescriber_information'){
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->select('t1.*','t1.id as personnel_id','t3.name as region', 't4.name as district');
                }
				else if($table_name == 'tra_exemptionanimal_medical_requirments'){
                     $qry->join('tra_exemption_products as t2','t1.exemption_product_id','=','t2.id')
                        ->join('par_dosage_forms as t3','t2.dosage_form_id','=','t3.id')
                        ->select('t1.*', DB::raw("CONCAT(t2.brand_name, ' (', t2.strength, ') ', t3.name) as medicine_details"));
                }
                 else if ($table_name == 'tra_patient_details') {
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4','t1.district_id','=','t4.id')
                        ->leftJoin('par_gender as t5','t1.gender_id','=','t5.id')
                        ->select('t1.*','t3.name as region','t4.name as district','t5.name as gender');
                        if(validateIsNumeric($req->product_id)){
                            $qry->where('t1.product_id', $req->product_id);
                        }else if(validateIsNumeric($req->application_code)){
                            $qry->where('t1.application_code', $req->application_code);
                        }
                        else{

                        }

                }
                else if($table_name == 'tra_permitsenderreceiver_data'){
                    $qry->select('t1.*', 't1.name as sender_receiver_name');
                }
                else if($table_name == 'tra_prescriber_information'){
                    $qry->leftJoin('par_regions as t3','t1.region_id','=','t3.id')
                        ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                        ->select('t1.*','t1.id as personnel_id','t3.name as region', 't4.name as district');
                }

                // else if($table_name == 'par_medical_device_assesment_answers'){
                //     $qry->get();par_research_organizations
                // }wb_bomraprocesses

            //filters for product related data
            $product_id= $req->product_id;
            if(validateIsNumeric($product_id)){
                $qry->where('product_id', $product_id);
            }

            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $filters = array_filter($filters);

                //load regions for the local country
                if($table_name == 'par_regions' && isset($filters['is_local'])){
                    $qry->join('par_countries as t7', 't1.country_id', 't7.id')->select('t1.*');
                }
                else if($table_name == 'par_classification_rules'){
                    if(isset($filters['classification_id']) && isset($filters['device_type_id'])){
                        $qry->join('par_product_classificationrules as t3', 't1.id', 't3.class_rule_id');
                    }
                }
                if($table_name == 'wf_workflow_stages' && isset($filters['workflow_id'])){
                    $qry->join('wf_workflows as t7', 't7.sub_module_id', DB::raw($filters['workflow_id']))->select('t1.*');
                }
                else if($table_name == 'par_premises_types'){
                    if(isset($filters['site_level_id'])){
                        $qry->join('pms_premise_type_levels as t3', 't1.id', 't3.premise_type_id');
                    }
                }else if($table_name == 'par_districts' && isset($filters[0]) && is_array($filters[0])){
                   $count = 0;
                   $whereRaw = '';
                    foreach ($filters as $filter) {
                        if($count == 0){
                            $count = 1;
                            $whereRaw = $filter[0].' = '.$filter[1];
                        }else{
                           $whereRaw .= ' OR '.$filter[0].' = '.$filter[1];
                        }

                    }
                    if($whereRaw != ''){
                        $qry->whereRAW($whereRaw);
                    }

                }
                else if($table_name == 'par_research_organizations'){
                    if(isset($filters['application_id'])){
                        $qry->join('tra_trial_ethic_committees as t5','t1.id','=','t5.ethic_committee_id')
                            ->select('t1.*');
                        }
                }

                //get data
                $qry->where($filters);
                // if($table_name == 'par_classifications' && isset($filters['prodclass_category_id'])){
                //     $qry->leftJoin('par_prodcat_classifications as t2','t1.id', 't2.classification_id')
                //         ->select('t1.*')
                //         ->where('t2.prodclass_category_id', $filters['prodclass_category_id']);
                // }

                // else{
                //     $results = $qry->where($filters);tra_impdistributor_details
                // }
            }
           $filter = $req->filter;
            if ($filter != '') {
                $filters = (array)json_decode($filter);
                $filters = array_filter($filters);

                //load regions for the local country
                if($table_name == 'par_regions' && isset($filters['is_local'])){
                    $qry->join('par_countries as t7', 't1.country_id', 't7.id')->select('t1.*');
                }
                //get data
                $qry->where($filters);
            }
            $query = $req->input('query');
            if($query != ''){
                if($table_name == 'par_gmdn_codes'){
                    $qry->where('t1.code', 'ilike', '%' .$query . '%')->orWhere('t1.name', 'ilike', '%' .$query . '%');
                }
                else if($table_name == 'par_atc_codes'){
                    $qry->where('t1.code', 'ilike', '%' .$query . '%')->orWhere('t1.name', 'ilike', '%' .$query . '%');
                }
            }
            if($table_name == 'par_sections'){
                $qry->whereIn('id',[2, 3, 4, 7, 8, 10]);
            }


            if(!validateIsnumeric($is_config)){
                $qry->where('t1.is_enabled', 1);
            }
            $comboFilter = $req->comboFilter;
            if($comboFilter != ''){
               $qry->where('t1.code', 'ilike', '%' . $comboFilter . '%')->orWhere('t1.name', 'ilike', '%' .$comboFilter . '%');
            }
            // //paginate
            $total=$qry->count();
            $start=$req->start;
            $limit=$req->limit;
            if(isset($start)&&isset($limit) && $table_name == 'par_gmdn_codes'){
                $results = $qry->skip($start)->take($limit)->get();
             }
            else{
                $results=$qry->get();
             }

            //$results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'total' => $total,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getproductGeneraicNameParameters(Request $req)
    {
        try {
            $filters = $req->filters;


            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->join('par_sections as t2', 't1.section_id', '=', 't2.id')
                ->leftJoin('par_atc_codes as t3', 't1.atc_code_id', '=', 't3.id')
                ->select('t1.*', 't3.name as atc_code', 't3.description as atc_code_description', 't2.name as section_name');

            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $section_id = $filters['section_id'];

                $results = $qry->where(array('t1.section_id' => $section_id));
            }
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getVariationCategoriesParameters(Request $req)
    {

        try {
            $filters = $req->filters;

            $variation_type_id = $req->variation_type_id;
            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->join('par_typeof_variations as t2', 't1.variation_type_id', '=', 't2.id')
                ->join('par_modules as t3', 't1.module_id', '=', 't3.id')
                ->join('par_sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
                ->join('par_sections as t5', 't1.section_id', '=', 't5.id')
                ->select('t1.*', 't2.name as type_of_variation', 't3.name as module_name', 't4.name as sub_module_name', 't5.name as section_name');

            if (validateIsNumeric($variation_type_id)) {
                $results = $qry->where(array('t1.variation_type_id' => $variation_type_id));
            }
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }

    public function getsystemSubModules(Request $req)
    {
        try {
            $filters = $req->input('filters');
            $module_id = $req->input('module_id');
            $table_name = $req->input('table_name') . ' as t1';

            $qry = DB::table($table_name)
                ->join('par_modules as t2', 't1.module_id', '=', 't2.id')
                ->select(DB::raw("t1.*,t2.name as module_name"));

            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $module_id = $filters['module_id'];
                $qry->where(array('t1.module_id' => $module_id));
            }
            if (validateIsnumeric($module_id)) {
                $qry->where(array('t1.module_id' => $module_id));
            }
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }

    public function getRefnumbersformats(Request $req)
    {
        try {
            $table_name = 'refnumbers_formats as t1';
            $qry = DB::table($table_name)
                ->leftJoin('referencenumbers_types as t2', 't1.refnumbers_type_id', '=', 't2.id')
                ->select('t1.*', 't2.name as refnumbers_type_name');
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }

    public function getregistrationexpirytime_span(Request $req)
    {
        try {
            $filters = $req->input('filters');
            $table_name = 'par_registration_expirytime_span as t1';

            $qry = DB::table($table_name)
                ->leftJoin('par_modules as t2', 't1.module_id', '=', 't2.id')
                ->leftJoin('par_sub_modules as t3', 't1.sub_module_id', '=', 't3.id')
                ->leftJoin('par_sections as t4', 't1.section_id', '=', 't4.id')
                ->leftJoin('par_timespan_defination as t5', 't1.timespan_defination_id', '=', 't5.id')
                ->select('t1.*', 't2.name as module_name', 't3.name as sub_module_name', 't4.name as section_name', 't5.name as timespan_defination');
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }

    public function getsystemModules(Request $req)
    {
        try {
            $filters = $req->filters;

            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->select('t1.*');

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }

    public function getproductSubCategoryParameters(Request $req)
    {
        try {
            $table_name = $req->table_name . ' as t1';

            $qry = DB::table($table_name)
                ->join('par_prodclass_categories as t3', 't1.prodclass_category_id', '=', 't3.id')
                ->select('t1.*', 't3.name as product_category');
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getSubmoduleRefFormats(Request $request)
    {
        try {
            $sub_module_id = $request->input('sub_module_id');
            $qry = DB::table('tra_submodule_referenceformats as t1')
                ->join('par_sub_modules as t2', 't1.sub_module_id', '=', 't2.id')
                ->join('referencenumbers_types as t3', 't1.reference_type_id', '=', 't3.id')
                ->join('refnumbers_formats as t4', 't1.reference_format_id', '=', 't4.id')
                ->join('par_modules as t5', 't1.module_id', '=', 't5.id')
                ->select(DB::raw("t1.*,t2.name as sub_module,t3.name as reference_type,t5.name as module,
                                 CONCAT(t4.name,' (',t4.ref_format,')') as ref_format"));
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getFormFields(Request $request)
    {
        try {
            $filters = $request->filters;
            $qry = DB::table('par_form_categories as t1')
                ->leftjoin('par_formtype_fields as t2', 't1.id', '=', 't2.form_category_id')
                ->leftjoin('par_formfield_designs as t3', 't2.field_id', '=', 't3.id')
                ->select(DB::raw("t3.*"));
            $results = $qry->get();
            if ($filters != '') {
                $filters = (array)json_decode($filters);
                $form_category_id = $filters['form_category_id'];
                $res= $qry->where(array('t2.form_category_id' => $form_category_id));
              $results=$res->get();
            }
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    // public function getExcelConfigcolumns(Request $request)
    // {
    //     try {
    //         $filters = $request->filters;
    //         $qry = DB::table('par_exceluploads_config_type as t1')
    //             ->leftjoin('par_formtype_fields as t2', 't1.id', '=', 't2.form_category_id')
    //             ->select(DB::raw("t3.*"));
    //         $results = $qry->get();
    //         if ($filters != '') {
    //             $filters = (array)json_decode($filters);
    //             $form_category_id = $filters['form_category_id'];
    //             $res= $qry->where(array('t2.form_category_id' => $form_category_id));
    //           $results=$res->get();
    //         }
    //         $res = array(
    //             'success' => true,
    //             'results' => $results,
    //             'message' => 'All is well'
    //         );
    //     } catch (\Exception $exception) {
    //         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

    //     } catch (\Throwable $throwable) {
    //         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    //     }
    //     return \response()->json($res);
    // }
    public function getApplicationSections(Request $request)
    {
        try {
            $qry = DB::table('par_application_sections as t1')
                ->join('par_sub_modules as t2', 't1.sub_module_id', '=', 't2.id')
                ->join('par_modules as t3', 't1.module_id', '=', 't3.id')
                ->leftJoin('par_sections as t4', 't1.section_id', '=', 't4.id')
                ->select(DB::raw("t1.*,t2.name as sub_module,t3.name as module,t4.name as section_name"));
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getUnstructuredQueryChecklistItem(Request $request)
    {

        $filters = $request->input('filters');
        $filters = (array)json_decode($filters);

        try {

            $qry = DB::table('par_checklist_items as t1')
                ->join('par_checklist_types as t2', 't1.checklist_type_id', '=', 't2.id')
                ->join('par_checklist_categories as t3', 't2.checklist_category_id', '=', 't3.id')
                ->select(DB::raw(" t1.*, t2.name as checklist_type, t3.name as checklist_category"));
            if (count((array)$filters) > 0) {
                $qry->where($filters);
            }

            $qry->where(array('is_query' => 1));
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getUnstructuredQueryChecklistTypes(Request $request)
    {

        $filters = $request->input('filters');
        $filters = (array)json_decode($filters);

        try {

            $qry = DB::table('par_checklist_types as t2')
                ->join('par_checklist_categories as t3', 't2.checklist_category_id', '=', 't3.id')
                ->select(DB::raw(" t2.*"));
            if (count((array)$filters) > 0) {
                $qry->where($filters);
            }

            $qry->where(array('is_query' => 1));
            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getPersonnelDetails(Request $request)
    {
        $table_name = $request->table_name;
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('par_countries as t2', 't1.country_id', 't2.id')
                ->join('par_regions as t3', 't1.region_id', 't3.id')
                ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                ->select(DB::raw("t1.*,t2.name as country,t3.name as region,t4.name as district"));

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getProductClassRules(Request $request)
    {
        try {
            $qry = DB::table('par_product_classificationrules as t1')
                ->join('par_classifications as t2', 't1.classification_id', 't2.id')
                ->leftJoin('par_classification_rules as t3','t1.class_rule_id','t3.id')
                ->leftJoin('par_sections as t5','t1.section_id','t5.id')
                ->leftjoin('par_device_types as t6','t1.device_type_id','t6.id')
                ->select('t1.*', 't2.name as classification_name','t3.name as class_rule_name','t5.name as section_name','t6.name as device_type_name');

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getClassRulesParameters(Request $request)
    {
        try {
            $qry = DB::table('par_classification_rules as t1')
                ->join('par_device_types as t2', 't1.device_type_id', 't2.id')
                ->select('t1.*', 't2.name as device_type_name');

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getManRolesParameters(Request $request)
    {
        try {
            $qry = DB::table('par_manufacturing_roles as t1')
                ->join('par_sections as t2', 't1.section_id', 't2.id')
                ->select('t1.*', 't2.name as section_name');

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getApplicationAmmendment(request $req)
    {
        try {
                $qry = DB::table('par_application_ammendment as t1')
                    ->join('par_modules as t2', 't1.module_id', 't2.id')
                    ->join('par_sub_modules as t3', 't1.sub_module_id', 't3.id')
                    ->select('t1.*', 't2.name as module_name','t3.name as sub_module_name');

                $results = $qry->get();

                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }

    function getConfigDirectors(request $req){
        try {
            if($req->table_name=='tra_directorate_directors'){
                $qry=DB::table('tra_directorate_directors as t1')
                    ->leftJoin('users as t2','t1.user_id','t2.id')
                    ->leftJoin('par_directorates as t3','t1.directorate_id','t3.id')
                    ->select(DB::raw("t1.*,CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."),' ',decryptval(t2.last_name,".getDecryptFunParams().")) as user_name,t3.name as directorate_name"));

               }else{
                $qry=DB::table('authority_directors as t1')
                    ->Join('tra_directorate_directors as t2','t1.director_id','t2.id')
                    ->leftJoin('users as t3','t2.user_id','t3.id')
                    ->leftJoin('par_directorates as t4','t2.directorate_id','t4.id')
                    ->select(DB::raw("t1.*,CONCAT(decryptval(t3.first_name,".getDecryptFunParams()."),' ',decryptval(t3.last_name,".getDecryptFunParams().")) as user_name,t4.name as directorate_name"));
                  }

                $results = $qry->get();
                $results = convertStdClassObjToArray($results);
                $results = decryptArray($results);
                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = array(
                    'success' => false,
                    'message' => $exception->getMessage()
                );
            } catch (\Throwable $throwable) {
                $res = array(
                    'success' => false,
                    'message' => $throwable->getMessage()
                );
            }
            return response()->json($res);
        }
        public function getDirectoratesUnits(Request $request)
        {
            try {
                $directorate_id = $request->directorate_id;
                $results = DB::table('par_directorates_units as t1')
                    ->select('t1.*', 't2.name as directorate')
                    ->join('par_directorates as t2', 't1.directorate_id', '=', 't2.id');

                   if(validateIsNumeric($directorate_id)){
                        $results->where('t1.directorate_id',$directorate_id);
                   }
                    $results =$results->get();
                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = array(
                    'success' => false,
                    'message' => $exception->getMessage()
                );
            } catch (\Throwable $throwable) {
                $res = array(
                    'success' => false,
                    'message' => $throwable->getMessage()
                );
            }
            return $res;
        }

        public function getRetentionChargesConfig(Request $req){
        $filters = (array)json_decode($req->filters);
        $filters=array_filter($filters);
        try{
                $qry = DB::table('tra_retentioncharge_config as t1')
                        ->leftJoin('par_sections as t3','t1.section_id','=','t3.id')
                        ->leftJoin('par_prodclass_categories as t4','t1.prodclass_category_id','=','t4.id')
                        ->leftJoin('par_classifications as t5','t1.classification_id','=','t5.id')
                        ->leftJoin('par_product_types as t6','t1.product_type_id','=','t6.id')
                        ->leftJoin('par_fee_types as t7','t1.fee_type_id','=','t7.id')
                        ->leftJoin('tra_element_costs as t8','t1.element_costs_id','=','t8.id')
                        ->leftJoin('par_cost_elements as t9','t8.element_id','=','t9.id')
                        ->leftJoin('par_currencies as t10','t8.currency_id','=','t10.id')
                        ->select('t1.*','t3.name as section_name','t4.name as prodclass_category_name', 't5.name as classification_name','t6.name as product_type_name','t7.name as fee_type_name','t9.name as element_cost_name', DB::raw("CONCAT(t8.cost,' ',t10.name) as cost_amount"));

            if (count((array)$filters) > 0) {

                    $qry->where($filters);
                }



            $qry->where('t1.is_enabled',1);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    //Inserting questions from The Excel file
    public function saveAllQuestionsForMedicalAssesment(Request $request){
        try {
            //GETTING DATA FROM THE FIRST SHEET AND SAVING IT TO THE DATA BASE
            //Step 1 : request file the file from the client side
            $excelfile = $request->file('file');
                //Step 2 : get the file name,
            $excelfilename = $excelfile->getClientOriginalName();

                //Step 3 : create a temporary storage
            $filestoragepath = storage_path('app');
            $filecopypath = $excelfile->move($filestoragepath,$excelfilename);

                //Step 4 : loading the file using excel file reader
            $reader = new ReaderXlsx();
            //$reader->setReadDataOnly(true);
            $spreadsheet = $reader->load($filecopypath);

            $allsheets = $spreadsheet->getSheetCount();
            // dd($allsheets);
            // $activesheet = 0;
            $rowswithintheactivesheet = 0;
            $data_to_be_inserted = [];
            // $res = array(
            //     "success" => false,
            //     "message" => "Begining Transaction",


            // );
            DB::beginTransaction();

            $activesheet = $spreadsheet->getSheet(4);

            $rowswithintheactivesheet = $activesheet->getHighestDataRow();

                //dd($rowswithintheactivesheet);
            for($row = 1 ; $row <= $rowswithintheactivesheet; $row++)
            {

               $question = $activesheet->getCell("A{$row}")->getValue();
               $is_final_outcome = ($activesheet->getCell("B{$row}")->getValue() == '' ) ? 0 : 1;

                $data_to_be_inserted [] = [
                   'question' => $question,
                   'is_final_outcome' => $is_final_outcome,
                ];
            }

            //screening register operations
            $medical_device_assesment_questions = collect($data_to_be_inserted);
            $medical_device_assesment_questions_chunks = $medical_device_assesment_questions->chunk(50);

            foreach($medical_device_assesment_questions_chunks as $chunk){
                DB::table('par_medical_device_assesment_questions')->insert($chunk->toArray());
            }
            $res = array(
                "success" => true,
                "message" => "Saved Sucessfully",
                "results" => $data_to_be_inserted

            );

            DB::commit();

            FacadesFile::delete($filecopypath);


            //Step 6 : Fetch all the rows



        } catch (\Exception $exception) {

            DB::rollBack();

            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {

            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
            return \response()->json($res);
    }

    //Synchronize a question to its Predecessor
    public function synchronizeAQuestionToItsPredecessor(Request $request){

        try{
            $current_question_id = $request->input('current_question_id');
            $preceeding_question_id = $request->input('preceeding_question_id');


            $query_response =  DB::table('par_question_tracker')->insert(
                [
                    'current_question_id' => $current_question_id,
                    'preceeding_question_id' => $preceeding_question_id,
                ]
            );

            $res = array(
                'success' => true,
                'message' => 'data inserted',
                'results' => $query_response,
            );


        }
        catch (\Exception $exception){
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }catch (\Throwable $throwable){
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);
    }
    public function getProductInvoiceChargesConfig(Request $req){
        $filters = (array)json_decode($req->filters);
        $filters=array_filter($filters);
        try{
                $qry = DB::table('tra_productregcharge_config as t1')
                        ->leftJoin('par_sections as t3','t1.section_id','=','t3.id')
                        ->leftJoin('par_prodclass_categories as t4','t1.prodclass_category_id','=','t4.id')
                        ->leftJoin('par_classifications as t5','t1.classification_id','=','t5.id')
                        ->leftJoin('par_product_types as t6','t1.product_type_id','=','t6.id')
                        ->leftJoin('par_fee_types as t7','t1.fee_type_id','=','t7.id')
                        ->leftJoin('tra_element_costs as t8','t1.element_costs_id','=','t8.id')
                        ->leftJoin('par_cost_elements as t9','t8.element_id','=','t9.id')
                        ->leftJoin('par_currencies as t10','t8.currency_id','=','t10.id')
                        ->leftJoin('par_modules as t11','t1.module_id','=','t11.id')
                        ->leftJoin('par_sub_modules as t12','t1.sub_module_id','=','t12.id')

                        ->select('t1.*','t3.name as section_name','t4.name as prodclass_category_name', 't5.name as classification_name','t6.name as product_type_name','t7.name as fee_type_name','t9.name as element_cost_name','t11.name as module_name','t12.name as sub_module_name',DB::raw("CONCAT(t8.cost,' ',t10.name) as cost_amount"));

            if (count((array)$filters) > 0) {

                    $qry->where($filters);
                }



            $qry->where('t1.is_enabled',1);
            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => returnMessage($results)
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getPremiseInvoiceChargesConfig(Request $req){
        $filters = (array)json_decode($req->filters);
            $filters=array_filter($filters);
            try{
                    $qry = DB::table('tra_premiseregcharge_config as t1')
                            ->leftJoin('par_sections as t3','t1.section_id','=','t3.id')
                            ->leftJoin('par_fee_types as t7','t1.fee_type_id','=','t7.id')
                            ->leftJoin('tra_element_costs as t8','t1.element_costs_id','=','t8.id')
                            ->leftJoin('par_cost_elements as t9','t8.element_id','=','t9.id')
                            ->leftJoin('par_currencies as t10','t8.currency_id','=','t10.id')
                            ->leftJoin('par_sub_modules as t12','t1.sub_module_id','=','t12.id')

                            ->select('t1.*','t3.name as section_name','t7.name as fee_type_name','t9.name as element_cost_name','t12.name as sub_module_name',DB::raw("CONCAT(t8.cost,' ',t10.name) as cost_amount"));

                if (count((array)$filters) > 0) {

                        $qry->where($filters);
                    }



                $qry->where('t1.is_enabled',1);
                $results = $qry->get();
                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => returnMessage($results)
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
    }

    public function getElementCostWithCurrency(Request $req){
        $filters = (array)json_decode($req->filters);
        $filters=array_filter($filters);
        try{
            $qry = DB::table('tra_element_costs as t1')
                    ->leftjoin('par_currencies as t2','t1.currency_id','t2.id')
                    ->select('t1.*','t2.name as currency_name');

        if (count((array)$filters) > 0) {

                        $qry->where($filters);
                    }



                $qry->where('t1.is_enabled',1);
                $results = $qry->get();
                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => returnMessage($results)
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
    }

    public function saveDocumentMasterListConfig(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->post();
            if (!isset($post_data['model'])) {
                $table_name = $post_data['table_name'];

            } else {
                $table_name = $post_data['model'];

            }

            $id = $post_data['id'];
            $unsetData = $req->input('unset_data');
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            $where = array(
                'id' => $id
            );
            //generate Code
            $ref_id = $table_data['ref_format_id'];
            $controldocument_type_id = $table_data['controldocument_type_id'];
            $directorate_unit_id = $table_data['directorate_unit_id'];
            $directorate_id = $table_data['directorate_id'];
            //zamra|/|doc_type_code|/|directorate_code|/|directorate_unit_code|/|doc_serial_number
            $doc_type = DB::table('par_controldocument_types')->where('id',$controldocument_type_id)->select('code')->first();
            $directorate_unit = DB::table('par_directorate_units')->where('id',$directorate_unit_id)->select('code')->first();
            $directorate = DB::table('par_directorates')->where('id',$directorate_id)->select('code')->first();
            $codes_array['doc_type_code'] = $doc_type->code;
            $codes_array['directorate_unit_code'] = $directorate_unit->code;
            $codes_array['directorate_code'] = $directorate->code;
            $codes_array['serial_no'] = $table_data['doc_serial_number'];

            $code = generateRefNumber($codes_array, $ref_id);

            $table_data['code']=$code;
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {
                    unset($table_data['created_on']);
                    unset($table_data['created_by']);
                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $res = updateRecord($table_name,  $where, $table_data);
                }else{
                    dd('hew');
                }
            } else {
                $res = insertRecord($table_name, $table_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getParameterGridColumnsConfig(Request $req)
    {
        $def_id = $req->def_id;
        $param = DB::table('par_parameter_definations')->where('id',$def_id)->first();
        $param_joins = DB::table('par_parameter_join_tables')->where('param_id',$param->id)->get();
        $labels = array();
        foreach ($param_joins as $param_join) {
            $labels[] = $param_join->table_label;
        }
        $param_columns = DB::getSchemaBuilder()->getColumnListing($param->table_name);
        $join_columns = DB::table('par_parameter_join_tables')->select('param_column_name')->where('param_id',$param->id)->get();
        $col_diff = array();
        foreach ($join_columns as $column) {
            $col_diff[] = $column->param_column_name;
        }

        $results = array_merge( $param_columns, $labels);

        foreach ($results as $key => $value) {
            if($value == 'is_enabled'){
                    unset($results[$key]);
            }
            if($value == 'created_on'){
                    unset($results[$key]);
            }
            if($value == 'created_by'){
                    unset($results[$key]);
            }
            if($value == 'dola'){
                    unset($results[$key]);
            }
            if($value == 'altered_by'){
                    unset($results[$key]);
            }
            if($value == 'id'){
                    unset($results[$key]);
            }
            if($value == 'altered_on'){
                    unset($results[$key]);
            }
            if(in_array($value, $col_diff)){
                unset($results[$key]);
            }
        }

        $pure_array = array();
        foreach ($results as $result) {
            $pure_array[] = $result;
        }
        $res = array(
                    'success' => true,
                    'results' => $pure_array,
                    'title' => $param->param_title,
                    'table_name'=>$param->table_name,
                    'message' => 'All is well'
                );
            return response()->json($res);
    }

    public function getParameterGridConfig(Request $req){
        $def_id = $req->def_id;
        $param = DB::table('par_parameter_definations')->where('id',$def_id)->first();
        $param_joins = DB::table('par_parameter_join_tables')->where('param_id',$param->id)->get();

        $qry = DB::table($param->table_name.' as t1')->select('t1.*');
        $join_columns = DB::table('par_parameter_join_tables')->select('param_column_name')->where('param_id',$param->id)->get();
        $col_diff = array();
        foreach ($join_columns as $column) {
        $col_diff[] = $column->param_column_name;
        }
        $t = 2;

        foreach ($param_joins as $joins) {
        if($joins->join_type_id == 1){
            $qry->join($joins->join_table_name.' as t'.$t,'t1.'.$joins->param_column_name,'t'.$t.'.'.$joins->join_column_name);
        }else{
            $qry->leftJoin($joins->join_table_name.' as t'.$t,'t1.'.$joins->param_column_name,'t'.$t.'.'.$joins->join_column_name);
        }
            $qry->addSelect("t".$t.".".$joins->join_disp_column_name." as ".$joins->table_label);
            $t++;
        }
        //checks for adding selects and removing columns
        if($param->table_name == 'tra_personnel_information'){
            $qry->addSelect('t1.id as personnel_id','t1.name as personnel_name');
        }
        if($param->table_name == 'tra_permitsenderreceiver_data'){
            $qry->addSelect('t1.id as consignee_id','t1.name as consignee_name');
        }
		$total = $qry->count();
		$results = $qry->skip($req->start)->take($req->limit)->get();
        //$results = $qry->get();


        $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well',
					'total' => $total
                );
        return $res;
    }

    public function getParameterFormColumnsConfig(Request $req)
    {
        $def_id = $req->def_id;
        $param = DB::table('par_parameter_definations')->where('id',$def_id)->first();
        $param_joins = DB::table('par_parameter_join_tables')->where('param_id',$param->id)->orderBy('id','ASC')->get();
        $labels = array();
        $child = true;
        $param_column_name='';
        $logic = '';
        foreach ($param_joins as $param_join) {
            if($param_join->is_parent == 1){
                $logic = $param_join->logic;
                $labels[] = array('table'=>$param_join->join_table_name, 'column'=>$param_join->join_column_name,'label'=>ucwords($param_join->table_label),'join_disp_column_name'=>$param_join->join_disp_column_name,'param_column_name'=>$param_join->param_column_name,'is_child'=>0, 'is_parent'=>1,'logic'=>$logic);
                $param_column_name = $param_join->param_column_name;

            }
            else if($param_join->is_child == 1){
                $labels[] = array('table'=>$param_join->join_table_name, 'column'=>$param_join->join_column_name,'label'=>ucwords($param_join->table_label),'join_disp_column_name'=>$param_join->join_disp_column_name,'param_column_name'=>$param_join->param_column_name,'is_child'=>1, 'is_parent'=>0, 'parent_combo_name'=> $param_column_name);
                $param_column_name = '';
                $logic = '';
            }else{
                $labels[] = array('table'=>$param_join->join_table_name, 'column'=>$param_join->join_column_name,'label'=>ucwords($param_join->table_label),'join_disp_column_name'=>$param_join->join_disp_column_name,'param_column_name'=>$param_join->param_column_name,'is_child'=>0, 'is_parent'=>0);
            }
        }
        $colums = DB::getDoctrineSchemaManager()->listTableColumns($param->table_name);
        //$colums = DB::select('SHOW COLUMNS FROM '.$param->table_name);
        $fields = array();
        foreach ($colums as $column) {

            if($column->getNotnull()){
                $fields[] = ['field'=>$column->getName(),'label'=>ucwords($column->getName()), 'null'=>false];
            }else{
                $fields[] = ['field'=>$column->getName(),'label'=>ucwords($column->getName()),'null'=>true];
            }

        }
        //dd($fields);
        $param_columns = $fields;//DB::getSchemaBuilder()->getColumnListing($param->table_name);
        $join_columns = DB::table('par_parameter_join_tables')->select('param_column_name')->where('param_id',$param->id)->get();
        $col_diff = array();
        foreach ($join_columns as $column) {
        $col_diff[] = ucwords($column->param_column_name);
        }
        foreach ($param_columns as $key => $value) {
        if($value['label'] == ucwords('is_enabled')){
                unset($param_columns[$key]);
        }
        if($value['label'] == ucwords('created_on')){
                unset($param_columns[$key]);
        }
        if($value['label'] == ucwords('created_by')){
                unset($param_columns[$key]);
        }
        if($value['label'] == ucwords('dola')){
                unset($param_columns[$key]);
        }
        if($value['label'] == ucwords('altered_by')){
                unset($param_columns[$key]);
            }
        if($value['label'] == ucwords('id')){
                unset($param_columns[$key]);
        }
        if($value['label'] == ucwords('altered_on')){
                unset($param_columns[$key]);
        }
        if($value['label'] == ucwords('is_other_config')){
                unset($param_columns[$key]);
        }
        if(in_array($value['label'], $col_diff)){
            unset($param_columns[$key]);
        }

    }


        $pure_array = array();
        foreach ($param_columns as $result) {
            $pure_array[] = $result;
        }
        // $labels = array_reverse($labels);
        $res = array(
                    'success' => true,
                    'main_fields' => $pure_array,
                    'join_fields' => $labels,
                    'table_name'=>$param->table_name,
                    'message' => 'All is well'
                );

            return response()->json($res);
    }
    public function getCountryMappedProcedures(Request $req){
            $assessment_procedure_id = $req->assessment_procedure_id;
            $category = $req->category;
            if(validateIsNumeric($assessment_procedure_id)){
            if(validateIsNumeric($category) && $category == 1){
            $Countries = DB::table('par_countries as t1')
                        ->leftjoin('par_assessment_procedures_countries as t2',function ($join) use ($assessment_procedure_id) {
                            $join->on('t1.id','t2.country_id')
                                ->where('t2.assessment_procedure_id',$assessment_procedure_id);
                            })
                        ->select('t1.id as country_id','t1.name as country_name', 't2.id as is_mapped');
            }else if(validateIsNumeric($category) && $category == 2){
            $Countries = DB::table('par_countries as t1')
                    ->leftjoin('par_gmpassessmentprocedure_countries as t2',function ($join) use ($assessment_procedure_id) {
                        $join->on('t1.id','t2.country_id')
                            ->where('t2.gmp_assessment_id',$assessment_procedure_id);
                        })
                    ->select('t1.id as country_id','t1.name as country_name', 't2.id as is_mapped');
                }else{
                return array(
                        'success' => false,
                        'message' => 'Assessment category not set either product/gmp'
                    );
                }

            $result = $Countries->get();
            $res = array(
                        'success'=>true,
                        'message'=>'all is well',
                        'results'=>$result
                    );
        }else{
            $res = array(
                        'success'=>false,
                        'message'=>'Please provide an assessment procedure'
                    );
        }
        return json_encode($res);
    }
    public function mapProcedureToCountry(Request $req){
            $selected = $req->input('selected');
            $assessment_procedure_id = $req->input('assessment_procedure_id');
            $category = $req->input('category');
            $user = $this->user_id;
            $country_idArray = json_decode($selected);

            DB::beginTransaction();
            try{
                if(validateIsNumeric($category) && $category == 1){
                    DB::table('par_assessment_procedures_countries')
                        ->where('assessment_procedure_id',$assessment_procedure_id)
                        ->delete();
                    foreach ($country_idArray as $country_id) {

                                $res = insertRecord('par_assessment_procedures_countries', ['assessment_procedure_id'=>$assessment_procedure_id, 'country_id'=>$country_id], $user);

                        }
                }
                else if(validateIsNumeric($category) && $category == 2){
                    DB::table('par_gmpassessmentprocedure_countries')
                        ->where('gmp_assessment_id',$assessment_procedure_id)
                        ->delete();
                    foreach ($country_idArray as $country_id) {

                                $res = insertRecord('par_gmpassessmentprocedure_countries', ['gmp_assessment_id'=>$assessment_procedure_id, 'country_id'=>$country_id], $user);

                        }
                }else{
                    DB::rollBack();
                    return array(
                        'success' => false,
                        'message' => 'Assessment category not set either product/gmp'
                    );
                }


                $res = array(
                        'success' => true,
                        'message' => 'Countries Mapped to Procedure(s) successfully'
                    );
            DB::commit();
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
        return json_encode($res);

    }
    public function getOnlineApplicationStatus(Request $req)
    {
        try {
                    $results = DB::Connection('portal_db')->table('wb_statuses as t1')->where('has_receiving', 1);
                    $results =$results->get();
                    $res = array(
                        'success' => true,
                        'results' => $results,
                        'message' => 'All is well'
                    );
                } catch (\Exception $exception) {
                    $res = array(
                        'success' => false,
                        'message' => $exception->getMessage()
                    );
                } catch (\Throwable $throwable) {
                    $res = array(
                        'success' => false,
                        'message' => $throwable->getMessage()
                    );
                }
                return $res;
    }
    public function saveConfigPortalCommonData(Request $req)
        {
            try {
                $user_id = \Auth::user()->id;
                $post_data = $req->post();
                if (!isset($post_data['model'])) {
                    $table_name = $post_data['table_name'];

                } else {
                    $table_name = $post_data['model'];

                }
                $id = $post_data['id'];
                $unsetData = $req->input('unset_data');
                //unset unnecessary values
                unset($post_data['_token']);
                unset($post_data['table_name']);
                unset($post_data['model']);
                unset($post_data['id']);
                unset($post_data['unset_data']);
                if (isset($unsetData)) {
                    $unsetData = explode(",", $unsetData);
                    $post_data = unsetArrayData($post_data, $unsetData);
                }
                $table_data = $post_data;
                //add extra params
                $table_data['created_on'] = Carbon::now();
                $table_data['created_by'] = $user_id;
                $where = array(
                    'id' => $id
                );

                if (validateIsNumeric($id)) {

                    if (recordExists($table_name, $where, 'portal_db')) {
                        unset($table_data['created_on']);
                        unset($table_data['created_by']);
                        $table_data['dola'] = Carbon::now();
                        $table_data['altered_by'] = $user_id;
                        $res = updateRecord($table_name, $where, $table_data, 'portal_db');
                    }else{
                        $res = "Update record not found";
                    }
                } else {

                    $res = insertRecord($table_name, $table_data,  'portal_db');
                }

            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
        }
        public function getConfigParamFromPortalTable(Request $req)
        {
            try {
                $filters = $req->filters;
                $table_name = $req->table_name . ' as t1';


                $qry = DB::Connection('portal_db')->table($table_name)
                // ->where('is_enabled',1)
                    ->select('t1.*');

                if ($filters != '') {
                    $filters = (array)json_decode($filters);
                    $filters = array_filter($filters);
                    $results = $qry->where($filters);
                }

                $results = $qry->get();

                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function saveAuditedTableLogger(Request $req){
            try {
                $user_id = \Auth::user()->id;
                $post_data = $req->post();
                if (!isset($post_data['model'])) {
                    $table_name = $post_data['table_name'];
                } else {
                    $table_name = $post_data['model'];
                }
                $db_con = 'mysql';
                $id = $post_data['id'];
                $unsetData = $req->input('unset_data');
                //unset unnecessary values
                unset($post_data['_token']);
                unset($post_data['table_name']);
                unset($post_data['model']);
                unset($post_data['id']);
                unset($post_data['unset_data']);
                if (isset($unsetData)) {
                    $unsetData = explode(",", $unsetData);
                    $post_data = unsetArrayData($post_data, $unsetData);
                }
                $table_data = $post_data;
                //add extra params
                $table_data['created_on'] = Carbon::now();
                $table_data['created_by'] = $user_id;
                $where = array(
                    'id' => $id
                );

                if (validateIsNumeric($id)) {

                    if (recordExists($table_name, $where)) {
                        unset($table_data['created_on']);
                        unset($table_data['created_by']);
                        $table_data['dola'] = Carbon::now();
                        $table_data['altered_by'] = $user_id;

                        $res = updateRecord($table_name, $where, $table_data,  $db_con);
                    }else{
                        $res = "Update record not found";
                    }
                } else {

                    $res = insertRecord($table_name, $table_data, $db_con);

                }

            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
        }
        public function getAppModuleFeeConfig(Request $req)
        {
            $user_id = \Auth::user()->id;
            $module_id = $req->module_id;
            try{
                $qry = DB::table('tra_appmodules_feesconfigurations as t1')
                    ->leftJoin('par_modules as t2', 't1.module_id', 't2.id')
                    ->leftJoin('par_sub_modules as t3', 't1.sub_module_id', 't3.id')
                    ->leftJoin('par_sections as t4', 't1.section_id', 't4.id')
                    ->leftJoin('par_assessmentprocedure_types as t5', 't1.assessmentprocedure_type_id', 't5.id')
                    ->leftJoin('par_prodclass_categories as t6', 't1.prodclass_category_id', 't6.id')
                    ->leftJoin('par_product_subcategories as t7', 't1.product_subcategory_id', 't7.id')
                    ->leftJoin('par_product_origins as t9', 't1.product_origin_id', 't9.id')
                    ->leftJoin('par_applicationfee_types as t10', 't1.application_feetype_id', 't10.id')
                    ->leftJoin('par_classifications as t11', 't1.classification_id', 't11.id')
                    ->leftJoin('tra_element_costs as t12', 't1.element_costs_id', 't12.id')
                    ->leftJoin('par_currencies as t14', 't12.currency_id', 't14.id')
                    ->leftJoin('par_fee_types as t15', 't12.fee_type_id', 't15.id')
                    ->leftJoin('par_cost_categories as t16', 't12.cost_category_id', 't16.id')
                    ->leftJoin('par_cost_sub_categories as t17', 't12.sub_cat_id', 't17.id')
                    ->leftJoin('par_cost_elements as t18', 't12.element_id', 't18.id')
                    ->leftJoin('par_businesstype_class as t19', 't1.businesstype_class_id', 't19.id')
                    ->leftJoin('par_premises_types as t20', 't1.premise_type_id', 't20.id')
                    ->leftJoin('par_gmplicensetypes_details as t21', 't1.gmp_type_id', 't21.id')
                    ->leftJoin('par_importexport_permittypes as t22', 't1.importexport_permittype_id', 't22.id')
                    ->select('t12.*', 't2.name as module', 't3.name as sub_module', 't4.name as section', 't5.name as assessment_proceduretype', 't6.name as prodclass_category','t18.name as cost_element', 't7.name as product_subcategory', 't9.name as product_origin', 't10.name as applicationfeetype', 't1.*', 't11.name as classification_name','t15.name as fee_type','t16.name as cost_category','t17.name as cost_sub_category', DB::raw("CONCAT(t12.costs,' (',t14.name,')') as element_cost"), 't19.name as business_type_class', 't20.name as premise_type', 't21.name as gmp_type', 't22.name as importexport_permittype');
                if(validateIsNumeric($module_id)){
                    $qry->where('t1.module_id', $module_id);
                }
                $results = $qry->get();
                $res = array(
                    'success'=>true,
                    'message'=>'All is well',
                    'results'=>$results
                );
            }
            catch (\Exception $exception) {
                    $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                }
            catch (\Throwable $throwable) {
                    $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                }
            return response()->json($res);
        }
        public function getMappedFormFieldCombosTable(Request $req){
            $form_category_id = $req->form_category_id;
            try{
                $qry = DB::table('par_formtype_fields as t1')
                        ->leftjoin('par_formfield_designs as t2', 't1.field_id', 't2.id')
                        ->select('t2.*')
                        ->where(['t1.form_category_id' => $form_category_id])
                        ->whereIn('t2.form_field_type_id', [6, 7, 9]);

                $results = $qry->get();
                $res = array(
                        'success'=>true,
                        'message'=>'All is well',
                        'results'=>$results
                    );
                }

            catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
                return response()->json($res);
        }
        public function getFormFieldRelations(Request $req)
        {
        try{
            $form_category_id = $req->form_category_id;
            $qry = DB::table('par_form_categories as t1')
                    ->leftJoin('par_formtype_fields as t2', 't1.id', 't2.form_category_id')
                    ->leftJoin('par_formfield_designs as t3', 't2.field_id', 't3.id')
                    //->leftJoin('par_formfield_relations as t4', 't3.id', 't4.form_fielddesign_id')
                    ->leftJoin('par_formfield_relations as t4', function ($join) use ($form_category_id) {
                        $join->on("t3.id", "=", "t4.form_fielddesign_id")
                            ->where("t4.form_category_id", "=", $form_category_id);
                    })
                    ->select('t3.*', 't4.*', 't2.field_id')
                    ->whereIn('t3.form_field_type_id', [ 6, 7, 9])
                    ->Where('t1.id', $form_category_id);

                $results = $qry->get();
                $res = array(
                    'success'=>true,
                    'message'=>'All is well',
                    'results'=>$results
                );
            }
            catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);

        }
        public function saveFormFieldRelations(Request $req)
        {
            try{
                $relation_details = $req->relation_details;
                $relation_array = json_decode($relation_details);
                $table_name = 'par_formfield_relations';
                $form_category_id = $req->form_category_id;
                $user_id = \Auth::user()->id;
                $res = array('success'=>true, 'message'=>'No record to update');
                foreach ($relation_array as $item) {
                    $table_data = convertStdClassObjToArray($item);
                    $where = array('form_fielddesign_id'=>$item->form_fielddesign_id, 'form_category_id' => $form_category_id);
                    //delete previous entries
                    deleteRecord($table_name, $where, $user_id);
                    if($item->bind_column != '' || $item->parent_field_id > 0 || $item->has_logic != ''){
                        $table_data['form_category_id'] = $form_category_id;
                        $res = insertRecord($table_name, $table_data, $user_id);
                    }else{
                        $res = array('success'=>true, 'message'=>'updated successfully');
                    }
                }
                //delete any orphaned entry
                    DB::table('par_formfield_relations')->whereRaw('parent_field_id is Null AND has_logic != 1')->delete();

            }
            catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);

        }
        public function prepareInterfaceBasedonConfig(Request $req)
        {
            try{
                $module_id = $req->module_id;
                $sub_module_id = $req->sub_module_id;
                $section_id = $req->section_id;
                $premise_type_id = $req->premise_type_id;
                $prodclass_category_id = $req->prodclass_category_id;
                $importexport_permittype_id = $req->importexport_permittype_id;

                $where = array(
                    'module_id'=>$module_id,
                    'sub_module_id'=>$sub_module_id
                );
                if(validateIsNumeric($section_id) && $module_id != 4){
                    $where['section_id'] = $section_id;
                }
                if($module_id == 1 && validateIsnumeric($prodclass_category_id)){
                    $where['prodclass_category_id'] = $prodclass_category_id;
                }
                if($module_id == 2 && validateIsnumeric($premise_type_id)){
                    $where['premise_type_id'] = $premise_type_id;
                }
                if($module_id == 4 && validateIsnumeric($importexport_permittype_id)){
                    $where['importexport_permittype_id'] = $importexport_permittype_id;
                }
                if($module_id == 12 && validateIsnumeric($importexport_permittype_id)){
                    $where['importexport_permittype_id'] = $importexport_permittype_id;
                }


                $form_category_id = getSingleRecordColValue('par_form_categories', $where, 'id');

                if(validateIsnumeric($form_category_id)){
                    $qry = DB::table('par_formtype_fields as t22')
                        ->Join('par_formfield_designs as t33', 't22.field_id', 't33.id')
                    // ->leftJoin('par_formfield_relations as t2', 't33.id', 't2.parent_field_id')
                        ->leftJoin('par_formfield_relations as t2', function ($join) use ($form_category_id) {
                                $join->on("t33.id", "=", "t2.parent_field_id")
                                    ->where("t2.form_category_id", "=", $form_category_id);
                            })
                        ->leftJoin('par_formfield_designs as t3', 't2.form_fielddesign_id', 't3.id')
                        ->leftJoin('par_formfield_designs as t4', 't2.parent_field_id', 't4.id')
                        ->leftJoin('par_form_field_types as t5', 't33.form_field_type_id', 't5.id')
                        ->leftJoin('par_formfield_relations as t6', function ($join) use ($form_category_id) {
                                $join->on("t33.id", "=", "t6.form_fielddesign_id")
                                    ->where("t6.form_category_id", "=", $form_category_id);
                            })
                        ->where('t22.form_category_id', $form_category_id)
                        ->select('t22.column_width','t33.id','t33.displayfield','t33.valuefield','t33.combo_table','t33.form_field_type_id','t33.field_name','t33.def_id','t33.formfield','t33.tpl_block', 't22.is_hidden','t33.label','t33.group', 't33.group_title', 't22.is_enabled','t22.is_mandatory','t22.is_readOnly','t2.has_relation','t2.bind_column', 't3.field_name as child_combo', 't4.field_name as parent_combo','t5.name as xtype','t2.id as is_parent','t6.other_logic', 't6.has_logic');
                    $qry->orderBy('t22.order_no', 'ASC');
                    //$qry->unique('t33.id');

                    $results = $qry->get();
                    foreach ($results as $field) {
                        if($field->is_parent){
                            $no_children = DB::table('par_formfield_relations as t1')
                                            ->leftJoin('par_formfield_designs as t3', 't1.form_fielddesign_id', 't3.id')
                                            ->select('t1.*','t3.field_name as child_combo')
                                            ->where(['parent_field_id' => $field->id, 't1.form_category_id'=>$form_category_id])->get();

                            if($no_children->count() > 1){
                                $i = 0;
                                $field->is_multiparent = 1;
                                foreach ($no_children as $child) {
                                    $bind_column = 'bind_column'.$i;
                                    $child_combo = 'child_combo'.$i;
                                    $field->$bind_column = $child->bind_column;
                                    $field->$child_combo = $child->child_combo;
                                    $i++;
                                }
                                $field->total_children = $i;

                            }

                        }
                    }
                    $res = array('success' => true, 'results'=>$results, 'message'=>'All is well');
                }else{
                    $res = array('success' => false, 'message'=>'No form setup for the category');
                }

            }catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
        }
        public function saveModuleFeeConfigCommonData(Request $req)
        {
            try{
                $user_id = \Auth::user()->id;
                $post_data = $req->post();
                $db_con = 'pgsql';
                $table_name = $post_data['table_name'];
                if (isset($post_data['db_con']) && $post_data['db_con'] != '') {
                    $db_con = $post_data['db_con'];
                }
                unset($post_data['db_con']);
                $id = $post_data['id'];
                $unsetData = $req->input('unset_data');
                //unset unnecessary values
                unset($post_data['_token']);
                unset($post_data['table_name']);
            //   dd($user_id);
                unset($post_data['id']);
                unset($post_data['unset_data']);
                if (isset($unsetData)) {
                    $unsetData = explode(",", $unsetData);
                    $post_data = unsetArrayData($post_data, $unsetData);
                }
                $table_data = $post_data;
                //get mapped element cost
                $element_where = array(
                    'fee_type_id' => $table_data['fee_type_id'],
                    'element_id' => $table_data['element_id'],
                    'applicationfee_types_id' => $table_data['application_feetype_id'],
                    'currency_id' => $table_data['currency_id'],
                    'formula' => $table_data['formula']
                );

                    //unset cost element items
                    unset($table_data['fee_type_id']);
                    unset($table_data['element_id']);
                    unset($table_data['formula']);
                    unset($table_data['is_fast_track']);
                    unset($table_data['currency_id']);
                    unset($table_data['cost']);
                    unset($table_data['costs']);

                    unset($table_data['formula_rate']);

                    //add extra params
                    $table_data['created_on'] = Carbon::now();
                    $table_data['created_on'] = Carbon::now();
                    $table_data['element_costs_id'] = $req->element_costs_id;
                    $where = array(
                        'id' => $id
                    );

                    if (validateIsNumeric($id)) {

                        if (recordExists($table_name, $where)) {
                            unset($table_data['created_on']);
                            unset($table_data['created_by']);
                            $table_data['dola'] = Carbon::now();
                            $table_data['altered_by'] = $user_id;
                            $res = updateRecord($table_name, $where, $table_data, $db_con);
                        }else{
                            $res = "Update record not found";
                        }
                    } else {
                        $res = insertRecord($table_name, $table_data);
                        // $db_con
                    }

            }catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
        }
        public function getNewInvoiceQuotation(Request $req){
            $module_id = $req->module_id;
            $sub_module_id = $req->sub_module_id;
            $section_id = $req->section_id;
            $assessment_procedure_id = $req->assessment_procedure_id;
            $classification_id = $req->classification_id;
            $prodclass_category_id = $req->prodclass_category_id;
            $prodclass_subcategory_id = $req->prodclass_subcategory_id;
            $product_origin_id = $req->product_origin_id;
            $applicationfeetype = $req->applicationfeetype;
            $element_data = DB::table('tra_element_costs')->first();
            //where
            $res = array('success'=>true, 'results'=>$element_data, 'message'=>'all is well');
            return response()->json($res);
        }
        public function getAllAvailableAnswers(){
            $answers = DB::table('par_medical_device_assesment_answers')->get();

            $res = array(
                'success' => true,
                'results' => $answers,
                'message' => 'All is well',

            );

            return $res;

        }
    public function getTableslist(Request $Request){
            $in_db=$Request->in_db;
            $prefix=$Request->prefix;
            if($in_db == 'Portal DB'){
            $tables = DB::connection('portal_db')->getDoctrineSchemaManager()->listTableNames();
            }else{
            $tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
            }
            try {
                if(validateIsNumeric($prefix)){
                    $is_filtered = true;
                    switch ($prefix) {
                        case 1:
                            $prefix_txt = 'tra_';
                            break;
                        case 2:
                            $prefix_txt = 'wf_';
                            break;
                        case 3:
                            $prefix_txt = 'par_';
                            break;

                        default:
                            $is_filtered = false;
                            break;
                    }
                }else{
                    $is_filtered = false;
                }

                foreach ($tables as $table) {
                    if($is_filtered){
                        if(strpos(" ".$table, $prefix_txt) == 1) {
                            $data[] = array('table_name'=>$table);
                        }
                    }else{
                        $data[] = array('table_name'=>$table);
                    }

                }
                $res = array(
                    'success' => true,
                    'results' => $data,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);


        }
    public function saveParameterConfig(Request $req)
        {
        try{
            $id = $req->id;
            //$menu_id = $req->menu_id;
            $param_title = $req->param_title;
            $param_name= $req->param_name;
            $table_name= $req->table_name;
            $no_joins= $req->no_joins;

            DB::beginTransaction();
            //insert the defination
            $user_id = \Auth::user()->id;
            $table_data['created_on'] = Carbon::now();
            $table_data['created_by'] = $user_id;
            //$table_data['menu_id'] = $menu_id;
            $table_data['param_title'] = $param_title;
            $table_data['param_name'] = $param_name;
            $table_data['table_name'] = $table_name;
            $table_data['no_joins'] = $no_joins;
            $param_def_table_name = 'par_parameter_definations';
            $where = array(
                                'id' => $id
                            );

                if (isset($id) && $id != "") {
                    if (recordExists($param_def_table_name, $where)) {
                        unset($table_data['created_on']);
                        unset($table_data['created_by']);
                        $table_data['dola'] = Carbon::now();
                        $table_data['altered_by'] = $user_id;
                        $res = updateRecord($param_def_table_name, $where, $table_data);
                    }
                } else {
                    $res = insertRecord($param_def_table_name, $table_data);
                }

            if($res['success']){
                $param_id = $res['record_id'];
                $next_is_child = false;
                //delete existing trace of the param
                DB::table('par_parameter_join_tables')->where('param_id',$param_id)->delete();
                for ($i = $no_joins-1; $i >= 0; $i--) {

                    $join_type_id = $req->input('join_type_id'.$i);
                    $join_table_name = $req->input('join_table_name'.$i);
                    $join_column_name = $req->input('join_column_name'.$i);
                    $param_column_name = $req->input('param_column_name'.$i);
                    $table_label = $req->input('table_label'.$i);
                    $join_disp_column_name = $req->input('join_disp_column_name'.$i);
                    $is_parent = $req->input('is_parent'.$i);
                    $logic = $req->input('logic'.$i);
                    if($next_is_child){
                        $is_child = 1;
                    }else{
                        $is_child = 0;
                    }
                    if($is_parent == 1){
                        $next_is_child = true;
                    }else{
                        $next_is_child = false;
                    }

                    //insert tables to depedent
                    $data = array(
                        'param_id'=>$param_id,
                        'join_type_id'=>$join_type_id,
                        'join_table_name'=>$join_table_name,
                        'join_column_name'=>$join_column_name,
                        'join_disp_column_name'=>$join_disp_column_name,
                        'param_column_name'=>$param_column_name,
                        'table_label'=>$table_label,
                        'created_on'=>Carbon::now(),
                        'created_by'=>$user_id,
                        'is_parent'=>$is_parent,
                        'is_child'=>$is_child,
                        'logic'=>$logic
                    );
                    $res = insertRecord('par_parameter_join_tables', $data);
                    if($res['success'] == false){
                        return json_encode($res);
                    }
            }
            $res = array(
                    'success' => true,
                    'message' => 'Saved successfully'
                );
            }


            DB::commit();
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__));
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__));
            }
        return json_encode($res);
    }
    public function getParameterConfig(Request $req)
    {
        $def_id = $req->input('def_id');
            try {
                $param = DB::table('par_parameter_definations')->where('id',$def_id)->first();
                $param_joins = DB::table('par_parameter_join_tables')->where('param_id',$param->id)->get();
                $no_joins = $param->no_joins;
                $results = array();
                $i = 0;
                foreach ($param_joins as $param_join) {
                    $results['join_type_id'.$i] = $param_join->join_type_id;
                    $results['join_table_name'.$i] = $param_join->join_table_name;
                    $results['join_column_name'.$i] = $param_join->join_column_name;
                    $results['param_column_name'.$i] = $param_join->param_column_name;
                    $results['join_disp_column_name'.$i] = $param_join->join_disp_column_name;
                    $results['table_label'.$i] = $param_join->table_label;
                    $i++;
                }
            $results['id'] = $param->id;
            $results['connection_id'] = $param->connection_id;
            $results['param_title'] = $param->param_title;
            $results['param_name'] = $param->param_name;
            $results['table_name'] = $param->table_name;
            $results['no_joins'] = $param->no_joins;
            $results['db_con_name'] = getSingleRecordColValue('par_connections', ['id'=>$param->connection_id], 'config');

                $res = array(
                    'success' => true,
                    'results' => $results,
                    'no_joins' => $no_joins,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
    }
    public function checkParamMenuDefination(Request $req)
    {
        $menu_id = $req->menu_id;

        try{
            $param_def = DB::table('par_parameter_definations')->where('menu_id',$menu_id)->count();
            if($param_def > 0){
                $is_defined = 1;
            }else{
                $is_defined = 0;
            }
            $res = array(
                    'success' => true,
                    'is_defined' => $is_defined,
                    'message' => 'All is well'
                );
        }
            catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return response()->json($res);
    }
    public function getTablescolumns(Request $req)
    {
        $table_name = $req->table_name;
        $col = array();
        $con = $req->db_con;
        if($con == 'Portal DB'){
            $con = 'portal_db';
        }else{
            $con = 'pgsql';
        }
        if($table_name != ''){
            $columns = DB::Connection($con)->getSchemaBuilder()->getColumnListing($table_name);
            foreach ($columns as $column) {
            $col[]=['column_name'=>$column];
            }
            return $col;
        }else{
            return [];

    }
        }
        public function getApplicationApplicantDetails(Request $request)
        {
            $application_id = $request->input('application_id');
            $table_name = $request->input('table_name');
            $application_code = $request->input('application_code');

            try {
                $qry = DB::table('wb_trader_account as t1')
                    ->leftJoin('par_countries as t2', 't1.country_id', 't2.id')
                    ->leftJoin('par_regions as t3', 't1.region_id', 't3.id')
                    ->leftJoin('par_districts as t4', 't1.district_id', 't4.id')
                    ->select('t1.id as applicant_id', 't1.name as applicant_name', 't1.contact_person', 't1.physical_address', 't1.postal_address', 't4.name as district_name', 't3.name as region_name', 't2.name as country_name', 't1.telephone_no')
                    ->where('t1.id', function ($query) use ($table_name, $application_id, $application_code) {
                        $query->select(DB::raw('applicant_id'))
                            ->from($table_name)
                            ->where('application_code', $application_code);
                    });
                $results = $qry->first();
                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function getApplicationComments(Request $request)
        {
            $application_id = $request->input('application_id');
            $application_code = $request->input('application_code');
            $workflow_stage_id = $request->input('workflow_stage_id');
            $comment_type_id = $request->input('comment_type_id');
            $user_id = $this->user_id;
            try {
                // $qry = DB::table('tra_evaluation_recommendations as t1')
                //     ->leftJoin('users as t2', 't1.created_by', '=', 't2.id')
                //     ->leftJoin('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                //     ->leftJoin('par_recommendations as t4', 't1.recommendation_id', '=', 't4.id')
                //     ->select(DB::raw("t1.*,CONCAT(decryptval(t2.first_name,".getDecryptFunParams()."), ' ', decryptval(t2.last_name,".getDecryptFunParams().")) as author, t3.name as stage_name, t4.name as recommendation,t2.id as author_id, $user_id as current_user"))
                //     ->where('t1.application_code', $application_code);

                $qry = DB::table('tra_evaluation_recommendations as t1')
                ->join('users as t2', 't1.created_by', '=', 't2.id')
                ->join('wf_workflow_stages as t3', 't1.workflow_stage_id', '=', 't3.id')
                ->leftJoin('par_recommendations as t4', 't1.recommendation_id', '=', 't4.id')
                ->select(DB::raw("t1.*, CONCAT_WS(' ',decrypt(t2.first_name),decrypt(t2.last_name)) as author, t3.name as stage_name,t3.name as workflow_stage, t4.name as recommendation"))
                ->where('t1.application_id', $application_id)
                ->where('t1.application_code', $application_code);


                if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                    //get stage category
                    $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
                    $stage_category_id = $stage_data->stage_category_id;
                    $qry->where('t1.stage_category_id', $stage_category_id);
                }
                if (isset($comment_type_id) && $comment_type_id != '') {
                //  $qry->where('t1.comment_type_id', $comment_type_id);
                }
                $results = $qry->get();
                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function checkApplicationEvaluationOverralRecom(Request $request)
        {
            $application_code = $request->input('application_code');
            $module_id = $request->input('module_id');
            $workflow_stage_id = $request->input('workflow_stage_id');
            $comment_type_id = $request->input('comment_type_id');//whether structured or unstructured
            try {
            $record = DB::table('tra_evaluation_recommendations')->where(array('application_code'=>$application_code, 'workflow_stage_id'=>$workflow_stage_id))->count();

                if ($record >0) {
                    $hasRecommendation = 1;
                } else {
                    $hasRecommendation = 0;
                }
                $res = array(
                    'success' => true,
                    'hasRecommendation' => $hasRecommendation
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
public function checkApplicationChecklistUploadDetails(Request $request){

        try {

                $res = $this->validateApplicationChecklistDetails($request);
                //$res['hasValidatedChecklist'] = true;
            if(!$res['hasValidatedChecklist']){
                //ceck the documents uploads
                $res = $this->onValidateApplicationDocumentsUploads($request);
            }

        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return \response()->json($res);


    }
    public function onValidateApplicationDocumentsUploads(Request $req)
    {
        $application_code = $req->input('application_code');
        $workflow_stage = $req->input('workflow_stage');
        $doc_type_id = $req->input('document_type_id');
        $portal_uploads = $req->input('portal_uploads');
        $portal_status_id = $req->input('portal_status_id');
        $section_id = $req->input('section_id');
        $module_id = $req->input('module_id');
        $sub_module_id = $req->input('sub_module_id');
        $prodclass_category_id = $req->input('prodclass_category_id');
        $hasValidatedChecklist = false;
        try {
            $where = array(
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'section_id' => $section_id
            );
            $process_id = getSingleRecordColValue('wf_processes', $where, 'id');
            //get applicable document types
            $qry1 = DB::table('tra_proc_applicable_doctypes')
                ->select('doctype_id');
            if (isset($process_id) && $process_id != '') {
                $qry1->where('process_id', $process_id);
            }
            if (isset($workflow_stage) && $workflow_stage != '') {
                $qry1->where('stage_id', $workflow_stage);
            }
            if (validateIsNumeric($doc_type_id)) {
                $qry1->where('doctype_id', $doc_type_id);
            }
            $docTypes = $qry1->get();
            $docTypes = convertStdClassObjToArray($docTypes);
            $docTypes = convertAssArrayToSimpleArray($docTypes, 'doctype_id');
            //get applicable document requirements
            $qry = DB::table('tra_documentupload_requirements as t1')
                ->join('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
                ->select(DB::raw("t4.remarks, t1.id as document_requirement_id, t4.application_code,
                t4.node_ref, t2.name as document_type, t4.id,t4.initial_file_name,t4.file_name, t1.module_id,t1.sub_module_id,t1.section_id,
                t4.file_type,t3.uploaded_on, CONCAT(decryptval(t5.first_name,".getDecryptFunParams()."),' ',decryptval(t5.last_name,".getDecryptFunParams().")) as uploaded_by,t1.is_mandatory,t3.id as document_id,
                t1.id as document_requirement_id, t1.document_type_id,t2.name as document_type, t1.name as document_requirement"))
                ->leftJoin('tra_application_documents as t3', function ($join) use ($application_code) {
                    $join->on("t1.id", "=", "t3.document_requirement_id")
                            ->where("t3.application_code", $application_code);
                })
                ->leftJoin('tra_application_uploadeddocuments as t4', function ($join) use ($application_code) {
                    $join->on("t1.id", "=", "t4.document_requirement_id")
                            ->where("t4.application_code", "=", $application_code);
                })
                ->leftJoin('users as t5', 't3.uploaded_by', '=', 't5.id')
                ->where($where);
                if (validateIsNumeric($prodclass_category_id)) {
                    $qry->where('t1.prodclass_category_id', $prodclass_category_id);
                }
                if (validateIsNumeric($doc_type_id)) {
                    $qry->where('t1.document_type_id', $doc_type_id);
                } //else if(count($docTypes) > 0) {
                    $qry->whereIn('t1.document_type_id', $docTypes);;
                // }

                if (isset($portal_uploads) && $portal_uploads == 1) {
                    $qry->where('t1.portal_uploadable', 1);
                }
                if (isset($portal_status_id) && $portal_status_id == 1) {
                    $qry->where('t1.portal_uploadable', 1);
                }
            $results = $qry->get();
            if(count($results) >0){
                    // dd($results);
                    $hasValidatedChecklist = false;
                    foreach($results as $rec){
                    $document_id = $rec->document_id;
                    if(validateIsnumeric($document_id)){
                        $hasValidatedChecklist = true;
                    }
                }

            }
            else{
                    $hasValidatedChecklist = true;
            }
            $res = array(
                    'success' => true,
                    'hasValidatedChecklist' => $hasValidatedChecklist,
                    'message' => 'All is well Documents'
                );
        } catch (\Exception $e) {
            $res = array(
                'success' => false,
                'message' => $e->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return   $res;
    }
    public function validateApplicationChecklistDetails($request){
                $checklist_type = $request->input('checklist_type');
                $checklist_category_id = $request->input('checklist_category_id');
                $application_code = $request->input('application_code');
                $module_id = $request->input('module_id');
                $sub_module_id = $request->input('sub_module_id');
                $section_id = $request->input('section_id');
                $is_previous = $request->input('is_previous');
                $workflow_stage = $request->input('workflow_stage');
                if($module_id == 4){
                    $sub_module_id = 12;
                    $section_id = 2;

                }
                $where2 = array(
                    'sub_module_id' => $sub_module_id,
                    'section_id' => $section_id
                );

                $process_details = getTableData('wf_processes', $where2);
                $process_id = $process_details->id;
                $workflow_id = $process_details->workflow_id;
                $where3 = array(
                    'workflow_id' => $workflow_id,
                    'stage_status' => 1
                );

                $stage_details = getTableData('wf_workflow_stages', $where3);

                $where = array(
                    'process_id' => $process_id,
                    'stage_id' => $workflow_stage
                );
                if (!validateIsNumeric($workflow_stage)) {
                    $workflow_stage = $stage_details->id;
                    $where['stage_id'] = $workflow_stage;
                }
                $stage_category_id = getSingleRecordColValue('wf_workflow_stages', ['id'=>$workflow_stage], 'stage_category_id');
                try {
                    if($sub_module_id == 7){
                        if($section_id == 2 || $section_id == 3){
                         $whereProductType = DB::table('tra_product_information as t1')
                            ->join('tra_product_applications as t2', 't1.id', 't2.product_id')
                             ->select('t1.product_type_id')
                             ->where('t2.application_code', $application_code)
                             ->first();
                         $whereProductType = convertStdClassObjToArray($whereProductType);
                         $product_type_id = $whereProductType['product_type_id'];
                         $where2 = array(
                               // 'module_id' => $module_id,
                                'sub_module_id' => $sub_module_id,
                                'section_id' => $section_id,
                                'product_type_id' =>$product_type_id,
                            );
                        } else{
                            $where2 = array(
                                // 'module_id' => $module_id,
                                    'sub_module_id' => $sub_module_id,
                                    'section_id' => $section_id
                                );
                        }
                    }
                    else{
                        $where2 = array(
                            // 'module_id' => $module_id,
                                'sub_module_id' => $sub_module_id,
                                'section_id' => $section_id
                            );
                    }
                   
                    //get applicable checklist categories
                    $qry1 = DB::table('tra_proc_applicable_checklists')
                        ->select('checklist_category_id')
                        ->where($where);
                    $checklist_categories = $qry1->get();
                    $checklist_categoriesdata = $qry1->get();
                    $checklist_categories = convertStdClassObjToArray($checklist_categories);
                    $checklist_categories = convertAssArrayToSimpleArray($checklist_categories, 'checklist_category_id');
                    //get applicable checklist types
                    $qry2 = DB::table('par_checklist_types as t1')
                        ->select('t1.id')
                        ->where($where2)
                        ->whereIn('checklist_category_id', $checklist_categories);
                    $checklist_types = $qry2->get();
                    $checklist_types = convertStdClassObjToArray($checklist_types);
                    $checklist_types = convertAssArrayToSimpleArray($checklist_types, 'id');
                    $qry = DB::table('par_checklist_items as t1')
                        ->leftJoin('tra_checklistitems_responses as t2', function ($join) use ($application_code, $is_previous) {
                            $join->on('t2.checklist_item_id', '=', 't1.id')
                                ->where('t2.application_code', $application_code);
                        })
                        ->join('par_checklist_types as t3', 't1.checklist_type_id', '=', 't3.id')
                        ->select(DB::raw("t1.*,t2.id as item_resp_id,t2.pass_status,t2.auditorpass_status,t2.comment,t2.observation,t2.auditor_comment,t3.name as checklist_type,
                                    $module_id as module_id,$sub_module_id as sub_module_id,$section_id as section_id"));

                    if (isset($checklist_type) && $checklist_type != '') {
                        $qry->where('t1.checklist_type_id', $checklist_type);
                    } else {
                        $qry->whereIn('t1.checklist_type_id', $checklist_types);
                    }
                    //check the responses
                    $results = $qry->get();
                // $records = DB::table('tra_checklistitems_responses')->where(array('application_code'=>$application_code))->get();

                    if(count($results) >0){
                        $hasValidatedChecklist = true;
                        if (validateIsNumeric($stage_category_id) && $stage_category_id == 13) { //auditor/2 review
                                foreach($results as $rec){
                                    $auditorpass_status = $rec->auditorpass_status;
                                    if( !validateIsnumeric($auditorpass_status) ){
                                        $hasValidatedChecklist = false;
                                    }
                                }
                        }else{
                            foreach($results as $rec){
                                    $item_resp_id = $rec->item_resp_id;
                                    if( !validateIsnumeric($item_resp_id) ){
                                        $hasValidatedChecklist = false;
                                    }
                                }
                        }
                        //  $hasValidatedChecklist = true;
                    }
                    else{
                            $hasValidatedChecklist = true;
                    }

                    $res = array(
                        'success' => true,
                        'hasValidatedChecklist' => $hasValidatedChecklist,
                        'message' => 'All is well'
                    );
                } catch (\Exception $exception) {
                    $res = array(
                        'success' => false,
                        'message' => $exception->getMessage()
                    );
                } catch (\Throwable $throwable) {
                    $res = array(
                        'success' => false,
                        'message' => $throwable->getMessage()
                    );
                }


                return $res;
    }
        public function checkApplicationRaisedQueries(Request $request)
        {
            $application_code = $request->input('application_code');
            $module_id = $request->input('module_id');
            $query_type = $request->input('query_type');//whether structured or unstructured
            try {
                $hasUnStructuredQueries = $this->checkUnstructuredApplicationRaisedQueries($application_code, array(1, 3));
                $hasStructuredQueries = $this->checkChecklistBasedApplicationRaisedQueries($application_code, array(1, 3));
                if ($hasUnStructuredQueries == 1 || $hasStructuredQueries == 1) {
                    $hasQueries = 1;
                } else {
                    $hasQueries = 0;
                }
                $res = array(
                    'success' => true,
                    'hasQueries' => $hasQueries
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function checkUnstructuredApplicationRaisedQueries($application_code, $whereInArray = array(1, 3))
        {
            $hasQueries = 0;
            $qry = DB::table('tra_application_query_reftracker as t1')
                ->join('tra_checklistitems_queries as t2', 't1.id', 't2.query_id')
                ->where('t1.application_code', $application_code)
                ->whereIn('t2.status', $whereInArray);
            $queriesCount = $qry->count();
            if ($queriesCount > 0) {
                $hasQueries = 1;
            }
            return $hasQueries;
        }
        public function checkChecklistBasedApplicationRaisedQueries($application_code, $whereInArray = array(1, 3))
        {
            $hasQueries = 0;
            $qry = DB::table('tra_application_query_reftracker as t1')
                ->join('tra_checklistitems_queries as t2', 't1.id', '=', 't2.query_id')
                ->where('t1.application_code', $application_code)
                ->whereIn('t2.status', $whereInArray);
            $queriesCount = $qry->count();
            if ($queriesCount > 0) {
                $hasQueries = 1;
            }
            return $hasQueries;
        }
    public function getelementcost(request $request){
            $fee_type_id = $request->input('fee_type_id');
            $cost_category_id = $request->input('cost_category_id');
            $sub_cat_id = $request->input('sub_cat_id');
            $cost_item_id = $request->input('cost_item_id');
            $application_feetype_id = $request->input('applicationfee_types_id');
            $currency_id = $request->input('currency_id');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            $filters = (array)json_decode($request->filters);
            $filters=array_filter($filters);

            // DB::enableQueryLog();
        //   {feetype}: {category} : {sub_category} {element} {cost_type} {costs} {currency_name}&nbsp;</div></tpl>';
        try {


            $qry = DB::table('tra_element_costs as t1')
                ->LeftJoin('par_cost_elements as t2', 't1.element_id', 't2.id')
                ->LeftJoin('par_cost_sub_categories as t5', 't1.sub_cat_id', 't5.id')
                ->LeftJoin('par_fee_types as t6', 't1.fee_type_id', 't6.id')
                ->LeftJoin('par_cost_categories as a7','t5.cost_category_id','a7.id')
                ->LeftJoin('par_confirmations as t8', 't1.formula','t8.flag')
                ->LeftJoin('par_gl_accounts as t10','t1.gl_code_id','t10.id')
                ->LeftJoin('par_currencies as t11','t1.currency_id','t11.id')
                ->LeftJoin('par_applicationfee_types as t12','t1.application_feetype_id','t12.id')
                ->LeftJoin('par_modules as t13','t1.module_id','t13.id')
                ->LeftJoin('par_sub_modules as t14','t1.sub_module_id','t14.id')
                ->select('t1.*', 't1.id as element_costs_id','t11.name as currency_name', 't2.name as element', 't5.name as sub_category','t6.name as feetype','a7.name as category', 't8.name as formulaflag','t10.name as glcode','t12.name as cost_type', 't2.name as element_desc', 't14.name as sub_module_name','t13.name as module_name');

            if(validateIsNumeric($fee_type_id)){
                $qry->where('t1.fee_type_id',$fee_type_id);
                }
            if(validateIsNumeric($cost_category_id)){
                $qry->where('t5.cost_category_id',$cost_category_id);
                }
            if(validateIsNumeric($sub_cat_id)){
                $qry->where('t1.sub_cat_id',$sub_cat_id);
                }
            if(validateIsNumeric($cost_item_id)){
                $qry->where('t1.element_id',$cost_item_id);
                }
            if(validateIsNumeric($application_feetype_id)){
                $qry->where('t1.application_feetype_id',$application_feetype_id);
            }
            if(validateIsNumeric($module_id)){
                $qry->where('t1.module_id',$module_id);
            }
            if(validateIsNumeric($sub_module_id)){
                $qry->where('t1.sub_module_id',$sub_module_id);
            }
                if (count((array)$filters) > 0) {
                        $qry->where($filters);
                    }

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            // $last_query = DB::getQueryLog();
            // dd($last_query);
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getCountryRegions(Request $request)
        {
            $application_code = $request->input('application_code');
            $module_id = $request->input('module_id');
            $query_type = $request->input('query_type');//whether structured or unstructured
            try {
                $regions = DB::table('par_countries as t1')
                        ->leftJoin('par_regions as t2', 't1.id', 't2.country_id')
                        ->where('t1.is_local', 1)
                        ->get();
                $res = array(
                    'success' => true,
                    'results' => $regions,
                    'message' => 'All is well'
                );
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function getMeetingSchedules(Request $req){
            try{
                // $data_today = formatDate(Carbon::now());
                // $user_id = $this->user_id;
                $qry = DB::table('tc_meeting_details as t1')
                                // ->join('tc_meeting_participants as t2', 't1.id', 't2.meeting_id')
                                // ->leftJoin('par_modules as t3', 't1.module_id', 't3.id')
                                // ->leftJoin('par_sub_modules as t4', 't1.sub_module_id', 't4.id')
                                // ->leftJoin('tc_meeting_applications as t5', 't1.id', 't5.meeting_id')
                                ->select('t1.*') ;
                                $results = $qry->get();

                $res = array(
                    'success' => true,
                    'results' => $results,
                    'message' => 'All is well'
                );

            } catch (\Exception $exception) {
                $res = array(
                    'success' => false,
                    'message' => $exception->getMessage()
                );
            } catch (\Throwable $throwable) {
                $res = array(
                    'success' => false,
                    'message' => $throwable->getMessage()
                );
            }
            return \response()->json($res);

        }
        public function getGridColumnsFromSchema(Request $req)
        {
            $table_name = $req->table_name;
            $unset = array();
            try{
                $columns = DB::getSchemaBuilder()->getColumnListing($table_name);
            if($table_name == "tra_personnel_information"){
                    $unset[] = 'region_id';
                    $columns[]= 'Region';
                    $unset[] = 'sub_district_id';
                    $columns[]= 'Area/Town/City';
                    $unset[] = 'district_id';
                    $unset[] = 'personnel_type_id';
                    $unset[] = 'trader_id';
            }
                $unset[] = 'created_by';
                $unset[] = 'created_on';
                $unset[] = 'altered_by';
                $unset[] = 'dola';
                $unset[] = 'id';
                $unset[] = 'is_enabled';

                foreach ($unset as $value) {
                if (($key = array_search($value, $columns)) !== false) {
                        unset($columns[$key]);
                    }
                }
                $columns = array_values($columns);

            $res = array(
                'success' => true,
                'results' => $columns,
                'message' => 'All is well'
            );

            } catch (\Exception $exception) {
                $res = array(
                    'success' => false,
                    'message' => $exception->getMessage()
                );
            } catch (\Throwable $throwable) {
                $res = array(
                    'success' => false,
                    'message' => $throwable->getMessage()
                );
            }
            return \response()->json($res);
        }
        public function validateRequiredApplicationDetails($table_name, $application_code, $title){

            $record = DB::table($table_name)->where('application_code',$application_code)->first();
            if($record){
                $res = array('success'=>true, 'message'=>'');
            }
            else{
                $res = array('success'=>false, 'message'=>$title);
            }
            return $res;
        }
        public function checkApprovalREcommendationDEtails(Request $req){
            try {

                    $res = $this->validateRequiredApplicationDetails('tra_approval_recommendations', $req->application_code, 'Approval Recommendation has been filled successfully');

            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function checkIfHasGeneratedInvoiceDEtails(Request $req){
            try {

                    $res = $this->validateRequiredApplicationDetails('tra_application_invoices', $req->application_code, 'Generate Application invoice to proceed.');


            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
        public function validateHasUploadedDocumentsDetils(Request $req){
            try {
                    $res = $this->validateRequiredApplicationDetails('tra_application_uploadeddocuments', $req->application_code, 'Upload te Required Documents');
            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            $res = array('success'=>true, 'message'=>'');
            return \response()->json($res);
        }
        public function validateHasImportExportProductDetils(Request $req){
            try {
                    $res = $this->validateRequiredApplicationDetails('tra_permits_products', $req->application_code, 'Enter the Import/Export Product Details to proceed');


            } catch (\Exception $exception) {
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return \response()->json($res);
        }
    public function getReviewerRejectionReason(Request $req){
        try{
            $application_code = $req->application_code;
            $where = array(
                'application_code' => $application_code,
                'stage_category_id' => 3
            );
            $remarks = DB::table('tra_evaluation_recommendations as t1')
                        ->where($where)
                        ->orderBy('id', 'DESC')
                        ->first();

            $reason = $remarks->remarks;
            $res =  array(
                'success' => true,
                'message' => 'All is well',
                'reason' => $reason
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getCustomerList(Request $req){
     try{
            $applicant_id = $req->applicant_id;

            $list = DB::table('wb_trader_account as t1')
                        ->get();

            $res =  array(
                'success' => true,
                'message' => 'All is well',
                'results' => $list
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getClinicalAssessmentForm(Request $req){
        try{
            $type_id = $req->type_id;
            $application_code = $req->application_code;
            $master = [];
            //loop
            $categories = DB::table('par_ct_assessment_categories as t1')->where('type_id', $type_id)->get();
            $i = 0;
            $j = 0;
            $k = 0;
            //get subcategories
            foreach ($categories as $cat) {
                $sub_cats = DB::table('par_ct_assessment_sub_categories as t1')
                                ->where('ct_assessment_category_id', $cat->id)
                                ->get();
                //add to array
               $master[$i]['name'] = $cat->name;

               if($sub_cats->isEmpty()){
                    $master[$i]['sub_categories'] = [];
               }

               $j= 0;

               foreach ($sub_cats as $sub_cat) {
                    $items = DB::table('par_ct_assessment_items as t1')
                                ->where('ct_assessment_sub_category_id', $sub_cat->id)
                                ->get();
                    //add to array
                    $master[$i]['sub_categories'][$j]['id'] = $sub_cat->id;
                    $master[$i]['sub_categories'][$j]['name'] = $sub_cat->name;

                    //add data for sub
                    $master[$i]['sub_categories'][$j]['workspace_value'] = getSingleRecordColValue('par_ct_assessment_category_details', ['sub_category_id' =>  $sub_cat->id, 'active_application_code'=>$application_code], 'workspace');
                    $master[$i]['sub_categories'][$j]['comment_value'] = getSingleRecordColValue('par_ct_assessment_category_details', ['sub_category_id' =>  $sub_cat->id, 'active_application_code'=>$application_code], 'comment');

                    if($items->isEmpty()){
                            $master[$i]['sub_categories'][$j]['items'] = [];
                       }

                    $k = 0;
                    //loop for items
                    foreach ($items as $item) {
                        if($item->is_checklist == 1){
                            $master[$i]['sub_categories'][$j]['items'][$k]['is_checklist'] = 1;
                            $master[$i]['sub_categories'][$j]['items'][$k]['item_value'] = getSingleRecordColValue('par_ct_assessment_items_details', ['item_id' =>  $item->id, 'active_application_code'=>$application_code], 'itemcheck');
                        }else{
                            $master[$i]['sub_categories'][$j]['items'][$k]['is_checklist'] = 0;
                            $master[$i]['sub_categories'][$j]['items'][$k]['item_value'] = getSingleRecordColValue('par_ct_assessment_items_details', ['item_id' =>  $item->id, 'active_application_code'=>$application_code], 'item');
                        }
                        $master[$i]['sub_categories'][$j]['items'][$k]['name'] = $item->name;
                        $master[$i]['sub_categories'][$j]['items'][$k]['id'] = $item->id;
                        $k++;

                    }
                    $j++;
               }
               $i++;
            }

           //dd($master);
            $res = array(
                'success' => true,
                'message' => 'All is well',
                'assessment_categories' => $master
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

// public function onSaveMeetingGroups(Request $req)
//     {
//         try {
//                         $user_id = \Auth::user()->id;
//                         $post_data = $req->post();
//                         $table_name = $post_data['table_name'];
//                         //$participant_ids = $post_data['participant_id'];
//                         $participant_ids = json_encode(json_decode($req->participant_id));
//                         $id = $post_data['id'];
//                         $table_data = array(
//                             'name' => $req->input('name'),
//                             'description' => $req->input('description'),
//                             'participant_id' => $participant_ids,
//                         );
//                         $where = array(
//                             'id' => $id
//                         );
//                       //Updating Records
//                       if (isset($id) && $id != "") {
//                         if (recordExists($table_name, $where)) {
//                            // DD('HERE');
//                             unset($table_data['created_on']);
//                             unset($table_data['created_by']);
//                             $table_data['dola'] = Carbon::now();
//                             $table_data['altered_by'] = $user_id;
//                             $res = updateRecord($table_name, $where, $table_data, $user_id);
                           
//                         }
//                     } else {
//                         $res = insertRecord('par_meeting_groups', $table_data, $user_id);
//                         if(!isset($res['success'])||$res['success']==false){
//                             return $res;
//                           }
                       
//                        }
//                         //saving records
//                             $res= array(
//                                 'success' => true,
//                                 'message' => 'Record saved Successfully!!'
//                             ); 
                       
//                     }catch (\Exception $exception) {
//                         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            
//                     } catch (\Throwable $throwable) {
//                         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//                     }
//                     return response()->json($res);
//         }
		
// 		public function getMeetingGroups(Request $req){
//                     try{
//                             $qry = DB::table('par_meeting_groups as t1')
//                                   ->select('t1.*') ;
//                             $results = $qry->get();
        
//                         $res = array(
//                             'success' => true,
//                             'results' => $results,
//                             'message' => 'All is well'
//                         );
        
//                     } catch (\Exception $exception) {
//                         $res = array(
//                             'success' => false,
//                             'message' => $exception->getMessage()
//                         );
//                     } catch (\Throwable $throwable) {
//                         $res = array(
//                             'success' => false,
//                             'message' => $throwable->getMessage()
//                         );
//                     }
//                     return \response()->json($res);
        
//      }
// 	 public function getMeetingGroupMembers(Request $req){
//         try{
//                $group_id = $req->input('group_id');
//                 $qry = DB::table('par_meeting_groups as t1')
//                       ->select('t1.*')
//                       ->where('t1.id',$group_id);
//                 $results = $qry->first();
//                 $participant_id = json_decode($results->participant_id);
//                     foreach($participant_id as $user){
//                         $new_qry = DB::table('users as t1')
//                                 ->select(DB::raw("t1.email,t1.id as user_id,CONCAT_WS(' ',decryptval(t1.first_name,".getDecryptFunParams()."),decryptval(t1.last_name,".getDecryptFunParams().")) as participant_name,decryptval(t1.phone,".getDecryptFunParams().") as phone"))
//                                 ->where('t1.id',$user);
                                
//                         $new_res = $new_qry->first(); 
//                         $data[] = array(
//                         'email'=>$new_res->email,
//                         'user_id'=>$new_res->user_id,
//                         'participant_name'=>$new_res->participant_name,
//                         'phone'=>$new_res->phone,
//                         );
//                           }
//                     $res = array(
//                         'success' => true,
//                         'results' => $data,
//                         'message' => 'All is well'
//                     );
             

//         } catch (\Exception $exception) {
//             $res = array(
//                 'success' => false,
//                 'message' => $exception->getMessage()
//             );
//         } catch (\Throwable $throwable) {
//             $res = array(
//                 'success' => false,
//                 'message' => $throwable->getMessage()
//             );
//         }
//         return \response()->json($res);

// }
	 
    public function getportalSubmissionReceivingApplications(Request $request)
    {
        $user_id = $this->user_id;
        $section_id = $request->input('section_id');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $online_status_id = $request->input('online_status_id');
        $is_management_dashboard = $request->input('is_management_dashboard');
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $whereClauses = array();
        $filter = $request->input('filter');
        $filter_string = '';
        $data = array('success'=> true, 'message'=> 'no data');
        // if (isset($filter)) {
        //     $filters = json_decode($filter);
        //     if ($filters != NULL) {
        //         foreach ($filters as $filter) {
        //             switch ($filter->property) {
        //                 case 'tracking_no' :
        //                     $whereClauses[] = "(t1.tracking_no ILIKE '%" . ($filter->value) . "%' or t1.reference_no ILIKE '%" . ($filter->value) . "%')";
        //                     break;
        //                 case 'reference_no' :
        //                     $whereClauses[] = "(t1.tracking_no ILIKE '%" . ($filter->value) . "%' or t1.reference_no ILIKE '%" . ($filter->value) . "%')";
        //                     break;
        //                 case 'applicant_name' :
        //                     $whereClauses[] = "t9.name ILIKE '%" . ($filter->value) . "%'";
        //                     break;
        //                 case 'time_span' :
        //                     $whereClauses[] = "TOTAL_WEEKDAYS(now(),date_submitted) > " . ($filter->value);
        //                     break;

        //             }
        //         }
        //         $whereClauses = array_filter($whereClauses);
        //     }
        //     if (!empty($whereClauses)) {
        //         $filter_string = implode(' AND ', $whereClauses);
        //     }
        // }
         $portal_db = DB::connection('portal_db');
	        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table('wb_onlinesubmissions as t1')
                ->leftJoin('wb_statuses as t5', 't1.application_status_id', '=', 't5.id')
                ->leftJoin('wb_trader_account as t9', 't1.trader_id', '=', 't9.id')
                ->leftJoin('wb_product_applications as t10', 't1.application_code', '=', 't10.application_code')
                ->leftJoin('wb_psur_pbrer_applications as t15', 't1.application_code', '=', 't15.application_code')
                ->leftJoin('wb_portal_mis_recieved_app as t11', 't1.application_code', '=', 't11.application_code')
                ->select(DB::raw("t1.*,t1.application_id as active_application_id,
                     t5.name as application_status,t10.prodclass_category_id as prodclass_category_id,
                    t9.name as applicant_name,t10.product_id,t11.new_application_id,t11.importexport_permittype_id,t11.premise_type_id,t15.registered_product_id"));
            $qry->where(array('t1.application_status_id'=>2,'t1.is_received'=>NULL,));
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($module_id)) {
                $qry->where('t1.module_id', $module_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (validateIsNumeric($online_status_id)) {
                $qry->where('t5.id', $online_status_id);
            }
            $qry->orderBy('t1.id', 'desc');
            $results = $qry->get();
           if(isset($results)){
            foreach($results as $rec){
                $module_name = getSingleRecordColValue('par_modules', array('id'=>$rec->module_id), 'name');
                $sub_module_name = getSingleRecordColValue('par_sub_modules', array('id'=>$rec->sub_module_id), 'name');
                $section_name = getSingleRecordColValue('par_sections', array('id'=>$rec->section_id), 'name');
                $data[] = array('id'=>$rec->id,
                                'application_code'=>$rec->application_code,
                                'application_id'=>$rec->application_id,
                                'reference_no'=>$rec->reference_no,
                                'tracking_no'=>$rec->tracking_no,
                                'module_id'=>$rec->module_id,
                                'sub_module_id'=>$rec->sub_module_id,
                                'status_type_id'=>$rec->status_type_id,
                                'section_id'=>$rec->section_id,
                                'application_status_id'=>$rec->application_status_id,
                                'trader_id'=>$rec->trader_id,
                                'date_submitted'=>$rec->date_submitted,
                                'is_received'=>$rec->is_received,
                                'active_application_id'=>$rec->active_application_id,
                                'application_status'=>$rec->application_status,
                                'applicant_name'=>$rec->applicant_name,
                                'new_application_id'=>$rec->new_application_id,
                                'prodclass_category_id'=>$rec->prodclass_category_id,
                                'importexport_permittype_id'=>$rec->importexport_permittype_id,
                                'premise_type_id'=>$rec->premise_type_id,
                                'product_id'=>$rec->product_id,
                                'registered_product_id'=>$rec->registered_product_id,
                                'module_name'=>$module_name,
                                'sub_module_name'=>$sub_module_name,
                                'section_name'=>$section_name,
                );
        }
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
           }
           else{
            $res = array(
                'success' => false,
                'results' => $res,
                'message' => 'null'
            );
           }
          
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
 public function getApplicationWorkFlowStageSubmissionDetails(Request $request)
 {
                    $module_id = $request->input('module_id');
                    $sub_module_id = $request->input('sub_module_id');
                    $section_id = $request->input('section_id');
                    $prodclass_category_id =  $request->input('prodclass_category_id');
                    $importexport_permittype_id= $request->input('importexport_permittype_id');
                    $premise_type_id= $request->input('premise_type_id');
            try {
                $qry = DB::table('wf_processes as t1')
                     ->select('t1.workflow_id');

                     if (validateIsNumeric($prodclass_category_id)) {
                        $qry->where('t1.prodclass_category_id', $prodclass_category_id);
                        }
                    if (validateIsNumeric($importexport_permittype_id)) {
                         $qry->where('t1.importexport_permittype_id', $importexport_permittype_id);
                        }
                    if (validateIsNumeric($premise_type_id)) {
                        $qry->where('t1.premise_type_id', $premise_type_id);
                        }
                        $qry->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
                        $results = $qry->first();
                        if($results){
                            $workflow_id =$results->workflow_id;
                            $stage_id_qry = DB::table('wf_workflow_stages as t1')
                                ->select('t1.id')
                                ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                                $results = $stage_id_qry->first();
                           	    $res = array('success'=>true, 
                                      'results'=>$results,
                                       'message'=>'All is well');    
                        }

                    } catch (\Exception $exception) {
                        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            
                    } catch (\Throwable $throwable) {
                        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                    }
                    return response()->json($res);
    }
    public function receivePortalManagersApplicationsGeneric(Request $request)
    {
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        //dd($module_id);
        $success=false;
        $msg='Failed to Sync';
        $return_response = '';
        if ($module_id == 1) {//PRODUCT REGISTRATION
            if($sub_module_id ==75){
                $return_response = $this->receiveExemptionsProductsPortalApplication($request);
            }
            else{
                $return_response = $this->receiveProductsPortalApplication($request);
            }
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } else if ($module_id == 2) {//PREMISE REGISTRATION
            $return_response = $this->receiveFacilityPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } else if ($module_id == 3) { //GMP APPLICATIONS
            $return_response = $this->receiveGmpPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }  else if ($module_id == 4 || $module_id == 20) {//IMPORT EXPORT
            $return_response =  $this->receiveImportExportPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }  else if ($module_id == 12) {//IMPORT EXPORT
            $return_response = $this->receiveImportExportPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }else if ($module_id == 7) {//CLINICAL TRIAL
            $return_response = $this->receiveClinicalTrialPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } else if ($module_id == 14) {   //PROMOTION AND ADVERTISEMENT
            $return_response = $this->receivePromotionPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }  else if ($module_id == 21) {//ADR
            $return_response = $this->receiveAdrPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        }  else if ($module_id == 25) {//PSUR/PBRER
            $return_response = $this->receivePsurPortalApplication($request);
            if($return_response['success'] == true) {
                $success=true;
                $msg='Synced Successfully';
            }
        } 
        else {
            $success=false;
            $msg='Module not set!!';
            $return_response = '';
        }

        $res = array(
            'success' => $success,
            'message' => $msg,
            'error' => $return_response
        );
        return response()->json($res);

    }

public function receiveProductsPortalApplication(Request $request){
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $portal_db = DB::connection('portal_db');
        $portal_dbw = clone $portal_db;
        //Get portal product data other_container
        $qry = $portal_db->table('wb_product_applications as t1')
             ->leftJoin('wb_product_information as t2', 't1.product_id', 't2.id')
          ->select('t1.*','t2.*','t1.id as portal_application_id','t1.prodclass_category_id as prodclass_category_id');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id =$results->portal_application_id;
        $module_id = $results->module_id;
        $sub_module_id = $results->sub_module_id;
        $section_id = $results->section_id;
        $prodclass_category_id = $results->prodclass_category_id;
        $view_id= generateApplicationViewID();
        $trader_id=$results->trader_id;
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
        
        $process_qry = DB::table('wf_processes as t1')
                     ->select('t1.id')
                     ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
            DB::rollBack();
            return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id = $process_results->id;
       
        if($results){
            try {
                $prod_data = array(
                'common_name_id'=>$results->common_name_id,
                'product_type_id'=>$results->product_type_id,
                'classification_id'=>$results->classification_id,
                'chemical_entities_type_id'=>$results->chemical_entities_type_id,
                'efficacy_proof_type_id'=>$results->efficacy_proof_type_id,
                'brand_name'=>$results->brand_name,
                'common_name'=>$results->common_name,
                'physical_description'=>$results->physical_description,
                'dosage_form_id'=>$results->dosage_form_id,
                'strength'=>$results->strength,
                'storage_condition'=>$results->storage_condition,
                'product_origin_id'=>$results->product_origin_id,
                'intended_enduser_id'=>$results->intended_enduser_id,
                'intended_use_id'=>$results->intended_use_id,
                'route_of_administration_id'=>$results->route_of_administration_id,
                'section_id'=>$results->section_id,
                'contraindication'=>$results->contraindication,
                'gmdn_code'=>$results->gmdn_code,
                'shelf_lifeafter_opening'=>$results->shelf_lifeafter_opening,
                'shelf_life'=>$results->shelf_life,
                'instructions_of_use'=>$results->instructions_of_use,
                'warnings'=>$results->warnings,
                'intended_use'=>$results->intended_use,
                'indications'=>$results->indications,
                'strength_si_unit'=>$results->strength_si_unit,
                'gmdn_category_id'=>$results->gmdn_category_id,
                'gmdn_term'=>$results->gmdn_term,
                'paying_currency_id'=>$results->paying_currency_id,
                'fasttrack_option_id'=>$results->fasttrack_option_id,
                'remarks'=>$results->remarks,
                    // 'medical_systemmodel_series'=>$results->medical_systemmodel_series,

                    // 'shelflifeduration_desc'=>$results->shelflifeduration_desc,
                    // 'shelflifeafteropeningduration_desc'=>$results->shelflifeafteropeningduration_desc,
                    // 'reason_for_classification_id'=>$results->reason_for_classification_id,
                    // 'prodclass_category_id'=>$prodclass_category_id,
                    // 'productrisk_category_id'=>$results->productrisk_category_id,
                    // 'reagents_accessories'=>$results->reagents_accessories,
                'has_family'=>$results->has_family,
                'device_family'=>$results->device_family,
                'has_reagents'=>$results->has_reagents,
                'device_reagents'=>$results->device_reagents,
                'has_accessories'=>$results->has_accessories,
                'device_accessories'=>$results->device_accessories,
                'model_name'=>$results->model_name,
                'software_version'=>$results->software_version,
                'device_intended_use'=>$results->device_intended_use,
                'device_brand_name'=>$results->device_brand_name,
                'device_report'=>$results->device_report,
                'productrisk_category_id'=>$results->productrisk_category_id,
                'clinical_condition'=>$results->clinical_condition,
                // 'stability_studies_data_id'=>$results->stability_studies_data_id,
                'device_classification_rules_id'=>$results->device_classification_rules_id,
                'device_cluster' =>$results->device_cluster,
                'device_compliance_standards' =>$results->device_compliance_standards,
                'gs1_udi' =>$results->gs1_udi,
                'udi_available' => $results->udi_available,
                'gs1_udi_available' => $results->gs1_udi_available,
                'has_cluster' => $results->has_cluster,
                'qms_area' => $results->qms_area,
                'qms_established' => $results->qms_established,
                'technical_doc_summary' => $results->technical_doc_summary,
			'listing_no' => $results->listing_no,
			'is_listed' => $results->is_listed,
			'country_id' => $results->country_id,
                'created_by'=>$results->created_by,
                'created_on'=>$results->created_on,
            );
      
        $applications_table = 'tra_product_applications';
        $products_table = 'tra_product_information';
        $res = insertRecord('tra_product_information', $prod_data, $user_id);
      
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;

             }
        $record_id = $res['record_id'];
        $product_id = $res['record_id'];
        $app_data = array(

            "process_id" => $process_id,
            "applicant_id" => $applicant_id,
            'view_id' => $view_id,
            "reg_serial" =>$results->reg_serial,
            "workflow_stage_id" => $results->workflow_stage_id,
            "application_status_id" => $results->application_status_id,
            "application_code" => $results->application_code,
            "reference_no" =>$results->reference_no,
            "tracking_no" => $results->tracking_no,
            "sub_module_id" => $results->sub_module_id,
            "module_id" => $results->module_id,
            "section_id" => $results->section_id,
            "product_id" => $product_id,
            "local_agent_id" => $results->local_agent_id,
            "paying_currency_id" =>$results->paying_currency_id,
            "assessment_procedure_id" =>$results->assessment_procedure_id,
            "assessmentprocedure_type_id" =>$results->assessmentprocedure_type_id,
            'prodclass_category_id' => $results->prodclass_category_id,
            "product_type_id" => $results->product_type_id,
            "date_added" => $results->date_added,
            'appeal_type_id' => $results->appeal_type_id,
            'withdrawal_type_id' => $results->withdrawal_type_id,
            'reg_product_id' => $results->reg_product_id,
            "created_by" => $results->created_by,
            "fasttrack_option_id" => $results->fasttrack_option_id,
            "created_on" => Carbon::now()
        );
        $app_res = insertRecord('tra_product_applications', $app_data, $user_id);
        if(!isset($app_res['record_id'])){
            DB::rollback();
            return $app_res;

             }
        $active_application_id = $app_res['record_id'];
        $module_id = $results->module_id;
        $sub_module_id = $results->sub_module_id;
        $section_id = $results->section_id;
        $prodclass_category_id = $results->prodclass_category_id;
        $application_code = $results->application_code;
        $tracking_no = $results->tracking_no;
        initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
        $Stage_qry = DB::table('wf_processes as t1')
                ->select('t1.workflow_id')
                ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
        
        $Stage_qry_results = $Stage_qry->first();
        if($Stage_qry_results){
            $workflow_id =$Stage_qry_results->workflow_id;
            $stage_id_qry = DB::table('wf_workflow_stages as t1')
                        ->select('t1.id')
                        ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
            $stage_id_results = $stage_id_qry->first();
            if(!isset($stage_id_results->id)){
                DB::rollBack();
                return ['message'=> 'Initial portal receiving stage not found', 'success'=>false]; 
            }
            $workflow_stage_id = $stage_id_results->id;
            $submission_params = array(
                'application_id' => $active_application_id,
                "process_id" => $process_id,
                "application_code" => $results->application_code,
                'prodclass_category_id' => $results->prodclass_category_id,
                "tracking_no" => $results->tracking_no,
                'usr_from' => $user_id,
                'usr_to' => $user_id,
                'previous_stage' => $workflow_stage_id,
                'current_stage' => $workflow_stage_id,
                "module_id" => $results->module_id,
                "sub_module_id" => $results->sub_module_id,
                "section_id" => $results->section_id,
                "application_status_id" => $results->application_status_id,
                'urgency' => 1,
                "applicant_id" => $applicant_id,
                //'branch_id' => $branch_id,
                'remarks' => 'Initial save of the application',
                'date_received' => Carbon::now(),
                'created_on' => Carbon::now(),
                'is_fast_track' => $results->fasttrack_option_id,
                'created_by' => $user_id
            );
            $sub_res = insertRecord('tra_submissions', $submission_params);
            if(!isset($sub_res['record_id'])){
                DB::rollback();
                return $sub_res;
                 }
                }
            else{
                DB::rollBack();
                return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
            }
               //Get portal product ingredients data
        $ingredientsqry = $portal_db->table('wb_product_applications as t1')
            ->leftjoin('wb_product_ingredients as t3', 't1.product_id', 't3.product_id')
            ->select('t3.*')
            ->where('t1.application_code',$application_code);
            $ingredientsresults = $ingredientsqry->get();
        if($ingredientsresults){
        foreach($ingredientsresults as $ingredientsresults){
             $ingredientsdata =array(
                    'product_id' => $product_id,
                    'ingredient_type_id' => $ingredientsresults->ingredient_type_id,
                    'ingredient_id' => $ingredientsresults->ingredient_id,
                    'specification_type_id' => $ingredientsresults->specification_type_id,
                    'strength' => $ingredientsresults->strength,
                    'proportion' => $ingredientsresults->proportion,
                    'ingredientssi_unit_id' => $ingredientsresults->ingredientssi_unit_id,
                    'inclusion_reason_id' => $ingredientsresults->inclusion_reason_id,
                    'acceptance_id' => $ingredientsresults->acceptance_id,
                    'atc_code' => $ingredientsresults->atc_code,
                    'atc_code_id' => $ingredientsresults->atc_code_id,
                    'atc_code_description' => $ingredientsresults->atc_code_description,
                    'altenative_name' =>$ingredientsresults->altenative_name,
                    'ing_processing' =>$ingredientsresults->ing_processing,
                    'ing_source' => $ingredientsresults->ing_source,
                    'cas_number' => $ingredientsresults->cas_number,
                    'strengh' => $ingredientsresults->strengh,
                    'created_by' => $ingredientsresults->created_by,
                    'created_on' => $ingredientsresults->created_on,
                    'altered_by' => $ingredientsresults->altered_by,
                    'dola' => $ingredientsresults->dola,
             );
             $ingredients_res = insertRecord('tra_product_ingredients', $ingredientsdata);
             if(!isset($ingredients_res['record_id'])){
                DB::rollback();
                return $ingredients_res;

                 }

           }

          }
               //Get portal product Packaging data other_container_type
        $packagingqry = $portal_db->table('wb_product_applications as t1')
           ->leftjoin('wb_product_packaging as t3', 't1.product_id', 't3.product_id')
           ->select('t3.*')
           ->where('t1.application_code',$application_code);
        $packagingresults = $packagingqry->get();
        
        if($packagingresults){
            foreach ($packagingresults as $packagingresults) {
                # code...
               $packagingdata = array(
                   'product_id' => $product_id,
					'container_type_id' => $packagingresults->container_type_id,
					'container_id' => $packagingresults->container_id,
					'container_material_id' => $packagingresults->container_material_id,
					'closure_material_id' => $packagingresults->closure_material_id,
					'other_container' => $packagingresults->other_container,
					'other_container_type' => $packagingresults->other_container_type,
					'other_container_material'=> $packagingresults->other_container_material,
					'seal_type_id' => $packagingresults->seal_type_id,
					'retail_packaging_size' => $packagingresults->retail_packaging_size,
					'retail_packaging_size1' => $packagingresults->retail_packaging_size1,
					'retail_packaging_size2' => $packagingresults->retail_packaging_size2,
					'retail_packaging_size3' => $packagingresults->retail_packaging_size3,
					'retail_packaging_size4' => $packagingresults->retail_packaging_size4,
					'retail_packaging_size5' => $packagingresults->retail_packaging_size5,
					'packaging_units_id' => $packagingresults->packaging_units_id,
					'unit_pack' => $packagingresults->unit_pack,
					'diluents' => $packagingresults->diluents,
					'product_unit' => $packagingresults->product_unit,
                    'created_by' => $packagingresults->created_by,
                    'created_on' => $packagingresults->created_on,
                    'altered_by' => $packagingresults->altered_by,
                    'dola' => $packagingresults->dola,

               );
               $packaging_res = insertRecord('tra_product_packaging', $packagingdata);
               if(!isset($packaging_res['record_id'])){
                DB::rollback();
                return $packaging_res;

                 }

            }
          }
               //Get portal product Manufactuers data
        $manufacturerqry = $portal_db->table('wb_product_applications as t1')
           ->leftjoin('wb_product_manufacturers as t3', 't1.product_id', 't3.product_id')
           ->select('t3.*')
           ->where('t1.application_code',$application_code);
        $manufactureresults = $manufacturerqry->get();
        if($manufactureresults){
            foreach ($manufactureresults as $manufactureresults) {
                # code...
               $manufacturerdata = array(
                    'product_id' => $product_id,
					'manufacturer_id' => $manufactureresults->manufacturer_id,
					'man_site_id' => $manufactureresults->man_site_id,
					//'container_material_id' => $manufactureresults->container_material_id,
					'manufacturer_role_id' => $manufactureresults->manufacturer_role_id,
					'manufacturer_status_id' => $manufactureresults->manufacturer_status_id,
					'manufacturer_type_id' => $manufactureresults->manufacturer_type_id,
					'other_manufacturer_role'=> $manufactureresults->other_manufacturer_role,
					'manufacturer_block' => $manufactureresults->manufacturer_block,
					'active_ingredient_id' => $manufactureresults->active_ingredient_id,
					'manufacturer_unit' => $manufactureresults->manufacturer_unit,
                    'created_by' => $manufactureresults->created_by,
                    'created_on' => $manufactureresults->created_on,
                    'altered_by' => $manufactureresults->altered_by,
                    'dola' => $manufactureresults->dola,

               );
               $manufacturing_res = insertRecord('tra_product_manufacturers', $manufacturerdata);
               if(!isset($manufacturing_res['record_id'])){
                DB::rollback();
                return $manufacturing_res;

                 }

            }
          }
               //Get portal product Api Manufacturer data
        $Apimanufacturerqry = $portal_db->table('wb_product_applications as t1')
           ->leftjoin('wb_product_manufacturers as t3', 't1.product_id', 't3.product_id')
           ->select('t3.*')
           ->where('t1.application_code',$application_code);
        $manufactureresults = $manufacturerqry->get();
        if($manufactureresults){
            foreach ($manufactureresults as $manufactureresults) {
                # code...
               $manufacturerdata = array(
                    'product_id' => $product_id,
					'manufacturer_id' => $manufactureresults->manufacturer_id,
					'man_site_id' => $manufactureresults->man_site_id,
					//'container_material_id' => $manufactureresults->container_material_id,
					'manufacturer_role_id' => $manufactureresults->manufacturer_role_id,
					'manufacturer_status_id' => $manufactureresults->manufacturer_status_id,
					'manufacturer_type_id' => $manufactureresults->manufacturer_type_id,
					'other_manufacturer_role'=> $manufactureresults->other_manufacturer_role,
					'manufacturer_block' => $manufactureresults->manufacturer_block,
					'active_ingredient_id' => $manufactureresults->active_ingredient_id,
					'manufacturer_unit' => $manufactureresults->manufacturer_unit,
                    'created_by' => $manufactureresults->created_by,
                    'created_on' => $manufactureresults->created_on,
                    'altered_by' => $manufactureresults->altered_by,
                    'dola' => $manufactureresults->dola,

               );
               $packaging_res = insertRecord('tra_product_manufacturers', $manufacturerdata);
               if(!isset($packaging_res['record_id'])){
                DB::rollback();
                return $packaging_res;

                 }

            }
          }
               //Get portal product gmpinspectiondetails  data
        $gmpinspectiondetailsqry = $portal_db->table('wb_product_applications as t1')
           ->leftjoin('wb_product_gmpinspectiondetails as t3', 't1.product_id', 't3.product_id')
           ->select('t3.*')
           ->where('t1.application_code',$application_code);
        $gmpinspectiondetailsresults = $gmpinspectiondetailsqry->get();
        // dd($gmpinspectiondetailsresults);
        if($gmpinspectiondetailsresults){
            foreach ($gmpinspectiondetailsresults as $gmpinspectiondetailsresults) {
                # code...
               $gmpinspectiondetailsdata = array(
                    'product_id' => $product_id,
					'reg_product_id' => $gmpinspectiondetailsresults->reg_product_id,
					'reg_site_id' => $gmpinspectiondetailsresults->reg_site_id,
					'manufacturing_site_id' => $gmpinspectiondetailsresults->manufacturing_site_id,
					'init_site_id' => $gmpinspectiondetailsresults->init_site_id,
					'gmp_productline_id' => $gmpinspectiondetailsresults->gmp_productline_id,
					//'gmpproduct_line_id' => $gmpinspectiondetailsresults->gmpproduct_line_id,
					'status_id'=> $gmpinspectiondetailsresults->status_id,
                    'created_by' => $gmpinspectiondetailsresults->created_by,
                    'created_on' => $gmpinspectiondetailsresults->created_on,
                    'altered_by' => $gmpinspectiondetailsresults->altered_by,
                    'dola' => $gmpinspectiondetailsresults->dola,

               );
               $gmpinspectiondetails_res = insertRecord('tra_product_gmpinspectiondetails', $gmpinspectiondetailsdata);
               if(!isset($gmpinspectiondetails_res['record_id'])){
                DB::rollback();
                return $gmpinspectiondetails_res;

                 }

            }
          }
               //Get portal product otherstates productgmpinspections  data
        $otherstatesgmpinspectiondetailsqry = $portal_db->table('wb_product_applications as t1')
           ->leftjoin('wb_otherstates_productgmpinspections as t3', 't1.product_id', 't3.product_id')
           ->select('t3.*')
           ->where('t1.application_code',$application_code);
        $otherstatesgmpinspectiondetailsqryresults = $otherstatesgmpinspectiondetailsqry->get();
        
        if($otherstatesgmpinspectiondetailsqryresults){
            foreach ($otherstatesgmpinspectiondetailsqryresults as $otherstatesgmpinspectiondetailsqryresults) {
                # code...
               $otherstatesgmpinspectiondetailsdata = array(
                    'product_id' => $product_id,
					'application_code' => $otherstatesgmpinspectiondetailsqryresults->application_code,
					'continent_region_id' => $otherstatesgmpinspectiondetailsqryresults->continent_region_id,
					'country_id' => $otherstatesgmpinspectiondetailsqryresults->country_id,
					'gmpapplication_reference' => $otherstatesgmpinspectiondetailsqryresults->gmpapplication_reference,
					'inspection_date' => $otherstatesgmpinspectiondetailsqryresults->inspection_date,
					'approval_date' => $otherstatesgmpinspectiondetailsqryresults->approval_date,
					'approving_authority'=> $otherstatesgmpinspectiondetailsqryresults->approving_authority,
                    'approved_productlines' => $otherstatesgmpinspectiondetailsqryresults->approved_productlines,
                    'is_enabled' => $otherstatesgmpinspectiondetailsqryresults->is_enabled,
                    'created_by' => $otherstatesgmpinspectiondetailsqryresults->created_by,
                    'created_on' => $otherstatesgmpinspectiondetailsqryresults->created_on,
                    'altered_by' => $otherstatesgmpinspectiondetailsqryresults->altered_by,
                    'dola' => $otherstatesgmpinspectiondetailsqryresults->dola,

               );
               $otherstatesgmpinspectiondetails_res = insertRecord('tra_otherstates_productgmpinspections', $otherstatesgmpinspectiondetailsdata);
               if(!isset($otherstatesgmpinspectiondetails_res['record_id'])){
                DB::rollback();
                return $otherstatesgmpinspectiondetails_res;

                 }

            }
          }
               //Get portal product REGISTRATION ON OTHER COUNTRIES data
        $othercontriesregistrationdetailsqry = $portal_db->table('wb_product_applications as t1')
           ->leftjoin('wb_otherstates_productregistrations as t3', 't1.application_code', 't3.application_code')
           ->select('t3.*')
           ->where('t1.application_code',$application_code);
        $othercontriesregistrationdetailsqryresults = $othercontriesregistrationdetailsqry->get();
        if(isset($othercontriesregistrationdetailsqryresults)){
            foreach ($othercontriesregistrationdetailsqryresults as $othercontriesregistrationdetailsqryresults) {
                # code...
               $othercontriesregistrationdetailsqrydata = array(
                    //'product_id' => $product_id,
					'application_code' => $othercontriesregistrationdetailsqryresults->application_code,
					'continent_region_id' => $othercontriesregistrationdetailsqryresults->continent_region_id,
					'country_id' => $othercontriesregistrationdetailsqryresults->country_id,
					'registration_ref' => $othercontriesregistrationdetailsqryresults->registration_ref,
					'date_of_registration' => $othercontriesregistrationdetailsqryresults->date_of_registration,
					'current_registrationstatus' => $othercontriesregistrationdetailsqryresults->current_registrationstatus,
					'approving_authority'=> $othercontriesregistrationdetailsqryresults->approving_authority,
                    'is_enabled' => $othercontriesregistrationdetailsqryresults->is_enabled,
                    'created_by' => $othercontriesregistrationdetailsqryresults->created_by,
                    'created_on' => $othercontriesregistrationdetailsqryresults->created_on,
                    'altered_by' => $othercontriesregistrationdetailsqryresults->altered_by,
                    'dola' => $othercontriesregistrationdetailsqryresults->dola,

               );
               $othercontriesregistrationdetails_res = insertRecord('tra_otherstates_productregistrations', $othercontriesregistrationdetailsqrydata);
               if(!isset($othercontriesregistrationdetails_res['record_id'])){
                DB::rollback();
                return $othercontriesregistrationdetails_res;

                 }

            }
          }
          $new_submission_params = array(
            'portal_application_id' => $portal_application_id,
            'new_application_id' => $active_application_id,
            "application_code" => $results->application_code,
            "tracking_no" => $results->tracking_no,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
            "prodclass_category_id" => $results->prodclass_category_id,
        );
        $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
        if(!isset($new_submission_res['record_id'])){
            DB::rollback();
            return $new_submission_res;

             }
      } catch (\Exception $exception) {
            DB::rollBack();
            $res['success']=false;
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res['success']=false;
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
          }
    }

public function receiveExemptionsProductsPortalApplication(Request $request){
    
            $user_id = $this->user_id;
            $application_code = $request->input('application_code');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            $section_id = $request->input('section_id');
            $portal_db = DB::connection('portal_db');
            $portal_dbw = clone $portal_db;
            //Get portal product data other_container
            $qry = $portal_db->table('wb_product_applications as t1')
                 ->leftJoin('wb_product_information as t2', 't1.product_id', 't2.id')
                 ->select('t1.*','t2.*','t1.id as portal_application_id','t1.prodclass_category_id as prodclass_category_id','t1.product_id as old_product_id');
            $qry->where('t1.application_code',$application_code);
            $results = $qry->first();
            if(!isset($results->id)){
                DB::rollBack();
                return ['message'=> 'record not found', 'success'=>false]; 
            }
            $portal_application_id =$results->portal_application_id;
            $old_product_id =$results->old_product_id;
            $module_id = $results->module_id;
            $sub_module_id = $results->sub_module_id;
            $section_id = $results->section_id;
            $prodclass_category_id = $results->prodclass_category_id;
            $view_id= generateApplicationViewID();
            $trader_id=$results->trader_id;
            $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
            $applicant_id = getInternalApplicant_id($identification_no);
            $process_qry = DB::table('wf_processes as t1')
                         ->select('t1.id')
                         ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
            $process_results = $process_qry->first();
            if(!isset($process_results->id)){
                DB::rollBack();
                return ['message'=> 'Process not found', 'success'=>false]; 
            }
            $process_id = $process_results->id;
            if($results){
                try {
               DB::beginTransaction();
			   DB::Connection('portal_db')->beginTransaction();
                $prod_data = array(
                'common_name_id'=>$results->common_name_id,
                'product_type_id'=>$results->product_type_id,
                'classification_id'=>$results->classification_id,
                'chemical_entities_type_id'=>$results->chemical_entities_type_id,
                'efficacy_proof_type_id'=>$results->efficacy_proof_type_id,
                'brand_name'=>$results->brand_name,
                'common_name'=>$results->common_name,
                'physical_description'=>$results->physical_description,
                'dosage_form_id'=>$results->dosage_form_id,
                'strength'=>$results->strength,
                'storage_condition'=>$results->storage_condition,
                'product_origin_id'=>$results->product_origin_id,
                'intended_enduser_id'=>$results->intended_enduser_id,
                'intended_use_id'=>$results->intended_use_id,
                'route_of_administration_id'=>$results->route_of_administration_id,
                'contraindication'=>$results->contraindication,
                'gmdn_code'=>$results->gmdn_code,
                'shelf_lifeafter_opening'=>$results->shelf_lifeafter_opening,
                'shelf_life'=>$results->shelf_life,
                'instructions_of_use'=>$results->instructions_of_use,
                'warnings'=>$results->warnings,
                'intended_use'=>$results->intended_use,
                'indications'=>$results->indications,
                'strength_si_unit'=>$results->strength_si_unit,
                'gmdn_category_id'=>$results->gmdn_category_id,
                'gmdn_term'=>$results->gmdn_term,
                'paying_currency_id'=>$results->paying_currency_id,
                'fasttrack_option_id'=>$results->fasttrack_option_id,
                'remarks'=>$results->remarks,
                'has_family'=>$results->has_family,
                'device_family'=>$results->device_family,
                'has_reagents'=>$results->has_reagents,
                'device_reagents'=>$results->device_reagents,
                'has_accessories'=>$results->has_accessories,
                'device_accessories'=>$results->device_accessories,
                'model_name'=>$results->model_name,
                'software_version'=>$results->software_version,
                'device_intended_use'=>$results->device_intended_use,
                'device_brand_name'=>$results->device_brand_name,
                'device_report'=>$results->device_report,
                'productrisk_category_id'=>$results->productrisk_category_id,
                'clinical_condition'=>$results->clinical_condition,
                'device_classification_rules_id'=>$results->device_classification_rules_id,
				'device_classification_rules_id'=>$results->device_classification_rules_id,
				'device_cluster' =>$results->device_cluster,
				'device_compliance_standards' =>$results->device_compliance_standards,
				'gs1_udi' =>$results->gs1_udi,
				'udi_available' => $results->udi_available,
				'gs1_udi_available' => $results->gs1_udi_available,
				'has_cluster' => $results->has_cluster,
				'qms_area' => $results->qms_area,
				'qms_established' => $results->qms_established,
				'technical_doc_summary' => $results->technical_doc_summary,
				// 'listing_no' => $results->listing_no,
				// 'is_listed' => $results->is_listed,
				// 'country_id' => $results->country_id,
                'created_by'=>$results->created_by,
                'created_on'=>$results->created_on,
                 );
    
            $applications_table = 'tra_product_applications';
            $products_table = 'tra_product_information';
            $res = insertRecord('tra_product_information', $prod_data, $user_id);
            if(!isset($res['record_id'])){
                DB::rollback();
                return $res;

                 }
            $record_id = $res['record_id'];
            $product_id = $res['record_id'];
            $app_data = array(
                "process_id" => $process_id,
                'view_id' => $view_id,
                "applicant_id" => $applicant_id,
                "reg_serial" =>$results->reg_serial,
                "workflow_stage_id" => $results->workflow_stage_id,
                "application_status_id" => $results->application_status_id,
                "application_code" => $results->application_code,
                "reference_no" =>$results->reference_no,
                "tracking_no" => $results->tracking_no,
                "sub_module_id" => $results->sub_module_id,
                "module_id" => $results->module_id,
                "section_id" => $results->section_id,
                "product_id" => $product_id,
                "local_agent_id" => $results->local_agent_id,
                "paying_currency_id" =>$results->paying_currency_id,
                "assessment_procedure_id" =>$results->assessment_procedure_id,
                "assessmentprocedure_type_id" =>$results->assessmentprocedure_type_id,
                'prodclass_category_id' => $results->prodclass_category_id,
                "product_type_id" => $results->product_type_id,
                "date_added" => $results->date_added,
                'appeal_type_id' => $results->appeal_type_id,
                'withdrawal_type_id' => $results->withdrawal_type_id,
                'reg_product_id' => $results->reg_product_id,
                "created_by" => $results->created_by,
                "fasttrack_option_id" => $results->fasttrack_option_id,
                "created_on" => Carbon::now()
            );
    
            $app_res = insertRecord('tra_product_applications', $app_data, $user_id);
            if(!isset($app_res['record_id'])){
                DB::rollback();
                return $app_res;

                 }
            $active_application_id = $app_res['record_id'];
            $module_id = $results->module_id;
            $sub_module_id = $results->sub_module_id;
            $section_id = $results->section_id;
            $prodclass_category_id = $results->prodclass_category_id;
            $application_code = $results->application_code;
            $tracking_no = $results->tracking_no;
            initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
            $Stage_qry = DB::table('wf_processes as t1')
                    ->select('t1.workflow_id')
                    ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'prodclass_category_id'=>$prodclass_category_id));
            $Stage_qry_results = $Stage_qry->first();
            if($Stage_qry_results){
                $workflow_id =$Stage_qry_results->workflow_id;
                $stage_id_qry = DB::table('wf_workflow_stages as t1')
                            ->select('t1.id')
                            ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                $stage_id_results = $stage_id_qry->first();
                if(!isset($stage_id_results->id)){
                    DB::rollBack();
                    return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
                }
                $workflow_stage_id = $stage_id_results->id;
                $submission_params = array(
                    'application_id' => $active_application_id,
                    "process_id" => $process_id,
                    "application_code" => $results->application_code,
                    'prodclass_category_id' => $results->prodclass_category_id,
                    "tracking_no" => $results->tracking_no,
                    'usr_from' => $user_id,
                    'usr_to' => $user_id,
                    'previous_stage' => $workflow_stage_id,
                    'current_stage' => $workflow_stage_id,
                    "module_id" => $results->module_id,
                    "sub_module_id" => $results->sub_module_id,
                    "section_id" => $results->section_id,
                    "application_status_id" => $results->application_status_id,
                    'urgency' => 1,
                    "applicant_id" => $applicant_id,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'is_fast_track' => $results->fasttrack_option_id,
                    'created_by' => $user_id
                );
                $sub_res = insertRecord('tra_submissions', $submission_params);
               if(!isset($sub_res['record_id'])){
                DB::rollback();
                return $sub_res;
                 }
            }
                   //Get portal exempted product list
            $exemptionproductsdetailsqry = $portal_db->table('wb_exemption_products as t1')
                   ->select('t1.*')
                   ->where('t1.application_code',$application_code);
            $exemptionproductsresults = $exemptionproductsdetailsqry->get();
            if($exemptionproductsresults){
                foreach ($exemptionproductsresults as $exemptionproductsresults) {
                    # code...
                   $exemptionproductsresultsdata = array(
                        'application_code' => $exemptionproductsresults->application_code,
                        'brand_name' => $exemptionproductsresults->brand_name,
                        'common_name' => $exemptionproductsresults->common_name,
                        'contraindication' => $exemptionproductsresults->contraindication,
                        'storage_condition' => $exemptionproductsresults->storage_condition,
                        'Indication' => $exemptionproductsresults->Indication,
                        'physical_description'=> $exemptionproductsresults->physical_description,
                        'motivation_for_exemption' => $exemptionproductsresults->motivation_for_exemption,
                        'dosage_form_id' => $exemptionproductsresults->dosage_form_id,
                        'quantity' => $exemptionproductsresults->quantity,
                        'strength_si_unit' => $exemptionproductsresults->strength_si_unit,
                        'strength' => $exemptionproductsresults->strength,
                        'shelf_life' => $exemptionproductsresults->shelf_life,
                        'prodclass_category_id' => $exemptionproductsresults->prodclass_category_id,
                        'product_type_id' => $exemptionproductsresults->product_type_id,
                        'section_id' => $exemptionproductsresults->section_id,
                        'manufacturer_id' => $exemptionproductsresults->manufacturer_id,
                        'pack_unit_id' => $exemptionproductsresults->pack_unit_id,
                        'created_by' => $exemptionproductsresults->created_by,
                        'altered_by' => $exemptionproductsresults->altered_by,
                        'created_on' => $exemptionproductsresults->created_on,
                        'dola' => $exemptionproductsresults->dola,
                        'gmdn_code_id' => $exemptionproductsresults->gmdn_code_id,
                        'approval_decision_id' => $exemptionproductsresults->approval_decision_id,
                        'intended_use' => $exemptionproductsresults->intended_use,
                        'devicerisk_classification_id' => $exemptionproductsresults->devicerisk_classification_id,
                        'software_version' => $exemptionproductsresults->software_version,
                        'common_name_id' => $exemptionproductsresults->common_name_id,
                        'product_packaging' => $exemptionproductsresults->product_packaging,
                        'product_origin_id' => $exemptionproductsresults->product_origin_id,
                        'approved_quantity' => $exemptionproductsresults->approved_quantity,
                        'approval_remarks' => $exemptionproductsresults->approval_remarks,
                        'device_family' => $exemptionproductsresults->device_family,
                        'has_family' => $exemptionproductsresults->has_family,
                        'has_reagent' => $exemptionproductsresults->has_reagent,
                        'reagents' => $exemptionproductsresults->reagents,
                        'has_accessories' => $exemptionproductsresults->has_accessories,
                        'device_accessories' => $exemptionproductsresults->device_accessories,
                        'gmdn_term' => $exemptionproductsresults->gmdn_term,
                        'model' => $exemptionproductsresults->model,
                        'gmdn_category_id' => $exemptionproductsresults->gmdn_category_id,
                        'classification_rule_id' => $exemptionproductsresults->classification_rule_id,
                        'gmdn_descriptor' => $exemptionproductsresults->gmdn_descriptor,
                        'quantity_requested' => $exemptionproductsresults->quantity_requested,
                        'pack_size' => $exemptionproductsresults->pack_size,
                        'classification_id' => $exemptionproductsresults->classification_id,
                        'intended_enduser_id' => $exemptionproductsresults->intended_enduser_id,
                        'is_enabled' => $exemptionproductsresults->is_enabled,
                        'product_schedule_id' => $exemptionproductsresults->product_schedule_id,
                        // 'classification_old_id' => $exemptionproductsresults->classification_old_id,
                   );
                   $exemptionproductsresults_res = insertRecord('tra_exemption_products', $exemptionproductsresultsdata);
                   if(!isset($exemptionproductsresults_res['record_id'])){
                      DB::rollback();
                     return $exemptionproductsresults_res;
                       }
                }
            }
        
                      //Get portal pharmacy details list
            $pharmacydetailsqry = $portal_db->table('wb_pharmacy_details as t1')
                      ->select('t1.*')
                      ->where('t1.application_code',$application_code);
            $pharmacydetailsresults = $pharmacydetailsqry->get();
           // dd($pharmacydetailsresults);
            if($pharmacydetailsresults){
                       foreach ($pharmacydetailsresults as $pharmacydetailsresults) {
                           # code...
                          $pharmacydata = array(
                               'product_id' => $product_id,
                               'region_id' => $pharmacydetailsresults->region_id,
                               'district_id' => $pharmacydetailsresults->district_id,
                               'sub_district_id' => $pharmacydetailsresults->sub_district_id,
                               'postal_address' => $pharmacydetailsresults->postal_address,
                               'created_by' => $pharmacydetailsresults->created_by,
                               'created_on'=> $pharmacydetailsresults->created_on,
                               'altered_by' => $pharmacydetailsresults->altered_by,
                               'dola' => $pharmacydetailsresults->dola,
                               'physical_address' => $pharmacydetailsresults->physical_address,
                               'email' => $pharmacydetailsresults->email,
                               'telephone_no' => $pharmacydetailsresults->telephone_no,
                               'application_code' => $pharmacydetailsresults->application_code,
                               'name' => $pharmacydetailsresults->name,
                               'is_enabled' => $pharmacydetailsresults->is_enabled,
                               'personnel_id' => $pharmacydetailsresults->personnel_id,
                               'personnel_type_id' => $pharmacydetailsresults->personnel_type_id,
                               'email_address' => $pharmacydetailsresults->email_address,
                               'premise_id' => $pharmacydetailsresults->premise_id,
                               'risk_premise_type' => $pharmacydetailsresults->risk_premise_type,
                            //    'country_id' => $pharmacydetailsresults->country_id,
                          );
                $pharmacyresults_res = insertRecord('tra_pharmacy_details', $pharmacydata);
				if(!isset($pharmacyresults_res['record_id'])){
                        DB::rollback();
                        return $pharmacyresults_res;

                 }
                 }
                 }
                                //Get portal patients details list
            $patientdetailsqry = $portal_db->table('wb_patient_details as t1')
            ->select('t1.*')
            ->where('t1.application_code',$application_code);
             $patientdetailsresults = $patientdetailsqry->get();
            // dd($pharmacydetailsresults);
             if($patientdetailsresults){
             foreach ($patientdetailsresults as $patientdetailsresults) {
                 # code...
                $patientdata = array(
                     'product_id' => $product_id,
                     'region_id' => $patientdetailsresults->region_id,
                     'district_id' => $patientdetailsresults->district_id,
                     'sub_district_id' => $patientdetailsresults->sub_district_id,
                     'postal_address' => $patientdetailsresults->postal_address,
                     'created_by' => $patientdetailsresults->created_by,
                     'created_on'=> $patientdetailsresults->created_on,
                     'altered_by' => $patientdetailsresults->altered_by,
                     'dola' => $patientdetailsresults->dola,
                     'physical_address' => $patientdetailsresults->physical_address,
                     'email' => $patientdetailsresults->email,
                     'telephone_no' => $patientdetailsresults->telephone_no,
                     'application_code' => $patientdetailsresults->application_code,
                     'name' => $patientdetailsresults->name,
                     'is_enabled' => $patientdetailsresults->is_enabled,
                     'personnel_id' => $patientdetailsresults->personnel_id,
                     'personnel_type_id' => $patientdetailsresults->personnel_type_id,
                     'email_address' => $patientdetailsresults->email,
                     'gender_id' => $patientdetailsresults->gender_id,
                     'id_no' => $patientdetailsresults->id_no,
                     'age' => $patientdetailsresults->age,
                );
           $patientresults_res = insertRecord('tra_patient_details', $patientdata);
            if(!isset($patientresults_res['record_id'])){
              DB::rollback();
              return $patientresults_res;
              
                 }
                }
               }
               
                      //Get portal prescriber details list
            $prescriberdetailsqry = $portal_db->table('wb_prescriber_details as t1')
                   ->select('t1.*')
                   ->where('t1.product_id',$old_product_id);
           $prescriberdetailsresults = $prescriberdetailsqry->get();
           // dd($prescriberdetailsresults);
          if($prescriberdetailsresults){
             foreach ($prescriberdetailsresults as $prescriberdetailsresults) {
                 # code...
                $prescriberdata = array(
                     'product_id' => $product_id,
                     'personnel_id' => $prescriberdetailsresults->personnel_id,
                     'qualification_id' => $prescriberdetailsresults->qualification_id,
                     'position_id' => $prescriberdetailsresults->position_id,
                     'created_by' => $prescriberdetailsresults->created_by,
                     'created_on' => $prescriberdetailsresults->created_on,
                     'altered_by'=> $prescriberdetailsresults->altered_by,
                     'dola' => $prescriberdetailsresults->dola,
                     'application_code' => $prescriberdetailsresults->application_code,
                     'certification_no' => $prescriberdetailsresults->certification_no,
                     'is_enabled' => $prescriberdetailsresults->is_enabled,
                     'institution' => $prescriberdetailsresults->institution,
                     'start_date' => $prescriberdetailsresults->start_date,
                     'end_date' => $prescriberdetailsresults->end_date,
                     'company_name' => $prescriberdetailsresults->company_name,
                     'bhpc_number' => $prescriberdetailsresults->bhpc_number,
                     'place_of_practice' => $prescriberdetailsresults->place_of_practice,
                    //  'name' => $prescriberdetailsresults->name,
                    //  'postal_address' => $prescriberdetailsresults->postal_address,
                    //  'physical_address' => $prescriberdetailsresults->physical_address,
                    //  'country_id' => $prescriberdetailsresults->country_id,
                    //  'region_id' => $prescriberdetailsresults->region_id,
                    //  'district_id' => $prescriberdetailsresults->district_id,
                    //  'email_address' => $prescriberdetailsresults->email_address,
                    //  'telephone_no' => $prescriberdetailsresults->telephone_no,
                );
            $prescriberresults_res = insertRecord('tra_prescriber_details', $prescriberdata);
           if(!isset($prescriberresults_res['record_id'])){
                  DB::rollback();
                 return $prescriberresults_res;

                 }
            }
             }
                      //Get portal imp distributor details list
                $impdistributordetailsqry = $portal_db->table('wb_impdistributor_details as t1')
                      ->select('t1.*')
                      ->where('t1.application_code',$application_code);
                $impdistributordetailsresults = $impdistributordetailsqry->get();
            if($impdistributordetailsresults){
                    foreach ($impdistributordetailsresults as $impdistributordetailsresults) {
                          $impdistributordata = array(
                               'product_id' => $product_id,
                               'region_id' => $impdistributordetailsresults->region_id,
                               'district_id' => $impdistributordetailsresults->district_id,
                               'sub_district_id' => $impdistributordetailsresults->sub_district_id,
                               'postal_address' => $impdistributordetailsresults->postal_address,
                               'created_by' => $impdistributordetailsresults->created_by,
                               'created_on'=> $impdistributordetailsresults->created_on,
                               'altered_by' => $impdistributordetailsresults->altered_by,
                               'dola' => $impdistributordetailsresults->dola,
                               'physical_address' => $impdistributordetailsresults->physical_address,
                               'email_address' => $impdistributordetailsresults->email,
                               'telephone_no' => $impdistributordetailsresults->telephone_no,
                               'application_code' => $impdistributordetailsresults->application_code,
                               'name' => $impdistributordetailsresults->name,
                               'is_enabled' => $impdistributordetailsresults->is_enabled,
                               'importer_id' => $impdistributordetailsresults->importer_id,
                               'country_id' => $impdistributordetailsresults->country_id,
                               'premise_id' => $impdistributordetailsresults->premise_id,
                          );
                    $impdistributor_res = insertRecord('tra_impdistributor_details', $impdistributordata);
					if(!isset($impdistributor_res['record_id'])){
                            DB::rollback();
                            return $impdistributor_res;
                            }
                       }
                   }
       
                      //Get portal imp distributor details list
                $medical_req_detailsqry = $portal_db->table('wb_exemptionanimal_medical_requirments as t1')
                      ->select('t1.*')
                      ->where('t1.product_id',$old_product_id);
                $medical_req_detailsresults = $medical_req_detailsqry->get();
                if($medical_req_detailsresults){
                       foreach ($medical_req_detailsresults as $medical_req_detailsresults) {
                           # code...
                          $medical_req_data = array(
                               'product_id' => $product_id,
                               'prescription' => $medical_req_detailsresults->prescription,
                               'created_by' => $medical_req_detailsresults->created_by,
                               'created_on' => $medical_req_detailsresults->created_on,
                               'altered_by' => $medical_req_detailsresults->altered_by,
                               'dola' => $medical_req_detailsresults->dola,
                               'number_of_animals' => $medical_req_detailsresults->number_of_animals,
                               'clinical_condition' => $medical_req_detailsresults->clinical_condition,
                               'is_enabled' => $medical_req_detailsresults->is_enabled,
                               'medicine_details' => $medical_req_detailsresults->medicine_details,
                               'treatment_duration' => $medical_req_detailsresults->treatment_duration,
                               'exemption_product_id' => $medical_req_detailsresults->exemption_product_id,
                          );
                        $medical_req_res = insertRecord('tra_exemptionanimal_medical_requirments', $medical_req_data);
                        if(!isset($medical_req_res['record_id'])){
                            DB::rollback();
                          return $medical_req_res;
                           }
                        }
                    }
				   $new_submission_params = array(
                        'portal_application_id' => $portal_application_id,
                        'new_application_id' => $active_application_id,
                        "application_code" => $results->application_code,
                        "tracking_no" => $results->tracking_no,
                        "module_id" => $results->module_id,
                        "sub_module_id" => $results->sub_module_id,
                        "section_id" => $results->section_id,
                        "prodclass_category_id" => $results->prodclass_category_id,
                    );
                $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
			     if(!isset($new_submission_res['record_id'])){
                    DB::rollback();
                    return $new_submission_res;
                }
				DB::commit();
				DB::Connection('portal_db')->commit();
        } catch (\Exception $exception) {
                DB::rollBack();
				DB::Connection('portal_db')->rollBack();
                $res['success']=false;
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
				DB::Connection('portal_db')->rollBack();
                DB::rollBack();
                $res['success']=false;
               $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return $res;
              }
    }

public function receiveFacilityPortalApplication(Request $request){
        try {
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $portal_db = DB::connection('portal_db');
        //Get portal premise data
        $qry = $portal_db->table('wb_premises_applications as t1')
             ->leftJoin('wb_premises as t2', 't1.premise_id', 't2.id')
          ->select('t1.*','t2.*');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id = $results->id;
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $section_id=$results->section_id;
        $premise_type_id=$results->premise_type_id;
        $view_id= generateApplicationViewID();
        $trader_id=$results->trader_id;
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
          // get process id
        $process_qry = DB::table('wf_processes as t1')
                     ->select('t1.id')
                     ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'premise_type_id'=>$premise_type_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
            DB::rollBack();
            return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id = $process_results->id;
        if($results){
            $premise_params = array(
                'applicant_id' =>$applicant_id,
                'name' => $results->name,
                'section_id' => $results->section_id,
                'country_id' => $results->country_id,
                'region_id' => $results->region_id,
                'district_id' => $results->district_id,
                'street' => $results->street,
                'telephone' => $results->telephone,
                'fax' => $results->fax,
                'email' => $results->email,
                'website' => $results->website,
                'physical_address' => $results->physical_address,
                'postal_address' => $results->postal_address,
                'business_scale_id' => $results->business_scale_id,
                'business_type_id' => $results->business_type_id,
                'schedule_id' => $results->schedule_type_id,
                'hospital_facilityname' => $results->hospital_facilityname,
                'longitude' => $results->longitude,
                'latitude' => $results->latitude,
                'contact_person_id' => $results->contact_person_id,
                'contact_person_startdate' => $results->contact_person_startdate,
                'contact_person_enddate' => $results->contact_person_enddate,
                'premise_type_id' => $results->premise_type_id,
                // 'vehicle_reg_no' => $vehicle_reg_no,
                'businesstype_class_id' => $results->businesstype_class_id,
                'has_previous_payments' => $results->has_previous_payments,
                'previous_application_no' => $results->previous_application_no,
                'previousreceipt_number' => $results->previousreceipt_number,
                'previousamount_paid' => $results->previousamount_paid,
                'previousinvoice_number'=> $results->previousinvoice_number,
                'tpin_no'   => $results->tpin_no,
                'pacra_reg_no' => $results->pacra_reg_no,
                'hospital_regpremise_id' => $results->hospital_regpremise_id,
                'retail_in_hospital' => $results->retail_in_hospital
            );

        $premise_table = 'tra_premises';
        $applications_table = 'tra_premises_applications';
        $res = insertRecord('tra_premises', $premise_params, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;

             }
        $premise_id = $res['record_id'];
        $application_params = array(
            'premise_id' => $premise_id,
            'process_id' =>$process_id,
            'applicant_id' => $applicant_id,
            'view_id' =>$view_id,
            'module_id' =>$results->module_id,
            'sub_module_id' =>$results->sub_module_id,
            'section_id' => $results->section_id,
            'application_code' =>$results->application_code,
            'application_region_id' =>$results->application_region_id,
            'branch_id' =>$results->branch_id,
            'tracking_no' =>$results->tracking_no,
            'premise_type_id'=>$results->premise_type_id,
            'application_status_id' =>$results->application_status_id,
            'fasttrack_option_id'=>$results->fasttrack_option_id,
        );

        $app_res = insertRecord('tra_premises_applications', $application_params, $user_id);
        if(!isset($app_res['record_id'])){
            DB::rollback();
            return $app_res;

             }
        $active_application_id = $app_res['record_id'];
         //add to submissions table
        $module_id = $results->module_id;
        $sub_module_id = $results->sub_module_id;
        $section_id = $results->section_id;
        $premise_type_id = $results->premise_type_id;
        $application_code = $results->application_code;
        $tracking_no = $results->tracking_no;
        initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
        $Stage_qry = DB::table('wf_processes as t1')
            ->select('t1.workflow_id')
            ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'premise_type_id'=>$premise_type_id));
        $Stage_qry_results = $Stage_qry->first();
        if($Stage_qry_results){
            $workflow_id = $Stage_qry_results->workflow_id;
            $stage_id_qry = DB::table('wf_workflow_stages as t1')
                    ->select('t1.id')
                    ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
            $stage_id_results = $stage_id_qry->first();
            if(!isset($stage_id_results->id)){
                DB::rollBack();
                return ['message'=> 'portal initial stage not set', 'success'=>false]; 
            }
        $workflow_stage_id = $stage_id_results->id;
        $submission_params = array(
            'application_id' => $active_application_id,
            "process_id" => $process_id,
            "application_code" => $results->application_code,
            'premise_type_id' => $results->premise_type_id,
            "tracking_no" => $results->tracking_no,
            'usr_from' => $user_id,
            'usr_to' => $user_id,
            'previous_stage' => $workflow_stage_id,
            'current_stage' => $workflow_stage_id,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
            "application_status_id" => $results->application_status_id,
            'urgency' => 1,
            "applicant_id" => $applicant_id,
            'remarks' => 'Initial save of the application',
            'date_received' => Carbon::now(),
            'created_on' => Carbon::now(),
            'is_fast_track' => $results->fasttrack_option_id,
            'created_by' => $user_id
        );

        $sub_res = insertRecord('tra_submissions', $submission_params);
        if(!isset($sub_res['record_id'])){
        DB::rollback();
        return $sub_res;
         }
         
        }
        else{
            DB::rollBack();
            return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
         }

                           //Replicate Facility Other Details
        $premisespersonnelsqry = $portal_db->table('wb_premises_applications as t1')
           ->leftjoin('wb_premises_personnel as t2', 't1.premise_id', 't2.premise_id')
           ->select('t2.*')
           ->where('t1.application_code',$application_code);
        $premisespersonnelsqryresults = $premisespersonnelsqry->get();
        if($premisespersonnelsqryresults){
        foreach ($premisespersonnelsqryresults as $premisespersonnelsqryresults) {
                # code...
               $premisespersonnelsqryresultsdata = array(
                    'premise_id' => $premise_id,
                    'personnel_id' => $premisespersonnelsqryresults->personnel_id,
                    'position_id' => $premisespersonnelsqryresults->position_id,
                    'qualification_id' => $premisespersonnelsqryresults->qualification_id,
                    'registration_no' => $premisespersonnelsqryresults->registration_no,
                    'study_field_id' => $premisespersonnelsqryresults->study_field_id,
                    'institution'=> $premisespersonnelsqryresults->institution,
                    'start_date' => $premisespersonnelsqryresults->start_date,
                    'end_date' => $premisespersonnelsqryresults->end_date,
                    'status_id' => $premisespersonnelsqryresults->status_id,
                    'created_by' => $premisespersonnelsqryresults->created_by,
                    'created_on'=> $premisespersonnelsqryresults->created_on,
                    'dola' => $premisespersonnelsqryresults->dola,
               );
               $premisespersonnelsqryresults_res = insertRecord('tra_premises_personnel', $premisespersonnelsqryresultsdata);
               if(!isset($premisespersonnelsqryresults_res['record_id'])){
                DB::rollback();
                return $premisespersonnelsqryresults_res;

                 }
            }
          }
           //Get portalpremises proprietors  data
        $premisesproprietorsdetailsqry = $portal_db->table('wb_premises_applications as t1')
         ->leftjoin('wb_premises_proprietors as t2', 't1.premise_id', 't2.premise_id')
         ->select('t2.*')
         ->where('t1.application_code',$application_code);
        $premisesproprietorsdetailsresults = $premisesproprietorsdetailsqry->get();
        if($premisesproprietorsdetailsresults){
        foreach ($premisesproprietorsdetailsresults as $premisesproprietorsdetailsresults) {
            # code...
           $premisesproprietorsdetailsdata = array(
                'premise_id' => $premise_id,
                'name' => $premisesproprietorsdetailsresults->name,
                'sex_id' => $premisesproprietorsdetailsresults->sex_id,
                'nationality_id' => $premisesproprietorsdetailsresults->nationality_id,
                //'had_offence' => $premisesproprietorsdetailsresults->had_offence,
                //'had_license_revoke_denied' => $premisesproprietorsdetailsresults->had_license_revoke_denied,
                //'offence'=> $premisesproprietorsdetailsresults->offence,
               // 'lic_deniedrevoked_reason' => $premisesproprietorsdetailsresults->lic_deniedrevoked_reason,
                'telephone_no' => $premisesproprietorsdetailsresults->telephone_no,
                'email_address' => $premisesproprietorsdetailsresults->email_address,
                'physical_address' => $premisesproprietorsdetailsresults->physical_address,
                'occupation' => $premisesproprietorsdetailsresults->occupation,
                'identification_type_id' => $premisesproprietorsdetailsresults->identification_type_id,
                'identification_no' => $premisesproprietorsdetailsresults->identification_no,
                'altered_by' => $premisesproprietorsdetailsresults->altered_by,
                'dola' => $premisesproprietorsdetailsresults->dola,
                'dob' => $premisesproprietorsdetailsresults->dob,
                'created_by'=> $premisesproprietorsdetailsresults->created_by,

           );
           $premisesproprietorsdetails_res = insertRecord('tra_premises_proprietors', $premisesproprietorsdetailsdata);
           if(!isset($premisesproprietorsdetails_res['record_id'])){
            DB::rollback();
            return $premisesproprietorsdetails_res;

             }
        }
        $new_submission_params = array(
            'portal_application_id' => $portal_application_id,
            'new_application_id' => $active_application_id,
            "application_code" => $results->application_code,
            "tracking_no" => $results->tracking_no,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
            "premise_type_id" => $results->premise_type_id,
        );

        $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
        if(!isset($new_submission_res['record_id'])){
            DB::rollback();
            return $new_submission_res;

             }
         }

             }
            } catch (\Exception $exception) {
                DB::rollBack();
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                DB::rollBack();
               $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
            }
            return $res;
    }
            //GMP
 public function receiveGmpPortalApplication(Request $request){
    try {

        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $portal_db = DB::connection('portal_db');
                    //Get portal  data
        $qry = $portal_db->table('wb_gmp_applications as t1')
            ->leftJoin('wb_manufacturing_sites as t2', 't1.manufacturing_site_id', 't2.id')
            ->select('t1.*','t2.*');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id=$results->id;
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $section_id=$results->section_id;
        $view_id= generateApplicationViewID();
        $trader_id=$results->trader_id;
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
        // get process id
        $process_qry = DB::table('wf_processes as t1')
                     ->select('t1.id')
                     ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
            DB::rollBack();
            return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id = $process_results->id;
        if($results){
            $manufacturing_site_params = array(
                'name'=>$results->name,
                'applicant_id' =>$applicant_id,
                'country_id' => $results->country_id,
                'region_id' => $results->region_id,
                'district_id' => $results->district_id,
                'telephone_no' => $results->telephone,
                'fax' =>  $results->fax,
                'email_address' => $results->email,
                'website' =>  $results->website,
                'physical_address' => $results->physical_address,
                'postal_address' => $results->postal_address,
                'business_scale_id' => $results->business_scale_id,
                'longitude' => $results->longitude,
                'latitude' => $results->latitude,
                'dola' => $results->dola,
                'altered_by' => $results->altered_by,
                'applicant_as_ltr' => $results->applicant_as_ltr,
                'ltr_id' => $results->ltr_id,
                'applicant_contact_person' => $results->applicant_contact_person,
                'contact_person_id' => $results->contact_person_id,
                'contact_person_startdate' => $results->contact_person_startdate,
                'contact_person_enddate' => $results->contact_person_enddate,
                'man_site_id' => $results->man_site_id,
                        );
        
        $manufacturing_site_table = 'tra_manufacturing_sites';
        $applications_table = 'tra_gmp_applications';
        $res = insertRecord($manufacturing_site_table, $manufacturing_site_params, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;

             }
        $manufacturing_site_id = $res['record_id'];
                $application_params = array(
                        'manufacturing_site_id' => $manufacturing_site_id,
                        'process_id' => $process_id,
                        'view_id' => $view_id,
                        'applicant_id' => $applicant_id,
                        'module_id' => $results->module_id,
                        'sub_module_id' => $results->sub_module_id,
                        'gmp_type_id' => $results->gmp_type_id,
                        'manufacturing_type_id' => $results->manufacturing_type_id,
                        'zone_id' => $results->zone_id,
                        'section_id' => $results->section_id,
                        'application_code' => $results->application_code,
                        'assessment_type_id' => $results->assessment_type_id,
                        'assessment_procedure_id' => $results->assessment_procedure_id,
                        'inspection_type_id' => $results->inspection_type_id,
                        'facility_location_id' => $results->facility_location_id,
                        'workflow_stage_id' => $results->workflow_stage_id,
                        'tracking_no' => $results->tracking_no,
                        'application_status_id' => $results->application_status_id,
                    );
        
        $res = insertRecord($applications_table, $application_params, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;
        }
        $application_id = $res['record_id'];
        //add to submissions table
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $section_id=$results->section_id;
        $application_code = $results->application_code;
        $tracking_no = $results->tracking_no;
        initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
        $Stage_qry = DB::table('wf_processes as t1')
                    ->select('t1.workflow_id')
                    ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>2));
        $Stage_qry_results = $Stage_qry->first();
        if($Stage_qry_results){
        $workflow_id =$Stage_qry_results->workflow_id;
        $stage_id_qry = DB::table('wf_workflow_stages as t1')
                      ->select('t1.id')
                      ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
        }
        $workflow_stage_id=$stage_id_results->id;
        $submission_params = array(
                        'application_id' => $application_id,
                        "process_id" => $process_id,
                        "applicant_id" => $applicant_id,
                        "application_code" => $results->application_code,
                        "tracking_no" => $results->tracking_no,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        "module_id" => $results->module_id,
                        "sub_module_id" => $results->sub_module_id,
                        "section_id" => $results->section_id,
                        "application_status_id" => $results->application_status_id,
                        'urgency' => 1,
                        'remarks' => 'Initial save of the application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'is_fast_track' => $results->fasttrack_option_id,
                        'created_by' => $user_id
                    );
        
            $sub_res = insertRecord('tra_submissions', $submission_params);
            if(!isset($sub_res['record_id'])){
                DB::rollback();
                return $sub_res;

                 }
         
            }
            else{
                DB::rollBack();
                return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
            }
                           //Get GMP MNUFACTURING PERSONNEL DETAILS
            $sitespersonneldetiailsqry = $portal_db->table('wb_gmp_applications as t1')
                          ->leftjoin('wb_manufacturing_sites_personnel as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                         ->select('t2.*')
                         ->where('t1.application_code',$application_code);
            $sitespersonneldetiailsresults = $sitespersonneldetiailsqry->get();
            if($sitespersonneldetiailsresults){
                foreach ($sitespersonneldetiailsresults as $sitespersonneldetiailsresults) {
                            # code...
                    $sitespersonneldetiailsresultsdata = array(
                        'manufacturing_site_id' => $manufacturing_site_id,
                        'init_site_id' => $sitespersonneldetiailsresults->init_site_id,
                        'name' => $sitespersonneldetiailsresults->name,
                        'telephone' => $sitespersonneldetiailsresults->telephone,
                        //'had_offence' => $sitespersonneldetiailsresults->had_offence,
                        'email_address' => $sitespersonneldetiailsresults->email_address,
                        'postal_address'=> $sitespersonneldetiailsresults->postal_address,
                        'fax' => $sitespersonneldetiailsresults->fax,
                        'end_date' => $sitespersonneldetiailsresults->end_date,
                        'start_date' => $sitespersonneldetiailsresults->start_date,
                        'institution' => $sitespersonneldetiailsresults->institution,
                        'personnel_id' => $sitespersonneldetiailsresults->personnel_id,
                        'study_field_id' => $sitespersonneldetiailsresults->study_field_id,
                        'qualification_id' => $sitespersonneldetiailsresults->qualification_id,
                        'registration_no' => $sitespersonneldetiailsresults->registration_no,
                        'position_id' => $sitespersonneldetiailsresults->position_id,
                        'status_id' => $sitespersonneldetiailsresults->status_id,
                        'altered_by' => $sitespersonneldetiailsresults->altered_by,
                        'dola' => $sitespersonneldetiailsresults->dola,
                        'created_by'=> $sitespersonneldetiailsresults->created_by,
        
                           );
            $sitespersonneldetails_res = insertRecord('tra_manufacturing_sites_personnel', $sitespersonneldetiailsresultsdata);
            if(!isset($sitespersonneldetails_res['record_id'])){
                DB::rollback();
                return $sitespersonneldetails_res;

                 }
        
            }
            }
                           //Get GMP MNUFACTURING block DETAILS
            $sitesblockdetiailsqry = $portal_db->table('wb_gmp_applications as t1')
                             ->leftjoin('wb_manufacturingsite_blocks as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                             ->select('t2.*')
                             ->where('t1.application_code',$application_code);
            $sitesblockdetiailsresults = $sitesblockdetiailsqry->get();
            if($sitesblockdetiailsresults){
                foreach ($sitesblockdetiailsresults as $sitesblockdetiailsresults) {
                           # code...
                    $sitesblockdetiailsresultsdata = array(
                        'manufacturing_site_id' => $manufacturing_site_id,
                        'name' => $sitesblockdetiailsresults->name,
                        'activities' => $sitesblockdetiailsresults->activities,
                        'altered_by' => $sitesblockdetiailsresults->altered_by,
                        'dola' => $sitesblockdetiailsresults->dola,
                        'created_by'=> $sitesblockdetiailsresults->created_by,
                          );

            $sitesblockdetails_res = insertRecord('tra_manufacturing_sites_blocks', $sitesblockdetiailsresultsdata);
            if(!isset($sitesblockdetails_res['record_id'])){
                DB::rollback();
                return $sitesblockdetails_res;

                 }
                }
            }
                           //Get productline details DETAILS
            $productlinedetiailsqry = $portal_db->table('wb_gmp_applications as t1')
                 ->leftjoin('wb_gmp_productline_details as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                 ->select('t2.*')
                 ->where('t1.application_code',$application_code);
           $productlinedetiailsresults = $productlinedetiailsqry->get();
            if($productlinedetiailsresults){
           foreach ($productlinedetiailsresults as $productlinedetiailsresults) {
               # code...
              $productlinedetiailsresultsdata = array(
                   'manufacturing_site_id' => $manufacturing_site_id,
                   'manufacturingsite_block_id' => $productlinedetiailsresults->manufacturingsite_block_id,
                   'init_site_id' => $productlinedetiailsresults->init_site_id,
                   'category_id' => $productlinedetiailsresults->category_id,
                   'prodline_description' => $productlinedetiailsresults->prodline_description,
                   'prodline_description_id' => $productlinedetiailsresults->prodline_description_id,
                   'altered_by' => $productlinedetiailsresults->altered_by,
                   'dola' => $productlinedetiailsresults->dola,
                   'created_by'=> $productlinedetiailsresults->created_by,
        
              );
            $productlinedetiailsresults_res = insertRecord('gmp_productline_details', $productlinedetiailsresultsdata);
            if(!isset($productlinedetiailsresults_res['record_id'])){
                DB::rollback();
                return $productlinedetiailsresults_res;

                 }
                  }
            }
                           //Getproduct gmpinspection details DETAILS
            $gmpinspectionqry = $portal_db->table('wb_gmp_applications as t1')
                           ->leftjoin('wb_product_gmpinspectiondetails as t2', 't1.manufacturing_site_id', 't2.manufacturing_site_id')
                           ->select('t2.*')
                           ->where('t1.application_code',$application_code);
            $gmpinspectiondetiailsresults = $gmpinspectionqry->get();
                     //dd($gmpinspectiondetiailsresults);
            if($gmpinspectiondetiailsresults){
                foreach ($gmpinspectiondetiailsresults as $gmpinspectiondetiailsresults) {
                         # code...
                $gmpinspectiondetiailsresultsdata = array(
                             'manufacturing_site_id' => $manufacturing_site_id,
                             'product_id' => $gmpinspectiondetiailsresults->product_id,
                             'reg_product_id' => $gmpinspectiondetiailsresults->reg_product_id,
                             'reg_site_id' => $gmpinspectiondetiailsresults->reg_site_id,
                             'gmp_productline_id' => $gmpinspectiondetiailsresults->gmp_productline_id,
                             'gmpproduct_line_id' => $gmpinspectiondetiailsresults->gmpproduct_line_id,
                             'status_id' => $gmpinspectiondetiailsresults->status_id,
                             'altered_by' => $gmpinspectiondetiailsresults->altered_by,
                             'dola' => $gmpinspectiondetiailsresults->dola,
                             'created_by'=> $gmpinspectiondetiailsresults->created_by,
                             'created_on'=> $gmpinspectiondetiailsresults->created_on,
        
                        );
                $gmpinspectiondetiails_res = insertRecord('tra_product_gmpinspectiondetails', $gmpinspectiondetiailsresultsdata);
                if(!isset($gmpinspectiondetiails_res['record_id'])){
                    DB::rollback();
                    return $gmpinspectiondetiails_res;
    
                     }
                        }
                        }
            $new_submission_params = array(
                            'portal_application_id' => $portal_application_id,
                            'new_application_id' => $application_id,
                            "application_code" => $results->application_code,
                            "tracking_no" => $results->tracking_no,
                            "module_id" => $results->module_id,
                            "sub_module_id" => $results->sub_module_id,
                            "section_id" => $results->section_id,
                        );
            
            $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
            if(!isset($new_submission_res['record_id'])){
                    DB::rollback();
                    return $new_submission_res;
    
                     }

                }
             } catch (\Exception $exception) {
                                DB::rollBack();
                                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                            } catch (\Throwable $throwable) {
                                DB::rollBack();
                               $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                            }
                            return $res;
        }
 //Clinical Trial
 public function receiveClinicalTrialPortalApplication(Request $request){
    try {
           $user_id = $this->user_id;
           $application_code = $request->input('application_code');
           $module_id = $request->input('module_id');
           $sub_module_id = $request->input('sub_module_id');
           $section_id = $request->input('section_id');
           $portal_db = DB::connection('portal_db');
           //Get portal product data
           $qry = $portal_db->table('wb_clinical_trial_applications as t1')
                  ->select('t1.*');
           $qry->where('t1.application_code',$application_code);
           $results = $qry->first();
           if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
           }
           $portal_application_id =$results->id;
           $module_id=$results->module_id;
           $sub_module_id=$results->sub_module_id;
           $section_id=$results->section_id;
           $view_id= generateApplicationViewID();
           $trader_id=$results->trader_id;
           $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
           $applicant_id = getInternalApplicant_id($identification_no);
           $process_qry = DB::table('wf_processes as t1')
                         ->select('t1.id')
                         ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
           $process_results = $process_qry->first();
           if(!isset($process_results->id)){
               DB::rollBack();
               return ['message'=> 'Process not found', 'success'=>false]; 
           }
           $process_id = $process_results->id;
           if($results){
               $application_params = array(
                   'process_id' => $process_id,
                   'applicant_id' => $applicant_id,
                   'view_id' => $view_id,
                   'module_id' => $results->module_id,
                   'sub_module_id' => $results->sub_module_id,
                   'section_id' => $results->section_id,
                   'application_code' => $results->application_code,
                   'workflow_stage_id' => $results->workflow_stage_id,
                   'tracking_no' =>  $results->tracking_no,
                   'application_status_id' => $results->application_status_id,
                   'gcp_guideline_statement' => $results->gcp_guideline_statement,
                   'trial_building_capacity_statement' => $results->trial_building_capacity_statement,
                   'insurance_measures_statement' => $results->insurance_measures_statement,
                   'conflict_of_interest_statement' => $results->conflict_of_interest_statement,
                   'compensation_statement' => $results->compensation_statement,
                   'gcp_guideline_comment' => $results->gcp_guideline_comment,
                   'investigators_choice_comment' => $results->investigators_choice_comment,
                   'gcp_training_needs_comment' => $results->gcp_training_needs_comment,
                   'trial_building_capacity_comment' => $results->trial_building_capacity_comment,
                   'resource_comment' => $results->resource_comment,
                   'monitoring_plan_comment' => $results->monitoring_plan_comment,
                   'how_confidentiality_is_maintained_comment' => $results->how_confidentiality_is_maintained_comment,
                   'insurance_measures_comment' => $results->insurance_measures_comment,
                   'patient_concent_comment' => $results->patient_concent_comment,
                   'publication_ethics_policy_comment' => $results->publication_ethics_policy_comment,
                   'participant_post_trial_condition_management_comment' => $results->participant_post_trial_condition_management_comment,
                   'ethics_committee_capacity_comment' => $results->ethics_committee_capacity_comment,
                   'compensation_comment' => $results->compensation_comment,
                   'is_conducted_in_host_country' => $results->is_conducted_in_host_country,
                   'why_not_conducted_in_host' => $results->why_not_conducted_in_host,
                   'study_duration' => $results->study_duration,
                   'duration_desc' => $results->duration_desc,
                   'has_other_authority_submission_pending_approval' => $results->has_other_authority_submission_pending_approval,
                   'other_authority_submission_pending_approval' => $results->other_authority_submission_pending_approval,
                   'has_other_authority_submission_with_approval' => $results->has_other_authority_submission_with_approval,
                   'other_authority_submission_with_approval' => $results->other_authority_submission_with_approval,
                   'has_other_trial_submission_with_rejection' => $results->has_other_trial_submission_with_rejection,
                   'other_authority_submission_with_rejection' => $results->other_authority_submission_with_rejection,
                   'has_other_trial_submission_suspension' => $results->has_other_trial_submission_suspension,
                   'other_authority_submission_suspension' => $results->other_authority_submission_suspension,
                   'is_being_undertaken_in_sadac_others' => $results->is_being_undertaken_in_sadac_others,
                   'being_undertaken_in_sadac_others' => $results->being_undertaken_in_sadac_others,
                   'includes_sub_study' => $results->includes_sub_study,
                   'is_sub_study_conducted_locally' => $results->is_sub_study_conducted_locally,
                   'reason_sub_study_not_conducted_locally' => $results->reason_sub_study_not_conducted_locally,
                   'are_references_current' => $results->are_references_current,
                   'discrepancies_present' => $results->discrepancies_present,
                   'discrepancies' => $results->discrepancies,
                   'other_comments' => $results->other_comments,
                   'sponsor_id' => $results->sponsor_id,
                   'investigator_id' => $results->investigator_id,
                   'study_title' => $results->study_title,
                   'short_study_title' => $results->short_study_title,
                   'protocol_no' => $results->protocol_no,
                   'phase_id' => $results->phase_id,
                   'version_no' => $results->version_no,
                   'date_of_protocol' => $results->date_of_protocol,
                   'clinical_prodsection_ids' =>$results->clinical_prodsection_ids,
                   'sponsor_origin_id' => $results->sponsor_origin_id,
                   'rationale_summary' => $results->rationale_summary,
                   'problem_summary' => $results->problem_summary,
                   'local_relevance_summary' => $results->local_relevance_summary,
                   'trial_medicine_property_summary' => $results->trial_medicine_property_summary,
                   'pre_clinical_findings_summary' => $results->pre_clinical_findings_summary,
                   'clinical_findings_summary' => $results->clinical_findings_summary,
                   'study_objective' => $results->study_objective,
                   'trial_design' => $results->trial_design,
                   'trial_participant_summary' => $results->trial_participant_summary,
                   'selection_criteria_summary' => $results->selection_criteria_summary,
                   'treatment_modalities_summary' => $results->treatment_modalities_summary,
                   'trial_outcome_measurement' => $results->trial_outcome_measurement,
                   'adverse_event_measure' => $results->adverse_event_measure,
                   'sample_determination' => $results->sample_determination,
                   'quantitative_statistical_methods' => $results->quantitative_statistical_methods,
                   'qualitative_statistical_methods' => $results->qualitative_statistical_methods,
                   'data_processing_summary' => $results->data_processing_summary,
                   'interim_summary' => $results->interim_summary,
                   'local_contact_id' => $results->local_agent_id,
                   'clinicalstudy_participanttype_id' => $results->clinicalstudy_participanttype_id,
               );
               
           $applications_table = 'tra_clinical_trial_applications';
           $res = insertRecord($applications_table, $application_params, $user_id);
           if(!isset($res['record_id'])){
               DB::rollback();
               return $res;
                }
            $record_id = $res['record_id'];
            $application_id = $res['record_id'];
            $module_id=$results->module_id;
            $sub_module_id=$results->sub_module_id;
             $section_id=$results->section_id;
            $Stage_qry = DB::table('wf_processes as t1')
               ->select('t1.workflow_id')
               ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
           $Stage_qry_results = $Stage_qry->first();
           if($Stage_qry_results){
               $workflow_id =$Stage_qry_results->workflow_id;
               $stage_id_qry = DB::table('wf_workflow_stages as t1')
               ->select('t1.id')
               ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
               $stage_id_results = $stage_id_qry->first();
               if(!isset($stage_id_results->id)){
                DB::rollBack();
                return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
                }
               $workflow_stage_id=$stage_id_results->id;
               $submission_params = array(
               "process_id" => $process_id,
               'application_id' => $application_id,
               "applicant_id" => $applicant_id,
               "application_code" => $results->application_code,
               "tracking_no" => $results->tracking_no,
               'usr_from' => $user_id,
               'usr_to' => $user_id,
               'previous_stage' => $workflow_stage_id,
               'current_stage' => $workflow_stage_id,
               "module_id" => $results->module_id,
               "sub_module_id" => $results->sub_module_id,
               "section_id" => $results->section_id,
               "application_status_id" => $results->application_status_id,
               'urgency' => 1,
               'remarks' => 'Initial save of the application',
               'date_received' => Carbon::now(),
               'created_on' => Carbon::now(),
               'is_fast_track' => $results->fasttrack_option_id,
               'created_by' => $user_id
           );

           $sub_res = insertRecord('tra_submissions', $submission_params);
           if(!isset($sub_res['record_id'])){
               DB::rollback();
               return $sub_res;
                }
           }
           else{
            DB::rollBack();
            return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
            }
              //Get clinicalstudy participants DETAILS
           $participantsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
            ->leftjoin('wb_clinicalstudy_participants as t2', 't1.id', 't2.application_id')
            ->select('t2.*')
            ->where('t1.id',$portal_application_id);
           $participantsdetiailsresults = $participantsdetiailsqry->get();
           if($participantsdetiailsresults){
           foreach ($participantsdetiailsresults as $participantsdetiailsresults) {
               # code...
              $participantsdetiailsresultsdata = array(
                   'application_id' => $application_id,
                   'number_oflocal_participants' => $participantsdetiailsresults->number_oflocal_participants,
                   'number_of_participants' => $participantsdetiailsresults->number_of_participants,
                   'min_enrollment' => $participantsdetiailsresults->min_enrollment,
                   'max_enrollment' => $participantsdetiailsresults->max_enrollment,
                   'local_volunteer_base' => $participantsdetiailsresults->local_volunteer_base,
                   'potential_retrospectivedata'=> $participantsdetiailsresults->potential_retrospectivedata,
                   'clinicalstudy_participanttype_id' => $participantsdetiailsresults->clinicalstudy_participanttype_id,
                   'altered_by' => $participantsdetiailsresults->altered_by,
                   'dola' => $participantsdetiailsresults->dola,
                   'created_by'=> $participantsdetiailsresults->created_by,

              );
              $participantsdetails_res = insertRecord('tra_clinicalstudy_participants', $participantsdetiailsresultsdata);
              if(!isset($participantsdetails_res['record_id'])){
               DB::rollback();
               return $participantsdetails_res;
                }
              }
              }
              //Get investigators DETAILS
           $investigatorsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                ->leftjoin('wb_clinical_trial_investigators as t2','t1.id', 't2.application_id')
                ->select('t2.*')
                ->where('t1.application_code',$application_code);
           $investigatorsqryresults = $investigatorsqry->get();
           if($investigatorsqryresults){
           foreach ($investigatorsqryresults as $investigatorsqryresults) {
              # code...
             $investigatorsqryresultsdata = array(
                  'application_id' => $application_id,
                  'category_id' => $investigatorsqryresults->category_id,
                  'investigator_id' => $investigatorsqryresults->investigator_id,
                  'application_reference_no'=> $investigatorsqryresults->application_reference_no,
                  'total_number_of_studies'=> $investigatorsqryresults->total_number_of_studies,
                  'total_number_of_studies_date'=> $investigatorsqryresults->total_number_of_studies_date,
                  'total_number_of_participants'=> $investigatorsqryresults->total_number_of_participants,
                  'total_number_of_participants_date'=> $investigatorsqryresults->total_number_of_participants_date,
                  'trial_work_hours'=> $investigatorsqryresults->trial_work_hours,
                  'trial_work_percentage'=> $investigatorsqryresults->trial_work_percentage,
                  'trial_administrative_work_hours'=> $investigatorsqryresults->trial_administrative_work_hours,
                  'trial_administrative_work_percentage'=> $investigatorsqryresults->trial_administrative_work_percentage,
                  'organization_work_hours'=> $investigatorsqryresults->organization_work_hours,
                  'organization_work_percentage'=> $investigatorsqryresults->organization_work_percentage,
                  'organization_administrative_work_hours'=> $investigatorsqryresults->organization_administrative_work_hours,
                  'organization_administrative_work_percentage'=> $investigatorsqryresults->organization_administrative_work_percentage,
                  'teaching_preparation_hours'=> $investigatorsqryresults->teaching_preparation_hours,
                  'teaching_preparation_percentage'=> $investigatorsqryresults->teaching_preparation_percentage,
                  'teaching_lectures_hours' => $investigatorsqryresults->teaching_lectures_hours,
                  'teaching_lectures_percentage' => $investigatorsqryresults->teaching_lectures_percentage,
                  'writting_upwork_hours' => $investigatorsqryresults->writting_upwork_hours,
                  'writting_upwork_percentage' => $investigatorsqryresults->writting_upwork_percentage,
                  'information_sourcing_hours' => $investigatorsqryresults->information_sourcing_hours,
                  'information_sourcing_percentage' => $investigatorsqryresults->information_sourcing_percentage,
                  'other_investigator_tasks' => $investigatorsqryresults->other_investigator_tasks,
                  'other_tasks_hours' => $investigatorsqryresults->other_tasks_hours,
                  'other_tasks_percentage' => $investigatorsqryresults->other_tasks_percentage,
                  'study_site_id' => $investigatorsqryresults->study_site_id,
                  'altered_by' => $investigatorsqryresults->altered_by,
                  'dola' => $investigatorsqryresults->dola,
                  'created_by'=> $investigatorsqryresults->created_by,

             );
             $investigatorsdetails_res = insertRecord('clinical_trial_investigators', $investigatorsqryresultsdata);
             if(!isset($investigatorsdetails_res['record_id'])){
               DB::rollback();
               return $investigatorsdetails_res;
                }
             }
             }
          //Get Clinical trial monitors DETAILS
          $trialmonitorsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
          ->leftjoin('wb_clinical_trial_monitors as t2','t1.id', 't2.application_id')
          ->select('t2.*')
          ->where('t1.application_code',$application_code);
         $trialmonitorsdetiailsresults = $trialmonitorsdetiailsqry->get();
        if($trialmonitorsdetiailsresults){
        foreach ($trialmonitorsdetiailsresults as $trialmonitorsdetiailsresults) {
        # code...
         $trialmonitorsdetiailsresultsdata = array(
            'application_id' => $application_id,
            'monitor_id' => $trialmonitorsdetiailsresults->monitor_id,
            'altered_by' => $trialmonitorsdetiailsresults->altered_by,
            'dola' => $trialmonitorsdetiailsresults->dola,
            'created_by'=> $trialmonitorsdetiailsresults->created_by,

       );
       $trialmonitorsdetiailsresults_res = insertRecord('tra_clinical_trial_monitors', $trialmonitorsdetiailsresultsdata);
       if(!isset($trialmonitorsdetiailsresults_res['record_id'])){
           DB::rollback();
           return $trialmonitorsdetiailsresults_res;
            }
       }
       }
              //Get clinical_trial_sites DETAILS
       $trialsitesdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
              ->leftjoin('wb_clinical_trial_sites as t2', 't1.id', 't2.application_id')
              ->select('t2.*')
              ->where('t1.application_code',$application_code);
       $trialsitesdetiailsresults = $trialsitesdetiailsqry->get();
       if($trialsitesdetiailsresults){
           foreach ($trialsitesdetiailsresults as $trialsitesdetiailsresults) {
            # code...
           $trialsitesdetiailsresultsdata = array(
               'application_id' => $application_id,
                'study_site_id' => $trialsitesdetiailsresults->study_site_id,
                'app_reference_no' => $trialsitesdetiailsresults->app_reference_no,
                'approving_instution' => $trialsitesdetiailsresults->approving_instution,
                'responsible_ethics_committee' => $trialsitesdetiailsresults->responsible_ethics_committee,
                'approval_date' => $trialsitesdetiailsresults->approval_date,
                'application_reference_no' => $trialsitesdetiailsresults->application_reference_no,
                'site_capacity_statement' => $trialsitesdetiailsresults->site_capacity_statement,
                'is_competitive_enrollment' => $trialsitesdetiailsresults->is_competitive_enrollment,
                'site_min_enrollment' => $trialsitesdetiailsresults->site_min_enrollment,
                'site_max_enrollment' => $trialsitesdetiailsresults->site_max_enrollment,
                'site_enrollment_statement' => $trialsitesdetiailsresults->site_enrollment_statement,
                'local_volunteer_base' => $trialsitesdetiailsresults->local_volunteer_base,
                'potential_retrospectivedata' => $trialsitesdetiailsresults->potential_retrospectivedata,
                'altered_by' => $trialsitesdetiailsresults->altered_by,
                'dola' => $trialsitesdetiailsresults->dola,
                'created_by'=> $trialsitesdetiailsresults->created_by,

           );
           $trialsitesdetiailsresults_res = insertRecord('clinical_trial_sites', $trialsitesdetiailsresultsdata);
           if(!isset($trialsitesdetiailsresults_res['record_id'])){
               DB::rollback();
               return $trialsitesdetiailsresults_res;
                }
           }
           }
              //Get clinical_trial_sponsors DETAILS
              $sponsorsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
              ->leftjoin('wb_clinical_trial_sponsors as t2', 't1.id', 't2.application_id')
              ->select('t2.*')
              ->where('t1.application_code',$application_code);
           $sponsorsdetiailsresults = $sponsorsdetiailsqry->get();
           //dd($sponsorsdetiailsresults);
         if($sponsorsdetiailsresults){
           foreach ($sponsorsdetiailsresults as $sponsorsdetiailsresults) {
            # code...
           $sponsorsdetiailsresultsdata = array(
               'application_id' => $application_id,
                'sponsor_id' => $sponsorsdetiailsresults->sponsor_id,
                'altered_by' => $sponsorsdetiailsresults->altered_by,
                'dola' => $sponsorsdetiailsresults->dola,
                'created_by'=> $sponsorsdetiailsresults->created_by,

           );
           $sponsorsdetiailsresults_res = insertRecord('tra_clinical_trial_sponsors', $sponsorsdetiailsresultsdata);
           if(!isset($sponsorsdetiailsresults_res['record_id'])){
               DB::rollback();
               return $sponsorsdetiailsresults_res;
                }
           }
           }
            //    $ct_produts_qry = $portal_db->table('wb_clinical_trial_applications as t1')
            //    ->leftjoin('wb_clinical_trial_products as t2', 't1.id', 't2.application_id')
            //    ->select('t2.*')
            //    ->where('t1.application_code',$application_code);
            //    $ct_products_data  = $ct_produts_qry->get();
            //    dd($ct_products_data);

            //    if($ct_products_data) {
            //      foreach($ct_products_data as $ct_products) {
                    
            //      }
            //    }
              //Get otherstates DETAILS
           $otherstatesdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
              ->leftjoin('wb_otherstates_clinicaltrialsregistrations as t2', 't1.id', 't2.application_id')
              ->select('t2.*')
              ->where('t1.application_code',$application_code);
           $otherstatesdetiailsresults = $otherstatesdetiailsqry->get();
          if($otherstatesdetiailsresults){
           foreach ($otherstatesdetiailsresults as $otherstatesdetiailsresults) {
            # code...
           $otherstatesdetiailsresultsdata = array(
               'application_id' => $application_id,
                'country_id' => $otherstatesdetiailsresults->country_id,
                'registration_ref' => $otherstatesdetiailsresults->registration_ref,
                'date_of_registration' => $otherstatesdetiailsresults->date_of_registration,
                'approving_authority' => $otherstatesdetiailsresults->approving_authority,
                'current_registrationstatus' => $otherstatesdetiailsresults->current_registrationstatus,
                'altered_by' => $otherstatesdetiailsresults->altered_by,
                'dola' => $otherstatesdetiailsresults->dola,
                'created_by'=> $otherstatesdetiailsresults->created_by,
                'created_on'=> $otherstatesdetiailsresults->created_on,

           );
           $otherstatesdetiails_res = insertRecord('tra_otherstates_clinicaltrialsregistrations', $otherstatesdetiailsresultsdata);
           if(!isset($otherstatesdetiails_res['record_id'])){
               DB::rollback();
               return $otherstatesdetiails_res;
                }
           }
           }
         //sync the application NEC
        //    $result_nec= $this->syncClinicalTrialApplicationNEC($request);
           $new_submission_params = array(
                   'portal_application_id' => $portal_application_id,
                   'new_application_id' => $application_id,
                   "application_code" => $results->application_code,
                   "tracking_no" => $results->tracking_no,
                   "module_id" => $results->module_id,
                   "sub_module_id" => $results->sub_module_id,
                   "section_id" => $results->section_id,
               );
   
           $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
           if(!isset($new_submission_res['record_id'])){
               DB::rollback();
               return $new_submission_res;
                }
             
                }
       } catch (\Exception $exception) {
                   DB::rollBack();
                   $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
               } catch (\Throwable $throwable) {
                   DB::rollBack();
                  $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
               }
               return $res;
 }
 
//IMPORT AND EXPORT
public function receiveImportExportPortalApplication(Request $request){
    try {
    $user_id = $this->user_id;
    $application_code = $request->input('application_code');
    $module_id = $request->input('module_id');
    $sub_module_id = $request->input('sub_module_id');
    $section_id = $request->input('section_id');
    $portal_db = DB::connection('portal_db');
     //Get portal data
    $qry = $portal_db->table('wb_importexport_applications as t1')
       ->select('t1.*');
    $qry->where('t1.application_code',$application_code);
    $results = $qry->first();
    if(!isset($results->id)){
        DB::rollBack();
        return ['message'=> 'record not found', 'success'=>false]; 
    }
    $portal_application_id =$results->id;
    $module_id=$results->module_id;
    $sub_module_id=$results->sub_module_id;
    $section_id=8;
    $view_id= generateApplicationViewID();
    $trader_id=$results->trader_id;
    $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
    $applicant_id = getInternalApplicant_id($identification_no);
    $importexport_permittype_id=$results->importexport_permittype_id;
       // get process id
    $process_qry = DB::table('wf_processes as t1')
                  ->select('t1.id')
                  ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id,'importexport_permittype_id'=>$importexport_permittype_id));
    $process_results = $process_qry->first();
    if(!isset($process_results->id)){
                DB::rollBack();
                return ['message'=> 'Process not found', 'success'=>false]; 
    }
    $process_id = $process_results->id;
    if($results){
       $app_data = array(
             'process_id' => $process_id,
             'applicant_id'=>  $applicant_id,
             'sub_module_id' =>  $results->sub_module_id,
             'module_id' =>  $results->module_id,
             'section_id' => $section_id,
             'sender_receiver_id'=> $results->sender_receiver_id,
             'mode_oftransport_id'=> $results->mode_oftransport_id,
             'proforma_currency_id'=> $results->proforma_currency_id,
             'importexport_permittype_id' => $results->importexport_permittype_id,
             'has_apppliedctrdrugs_license' => $results->has_apppliedctrdrugs_license,
             'controlled_drugslicense_no' =>  $results->controlled_drugslicense_no,
             'license_application_code' => $results->license_application_code,
             'permit_reason_id' =>  $results->permit_reason_id,
             'otherpermit_reason' =>  $results->otherpermit_reason,
             'proforma_invoice_no' => $results->proforma_invoice_no,
             'proforma_invoice_date' => $results->proforma_invoice_date,
             'destination_country_id'=> $results->destination_country_id,
             'export_country_id'=> $results->export_country_id,
            // 'mode_of_transport_id'=> $results->mode_oftransport_id,
             'vehicle_reg_no'=> $results->vehicle_reg_no,
             'expected_arrival_date'=> $results->expected_arrival_date,
             'exit_port_id'=> $results->exit_port_id,
             'expected_departure_date'=> $results->expected_departure_date,
             'estimated_value'=> $results->estimated_value,
             'paying_currency_id' => $results->paying_currency_id,
             'branch_id' =>  $results->branch_id,
             'port_id' => $results->port_id,
             'consignee_options_id' =>  $results->consignee_options_id,
             'consignee_id' =>  $results->consignee_id,
             'tracking_no' => $results->tracking_no,
             'application_code' => $results->application_code,
             //'controlleddrugs_type_id' =>  $results->controlleddrugs_type_id,
             //'prodclass_category_id' =>  $results->prodclass_category_id,
         );
        $applications_table = 'tra_importexport_applications';
        $res = insertRecord($applications_table, $app_data, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;

             }
       $active_application_id = $res['record_id'];
       $module_id=$results->module_id;
       $sub_module_id=$results->sub_module_id;
       $section_id=$results->section_id;
       $importexport_permittype_id=$results->importexport_permittype_id;
       $application_code=$results->application_code;
       $tracking_no=$results->tracking_no;
       initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
       $Stage_qry = DB::table('wf_processes as t1')
                  ->select('t1.workflow_id')
                  ->where(array('t1.module_id'=>$module_id,'t1.sub_module_id'=>$sub_module_id,'t1.section_id'=>8,'t1.importexport_permittype_id'=>$importexport_permittype_id));
       $Stage_qry_results = $Stage_qry->first();
       if($Stage_qry_results){
         $workflow_id =$Stage_qry_results->workflow_id;
         $stage_id_qry = DB::table('wf_workflow_stages as t1')
             ->select('t1.id')
             ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'portal initial stage not set', 'success'=>false]; 
        }
        $workflow_stage_id=$stage_id_results->id;
        $submission_params = array(
           'application_id' => $active_application_id,
           'process_id' => $process_id,
           'applicant_id' =>  $applicant_id,
           'importexport_permittype_id' => $results->importexport_permittype_id,
           'application_code' => $results->application_code,
           'tracking_no' => $results->tracking_no,
           'usr_from' => $user_id,
           'usr_to' => $user_id,
           'previous_stage' => $workflow_stage_id,
           'current_stage' => $workflow_stage_id,
           'module_id' =>  $results->module_id,
           'sub_module_id' =>  $results->sub_module_id,
           'section_id' =>  $results->section_id,
           'application_status_id' => $results->application_status_id,
           'urgency' => 1,
           'remarks' => 'Initial save of the application',
           'date_received' => Carbon::now(),
           'created_on' => Carbon::now(),
           'created_by' => $user_id
             );

       $sub_res = insertRecord('tra_submissions', $submission_params);
       if(!isset($sub_res['record_id'])){
        DB::rollback();
        return $sub_res;

         }
    
     }
     else{
        DB::rollBack();
        return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
      }

        //Get export permits products Details
    $permitsproductsqry = $portal_db->table('wb_importexport_applications as t1')
      ->leftjoin('wb_permits_products as t2', 't1.application_code', 't2.application_code')
      ->select('t2.*')
      ->where('t1.application_code',$application_code);
    $permitsproductsdetiailsresults = $permitsproductsqry->get();
    if($permitsproductsdetiailsresults){
     foreach ($permitsproductsdetiailsresults as $permitsproductsdetiailsresults) {
         # code...
        $permitsproductsdetiailsresultsdata = array(
             'section_id' => $permitsproductsdetiailsresults->section_id,
             'common_name_id' => $permitsproductsdetiailsresults->common_name_id,
             'prodclass_category_id' => $permitsproductsdetiailsresults->prodclass_category_id,
             'productphysical_description' => $permitsproductsdetiailsresults->productphysical_description,
             'product_id' => $permitsproductsdetiailsresults->product_id,
             'conversion_unit' => $permitsproductsdetiailsresults->conversion_unit,
             'product_strength'=> $permitsproductsdetiailsresults->product_strength,
             'quantity' => $permitsproductsdetiailsresults->quantity,
             'unit_price' => $permitsproductsdetiailsresults->unit_price,
             'currency_id' => $permitsproductsdetiailsresults->currency_id,
             'unitpack_size' => $permitsproductsdetiailsresults->unitpack_size,
             'unitpack_unit_id' => $permitsproductsdetiailsresults->unitpack_unit_id,
             'application_code' => $permitsproductsdetiailsresults->application_code,
             'product_packaging' => $permitsproductsdetiailsresults->product_packaging,
             'packaging_unit_id' => $permitsproductsdetiailsresults->packaging_unit_id,
             'dosage_form_id' => $permitsproductsdetiailsresults->dosage_form_id,
             'pack_unit_id' => $permitsproductsdetiailsresults->pack_unit_id,
             'pack_size' => $permitsproductsdetiailsresults->pack_size,
             'permitbrand_name' => $permitsproductsdetiailsresults->permitbrand_name,
             'permitcommon_name' => $permitsproductsdetiailsresults->permitcommon_name,
             'product_registration_no' => $permitsproductsdetiailsresults->product_registration_no,
             'country_oforigin_id' => $permitsproductsdetiailsresults->country_oforigin_id,
             'is_registered_product' => $permitsproductsdetiailsresults->is_registered_product,
             'purpose_of_drugsuse' => $permitsproductsdetiailsresults->purpose_of_drugsuse,
             'controlleddrugs_type_id' => $permitsproductsdetiailsresults->controlleddrugs_type_id,
             'controlled_drugssubstances_id' => $permitsproductsdetiailsresults->controlled_drugssubstances_id,
             'controlleddrugs_basesalt_id' => $permitsproductsdetiailsresults->controlleddrugs_basesalt_id,
             'gramsbasesiunit_id' => $permitsproductsdetiailsresults->gramsbasesiunit_id,
             'drugs_content' => $permitsproductsdetiailsresults->drugs_content,
             'strength_asgrams' => $permitsproductsdetiailsresults->strength_asgrams,
             'controlleddrug_base' => $permitsproductsdetiailsresults->controlleddrug_base,
             'pack_unit' => $permitsproductsdetiailsresults->pack_unit,
             'drugspackaging_type_id' => $permitsproductsdetiailsresults->drugspackaging_type_id,
             //'device_type_id' => $permitsproductsdetiailsresults->device_type_id,
            // 'is_regulated_product' => $permitsproductsdetiailsresults->is_regulated_product,
             //'laboratory_no' => $permitsproductsdetiailsresults->laboratory_no,
             //'mis_application_id' => $permitsproductsdetiailsresults->mis_application_id,
             //'mis_product_id' => $permitsproductsdetiailsresults->mis_product_id,
             //'prodcertificate_no' => $permitsproductsdetiailsresults->prodcertificate_no,
            // 'product_category_id' => $permitsproductsdetiailsresults->product_category_id,
             //'producths_code' => $permitsproductsdetiailsresults->producths_code,
            // 'regulated_prodpermit_id' => $permitsproductsdetiailsresults->regulated_prodpermit_id,
             //'total_weight' => $permitsproductsdetiailsresults->total_weight,
             //'weights_units_id' => $permitsproductsdetiailsresults->weights_units_id,
             //'imp_product_strength' => $permitsproductsdetiailsresults->imp_product_strength,
             //'controlleddrug_baseunit_id' => $permitsproductsdetiailsresults->controlleddrug_baseunit_id,
             //'altered_by' => $permitsproductsdetiailsresults->altered_by,
             'dola' => $permitsproductsdetiailsresults->dola,
             'created_by'=> $permitsproductsdetiailsresults->created_by,
             'created_on'=> $permitsproductsdetiailsresults->created_on,

        );
        $permitsproducts_res = insertRecord('tra_permits_products', $permitsproductsdetiailsresultsdata);
        if(!isset($permitsproducts_res['record_id'])){
            DB::rollback();
            return $permitsproducts_res;

             }

        }
        }
        else{
            DB::rollBack();
            return ['message'=>'Zero products found on the permit', 'success'=>false];
        }
        $new_submission_params = array(
            'portal_application_id' => $portal_application_id,
            'new_application_id' => $active_application_id,
            "application_code" => $results->application_code,
            "tracking_no" => $results->tracking_no,
            "module_id" => $results->module_id,
            "sub_module_id" => $results->sub_module_id,
            "section_id" => $results->section_id,
            "importexport_permittype_id" => $results->importexport_permittype_id,
                  );
 
       $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
       if(!isset($new_submission_res['record_id'])){
        DB::rollback();
        return $new_submission_res;

         }

          }
     } catch (\Exception $exception) {
             DB::rollBack();
             $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
         } catch (\Throwable $throwable) {
             DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
         }
         return $res;
}
//PROMOTION AND ADVERTISEMENT
public function receivePromotionPortalApplication(Request $request){
    try {
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $portal_db = DB::connection('portal_db');
        //Get portal  data
        $qry = $portal_db->table('wb_promotion_adverts_applications as t1')
            ->select('t1.*');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id =$results->id;
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $section_id=$results->section_id;
        $portal_sponsor_id = $results->sponsor_id;
        $view_id= generateApplicationViewID();
        $trader_id=$results->trader_id;
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
        /**
         * Check if the sponsor is selected
         */
        // if(validateIsNumeric($portal_sponsor_id)){
        //     $promotion_personnel_table = 'wb_promotionaladvert_personnel';
        //     $where_clause = array(
        //         'id'=>$portal_sponsor_id

        //     );


        //     $sponsor_details  = getPreviousRecords($promotion_personnel_table,$where_clause,'portal_db');
        //     //dd($sponsor_details);
        //     $sponsor_email = $sponsor_details['email'];




        // }

        // get process id
        $process_qry = DB::table('wf_processes as t1')
            ->select('t1.id')
            ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
            DB::rollBack();
            return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id = $process_results->id;
        if($results){
            $promotion_material_data = array(
                'process_id'=> $process_id,
                'applicant_id'=> $applicant_id,
                'view_id'=>  $view_id,
                'applicant_as_sponsor'=> $results->applicant_as_sponsor,
                //'classification_id'=> $results->classification_id,
                //'product_type_id'=> $results->product_type_id,
                'sponsor_id'=> $results->sponsor_id,
                'section_id'=> $results->section_id,
                'module_id'=> $results->module_id,
                'sub_module_id'=> $results->sub_module_id,
                'application_code' => $results->application_code,
                'tracking_no'=> $results->tracking_no,
                'intended_user_id'=> $results->intended_user_id,
                // 'advertisement_category_id'=> $results->advertisement_category_id,
                'advertisement_type_id'=> $results->advertisement_type_id,
                'exhibition_start_date'=> $results->exhibition_start_date,
                'exhibition_end_date'=> $results->exhibition_end_date,
                'venue_of_exhibition'=> $results->venue_of_exhibition,
                'description_of_advert'=> $results->description_of_advert,
                //'workflow_stage_id'=> $results->workflow_stage_id,
                //'permit_no'=>$request-> $results->trader_id,
                'application_status_id'=> $results->application_status_id,
                'date_received' => Carbon::now(),
                'created_on' => Carbon::now()
                //'permit_issue_date'=> $results->trader_id,
                //'expiry_date'=> $results->trader_id,
            );
            $applications_table = 'tra_promotion_adverts_applications';
            $res = insertRecord($applications_table, $promotion_material_data, $user_id);
            if(!isset($res['record_id'])){
                DB::rollback();
                return $res;

                 }
            $active_application_id = $res['record_id'];
            $module_id=$results->module_id;
            $sub_module_id=$results->sub_module_id;
            $section_id=$results->section_id;
            $Stage_qry = DB::table('wf_processes as t1')
                ->select('t1.workflow_id')
                ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
            $Stage_qry_results = $Stage_qry->first();
            if($Stage_qry_results){
                $workflow_id =$Stage_qry_results->workflow_id;
                $stage_id_qry = DB::table('wf_workflow_stages as t1')
                    ->select('t1.id')
                    ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                $stage_id_results = $stage_id_qry->first();
            if(!isset($stage_id_results->id)){
                 DB::rollBack();
                return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
             }
            $workflow_stage_id=$stage_id_results->id;
                //add to submissions table
            $submission_params = array(
                    'application_id' => $active_application_id,
                    'process_id' => $process_id,
                    'view_id'=>  $view_id,
                    'applicant_id' =>  $applicant_id,
                    'application_code' => $results->application_code,
                    //'reference_no' =>  $results->reference_no,
                    'tracking_no'=> $results->tracking_no,
                    'usr_from' => $user_id,
                    'usr_to' => $user_id,
                    'previous_stage' => $workflow_stage_id,
                    'current_stage' => $workflow_stage_id,
                    'module_id' => $results->module_id,
                    'sub_module_id' => $results->sub_module_id,
                    'section_id' => $results->section_id,
                    'application_status_id' => $results->application_status_id,
                    'urgency' => 1,
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );
                $sub_res = insertRecord('tra_submissions', $submission_params);
                if(!isset($sub_res['record_id'])){
                    DB::rollback();
                    return $sub_res;
    
                     }
            }
            else{
                DB::rollBack();
                return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
            }
            //Get promotion product particulars
            $promotionproductsqry = $portal_db->table('wb_promotion_adverts_applications as t1')
                ->leftjoin('wb_promotion_prod_particulars as t2', 't1.application_code', 't2.application_code')
                ->select('t2.*')
                ->where('t1.application_code',$application_code);
            $promotionproductsresults = $promotionproductsqry->get();
            if($promotionproductsresults){
                foreach ($promotionproductsresults as $promotionproductsresults) {
                    # code...
                    $promotionproductsresultsdata = array(
                        'application_id' => $active_application_id,
                        'product_category_id' => $promotionproductsresults->common_name_id,
                        'product_subcategory_id' => $promotionproductsresults->prodclass_category_id,
                        'brand_name' => $promotionproductsresults->brand_name,
                        'product_id' => $promotionproductsresults->product_id,
                        'common_name_id' => $promotionproductsresults->common_name_id,
                        'is_registered'=> $promotionproductsresults->is_registered,
                        'registration_no' => $promotionproductsresults->registration_no,
                        'registrant_name' => $promotionproductsresults->registrant_name,
                        'type_of_advertisement_id' => $promotionproductsresults->type_of_advertisement_id,
                        'other_details' => $promotionproductsresults->other_details,
                        'dola' => $promotionproductsresults->dola,
                        'created_by'=> $promotionproductsresults->created_by,
                        'created_on'=> Carbon::now(),

                    );
                    $promotionproducts_res = insertRecord('tra_promotion_prod_particulars', $promotionproductsresultsdata);
                    if(!isset($promotionproducts_res['record_id'])){
                        DB::rollback();
                        return $promotionproducts_res;
        
                         }

                }
            }
            //Get promotion_materials_details
            $materialsdetiailsqry = $portal_db->table('wb_promotion_adverts_applications as t1')
                ->leftjoin('wb_promotion_materials_details as t2', 't1.id', 't2.application_id')
                ->select('t2.*')
                ->where('t1.application_code',$application_code);
            $materialsdetiailsresults = $materialsdetiailsqry->get();
            if($materialsdetiailsresults){
                foreach ($materialsdetiailsresults as $materialsdetiailsresults) {
                    # code...
                    $materialsdetiailsresultsdata = array(
                        'application_id' => $active_application_id,
                        'material_id' => $materialsdetiailsresults->material_id,
                        'remarks' => $materialsdetiailsresults->remarks,
                        'altered_by' => $materialsdetiailsresults->altered_by,
                        'dola' => $materialsdetiailsresults->dola,
                        'created_by'=> $materialsdetiailsresults->created_by,
                        'created_on'=> $materialsdetiailsresults->created_on,

                    );
                    $materialsdetiails_res = insertRecord('tra_promotion_materials_details', $materialsdetiailsresultsdata);
                    if(!isset($materialsdetiails_res['record_id'])){
                        DB::rollback();
                        return $materialsdetiails_res;
        
                         }
                }
             
            }
            $new_submission_params = array(
                'portal_application_id' => $portal_application_id,
                'new_application_id' => $active_application_id,
                "application_code" => $results->application_code,
                "tracking_no" => $results->tracking_no,
                "module_id" => $results->module_id,
                "sub_module_id" => $results->sub_module_id,
                "section_id" => $results->section_id,
            );

            $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
            if(!isset($new_submission_res['record_id'])){
                DB::rollback();
                return $new_submission_res;

                 }
        }
    } catch (\Exception $exception) {
        DB::rollBack();
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        DB::rollBack();
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
    }
    return $res;
}
//Psur/PBRER
public function receivePsurPortalApplication(Request $request){
    try {
        DB::beginTransaction();
        DB::Connection('portal_db')->beginTransaction();
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $portal_db = DB::connection('portal_db');
        //Get portal data
        $qry = $portal_db->table('wb_psur_pbrer_applications as t1')
             ->select('t1.*');
        $qry->where('t1.application_code',$application_code);
        $results = $qry->first();
        if(!isset($results->id)){
            DB::rollBack();
            return ['message'=> 'record not found', 'success'=>false]; 
        }
        $portal_application_id =$results->id;
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $section_id=2;
        $trader_id=$results->trader_id;
          //get applicant id
        $identification_no = getSingleRecordColValue('wb_trader_account', array('id'=>$trader_id), 'identification_no','portal_db');
        $applicant_id = getInternalApplicant_id($identification_no);
        $view_id= generateApplicationViewID();
           // get process id
        $process_qry = DB::table('wf_processes as t1')
                 ->select('t1.id')
                 ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
        $process_results = $process_qry->first();
        if(!isset($process_results->id)){
            DB::rollBack();
            return ['message'=> 'Process not found', 'success'=>false]; 
        }
        $process_id=$process_results->id;
        if($results){
            $application_params = array(
                'process_id' => $process_id,
                'applicant_id'=> $applicant_id,
                'application_status_id'=> $results->application_status_id,
                'view_id' => $view_id,
                'module_id' => $results->module_id,
                'sub_module_id' => $results->sub_module_id,
                'section_id' => $results->section_id,
                'application_code' => $results->application_code,
                'tracking_no' => $results->tracking_no,
                'reference_no' => $results->reference_no,
                'product_id'=>$results->registered_product_id,
                'psur_type_id' => $results->psur_type_id,
                'remarks'=> $results->remarks,
                'from_date'=>$results->from_date,
                'to_date'=>$results->to_date,
                'date_added' => Carbon::now(),
                'created_on' => Carbon::now()
            );
        $applications_table = 'tra_psur_pbrer_applications';
        $res = insertRecord($applications_table, $application_params, $user_id);
        if(!isset($res['record_id'])){
            DB::rollback();
            return $res;
             }
        $active_application_id = $res['record_id'];
        //Add to submissions table
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        //$section_id=$results->section_id;
        $Stage_qry = DB::table('wf_processes as t1')
                   ->select('t1.workflow_id')
                   ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
        $Stage_qry_results = $Stage_qry->first();
        if($Stage_qry_results){
            $workflow_id =$Stage_qry_results->workflow_id;
            $stage_id_qry = DB::table('wf_workflow_stages as t1')
                ->select('t1.id')
                ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
        $stage_id_results = $stage_id_qry->first();
        if(!isset($stage_id_results->id)){
            DB::rollBack();
            return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
        }
        $workflow_stage_id=$stage_id_results->id;
       //add to submissions table
       $submission_params = array(
        'application_id' => $active_application_id,
        'process_id' => $process_id,
        'applicant_id' =>  $applicant_id,
        'view_id'=> $view_id,
        'application_code' => $results->application_code,
        'reference_no' =>  $results->reference_no,
        'tracking_no'=> $results->tracking_no,
        'usr_from' => $user_id,
        'usr_to' => $user_id,
        'previous_stage' => $workflow_stage_id,
        'current_stage' => $workflow_stage_id,
        'module_id' => $results->module_id,
        'sub_module_id' => $results->sub_module_id,
        'section_id' => $results->section_id,
        'application_status_id' => $results->application_status_id,
        'urgency' => 1,
        'remarks' => 'Initial save of the application',
        'date_received' => Carbon::now(),
        'created_on' => Carbon::now(),
        'created_by' => $user_id
    );
    $sub_res = insertRecord('tra_submissions', $submission_params);
    if(!isset($sub_res['record_id'])){
        DB::rollback();
        return $sub_res;
         }
   
      }
      else{
        DB::rollBack();
        return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
      }
     //log products details
     $prod_qry = $portal_db->table('wb_psur_pbrer_prod_particulars as t1')
                 ->select('t1.*')
                 ->where('t1.application_id',$portal_application_id);
      $prod_results = $prod_qry->get();
      if($prod_results){
          foreach ($prod_results as $prod_results) {
           # code...
           $prod_resultsdata = array(
             'application_id' => $active_application_id,
             'brand_name' => $prod_results->brand_name,
             'product_id' => $prod_results->product_id,
             'altered_by' => $prod_results->altered_by,
             'dola' => $prod_results->dola,
             'created_by'=> $prod_results->created_by,
             'created_on'=> $prod_results->created_on,

         );
         $prod_res = insertRecord('tra_psur_pbrer_prod_particulars', $prod_resultsdata);
         //dd($prod_res);
         if(!isset($prod_res['record_id'])){
             DB::rollback();
             return $prod_res;
              }
            }
           }
      $new_submission_params = array(
        'portal_application_id' => $portal_application_id,
        'new_application_id' => $active_application_id,
        "application_code" => $results->application_code,
        "tracking_no" => $results->tracking_no,
        "module_id" => $results->module_id,
        "sub_module_id" => $results->sub_module_id,
        "section_id" => $results->section_id,
           );

       $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
        if(!isset($new_submission_res['record_id'])){
            DB::rollback();
            return $new_submission_res;
             }
      DB::commit();
      DB::Connection('portal_db')->commit();
      }
     } catch (\Exception $exception) {
                DB::rollBack();
                DB::Connection('portal_db')->rollBack();
                $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            } catch (\Throwable $throwable) {
                DB::rollBack();
                DB::Connection('portal_db')->rollBack();
               $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
            }
            return $res;
    }


//ADR
public function receiveAdrPortalApplication(Request $request){
    try {
        $user_id = $this->user_id;
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $section_id = $request->input('section_id');
        $portal_db = DB::connection('portal_db');
        //Get portal product data
        $qry = $portal_db->table('wb_pv_applications as t1')
             ->select('t1.*');
        $qry->where('t1.application_code',$application_code);
           $results = $qry->first();  
          // dd($results);
           $portal_application_id =$results->id; 
           $module_id=$results->module_id;
           $sub_module_id=$results->sub_module_id;
           $section_id=$results->section_id;
           // get process id
          $process_qry = DB::table('wf_processes as t1')
                 ->select('t1.id')
                 ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
          $process_results = $process_qry->first();
          $process_id=$process_results->id;
          $view_id = generateApplicationViewID();
          if($results){
           // foreach($results as $results){
            $application_params = array(
                'process_id' => $process_id,
                'applicant_id'=> $results->trader_id,
                'application_status_id'=> $results->application_status_id,
                'view_id' => $view_id,
                'module_id' => $results->module_id,
                'sub_module_id' => $results->sub_module_id,
                'section_id' => $results->section_id,
                'application_code' => $results->application_code,
                'workflow_stage_id' => $results->workflow_stage_id,
                'tracking_no' => $results->tracking_no,
                'reference_no' => $results->reference_no,
                'branch_id' => $results->branch_id,
                'patient_age' => $results->patient_age,
                'patient_weight' => $results->patient_weight,
                'gender_id' => $results->gender_id,
                'title_id' => $results->title_id,
                'adr_type_id' => $results->adr_type_id,
                'other_medical_conditions' => $results->other_medical_conditions,
                'date_added' => $results->date_added,
                'submission_date' => $results->submission_date,
               'is_pregnant' => $results->is_pregnant,
               'application_status_id' => $results->application_status_id,
                'created_by' => $results->created_by,
               'added_on' => $results->added_on,
                'created_on' => $results->created_on,
                'altered_by' => $results->altered_by,
                'dola' => $results->dola,
                'applicant_id' => $results->applicant_id,
                'local_agent_id' => $results->local_agent_id,
                'reg_serial' => $results->reg_serial,
                'last_menstruation_date' => $results->last_menstruation_date,
                'patient_name' => $results->patient_name,
                'reaction_start_date' => $results->reaction_start_date,
                'drug_discontinued_id' => $results->drug_discontinued_id,
                'rechallenge_id' => $results->rechallenge_id,
                'rechallenge_outcome' => $results->rechallenge_outcome,
                'adverse_event' => $results->adverse_event,
                'seriousness_id' => $results->seriousness_id,
                'treatment' => $results->treatment,
                'adr_outcome_id' => $results->adr_outcome_id,
                'date_recovered' => $results->date_recovered,
                'is_published' => $results->is_published,
                'is_reporter_notified' => $results->is_reporter_notified,
                'is_exported' => $results->is_exported,
                'species' => $results->species,
                'animal_status_id' => $results->animal_status_id,
                'breed' => $results->breed,
                'affect_humans' => $results->affect_humans,
                'autopsy_done' => $results->autopsy_done,
                'humanvet_contact_id' => $results->humanvet_contact_id,
                'local_supplier' => $results->local_supplier,
                'device_operator_id' => $results->device_operator_id,
                'device_location_id' => $results->device_location_id,
                'software_version' => $results->software_version,
                'catalogue_number' => $results->catalogue_number,
                'model_number' => $results->model_number,
                'serial_number' => $results->serial_number,
                'is_breast_feeding' => $results->is_breast_feeding,
                'duration_id' => $results->duration_id,
                'country_of_initial_reaction_id' => $results->country_of_initial_reaction_id,
                'professional_name' => $results->professional_name,
                'professional_email' => $results->professional_email,
                'professional_type_id' => $results->professional_type_id,
                'adr_reporter_type_id' => $results->adr_reporter_type_id,
                'vaccine_name' => $results->vaccine_name,
                'vaccine_brand_name' => $results->vaccine_brand_name,
                'vaccine_batch_no'=> $results->vaccine_batch_no,
                'vaccination_date' => $results->vaccination_date,
                'vaccine_expiry_date' => $results->vaccine_expiry_date,
                'is_dilutent' => $results->is_dilutent,
                'diluent_batch_no' => $results->diluent_batch_no,
                'reconstitution_date' => $results->reconstitution_date,
                'diluet_expiry_date' => $results->diluet_expiry_date,
                'is_vaccine' => $results->is_vaccine,
                'facility_name' => $results->facility_name,
                'professional_qualification_id' => $results->professional_qualification_id,
                'professional_title' => $results->professional_title,
                'infant_duration_id' => $results->infant_duration_id,
                'infant_age' => $results->infant_age,
                'date_of_outcome' => $results->date_of_outcome,
                'human_vet_contact_id' => $results->human_vet_contact_id,
                'health_facility_id' => $results->health_facility_id,
                'other_health_facility' => $results->other_health_facility,
                'reporter_qualification_id' => $results->reporter_qualification_id,
                'created_on' => Carbon::now()

                //'permit_issue_date'=> $results->trader_id,
                //'expiry_date'=> $results->trader_id,
            );
           $applications_table = 'tra_pv_applications';
    
        $rec = insertRecord($applications_table, $application_params, $user_id);
        // dd($rec);
        if(!isset($rec['record_id'])) {

            $res = array(
                'success' => false,
                'message' => 'An Error Occured Please Contact BOMRA if it persists',
                'error' => $rec
            );

            return $res;

        }
        $active_application_id = $rec['record_id'];
        //Add to submissions table
        $module_id=$results->module_id;
        $sub_module_id=$results->sub_module_id;
        $section_id=$results->section_id;
        $application_code=$results->application_code;
        $tracking_no=$results->tracking_no;
        //dms
        initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
        //workflow stage
        $Stage_qry = DB::table('wf_processes as t1')
                   ->select('t1.workflow_id')
                   ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
        $Stage_qry_results = $Stage_qry->first();
      // dd($Stage_qry_results);
        if($Stage_qry_results){
            $workflow_id =$Stage_qry_results->workflow_id;
            $stage_id_qry = DB::table('wf_workflow_stages as t1')
                ->select('t1.id')
                ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                $stage_id_results = $stage_id_qry->first();
              //  dd($stage_id_results);
               $workflow_stage_id=$stage_id_results->id;  
       //add to submissions table
       $submission_params = array(
        'application_id' => $active_application_id,
        'process_id' => $process_id,
        'application_code' => $results->application_code,
        'reference_no' =>  $results->reference_no,
        'tracking_no'=> $results->tracking_no,
        'view_id'=> $results->view_id,
        'usr_from' => $user_id,
        'usr_to' => $user_id,
        'previous_stage' => $workflow_stage_id,
        'current_stage' => $workflow_stage_id,
        'module_id' => $results->module_id,
        'sub_module_id' => $results->sub_module_id,
        'section_id' => $results->section_id,
        'application_status_id' => $results->application_status_id,
        'urgency' => 1,
        'applicant_id' =>  $results->trader_id,
        'remarks' => 'Initial save of the application',
        'date_received' => Carbon::now(),
        'created_on' => Carbon::now(),
        'created_by' => $user_id
    );
    
    $sub_res = insertRecord('tra_submissions', $submission_params);
    //dd($sub_res);
    if(!$sub_res['success']){
        return $sub_res;
    }
    $new_submission_params = array(
        'portal_application_id' => $portal_application_id,
        'new_application_id' => $active_application_id,
        "application_code" => $results->application_code,
        "tracking_no" => $results->tracking_no,
        "module_id" => $results->module_id,
        "sub_module_id" => $results->sub_module_id,
        "section_id" => $results->section_id,
           );
    
       $new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
        //dd($new_submission_res);
    }

                    //Replicate Adr Other Details
               //Get ADR suspected drug  Details
        $suspecteddrugsdetiailsqry = $portal_db->table('wb_pv_applications as t1')
               ->leftjoin('wb_pv_suspected_drugs as t2', 't1.id', 't2.pv_id')
               ->select('t2.*')
               ->where('t1.application_code',$application_code);
         $suspecteddrugsdetiailsresults = $suspecteddrugsdetiailsqry->get(); 
            //  dd($suspecteddrugsdetiailsresults);
        if($suspecteddrugsdetiailsresults){
              foreach ($suspecteddrugsdetiailsresults as $suspecteddrugsdetiailsresults) {
                  # code...
                 $suspecteddrugsdetiailsresultsdata = array(
                      'pv_id' => $active_application_id,
                      'application_code' => $suspecteddrugsdetiailsresults->application_code,
                      'is_other_drugs_used' => $suspecteddrugsdetiailsresults->is_other_drugs_used,
                      'brand_name' => $suspecteddrugsdetiailsresults->brand_name,
                      'manufacturer_name' => $suspecteddrugsdetiailsresults->manufacturer_name,
                      'remarks' => $suspecteddrugsdetiailsresults->remarks,
                      'expiry_date'=> $suspecteddrugsdetiailsresults->expiry_date,
                      'end_date'=> $suspecteddrugsdetiailsresults->end_date,
                      'start_date'=> $suspecteddrugsdetiailsresults->start_date,
                      'created_on'=> $suspecteddrugsdetiailsresults->created_on,
                      'created_by'=> $suspecteddrugsdetiailsresults->created_by,
                      'dola'=> $suspecteddrugsdetiailsresults->dola,
                      'altered_by'=> $suspecteddrugsdetiailsresults->altered_by,
                      'is_enabled'=> $suspecteddrugsdetiailsresults->is_enabled,
                      'adr_type_id'=> $suspecteddrugsdetiailsresults->adr_type_id,
                      'batch_no'=> $suspecteddrugsdetiailsresults->batch_no,
                      'dosage'=> $suspecteddrugsdetiailsresults->dosage,
                      'route_of_administration'=> $suspecteddrugsdetiailsresults->route_of_administration,
                      'frequency'=> $suspecteddrugsdetiailsresults->frequency,
                      'use_reasons'=> $suspecteddrugsdetiailsresults->use_reasons,
                      'model_no'=> $suspecteddrugsdetiailsresults->model_no,
                      'udi_no'=> $suspecteddrugsdetiailsresults->udi_no,
                      'local_supplier'=> $suspecteddrugsdetiailsresults->local_supplier,
                      'device_operator'=> $suspecteddrugsdetiailsresults->device_operator,
                      'catalogue_number'=> $suspecteddrugsdetiailsresults->catalogue_number,
                      'dosage_form_id'=> $suspecteddrugsdetiailsresults->dosage_form_id,
  
                 );
                 $drugdetails_res = insertRecord('tra_pv_suspected_drugs', $suspecteddrugsdetiailsresultsdata);
                //dd($drugdetails_res);
                 }
  
                 }

      }
        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }
        
//  public function getApplicationWorkFlowStageSubmissionDetails(Request $request)
//  {
//                     $module_id = $request->input('module_id');
//                     $sub_module_id = $request->input('sub_module_id');
//                     $section_id = $request->input('section_id');
//                     $prodclass_category_id =  $request->input('prodclass_category_id');
//                     $importexport_permittype_id= $request->input('importexport_permittype_id');
//                     $premise_type_id= $request->input('premise_type_id');
//             try {
//                 $qry = DB::table('wf_processes as t1')
//                      ->select('t1.workflow_id');
//                 $res=array();
//                      if (validateIsNumeric($prodclass_category_id)) {
//                         $qry->where('t1.prodclass_category_id', $prodclass_category_id);
//                         }
//                     if (validateIsNumeric($importexport_permittype_id)) {
//                          $qry->where('t1.importexport_permittype_id', $importexport_permittype_id);
//                         }
//                     if (validateIsNumeric($premise_type_id)) {
//                         $qry->where('t1.premise_type_id', $premise_type_id);
//                         }
//                         $qry->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
//                         $results = $qry->first();

//                         if($results){
//                             $workflow_id =$results->workflow_id;
//                             $stage_id_qry = DB::table('wf_workflow_stages as t1')
//                                 ->select('t1.id')
//                                 ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
//                                 $results = $stage_id_qry->first();
//                            	    $res = array(
//                                     'success'=>true,
//                                       'results'=>$results,
//                                        'message'=>'All is well');
//                         }

//                     } catch (\Exception $exception) {
//                         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

//                     } catch (\Throwable $throwable) {
//                         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
//                     }
//                     return response()->json($res);
// }

public function onSaveMeetingGroups(Request $req)
    {
        try {
                        $user_id = \Auth::user()->id;
                        $post_data = $req->post();
                        $table_name = $post_data['table_name'];
                        //$participant_ids = $post_data['participant_id'];
                        $participant_ids = json_encode(json_decode($req->participant_id));
                        $id = $post_data['id'];
                        $table_data = array(
                            'name' => $req->input('name'),
                            'description' => $req->input('description'),
                            'participant_id' => $participant_ids,
                        );
                        $where = array(
                            'id' => $id
                        );
                      //Updating Records
                      if (isset($id) && $id != "") {
                        if (recordExists($table_name, $where)) {
                           // DD('HERE');
                            unset($table_data['created_on']);
                            unset($table_data['created_by']);
                            $table_data['dola'] = Carbon::now();
                            $table_data['altered_by'] = $user_id;
                            $res = updateRecord($table_name, $where, $table_data, $user_id);

                        }
                    } else {
                        $res = insertRecord('par_meeting_groups', $table_data, $user_id);
                        if(!isset($res['success'])||$res['success']==false){
                            return $res;
                          }

                       }
                        //saving records
                            $res= array(
                                'success' => true,
                                'message' => 'Record saved Successfully!!'
                            );

                    }catch (\Exception $exception) {
                        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

                    } catch (\Throwable $throwable) {
                        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
                    }
                    return response()->json($res);
        }

public function getMeetingGroups(Request $req){
                    try{
                            $qry = DB::table('par_meeting_groups as t1')
                                  ->select('t1.*') ;
                            $results = $qry->get();



                        $res = array(
                            'success' => true,
                            'results' => $results,
                            'message' => 'All is well'
                        );

                    } catch (\Exception $exception) {
                        $res = array(
                            'success' => false,
                            'message' => $exception->getMessage()
                        );
                    } catch (\Throwable $throwable) {
                        $res = array(
                            'success' => false,
                            'message' => $throwable->getMessage()
                        );
                    }
                    return \response()->json($res);

     }
   public function getMeetingGroupMembers(Request $req){
        try{
               $group_id = $req->input('group_id');
                $qry = DB::table('par_meeting_groups as t1')
                      ->select('t1.*')
                      ->where('t1.id',$group_id);
                $results = $qry->first();
                $participant_id = json_decode($results->participant_id);
                    foreach($participant_id as $user){
                        $new_qry = DB::table('users as t1')
                                ->select(DB::raw("t1.email,t1.id as user_id,CONCAT_WS(' ',decryptval(t1.first_name,".getDecryptFunParams()."),decryptval(t1.last_name,".getDecryptFunParams().")) as participant_name,decryptval(t1.phone,".getDecryptFunParams().") as phone"))
                                ->where('t1.id',$user);

                        $new_res = $new_qry->first();
                        $data[] = array(
                        'email'=>$new_res->email,
                        'user_id'=>$new_res->user_id,
                        'participant_name'=>$new_res->participant_name,
                        'phone'=>$new_res->phone,
                        );
                          }
                    $res = array(
                        'success' => true,
                        'results' => $data,
                        'message' => 'All is well'
                    );


        } catch (\Exception $exception) {
            $res = array(
                'success' => false,
                'message' => $exception->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = array(
                'success' => false,
                'message' => $throwable->getMessage()
            );
        }
        return \response()->json($res);

}
public function getAtcCodesForPreview(Request $req)
    {
    //allowed_extensions
        $atc_code = $req->atc_code;
        $parent_id = $req->node;


        try {
            $results = DB::table('par_atc_codes as t1')
                ->leftJoin('par_ingredients_details as t2', 't2.atc_code_id', 't1.id')
                ->select(DB::raw("t1.*,case when (select count(id) from par_atc_codes as q where q.parent_id = t1.id) = 0 then true else false end leaf, t2.id ingredient_id, t2.is_accepted, t2.acceptance_statement"));

            if(validateIsNumeric($parent_id)){
               $results->where('t1.parent_id', $parent_id);
            }else if ($atc_code == ''){
                $results->where('t1.parent_id', 0);
            }
            if($atc_code != '' ){
                $results->where('t1.code','ilike', '%'.$atc_code.'%')->orWhere('t1.name','ilike', '%'.$atc_code.'%');
            }

            $results=$results->get();

        } catch (\Exception $exception) {
            $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $results;

        //return \response()->json($results);

    }

    public function syncClinicalTrialApplicationNEC($request){
        try {
            $user_id = $this->user_id;
            $application_code = $request->input('application_code');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            $section_id = $request->input('section_id');
            $portal_db = DB::connection('portal_db');
            //Get portal product data
            $qry = $portal_db->table('wb_clinical_trial_applications as t1')
                ->select('t1.*');
            $qry->where('t1.application_code',$application_code);
            $results = $qry->first();
            if(!isset($results->id)){
                DB::rollBack();
                return ['message'=> 'record not found', 'success'=>false]; 
            }
            $portal_application_id =$results->id;
            $module_id=$results->module_id;
            $sub_module_id=$results->sub_module_id;
            $section_id=$results->section_id;
            // get process id
            $process_qry = DB::connection('nec_db')->table('wf_processes as t1')
                ->select('t1.id')
                ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
            $process_results = $process_qry->first();
            $process_results = $process_qry->first();
            if(!isset($process_results->id)){
                DB::rollBack();
                return ['message'=> 'Process not found', 'success'=>false]; 
            }
            $process_id = $process_results->id;
            if($results){
                // foreach($results as $results){
                $application_params = array(
                    'process_id' => $process_id,
                    'applicant_id' => $results->trader_id,
                    'view_id' => $results->view_id,
                    'module_id' => $results->module_id,
                    'sub_module_id' => $results->sub_module_id,
                    'section_id' => $results->section_id,
                    'application_code' => $results->application_code,
                    'workflow_stage_id' => $results->workflow_stage_id,
                    'tracking_no' =>  $results->tracking_no,
                    'application_status_id' => $results->application_status_id,
                    'gcp_guideline_statement' => $results->gcp_guideline_statement,
                    'trial_building_capacity_statement' => $results->trial_building_capacity_statement,
                    'insurance_measures_statement' => $results->insurance_measures_statement,
                    'conflict_of_interest_statement' => $results->conflict_of_interest_statement,
                    'compensation_statement' => $results->compensation_statement,
                    'gcp_guideline_comment' => $results->gcp_guideline_comment,
                    'investigators_choice_comment' => $results->investigators_choice_comment,
                    'gcp_training_needs_comment' => $results->gcp_training_needs_comment,
                    'trial_building_capacity_comment' => $results->trial_building_capacity_comment,
                    'resource_comment' => $results->resource_comment,
                    'monitoring_plan_comment' => $results->monitoring_plan_comment,
                    'how_confidentiality_is_maintained_comment' => $results->how_confidentiality_is_maintained_comment,
                    'insurance_measures_comment' => $results->insurance_measures_comment,
                    'patient_concent_comment' => $results->patient_concent_comment,
                    'publication_ethics_policy_comment' => $results->publication_ethics_policy_comment,
                    'participant_post_trial_condition_management_comment' => $results->participant_post_trial_condition_management_comment,
                    'ethics_committee_capacity_comment' => $results->ethics_committee_capacity_comment,
                    'compensation_comment' => $results->compensation_comment,
                    'is_conducted_in_host_country' => $results->is_conducted_in_host_country,
                    'why_not_conducted_in_host' => $results->why_not_conducted_in_host,
                    'study_duration' => $results->study_duration,
                    'duration_desc' => $results->duration_desc,
                    'has_other_authority_submission_pending_approval' => $results->has_other_authority_submission_pending_approval,
                    'other_authority_submission_pending_approval' => $results->other_authority_submission_pending_approval,
                    'has_other_authority_submission_with_approval' => $results->has_other_authority_submission_with_approval,
                    'other_authority_submission_with_approval' => $results->other_authority_submission_with_approval,
                    'has_other_trial_submission_with_rejection' => $results->has_other_trial_submission_with_rejection,
                    'other_authority_submission_with_rejection' => $results->other_authority_submission_with_rejection,
                    'has_other_trial_submission_suspension' => $results->has_other_trial_submission_suspension,
                    'other_authority_submission_suspension' => $results->other_authority_submission_suspension,
                    'is_being_undertaken_in_sadac_others' => $results->is_being_undertaken_in_sadac_others,
                    'being_undertaken_in_sadac_others' => $results->being_undertaken_in_sadac_others,
                    'includes_sub_study' => $results->includes_sub_study,
                    'is_sub_study_conducted_locally' => $results->is_sub_study_conducted_locally,
                    'reason_sub_study_not_conducted_locally' => $results->reason_sub_study_not_conducted_locally,
                    'are_references_current' => $results->are_references_current,
                    'discrepancies_present' => $results->discrepancies_present,
                    'discrepancies' => $results->discrepancies,
                    'other_comments' => $results->other_comments,
                    'sponsor_id' => $results->sponsor_id,
                    'investigator_id' => $results->investigator_id,
                    'study_title' => $results->study_title,
                    'short_study_title' => $results->short_study_title,
                    'protocol_no' => $results->protocol_no,
                    'phase_id' => $results->phase_id,
                    'version_no' => $results->version_no,
                    'date_of_protocol' => $results->date_of_protocol,
                    'clinical_prodsection_ids' =>$results->clinical_prodsection_ids,
                    'sponsor_origin_id' => $results->sponsor_origin_id,
                    'rationale_summary' => $results->rationale_summary,
                    'problem_summary' => $results->problem_summary,
                    'local_relevance_summary' => $results->local_relevance_summary,
                    'trial_medicine_property_summary' => $results->trial_medicine_property_summary,
                    'pre_clinical_findings_summary' => $results->pre_clinical_findings_summary,
                    'clinical_findings_summary' => $results->clinical_findings_summary,
                    'study_objective' => $results->study_objective,
                    'trial_design' => $results->trial_design,
                    'trial_participant_summary' => $results->trial_participant_summary,
                    'selection_criteria_summary' => $results->selection_criteria_summary,
                    'treatment_modalities_summary' => $results->treatment_modalities_summary,
                    'trial_outcome_measurement' => $results->trial_outcome_measurement,
                    'adverse_event_measure' => $results->adverse_event_measure,
                    'sample_determination' => $results->sample_determination,
                    'quantitative_statistical_methods' => $results->quantitative_statistical_methods,
                    'qualitative_statistical_methods' => $results->qualitative_statistical_methods,
                    'data_processing_summary' => $results->data_processing_summary,
                    'interim_summary' => $results->interim_summary,
                    'local_contact_id' => $results->local_agent_id,
                    'clinicalstudy_participanttype_id' => $results->clinicalstudy_participanttype_id,
                );
                $applications_table = 'tra_clinical_trial_applications';
                $res = insertRecord($applications_table, $application_params, $user_id,'nec_db');
                if(!isset($res['record_id'])){
                  DB::rollback();
                 return $res;
                 }
                $record_id = $res['record_id'];
                $application_id = $res['record_id'];

                //Add to submissions table
                //Add to submissions table
                $module_id=$results->module_id;
                $sub_module_id=$results->sub_module_id;
                $section_id=$results->section_id;
                $Stage_qry = DB::connection('nec_db')->table('wf_processes as t1')
                    ->select('t1.workflow_id')
                    ->where(array('module_id'=>$module_id,'sub_module_id'=>$sub_module_id,'section_id'=>$section_id));
                $Stage_qry_results = $Stage_qry->first();
                if($Stage_qry_results){
                    $workflow_id =$Stage_qry_results->workflow_id;
                    $stage_id_qry = DB::connection('nec_db')->table('wf_workflow_stages as t1')
                        ->select('t1.id')
                        ->where(array('t1.workflow_id'=>$workflow_id,'t1.is_portalapp_initialstage'=>1));
                    $stage_id_results = $stage_id_qry->first();
                    if(!isset($stage_id_results->id)){
                        DB::rollBack();
                        return ['message'=> 'is portal initial stage not set', 'success'=>false]; 
                    }
                    $workflow_stage_id=$stage_id_results->id;
                    $submission_params = array(
                        "process_id" => $process_id,
                        'application_id' => $application_id,
                        "application_code" => $results->application_code,
                        "tracking_no" => $results->tracking_no,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        "module_id" => $results->module_id,
                        "sub_module_id" => $results->sub_module_id,
                        "section_id" => $results->section_id,
                        "application_status_id" => $results->application_status_id,
                        'urgency' => 1,
                        "applicant_id" => $results->trader_id,
                        'remarks' => 'Initial save of the application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'is_fast_track' => $results->fasttrack_option_id,
                        'created_by' => $user_id
                    );

                    $sub_res = insertRecord('tra_submissions', $submission_params,$user_id,'nec_db');
                    if(!$sub_res['success']){
                        return $sub_res;
                    }
                    $new_submission_params = array(
                        'portal_application_id' => $portal_application_id,
                        'new_application_id' => $application_id,
                        "application_code" => $results->application_code,
                        "tracking_no" => $results->tracking_no,
                        "module_id" => $results->module_id,
                        "sub_module_id" => $results->sub_module_id,
                        "section_id" => $results->section_id,
                    );

                    //$new_submission_res = insertRecord('wb_portal_mis_recieved_app', $new_submission_params, $user_id,'portal_db');
                    // dd($new_submission_res);

                }
                else{
                    DB::rollBack();
                    return ['message'=>'failed to find mapped workflow stage internally', 'success'=>false];
                 }
                //Get clinicalstudy participants DETAILS
                $participantsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_clinicalstudy_participants as t2', 't1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.id',$portal_application_id);
                $participantsdetiailsresults = $participantsdetiailsqry->get();
                if($participantsdetiailsresults){
                    foreach ($participantsdetiailsresults as $participantsdetiailsresults) {
                        # code...
                        $participantsdetiailsresultsdata = array(
                            'application_id' => $application_id,
                            'number_oflocal_participants' => $participantsdetiailsresults->number_oflocal_participants,
                            'number_of_participants' => $participantsdetiailsresults->number_of_participants,
                            'min_enrollment' => $participantsdetiailsresults->min_enrollment,
                            'max_enrollment' => $participantsdetiailsresults->max_enrollment,
                            'local_volunteer_base' => $participantsdetiailsresults->local_volunteer_base,
                            'potential_retrospectivedata'=> $participantsdetiailsresults->potential_retrospectivedata,
                            'clinicalstudy_participanttype_id' => $participantsdetiailsresults->clinicalstudy_participanttype_id,
                            'altered_by' => $participantsdetiailsresults->altered_by,
                            'dola' => $participantsdetiailsresults->dola,
                            'created_by'=> $participantsdetiailsresults->created_by,

                        );
                        $participantsdetails_res = insertRecord('tra_clinicalstudy_participants', $participantsdetiailsresultsdata,$user_id,'nec_db');
                        if(!isset($participantsdetails_res['record_id'])){
                            DB::rollback();
                            return $participantsdetails_res;
            
                             }
                    }

                //Replicate Replicate Clinical Trial Other Details
                //Get investigators DETAILS
                $investigatorsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_clinical_trial_investigators as t2','t1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $investigatorsqryresults = $investigatorsqry->get();
                if($investigatorsqryresults){
                    foreach ($investigatorsqryresults as $investigatorsqryresults) {
                        # code...
                        $investigatorsqryresultsdata = array(
                            'application_id' => $application_id,
                            'category_id' => $investigatorsqryresults->category_id,
                            'investigator_id' => $investigatorsqryresults->investigator_id,
                            'application_reference_no'=> $investigatorsqryresults->investigator_id,
                            'total_number_of_studies'=> $investigatorsqryresults->total_number_of_studies,
                            'total_number_of_studies_date'=> $investigatorsqryresults->total_number_of_studies_date,
                            'total_number_of_participants'=> $investigatorsqryresults->total_number_of_participants,
                            'total_number_of_participants_date'=> $investigatorsqryresults->total_number_of_participants_date,
                            'trial_work_hours'=> $investigatorsqryresults->trial_work_hours,
                            'trial_work_percentage'=> $investigatorsqryresults->trial_work_percentage,
                            'trial_administrative_work_hours'=> $investigatorsqryresults->trial_administrative_work_hours,
                            'trial_administrative_work_percentage'=> $investigatorsqryresults->trial_administrative_work_percentage,
                            'organization_work_hours'=> $investigatorsqryresults->organization_work_hours,
                            'organization_work_percentage'=> $investigatorsqryresults->organization_work_percentage,
                            'organization_administrative_work_hours'=> $investigatorsqryresults->organization_administrative_work_hours,
                            'organization_administrative_work_percentage'=> $investigatorsqryresults->organization_administrative_work_percentage,
                            'teaching_preparation_hours'=> $investigatorsqryresults->teaching_preparation_hours,
                            'teaching_preparation_percentage'=> $investigatorsqryresults->teaching_preparation_percentage,
                            'teaching_lectures_hours' => $investigatorsqryresults->teaching_lectures_hours,
                            'teaching_lectures_percentage' => $investigatorsqryresults->teaching_lectures_percentage,
                            'writting_upwork_hours' => $investigatorsqryresults->writting_upwork_hours,
                            'writting_upwork_percentage' => $investigatorsqryresults->writting_upwork_percentage,
                            'information_sourcing_hours' => $investigatorsqryresults->information_sourcing_hours,
                            'information_sourcing_percentage' => $investigatorsqryresults->information_sourcing_percentage,
                            'other_investigator_tasks' => $investigatorsqryresults->other_investigator_tasks,
                            'other_tasks_hours' => $investigatorsqryresults->other_tasks_hours,
                            'other_tasks_percentage' => $investigatorsqryresults->other_tasks_percentage,
                            'study_site_id' => $investigatorsqryresults->study_site_id,
                            'altered_by' => $investigatorsqryresults->altered_by,
                            'dola' => $investigatorsqryresults->dola,
                            'created_by'=> $investigatorsqryresults->created_by,

                        );
                        $investigatorsdetails_res = insertRecord('clinical_trial_investigators', $investigatorsqryresultsdata,$user_id,'nec_db');
                        if(!isset($investigatorsdetails_res['record_id'])){
                            DB::rollback();
                            return $investigatorsdetails_res;
            
                             }
                    }
                }
                //Get Clinical trial monitors DETAILS
                $trialmonitorsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_clinical_trial_monitors as t2','t1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $trialmonitorsdetiailsresults = $trialmonitorsdetiailsqry->get();
                if($trialmonitorsdetiailsresults){
                    foreach ($trialmonitorsdetiailsresults as $trialmonitorsdetiailsresults) {
                        # code...
                        $trialmonitorsdetiailsresultsdata = array(
                            'application_id' => $application_id,
                            'monitor_id' => $trialmonitorsdetiailsresults->monitor_id,
                            'altered_by' => $trialmonitorsdetiailsresults->altered_by,
                            'dola' => $trialmonitorsdetiailsresults->dola,
                            'created_by'=> $trialmonitorsdetiailsresults->created_by,

                        );
                        $trialmonitorsdetiailsresults_res = insertRecord('tra_clinical_trial_monitors', $trialmonitorsdetiailsresultsdata,$user_id,'nec_db');
                        if(!isset($trialmonitorsdetiailsresults_res['record_id'])){
                            DB::rollback();
                            return $trialmonitorsdetiailsresults_res;
            
                             }
                    }
                }
                //Get clinical_trial_sites DETAILS
                $trialsitesdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_clinical_trial_sites as t2', 't1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $trialsitesdetiailsresults = $trialsitesdetiailsqry->get();
                if($trialsitesdetiailsresults){
                    foreach ($trialsitesdetiailsresults as $trialsitesdetiailsresults) {
                        # code...
                        $trialsitesdetiailsresultsdata = array(
                            'application_id' => $application_id,
                            'study_site_id' => $trialsitesdetiailsresults->study_site_id,
                            'app_reference_no' => $trialsitesdetiailsresults->app_reference_no,
                            'approving_instution' => $trialsitesdetiailsresults->approving_instution,
                            'responsible_ethics_committee' => $trialsitesdetiailsresults->responsible_ethics_committee,
                            'approval_date' => $trialsitesdetiailsresults->approval_date,
                            'application_reference_no' => $trialsitesdetiailsresults->application_reference_no,
                            'site_capacity_statement' => $trialsitesdetiailsresults->site_capacity_statement,
                            'is_competitive_enrollment' => $trialsitesdetiailsresults->is_competitive_enrollment,
                            'site_min_enrollment' => $trialsitesdetiailsresults->site_min_enrollment,
                            'site_max_enrollment' => $trialsitesdetiailsresults->site_max_enrollment,
                            'site_enrollment_statement' => $trialsitesdetiailsresults->site_enrollment_statement,
                            'local_volunteer_base' => $trialsitesdetiailsresults->local_volunteer_base,
                            'potential_retrospectivedata' => $trialsitesdetiailsresults->potential_retrospectivedata,
                            'altered_by' => $trialsitesdetiailsresults->altered_by,
                            'dola' => $trialsitesdetiailsresults->dola,
                            'created_by'=> $trialsitesdetiailsresults->created_by,

                        );
                        $trialsitesdetiailsresults_res = insertRecord('clinical_trial_sites', $trialsitesdetiailsresultsdata,$user_id,'nec_db');
                        if(!isset($trialsitesdetiailsresults_res['record_id'])){
                            DB::rollback();
                            return $trialsitesdetiailsresults_res;
            
                             }
                    }
                }
                //Get clinical_trial_sponsors DETAILS
                $sponsorsdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_clinical_trial_sponsors as t2', 't1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $sponsorsdetiailsresults = $sponsorsdetiailsqry->get();
                if($sponsorsdetiailsresults){
                    foreach ($sponsorsdetiailsresults as $sponsorsdetiailsresults) {
                        # code...
                        $sponsorsdetiailsresultsdata = array(
                            'application_id' => $application_id,
                            'sponsor_id' => $sponsorsdetiailsresults->sponsor_id,
                            'altered_by' => $sponsorsdetiailsresults->altered_by,
                            'dola' => $sponsorsdetiailsresults->dola,
                            'created_by'=> $sponsorsdetiailsresults->created_by,

                        );
                        $sponsorsdetiailsresults_res = insertRecord('tra_clinical_trial_sponsors', $sponsorsdetiailsresultsdata,$user_id,'nec_db');
                        if(!isset($sponsorsdetiailsresults_res['record_id'])){
                            DB::rollback();
                            return $sponsorsdetiailsresults_res;
            
                             }
                    }
                }
                //Get otherstates DETAILS
                $otherstatesdetiailsqry = $portal_db->table('wb_clinical_trial_applications as t1')
                    ->leftjoin('wb_otherstates_clinicaltrialsregistrations as t2', 't1.id', 't2.application_id')
                    ->select('t2.*')
                    ->where('t1.application_code',$application_code);
                $otherstatesdetiailsresults = $otherstatesdetiailsqry->get();
                if($otherstatesdetiailsresults){
                    foreach ($otherstatesdetiailsresults as $otherstatesdetiailsresults) {
                        # code...
                        $otherstatesdetiailsresultsdata = array(
                            'application_id' => $application_id,
                            'country_id' => $otherstatesdetiailsresults->country_id,
                            'registration_ref' => $otherstatesdetiailsresults->registration_ref,
                            'date_of_registration' => $otherstatesdetiailsresults->date_of_registration,
                            'approving_authority' => $otherstatesdetiailsresults->approving_authority,
                            'current_registrationstatus' => $otherstatesdetiailsresults->current_registrationstatus,
                            'altered_by' => $otherstatesdetiailsresults->altered_by,
                            'dola' => $otherstatesdetiailsresults->dola,
                            'created_by'=> $otherstatesdetiailsresults->created_by,
                            'created_on'=> $otherstatesdetiailsresults->created_on,

                        );
                        $otherstatesdetiails_res = insertRecord('tra_otherstates_clinicaltrialsregistrations', $otherstatesdetiailsresultsdata,$user_id,'nec_db');
                        if(!isset($otherstatesdetiails_res['record_id'])){
                            DB::rollback();
                            return $otherstatesdetiails_res;
            
                             }
                    }
                }
            }
        }
        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }
}


