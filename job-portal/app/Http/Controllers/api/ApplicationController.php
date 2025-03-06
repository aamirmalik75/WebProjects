<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
use App\Models\Project;
use App\Models\HourlyJob;
use App\Models\Application;
use App\Models\User;
use App\Notifications\EmployeeNotifications;
use App\Notifications\EmployerNotifications;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
  public function store(Request $request)
  {
    $data = Validator::make($request->all(), [
      'name' => 'required|string',
      'number' => 'required|numeric',
      'cv_path' => 'required|string',
      'cover_letter' => 'required|string',
      'applicationable_id' => 'required|numeric',
      'applicationable_type' => 'required|string|in:Job,Project,Hourly_Job'
    ]);

    if ($data->fails())
      return response()->json(['success' => false, 'error' => $data->errors()], 422);

    $applicationable = null;
    switch ($request->input('applicationable_type')) {
      case 'Job':
        $applicationable = Job::findOrFail($request->input('applicationable_id'));
        break;
      case 'Project':
        $applicationable = Project::findOrFail($request->input('applicationable_id'));
        break;
      case 'Hourly_Job':
        $applicationable = HourlyJob::findOrFail($request->input('applicationable_id'));
        break;
    }
    if (!$applicationable)
      return response()->json(['success' => false, 'error' => 'Resource Not Found'], 404);

    $application = new Application([
      'name' => $request->input('name'),
      'number' => $request->input('number'),
      'cv_path' => $request->input('cv_path'),
      'cover_letter' => $request->input('cover_letter'),
      'applicationable_type' => $request->input('applicationable_type'),
      'applicationable_id' => $request->input('applicationable_id'),
      'applicant_id' => Auth::id(),
    ]);

    $applicationable->applications()->save($application);

    $employer = User::findOrFail($applicationable->employer_id);
    $message = 'A new application has been submitted for the "' . $applicationable->title . '".';
    $employer->notify(new EmployerNotifications($message, $employer));

    return response()->json(['success' => true, 'message' => 'Application Created Successfully'], 201);
  }

  public function instance(Request $request)
  {
    $id = $request->route('id');
    $application = Application::find($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    return response()->json(['success' => true, 'application' => $application], 200);
  }

  public function index(Request $request)
  {
    $applications = Application::where('applicant_id', Auth::id())->get();
    return response()->json(['success' => true, 'applications' => $applications], 200);
  }

  public function applicationsForResource(Request $request)
  {
    $id = $request->route('id');
    $applications = Application::where('applicationable_id', $id)->get();
    return response()->json(['success' => true, 'applications' => $applications], 200);
  }

  public function delete(Request $request)
  {
    $id = $request->route('id');
    $application = Application::find($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if ($application->applicant_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $application->delete();
    return response()->json(['success' => true, 'message' => 'Application Delete Successfully'], 200);
  }

  public function checkApplication(Request $request)
  {
    $applicant_id  = Auth::id();
    $applicationable_id = $request->route('resource_id');
    $hasApplied = Application::where('applicationable_id', $applicationable_id)->where('applicant_id', $applicant_id)->exists();
    return response()->json(['hasApplied' => $hasApplied]);
  }

  public function hireApplicant(Request $request)
  {
    $id = $request->route('id');
    $application = Application::findOrFail($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if (Auth::id() != $application->applicationable->employer_id)
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $resource = $application->applicationable;
    $resource->status = 'filled';
    $resource->employee_id = $application->applicant_id;
    $resource->save();

    $appli = Application::where('id', $id)->update(['status' => 'hired']);

    $applicant = User::findOrFail($application->applicant_id);
    $message = 'Congratulations! Your application "' . $application->applicationable->title . '" has been hired for this vacancy.';
    $applicant->notify(new EmployeeNotifications($message, $applicant));

    Application::where('applicationable_id', $application->applicationable_id)->where('id', '!=', $id)->update(['status' => 'rejected']);
    $otherApplications = Application::where('applicationable_id', $application->applicationable_id)->where('id', '!=', $id)->get();
    foreach ($otherApplications as $otherApplication) {
      $otherApplicant = User::findOrFail($otherApplication->applicant_id);
      $otherMessage = 'We regret to inform you that your application for the vacancy "' . $application->applicationable->title . '" has been rejected.';
      $otherApplicant->notify(new EmployeeNotifications($otherMessage, $otherApplicant));
    }

    return response()->json(['success' => true, 'message' => 'Applicant hired successfully']);
  }

  public function rejectApplicant(Request $request)
  {
    try {
      $id = $request->route('id');
      $application = Application::findOrFail($id);

      if (!$application) {
        return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
      }

      if (Auth::id() != $application->applicationable->employer_id) {
        return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
      }

      $appli = Application::where('id', $id)->update(['status' => 'rejected']);

      $applicant = User::findOrFail($application->applicant_id);
      $message = 'We regret to inform you that your application for the vacancy "' . $application->applicationable->title . '" has been rejected.';
      $applicant->notify(new EmployeeNotifications($message, $applicant));

      return response()->json(['success' => true, 'message' => 'Applicant rejected successfully']);
    } catch (\Exception $e) {
      // Log the exception for debugging
      Log::error('Exception occurred in rejectApplicant: ' . $e->getMessage());
      // Return a generic error response
      return response()->json(['success' => false, 'error' => 'An unexpected error occurred'], 500);
    }
  }

  public function shortListApplicant(Request $request)
  {
    $id = $request->route('id');
    $application = Application::findOrFail($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if (Auth::id() != $application->applicationable->employer_id)
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    $appli = Application::where('id', $id)->update(['status' => 'shortListed']);

    $applicant = User::findOrFail($application->applicant_id);
    $message = 'Congratulations! You have been shortlisted for the vacancy "' . $application->applicationable->title . '".';
    $applicant->notify(new EmployeeNotifications($message, $applicant));

    return response()->json(['success' => true, 'message' => 'Applicant shortListed successfully']);
  }

  public function fireApplicant(Request $request)
  {
    $id = $request->route('id');
    $application = Application::findOrFail($id);
    if (!$application)
      return response()->json(['success' => false, 'error' => 'Application Not Found'], 404);
    if (Auth::id() != $application->applicationable->employer_id)
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    if ($application->status != 'hired') {
      return response()->json(['success' => false, 'error' => 'Bad Request'], 400);
    }

    $resource = $application->applicationable;
    $resource->status = 'empty';
    $resource->employee_id = null;
    $resource->save();

    $appli = Application::where('id', $id)->update(['status' => 'fired']);

    $users = User::where('id', '!=', $application->applicant_id)->where('role', 'employee')->get();
    foreach ($users as $user) {
      $users_message = 'A vacancy for the position "' . $resource->title . '" is now available. Apply now!';
      $user->notify(new EmployeeNotifications($users_message, $user));
    }

    $applicant = User::findOrFail($application->applicant_id);
    $message = 'We regret to inform you that your are fired from this position "' . $application->applicationable->title . '".';
    $applicant->notify(new EmployeeNotifications($message, $applicant));

    return response()->json(['success' => true, 'message' => 'Applicant fired successfully']);
  }
}
