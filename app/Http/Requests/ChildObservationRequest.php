<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChildObservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'behavior_name'     => 'required|string|max:255',
            'observation_count' => 'required|in:1st,2nd,3rd,4th',
            'comment'           => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'child_id.required' => 'Child selection is required.',
            'child_id.exists' => 'Selected child is invalid.',
            'behavior_name.required' => 'Behavior name is required.',
            'observation_count.required' => 'Observation count is required.',
            'observation_count.in' => 'Please select a valid observation count (1st, 2nd, 3rd, or 4th).',
        ];
    }
}