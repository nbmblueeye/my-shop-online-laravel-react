<?php

namespace App\Http\Controllers\API\FrontEnd;

use Illuminate\Support\Str;
use Illuminate\Http\Request;

use App\Models\FrontEnd\Cart;

use App\Models\FrontEnd\Order;

use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Requests\OrderRequest;
use App\Http\Controllers\Controller;
use App\Mail\PlaceOrderMailable;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function Index(Request $request){
        $orders = Order::latest()->filter(request(['date', 'status']))->paginate(10);
        $response = [
            'orders' => $orders,
        ];
        return response()->json($response, 202);
    }
    
    public function Add(OrderRequest $request){

        $validated = $request->validated();

        if(auth('sanctum')->check()){

            $user_id = auth('sanctum')->user()->id;
            
            $order = Order::create([
                'user_id'           => $user_id,
                'tracking_no'       => Str::random(10),
                'full_name'         => $validated['full_name'],
                'phone_number'      => $validated['phone_number'],
                'email'             => $validated['email'],
                'zip_code'          => $validated['zip_code'],
                'address'           => $validated['address'],
                'status_message'    => 'On Preogress',
                'payment_mode'      => $request->payment_mode,
                'payment_id'        => $request->payment_id,
            ]);

            $carts = Cart::where('user_id',$user_id)->get();
            $cartItem = [];
            if(!empty($carts)){
                foreach ($carts as $cart) {
                    $cartItem[] = [
                        'order_id'          => $order->order_id,
                        'product_id'        => $cart->product_id,
                        'product_color_id'  => $cart->product_color_id,
                        'quantity'          => $cart->quantity,
                        'price'             => $cart->product->sell_price ? $cart->product->sell_price:$cart->product->price,
                    ];

                    if($cart->product_color_id){
                        $cart->product_color()->update([
                            'product_color_qty' => $cart->product_color->product_color_qty - $cart->quantity,
                        ]);
                    }else if($cart->product_id && !$cart->product_color_id){
                        $cart->product()->update([
                            'quantity' => $cart->product->quantity - $cart->quantity,
                        ]);
                    }
                }
            }

            $order->orderItems()->createMany($cartItem);
            Cart::destroy($carts);

            try {

                $data  = ['order' => $order];
                $pdf = Pdf::loadView('download-invoice', $data);
                $pdf->setPaper('a4', 'landscape')->setOption(['dpi' => 150, 'fontHeightRatio' => '1']);
                $order['invoice'] = $pdf;

                Mail::mailer('smtp')->to($order->email)->send(new PlaceOrderMailable($order));
                
                $response = [
                    'feedback' =>"Order placed successfully, Thank you",
                ];
    
                return response()->json($response, 201);

            } catch (\Exception $error) {
                      
                $response = [
                    'error' => $error,
                ];
        
                return response()->json($response, 500);
            }

        }else{
            return response()->json("", 401); 
        }
    }

    public function Validation(OrderRequest $request){

        $validated = $request->validated();
        if(!auth('sanctum')->check()){
            return response()->json("", 401); 
        }else{
            return response()->json("", 201); 
        }

    }

    public function Show($id){

        $order = Order::findOrFail($id);
        $orderItems = $order->orderItems;

        $response = [
            'order' => $order,
            'orderItems' => $orderItems,
        ];

        return response()->json($response, 202);
        
    }

    public function Edit(Request $request, $id){

        $order = Order::where('id', $id)->first();

        if($order){
            if($request->status_message){

                $order->status_message = $request->status_message;

                $order->save();
                $response = [
                    'order' => $order,
                    'message' =>"Order Message is updated successfully",
                ];
                return response()->json($response, 202);

            }else{
                $response = [
                    'error' =>"Please select a status message",
                ];
                return response()->json($response, 404);
            }
            
        }else{

            $response = [
                'error' =>"There're no order found",
            ];
            return response()->json($response, 404);
        }
    }

    public function View_Invoice($order_id){

        $order = Order::findOrFail($order_id);
        return view('view-invoice', compact('order'));

    }

    public function Download_Invoice($order_id){

        $order = Order::findOrFail($order_id);
        $data  = ['order' => $order];

        $pdf = Pdf::loadView('download-invoice', $data);
        $date = Carbon::now()->format('d-m-Y');

        return $pdf->setPaper('a4', 'landscape')->setOption(['dpi' => 150, 'fontHeightRatio' => '1'])->download('invoice-'.$order->id.'-'.$date.'.pdf');
    }    
}
