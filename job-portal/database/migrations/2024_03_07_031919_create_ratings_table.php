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
    Schema::create('ratings', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('application_id');
      $table->unsignedBigInteger('employer_id');
      $table->unsignedBigInteger('rating');
      $table->text('comment')->nullable();
      $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
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
    Schema::dropIfExists('ratings');
  }
};
