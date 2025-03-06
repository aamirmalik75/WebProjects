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
    Schema::create('jobs', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('employer_id');
      $table->unsignedBigInteger('employee_id')->nullable();
      $table->string('title'); //
      $table->string('description'); //
      $table->string('industry_type')->nullable(); //
      $table->string('status')->default('empty');
      $table->string('requirement')->nullable(); //
      $table->string('company')->nullable(); //
      $table->unsignedBigInteger('company_employees')->default(0); //
      $table->string('company_details')->nullable(); //
      $table->string('job_type')->nullable(); //
      $table->string('location')->nullable(); //
      $table->decimal('min_salary', 10, 2)->nullable(); //
      $table->decimal('max_salary', 10, 2)->nullable(); //
      $table->json('skills_required')->nullable(); //

      $table->foreign('employer_id')->references('id')->on('users')->onDelete('cascade');
      $table->foreign('employee_id')->references('id')->on('users')->onDelete('set null');
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
    Schema::dropIfExists('jobs');
  }
};
