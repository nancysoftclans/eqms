<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTraIssueManagementDocuments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tra_issue_management_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('issue_id');
            $table->integer('document_id')->nullable();
            $table->enum('type', ['Attached file', 'Document']);
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
        Schema::dropIfExists('tra_issue_management_documents');
    }
}
