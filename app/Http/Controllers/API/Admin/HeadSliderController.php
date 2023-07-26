<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use App\Models\Admin\HeadSlider;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;
use App\Http\Requests\HeadSliderRequest;

class HeadSliderController extends Controller
{
    public function Index(Request $request){
        
        $sliders = HeadSlider::latest()->get();

        $response = [
            'sliders' => $sliders,
        ];
        return response()->json($response, 201);

    }
    
    public function Store(HeadSliderRequest $request){

        $validated = $request->validated();

        $img_path = "";
        if($validated['image'] != "" ){
            $strpos = strpos($validated['image'], ";");
            if($strpos){
                $base       = substr($validated['image'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time()."_h_slider.".$ext;
                $link       = public_path()."/uploads/admin/headsliders/";
                $image      = Image::make($validated['image'])->resize(1000,300);

                $image->save($link.$file);
                $img_path = $file;
            }
        }
        
        $slider = HeadSlider::create([
            "title" => $validated['title'],
            "sub_title" => $validated['sub_title'],
            "message" => $validated['message'],
            'image' => $img_path,
        ]);

        $response = [
            'message' => 'New Slider was added successfully',
            'slider' => $slider,
        ];
        return response()->json($response, 201);
    }

    public function Show($id){

        $slider = HeadSlider::findOrFail($id);
        $response = [
            'slider' => $slider,
        ];
        return response()->json($response, 202);
    }

    public function Edit($id, HeadSliderRequest $request){

        $validated = $request->validated();
        $slider = HeadSlider::findOrFail($id);

        $slider->title      = $validated['title'];
        $slider->sub_title  = $validated['sub_title'];
        $slider->message    = $validated['message'];
        
        if($validated['image'] != "" ){
            $strpos = strpos($validated['image'], ";");
            if($strpos){
                $base       = substr($validated['image'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time()."_h_slider.".$ext;
                $link       = public_path()."/uploads/admin/headsliders/";
                $image      = Image::make($validated['image'])->resize(1000,300);

                if($slider->image){
                    if(file_exists($link.$slider->image)){
                        unlink($link.$slider->image);    
                    };
                }
               
                $image->save($link.$file);
                $slider->image = $file;
            }
        }

        $slider->save();

        $response = [
            'message' => 'Current Slider was updated successfully',
            'slider' =>  $slider,
        ];
        return response()->json($response, 202);

    }

    public function Delete($id){

        $slider = HeadSlider::findOrFail($id);
        
        if($slider->image){
            $link = public_path()."/uploads/admin/headsliders/";
            if(file_exists($link.$slider->image)){
                unlink($link.$slider->image);
            }
        }
        $slider->delete();
        return response()->json('', 204);
    }

}
