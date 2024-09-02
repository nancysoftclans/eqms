<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddRcaFieldsOthers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->boolean('old_technology_used')->default(false);
            $table->boolean('system_errors')->default(false);
            $table->boolean('design_problem')->default(false);
            $table->boolean('design_investigation_not_done_properly')->default(false);
            $table->boolean('negligence')->default(false);
            $table->boolean('poor_work_practices')->default(false);
            $table->boolean('non_adherence_to_procedures')->default(false);
            $table->boolean('de_motivated')->default(false);
            $table->boolean('unsafe_acts')->default(false);
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
