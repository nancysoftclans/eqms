<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraAuditsmanagerApplicationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tra_auditsmanager_application', function (Blueprint $table) {
            $table->id();
            $table->integer('application_code')->nullable();
            $table->integer('process_id')->nullable();
            $table->integer('workflow_stage_id')->nullable();
            $table->integer('application_status_id')->nullable();
            $table->string('audit_title')->nullable();
            $table->string('audit_reference')->nullable();
            $table->integer('audit_type_id')->nullable();
            $table->integer('is_full_day')->nullable();
            $table->integer('applicant_id')->nullable();
            $table->string('view_id')->nullable();
            $table->integer('module_id')->nullable();
            $table->integer('sub_module_id')->nullable();
            $table->integer('reg_serial')->nullable();
            $table->longText('audit_summary')->nullable();
            $table->string('reference_no')->nullable();
            $table->string('tracking_no')->nullable();
            $table->string('audit_start_date')->nullable();
            $table->string('audit_end_date')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();            
            $table->boolean('is_enabled')->default(1);
            $table->integer('created_by')->default(0);
            $table->integer('altered_by')->default(0);
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tra_auditsmanager_application');
    }
}
