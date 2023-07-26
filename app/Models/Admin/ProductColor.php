<?php

namespace App\Models\Admin;

use App\Models\Admin\Color;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductColor extends Model
{
    use HasFactory;
    protected $table = 'product_colors';
    protected $fillable = [
        "product_id",
        "color_id",
        "product_color_qty",
    ];

    protected $with = ['color'];
    
    public function color(){
        return $this->belongsTo(Color::class,'color_id', 'id');
     }
}
