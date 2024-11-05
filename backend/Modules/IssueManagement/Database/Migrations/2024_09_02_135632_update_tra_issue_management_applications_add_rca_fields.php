<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddRcaFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->boolean('blaming_culture')->default(false);
            $table->boolean('victimization')->default(false);
            $table->boolean('undue_pressure')->default(false);
            $table->boolean('unethical_practices')->default(false);
            $table->boolean('lack_of_control_systems')->default(false);
            $table->boolean('insufficient_control_systems')->default(false);
            $table->boolean('inefficient_action_taken_on_non_conformities')->default(false);
            $table->boolean('no_action_taken_on_non_conformities')->default(false);
            $table->boolean('unsafe_environment')->default(false);
            $table->boolean('unhealthy_environment')->default(false);
            $table->boolean('uncontrolled_testing_calibration_conditions')->default(false);
            $table->boolean('inadequate_facilities')->default(false);
            $table->boolean('inadequate_security')->default(false);
            $table->boolean('test_calibration_item_preparation_not_done_properly')->default(false);
            $table->boolean('test_calibration_item_damaged_lost')->default(false);
            $table->boolean('test_calibration_not_used_properly')->default(false);
            $table->boolean('contamination_due_to_incorrect_storage_or_handling')->default(false);
            $table->boolean('deterioration_due_to_incorrect_storage_or_handling')->default(false);
            $table->boolean('test_calibration_items_not_calibrated')->default(false);
            $table->boolean('equipment_not_fit_for_purpose')->default(false);
            $table->boolean('inadequate_validated_equipment')->default(false);
            $table->boolean('equipment_contamination')->default(false);
            $table->boolean('equipment_out_of_calibration')->default(false);
            $table->boolean('lack_of_maintenance')->default(false);
            $table->boolean('inefficient_maintenance')->default(false);
            $table->boolean('defective_equipment')->default(false);
            $table->boolean('poor_service_from_suppliers')->default(false);
            $table->boolean('poor_product_from_suppliers')->default(false);
            $table->boolean('stock_level_control_lacking')->default(false);
            $table->boolean('reference_materials_not_fit_for_purpose')->default(false);
            $table->boolean('consumables_not_fit_for_purpose')->default(false);
            $table->boolean('services_not_fit_for_purpose')->default(false);
            $table->boolean('job_review_not_performed')->default(false);
            $table->boolean('inadequate_job_review')->default(false);
            $table->boolean('customer_requirements_not_understood')->default(false);
            $table->boolean('no_capability_to_perform_job_service')->default(false);
            $table->boolean('over_promise')->default(false);
            $table->boolean('misreading')->default(false);
            $table->boolean('typing')->default(false);
            $table->boolean('oversight')->default(false);
            $table->boolean('mislabelling')->default(false);
            $table->boolean('mentors_not_assigned')->default(false);
            $table->boolean('mentors_not_skilled')->default(false);
            $table->boolean('coaching_neglected')->default(false);
            $table->boolean('training_needs_not_identified')->default(false);
            $table->boolean('training_plans_not_formalized')->default(false);
            $table->boolean('training_plans_not_complete')->default(false);
            $table->boolean('lack_of_training')->default(false);
            $table->boolean('inefficient_training')->default(false);
            $table->boolean('lack_of_appropriate_skills')->default(false);
            $table->boolean('lack_of_understanding_of_significance_of_job')->default(false);
            $table->boolean('wrong_management_structure')->default(false);
            $table->boolean('inadequate_supervision')->default(false);
            $table->boolean('inadequate_support')->default(false);
            $table->boolean('inadequate_planning_for_future')->default(false);
            $table->boolean('inadequate_human_resources')->default(false);
            $table->boolean('inadequate_equipment_materials_supplies')->default(false);
            $table->boolean('lack_of_contingency_plans')->default(false);
            $table->boolean('communication_tools_lacking')->default(false);
            $table->boolean('communication_systems_lacking')->default(false);
            $table->boolean('ineffective_communication_system')->default(false);
            $table->boolean('inefficient_communication_system')->default(false);
            $table->boolean('lack_inadequate_handover')->default(false);
            $table->text('other_probable_cause')->nullable();
            $table->text('most_probable_cause')->nullable();
            $table->text('why_most_probable_occur')->nullable();
            $table->text('why_cause_above_occur2')->nullable();
            $table->text('why_cause_above_occur3')->nullable();
            $table->text('why_cause_above_occur4')->nullable();
            $table->text('why_cause_above_occur5')->nullable();
            $table->text('final_root_cause')->nullable();
            $table->text('proposed_corrections')->nullable();
            $table->text('proposed_corrective_actions')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('', function (Blueprint $table) {

        });
    }
}
