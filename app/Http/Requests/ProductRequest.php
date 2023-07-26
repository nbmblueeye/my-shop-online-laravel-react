<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            "category_id"           => "required|integer",
            "brand_id"              => "required|integer",
            "name"                  => "required|string",
            "slug"                  => "required|string",
            "short_description"     => "nullable|string",
            "description"           => "nullable",

            "meta_title"            => "nullable|string",
            "meta_keyword"          => "nullable|string",
            "meta_description"      => "nullable|string",

            "price"                 => "required",
            "sell_price"            => "nullable",
            "quantity"              => "required|integer",
        ];
    }
}
