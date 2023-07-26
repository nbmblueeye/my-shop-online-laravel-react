<?php

namespace App\Http\Controllers\API\FrontEnd;

use Illuminate\Http\Request;
use App\Models\Admin\Product;
use App\Models\FrontEnd\Cart;
use App\Http\Controllers\Controller;

class CartController extends Controller
{
    public function Add(Request $request){

        if(auth('sanctum')->check()) {

            $user_id = auth('sanctum')->user()->id;

            $productInCart = Cart::where('user_id', $user_id)->where('product_id', $request->product_id)->exists();

            if(!$productInCart){

                $productExist = Product::where('id', $request->product_id)->exists();

                if($productExist){

                    $product = Product::where('id', $request->product_id)->first();
                    $productColors = $product->productColor;

                    if(count($productColors) > 0){

                        if($request->product_color_id){

                            $productColorExist = $product->productColor()->where('id', $request->product_color_id)->exists();
    
                            if($productColorExist){
    
                                $productColorInCart = Cart::where('user_id', $user_id)->where('product_id', $request->product_id)->where('product_color_id', $request->product_color_id)->exists();
    
                                if(!$productColorInCart){

                                    $productColor = $product->productColor()->where('id', $request->product_color_id)->first();
                                    if($productColor->product_color_qty >= $request->quantity){

                                        $cart = Cart::create([
                                            'user_id'           => $user_id,
                                            'product_id'        => $request->product_id,
                                            'product_color_id'  => $request->product_color_id,
                                            'quantity'          => $request->quantity,   
                                        ]);

                                        $response = [
                                            'cart' => $cart,
                                            'feedback'  => "Selected product color is added to Cart",
                                        ]; 
                                        return response()->json($response, 201); 

                                    }else{
                                        $response = [
                                            'feedback'  => "Selected ".$productColor->color->name." are only ".$productColor->product_color_qty." left",
                                        ]; 
                                        return response()->json($response, 406);    
                                    }
    
                                }else{
                                    $response = [
                                        'feedback'  => "Selected Product Color is added in your cart",
                                    ]; 
                                    return response()->json($response, 405);
                                }
    
                            }else{
                                $response = [
                                    'feedback'  => "Product Color not found",
                                ]; 
                                return response()->json($response, 404);
                            }
    
                        }else{
                            $response = [
                                'feedback'  => "Please select a Color",
                            ]; 
                            return response()->json($response, 406);
                        }

                    }else{

                        if($product->quantity >= $request->quantity){

                            $cart = Cart::create([
                                'user_id'           => $user_id,
                                'product_id'        => $request->product_id,
                                'quantity'          => $request->quantity,   
                            ]);

                            $response = [
                                'cart' => $cart,
                                'feedback'  => "Selected Product is added to Cart",
                            ]; 
                            return response()->json($response, 201); 

                        }else{
                            $response = [
                                'feedback'  => "Selected ".$product->name." are only ".$product->quantity." left",
                            ]; 
                            return response()->json($response, 406);    
                        }

                    }


                }else{
                    $response = [
                        'feedback'  => "Product not found",
                    ]; 
                    return response()->json($response, 404);
                }

            }else{
                $response = [
                    'feedback'  => "Selected product is added in your Cart",
                ]; 
                return response()->json($response, 405);
            }

        }else{
            $response = [
                'message'  => "",
            ]; 
            return response()->json($response, 401); 
        }
    }

    public function Index(Request $request){

        if(auth('sanctum')->check()){
            $user_id = auth('sanctum')->user()->id;
            $carts = Cart::where('user_id', $user_id)->get();

            $response = [
                'carts' => $carts,
            ]; 
            return response()->json($response, 201); 

        }else{
            $response = [
                'message'  => "",
            ]; 
            return response()->json($response, 401); 
        }

    }

    public function Edit(Request $request ,$id){

    
            $cart = Cart::findOrFail($id);

            $cart->quantity = $request->quantity;

            $cart->save();

            $response = [
                'message' => 'Selected Product in Cart was updated successfully',
                'cart' => $cart,
            ];
            return response()->json($response, 202);


    }

    public function Delete($id){

        $cart = Cart::findOrFail($id);
        $cart->delete();

        return response()->json('', 204);
    }
}
