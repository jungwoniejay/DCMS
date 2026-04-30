<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChildCareInformationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'child_id' => 'required|exists:children,id',
            'feeding_food_selection' => 'nullable|array',
            'feeding_appetite' => 'nullable|in:Good,Fair,Poor',
            'feeding_custom' => 'nullable|string|max:1000',
            'sleeping_duration' => 'nullable|string|max:255',
            'sleeping_quality' => 'nullable|in:Good,Fair,Poor',
            'sleeping_custom' => 'nullable|string|max:1000',
            'bathing_frequency' => 'nullable|string|max:255',
            'bathing_assistance' => 'nullable|in:Independent,Assisted',
            'bathing_custom' => 'nullable|string|max:1000',
            'toileting_frequency' => 'nullable|string|max:255',
            'toileting_assistance' => 'nullable|in:Independent,Assisted',
            'toileting_custom' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'child_id.required' => 'Child selection is required.',
            'child_id.exists' => 'Selected child is invalid.',
            'feeding_appetite.in' => 'Please select a valid appetite rating.',
            'sleeping_quality.in' => 'Please select a valid sleep quality.',
            'bathing_assistance.in' => 'Please select valid bathing assistance level.',
            'toileting_assistance.in' => 'Please select valid toileting assistance level.',
        ];
    }
}