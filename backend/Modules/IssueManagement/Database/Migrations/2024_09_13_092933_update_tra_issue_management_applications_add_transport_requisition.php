<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddTransportRequisition extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->integer('trip_purpose_id')->nullable();
            $table->date('date_of_travel')->nullable();
            $table->string('departure_time')->nullable();
            $table->date('return_date')->nullable();
            $table->string('arrival_time')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->text('justification_of_late_application')->nullable();
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
