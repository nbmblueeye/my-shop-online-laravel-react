<?php

namespace App\Models\FrontEnd;

use App\Models\FrontEnd\OrderItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'tracking_no',
        'full_name',
        'phone_number',
        'email',
        'zip_code',
        'address',
        'status_message',
        'payment_mode',
        'payment_id',
    ];

    public function orderItems(){
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }

    public function scopeFilter($query, array $Filter){

        if($Filter['date'] ?? false){
            $query -> whereDate('created_at', $Filter['date']);
        }

        if($Filter['status'] ?? false){
            $query -> where('status_message', $Filter['status']);
        }

    }
}
