<x-mail::message>
# Thanks for getting in touch, {{ $contactMessage->name }}

We have received your message about **{{ $serviceName }}** and will get back to you as soon as we can.

**Your message:**

{{ $contactMessage->message }}

If you need to add anything, just reply to this email.

Thanks,<br>
{{ config('teto.company.name') }}
@if (config('teto.company.email'))
{{ config('teto.company.email') }}
@endif
</x-mail::message>
