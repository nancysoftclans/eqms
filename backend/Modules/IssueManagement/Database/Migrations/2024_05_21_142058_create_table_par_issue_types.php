<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableParIssueTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_issue_types', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable(); 
            $table->integer('form_id');  
            // $table->unsignedBigInteger('issue_type_category_id');
            // $table->text('default_subject')->nullable();            
            // $table->string('prefix');
            // $table->unsignedBigInteger('issue_status_group_id');
            // $table->boolean('issue_status_group_locked')->default(false);
            // $table->integer('target_period')->default(0);
            // $table->enum('target_period_unit', ['Days','Hours'])->default('Days');
            // $table->boolean('target_period_locked')->default(false);
            // $table->integer('followup_period')->default(0);
            // $table->enum('followup_period_unit', ['Days','Hours'])->default('Days');
            // $table->boolean('followup_period_locked')->default(false);
            // $table->boolean('is_raised_locked')->default(false);
            // $table->boolean('close_on)complete')->default(false);
            // $table->boolean('organisational_area_required')->default(false);
            // $table->boolean('issue_pdf_report')->default(false);
            // $table->boolean('issue_word_report')->default(false);
            // $table->integer('workflow_id');

            $table->boolean('is_enabled')->default(false);
            $table->integer('created_by')->default(0);
            $table->integer('altered_by')->default(0);
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola')->useCurrent();

            $table->foreign('form_id')->references('id')->on('par_form_categories')->onDelete('cascade');
            // $table->foreign('issue_type_category_id')->references('id')->on('par_issue_type_categories')->onDelete('cascade');
            // $table->foreign('issue_status_group_id')->references('id')->on('par_issue_status_groups')->onDelete('cascade');
            // $table->foreign('workflow_id')->references('id')->on('wf_workflows')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('par_issue_types');
    }
}
