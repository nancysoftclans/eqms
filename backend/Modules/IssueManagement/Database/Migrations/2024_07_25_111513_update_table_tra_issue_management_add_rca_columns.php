<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableTraIssueManagementAddRcaColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->text('problem_statement')->nullable();
            $table->text('rca_team')->nullable();
            $table->string('responsible_officer')->nullable();
            $table->boolean('complaint_placing_budgetary')->default(false);
            $table->boolean('complaint_placing_schedule')->default(false);
            $table->boolean('complaint_lacking_knowledge')->default(false);
            $table->boolean('complaint_practicing_autocratic')->default(false);
            $table->boolean('complaint_processes')->default(false);
            $table->boolean('complaint_ineffective_processes')->default(false);
            $table->boolean('complaint_inefficient_processes')->default(false);
            $table->boolean('complaint_ineffective_support')->default(false);
            $table->boolean('complaint_system_documentation')->default(false);
            $table->boolean('complaint_incomplete_system')->default(false);
            $table->boolean('complaint_ineffective_system')->default(false);
            $table->boolean('complaint_inefficient_system')->default(false);
            $table->boolean('complaint_analytical_methods')->default(false);
            $table->boolean('complaint_validated_methods')->default(false);
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
