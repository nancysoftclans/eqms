<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParAuditFindingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_audit_findings', function (Blueprint $table) {
            $table->id();
            $table->integer('finding_type_id')->nullable();
            $table->integer('checklist_item_id')->nullable();
            $table->integer('application_code')->nullable();
            $table->string('finding_title', 200)->nullable();
            $table->longText('description')->nullable();
            $table->longText('results')->nullable();
            $table->integer('issue_id')->nullable();
            $table->boolean('is_enabled')->default(1);
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
        Schema::dropIfExists('par_audit_findings');
    }
}
