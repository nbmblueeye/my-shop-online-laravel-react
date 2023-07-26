<style>
    .card{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card-body{
        max-width: 600px;
        background-color: #111;
        color:#fff;
    }

    .text-info{
        color: green;
    }
</style>
@extends('layouts.app')

@section('content')

    <div class="card mx-auto">
        <div class="card-body">
            <h4>Hello {{$data->email}}</h4>
            <p>You're receiving this email because we received a <span class="text-info">Reset PassWord</span> request for your account</p>
            <p>Please click Button below to reset your Password</p>
            <a href="{{env('VITE_WEB_BASE_URL')}}{{URL::temporarySignedRoute('password.reset', now()->addMinutes(30), ['token' => $data->token, 'email' => $data->email], false);}}"><button class="button btn btn-outline-secondary my-5">Click Button to reset your Password</button></a>

            <p>This Password reset Link will be expired in 30 minutes</p>
            <p>If You didn't request a Password Reset, no further action is required</p>
            <p class="mt-3">Regards,</p>
        </div>
    </div>
    
@endsection


