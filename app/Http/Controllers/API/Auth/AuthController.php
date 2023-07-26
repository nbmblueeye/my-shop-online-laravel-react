<?php

namespace App\Http\Controllers\API\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\VerificationMailable;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function signUp(SignupRequest $request){

        $validated = $request->validated();
        $user = User::create([
              'name' => $validated['name'],
              'email' => $validated['email'],
              'hasRole' => 'user',
              'password' => bcrypt($validated['password']),
        ]);
        if($user){
            try {
        
                $token = $user->createToken($validated['email']."_Token", [''])->plainTextToken;
                Mail::mailer('smtp')
                        ->to($user->email)
                        ->send(new VerificationMailable($user));

                $response = [
                    'message' => "Verification email just sent to " . $user->email
                ];
                return response()->json($response, 201);

            } catch (\Exception $error) {

                $user->delete();
                $response = [
                    'error' => 'Can not send verification email',
                ];
                return response()->json($response, 500);
            }
        }

    }

    public function logIn(LoginRequest $request){

        $credential = $request->validated();
        
        if (!Auth::attempt($credential)) {
            $response = [
                'error' => 'The provided credentials are incorrect.'
            ];
            return response()->json($response, 401);
        }

        $user = Auth::user();

        if(!$user->email_verified_at){
            $response = [
                'error' => 'Your email must be verified first.'
            ];
            return response()->json($response, 403);
        }

        if($user->hasRole == 'user'){
            $token = $user->createToken($credential['email']."_Token", [''])->plainTextToken;
        }else if($user->hasRole == 'admin'){
            $token = $user->createToken($credential['email']."_AdminToken", ['server:admin'])->plainTextToken;
        }
        
        $response = [
            'token' => $token,
            'user' => $user,
        ];
        return response()->json($response, 201);
    }

    public function logOut(Request $request){

        $request->user()->currentAccessToken()->delete();

        return response()->json("", 204);

    }
}
