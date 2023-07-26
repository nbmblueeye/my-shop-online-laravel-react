<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\User;
use App\Models\Admin\Brand;
use App\Models\Admin\Color;
use Illuminate\Http\Request;
use App\Models\Admin\Product;
use App\Models\Admin\Category;
use App\Models\FrontEnd\Order;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;

class DashBoardController extends Controller
{
    public function Index(){

        $day    = Carbon::now()->format('Y-m-d');
        $month  = Carbon::now()->format('Y-m');
        $year   = Carbon::now()->format('Y');

        $total_orders       = Order::count();
        $day_orders         = Order::whereDay('created_at', $day)->count();
        $month_orders       = Order::whereMonth('created_at', $month)->count();
        $year_orders        = Order::whereYear('created_at', $year)->count();

        $total_categories   = Category::count();
        $total_brands       = Brand::count();
        $total_products     = Product::count();
        $tota_colors        = Color::count();

        $total_users        = User::count();   
        $total_admins       = User::where('hasRole', 'admin')->count();
        $total_users        = User::where('hasRole', 'user')->count();

        $response = [
            'orders'    => ['total' => $total_orders, 'day' => $day_orders, 'month' => $month_orders, 'year' =>  $year_orders],
            'products'  => ['categories' => $total_categories, 'brands' => $total_brands, 'products' => $total_products, 'colors' => $tota_colors],
            'users'     => ['all' => $total_users , 'admins' =>  $total_admins, 'users' => $total_users],
        ];

        return response()->json($response, 200);

    }
}
