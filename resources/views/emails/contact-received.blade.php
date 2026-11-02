<x-mail::message>
# New project enquiry

**Name:** {{ $contactMessage->name }}
**Email:** {{ $contactMessage->email }}
**Phone:** {{ $contactMessage->phone ?: 'Not provided' }}
**Service:** {{ $serviceName }}
**Received:** {{ $contactMessage->created_at?->toDayDateTimeString() }} ({{ config('app.timezone') }})
**IP address:** {{ $contactMessage->ip ?: 'Unknown' }}

**Message:**

{{ $contactMessage->message }}

<x-mail::button :url="'mailto:'.$contactMessage->email">
Reply to {{ $contactMessage->name }}
</x-mail::button>

The enquiry is stored in the `contact_messages` table (ID: {{ $contactMessage->id }}).
</x-mail::message>
