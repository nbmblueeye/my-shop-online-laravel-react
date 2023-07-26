<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class VerifyEmailController extends Controller
{
    public function verify( Request $request, $id){

        if(!$request->hasValidSignature(false)){

            $response = [
                'error' => 'Invalid/Expired verification Link.',
            ];
            return response()->json($response, 403);

        }else{

            $user = User::findOrFail($id);
            
            if(!$user->hasVerifiedEmail()){

                $user->markEmailAsVerified();

                $response = [
                    'message' => 'Email is verified successfully',
                ];
                return response()->json($response, 200);

            }else{

                $response = [
                    'warning' => 'Email was verified ',
                ];
                return response()->json($response, 500);
            }
        }
    }

}
