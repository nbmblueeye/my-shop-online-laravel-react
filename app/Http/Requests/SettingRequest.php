<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [

            'websiteName'   => 'required',
            'websiteUrl'    => 'required',
            'websiteDescription' => 'nullable',
            'pageTitle'     => 'required',
            'metaKeywords'  => 'required',
            'metaDes'       => 'required',
            'address'       => 'required',
            'phoneNo1'      => 'required',
            'phoneNo2'      => 'nullable',
            'emailNo1'      => 'required',
            'emailNo2'      => 'nullable',
            'facebook'      => 'nullable',
            'twitter'       => 'nullable',
            'instagram'     => 'nullable',
            'youtube'       => 'nullable',

        ];
    }
}
