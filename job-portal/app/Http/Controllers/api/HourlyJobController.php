<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\HourlyJob;
use App\Models\User;
use App\Notifications\EmployeeNotifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class HourlyJobController extends Controller
{
  public function create(Request $request)
  {
    $validData = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
      'company' => 'nullable|string',
      'industry_type' => 'nullable|string',
      'job_type' => 'nullable|string',
      'location' => 'nullable|string',
      'min_hour_rate' => 'nullable|numeric',
      'max_hour_rate' => 'nullable|numeric',
      'skills_required' => 'nullable|array',
      'company_details' => 'nullable|string',
      'company_employees' => 'nullable|numeric',
      'requirement' => 'nullable|string',
    ]);

    if ($validData->fails()) {
      return response()->json(['success' => false, 'error' => $validData->errors()], 422);
    }

    // convert array into json
    $skillsArray = json_encode($request->skills_required);

    $hourlyJob = new HourlyJob();
    $hourlyJob->employer_id = Auth::id();
    $hourlyJob->title =  $request->input('title');
    $hourlyJob->description =  $request->input('description');
    $hourlyJob->company =  $request->input('company');
    $hourlyJob->industry_type =  $request->input('industry_type');
    $hourlyJob->job_type =  $request->input('job_type');
    $hourlyJob->location =  $request->input('location');
    $hourlyJob->min_hour_rate =  $request->input('min_hour_rate');
    $hourlyJob->max_hour_rate =  $request->input('max_hour_rate');
    $hourlyJob->company_details = $request->input('company_details');
    $hourlyJob->company_employees = $request->input('company_employees');
    $hourlyJob->requirement = $request->input('requirement');
    $hourlyJob->skills_required =  $skillsArray;

    $hourlyJob->save();

    $users = User::where('role', 'employee')->get();
    foreach ($users as $user) {
      $users_message = 'A vacancy for the position of hourly job "' . $hourlyJob->title . '" is now available. Apply now!';
      $user->notify(new EmployeeNotifications($users_message, $user));
    }

    return response()->json(['success' => true, 'message' => 'Hourly Job created Successfully!', 'hourlyJob' => $hourlyJob], 201);
  }

  public function index()
  {
    $hourlyJobs = HourlyJob::where('status', 'empty')->paginate(9);
    return response()->json(['success' => true, 'hourlyJobs' => $hourlyJobs], 200);
  }

  public function employer_hourlyJobs()
  {
    $hourlyJobs = HourlyJob::where('employer_id', Auth::id())->where('status', 'empty')->paginate(9);
    return response()->json(['success' => true, 'hourlyJobs' => $hourlyJobs], 200);
  }

  public function showHourlyJob(Request $request)
  {
    $id = $request->route('id');
    $hourlyJob = HourlyJob::find($id);
    if (!$hourlyJob)
      return response()->json(['success' => false, 'error' => 'Hourly Job Not Found'], 404);
    return response()->json(['success' => true, 'job' => $hourlyJob], 200);
  }

  public function homePage(Request $request)
  {
    $hourlyjobs = HourlyJob::where('status','empty')->latest()->take(3)->get();
    return response()->json(['success' => true, 'hourlyjobs' => $hourlyjobs], 200);
  }

  public function delete(Request $request)
  {
    $id = $request->route('id');
    $hourlyJob = HourlyJob::find($id);
    if (!$hourlyJob)
      return response()->json(['success' => false, 'error' => 'Hourly Job Not Found'], 404);
    if ($hourlyJob->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $hourlyJob->delete();
    return response()->json(['success' => true, 'message' => 'Hourly Job Deleted Successfully!'], 200);
  }

  public function update(Request $request)
  {
    $id = $request->route('id');
    $validData = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
      'industry_type' => 'nullable|string',
      'job_type' => 'nullable|string',
      'location' => 'nullable|string',
      'min_hour_rate' => 'nullable|numeric',
      'max_hour_rate' => 'nullable|numeric',
      'skills_required' => 'nullable|array',
      'company' => 'nullable|string',
      'company_details' => 'nullable|string',
      'requirement' => 'nullable|string',
      'company_employees' => 'nullable|numeric'
    ]);

    if ($validData->fails()) {
      return response()->json(['success' => false, 'error' => $validData->errors()], 422);
    }

    $hourlyJob  = HourlyJob::find($id);
    if (!$hourlyJob)
      return response()->json(['success' => false, 'error' => 'Houly Job Not Found'], 404);

    if ($hourlyJob->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    if ($request->has('skills_required')) {
      $hourlyJob->skills_required = json_encode($request->skills_required);
    }

    $hourlyJob->fill($request->all());
    $hourlyJob->save();
    return response()->json(['success' => true, 'message' => 'Houly Job Updated Successfully'], 200);
  }
}
