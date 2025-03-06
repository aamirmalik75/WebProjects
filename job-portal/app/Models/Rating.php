<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Application;

class Rating extends Model
{
  use HasFactory;
  protected $fillable = ['rating', 'comment'];
  
  public function application()
  {
    return $this->belongsTo(Application::class);
  }
}
