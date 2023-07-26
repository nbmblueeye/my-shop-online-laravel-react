<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HeadSliderRequest extends FormRequest
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
            "title" => "nullable|string",
            "sub_title" => "nullable|string",
            "message" => "nullable|string",
            "image" => "required|string",
        ];
    }
}
