<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\User;
use App\Notifications\EmployeeNotifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class JobsController extends Controller
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
      'min_salary' => 'nullable|numeric',
      'max_salary' => 'nullable|numeric',
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

    $job = new Job();
    $job->employer_id = Auth::id();
    $job->title = $request->input('title');
    $job->description = $request->input('description');
    $job->company = $request->input('company');
    $job->industry_type = $request->input('industry_type');
    $job->job_type = $request->input('job_type');
    $job->location = $request->input('location');
    $job->min_salary = $request->input('min_salary');
    $job->max_salary = $request->input('max_salary');
    $job->company_details = $request->input('company_details');
    $job->company_employees = $request->input('company_employees');
    $job->requirement = $request->input('requirement');
    $job->skills_required = $skillsArray;

    $job->save();
    $users = User::where('role', 'employee')->get();
    foreach ($users as $user) {
      $users_message = 'A vacancy for the position "' . $job->title . '" is now available. Apply now!';
      $user->notify(new EmployeeNotifications($users_message, $user));
    }
    return response()->json(['success' => true, 'message' => 'Job created Successfully!', 'job' => $job], 201);
  }

  public function index()
  {
    $jobs = Job::where('status', 'empty')->paginate(9);
    return response()->json(['success' => true, 'jobs' => $jobs], 200);
  }

  public function employer_Jobs()
  {
    $jobs = Job::where('employer_id', Auth::id())->where('status', 'empty')->paginate(9);
    return response()->json(['success' => true, 'jobs' => $jobs], 200);
  }

  public function showJob(Request $request)
  {
    $id = $request->route('id');
    $job = Job::find($id);
    if (!$job)
      return response()->json(['success' => false, 'error' => 'Job Not Found'], 404);
    return response()->json(['success' => true, 'job' => $job], 200);
  }

  public function homePage(Request $request)
  {
    $jobs = Job::where('status', 'empty')->latest()->take(3)->get();
    return response()->json(['success' => true, 'jobs' => $jobs], 200);
  }

  public function delete(Request $request)
  {
    $id = $request->route('id');
    $job = Job::find($id);
    if (!$job)
      return response()->json(['success' => false, 'error' => 'Job Not Found'], 404);
    if ($job->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $job->delete();
    return response()->json(['success' => true, 'message' => 'Job Deleted Successfully!'], 200);
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
      'min_salary' => 'nullable|numeric',
      'max_salary' => 'nullable|numeric',
      'skills_required' => 'nullable|array',
      'company' => 'nullable|string',
      'company_details' => 'nullable|string',
      'requirement' => 'nullable|string',
      'company_employees' => 'nullable|numeric'
    ]);

    if ($validData->fails()) {
      return response()->json(['success' => false, 'error' => $validData->errors()], 422);
    }

    $job = Job::find($id);
    if (!$job)
      return response()->json(['success' => false, 'error' => 'Job Not Found'], 404);

    if ($job->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    if ($request->has('skills_required')) {
      $job->skills_required = json_encode($request->skills_required);
    }

    $job->fill($request->all());
    $job->save();
    return response()->json(['success' => true, 'message' => 'Job Updated Successfully'], 200);
  }
}
