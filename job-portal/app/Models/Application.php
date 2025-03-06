<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Rating;

class Application extends Model
{
  use HasFactory;
  protected $fillable = ['name', 'cv_path', 'number', 'cover_letter', 'status', 'applicant_id'];

  public function applicationable()
  {
    return $this->morphTo();
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function rating()
  {
    return $this->hasMany(Rating::class);
  }

  protected static function boot()
  {
    parent::boot();

    static::saving(function ($application) {
      $existingApplication = Application::where([
        'applicant_id' => $application->applicant_id,
        'applicationable_id' => $application->applicationable_id,
        'applicationable_type' => $application->applicationable_type,
      ])->first();

      if ($existingApplication) {
        return false;
      }
    });
  }
}
