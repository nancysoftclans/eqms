<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddChangeMngnt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->text('change_description')->nullable();
            $table->text('change_purpose')->nullable();
            $table->text('change_impact')->nullable();
            $table->integer('change_revalidation')->nullable();
            // $table->text('quality_office_comments')->nullable();
            $table->text('hod_comments')->nullable();
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
