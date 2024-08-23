<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableTraIssueManagementAddColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tra_issue_management_applications', function (Blueprint $table) {
            $table->dropColumn('section_id');
            $table->string('section_ids')->nullable();
            $table->string('complainant_name');
            $table->string('complainant_organisation')->nullable();
            $table->text('complainant_address')->nullable();
            $table->string('complainant_telephone')->nullable();
            $table->unsignedBigInteger('complaint_type')->nullable();
            $table->unsignedBigInteger('complaint_mode')->nullable();
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
