<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\InvoiceMailable;
use App\Models\FrontEnd\Order;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class SendEmailController extends Controller
{
    public function invoice($order_id){

        $order = Order::findOrFail($order_id);
        if($order){
            try {

                $data  = ['order' => $order];
                $pdf = Pdf::loadView('download-invoice', $data);
                $pdf->setPaper('a4', 'landscape')->setOption(['dpi' => 150, 'fontHeightRatio' => '1']);
                $order['invoice'] = $pdf;

                Mail::mailer('smtp')->to($order->email)->send(new InvoiceMailable($order));
                $response = [
                    'message' => 'Invoice sent successfully',
                ];
                return response()->json($response, 200);

            } catch (\Exception $error) {
                
                $response = [
                    'error' => 'Send invoice failed',
                ];
        
                return response()->json($response, 500);
            }
        }
    }

}
