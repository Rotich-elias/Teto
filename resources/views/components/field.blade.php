@props([
    'name',
    'label',
    'type' => 'text',
    'required' => false,
    'value' => null,
    'hint' => null,
    'placeholder' => null,
    'autocomplete' => null,
    'options' => [],
    'rows' => 6,
])

@php
    $id = $attributes->get('id', $name);
    $serverError = $errors->first($name);
    $describedBy = collect([
        $hint ? $id.'-hint' : null,
        $serverError ? $id.'-error' : null,
        $id.'-error-client',
    ])->filter()->implode(' ');
@endphp

<div>
    <label for="{{ $id }}" class="field-label">
        {{ $label }}
        @if ($required)
            <span class="text-red-600 dark:text-red-400" aria-hidden="true">*</span>
            <span class="sr-only">(required)</span>
        @endif
    </label>

    @if ($type === 'textarea')
        <textarea id="{{ $id }}"
                  name="{{ $name }}"
                  rows="{{ $rows }}"
                  @if ($required) required @endif
                  @if ($placeholder) placeholder="{{ $placeholder }}" @endif
                  aria-invalid="{{ $serverError ? 'true' : 'false' }}"
                  x-bind:aria-invalid="errors.{{ $name }} ? 'true' : ({{ $serverError ? 'true' : 'false' }} ? 'true' : null)"
                  aria-describedby="{{ $describedBy }}"
                  {{ $attributes->except(['id', 'name', 'type'])->merge(['class' => 'field-input']) }}>{{ old($name, $value) }}</textarea>
    @elseif ($type === 'select')
        <select id="{{ $id }}"
                name="{{ $name }}"
                @if ($required) required @endif
                aria-invalid="{{ $serverError ? 'true' : 'false' }}"
                x-bind:aria-invalid="errors.{{ $name }} ? 'true' : ({{ $serverError ? 'true' : 'false' }} ? 'true' : null)"
                aria-describedby="{{ $describedBy }}"
                {{ $attributes->except(['id', 'name', 'type'])->merge(['class' => 'field-input appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10']) }}
                style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E&quot;)">
            @foreach ($options as $optionValue => $optionLabel)
                <option value="{{ $optionValue }}" @selected((string) old($name, $value) === (string) $optionValue)>
                    {{ $optionLabel }}
                </option>
            @endforeach
        </select>
    @else
        <input id="{{ $id }}"
               name="{{ $name }}"
               type="{{ $type }}"
               @if ($required) required @endif
               @if ($placeholder) placeholder="{{ $placeholder }}" @endif
               @if ($autocomplete) autocomplete="{{ $autocomplete }}" @endif
               value="{{ old($name, $value) }}"
               aria-invalid="{{ $serverError ? 'true' : 'false' }}"
               x-bind:aria-invalid="errors.{{ $name }} ? 'true' : ({{ $serverError ? 'true' : 'false' }} ? 'true' : null)"
               aria-describedby="{{ $describedBy }}"
               {{ $attributes->except(['id', 'name', 'type', 'value'])->merge(['class' => 'field-input']) }}>
    @endif

    @if ($hint)
        <p id="{{ $id }}-hint" class="field-hint">{{ $hint }}</p>
    @endif

    @if ($serverError)
        <p id="{{ $id }}-error" class="field-error">
            <x-icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />
            <span>{{ $serverError }}</span>
        </p>
    @endif

    <p id="{{ $id }}-error-client" class="field-error" x-show="errors.{{ $name }}" x-text="errors.{{ $name }}" x-cloak></p>
</div>
