<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Auth\UserController;
use App\Http\Controllers\API\SendEmailController;
use App\Http\Controllers\API\Admin\BrandController;
use App\Http\Controllers\API\Admin\ColorController;
use App\Http\Controllers\API\Admin\PaypalController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\API\Admin\ProductController;
use App\Http\Controllers\API\Admin\SettingController;
use App\Http\Controllers\API\FrontEnd\CartController;
use App\Http\Controllers\API\Admin\CategoryController;
use App\Http\Controllers\API\Admin\CKEditorController;
use App\Http\Controllers\API\FrontEnd\OrderController;
use App\Http\Controllers\API\Admin\DashBoardController;
use App\Http\Controllers\API\Admin\HeadSliderController;
use App\Http\Controllers\API\FrontEnd\CommentController;
use App\Http\Controllers\API\FrontEnd\FrontEndController;
use App\Http\Controllers\API\FrontEnd\WishlistController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\FrontEnd\UserProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum', 'verified'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/logout', [AuthController::class, 'logOut']);

    //Cart
    Route::post('/cart/product/add', [CartController::class, 'Add']);
    Route::get('/carts', [CartController::class, 'Index']);
    Route::post('/cart/edit/{id}', [CartController::class, 'Edit']);
    Route::get('/cart/delete/{id}', [CartController::class, 'Delete']);

    //Wishlist
    Route::post('/wishlist/add', [WishlistController::class, 'Add']);
    Route::get('/wishlists',[WishlistController::class, 'Index']);
    Route::get('/wishlist/delete/{id}', [WishlistController::class, 'Delete']);

    //Order
    Route::post('/order/add', [OrderController::class, 'Add']);
    Route::post('/order/validate', [OrderController::class, 'Validation']);

    //Profile
    Route::get('/profile', [UserProfileController::class, 'Index']);
    Route::post('/profile/edit', [UserProfileController::class, 'Edit']);
    Route::post('/profile/change-password', [UserProfileController::class, 'ChangePassword']);

    //Comment
    Route::post('/comments', [CommentController::class, 'Store']);
    Route::get('/comment/{comment_id}', [CommentController::class, 'Delete']);
    Route::get('/comments/user', [CommentController::class, 'checkUser']);

});

Route::prefix('/admin')->middleware(['auth:sanctum', 'isAdmin','verified'])->group(function () {

    Route::get('', function (Request $request) {
        return $request->user();
    });

    //Admin Category
    Route::get('/categories', [CategoryController::class, 'Index']);
    Route::get('/delete/category/{id}', [CategoryController::class, 'Delete']);
    Route::post('/add/category', [CategoryController::class, 'Store']);
    Route::get('/show/category/{id}', [CategoryController::class, 'Show']);
    Route::post('/edit/category/{id}', [CategoryController::class, 'Edit']);

    //Admin Brand
    Route::get('/brands', [BrandController::class, 'Index']);
    Route::get('/delete/brand/{id}', [BrandController::class, 'Delete']);
    Route::post('/add/brand', [BrandController::class, 'Store']);
    Route::get('/show/brand/{id}', [BrandController::class, 'Show']);
    Route::post('/edit/brand/{id}', [BrandController::class, 'Edit']);

    //Admin Color
    Route::get('/colors', [ColorController::class, 'Index']);
    Route::get('/delete/color/{id}', [ColorController::class, 'Delete']);
    Route::post('/add/color', [ColorController::class, 'Store']);
    Route::get('/show/color/{id}', [ColorController::class, 'Show']);
    Route::post('/edit/color/{id}', [ColorController::class, 'Edit']);
    
    //Admin Product
    Route::get('/products', [ProductController::class, 'Index']);
    Route::get('/delete/product/{id}', [ProductController::class, 'Delete']);
    
    Route::get('/show/product/{id}', [ProductController::class, 'Show']);
    Route::post('/edit/product/{id}', [ProductController::class, 'Edit']);
   
    Route::get('/product-attributes', [ProductController::class, 'GetAttributes']);
    Route::post('/add/product', [ProductController::class, 'Store']);
   
     //Admin Orders
     Route::get('/orders', [OrderController::class, 'Index']);
     Route::get('/order/{id}', [OrderController::class, 'Show']);
     Route::post('order/edit/{id}', [OrderController::class, 'Edit']);

    //Admin Head Slider
    Route::get('/sliders', [HeadSliderController::class, 'Index']);
    Route::get('/delete/slider/{id}', [HeadSliderController::class, 'Delete']);
    Route::post('/add/slider', [HeadSliderController::class, 'Store']);

    Route::get('/show/slider/{id}', [HeadSliderController::class, 'Show']);
    Route::post('/edit/slider/{id}', [HeadSliderController::class, 'Edit']);
   
    //Admin Dashboard
     Route::get('/dashboard', [DashBoardController::class, 'Index']);
    
    //Send Invoice
     Route::get('/admin/send-invoice/{order_id}', [SendEmailController::class, 'invoice']);

     //User Control
     Route::get('/users', [UserController::class, 'Index']);
     Route::post('/user/add', [UserController::class, 'Store']);
     Route::get('/user/{user_id}', [UserController::class, 'Show']);
     Route::post('/user/edit/{user_id}', [UserController::class, 'Edit']);
     Route::get('/user/delete/{user_id}', [UserController::class, 'Delete']);


});


Route::post('/signup', [AuthController::class, 'signUp']);
Route::post('/login', [AuthController::class, 'logIn']);

Route::get('/email/verify/{id}',[VerifyEmailController::class, 'verify'])->name('verification.verify');

//Forgot Password
Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

//Admin Settings
Route::post('/admin/settings/add', [SettingController::class, 'Setting']);
Route::get('/admin/settings', [SettingController::class, 'Index']);

//FrontEnd   
Route::controller(FrontEndController::class)->group(function(){
    //Index Page
    Route::get('/index','Index');
    Route::get('/trendings', 'Trendings');
    Route::get('/newarrivals', 'NewArrivals');

    //Archive Page
    Route::get('/archive', 'Archive');

    //Brand Page
    Route::get('/brand/{slug}', 'Brand');

    //Category Page
    Route::get('/category/{slug}','Category');

    //Single Page
    Route::get('/{category}/{brand}/{id}', 'Product');
    Route::get('/product/description/{product_id}', 'getProductDescription');

    //Orders Page
    Route::get('/orders', 'Orders');
    Route::get('/order/{id}', 'Order');

    //New Arrivals Page
    Route::get('/new-arrivals', 'NewArrivals');

    //New Arrivals Page
    Route::get('/trendings', 'Trendings');

     //New Feature Product Page
     Route::get('/feature-products', 'FeatureProducts');

     //Search Page
     Route::get('/search', 'Search');
});


//Paypal Server Side
Route::post('/create-paypal-order', [PaypalController::class, 'createOrder']);
Route::post('/capture-paypal-order', [PaypalController::class, 'captureOrder']);

//Comment
 Route::get('/comments/{product_id}', [CommentController::class, 'Index']);

//CKEditor Image Upload
 Route::post('/ckfinder/upload', [CKEditorController::class, 'ckEditorUpload']);



