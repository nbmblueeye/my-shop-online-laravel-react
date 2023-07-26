<?php

namespace App\Models\FrontEnd;

use App\Models\Admin\Product;
use App\Models\Admin\ProductColor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "product_id",
        "product_color_id",
        'quantity',
     ];
 
     protected $with = ['product', 'product_color'];
 
     public function product(){
         return $this->belongsTo(Product::class, 'product_id', 'id');
     }
 
     public function product_color(){
         return $this->belongsTo(ProductColor::class, 'product_color_id', 'id');
     }
}
