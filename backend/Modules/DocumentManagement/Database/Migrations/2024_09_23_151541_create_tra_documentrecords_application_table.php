<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraDocumentrecordsApplicationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tra_documentrecords_application', function (Blueprint $table) {
            $table->id();
            $table->longText('doc_title')->nullable();
            $table->integer('document_type_id')->nullable();
            $table->integer('application_code')->nullable();
            $table->integer('process_id')->nullable();
            $table->integer('stage_id')->nullable();
            $table->integer('workflow_stage_id')->nullable();
            $table->integer('stage_category_id')->nullable();
            $table->integer('application_status_id')->nullable();
            $table->integer('owner_user_id')->nullable();
            $table->integer('owner_group_id')->nullable();
            $table->integer('owner_type_id')->nullable();
            $table->string('doc_version')->nullable();
            $table->string('document_number')->nullable();
            $table->integer('navigator_folder_id')->nullable();
            $table->integer('applicant_id')->nullable();
            $table->string('view_id')->nullable();
            $table->integer('module_id')->nullable();
            $table->integer('sub_module_id')->nullable();
            $table->integer('reg_serial')->nullable();
            $table->longText('doc_description')->nullable();
            $table->string('reference_no')->nullable();
            $table->string('tracking_no')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->integer('created_by')->default(0);
            $table->integer('altered_by')->default(0);
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola')->useCurrent();
            $table->integer('has_parent_level')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tra_documentrecords_application');
    }
}
