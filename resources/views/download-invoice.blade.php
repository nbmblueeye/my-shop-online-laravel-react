<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Online Shop - Invoice</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

    <style>
        body {
            max-width: 100%;
            min-height: 100vh;
        }
      
        .container{
            margin: 0 auto;
            max-width: 100%;
            padding: 10px;
        }

        .table {
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 2rem;
        }

        .table td, .table th {
            border: 1px solid #ddd;
            padding: 12px;
        }

        .table tr:nth-child(even){background-color: #f2f2f2;}

        .table th {
            text-align: left;
        }

        .table .logo{
            font-size: 1.3rem;
            font-weight: 600;
            color: blue;
        }

        .table .table-title{
            font-size: 1.2rem;
            font-weight: 600;
            color: blue;
        }

        .table .title{
            font-size: 1.05rem;
            font-weight: 500;
        }

    
        .table td .shop-info{
            width: 100%;
            font-size: 1.1rem;
            font-weight: 500;
        }

        .head{
            max-width: 100%;
            padding: 16px;
            display: flex;
            justify-content: space-between;
        }

        .download-btn{
            padding: 8px 16px;
            border: 1px solid gray;
            border-radius: 3px;
            transition: all 0.5s;
            text-decoration: none;
        }

        .download-btn i{
            color: red;
            font-size: 1.1rem;
            margin-right: 0.5rem;
        }

        .download-btn:hover{
            background-color: rgba(0, 0, 0, 0.2);
        }

        .text-end {
            text-align: right;
        }


    </style>
</head>
<body>

    <div class="container">
       
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th colspan="2" class="logo">My Online Shop</th>
                    <td colspan="2" class="text-end">
                        <div class="shop-info"> Invoice Id: {{$order->full_name}}</div><br>
                        <div class="shop-info">Date:{{$order->created_at->format('d-m-Y')}}</div><br>
                        <div class="shop-info">Address: {{$order->address}}</div><br>
                    </td>
                </tr>
                <tr>
                    <th colspan="2" scope="col" class="table-title">Detail</th>
                    <th colspan="2" scope="col" class="table-title">User</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="title">Order Id: </td>
                    <td class="content">{{$order->id}}</td>
                    <td class="title">Full Name: </td>
                    <td class="content">{{$order->full_name}}</td>
                </tr>
                <tr>
                    <td class="title">Tracking Id/No.:</td>
                    <td class="content">{{$order->tracking_no}}</td>
                    <td class="title">Email: </td>
                    <td class="content">{{$order->email}}</td>
                </tr>
                <tr>
                    <td class="title">Payment Mode: </td>
                    <td class="content">{{$order->payment_mode}}</td>
                    <td class="title">Phone: </td>
                    <td class="content">{{$order->phone_number}}</td>
                </tr>
                <tr>
                    <td class="title">
                        Order Status: 
                    </td>
                    <td class="content">{{$order->status_message}}</td>
                    <td class="title">Address: </td>
                    <td class="content">{{$order->address}}</td>
                </tr>
            </tbody>
        </table>
        <br>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th colspan="5" class="table-title">Orders Items</th>
                </tr>
                <tr>
                    <th scope="col">Item Id</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>
                
                @if(count($order->orderItems) > 0)
                    @foreach($order->orderItems as $key => $orderItem) 
                
                        <tr key={index}>
                            <td scope="col">{{$orderItem->id}}</td>
                            <td scope="col">
                                {{$orderItem->product->name}}
                                @if($orderItem->product_color_id)
                                    
                                <br>
                                <p>({{$orderItem->productColor->color->name}})</p>
                                        
                                @endif
                            </td>
                            <td scope="col">{{$orderItem->price}}</td>
                            <td scope="col">{{$orderItem->quantity}}</td>
                            <td scope="col">{{$orderItem->price * $orderItem->quantity}}</td>
                        </tr>

                    @endforeach
                @endif
                    
            </tbody>
        </table>
       
    </div>

</body>
</html> 