<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParQmsAuditTypeLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_qms_audit_type_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('ref_id')->nullable();
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->text('code')->nullable();
            $table->text('name')->nullable();
            $table->text('prefix')->nullable();
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
        Schema::dropIfExists('par_qms_audit_type_logs');
    }
}
