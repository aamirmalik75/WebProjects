<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Job;
use App\Models\Project;
use App\Models\HourlyJob;
use App\Models\Application;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'company',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  public function jobsAsEmployer()
  {
    return $this->hasMany(Job::class, 'employer_id');
  }

  public function jobAsEmployee()
  {
    return $this->hasOne(Job::class, 'employee_id');
  }

  public function projectAsEmployer()
  {
    return $this->hasMany(Project::class, 'employer_id');
  }

  public function projectAsEmployee()
  {
    return $this->hasOne(Project::class, 'employee_id');
  }

  public function hourlyJobAsEmployer()
  {
    return $this->hasMany(HourlyJob::class, 'employer_id');
  }

  public function hourlyJobAsEmployee()
  {
    return $this->hasOne(HourlyJob::class, 'employee_id');
  }

  public function applications()
  {
    return $this->hasMany(Application::class);
  }
}
