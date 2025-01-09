<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsTableAddNcFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->string('report_number')->nullable();
            $table->date('occurrence_date')->nullable();
            $table->text('relevant_requirement')->nullable();
            $table->string('finding_type')->nullable();
            $table->string('source')->nullable();
            $table->string('finding_person')->nullable();
            $table->date('rca_date')->nullable();
            $table->string('approval_decision')->nullable();
            $table->date('verification_date')->nullable();
            $table->text('quality_office_decision')->nullable();
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
