<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsTableAddOfiFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->text('ofi_decision', )->nullable();
            $table->text('justification_for_rejection')->nullable();
            $table->text('quality_office_rejected_review')->nullable();
            $table->string('review_decision')->nullable();
            $table->string('issue_ref_id')->nullable();
            $table->text('proposed_improvement')->nullable();
            $table->date('completion_date')->nullable();
            $table->text('proposed_improvement_decision',)->nullable();
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
