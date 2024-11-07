<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEqmsIssueTypesLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eqms_issue_types_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('ref_id')->nullable();
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->text('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('form_id')->nullable();
            $table->integer('status_group_id')->nullable();
            $table->integer('issue_type_category_id')->nullable();
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
        Schema::dropIfExists('eqms_issue_types_logs');
    }
}
