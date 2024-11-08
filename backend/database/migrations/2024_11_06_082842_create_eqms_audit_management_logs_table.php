<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEqmsAuditManagementLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eqms_audit_management_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('application_code');
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->integer('ref_id');
            $table->integer('module_id');
            $table->integer('sub_module_id');
            $table->integer('process_id');
            $table->integer('audit_type_id');
            $table->integer('submitted_by');
            $table->text('current_stage_name');
            $table->text('application_status');
            $table->integer('curr_stage_id');
            $table->integer('application_status_id');
            $table->text('responsible_user');
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
        Schema::dropIfExists('eqms_audit_management_logs');
    }
}
