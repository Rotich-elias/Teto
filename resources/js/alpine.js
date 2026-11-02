import Alpine from '@alpinejs/csp';

/**
 * Contact form: progressive enhancement over a normal POST. Without
 * JavaScript the form still validates and redirects server-side.
 *
 * This module is loaded on demand by app.js the first time someone
 * interacts with the form, so Alpine does not delay the first paint of
 * every page on the site.
 */
Alpine.data('contactForm', () => ({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    consent: false,

    status: 'idle',
    success: false,
    failed: false,
    sending: false,
    feedback: '',
    errors: {},

    init() {
        const form = this.$refs.form;
        if (!form) {
            return;
        }

        const field = (name) => form.elements.namedItem(name);
        this.name = field('name')?.value ?? '';
        this.email = field('email')?.value ?? '';
        this.phone = field('phone')?.value ?? '';
        this.service = field('service')?.value ?? form.dataset.service ?? '';
        this.message = field('message')?.value ?? '';
        this.consent = Boolean(field('consent')?.checked);
    },

    async submit() {
        if (this.sending) {
            return;
        }

        const form = this.$refs.form;
        this.sending = true;
        this.success = false;
        this.failed = false;
        this.feedback = '';
        this.errors = {};

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: new FormData(form),
            });

            const payload = await response.json().catch(() => ({}));

            if (response.ok) {
                this.sending = false;
                this.success = true;
                this.status = 'success';
                this.feedback = payload.message ?? 'Thank you — your message has been sent.';

                form.reset();
                this.name = '';
                this.email = '';
                this.phone = '';
                this.service = form.dataset.service ?? '';
                this.message = '';
                this.consent = false;

                this.$nextTick(() => {
                    this.$refs.successPanel?.focus();
                });

                return;
            }

            this.sending = false;
            this.failed = true;
            this.status = 'error';

            if (response.status === 422 && payload.errors) {
                const mapped = {};
                Object.keys(payload.errors).forEach((key) => {
                    const value = payload.errors[key];
                    mapped[key] = Array.isArray(value) ? value[0] : value;
                });
                this.errors = mapped;
                this.feedback = payload.message ?? 'Please check the highlighted fields and try again.';

                this.$nextTick(() => {
                    const firstInvalid = form.querySelector('[aria-invalid="true"]');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });

                return;
            }

            if (response.status === 429) {
                this.feedback =
                    payload.message ??
                    'Too many messages from this connection. Please wait an hour or email us directly.';
                return;
            }

            this.feedback =
                payload.message ??
                'Something went wrong while sending your message. Please try again or email us directly.';
        } catch (error) {
            this.sending = false;
            this.failed = true;
            this.status = 'error';
            this.feedback =
                'We could not reach the server. Check your connection and try again, or email us directly.';
        }
    },

    reset() {
        this.success = false;
        this.failed = false;
        this.status = 'idle';
        this.feedback = '';
        this.errors = {};

        this.$nextTick(() => {
            this.$refs.form?.querySelector('input, select, textarea')?.focus();
        });
    },
}));

export function start() {
    window.Alpine = Alpine;
    Alpine.start();
}
