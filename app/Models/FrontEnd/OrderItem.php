<?php

namespace App\Models\FrontEnd;

use App\Models\Admin\Product;
use App\Models\Admin\ProductColor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'product_id',
        'product_color_id',
        'quantity',
        'price',
    ];

    protected $with = ['product', 'productColor'];

    public function product(){
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function productColor(){
        return $this->belongsTo(ProductColor::class, 'product_color_id', 'id');
    }

}
