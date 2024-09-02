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


        try {
            if (validateIsNumeric($active_application_id)) {
                //Update
                $IssueManagement = IssueManagement::findOrFail($active_application_id);
                $IssueManagement->fill([
                    'title' => $request->title,
                    'issue_type_id' => $request->issue_type_id,
                    'description' => $request->description,
                    'creation_date' => $creationDateString->format('Y-m-d'),
                    'target_resolution_date' => $targetDateString->format('Y-m-d'),
                    'follow_up_on' => $request->follow_up_on,
                    'section_ids' => $request->section_ids,
                    'issue_status_id' => $request->issue_status_id,
                    'complainant_name' => $request->complainant_name,
                    'complainant_address' => $request->complainant_address,
                    'complainant_organisation' => $request->complainant_organisation,
                    'complainant_telephone' => $request->complainant_telephone,
                    'complainant_email' => $request->complainant_email,
                    'complaint_mode' => $request->complaint_mode,
                    'complaint_type' => $request->complaint_type,
                    'complaint_direct_or_indirect' => $request->complaint_direct_or_indirect,
                    'office_assigned_to' => $request->office_assigned_to,
                    'complaint_scheduling_delay' => $request->has('complaint_scheduling_delay'),
                    'complaint_manner_of_advisor' => $request->has('complaint_manner_of_advisor'),
                    'complaint_turnaround' => $request->has('complaint_turnaround'),
                    'complaint_response_delay' => $request->has('complaint_response_delay'),
                    'complaint_other' => $request->has('complaint_other'),
                    'problem_statement' => $request->input('problem_statement'),
                    'rca_team' => $request->input('rca_team'),
                    'responsible_officer' => $request->input('responsible_officer'),
                    'complaint_placing_budgetary' => $request->has('complaint_placing_budgetary'),
                    'complaint_placing_schedule' => $request->has('complaint_placing_schedule'),
                    'complaint_lacking_knowledge' => $request->has('complaint_lacking_knowledge'),
                    'complaint_practicing_autocratic' => $request->has('complaint_practicing_autocratic'),
                    'complaint_processes' => $request->has('complaint_processes'),
                    'complaint_ineffective_processes' => $request->has('complaint_ineffective_processes'),
                    'complaint_inefficient_processes' => $request->has('complaint_inefficient_processes'),
                    'complaint_ineffective_support' => $request->has('complaint_ineffective_support'),
                    'complaint_system_documentation' => $request->has('complaint_system_documentation'),
                    'complaint_incomplete_system' => $request->has('complaint_incomplete_system'),
                    'complaint_ineffective_system' => $request->has('complaint_ineffective_system'),
                    'complaint_inefficient_system' => $request->has('complaint_inefficient_system'),
                    'complaint_analytical_methods' => $request->has('complaint_analytical_methods'),
                    'complaint_validated_methods' => $request->has('complaint_validated_methods'),
                    'complaint_fully_addressed' => $request->has('complaint_fully_addressed'),
                    'issue_resolution' => $request->input('issue_resolution'),
                    'workflow_stage_id' => $request->workflow_stage_id,
                    'dola' => Carbon::now(),
                    'altered_by' => $user_id,
                    'application_code' => $application_code,
                    'process_id' => $request->process_id,
                    'blaming_culture' => $request->has('blaming_culture'),
                    'victimization' => $request->has('victimization'),
                    'undue_pressure' => $request->has('undue_pressure'),
                    'unethical_practices' => $request->has('unethical_practices'),
                    'lack_of_control_systems' => $request->has('lack_of_control_systems'),
                    'insufficient_control_systems' => $request->has('insufficient_control_systems'),
                    'inefficient_action_taken_on_non_conformities' => $request->has('inefficient_action_taken_on_non_conformities'),
                    'no_action_taken_on_non_conformities' => $request->has('no_action_taken_on_non_conformities'),
                    'unsafe_environment' => $request->has('unsafe_environment'),
                    'unhealthy_environment' => $request->has('unhealthy_environment'),
                    'uncontrolled_testing_calibration_conditions' => $request->has('uncontrolled_testing_calibration_conditions'),
                    'inadequate_facilities' => $request->has('inadequate_facilities'),
                    'inadequate_security' => $request->has('inadequate_security'),
                    'test_calibration_item_preparation_not_done_properly' => $request->has('test_calibration_item_preparation_not_done_properly'),
                    'test_calibration_item_damaged_lost' => $request->has('test_calibration_item_damaged_lost'),
                    'test_calibration_not_used_properly' => $request->has('test_calibration_not_used_properly'),
                    'contamination_due_to_incorrect_storage_or_handling' => $request->has('contamination_due_to_incorrect_storage_or_handling'),
                    'deterioration_due_to_incorrect_storage_or_handling' => $request->has('deterioration_due_to_incorrect_storage_or_handling'),
                    'test_calibration_items_not_calibrated' => $request->has('test_calibration_items_not_calibrated'),
                    'equipment_not_fit_for_purpose' => $request->has('equipment_not_fit_for_purpose'),
                    'inadequate_validated_equipment' => $request->has('inadequate_validated_equipment'),
                    'equipment_contamination' => $request->has('equipment_contamination'),
                    'equipment_out_of_calibration' => $request->has('equipment_out_of_calibration'),
                    'lack_of_maintenance' => $request->has('lack_of_maintenance'),
                    'inefficient_maintenance' => $request->has('inefficient_maintenance'),
                    'defective_equipment' => $request->has('defective_equipment'),
                    'poor_service_from_suppliers' => $request->has('poor_service_from_suppliers'),
                    'poor_product_from_suppliers' => $request->has('poor_product_from_suppliers'),
                    'stock_level_control_lacking' => $request->has('stock_level_control_lacking'),
                    'reference_materials_not_fit_for_purpose' => $request->has('reference_materials_not_fit_for_purpose'),
                    'consumables_not_fit_for_purpose' => $request->has('consumables_not_fit_for_purpose'),
                    'services_not_fit_for_purpose' => $request->has('services_not_fit_for_purpose'),
                    'job_review_not_performed' => $request->has('job_review_not_performed'),
                    'inadequate_job_review' => $request->has('inadequate_job_review'),
                    'customer_requirements_not_understood' => $request->has('customer_requirements_not_understood'),
                    'no_capability_to_perform_job_service' => $request->has('no_capability_to_perform_job_service'),
                    'over_promise' => $request->has('over_promise'),
                    'misreading' => $request->has('misreading'),
                    'typing' => $request->has('typing'),
                    'oversight' => $request->has('oversight'),
                    'mislabelling' => $request->has('mislabelling'),
                    'mentors_not_assigned' => $request->has('mentors_not_assigned'),
                    'mentors_not_skilled' => $request->has('mentors_not_skilled'),
                    'coaching_neglected' => $request->has('coaching_neglected'),
                    'training_needs_not_identified' => $request->has('training_needs_not_identified'),
                    'training_plans_not_formalized' => $request->has('training_plans_not_formalized'),
                    'training_plans_not_complete' => $request->has('training_plans_not_complete'),
                    'lack_of_training' => $request->has('lack_of_training'),
                    'inefficient_training' => $request->has('inefficient_training'),
                    'lack_of_appropriate_skills' => $request->has('lack_of_appropriate_skills'),
                    'lack_of_understanding_of_significance_of_job' => $request->has('lack_of_understanding_of_significance_of_job'),
                    'wrong_management_structure' => $request->has('wrong_management_structure'),
                    'inadequate_supervision' => $request->has('inadequate_supervision'),
                    'inadequate_support' => $request->has('inadequate_support'),
                    'inadequate_planning_for_future' => $request->has('inadequate_planning_for_future'),
                    'inadequate_human_resources' => $request->has('inadequate_human_resources'),
                    'inadequate_equipment_materials_supplies' => $request->has('inadequate_equipment_materials_supplies'),
                    'lack_of_contingency_plans' => $request->has('lack_of_contingency_plans'),
                    'communication_tools_lacking' => $request->has('communication_tools_lacking'),
                    'communication_systems_lacking' => $request->has('communication_systems_lacking'),
                    'ineffective_communication_system' => $request->has('ineffective_communication_system'),
                    'inefficient_communication_system' => $request->has('inefficient_communication_system'),
                    'lack_inadequate_handover' => $request->has('lack_inadequate_handover'),
                    'other_probable_cause' => $request->input('other_probable_cause'),
                    'most_probable_cause' => $request->input('most_probable_cause'),
                    'why_most_probable_occur' => $request->input('why_most_probable_occur'),
                    'why_cause_above_occur2' => $request->input('why_cause_above_occur2'),
                    'why_cause_above_occur3' => $request->input('why_cause_above_occur3'),
                    'why_cause_above_occur4' => $request->input('why_cause_above_occur4'),
                    'why_cause_above_occur5' => $request->input('why_cause_above_occur5'),
                    'final_root_cause' => $request->input('final_root_cause'),
                    'proposed_corrections' => $request->input('proposed_corrections'),
                    'proposed_corrective_actions' => $request->input('proposed_corrective_actions'),
                    'system_errors' => $request->has('system_errors'),
                    'design_problem' => $request->has('design_problem'),
                    'design_investigation_not_done_properly' => $request->has('design_investigation_not_done_properly'),
                    'negligence' => $request->has('negligence'),
                    'poor_work_practices' => $request->has('poor_work_practices'),
                    'non_adherence_to_procedures' => $request->has('non_adherence_to_procedures'),
                    'de_motivated' => $request->has('de_motivated'),
                    'unsafe_acts' => $request->has('unsafe_acts'),
                    'inadequate_definition_of_tasks' => $request->has('inadequate_definition_of_tasks'),
                    'accountability' => $request->has('accountability'),
                    'deputies_for_key_positions' => $request->has('deputies_for_key_positions'),
                ]);
                $IssueManagement->save();
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

                $issue_data = array(
                    'submission_id' => $res['record_id'],
                    'issue_type_id' => $request->issue_type_id,
                    'title' => $request->title,
                    'description' => $request->description,
                    'creation_date' => $creationDateString->format('Y-m-d'),
                    'target_resolution_date' => $targetDateString->format('Y-m-d'),
                    'follow_up_on' => $request->follow_up_on,
                    'section_ids' => $request->has('section_ids'),
                    'issue_status_id' => $request->issue_status_id,
                    'complainant_address' => $request->complainant_address,
                    'complainant_name' => $request->complainant_name,
                    'complainant_organisation' => $request->complainant_organisation,
                    'complainant_telephone' => $request->complainant_telephone,
                    'complainant_email' => $request->complainant_email,
                    'complaint_mode' => $request->complaint_mode,
                    'complaint_type' => $request->complaint_type,
                    'complaint_direct_or_indirect' => $request->complaint_direct_or_indirect,
                    'office_assigned_to' => $request->office_assigned_to,
                    'complaint_scheduling_delay' => $request->has('complaint_scheduling_delay'),
                    'complaint_manner_of_advisor' => $request->has('complaint_manner_of_advisor'),
                    'complaint_turnaround' => $request->has('complaint_turnaround'),
                    'complaint_response_delay' => $request->has('complaint_response_delay'),
                    'complaint_other' => $request->has('complaint_other'),
                    'problem_statement' => $request->input('problem_statement'),
                    'rca_team' => $request->input('rca_team'),
                    'responsible_officer' => $request->input('responsible_officer'),
                    'complaint_placing_budgetary' => $request->has('complaint_placing_budgetary'),
                    'complaint_placing_schedule' => $request->has('complaint_placing_schedule'),
                    'complaint_lacking_knowledge' => $request->has('complaint_lacking_knowledge'),
                    'complaint_practicing_autocratic' => $request->has('complaint_practicing_autocratic'),
                    'complaint_processes' => $request->has('complaint_processes'),
                    'complaint_ineffective_processes' => $request->has('complaint_ineffective_processes'),
                    'complaint_inefficient_processes' => $request->has('complaint_inefficient_processes'),
                    'complaint_ineffective_support' => $request->has('complaint_ineffective_support'),
                    'complaint_system_documentation' => $request->has('complaint_system_documentation'),
                    'complaint_incomplete_system' => $request->has('complaint_incomplete_system'),
                    'complaint_ineffective_system' => $request->has('complaint_ineffective_system'),
                    'complaint_inefficient_system' => $request->has('complaint_inefficient_system'),
                    'complaint_analytical_methods' => $request->has('complaint_analytical_methods'),
                    'complaint_validated_methods' => $request->has('complaint_validated_methods'),
                    'issue_resolution' => $request->input('issue_resolution'),
                    'complaint_fully_addressed' => $request->input('complaint_fully_addressed'),
                    'created_on' => Carbon::now(),
                    'dola' => Carbon::now(),
                    'created_by' => $user_id,
                    'altered_by' => $user_id,
                    'application_code' => $application_code,
                    'workflow_stage_id' => $request->workflow_stage_id,
                    'application_status_id' => $application_status->status_id,
                    'reference_no' => $ref_number,
                    'tracking_no' => $ref_number,
                    'process_id' => $process_id,
                    'blaming_culture' => $request->has('blaming_culture'),
                    'victimization' => $request->has('victimization'),
                    'undue_pressure' => $request->has('undue_pressure'),
                    'unethical_practices' => $request->has('unethical_practices'),
                    'lack_of_control_systems' => $request->has('lack_of_control_systems'),
                    'insufficient_control_systems' => $request->has('insufficient_control_systems'),
                    'inefficient_action_taken_on_non_conformities' => $request->has('inefficient_action_taken_on_non_conformities'),
                    'no_action_taken_on_non_conformities' => $request->has('no_action_taken_on_non_conformities'),
                    'unsafe_environment' => $request->has('unsafe_environment'),
                    'unhealthy_environment' => $request->has('unhealthy_environment'),
                    'uncontrolled_testing_calibration_conditions' => $request->has('uncontrolled_testing_calibration_conditions'),
                    'inadequate_facilities' => $request->has('inadequate_facilities'),
                    'inadequate_security' => $request->has('inadequate_security'),
                    'test_calibration_item_preparation_not_done_properly' => $request->has('test_calibration_item_preparation_not_done_properly'),
                    'test_calibration_item_damaged_lost' => $request->has('test_calibration_item_damaged_lost'),
                    'test_calibration_not_used_properly' => $request->has('test_calibration_not_used_properly'),
                    'contamination_due_to_incorrect_storage_or_handling' => $request->has('contamination_due_to_incorrect_storage_or_handling'),
                    'deterioration_due_to_incorrect_storage_or_handling' => $request->has('deterioration_due_to_incorrect_storage_or_handling'),
                    'test_calibration_items_not_calibrated' => $request->has('test_calibration_items_not_calibrated'),
                    'equipment_not_fit_for_purpose' => $request->has('equipment_not_fit_for_purpose'),
                    'inadequate_validated_equipment' => $request->has('inadequate_validated_equipment'),
                    'equipment_contamination' => $request->has('equipment_contamination'),
                    'equipment_out_of_calibration' => $request->has('equipment_out_of_calibration'),
                    'lack_of_maintenance' => $request->has('lack_of_maintenance'),
                    'inefficient_maintenance' => $request->has('inefficient_maintenance'),
                    'defective_equipment' => $request->has('defective_equipment'),
                    'poor_service_from_suppliers' => $request->has('poor_service_from_suppliers'),
                    'poor_product_from_suppliers' => $request->has('poor_product_from_suppliers'),
                    'stock_level_control_lacking' => $request->has('stock_level_control_lacking'),
                    'reference_materials_not_fit_for_purpose' => $request->has('reference_materials_not_fit_for_purpose'),
                    'consumables_not_fit_for_purpose' => $request->has('consumables_not_fit_for_purpose'),
                    'services_not_fit_for_purpose' => $request->has('services_not_fit_for_purpose'),
                    'job_review_not_performed' => $request->has('job_review_not_performed'),
                    'inadequate_job_review' => $request->has('inadequate_job_review'),
                    'customer_requirements_not_understood' => $request->has('customer_requirements_not_understood'),
                    'no_capability_to_perform_job_service' => $request->has('no_capability_to_perform_job_service'),
                    'over_promise' => $request->has('over_promise'),
                    'misreading' => $request->has('misreading'),
                    'typing' => $request->has('typing'),
                    'oversight' => $request->has('oversight'),
                    'mislabelling' => $request->has('mislabelling'),
                    'mentors_not_assigned' => $request->has('mentors_not_assigned'),
                    'mentors_not_skilled' => $request->has('mentors_not_skilled'),
                    'coaching_neglected' => $request->has('coaching_neglected'),
                    'training_needs_not_identified' => $request->has('training_needs_not_identified'),
                    'training_plans_not_formalized' => $request->has('training_plans_not_formalized'),
                    'training_plans_not_complete' => $request->has('training_plans_not_complete'),
                    'lack_of_training' => $request->has('lack_of_training'),
                    'inefficient_training' => $request->has('inefficient_training'),
                    'lack_of_appropriate_skills' => $request->has('lack_of_appropriate_skills'),
                    'lack_of_understanding_of_significance_of_job' => $request->has('lack_of_understanding_of_significance_of_job'),
                    'wrong_management_structure' => $request->has('wrong_management_structure'),
                    'inadequate_supervision' => $request->has('inadequate_supervision'),
                    'inadequate_support' => $request->has('inadequate_support'),
                    'inadequate_planning_for_future' => $request->has('inadequate_planning_for_future'),
                    'inadequate_human_resources' => $request->has('inadequate_human_resources'),
                    'inadequate_equipment_materials_supplies' => $request->has('inadequate_equipment_materials_supplies'),
                    'lack_of_contingency_plans' => $request->has('lack_of_contingency_plans'),
                    'communication_tools_lacking' => $request->has('communication_tools_lacking'),
                    'communication_systems_lacking' => $request->has('communication_systems_lacking'),
                    'ineffective_communication_system' => $request->has('ineffective_communication_system'),
                    'inefficient_communication_system' => $request->has('inefficient_communication_system'),
                    'lack_inadequate_handover' => $request->has('lack_inadequate_handover'),
                    'other_probable_cause' => $request->input('other_probable_cause'),
                    'most_probable_cause' => $request->input('most_probable_cause'),
                    'why_most_probable_occur' => $request->input('why_most_probable_occur'),
                    'why_cause_above_occur2' => $request->input('why_cause_above_occur2'),
                    'why_cause_above_occur3' => $request->input('why_cause_above_occur3'),
                    'why_cause_above_occur4' => $request->input('why_cause_above_occur4'),
                    'why_cause_above_occur5' => $request->input('why_cause_above_occur5'),
                    'final_root_cause' => $request->input('final_root_cause'),
                    'proposed_corrections' => $request->input('proposed_corrections'),
                    'proposed_corrective_actions' => $request->input('proposed_corrective_actions'),
                    'old_technology_used' => $request->has('old_technology_used'),
                    'system_errors' => $request->has('system_errors'),
                    'design_problem' => $request->has('design_problem'),
                    'design_investigation_not_done_properly' => $request->has('design_investigation_not_done_properly'),
                    'negligence' => $request->has('negligence'),
                    'poor_work_practices' => $request->has('poor_work_practices'),
                    'non_adherence_to_procedures' => $request->has('non_adherence_to_procedures'),
                    'de_motivated' => $request->has('de_motivated'),
                    'unsafe_acts' => $request->has('unsafe_acts'),
                    'inadequate_definition_of_tasks' => $request->has('inadequate_definition_of_tasks'),
                    'accountability' => $request->has('accountability'),
                    'deputies_for_key_positions' => $request->has('deputies_for_key_positions'),
                );


                $IssueManagement = new IssueManagement();
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
                    initializeApplicationDMS($module_id, $sub_module_id, $application_code, $ref_number, $user_id);
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
}
