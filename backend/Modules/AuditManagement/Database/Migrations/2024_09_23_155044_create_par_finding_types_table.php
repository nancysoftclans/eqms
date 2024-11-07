<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParFindingTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_finding_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
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
        Schema::dropIfExists('par_finding_types');
    }
}
