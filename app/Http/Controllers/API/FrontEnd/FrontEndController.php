<?php

namespace App\Http\Controllers\API\FrontEnd;

use App\Models\Admin\Brand;
use Illuminate\Http\Request;
use App\Models\Admin\Product;
use App\Models\Admin\Category;
use App\Models\FrontEnd\Order;
use App\Models\Admin\HeadSlider;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;

class FrontEndController extends Controller
{
    public function Index(Request $request){
        $sliders        = HeadSlider::latest()->select('title', 'sub_title','message','image')->get();
        $categories     = Category::latest()->select('name', 'slug', 'image')->get();
        $newarrivals    = Product::latest()->select( 'id','category_id', 'brand_id', 'name', 'slug', 'price', 'sell_price')->take(8)->get();
        $trendings      = Product::where('trending', '=', 0)->select( 'id','category_id', 'brand_id', 'name', 'slug', 'price', 'sell_price')->take(8)->get();
        $features       = Product::where('featureProduct', '=', 0)->select( 'id','category_id', 'brand_id', 'name', 'slug', 'price', 'sell_price')->take(8)->get();  
        $response = [
            'sliders'       => $sliders,
            'categories'    => $categories,
            'newArrivals'   => $newarrivals,
            'trendings'     => $trendings,
            'features'      => $features,
        ];
        return response()->json($response, 200);
    }

    public function Archive(Request $request){
        $brands     = Brand::latest()->select('category_id','name', 'slug', 'image')->get();
        $categories = Category::latest()->select('id', 'name', 'image')->get();
        $response = [
            'brands' => $brands,
            'categories' => $categories,
        ];
        return response()->json($response, 200); 
    }

    public function Brand(Request $request, $slug){
        $brand = Brand::where('slug' , $slug)->where('status', 0)->first();
        $category =  $brand->category()->select('meta_title', 'meta_keyword', 'meta_description')->first();
        if($brand){
            $products = $brand->products()->filter(request(['brand_id', 'price_mode']))->get();
            $response = [
                'category' => $category,
                'products' =>  $products,
            ];
            return response()->json($response, 200); 
        }else{
            $response = [
                'error' => 'Brand with name = '.$brand->name.' not found', 
            ];
            return response()->json($response, 404);
        }
    }

    public function Category(Request $request, $slug){
        $category = Category::where('slug' , $slug)->where('status', 0)->select('meta_title', 'meta_keyword', 'meta_description')->first();
        if($category){
            $products   = $category->products()->filter(request(['brand_id', 'price_mode']))->select('id','category_id', 'brand_id', 'name', 'slug','price', 'sell_price')->get();
            $brands     = $category->brands()->select('id', 'name')->get();
            $response = [
                'category' => $category,
                'brands' => $brands, 
                'products' =>  $products,
            ];
            return response()->json($response, 200); 
        }else{
            $response = [
                'error' => 'No Category were found', 
            ];
            return response()->json($response, 404);
        }
    }

    public function Product($category, $brand, $id){
        $category = Category::where('slug' , $category)->where('status', 0)->first();
        if($category){
            $brand = $category->brands()->where('slug', $brand)->where('status', 0)->first();
            if($brand){
                $product = $brand->products()->where('id',$id)->where('status', 0)->first();
                $related_products = $brand->products()->where('status', 0)->get();
                $response = [
                    'product'           => $product,
                    'related_products'   => $related_products,
                ];
                return response()->json($response, 200); 
            }else{
                $response = [
                    'error' => 'No Brand found', 
                ];
                return response()->json($response, 404);
            }
        }else{
            $response = [
                'error' => 'No Category were found', 
            ];
            return response()->json($response, 404);
        }
    }

    public function Orders(Request $request){
        if(auth('sanctum')->check()){
            $user_id = auth('sanctum')->user()->id;
            $orders = Order::where('user_id', $user_id)->latest()->get();
            $response = [
                'orders' => $orders,
            ];
            return response()->json($response, 201);
        }else{
            return response()->json("", 401); 
        }
    }

    public function Order(Request $request, $id){
        $order = Order::findOrFail($id);
        $orderItems = $order->orderItems;
        $response = [
            'order' => $order,
            'orderItems' => $orderItems,
        ];
        return response()->json($response, 201);
    }

    public function NewArrivals( Request $request ){
        $getNewArrival    = Product::latest()->take(16)->get();
        $cate_id        = $getNewArrival->pluck('category_id')->toArray();
        $categories     = Category::where('status', 0)->whereIn('id', $cate_id)->select('id', 'name')->get();
        $brand_id       = $getNewArrival->pluck('brand_id')->toArray();
        $brands         = Brand::where('status', 0)->whereIn('id', $brand_id)->select('id', 'name')->get();
        $newArrivals    = Product::filter(request(['category_id', 'brand_id', 'price_mode']))->latest()->take(16)->select('id','category_id', 'brand_id', 'name', 'slug','price', 'sell_price')->get();                                                                                                           
        $response = [
            'products'      =>  $newArrivals,
            'categories'    => $categories,
            'brands'        => $brands,
        ];
        return response()->json($response, 200);
    }

    public function Trendings( Request $request ){
        $trendings      = Product::where('trending', 0)->latest()->get();
        $cate_id        = $trendings->pluck('category_id')->toArray();
        $categories     = Category::where('status', 0)->whereIn('id', $cate_id)->select('id', 'name')->get();
        $brand_id       = $trendings->pluck('brand_id')->toArray();
        $brands         = Brand::where('status', 0)->whereIn('id', $brand_id)->select('id', 'name')->get();
        $trendingProducts    = Product::where('trending', 0)->filter(request(['category_id', 'brand_id', 'price_mode']))->latest()->select('id','category_id', 'brand_id', 'name', 'slug','price', 'sell_price')->get();
        $response = [
            'products'      => $trendingProducts,
            'categories'    => $categories,
            'brands'        => $brands,
        ];
        return response()->json($response, 200);
    }

    public function FeatureProducts( Request $request ){
        $features      = Product::where('trending', 0)->latest()->get();
        $cate_id        =  $features->pluck('category_id')->toArray();
        $categories     = Category::where('status', 0)->whereIn('id', $cate_id)->select('id', 'name')->get();
        $brand_id       =  $features->pluck('brand_id')->toArray();
        $brands         = Brand::where('status', 0)->whereIn('id', $brand_id)->select('id', 'name')->get();
        $featureProducts    = Product::where('featureProduct', 0)->filter(request(['category_id', 'brand_id', 'price_mode']))->latest()->select('id','category_id', 'brand_id', 'name', 'slug','price', 'sell_price')->get();
        $response = [
            'products'      => $featureProducts,
            'categories'    => $categories,
            'brands'        => $brands,
        ];
        return response()->json($response, 200);
    }

    public function Search(Request $request){
        if(!empty(request(['s']))){
            $products = Product::with('category', 'brand')->filter(request(['s']))->paginate(12);
            $response = [
                'products' => $products,
            ];
            return response()->json($response, 200);
        }else{
            $response = [
                'error' => 'Product not found',
            ];
            return response()->json($response, 404);
        }
    }

}
