<?php

namespace App\Http\Controllers\API\Auth;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordMailable;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{

    public function forgotPassword(Request $request){

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $exist_token = DB::table('password_reset_tokens')->where('email', '=' , $validated['email'])->exists();
        if($exist_token){
            $response = [
                'error' => 'Reset Password Link already sent to '. $validated['email'],
            ];
            return response()->json($response, 500);
        }

        $token = Str::random(60);
        DB::table('password_reset_tokens')->insert([
            'email' => $validated['email'],
            'token' => $token,
            'created_at' => Carbon::now(),
        ]);

        try {
            
            $data = ['email' => $validated['email'],'token' => $token];
            $data = (object)$data;

            Mail::mailer('smtp')->to($validated['email'])->send( new ForgotPasswordMailable($data));

            $response = [
                'message' => "Reset Password Link just sent to " . $validated['email'],
            ];
            return response()->json($response, 201);

        } catch (\Exception $error) {

            DB::table('password_reset_tokens')->where([ ['email','=' ,$validated['email']], ['token','=' , $token] ])->delete();

            $response = [
                'error' => 'Can not send Reset Password Link to '. $validated['email'],
            ];
            return response()->json($response, 500);

        }

    }

    public function resetPassword(Request $request){
        
        $validated = $request->validate([
            'email'     => 'required|email|exists:users,email',
            'token'     => 'required|string',
            'password'  => 'required|string|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $checked_reset_password = DB::table('password_reset_tokens')->where([ ['email','=' ,$validated['email']], ['token','=' , $validated['token']] ])->first();

        if(!$checked_reset_password){
            
            $response = [
                'error' => 'Invalid Token',
            ];
            return response()->json($response, 500);

        }else{

            $now = Carbon::now();
            $last = $checked_reset_password->created_at;
            $sent_link_time = $now->diffInMinutes($last);

            if($sent_link_time > 30){

                DB::table('password_reset_tokens')->where([ ['email','=' ,$validated['email']], ['token','=' , $validated['token']] ])->delete();
        
                $response = [
                    'error' => 'Invalid/Expired Link',
                ];
                return response()->json($response, 500);
            }

            $user = User::where('email', ' = ', $validated['email'])->update([
                'password' => bcrypt($validated['password'])
            ]);

            DB::table('password_reset_tokens')->where([ ['email','=' ,$validated['email']], ['token','=' , $validated['token']] ])->delete();

            $response = [
                'message' => "Your password has been changed!",
            ];
            return response()->json($response, 202);
        }
    }
    

}
