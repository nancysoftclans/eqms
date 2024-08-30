<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTraIssueManagementAudits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tra_issue_management_audits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('issue_id');
            $table->integer('audit_id')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->integer('created_by')->default(0);
            $table->integer('altered_by')->default(0);
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola')->useCurrent();
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
