<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Admin\Brand;
use App\Models\Admin\Color;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Admin\Product;
use App\Models\Admin\Category;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use Intervention\Image\Facades\Image;

class ProductController extends Controller
{
    public function GetAttributes(Request $request){
        $categories = Category::all();
        $brands     = Brand::all();
        $colors     = Color::all();
        $response = [
            'categories' => $categories,
            'brands' => $brands,
            'colors' => $colors,
        ];
        return response()->json($response, 200);
    }

    public function Index(Request $request){
        $categories = Category::all();
        $brands     = Brand::all();
        $products   = Product::where('status', 0)->filter(request(['s','category','brand']))->paginate((int)request('num'));
        $response = [
            'categories' => $categories,
            'brands' => $brands,
            'products'  => $products, 
        ];
        return response()->json($response, 200);
    }

    public function Store(Request $request){
       $validated = $request->validated();
       $category = Category::where('id', $validated['category_id'])->where('status', 0)->first();
       if($category){
            $product = $category->products()->create([
                "category_id"           => $validated['category_id'],
                "brand_id"              => $validated['brand_id'], 
                "name"                  => $validated['name'], 
                "slug"                  => Str::slug($validated['slug'],"-"), 
                "short_description"     => $validated['short_description'], 
                "description"           => $validated['description'], 
                "meta_title"            => $validated['meta_title'], 
                "meta_keyword"          => $validated['meta_keyword'], 
                "meta_description"      => $validated['meta_description'], 
                "price"                 => $validated['price'], 
                "sell_price"            => $validated['sell_price'], 
                "quantity"              => $validated['quantity'], 
                "trending"              => $request->trending,
                "status"                => $request->status,
                "featureProduct"        => $request->featureProduct,
            ]);

            $img_thumbnail_path = "";
            if($request->image_thumbnail != "" ){
                $strpos = strpos($request->image_thumbnail, ";");
                if($strpos){
                    $base       = substr($request->image_thumbnail, 0, $strpos);
                    $ext_arr    = explode("/", $base);
                    $ext        =  $ext_arr[1];
                    $file       = time()."_thumbnail.".$ext;
                    $link       = public_path()."/uploads/admin/products/thumbnails/";
                    $image      = Image::make($request->image_thumbnail)->resize(300,300);

                    $image->save($link.$file);
                    $img_thumbnail_path = $file;
                }
            }
            $img_gallary = [];
            if(!empty($request->image_gallary)){
                foreach ($request->image_gallary as $key => $gallary) {
                    $gallary = json_decode($gallary, true);
                    $id     = $gallary['id'];
                    $url    = $gallary['url'];

                    if($url != "" ){
                        $strpos = strpos($url, ";");
                        if($strpos){
                            $base       = substr($url, 0, $strpos);
                            $ext_arr    = explode("/", $base);
                            $ext        =  $ext_arr[1];
                            $file       = time()."_gallary_".$id.".".$ext;
                            $link       = public_path()."/uploads/admin/products/gallarys/";
                            $image      = Image::make($url)->resize(300,300);

                            $image->save($link.$file);
                            $img_gallary[$key] = ["id"=>$id, "url"=>$file];
                        }
                    }
                }
            }
            $product->productImage()->createMany([
                [
                    'product_id'        => $product->id,
                    'image_thumbnail'   => $img_thumbnail_path,
                    'image_gallary'     => json_encode($img_gallary),
                ]
            ]);
            $colors = [];    
            if(!empty($request->colors)){
                foreach ($request->colors as $key => $color) {
                    if(!empty($color)){
                        $color = json_decode($color, true);
                        $color[$key]['product_id'] = $product->id;
                        $colors[$key]['color_id'] = $color['color_id'];
                        $colors[$key]['product_color_qty'] = $color['color_qty'];
                    }
                }
            }
            $product->productColor()->createMany($colors);
            $response = [
                'message' => 'New product created successfully', 
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
        $categories = Category::all();
        $brands     = Brand::all();
        $product = Product::where('id', $id)->first();
        if($product){
            $product_color = $product->productColor->pluck('color_id')->toArray();
            $remain_color = Color::where('status', 0)->whereNotIn('id',$product_color)->get();
            $response = [
                'categories' => $categories,
                'brands' => $brands,
                'product' => $product,
                'remain_color' => $remain_color,
            ];
            return response()->json($response, 202);
        }else{
            $response = [
               'error' => 'No Product found',
            ];
            return response()->json($response, 404);
        }
    }

    public function Edit(ProductRequest $request, $id){
        $validated = $request->validated();
        $category = Category::where('id', $validated['category_id'])->where('status', 0)->first();
        if($category){
            $product = $category->products()->findOrFail($id);
            if($product){
                $product->category_id           = $validated['category_id'];
                $product->brand_id              = $validated['brand_id'];
                $product->name                  = $validated['name']; 
                $product->slug                  = Str::slug($validated['slug'],"-"); 
                $product->short_description     = $validated['short_description']; 
                $product->description           = $validated['description']; 
                $product->meta_title            = $validated['meta_title']; 
                $product->meta_keyword          = $validated['meta_keyword']; 
                $product->meta_description      = $validated['meta_description']; 
                $product->price                 = $validated['price'];
                $product->sell_price            = $validated['sell_price']; 
                $product->quantity              = $validated['quantity'];
                $product->trending              = $request->trending;
                $product->status                = $request->status;
                $product->featureProduct        = $request->featureProduct;
                $product->save();
                $product_image  = $product->productImage;
                if($product_image){
                        if($request->image_thumbnail != "" ){
                            $strpos = strpos($request->image_thumbnail, ";");
                            if($strpos){
                                $base       = substr($request->image_thumbnail, 0, $strpos);
                                $ext_arr    = explode("/", $base);
                                $ext        =  $ext_arr[1];
                                $file       = time()."_thumbnail.".$ext;
                                $link       = public_path()."/uploads/admin/products/thumbnails/";
                                $image      = Image::make($request->image_thumbnail)->resize(300,300);
                                if($product_image->image_thumbnail){
                                    if(file_exists($link.$product_image->image_thumbnail)){
                                        unlink($link.$product_image->image_thumbnail);    
                                    };
                                }
                                $image->save($link.$file);
                                $product->productImage()->update([
                                    "image_thumbnail" => $file
                                ]);
                            }
                        }
                        if(!empty($request->image_gallaries)){
                            $link = public_path()."/uploads/admin/products/gallarys/";
                            $exist_ids   = [];
                            $exist_gallaries = [];
                            if($product_image->image_gallary){
                                $exist_gallaries = json_decode($product_image->image_gallary, true);
                                if(!empty($exist_gallaries)){
                                    $exist_ids        = array_column($exist_gallaries, 'id');
                                }  
                            };                           
                            $new_ids = [];
                            $update_galaries = [];
                            foreach ($request->image_gallaries as $key => $image){ 
                                $update_galaries[] = json_decode( $image, true );
                            };
                            if(!empty($update_galaries)){
                                $new_ids  = array_column($update_galaries, 'id'); 
                            }                          
                            if(count($exist_ids) > count($new_ids)){
                            foreach($exist_gallaries as $key => $gallary){
                                if(!in_array($gallary['id'], $new_ids)){
                                    unset($exist_gallaries[$key]);
                                    if(file_exists($link.$gallary['url'])){
                                        unlink($link.$gallary['url']);    
                                    };
                                }
                            }
                            }else if(count($exist_ids) < count($new_ids)){
                                foreach( $update_galaries as $key => $gallary){
                                    if(!in_array($gallary['id'], $exist_ids)){
                                        if($gallary['url'] != "" ){
                                            $strpos = strpos($gallary['url'], ";");
                                            if($strpos){
                                                $base       = substr($gallary['url'], 0, $strpos);
                                                $ext_arr    = explode("/", $base);
                                                $ext        =  $ext_arr[1];
                                                $file       = time()."_gallary_".$gallary['id'].".".$ext;
                                                $image      = Image::make($gallary['url'])->resize(300,300);
                                                $image->save($link.$file);
                                            array_push( $exist_gallaries,["id"=>$gallary['id'], "url"=>$file] );

                                                unset($update_galaries[$key]);
                                            }
                                        }
                                    }
                                }
                            }
                            foreach($update_galaries as $key => $update_gallary){
                                $id     = $update_gallary['id'];
                                $url    = $update_gallary['url'];
                                if($url != "" ){
                                    $strpos = strpos($url, ";");
                                    if($strpos){
                                        $base       = substr($url, 0, $strpos);
                                        $ext_arr    = explode("/", $base);
                                        $ext        =  $ext_arr[1];
                                        $file       = time()."_gallary_".$id.".".$ext;
                                        $image      = Image::make($url)->resize(300,300);

                                        foreach($exist_gallaries as $key => $exist_gallary){
                                            if($exist_gallary['id'] == $id){
                                                if(file_exists($link.$exist_gallary['url'])){
                                                    unlink($link.$exist_gallary['url']);
                                                }
                                                $exist_gallaries[$key]['url'] = $file;
                                            }
                                        }
                                        $image->save($link.$file);
                                    }
                                }
                            }
                            foreach($exist_gallaries as $key => $exist_gallary){
                                $exist_gallaries[$key]['id'] = (int)$key + 1;
                            }
                            $product->productImage()->update([
                                "image_gallary" => json_encode($exist_gallaries)
                            ]);
                        }
                    
                }else{
                    $img_thumbnail_path = "";
                    if($request->image_thumbnail != "" ){
                        $strpos = strpos($request->image_thumbnail, ";");
                        if($strpos){
                            $base       = substr($request->image_thumbnail, 0, $strpos);
                            $ext_arr    = explode("/", $base);
                            $ext        =  $ext_arr[1];
                            $file       = time()."_thumbnail.".$ext;
                            $link       = public_path()."/uploads/admin/products/thumbnails/";
                            $image      = Image::make($request->image_thumbnail)->resize(300,300);
        
                            $image->save($link.$file);
                            $img_thumbnail_path = $file;
                        }
                    }
        
                    $img_gallary = [];
                    if(!empty($request->image_gallaries)){
                        foreach ($request->image_gallaries as $key => $gallary) {
                            $gallary = json_decode($gallary, true);
                            $id     = $gallary['id'];
                            $url    = $gallary['url'];
        
                            if($url != "" ){
                                $strpos = strpos($url, ";");
                                if($strpos){
                                    $base       = substr($url, 0, $strpos);
                                    $ext_arr    = explode("/", $base);
                                    $ext        =  $ext_arr[1];
                                    $file       = time()."_gallary_".$id.".".$ext;
                                    $link       = public_path()."/uploads/admin/products/gallarys/";
                                    $image      = Image::make($url)->resize(300,300);
        
                                    $image->save($link.$file);
                                    $img_gallary[$key] = ["id"=>$id, "url"=>$file];
                                }
                            }
                        }
                    }
        
                    $product->productImage()->createMany([
                        [
                            'product_id'        => $product->id,
                            'image_thumbnail'   => $img_thumbnail_path,
                            'image_gallary'     => json_encode($img_gallary),
                        ]
                    ]);  
                }
                $product_colors  = $product->productColor;
                if(count($product_colors) > 0) { 
                    $exist_pids = $product_colors->pluck('id')->toArray();
                    $update_pcs = [];
                    $update_pid = [];
                    if(!empty($request->color_products)){
                        foreach ($request->color_products as $key => $color_product){
                            $update_pcs[] = json_decode($color_product, true);
                            $update_pid[$key] = $update_pcs[$key]['id'];
                        }

                    }
                
                    foreach($exist_pids as $exist_pid){
                        if(!in_array($exist_pid,$update_pid)){
                            $product->productColor()->where('id',$exist_pid)->delete();
                        }else{
                            foreach($update_pcs as $key => $update_pc){
                                if($update_pc['id'] == $exist_pid){
                                    $product->productColor()->where('id',$exist_pid)->update([
                                        'product_color_qty' => $update_pcs[$key]['product_color_qty']
                                    ]);    
                                }
                            }
                            
                        }
                    }

                    $pr_color = [];
                    $count = 0;
                    foreach ($update_pcs as $key => $update_pc) {
                        if($update_pc['id'] == null){
                            $pr_color[$count]['product_id']           = $product->id;
                            $pr_color[$count]['color_id']             = $update_pc['color_id'];
                            $pr_color[$count]['product_color_qty']    = $update_pc['product_color_qty']; 
                            $count += 1;
                        }
                    }

                    if(!empty($pr_color)){
                        $product->productColor()->createMany($pr_color);
                    }  
                    
                }else{
                    $colors = [];    
                    if(!empty($request->color_products)){
                        foreach ($request->color_products as $key => $color_product) {
                            $color_product = json_decode($color_product, true);
                            if(!empty($color_product)){
                                $colors[$key]['product_id'] = $product->id;
                                $colors[$key]['color_id'] = $color_product['color_id'];
                                $colors[$key]['product_color_qty'] = $color_product['product_color_qty'];
                            }
                        }
                    }
        
                    $product->productColor()->createMany($colors);
                }
                $response = [
                    'message' => 'New product created successfully', 
                    'product' =>  $product,
                ];
                return response()->json($response, 201); 
            
        }else{
            $response = [
                'error' => 'No Product found', 
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
        $product = Product::findOrFail($id);
        if($product){
            $product_imgs = $product->productImage;
            if(!empty($product_imgs)){
                foreach($product_imgs as $product_img){
                    if($product_img->image_thumbnail){
                        $link = public_path()."/uploads/admin/products/thumbnails";
                        if(file_exists($link.$product_img->image_thumbnail)){
                            unlink($link.$product_img->image_thumbnail);
                        }
                    }
                    $gallaries = json_decode($product_img->image_gallary,true);
                    foreach($gallaries as $key => $gallary){
                        if($gallary['url']){
                            $link = public_path()."/uploads/admin/products/gallarys";
                            if(file_exists($link.$gallary['url'])){
                                unlink($link.$gallary['url']);
                            }
                        }
                    }
                }
                $product->productImage()->delete();
            }
            $product_colors  = $product->productColor;
            if(!empty($product_colors)){
                foreach($product_colors as $product_color){
                    $product->productColor()->findOrFail($product_color->id)->delete();
                }
            }
            $product->delete();
            return response()->json('', 204);
        }else{
            $response = [
                'error' => 'No Product found', 
            ];
            return response()->json($response, 404);
        }
        
    }

}
