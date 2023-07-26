<?php

namespace App\Models\Admin;

use App\Models\Admin\Brand;
use App\Models\Admin\Category;
use App\Models\Admin\ProductColor;
use App\Models\Admin\ProductImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $table = 'products';
    protected $fillable = [
        "category_id",
        "brand_id",
        "name",
        "slug",
        "short_description",
        "description",
        "meta_title",
        "meta_keyword",
        "meta_description",
        "price",
        "sell_price",
        "quantity",
        "trending",
        "status",
        "featureProduct",
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];

    protected $with = ['category', 'brand', 'productImage', 'productColor'];

    public function productImage(){
        return $this->hasOne(ProductImage::class, 'product_id', 'id');
    }

    public function productColor(){
        return $this->hasMany(ProductColor::class, 'product_id', 'id');
    }

    public function category(){
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function brand(){
        return $this->belongsTo(Brand::class, 'brand_id', 'id');
    }

    public function scopeFilter($query, array $Filter){

        if(!empty($Filter['category_id']) ?? false){
            $query->whereIn('category_id', $Filter['category_id']); 
        }

        if(!empty($Filter['brand_id']) ?? false){
           $query->whereIn('brand_id', $Filter['brand_id']);
        }

        if(!empty($Filter['price_mode'] ?? false)){
            if(in_array("low-to-high", $Filter['price_mode'])){
                $query->orderBy('price', 'asc');
            }else if(in_array("high-to-low", $Filter['price_mode'])){
                $query->orderBy('price', 'desc');
            }
        }

        if(!empty($Filter['s']) ?? false){
            $search = $Filter['s'];
            $query  ->whereHas('category', function($query) use ($search) {$query->where('name', 'like', '%'.$search.'%');})
                    ->orWhereHas('brand', function($query) use ($search){$query->where('name', 'like', '%'.$search.'%');})
                    ->orWhere('name', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
        }

        if(!empty($Filter['category']) ?? false){
            $query->where('category_id', "=" ,$Filter['category']); 
        }

        if(!empty($Filter['brand']) ?? false){
            $query->where('brand_id', "=" ,$Filter['brand']); 
        }

    }
}
