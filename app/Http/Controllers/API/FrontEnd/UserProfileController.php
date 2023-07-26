<?php

namespace App\Http\Controllers\API\FrontEnd;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\Facades\Image;

class UserProfileController extends Controller
{
    public function Index(){

        if(auth('sanctum')->check()){

            $user = User::find(Auth::user()->id);
            $response = [
                'data' => $user,
            ];

            return response()->json($response, 201);

        }else{
            return response()->json("", 401); 
        }

    }

    public function Edit(Request $request){

        if(auth('sanctum')->check()){

            $validated = $request->validate([
                'name'      => 'required|string',
                'email'     => 'required|email',
                'avatar'    => 'nullable',
                'phone'     => 'required|digits:10',
                'pin_code'  => 'required|digits:6',
                'address'   => 'required|string|max:500',
            ]);

            $user = User::find(Auth::user()->id);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
        
            if($validated['avatar'] != "" ){

                $strpos = strpos($validated['avatar'], ";");
                if($strpos){
                    $base       = substr($validated['avatar'], 0, $strpos);
                    $ext_arr    = explode("/", $base);
                    $ext        =  $ext_arr[1];
                    $file       = time()."-".$validated['name'].".".$ext;
                    $link       = public_path()."/uploads/admin/users/";
                    $image      = Image::make($validated['avatar'])->resize(300,300);
    
                    if(!empty($user->avatar)){
                        if(file_exists($link.$user->avatar)){
                            unlink($link.$user->avatar);    
                        };
                    }
                
                    $image->save($link.$file);
                    $user->avatar = $file;
                }

            }

            $user->save();

            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                ['phone'  => $validated['phone'], 'pin_code'  => $validated['pin_code'], 'address'  => $validated['address']],
            );
          
            $response = [
                'message'   => 'Your Profile has been updated',
                'user'      => $user,
            ];
            return response()->json($response, 202);

        }else{
            return response()->json("", 401); 
        }
    }

    public function ChangePassword(Request $request){

        if(auth('sanctum')->check()){

             $validated = $request->validate([
                'currentPassword'   => 'required',
                'password'          => ['required', 'confirmed'],
            ]);

            if (! Hash::check($validated['currentPassword'], auth('sanctum')->user()->password)) {
                $response = [
                    'error' => 'Current password is incorrect',
                ];
                return response()->json($response, 406);
            }else{

                $user = User::findOrFail(auth()->user()->id);
                $user->update([
                    'password' => bcrypt($validated['password']),
                ]);

                $response = [
                    'message' => 'Your Password has been updated',
                ];
                return response()->json($response, 202);

            }

        }else{
            $response = [
                'error' => 'Please login first',
            ];
            return response()->json($response, 401); 
        }

    }
}
