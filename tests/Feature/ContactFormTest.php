<?php

namespace Tests\Feature;

use App\Mail\ContactAutoReply;
use App\Mail\ContactReceived;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['mail.to' => 'inbox@teto.test']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Jane Wanjiku',
            'email' => 'jane@example.co.ke',
            'phone' => '+254 712 345 678',
            'service' => 'web-development',
            'message' => 'We need a customer portal with M-Pesa payments and reporting.',
            'consent' => '1',
        ], $overrides);
    }

    public function test_a_valid_submission_is_stored_and_emails_are_sent(): void
    {
        Mail::fake();

        $response = $this
            ->withHeader('User-Agent', 'TetoTest/1.0')
            ->post(route('contact.store'), $this->validPayload());

        $response->assertRedirect(route('contact'));
        $response->assertSessionHas('status');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Jane Wanjiku',
            'email' => 'jane@example.co.ke',
            'phone' => '+254 712 345 678',
            'service' => 'web-development',
            'ip' => '127.0.0.1',
            'user_agent' => 'TetoTest/1.0',
        ]);

        Mail::assertSent(ContactReceived::class, function (ContactReceived $mail) {
            return $mail->hasTo('inbox@teto.test')
                && $mail->hasReplyTo('jane@example.co.ke');
        });

        Mail::assertSent(ContactAutoReply::class, function (ContactAutoReply $mail) {
            return $mail->hasTo('jane@example.co.ke');
        });
    }

    public function test_a_valid_json_submission_returns_a_json_response(): void
    {
        Mail::fake();

        $response = $this->postJson(route('contact.store'), $this->validPayload());

        $response->assertCreated();
        $response->assertJsonStructure(['message']);

        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_invalid_submissions_are_rejected_with_field_errors(): void
    {
        Mail::fake();

        $response = $this->from(route('contact'))->post(route('contact.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'service' => 'unknown-service',
            'message' => 'short',
        ]);

        $response->assertRedirect(route('contact'));
        $response->assertSessionHasErrors(['name', 'email', 'service', 'message', 'consent']);

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_invalid_json_submissions_return_422_with_errors(): void
    {
        $response = $this->postJson(route('contact.store'), []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['name', 'email', 'service', 'message', 'consent']);
    }

    public function test_the_honeypot_discards_bot_submissions_silently(): void
    {
        Mail::fake();

        $response = $this->post(route('contact.store'), $this->validPayload([
            'company_website' => 'https://spam.example',
        ]));

        $response->assertRedirect(route('contact'));
        $response->assertSessionHas('status');

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_the_contact_route_is_rate_limited_per_ip(): void
    {
        Mail::fake();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->post(route('contact.store'), $this->validPayload([
                'email' => "person{$attempt}@example.co.ke",
            ]))->assertRedirect(route('contact'));
        }

        $this->assertDatabaseCount('contact_messages', 5);

        $blocked = $this->post(route('contact.store'), $this->validPayload([
            'email' => 'blocked@example.co.ke',
        ]));

        $blocked->assertRedirect(route('contact'));
        $blocked->assertSessionHas('error');

        $this->assertDatabaseCount('contact_messages', 5);
    }

    public function test_json_rate_limit_returns_429(): void
    {
        Mail::fake();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson(route('contact.store'), $this->validPayload([
                'email' => "json{$attempt}@example.co.ke",
            ]))->assertCreated();
        }

        $this->postJson(route('contact.store'), $this->validPayload([
            'email' => 'json-blocked@example.co.ke',
        ]))->assertStatus(429)->assertJsonStructure(['message']);
    }

    public function test_service_name_is_resolved_from_config(): void
    {
        $message = new ContactMessage(['service' => 'payments-integration']);

        $this->assertSame('Payments Integration', $message->serviceName());
    }
}
