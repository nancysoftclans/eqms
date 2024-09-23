<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParDocumentTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_document_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('0');
            $table->string('property_ids')->nullable()->default('0');
            $table->string('prefix')->nullable()->default('0');
            $table->integer('module_id')->nullable();
            $table->integer('sub_module_id')->nullable();
            $table->integer('form_type_id')->nullable();
            $table->integer('has_parent_level')->nullable();
            $table->integer('docparent_id')->nullable();
            $table->integer('document_requirement_id')->nullable();
            $table->boolean('is_enabled')->default(false);
            $table->boolean('is_controlled')->default(false);
            $table->boolean('has_restriction_id')->default(false);
            $table->integer('owner_user_id')->default(0);
            $table->integer('owner_group_id')->default(0);
            $table->integer('notifications_id')->default(0);            
            $table->integer('review_period')->nullable();
            $table->text('review_instructions')->nullable();
            $table->integer('expiry_period')->nullable();
            $table->text('disposition_instructions')->nullable();
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
        Schema::dropIfExists('par_document_types');
    }
}
