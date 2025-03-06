<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
  public function register(Request $request)
  {
    $validData = Validator::make($request->all(), [
      'name' => 'required|string',
      'email' => 'required|string|email|unique:users',
      'password' => 'required|string|min:6|confirmed'
    ]);

    if ($validData->fails()) {
      return response()->json(['success' => false, 'error' => $validData->errors()], 422);
    }

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => bcrypt($request->password),
    ]);

    return response()->json(['success' => true, 'message' => 'Account Created Successfully'], 201);
  }
  public function logIn(Request $request)
  {
    $credentials = $request->only('email', 'password');
    if (Auth::attempt($credentials)) {
      $user = Auth::user();

      $token = $user->createToken('AuthToken')->plainTextToken;
      return response()->json(['success' => true, 'token' => $token, 'user' => $user], 200);
    } else
      return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
  }
  public function logOut(Request $request)
  {
    $request->user()->tokens()->delete();
    return response()->json(['success' => true, 'message' => "Logged Out Successfully"]);
  }
}
