<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEqmsIssueManagementLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eqms_issue_management_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('application_code')->nullable();
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->integer('ref_id')->nullable();
            $table->integer('module_id')->nullable();
            $table->integer('sub_module_id')->nullable();
            $table->integer('workflow_stage_id')->nullable();
            $table->integer('application_status_id')->nullable();
            $table->integer('issue_status_id')->nullable();
            $table->integer('issue_type_id')->nullable();
            $table->text('process_name')->nullable();
            $table->text('current_stage_name')->nullable();
            $table->integer('next_stage')->nullable();
            $table->integer('responsible_user')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('eqms_issue_management_logs');
    }
}
