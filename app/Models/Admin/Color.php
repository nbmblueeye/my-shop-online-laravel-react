<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    use HasFactory;

    protected $table = 'colors';

    protected $fillable = [
        "name",
        "color_code",
        'image',
        "status",
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];

}
