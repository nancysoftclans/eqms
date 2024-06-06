<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableTraIssueManagementAddWorkflowStageId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->integer('workflow_stage_id')->nullable()->default(0)->after('application_code');
            $table->foreign('workflow_stage_id')->references('id')->on('wf_workflow_stages')->onDelete('cascade');
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
