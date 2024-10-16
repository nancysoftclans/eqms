<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParQmsAuditTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_qms_audit_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->longText('description');
            $table->longText('prefix');
            $table->integer('is_modifiable_id')->nullable();
            $table->integer('is_allowpdfexport_id')->nullable();
            $table->integer('requre_notewithresponse_id')->nullable();
            $table->integer('owner_asauditor_id')->nullable();
            $table->integer('is_allowwordexport_id')->nullable();
            $table->integer('owner_user_id')->nullable();
            $table->integer('owner_group_id')->nullable();
            $table->integer('has_restriction_id')->nullable();
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
        Schema::dropIfExists('par_qms_audit_types');
    }
}
