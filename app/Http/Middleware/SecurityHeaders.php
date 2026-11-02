<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $nonce = base64_encode(random_bytes(16));
        $request->attributes->set('csp_nonce', $nonce);

        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy($nonce, $request->secure()));

        if ($request->secure() && app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000');
        }

        return $response;
    }

    private function contentSecurityPolicy(string $nonce, bool $secure): string
    {
        $isLocal = app()->environment('local');

        $scripts = ["'self'", "'nonce-".$nonce."'"];
        $connects = ["'self'"];
        $frames = [];

        if ($isLocal) {
            $dev = [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'ws://localhost:5173',
                'ws://127.0.0.1:5173',
            ];
            $scripts = array_merge($scripts, $dev);
            $connects = array_merge($connects, $dev);
        }

        if (config('services.turnstile.enabled')) {
            $scripts[] = 'https://challenges.cloudflare.com';
            $connects[] = 'https://challenges.cloudflare.com';
            $frames[] = 'https://challenges.cloudflare.com';
        }

        if (config('teto.company.map_embed_url')) {
            $frames[] = 'https://www.google.com';
            $frames[] = 'https://maps.google.com';
        }

        $directives = [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "img-src 'self' data:",
            "font-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            'script-src '.implode(' ', array_unique($scripts)),
            'connect-src '.implode(' ', array_unique($connects)),
        ];

        if ($frames !== []) {
            $directives[] = 'frame-src '.implode(' ', array_unique($frames));
        }

        if ($secure) {
            $directives[] = 'upgrade-insecure-requests';
        }

        return implode('; ', $directives).';';
    }
}
