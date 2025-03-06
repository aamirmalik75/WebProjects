<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Rating;
use App\Models\User;
use App\Notifications\EmployeeNotifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
  public function store(Request $request)
  {
    $id = $request->route('id');
    $data = Validator::make($request->all(), [
      'rating' => 'required|numeric|in:1,2,3,4,5',
      'comment' => 'required|string',
    ]);
    if ($data->fails())
      return response()->json(['success' => false, 'error' => $data->errors()], 422);

    $application = Application::find($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if ($application->applicationable->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $rating = new Rating();
    $rating->rating = $request->input('rating');
    $rating->comment = $request->input('comment');
    $rating->application_id = $id;
    $rating->employer_id = Auth::id();
    $rating->save();

    $user = User::find($application->applicant_id);
    $message = 'Rating: ' . $request->input('rating') . ' posted on application "' . $application->applicationable->title . '".';
    $user->notify(new EmployeeNotifications($message, $user));
    return response()->json(['success' => true, 'message' => 'Rating Created Successfully', 'rating' => $rating], 200);
  }

  public function employer_rating_index(Request $request)
  {
    $id = $request->route('id');
    $employer_id = $request->route('employer_id');
    $application = Application::find($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if ($application->applicationable->employer_id != $employer_id)
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $ratings = Rating::where('application_id', $id)->where('employer_id', $employer_id)->get();
    return response()->json(['success' => true, 'ratings' => $ratings], 200);
  }

  public function rating_on_application(Request $request)
  {
    $id = $request->route('id');
    $employee_id = $request->route('employee_id');
    $application = Application::find($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if ($employee_id != $application->applicant_id)
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $ratings = Rating::where('application_id', $id)->get();
    return response()->json(['success' => true, 'ratings' => $ratings], 200);
  }

  public function asAlreadyRated(Request $request)
  {
    $id = $request->route('id');
    $hasRated = Rating::where('application_id', $id)->where('employer_id', Auth::id())->exists();
    return response()->json(['success' => true, 'hasRated' => $hasRated], 200);
  }

  public function update(Request $request)
  {
    $id = $request->route('id');
    $data = Validator::make($request->all(), [
      'rating' => 'required|numeric|in:1,2,3,4,5',
      'comment' => 'required|string',
    ]);
    if ($data->fails())
      return response()->json(['success' => false, 'error' => $data->errors()], 422);

    $rating = Rating::find($id);
    if (!$rating)
      return response()->json(['success' => false, 'error' => 'Rating Not Found'], 404);
    if ($rating->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $application = Application::find($rating->application_id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);

    $rating->fill($request->all());
    $rating->save();

    $user = User::find($application->applicant_id);
    $message = 'Rating: ' . $request->input('rating') . ' updated on application "' . $application->applicationable->title . '".';
    $user->notify(new EmployeeNotifications($message, $user));
    return response()->json(['success' => true, 'message' => 'Rating Updated Successfully', 'rating' => $rating], 200);
  }

  public function rating_Employee(Request $request)
  {
    try {
      // Get employee ID
      $employeeId = Auth::id();
      $resources = [];

      // Retrieve applications for the employee
      $applications = Application::where('applicant_id', $employeeId)->get();
      $applications_id = Application::where('applicant_id', $employeeId)->pluck('id');

      foreach ($applications as $application) {
        $resources[] = $application->applicationable->employer;
        $application->rating;
      }

      // Retrieve ratings for the applications
      $ratings = Rating::whereIn('application_id', $applications_id)->get();

      return response()->json(['success' => true, 'ratings' => $ratings, 'applications' => $applications], 200);
    } catch (\Exception $e) {
      return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
  }
}
