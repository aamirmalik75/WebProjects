<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('applications', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('applicant_id');
      $table->string('name');
      $table->string('cv_path');
      $table->unsignedBigInteger('number');
      $table->text('cover_letter')->nullable();
      $table->string('status')->default('applied');
      $table->unsignedBigInteger('applicationable_id');
      $table->string('applicationable_type');
      $table->timestamps();
      $table->foreign('applicant_id')->references('id')->on('users')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('applications');
  }
};
