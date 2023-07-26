<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<style>
    .button{
        padding: 20px;
        border-radius: 2px;
        background-color: rgba(0, 0, blue, 0.8);
        color: #fff;
        cursor: pointer;
    }

    .button:hover{
        background-color: rgba(0, 0, blue, 0.5);
    }

    a{
        text-decoration: none;
    }

</style>
<body>
    <h2>User Register Email Verification</h2>
    <p>Hello {{$user->name}}</p>
    <p>Please click to following Link to verify your email address</p>
    <a href="{{env('VITE_WEB_BASE_URL')}}{{URL::temporarySignedRoute('verification.verify', now()->addMinutes(30), ['id' => $user->id], false);}}"><button class="button">Click Button to verify your email</button></a>
</body>
</html>