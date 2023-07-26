<?php

namespace App\Http\Controllers\API\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;
use App\Http\Requests\UserEditRequest;

class UserController extends Controller
{
    public function Index(){

        $users = User::all();
        
        $response = [
            'users' => $users,
        ];
        return response()->json($response, 200);
    }

    public function Show($user_id){

        $user = User::find($user_id);
        $response = [
            'data' => $user,
        ];
        return response()->json($response, 200);

    }

    public function Store(UserRequest $request){

        $validated = $request->validated();
        $avatar = "";

        if(!empty($validated['avatar'])){

            $strpos = strpos($validated['avatar'], ";");
            if($strpos){
                $base       = substr($validated['avatar'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time()."-".$validated['name'].".".$ext;
                $link       = public_path()."/uploads/admin/users/";
                $image      = Image::make($validated['avatar'])->resize(300,300);

                $image->save($link.$file);
                $avatar = $file;
            }

        }

        $user = User::create([

            'name' => $validated['name'],
            'email' => $validated['email'],
            'hasRole' => $validated['hasRole'],
            'password' => bcrypt($validated['password']),
            'avatar'   => $avatar,

        ]);

        $response = [
            'message' => 'New User is created successfully',
        ];
        return response()->json($response, 201);

    }

    public function Edit($user_id, UserEditRequest $request){

        $validated = $request->validated();

        $user = User::find($user_id);
        if($user){

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->hasRole = $validated['hasRole'];

            if(!empty($validated['password'])){
                $user->password = bcrypt($validated['password']);
            }
            
            if($validated['avatar'] != "" ){
                $strpos = strpos($validated['avatar'], ";");
                if($strpos){
                    $base       = substr($validated['avatar'], 0, $strpos);
                    $ext_arr    = explode("/", $base);
                    $ext        =  $ext_arr[1];
                    $file       = time()."-".$validated['name'].".".$ext;
                    $link       = public_path()."/uploads/admin/users/";
                    $image      = Image::make($validated['avatar'])->resize(300,300);
    
                    if($user->avatar){
                        if(file_exists($link.$user->avatar)){
                            unlink($link.$user->avatar);    
                        };
                    }
                
                    $image->save($link.$file);
                    $user->avatar = $file;
                }
            }

            $user->save();
            $response = [
                'message' => 'Current User was updated successfully',
            ];
            return response()->json($response, 202);

        }else{

            $response = [
                'error' => 'User not found',
            ];
            return response()->json($response, 404);

        }
    }

    public function Delete($user_id){

        $user = User::find($user_id);
        if(!empty($user)){

            $user->delete();
            return response()->json("", 204);
            
        }else{
            $response = [
                'error' => 'User not found',
            ];
            return response()->json($response, 404);
        }

    }
}
