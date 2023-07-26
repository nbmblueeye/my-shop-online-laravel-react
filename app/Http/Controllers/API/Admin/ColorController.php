<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Admin\Color;
use Illuminate\Http\Request;
use App\Http\Requests\ColorRequest;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;

class ColorController extends Controller
{
    public function Index(Request $request){

        $colors = Color::latest()->get();
        $response = [
            'colors' => $colors,
        ];
        return response()->json($response, 200);
    }

    public function Store(ColorRequest $request){

        $validated = $request->validated();
        
        $img_path = "";
        if($validated['image'] != "" ){
            $strpos = strpos($validated['image'], ";");
            if($strpos){
                $base       = substr($validated['image'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time().".".$ext;
                $link       = public_path()."/uploads/admin/colors/";
                $image      = Image::make($validated['image'])->resize(300,300);

                $image->save($link.$file);
                $img_path = $file;
            }
        }
        $color = Color::create([
            "name" => $validated['name'],
            "color_code" => $validated['color_code'],
            'image' => $img_path,
            "status" => $request->status,
        ]);

        $response = [
            'message' => 'New Color was added successfully',
            'color' =>  $color,
        ];
        return response()->json($response, 201);
    }

    public function Show($id){

        $color = Color::findOrFail($id);
        $response = [
            'colors' => $color,
        ];
        return response()->json($response, 202);
    }

    public function Edit($id, ColorRequest $request){

        $validated = $request->validated();
        $color = Color::findOrFail($id);

        $color->name        = $validated['name'];
        $color->color_code  = $validated['color_code'];
        $color->status      = $request->status;

        if($validated['image'] != "" ){
            $strpos = strpos($validated['image'], ";");
            if($strpos){
                $base       = substr($validated['image'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time().".".$ext;
                $link       = public_path()."/uploads/admin/colors/";
                $image      = Image::make($validated['image'])->resize(300,300);

                if($color->image){
                    if(file_exists($link.$color->image)){
                        unlink($link.$color->image);    
                    };
                }
               
                $image->save($link.$file);
                $color->image = $file;
            }
        }

        $color->save();
        $response = [
            'message' => 'Current Color was updated successfully',
            'color' => $color,
        ];
        return response()->json($response, 202);

    }

    public function Delete($id){

        $color = Color::findOrFail($id);
        
        if($color->image){
            $link = public_path()."/uploads/admin/colors/";
            if(file_exists($link.$color->image)){
                unlink($link.$color->image);
            }
        }
        $color->delete();
        return response()->json('', 204);
    }


}
