<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddDeviationApproval extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->integer('deviation_approved')->nullable();
            $table->text('deviation_approved_comments')->nullable();
            $table->text('investigation_details')->nullable();
            $table->text('proposed_action_plan')->nullable();
            $table->text('actions_implemented')->nullable();
            $table->text('actions_undertaken')->nullable();
            $table->integer('deviation_notified')->nullable();
            $table->text('effectiveness_comments')->nullable();
            $table->text('quality_office_comments')->nullable();
            $table->integer('deviation_addressed')->nullable();
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
