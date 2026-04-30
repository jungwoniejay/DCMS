<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParentInvolvementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'child_id' => 'required|exists:children,id',
            'parent_name' => 'nullable|string|max:255',
            'parent_relationship' => 'nullable|in:Mother,Father,Guardian',
            'parent_contact' => 'nullable|string|max:255',
            'parent_email' => 'nullable|email|max:255',
            'support_roles' => 'nullable|array',
            'additional_notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'child_id.required' => 'Child selection is required.',
            'child_id.exists' => 'Selected child is invalid.',
            'parent_relationship.in' => 'Please select a valid relationship.',
            'parent_email.email' => 'Please enter a valid email address.',
        ];
    }
}