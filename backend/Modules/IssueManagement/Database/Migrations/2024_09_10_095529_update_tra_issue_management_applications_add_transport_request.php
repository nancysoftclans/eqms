<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTraIssueManagementApplicationsAddTransportRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->string('requisition_officer')->nullable();
            $table->string('designation')->nullable();
            $table->text('drivers')->nullable();
            $table->text('trip_purpose')->nullable();
            $table->string('destination')->nullable();
            $table->integer('number_of_passengers')->nullable();
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
