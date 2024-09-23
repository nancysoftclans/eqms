<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParNavigatorFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('par_navigator_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('0');
            $table->integer('has_parent_level')->nullable()->default(null);
            $table->integer('docparent_id')->nullable()->default(null);
            $table->integer('is_enabled')->default('0');
            $table->integer('owner_user_id')->default('0');
            $table->integer('owner_group_id')->default('0');
            $table->integer('has_restriction_id')->default('0');
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
        Schema::dropIfExists('par_navigator_folders');
    }
}
