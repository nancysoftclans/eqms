<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQmsTemplateTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qms_template_types', function (Blueprint $table) {
            $table->increments('id');
            $table->text('name')->nullable();
            $table->integer('altered_by')->nullable();
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('dola');
            $table->integer('is_enabled')->nullable();
            $table->integer('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('qms_template_types');
    }
}
