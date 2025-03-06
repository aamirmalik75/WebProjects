<?php

namespace App\Notifications;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class EmployeeNotifications extends Notification implements ShouldBroadcast
{
  use Queueable, InteractsWithSockets, SerializesModels;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  protected $employee;
  protected $message;
  public function __construct($message, $employee)
  {
    $this->employee = $employee;
    $this->message = $message;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return ['database', 'broadcast'];
  }

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    return [
      'greeting' => 'Dear ' . $this->employee->name . '!',
      'message' => $this->message,
    ];
  }

  public function toBroadcast($notifiable)
  {
    return new BroadcastMessage(
      [
        'data' => [
          'greeting' => 'Dear ' . $this->employee->name . '!',
          'message' => $this->message,
        ]
      ]
    );
  }

  public function broadcastOn()
  {
    return ['notify-user'];
  }

  public function broadcastAs()
  {
    return 'user-notification';
  }
}
