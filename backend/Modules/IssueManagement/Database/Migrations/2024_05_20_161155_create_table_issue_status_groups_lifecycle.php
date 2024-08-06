<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableIssueStatusGroupsLifecycle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_issue_status_groups_lifecycle', function (Blueprint $table) {
            $table->id();
            $table->integer('order')->nullable();
            $table->unsignedBigInteger('issue_status_group_id');
            $table->unsignedBigInteger('issue_status_id');
            $table->integer('is_enabled')->default(1);
            $table->integer('created_by')->default(0);
            $table->integer('altered_by')->default(0);
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola')->useCurrent();
            $table->foreign('issue_status_group_id')->references('id')->on('par_issue_status_groups')->onDelete('cascade');
            $table->foreign('issue_status_id')->references('id')->on('par_issue_statuses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('par_issue_status_groups_lifecycle');
    }
}
