<?php

namespace App\Http\Controllers\API\FrontEnd;

use Illuminate\Http\Request;
use App\Models\FrontEnd\Wishlish;
use App\Http\Controllers\Controller;

class WishlistController extends Controller
{
    public function Add(Request $request){

        if(auth('sanctum')->check()){

            $user_id = auth('sanctum')->user()->id;
            $wishlistExist = Wishlish::where('user_id', $user_id)->where('product_id', $request->product_id)->exists();

            if(!$wishlistExist){

                if($request->product_color_id){

                    $wishlist = Wishlish::create([
                        'user_id'           => $user_id,
                        'product_id'        => $request->product_id,
                        'product_color_id'  => $request->product_color_id,
                    ]);
                }else{
                    $wishlist = Wishlish::create([
                        'user_id'           => $user_id,
                        'product_id'        => $request->product_id,
                    ]);
                }
                
                $response = [
                    'wishlist' => $wishlist,
                    'feedback'  => "Selected product is added to Wishlist",
                ]; 
                return response()->json($response, 201); 

            }else{

                $response = [
                    'feedback'  => "Selected product is added in your Wishlist",
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
            $wishlists = Wishlish::where('user_id', $user_id)->get();

            $response = [
                'wishlists' => $wishlists,
            ]; 
            return response()->json($response, 201); 

        }

    }

    public function Delete(Request $request, $id){

        $wishlist = Wishlish::findOrFail($id);

        $wishlist->delete();
        return response()->json('', 204);

    }


}
