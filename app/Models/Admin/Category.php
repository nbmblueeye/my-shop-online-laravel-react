<?php

namespace App\Models\Admin;

use App\Models\Admin\Brand;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'meta_title',
        'meta_keyword',
        'meta_description',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];


    public function products(){
        return $this->hasMany(Product::class,'category_id', 'id');
     }
 
     public function brands(){
         return $this->hasMany(Brand::class,'category_id', 'id');
     }

     public function scopeCateFilter($query, array $Filter){

        if(!empty($Filter['s']) ?? false){
            $query ->orWhere('description', 'like', '%'.$Filter['s'].'%') 
                   ->orWhere('name', 'like', '%'.$Filter['s'].'%'); 
        }
    }
}
