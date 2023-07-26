<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeadSlider extends Model
{
    use HasFactory;
    protected $table = 'head_sliders';
    protected $fillable = [
        "title",
        "sub_title",
        "message",
        "image",
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];

}