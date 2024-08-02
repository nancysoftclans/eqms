<?php

namespace Modules\DocumentManagement\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
// use Pion\Laravel\ChunkUpload\Config\AbstractConfig;
// use Pion\Laravel\ChunkUpload\Exceptions\UploadFailedException;
// use Pion\Laravel\ChunkUpload\Handler\AbstractHandler;
// use Pion\Laravel\ChunkUpload\Save\AbstractSave;
// use Pion\Laravel\ChunkUpload\Save\ChunkSave;
// use Pion\Laravel\ChunkUpload\Save\SingleSave;
// use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Http\File;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use ZanySoft\Zip\Zip;
use File;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use ZipArchive;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Arr;


//watermark
use Exports\GridExport;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Excel;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PDF;
use \Mpdf\Mpdf as mPDF;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Style\Font;
use PhpOffice\PhpWord\Shared\Converter;
//use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\TemplateProcessor;
//use PhpOffice\PhpWord\PhpWord;

class DocumentManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    protected $user_id;

    public function __construct(Request $req)
    {
        $is_mobile = $req->input('is_mobile');
        if (is_numeric($is_mobile) && $is_mobile > 0) {
            $this->user_id = auth('api')->user()->id;
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

    public function getProcessApplicableDocTypes(Request $req)
    {
        $process_id = $req->input('process_id');
        $workflow_stage = $req->input('workflow_stage');
        $section_id = $req->input('section_id');
        $module_id = $req->input('module_id');
        $sub_module_id = $req->input('sub_module_id');
        $document_type_id = $req->input('document_type_id');
        $query_id = $req->input('query_id');
        $where = array(
            'section_id' => $section_id,
            'module_id' => $module_id,
            'sub_module_id' => $sub_module_id
        );
        try {
            if (!validateIsNumeric($process_id)) {
                $process_id = getSingleRecordColValue('wf_processes', $where, 'id');
            }
            $qry = DB::table('tra_proc_applicable_doctypes as t1')
                ->join('par_document_types as t2', 't1.doctype_id', '=', 't2.id')
                ->join('tra_documentmanager_application as t3', 't2.id', '=', 't3.document_type_id')
                ->select('t2.id', 't2.name');
            /*-------------------------------------------------------
                For Document originating from query window identified by
                query id rewrite the query not tied to process
                Document Type : 39
            --------------------------------------------------------*/
            if (validateIsNumeric($query_id)) {
                $qry = DB::table('par_document_types as t2')
                    ->select('t2.id', 't2.name', 't2.is_assessment_doc');
                $qry->where('t2.id', 39);
            } else {
                if (isset($process_id) && $process_id != '') {
                    $qry->where('t1.process_id', $process_id);
                }
                if (isset($workflow_stage) && $workflow_stage != '') {
                    $qry->where('t1.stage_id', $workflow_stage);
                }
                if (validateIsNumeric($document_type_id)) {
                    $qry->where('t1.id', $document_type_id);
                }
            }

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getProcessApplicableDocRequirements(Request $req)
    {
        $docType_id = $req->input('docType_id');
        $process_id = $req->input('process_id');
        $prodclass_category_id = $req->input('prodclass_category_id');
        $premise_type_id = $req->input('premise_type_id');
        $section_id = $req->input('section_id');
        $module_id = $req->input('module_id');
        $sub_module_id = $req->input('sub_module_id');
        $where = array(
            //'t1.section_id' => $section_id,
            't1.module_id' => $module_id,
            't1.sub_module_id' => $sub_module_id
        );
        try {
            $qry = DB::table('tra_documentmanager_application as t1')
                ->join('wf_processes as t2', function ($join) {
                    $join->on("t1.module_id", "=", "t2.module_id")
                        ->on("t1.sub_module_id", "=", "t2.sub_module_id");
                })
                ->select('t1.id', 't1.name', 't2.id as process', 't1.prodclass_category_id')
                ->where('t1.document_type_id', $docType_id)
                ->whereRaw("(select count(a.id) from tra_documentmanager_application a where a.docparent_id = t1.id) = 0")
                ->where($where);

            if (validateIsNumeric($process_id)) {
                $qry->where('t2.id', $process_id);
            }
            if (validateIsNumeric($prodclass_category_id)) {
                $qry->where('t1.prodclass_category_id', $prodclass_category_id);
            }
            if (validateIsNumeric($premise_type_id)) {
                $qry->where('t1.premise_type_id', $premise_type_id);
            }


            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function saveDocDefinationrequirement(Request $request)
    {

        try {
            $application_code = $request->input('application_code');
            $process_id = $request->input('process_id');
            $workflow_stage_id = $request->input('workflow_stage_id');
            $application_status_id = $request->input('application_status_id');
            $zone_id = $request->input('zone_id');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            

            if($sub_module_id == 108){
                $applications_table = 'tra_documentrecords_application';
            }else{
                $applications_table = $request->input('table_name');
            }
            $user_id = $this->user_id;

                 $doc_prefix = DB::table('par_document_types')
                ->select('prefix')
                ->where('id', $request['document_type_id'])
                ->first();

                    if ($doc_prefix) {
                        $doc_prefix = $doc_prefix->prefix;
                    }


            $doc_number = generateDocumentNumber($sub_module_id, $process_id, $user_id, $doc_prefix);

            $app_data = array(
                "process_id" => $request->input('process_id'),
                "workflow_stage_id" => $request->input('workflow_stage_id'),
                "stage_category_id" => $request->input('stage_category_id'),
                "applicant_id" => $request->input('applicant_id'),
                "sub_module_id" => $sub_module_id,
                "module_id" => $module_id,
                "doc_title" => $request->input('doc_title'),
                "owner_user_id" => $request->input('owner_user_id'),
                "owner_group_id" => $request->input('owner_group_id'),
                "doc_description" => $request->input('doc_description'),
                "owner_type_id" => $request->input('owner_type_id'),
                "doc_version" => $request->input('doc_version'),
                "application_status_id" => $request->input('application_status_id'),
                "document_type_id" => $request->input('document_type_id'),
                "navigator_folder_id" => $request->input('navigator_folder_id'),
                "document_number" => $doc_number,

            );


            
             $action = array(
                'user_id' => $user_id,
                'action' => 'application saved/updated',
                'accessed_on' => Carbon::now()
            );



            if (validateIsNumeric($application_code)) {
                //update
                $app_data['dola'] = Carbon::now();
                $app_data['altered_by'] = $user_id;
                $app_details = array();
                $where_app['application_code'] = $application_code;



                if (recordExists($applications_table, $where_app)) {

                    $apps_tableData = getTableData($applications_table, $where_app);
                  
                    $app_details = getPreviousRecords($applications_table, $where_app);
                   
 
                    if ($app_details['success'] == false) {
                        return $app_details;
                    }

                    $app_details = $app_details['results'];
                    
                    unset($app_data['document_number']);

                    $res =  updateRecord($applications_table, $where_app,  $app_data, $user_id);

                   // $previous_data = $app_details[0];

                    unset($apps_tableData['id']);

                    $res = insertRecord('tra_documentmanager_archive', $apps_tableData, $user_id);
                    
                }
                   $res['application_code'] = $app_details[0]['application_code'];
                   $res['tracking_no'] = $app_details[0]['tracking_no'];
                   $res['document_number'] = $app_details[0]['document_number'];
                   $res['created_on'] = $app_details[0]['created_on'];
                   $ref_number = $app_details[0]['reference_no']; //$app_details->reference_no;

                if ($res['success']) {
                    initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
                } 
            } else {
                $zone_code = getSingleRecordColValue('par_zones', array('id' => $zone_id), 'zone_code');
                $apptype_code = getSingleRecordColValue('par_sub_modules', array('id' => $sub_module_id), 'code');
                // $apptype_categorycode = getSingleRecordColValue('par_permit_typecategories', array('id' => $import_typecategory_id ), 'code');


                $codes_array = array(
                    // 'section_code' => $section_code,
                    'zone_code' => $zone_code,
                    'apptype_code' => $apptype_code
                );


                $application_code = generateApplicationCode($sub_module_id, $applications_table);

                $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id');


                $ref_number = generateProductsRefNumber($ref_id, $codes_array, date('Y'), $process_id, $zone_id, $user_id);

                $view_id = generateApplicationViewID();
                //  'view_id'=>$view_id,
                $app_data['view_id'] = $view_id;
                $app_data['reference_no'] = $ref_number;
                $app_data['tracking_no'] = $ref_number;
                $app_data['application_code'] = $application_code;
                $app_data['reg_serial'] = $application_code;
                $app_data['created_by'] = \Auth::user()->id;
                $app_data['created_on'] = Carbon::now();

                $res = insertRecord($applications_table, $app_data, $user_id);
                insertRecord('tra_documents_useractions', $action, $user_id);
               
                 


                $active_application_id = $res['record_id'];

                //add to submissions table
                $submission_params = array(
                    'application_id' => $active_application_id,
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
                    'remarks' => 'Initial save of the application',
                    'date_received' => Carbon::now(),
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );

                $res = insertRecord('tra_submissions', $submission_params, $user_id);


                $res['active_application_id'] = $active_application_id;
                $res['application_code'] = $application_code;

                $res['ref_no'] = $ref_number;
                $res['tracking_no'] = $ref_number;
                $res['document_number'] = $doc_number;
                $res['created_on'] = Carbon::now();
                //dms function 
                $nodetracking = str_replace("/", "-", $ref_number);

                $node_details = array(
                    'name' => $nodetracking,
                    'nodeType' => 'cm:folder'
                );


                if ($res['success']) {
                initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);

        
                

                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'error, contact system admin'
                    );
                }
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

    // public function saveDocumentRecommendationComments(Request $req)
    // {
    //     try {
    //         $user_id = \Auth::user()->id;
    //         $post_data = $req->all();
    //         $table_name = 'tra_evaluation_recommendations';
    //         $id = $post_data['id'];
    //         $workflow_stage_id = $post_data['workflow_stage_id'];
    //         //unset unnecessary values
    //         unset($post_data['_token']);
    //         unset($post_data['table_name']);
    //         unset($post_data['model']);
    //         unset($post_data['id']);
    //         unset($post_data['unset_data']);
    //         $unsetData = $req->input('unset_data');
    //         if (isset($unsetData)) {
    //             $unsetData = explode(",", $unsetData);
    //             $post_data = unsetArrayData($post_data, $unsetData);
    //         }

    //         $table_data = $post_data;
    //         //add extra params
    //         $table_data['created_on'] = Carbon::now();
    //         $table_data['created_by'] = $user_id;
    //         $where = array(
    //             'id' => $id
    //         );
    //         $res = array();
    //         //check stage category
    //         if (!validateIsNumeric($workflow_stage_id)) {
    //             return array('success' => false, 'message' => "Faild to fetch stage details");
    //         }
    //         $stage_data = getTableData('wf_workflow_stages', array('id' => $workflow_stage_id));
    //         $stage_category_id = $stage_data->stage_category_id;
    //         $table_data['stage_category_id'] = $stage_category_id;
    //         if (isset($id) && $id != "") {
    //             if (recordExists($table_name, $where)) {
    //                 unset($table_data['created_on']);
    //                 unset($table_data['created_by']);
    //                 $table_data['dola'] = Carbon::now();
    //                 $table_data['altered_by'] = $user_id;

    //                 dd($table_data);
    //                 $res = updateRecord($table_name, $where, $table_data);
    //             }
    //         } else {
    //             dd($table_data);
    //             $res = insertRecord($table_name, $table_data);
    //         }
    //     } catch (\Exception $exception) {
    //         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    //     } catch (\Throwable $throwable) {
    //         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
    //     }
    //     return response()->json($res);
    // }

    public function saveDocumentRecommendationComments(Request $request)
    {
        try {
            $table_name = 'tra_evaluation_recommendations';
            $application_code = $request->input('application_code');

            return DB::transaction(function () use ($application_code, $table_name, $request) {
                $id = $request->input('id');

                $recommendation_id = $request->input('recommendation_id');
                $module_id = $request->input('module_id');
                $workflow_stage_id = $request->input('workflow_stage_id');
                $remarks = $request->input('remarks');

                // Ensure $permit_signatory is properly set
                $user_id = $this->user_id;

                $params = [
                    'application_code' => $application_code,
                    'recommendation_id' => $recommendation_id,
                    'module_id' => $module_id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'remarks' => $remarks,
                    'created_by' => $user_id,
                    'created_on' => Carbon::now()
                ];


                if (validateIsNumeric($id)) {
                    // Update existing record
                    $where = ['id' => $id];
                    $params['dola'] = Carbon::now();
                    $params['altered_by'] = $user_id;
                    updateRecord('tra_evaluation_recommendations', [], $where, $params, $user_id);
                } else {
                    // Insert new record
                    $res = insertRecord('tra_evaluation_recommendations', $params, $user_id);
                    $id = $res['record_id'];
                }

                // Update manager permits review
                $record = DB::table('tra_evaluation_recommendations')
                    ->where('application_code', $application_code)
                    ->first();

                if ($record) {
                    $prevrecomm_id = $record->recommendation_id;
                    $where = ['id' => $record->id, 'application_code' => $application_code];
                    $data = [
                        'recommendation_id' => $recommendation_id,
                    ];


                    $res = updateRecord('tra_evaluation_recommendations', $where, $data, $user_id);
                }
                // Prepare response
                $res = getSingleRecordColValue('par_recommendations', ['id' => $recommendation_id], 'name');


                $message = ($recommendation_id == 1)
                    ? "This is to notify you that the Application for the Document Recommendation has been Granted, Submit for Approval."
                    : "This is to notify you that the Application for the Document Recommendation has been rejected.";

                // Send mail notification
                // sendMailNotification($rec->name, $rec->email, "{$rec->reference_no} Permit Approval Recommendation: {$approval_decision}", $message);

                return response()->json(['success' => true, 'results' => $res ,'message' => 'Document Recommendation saved successfully']);
            });
        } catch (\Exception $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()]);
        } catch (\Throwable $throwable) {
            return response()->json(['success' => false, 'message' => $throwable->getMessage()]);
        }

        return \response()->json($res);
    }

    public function saveDocumentApplicationApprovalDetails(Request $request)
    {
        try {
            $table_name = $request->input('table_name');
            $application_id = $request->input('application_id');
            $application_code = $request->input('application_code');
            $sub_module_id = $request->input('sub_module_id');
           
            $user_id = $this->user_id;

            return DB::transaction(function () use ($application_code, $table_name, $request) {
                $id = $request->input('recommendation_id');
                $permit_release_remarks = $request->input('permit_release_remarks');

                $decision_id = $request->input('decision_id');
                $approval_date = $request->input('approval_date');
                $permit_signatory = $request->input('permit_signatory');
                $dg_signatory = $request->input('dg_signatory');
                $process_id = $request->input('process_id');

                // Ensure $permit_signatory is properly set
                $user_id = $this->user_id;
                if (empty($permit_signatory)) {
                    $permit_signatory = $user_id;
                }

                $params = [
                    'application_code' => $application_code,
                    'decision_id' => $decision_id,
                    'approval_date' => $approval_date,
                    'permit_signatory' => $permit_signatory,
                    'dg_signatory' => $dg_signatory,
                    'permit_release_remarks' => $permit_release_remarks,
                    'created_by' => $user_id,
                    'created_on' => Carbon::now()
                ];


                if (validateIsNumeric($id)) {
                    // Update existing record
                    $where = ['id' => $id];
                    $params['dola'] = Carbon::now();
                    $params['altered_by'] = $user_id;
                    updateRecord('tra_permitsrelease_recommendation', [], $where, $params, $user_id);
                } else {
                    // Insert new record
                    $res = insertRecord('tra_permitsrelease_recommendation', $params, $user_id);
                    $id = $res['record_id'];
                }

                // Update manager permits review
                $record = DB::table('tra_permitsrelease_recommendation')
                    ->where('application_code', $application_code)
                    ->first();

                if ($record) {
                    $prevdecision_id = $record->decision_id;
                    $where = ['id' => $record->id, 'application_code' => $application_code];
                    $data = [
                        'approval_date' => $approval_date,
                        'decision_id' => $decision_id,
                    ];


                    $res = updateRecord('tra_permitsrelease_recommendation', $where, $data, $user_id);
                }
                // Prepare response
                $approval_decision = getSingleRecordColValue('par_approval_decisions', ['id' => $decision_id], 'name');


                $message = ($decision_id == 1)
                    ? "This is to notify you that the Application for the Document Recommendation has been Granted, Submit for Approval."
                    : "This is to notify you that the Application for the Document Recommendation has been rejected.";

                // Send mail notification
                // sendMailNotification($rec->name, $rec->email, "{$rec->reference_no} Permit Approval Recommendation: {$approval_decision}", $message);

                return response()->json(['success' => true, 'results' => $approval_decision, 'message' => 'Document Recommendation saved successfully']);
            });
        } catch (\Exception $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()]);
        } catch (\Throwable $throwable) {
            return response()->json(['success' => false, 'message' => $throwable->getMessage()]);
        }

        return \response()->json($res);
    }

    public function prepapreDocumentApplicationScreening(Request $req)
    {
        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_documentmanager_application as t1')
                ->leftJoin('wf_workflow_stages as t2', 't1.workflow_stage_id', '=', 't2.id')
                ->leftJoin('tra_permitsrelease_recommendation as t3', 't1.application_code', '=', 't3.application_code')
                ->leftJoin('tra_evaluation_recommendations as t4', 't1.application_code', '=', 't4.application_code')
                ->leftJoin('par_recommendations as t5', 't4.recommendation_id', '=', 't5.id')
                ->leftJoin('par_approval_decisions as t6', 't3.decision_id', '=', 't6.id')
                ->leftJoin('par_navigator_folders as t7', 't1.navigator_folder_id', '=', 't7.id')
                ->select('t1.*', 't2.name as workflow_stage', 't6.name as approval', 't5.name as recommendation', 't7.name AS navigator_name')
                ->where('t1.application_code', $application_code);


            $results = $main_qry->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }



    public function prepapreDocumentApplicationReceiving(Request $req)
    {
        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_documentmanager_application as t1')
                ->leftJoin('wf_workflow_stages as t2', 't1.workflow_stage_id' ,'=', 't2.id')
                ->leftJoin('par_navigator_folders as t3', 't1.navigator_folder_id', '=', 't3.id')
                ->select('t1.*','t2.name as workflow_stage', 't2.stage_category_id','t3.name AS navigator_name')
                ->where('t1.application_code', $application_code);

            $results = $main_qry->first();


            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function prepapreNewQmsRecord(Request $req)
    {
        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_documentrecords_application as t1')
                ->leftJoin('wf_workflow_stages as t2', 't1.workflow_stage_id' ,'=', 't2.id')
                ->leftJoin('par_navigator_folders as t3', 't1.navigator_folder_id', '=', 't3.id')
                ->select('t1.*','t2.name as workflow_stage', 't2.stage_category_id','t3.name AS navigator_name')
                ->where('t1.application_code', $application_code);

            $results = $main_qry->first();


            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function onLoadApplicationDocumentsRequirements(Request $req)
    {
        try {
            $application_code = $req->input('application_code');
            $table_name = $req->input('table_name');
            $process_id = $req->input('process_id');
            $workflow_stage = $req->input('workflow_stage');
            $where = array(
                'process_id' => $process_id,
                'stage_id' => $workflow_stage
            );
            //get applicable document types
            $qry1 = DB::table('tra_proc_applicable_doctypes')
                ->select('doctype_id')
                ->where($where);
            $docTypes = $qry1->get();
            $docTypes = convertStdClassObjToArray($docTypes);
            $docTypes = convertAssArrayToSimpleArray($docTypes, 'doctype_id');
            //get applicable document requirements
            $qry = DB::table('tra_documentmanager_application as t1')
                ->leftJoin('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
                ->select('t1.id', 't1.name')
                ->join($table_name . ' as t3', function ($join) {
                    $join->on("t1.section_id", "=", "t3.section_id")
                        ->on("t1.sub_module_id", "=", "t3.sub_module_id");
                })
                ->where(array('t3.application_code' => $application_code)) //, 't1.document_type_id' => $document_type_id))
                ->whereIn('t1.document_type_id', $docTypes);

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }


    public function onLoadUnstructureApplicationDocumentsUploads(Request $req)
    {
        try {
            $reference_record_id = $req->input('reference_record_id');
            $table_name = $req->input('table_name');

            $document_type_id = $req->input('document_type_id');

            $qry = DB::table('tra_nonstructured_docdefination as t1')
                ->join('par_document_types as t2', 't1.document_type_id', '=', 't2.id')
                ->select(DB::raw("t4.remarks,
                t4.node_ref, t2.name as document_type, t4.id,t4.initial_file_name,t4.file_name, reference_record_id,
                t4.file_type,t4.uploaded_on,CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as uploaded_by,
                t1.document_type_id"))
                ->leftJoin($table_name . ' as t4', function ($join) use ($reference_record_id) {
                    $join->on("t1.document_type_id", "=", "t4.document_type_id")
                        ->where("t4.reference_record_id", "=", $reference_record_id);
                })
                ->leftJoin('users as t5', 't4.uploaded_by', '=', 't5.id');
            $qry->where('t1.document_type_id', $document_type_id);

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }


    public function onLoadApplicationDocumentsUploads(Request $req)
    {

        try {

            $results = $this->getApplicationDocumentsUploads($req);

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($results);
    }

    function getApplicationDocumentsUploads($req)
    {

        $application_code =  $req->input('application_code'); //20412100
        $workflow_stage = $req->input('workflow_stage');
        $doc_type_id = $req->input('document_type_id');
        $portal_uploads = $req->input('portal_uploads');
        $portal_status_id = $req->input('portal_status_id');
        $section_id = $req->input('section_id');
        $module_id = $req->input('module_id');
        $sub_module_id = $req->input('sub_module_id');
        $isvalidate_uploaded_by = $req->input('isvalidate_uploaded_by');
        $prodclass_category_id = $req->input('prodclass_category_id');
        $product_id = $req->input('product_id');
        $parent_id = $req->input('node');
        $process_id = $req->input('process_id');
        $uploaded_by = $this->user_id;
        $documentreg_serialno = $req->documentreg_serialno;

        if (!validateIsNumeric($isvalidate_uploaded_by)) {
            $isvalidate_uploaded_by = 0;
        }
        $results = collect();
        $where = array(
            'module_id' => $module_id,
            'sub_module_id' => $sub_module_id
        );


        if (!validateIsNumeric($process_id)) {
            $process_id = getSingleRecordColValue('wf_processes', $where, 'id');
        }

        //get applicable document types
        $qry1 = DB::table('tra_documentmanager_application')
            ->select('*');
        if (validateIsNumeric($process_id)) {
        }
        if (validateIsNumeric($workflow_stage)) {
            //  $qry1->where('stage_id', $workflow_stage);
        }

        if (validateIsNumeric($doc_type_id)) {
            $qry1->where('doctype_id', $doc_type_id);
        }
        // $procesS_id = 67;


        $qry1->where('process_id', $process_id);
        $docTypes = $qry1->get();

        $docTypes = convertStdClassObjToArray($docTypes);
        $docTypes = convertAssArrayToSimpleArray($docTypes, 'document_type_id');

        if (validateIsNumeric($doc_type_id)) {
            // $where['t1.document_type_id'] = $doc_type_id;
        }

        if (validateIsNumeric($application_code)) {
            $qry = DB::table('tra_application_uploadeddocuments as t1')
                ->Join('tra_application_documents as t2', 't1.application_code', 't2.application_code')
                // ->leftJoin('tra_documentmanager_application as t4', 't2.document_requirement_id', 't4.id')
                // ->leftJoin('par_document_types as t3', 't4.document_type_id', 't3.id')
                ->leftJoin('users as t5', 't2.uploaded_by', '=', 't5.id')
                ->select(DB::raw("t2.*, t1.*,t1.initial_file_name as file_name, t2.remarks,t1.file_type, t2.uploaded_on,CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as uploaded_by, case when (select count(id) from tra_application_uploadeddocuments q where q.application_code = t1.application_code) = 0 then false else true end leaf"))
                ->where('t1.application_code', $application_code);
            //->where('t4.is_enabled', 1);
            $results = $qry->get();
        } else {

            $doc_requirments = DB::table('tra_documentmanager_application as t1')
                ->where($where)
                ->whereIn('document_type_id', $docTypes)
                ->get();



            foreach ($doc_requirments as $doc_req) {
                $qry = DB::table('tra_application_documents as t1')
                    ->join('tra_documentmanager_application as t2', 't1.document_requirement_id', 't2.id')
                    ->join('par_document_types as t3', 't2.document_type_id', 't3.id')
                    ->Join('tra_application_uploadeddocuments as t4', function ($join) use ($application_code, $isvalidate_uploaded_by, $uploaded_by, $documentreg_serialno) {
                        if (validateIsNumeric($documentreg_serialno)) {
                            $join->on("t1.id", "=", "t4.application_document_id")
                                ->where("t4.documentreg_serialno", $documentreg_serialno)
                                ->whereRaw("CASE WHEN $isvalidate_uploaded_by =1  THEN t1.uploaded_by = $uploaded_by ELSE 1 = 1 END");
                        } else {
                            $join->on("t1.id", "=", "t4.application_document_id")
                                ->whereRaw("CASE WHEN $isvalidate_uploaded_by =1  THEN t1.uploaded_by = $uploaded_by ELSE 1 = 1 END");
                        }
                    })
                    ->leftJoin('users as t5', 't1.uploaded_by', '=', 't5.id')
                    ->select(DB::raw("t1.*,t4.remarks,t4.application_document_id,
                        t4.node_ref,t4.initial_file_name,t4.file_name,t4.initial_file_name as file_name, t2.module_id,t2.sub_module_id,t2.section_id,t4.file_type,t1.uploaded_on,CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as uploaded_by,t2.is_mandatory,
                         t2.document_type_id,t3.name as document_type, t2.name as document_requirement, t4.id,t4.is_directory, case when (select count(id) from tra_application_uploadeddocuments q where q.parent_id = t4.id) = 0 then false else true end leaf"))
                    ->where(['t1.application_code' => $application_code]);
                // ->where('t4.parent_id', 0);

                $res = $qry->get();

                // if($res->isEmpty()){
                //     $res = DB::table('tra_documentmanager_application as t1')
                //             ->join('par_document_types as t3', 't1.document_type_id', 't3.id')
                //             ->where('t1.id', $doc_req->id)
                //             ->selectRaw("t1.name as file_name, true as leaf,t1.is_mandatory, t1.name as document_requirement, t3.name as document_type")
                //             ->get();
                // }
                $results = $results->merge($res);
            }
        }




        return $results;
    }
    public function LoadAllApplicationUploadedDocuments(Request $req)
    {
        $application_code = $req->input('application_code');
        // $workflow_stage = $req->input('workflow_stage');
        $doc_type_id = $req->input('document_type_id');
        // $portal_uploads = $req->input('portal_uploads');
        // $portal_status_id = $req->input('portal_status_id');
        // $section_id = $req->input('section_id');
        $module_id = $req->input('module_id');
        // $sub_module_id = $req->input('sub_module_id');
        $isvalidate_uploaded_by = 0;
        $is_original_dossier = $req->is_original_dossier;
        // $prodclass_category_id = $req->input('prodclass_category_id');
        $parent_id = $req->input('node');
        $uploaded_by = $this->user_id;
        $reg_serial = 0;
        //$uploaded_by = 25;
        if (validateIsNumeric($is_original_dossier)) {
            //original
            $table_name = getTableName($module_id);
            $reg_serial = getSingleRecordColValue($table_name, ['application_code' => $application_code], 'reg_serial');
        }
        try {
            if (validateIsNumeric($parent_id)) {
                //get applicable document requirements
                $qry = DB::table('tra_application_uploadeddocuments as t1')
                    ->leftJoin('tra_application_documents as t2', 't1.application_document_id', 't2.id')
                    ->leftJoin('tra_documentmanager_application as t4', 't2.document_requirement_id', 't4.id')
                    ->leftJoin('par_document_types as t3', 't4.document_type_id', 't3.id')
                    ->leftJoin('users as t5', 't2.uploaded_by', '=', 't5.id')
                    ->select(DB::raw("t1.*,t1.initial_file_name as file_name, t2.remarks, t4.module_id, t4.sub_module_id,t4.section_id,t1.file_type, t2.uploaded_on, CONCAT(decryptval(t5.first_name," . getDecryptFunParams() . "),' ',decryptval(t5.last_name," . getDecryptFunParams() . ")) as uploaded_by,t4.is_mandatory, t2.document_type_id,t3.name as document_type, t4.name as document_requirement, case when (select count(id) from tra_application_uploadeddocuments q where q.parent_id = t1.id) = 0 then true else false end leaf"))
                    ->where('t1.parent_id', $parent_id);

                if (validateIsNumeric($is_original_dossier)) {
                    $qry->where('t3.is_assessment_doc', '!=', 1);
                }
            } else {
                $qry = DB::table('tra_application_documents as t1')
                    ->join('tra_documentmanager_application as t2', 't1.document_requirement_id', 't2.id')
                    ->join('par_document_types as t3', 't2.document_type_id', 't3.id')
                    ->leftJoin('tra_application_uploadeddocuments as t4', function ($join) use ($application_code, $isvalidate_uploaded_by, $uploaded_by) {

                        $join->on("t1.id", "=", "t4.application_document_id")
                            ->whereRaw("CASE WHEN $isvalidate_uploaded_by =1  THEN t1.uploaded_by = $uploaded_by ELSE 1 = 1 END");
                    })
                    ->leftJoin('users as t5', 't1.uploaded_by', '=', 't5.id')
                    ->select(DB::raw("t1.*, t1.id as application_document_id, t4.remarks,
                        t4.node_ref,t4.initial_file_name,t4.initial_file_name as file_name,t4.is_directory, t2.module_id,t2.sub_module_id,t2.section_id,t4.file_type,t1.uploaded_on,CONCAT(decryptval(t5.first_name," . getDecryptFunParams() . "),' ',decryptval(t5.last_name," . getDecryptFunParams() . ")) as uploaded_by,t2.is_mandatory,
                         t2.document_type_id,t3.name as document_type, t2.name as document_requirement, t4.id, case when (select count(id) from tra_application_uploadeddocuments q where q.parent_id = t4.id) = 0 then true else false end leaf"))
                    //->where('t1.application_code', $application_code)
                    ->where('t4.parent_id', 0);

                if (validateIsNumeric($reg_serial)) {
                    $qry->orwhere('t1.reg_serial', $reg_serial);
                } else {
                    $qry->where('t1.application_code', $application_code);
                }

                if (validateIsNumeric($is_original_dossier)) {
                    $qry->where('t3.is_assessment_doc', '!=', 1);
                }
                if (validateIsNumeric($doc_type_id)) {
                    $qry->where('t2.document_type_id', $doc_type_id);
                }
            }

            $results = $qry->get();

            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $results = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $results = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($results);
    }
    public function onLoadProductImagesUploads(Request $req)
    {
        $product_id = $req->input('product_id');
        $products_details = getTableData('tra_product_applications', array('product_id' => $product_id));
        $sub_module_id = $products_details->sub_module_id;
        $section_id = $products_details->section_id;
        $document_type_id = $req->input('document_type_id');

        try {
            $data = array();
            $upload_url =  Config('constants.dms.system_uploadurl'); //get applicable document requirements

            $qry = DB::table('par_document_types as t1')
                ->join('tra_documentmanager_application as t2', 't1.id', '=', 't2.document_type_id')
                ->select(DB::raw("t4.remarks, t1.id as document_type_id, t4.product_id, t2.id as document_requirement_id,
                 t1.name as document_type,t2.name as document_requirement, t4.id,t4.initial_file_name,t4.file_name,t4.document_folder,thumbnail_folder,
                t4.filetype,t4.uploaded_on,CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as uploaded_by"))
                ->leftJoin('tra_uploadedproduct_images as t4', function ($join) use ($product_id) {
                    $join->on("t2.id", "=", "t4.document_requirement_id")
                        ->where("t4.product_id", "=", $product_id);
                })
                ->leftJoin('users as t5', 't4.uploaded_by', '=', 't5.id')
                ->where(array('t1.id' => $document_type_id, 'sub_module_id' => $sub_module_id, 'section_id' => $section_id));

            $results = $qry->get();

            foreach ($results  as $res) {

                $data[] = array(
                    'remarks' => $res->remarks,
                    'document_type_id' => $res->document_type_id,
                    'product_id' => $res->product_id,
                    'document_type' => $res->document_type,
                    'document_requirement_id' => $res->document_requirement_id,
                    'document_requirement' => $res->document_requirement,
                    'id' => $res->id,
                    'initial_file_name' => $res->initial_file_name,
                    'file_name' => $res->file_name,
                    'filetype' => $res->filetype,
                    'uploaded_on' => $res->uploaded_on,
                    'uploaded_image' => $upload_url . '/' . $res->document_folder . '/' . $res->thumbnail_folder . '/' . $res->file_name,
                    'originaluploaded_image' => $upload_url . '/' . $res->document_folder . '/' . $res->file_name,
                    'uploaded_by' => $res->uploaded_by
                );
            }
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function onLoadOnlineProductImagesUploads(Request $req)
    {
        $product_id = $req->input('product_id');
        try {
            $data = array();
            $upload_url =  Config('constants.dms.system_uploadurl');
            $qry = DB::table('par_document_types as t1')
                ->join('tra_documentmanager_application as t2', 't1.id', '=', 't2.document_type_id')
                ->select(DB::raw("t4.remarks, t1.id as document_type_id, t4.product_id, t2.id as document_requirement_id,
                         t1.name as document_type,t2.name as document_requirement, t4.id,t4.initial_file_name,t4.file_name,t4.document_folder,thumbnail_folder,
                        t4.filetype,t4.uploaded_on,CONCAT_WS(' ',decrypt(t5.first_name),decrypt(t5.last_name)) as uploaded_by"))
                ->join('tra_uploadedproduct_images as t4', function ($join) use ($product_id) {
                    $join->on("t2.id", "=", "t4.document_requirement_id")
                        ->where("t4.portal_product_id", "=", $product_id);
                })
                ->leftJoin('users as t5', 't4.uploaded_by', '=', 't5.id');

            $results = $qry->get();
            foreach ($results  as $res) {

                $data[] = array(
                    'remarks' => $res->remarks,
                    'document_type_id' => $res->document_type_id,
                    'product_id' => $res->product_id,
                    'document_type' => $res->document_type,
                    'document_requirement_id' => $res->document_requirement_id,
                    'document_requirement' => $res->document_requirement,
                    'id' => $res->id,
                    'initial_file_name' => $res->initial_file_name,
                    'file_name' => $res->file_name,
                    'filetype' => $res->filetype,
                    'uploaded_on' => $res->uploaded_on,
                    'uploaded_image' => $upload_url . '/' . $res->document_folder . '/' . $res->thumbnail_folder . '/' . $res->file_name,
                    'originaluploaded_image' => $upload_url . '/' . $res->document_folder . '/' . $res->file_name,
                    'uploaded_by' => $res->uploaded_by
                );
            }
            $res = array(
                'success' => true,
                'results' => $data,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    function validateDocumentExtension($extension, $document_requirement_id)
    {
        //get all the file types under the said requiredment

        // $records = DB::table('tra_docupload_reqextensions as t1')
        //                                 ->join('par_document_extensionstypes as t2', 't1.document_extensionstype_id', 't2.id')
        //                                 ->where(array('documentupload_requirement_id'=>$document_requirement_id))
        //                              ->where('extension', 'ILIKE', $extension)
        //                                 ->first();
        $records = DB::table('par_document_extensionstypes')
            // ->join('par_document_extensionstypes as t2', 't1.document_extensionstype_id', 't2.id')
            // ->where('documentupload_requirement_id', $document_requirement_id)
            ->where('extension', 'LIKE', '%' . $extension . '%')
            ->first();

        if ($records) {
            $response = array('is_allowedextension' => true);
        } else {
            $record = DB::select("(SELECT GROUP_CONCAT(CONCAT(j.name,'.',j.extension) SEPARATOR ',') AS allowed_filetypes FROM tra_docupload_reqextensions t INNER JOIN par_document_extensionstypes j ON t.document_extensionstype_id = j.id WHERE t.documentupload_requirement_id = :document_requirement_id) LIMIT 1", ['document_requirement_id' => $document_requirement_id]);



            // $record = DB::select("(select string_agg(concat(j.name,'.',j.extension),',') as allowed_filetypes FROM tra_docupload_reqextensions t INNER JOIN par_document_extensionstypes j ON t.document_extensionstype_id = j.id WHERE t.documentupload_requirement_id = $document_requirement_id) limit 1");

            $allowed_filetypes = $record[0]->allowed_filetypes;

            if (isset($record[0]) &&  $allowed_filetypes != '') {
                $response = array('is_allowedextension' => true, 'allowed_filetypes' => $allowed_filetypes);
            } else {
                $response = array('is_allowedextension' => true, 'allowed_filetypes' => '');
            }
        }

        return $response;
    }
    public function uploadMultipleFiles(Request $req, $file = '')
    {
        try {
            //get file and application details
            $user_id = $this->user_id;
            $application_code = $req->application_code;
            $module_id = $req->module_id;
            $record_id = $req->id;
            $node_ref = $req->node_ref;
            $sub_module_id = $req->sub_module_id;
            $document_type_id = $req->document_type_id;
            if (!validateIsNumeric($document_type_id)) {
                $document_type_id = $req->docType_id;
            }
            $document_requirement_id = $req->document_requirement_id;
            $assessment_start_date = $req->assessment_start_date;
            $assessment_end_date = $req->assessment_end_date;
            $assessment_by = $req->assessment_by;
            $query_ref_id = $req->query_ref_id;
            $view_module_id = $req->view_module_id;
            $zipFolderName = '';
            $parent_id = 0;
            if ($file == '') {
                $file = $req->file('uploaded_doc');
            }

            DB::beginTransaction();
            $app_rootnode = getApplicationRootNode($application_code);
            $app_rootnode = getDocumentTypeRootNode($app_rootnode->dms_node_id, $application_code, $document_type_id, $user_id);
            
            $table_name = 'tra_application_uploadeddocuments';
            $mis_application_id = 0;
            $reg_serial = 0;
            //for products add product id
            if (validateIsNumeric($module_id)) {
                $app_table = getTableName($module_id);
                $reg_serial = getSingleRecordColValue($app_table, ['application_code' => $application_code], 'reg_serial');
            } else if (validateIsNumeric($view_module_id)) {
                $app_table = getTableName($view_module_id);
                $reg_serial = getSingleRecordColValue($app_table, ['application_code' => $application_code], 'reg_serial');
            }
            if ($app_rootnode) {
                if ($file) {

                    $origFileName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $docextension_check = $this->validateDocumentExtension($extension, $document_requirement_id);
                    $is_allowedextension = $docextension_check['is_allowedextension'];

                    if (!$is_allowedextension) {
                        $allowed_filetypes = $docextension_check['allowed_filetypes'];
                        $res = array('success' => false, 'message' => 'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions:.' . $allowed_filetypes);
                    }

                    //save application document details
                    $doc_app_details = array(
                        'application_code' => $application_code,
                        'document_requirement_id' => $document_requirement_id,
                        'document_type_id' => $document_type_id,
                        'uploaded_on' => Carbon::now(),
                        'uploaded_by' => $user_id,
                        'query_ref_id' => $query_ref_id,
                        'created_on' => Carbon::now(),
                        'created_by' => $user_id,
                        'assessment_start_date' => $assessment_start_date,
                        'assessment_end_date' => $assessment_end_date,
                        'assessment_by' => $assessment_by,
                        'reg_serial' => $reg_serial
                    );
                    $where = array('application_code' => $application_code);
                    $table_name = 'tra_application_documents';

                    if (recordExists('tra_application_uploadeddocuments', $where)) {
                        //dump revision
                        $prev_file_data = DB::table('tra_application_uploadeddocuments')->where($where)->first();
                        //delete the old copy
                        deleteRecord('tra_application_uploadeddocuments', $where);
                        //insert revision
                        $pre_file = (array)$prev_file_data;
                        //unset uneeded copy data
                        $original_file_id = $pre_file['id'];
                        unset($pre_file['id']);
                        //count total versions
                        $count = DB::table('tra_documents_prevversions')->where('original_file_id', $original_file_id)->count();
                        $version = $count + 1;
                        $pre_file['original_file_id'] = $original_file_id;
                        $pre_file['version'] = $version;
                        $pre_file['application_code'] = $application_code;

                        //set parent id for update
                        $parent_id = $pre_file['parent_id'];

                        $rr = insertRecord('tra_documents_prevversions', $pre_file);
                        $where = array('id' => $prev_file_data->application_document_id);
                        $res = updateRecord($table_name, $where, $doc_app_details);
                    } else {

                        $res = insertRecord($table_name, $doc_app_details);
                    }

                    if (isset($res['success']) && $res['success'] == true) {
                        $application_document_id = $res['record_id'];
                    } else {
                        return response($res, 409);
                        exit();
                    }

                    //confirm file type
                    if ($extension == 'zip') {
                        //create a deafult folder name
                        $zipFolderName = str_replace(' ', '', Carbon::now()->format('Y-m-d H-i-s')) . str_random(3);
                        //loop folder zip
                        $res = $this->uploadZipDocuments($file, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $zipFolderName);
                    } else {
                        //upload doc
                        $res = $this->uploadDocument($file, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $application_code);
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'No document attachement for upload'
                    );
                }
            } else {
                $res = array(
                    'success' => false,
                    'message' => 'DMS Document Type Node not configured, contact the system Admin'
                );
            }
            //delete zip and chunk directory
            if ($zipFolderName != '') {
                Storage::deleteDirectory('' . $zipFolderName);
            }

            if ($res['success']) {
                DB::commit();
            } else {
                DB::rollback();
            }
            //if folder/zip loop
            //save document and add doc table entry
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function uploadZipDocuments($file, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $default_folder)
    {
        try {
            $extension = $file->getClientOriginalExtension();
            $path = $file->getPathname();
            $zipFolderName = str_replace(' ', '', Carbon::now()->format('Y-m-d H-i-s') . '_zip') . str_random(3);
            $fileName = $file->getClientOriginalName();
            $uncompressedpath = Storage::disk('local')->path('' . $default_folder . '/' . $zipFolderName);
            $res = array('success' => true, 'message' => 'default response');
            //public_path() . '/'.$zipFolderName;

            if ($extension == 'zip') {
                $zip = new Zip();
                $zip = $zip->open($path);
                $zip->extract($uncompressedpath);
                //delete zip
                $zip->close();
                //delete parent
                unlink($file->getPathname());
                //----------------------------------------
                $res = $this->iterateDirectories($uncompressedpath, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $default_folder);
            } else {
                $res = array('message' => 'Unsurported compression format please use zip archives', 'success' => false);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }
    public function iterateDirectories($uncompressedpath, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $default_folder)
    {
        $user_id = $this->user_id;
        try {
            $result = scandir($uncompressedpath);
            $files = array_diff($result, array('.', '..'));
            if (count($files) > 0) {
                foreach ($files as $singlefile) {
                    if (is_file("$uncompressedpath/$singlefile")) {
                        $uploadedFile = $this->pathToUploadedFile("$uncompressedpath/$singlefile");
                        //check if its zip
                        $extension = $uploadedFile->getClientOriginalExtension();
                        if ($extension == 'zip') {
                            //create a directory and get parent
                            $folder_rec = array(
                                'parent_id' => $parent_id,
                                'application_document_id' => $application_document_id,
                                'file_name' => $singlefile,
                                'filesize' => 0,
                                'initial_file_name' => $singlefile,
                                'application_code' => $application_code,
                                'file_type' => 'Directory',
                                'is_directory' => 1,
                                'document_requirement_id' => $document_requirement_id,
                                'node_ref' => '',
                                'created_on' => Carbon::now(),
                                'created_by' => $user_id,
                                'dola' => Carbon::now(),
                                'altered_by' => $user_id
                            );
                            $results = insertRecord('tra_application_uploadeddocuments', $folder_rec);
                            if (!isset($results['record_id'])) {
                                DB::rollback();
                                //delete directory
                                Storage::deleteDirectory('' . $default_folder);
                                return $results;
                                exit();
                            }
                            $res = $this->uploadZipDocuments($uploadedFile, $results['record_id'], $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $default_folder);
                        } else {
                            $res = $this->uploadDocument($uploadedFile, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref);
                            //if upload is false terminate
                            if (!$res['success']) {
                                //delete directory
                                Storage::deleteDirectory('' . $default_folder);
                                //return failure
                                echo json_encode($res);
                                exit();
                            }
                        }
                    } else if (is_dir("$uncompressedpath/$singlefile")) {
                        //insert entry to uploaded document as a folder
                        $folder_rec = array(
                            'parent_id' => $parent_id,
                            'application_document_id' => $application_document_id,
                            'file_name' => $singlefile,
                            'filesize' => 0,
                            'initial_file_name' => $singlefile,
                            'application_code' => $application_code,
                            'file_type' => 'Directory',
                            'is_directory' => 1,
                            'document_requirement_id' => $document_requirement_id,
                            'node_ref' => '',
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id,
                            'dola' => Carbon::now(),
                            'altered_by' => $user_id
                        );
                        $results = insertRecord('tra_application_uploadeddocuments', $folder_rec);
                        if (!isset($results['record_id'])) {
                            DB::rollback();
                            //delete directory
                            Storage::deleteDirectory('' . $default_folder);
                            //return
                            echo json_encode($results);
                            exit();
                        }
                        // Recursively call the function if directories found
                        $res = $this->iterateDirectories("$uncompressedpath/$singlefile", $results['record_id'], $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $default_folder);
                    }
                }
                //delete folder
                // rmdir($uncompressedpath);

            } else {
                $res = array('success' => true, 'message' => 'Successfully uploaded but some folders were empty');
            }

            // if($res['success']){
            //     DB::commit();
            // }else{
            //     DB::rollback();
            //     return response($res, 409);
            //     exit();

            // }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }
    //get file object from path
    public function pathToUploadedFile($path, $test = true)
    {
        $filesystem = new Filesystem;

        $name = $filesystem->name($path);
        $extension = $filesystem->extension($path);
        $originalName = $name . '.' . $extension;
        $mimeType = $filesystem->mimeType($path);
        $error = null;

        return new UploadedFile($path, $originalName, $mimeType, $error, $test);
    }

    public function uploadDocument($file, $parent_id, $application_document_id, $document_requirement_id, $app_rootnode, $node_ref, $application_code)
    {
        $origFileName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();
        $file_path = $file->getPathName();
        $document_rootupload =  Config('constants.dms.doc_rootupload');
        $user_id = $this->user_id;
        $destination = getcwd() . $document_rootupload;
        $savedName = str_random(3) . time() . '.' . $extension;

        //confirm extension if allowed dms_node_id
        $docextension_check = $this->validateDocumentExtension($extension, $document_requirement_id);
        $is_allowedextension = $docextension_check['is_allowedextension'];
        if (!$is_allowedextension) {
            $allowed_filetypes = $docextension_check['allowed_filetypes'];
            $res = array('success' => false, 'message' => 'Uploaded file should only contain the following allowed file formats :.' . $allowed_filetypes);
            DB::rollback();
        } else {
            //$file->move($destination, $savedName);
            $document_path = $destination . $savedName;

            //check if tje dpcument type has been mapped and not autoCreate the folder
            $document_requirement = getParameterItem('par_document_types', $document_requirement_id);
            //get the application root folder

            $uploadfile_name = $document_requirement . str_random(5) . '.' . $extension;
            $destination_node = $app_rootnode->node_ref;
            //upload to dms
            $response = dmsUploadNodeDocument($destination_node, $file_path, $uploadfile_name, $node_ref);

            //check if upload was successfull
            if (!isset($response['nodeRef'])) {
                DB::rollback();
                return array('success' => false, 'message' => $response);
            }
            //log document details
            $node_ref = $response['nodeRef'];
            $document_data = array(
                'parent_id' => $parent_id,
                'application_document_id' => $application_document_id,
                'document_requirement_id' => $document_requirement_id,
                'file_name' => $uploadfile_name,
                'filesize' => $fileSize,
                'initial_file_name' => $origFileName,
                'application_code' => $application_code,
                'file_type' => $extension,
                'is_directory' => 2,
                'node_ref' => $node_ref,
                'created_on' => Carbon::now(),
                'created_by' => $user_id,
                'dola' => Carbon::now(),
                'altered_by' => $user_id
            );
            $res = insertRecord('tra_application_uploadeddocuments', $document_data, $user_id);
        }

        return $res;
    }

    public function uploadApplicationDocumentFile(Request $req, $file = '')
    {
        try {
            $user_id = $this->user_id;
            //get the documetn definations
            $application_code = $req->application_code;
            $module_id = $req->module_id;
            $record_id = $req->id;
            $node_ref = $req->node_ref;
            $sub_module_id = $req->sub_module_id;
            $document_type_id = $req->document_type_id;
            $document_requirement_id = $req->document_requirement_id;
            $assessment_start_date = $req->assessment_start_date;
            $assessment_end_date = $req->assessment_end_date;
            $assessment_by = $req->assessment_by;
            $query_ref_id = $req->query_ref_id;
            $view_module_id = $req->view_module_id;

            if ($file == '') {
                $file = $req->file('uploaded_doc');
            }


            $app_rootnode = getApplicationRootNode($application_code);
            $app_rootnode = getDocumentTypeRootNode($app_rootnode->dms_node_id, $application_code, $document_type_id, $user_id);
            $table_name = 'tra_application_uploadeddocuments';
            $mis_application_id = 0;
            $reg_serial = 0;
            //for products add product id
            if (validateIsNumeric($module_id)) {
                $app_table = getTableName($module_id);
                $reg_serial = getSingleRecordColValue($app_table, ['application_code' => $application_code], 'reg_serial');
            } else if (validateIsNumeric($view_module_id)) {
                $app_table = getTableName($view_module_id);
                $reg_serial = getSingleRecordColValue($app_table, ['application_code' => $application_code], 'reg_serial');
            }
            if ($app_rootnode) {
                if ($file) {
                    $origFileName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $docextension_check = $this->validateDocumentExtension($extension, $document_requirement_id);
                    $is_allowedextension = $docextension_check['is_allowedextension'];

                    if (!$is_allowedextension) {
                        $allowed_filetypes = $docextension_check['allowed_filetypes'];
                        $res = array('success' => false, 'message' => 'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions:.' . $allowed_filetypes);
                    } else {

                        $fileSize = $file->getSize();
                        $file_path = $file->getPathName();
                        $document_rootupload =  Config('constants.dms.doc_rootupload');

                        $destination = getcwd() . $document_rootupload;
                        $savedName = str_random(3) . time() . '.' . $extension;

                        //$file->move($destination, $savedName);
                        $document_path = $destination . $savedName;
                        //check if tje dpcument type has been mapped and not autoCreate the folder
                        $document_requirement = getParameterItem('tra_documentmanager_application', $document_requirement_id);

                        //get the application root folder

                        $uploadfile_name = $document_requirement . str_random(5) . '.' . $extension;
                        $destination_node = $app_rootnode->node_ref;

                        if (validateIsNumeric($record_id)) {

                            $response = dmsUploadNodeDocument($destination_node, $file_path, $uploadfile_name, $node_ref);

                            $node_ref = $response['nodeRef'];
                            $document_data = array(
                                'application_code' => $application_code,
                                'document_requirement_id' => $document_requirement_id,
                                'uploaded_on' => Carbon::now(),
                                'uploaded_by' => $user_id,
                                'file_name' => $uploadfile_name,
                                'initial_file_name' => $origFileName,
                                'file_type' => $extension,
                                'node_ref' => $node_ref,
                                'query_ref_id' => $query_ref_id,
                                'dola' => Carbon::now(),
                                'altered_by' => $user_id,
                                'assessment_start_date' => $assessment_start_date,
                                'assessment_end_date' => $assessment_end_date,
                                'assessment_by' => $assessment_by,
                                'reg_serial' => $reg_serial
                            );

                            $where = array('id' => $record_id);

                            if (recordExists($table_name, $where)) {

                                $previous_data = getPreviousRecords('tra_application_uploadeddocuments', $where);
                                $previous_data = $previous_data['results'];
                                $res = updateRecord('tra_application_uploadeddocuments', $where, $document_data, $user_id);

                                $previous_data = $previous_data[0];
                                $document_upload_id = $previous_data['id'];
                                unset($previous_data['id']);
                                $previous_data['document_upload_id'] = $document_upload_id;
                                $re = insertRecord('tra_documents_prevversions', $previous_data, $user_id);
                            }
                        } else {
                            $response = dmsUploadNodeDocument($destination_node, $file_path, $uploadfile_name, '');

                            $node_ref = $response['nodeRef'];
                            $document_data = array(
                                'application_code' => $application_code,
                                'document_requirement_id' => $document_requirement_id,
                                'document_type_id' => $document_type_id,
                                'uploaded_on' => Carbon::now(),
                                'uploaded_by' => $user_id,
                                'file_name' => $uploadfile_name,
                                'initial_file_name' => $origFileName,
                                'file_type' => $extension,
                                'node_ref' => $node_ref,
                                'query_ref_id' => $query_ref_id,
                                'created_on' => Carbon::now(),
                                'created_by' => $user_id,
                                'assessment_start_date' => $assessment_start_date,
                                'assessment_end_date' => $assessment_end_date,
                                'assessment_by' => $assessment_by,
                                'reg_serial' => $reg_serial
                            );
                            $res = insertRecord('tra_application_uploadeddocuments', $document_data, $user_id);

                            if ($res['success']) {

                                $res['message'] = 'Document Uploaded Successfully';
                            } else {
                                $res['message'] = 'Document Upload failed, try again or contact the system admin';
                            }
                        }
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'No document attachement for upload'
                    );
                }
            } else {
                $res = array(
                    'success' => false,
                    'message' => 'DMS Document Type Node not configured, contact the system Admin'
                );
            }
            unlink($file->getPathname());
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        // return response()->json($res, 202,
        //     [
        //         'Content-Type' => 'application/json',
        //         'Charset' => 'utf-8'
        //     ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        // return $res;
        // $res = array('success'=>true,'message'=>'all is well');
        return response()->json($res);
    }



    public function uploadunstructureddocumentuploads(Request $req)
    {
        try {

            $user_id = $this->user_id;
            //get the documetn definations
            $reference_record_id = $req->reference_record_id;
            $document_type_id = $req->document_type_id;
            $record_id = $req->id;
            $node_ref = $req->node_ref;
            $table_name = $req->table_name;
            $reference_table_name = $req->reference_table_name;

            $file = $req->file('uploaded_doc');
            //tra_nonstructured_docdefination
            $rootnode_ref = getSingleRecordColValue('tra_nonstructured_docdefination', array('document_type_id' => $document_type_id), 'node_ref');

            $app_rootnode = getNonStructuredDocApplicationRootNode($rootnode_ref, $reference_record_id, $reference_table_name, $document_type_id, $user_id);

            if ($app_rootnode) {

                if ($req->hasFile('uploaded_doc')) {
                    $origFileName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $fileSize = $file->getSize();
                    $document_rootupload =  Config('constants.dms.doc_rootupload');;

                    $destination = getcwd() . $document_rootupload;
                    $savedName = str_random(3) . time() . '.' . $extension;

                    $file->move($destination, $savedName);

                    $document_path = $destination . $savedName;
                    //check if tje dpcument type has been mapped and not autoCreate the folder
                    $document_type = getParameterItem('par_document_types', $document_type_id, 'pgsql');
                    $uploadfile_name = $document_type . str_random(5) . '.' . $extension;
                    $destination_node = $app_rootnode->node_ref;
                    if (validateIsNumeric($record_id)) {

                        $response = dmsUploadNodeDocument($destination_node, $document_path, $uploadfile_name, $node_ref);

                        $node_ref = $response['nodeRef'];

                        $document_data = array(
                            'reference_record_id' => $reference_record_id,
                            'document_type_id' => $document_type_id,
                            'uploaded_on' => Carbon::now(),
                            'uploaded_by' => $user_id,
                            'file_name' => $uploadfile_name,
                            'initial_file_name' => $origFileName,
                            'file_type' => $extension,
                            'node_ref' => $node_ref,
                            'dola' => Carbon::now(),
                            'altered_by' => $user_id
                        );

                        $where = array('id' => $record_id);

                        if (recordExists($table_name, $where)) {

                            $previous_data = getPreviousRecords($table_name, $where);
                            $previous_data = $previous_data['results'];
                            $res = updateRecord($table_name, $where, $document_data, $user_id);

                            $previous_data = $previous_data[0];
                            $document_upload_id = $previous_data['id'];
                        }
                    } else {

                        $response = dmsUploadNodeDocument($destination_node, $document_path, $uploadfile_name, '');
                        $node_ref = $response['nodeRef'];
                        $document_data = array(
                            'reference_record_id' => $reference_record_id,
                            'document_type_id' => $document_type_id,
                            'uploaded_on' => Carbon::now(),
                            'uploaded_by' => $user_id,
                            'file_name' => $uploadfile_name,
                            'initial_file_name' => $origFileName,
                            'file_type' => $extension,
                            'node_ref' => $node_ref,
                            'dola' => Carbon::now(),
                            'altered_by' => $user_id,
                        );

                        $res = insertRecord($table_name, $document_data, $user_id);
                        if ($res['success']) {

                            $res['message'] = 'Document Uploaded Successfully';
                        } else {
                            $res['message'] = 'Document Upload failed, try again or contact the system admin';
                        }
                    }
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'No document attachement for upload'
                    );
                }
            } else {
                $res = array(
                    'success' => false,
                    'message' => 'DMS Document Type Node not configured, contact the system Admin'
                );
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);
    }
    public function uploadProductImages(Request $req)
    {
        try {
            $user_id = $this->user_id;
            //get the documetn definations
            $application_code = $req->application_code;
            $module_id = $req->module_id;
            $record_id = $req->id;
            $node_ref = $req->node_ref;
            $sub_module_id = $req->sub_module_id;
            $document_type_id = $req->document_type_id;
            $product_id = $req->product_id;
            $file = $req->file('uploaded_doc');

            $table_name = 'tra_uploadedproduct_images';

            if ($req->hasFile('uploaded_doc')) {
                $origFileName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $fileSize = $file->getSize();
                $file = $req->file('uploaded_doc');

                $origFileName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $fileSize = $file->getSize();
                //$folder = '\resources\uploads';
                $document_root = $_SERVER['DOCUMENT_ROOT'];

                $upload_directory =     $document_root . '/' . Config('constants.dms.system_uploaddirectory');

                $folder = 'product_images';
                $thumbnail_folder = 'thumbnails';

                $destination = $upload_directory . $folder;

                $savedName = str_random(5) . time() . '.' . $extension;

                if ($file->move($destination, $savedName)) {
                    $document_root = $_SERVER['DOCUMENT_ROOT'];

                    //more the thumb nail file
                    $thumb_dest = $upload_directory . $folder . '/' . $thumbnail_folder . '/';

                    $img = Image::make($destination . '/' . $savedName);

                    // resize image to fixed size
                    $img->resize(150, 150);
                    $img->save($thumb_dest . $savedName);

                    $params['initial_file_name'] = $origFileName;
                    $params['file_name'] = $savedName;
                    $params['file_size'] = formatBytes($fileSize);
                    $params['filetype'] = $extension;
                    $params['thumbnail_folder'] = $thumbnail_folder;
                    $params['document_folder'] = $folder;
                    $params['product_id'] = $product_id;
                    $params['created_on'] = Carbon::now();
                    $params['created_by'] = $user_id;

                    $params['uploaded_on'] = Carbon::now();
                    $params['uploaded_by'] = $user_id;

                    $params['document_type_id'] = $document_type_id;
                    $res = insertRecord($table_name, $params, $user_id);
                } else {
                    $res = array(
                        'success' => false,
                        'message' => 'Product Image Upload Failed'
                    );
                }
            } else {
                $res = array(
                    'success' => false,

                    'message' => 'No document attachement for upload'
                );
            }
        } catch (\Exception $e) {
            $res = array(
                'success' => false,  'message1' =>  $thumb_dest,
                'message' => $e->getMessage()
            );
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);
    }

    public function validateDocumentAppReceivingDetails(Request $req)
    {
        try {
            $application_code = $req->application_code;
            $workflow_stage_id = $req->workflow_stage_id;
            $application_feetype_id = 1;
            $record = DB::table('tra_documentmanager_application')
                ->where('application_code', $application_code)
                ->first();
            if ($record) {
                //  $importexport_permittype_id = $record->importexport_permittype_id;

                //validate the documetns submissions
                $where = array(
                    'application_code' => $application_code,
                    'workflow_stage_id' => $workflow_stage_id,
                );
                // validateDocumentUploadSubmission($where);
                $res = array('success' => true, 'message' => 'validated');
            }
            //check for the invoice generation


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

// public function getApplicationDocumentDownloadurl(Request $req)
// {
//     try {
//         set_time_limit(0);
//         ini_set('memory_limit', '-1');

//         $user_id = $this->user_id;
//         $application_code = $req->application_code;
//         $uploadeddocuments_id = $req->uploadeddocuments_id;
//         $node_ref = $req->node_ref;

//         $data = array(
//             'user_id' => $user_id,
//             'application_code' => $application_code,
//             'uploadeddocuments_id' => $uploadeddocuments_id,
//             'node_ref' => $node_ref,
//             'accessed_on' => Carbon::now()
//         );

//         if (empty($node_ref)) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Document Not Uploaded'
//             ]);
//         } else {
//             if (validateIsNumeric($uploadeddocuments_id)) {
//                 $record = DB::table('tra_application_uploadeddocuments')
//                             ->select('*')
//                             ->where('id', $uploadeddocuments_id)
//                             ->first();
//             } else {
//                 $record = DB::table('tra_application_uploadeddocuments')
//                             ->select('*')
//                             ->where('node_ref', $node_ref)
//                             ->first();
//                 if (!$record) {
//                     $record = DB::table('tc_meeting_uploaddocuments')
//                                 ->select('*')
//                                 ->where('node_ref', $node_ref)
//                                 ->first();
//                 }
//             }

//             if ($record) {
//                 $file_type = $record->file_type;
//                 $document_number = getSingleRecordColValue('tra_permitsrelease_recommendation', ['application_code' => $application_code], 'document_number');
//                 $initial_file_name = $record->initial_file_name;

//                 // Save the document access
//                 $data['created_on'] = Carbon::now();
//                 $data['created_by'] = $user_id;
//                 insertRecord('tra_uploadeddocuments_useraccess', $data, $user_id);

//                 $document_versionid = $req->document_versionid;
//                 $url = downloadDocumentUrl($node_ref, $document_versionid);

//                 // Log the URL for debugging
//                 \Log::info('Download URL: ' . $url);

//                 $public_dir = public_path() . '/resources/uploads';
//                 $public_dir = str_replace('\\', '/', $public_dir);

//                 if (!is_dir($public_dir)) {
//                     mkdir($public_dir, 0755, true);
//                 }

//                 $filetopath = $public_dir . '/' . $initial_file_name;

//                 $context = stream_context_create(['http' => ['timeout' => 3600]]);
//                 $file = fopen($url, 'r', false, $context);
//                 if ($file === false) {
//                     throw new \Exception("Unable to open remote file: $url");
//                 }

//                 $stream = fopen($filetopath, 'w');
//                 while (!feof($file)) {
//                     $chunk = fread($file, 8192);
//                     if ($chunk === false) {
//                         throw new \Exception("Error reading from remote file: $url");
//                     }
//                     fwrite($stream, $chunk);
//                 }

//                 fclose($file);
//                 fclose($stream);

//                 // Verify file integrity
//                 if (filesize($filetopath) <= 0) {
//                     throw new \Exception("Downloaded file is empty or corrupted: $filetopath");
//                 }

//                 if ($file_type == "pdf") {
//                     $attachment_path = $this->addPDFDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number);
//                 } else if ($file_type == "docx") {
//                     $attachment_path = $this->addWordDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number);
//                 }

//                 unlink($filetopath);

//                 if (file_exists($attachment_path)) {
//                     $file = file_get_contents($attachment_path);
//                     unlink($attachment_path);
//                     return response()->json([
//                         'success' => true,
//                         'message' => 'all is well',
//                         'filename' => $initial_file_name,
//                         'dms_url' => $attachment_path,
//                         'document_url' => "data:application/octet-stream;base64," . base64_encode($file)
//                     ]);
//                 }
//             }
//         }
//     } catch (\Exception $exception) {
//         \Log::error('Error: ' . $exception->getMessage());
//         $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
//     } catch (\Throwable $throwable) {
//         \Log::error('Error: ' . $throwable->getMessage());
//         $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
//     }

//     return response()->json($res);
// }

public function getApplicationDocumentDownloadurl(Request $req)
    {
        try {
            $user_id = $this->user_id;
            $application_code = $req->application_code;
            $uploadeddocuments_id = $req->uploadeddocuments_id;
            $node_ref = $req->node_ref;
            $data = array(
                'user_id' => $user_id,
                'application_code' => $application_code,
                'uploadeddocuments_id' => $uploadeddocuments_id,
                'node_ref' => $node_ref,
                'accessed_on' => Carbon::now()
            );

            if ($node_ref == '') {

                $res = array(
                    'success' => false,
                    'message' => 'Document Not Uploaded'
                );
            } else {
                if(validateIsNumeric($uploadeddocuments_id)){
                    $record = DB::table('tra_application_uploadeddocuments')
                                ->select('*')
                                ->where('id',$uploadeddocuments_id)
                                ->first();
                }
                else{
                    $record = DB::table('tra_application_uploadeddocuments')
                                ->select('*')
                                ->where('node_ref',$node_ref)
                                ->first();
                    if(!$record){
                        //tc_meeting_uploaddocuments
                            $record = DB::table('tc_meeting_uploaddocuments')
                                ->select('*')
                                ->where('node_ref',$node_ref)
                                ->first();
                    }
                }
                
                $file_type = $record->file_type;


                if($record){
      
                $document_number = getSingleRecordColValue('tra_documentmanager_application', ['application_code' => $application_code], 'document_number');

                $initial_file_name = $record->initial_file_name;
                //save the documetn access
                $data['created_on'] = Carbon::now();
                $data['created_by'] = $user_id;

                $res = insertRecord('tra_uploadeddocuments_useraccess', $data, $user_id);

                $document_versionid = $req->document_versionid;
                $url = downloadDocumentUrl($node_ref, $document_versionid);
        

                // $res = array(
                //     'success' => true,
                //     'document_url' => $url
                // );

                   set_time_limit(0); 

                    $public_dir=public_path().'/resources/uploads';
                    $public_dir = str_replace('\\', '/', $public_dir);  

                    if (!is_dir($public_dir)) {
                        mkdir($public_dir, 0755, true);
                     }              
                    
                    $file = file_get_contents($url);
                    $filetopath=$public_dir.'/'.$initial_file_name;
                    file_put_contents($filetopath, $file);

                    //dd($destination);
                    
                    // $res = array(
                    //     'success' => true,
                    //     'document_url' => $url
                    // );
                    // if ($file) {
                    //     if($file_type == "pdf"){
                    //        $attachment_path = $this->addPDFDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number); 
                    //     }else if($file_type == "docx"){
                    //         $attachment_path = $this->addWordDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number);

                    //     }else if($file_type == "xlsx"){
                    //         $attachment_path = $this->addExcelDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number);

                    //     }
                        
                    //     unlink($filetopath); 
                    //    // dd($attachment_path);
                    // }else{
                    //     $attachment_path = $filetopath;
                    // }
                    
                    // ini_set('memory_limit', '-1');
                    // if(file_exists($attachment_path)){
                    //    $file = file_get_contents($attachment_path);
                    //      //attachment
                    //     unlink($attachment_path); 
                    //      $res = array(
                    //         'success' => true,
                    //         'message' => 'all is well',
                    //         'filename' => $initial_file_name,
                    //         'dms_url'=>$attachment_path,
                    //         'document_url' => "data:application/octet-stream;base64,".base64_encode($file)
                    //     );
                    //     return json_encode($res);
                    // }
                    
                   
                    $res = array(
                            'success' => true,
                            'message' => 'all is well',
                            'filename' => $initial_file_name,
                            'document_url' => $url
                        );
                }
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }




    public function getApplicationDocumentPreviousVersions(Request $req)
    {
        try {
            $table_name = $req->table_name;

            $original_file_id = $req->document_id;
            $document_requirement_id = getSingleRecordColValue('tra_application_uploadeddocuments', ['id' => $original_file_id], 'application_code');
            $application_document_id = getSingleRecordColValue('tra_application_uploadeddocuments', ['id' => $original_file_id], 'application_document_id');
            $application_code = getSingleRecordColValue('tra_application_documents', ['id' => $application_document_id], 'application_code');
            $doc_data = array(); //original_file_id
            $i = 1;

            // $doc_data = DB::table('tra_documents_prevversions as t1')
            //         ->leftJoin('tra_documentmanager_application as t2', 't1.document_requirement_id', 't2.id')
            //          ->leftJoin('par_document_types as t3', 't2.document_type_id', '=', 't3.id')
            //          ->leftJoin('users as t5', 't1.uploaded_by', '=', 't5.id')
            //          ->select(DB::raw("t1.remarks,  t1.node_ref,t1.version as version_no, t2.name as document_type, t1.id,t1.initial_file_name,t1.file_name, t1.file_type,t1.uploaded_on,t5.email as uploaded_by ,t2.document_type_id,t3.name as document_type, t2.name as document_requirement"))
            //         ->where('t1.application_code', $application_code)
            //         ->get();

            $doc_data = DB::table('tra_documentmanager_application as t1')
                ->leftJoin('tra_documentupload_requirements as t2', 't1.document_type_id', '=', 't2.id')
                ->select(DB::raw("t2.name as document_type,t5.email as uploaded_by ,t1.is_mandatory ,t1.id as document_requirement_id, t1.document_type_id,t2.name as document_type, t1.name as document_requirement, t4.file_name,t1.version as version_no, t1.description as remarks,t4.node_ref,t4.file_type,t4.initial_file_name,t4.created_on as uploaded_on"))
                // ->join('tra_documents_prevversions as t4', function ($join) {
                //     $join->on("orin", "=", "t4.document_requirement_id");
                // })
                ->leftJoin('tra_application_uploadeddocuments as t4', 't1.application_code', '=', 't4.application_code')
                ->leftJoin('users as t5', 't4.created_by', '=', 't5.id')

                ->where(array('t1.application_code' => $document_requirement_id))
                ->get();



            $res = array('success' => true, 'results' => $doc_data);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function deleteSingleFile($file_id)
    {
        $table_name = 'tra_application_uploadeddocuments';
        $where_file = array('id' => $file_id);
        $records = DB::table('tra_application_uploadeddocuments')
            ->where($where_file)
            ->first();
        $data = array();
        $resp = [];
        if (isset($records->id)) {
            $response = dmsDeleteAppRootNodesChildren($records->node_ref);
            if ($response['success']) {
                //check existing other documents on the folder
                $check = DB::table('tra_application_uploadeddocuments')->where('application_document_id', $records->application_document_id)->count();
                if ($check == 1) {
                    //delete folder entry since the entry remains one 
                    deleteRecord('tra_application_documents', ['id' => $records->application_document_id]);
                }
                //delete the file
                $previous_data = getPreviousRecords($table_name, $where_file);
                $previous_data = $previous_data['results'];
                $resp = deleteRecordNoTransaction($table_name, $previous_data, $where_file, $this->user_id);
            }
        } else {
            $resp = ['message' => 'Document is missing', 'success' => false];
        }
        return $resp;
    }
    public function deleteDirectoryFiles($file_id)
    {
        $resp = ['success' => true, 'message' => "Directory cleaned successfully"];
        $records = DB::table('tra_application_uploadeddocuments')
            ->where('parent_id', $file_id)
            ->get();
        //delete folder entry
        deleteRecord('tra_application_uploadeddocuments', ['id' => $file_id]);
        foreach ($records as $rec) {
            if ($rec->is_directory == 1) {
                $resp = $this->deleteDirectoryFiles($rec->id);
            } else {
                $resp = $this->deleteSingleFile($rec->id);
            }
        }
        return $resp;
    }
    public function onApplicationDocumentDelete(Request $req)
    {
        try {
            $application_code = $req->application_code;
            $node_ref = $req->node_ref;
            $record_id = $req->record_id;
            $application_document_id = $req->application_document_id;
            $user_id = $this->user_id;
            $table_name = 'tra_application_uploadeddocuments';
            $data = array();
            //get the records
            $resp = false;
            $where_file = array('id' => $record_id);
            $records = DB::table('tra_application_uploadeddocuments')
                ->where($where_file)
                ->first();

            if (isset($records->id)) {

                if ($records->is_directory == 1) {
                    $resp = $this->deleteDirectoryFiles($record_id);
                } else {
                    $resp = $this->deleteSingleFile($record_id);
                }
            }
            if ($resp) {
                $res = array('success' => true, 'message' => 'Document deleted successfully');
            } else {
                $res = array('success' => false, 'message' => 'Document delete failed, contact the system admin if this persists');
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function onDeleteProductImages(Request $req)
    {
        try {
            $application_code = $req->application_code;
            $node_ref = $req->node_ref;
            $record_id = $req->record_id;
            $user_id = $this->user_id;
            $table_name = 'tra_uploadedproduct_images';
            $data = array();
            //get the records
            $resp = false;
            $where_state = array('id' => $record_id);
            $records = DB::table($table_name)
                ->where($where_state)
                ->get();
            if (count($records) > 0) {

                $previous_data = getPreviousRecords($table_name, $where_state);
                $previous_data = $previous_data['results'];
                $resp = deleteRecordNoTransaction($table_name, $previous_data, $where_state, $user_id);
            }
            if ($resp['success']) {
                $res = array('success' => true, 'message' => 'Image deleted successfully');
            } else {
                $res = array('success' => false, 'message' => 'Image delete failed, contact the system admin if this persists');
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function onDeleteNonStructureApplicationDocument(Request $req)
    {
        try {
            $application_code = $req->application_code;
            $reference_record_id = $req->reference_record_id;
            $table_name = $req->table_name;
            $node_ref = $req->node_ref;
            $record_id = $req->record_id;
            $user_id = $this->user_id;
            $table_name = 'tra_application_uploadeddocuments';
            $data = array();
            //get the records
            $resp = false;
            $where_state = array('reference_record_id' => $reference_record_id, 'id' => $record_id);
            $records = DB::table($table_name)
                ->where($where_state)
                ->get();
            if (count($records) > 0) {

                $response = dmsDeleteAppRootNodesChildren($node_ref);
                if ($response['success']) {
                    $previous_data = getPreviousRecords($table_name, $where_state);
                    $previous_data = $previous_data['results'];
                    $resp = deleteRecordNoTransaction($table_name, $previous_data, $where_state, $user_id);
                }
            }
            if ($resp) {
                $res = array('success' => true, 'message' => 'Document deleted successfully');
            } else {
                $res = array('success' => false, 'message' => 'Document delete failed, contact the system admin if this persists');
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getDocumentArchive(Request $req)
    {
        try {
            $uploadeddocuments_id = $req->uploadeddocuments_id;
            $uploadeddocuments_id = $req->uploadeddocuments_id;

            //get all documents in the directory
            $directory_items = DB::table('tra_application_uploadeddocuments as t1')
                ->join('tra_application_documents as t2', 't1.application_document_id', 't2.id')
                ->select('t1.*', 't2.application_code')
                ->whereRaw("t1.parent_id = " . $uploadeddocuments_id . " OR (t1.id = " . $uploadeddocuments_id . " AND is_directory = 2)")
                ->get();
            //check if directory is empty
            if ($directory_items->isEmpty()) {
                $res = array(
                    'success' => false,
                    'message' => 'The selected directory is empty'
                );
                return json_encode($res);
            }
            //create a zip instance
            $zip = new ZipArchive;
            $counter = 0;
            $public_dir = Storage::disk('local')->path('downloads');
            //public_path().'/resources/uploads';
            $zipFileName = str_replace(' ', '', Carbon::now()->format('Y-m-d H-i-s') . '_documents_export.zip');
            //open or create zip for writting

            if ($zip->open($public_dir . '/' . $zipFileName, ZipArchive::CREATE) === TRUE) {
                //get dir items
                foreach ($directory_items as $item) {
                    $this->getFileContent($item, $zip);
                    // if($file['success']){
                    //     $zip->addFromString($file['file_name'], $file['file']);
                    // }
                }
                //close zip to mark completion of writting
                $zip->close();
            }
            //fetch created zip and return
            $filetopath = $public_dir . '/' . $zipFileName;
            if (file_exists($filetopath)) {
                $file = file_get_contents($filetopath);
                unlink($filetopath);
                $res = array(
                    'success' => true,
                    'message' => 'all is well',
                    'filename' => $zipFileName,
                    'document_url' => "data:application/octet-stream;base64," . base64_encode($file)
                );
                return json_encode($res);
            } else {
                $res = array('success' => false, 'message' => 'fetching selected document failed or selected directory was empty');
                return json_encode($res);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return json_encode($res);
        // $selected = $req->selected;
        // $selected_archives = json_decode($selected);
        // $doc_url = array();
        // foreach ($selected_archives as $selected_archive) {
        //     $node_ref = $selected_archive[0];
        //     $application_code = $selected_archive[1];
        //     $uploadeddocuments_id = $selected_archive[2];
        //     $file_name = $selected_archive[3];
        //     $request = new Request([
        //          'node_ref'   => $node_ref,
        //          'application_code'   => $application_code,
        //          'uploadeddocuments_id'   => $uploadeddocuments_id
        //      ]);
        //     $res = $this->getApplicationDocumentDownloadurl($request);
        //     $res = $res->getData();

        //     if($res->success){
        //         $doc_url[] = array('url' =>$res->document_url, 'file_name'=>$file_name);
        //     }
        //    }
        // //document
        // if(!empty($doc_url)){
        //     $zip = new ZipArchive;
        //     $counter = 0;
        //     $public_dir=public_path().'/resources/uploads';
        //     $zipFileName = str_replace(' ','',Carbon::now()->format('Y-m-d H-i-s').'_documents_export.zip');
        //     if ($zip->open($public_dir . '/' . $zipFileName, ZipArchive::CREATE) === TRUE) {
        //         foreach ($doc_url as $doc) {
        //             $file = file_get_contents($doc['url']);
        //             $zip->addFromString($doc['file_name'], $file);
        //             $counter++;
        //         }

        //         $zip->close();
        //     }

        //     $filetopath=$public_dir.'/'.$zipFileName;
        //     if(file_exists($filetopath)){
        //        $file = file_get_contents($filetopath);
        //         unlink($filetopath);
        //          $res = array(
        //             'success' => true,
        //             'message' => 'all is well',
        //             'filename' => $zipFileName,
        //             'document_url' => "data:application/octet-stream;base64,".base64_encode($file)
        //         );
        //         return json_encode($res);
        //     }else{
        //         $res = array('success' => false, 'message' => 'fetching selected document failed');
        //          return json_encode($res);
        //     }

        // }else{
        //     $res = array('success' => false, 'message' => 'fetching all selected document failed');
        //     return json_encode($res);
        // }
    }
    public function uploadLargeFiles(Request $request)
    {
        $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));

        if (!$receiver->isUploaded()) {
            // file not uploaded
        }

        $fileReceived = $receiver->receive(); // receive file

        //get handler class
        $handler = $fileReceived->handler();
        //check if its the first chunk
        $currentChunk = $handler->getCurrentChunk();


        if ($currentChunk < 5) {

            //check if allowed
            $docextension_check = $this->validateDocumentExtension($fileReceived->getClientOriginalExtension(), $request->document_requirement_id);


            $is_allowedextension = $docextension_check['is_allowedextension'];
            if (!$is_allowedextension) {
                $allowed_filetypes = $docextension_check['allowed_filetypes'];
                $res = array('success' => false, 'message' => 'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions:.' . $allowed_filetypes);
                return response($res, 409);

                exit();
            }
        }

        if ($fileReceived->isFinished()) { // file uploading is complete / all chunks are uploaded

            $file = $fileReceived->getFile(); // get file


            // $extension = $file->getClientOriginalExtension();
            // $fileName = str_replace('.'.$extension, '', $file->getClientOriginalName()); //file name without extenstion
            // $fileName .= '.' . $extension; // a unique file name

            // $disk = Storage::disk('local');
            // $path = $disk->putFileAs('uploaded_files', $file, $fileName);
            // $final_file = Storage::get($path);


            //upload to alfresco
            //return $this->uploadApplicationDocumentFile($request, $file);
            return $this->uploadMultipleFiles($request, $file);
            // delete chunked file
            unlink($file->getPathname());
            // return [
            //     'path' => asset('storage/' . $path),
            //     'filename' => $fileName
            // ];
        }

        // otherwise return percentage information
        // $handler = $fileReceived->handler();
        return [
            'done' => $handler->getPercentageDone(),
            'status' => true
        ];
    }
    public function  getFileContent($item, $zip, $folder = '')
    {
        //check if directory
        if ($item->is_directory == 1) {
            //create directory 
            $zip->addEmptyDir($item->initial_file_name);
            //get all files in the dir
            //get all documents in the directory
            $directory_items = DB::table('tra_application_uploadeddocuments as t1')
                ->join('tra_application_documents as t2', 't1.application_document_id', 't2.id')
                ->select('t1.*', 't2.application_code')
                ->whereRaw("t1.parent_id = " . $item->id . " OR (t1.id = " . $item->id . " AND is_directory = 2)")
                ->get();
            //loop throgh dir
            if ($folder != '') {
                $dir = $folder . '/' . $item->initial_file_name;
            } else {
                $dir = $item->initial_file_name;
            }
            foreach ($directory_items as $dir_item) {
                $this->getFileContent($dir_item, $zip, $dir);
            }
        } else {
            $node_ref = $item->node_ref;
            $application_code = $item->application_code;
            $id = $item->id;
            $request = new Request([
                'node_ref' => $node_ref,
                'application_code' => $application_code,
                'uploadeddocuments_id' => $id
            ]);
            $res = $this->getApplicationDocumentDownloadurl($request);
            $res = $res->getData();
            if ($res->success) {
                $document_url = str_replace(' ', '%20', $res->document_url);
                $document_url = str_replace('#', '%20', $document_url);
                $content =  file_get_contents($document_url);
                $file = array('success' => true, 'file' => $content, 'file_name' => $item->initial_file_name);
                if ($folder != '') {
                    $zip->addFromString($folder . '/' . $file['file_name'], $file['file']);
                } else {
                    $zip->addFromString($file['file_name'], $file['file']);
                }
            } else {
                $file = array('success' => false, 'message' => $res->message);
            }
            return $file;
        }
    }
    public function saveHeaderFooter(Request $req)
    {
        try {
            $user_id = $this->user_id;
            $id = $req->input('id');
            $table_name = $req->input('table_name');
            $is_current = $req->input('is_current');
            $header = base64_encode(file_get_contents($req->file('header')));
            $footer = base64_encode(file_get_contents($req->file('footer')));

            $header_name = $req->file('header')->getClientOriginalName();
            $footer_name = $req->file('footer')->getClientOriginalName();

            $document_data = array(
                'header' => $header,
                'footer' => $footer,
                'is_current' => $is_current,
                'header_name' => $header_name,
                'footer_name' => $footer_name,
                'dola' => Carbon::now(),
                'created_on' => Carbon::now(),
                'created_by' => $user_id,
                'altered_by' => $user_id
            );

            if ($is_current == 1) {
                $results = DB::table($table_name)->get();

                foreach ($results as $result) {
                    $record_id = $result->id;
                    $is_current = $result->is_current;
                    $update_data = ['is_current' => 0];

                    if ($is_current == 1) {
                        $res = updateRecord($table_name, ['id' => $record_id], $update_data, $user_id);
                    }
                }
            }

            $res = insertRecord($table_name, $document_data, $user_id);

            $res = array(
                'success' => true,
                'message' => 'Header & Footer Uploaded Successfully'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function getHeaderFooterImages(Request $req)
    {
        $record_id = $req->record_id;
        try {
            $qry = DB::table('par_brimsletter_header_footer as t1')
                ->where('t1.id', $record_id)
                ->first();

            $res = array(
                'success' => true,
                'header' => $qry->header,
                'footer' => $qry->footer,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function importExcelFile(Request $request)
    {
        $receiver = new FileReceiver('file', $request, HandlerFactory::classFromRequest($request));
        if (!$receiver->isUploaded()) {
            // file not uploaded
        }
        $fileReceived = $receiver->receive(); // receive file
        //get handler class
        $handler = $fileReceived->handler();
        //check if its the first chunk
        $currentChunk = $handler->getCurrentChunk();
        if ($currentChunk < 5) {
            //check if allowed
            $docextension = $fileReceived->getClientOriginalExtension();
            if ($docextension != 'xlsx' && $docextension != 'csv' && $docextension != 'xls') {
                $res = array('success' => false, 'message' => 'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions are xlsx, xls, csv');
                return response($res, 409);

                exit();
            }
        }
        if ($fileReceived->isFinished()) { // file uploading is complete / all chunks are uploaded
            $file = $fileReceived->getFile(); // get file
            return $this->loadExcelFileToDb($request, $file);
            // delete chunked file
            unlink($file->getPathname());
        }
        return [
            'done' => $handler->getPercentageDone(),
            'status' => true
        ];
    }
    public function loadExcelFileToDb($req, $file)
    {
        try {
            // confirm extension
            $docextension = $file->getClientOriginalExtension();
            // if('csv' == $docextension) {     
            //   $reader = new \PhpOffice\PhpSpreadsheet\Reader\Csv();
            // } else  

            if ($docextension == 'xlsx' || $docextension == 'xls') {
                # Create a new Xls Reader
                if ('xls' == $docextension) {
                    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
                } else {
                    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
                }
                //get file to worksheet
                //get path file
                $file_path = $file->getPathName();
                // Tell the reader to only read the data. Ignore formatting etc.
                $reader->setReadDataOnly(true);

                // Read the spreadsheet file.
                $spreadsheet = $reader->load($file_path);

                $sheet = $spreadsheet->getSheet($spreadsheet->getFirstSheetIndex());
                //first header occurence check
                $row_count = 1;
                $start_column = $req->start_column;
                foreach ($sheet->getRowIterator() as $row) {
                    $row_count = $row->getRowIndex();
                    $value = $sheet->getCell($start_column . '' . $row_count)->getValue();
                    if ($value != '' || !is_null($value)) {
                        break;
                    }
                }
                //columnIndexFromString() method to convert AJ to its numeric equivalent
                //get Headers
                $total_rows = $sheet->getHighestDataRow();
                $total_columns = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($sheet->getHighestDataColumn());
                $start_column_index = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($start_column);
                //get template defination
                $upload_type_id = $req->upload_type_id;
                $table_name = getSingleRecordColValue('par_exceluploads_config_type', ['id' => $upload_type_id], 'table_nm');
                $template = DB::table('par_exceluploads_config')
                    ->select('table_column', 'excelcolumnname')
                    ->where('excel_config_type_id', $upload_type_id)
                    ->get();
                //get desired data
                $data = array();
                foreach ($template as $rec) {
                    $table_column = $rec->table_column;
                    $excelcolumnname = $rec->excelcolumnname;
                    for ($i = $start_column_index; $i < $total_columns + 1; $i++) {
                        $cell = $sheet->getCellByColumnAndRow($i, $row_count)->getColumn();
                        $excel_value = $sheet->getCell($cell . '' . $row_count)->getValue();
                        if ($excelcolumnname == $excel_value) {
                            $data[$table_column] = Arr::flatten($sheet->rangeToArray($cell . '' . ($row_count + 1) . ':' . $cell . '' . $total_rows));
                        }
                    }
                }
                // loop based on number of rows
                $final_rec = [];
                $length = $total_rows - $row_count;
                for ($i = 0; $i < $length; $i++) {
                    $single_row = [];
                    foreach ($data as $key => $value) {
                        $single_row[$key] = Arr::get($data, $key . '.' . $i);
                    }
                    $final_rec[] = $single_row;
                }
                $res = insertRecord($table_name, $final_rec);
                if ($res['success']) {
                    //log import
                    $imported_data = serialize($final_rec);
                    $log = array(
                        'imported_data' => $imported_data
                    );
                    insertRecord('imp_imported_data_log', $log);
                }
            } else if ($docextension != 'csv') {
                $res = array('success' => false, 'message' => 'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions are xlsx, xls, csv');
            } else {
                $res = array('success' => false, 'message' => 'Upload the allowed file types or contact the authority for further guidelines. Allowed File Types extensions are xlsx, xls, csv');
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function addExcelWatermark($attachment, $destination, $watermarkText, $savedName) {
    try {
        // Create a temporary file for the uploaded Excel
        $tempPath = tempnam(sys_get_temp_dir(), 'excel_');
        $attachment->move(dirname($tempPath), basename($tempPath));

        // Load the Excel file using the Xlsx reader
        $reader = IOFactory::createReader('Xlsx');
        $spreadsheet = $reader->load($tempPath);

        // Loop through all sheets and add the text watermark to each sheet
        foreach ($spreadsheet->getAllSheets() as $sheet) {
            // Add text watermark
            $sheet->getHeaderFooter()->setOddHeader('&L&G&F' . $watermarkText);
            $sheet->getHeaderFooter()->setEvenHeader('&L&G&F' . $watermarkText);
        }

        // Ensure the destination directory exists
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        // Form the full path for the output Excel file
        $outputPath = rtrim($destination, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $savedName;

        // Save the modified Excel file
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($outputPath);

        // Remove the temporary file
        unlink($tempPath);

        return true; // Return true on success
    } catch (\PhpOffice\PhpSpreadsheet\Exception $e) {
        // Handle any exceptions that occur during the process
        echo 'Error: ' . $e->getMessage();
        return false; // Return false on failure
    }
}



public function addImageWatermark($sourceFile, $destination, $watermarkFile, $savedName) {
    // Create an Imagick object for the source image
    $image = new Imagick($sourceFile);

    // Create an Imagick object for the watermark image
    $watermark = new Imagick($watermarkFile);

    // Get the dimensions of the source image and the watermark image
    $imageWidth = $image->getImageWidth();
    $imageHeight = $image->getImageHeight();
    $watermarkWidth = $watermark->getImageWidth();
    $watermarkHeight = $watermark->getImageHeight();

    // Calculate the position to place the watermark (centered)
    $x = ($imageWidth - $watermarkWidth) / 2;
    $y = ($imageHeight - $watermarkHeight) / 2;

    // Composite the watermark on the source image
    $image->compositeImage($watermark, imagick::COMPOSITE_OVER, $x, $y);

    // Ensure the destination directory exists
    if (!is_dir($destination)) {
        mkdir($destination, 0755, true);
    }

    // Form the full path for the output image file
    $outputPath = rtrim($destination, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $savedName;

    // Write the new image to the destination
    $image->writeImage($outputPath);

    // Clean up
    $image->clear();
    $image->destroy();
    $watermark->clear();
    $watermark->destroy();
}


//public function addWordWatermark($sourceFile, $destination, $watermarkText, $savedName) {
public function addWordWatermark($filetopath, $destination) {
    // Load the Word document
    $phpWord = IOFactory::load($filetopath);

    // Loop through all sections and add the watermark text to the header
    foreach ($phpWord->getSections() as $section) {
        $header = $section->addHeader();

        // Add a text watermark
        $watermark = $header->addWatermarkShape();
        $watermark->addText($watermarkText, [
            'font' => ['size' => 50, 'color' => 'C0C0C0', 'bold' => true],
            'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
            'rotate' => 45
        ]);

        // Alternatively, you can use an image as a watermark
        // $header->addImage('path/to/watermark/image.png', ['width' => 100, 'height' => 100, 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'marginTop' => -80, 'wrappingStyle' => 'behind']);
    }

    // Ensure the destination directory exists
    if (!is_dir($destination)) {
        mkdir($destination, 0755, true);
    }

    // Form the full path for the output Word document
    $outputPath = rtrim($destination, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $savedName;

    // Save the modified Word document
    $writer = IOFactory::createWriter($phpWord, 'Word2007');
    $writer->save($outputPath);
}


public function addPptWatermark($sourceFile, $destination, $watermarkText, $savedName) {
    // Load the PowerPoint file
    $ppt = IOFactory::load($sourceFile);

    foreach ($ppt->getAllSlides() as $slide) {
        // Create a new rich text shape
        $shape = $slide->createRichTextShape()
            ->setHeight(100)
            ->setWidth(600)
            ->setOffsetX(170)
            ->setOffsetY(180);

        // Center the text
        $shape->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Add the watermark text
        $textRun = $shape->createTextRun($watermarkText);
        $textRun->getFont()->setBold(true)
            ->setSize(60)
            ->setColor(new Color(Color::COLOR_GRAY));
    }

    // Ensure the destination directory exists
    if (!is_dir($destination)) {
        mkdir($destination, 0755, true);
    }

    // Form the full path for the output PowerPoint file
    $outputPath = rtrim($destination, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $savedName;

    // Save the modified PowerPoint file
    $writer = IOFactory::createWriter($ppt, 'PowerPoint2007');
    $writer->save($outputPath);
}

// public function addWatermark($filetopath, $initial_file_name, $public_dir) {
//     $pdf = new \Mpdf\Mpdf();
//     // Save the uploaded file to a temporary location
//     // $tempPath = tempnam(sys_get_temp_dir(), 'pdf_');
//     // $filetopath->move(dirname($tempPath), basename($tempPath));
//     $watermarkText = 'CONFIDENTIAL';
    
//     // Set source file
//     $pageCount = $pdf->setSourceFile($filetopath);

//     for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
//         // Import a page
//         $tplId = $pdf->importPage($pageNo);
//         $pdf->AddPage();
//         $pdf->useTemplate($tplId);

//         // Set watermark font and color
//         $pdf->SetFont('Helvetica', 'B', 50);
//         $pdf->SetTextColor(255, 192, 203);

//         // Get page width and height
//         $size = $pdf->getTemplateSize($tplId);
//         $width = $size['width'];
//         $height = $size['height'];

//         // Add watermark text
//         $pdf->StartTransform();
//         $pdf->Rotate(45, $width / 2, $height / 2);
//         $pdf->Text($width / 4, $height / 2, $watermarkText);
//         $pdf->StopTransform();

//          // Reset the transparency to default
//         $pdf->SetAlpha(1);
//     }


public function addPDFDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number) {
    $pdf = new \Mpdf\Mpdf();
    

    // Set source file
    $pageCount = $pdf->setSourceFile($filetopath);

    for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
        // Import a page
        $tplId = $pdf->importPage($pageNo);
        $pdf->AddPage();
        $pdf->useTemplate($tplId);

        // Set watermark font and color
        $pdf->SetFont('Helvetica', 'B', 13);
        $pdf->Cell(0,8,$document_number,0,1, 'R');
        //$pdf->WriteHTML($watermarkText, true, false, true, true, 'R');
        // $pdf->SetTextColor(255, 192, 203);

        // // Get page width and height
        // $size = $pdf->getTemplateSize($tplId);
        // $width = $size['width'];
        // $height = $size['height'];

        // // Add watermark text
        // $pdf->StartTransform();
        // $pdf->Rotate(45, $width / 2, $height / 2);
        // $pdf->Text($width / 4, $height / 2, $watermarkText);
        // $pdf->StopTransform();

        // // Reset the transparency to default
        // $pdf->SetAlpha(1);
    }

    // Save the watermarked PDF
    $watermarkedFilePath = $public_dir . '/watermarked_' . $initial_file_name;
    $pdf->Output($watermarkedFilePath, \Mpdf\Output\Destination::FILE);

    return $watermarkedFilePath;
}


public function addWordDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number)
{
    try {
        // Check if the file exists and is readable
        if (!file_exists($filetopath) || !is_readable($filetopath)) {
            throw new \Exception("File does not exist or is not readable: " . $filetopath);
        }

        // Load the existing Word document
        $phpWord = \PhpOffice\PhpWord\IOFactory::load($filetopath);

        // Get the first section (assuming there's at least one section)
        $section = $phpWord->getSections()[0];

        // Create a new text run at the beginning of the first section
        $textrun = $section->addTextRun();
        $textrun->addText($document_number);

        // Add a break line for visual separation
        $textrun->addTextBreak();

        // Copy existing elements to the new text run
        foreach ($section->getElements() as $element) {
            $textrun->addElement($element);
        }

        // Ensure the destination directory exists
        if (!is_dir($public_dir)) {
            mkdir($public_dir, 0755, true);
        }

        // Form the full path for the output Word document
        $watermarkedFilePath = rtrim($public_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'watermarked_' . $initial_file_name;

        // Save the modified Word document
        $phpWordWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $phpWordWriter->save($watermarkedFilePath);

        return $watermarkedFilePath;
    } catch (\Exception $e) {
        // Handle any exceptions
        throw new \Exception("Error adding document number to Word document: " . $e->getMessage());
    }
}
    


// public function addWordDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number)
// {
//     try {
//         // Check if the file exists and is readable
//         if (!file_exists($filetopath) || !is_readable($filetopath)) {
//             throw new \Exception("File does not exist or is not readable: " . $filetopath);
//         }

//         // Load the existing Word document
//         $phpWord = \PhpOffice\PhpWord\IOFactory::load($filetopath);

//         // Get the first section (assuming there's at least one section)
//         $section = $phpWord->getSections()[0];

//         // Add document number at the beginning of the first section
//         $textRun = $section->addTextRun();
//         $textRun->addText($document_number, ['bold' => true, 'size' => 16, 'color' => 'FF0000'], ['alignment' => 'center']);

//         // Ensure the destination directory exists
//         if (!is_dir($public_dir)) {
//             mkdir($public_dir, 0755, true);
//         }

//         // Form the full path for the output Word document
//         $watermarkedFilePath = rtrim($public_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'watermarked_' . $initial_file_name;

//         // Save the modified Word document
//         $phpWordWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
//         $phpWordWriter->save($watermarkedFilePath);

//         return $watermarkedFilePath;
//     } catch (\Exception $e) {
//         // Handle any exceptions
//         throw new \Exception("Error adding document number to Word document: " . $e->getMessage());
//     }
// }



public function addExcelDocumentNumber($filetopath, $initial_file_name, $public_dir, $document_number)
{
    try {
        // Check if the file exists and is readable
        if (!file_exists($filetopath) || !is_readable($filetopath)) {
            throw new \Exception("File does not exist or is not readable: " . $filetopath);
        }

        // Load the existing Excel document
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filetopath);

        // Get the active sheet (assuming there is only one sheet)
        $sheet = $spreadsheet->getActiveSheet();

        // Add document number to a specific cell (e.g., A1)
        $sheet->setCellValue('A1', $document_number);

        // Ensure the destination directory exists
        if (!is_dir($public_dir)) {
            mkdir($public_dir, 0755, true);
        }

        // Form the full path for the output Excel document
        $watermarkedFilePath = rtrim($public_dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'watermarked_' . $initial_file_name;

        // Save the modified Excel document
        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($watermarkedFilePath);

        return $watermarkedFilePath;
    } catch (\Exception $e) {
        // Handle any exceptions
        throw new \Exception("Error adding document number to Excel document: " . $e->getMessage());
    }
}

    public function downloadsopTemplate(Request $req){

            $public_dir = public_path() . '/resources/SOPTemplate.docx';
            $public_dir = str_replace('\\', '/', $public_dir); 
            // Initialize data array
            $data = array();
            $module_id = $req->module_id;
            $val = date('Ymdhis');

            if (validateIsNumeric($module_id)) {
                $module_details = getTableData('par_modules', array('id' => $module_id));
                $table_name = $module_details['sop_table_name'];
            }

            $db_columns = DB::select('SHOW COLUMNS FROM '. $table_name);
            $column_data = array();

            foreach ($db_columns as $row) {
                if (strpos($row->Field, '_id') === false) {
                    $column_data[strtoupper($row->Field)] = ""; 
                }
            }

            $data[] = $column_data;
            $data_array = json_decode(json_encode($data), true);

            // Load the pre-existing Word document template
            $templateProcessor = new TemplateProcessor($public_dir);

            if (isset($data_array[0])) {
                $header = array_keys($data_array[0]);
            } else {
                $data_array = array();
                $header = array();
                $templateProcessor->setValue('table_placeholder', 'No data');
            }

            // Add the data table to the document
            foreach ($header as $index => $col) {
                $templateProcessor->setValue('HEADER_PLACEHOLDER' . ($index + 1), $col);
            }

            foreach ($data_array as $rowIndex => $row) {
                foreach ($header as $colIndex => $col) {
                    $templateProcessor->setValue('COLUMN_PLACEHOLDER' . ($colIndex + 1), $row[$col]);
                }
            }

            // Save the modified document
            $tempFilePath = tempnam(sys_get_temp_dir(), 'PHPWord');
            $templateProcessor->saveAs($tempFilePath);

            $response = new StreamedResponse(function () use ($tempFilePath) {
                readfile($tempFilePath);
            });

            $filename = 'SOP Template';
            $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            $response->headers->set('Content-Disposition', 'attachment;filename=' . $filename . '.docx');
            $response->headers->set('Cache-Control', 'max-age=0');

            return $response;
    }

    public function downloadFormFormat(Request $req){

            $public_dir = public_path() . '/resources/FormFormat.docx';
            $public_dir = str_replace('\\', '/', $public_dir); 
            // Initialize data array
            $data = array();
            $module_id = $req->module_id;
            $val = date('Ymdhis');

            if (validateIsNumeric($module_id)) {
                $module_details = getTableData('par_modules', array('id' => $module_id));
                $table_name = $module_details['sop_table_name'];
            }

            $db_columns = DB::select('SHOW COLUMNS FROM '. $table_name);
            $column_data = array();

            foreach ($db_columns as $row) {
                if (strpos($row->Field, '_id') === false) {
                    $column_data[strtoupper($row->Field)] = ""; 
                }
            }

            $data[] = $column_data;
            $data_array = json_decode(json_encode($data), true);

            // Load the pre-existing Word document template
            $templateProcessor = new TemplateProcessor($public_dir);

            if (isset($data_array[0])) {
                $header = array_keys($data_array[0]);
            } else {
                $data_array = array();
                $header = array();
                $templateProcessor->setValue('table_placeholder', 'No data');
            }

            // Add the data table to the document
            foreach ($header as $index => $col) {
                $templateProcessor->setValue('HEADER_PLACEHOLDER' . ($index + 1), $col);
            }

            foreach ($data_array as $rowIndex => $row) {
                foreach ($header as $colIndex => $col) {
                    $templateProcessor->setValue('COLUMN_PLACEHOLDER' . ($colIndex + 1), $row[$col]);
                }
            }

            // Save the modified document
            $tempFilePath = tempnam(sys_get_temp_dir(), 'PHPWord');
            $templateProcessor->saveAs($tempFilePath);

            $response = new StreamedResponse(function () use ($tempFilePath) {
                readfile($tempFilePath);
            });

            $filename = 'Form Format';
            $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            $response->headers->set('Content-Disposition', 'attachment;filename=' . $filename . '.docx');
            $response->headers->set('Cache-Control', 'max-age=0');

            return $response;

    }

    public function downloadlogdatabasesTemplate(Request $req)
        {
            $public_dir = public_path() . '/resources/LogDatabases.xlsx';
            $public_dir = str_replace('\\', '/', $public_dir);

            if (!file_exists($public_dir)) {
                abort(404, 'File not found.');
            }

            // Stream the existing file as a response
            $response = new StreamedResponse(function () use ($public_dir) {
                readfile($public_dir);
            });

            $filename = 'Log Databases Format';
            $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            $response->headers->set('Content-Disposition', 'attachment;filename=' . $filename . '.xlsx');
            $response->headers->set('Cache-Control', 'max-age=0');

            return $response;
        }

         public function deleteDocumentRecord(Request $req)
    {
        try {
            $application_code = $req->input('application_code');
            $where = array(
                'application_code' => $application_code
            );

            if (recordExists('tra_documentmanager_application', $where)) {
                $res = deleteRecord('tra_documentmanager_application', $where);
            }

            if (recordExists('tra_application_uploadeddocuments', $where)) {
                $res = deleteRecord('tra_application_uploadeddocuments', $where);
            }

            if (recordExists('tra_submissions', $where)) {
                $res = deleteRecord('tra_submissions', $where);
            }

            if (recordExists('tra_evaluation_recommendations', $where)) {
                $res = deleteRecord('tra_evaluation_recommendations', $where);
            }
              
            
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1), explode('\\', __CLASS__), Auth::user()->id);
        }
        return response()->json($res);
    }

//     if (!is_dir($public_dir)) {
//         mkdir($public_dir, 0755, true);
//     }

//     // Form the full path for the output PDF
//     $outputPath = rtrim($filetopath);

   

//     // Output the new PDF to the specified destination
//     $pdf->Output($outputPath, 'F');

//     // Clean up the temporary file
//     unlink($filetopath);
// }
    
//     public function handleAttachment($file)
// {
//     if ($file) {
//         $document_rootupload = Config('constants.dms.doc_rootupload');
//         $destination = getcwd() . $document_rootupload;
//         $savedName = str_random(3) . time() . '.' . $extension;
//         $watermarkText = 'CONFIDENTIAL';
//         $file->move($destination, $savedName);
//         $this->addWatermark($file, $destination, $watermarkText,$savedName);
//      //   $this->addExcelWatermark($file, $destination, $watermarkText,$savedName);
//         return $destination . $savedName;
//     }
//     return null;
// }
}
