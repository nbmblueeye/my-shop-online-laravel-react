<?php

namespace App\Models;

use App\Models\User;
use DateTimeInterface;
use App\Models\Admin\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'comment',
        'parent_id',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function product(){
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function comments(){
        return $this->belongsTo(Comment::class, 'parent_id', 'id');
    }

    public function replies(){
        return $this->hasMany(Comment::class, 'parent_id', 'id')->orderBy('created_at','Desc');
    }

    protected function serializeDate(DateTimeInterface $date):string{

        return $date->diffForHumans();

    }

}
