<?php

namespace App\Http\Controllers\API\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalController extends Controller
{
    public function createOrder(Request $request){

      $provider = new PayPalClient;

      $provider->setApiCredentials(config("paypal"));
      $provider->getAccessToken();

      $data = json_decode($request->getContent(), true);
      $total = $data['totals'];
    
      $data = [
        "intent"=>"CAPTURE",
        "purchase_units" => [
          [
            "amount" => [
              "currency_code" => "USD",
              "value" => $total,
            ]
          ]
        ]
      ];    
    
      $data = $provider->createOrder($data);
      return response()->json($data);
        
    }

    public function captureOrder(Request $request){

        $data = json_decode($request->getContent(), true);
        $orderId = $data['orderID'];

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $token = $provider->getAccessToken();
        $provider->setAccessToken($token);

       $result = $provider->capturePaymentOrder($orderId);

       if($result['status'] == 'COMPLETED'){

          $data = [
              'payment_id' => $result['id'],
              'payer_name' => $result['payer']['name'],
              'payment_info' => $result['purchase_units'][0]["payments"]["captures"][0]["amount"],
          ];

          return response()->json($data);     

       }
      
    }
}
