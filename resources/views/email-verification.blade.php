@extends('layouts.app')

@section('content')
    <div>
        <h3>Email Verification</h3>

        @if(isset($msg))
            <div class="success">
                <p><strong>Success!</strong> {{$msg}}</p>
            </div>
        @elseif(isset($warning))
            <div class="warning">
                <p><strong>Warning!</strong> {{$warning}}</p>
            </div>
        @else
            <div class="danger">
                <p><strong>Danger!</strong> {{$error}}</p>
            </div>
        @endif
    </div>
@endsection

<style>
    .success {
        padding: 15px;
        background-color: #ddffdd;
        border-left: 6px solid #04AA6D;
    }

    .warning {
        padding: 15px;
        background-color: #ffffcc;
        border-left: 6px solid #ffeb3b;
    }

    .danger {
        background-color: #ffdddd;
        border-left: 6px solid #f44336;
    }
</style>