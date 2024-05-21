<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTraIssueManagementApplications extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tra_issue_management_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('issue_type_id');
            $table->string('title');
            $table->text('description');
            $table->date('target_resolution_date')->nullable();
            $table->date('follow_up_on')->nullable();
            $table->integer('section_id');
            $table->unsignedBigInteger('issue_status_id');
            $table->bigInteger('created_by');
            $table->bigInteger('altered_by');
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola')->useCurrent();

            $table->foreign('issue_type_id')->references('id')->on('par_issue_types')->onDelete('cascade');
            $table->foreign('section_id')->references('id')->on('par_sections')->onDelete('cascade');
            $table->foreign('issue_status_id')->references('id')->on('par_issue_statuses')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('altered_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('');
    }
}
