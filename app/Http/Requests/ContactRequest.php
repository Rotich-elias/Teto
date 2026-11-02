<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'string', 'email:rfc', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40', 'regex:/^[0-9+()\-\s.]{7,40}$/'],
            'service' => ['required', 'string', Rule::in(array_column(config('teto.services'), 'slug'))],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'consent' => ['accepted'],
            // Honeypot: real users never see or fill this field.
            'company_website' => ['prohibited'],
            'cf-turnstile-response' => ['nullable', 'string', 'max:2048'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please tell us your name.',
            'name.min' => 'Please enter at least 2 characters for your name.',
            'email.required' => 'Please enter your email address so we can reply.',
            'email.email' => 'Please enter a valid email address.',
            'phone.regex' => 'Please enter a valid phone number, for example +254 7XX XXX XXX.',
            'service.required' => 'Please choose the service you are interested in.',
            'service.in' => 'Please choose one of the listed services.',
            'message.required' => 'Please tell us a little about your project.',
            'message.min' => 'Please give us at least 10 characters so we can help.',
            'message.max' => 'Please keep your message under 5,000 characters.',
            'consent.accepted' => 'Please confirm that we may use your details to respond to this enquiry.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'name',
            'email' => 'email address',
            'phone' => 'phone number',
            'service' => 'service',
            'message' => 'message',
            'consent' => 'consent',
        ];
    }

    /**
     * Silently accept and discard honeypot submissions instead of
     * returning validation errors that help bots tune their payloads.
     */
    protected function failedValidation(Validator $validator): void
    {
        if ($this->filled('company_website')) {
            Log::info('Contact form honeypot triggered.', [
                'ip' => $this->ip(),
                'user_agent' => $this->userAgent(),
            ]);

            $feedback = 'Thank you — your message has been received.';

            throw new HttpResponseException(
                $this->expectsJson()
                    ? response()->json(['message' => $feedback], 201)
                    : redirect()->route('contact')->with('status', $feedback)
            );
        }

        parent::failedValidation($validator);
    }
}
