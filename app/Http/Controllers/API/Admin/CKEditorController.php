<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CKEditorController extends Controller
{
    public function ckEditorUpload(Request $request){

        if ($request->hasFile('upload')) {

            $file = $request->file('upload');
            $extension = $file->extension();
            $fileName = "media_". time() .'.' . $extension;
      
            $request->file('upload')->move(public_path('/uploads/media'), $fileName);
      
            $url = asset('/uploads/media/' . $fileName);
  
            return response()->json(['fileName' => $fileName, 'uploaded'=> 1, 'url' => $url]);
        }

    }
}
