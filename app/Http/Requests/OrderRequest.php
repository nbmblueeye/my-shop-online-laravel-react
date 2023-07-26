<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'full_name'     => 'required|string|max:100',
            'phone_number'  => 'required|string|max:12',
            'email'         => 'required|max:121',
            'zip_code'      => 'required|string|max:12',
            'address'       => 'required|string|max:500',
        ];
        
    }
}
