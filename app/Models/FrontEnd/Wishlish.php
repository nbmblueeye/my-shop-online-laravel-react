<?php

namespace App\Models\FrontEnd;

use App\Models\Admin\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wishlish extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_id', 'product_color_id'];

    protected $with = ['product'];
    public function product(){
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
