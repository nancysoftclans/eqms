<?php

namespace Modules\ProductRegistration\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ProductRegistrationController extends Controller
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
    public function getProductApplicationReferenceCodes($application_details)
    {

        $branch_code = getSingleRecordColValue('par_branches', array('id' => $application_details->branch_id), 'branch_code');
        $section_code = getSingleRecordColValue('par_sections', array('id' => $application_details->section_id), 'code');
        $class_code = getSingleRecordColValue('par_classifications', array('id' => $application_details->classification_id), 'code');
		$prod_class_code = getSingleRecordColValue('par_prodclass_categories', array('id' => $application_details->prodclass_category_id), 'code');
		$prod_type_code = getSingleRecordColValue('par_product_types', array('id' => $application_details->product_type_id), 'code');
        $apptype_code = getSingleRecordColValue('par_product_origins', array('id' => $application_details->product_type_id), 'code');
        $assessment_code = getSingleRecordColValue('par_assessment_procedures', array('id' => $application_details->assessmentprocedure_type_id), 'code');


        $codes_array = array(
            'section_code' => $section_code,
            'branch_code' => $branch_code,
            'class_code' => $class_code,
			'prod_class_code' => $prod_class_code,
			'prod_type_code' => $prod_type_code,
            'assessment_code' => $assessment_code
        );

        return $codes_array;
    }
    public function getProductApplications(Request $request)
    {
        $module_id = $request->input('module_id');
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        try {
            $assigned_stages = getAssignedProcessStages($user_id, $module_id);

            $qry = DB::table('tra_product_applications as t1')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t1.application_code', '=', 't7.application_code')
                        ->on('t1.workflow_stage_id', '=', 't7.current_stage');
                })
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('wf_processes as t4', 't7.process_id', '=', 't4.id')
                ->leftJoin('wf_workflow_stages as t5', 't7.current_stage', '=', 't5.id')
                ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->leftJoin('users as t8', 't7.usr_from', '=', 't8.id')
                ->join('users as t9', 't7.usr_to', '=', 't9.id')
                ->select(DB::raw("t7.date_received, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),decryptval(t8.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),decryptval(t9.last_name,".getDecryptFunParams().")) as to_user,  t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t2.brand_name as product_name,
                    t6.name as application_status, t3.name as applicant_name, t4.name as process_name, t5.name as workflow_stage, t5.is_general, t3.contact_person,
                    t3.tpin_no, t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id, t3.physical_address as app_physical_address,
                    t3.postal_address as app_postal_address, t3.telephone_no as app_telephone, t3.fax as app_fax, t3.email as app_email, t3.website as app_website,
                    t2.*, t1.*"));
            $is_super ? $qry->whereRaw('1=1') : $qry->whereIn('t1.workflow_stage_id', $assigned_stages);
            if (validateIsNumeric($section_id) && $section_id != 8) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($sub_module_id)) {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }


            if (validateIsNumeric($workflow_stage_id)) {

                $qry->where('t7.current_stage', $workflow_stage_id);
            }else{
                $qry->where('stage_status', 1);
            }

            $qry->where('t7.is_done', 0);
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

    public function closeApplicationQuery(Request $request)
    {

        $query_id = $request->input('query_id');
        $application_code = $request->input('application_code');
        $user_id = $this->user_id;

        $table_name = 'checklistitems_queries';

        $where = array(
            'id' => $query_id
        );

        $table_data = array(
            'status' => 4
        );

        try {
            $prev_data = getPreviousRecords($table_name, $where);
            if ($prev_data['success'] == true) {
                $previous_data = $prev_data['results'];
                $res = updateRecord($table_name, $where, $table_data, $user_id);
                if (DB::table('checklistitems_queries')
                        ->where('item_resp_id', $item_resp_id)
                        ->where('status', '<>', 4)
                        ->count() == 0) {
                    DB::table('checklistitems_responses')
                        ->where('id', $item_resp_id)
                        ->update(array('pass_status' => 1));
                }
            } else {
                $res = $prev_data;
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function saveRenAltProductReceivingBaseDetails(Request $request)
    {
        try {
            DB::beginTransaction();
            $reg_product_id = $request->input('reg_product_id');
            $tra_product_id = $request->input('tra_product_id');
            $active_application_id = $request->input('active_application_id');
            $applicant_id = $request->input('applicant_id');
            $process_id = $request->input('process_id');
            $workflow_stage_id = $request->input('workflow_stage_id');
            $branch_id = $request->input('branch_id');
            $section_id = $request->input('section_id');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            $local_agent_id = $request->input('local_applicant_id');
            $user_id = $this->user_id;
            $product_id = $request->input('product_id');
            $classification_id = $request->input('classification_id');
            $assessment_procedure_id = $request->input('assessment_procedure_id');
            $assessmentprocedure_type_id = $request->input('assessmentprocedure_type_id');
            $prodclass_category_id = $request->input('prodclass_category_id');
            $product_origin_id = $request->input('product_origin_id');
            $reg_serial = $request->input('reg_serial');

            $appeal_type_id = $request->input('appeal_type_id');
            $withdrawal_type_id = $request->input('withdrawal_type_id');
            $prod_data = array(
                'common_name_id'=>$request->common_name_id,
				'common_name' => $request->common_name,
                'classification_id'=>$request->classification_id,
                'chemical_entities_type_id'=>$request->chemical_entities_type_id,
                'efficacy_proof_type_id'=>$request->efficacy_proof_type_id,
                'brand_name'=>$request->brand_name,
                'product_type_id'=>$request->product_type_id,
                // 'product_subcategory_id'=>$request->product_subcategory_id,
                'physical_description'=>$request->physical_description,
                'dosage_form_id'=>$request->dosage_form_id,
                // 'product_form_id'=>$request->product_form_id,
                'strength'=>$request->strength,
                'storage_condition'=>$request->storage_condition,
                'product_origin_id'=>$product_origin_id,
                // 'product_subcategory_id'=>$request->product_subcategory_id,
                // 'distribution_category_id'=>$request->distribution_category_id,
                // 'special_category_id'=>$request->special_category_id,
                'intended_enduser_id'=>$request->intended_enduser_id,
                'intended_use_id'=>$request->intended_use_id,
                'route_of_administration_id'=>$request->route_of_administration_id,
                // 'method_ofuse_id'=>$request->method_ofuse_id,
                // 'section_id'=>$request->section_id,
                'contraindication'=>$request->contraindication,
                'gmdn_code'=>$request->gmdn_code,
                'gmdn_category_id'=>$request->gmdn_category_id,
                'gmdn_term'=>$request->gmdn_term,
                'shelf_lifeafter_opening'=>$request->shelf_lifeafter_opening,
                'shelf_life'=>$request->shelf_life,
                'instructions_of_use'=>$request->instructions_of_use,
                'warnings'=>$request->warnings,
                'intended_use'=>$request->intended_use,
                'paying_currency_id'=>$request->paying_currency_id,
                'fasttrack_option_id'=>$request->fasttrack_option_id,
                'bhcp_number'=>$request->bhcp_number,
                'qualifications'=>$request->qualifications,
                'remarks'=>$request->remarks,
                // 'medical_systemmodel_series'=>$request->medical_systemmodel_series,

                // 'shelflifeduration_desc'=>$request->shelflifeduration_desc,
                // 'shelflifeafteropeningduration_desc'=>$request->shelflifeafteropeningduration_desc,
                // 'reason_for_classification_id'=>$request->reason_for_classification_id,
                // 'prodclass_category_id'=>$prodclass_category_id,
                // 'productrisk_category_id'=>$request->productrisk_category_id,
                // 'reagents_accessories'=>$request->reagents_accessories,
                'has_family'=>$request->has_family,
                'device_family'=>$request->device_family,
                'has_reagents'=>$request->has_reagents,
                'device_reagents'=>$request->device_reagents,
                'has_accessories'=>$request->has_accessories,
                'device_accessories'=>$request->device_accessories,
                'pack_unit_id'=>$request->pack_unit_id,
                'quantity'=>$request->quantity,
                'indications'=>$request->indications,
                'strength_si_unit'=>$request->strength_si_unit,
                'model_name'=>$request->model_name,
                'software_version'=>$request->software_version,
                'device_intended_use'=>$request->device_intended_use,
                'device_brand_name'=>$request->device_brand_name,
                'device_report'=>$request->device_report,
                'productrisk_category_id'=>$request->productrisk_category_id,
                'clinical_condition'=>$request->clinical_condition,
                // 'stability_studies_data_id'=>$request->stability_studies_data_id,
                'device_classification_rules_id'=>$request->device_classification_rules_id,
				'device_cluster' =>$request->device_cluster,
				'device_compliance_standards' =>$request->device_compliance_standards,
				'gs1_udi' =>$request->gs1_udi,
				'udi_available' => $request->udi_available,
				'gs1_udi_available' => $request->gs1_udi_available,
				'has_cluster' => $request->has_cluster,
				'qms_area' => $request->qms_area,
				'qms_established' => $request->qms_established,
				'technical_doc_summary' => $request->technical_doc_summary,
                'listing_no' => $request->listing_no,
                'is_listed' => $request->is_listed,
				'colourant_variation' => $request->colourant_variation,
				'country_id' => $request->country_id,
                'is_b_listed' => $request->is_b_listed,
				'schedule_id' => $request->schedule_id,
                'pack_size' => $request->pack_size,
                //'is_ltr_importer'=> $request->is_ltr_importer,
                //'md_importer'=> $request->md_importer,

            );
            $applications_table = 'tra_product_applications';
            // $prodclass_category_id = 1;
            $products_table = 'tra_product_information';
            if (validateIsNumeric($active_application_id)) {
                //update
                $application_params = array(
                    'applicant_id' => $applicant_id,
                    'local_agent_id' => $local_agent_id,
                    'prodclass_category_id'=>$prodclass_category_id,
                    'assessmentprocedure_type_id' => $assessmentprocedure_type_id,
                    'assessment_procedure_id' => $assessment_procedure_id,
                    "paying_currency_id" => $request->input('paying_currency_id'),
                    "fasttrack_option_id" => $request->input('fasttrack_option_id'),
                    'branch_id' => $branch_id
                );
                $where_product = array(
                    'id' => $product_id
                );
                $where_app = array(
                    'id' => $active_application_id
                );
                $app_details = array();
                if (recordExists($applications_table, $where_app)) {
                    //$app_details = getTableData($applications_table, $where_app);
                    $app_details = getPreviousRecords($applications_table, $where_app);
                    if ($app_details['success'] == false) {
                        return $app_details;
                    }
                    $app_details = $app_details['results'];
                    updateRecord($applications_table, $where_app, $application_params, $user_id);
                }

                $application_code = $app_details[0]['application_code'];//$app_details->application_code;
                $ref_number = $app_details[0]['reference_no'];//$app_details->reference_no;

                $where_product = array(
                    'id' => $product_id
                );
                //Premise_edit
                $prod_data['dola'] = Carbon::now();
                $prod_data['altered_by'] = $user_id;
                $previous_data = getPreviousRecords($products_table, $where_product);
                if ($previous_data['success'] == false) {
                    return $previous_data;
                }
                $previous_data = $previous_data['results'];

                $res = updateRecord($products_table, $where_product, $prod_data, $user_id);
                $res['active_application_id'] = $active_application_id;
                $res['application_code'] = $application_code;
                $res['active_application_code'] = $application_code;
                $res['product_id'] = $product_id;
                $res['ref_no'] = $ref_number;
                $doc_record = DB::table('tra_application_documentsdefination')->where('application_code',$application_code)->first();
                if(!$doc_record){
                     initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $ref_number.rand(10,100), $user_id);
                }
                //log all entries for additional information
                 //$this->updateRenewalProductAdditionalInformation($product_id, $tra_product_id, $reg_product_id);
                //docuements add reg id
                 $update_reg = array('reg_record_id'=>$reg_product_id);

                 $application_code = getSingleRecordColValue('tra_registered_products', ['id'=>$reg_product_id], 'active_application_code');

                if(validateIsNumeric($application_code)){
                    updateRecord('tra_application_uploadeddocuments', ['application_code'=>$application_code], $update_reg);

                }
                DB::commit();

            } else {
                //check for previous applicaitons
                //expiry dates check span
                $anyOngoingApps = checkForOngoingApplications($reg_product_id, $applications_table, 'reg_product_id', $process_id);
                if ($anyOngoingApps['exists'] == true) {
                    $res = array(
                        'success' => false,
                        'message' => 'There is an ongoing application pending approval with reference number ' . $anyOngoingApps['ref_no']
                    );
                    DB::rollback();
                    return \response()->json($res);
                }


                    $prod_data['created_by'] = \Auth::user()->id;
                    $prod_data['created_on'] = Carbon::now();

                    $res = insertRecord('tra_product_information', $prod_data, $user_id);

                    $record_id = $res['record_id'];
                    $product_id = $res['record_id'];
                    $applications_table = 'tra_product_applications';
                    //get the primary reference no
                    $application_code = generateApplicationCode($sub_module_id, $applications_table);
                    $application_status = getApplicationInitialStatus($module_id, $sub_module_id);

                    $ref_id = getSingleRecordColValue('tra_submodule_referenceformats', array('sub_module_id' => $sub_module_id, 'module_id' => $module_id, 'reference_type_id' => 1), 'reference_format_id');
                    $where_statement = array('sub_module_id' =>  $sub_module_id, 't1.reg_product_id' => $reg_product_id);
                    $primary_reference_no = getProductPrimaryReferenceNo($where_statement, 'tra_product_applications');
                    // dd($primary_reference_no);
                    $codes_array = array(
                        'ref_no' => $primary_reference_no
                    );
                    $ref_number = generateProductsSubRefNumber($reg_product_id, $applications_table, $ref_id, $codes_array, $sub_module_id, $user_id);

                    if (!validateIsNumeric($ref_id )) {
                        DB::rollback();
                        return \response()->json(array('success'=>false, 'message'=>'Reference No Format has not been set, contact the system administrator'));
                    }
                    else if( $ref_number == ''){
                        DB::rollback();
                        return \response()->json(array('success'=>false,'tracking_no'=>$tracking_no, 'message'=>$tracking_no));
                    }


                    $where_statement = array('tra_product_id' => $product_id);
                    //save other applications details
                    $view_id = generateApplicationViewID();
                    //  'view_id'=>$view_id,
                    $app_data = array(
                        "process_id" => $request->input('process_id'),
                        'view_id' => $view_id,
                        "reg_serial" => $reg_serial,
                        "workflow_stage_id" => $request->input('workflow_stage_id'),
                        "application_status_id" => $application_status->status_id,
                        "application_code" => $application_code,
                        "reference_no" => $ref_number,
                        "tracking_no" => $ref_number,
                        "applicant_id" => $request->input('applicant_id'),
                        "sub_module_id" => $request->input('sub_module_id'),
                        "module_id" => $request->input('module_id'),
                        "section_id" => $request->input('section_id'),
                        "product_id" => $product_id,
                        "local_agent_id" => $request->input('local_applicant_id'),
                        "paying_currency_id" => $request->input('paying_currency_id'),
                        "assessment_procedure_id" => $request->input('assessment_procedure_id'),
                        "assessmentprocedure_type_id" => $request->input('assessmentprocedure_type_id'),
                        'prodclass_category_id' => $prodclass_category_id,
                        "product_type_id" => $request->input('product_type_id'),
                        "date_added" => Carbon::now(),
                        'appeal_type_id' => $appeal_type_id,
                        'withdrawal_type_id' => $withdrawal_type_id,
                        'reg_product_id' => $reg_product_id,
                        "created_by" => \Auth::user()->id,
                        "fasttrack_option_id" => $request->input('fasttrack_option_id'),
                        "created_on" => Carbon::now());

                    $res = insertRecord('tra_product_applications', $app_data, $user_id);
                    if(!isset($res['record_id'])){
                        DB::rollback();
                        return $res;
                    }
                    $active_application_id = $res['record_id'];

                    //add to submissions table
                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => $process_id,
                        'application_code' => $application_code,
                        'prodclass_category_id' => $prodclass_category_id,
                        'reference_no' => $ref_number,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'section_id' => $section_id,
                        'application_status_id' => $application_status->status_id,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => $branch_id,
                        'remarks' => 'Initial save of the application',
                        "is_fast_track" => $request->input('fasttrack_option_id'),
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => $user_id
                    );

                    insertRecord('tra_submissions', $submission_params, $user_id);
                    $res['active_application_id'] = $active_application_id;
                    $res['application_code'] = $application_code;
                    $res['active_application_code'] = $application_code;
                    $res['product_id'] = $product_id;
                    $res['ref_no'] = $ref_number;
                    //dublicate additional Information
                    $this->updateRenewalProductAdditionalInformation($product_id, $tra_product_id, $reg_product_id);

                    initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $ref_number.rand(10,100), $user_id);
                    //docuements add reg id
                     $update_reg = array('reg_record_id'=>$reg_product_id);

                     $application_code = getSingleRecordColValue('tra_registered_products', ['id'=>$reg_product_id], 'active_application_code');

                    if(validateIsNumeric($application_code)){
                        updateRecord('tra_application_uploadeddocuments', ['application_code'=>$application_code], $update_reg);
                    }
                    DB::commit();

            }

        } catch (\Exception $exception) {
            DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);


    }
    public function updateRenewalProductAdditionalInformation($new_product, $tra_product_id, $reg_product_id){
        try{
            if(!validateIsNumeric($tra_product_id)){
                $tra_product_id = getSingleRecordColValue('tra_registered_products', ['id'=>$reg_product_id], 'tra_product_id');
            }
            //update ingredients
            $ing_data = DB::table('tra_product_ingredients')->where('product_id', $tra_product_id)->get();
            $update_ing = array();

            foreach ($ing_data as $ing) {
                $ing->product_id = $new_product;
                unset($ing->id);
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_ingredients', $update_ing);
            }

             //update tra_product_packaging
            $ing_data = DB::table('tra_product_packaging')->where('product_id', $tra_product_id)->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_packaging', $update_ing);
            }

            //update manufactu
            $ing_data = DB::table('tra_product_manufacturers')->where(['product_id' => $tra_product_id, 'manufacturer_type_id'=>1])->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_manufacturers', $update_ing);
            }

            //update API manufactu
            $ing_data = DB::table('tra_product_manufacturers')->where(['product_id' => $tra_product_id, 'manufacturer_type_id'=>2])->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_product_manufacturers', $update_ing);
            }
            //update inspection in other countries
            $ing_data = DB::table('tra_otherstates_productgmpinspections')->where(['product_id' => $tra_product_id])->get();
            $update_ing = array();
            foreach ($ing_data as $ing) {
                unset($ing->id);
                $ing->product_id = $new_product;
                $update_ing[] = (array)$ing;
            }
            if(isset($update_ing[0])){
                insertMultipleRecords('tra_otherstates_productgmpinspections', $update_ing);
            }
         $res = array('success'=>true, 'message'=>'all is well');
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;
    }

 public function saveNewProductReceivingBaseDetails(Request $request, $inCall=0)
    {
        try {
            DB::beginTransaction();
			$tracking_no='';
            $active_application_id = $request->input('active_application_id');
            $applicant_id = $request->input('applicant_id');
            $process_id = $request->input('process_id');
            $workflow_stage_id = $request->input('workflow_stage_id');
            $branch_id = $request->input('branch_id');
            $section_id = $request->input('section_id');
            $module_id = $request->input('module_id');
            $sub_module_id = $request->input('sub_module_id');
            $local_agent_id = $request->input('local_applicant_id');
            $user_id = $this->user_id;
            $product_id = $request->input('product_id');
            $classification_id = $request->input('classification_id');
            $assessment_procedure_id = $request->input('assessment_procedure_id');
            $product_origin_id = $request->input('product_origin_id');
            $assessmentprocedure_type_id = $request->input('assessmentprocedure_type_id');
            $prodclass_category_id = $request->input('prodclass_category_id');
            $tra_product_id = $request->input('tra_product_id');
            $reg_product_id = $request->input('reg_product_id');
			$screening_approval_date = $request->input('screening_approval_date');
			$mgr_application_no = $request->input('mgr_application_no');
            $reg_serial = $request->reg_serial;
            $screening_no = $request->screening_no;
			$is_register_update = $request->is_register_update;

            $prod_data = array(
                'common_name_id'=>$request->common_name_id,
				'common_name' => $request->common_name,
                'classification_id'=>$request->classification_id,
                'chemical_entities_type_id'=>$request->chemical_entities_type_id,
                'efficacy_proof_type_id'=>$request->efficacy_proof_type_id,
                'brand_name'=>$request->brand_name,
                'product_type_id'=>$request->product_type_id,
                // 'product_subcategory_id'=>$request->product_subcategory_id,
                'physical_description'=>$request->physical_description,
                'dosage_form_id'=>$request->dosage_form_id,
                // 'product_form_id'=>$request->product_form_id,
                'strength'=>$request->strength,
                'storage_condition'=>$request->storage_condition,
                'product_origin_id'=>$product_origin_id,
                // 'product_subcategory_id'=>$request->product_subcategory_id,
                // 'distribution_category_id'=>$request->distribution_category_id,
                // 'special_category_id'=>$request->special_category_id,
                'intended_enduser_id'=>$request->intended_enduser_id,
                'intended_use_id'=>$request->intended_use_id,
                'route_of_administration_id'=>$request->route_of_administration_id,
                // 'method_ofuse_id'=>$request->method_ofuse_id,
                // 'section_id'=>$request->section_id,
                'contraindication'=>$request->contraindication,
                'gmdn_code'=>$request->gmdn_code,
                'gmdn_category_id'=>$request->gmdn_category_id,
                'gmdn_term'=>$request->gmdn_term,
                'shelf_lifeafter_opening'=>$request->shelf_lifeafter_opening,
                'shelf_life'=>$request->shelf_life,
                'instructions_of_use'=>$request->instructions_of_use,
                'warnings'=>$request->warnings,
                'intended_use'=>$request->intended_use,
                'paying_currency_id'=>$request->paying_currency_id,
                'fasttrack_option_id'=>$request->fasttrack_option_id,
                'bhcp_number'=>$request->bhcp_number,
                'qualifications'=>$request->qualifications,
                'remarks'=>$request->remarks,
                // 'medical_systemmodel_series'=>$request->medical_systemmodel_series,

                // 'shelflifeduration_desc'=>$request->shelflifeduration_desc,
                // 'shelflifeafteropeningduration_desc'=>$request->shelflifeafteropeningduration_desc,
                // 'reason_for_classification_id'=>$request->reason_for_classification_id,
                // 'prodclass_category_id'=>$prodclass_category_id,
                // 'productrisk_category_id'=>$request->productrisk_category_id,
                // 'reagents_accessories'=>$request->reagents_accessories,
                'has_family'=>$request->has_family,
                'device_family'=>$request->device_family,
                'has_reagents'=>$request->has_reagents,
                'device_reagents'=>$request->device_reagents,
                'has_accessories'=>$request->has_accessories,
                'device_accessories'=>$request->device_accessories,
                'pack_unit_id'=>$request->pack_unit_id,
                'quantity'=>$request->quantity,
                'indications'=>$request->indications,
                'strength_si_unit'=>$request->strength_si_unit,
                'model_name'=>$request->model_name,
                'software_version'=>$request->software_version,
                'device_intended_use'=>$request->device_intended_use,
                'device_brand_name'=>$request->device_brand_name,
                'device_report'=>$request->device_report,
                'productrisk_category_id'=>$request->productrisk_category_id,
                'clinical_condition'=>$request->clinical_condition,
                // 'stability_studies_data_id'=>$request->stability_studies_data_id,
                'device_classification_rules_id'=>$request->device_classification_rules_id,
				'device_cluster' =>$request->device_cluster,
				'device_compliance_standards' =>$request->device_compliance_standards,
				'gs1_udi' =>$request->gs1_udi,
				'udi_available' => $request->udi_available,
				'gs1_udi_available' => $request->gs1_udi_available,
				'has_cluster' => $request->has_cluster,
				'qms_area' => $request->qms_area,
				'qms_established' => $request->qms_established,
				'technical_doc_summary' => $request->technical_doc_summary,
                'listing_no' => $request->listing_no,
                'is_listed' => $request->is_listed,
				'colourant_variation' => $request->colourant_variation,
				'country_id' => $request->country_id,
                'is_b_listed' => $request->is_b_listed,
				'schedule_id' => $request->schedule_id,
                'pack_size' => $request->pack_size,
                //'is_ltr_importer'=> $request->is_ltr_importer,
                //'md_importer'=> $request->md_importer,

            );
            if (validateIsNumeric($active_application_id)) {
                //update
                $applications_table = 'tra_product_applications';
				//registration serial
				if(!validateIsNumeric($reg_serial)){
					$reg_serial = getRegistrationSerial($module_id);
				}
                $products_table = 'tra_product_information';
                //Application_edit
                $application_params = array(
                    'applicant_id' => $applicant_id,
                    'local_agent_id' => $local_agent_id,
                    'prodclass_category_id'=>$prodclass_category_id,
                    'assessmentprocedure_type_id' => $assessmentprocedure_type_id,
                    'assessment_procedure_id' => $assessment_procedure_id,
                    "paying_currency_id" => $request->input('paying_currency_id'),
                    "fasttrack_option_id" => $request->input('fasttrack_option_id'),
                    'branch_id' => $branch_id,
					'mgr_application_no' => $mgr_application_no,
					'screening_approval_date' => $screening_approval_date,
					'reg_serial' => $reg_serial
                ); //where_module
				$application_params = array_filter($application_params);
                $where_product = array(
                    'id' => $product_id
                );
                $where_app = array(
                    'id' => $active_application_id
                );
				
                $app_details = array();
                if (recordExists($applications_table, $where_app)) {
                    //$app_details = getTableData($applications_table, $where_app);
                    $app_details = getPreviousRecords($applications_table, $where_app);
                    if ($app_details['success'] == false) {
                        DB::rollBack();
                        return $app_details;
                    }
                    $app_details = $app_details['results'];
                    $update_res = updateRecord($applications_table, $where_app, $application_params, $user_id);
                    if($update_res['success']== false){
                        DB::rollBack();
                        return $update_res;
                    }
                }
                $application_code = $app_details[0]['application_code'];//$app_details->application_code;
                $tracking_no = $app_details[0]['tracking_no'];
                $ref_number = $app_details[0]['reference_no'];//$app_details->reference_no;
				//update screening number if not same
				if($screening_no != '' && strlen($screening_no) > 5 && !validateIsNumeric($is_register_update)){
					//dd($tracking_no);
					//if(trim($screening_no) != $tracking_no){
						updateRecord($applications_table, $where_app, ['tracking_no' => $screening_no], $user_id);
						updateRecord('tra_submissions', ['application_code' => $application_code], ['tracking_no' => $screening_no], $user_id);
					//}
				}
                if(validateIsNumeric($is_register_update)){
                    //log changes to register
					$log = insertRecord('tra_register_updates_logs', ['alteration_by'=>getSingleRecordColValue('users', ['id' => $user_id], 'email'), 'updated_application_code'=>$application_code, 'updated_tracking_no'=>$tracking_no]);
					if(!isset($log['record_id'])){
						DB::rollBack();
						return $log;
					}
                }
			
                $where_product = array(
                    'id' => $product_id
                );
                //Premise_edit where_module
                $prod_data['dola'] = Carbon::now();
                $prod_data['altered_by'] = $user_id;
                $previous_data = getPreviousRecords($products_table, $where_product);
                if ($previous_data['success'] == false) {
                    DB::rollBack();
                    return $previous_data;
                }
                $previous_data = $previous_data['results'];
                $res = updateRecord($products_table, $where_product, $prod_data, $user_id);
                initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
                $res['active_application_id'] = $active_application_id;
                $res['active_application_code'] = $application_code;
                $res['product_id'] = $product_id;
                $res['ref_no'] = $tracking_no;
                $res['tracking_no'] = $tracking_no;
                DB::commit();
            } 
            else {


                    $prod_data['created_by'] = \Auth::user()->id;
                    $prod_data['created_on'] = Carbon::now();

                    $res = insertRecord('tra_product_information', $prod_data, $user_id);
					
                    if($res['success']== false){
                        DB::rollBack();
                        return $res;
                    }
                    //dublicate to portal
                    // insertRecord('wb_product_information', $prod_data, $user_id, 'portal_db');
                    $record_id = $res['record_id'];
                    $product_id = $res['record_id'];
                    $applications_table = 'tra_product_applications';
                    $application_code = generateApplicationCode($sub_module_id, $applications_table);
                    $application_status = getApplicationInitialStatus($module_id, $sub_module_id);
                    $codes_array = $this->getProductApplicationReferenceCodes($request);
                    // dd($codes_array);
				  if(trim($screening_no) != ''){
						$check_tracking_no = DB::table('tra_product_applications')->where('tracking_no', trim($screening_no))->first();
						if(isset($check_tracking_no->id)){
							$res = ['success'=> false, 'message' => 'Application with that tracking number exists please check your intray to update it'];
							DB::rollBack();
							return $res;
						}
						$tracking_details = ['tracking_no'=> trim($screening_no), 'success'=> true];
						
					}
					
					else{

						$tracking_details = generateApplicationTrackingNumber($sub_module_id, 1, $codes_array, $section_id, $process_id, $branch_id, $user_id);
						// dd($tracking_details);
                        if ($tracking_details['success'] == false) {
							DB::rollBack();
							return \response()->json($tracking_details);
						}
						$tracking_no = $tracking_details['tracking_no'];
					}
					//if($request->mgr_application_no != ''){
					//	$tracking_no = $request->mgr_application_no;
					//}else{
						$tracking_no = $tracking_details['tracking_no'];
					//}
                    
                    $registration_data = array('tra_product_id' => $product_id,
                        'status_id' => $application_status->status_id,
                        'validity_status_id' => 1,
                        'registration_status_id' => 1
                    );
                    $where_statement = array('tra_product_id' => $product_id);

                    saveApplicationRegistrationDetails('tra_registered_products', $registration_data, $where_statement, $user_id);
                    //registration serial
                    if(!validateIsNumeric($reg_serial)){
                        $reg_serial = getRegistrationSerial($module_id);
                    }
                    $view_id = generateApplicationViewID();
                    //  'view_id'=>$view_id,
                    $app_data = array(
                        "process_id" => $request->input('process_id'),
                        "workflow_stage_id" => $request->input('workflow_stage_id'),
                        "application_status_id" => $application_status->status_id,
                        "application_code" => $application_code,
                        "tracking_no" => $tracking_no,
						"reference_no" => $request->mgr_application_no,
                        'view_id' => $view_id,
						'mgr_application_no' => $request->mgr_application_no,
						'screening_approval_date' => $screening_approval_date,
                        "reg_serial" => $reg_serial,
                        "applicant_id" => $request->input('applicant_id'),
                        "sub_module_id" => $request->input('sub_module_id'),
                        "module_id" => $request->input('module_id'),
                        "section_id" => $request->input('section_id'),
                        "product_id" => $product_id,
                        "paying_currency_id" => $request->input('paying_currency_id'),
                        "local_agent_id" => $local_agent_id,
                        "branch_id" => $branch_id,
                        "assessment_procedure_id" => $request->input('assessment_procedure_id'),
                        "assessmentprocedure_type_id" => $request->input('assessmentprocedure_type_id'),
                        "fasttrack_option_id" => $request->input('fasttrack_option_id'),
                        "prodclass_category_id" => $prodclass_category_id,
                        "date_added" => Carbon::now(),
                        "created_by" => \Auth::user()->id,
                        "created_on" => Carbon::now());

                    $res = insertRecord('tra_product_applications', $app_data, $user_id);
                    if ($res['success'] == false) {
                            DB::rollBack();
                            return $res;
                        }
                    //duplicate to portal
                    // insertRecord('wb_product_applications', $app_data, $user_id, 'portal_db');

                    $active_application_id = $res['record_id'];

                    if($sub_module_id == 70){
                        //dublicate additional Information
                        $this->updateRenewalProductAdditionalInformation($product_id, $tra_product_id, $reg_product_id);
                    }


                    //add to submissions table
                    $submission_params = array(
                        'application_id' => $active_application_id,
                        'process_id' => $process_id,
                        'application_code' => $application_code,
                        'prodclass_category_id' => $prodclass_category_id,
                        "tracking_no" => $tracking_no,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $workflow_stage_id,
                        'current_stage' => $workflow_stage_id,
                        'module_id' => $module_id,
                        'sub_module_id' => $sub_module_id,
                        'section_id' => $section_id,
                        'application_status_id' => $application_status->status_id,
                        'urgency' => 1,
                        'applicant_id' => $applicant_id,
                        'branch_id' => $branch_id,
                        'remarks' => 'Initial save of the application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'is_fast_track' => $request->input('fasttrack_option_id'),
                        'created_by' => $user_id
                    );

                    $sub_res = insertRecord('tra_submissions', $submission_params);
                    if(!$sub_res['success']){
                        return $sub_res;
                    }
                    //log registration request
                    if(validateIsNumeric($tra_product_id)){
                        $data = array(
                            'screening_product_id' => $tra_product_id,
                            'reg_product_id' => $product_id,
                            'request_date' => Carbon::now(),
                            'initiated_by' => $user_id
                        );
                       insertRecord('tra_product_registration_requests', $data);

                    }

                    $res['active_application_id'] = $active_application_id;
                    $res['active_application_code'] = $application_code;
                    $res['product_id'] = $product_id;
                    $res['ref_no'] = $tracking_no;
                    $res['tracking_no'] = $tracking_no;

                    DB::commit();

                    // //dms function
                    //  $nodetracking = str_replace("/", "-", $tracking_no);
                    //  $parentnode_ref = $dms_node_details->node_ref; 

                    //  $node_details = array(
                    //      'name' => $nodetracking,
                    //      'nodeType' => 'cm:folder');
              initializeApplicationDMS($section_id, $module_id, $sub_module_id, $application_code, $tracking_no.rand(10,100), $user_id);
                //send acknowledgement


            }
            //update species if provided
            $species = json_decode($request->species_ids);
            if(is_array($species) and !empty($species)){
                foreach ($species as $specie) {
                    $species_array[] = array(
                        'product_id' => $product_id,
                        'species_id' => $species_id
                    ); 
                    deleteRecord('tra_product_species', array(
                        'product_id' => $product_id
                    ));
                }
                if(!empty($species_array)){
                    insertMultipleRecords('tra_product_species', $species_array);
                }
            }

        } catch (\Exception $exception) {
			// dd($exception->getMessage());
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        if($inCall == 1){
            return $res;
        }
        return \response()->json($res);
    }
     public function saveNewProductRegistrationBaseDetails(Request $request)
    {
        try {
            $active_application_id = $request->active_application_id;
            $sub_module_id = $request->sub_module_id;
            $user_id = $this->user_id;
            $rec = DB::table('tra_product_applications')->where('id', $active_application_id)->first();
            if(validateIsNumeric($active_application_id) && isset($rec->id)> 0  && validateisNumeric($sub_module_id)){
                $application_code = $rec->application_code;
                //update sub module
                updateRecord('tra_product_applications', ['id'=>$active_application_id], ['sub_module_id'=> $sub_module_id]);
                //log evaluation request
                $eva_data = array(
                    'application_code' => $application_code,
                    'requested_on' => Carbon::now(),
                    'requested_by' => $this->user_id
                );
                $res = $this->saveNewProductReceivingBaseDetails($request, 1);
                if($res['success']){
                    //add transition
                    $last_sub =
                    $submission_params = array(
                        'application_id' => $request->active_application_id,
                        'process_id' => $request->process_id,
                        'application_code' => $rec->application_code,
                        'prodclass_category_id' => $rec->prodclass_category_id,
                        "tracking_no" => $rec->tracking_no,
                        'usr_from' => $user_id,
                        'usr_to' => $user_id,
                        'previous_stage' => $request->workflow_stage_id,
                        'current_stage' => $request->workflow_stage_id,
                        'module_id' => $request->module_id,
                        'sub_module_id' => $request->sub_module_id,
                        'section_id' => $request->section_id,
                        'application_status_id' => $request->status_id,
                        'urgency' => 1,
                        'applicant_id' => $request->applicant_id,
                        'branch_id' => $request->branch_id,
                        'remarks' => 'Initial save of the application',
                        'date_received' => Carbon::now(),
                        'created_on' => Carbon::now(),
                        'created_by' => $user_id
                    );
                    //add to submissions table
                    $check = DB::table('tra_product_evaluation_requests')->where('application_code', $application_code)->count();
                    if($check == 0 ){
                        $log = insertRecord('tra_product_evaluation_requests', $eva_data);
                        if(!$log['success']){
                            return $log;
                        }
                        $log = insertRecord('tra_submissions', $submission_params);
                        if(!$log['success']){
                            return $log;
                        }
                    }
                }

            }else{
                $res = array(
                    'success' => false,
                    'message'=> 'Screening Application not found'
                );
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function uploadApplicationFile(Request $req)
    {
        $application_id = $req->input('application_id');
        $description = $req->input('description');
        $user_id = $this->user_id;
        $res = array();
        try {
            $record = DB::table('tra_product_applications')
                ->where('id', $application_id)
                ->first();
            $application_code = $record->application_code;
            $workflow_stage_id = $record->workflow_stage_id;

            if ($req->hasFile('uploaded_doc')) {
                $file = $req->file('uploaded_doc');
                $origFileName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $fileSize = $file->getClientSize();
                $folder = '\resources\uploads';
                $destination = getcwd() . $folder;
                $savedName = str_random(5) . time() . '.' . $extension;
                $file->move($destination, $savedName);
                $params = array(
                    'application_id' => $application_id,
                    'application_code' => $application_code,
                    'workflow_stage_id' => $workflow_stage_id,
                    'initial_filename' => $origFileName,
                    'savedname' => $savedName,
                    'filesize' => formatBytes($fileSize),
                    'filetype' => $extension,
                    'server_filepath' => $destination,
                    'server_folder' => $folder,
                    'description' => $description,
                    'created_on' => Carbon::now(),
                    'created_by' => \Auth::user()->id
                );

                $res = insertRecord('tra_product_application_uploads', $params, $user_id);
                if ($res['success'] == true) {
                    $res = array(
                        'success' => true,
                        'message' => 'File uploaded successfully!!'
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

    public function getElementCosts(Request $request)
    {
        $feeType = $request->input('fee_type');
        $costSubCat = $request->input('cost_subcategory');
        $where = array(
            't1.fee_type_id' => $feeType,
            't1.sub_cat_id' => $costSubCat
        );
        try {
            $qry = DB::table('element_costs as t1')
                ->join('cost_elements as t2', 't1.element_id', 't2.id')
                ->join('cost_sub_elements as t3', 't1.sub_element_id', 't3.id')
                ->join('par_currencies as t4', 't1.currency_id', 't4.id')
                ->join('par_cost_sub_categories as t5', 't1.sub_cat_id', 't5.id')
                ->join('par_cost_categories as t6', 't5.cost_category_id', 't6.id')
                ->join('par_exchange_rates as t7', 't4.id', 't7.currency_id')
                ->select('t1.*', 't1.id as element_costs_id', 't4.id as currency_id', 't2.name as element', 't3.name as sub_element',
                    't4.name as currency', 't5.name as sub_category', 't6.name as category', 't7.exchange_rate')
                ->where($where);
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

    public function saveApplicationInvoicingDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $invoice_id = $request->input('invoice_id');
        $details = $request->input();
        $user_id = $this->user_id;
        unset($details['_token']);
        unset($details['application_id']);
        unset($details['application_code']);
        unset($details['invoice_id']);
        try {
            if (isset($invoice_id) && $invoice_id != '') {
                $invoice_no = '';
            } else {
                $invoice_no = generateInvoiceNo($user_id);
                $invoice_params = array(
                    'invoice_no' => $invoice_no,
                    'application_id' => $application_id,
                    'application_code' => $application_code
                );
                $res = insertRecord('tra_application_invoices', $invoice_params, $user_id);
                if ($res['success'] == false) {
                    return \response()->json($res);
                }
                $invoice_id = $res['record_id'];
            }
            $params = array();
            foreach ($details as $detail) {
                //check
                $element_costs_id = $detail['element_costs_id'];
                $where_check = array(
                    'invoice_id' => $invoice_id,
                    'element_costs_id' => $element_costs_id
                );
                if (DB::table('tra_invoice_details')
                        ->where($where_check)
                        ->count() < 1) {
                    $params[] = array(
                        'invoice_id' => $invoice_id,
                        'element_costs_id' => $element_costs_id,
                        'element_amount' => $detail['cost'],
                        'currency_id' => $detail['currency_id'],
                        'exchange_rate' => $detail['exchange_rate']
                    );
                }
            }
            DB::table('tra_invoice_details')->insert($params);
            $res = array(
                'success' => true,
                'invoice_id' => $invoice_id,
                'invoice_no' => $invoice_no,
                'message' => 'Invoice details saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

     public function getManagerEvaluationApplications(Request $request)
    {

        $table_name = $request->input('table_name');

        $workflow_stage = $request->input('workflow_stage_id');

        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', function ($join) {
                    $join->on('t1.application_status_id', '=', 't4.id');
                })
                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_classifications as t7', 't2.classification_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')
                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                 ->leftJoin('tra_submissions as t9', 't1.application_code', '=', 't9.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('par_prodclass_categories as t11', 't2.prodclass_category_id', '=', 't11.id')
                ->leftJoin('tra_certificate_changes as t12', function ($join) {
                    $join->on('t1.application_code', '=', 't12.application_code');
                    $join->where('t12.change_decision_id', 3);
                    $join->orWhereNull('t12.change_decision_id');
                    $join->limit(1);
                })
                ->select('t1.*', 't11.name as device_type', 't7.name as classification_name', 't10.username as submitted_by', 't9.date_received as submitted_on', 't8.name as common_name', 't2.brand_name as product_name', 't3.name as applicant_name', 't4.name as application_status',
                    't6.name as approval_status', 't5.decision_id', 't1.id as active_application_id', 't12.id as is_processed')
                ->where(array('t9.current_stage'=>$workflow_stage,'t9.is_done'=>0));

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
    public function getManagerProductDataAmmendApps(Request $request)
    {

        $table_name = $request->input('table_name');
        $workflow_stage = $request->input('workflow_stage_id');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->leftJoin('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', function ($join) {
                    $join->on('t1.application_status_id', '=', 't4.id');
                })
                ->leftJoin('par_classifications as t7', 't2.classification_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')
                ->leftJoin('tra_submissions as t9', 't1.application_code', '=', 't9.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('par_device_types as t11', 't2.device_type_id', '=', 't11.id')
                ->select('t1.*', 't11.name as device_type', 't7.name as classification_name', 't10.username as submitted_by', 't9.date_received as submitted_on', 't8.name as common_name', 't2.brand_name as product_name', 't3.name as applicant_name', 't4.name as application_status',
                  't1.id as active_application_id')
                ->where('t9.current_stage', $workflow_stage);

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



    public function getTcMeetingParticipants(Request $request)
    {
        $meeting_id = $request->input('meeting_id');
        try {
            $qry = DB::table('tc_meeting_participants as t1')
                ->select('t1.*')
                ->where('t1.meeting_id', $meeting_id);
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

    public function getManagerAuditingApplications(Request $request)
    {
        $table_name = $request->input('table_name');
        $workflow_stage = $request->input('workflow_stage_id');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', function ($join) {
                    $join->on('t1.application_status_id', '=', 't4.id');
                })

                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_classifications as t7', 't2.classification_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')

                ->leftJoin('tra_submissions as t9', 't9.application_code', '=', 't1.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('tra_applications_comments as t11', function ($join) {
                    $join->on('t1.application_code', '=', 't11.application_code')
                        ->where('t11.is_current', 1)
                        ->where('t11.comment_type_id', 2);
                })
                ->leftJoin('par_evaluation_recommendations as t12', 't11.recommendation_id', '=', 't12.id')
                ->leftJoin('tra_applications_comments as t13', function ($join) {
                    $join->on('t1.application_code', '=', 't13.application_code')
                        ->where('t13.is_current', 1)
                        ->where('t13.comment_type_id', 3);
                })
                ->leftJoin('par_evaluation_recommendations as t14', 't13.recommendation_id', '=', 't14.id')

                ->select('t1.*', 't12.name as evaluator_recommendation', 't2.product_origin_id', 't2.product_subcategory_id', 't14.name as auditor_recommendation', 't2.brand_name as product_name', 't7.name as classification_name', 't10.username as submitted_by', 't9.date_received as submitted_on', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t2.classification_id','t2.prodclass_category_id',
                    't5.decision_id', 't1.id as active_application_id')
                ->where(array('t9.current_stage'=>$workflow_stage,'is_done'=>0) );

            $results = $qry->orderBy('t9.id','desc')->get();
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

    public function getGrantingDecisionApplications(Request $request)
    {
        $table_name = $request->input('table_name');
//        $workflow_stage = $request->input('workflow_stage_id');
        $wf = DB::table("wf_workflow_stages")->where('name', '=', 'Granting Decision')->first();
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('par_application_statuses as t4', function ($join) {
                    $join->on('t1.application_status_id', '=', 't4.id')
                        ->on('t1.process_id', '=', 't4.process_id');
                })
                ->select('t1.*', 't2.brand_name', 't3.name as applicant_name', 't4.name as application_status')
                ->where('t1.workflow_stage_id', $wf->id);
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

    public function saveMeeting(Request $request)
    {
        try {
            $meetingId = DB::transaction(function () use ($request) {
                $meetingId = insertRecordNoTransaction('tra_product_application_meetings',
                    [
                        "title" => $request->input('title'),
                        "description" => $request->input('dezcription'),
                        "date_requested" => Carbon::parse($request->input('date_requested')),
                        "physical_address" => $request->input('physical_address')
                    ], \Auth::user()->id);
                $members = $request->input('members');
                foreach ($members as $member) {
                    insertRecordNoTransaction('tra_product_application_meeting_members',
                        [
                            "product_application_meeting_id" => $meetingId,
                            "member_name" => $member
                        ]
                        , \Auth::user()->id);
                }

                return $meetingId;

            });

            $res = array(
                'success' => true,
                'meeting_id' => $meetingId,
                'message' => 'Meeting Saved!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return \response()->json($res);
    }

    public function getApplicationUploadedDocs(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $workflow_stage_id = $request->input('workflow_stage_id');
        try {
            $qry = DB::table('tra_product_application_uploads as t1')
                ->leftJoin('wf_workflow_stages as t2', 't1.workflow_stage_id', '=', 't2.id')
                ->select('t1.*', 't2.name as stage_name')
                ->where('t1.application_id', $application_id);
            if (isset($workflow_stage_id) && $workflow_stage_id != '') {
                $qry->where('t1.workflow_stage_id', $workflow_stage_id);
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

    public function saveSample(Request $request)
    {
        try {
            $sampleRecord = array(
                'application_id' => $request->input('application_id'),
                'brand_name' => $request->input('brand_name'),
                'batch_number' => $request->input('batch_no'),
                'expiry_date' => Carbon::parse($request->input('expiry_date')),
                'submission_date' => carbon::parse($request->input('submission_date')),
                'storage_condition_id' => $request->input('storage_condition_id'),
                'shelf_life_months' => $request->input('shelf_life'),
                'shelf_life_after_opening' => $request->input('shelf_life_after_opening')
            );
            $res = insertRecord('tra_product_samples', $sampleRecord, \Auth::user()->id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function onRegisteredProductsSearchdetails(Request $req)
    {

        $reg_product_id = $req->input('reg_product_id');
        $tra_product_id = $req->input('tra_product_id');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_product_applications as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->where('t2.id', $tra_product_id);

            $qry1 = clone $main_qry;
            $qry1->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->select('t1.*', 't2.brand_name as brand_name', 't1.product_id as tra_product_id',
                    't3.name as applicant_name', 't3.contact_person','t1.id as active_application_id','t1.application_code as active_application_code',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't2.*');

            $results = $qry1->first();
            $results->product_id = '';
            $qry2 = clone $main_qry;
            $qry2->join('wb_trader_account as t3', 't1.local_agent_id', '=', 't3.id')
                ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            $ltrDetails = $qry2->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'ltrDetails' => $ltrDetails,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }



    public function prepareOnlineProductReceivingStage(Request $req)
    {

        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::connection('portal_db')->table('wb_product_applications as t1')
                ->join('wb_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_statuses as q', 't1.application_status_id', '=', 'q.id')
                ->where('t1.id', $application_id);

            $qry1 = clone $main_qry;
            $qry1->join('wb_trader_account as t3', 't1.trader_id', '=', 't3.id')
                ->select('t1.*', 'q.status_type_id','q.name as application_status', 't1.id as active_application_id', 't2.brand_name as brand_name',
                    't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't2.*');

            $results = $qry1->first();

            $qry2 = clone $main_qry;
            $qry2->join('wb_trader_account as t3', 't1.local_agent_id', '=', 't3.id')
                ->select('t3.id as trader_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            $ltrDetails = $qry2->first();
            $where = array(
                'module_id' => $results->module_id,
                'sub_module_id' => $results->sub_module_id,
                'section_id' => $results->section_id
            );
                $results->process_name = getSingleRecordColValue('wf_processes', $where, 'name');
        $atc_codedetails = getSingleRecord('par_atc_codes',array('id'=>$results->atc_code_id));
        if($atc_codedetails){
            $results->atc_code = $atc_codedetails->name;
            $results->atc_code_description = $atc_codedetails->description;
        }
            $res = array(
                'success' => true,
                'results' => $results,
                'ltrDetails' => $ltrDetails,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function prepareProductsInvoicingStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $table_name = $request->input('table_name');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('wb_trader_account as t2', 't1.applicant_id', '=', 't2.id')
                ->leftJoin('tra_application_invoices as t3', function ($join) use ($application_code) {
                    $join->on('t1.id', '=', 't3.application_id')
                        ->on('t3.application_code', '=', DB::raw($application_code));
                })
                ->join('tra_product_information as t4', 't1.product_id', '=', 't4.id')
                ->select(DB::raw("t1.applicant_id,t1.product_id,CONCAT_WS(',',t2.name,t2.postal_address) as applicant_details, t3.id as invoice_id, t3.invoice_no,t3.isLocked,t3.paying_currency_id,t1.is_fast_track,t1.paying_currency_id as apppaying_currency_id, t3.isLocked,
                t1.section_id,t1.module_id,CONCAT_WS(',',t4.brand_name,t4.physical_description) as product_details"))
                ->where('t1.id', $application_id);

            $results = $qry->first();
            if (!$results->invoice_id) {

                $results->paying_currency_id = $results->apppaying_currency_id;

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
    public function prepareNewProductReceivingStage(Request $req)
    {
        
        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_product_applications as t1')
                ->leftJoin('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('par_atc_codes as t5', 't2.atc_code_id', '=', 't5.id')
                ->where('t1.id', $application_id);

            $qry1 = clone $main_qry;
            $qry1->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('tra_application_invoices as t4', function ($join) use ($application_code) {
                    $join->on('t1.id', '=', 't4.application_id')
                        ->on('t4.application_code', '=', 't4.application_code');
                })
                ->select('t1.*', 't5.name as atc_code', 't5.description as atc_code_description', 't1.id as active_application_id', 't2.brand_name as brand_name',
                    't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't2.*', 't4.id as invoice_id', 't4.invoice_no', 't1.paying_currency_id', 't1.product_id as tra_product_id');

            $results = $qry1->first();

            $qry2 = clone $main_qry;
            $qry2->join('wb_trader_account as t3', 't1.local_agent_id', '=', 't3.id')
                ->select('t1.product_id','t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            $ltrDetails = $qry2->first();
            $res = array(
                'success' => true,
                'results' => $results,
                'ltrDetails' => $ltrDetails,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function prepareNewProductAmmendMentReceivingStage(Request $req)
    {

        $application_id = $req->input('application_id');
        $application_code = $req->input('application_code');
        $table_name = $req->input('table_name');
        try {
            $main_qry = DB::table('tra_product_applications as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')

                ->leftJoin('par_atc_codes as t5', 't2.atc_code_id', '=', 't5.id')
                ->join('tra_appdata_ammendementrequests as t6', 't1.application_code','t6.application_code')
                ->where('t1.id', $application_id);

            $qry1 = clone $main_qry;
            $qry1->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('tra_application_invoices as t4', function ($join) use ($application_code) {
                    $join->on('t1.id', '=', 't4.application_id')
                        ->on('t4.application_code', '=', 't4.application_code');
                })
                ->select('t1.*','t6.id as appdata_ammendementrequest_id', 't5.name as atc_code', 't5.description as atc_code_description', 't1.id as active_application_id', 't2.brand_name as brand_name',
                    't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't2.*', 't4.id as invoice_id', 't4.invoice_no');

            $results = $qry1->first();

            $qry2 = clone $main_qry;
            $qry2->join('wb_trader_account as t3', 't1.local_agent_id', '=', 't3.id')
                ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            $ltrDetails = $qry2->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'ltrDetails' => $ltrDetails,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function prepareProductsUniformStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $table_name = $request->input('table_name');

        try {

            $main_qry = DB::table('tra_product_applications as t1')
                ->leftjoin('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('par_atc_codes as t5', 't2.atc_code_id', '=', 't5.id')
                ->where('t1.id', $application_id);

            $qry1 = clone $main_qry;
            $qry1->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->select('t1.*', 't5.name as atc_code', 't5.description as atc_code_description', 't1.id as active_application_id', 't2.brand_name as brand_name',
                    't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't2.*',DB::raw("CONCAT_WS(',',t3.name,t3.postal_address) as applicant_details,
                    t1.section_id,t1.module_id,CONCAT_WS(',',t2.brand_name,t2.physical_description) as product_details"));

            $results = $qry1->first();

            $qry2 = clone $main_qry;
            $qry2->leftJoin('wb_trader_account as t3', 't1.local_agent_id', '=', 't3.id')
                ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website');
            $ltrDetails = $qry2->first();

            $res = array(
                'success' => true,
                'results' => $results,
                'ltrDetails' => $ltrDetails,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function prepareNewProductPaymentStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $table_name = $request->input('table_name');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->leftJoin('wb_trader_account as t2', 't1.applicant_id', '=', 't2.id')
                ->leftJoin('tra_application_invoices as t3', function ($join) use ($application_code) {
                    $join->on('t3.application_code', '=', DB::raw($application_code));
                })
                ->leftJoin('tra_product_information as t4', 't1.product_id', '=', 't4.id')
                ->select('t1.application_code', DB::raw("t1.applicant_id,t1.product_id,CONCAT_WS(',',t2.name,t2.postal_address) as applicant_details, t3.id as invoice_id, t3.invoice_no,
                t1.section_id,t1.module_id,CONCAT_WS(',',t4.brand_name,t4.physical_description) as product_details"))
                ->where('t1.id', $application_id);
            $results = $qry->first();
            $payment_details = getApplicationPaymentsRunningBalance($application_id, $application_code, $results->invoice_id);
            $res = array(
                'success' => true,
                'results' => $results,
                'balance' => formatMoney($payment_details['running_balance']),
                'invoice_amount' => formatMoney($payment_details['invoice_amount']),
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function savedocumentssubmissionrecommendation(Request $req){
        try {
            $resp = "";
            $user_id = $this->user_id;
            $application_id = $req->application_id;
            $application_code = $req->application_code;
            $document_status_id = $req->document_status_id;
            $remarks = $req->remarks;

            $table_name = 'tra_documentsubmission_recommendations';

            $record_id = $req->id;
            $data = array('application_code'=>$application_code,
                        'application_id'=>$application_id,
                        'document_status_id'=>$document_status_id,
                        'remarks'=>$remarks);

            if (validateIsNumeric($record_id)) {
                $where = array('id' => $record_id);
                if (recordExists($table_name, $where)) {
                    $data['dola'] = Carbon::now();
                    $data['altered_by'] = $user_id;
                    $previous_data = getPreviousRecords($table_name, $where);
                    $resp = updateRecord($table_name, $where, $data, $user_id);

                }
            } else {
                //insert
                $data['created_by'] = $user_id;
                $data['created_on'] = Carbon::now();
                $data['submission_date'] = Carbon::now();

                $resp = insertRecord($table_name, $data, $user_id);
                $app_data = array('submission_date'=>Carbon::now(), 'dola'=>Carbon::now());

                DB::table('tra_product_applications')
                        ->where(array('application_code'=>$application_code))
                        ->update($app_data);

            }
            if ($resp['success']) {
                $res = array('success' => true,
                    'message' => 'Saved Successfully');

            } else {
                $res = array('success' => false,
                    'message' => $resp['message']);

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);



    }
    public function onSaveProductOtherDetails(Request $req)
    {
        try {
            $resp = "";
            $user_id = $this->user_id;
            $data = $req->all();

            $table_name = $req->table_name;
            $record_id = $req->id;
            $manufacturing_site = 0;
            if(isset($data['manufacturing_site'])){
              $manufacturing_site = $data['manufacturing_site'];
            }
            unset($data['table_name']);
            unset($data['model']);
            unset($data['_token']);
            unset($data['manufacturer_name']);
            unset($data['manufacturing_site']);
            unset($data['id']);
            if (validateIsNumeric($record_id)) {
                $where = array('id' => $record_id);
                if (recordExists($table_name, $where)) {

                    $data['dola'] = Carbon::now();
                    $data['altered_by'] = $user_id;

                    $resp = updateRecord($table_name, $where, $data);

                }
            } else {
                //check for some specific table insert conditions
                if($table_name == 'tra_product_gmpinspectiondetails'){
                    $check = DB::table('tra_manufacturing_sites as t1')
                            ->join('registered_manufacturing_sites as t2', 't1.id', '=', 't2.tra_site_id')
                            ->join('par_system_statuses as t3', 't2.status_id', 't3.id')
                            ->where('t1.id', $manufacturing_site)
                            ->count();
                    if($check <= 0){
                        //condition if not registered
                        // $res = array('success'=>false, 'message'=>'Selected GMP is yet to be Approved');
                        // return response()->json($res);
                    }
                }

                //check for duplicates
                 $prev_count = DB::table($table_name)->where($data)->count();
                 if($prev_count > 0){
                    $res = array('success' => false,
                    'message' => 'Duplicate Record');
                    return response()->json($res);
                 }

                //insert
                $data['created_by'] = $user_id;
                $data['created_on'] = Carbon::now();

                $resp = insertRecord($table_name, $data);
            }
            if ($resp['success']) {
                $res = array('success' => true,
                    'message' => 'Saved Successfully');

            } else {
                $res = $resp;

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);

    }
    public function saveRejectionReasons(Request $req){
        $data =  $req->all();
        $table_name = 'tra_rejection_reasons';
        $application_code = $req->application_code;
        $user_id = $this->user_id;
        unset($data['_token']);
        unset($data['sign_file']);
        unset($data['approval_id']);
        unset($data['approval_date']);
        unset($data['expiry_date']);

        try{
            $where = array('application_code' => $application_code);

            if(recordExists($table_name, $where)){
                $res = updateRecord($table_name, $where, $data, $user_id);
            }else{
                $res = insertRecord($table_name, $data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
               $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);
    }
    public function onSaveProductinformation(Request $req)
    {
        try {
            $resp = "";
            $user_id = $this->user_id;
            $data = $req->all();

            $table_name = $req->table_name;
            $record_id = $req->product_id;
            unset($data['table_name']);
            unset($data['model']);
            unset($data['manufacturer_name']);
            unset($data['product_id']);
            unset($data['application_id']);
            unset($data['assessment_procedure_id']);
            unset($data['branch_id']);
            unset($data['rule_description']);
            //unset($data['atc_code']);
           // unset($data['atc_code_description']);
            if (validateIsNumeric($record_id)) {
                $where = array('id' => $record_id);
                if (recordExists($table_name, $where)) {

                    $data['dola'] = Carbon::now();
                    $data['altered_by'] = $user_id;

                    $previous_data = getPreviousRecords($table_name, $where);

                    $resp = updateRecord($table_name, $previous_data['results'], $where, $data, $user_id);
                }
            }

            if ($resp['success']) {
                $res = array('success' => true,
                    'message' => 'Saved Successfully');

            } else {
                $res = array('success' => false,
                    'message' => $resp['message']);

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
               $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);

    }

    public function onLoadOnlineproductIngredients(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            //get the records
            $records = DB::connection('portal_db')->table('wb_product_ingredients as t1')
                ->select('t1.*')
                ->where(array('t1.product_id' => $product_id))
                ->get();
            //loop
            $speficification_typeData = getParameterItems('par_specification_types', '', '');
            $si_unitData = getParameterItems('par_si_units', '', '');
            $ingredientsData = getParameterItems('par_ingredients_details', '', '');
            $inclusion_reasonData = getParameterItems('par_inclusions_reasons', '', '');
            $ingredientTypeData = getParameterItems('par_ingredients_types', '', '');

            foreach ($records as $rec) {
                //get the array

                $data[] = array('product_id' => $rec->product_id,
                    'id' => $rec->id,
                    'ingredient_type_id' => $rec->ingredient_type_id,
                    'ingredient_id' => $rec->ingredient_id,
                    'specification_type_id' => $rec->specification_type_id,
                    'strength' => $rec->strength,
                    'proportion' => $rec->proportion,
                    'ingredientssi_unit_id' => $rec->ingredientssi_unit_id,
                    'inclusion_reason_id' => $rec->inclusion_reason_id,
                    'ingredient_name' => returnParamFromArray($ingredientsData, $rec->ingredient_id),
                    'ingredient_type' => returnParamFromArray($ingredientTypeData, $rec->ingredient_type_id),
                    'ingredient_specification' => returnParamFromArray($speficification_typeData, $rec->specification_type_id),
                    'si_unit' => returnParamFromArray($si_unitData, $rec->ingredientssi_unit_id),
                    'reason_for_inclusion' => returnParamFromArray($inclusion_reasonData, $rec->inclusion_reason_id),
                );

            }
            $res = array('success' => true, 'results' => $data);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function onLoadOnlineproductPackagingDetails(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            //get the records
            $records = DB::connection('portal_db')->table('wb_product_packaging as t1')
            ->select(DB::raw("t1.*, CONCAT_WS('X',retail_packaging_size,retail_packaging_size1,retail_packaging_size2,retail_packaging_size3,retail_packaging_size4) as retail_packaging"))

                ->where(array('t1.product_id' => $product_id))
                ->get();
            //loop container_id
            $containersData = getParameterItems('par_containers', '', '');
            $containersMaterialsData = getParameterItems('par_containers_materials', '', '');
            $containersMaterialsData = getParameterItems('par_containers_materials', '', '');
            $containersClosuresData = getParameterItems('par_closure_materials', '', '');
            $containersSealData = getParameterItems('par_seal_types', '', '');
            $containersTypesData = getParameterItems('par_containers_types', '', '');
            $packagingUnitsData = getParameterItems('par_packaging_units', '', '');

            foreach ($records as $rec) {
                //get the array

                $data[] = array('product_id' => $rec->product_id,
                    'id' => $rec->id,
                    'container_id' => $rec->container_id,
                    'container_material_id' => $rec->container_material_id,
                    'container_type_id' => $rec->container_type_id,
                    'closure_material_id' => $rec->closure_material_id,
                    'seal_type_id' => $rec->seal_type_id,
                    'retail_packaging_size' => $rec->retail_packaging_size,
                    'retail_packaging' => $rec->retail_packaging,
                    'packaging_units_id' => $rec->packaging_units_id,
                    'unit_pack' => $rec->unit_pack,
                    'container_name' => returnParamFromArray($containersData, $rec->container_id),
                    'container_material' => returnParamFromArray($containersMaterialsData, $rec->container_material_id),
                    'container_type' => returnParamFromArray($containersTypesData, $rec->container_type_id),
                    'closure_materials' => returnParamFromArray($containersClosuresData, $rec->closure_material_id),
                    'seal_type' => returnParamFromArray($containersSealData, $rec->seal_type_id),
                    'packaging_units' => returnParamFromArray($packagingUnitsData, $rec->packaging_units_id)
                );

            }
            $res = array('success' => true, 'results' => $data);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }
    function getManufacturerRoles($product_manufacturer_id,$manufacturer_roleData){
            $man_roles = '';
                $records = DB::connection('portal_db')->table('wb_product_manufacturers_roles')
                        ->where(array('product_manufacturer_id'=>$product_manufacturer_id))
                        ->get();
                    foreach($records as $rec){
                        $manufacturer_role_id = $rec->manufacturer_role_id;

                        $manufacturing_role = returnParamFromArray($manufacturer_roleData,$manufacturer_role_id);

                        $man_roles .= $manufacturing_role.';';
                    }
    return $man_roles;
        }
    public function onLoadOnlineproductManufacturer(Request $req)
    {

        try {
            $data = array();
            $product_id = $req->product_id;
            $manufacturer_type_id = $req->manufacturer_type_id;
            $records = DB::connection('portal_db')->table('wb_product_manufacturers as t1')
                ->where(array('product_id' => $product_id, 'manufacturer_type_id' => 1))
                ->get();
            foreach ($records as $rec) {
                $manufacturer_id = $rec->manufacturer_id;
                $product_manufacturer_id = $rec->id;
                $man_site_id = $rec->man_site_id;
                $manufacturer_role_id = $rec->manufacturer_role_id;
                $manufacturer_roleData = getParameterItems('par_manufacturing_roles', '', '');
                $manufacturing_role = $this->getManufacturerRoles($product_manufacturer_id,$manufacturer_roleData);

                $man_data = DB::table('par_man_sites as t1')
                    ->select('t1.*', 't1.id as manufacturer_id', 't1.name as manufacturing_site', 't5.name as manufacturer_name', 't2.name as country', 't3.name as region', 't4.name as district')
                    ->join('par_countries as t2', 't1.country_id', '=', 't2.id')
                    ->join('par_regions as t3', 't1.region_id', '=', 't3.id')
                    ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                    ->leftJoin('tra_manufacturers_information as t5', 't1.manufacturer_id', '=', 't5.id')
                    ->where(array('t5.id' => $manufacturer_id, 't1.id' => $man_site_id))
                    ->first();
                if ($man_data) {
                    $data[] = array('id' => $rec->id,
                        'manufacturer_name' => $man_data->manufacturer_name,
                        'manufacturing_site' => $man_data->manufacturing_site,
                        'country_name' => $man_data->country,
                        'region_name' => $man_data->region,
                        'product_id' => $rec->product_id,
                        'physical_address' => $man_data->physical_address,
                        'postal_address' => $man_data->postal_address,
                        'manufacturing_role' => $manufacturing_role,
                        'email_address' => $man_data->email_address
                    );
                }

            }
            $res = array(
                'success' => true,
                'results' => $data
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }


    public function onLoadOnlineproductApiManufacturer(Request $req)
    {

        try {
            $data = array();
            $product_id = $req->product_id;
            $manufacturer_type_id = 2;
            $records = DB::connection('portal_db')->table('wb_product_manufacturers as t1')
                ->select('t1.*', 't2.ingredient_id')
                ->join('wb_product_ingredients as t2', 't1.active_ingredient_id', '=', 't2.id')
                ->where(array('t1.product_id' => $product_id, 'manufacturer_type_id' => $manufacturer_type_id))
                ->get();
            foreach ($records as $rec) {
                $manufacturer_id = $rec->manufacturer_id;
                $ingredient_id = $rec->ingredient_id;
                //  print_r($rec);

                $manufacturer_role_id = $rec->manufacturer_role_id;
                $manufacturer_roleData = getParameterItems('par_manufacturing_roles', '', '');
                $manufacturing_role = returnParamFromArray($manufacturer_roleData, $manufacturer_role_id);

                $ingredients_Data = getParameterItems('par_ingredients_details', '', '');
                $active_ingredient = returnParamFromArray($ingredients_Data, $ingredient_id);

                $records = DB::table('tra_manufacturers_information as t1')
                    ->select('t1.*', 't1.id as manufacturer_id', 't1.name as manufacturer_name', 't2.name as country', 't3.name as region', 't4.name as district')
                    ->leftJoin('par_countries as t2', 't1.country_id', '=', 't2.id')
                    ->leftJoin('par_regions as t3', 't1.region_id', '=', 't3.id')
                    ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                    ->where(array('t1.id' => $manufacturer_id))
                    ->first();
                if($records){

                    $data[] = array('id' => $rec->id,
                            'manufacturer_name' => $records->manufacturer_name,
                            'country_name' => $records->country,
                            'region_name' => $records->region,
                            'product_id' => $rec->product_id,
                            'physical_address' => $records->physical_address,
                            'postal_address' => $records->postal_address,
                            'manufacturing_role' => $manufacturing_role,
                            'ingredient_name' => $active_ingredient,
                            'email_address' => $records->email_address
                        );

                }

            }
            $res = array(
                'success' => true,
                'results' => $data
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function onLoadOnlinegmpInspectionApplicationsDetails(Request $req)
    {

        try {
            $data = array();
            $product_id = $req->product_id;
            $manufacturer_type_id = 2;
            $records = DB::connection('portal_db')->table('wb_product_gmpinspectiondetails as t1')
                ->select('t1.*')
                ->where(array('t1.product_id' => $product_id))
                ->get();
            foreach ($records as $rec) {

                $reg_site_id = $rec->reg_site_id;
                $gmp_productline_id = $rec->gmp_productline_id;

                $product_linedetails = $this->getGMPProductLineDetails($gmp_productline_id);
                $records = DB::table('tra_manufacturing_sites as t1')
                    ->select('t5.id as reg_manufacturer_site_id', 't7.permit_no as gmp_certificate_no', 't6.reference_no as gmp_application_reference', 't8.name as registration_status', 't7.permit_no', 't1.physical_address', 't1.email as email_address', 't1.id as manufacturer_id', 't1.name as manufacturer_name', 't2.name as country_name', 't3.name as region_name', 't4.name as district')
                    ->join('par_countries as t2', 't1.country_id', '=', 't2.id')
                    ->join('par_regions as t3', 't1.region_id', '=', 't3.id')
                    ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                    ->join('registered_manufacturing_sites as t5', 't1.id', '=', 't5.tra_site_id')
                    ->join('tra_gmp_applications as t6', 't1.id', '=', 't6.manufacturing_site_id')
                    ->join('tra_approval_recommendations as t7', 't1.permit_id', '=', 't7.id')
                    ->join('par_system_statuses as t8', 't5.status_id', '=', 't8.id')
                    ->where(array('t5.id' => $reg_site_id))
                    ->first();

                $data[] = array('id' => $rec->id,
                    'product_id' => $rec->product_id,
                    'reg_site_id' => $reg_site_id,
                    'gmp_certificate_no' => $records->gmp_certificate_no,
                    'gmp_application_reference' => $records->gmp_application_reference,
                    'permit_no' => $records->permit_no,
                    'manufacturer_name' => $records->manufacturer_name,
                    'physical_address' => $records->physical_address,
                    'email_address' => $records->email_address,
                    'manufacturer_id' => $records->manufacturer_id,
                    'country' => $records->country_name,
                    'region' => $records->region_name,
                    'district' => $records->district,
                    'product_linedetails' => $product_linedetails
                );

            }
            $res = array(
                'success' => true,
                'results' => $data
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    function getGMPProductLineDetails($product_line_id)
    {
        $records = DB::table('gmp_productline_details as t1')
            ->select('t1.*', 't2.name as product_line', 't1.id as product_id', 't3.name as product_category')
            ->join('gmp_product_lines as t2', 't1.product_line_id', '=', 't2.id')
            ->join('gmp_product_categories as t3', 't1.category_id', '=', 't3.id')
            ->join('gmp_product_descriptions as t4', 't1.prodline_description_id', '=', 't4.id')
            ->where(array('t1.id' => $product_line_id))
            ->first();
        if ($records) {
            return $records->product_line . ' ' . $records->product_category;

        }

    }

   public function onLoadproductIngredients(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            $filters = $req->filters;
            //get the records
            $data = DB::table('tra_product_ingredients as t1')
                ->leftJoin('par_specification_types as t2', 't1.specification_type_id', '=', 't2.id')
                ->leftJoin('par_si_units as t3', 't1.ingredientssi_unit_id', '=', 't3.id')
                ->leftJoin('par_ingredients_details as t4', 't1.ingredient_id', '=', 't4.id')
                ->leftJoin('par_ingredients_types as t5', 't1.ingredient_type_id', '=', 't5.id')
                ->leftJoin('par_inclusions_reasons as t6', 't1.inclusion_reason_id', '=', 't6.id')
                ->select('t1.*', 't6.name as reason_for_inclusion', 't2.name as ingredient_specification', 't3.name as si_unit', 't4.name as ingredient_name', 't5.name as ingredient_type','t4.id as active_ingredient_id','t4.is_accepted','t4.acceptance_statement');
                if (validateIsNumeric($product_id)) {
                    $results= $data->where(array('t1.product_id' => $product_id))->get();
                }
                if ($filters != '') {
                    $filters = (array)json_decode($filters);
                    $product_id = $filters['product_id'];
                   $results= $data->where(array('t1.product_id' => $product_id))->get();
                }
                $results=$data->get();
               // dd($results);
            $res = array(
                'success' => true,
                'results' => $results);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function onLoadproductNutrients(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            //get the records
            $data = DB::table('tra_product_nutrients as t1')
                ->select('t1.*', 't2.name as nutrients_category', 't3.name as nutrients', 't4.name as si_unit')
                ->leftJoin('par_nutrients_category as t2', 't1.nutrients_category_id', '=', 't2.id')
                ->leftJoin('par_nutrients as t3', 't1.nutrients_id', '=', 't3.id')
                ->leftJoin('par_si_units as t4', 't1.units_id', '=', 't4.id')
                ->where(array('t1.product_id' => $product_id))
                ->get();
            $res = array('success' => true, 'results' => $data);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function getProductActiveIngredients(Request $req)
    {

        try {
            $filters = (array)json_decode($req->filters);
            $data = array();
            //get the records
            $filters['t3.is_active_reason'] = 1;
            $data = DB::table('tra_product_ingredients as t1')
                ->select('t1.id as active_ingredient_id', 't2.name as ingredient_name')
                ->join('par_ingredients_details as t2', 't1.ingredient_id', '=', 't2.id')
                ->join('par_inclusions_reasons as t3', 't1.inclusion_reason_id', '=', 't3.id')
                ->where($filters)
                ->get();
            if (count($data) > 0) {
                $res = array('success' => true, 'results' => $data);
            } else {
                $res = array('success' => false, 'message' => 'Active Pharmaceutical Ingredient not captured.');
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function getGMPproductLinesDetails(Request $req)
    {

        try {
            $manufacturing_site_id = $req->manufacturing_site_id;

            $data = array();
            //get the records
            $filters['t3.is_active_reason'] = 1;
            $data = DB::table('gmp_productline_details as t1')
                ->select('t1.id as gmp_productline_id', 't2.name as gmpproduct_line')
                ->join('gmp_product_lines as t2', 't1.product_line_id', '=', 't2.id')
                ->where(array('manufacturing_site_id' => $manufacturing_site_id))
            //  ->whereIn('prodline_inspectionstatus_id',[8,10])
                ->get();
            if (count($data) > 0) {
                $res = array('success' => true, 'results' => $data);
            } else {
                $res = array('success' => false, 'message' => 'GMP Product Line Details Not Found.');
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function onLoadproductPackagingDetails(Request $req)
    {

        try {
            //
            $product_id = $req->product_id;
            $application_code = $req->application_code;
            // if(validateIsNumeric($application_code)){
                $where = array('t1.product_id'=>$product_id);
            // }else{
                // $where = array('t1.product_id'=>$product_id);
            // }

            $data = array();
            //get the records
            $data = DB::table('tra_product_packaging as t1')
                ->select(DB::raw("t1.*, t2.name as container_type, t1.container_name as container_name, t1.container_material as container_material, t5.name as closure_materials, t5.name as closure_material, t6.name as seal_type, t7.name as packaging_units, t1.retail_packaging_size as retail_packaging"))
                ->leftJoin('par_containers_types as t2', 't1.container_type_id', '=', 't2.id')
                ->leftJoin('par_containers as t3', 't1.container_id', '=', 't3.id')
                ->leftJoin('par_containers_materials as t4', 't1.container_material_id', '=', 't4.id')
                ->leftJoin('par_closure_materials as t5', 't1.closure_material_id', '=', 't5.id')
                ->leftJoin('par_seal_types as t6', 't1.seal_type_id', '=', 't6.id')
                ->leftJoin('par_packaging_units as t7', 't1.packaging_units_id', '=', 't7.id')
                ->where($where)
                ->get();

            $res = array('success' => true, 'results' => $data);

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

   public function onLoadproductManufacturer(Request $req)
    {

        try {
            $product_id = $req->product_id;
            $records = array();
            //get the records
            $records = DB::table('tra_product_manufacturers as t1')
                ->select('t1.*', 't2.email_address', 't7.name as manufacturer_name', 't1.id as manufacturer_id', 't6.name as manufacturing_role', 't2.physical_address', 't2.name as manufacturing_site', 't3.name as country_name', 't4.name as region_name', 't5.name as district_name')
                ->leftJoin('tra_manufacturing_sites as t2', 't1.manufacturer_id', '=', 't2.manufacturer_id')
                ->leftJoin('par_countries as t3', 't2.country_id', '=', 't3.id')
                ->leftJoin('par_regions as t4', 't2.region_id', '=', 't4.id')
                ->leftJoin('par_districts as t5', 't2.district_id', '=', 't5.id')
                ->leftJoin('par_manufacturing_roles as t6', 't1.manufacturer_role_id', '=', 't6.id')
                ->leftJoin('tra_manufacturers_information as t7', 't1.manufacturer_id', '=', 't7.id')
                ->where(array('t1.product_id' => $product_id, 'manufacturer_type_id' => 1))
                ->get();

            $res = array('success' => true, 'results' => $records);

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function onLoadproductApiManufacturer(Request $req)
    {

        try {
            $product_id = $req->product_id;
            $records = array();
            //get the records
            $records = DB::table('tra_product_manufacturers as t1')
                ->select('t1.*', 't2.email_address', 't2.id as manufacturer_id', 't7.name as ingredient_name', 't2.physical_address', 't2.name as manufacturer_name', 't3.name as country_name', 't4.name as region_name', 't5.name as district_name')
                ->join('tra_manufacturers_information as t2', 't1.manufacturer_id', '=', 't2.id')
                ->join('par_countries as t3', 't2.country_id', '=', 't3.id')
                ->join('par_regions as t4', 't2.region_id', '=', 't4.id')
                ->leftJoin('par_districts as t5', 't2.district_id', '=', 't5.id')
                // ->join('tra_product_ingredients as t6', 't1.product_id', '=', 't6.product_id')
                ->join('par_ingredients_details as t7', 't1.active_ingredient_id', '=', 't7.id')
                ->where(array('t1.product_id' => $product_id, 'manufacturer_type_id' => 2))
                ->get();

            $res = array('success' => true, 'results' => $records);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function getEValuationComments(Request $req)
    {
        $application_code = $req->input('application_code');
        $table_name = 'tra_evaluations_overralcomments';
        $res = $this->getEvalAuditComments($table_name, $application_code);
        return \response()->json($res);


    }

    public function getAuditingComments(Request $req)
    {
        $application_code = $req->input('application_code');
        $table_name = 'tra_auditing_overralcomments';
        $res = $this->getEvalAuditComments($table_name, $application_code);
        return \response()->json($res);

    }

    function getEvalAuditComments($table_name, $application_code)
    {

        try {
            $records = DB::table($table_name . ' as t1')
                ->where('application_code', $application_code)
                ->join('users as t2', 't1.created_by', '=', 't2.id')
                ->select('t1.*', 't2.username as author')
                ->get();

            $res = array(
                'success' => true,
                'results' => $records,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return $res;


    }

    public function getProductApplicationMoreDetails(Request $request)
    {
        $application_code = $request->input('application_code');

        try {
            // $app_details = DB::table('tra_product_applications')
            //     ->where('application_code', $application_code)
            //     ->select('branch_id', 'product_id')->first();
            // $branch_id = $app_details->branch_id;
            // $product_id = $app_details->product_id;
            $qryProducts = DB::table('tra_product_information as t1')
                ->join('tra_product_applications as t2', 't1.id', 't2.product_id')
                ->leftjoin('wb_trader_account as t3', 't2.applicant_id', 't3.id')
                ->leftjoin('wf_workflow_stages as t4', 't2.workflow_stage_id', 't4.id')
                ->select('t1.id as product_id', 't2.assessment_procedure_id', 't1.*', 't2.paying_currency_id', 't2.branch_id', 't2.prodclass_category_id', 't2.local_agent_id', 't3.name as applicant_name', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address', 't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website','t2.applicant_id as applicant_id_no', 't4.stage_category_id'
            )
                ->where('t2.application_code', $application_code);

            $product_details = $qryProducts->first();

            
            $qry2 = DB::table('wb_trader_account as t3')
                ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website')
                ->where('t3.id', $product_details->local_agent_id);

            $ltrDetails = $qry2->first();
            //add species
            $species = DB::table('tra_product_species as t1')
                    ->join('par_animal_species as t2', 't1.species_id', 't2.id')
                    ->select('t2.id')
                    ->where('product_id', $product_details->product_id)
                    ->get();
            $product_details->species_ids =convertAssArrayToSimpleArray( convertStdClassObjToArray($species), 'id');

            $res = array(
                'success' => true,
                'ltrDetails' => $ltrDetails,
                'product_details' => $product_details,
                'branch_id' => $product_details->branch_id,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }


    //onLoadgmpInspectionApplicationsDetails
    public function onDeleteProductOtherDetails(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );

            $res = deleteRecord($table_name, $where);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function onLoadManufacturersDetails(Request $request)
    {
        $filter = $request->input('filter');
        $whereClauses = array();
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'manufacturer_name' :
                            $whereClauses[] = "t1.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'contact_person' :
                            $whereClauses[] = "t1.contact_person like '%" . ($filter->value) . "%'";
                            break;
                        case 'email_address' :
                            $whereClauses[] = "t1.email_address like '%" . ($filter->value) . "%'";
                            break;
                        case 'physical_address' :
                            $whereClauses[] = "t1.physical_address like '%" . ($filter->value) . "%'";
                            break;
                        case 'country_name' :
                            $whereClauses[] = "t2.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'region_name' :
                            $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'website' :
                            $whereClauses[] = "t1.website like '%" . ($filter->value) . "%'";
                            break;
                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
        try {
            $qry = DB::table('tra_manufacturers_information as t1')
                ->leftJoin('par_countries as t2', 't1.country_id', '=', 't2.id')
                ->leftJoin('par_regions as t3', 't1.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                ->select(DB::raw("t1.name, t1.postal_address, t1.telephone_no,t1.physical_address, t1.email_address, t1.contact_person, t1.id as manufacturer_id,
                    t1.name as manufacturer_name, t2.name as country_name, t3.name as region_name, t4.name as district,
                    t1.country_id,t1.region_id,t1.website,t1.district_id,CONCAT(t1.name,' (',t2.name,')') as manufacturer_namecountry"));
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            $records = $qry->get();
            $res = array(
                'success' => true,
                'results' => $records
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function onLoadManufacturingDetails(Request $request)
    {
        $manufacturer_id = $request->input('manufacturer_id');
        $filter = $request->input('filter');
        $whereClauses = array();
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'manufacturer_name' :
                            $whereClauses[] = "t1.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'email_address' :
                            $whereClauses[] = "t1.email_address like '%" . ($filter->value) . "%'";
                            break;
                        case 'physical_address' :
                            $whereClauses[] = "t1.physical_address like '%" . ($filter->value) . "%'";
                            break;
                        case 'country_name' :
                            $whereClauses[] = "t2.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'region_name' :
                            $whereClauses[] = "t3.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'contact_person' :
                            $whereClauses[] = "t1.contact_person like '%" . ($filter->value) . "%'";
                            break;
                        case 'website' :
                            $whereClauses[] = "t1.website like '%" . ($filter->value) . "%'";
                            break;

                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
        try {
            $qry = DB::table('tra_manufacturers_information as t1')
                ->join('par_countries as t2', 't1.country_id', '=', 't2.id')
                ->leftJoin('par_regions as t3', 't1.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                ->select(DB::raw("t1.*,t1.name as manufacturer_name,t1.id as manufacturer_id,
                 t2.name as country_name, t3.name as region_name, t4.name as district,
                t1.country_id,t1.region_id,t1.district_id,CONCAT(t1.name,' (',t2.name,')') as manufacturer_namecountry"));

            if (validateisNumeric($manufacturer_id)) {
                $qry->where('manufacturer_id', $manufacturer_id);
            }
            if($filter_string != ''){
                $qry->whereRAW($filter_string);
            }
            $records = $qry->get();
            $res = array(
                'success' => true,
                'results' => $records
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function onLoadManufacturingSitesDetails(Request $request)
    {
        $manufacturer_id = $request->input('manufacturer_id');
        $whereClauses = array();

        try {

            $qry = DB::table('tra_manufacturing_sites as t5')
                ->join('tra_manufacturers_information as t1', 't5.manufacturer_id', '=', 't1.id')
                ->join('par_countries as t2', 't5.country_id', '=', 't2.id')
                ->leftJoin('par_regions as t3', 't5.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't5.district_id', '=', 't4.id')
                ->select(DB::raw("DISTINCT t5.email_address,t5.id as manufacturing_site_id, t5.email,t5.physical_address, t5.name, t5.telephone, t5.website, t5.street, t5.fax, t5.postal_address, t5.latitude, t5.longitude, t1.contact_person,t5.manufacturer_id,t5.manufacturing_type_id,
                t5.name as manufacturing_site,t5.id as man_site_id, t2.name as country_name, t3.name as region_name, t4.name as district,
                t5.country_id,t5.region_id,t5.district_id,CONCAT(t1.name,' (',t2.name,')') as manufacturer_name"));

            //dd($qry->toSql());

            if (validateisNumeric($manufacturer_id)) {
                $qry->where('t5.manufacturer_id', $manufacturer_id);
            }
            $records = $qry->get();
            $res = array(
                'success' => true,
                'results' => $records
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function onLoadproductGmpInspectionDetailsStr(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $records = array();
            //get the records
            $records = DB::table('tra_manufacturing_sites as t1')
                ->leftJoin('par_countries as t2', 't1.country_id', '=', 't2.id')
                ->leftJoin('par_regions as t3', 't1.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                ->leftJoin('registered_manufacturing_sites as t5', 't1.id', '=', 't5.tra_site_id')
                ->leftJoin('tra_gmp_applications as t6', 't1.id', '=', 't6.manufacturing_site_id')
                ->leftJoin('tra_approval_recommendations as t7', 't1.permit_id', '=', 't7.id')
                ->leftJoin('par_system_statuses as t8', 't5.status_id', '=', 't8.id')
                ->leftJoin('tra_product_gmpinspectiondetails as t9', 't1.id', '=', 't9.manufacturing_site_id')
                ->leftJoin('gmp_productline_details as t10', 't9.gmp_productline_id', '=', 't10.id')
                ->leftJoin('gmp_product_lines as t11', 't10.product_line_id', '=', 't11.id')
                ->leftJoin('gmp_product_categories as t12', 't10.category_id', '=', 't12.id')
                ->leftJoin('tra_gmp_applications as t13', 't13.manufacturing_site_id', '=', 't1.id')
                ->select('t9.id', 't11.name as gmp_product_line', 't12.name as gmp_product_category', 't5.id as reg_manufacturer_site_id', 't7.permit_no as gmp_certificate_no', 't6.reference_no as gmp_application_reference', 't8.name as registration_status', 't7.permit_no', 't1.physical_address', 't1.email_address as email_address', 't1.id as manufacturing_site_id', 't9.product_id', 't13.reg_site_id', 't1.name as manufacturer_name', 't2.name as country_name', 't3.name as region_name', 't4.name as district')
                ->where(array('t9.product_id' => $product_id))
                ->get();

            $res = array('success' => true, 'results' => $records);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }
    public function onLoadGmpInspectionInOtherCountries(Request $req){

        try{
            $product_id = $req->product_id;
            $qry = DB::table('tra_otherstates_productgmpinspections as t1')
                    ->Join('par_continent_regions as t5','t1.continent_region_id','=','t5.id')
                    ->Join('par_countries as t6','t1.country_id','=','t6.id')
                    ->select('t1.*', 't5.name as continent_region', 't6.name as country')
                    ->where('product_id', $product_id);
            $results = $qry->get();
            $res = array('success'=>true, 'results'=>$results, 'message'=>'All is well');
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function onLoadgmpInspectionApplicationsDetails(Request $req)
    {
        try {
            $product_id = $req->product_id;
            //get the manufatcuring sites details
            $section_id = getSingleRecordColValue('tra_product_applications', array('product_id' => $product_id), 'section_id');
            //manufatcuring sites

            $man_sites_ids = getRecordValFromWhere('tra_product_manufacturers', array('product_id' => $product_id), 'man_site_id');

            // tra_product_manufacturers

            $records = DB::table('tra_manufacturing_sites as t1')
                ->select(DB::raw("DISTINCT t6.application_code"), 't5.id as reg_manufacturer_site_id', 't6.reg_site_id', 't7.permit_no as gmp_certificate_no', 't6.reference_no as gmp_application_reference', 't8.name as registration_status', 't7.permit_no', 't1.id as manufacturing_site_id', 't1.physical_address', 't1.email_address as email_address', 't1.id as manufacturer_id', 't1.name as manufacturer_name', 't2.name as country_name', 't3.name as region_name', 't4.name as district')
                ->join('par_countries as t2', 't1.country_id', '=', 't2.id')
                ->join('par_regions as t3', 't1.region_id', '=', 't3.id')
                ->leftJoin('par_districts as t4', 't1.district_id', '=', 't4.id')
                ->leftJoin('registered_manufacturing_sites as t5', 't1.id', '=', 't5.tra_site_id')
                ->join('tra_gmp_applications as t6', 't1.id', '=', 't6.manufacturing_site_id')
                ->join('tra_payments as t9', 't6.application_code', '=', 't9.application_code')
                ->leftJoin('tra_approval_recommendations as t7', 't6.application_code', '=', 't7.application_code')
                ->leftJoin('par_system_statuses as t8', 't5.status_id', '=', 't8.id');
                // ->where(array('t6.section_id' => $section_id));


            if (is_array($man_sites_ids)) {

               // $records = $records->whereIn('man_site_id', $man_sites_ids);

            }
            $records = $records->get();
            $res = array('success' => true,
                'results' => $records
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }

    public function getProductSampleDetails(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            $records = DB::table('tra_product_information as t6')
                ->select('t1.*','t1.batch_no as batchno', 't6.brand_name', 't1.expiry_date as expirydate', 't1.manufacturing_date as manufacturedate', 't1.pack_unit_id', 't1.pack_size', 't1.quantity_unit_id', 't1.quantity')
                ->leftJoin('tra_sample_information as t1', 't1.product_id', '=', 't6.id')
                ->where(array('t6.id' => $product_id))
                ->first();

            $res = array('success' => true,
                'results' => $records
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function onLoadProductsSampledetails(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            $records = DB::table('tra_sample_information as t1')
                ->select('t1.*', 't6.brand_name','t7.name as quantity_unit', 't8.name as sample_storage','t9.name as sample_status' )
                ->join('tra_product_information as t6', 't1.product_id', '=', 't6.id')
                ->leftJoin('par_packaging_units as t7', 't1.quantity_unit_id', '=', 't7.id')
                ->leftJoin('par_storage_conditions as t8', 't1.storage_id', '=', 't8.id')
                ->leftJoin('par_sample_status as t9', 't1.sample_status_id', '=', 't9.id')
                ->where(array('product_id' => $product_id))
                ->get();


            $res = array('success' => true,
                'results' => $records
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }

    public function saveProductGmpApplicationDetails(Request $req)
    {
        try {
            $resp = "";
            $user_id = $this->user_id;
            $product_id = $req->product_id;
            $reg_site_id = $req->reg_site_id;
            $table_name = 'tra_product_gmpinspectiondetails';
            $tra_site_id = $req->tra_site_id;
            $data = array('product_id' => $product_id,
                'reg_site_id' => $reg_site_id,
                'tra_site_id' => $tra_site_id,
                'status_id' => 1);

            $where = array('reg_site_id' => $reg_site_id,
                'product_id' => $product_id);
            if (!recordExists($table_name, $where)) {
                $data['created_by'] = $user_id;
                $data['created_on'] = Carbon::now();

                $resp = insertRecord($table_name, $data, $user_id);
                $manufacturer_id = $resp['record_id'];

            } else {
                $resp = array('success' => false, 'message' => 'The Product GMP Application inspection exists');
            }

            if ($resp['success']) {

                $res = array('success' => true,
                    'message' => 'The Product GMP Application inspection Saved Successfully');

            } else {
                $res = array('success' => false,
                    'message' => $resp['message']);

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);


    }

    public function saveManufacturerDetails(Request $req)
    {
        try {
            $resp = "";
            $user_id = $this->user_id;
            $data = $req->all();
            $physical_address = $req->physical_address;
            $manufacturer_name = $req->name;
            $table_name = $req->model;
            $manufacturing_site_id = $req->manufacturing_site_id;
            $manufacturer_id = $req->manufacturer_id;
            $record_id = $req->id;
            unset($data['table_name']);
            unset($data['model']);

            unset($data['_token']);
            unset($data['id']);
            if($table_name == 'tra_manufacturing_sites'){
                if(validateIsNumeric($manufacturing_site_id)){
                   $record_id = $manufacturing_site_id; 
                  
                }
				 unset($data['manufacturing_site_id']);
            }
            if($table_name == 'tra_manufacturers_information'){
                if(validateIsNumeric($manufacturer_id)){
                   $record_id = $manufacturer_id; 
                   
                }
				unset($data['manufacturer_id']);
            }
            if (validateIsNumeric($record_id)) {
                $where = array('id' => $record_id);
                if (recordExists($table_name, $where)) {
                    $manufacturer_id = $record_id;
                    $data['dola'] = Carbon::now();
                    $data['altered_by'] = $user_id;

                    $resp = updateRecord($table_name, $where, $data);

                }
            } else {
                //insert
                //check duplicate
                $where = array('name' => $manufacturer_name,
                    'physical_address' => $physical_address);
                if (!recordExists($table_name, $where)) {
                    $data['created_by'] = $user_id;
                    $data['created_on'] = Carbon::now();

                    $resp = insertRecord($table_name, $data);
                    if(!$resp['success']){
                        return $resp;
                    }
                    $manufacturer_id = $resp['record_id'];

                } else {
                    $resp = array('success' => false, 'message' => 'The Manufacturer Site details exists');
                }

            }
            if ($resp['success']) {

                $res = array('success' => true,
                    'manufacturer_id' => $manufacturer_id,
                    'manufacturer_name' => $manufacturer_name,
                    'physical_address' => $physical_address,
                    'message' => 'Saved Successfully');

            } else {
                $res = array('success' => false,
                    'message' => $resp['message']);

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    //approvals
    public function getproductregistrationAppsApproval(Request $req)
    {
        $table_name = $request->input('table_name');
        $workflow_stage = $request->input('workflow_stage_id');
        try {

            $qry = DB::table($table_name . ' as t1')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->leftJoin('tra_approval_recommendations as t5', 't1.application_code', '=', 't5.application_code')

                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                ->join('wf_processes as t7', 't1.process_id', '=', 't7.id')
                ->join('wf_workflow_stages as t8', 't1.workflow_stage_id', '=', 't8.id')
                ->join('tc_recommendations as t14', 't1.application_code', '=', 't14.application_code')
                ->join('par_tcmeeting_decisions as t15', 't14.decision_id', '=', 't15.id')
                ->select('t1.*', 't1.id as active_application_id', 't3.name as applicant_name', 't4.name as application_status', 't6.name as approval_status',
                    't7.name as process_name', 't8.name as workflow_stage', 't8.is_general', 't5.id as recommendation_id', 't6.name as recommendation',
                    't15.name as tc_recomm', 't14.decision_id', 't14.id as recomm_id', 't14.comments')
                ->where('t1.workflow_stage_id', $workflow_stage);

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

    //
    public function getProductTcReviewMeetingApplications(Request $req)
    {
        $table_name = $req->input('table_name');
        $workflow_stage = $req->input('workflow_stage_id');
        $meeting_id = $req->input('meeting_id');

        try {
            $qry = DB::table($table_name . ' as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->leftJoin('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('tc_meeting_applications as t9', 't1.application_code', '=', 't9.application_code')
                ->leftJoin('tra_applications_comments as t10', function ($join) {
                    $join->on('t1.application_code', '=', 't10.application_code')
                        ->where('t10.is_current', 1)
                        ->where('t10.comment_type_id', 2);
                })
                ->leftJoin('par_evaluation_recommendations as t11', 't10.recommendation_id', '=', 't11.id')
                ->leftJoin('tra_applications_comments as t12', function ($join) {
                    $join->on('t1.application_code', '=', 't12.application_code')
                        ->where('t12.is_current', 1)
                        ->where('t12.comment_type_id', 3);
                })
                ->leftJoin('par_evaluation_recommendations as t13', 't12.recommendation_id', '=', 't13.id')
                // ->leftJoin('tra_evaluation_recommendations as t10', 't1.application_code', '=', 't10.application_code')
                // ->leftJoin('tra_auditing_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                // ->leftJoin('wf_workflow_actions as t12', 't10.recommendation_id', '=', 't12.id')
                // ->leftJoin('wf_workflow_actions as t13', 't11.recommendation_id', '=', 't13.id')
                ->select('t1.*', 't3.name as applicant_name', 't4.name as application_status',
                    't9.meeting_id', 't1.id as active_application_id', 't7.brand_name', 't8.name as common_name',
                    't11.name as evaluator_recommendation', 't13.name as auditor_recommendation', 't15.name as tc_recomm', 't14.decision_id', 't14.id as recomm_id', 't14.comments')
                ->leftJoin('tc_recommendations as t14', 't1.application_code', '=', 't14.application_code')
                ->leftJoin('par_tcmeeting_decisions as t15', 't14.decision_id', '=', 't15.id')
                ->where(array( 't9.meeting_id' => $meeting_id));

                if(validateIsNumeric($workflow_stage)){
                    $qry->where(array('t1.workflow_stage_id' => $workflow_stage));
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

    public function getProductApprovalApplicationsNonTc(Request $req)
    {
        $table_name = $req->input('table_name');
        $workflow_stage = $req->input('workflow_stage_id');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->join('par_classifications as t14', 't7.classification_id', '=', 't14.id')
                //fetching comments from comments table
                // ->leftJoin('tra_evaluation_recommendations as t10', 't1.application_code', '=', 't10.application_code')
                // ->leftJoin('tra_auditing_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                // ->leftJoin('wf_workflow_actions as t12', 't10.recommendation_id', '=', 't12.id')
                // ->leftJoin('wf_workflow_actions as t13', 't11.recommendation_id', '=', 't13.id')

                ->leftJoin('tra_applications_comments as t10', function ($join) {
                    $join->on('t1.application_code', '=', 't10.application_code')
                        ->where('t10.is_current', 1)
                        ->where('t10.comment_type_id', 2);
                })
                ->leftJoin('par_evaluation_recommendations as t11', 't10.recommendation_id', '=', 't11.id')
                ->leftJoin('tra_applications_comments as t12', function ($join) {
                    $join->on('t1.application_code', '=', 't12.application_code')
                        ->where('t12.is_current', 1)
                        ->where('t12.comment_type_id', 3);
                })
                ->leftJoin('par_evaluation_recommendations as t13', 't12.recommendation_id', '=', 't13.id')

                ->select('t1.*', 't3.name as applicant_name', 't4.name as application_status', 't6.name as dg_recommendation', 't5.decision_id as recommendation_id',
                    't1.id as active_application_id', 't7.brand_name', 't8.name as common_name', 't14.name as classification_name',
                    't11.name as evaluator_recommendation', 't13.name as auditor_recommendation')
                 ->leftJoin('tra_approval_recommendations as t5', 't1.application_code', '=', 't5.application_code')
                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                ->join('tra_submissions as t9', 't1.application_code','t9.application_code')
                ->where(array('t9.current_stage' => $workflow_stage, 'is_done'=>0));

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
    public function getProductAppealApprovalApplications(Request $req)
    {

        $table_name = $req->input('table_name');
        $workflow_stage = $req->input('workflow_stage_id');

        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->join('par_classifications as t14', 't7.classification_id', '=', 't14.id')
                ->join('par_appeal_types as t10', 't1.appeal_type_id', '=', 't10.id')
                ->select('t1.*', 't3.name as applicant_name','t10.name as type_of_appeal', 't4.name as application_status', 't6.name as dg_recommendation', 't5.decision_id as recommendation_id', 't1.id as active_application_id', 't7.brand_name', 't8.name as common_name', 't14.name as classification_name')

                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                ->join('tra_submissions as t9', 't1.application_code','t9.application_code')
                ->where(array('t9.current_stage' => $workflow_stage, 'is_done'=>0));

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
    public function getProductApprovalApplications(Request $req){
        $module_id = $req->input('module_id');
        $workflow_stage = $req->input('workflow_stage_id');
        $table_name = getTableName($module_id);
        $user_id = $this->user_id;
        $assigned_groups = getUserGroups($user_id);
        $is_super = belongsToSuperGroup($assigned_groups);
        $assigned_stages = getAssignedProcessStages($user_id, $module_id);
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', 't4.id')
                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_prodclass_categories as t7', 't1.prodclass_category_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')

                ->leftJoin('tra_submissions as t9', 't9.application_code', '=', 't1.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('tra_product_screening_approvals as t11', 't1.application_code', 't11.application_code')
                ->leftJoin('wf_workflow_stages as t12', 't9.current_stage', 't12.id')
                ->leftJoin('tra_evaluation_recommendations as t13', function ($join) use($workflow_stage) {
                    $join->on('t1.application_code', '=', 't13.application_code')
                        ->on('t12.stage_category_id', '=', 't13.stage_category_id')
                        ->where('t9.current_stage', $workflow_stage);
                })
                ->leftJoin('par_approval_decisions as t14', 't5.decision_id', '=', 't14.id')
                
                ->leftJoin('tra_esignrequest_log as t21', function ($join) use($workflow_stage) {
                    $join->on('t1.application_code', '=', 't21.application_code')
                        ->where('t21.is_sent', 1)
                        ->where('t21.workflow_stage_id', $workflow_stage);
                })
                ->leftJoin('tra_esign_status as t22', 't21.status_id', 't22.id')
                ->select('t1.*', 't2.product_origin_id', 't2.brand_name as product_name', 't7.name as prodclass_category', DB::raw("CONCAT(decryptval(t10.first_name,".getDecryptFunParams()."),' ',decryptval(t10.last_name,".getDecryptFunParams().")) as submitted_by, CONCAT(t22.name, ' - ', t21.response_comment) as sign_request_status"), 't9.date_received as submitted_on', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t1.prodclass_category_id',
                     't1.id as active_application_id', 't11.decision_id','t11.approval_date','t11.expiry_date', 't11.id as approval_id', 't12.stage_category_id','t13.id as recommendation_record_id','t13.recommendation_id','t13.remarks','t5.decision_id as approval_decision_id','t14.name as dg_recommendation')
                ->where(array('t9.current_stage'=>$workflow_stage,'t9.is_done'=>0));
            if ($is_super) {
                    $qry->whereRaw('1=1');
                    $qry->limit(100);
           } else {

                //`$qry->where('t4.usr_to','=',$user_id);
                $qry->where(function ($query) use ($user_id, $assigned_stages) {
                   $assigned_stages = convertArrayToString($assigned_stages);
                   $assigned_stages =rtrim($assigned_stages, ",");
                    $query->where('t9.usr_to', $user_id)
                            ->orWhereRaw("(t9.current_stage in ($assigned_stages) and t12.needs_responsible_user = 2)");
                });
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

    public function getRegisteredProductsAppsDetails(Request $req)
    {
        $limit = $req->input('limit');
        $page = $req->input('page');
        $start = $req->input('start');
        $section_id = $req->input('section_id');
        $man_site_id = $req->input('man_site_id');

        $filter = $req->input('filter');

        $search_value = $req->input('search_value');

        $status_id = $req->input('status_id');
        $registration_status_id =explode(',',$status_id);

        $search_field = $req->input('search_field');

        $filter = $req->input('filter');
        $whereClauses = array();
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'brand_name' :
                            $whereClauses[] = "t7.brand_name like '%" . ($filter->value) . "%'";
                            break;
                        case 'common_name' :
                            $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'certificate_no' :
                            $whereClauses[] = "t11.certificate_no like '%" . ($filter->value) . "%'";
                            break;
                             case 'reference_no' :
                            $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                            break;

                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }

        try {
            $qry_count = DB::table('tra_product_applications as t1')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->join('tra_registered_products as t12', 't12.tra_product_id', '=', 't7.id')
                ->distinct('t7.id');
                DB::enableQueryLog();
            $qry = DB::table('tra_product_applications as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.local_agent_id', '=', 't9.id')
                ->leftJoin('par_classifications as t10', 't7.classification_id', '=', 't10.id')
                ->leftJoin('tra_approval_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                ->join('tra_registered_products as t12', 't12.tra_product_id', '=', 't7.id')
                ->leftJoin('par_validity_statuses as t4', 't12.validity_status_id', '=', 't4.id')
                ->leftJoin('tra_product_manufacturers as t14', function ($join) {
                    $join->on('t7.id', '=', 't14.product_id')
                        ->on('t14.manufacturer_type_id', '=', DB::raw(1));
                })
                ->leftJoin('par_dosage_forms as t15', 't7.dosage_form_id', '=', 't15.id')
                ->leftJoin('tra_manufacturers_information as t16', 't14.manufacturer_id', '=', 't16.id')
                ->select(DB::raw("t7.id,t7.*, t1.*, t1.id as active_application_id, t1.reg_product_id, t3.name as applicant_name, t9.name as local_agent, t4.name as application_status,
                t7.storage_condition, t7.brand_name, t7.id as tra_product_id, t7.brand_name as common_name, t10.name as classification_name, t11.certificate_no, t12.expiry_date,
                t7.brand_name as sample_name,t7.physical_description as product_description, t16.name as manufacturer, t14.manufacturer_id, t15.name as dosage_form"));
            if (validateIsNumeric($section_id)) {
                //$qry->where('t7.section_id', $section_id);
            }
            if (validateIsNumeric($man_site_id)) {
              //  $qry->where('t14.man_site_id', $man_site_id);
            }
            if ($search_value != '') {
                $qry = $qry->where($search_field, 'like', '%' . $search_value . '%');
            }


            if(count($registration_status_id) >0){
               //$qry->whereIn('t12.registration_status_id', $registration_status_id);
            }
            else{

            }
            $qry->where('t12.registration_status_id', 2);
                $qry_count->where('t12.registration_status_id', 2);
            if($filter_string != ''){
                $qry->whereRAW($filter_string);
            }

        $count = $qry_count->count();


          //  $results = $qry->orderBy('t11.expiry_date','desc')->groupBy('t7.id')->skip($start)->take($limit)->get();



            $results = $qry->get()->slice($start)->take($limit);

            $res = array(
                'success' => true,
                'results' => $results,
                'total' => $count,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getProductRegistrationMeetingApplications(Request $request)
    {
        $table_name = $request->input('table_name');
        $workflow_stage = $request->input('workflow_stage_id');
        $meeting_id = $request->input('meeting_id');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('tc_meeting_applications as t9', function ($join) use ($meeting_id) {
                    $join->on('t1.application_code', '=', 't9.application_code')
                        ->where('t9.meeting_id', $meeting_id);
                })
                ->leftJoin('tra_applications_comments as t10', function ($join) {
                    $join->on('t1.application_code', '=', 't10.application_code')
                        ->where('t10.is_current', 1)
                        ->where('t10.comment_type_id', 2);
                })
                ->leftJoin('par_evaluation_recommendations as t11', 't10.recommendation_id', '=', 't11.id')
                ->leftJoin('tra_applications_comments as t12', function ($join) {
                    $join->on('t1.application_code', '=', 't12.application_code')
                        ->where('t12.is_current', 1)
                        ->where('t12.comment_type_id', 3);
                })
                ->leftJoin('par_evaluation_recommendations as t13', 't12.recommendation_id', '=', 't13.id')

                // ->leftJoin('tra_evaluation_recommendations as t10', 't1.application_code', '=', 't10.application_code')
                // ->leftJoin('tra_auditing_recommendations as t11', 't1.application_code', '=', 't11.application_code')

                // ->leftJoin('wf_workflow_actions as t12', 't10.recommendation_id', '=', 't12.id')
                // ->leftJoin('wf_workflow_actions as t13', 't11.recommendation_id', '=', 't13.id')
                ->leftJoin('tra_submissions as t14', 't1.application_code', '=', 't14.application_code')
                ->select('t1.*', 't3.name as applicant_name', 't4.name as application_status',
                    't9.meeting_id', 't1.id as active_application_id', 't7.brand_name', 't8.name as common_name',
                    't11.name as evaluator_recommendation','t7.classification_id','t7.prodclass_category_id', 't13.name as auditor_recommendation')
                ->where(array('t14.current_stage'=>$workflow_stage, 'is_done'=>0) );
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

    public function saveTCMeetingDetails(Request $request)
    {
        $id = $request->input('id');
        $application_code = $request->input('application_code');
        $meeting_name = $request->input('meeting_name');
        $meeting_desc = $request->input('meeting_desc');
        $date_requested = $request->input('date_requested');

        $workflow_stage_id = $request->input('workflow_stage_id');

        $meeting_time = $request->input('meeting_time');

        $meeting_venue = $request->input('meeting_venue');

        $module_id = $request->input('module_id');

        $sub_module_id = $request->input('sub_module_id');

        $section_id = $request->input('section_id');
        $selected = $request->input('selected');
        $selected_codes = json_decode($selected);
        $user_id = $this->user_id;
        if(!validateIsNumeric($workflow_stage_id)){
            return array('success'=>false, 'message'=>'No workflow information was shared');
        }
        $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
        $stage_category_id = $stage_data->stage_category_id;
        try {
            DB::beginTransaction();
            $params = array(
                'meeting_name' => $meeting_name,
                'meeting_desc' => $meeting_desc,
                'meeting_time' => $meeting_time,
                'meeting_venue' => $meeting_venue,
                'module_id' => $module_id,
                'sub_module_id' => $sub_module_id,
                'meeting_venue' => $meeting_venue,
                'date_requested' => $date_requested

            );
            if (validateIsNumeric($id)) {
                $params['altered_by'] = $user_id;
                // DB::table('tc_meeting_details')
                //     ->where('id', $id)
                //     ->update($params);
                updateRecord('tc_meeting_details', ['id'=>$id], $params);
            } else {
                $params['created_by'] = $user_id;
                $insert_res = insertRecord('tc_meeting_details', $params, $user_id);
                if(!isset($insert_res['success']) && $insert_res['success'] == false){
                    DB::rollback();
                    return $insert_res;
                }
                $id = $insert_res['record_id'];
                // $app_meeting = array(
                //     'application_code' => $application_code,
                //     'meeting_id' => $id,
                //     'stage_category_id' => $stage_category_id,
                //     'created_by' => $user_id
                // );
                // $meet_res = insertRecord('tc_meeting_applications', $app_meeting, $user_id);
                // if(!isset($meet_res['success']) && $meet_res['success'] == false){
                //     DB::rollback();
                //     return $meet_res;
                // }

            }
            $params2 = array();
            foreach ($selected_codes as $selected_code) {
                $params2[] = array(
                    'meeting_id' => $id,
                    'application_code' => $selected_code,
                    'stage_category_id' => $stage_category_id,
                    'created_by' => $this->user_id
                );
            }
            DB::table('tc_meeting_applications')
                ->where('meeting_id', $id)
                ->delete();
            // DB::table('tc_meeting_applications')
            //     ->insert($params2);
            insertMultipleRecords('tc_meeting_applications', $params2);
            $res = array(
                'success' => true,
                'record_id' => $id,
                'message' => 'Details saved successfully!!'
            );
            DB::commit();
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function syncTcMeetingParticipants(Request $request)
    {
        $selected = $request->input('selected');
        $meeting_id = $request->input('meeting_id');
        $selected_users = json_decode($selected);
        $where = array(
            'meeting_id' => $meeting_id
        );
        try {
            DB::transaction(function () use ($selected_users, $meeting_id, $where) {
                $params = array();
                foreach ($selected_users as $selected_user) {
                    $check = array(
                        'user_id' => $selected_user->user_id,
                        'meeting_id' => $meeting_id
                    );
                    if (DB::table('tc_meeting_participants')
                            ->where($check)->count() == 0) {
                        $params[] = array(
                            'meeting_id' => $meeting_id,
                            'user_id' => $selected_user->user_id,
                            'participant_name' => $selected_user->participant_name,
                            'phone' => $selected_user->phone,
                            'email' => $selected_user->email,
                            'created_by' => $this->user_id
                        );
                    }
                }
                DB::table('tc_meeting_participants')
                    ->insert($params);
            }, 5);
            $res = array(
                'success' => true,
                'message' => 'Participants saved successfully!!'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function prepareProductsRegMeetingStage(Request $request)
    {
        $application_id = $request->input('application_id');
        $meeting_id = $request->input('meeting_id');
        $application_code = $request->input('application_code');
        $module_id = $request->input('module_id');
        $table_name = $request->input('table_name');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $stage_category_id = '';
        if(validateIsNumeric($module_id)){
            $table_name = getSingleRecordColValue('par_modules', array('id'=>$module_id), 'tablename');
        }
        if(validateIsNumeric($workflow_stage_id)){
            $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
            $stage_category_id = $stage_data->stage_category_id;
        }


        try {

            if(validateIsNumeric($meeting_id)){
                $qry = DB::table('tc_meeting_details as t3')
                ->select(DB::raw("t3.*"));
                $qry->where('t3.id', $meeting_id);
            }else{
                $qry = DB::table($table_name . ' as t1')
                ->join('tc_meeting_applications as t2', function ($join) use ($application_code) {
                    $join->on('t1.application_code', '=', 't2.application_code');
                })
                ->join('tc_meeting_details as t3', 't2.meeting_id', '=', 't3.id')
                ->select(DB::raw("t3.*"));
                $qry->where('t1.id', $application_id);
            }
            if($stage_category_id == 6 || $stage_category_id == 7){
                $qry->whereRaw("(stage_category_id = 6 OR stage_category_id = 7)");
            }
            if($stage_category_id == 8 || $stage_category_id == 9){
                $qry->whereRaw("(stage_category_id = 8 OR stage_category_id = 9)");
            }
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

    public function saveProductRegistrationComments(Request $req)
    {
        try {
            $user_id = \Auth::user()->id;
            $post_data = $req->all();
            $table_name = 'tra_evaluation_recommendations';
            $id = $post_data['id'];
            $workflow_stage_id = $post_data['workflow_stage_id'];
            //unset unnecessary values
            unset($post_data['_token']);
            unset($post_data['table_name']);
            unset($post_data['model']);
            unset($post_data['id']);
            unset($post_data['unset_data']);
            $unsetData = $req->input('unset_data');
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
            $res = array();
            //check stage category
            if(!validateIsNumeric($workflow_stage_id)){
                return array('success'=>false, 'message'=> "Faild to fetch stage details");
            }
            $stage_data = getTableData('wf_workflow_stages', array('id'=>$workflow_stage_id));
            $stage_category_id = $stage_data->stage_category_id;
            $table_data['stage_category_id'] = $stage_category_id;
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

    public function getOnlineApplications(Request $request)
    {
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        try {
            $data = array();
            $portal_db = DB::connection('portal_db');
            //get process details
            $qry = $portal_db->table('wb_product_applications as t1')
                ->join('wb_product_information as t2', 't1.product_id', '=', 't2.id')
                ->join('wb_trader_account as t3', 't1.trader_id', '=', 't3.id')
                ->join('wb_statuses as t4', 't1.application_status_id', '=', 't4.id')
                ->leftJoin('wb_statuses_types as t6', 't4.status_type_id', '=', 't4.id')
                ->join('wb_trader_account as t5', 't1.local_agent_id', '=', 't5.id')
                ->select('t1.*', 't1.id as active_application_id', 't1.application_code', 't2.brand_name',
                    't3.name as applicant_name', 't3.contact_person', 't5.name as local_agent',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website',
                    't2.*', 't4.name as application_status', 't4.status_type_id', 't4.is_manager_query')
                ->whereIn('application_status_id', array(2, 13, 14, 15,16));

            $modulesData = getParameterItems('par_modules', '', '');
            $subModulesData = getParameterItems('par_sub_modules', '', '');
            $zoneData = getParameterItems('par_branches', '', '');
            if (isset($sub_module_id) && $sub_module_id != '') {
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if (isset($section_id) && $section_id != '') {
                $qry->where('t1.section_id', $section_id);
            }
            $records = $qry->get();
            foreach ($records as $rec) {

                $data[] = array('active_application_id' => $rec->active_application_id,
                    'application_code' => $rec->application_code,
                    'brand_name' => $rec->brand_name,
                    'applicant_name' => $rec->applicant_name,
                    'contact_person' => $rec->contact_person,
                    'local_agent' => $rec->local_agent,
                    'app_physical_address' => $rec->app_physical_address,
                    'application_status' => $rec->application_status,
                    'module_id' => $rec->module_id,
                    'sub_module_id' => $rec->sub_module_id,
                    'reg_product_id' => $rec->reg_product_id,
                    'tracking_no' => $rec->tracking_no,
                    'applicant_id' => $rec->trader_id,
                    'local_agent_id' => $rec->local_agent_id,
                    'section_id' => $rec->section_id,
                    'product_id' => $rec->product_id,
                    'branch_id' => $rec->branch_id,
                    'assessment_procedure_id' => $rec->assessment_procedure_id,
                    'date_added' => $rec->date_added,
                    'submission_date' => $rec->submission_date,
                    'is_manager_query' => $rec->is_manager_query,
                    'status_type_id' => $rec->status_type_id,

                    'prodclass_category_id' => $rec->prodclass_category_id,
                    'productrisk_category_id' => $rec->productrisk_category_id,
                    'module_name' => returnParamFromArray($modulesData, $rec->module_id),
                    'sub_module' => returnParamFromArray($subModulesData, $rec->sub_module_id),
                    'zone_name' => returnParamFromArray($zoneData, $rec->branch_id));

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

    public function deleteUploadedProductImages(Request $req)
    {
        try {
            $record_id = $req->input('id');
            $table_name = $req->input('table_name');
            $user_id = \Auth::user()->id;
            $where = array(
                'id' => $record_id
            );
            $previous_data = getPreviousRecords($table_name, $where);
            if (!$previous_data['success']) {
                return $previous_data;
            }
            $previous_data = $previous_data['results'];
            //get the path to unlink the image s
            $product_img = $previous_data[0];
            $upload_url = env('UPLOAD_DIRECTORY');
            $original_image = $upload_url . '/' . $product_img['document_folder'] . '/' . $product_img['file_name'];
            if (file_exists($original_image)) {
                $thumbnail_img = $upload_url . '/' . $product_img['document_folder'] . '/' . $product_img['thumbnail_folder'] . '/' . $product_img['file_name'];

                unlink($original_image);
                unlink($thumbnail_img);
            }

            $res = deleteRecord($table_name, $previous_data, $where, $user_id);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);

    }

    public function onLoadOnlineproductNutrients(Request $req)
    {
        try {
            $product_id = $req->product_id;
            $data = array();
            //get the records
            $records = DB::connection('portal_db')->table('wb_product_nutrients as t1')
                ->select('t1.*')
                ->where(array('t1.product_id' => $product_id))
                ->get();
            //loop
            $nutrientsCategory = getParameterItems('par_nutrients_category', '', '');
            $si_unitData = getParameterItems('par_si_units', '', '');
            $nutrientsData = getParameterItems('par_nutrients', '', '');

            foreach ($records as $rec) {
                //get the array

                $data[] = array('product_id' => $rec->product_id,
                    'id' => $rec->id,
                    'nutrients_category_id' => $rec->nutrients_category_id,
                    'nutrients_id' => $rec->nutrients_id,
                    'proportion' => $rec->proportion,
                    'units_id' => $rec->units_id,
                    'nutrients' => returnParamFromArray($nutrientsData, $rec->nutrients_id),
                    'nutrients_category' => returnParamFromArray($nutrientsCategory, $rec->nutrients_category_id),
                    'si_unit' => returnParamFromArray($si_unitData, $rec->units_id),
                );

            }
            $res = array('success' => true, 'results' => $data);
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);
    }
    public function saveOnlineProductRegistrationReceiving(Request $req){
        try {
            $application_code = $req->application_code;
            $product_id = $req->product_id;
            $user_id = $this->user_id;
            $product_infor = array('common_name_id'=>$req->common_name_id,
                                'atc_code_id'=>$req->atc_code_id,
                                'classification_id'=>$req->classification_id,
                                'brand_name'=>$req->brand_name,
                                'device_type_id'=>$req->device_type_id,
                                'physical_description'=>$req->physical_description,
                                'dosage_form_id'=>$req->dosage_form_id,
                                'product_form_id'=>$req->product_form_id,
                                'product_strength'=>$req->product_strength,
                                'si_unit_id'=>$req->si_unit_id,
                                'storage_condition_id'=>$req->storage_condition_id,
                                'product_type_id'=>$req->product_type_id,
                                'product_category_id'=>$req->product_category_id,
                                'product_subcategory_id'=>$req->product_subcategory_id,
                                'distribution_category_id'=>$req->distribution_category_id,
                                'special_category_id'=>$req->special_category_id,
                                'intended_enduser_id'=>$req->intended_enduser_id,
                                'intended_use_id'=>$req->intended_use_id,
                                'route_of_administration_id'=>$req->route_of_administration_id,
                                'method_ofuse_id'=>$req->method_ofuse_id,
                                'section_id'=>$req->section_id,
                                'contraindication'=>$req->contraindication,
                                'gmdn_code'=>$req->gmdn_code,
                                'gmdn_category'=>$req->gmdn_category,
                                'gmdn_term'=>$req->gmdn_term,
                                'shelf_lifeafter_opening'=>$req->shelf_lifeafter_opening,
                                'shelf_life'=>$req->shelf_life,
                                'instructions_of_use'=>$req->instructions_of_use,
                                'warnings'=>$req->warnings,
                                'intended_use'=>$req->intended_use,
                                'medical_systemmodel_series'=>$req->medical_systemmodel_series,
                                'medical_family'=>$req->medical_family,
                                'shelflifeduration_desc'=>$req->shelflifeduration_desc,
                                'shelflifeafteropeningduration_desc'=>$req->shelflifeafteropeningduration_desc,
                                'reason_for_classification_id'=>$req->reason_for_classification_id,
                                'prodclass_category_id'=>$req->prodclass_category_id,
                                'productrisk_category_id'=>$req->productrisk_category_id,

                                'has_medical_systemmodel_series'=>$req->has_medical_systemmodel_series,
                                'reagents_accessories'=>$req->reagents_accessories,
                                'has_reagents_accessories'=>$req->has_reagents_accessories,
                                'has_medical_family'=>$req->has_medical_family
                            );
                            $resp = '';

                        if(validateIsNumeric($product_id)){
                                //update the record
                                //product information
                                //date_added
                                $where = array('id'=>$product_id);
                                $where_app = array('product_id'=>$product_id);
                                if (recordExists('wb_product_information', $where, 'portal_db')) {

                                    $product_infor['dola'] = Carbon::now();
                                    $product_infor['altered_by'] = $user_id;
                                    $table_name = 'wb_product_information';
                                    $previous_data = getPreviousRecords($table_name, $where,'portal_db');
                                    $previous_data =  $previous_data['results'];
                                    $resp = updateRecord('wb_product_information', $previous_data, $where, $product_infor, $user_id,'portal_db');

                                }

                        }
                        if($resp['success']){
                            $res = array(
                                 'success'=>true,
                                 'message'=>'Product Notification Updated Successfully');

                         }
                         else{
                            $res = array(
                            'success'=>false,
                            'error'=>$resp['message'],
                            'message'=>'Error Occurred Product Notification not saved, it this persists contact the system Administrator');
                         }


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);



    }


    //export
    public function ExportMeetingReport(Request $req){
        $meeting_id=$req->id;

//product application details
        $ExportMeetingDetails = new Spreadsheet();
        $sheet = $ExportMeetingDetails->getActiveSheet();
        $ExportMeetingDetails->getActiveSheet()->setTitle('Meeting Export');
//get all data
       $meetingDetails=DB::table('tc_meeting_details')
                        ->select('meeting_name','meeting_desc','date_requested')
                       ->where('id',$meeting_id)
                       ->get()->toArray();
      $meetingDetails=$this->prepareArrayOfArrays((array)$meetingDetails);

        $participantDetails=DB::table('tc_meeting_participants')
                            ->where('meeting_id',$meeting_id)
                            ->select('participant_name','phone','email')
                            ->get()->toArray();
      $participantDetails=$this->prepareArrayOfArrays((array)$participantDetails);

       $ApplicationDetails=DB::table('tc_meeting_applications as t1')
             ->leftJoin('tra_product_applications as t4','t1.application_code','t4.application_code')
             ->leftJoin('tra_product_information as t6','t4.product_id','t6.id')
             ->leftJoin('par_common_names as t7','t6.common_name_id','t7.id')
             ->leftJoin('wb_trader_account as t8','t4.applicant_id','t8.id')
             ->leftJoin('par_system_statuses as t9','t4.application_status_id','t9.id')
             ->leftJoin('tra_product_manufacturers as t10','t4.product_id','t10.product_id')
             ->join('tra_manufacturers_information as t11','t10.manufacturer_id','t11.id')
             ->select(DB::raw('t4.reference_no,t6.brand_name,t7.name as common_name,t8.name as applicant_name,t9.name as status'))
             ->where('t1.meeting_id',$meeting_id)
             ->where('t10.manufacturer_type_id',1)
             ->get()->toArray();

             //reoder to pair
             $final_Array=[];
             $array=$this->prepareArrayOfArrays((array)$ApplicationDetails);
              foreach ($array as $key => $value) {
                      foreach ($value as $key => $value2) {
                          $final_Array[]=[$key,$value2];
                      }
                      $final_Array[]=['',''];
                  }

      $ApplicationDetails=$final_Array;


        $cell=2;
//Main heading style
        $styleArray = [
                'font' => [
                    'bold' => true,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
                'borders' => [
                    'top' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                    'rotation' => 90,
                    'startColor' => [
                        'argb' => 'FFA0A0A0',
                    ],
                    'endColor' => [
                        'argb' => 'FFFFFFFF',
                    ],
                ]
            ];

//Sub-Main heading style
        $SubstyleArray = [
              'fill' => [
                    'type' =>  \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'color' => ['rgb' => 'E5E4E2']
                ],
             'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
                ],
             'font'  => [
                  'bold'  =>  true
                ]
        ];

 //first heading
        $sheet->mergeCells('A1:C1')
              ->getCell('A1')
              ->setValue('Meeting Details');
        $sheet->getStyle('A1:C1')->applyFromArray($styleArray);
        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getStyle('B1:B17')
                 ->getNumberFormat()
                ->setFormatCode('0');
//header
        $sheet->getCell('A2')->setValue('Name');
        $sheet->getCell('B2')->setValue('Description');
        $sheet->getCell('C2')->setValue('Date Requested');
        $sheet->getStyle('A2:C2')->applyFromArray($SubstyleArray);
        $cell++;

//loop data while writting
       $sheet->fromArray( $meetingDetails, null,  "A".$cell  );
//jump one row
        $cell=count($meetingDetails)+$cell+1;


 //second heading
        $sheet->mergeCells("A".$cell.":C".$cell)
              ->getCell("A".$cell)
              ->setValue('Perticipants');
        $sheet->getStyle("A".$cell.":C".$cell)->applyFromArray($styleArray);
            $cell++;

//header
        $sheet->getCell("A".$cell)->setValue('Name');
        $sheet->getCell("B".$cell)->setValue('Phone No');
        $sheet->getCell("C".$cell)->setValue('Email');
        $sheet->getStyle("A".$cell.":C".$cell)->applyFromArray($SubstyleArray);
        $cell++;
//write array data to sheet
        $sheet->fromArray( $participantDetails, null,  "A".$cell  );

//jump one row
        $cell=count($participantDetails)+$cell+1;


//third heading
        $sheet->mergeCells("A".$cell.":C".$cell)
              ->getCell("A".$cell)
              ->setValue('Application Details');
        $sheet->getStyle("A".$cell.":C".$cell)->applyFromArray($styleArray);
            $cell++;
           $initialcell=$cell;
//write array data to sheet
        $sheet->fromArray( $ApplicationDetails, null,  "A".$cell  );

//jump one row
        $cell=count($ApplicationDetails)+$cell+1;
$sheet->getStyle("A".$initialcell.":A".$cell)->applyFromArray($SubstyleArray);






          $writer = new Xlsx($ExportMeetingDetails);

            ob_start();
            $writer->save('php://output');
            $excelOutput = ob_get_clean();



$response =  array(
   'name' => "meeting.Xlsx", //no extention needed
   'file' => "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,".base64_encode($excelOutput) //mime type of used format
);

        return $response;



    }

     public function prepareArrayOfArrays(array $array){
        $clean_Array=[];

        //ensure the inner array is array not collection
      foreach ($array as $key => $value) {
          $clean_Array[]=(array)$value;
      }

       return $clean_Array;

    }
    public function saveProductEditionBaseDetails(Request $req){
        $table_data = $req->all();
        $applicant_id = $req->applicant_id;
        $branch_id = $req->branch_id;
        $local_agent_id = $req->local_agent_id;
        $product_id = $req->product_id;
        $application_code = '';
        if(validateIsNumeric($product_id)){
            unset($table_data['product_id']);
            unset($table_data['application_code']);
            unset($table_data['table_name']);
            unset($table_data['tra_product_id']);
            unset($table_data['reg_product_id']);
            //update record
            $app_data = array();
            $app_data['applicant_id'] = $table_data['applicant_id'];
            $app_data['branch_id'] = $table_data['branch_id'];
            $app_data['local_agent_id'] = $table_data['local_agent_id'];
            unset($table_data['applicant_id']);
            unset($table_data['branch_id']);
            unset($table_data['local_agent_id']);
            //app table update
            $app_table_name = 'tra_product_applications';
            $app_where = array(
                'product_id' => $product_id
            );
            $user_id = $this->user_id;

            $prev_appdata = getPreviousRecords($app_table_name, $app_where);

            if ($prev_appdata['success'] == true) {
                $previous_data = $prev_appdata['results'];
                $app_res = updateRecord($app_table_name, $previous_data, $app_where, $app_data, $user_id);
                if($app_res['success']){
                   $application_code = $previous_data[0]['application_code'];
                }else{
                    return $app_res;
                }

            }
            //update info table
            $table_name = 'tra_product_information';
            $where = array(
                'id' => $product_id
            );
            $prev_data = getPreviousRecords($table_name, $where);

            if ($prev_data['success'] == true) {
                $previous_data = $prev_data['results'];
                $res = updateRecord($table_name, $previous_data, $where, $table_data, $user_id);
                if($res['success']){
                   $res['application_code'] = $application_code;
                }

            }
        }else{
            $res = array(
                'success'=>false,
                'message'=>'Product not submitted, please contact administrator'
            );
        }
        return \response()->json($res);
    }
    public function getAllProductsAppsDetails( Request $req)
    {
        $limit = $req->input('limit');
        $page = $req->input('page');
        $start = $req->input('start');
        $filter = $req->input('filter');
        $section_id = $req->section_id;
        $whereClauses = array();
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'brand_name' :
                            $whereClauses[] = "t7.brand_name like '%" . ($filter->value) . "%'";
                            break;
                        case 'common_name' :
                            $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                            break;
                            case 'reference_no' :
                            $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                            break;
                        case 'certificate_no' :
                            $whereClauses[] = "t11.certificate_no like '%" . ($filter->value) . "%'";
                            break;

                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }

        try {
            $qry_count = DB::table('tra_product_applications as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->selectRaw('DISTINCT t7.id');
                DB::enableQueryLog();
            $qry = DB::table('tra_product_applications as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.local_agent_id', '=', 't9.id')
                ->leftJoin('par_classifications as t10', 't7.classification_id', '=', 't10.id')
                ->leftJoin('tra_approval_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                ->leftJoin('tra_registered_products as t12', 't12.tra_product_id', '=', 't7.id')
                ->leftJoin('par_validity_statuses as t4', 't12.validity_status_id', '=', 't4.id')
                ->leftJoin('par_storage_conditions as t13', 't7.storage_condition_id', '=', 't13.id')
                ->leftJoin('tra_product_manufacturers as t14', function ($join) {
                    $join->on('t7.id', '=', 't14.product_id')
                       ->on('t14.manufacturer_type_id', '=', DB::raw(1));
                })
                ->leftJoin('par_dosage_forms as t15', 't7.dosage_form_id', '=', 't15.id')
                ->select(DB::raw("DISTINCT t7.id,t7.*, t1.*, t1.id as active_application_id, t1.reg_product_id, t3.name as applicant_name, t9.name as local_agent,
                t13.name as storage_condition, t7.brand_name, t7.id as tra_product_id, t8.name as common_name, t10.name as classification_name, t11.certificate_no, t11.expiry_date,
                t7.brand_name as sample_name, t14.manufacturer_id, t15.name as dosage_form"));



            if(validateIsNumeric($section_id)){
                $qry->where('t1.section_id', $section_id);
                 $qry_count->where('t1.section_id', $section_id);
            }

            if ($filter_string != '') {
                $qry->whereRAW($filter_string);

                $results = $qry->orderBy('t11.expiry_date','desc')->groupBy('t7.id')->skip($start)->take($limit)->get();
                $count = $qry_count->count();
            }
            else{
                $count = 0;
                $results = array();
            }

            $res = array(
                'success' => true,
                'results' => $results,
                'total' => $count,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getCertificateConfirmationApplications(Request $request)
    {
        $approvaldecision_response_id = $request->input('approvaldecision_response_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $module_id = $request->input('module_id');
        $table_name = getTableName($module_id);
        try {
            $qry = DB::table($table_name.' as t1')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', function ($join) {
                    $join->on('t1.application_status_id', '=', 't4.id');
                })
                ->join('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                 ->Join('tra_submissions as t9', 't1.application_code', '=', 't9.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('tra_certificate_confirmations as t12', 't1.application_code', '=', 't12.application_code')
                ->leftJoin('par_approval_decision_responses as t13', 't12.approvaldecision_response_id', '=', 't13.id')
                ->select('t1.*', 't10.email as submitted_by', 't9.date_received as submitted_on', 't3.name as applicant_name', 't4.name as application_status',
                    't6.name as approval_status', 't5.decision_id', 't12.approvaldecision_response_id', 't1.id as active_application_id', 't13.name as approvaldecision_response', 't5.approval_date', DB::raw("working_days(date(t9.date_received) , CURRENT_DATE) as days_span"))
                ->where(array('t9.is_done'=> 0, 't9.current_stage'=> $workflow_stage_id));

            if(validateIsNumeric($approvaldecision_response_id) && $approvaldecision_response_id != 5){
                $qry->where('t12.approvaldecision_response_id', $approvaldecision_response_id);
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
    public function getCertificateChangesRequests(Request $req){

        $application_code = $req->application_code;
        try{
            $results = DB::table('tra_certificate_changes as t1')
                    ->leftJoin('users as t3', 't1.approved_by', 't3.id')
                    ->where('t1.application_code', $application_code)
                    ->select('t1.*',DB::raw("CONCAT(decryptval(t3.first_name,".getDecryptFunParams()."),' ', decryptval(t3.last_name,".getDecryptFunParams().")) as approved_by"))
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
    public function updateCertificateChangeRequestDecision(Request $req)
    {
        try{
            $user_id = $this->user_id;
            $change_id = $req->change_id;
            $decision_id = $req->decision_id;
            $application_code = $req->application_code;
            $remarks = $req->remarks;
            $where = array('id', null);
            $table_data = [];
            $res = array('message'=>'No payload passed, Please Contact System Admin', 'success'=>false);
            //for application update
            if(validateIsNumeric($application_code)){
                $where = array('application_code'=>$application_code);
                $table_data = array(
                    'is_done' => 1,
                    'changed_by' => $user_id,
                    'changed_on' => Carbon::now(),
                    'remarks' => $remarks
                );

                $res = updateRecord('tra_certificate_changes', $where, $table_data, $user_id);
            }
            if(validateIsNumeric($change_id)){
                $where = array('id'=>$change_id);
                $table_data = array(
                    'change_decision_id' => $decision_id,
                    'approved_by' => $user_id,
                    'approved_on' => Carbon::now()
                );
                $res = updateRecord('tra_certificate_changes', $where, $table_data, $user_id);
            }


        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getManagerCertificateReleaseApplications(Request $request)
    {

        $table_name = $request->input('table_name');

        $workflow_stage = $request->input('workflow_stage_id');

        try {
            $qry = DB::table($table_name . ' as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', function ($join) {
                    $join->on('t1.application_status_id', '=', 't4.id');
                })
                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_approval_decisions as t6', 't5.decision_id', '=', 't6.id')
                ->leftJoin('tra_submissions as t9', 't1.application_code', '=', 't9.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('tra_certificate_changes as t12', function ($join) {
                    $join->on('t1.application_code', '=', 't12.application_code');
                    $join->where('t12.change_decision_id', 3);
                    $join->orWhereNull('t12.change_decision_id');
                    $join->limit(1);
                })
                ->leftJoin('tra_certificate_changes as t13', function ($join) {
                    $join->on('t1.application_code', '=', 't13.application_code');
                    $join->where('t13.isdone', 0);
                    $join->orWhereNull('t13.isdone');
                    $join->limit(1);
                })
                ->select('t1.*', 't10.email as submitted_by', 't9.date_received as submitted_on', 't3.name as applicant_name', 't4.name as application_status',
                    't6.name as approval_status', 't5.decision_id', 't1.id as active_application_id', 't5.approval_date', 't12.id as is_processed', 't13.id as update_status')
                ->where(array('t9.current_stage'=>$workflow_stage,'t9.is_done'=>0));

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
    public function closeApprovalDecisionConfirmationEntry(Request $req){

        $application_code = $req->input('application_code');
        $is_certificate = $req->input('is_certificate');
        $remarks = $req->remarks;
        $user_id = $this->user_id;
        if($is_certificate == 1){
            $flag_off = 1;
        }else{
            $flag_off = 2;
        }
        try {
            $where = array('application_code' => $application_code);
            $check = DB::table('tra_certificate_confirmations')->where($where)->count();
            if($check>0){
                $prev_data = getPreviousRecords('tra_certificate_confirmations', $where);
                $table_data = array(
                    'approvaldecision_response_id' => $flag_off
                );
                if ($prev_data['success'] == true) {
                    $previous_data = $prev_data['results'];
                    $res = updateRecord('tra_certificate_confirmations', $previous_data, $where, $table_data, $user_id);
                }else{
                    $res = $prev_data;
                }
            }else{
                $table_data = array(
                    'application_code' => $application_code,
                    'approvaldecision_response_id' => $flag_off,
                    'confirmed_by' => $user_id,
                    'confirmed_on' => Carbon::now(),
                    'remarks' => $remarks
                );
                $res = insertRecord('tra_certificate_confirmations', $table_data, $user_id);
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function handleManagerCertificateConfirmationRelease(Request $req)
    {
        $application_code = $req->input('application_code');
        $remarks = $req->remarks;
        $user_id = $this->user_id;
        DB::beginTransaction();
        try {
            $where = array('application_code' => $application_code);
            //set is done to all changes
            $prev_data = getPreviousRecords('tra_certificate_changes', $where);
            $table_data = array(
                'is_done' => 1
            );
            if ($prev_data['success'] == true) {
                $previous_data = $prev_data['results'];
                $res = updateRecord('tra_certificate_changes', $where, $table_data, $user_id);
            }else{
                $res = $prev_data;
            }

            //confirmation table
            $prev_data = getPreviousRecords('tra_certificate_confirmations', $where);
            $table_data = array(
                'approvaldecision_response_id' => 1,
                'confirmed_by' => $user_id,
                'confirmed_on' => Carbon::now(),
                'remarks' => $remarks
            );
            if ($prev_data['success'] == true) {
                $previous_data = $prev_data['results'];
                if(!empty($prev_data)){
                   $res = updateRecord('tra_certificate_confirmations', $where, $table_data, $user_id);
               }else{
                $confirm_data = array(
                    'approvaldecision_response_id' => 1,
                    'confirmed_by' => $user_id,
                    'confirmed_on' => Carbon::now(),
                    'remarks' => $remarks,
                    'application_code' => $application_code
                );
                $res = insertRecord('tra_certificate_confirmations', $confirm_data, $user_id);
               }

            }else{
                $res = $prev_data;
            }
            //add transition
            //get previous submission details
            $pre_submission = getLastApplicationSubmissionDetails($application_code);
            $prev_subdata = $pre_submission['results'];
            $previous_stage_id = $prev_subdata->current_stage;
            $stage_details = DB::table('wf_workflow_stages')->where('id', $previous_stage_id)->first();
            $tras_details = DB::table('wf_workflow_transitions')
                ->where(array('workflow_id'=> $stage_details->workflow_id, 'is_approval_decision_confirmation' => 1))
                ->first();
            $module_id = $prev_subdata->module_id;
            $table_name = getTableName($module_id);
            $application_id = getSingleRecordColValue($table_name, array('application_code' => $application_code), 'id');
            if(!empty($tras_details)){

                $to_stage = $tras_details->nextstage_id;
                $application_status_id = $tras_details->application_status_id;
                $transition_params = array(
                    'application_id' => $application_id,
                    'application_code' => $application_code,
                    'application_status_id' => $application_status_id,
                    'process_id' => $prev_subdata->process_id,
                    'from_stage' => $previous_stage_id,
                    'to_stage' => $to_stage,
                    'author' => $user_id,
                    'remarks' => $remarks,
                    'created_on' => Carbon::now(),
                    'created_by' => $user_id
                );

                DB::table('tra_applications_transitions')
                    ->insert($transition_params);

                //submissions
                $submission_params = convertStdClassObjToArray($prev_subdata);
                $submission_params['usr_from'] = $user_id;
                $submission_params['previous_stage'] = $previous_stage_id;
                $submission_params['current_stage'] = $to_stage;
                $submission_params['application_status_id'] = $application_status_id;
                $submission_params['remarks'] = $remarks;
                $submission_params['date_received'] = Carbon::now();
                $submission_params['created_on'] = Carbon::now();
                $submission_params['created_by'] = $user_id;
                //unset specifics
                unset($submission_params['id']);
                unset($submission_params['dola']);
                unset($submission_params['isComplete']);
                unset($submission_params['is_done']);
                unset($submission_params['is_read']);

                DB::table('tra_submissions')->insert($submission_params);

                updateInTraySubmissions('', $application_code, $previous_stage_id, $user_id);

                //update application status
                $where = array(
                    'application_code' => $application_code
                );
                $app_update = array(
                    'workflow_stage_id' => $to_stage,
                    'application_status_id' => $application_status_id
                );
                $prev_data = getPreviousRecords($table_name, $where);

                if ($prev_data['success'] == false) {
                    DB::rollBack();
                    echo json_encode($prev_data);
                    exit();
                }
                $update_res = updateRecord($table_name, $where, $app_update, $user_id);
                if ($update_res['success'] == false) {
                    DB::rollBack();
                    echo json_encode($update_res);
                    exit();
                }

                //update portal status
                $action_details = DB::table('wf_workflow_actions')
                                    ->where('id', $tras_details->action_id)
                                    ->first();

                $portal_status_id = $action_details->portal_status_id;
                $portal_table = getPortalApplicationsTable($module_id);
                $proceed = updatePortalApplicationStatus($application_id, $portal_status_id, $table_name, $portal_table);
               $res = array('success'=> true, 'message'=> 'Confirmed Successfully');
            }else{
                $res = array('success'=> false, 'message'=> 'No set confirmation transition, please contact admin');
            }
            DB::commit();

            //log the certificate to dms

            //send email notification based on decision
            $applicant_email = getTraderEmail($prev_subdata->applicant_id);
            $vars = array(
                    '{reference_no}' => $prev_subdata->reference_no,
                    '{reason}' => $remarks
                );
            sendTemplatedApplicationNotificationEmail(23, $applicant_email, $vars);

        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getApplicationRejectionAppealResponses(Request $req){
        $application_code = $req->application_code;
        try{
            $qry = DB::table('tra_responseson_intentsforrejection as t1')
                    ->where('application_code', $application_code);

            $results = $qry->get();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveRejectionAppealResponseRecommendationDetails(Request $req)
    {
        $application_code = $req->application_code;
        $decision_id = $req->decision_id;
        $comments = $req->comments;
        $user_id = $this->user_id;
        DB::beginTransaction();
        try{
            $app_data = array(
                'reviewed_by' => $user_id,
                'reviewed_on' => Carbon::now(),
                'review_remarks' => $comments,
                'review_approval_recommendation_id' => $decision_id
            );
            $where = array(
                    'application_code' => $application_code
                );
            $prev_data = getPreviousRecords('tra_responseson_intentsforrejection', $where);

            if(!isset($prev_data['results'][0])){
                DB::rollBack();
                $res = array('success'=>false, 'message'=>'Failed to fetch application details');
                return $res;
            }
            if ($prev_data['success'] == false) {
                DB::rollBack();
                echo json_encode($prev_data);
                exit();
            }

            $res = updateRecord('tra_responseson_intentsforrejection', $prev_data['results'], $where, $app_data, $user_id);
            if ($res['success'] == false) {
                echo json_encode($res);
                exit();
            }
            DB::commit();
        }catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function checkRejectionAppealResponseRecommendation(Request $req)
    {
        $application_code = $req->application_code;
        try{
            $getRecom = DB::table('tra_responseson_intentsforrejection')->where('application_code', $application_code)->first();
            if(validateIsNumeric($getRecom->review_approval_recommendation_id)){
                $has_recommendation = true;
            }else{
                $has_recommendation = false;
            }
            $res = array(
                    'success' => true,
                    'has_recommendation' => $has_recommendation,
                    'message' => 'All is well'
                );
        }catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getProductApplicationDetailsTag(Request $req)
    {
        $application_code = $req->application_code;
        $module_id = $req->module_id;
        $table_name=getTableName($module_id);

        try{
            $prod = DB::table($table_name.' as t1')
                        ->leftJoin('wb_trader_account as t3', 't1.applicant_id', 't3.id')
                        ->select('t3.name as applicant','t3.email','t3.telephone_no')
                        ->where('application_code', $application_code)
                        ->first();

            $res = array(
                    'success' => true,
                    'results' => 'Applicant: <b>'. $prod->applicant. ' </b> | Email: <b>'.$prod->email.'</b> | Phone: <b>'.$prod->telephone_no.'</b>',
                    'message' => 'All is well'
                );
        }catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getStageProductsApplications(Request $request)
    {
        $module_id = $request->input('module_id');
        $workflow_stage = $request->input('workflow_stage_id');
		$application_code = $request->input('application_code');
        $table_name = getTableName($module_id);
		$section_id = getSingleRecordColValue($table_name, ['application_code'=>$request->application_code], 'section_id');
        try {
            $qry = DB::table($table_name . ' as t1')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', 't4.id')
                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_prodclass_categories as t7', 't1.prodclass_category_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')
                ->leftJoin('tra_submissions as t9', 't9.application_code', '=', 't1.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('tra_product_screening_approvals as t11', 't1.application_code', 't11.application_code')
                ->leftJoin('tra_listing_approvals as t15', 't1.application_code', 't15.application_code')
                ->leftJoin('tra_cosmetic_listing_approvals as t25', 't1.application_code', 't25.application_code')
                ->leftJoin('wf_workflow_stages as t12', 't9.current_stage', 't12.id')
                ->leftJoin('tra_evaluation_recommendations as t13', function ($join) use($workflow_stage) {
                    $join->on('t1.application_code', '=', 't13.application_code')
                        ->on('t12.stage_category_id', '=', 't13.stage_category_id')
                        ->where('t9.current_stage', $workflow_stage);
                })
                ->leftJoin('tra_approval_recommendations as t14', 't1.application_code', 't14.application_code')
                ->leftJoin('tra_esignrequest_log as t21', function ($join) use($workflow_stage) {
                    $join->on('t1.application_code', '=', 't21.application_code')
                        ->where('t21.is_sent', 1)
                        ->where('t21.workflow_stage_id', $workflow_stage);
                })
                ->leftJoin('tra_esign_status as t22', 't21.status_id', 't22.id')

                ->select('t1.*', 't2.product_origin_id', 't2.brand_name as product_name','t2.device_brand_name', 't7.name as prodclass_category', DB::raw("CONCAT(decryptval(t10.first_name,".getDecryptFunParams()."),' ',decryptval(t10.last_name,".getDecryptFunParams().")) as submitted_by, CONCAT(t22.name, ' - ', t21.response_comment) as sign_request_status"), 't9.date_received as submitted_on', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t1.prodclass_category_id',
                     't1.id as active_application_id', 't11.decision_id','t15.listing_decision_id','t25.listing_decision_id as cos_listing_decision_id','t11.approval_date','t11.expiry_date', 't11.id as approval_id', 't12.stage_category_id','t13.id as recommendation_record_id','t13.recommendation_id','t13.remarks','t14.decision_id as approval_decision_id')
                ->where(array('t9.current_stage'=>$workflow_stage,'t9.is_done'=>0) );

            $results = $qry->orderBy('t9.id','desc')->get();
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
    public function onSaveProductScreeningDecision(Request $req)
    {
        try{
            $approval_id = $req->approval_id;
            $application_code = $req->application_code;
            $sub_module_id = $req->sub_module_id;
            $module_id = $req->module_id;
            $decision_id = $req->decision_id;
            $approval_date = $req->approval_date;
            $expiry_date = $req->expiry_date;
            $remarks = $req->remarks;
            $reg_product_id = $req->reg_product_id;
            $user_id = $this->user_id;

            $app_details = DB::table('tra_product_applications as t1')
                            ->join('wb_trader_account as t2', 't1.applicant_id', 't2.id')
                            ->select('t1.*', 't2.name as applicant_name', 't2.email as applicant_email')
                            ->where('application_code', $application_code)
                            ->first();


            $app_data = array(
                'module_id' => $req->module_id,
                'application_code' => $req->application_code,
                'decision_id' => $req->decision_id,
                'approval_date' => $req->approval_date,
                'expiry_date' => $req->expiry_date,
                'comment' => $req->remarks,
                'approved_by' => $req->user_id,
                'certificate_no' => $app_details->reference_no
            );
            if(isset($approval_id)){
                $app_data = array(
                    'decision_id' => $req->decision_id,
                    'approval_date' => $req->approval_date,
                    'expiry_date' => $req->expiry_date,
                    'comment' => $req->remarks,
                    'approved_by' => $user_id
                );
                $where = array(
                    'application_code'=>$application_code
                );
                $res = updateRecord('tra_product_screening_approvals', $where, $app_data);
            }else{
                $res = insertRecord('tra_product_screening_approvals', $app_data);
            }
            //for exemptions approvals
            $data = array(
                'approval_decision_id' => $req->decision_id
            );
            $where = array(
                'application_code'=>$application_code
            );
            updateRecord('tra_exemption_products', $where, $data);

            if($decision_id == 1 ){
                $message = "<p style= 'font-size:18px;font-weight: bold;font-style:underline;'>NOTICE FOR APPROVAL OF YOUR EXEMPTION APPLICATION REQUEST FOR ".$app_details->tracking_no."</b></p>";
                $message .= "<p>";
                $message .= "Reference is made to the exemption request of the above mentioned application.";
                $message .= "<p>";
                $message .= "BOMRA wishes to notify you that, exemption for your products with reference number ".$app_details->reference_no." has been approved please find the attached exemption letter for more details <br>";
                $message .= "<p>";

                $message .= "<p>";

                 sendMailNotification($app_details->applicant_name, $app_details->applicant_email,'Approval Recommendation',$message);

            }
            else{
                $message = "<p style= 'font-size:18px;font-weight: bold;font-style:underline;'>NOTICE OF REJECTION OF YOUR EXEMPTION APPLICATION REQUEST FOR ".$app_details->tracking_no."</b></p>";
                $message .= "<p>";
                $message .= "Reference is made to the exemption request of the above mentioned application.";
                $message .= "<p>";
                $message .= "BOMRA wishes to notify you that, exemption for your products with reference number ".$app_details->reference_no." has been rejected please find the attached rejection letter for more details <br>";
                $message .= "<p>";
               
                $message .= "<p>";

                sendMailNotification($app_details->applicant_name, $app_details->applicant_email,'Rejection Recommendation',$message);

            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveApplicationChecklistDetails(Request $request)
    {
        $application_id = $request->input('application_id');
        $application_code = $request->input('application_code');
        $screening_details = $request->input('screening_details');
        $module_id = $request->input('module_id');
        $sub_module_id = $request->input('sub_module_id');
        $screening_details = json_decode($screening_details);
        $table_name = 'tra_checklistitems_responses';
        $user_id = $this->user_id;
        $submission_details = getLastApplicationSubmissionDetails($application_code);
        $submission_id = 0;
        $workflow_stage_id = 0;
        if($submission_details['success']){
            $submission_details = $submission_details['results'];
            $submission_id = $submission_details->id;
            $workflow_stage_id = $submission_details->current_stage;
        }

        try {
            $insert_params = array();
            DB::beginTransaction();
            foreach ($screening_details as $screening_detail) {
                $auditor_comment = '';
                $auditorpass_status = '';
                $audit = '';
                $auditorpass_status = '';
                $audit_created_by = '';
                $audit_altered_by = '';
                $audit_altered_on = '';
                $audit_created_on = '';
                if (property_exists($screening_detail, 'auditor_comment')) {
                    $auditor_comment = $screening_detail->auditor_comment;

                    $audit_created_on = Carbon::now();

                    $audit_altered_by = $user_id;
                    $audit_altered_on = Carbon::now();
                }
                 if (property_exists($screening_detail, 'auditorpass_status')) {

                    $auditorpass_status = $screening_detail->auditorpass_status;
                    $audit_altered_by = $user_id;
                    $audit_altered_on = Carbon::now();
                 }
                $item_resp_id = $screening_detail->item_resp_id;
                if (isset($item_resp_id) && $item_resp_id != '') {
                    $where = array(
                        'id' => $item_resp_id
                    );
                    $pass_status = $screening_detail->pass_status;
                    if (DB::table('tra_checklistitems_queries')
                            ->where('item_resp_id', $item_resp_id)
                            ->where('status', '<>', 4)
                            ->count() > 0) {
                       // $pass_status = ;
                    }

                    $update_params = array(
                        'pass_status' => $pass_status,
                        'comment' => $screening_detail->comment,
                        'observation' => $screening_detail->observation,
                        'auditorpass_status'=>$auditorpass_status,
                        'auditor_comment' => $auditor_comment,
                        'audit_altered_on' => $audit_altered_on,
                        'audit_altered_by' => $audit_altered_by,
                        'dola' => Carbon::now(),
                        'altered_by' => $user_id
                    );
                    if(isset($screening_detail->risk_type)){
                       $update_params['risk_type'] = $screening_detail->risk_type;
                     //  $update_params['risk_type_remarks'] = $screening_detail->risk_type_remarks;
                    }
                    // $prev_data = getPreviousRecords($table_name, $where);
                    updateRecord($table_name, $where, $update_params, $user_id);
                    if($auditorpass_status != ''){

                    }
                } else {
                    if(!isset($screening_detail->risk_type)){
                        deleteRecord($table_name, ['application_code' => $application_code,
                            'checklist_item_id' => $screening_detail->checklist_item_id]);
                        $insert_params[] = array(
                            'application_id' => $application_id,
                            'application_code' => $application_code,
                            'checklist_item_id' => $screening_detail->checklist_item_id,
                            'risk_type' => null,
                            'risk_type_remarks' => null,
                            'pass_status' => $screening_detail->pass_status,
                            'comment' => $screening_detail->comment,
                            'auditorpass_status'=>$auditorpass_status,
                            'auditor_comment' => $auditor_comment,
                            'observation' => $screening_detail->observation,
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id,
                            'submission_id' => $submission_id
                        );
                    }else{
                        $insert_params[] = array(
                            'application_id' => $application_id,
                            'application_code' => $application_code,
                            'risk_type' => $screening_detail->risk_type,
                            'risk_type_remarks' => $screening_detail->risk_type_remarks,
                            'checklist_item_id' => $screening_detail->checklist_item_id,
                            'pass_status' => $screening_detail->pass_status,
                            'comment' => $screening_detail->comment,
                            'auditorpass_status'=>$auditorpass_status,
                            'auditor_comment' => $auditor_comment,
                            'observation' => $screening_detail->observation,
                            'created_on' => Carbon::now(),
                            'created_by' => $user_id,
                            'submission_id' => $submission_id
                            );
                        }

                }
            }
            if (count($insert_params) > 0) {
                //DB::table($table_name)
                  //  ->insert($insert_params);
                $res = insertMultipleRecords($table_name, $insert_params);
                if(!isset($res['success']) || $res['success'] == false){
                    DB::rollback();
                    return $res;
                }
                //log entry
                $log_data = array(
                    'submission_id' => $submission_id,
                    'workflow_stage_id' => $workflow_stage_id,
                    'application_code' => $application_code,
                    'user_id' => $user_id
                );
                $res = insertRecord('tra_applicationchecklist_logs', $log_data, $user_id);
                if(!isset($res['success']) || $res['success'] == false){
                     DB::rollback();
                    return $res;
                }
            }
            if($module_id == 2 && $sub_module_id == 50){
                $where = ['t1.application_id' => $application_id, 't1.application_code' => $application_code];
                $minor = DB::table('tra_checklistitems_responses as t1')
                        ->join('par_checklist_items as t2', 't1.checklist_item_id', 't2.id')
                        ->join('par_checklist_types as t3', 't2.checklist_type_id', 't3.id')
                        ->where($where)
                        ->where('risk_type', 1)
                        ->where('pass_status', 2)
                        ->count();
                $major = DB::table('tra_checklistitems_responses as t1')
                        ->join('par_checklist_items as t2', 't1.checklist_item_id', 't2.id')
                        ->join('par_checklist_types as t3', 't2.checklist_type_id', 't3.id')
                        ->where($where)
                        ->where('risk_type', 2)
                        ->where('pass_status', 2)
                        ->count();
                $critical = DB::table('tra_checklistitems_responses as t1')
                        ->join('par_checklist_items as t2', 't1.checklist_item_id', 't2.id')
                        ->join('par_checklist_types as t3', 't2.checklist_type_id', 't3.id')
                        ->where($where)
                        ->where('risk_type', 3)
                        ->where('pass_status', 2)
                        ->count();

                $risk_compliance = array(
                    'minor_compliances' => $minor,
                    'major_compliances' => $major,
                    'critical_compliances' => $critical,
                );
                $res = updateRecord('tra_premiseinspection_applications', ['id' => $application_id], $risk_compliance);
                if(!isset($res['record_id'])){
                    return $res;
                }
                updateFacilityRiskScore();
                //complete pending inspections from the licensing module
                $premise_id = getSingleRecordColValue('tra_premiseinspection_applications', ['id' => $application_id], 'premise_id');
                $premise_submission_list = DB::table("tra_premises_applications as t1")
                        ->join('tra_submissions as t2', 't1.application_code', 't2.application_code')
                        ->join('wf_workflow_stages as t3', 't2.current_stage', 't3.id')
                        ->where(['t3.stage_category_id'=> 17,'is_done' => 0, 't1.premise_id' => $premise_id])
                        ->select('t2.id as submission_id')
                        ->get();
                $submission_ids = convertStdClassObjToArray($premise_submission_list);
                if(count($submission_ids) > 0){
                    DB::table('tra_submissions')->where($submission_ids)->update(['is_done'=>1, 'remarks'=> 'Cleared by inspections conducted on the facility via routine inspections']);
                }
            }
            DB::commit();
            $res = array(
                'success' => true,
                'message' => 'Screening details saved successfully!!'
            );
        } catch (\Exception $exception) {
             DB::rollback();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
             DB::rollback();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
     public function getApprovedScreeningProductsApplications(Request $request)
    {
        $tracking_no = $request->input('tracking_no');
        $section_id = $request->input('section_id');
        try {
            $qry = DB::table('tra_product_screening_approvals as t0')
                ->join('tra_product_applications as t1', 't1.application_code', '=', 't0.application_code')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', 't4.id')
                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_prodclass_categories as t7', 't1.prodclass_category_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')

                
                ->leftJoin('tra_registered_products as t12', 't2.id', '=', 't12.tra_product_id')
                ->leftJoin('tra_product_registration_requests as t13', 't2.id', '=', 't13.screening_product_id')

                ->select('t2.*','t1.*', 't2.product_origin_id', 't2.brand_name as product_name', 't7.name as prodclass_category', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t1.prodclass_category_id',
                     't1.id as active_application_id', 't0.decision_id','t0.approval_date','t0.expiry_date', 't0.id as approval_id', 't1.application_code as active_application_code', 't1.id as active_application_id', 't12.id as reg_product_id','t2.id as tra_product_id')
                ->where('t0.decision_id', 1)
                ->where('t1.sub_module_id', '!=', 70)
                ->whereNull('t13.id');
            if($tracking_no != ''){
                $qry->where('t1.tracking_no', 'LIKE', '%'.$tracking_no.'%');
                $qry->orWhere('t1.reference_no', 'LIKE', '%'.$tracking_no.'%');
            }
            if(validateIsNumeric($section_id)){
                $qry->where('t1.section_id', $section_id);
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
    public function getApprovedProductsRegApplications(Request $req){
        $limit = $req->input('limit');
        $page = $req->input('page');
        $start = $req->input('start');
        $section_id = $req->input('section_id');
        $man_site_id = $req->input('man_site_id');
        $filter = $req->input('filter');
        $search_value = $req->input('search_value');
        $status_id = $req->input('status_id');
        $registration_status_id =explode(',',$status_id);
        $search_field = $req->input('search_field');
        $filter = $req->input('filter');
        $tracking_no = $req->input('tracking_no');
        $whereClauses = array();
        $filter_string = '';
        if (isset($filter)) {
            $filters = json_decode($filter);
            if ($filters != NULL) {
                foreach ($filters as $filter) {
                    switch ($filter->property) {
                        case 'brand_name' :
                            $whereClauses[] = "t7.brand_name like '%" . ($filter->value) . "%'";
                            break;
                        case 'common_name' :
                            $whereClauses[] = "t8.name like '%" . ($filter->value) . "%'";
                            break;
                        case 'certificate_no' :
                            $whereClauses[] = "t11.certificate_no like '%" . ($filter->value) . "%'";
                            break;
                             case 'reference_no' :
                            $whereClauses[] = "t1.reference_no like '%" . ($filter->value) . "%'";
                            break;

                    }
                }
                $whereClauses = array_filter($whereClauses);
            }
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }

        try {
            $qry_count = DB::table('tra_product_applications as t1')
                ->join('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->join('tra_registered_products as t12', 't12.tra_product_id', '=', 't7.id')
                ->leftJoin('par_register_deletion_log as t13', 't1.application_code', '=', 't13.application_code')
                ->distinct('t7.id');
                DB::enableQueryLog();
            $qry = DB::table('tra_product_applications as t1')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->join('tra_product_information as t7', 't1.product_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't7.common_name_id', '=', 't8.id')
                ->leftJoin('wb_trader_account as t9', 't1.local_agent_id', '=', 't9.id')
                ->leftJoin('par_classifications as t10', 't7.classification_id', '=', 't10.id')
                ->leftJoin('tra_approval_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                ->join('tra_registered_products as t12', 't12.tra_product_id', '=', 't7.id')
                ->leftJoin('par_register_deletion_log as t13', 't1.application_code', '=', 't13.application_code')
                ->leftJoin('par_validity_statuses as t4', 't12.validity_status_id', '=', 't4.id')
                ->leftJoin('tra_product_manufacturers as t14', function ($join) {
                    $join->on('t7.id', '=', 't14.product_id')
                        ->on('t14.manufacturer_type_id', '=', DB::raw(1));
                })
                ->leftJoin('par_dosage_forms as t15', 't7.dosage_form_id', '=', 't15.id')
                ->leftJoin('par_prodclass_categories as t16', 't1.prodclass_category_id', '=', 't16.id')
                ->leftJoin('users as t17', 't11.approved_by', '=', 't17.id')
                ->select(DB::raw("t7.*, t1.*, t1.id as active_application_id, t1.reg_product_id, t3.name as applicant_name, t9.name as local_agent, t4.name as application_status,
                t7.storage_condition, t7.brand_name, t7.id as tra_product_id, t8.name as common_name, t10.name as classification_name, t11.certificate_no, t11.approval_date, t11.decision_id, t12.expiry_date,
                t7.brand_name as sample_name,t7.physical_description as product_description, t14.manufacturer_id, t15.name as dosage_form, t16.name as prodclass_category, CONCAT(decryptval(t17.first_name,".getDecryptFunParams()."),' ',decryptval(t17.last_name,".getDecryptFunParams().")) as approved_by"));

            if (validateIsNumeric($section_id)) {
                $qry->where('t1.section_id', $section_id);
            }
            if (validateIsNumeric($man_site_id)) {
              //  $qry->where('t14.man_site_id', $man_site_id);
            }
            if ($search_value != '') {
                $qry = $qry->where($search_field, 'like', '%' . $search_value . '%');
            }
            if ($tracking_no != '') {
                $qry->where('t1.tracking_no', $tracking_no)
                    ->orwhere('t1.mgr_application_no', $tracking_no);
                
            }
            if(count($registration_status_id) >0){
               //$qry->whereIn('t12.registration_status_id', $registration_status_id);
            }
            else{
            }
            $qry->where('t12.registration_status_id', 2);
            $qry_count->where('t12.registration_status_id', 2);
            $qry->whereNull('t13.id');
           // $qry_count->whereNull('t13.id');
            $qry->whereNotIn('t1.sub_module_id', [7]);
            $qry_count->whereNotIn('t1.sub_module_id', [7]);
            if($filter_string != ''){
                $qry->whereRAW($filter_string);
            }
            $count = $qry_count->count();
          //  $results = $qry->orderBy('t11.expiry_date','desc')->groupBy('t7.id')->skip($start)->take($limit)->get();
            $results = $qry->get()->slice($start)->take($limit);
            $res = array(
                'success' => true,
                'results' => $results,
                'total' => $count,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getMeetingStageApplications(Request $request)
    {
        $module_id = $request->input('module_id');
        $workflow_stage = $request->input('workflow_stage_id');
        $meeting_id = $request->input('meeting_id');
        $is_member_view = $request->is_member_view;
        $table_name = getTableName($module_id);
        try {
            $qry = DB::table('tc_meeting_applications as t0')
                ->join($table_name.' as t1', 't1.application_code', '=', 't0.application_code')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', 't4.id')
                // ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_prodclass_categories as t7', 't1.prodclass_category_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')

                ->leftJoin('tra_submissions as t9', 't9.application_code', '=', 't1.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('tra_product_screening_approvals as t11', 't1.application_code', 't11.application_code')
                ->leftJoin('wf_workflow_stages as t12', 't9.current_stage', 't12.id')
                // ->leftJoin('tra_evaluation_recommendations as t13', function ($join) use($workflow_stage) {
                //     $join->on('t1.application_code', '=', 't13.application_code')
                //         ->on('t12.stage_category_id', '=', 't13.stage_category_id');

                //     if($workflow_stage){
                //         $join->where('t9.current_stage', $workflow_stage);
                //     }
                // })
                // ->leftJoin('tra_approval_recommendations as t14', 't1.application_code', 't14.application_code')

                ->select('t1.*', 't2.product_origin_id', 't2.brand_name as product_name', 't7.name as prodclass_category', DB::raw("CONCAT(decryptval(t10.first_name,".getDecryptFunParams()."),' ',decryptval(t10.last_name,".getDecryptFunParams().")) as submitted_by"), 't9.date_received as submitted_on', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t1.prodclass_category_id',
                     't1.id as active_application_id', 't11.decision_id','t11.approval_date','t11.expiry_date', 't11.id as approval_id', 't0.stage_category_id')
                ->where('is_done', 0);
            if(validateIsNumeric($workflow_stage)){
                $qry->where('t9.current_stage', $workflow_stage);
            }
            if(validateIsNumeric($meeting_id)){
                $qry->where('t0.meeting_id', $meeting_id);
            }
            if(validateIsNumeric($is_member_view) && validateIsNumeric($workflow_stage)){
                $stage_category_id =getSingleRecordColValue('wf_workflow_stages', ['id' => $workflow_stage], 'stage_category_id');
                // dd($stage_category_id);
                $qry->leftJoin('tra_rc_meeting_recommendations as t13',function ($join) use($stage_category_id) {
                    $join->on('t1.application_code', '=', 't13.application_code')
                        ->on('t13.stage_category_id', '=', DB::raw($stage_category_id));
                });
                $qry->addSelect('t13.recommendation_id','t13.remarks');
            }
            $results = $qry->orderBy('t9.id','desc')->get();
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
    public function onLoadAnimalMedicinalRequirments(Request $req)
    {
        try{
            $application_code = $req->application_code;
            $product_id = $req->product_id;
            $user_id = $this->user_id;
            $qry = DB::table('tra_exemptionanimal_medical_requirments');
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function saveExemptionProductsDetails(Request $req){
        try{
            $resp = "";
            $user_id = $this->user_id;
            $data = $req->all();
            $table_name = $req->table_name;
            $record_id = $req->id;
            unset($data['table_name']);
            // unset($data['model']);
            unset($data['_token']);
            unset($data['id']);

            if (validateIsNumeric($record_id)) {
                $where = array('id' => $record_id);
                if (recordExists($table_name, $where)) {

                    $data['dola'] = Carbon::now();
                    $data['altered_by'] = $user_id;

                    $resp = updateRecord($table_name, $where, $data);

                }
            } else {
                //insert
                $data['created_by'] = $user_id;
                $data['created_on'] = Carbon::now();

                $resp = insertRecord($table_name, $data);
            }
            if ($resp['success']) {
                $res = array('success' => true,
                    'message' => 'Saved Successfully');

            } else {
                $res = $resp;

            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }

        return response()->json($res);

    }
    public function getExemptionProductsList(Request $req){
        try{
            $application_code = $req->application_code;
            $qry = DB::table('tra_exemption_products as t1')
                    ->leftJoin('par_si_units as t2', 't1.strength_si_unit', 't2.id')
                    ->leftJoin('par_dosage_forms as t3', 't1.dosage_form_id', 't3.id')
                    ->leftJoin('par_sections as t4', 't1.section_id', 't4.id')
                    ->leftJoin('par_prodclass_categories as t5', 't1.prodclass_category_id', 't5.id')
                    ->leftJoin('par_product_types as t6', 't1.product_type_id', 't6.id')
                    ->leftJoin('par_packaging_units as t7', 't1.pack_unit_id', 't7.id')
                    ->leftJoin('tra_manufacturers_information as t8', 't1.manufacturer_id', 't8.id')
                    ->leftJoin('par_product_classificationrules as t10', 't10.id', 't1.classification_rule_id')
                    ->leftJoin('tra_exemption_product_ingredients as t9', 't1.id', 't9.product_id')
                    ->select(DB::raw("t1.*,t10.class_rule_id as classification_rule_id, concat(t1.strength,' ',t2.name) as strength, t3.name as dosage_form, t4.name as section, t5.name as prodclass_category, t6.name as product_type, concat(t1.quantity_requested, ' - ', t1.product_packaging) as quantity,concat(t1.approved_quantity, ' - ', t1.pack_size) as approved_quantity,
                     t8.name as manufacturer_name,t9.acceptance_id,t8.physical_address as manufacturer_address"))
                    ->where('application_code', $application_code);
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
     public function getExemptionProductsIngredientsList(Request $req)
    {

        try {
            $product_id = $req->exemption_product_id;
            $data = array();
            //get the records
            $data = DB::table('tra_exemption_product_ingredients as t1')
                ->select('t1.*', 't6.name as reason_for_inclusion', 't2.name as ingredient_specification', 't3.name as si_unit', 't4.name as ingredient_name', 't5.name as ingredient_type')
                ->leftJoin('par_specification_types as t2', 't1.specification_type_id', '=', 't2.id')
                ->leftJoin('par_si_units as t3', 't1.ingredientssi_unit_id', '=', 't3.id')
                ->leftJoin('par_ingredients_details as t4', 't1.ingredient_id', '=', 't4.id')
                ->leftJoin('par_ingredients_types as t5', 't1.ingredient_type_id', '=', 't5.id')
                ->leftJoin('par_inclusions_reasons as t6', 't1.inclusion_reason_id', '=', 't6.id')
                ->where(array('t1.product_id' => $product_id))
                ->get();
            $res = array('success' => true, 'results' => $data, 'message'=> 'All is well');
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return response()->json($res);


    }
    public function onDeleteExemptionProduct(Request $req)
    {
        try{
            $product_id = $req->id;
            //ingredients
            $res = deleteRecord('tra_exemption_product_ingredients', ['product_id'=>$product_id]);
            if($res['success']== false){
                DB::rollback();
            }else{
                //delete products
                $res = deleteRecord('tra_exemption_products', ['id'=>$product_id]);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function onLoadExemptionPrescriberDetails(Request $req){
        $application_code = $req->application_code;
        $product_id = $req->product_id;
        $table_name = $req->table_name;
        try{
            if(validateIsNumeric($product_id)){
                $data = DB::table('tra_prescriber_details as t1')
                        //->join('tra_prescriber_information as t1', 't0.personnel_id', 't1.id')
                        ->leftJoin('par_regions as t2', 't1.region_id', 't2.id')
                        ->leftJoin('par_districts as t3', 't1.district_id', 't3.id')
                        ->leftJoin('par_personnel_positions as t4', 't1.position_id', 't4.id')
                        ->where('product_id', $product_id)
                        ->select('t1.*', 't2.name as region', 't3.name as district', 't4.name as position')
                        ->get();
                $res = array('success' => true, 'results' => $data, 'message'=> 'All is well');
            }
            else if(validateIsNumeric($application_code)){
                $data = DB::table($table_name)->where('application_code', $application_code)->get();
                $res = array('success' => true, 'results' => $data, 'message'=> 'All is well');
            }else{
                $res = array('message' => 'No filters Passed', 'success'=>false);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function checkExemptionProductListProcessed(Request $req){
        try{
            $application_code = $req->application_code;
            $count = DB::table('tra_exemption_products as t1')
                   ->where('application_code', $application_code)
                   ->whereNull('approval_decision_id')
                   ->count();
            if($count > 0){
                $res = array(
                    'success' => false,
                    'is_cleared' => false,
                    'decision_id' => 0,
                    'message' => 'Please approve the product list first'
                );
            }else{
                $approved = DB::table('tra_exemption_products as t1')
                   ->where('application_code', $application_code)
                   ->where('approval_decision_id', 1)
                   ->count();
                if($approved > 0){
                    $decision_id = 1;
                }else{
                    $decision_id = 2;
                }
                $res = array(
                    'success' => true,
                    'is_cleared' => true,
                    'decision_id' => $decision_id,
                    'message' => 'All is well'
                );
            }

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function approveExemptionProduct(Request $req){
        try{
            $product_id = $req->product_id;
            $decision_id = $req->decision_id;
            $update = array(
                'approval_decision_id' => $decision_id
            );
            $where = array(
                'id' => $product_id
            );

            $res = updateRecord('tra_exemption_products', $where, $update);

        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function onSaveListing(Request $req)
    {
        try{
            $application_code = $req->application_code;
            $sub_module_id = $req->sub_module_id;
            $module_id = $req->module_id;
            $listing_decision_id = $req->listing_decision_id;
            $remarks = $req->remarks;
            $approval_id = $req->approval_id;
            $user_id = $this->user_id;
            $app_data = array(
                'module_id' => $req->module_id,
                'application_code' => $req->application_code,
                'listing_decision_id' => $req->listing_decision_id,
                'comment' => $req->remarks,
                'approved_by' => $req->user_id
            );
            if(validateIsNumeric($approval_id)){
                $app_data = array(
                    'listing_decision_id' => $req->listing_decision_id,
                    'comment' => $req->remarks,
                    'approved_by' => $user_id
                );
                $where = array(
                    'application_code'=>$application_code
                );
                $res = updateRecord('tra_listing_approvals', $where, $app_data);
            }else{
                $res = insertRecord('tra_listing_approvals', $app_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }
    public function getListedDevices(Request $request)
    {
        $tracking_no = $request->input('tracking_no');
        try {
            $qry = DB::table('tra_listing_approvals as t0')
                ->join('tra_product_applications as t1', 't1.application_code', '=', 't0.application_code')
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('par_system_statuses as t4', 't1.application_status_id', 't4.id')
                ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
                ->leftJoin('par_prodclass_categories as t7', 't1.prodclass_category_id', '=', 't7.id')
                ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')

                ->leftJoin('tra_submissions as t9', 't9.application_code', '=', 't1.application_code')
                ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
                ->leftJoin('users as t11', 't0.approved_by', '=', 't11.id')
                ->leftJoin('tra_registered_products as t12', 't2.id', '=', 't12.tra_product_id')

                ->select('t2.*','t1.*', 't2.product_origin_id', 't2.brand_name as product_name','t2.software_version','t2.model_name','device_brand_name', 't7.name as prodclass_category', DB::raw("CONCAT(decryptval(t10.first_name,".getDecryptFunParams()."),' ',decryptval(t10.last_name,".getDecryptFunParams().")) as submitted_by, CONCAT(decryptval(t11.first_name,".getDecryptFunParams()."),' ',decryptval(t11.last_name,".getDecryptFunParams().")) as approved_by"), 't9.date_received as submitted_on', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t1.prodclass_category_id',
                     't1.id as active_application_id', 't0.listing_decision_id','t0.id as approval_id', 't1.application_code as active_application_code', 't1.id as active_application_id', 't12.id as reg_product_id','t2.id as tra_product_id')
                ->where (array('t0.decision_id'=>1,'t1.sub_module_id'=>79));
            if($tracking_no != ''){
                $qry->where('t1.tracking_no', 'LIKE', '%'.$tracking_no.'%');
                $qry->orWhere('t1.reference_no', 'LIKE', '%'.$tracking_no.'%');
            }
            $results = $qry->orderBy('t9.id','desc')->get();
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
    public function loadMdAssessmentHistory(Request $req){
        $application_code = $req->application_code;
        $assessment_history_id = $req->assessment_history_id;
        $question_id = $req->question_id;
        $answer_id = $req->answer_id;
        $user_id = $this->user_id;
        try{
            DB::beginTransaction();
            if(!validateIsNumeric($assessment_history_id)){ //save new entry
                $data = array(
                    'assessment_by' => $user_id,
                    'application_code' => $application_code,
                    'assessment_date' => Carbon::now()
                );
                // dd($data);
                $insertRes = insertRecord('tra_md_assessment_history', $data);


                if(!isset($insertRes['record_id'])){
                    DB::rollBack();
                    return $insertRes;
                }
                $assessment_history_id = $insertRes['record_id'];
            }
            $data = array(
                    'assessment_history_id' => $assessment_history_id,
                    'question_id' => $question_id,
                    'answer_id' => $answer_id
                );
            $insertRes = insertRecord('tra_md_assessment_history_answers', $data);

            $qry = DB::table('par_medical_device_assesment_questions as t1')
                    ->leftJoin('par_question_tracker as t2', function ($join) use($question_id, $answer_id, $assessment_history_id) {
                        $join->on('t1.id', '=', 't2.current_question_id');

                        if(validateIsNumeric($question_id)){
                            $join->where(['t2.current_question_id'=>$question_id, 't2.answer_id' => $answer_id]);
                        }
                    })
                    ->leftJoin('tra_md_assessment_history_answers as t3', function ($join) use($question_id, $answer_id, $assessment_history_id) {
                        if(validateIsNumeric($question_id)){
                            $join->on('t2.next_question_id', '=', 't3.question_id')
                                ->where(['t3.assessment_history_id' => $assessment_history_id]);
                        }else{
                            $join->on('t1.id', '=', 't3.question_id')
                                ->where(['t3.assessment_history_id' => $assessment_history_id]);
                        }

                    })
                    ->leftJoin('par_medical_device_assesment_questions as t4', 't2.next_question_id', 't4.id');

            if(validateIsNumeric($question_id)){//requesting next question
                $qry->select('t4.question', 't2.next_question_id as question_id', 't4.is_final_outcome', 't3.answer_id', DB::raw("$assessment_history_id as assessment_history_id"));
            }else{ //first request
                $qry->select('t1.question', 't1.id as question_id', 't1.is_final_outcome', 't3.answer_id', DB::raw("$assessment_history_id as assessment_history_id"));
            }
            //sort by order
            if(validateIsNumeric($question_id)){
                $qry->where('t2.current_question_id', $question_id);
            }
            $qry->orderBy('t1.id', 'ASC');
            $results = $qry->first();
            DB::commit();
            $res = array(
                'success' => true,
                'results' => $results,
                'message' => 'All is well'
            );

        } catch (\Exception $exception) {
            DB::rollBack();
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            DB::rollBack();
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);

    }
    public function getMDAssessmentAnswers(Request $req){
        $question_id = $req->question_id;
        try{
            $responses = DB::table('par_question_tracker as t1')
                    ->join('par_medical_device_assesment_answers as t2', 't1.answer_id', 't2.id')
                    ->where('t1.current_question_id', $question_id)
                    ->get();
            $res = array(
                'message' => 'All is well',
                'results' => $responses,
                'success' => true
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getRegisterapplications(Request $request)
    {
        $module_id = $request->input('module_id');
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $registration_option_id = $request->input('registration_option_id');
        $take = $request->input('take');
        $limit = $request->input('limit');
        $start = $request->input('start');
        $user_id = $this->user_id;
        try {

            $qry = DB::table('tra_product_applications as t1')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t1.application_code', '=', 't7.application_code')
                        ->on('t1.workflow_stage_id', '=', 't7.current_stage');
                })
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('wb_trader_account as t30', 't1.local_agent_id', '=', 't30.id')
                ->leftJoin('wf_processes as t4', 't7.process_id', '=', 't4.id')
                ->leftJoin('wf_workflow_stages as t5', 't7.current_stage', '=', 't5.id')
                ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->leftJoin('users as t8', 't7.usr_from', '=', 't8.id')
                ->leftJoin('users as t9', 't7.usr_to', '=', 't9.id')
                ->leftJoin('tra_registered_products as t10', 't1.application_code', '=', 't10.active_application_code')
                ->join('tra_approval_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                ->leftJoin('par_common_names as t12', 't2.common_name_id', '=', 't12.id')
                ->leftJoin('par_register_deletion_log as t13', 't1.application_code', '=', 't13.application_code')
                ->select(DB::raw("t7.date_received, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),decryptval(t8.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),decryptval(t9.last_name,".getDecryptFunParams().")) as to_user,  t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t2.brand_name as product_name,
                    t6.name as application_status, t3.name as applicant_name, t30.name as local_agent,t4.name as process_name, t5.name as workflow_stage, t5.is_general, t3.contact_person,
                    t3.tpin_no, t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id, t3.physical_address as app_physical_address,
                    t3.postal_address as app_postal_address, t3.telephone_no as app_telephone, t3.fax as app_fax, t3.email as app_email, t3.website as app_website,
                    t2.*, t1.*,t12.name as common_name,t10.registration_date,t10.registration_no,t10.expiry_date,t11.is_migrated"))
                ->whereNull('t13.id');
                  //  ->where(array('t1.sub_module_id'=> $sub_module_id,'t1.section_id'=>$section_id,'t11.decision_id'=> 1));
            $total_qry = clone $qry;

            $filter = $request->input('filter');
            $whereClauses = array();
            $filter_string = '';
            if (isset($filter)) {
                $filters = json_decode($filter);
          
                if ($filters != NULL) {
                    foreach ($filters as $filter) {
                        switch ($filter->property) {
                            case 'tracking_no' :
                                $whereClauses[] = "t1.tracking_no ilike '%" . ($filter->value) . "%'";
                                break;
                            case 'reference_no' :
                                $whereClauses[] = "t1.reference_no ilike '%" . ($filter->value) . "%'";
                                break;
                            case 'applicant_name' :
                                $whereClauses[] = "t3.name ilike '%" . ($filter->value) . "%'";
                                break;
                            case 'registration_no' :
                                $whereClauses[] = "t10.registration_no ilike '%" . ($filter->value) . "%'";
                                break;
                            }
                        }
                    $whereClauses = array_filter($whereClauses);
                }
                if (!empty($whereClauses)) {
                    $filter_string = implode(' AND ', $whereClauses);
                }
            }
            
            if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            if(validateIsNumeric($registration_option_id)){
                if($registration_option_id == 1){
                    $qry->where('t2.is_b_listed', 1);
                }else{
                    $qry->where('t2.is_b_listed', '!=', 1);
                }
                
            }
            if(validateIsNumeric($section_id)){
                 $qry->where('t1.section_id', $section_id);
                
            }
            if(validateIsNumeric($sub_module_id)){
                $qry->where('t1.sub_module_id', $sub_module_id);
               
           }
			$total_qry = clone $qry;
            $total = $total_qry->count();
            $results = $qry->skip($start)->take($limit)->get();

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
    public function getMdExcemptedDevices(Request $req){
        try{
            $qry = DB::table('tra_exemption_products as t1')
                    ->leftJoin('par_si_units as t2', 't1.strength_si_unit', 't2.id')
                    ->leftJoin('par_dosage_forms as t3', 't1.dosage_form_id', 't3.id')
                    ->leftJoin('par_sections as t4', 't1.section_id', 't4.id')
                    ->leftJoin('par_prodclass_categories as t5', 't1.prodclass_category_id', 't5.id')
                    ->leftJoin('par_product_types as t6', 't1.product_type_id', 't6.id')
                    ->leftJoin('par_packaging_units as t7', 't1.pack_unit_id', 't7.id')
                    ->leftJoin('tra_manufacturers_information as t8', 't1.manufacturer_id', 't8.id')
                    ->select(DB::raw("t1.*, concat(t1.strength,' ',t2.name) as strength, t3.name as dosage_form, t4.name as section, t5.name as prodclass_category, t6.name as product_type, concat(t1.quantity_requested, ' - ', t1.product_packaging) as quantity,concat(t1.approved_quantity, ' - ', t1.pack_size) as approved_quantity, t8.name as manufacturer_name"))
                    ->where (array('t1.approval_decision_id'=> 1,'t1.section_id'=>4));
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
    //portal data

    public function getProductPortalApplicationMoreDetails(Request $request)
    {
        $application_code = $request->input('application_code');

        try {
            // $app_details = DB::table('tra_product_applications')
            //     ->where('application_code', $application_code)
            //     ->select('branch_id', 'product_id')->first();
            // $branch_id = $app_details->branch_id;
            // $product_id = $app_details->product_id;
            $portal_db = DB::connection('portal_db');
            $qryProducts = $portal_db->table('wb_product_information as t1')
                ->join('wb_product_applications as t2', 't1.id', 't2.product_id')
                ->join('wb_trader_account as t3', 't2.trader_id', 't3.id')
                ->select('t1.id as product_id', 't2.assessment_procedure_id', 't1.*', 't2.paying_currency_id', 't2.branch_id', 't2.prodclass_category_id', 't2.local_agent_id', 't3.name as applicant_name', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address', 't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website'
            )
                ->where('t2.application_code', $application_code);

            $product_details = $qryProducts->first();

            $qry2 = $portal_db->table('wb_trader_account as t3')
                ->select('t3.id as applicant_id', 't3.name as applicant_name', 't3.contact_person',
                    't3.tpin_no', 't3.country_id as app_country_id', 't3.region_id as app_region_id', 't3.district_id as app_district_id', 't3.physical_address as app_physical_address',
                    't3.postal_address as app_postal_address', 't3.telephone_no as app_telephone', 't3.fax as app_fax', 't3.email as app_email', 't3.website as app_website')
                ->where('t3.id', $product_details->local_agent_id);

            $ltrDetails = $qry2->first();

            $res = array(
                'success' => true,
                'ltrDetails' => $ltrDetails,
                'product_details' => $product_details,
                'branch_id' => $product_details->branch_id,
                'message' => 'All is well'
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);

        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

    public function getVetProductRegisterapplications(Request $request)
    {
        $module_id = $request->input('module_id');
        $section_id = $request->input('section_id');
        $sub_module_id = $request->input('sub_module_id');
        $workflow_stage_id = $request->input('workflow_stage_id');
        $schedule_id = $request->input('schedule_id');
        $animal_species_id = $request->input('animal_species_id');
        $user_id = $this->user_id;
        try {

            $qry = DB::table('tra_product_applications as t1')
                ->join('tra_submissions as t7', function ($join) {
                    $join->on('t1.application_code', '=', 't7.application_code')
                        ->on('t1.workflow_stage_id', '=', 't7.current_stage');
                })
                ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
                ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
                ->leftJoin('wf_processes as t4', 't7.process_id', '=', 't4.id')
                ->leftJoin('wf_workflow_stages as t5', 't7.current_stage', '=', 't5.id')
                ->leftJoin('par_system_statuses as t6', 't1.application_status_id', '=', 't6.id')
                ->leftJoin('users as t8', 't7.usr_from', '=', 't8.id')
                ->leftJoin('users as t9', 't7.usr_to', '=', 't9.id')
                ->leftJoin('tra_registered_products as t10', 't1.application_code', '=', 't10.active_application_code')
                ->join('tra_approval_recommendations as t11', 't1.application_code', '=', 't11.application_code')
                ->leftJoin('tra_product_manufacturers as t12', 't2.id', '=', 't12.product_id')
                ->leftJoin('tra_manufacturers_information as t13', 't12.manufacturer_id', '=', 't13.id')
                // ->leftJoin('par_animal_species as t13', DB::raw("(t2.species_data->>0)::integer"), 't13.id')
                ->leftJoin('par_schedule_types as t14', 't2.proposed_schedule_id', 't14.id')
                ->select(DB::raw("t7.date_received, CONCAT(decryptval(t8.first_name,".getDecryptFunParams()."),decryptval(t8.last_name,".getDecryptFunParams().")) as from_user,CONCAT(decryptval(t9.first_name,".getDecryptFunParams()."),decryptval(t9.last_name,".getDecryptFunParams().")) as to_user,  t1.id as active_application_id, t1.application_code, t4.module_id, t4.sub_module_id, t4.section_id, t2.brand_name as product_name,
                    t6.name as application_status, t3.name as applicant_name, t4.name as process_name, t5.name as workflow_stage, t5.is_general, t3.contact_person,
                    t3.tpin_no, t3.country_id as app_country_id, t3.region_id as app_region_id, t3.district_id as app_district_id, t3.physical_address as app_physical_address,
                    t3.postal_address as app_postal_address, t3.telephone_no as app_telephone, t3.fax as app_fax, t3.email as app_email, t3.website as app_website,
                    t2.*, t1.*, t10.registration_date,t10.registration_no,t10.expiry_date,t11.is_migrated, t14.name as schedule, STRING_AGG(t13.name || ' ' || t13.physical_address , ',') as manufacturer_name"))
                    ->where(array('t11.decision_id'=> 1))
                    ->groupBy('t1.id','t2.id','t3.id','t4.id','t5.id','t6.id','t7.id','t8.id','t9.id','t10.id','t11.id','t12.id','t14.id');

            if(validateIsNumeric($animal_species_id)){
                 // $qry->where("t13.id", $animal_species_id);
                // $qry->whereIn('t2.animal_species_id', $animal_species_id);
            }
            if(validateIsNumeric($section_id)){
                $qry->where('t1.section_id', $section_id);
            }
            if(validateIsNumeric($sub_module_id)){
                $qry->where('t1.sub_module_id', $sub_module_id);
            }
            if(validateIsNumeric($schedule_id)){
                $qry->where('t2.proposed_schedule_id', $schedule_id);
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

    public function getApprovedFacilities(Request $req)
    {
        $risk_premise_type = $req->input('risk_premise_type');
       try {

        $qry = DB::table('tra_registered_premises as t1')
            ->leftjoin('tra_premises as t2', 't1.tra_premise_id', '=', 't2.id')
            ->leftJoin('par_risk_premise_types as t3', 't2.risk_premise_type_id', '=', 't3.id')
            ->leftJoin('par_countries as t4', 't2.country_id', '=', 't4.id')
            ->leftJoin('par_regions as t5', 't2.region_id', '=', 't5.id')
            ->leftJoin('par_districts as t6', 't2.district_id', '=', 't6.id')
            ->leftJoin('par_premise_types as t7', 't2.premise_type_id', '=', 't7.id')
            ->select(DB::raw("t1.id as reg_premise_id,t2.id as premise_id,t3.name as premise_type,t2.*,t4.name as country,t5.name as region,t6.name as district"));

        if($risk_premise_type == 1){//importer
            $qry->where('t2.risk_premise_type_id', 1);
        }else{
            // $qry->where('t2.risk_premise_type_id', 2);
            $qry->whereRaw("(t2.risk_premise_type_id = 2 OR t2.risk_premise_type_id = 3)");
        }

        $results = $qry->get();
        $res = array(
            'success' => true,
            'results' => $results,
            'message' => 'All is well'
        );


       } catch (\Exception $exception) {
           $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);

       } catch (\Throwable $throwable) {
           $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', _CLASS_), \Auth::user()->id);
       }
       return \response()->json($res);

   }
   public function prepareExemptionsProductId(Request $req)
   {
       $application_code = $req->input('application_code');
       try {
           $qry1 = DB::table('tra_product_applications as t1')
               ->where('t1.application_code', $application_code)
               ->select('t1.product_id','t1.local_agent_id');

           $results = $qry1->first();
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

public function onLoadPortalExemptionPrescriberDetails(Request $req){
    $application_code = $req->application_code;
    $product_id = $req->product_id;
    $table_name = $req->table_name;
    try{
        if(validateIsNumeric($product_id)){
            $application_code = $req->application_code;
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table('wb_prescriber_details as t1')
                 ->select('t1.*')
                 ->where('product_id', $product_id);
            $results = $qry->get();  
            foreach($results as $rec){
                $position = getSingleRecordColValue('par_personnel_positions', array('id'=>$rec->position_id), 'name');
                $region = getSingleRecordColValue('par_regions', array('id'=>$rec->region_id), 'name');
                $district = getSingleRecordColValue('par_districts', array('id'=>$rec->district_id), 'name');
                $data = array(
                                'telephone_no'=>$rec->telephone_no,
                                'email_address'=>$rec->email_address,
                                'physical_address'=>$rec->physical_address,
                                'postal_address'=>$rec->postal_address,
                                'name'=>$rec->name,
                                'place_of_practice'=>$rec->place_of_practice,
                                'bhpc_number'=>$rec->bhpc_number,
                                'company_name'=>$rec->company_name,
                                'end_date'=>$rec->end_date,
                                'start_date'=>$rec->start_date,
                                'institution'=>$rec->institution,
                                'certification_no'=>$rec->certification_no,
                                'position'=>$position,
                                'region'=>$region,
                                'district'=>$district,
                                 
                 );
                 }
            $res = array('success' => true, 'results' => $data, 'message'=> 'All is well');
        }
      else{
            $res = array('message' => 'No filters Passed', 'success'=>false);
        }
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}

public function onLoadPortalExemptionPatientDetails(Request $req){
    $application_code = $req->application_code;
    $product_id = $req->product_id;
    $table_name = $req->table_name;
    try{
        if(validateIsNumeric($product_id)){
            $application_code = $req->application_code;
            $portal_db = DB::connection('portal_db');
            $qry = $portal_db->table('wb_patient_details as t1')
                 ->select('t1.*')
                 ->where('product_id', $product_id);
            $results = $qry->get();  
           
            foreach($results as $rec){
                $region = getSingleRecordColValue('par_regions', array('id'=>$rec->region_id), 'name');
                $district = getSingleRecordColValue('par_districts', array('id'=>$rec->district_id), 'name');
                $gender_data = getParameterItems('par_gender','');
                $data = array(
                            'id' => $rec->id,
                            'personnel_id' => $rec->personnel_id,
                            'name'=>$rec->name,
                            'region_id' =>  $rec->region_id,
                            'region'=>$region,
                            'district_id' => $rec->district_id,
                            'district'=>$district,
                            'postal_address'=>$rec->postal_address,
                            'email'=>$rec->email,
                            'age'=>$rec->age,
                            'gender_id' => $rec->gender_id,
                            'gender' =>  returnParamFromArray($gender_data, $rec->gender_id),
                            'id_no'=>$rec->id_no,
                            'telephone_no'=>$rec->telephone_no,
                            'physical_address'=>$rec->physical_address,
                        );
            $res = array('success' => true, 'results' => $data, 'message'=> 'All is well');
        }
            
        }
        else{
            $res = array('message' => 'No filters Passed', 'success'=>false);
        }
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}
public function onCosmeticsSaveListing(Request $req)
    {
        try{
            $application_code = $req->application_code;
            $sub_module_id = $req->sub_module_id;
            $module_id = $req->module_id;
            $listing_decision_id = $req->listing_decision_id;
            $remarks = $req->remarks;
            $approval_id = $req->approval_id;
            $user_id = $this->user_id;
            $app_data = array(
                'module_id' => $req->module_id,
                'application_code' => $req->application_code,
                'listing_decision_id' => $req->listing_decision_id,
                'comment' => $req->remarks,
                'approved_by' => $req->user_id
            );
            if(validateIsNumeric($approval_id)){
                $app_data = array(
                    'listing_decision_id' => $req->listing_decision_id,
                    'comment' => $req->remarks,
                    'approved_by' => $user_id
                );
                $where = array(
                    'application_code'=>$application_code
                );
                $res = updateRecord('tra_cosmetic_listing_approvals', $where, $app_data);
            }else{
                $res = insertRecord('tra_cosmetic_listing_approvals', $app_data);
            }
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
    }

public function getListedCosmetics(Request $request)
{
    $tracking_no = $request->input('tracking_no');
    try {
        $qry = DB::table('tra_product_applications as t1')
            ->join('tra_product_information as t2', 't1.product_id', '=', 't2.id')
            ->leftJoin('wb_trader_account as t3', 't1.applicant_id', '=', 't3.id')
            ->leftJoin('par_system_statuses as t4', 't1.application_status_id', 't4.id')
            ->leftJoin('tra_approval_recommendations as t5', 't5.application_code', '=', 't1.application_code')
            ->leftJoin('par_prodclass_categories as t7', 't1.prodclass_category_id', '=', 't7.id')
            ->leftJoin('par_common_names as t8', 't2.common_name_id', '=', 't8.id')
            ->leftJoin('tra_submissions as t9', 't9.application_code', '=', 't1.application_code')
            ->leftJoin('users as t10', 't9.usr_from', '=', 't10.id')
            ->leftJoin('tra_registered_products as t12', 't2.id', '=', 't12.tra_product_id')
            ->select('t2.*','t1.*', 't2.product_origin_id', 't2.brand_name as product_name','t2.software_version','t2.model_name','device_brand_name', 't7.name as prodclass_category', DB::raw("CONCAT(decryptval(t10.first_name,".getDecryptFunParams()."),' ',decryptval(t10.last_name,".getDecryptFunParams().")) as submitted_by"), 't9.date_received as submitted_on', 't8.name as common_name', 't3.name as applicant_name', 't4.name as application_status','t1.prodclass_category_id',
                 't1.id as active_application_id', 't1.application_code as active_application_code', 't1.id as active_application_id', 't12.id as reg_product_id','t2.id as tra_product_id')
            ->where ('t1.sub_module_id',80);
        if($tracking_no != ''){
            $qry->where('t1.tracking_no', 'LIKE', '%'.$tracking_no.'%');
            $qry->orWhere('t1.reference_no', 'LIKE', '%'.$tracking_no.'%');
        }
        $results = $qry->orderBy('t9.id','desc')->get();
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
public function removeProductFromRegister(Request $req){
    DB::beginTransaction();
    try {
        //explode
        $trc_no = $req->tracking_nos;
        $regs = array_filter(explode(';', $trc_no));
        $res = ['success'=>false, 'message'=> 'no product found'];
        $reason = $req->reason;
        foreach ($regs as $reg) {
            // get the product
            $product = DB::table('tra_product_applications as t1')
                        ->leftJoin('tra_approval_recommendations as t2','t1.application_code', 't2.application_code')
                        ->where('t1.tracking_no', 'ILIKE', trim($reg))
                        ->orWhere('t2.certificate_no', 'ILIKE', trim($reg))
                        ->first();

            if(isset($product->id)){
                $res = insertRecord('par_register_deletion_log', ['application_code' => $product->application_code, 'reason'=>$reason]);
                if(!isset($res['record_id'])){
                    dd($res);
                }

            }
        }
        DB::commit();
        //insert in deleted log
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}

public function getDeletedRegisterapplications(Request $req){
        try {
            $registration_option_id = $req->registration_option_id;
            $section_id = $req->section_id;
            $filter = $req->filter;
            $filter_string = '';
            if (isset($filter)) {
                $filters = json_decode($filter);
                if ($filters != NULL) {
                    foreach ($filters as $filter) {
                        switch ($filter->property) {
                            case 'tracking_no' :
                                $whereClauses[] = "t2.tracking_no like '%" . ($filter->value) . "%'";
                                break;
                            case 'registration_no' :
                                $whereClauses[] = "t2.tracking_no like '%" . ($filter->value) . "%'";
                                break;
                            
                        }
                    }
                }
                   $whereClauses = array_filter($whereClauses);
    
            if (!empty($whereClauses)) {
                $filter_string = implode(' AND ', $whereClauses);
            }
        }
            $qry = DB::table('par_register_deletion_log as t1')
                    ->join('tra_product_applications as t2', 't1.application_code', 't2.application_code')
                    ->leftJoin('tra_approval_recommendations as t3', 't2.application_code', 't3.application_code')
                    ->leftJoin('wb_trader_account as t4', 't2.applicant_id', 't4.id')
                    ->leftJoin('users as t5', 't1.created_by', 't5.id')
                    ->select(DB::raw("t2.tracking_no, t3.certificate_no as registration_no, t1.application_code, t4.name as applicant_name, t1.created_on as deletion_date, t1.reason,  CONCAT(decryptval(t5.first_name,".getDecryptFunParams()."),decryptval(t5.last_name,".getDecryptFunParams().")) as deleted_by"));
            
            if(validateIsNumeric($section_id)){
                $qry->where('t1.section_id', $section_id);
            }
            if(validateIsNumeric($registration_option_id)){
                if($registration_option_id == 1){
                    $qry->where('t2.is_b_listed', 1);
                }else{
                    $qry->where('t2.is_b_listed', '!=', 1);
                }
                
            }
             if ($filter_string != '') {
                $qry->whereRAW($filter_string);
            }
            $results = $qry->get();

            $res = array(
                'success' => true,
                'message' => 'All is well',
                'results' => $results
            );
        } catch (\Exception $exception) {
            $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        } catch (\Throwable $throwable) {
            $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
        }
        return \response()->json($res);
}

public function reistateProductToRegister(Request $req){
    DB::beginTransaction();
    try {
        $reason = $req->reason;
        $application_code = $req->application_code;
            // get the product
            $product = DB::table('par_register_deletion_log as t1')
                        ->where('t1.application_code', $application_code)
                        ->first();

            if(isset($product->id)){
                $res = deleteRecord('par_register_deletion_log', ['id' => $product->id]);

            }
        DB::commit();
    } catch (\Exception $exception) {
        $res = sys_error_handler($exception->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    } catch (\Throwable $throwable) {
        $res = sys_error_handler($throwable->getMessage(), 2, debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1),explode('\\', __CLASS__), \Auth::user()->id);
    }
    return \response()->json($res);
}


}
