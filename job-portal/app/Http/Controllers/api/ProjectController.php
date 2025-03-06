<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use App\Notifications\EmployeeNotifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
  public function create(Request $request)
  {
    $validData = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
      'company' => 'nullable|string',
      'industry_type' => 'nullable|string',
      'project_type' => 'nullable|string',
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

    $project = new Project();
    $project->employer_id = Auth::id();
    $project->title =  $request->input('title');
    $project->description =  $request->input('description');
    $project->company =  $request->input('company');
    $project->industry_type =  $request->input('industry_type');
    $project->project_type =  $request->input('project_type');
    $project->location =  $request->input('location');
    $project->min_salary =  $request->input('min_salary');
    $project->max_salary =  $request->input('max_salary');
    $project->company_details = $request->input('company_details');
    $project->company_employees = $request->input('company_employees');
    $project->requirement = $request->input('requirement');
    $project->skills_required =  $skillsArray;

    $project->save();
    $users = User::where('role', 'employee')->get();
    foreach ($users as $user) {
      $users_message = 'A vacancy for the project "' . $project->title . '" is now available. Apply now!';
      $user->notify(new EmployeeNotifications($users_message, $user));
    }
    return response()->json(['success' => true, 'message' => 'Project created Successfully!', 'project' => $project], 201);
  }

  public function index()
  {
    $projects = Project::where('status', 'empty')->paginate(9);
    return response()->json(['success' => true, 'projects' => $projects], 200);
  }

  public function employer_Projects()
  {
    $projects = Project::where('employer_id', Auth::id())->where('status', 'empty')->paginate(9);
    return response()->json(['success' => true, 'projects' => $projects], 200);
  }

  public function showProject(Request $request)
  {
    $id = $request->route('id');
    $project = Project::find($id);
    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found'], 404);
    return response()->json(['success' => true, 'job' => $project], 200);
  }

  public function homePage(Request $request)
  {
    $projects = Project::where('status', 'empty')->latest()->take(3)->get();
    return response()->json(['success' => true, 'projects' => $projects], 200);
  }

  public function delete(Request $request)
  {
    $id = $request->route('id');
    $project = Project::find($id);
    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found'], 404);
    if ($project->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
    $project->delete();
    return response()->json(['success' => true, 'message' => 'Project Deleted Successfully!'], 200);
  }

  public function update(Request $request)
  {
    $id = $request->route('id');
    $validData = Validator::make($request->all(), [
      'title' => 'required|string',
      'description' => 'required|string',
      'industry_type' => 'nullable|string',
      'project_type' => 'nullable|string',
      'location' => 'nullable|string',
      'min_payment' => 'nullable|numeric',
      'max_payment' => 'nullable|numeric',
      'skills_required' => 'nullable|array',
      'company' => 'nullable|string',
      'company_details' => 'nullable|string',
      'requirement' => 'nullable|string',
      'company_employees' => 'nullable|numeric'
    ]);

    if ($validData->fails()) {
      return response()->json(['success' => false, 'error' => $validData->errors()], 422);
    }

    $project  = Project::find($id);
    if (!$project)
      return response()->json(['success' => false, 'error' => 'Project Not Found'], 404);

    if ($project->employer_id != Auth::id())
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);

    if ($request->has('skills_required')) {
      $project->skills_required = json_encode($request->skills_required);
    }

    $project->fill($request->all());
    $project->save();
    return response()->json(['success' => true, 'message' => 'Project Updated Successfully'], 200);
  }
}
