<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEqmsIssueStatusesLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eqms_issue_statuses_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->integer('ref_id')->nullable();
            $table->integer('issue_status_id')->nullable();
            $table->text('action');
            $table->timestamp('created_on')->useCurrent();
            $table->text('title')->nullable();
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
        Schema::dropIfExists('eqms_issue_statuses_logs');
    }
}
