<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEqmsDocumentManagementLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eqms_document_management_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('application_code')->nullable();
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->integer('module_id')->nullable();
            $table->integer('sub_module_id')->nullable();
            $table->integer('workflow_stage_id')->nullable();
            $table->integer('stage_category_id')->nullable();
            $table->integer('application_status_id')->nullable();
            $table->integer('document_type_id')->nullable();
            $table->text('doc_version')->nullable();
            $table->integer('owner_type_id')->nullable();
            $table->integer('owner_user_id')->nullable();
            $table->integer('owner_group_id')->nullable();
            $table->text('doc_description')->nullable();
            $table->text('navigator_name')->nullable();
            $table->integer('navigator_folder_id')->nullable();
            $table->text('current_stage_name')->nullable();
            $table->text('application-status')->nullable();
            $table->integer('curr_stage_id')->nullable();
            $table->text('doc_title')->nullable();
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
        Schema::dropIfExists('eqms_document_management_logs');
    }
}
