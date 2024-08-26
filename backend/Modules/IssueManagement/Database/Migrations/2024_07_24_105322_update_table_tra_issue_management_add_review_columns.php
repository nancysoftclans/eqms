<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableTraIssueManagementAddReviewColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->integer('complaint_direct_or_indirect')->nullable();
            $table->integer('office_assigned_to')->nullable()->default(0);           
            $table->boolean('complaint_scheduling_delay')->default(false);
            $table->boolean('complaint_manner_of_advisor')->default(false);
            $table->boolean('complaint_turnaround')->default(false);
            $table->boolean('complaint_response_delay')->default(false);
            $table->boolean('complaint_other')->default(false);
            // $table->foreign('office_assigned_to')->references('id')->on('par_departments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('', function (Blueprint $table) {

        });
    }
}
