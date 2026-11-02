<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactAutoReply;
use App\Mail\ContactReceived;
use App\Models\ContactMessage;
use App\Services\Turnstile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class ContactController extends Controller
{
    public function store(ContactRequest $request, Turnstile $turnstile): JsonResponse|RedirectResponse
    {
        $data = $request->validated();

        if (Turnstile::enabled() && ! $turnstile->verify(
            $request->input('cf-turnstile-response'),
            $request->ip()
        )) {
            throw ValidationException::withMessages([
                'cf-turnstile-response' => 'Please complete the verification challenge and try again.',
            ]);
        }

        $message = ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'service' => $data['service'],
            'message' => $data['message'],
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
        ]);

        $this->sendNotifications($message);

        $feedback = 'Thank you — your message has been received. We will get back to you as soon as we can.';

        if ($request->expectsJson()) {
            return response()->json(['message' => $feedback], 201);
        }

        return redirect()
            ->route('contact')
            ->with('status', $feedback);
    }

    private function sendNotifications(ContactMessage $message): void
    {
        try {
            $companyInbox = config('mail.to');

            if ($companyInbox) {
                Mail::to($companyInbox)->send(new ContactReceived($message));
            } else {
                Log::warning('Contact notification not sent: MAIL_TO is not configured.');
            }

            Mail::to($message->email)->send(new ContactAutoReply($message));
        } catch (Throwable $exception) {
            // The enquiry is already stored; a mail outage must not lose it.
            Log::error('Contact notification failed.', [
                'contact_message_id' => $message->id,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
