<?php

namespace App\Http\Controllers\API\FrontEnd;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentController extends Controller
{
    public function checkUser(){

        $user_id = null;
        if(auth()->check()){
            $user_id = auth()->user()->id;
        }

        $response = [
            'user_id'  =>  $user_id,
        ]; 
        return response()->json($response, 200); 
    }
  
    public function Index(Request $request, $product_id){

        $comments = Comment::where("product_id", '=', $product_id)
        ->whereNull("parent_id")
        ->with('user', 'product:id,name', 'replies.user', 'replies.replies','replies.replies.user')
        ->latest()
        ->get();

        $response = [
            'comments'  => $comments,
        ]; 
        return response()->json($response, 200); 

    }
   
    public function Store(Request $request){

        $request->validate([
            'comment' => 'required|string',
        ]);

        if(auth()->check()){
            
            $user_id = auth()->user()->id;
            $comment = Comment::create([
                'user_id'    => $user_id,
                'product_id' => $request->product_id,
                'comment'    => $request->comment,
                'parent_id'  => $request->parent_id ?? null ,
            ]);

            $response = [
                'message'  => "Comment created successfully",
            ]; 
            return response()->json($response, 201); 

        }else{
            $response = [
                'error'  => "Please login to post your comment",
                'failure' => auth()->check(),
            ]; 
            return response()->json($response, 401); 
        }
    }

    public function Delete($comment_id){

        $comment = Comment::find($comment_id);

        if($comment){
            $comment->delete();

            $response = [
                'comments'  =>'',
            ]; 
            return response()->json($response, 204); 
        }

    }

}
