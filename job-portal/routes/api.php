<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\JobsController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\HourlyJobController;
use App\Http\Controllers\api\ApplicationController;
use App\Http\Controllers\api\NotificationController;
use App\Http\Controllers\api\RatingController;
use App\Models\Application;
use App\Models\HourlyJob;
use App\Models\Job;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  $role = auth()->user()->role;
  $id = auth()->user()->id;
  $data = [];
  if ($role === 'employer') {
    $jobsCount = Job::where('employer_id', $id)->count();
    $projectsCount = Project::where('employer_id', $id)->count();
    $hourlyJobsCount = HourlyJob::where('employer_id', $id)->count();
    $data = [
      'jobs' => $jobsCount,
      'projects' => $projectsCount,
      'hourlyJobs' => $hourlyJobsCount
    ];
  } else {
    $applications = Application::where('applicant_id', $id)->count();
    $applied = Application::where('applicant_id', $id)->where('status', 'applied')->count();
    $shortListed = Application::where('applicant_id', $id)->where('status', 'shortListed')->count();
    $rejected = Application::where('applicant_id', $id)->where('status', 'rejected')->count();
    $hired = Application::where('applicant_id', $id)->where('status', 'hired')->count();
    $fired = Application::where('applicant_id', $id)->where('status', 'fired')->count();
    $data = [
      'applications' => $applications,
      'applied' => $applied,
      'shortListed' => $shortListed,
      'rejected' => $rejected,
      'hired' => $hired,
      'fired' => $fired,
    ];
  }
  return response()->json(['success' => true, 'data' => $data], 200);
});

Route::get('/keywords', function () {
  $jobsKeywords = Job::pluck('title')->toArray();
  $projectsKeywords = Project::pluck('title')->toArray();
  $hourlyjobsKeywords = HourlyJob::pluck('title')->toArray();
  $keywords = array_unique(array_merge($jobsKeywords, $projectsKeywords, $hourlyjobsKeywords));
  return response()->json(compact('keywords'));
});

Route::get('/search', function (Request $request) {
  $result = [];
  $jobResults = Job::query();
  $projectResults = Project::query();
  $hourlyJobResults = HourlyJob::query();

  $keyword = $request->query('keyword', '');
  $type = $request->query('type', 'all');
  $industry = $request->query('industry', '');
  $requirement = $request->query('requirement', '');
  $order = $request->query('order', 'desc');
  $other = $request->query('other', '');
  $requirement_for = str_replace('-', ' ', $requirement);

  if ($type === 'all' || $type === 'Job') {
    if (!empty($keyword))
      $jobResults = $jobResults->where('title', 'like', "%$keyword%");
    if (!empty($industry))
      $jobResults->where('industry_type', $industry);
    if (!empty($requirement))
      $jobResults->where('requirement', $requirement_for);
    if (!empty($other))
      $jobResults->where('job_type', $other);
    $jobResults = $jobResults->orderBy('created_at', $order)->paginate(9);
    $result = array_merge($result, $jobResults->toArray());
  }

  if ($type === 'all' || $type === 'Project') {
    if (!empty($keyword))
      $projectResults = $projectResults->where('title', 'like', "%$keyword%");
    if (!empty($industry))
      $projectResults->where('industry_type', $industry);
    if (!empty($requirement))
      $projectResults->where('requirement', $requirement_for);
    if (!empty($other))
      $projectResults->where('project_type', $other);
    $projectResults = $projectResults->orderBy('created_at', $order)->paginate(9);
    $result = array_merge($result, $projectResults->toArray());
  }

  if ($type === 'all' || $type === 'Hourly Job') {
    if (!empty($keyword))
      $hourlyJobResults = $hourlyJobResults->where('title', 'like', "%$keyword%");
    if (!empty($industry))
      $hourlyJobResults->where('industry_type', $industry);
    if (!empty($requirement))
      $hourlyJobResults->where('requirement', $requirement_for);
    if (!empty($other))
      $hourlyJobResults->where('job_type', $other);
    $hourlyJobResults = $hourlyJobResults->orderBy('created_at', $order)->paginate(9);
    $result = array_merge($result, $hourlyJobResults->toArray());
  }

  foreach ($result['data'] as &$item) {
    if (isset($item['job_type']) && isset($item['min_salary']))
      $item['model'] = 'Job';
    else if (isset($item['job_type']) && isset($item['min_hour_rate']))
      $item['model'] = 'Hourly Job';
    else if (isset($item['project_type']) && isset($item['min_salary']))
      $item['model'] = 'Project';
  }

  return response()->json(['success' => true, 'result' => $result], 200);
});

Route::middleware('auth:sanctum')->get('/dashboard-data', function (Request $request) {
  $industries = ['it_software', 'finance', 'health', 'education', 'manufacturing', 'retail', 'construction', 'tourism', 'transportation', 'media_entertainment'];
  $labels = [
    'it_software' => 'IT/Software',
    'finance' => 'Finance',
    'health' => 'Health',
    'education' => 'Education',
    'manufacturing' => 'Manufacturing',
    'retail' => 'Retail',
    'construction' => 'Construction',
    'tourism' => 'Tourism',
    'transportation' => 'Transport',
    'media_entertainment' => 'Media'
  ];
  $data = [];
  $applicationsCounterByIndustry = [];

  $rejectedCounts = [];
  $shortlistedCounts = [];
  $appliedCounts = [];
  $hiredCounts = [];
  $firedCounts = [];

  foreach ($industries as $industry) {
    $jobCount = Job::where('employer_id', Auth::id())->where('industry_type', $industry)->count();
    $projectCount = Project::where('employer_id', Auth::id())->where('industry_type', $industry)->count();
    $hourlyJobCount = HourlyJob::where('employer_id', Auth::id())->where('industry_type', $industry)->count();

    // applications
    $jobApplications = Job::where('employer_id', Auth::id())
      ->where('industry_type', $industry)
      ->with('applications')->get()->pluck('applications')->flatten();

    $projectApplications = Project::where('employer_id', Auth::id())
      ->where('industry_type', $industry)
      ->with('applications')->get()->pluck('applications')->flatten();

    $hourlyJobApplications = HourlyJob::where('employer_id', Auth::id())
      ->where('industry_type', $industry)
      ->with('applications')->get()->pluck('applications')->flatten();

    // applications status count
    $rejectedCounts[$industry] = [
      'id' => $industry,
      'label' => $labels[$industry],
      "value" =>  Application::whereHasMorph('applicationable', [Job::class, Project::class, HourlyJob::class], function ($query) use ($industry) {
        $query->where('industry_type', $industry);
      })->where('status', 'rejected')->count(),
    ];

    $shortlistedCounts[$industry] = [
      'id' => $industry,
      'label' => $labels[$industry],
      'value' => Application::whereHasMorph('applicationable', [Job::class, Project::class, HourlyJob::class], function ($query) use ($industry) {
        $query->where('industry_type', $industry);
      })->where('status', 'shortlisted')->count()
    ];

    $appliedCounts[$industry] = [
      'id' => $industry,
      'label' => $labels[$industry],
      'value' => Application::whereHasMorph('applicationable', [Job::class, Project::class, HourlyJob::class], function ($query) use ($industry) {
        $query->where('industry_type', $industry);
      })->where('status', 'applied')->count(),
    ];

    $hiredCounts[$industry] = [
      'id' => $industry,
      'label' => $labels[$industry],
      'value' => Application::whereHasMorph('applicationable', [Job::class, Project::class, HourlyJob::class], function ($query) use ($industry) {
        $query->where('industry_type', $industry);
      })->where('status', 'hired')->count()
    ];

    $firedCounts[$industry] = [
      'id' => $industry,
      'label' => $labels[$industry],
      'value' => Application::whereHasMorph('applicationable', [Job::class, Project::class, HourlyJob::class], function ($query) use ($industry) {
        $query->where('industry_type', $industry);
      })->where('status', 'fired')->count()
    ];

    $data[$industry] = [
      'industry' => $industry,
      'jobs' => $jobCount,
      'projects' => $projectCount,
      'hourlyJobs' => $hourlyJobCount,
    ];
    $applicationsCounterByIndustry[$industry] = [
      'id' => $industry,
      'data' => [
        [
          "x" => 'Job Applications',
          "y" => $jobApplications->count(),
        ],
        [
          "x" => 'Project Applications',
          "y" => $projectApplications->count(),
        ],
        [
          "x" => 'Hourly Job Applications',
          "y" => $hourlyJobApplications->count(),
        ]
      ]
    ];
  }

  $totalJobs = Job::count();
  $totalProjects = Project::count();
  $totalHourlyJobs = HourlyJob::count();

  return response()->json([
    'success' => true,
    'data' => $data,
    'total_jobs' => $totalJobs,
    'total_projects' => $totalProjects,
    'total_hourly_jobs' => $totalHourlyJobs,
    'applicationsCounter' => $applicationsCounterByIndustry,
    'applicationsStatus' => [
      'rejected' => $rejectedCounts,
      'shortListed' => $shortlistedCounts,
      'applied' => $appliedCounts,
      'fired' => $firedCounts,
      'hired' => $hiredCounts,
    ]
  ], 200);
});

Route::group(['prefix' => 'auth'], function () {
  Route::post('register', [AuthController::class, 'register']);
  Route::post('logout', [AuthController::class, 'logOut']);
  Route::post('login', [AuthController::class, 'logIn']);
});

Route::group(['prefix' => 'job'], function () {
  Route::get('show', [JobsController::class, 'index']);
  Route::get('homepage', [JobsController::class, 'homepage']);
  Route::get('{id}/show', [JobsController::class, 'showJob']);
  Route::middleware('auth:sanctum')->get('employerJobs', [JobsController::class, 'employer_Jobs']);
  Route::middleware('auth:sanctum')->post('create', [JobsController::class, 'create']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [JobsController::class, 'delete']);
  Route::middleware('auth:sanctum')->put('{id}/update', [JobsController::class, 'update']);
});

Route::group(['prefix' => 'project'], function () {
  Route::get('show', [ProjectController::class, 'index']);
  Route::get('homepage', [ProjectController::class, 'homepage']);
  Route::get('{id}/show', [ProjectController::class, 'showProject']);
  Route::middleware('auth:sanctum')->get('employerProjects', [ProjectController::class, 'employer_Projects']);
  Route::middleware('auth:sanctum')->post('create', [ProjectController::class, 'create']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [ProjectController::class, 'delete']);
  Route::middleware('auth:sanctum')->put('{id}/update', [ProjectController::class, 'update']);
});

Route::group(['prefix' => 'hourlyJob'], function () {
  Route::get('show', [HourlyJobController::class, 'index']);
  Route::get('homepage', [HourlyJobController::class, 'homepage']);
  Route::get('{id}/show', [HourlyJobController::class, 'showHourlyJob']);
  Route::middleware('auth:sanctum')->get('employerHourlyJobs', [HourlyJobController::class, 'employer_hourlyJobs']);
  Route::middleware('auth:sanctum')->post('create', [HourlyJobController::class, 'create']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [HourlyJobController::class, 'delete']);
  Route::middleware('auth:sanctum')->put('{id}/update', [HourlyJobController::class, 'update']);
});

Route::group(['prefix' => 'application'], function () {
  Route::get('{id}/get', [ApplicationController::class, 'instance']);
  Route::middleware('auth:sanctum')->post('create', [ApplicationController::class, 'store']);
  Route::middleware('auth:sanctum')->get('show', [ApplicationController::class, 'index']);
  Route::middleware('auth:sanctum')->get('{id}/show', [ApplicationController::class, 'applicationsForResource']);
  Route::middleware('auth:sanctum')->delete('{id}/delete', [ApplicationController::class, 'delete']);
  Route::middleware('auth:sanctum')->get('resource/{resource_id}', [ApplicationController::class, 'checkApplication']);
  Route::middleware('auth:sanctum')->put('{id}/hire', [ApplicationController::class, 'hireApplicant']);
  Route::middleware('auth:sanctum')->put('{id}/reject', [ApplicationController::class, 'rejectApplicant']);
  Route::middleware('auth:sanctum')->put('{id}/shortList', [ApplicationController::class, 'shortListApplicant']);
  Route::middleware('auth:sanctum')->put('{id}/fire', [ApplicationController::class, 'fireApplicant']);
});

Route::group(['prefix' => 'rating'], function () {
  Route::middleware('auth:sanctum')->post('{id}/create', [RatingController::class, 'store']);
  Route::get('{id}/employer/{employer_id}', [RatingController::class, 'employer_rating_index']);
  Route::get('{id}/show/{employee_id}', [RatingController::class, 'rating_on_application']);
  Route::middleware('auth:sanctum')->get('{id}/asAlreadyRated', [RatingController::class, 'asAlreadyRated']);
  Route::middleware('auth:sanctum')->put('{id}/update', [RatingController::class, 'update']);
  Route::middleware('auth:sanctum')->get('show/ratingEmployee', [RatingController::class, 'rating_Employee']);
});

Route::group(['prefix' => 'notification'], function () {
  Route::middleware('auth:sanctum')->get('notifications', [NotificationController::class, 'notifications']);
  Route::middleware('auth:sanctum')->post('markAllAsRead', [NotificationController::class, 'markAllAsRead']);
  Route::middleware('auth:sanctum')->get('unreadNotifications', [NotificationController::class, 'unreadNotifications']);
});
