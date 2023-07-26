<?php

namespace App\Http\Controllers\API\Admin;

use Illuminate\Http\Request;
use App\Models\Admin\Setting;
use App\Http\Controllers\Controller;
use App\Http\Requests\SettingRequest;

class SettingController extends Controller
{
    public function Setting(SettingRequest $request){

        $validated = $request->validated();
        $settings = Setting::first();
        if(empty($settings)){
            $settings = Setting::create([
                'websiteName'   => $validated['websiteName'],
                'websiteUrl'    => $validated['websiteUrl'],
                'websiteDescription'    => $validated['websiteDescription'],
                'pageTitle'     => $validated['pageTitle'],
                'metaKeywords'  => $validated['metaKeywords'],
                'metaDes'       => $validated['metaDes'],
                'address'       => $validated['address'],
                'phoneNo1'      => $validated['phoneNo1'],
                'phoneNo2'      => $validated['phoneNo2'],
                'emailNo1'      => $validated['emailNo1'],
                'emailNo2'      => $validated['emailNo2'],
                'facebook'      => $validated['facebook'],
                'twitter'       => $validated['twitter'],
                'instagram'     => $validated['instagram'],
                'youtube'       => $validated['youtube'],
            ]);
            $response = [
                'settings' => $settings,
                'message' => 'New Setting created successfully', 
            ];
            return response()->json($response, 201);
        }else{
            $settings = $settings->update([
                'websiteName'   => $validated['websiteName'],
                'websiteUrl'    => $validated['websiteUrl'],
                'websiteDescription'    => $validated['websiteDescription'],
                'pageTitle'     => $validated['pageTitle'],
                'metaKeywords'  => $validated['metaKeywords'],
                'metaDes'       => $validated['metaDes'],
                'address'       => $validated['address'],
                'phoneNo1'      => $validated['phoneNo1'],
                'phoneNo2'      => $validated['phoneNo2'],
                'emailNo1'      => $validated['emailNo1'],
                'emailNo2'      => $validated['emailNo2'],
                'facebook'      => $validated['facebook'],
                'twitter'       => $validated['twitter'],
                'instagram'     => $validated['instagram'],
                'youtube'       => $validated['youtube'],
            ]);
            $response = [
                'settings' => $settings,
                'message' => 'Setting is updated successfully', 
            ];
            return response()->json($response, 201);
        }
    }

    public function Index(){
        $settings = Setting::first();
        $response = [
            'setting' => $settings,
        ];
        return response()->json($response, 200);
    }
}
