<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTableParIssueTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('par_issue_types', function (Blueprint $table) {
            $table->unsignedBigInteger('status_group_id')->after('form_id')->nullable();
            $table->unsignedBigInteger('issue_type_category_id')->after('status_group_id')->nullable();
            
            $table->foreign('status_group_id')->references('id')->on('par_issue_status_groups')->onDelete('cascade');
            $table->foreign('issue_type_category_id')->references('id')->on('par_issue_type_categories')->onDelete('cascade');
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
