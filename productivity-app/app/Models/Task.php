<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;

class Task extends Model
{
  use HasFactory;
  protected $fillable = ['title', 'project_id', 'field'];

  public function Project()
  {
    return $this->belongsTo(Project::class);
  }
}
