<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEqmsDocumentTypeLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eqms_document_type_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('ref_id')->nullable();
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->text('name')->nullable();
            $table->integer('sub_module_id')->nullable();
            $table->integer('review_period')->nullable();
            $table->integer('expiry_period')->nullable();
            $table->text('disposition_instructions')->nullable();
            $table->text('review_instructions')->nullable();
            $table->integer('owner_user_id')->nullable();
            $table->integer('owner_group_id')->nullable();
            $table->integer('is_enabled')->nullable();
            $table->integer('submitted_by');
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
        Schema::dropIfExists('eqms_document_type_logs');
    }
}
