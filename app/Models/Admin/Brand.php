<?php

namespace App\Models\Admin;

use App\Models\Admin\Product;
use App\Models\Admin\Category;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;

    protected $table = 'brands';

    protected $fillable = [
        "category_id",
        "name",
        "slug",
        "description",
        "image",
        "status",
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];

    protected $with = ['category'];
    public function category(){
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function products(){
        return $this->hasMany(Product::class, 'brand_id', 'id');
    }

    public function scopeBrandFilter($query, array $Filter){

        if(!empty($Filter['s']) ?? false){
            $query ->orWhere('description', 'like', '%'.$Filter['s'].'%') 
                   ->orWhere('name', 'like', '%'.$Filter['s'].'%'); 
        }
    }
    
}
