<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddDeviationFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->integer('deviation_department')->nullable();
            $table->integer('deviation_function')->nullable();
            $table->text('deviation_area_affected')->nullable();
            $table->text('deviation_reason')->nullable();
            $table->integer('deviation_plannedorunplanned')->nullable();
            $table->date('deviation_from_date')->nullable();
            $table->date('deviation_to_date')->nullable(); 
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
