<?php

namespace App\Listeners;

use App\Events\Registered;
use App\Models\MenuItem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateDefaultMenuItems
{
  /**
   * Create the event listener.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   *
   * @param  \App\Events\Registered  $event
   * @return void
   */
  public function handle(Registered $event)
  {
    

  }
}
