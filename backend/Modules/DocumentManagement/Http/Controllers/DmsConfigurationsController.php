<?php

namespace Modules\DocumentManagement\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\Response;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
class DmsConfigurationsController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    protected $user_id;

    public function __construct()
    {
     /*
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
      */
    }

    public function getDocumentsTypes(Request $request)
    {
        try {
            $sop_id = $request->sop_id;
            $results = DB::table('par_document_types as t1')
                ->select('t1.*', 't2.name as master_sop', 't2.sop_no')
                ->join('par_sop_masterlist as t2', 't1.sop_id', '=', 't2.id');
            
               if(validateIsNumeric($sop_id)){
                    $results->where('t1.sop_id',$sop_id);
               }
                $results =$results->get();
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
        return $res;
    }
    
    public function getDocumentsSubTypes(Request $request)
    {
        try {
            $results = DB::table('par_document_subtypes as t1')
                ->select('t1.*', 't2.name as master_sop','t3.name as document_type', 't2.sop_no')
                ->join('par_sop_masterlist as t2', 't1.sop_id', '=', 't2.id')
                ->join('par_document_types as t3', 't1.document_type_id', '=', 't3.id')
                ->get();

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
        return $res;
    }
    
    public function getDMSSiteDefinationDetails(Request $request)
    {
        $table_name = 'tra_dmsdocument_sites';
        $res = $this->getCommonTableData($table_name);
        return \response()->json($res);

    }

    public function prepareDocumentCreationReceivingStage(Request $req){
        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_importexport_applications as t1')
                ->leftJoin('par_system_statuses as q', 't1.application_status_id','=','q.id')
                ->leftJoin('tra_approval_recommendations as t4', 't1.application_code','t4.application_code')
                ->leftJoin('tra_prechecking_recommendations as t5', 't1.application_code','t5.application_code')
                ->leftJoin('tra_managerpermits_review as t6', 't1.application_code','t6.application_code')
                ->where('t1.id', $application_id);

            $qry1 = clone $main_qry;
            $qry1->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                
                ->select('t1.*','q.name as application_status', 't1.id as active_application_id',
                    't3.name as applicant_name', 't3.contact_person','t4.decision_id as approval_recommendation_id','t5.recommendation_id as prechecking_recommendation_id', 't6.decision_id as review_recommendation_id',
                    't3.tin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'
                    );

            $results = $qry1->first();
            $premise_id = $results->tpin_id;
            $sender_receiver_id = $results->sender_receiver_id;
            $qry2 = DB::table('tra_permitsenderreceiver_data as t3')
                ->select('t3.id as trader_id','t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone',  't3.email_address as app_email')
                    ->where(array('id'=>$sender_receiver_id));
            $senderReceiverDetails = $qry2->first();

            $qry3 = DB::table('tra_premises as t3')
                ->select('t3.*')
                    ->where(array('id'=>$premise_id));
            $premisesDetails = $qry3->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'senderReceiverDetails'=>$senderReceiverDetails,
                'premisesDetails'=>$premisesDetails,
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


    function getCommonTableData($table_name)
    {

        try {
            $results = DB::table($table_name)->get();

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
        return $res;

    }

    public function getParameterstableSchema()
    {
        $data = array();
        $data = DB::select("show tables like '%par%'");
        foreach ($data as $table) {
            $data[] = array('table_name' => $table_name);

        }
        $res = array('data' => $data, 'success' => true);
        return \response()->json($res);
    }
 
// public function getdocdefinationrequirementDetails(Request $req)
// {
//     $module_id = $req->module_id;
//     $sub_module_id = $req->sub_module_id;
//     $section_id = $req->section_id;
//     $premise_type_id = $req->premise_type_id;
//     $parent_id = $req->node;

//     try {
//         $results = DB::table('tra_documentmanager_application as t1')
//             ->leftJoin('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
//             ->leftJoin('par_sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
//             ->leftJoin('par_modules as t3', 't4.module_id', '=', 't3.id')
//             ->leftJoin('par_sections as t5', 't1.section_id', '=', 't5.id')
//             ->leftJoin('wf_processes as t7', 't1.process_id', '=', 't7.id')
//             ->leftJoin('par_form_categories as t8', 't1.document_type_id', '=', 't8.id')
//             ->leftJoin('par_confirmations as t9', 't1.has_parent_level', '=', 't9.id')
//             ->select(
//                 't1.*',
//                 DB::raw("CASE WHEN (SELECT COUNT(id) FROM tra_documentmanager_application q WHERE q.docparent_id = t1.id) = 0 THEN TRUE ELSE FALSE END AS leaf"),
//                 't1.name AS mtype',
//                 't2.name AS document_type',
//                 't3.name AS module_name',
//                 't4.name AS sub_module',
//                 't5.name AS section_name',
//                 't7.name AS process_name',
//                 't8.name AS document_type',
//                 't9.name AS parent_level',

//                 DB::raw("(SELECT GROUP_CONCAT(CONCAT(j.name, '.', j.extension) SEPARATOR ',') 
//                             FROM tra_docupload_reqextensions t 
//                             INNER JOIN par_document_extensionstypes j ON t.document_extensionstype_id = j.id 
//                             WHERE t.documentupload_requirement_id = t1.id) AS allowed_extensions")
//             );

//         if (validateIsNumeric($parent_id)) {
//             $results->where('t1.docparent_id', $parent_id);
//         } else {
//             $results->whereNull('t1.docparent_id');
//         }
//         if (validateIsNumeric($module_id)) {
//             $results->where('t4.module_id', $module_id);
//         }
//         if (validateIsNumeric($sub_module_id)) {
//             $results->where('t1.sub_module_id', $sub_module_id);
//         }
//         if (validateIsNumeric($section_id)) {
//             $results->where('t1.section_id', $section_id);
//         }
//         if (validateIsNumeric($premise_type_id)) {
//             $results->where('t1.premise_type_id', $premise_type_id);
//         }

//         $results = $results->get();
//     } catch (\Exception $exception) {
//         $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
//     } catch (\Throwable $throwable) {
//         $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
//     }
//     return $results;
// }

public function getdocdefinationrequirementDetails(Request $req)
{
    $parent_id = $req->node;

    try {
     $results = DB::table('tra_documentmanager_application as t1')
    ->leftJoin('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
    ->leftJoin('users as t3', 't1.owner_user_id', '=', 't3.id')
    ->leftJoin('wf_workflow_stages as t4', 't1.workflow_stage_id', '=', 't4.id')
    ->leftJoin('wf_processes as t5', 't1.process_id', '=', 't5.id')
    ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
    ->select(
        // DB::raw("CONCAT_WS(decrypt(t3.first_name), ' ', COALESCE(decrypt(t3.last_name), '')) as owner"),
        DB::raw("CONCAT_WS(' ',decrypt(t3.first_name),decrypt(t3.last_name)) as owner"),
        't1.*',
        't1.doc_title AS mtype',
        't2.name AS document_type',
        't6.name AS status',
        't5.name AS process_name',

                // DB::raw("(SELECT  t.navigator_folder_name
                //             FROM tra_documentmanager_application t  
                //             WHERE t.id = t.docparent_id) AS navigator_foldername")
        DB::raw("(SELECT t2.navigator_folder_name
          FROM tra_documentmanager_application t2
          WHERE t1.navigator_folder_id = t2.id) as recoil")

    )
    ->whereNull('t1.navigator_folder_name');


//CONCAT(t11.brand_name,' ',COALESCE(t12.name,'')) as brand_name,

        $results = $results->get();
    } catch (\Exception $exception) {
        $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    }
    return $results;
}
    public function getdoctypesDetails(Request $req){
        $module_id = $req->module_id;
    $sub_module_id = $req->sub_module_id;
    $section_id = $req->section_id;
    $premise_type_id = $req->premise_type_id;
    $parent_id = $req->node;

    try {
        $results = DB::table('par_document_types as t1')
          // ->leftJoin('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
            ->leftJoin('par_sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
            ->leftJoin('par_modules as t3', 't4.module_id', '=', 't3.id')
           // ->leftJoin('par_sections as t5', 't1.section_id', '=', 't5.id')
            // ->leftJoin('par_prodclass_categories as t6', 't1.prodclass_category_id', '=', 't6.id')
            // ->leftJoin('wf_processes as t7', 't1.process_id', '=', 't7.id')
           // ->leftJoin('par_form_categories as t8', 't1.document_type_id', '=', 't8.id')
            ->leftJoin('par_confirmations as t9', 't1.has_parent_level', '=', 't9.id')
            ->select(
                't1.*',
                DB::raw("CASE WHEN (SELECT COUNT(id) FROM par_document_types q WHERE q.docparent_id = t1.id) = 0 THEN TRUE ELSE FALSE END AS leaf"),
                't1.name AS mtype',
                't3.name AS module_name',
                't4.name AS sub_module',
                't9.name AS parent_level',

                DB::raw("(SELECT GROUP_CONCAT(CONCAT(j.name, '.', j.extension) SEPARATOR ',') 
                            FROM tra_docupload_reqextensions t 
                            INNER JOIN par_document_extensionstypes j ON t.document_extensionstype_id = j.id 
                            WHERE t.documentupload_requirement_id = t1.id) AS allowed_extensions")
            );

        if (validateIsNumeric($parent_id)) {
            $results->where('t1.docparent_id', $parent_id);
        } else {
            $results->whereNull('t1.docparent_id');
        }
        if (validateIsNumeric($module_id)) {
            $results->where('t4.module_id', $module_id);
        }
        if (validateIsNumeric($sub_module_id)) {
            $results->where('t1.sub_module_id', $sub_module_id);
        }
        if (validateIsNumeric($section_id)) {
            $results->where('t1.section_id', $section_id);
        }
        if (validateIsNumeric($premise_type_id)) {
            $results->where('t1.premise_type_id', $premise_type_id);
        }

        $results = $results->get();
    } catch (\Exception $exception) {
        $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    }
    return $results;

    }

     public function getNavigatorDetails(Request $req){
        $module_id = $req->module_id;
    $sub_module_id = $req->sub_module_id;
    $section_id = $req->section_id;
    $premise_type_id = $req->premise_type_id;
    $parent_id = $req->node;

    try {
        $results = DB::table('tra_documentmanager_application as t1')
            ->leftJoin('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
            ->leftJoin('par_sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
            ->leftJoin('par_modules as t3', 't4.module_id', '=', 't3.id')
            ->leftJoin('par_confirmations as t5', 't1.has_parent_level', '=', 't5.id')
            ->leftJoin('wf_workflow_stages as t6', 't1.workflow_stage_id', '=', 't6.id')
            ->leftJoin('wf_processes as t7', 't1.process_id', '=', 't7.id')
            ->leftJoin('par_system_statuses as t8', 't1.application_status_id', '=', 't8.id')
            ->leftJoin('tra_application_uploadeddocuments as t9', 't1.application_code', '=', 't9.application_code')
            ->select(
                //'t1.*',
                DB::raw("CASE WHEN (SELECT COUNT(id) FROM tra_documentmanager_application q WHERE q.docparent_id = t1.id) = 0 THEN TRUE ELSE FALSE END AS leaf, if(t1.navigator_folder_name IS NULL, t9.initial_file_name, t1.navigator_folder_name) AS recoil"),
                't1.doc_title AS navigator_doc_title',
                't1.id',
                't1.tracking_no',
                't1.doc_version as navigator_version',
                't1.dola',
                't1.id AS navigator_folder_id',
                't1.doc_description AS navigator_description',
               // 't1.description AS navigator_descriptions',
                // 't1.navigator_folder_name AS navigator_foldername',
                // 't2.name AS navigator_foldername',
                // 't3.name AS module_name',
                // 't4.name AS sub_module',
                // 't5.name AS parent_level',
                // 't8.name AS status',
                // 't7.name AS process_name',
            );

        if (validateIsNumeric($parent_id)) {
            $results->where('t1.docparent_id', $parent_id);
        } else {
            $results->whereNull('t1.docparent_id');
        }
 
        $results = $results->get();
    } catch (\Exception $exception) {
        $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    }
    return $results;

    }

     public function navigatorMoveFolder(Request $request)
    {
        try {
            $qry = DB::table('tra_documentmanager_application as t1')
        
                ->select('t1.id', 't1.folder_name');

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
        return response()->json($res);
    }

    public function getdocumentreposirotystructureDetails()
    {

        try {
            $results = DB::table('tra_modulesdocs_defination as t1')
                ->leftJoin('modules as t3', 't1.module_id', '=', 't3.id')
                ->select('t1.*', 't3.name as module_name')
                ->get();
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

    public function getdocumentsectionsrepstructure()
    {

        try {
            $results = DB::table('tra_modules_sectionsdocs_defination as t1')
                ->leftJoin('tra_modulesdocs_defination as t2', 't1.moduledocs_id', '=', 't2.id')
                ->leftJoin('modules as t3', 't2.module_id', '=', 't3.id')
                ->select('t1.*', 't2.dms_node_id as parent_node_id', 't3.name as module_name')
                ->get();

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

    public function docdefinationrequirementfilterdetails()
    {


    }

    public function getDmsParamFromModel(Request $request)
    {
        $model_name = $request->input('model_name');
        $strict_mode = $request->input('strict_mode');
        try {
            $model = 'App\\Modules\\DocumentManagement\\Entities\\' . $model_name;
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

    public function saveDocumentRepositoryStructure(Request $req)
    {
        //the details
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = $post_data['table_name'];
            $id = $post_data['id'];
            $module_id = $post_data['module_id'];
            $unsetData = $req->input('unset_data');
            //unset unnecessary values
            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    $dms_node_id = $previous_data[0]['dms_node_id'];
                    //dms function call with validation
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $table_data['created_on'] = Carbon::now();
                $table_data['created_by'] = $user_id;
                //the data
                // save the repository
                $where = array(
                    'module_id' => $module_id
                );
                if (!recordExists($table_name, $where)) {
                    $res = insertRecord($table_name, $table_data, $user_id);
                    //the details
                    $record_id = $res['record_id'];
                    $dms_node_id = '';
                    //the details
                    // create the sections repository details

                    $sql = DB::table('par_sections')->get();
                    foreach ($sql as $rec) {
                        $data = array('section_id' => $rec->id,
                            'moduledocs_id' => $record_id,
                            'name' => $rec->name,
                            'description' => $rec->name,
                            'dms_node_id' => $dms_node_id);
                        $data['created_on'] = Carbon::now();
                        $data['created_by'] = $user_id;

                        $res = insertRecord('tra_modules_sectionsdocs_defination', $data, $user_id);

                    }

                } else {
                    $res = array(
                        'success' => false,
                        'message' => "Module Reposiroty has already been defined"
                    );
                }

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }


    public function saveDocumentRepositoryRootFolder(Request $req)
    {
        //the details
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_repositoryroot_defination';
            $id = $post_data['id'];
            $unsetData = $req->input('unset_data');
            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (isset($id) && $id != "") {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    $dms_node_id = $previous_data[0]['dms_node_id'];
                    //dms function call with validation
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $table_data['created_on'] = Carbon::now();
                $table_data['created_by'] = $user_id;

                $sql = DB::table('tra_repositoryroot_defination')->get();

                if (!count($sql) > 0) {

                    $response = getDMSRootFolder();
                    $dms_node_id = $response->entry->id;
                    //create a repository
                    $table_data['dms_node_id'] = $dms_node_id;
                    $res = insertRecord($table_name, $table_data, $user_id);
                } else {
                    $res = array(
                        'success' => false,
                        'message' => "Root Reposiroty has already been defined"
                    );
                }

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function saveDMSSiteDefinationDetails(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_dmsdocument_sites';
            $id = $post_data['id'];
            $site_id = $post_data['site_id'];
            $unsetData = $req->input('unset_data');
            //unset unnecessary values
            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (validateIsNumeric($id)) {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    //dms function call with validation 
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {

                $sql = DB::table($table_name)
                    ->where(array('site_id' => $site_id))
                    ->get();

                $table_data['created_on'] = Carbon::now();
                $table_data['created_by'] = $user_id;

                if (!count($sql) > 0) {
                    $res = insertRecord($table_name, $table_data, $user_id);

                } else {
                    $res = array(
                        'success' => false,
                        'message' => "Root Reposiroty has already been defined"
                    );
                }

            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function saveDMSSectionDefinationDetails(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_sections_docdefination';
            $id = $post_data['id'];
            $site_id = $post_data['dms_site_id'];

            $section_id = $post_data['section_id'];
            $unsetData = $req->input('unset_data');

            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (validateIsNumeric($id)) {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    //dms function call with validation 
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $sql = DB::table($table_name)
                    ->where(array('dms_site_id' => $site_id, 'section_id' => $section_id))
                    ->get();
                if (!count($sql) > 0) {
                    $site_node_ref = $this->getSiteNodeRef($site_id, 'tra_dmsdocument_sites');
                    $section_name = $this->getTableDataName($section_id, 'par_sections');
                    //create a node in the site 
                    $node_name = $section_name . ' Documents';

                    $section_name = strtolower(str_replace(' ', '', $section_name));

                    $node_details = array('name' => $node_name,
                        'nodeType' => 'cm:folder');

                    $response = dmsCreateAppRootNodesChildren($site_node_ref, $node_details);

                    if ($response['success']) {
                        $node_id = $response['node_details']->id;
                        $table_data['node_ref'] = $node_id;

                        $table_data['created_on'] = Carbon::now();
                        $table_data['created_by'] = $user_id;

                        $table_data['node_name'] = $node_name;

                        $res = insertRecord($table_name, $table_data, $user_id);
                        if ($res['success']) {
                            $res['message'] = $node_name . ' has been created successfully';

                        }

                    } else {
                        $res = $response;
                    }
                } else {

                    $res = array(
                        'success' => false,
                        'message' => "Node Repository has already been defined"
                    );
                }
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function saveDMSNoStructuredDocDefinationDetails(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_nonstructured_docdefination';
            $id = $post_data['id'];
            $site_id = $post_data['dms_site_id'];

            $document_type_id = $post_data['document_type_id'];
            $unsetData = $req->input('unset_data');

            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (validateIsNumeric($id)) {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    //dms function call with validation 
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $sql = DB::table($table_name)
                    ->where(array('dms_site_id' => $site_id, 'document_type_id' => $document_type_id))
                    ->get();
                if (!count($sql) > 0) {
                    $site_node_ref = $this->getSiteNodeRef($site_id, 'tra_dmsdocument_sites');
                    $section_name = $this->getTableDataName($document_type_id, 'par_document_types');
                    //create a node in the site 
                    $node_name = $section_name . ' Documents';

                    $section_name = strtolower(str_replace(' ', '', $section_name));

                    $auth_response = authDms('');
                    $node_details = array('name' => $node_name,
                        'nodeType' => 'cm:folder');
                    $response = dmsCreateAppRootNodesChildren($site_node_ref, $node_details);

                    if ($response['success']) {
                        $node_id = $response['node_details']->id;
                        $table_data['node_ref'] = $node_id;

                        $table_data['created_on'] = Carbon::now();
                        $table_data['created_by'] = $user_id;

                        $table_data['node_name'] = $node_name;

                        $res = insertRecord($table_name, $table_data, $user_id);
                        if ($res['success']) {
                            $res['message'] = $node_name . ' has been created successfully';

                        }

                    } else {
                        $res = $response;
                    }

                } else {

                    $res = array(
                        'success' => false,
                        'message' => "Node Repository has already been defined"
                    );
                }
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function saveDMSSecModulesDefinationDetails(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_sectionsmodule_docdefination';
            $id = $post_data['id'];
            $doc_section_id = $post_data['doc_section_id'];

            $module_id = $post_data['module_id'];
            $unsetData = $req->input('unset_data');

            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params

            $where = array(
                'id' => $id
            );
            if (validateIsNumeric($id)) {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    //dms function call with validation 
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $sql = DB::table($table_name)
                    ->where(array('doc_section_id' => $doc_section_id, 'module_id' => $module_id))
                    ->get();
                if (!count($sql) > 0) {
                    $node_ref = $this->getSiteNodeRef($doc_section_id, 'tra_sections_docdefination');
                    $module_name = $this->getTableDataName($module_id, 'modules');
                    //create a node in the site 
                    $node_name = $module_name . ' Documents ' . str_random(5);

                    $module_name = strtolower(str_replace(' ', '', $module_name));

                    $node_details = array(
                        'name' => $node_name,
                        'nodeType' => 'cm:folder'
                    );
                    $response = dmsCreateAppRootNodesChildren($node_ref, $node_details);
                    if ($response['success']) {
                        $node_id = $response['node_details']->id;
                        $table_data['node_ref'] = $node_id;

                        $table_data['created_on'] = Carbon::now();
                        $table_data['created_by'] = $user_id;

                        $table_data['node_name'] = $node_name;
                        $res = insertRecord($table_name, $table_data, $user_id);
                        if ($res['success']) {
                            $res['message'] = $node_name . ' has been created successfully';

                        }
                    } else {
                        $res = $response;
                    }

                } else {

                    $res = array(
                        'success' => false,
                        'message' => "Node Repository has already been defined"
                    );
                }
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function saveDMSSecSubModulesDefinationDetails(Request $req)
    {

        try {

            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_sectionssubmodule_docdefination';
            $id = $post_data['id'];

            $module_id = $post_data['module_id'];
            $module_id = $post_data['module_id'];
            $sub_module_id = $post_data['sub_module_id'];
            $doc_section_id = $post_data['doc_section_id'];
            $module_record = getSingleRecord('tra_sectionsmodule_docdefination', array('module_id' => $module_id, 'doc_section_id' => $doc_section_id));

            $doc_module_id = $module_record->id;

            $unsetData = $req->input('unset_data');

            $post_data = $this->funcReturnResetPostData($post_data);
            $post_data['doc_module_id'] = $doc_module_id;
            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params
            $where = array(
                'id' => $id
            );
            if (validateIsNumeric($id)) {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    //dms function call with validation 
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $sql = DB::table($table_name)
                    ->where(array('doc_module_id' => $doc_module_id, 'sub_module_id' => $sub_module_id))
                    ->get();
                if (!count($sql) > 0) {
                    $node_ref = $this->getSiteNodeRef($doc_module_id, 'tra_sectionsmodule_docdefination');
                    $module_name = $this->getTableDataName($sub_module_id, 'sub_modules');
                    //create a node in the site $node_name = $module_name.' Documents '.str_random(5);
                    $node_name = $module_name . ' Applications Documents' . str_random(5);

                    $module_name = strtolower(str_replace(' ', '', $module_name));

                    $node_details = array('name' => $node_name,
                        'nodeType' => 'cm:folder');
                    $response = dmsCreateAppRootNodesChildren($node_ref, $node_details);

                    if ($response['success']) {
                        $node_id = $response['node_details']->id;
                        $table_data['node_ref'] = $node_id;

                        $table_data['created_on'] = Carbon::now();
                        $table_data['created_by'] = $user_id;

                        $table_data['node_name'] = $node_name;
                        $res = insertRecord($table_name, $table_data, $user_id);
                        if ($res['success']) {
                            $res['message'] = $node_name . ' has been created successfully';

                        }
                    } else {
                        $res = $response;
                    }

                } else {

                    $res = array(
                        'success' => false,
                        'message' => "Node Repository has already been defined"
                    );
                }
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function saveDMSModulesDocTypeDefinationDetails(Request $req)
    {

        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_sectionsmodule_doctypedefination';
            $id = $post_data['id'];

            $module_id = $post_data['module_id'];
            $doc_section_id = $post_data['doc_section_id'];
            $document_type_id = $post_data['document_type_id'];
            $sub_module_id = $post_data['sub_module_id'];


            $unsetData = $req->input('unset_data');

            $post_data = $this->funcReturnResetPostData($post_data);

            if (isset($unsetData)) {
                $unsetData = explode(",", $unsetData);
                $post_data = unsetArrayData($post_data, $unsetData);
            }
            $table_data = $post_data;
            //add extra params
            $where = array(
                'id' => $id
            );
            if (validateIsNumeric($id)) {
                if (recordExists($table_name, $where)) {

                    $table_data['dola'] = Carbon::now();
                    $table_data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    if ($previous_data['success'] == false) {
                        return $previous_data;
                    }
                    $previous_data = $previous_data['results'];
                    //dms function call with validation 
                    $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);

                }
            } else {
                $sql = DB::table($table_name)
                    ->where(array('doc_section_id' => $doc_section_id, 'sub_module_id' => $sub_module_id, 'document_type_id' => $document_type_id))
                    ->get();
                if (!count($sql) > 0) {

                    $table_data['created_on'] = Carbon::now();
                    $table_data['created_by'] = $user_id;

                    $res = insertRecord($table_name, $table_data, $user_id);
                    $res['message'] = 'Saved successfully';


                } else {

                    $res = array(
                        'success' => false,
                        'message' => "Module Document Type has already been saved"
                    );
                }
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function getRepositoryrootfolderDetails(Request $req)
    {
        try {
            $data = array();
            $results = DB::table('tra_repositoryroot_defination as t1')
                ->select('t1.*')
                ->get();
            foreach ($results as $rows) {

                $data[] = array(
                    'id' => $rows->id,
                    'name' => $rows->name,
                    'description' => $rows->description,
                    'dms_folder' => $dms_folder,
                    ''
                );

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

    public function getDMSSectionsDefinationDetails(Request $req)
    {
        try {

            $results = DB::table('tra_sections_docdefination as t1')
                ->join('tra_dmsdocument_sites as t2', 't1.dms_site_id', '=', 't2.id')
                ->join('par_sections as t3', 't1.section_id', '=', 't3.id')
                ->select('t1.*', 't2.name as site_name', 't2.node_ref as site_node_ref', 't3.name as section_name')
                ->get();

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

    public function getnonStructuredDocumentsDefination(Request $req)
    {
        try {

            $results = DB::table('tra_nonstructured_docdefination as t1')
                ->join('tra_dmsdocument_sites as t2', 't1.dms_site_id', '=', 't2.id')
                ->join('par_document_types as t3', 't1.document_type_id', '=', 't3.id')
                ->select('t1.*', 't2.name as site_name', 't2.node_ref as site_node_ref', 't3.name as document_type')
                ->get();
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

    public function getDMSSectionsModulesDefinationDetails(Request $req)
    {
        try {
            $doc_section_id = $req->doc_section_id;
            $results = DB::table('tra_sectionsmodule_docdefination as t1')
                ->join('tra_sections_docdefination as t2', 't1.doc_section_id', '=', 't2.id')
                ->join('par_sections as t3', 't2.section_id', '=', 't3.id')
                ->join('modules as t4', 't1.module_id', '=', 't4.id')
                ->select('t1.*', 't3.name as section_name', 't2.node_ref as section_node_ref', 't4.name as module_name')
                ->where(array('t1.doc_section_id' => $doc_section_id))
                ->get();

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

    public function getDMSSectionsSubModulesDefinationDetails(Request $req)
    {
        try {
            $doc_section_id = $req->doc_section_id;
            $doc_module_id = $req->doc_module_id;
            $where_data = array();
            if (validateIsNumeric($doc_section_id)) {
                $where_data = array('t1.doc_section_id' => $doc_section_id);
            } else if (validateIsNumeric($doc_module_id)) {

                $where_data = array('t2.module_id' => $doc_module_id);
            }

            $results = DB::table('tra_sectionssubmodule_docdefination as t1')
                ->join('tra_sectionsmodule_docdefination as t2', 't1.doc_module_id', '=', 't2.id')
                ->join('modules as t3', 't2.module_id', '=', 't3.id')
                ->join('sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
                ->select('t1.*', 't3.name as module_name', 't2.node_ref as modulenode_ref', 't4.name as submodule_name')
                ->where($where_data)
                ->get();

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


    public function getSOPMasterListDetails(Request $req)
    {
        try {
            $doc_section_id = $req->doc_section_id;
            $results = DB::table('par_sop_masterlist')->get();

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

    public function getDMSModulesDocumentTypesDefinationDetails(Request $req)
    {
        try {
            $doc_section_id = $req->doc_section_id;
            $results = DB::table('tra_sectionsmodule_doctypedefination as t1')
                ->join('modules as t3', 't1.module_id', '=', 't3.id')
                ->join('sub_modules as t4', 't1.sub_module_id', '=', 't4.id')
                ->join('par_document_types as t5', 't1.document_type_id', '=', 't5.id')
                ->select('t1.*', 't3.name as module_name', 't5.name  as document_type_name', 't4.name as submodule_name')
                ->where(array('t1.doc_section_id' => $doc_section_id))
                ->get();

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

    function funcReturnResetPostData($post_data)
    {
//unset unnecessary values
        unset($post_data['_token']);
        unset($post_data['table_name']);
        unset($post_data['model']);
        unset($post_data['id']);
        unset($post_data['unset_data']);
        return $post_data;
    }

    function getSiteNodeRef($site_id, $table_name)
    {
        $sql = DB::table($table_name)
            ->where(array('id' => $site_id))
            ->first();
        $node_ref = '';
        if ($sql) {
            $node_ref = $sql->node_ref;
        }
        return $node_ref;
    }

    function getTableDataName($record_id, $table_name)
    {
        $sql = DB::table($table_name)
            ->where(array('id' => $record_id))
            ->first();
        $record_name = '';
        if ($sql) {
            $record_name = $sql->name;

        }
        return $record_name;

    }
    public function dmsUpdateAccountPassword(Request $req){
        try {
            $userName = $req->userName;
            $oldPassword = $req->oldPassword;
            $newPassword = $req->newPassword;

            $dms_password = Config('constants.dms.dms_adminpassword');
          
            if($oldPassword == $dms_password){
               
                $res = dmsUpdateAccountPassword($userName,$oldPassword,$newPassword);
            }
            else{
                $res = array('success'=>false, 'message'=>'DMS Administrative password is different from the current');
            }

        } catch (\Exception $exception) {
            
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
         
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);  

    } 
}