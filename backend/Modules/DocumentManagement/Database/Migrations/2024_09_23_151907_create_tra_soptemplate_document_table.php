<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraSoptemplateDocumentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tra_soptemplate_document', function (Blueprint $table) {
            $table->id();
            $table->string('file_name')->nullable();
            $table->string('initial_file_name')->nullable();
            $table->string('file_type')->nullable();
            $table->string('node_ref')->nullable();
            $table->integer('filesize')->nullable();
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
        Schema::dropIfExists('tra_soptemplate_document');
    }
}
