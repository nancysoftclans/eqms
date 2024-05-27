<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateDocumentTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('par_document_types', function (Blueprint $table) {
            $table->integer('review_period')->nullable();
            $table->text('review_instructions')->nullable();
            $table->integer('expiry_period')->nullable();
            $table->text('deposition_instructions')->nullable();
            $table->dropColumn('importexport_permittype_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('par_document_types', function (Blueprint $table) {
            $table->dropColumn('review_period');
            $table->dropColumn('review_instructions');
            $table->dropColumn('expiry_period');
            $table->dropColumn('deposition_instructions');
        });
    }
}
