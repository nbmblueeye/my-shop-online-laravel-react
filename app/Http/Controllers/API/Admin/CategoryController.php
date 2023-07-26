<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Admin\Category;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{

    public function Index(Request $request){

        $categories = Category::latest()->get();

        $response = [
            'categories' => $categories,
        ];
        return response()->json($response, 200);

    }
    
    public function Store(CategoryRequest $request){

        $validated = $request->validated();
        $img_path = "";
        if($validated['image'] != "" ){
            $strpos = strpos($validated['image'], ";");
            if($strpos){
                $base       = substr($validated['image'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time().".".$ext;
                $link       = public_path()."/uploads/admin/categories/";
                $image      = Image::make($validated['image'])->resize(300,300);

                $image->save($link.$file);
                $img_path = $file;
            }
        }
        $category = Category::create([

            "name" => $validated['name'],
            "slug" => Str::slug($validated['slug'],"-"),
            "description" => $validated['description'],
            'image' => $img_path,
            "meta_title" => $validated['meta_title'],
            "meta_keyword" => $validated['meta_keyword'],
            "meta_description" => $validated['meta_description'],
            "status" => $request->status,
        ]);

        $response = [
            'message' => 'New Category was added successfully',
            'category' => $category,
        ];
        return response()->json($response, 201);
    }

    public function Show($id, Request $request){

        $category = Category::findOrFail($id);
        $response = [
            'categories' => $category,
        ];
        return response()->json($response, 202);
    }

    public function Edit($id, CategoryRequest $request){

        $validated = $request->validated();

        $category = Category::findOrFail($id);
        $category->name = $validated['name'];
        $category->slug = Str::slug($validated['slug'],"-");
        $category->description = $validated['description'];
        $category->meta_title = $validated['meta_title'];
        $category->meta_keyword = $validated['meta_keyword'];
        $category->meta_description = $validated['meta_description'];
        $category->status = $request->status;

        if($validated['image'] != "" ){
            $strpos = strpos($validated['image'], ";");
            if($strpos){
                $base       = substr($validated['image'], 0, $strpos);
                $ext_arr    = explode("/", $base);
                $ext        =  $ext_arr[1];
                $file       = time().".".$ext;
                $link       = public_path()."/uploads/admin/categories/";
                $image      = Image::make($validated['image'])->resize(300,300);

                if($category->image){
                    if(!empty($category->image)){
                        if(file_exists($link.$category->image)){
                            unlink($link.$category->image);
                        }
                    }
                }
                
                $image->save($link.$file);
                $category->image = $file;
            }
        }

        $category->save();
        $response = [
            'message' => 'Current Category was updated successfully',
            'category' => $category,
        ];
        return response()->json($response, 202);
    }

    public function Delete($id){

        $category = Category::findOrFail($id);

        if(!empty($category->image)){
            $link   = public_path()."/uploads/admin/categories/";
            if(file_exists($link.$category->image)){
                unlink($link.$category->image);
            }
        }

        $category->delete();
        return response()->json('', 204);

    }

}
