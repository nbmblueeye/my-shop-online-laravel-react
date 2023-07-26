<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Admin\Brand;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Admin\Category;
use App\Http\Requests\BrandRequest;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;

class BrandController extends Controller
{

    public function Index(Request $request){

        $brands = Brand::latest()->get();
        
        $response = [
            'brands' => $brands,
        ];
        return response()->json($response, 200);

    }

    public function Store(BrandRequest $request){

        $validated = $request->validated();

        $category = Category::findOrFail($request->category_id);
        if($category){
                $img_path = "";
                if($validated['image'] != "" ){
                    $strpos = strpos($validated['image'], ";");
                    if($strpos){
                        $base       = substr($validated['image'], 0, $strpos);
                        $ext_arr    = explode("/", $base);
                        $ext        =  $ext_arr[1];
                        $file       = time().".".$ext;
                        $link       = public_path()."/uploads/admin/brands/";
                        $image      = Image::make($validated['image'])->resize(300,300);

                        $image->save($link.$file);
                        $img_path = $file;
                    }
                }
                $brand = $category->brands()->createMany([
                    [
                        "category_id" => $request->category_id,
                        "name" => $validated['name'],
                        "slug" => Str::slug($validated['slug'],"-"),
                        "description" => $validated['description'],
                        'image' => $img_path,
                        "status" => $request->status,
                    ]
                ]);

                $response = [
                    'message' => 'New Brand was added successfully',
                    'brand' => $brand,
                ];
                return response()->json($response, 201);
        }else{

            $response = [
                'error' => 'No category found', 
            ];
    
            return response()->json($response, 404);
        }
    
    }

    public function Show($id){

        $categories = Category::latest()->get();
        $brand = Brand::findOrFail($id);

        $response = [
            'brands' => $brand,
            'categories' => $categories,
        ];
        return response()->json($response, 202);
    }

    public function Edit($id, BrandRequest $request){

        $validated = $request->validated();
        $category = Category::where('id', $validated['category_id'])->where('status', 0)->first();
    
        if($category){

            $brand = $category->brands()->where("id", $id)->first();

            if($brand){

                $brand->category_id = $request->category_id;
                $brand->name = $validated['name'];
                $brand->slug = Str::slug($validated['slug'],"-");
                $brand->description = $validated['description'];
                $brand->status = $request->status;
    
                if($validated['image'] != "" ){
                    $strpos = strpos($validated['image'], ";");
                    if($strpos){
                        $base       = substr($validated['image'], 0, $strpos);
                        $ext_arr    = explode("/", $base);
                        $ext        =  $ext_arr[1];
                        $file       = time().".".$ext;
                        $link       = public_path()."/uploads/admin/brands/";
                        $image      = Image::make($validated['image'])->resize(300,300);
        
                        if($brand->image){
                            if(file_exists($link.$brand->image)){
                                unlink($link.$brand->image);    
                            };
                        }
                    
                        $image->save($link.$file);
                        $brand->image = $file;
                    }
                }
    
                $brand->save();
                $response = [
                    'message' => 'Current Brand was updated successfully',
                    'brand' => $brand,
                ];
                return response()->json($response, 202);

            }else{
                $response = [
                    'error' => 'No Brand found', 
                ];
                return response()->json($response, 404);
            }
        }else{
            $response = [
                'error' => 'No Category found', 
            ];
            return response()->json($response, 404);
        }

    }

    public function Delete($id){

        $brand = Brand::findOrFail($id);
        
        if($brand->image){
            $link = public_path()."/uploads/admin/brands/";
            if(file_exists($link.$brand->image)){
                unlink($link.$brand->image);
            }
        }
        $brand->delete();
        return response()->json('', 204);
    }

}
