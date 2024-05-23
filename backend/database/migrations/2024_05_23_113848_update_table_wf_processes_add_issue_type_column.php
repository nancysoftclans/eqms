<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTableWfProcessesAddIssueTypeColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wf_processes', function (Blueprint $table) {
            $table->unsignedBigInteger('issue_type_id')->nullable();

            $table->foreign('issue_type_id')->references('id')->on('par_issue_types')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('wf_processes', function (Blueprint $table) {
            //
        });
    }
}
