<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Application;

class HourlyJob extends Model
{
  use HasFactory;
  protected $fillable = [
    'title', 'description', 'company', 'industry_type', 'job_type', 'location', 'min_hour_rate', 'max_hour_rate', 'skills_required', 'employee_id', 'company_details', 'status', 'requirement', 'company_employees'
  ];

  public function employer()
  {
    return $this->belongsTo(User::class, 'employer_id', 'id');
  }

  public function employee()
  {
    return $this->belongsTo(User::class, 'employee_id', 'id');
  }

  public function applications()
  {
    return $this->morphMany(Application::class, 'applicationable');
  }
}
