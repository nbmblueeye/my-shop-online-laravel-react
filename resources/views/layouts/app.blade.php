<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Online Shop - @yield('title')</title>
    <link rel="stylesheet" href="{{asset('assets/css/bootstrap.min.css')}}">
</head>
<body>

    <div class="container">
        @yield('content')
    </div>

   <script src="{{asset('assets/js/bootstrap.bundle.min.css')}}"></script>
</body>
</html>