<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Notifications\EmployerNotifications;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
  public function notifications()
  {
    $notifications = auth()->user()->notifications()->paginate(10);
    return response()->json(['success' => true, 'notifications' => $notifications], 200);
  }

  public function markAllAsRead()
  {
    auth()->user()->unreadNotifications->markAsRead();
    return response()->json(['success' => true, 'message' => 'All Notifications mark as read']);
  }

  public function unreadNotifications()
  {
    $unReadNotifications = auth()->user()->unreadNotifications;
    return response()->json(['success' => true, 'unReadNotifications' => $unReadNotifications], 200);
  }
}
