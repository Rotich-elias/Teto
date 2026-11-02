<?php

namespace Tests\Feature;

use Tests\TestCase;

class PageTest extends TestCase
{
    public function test_home_page_renders_with_primary_content(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Software and networks that', false);
        $response->assertSee('Teto Technologies');
        $response->assertSee('Get a Quote');
        $response->assertSee('application/ld+json', false);
    }

    public function test_services_page_and_each_service_detail_page_render(): void
    {
        $this->get(route('services.index'))
            ->assertOk()
            ->assertSee('Software, payments and networks');

        foreach (config('teto.services') as $service) {
            $this->get(route('services.show', $service['slug']))
                ->assertOk()
                ->assertSee($service['name'])
                ->assertSee($service['meta_description']);
        }
    }

    public function test_unknown_service_slug_returns_not_found(): void
    {
        $this->get('/services/does-not-exist')->assertNotFound();
    }

    public function test_secondary_pages_render(): void
    {
        $pages = [
            'portfolio' => 'Work we can talk about',
            'about' => 'A Kenyan technology company',
            'contact' => "Let's talk about your project",
            'privacy' => 'Privacy Policy',
            'terms' => 'Terms of Use',
        ];

        foreach ($pages as $route => $text) {
            $this->get(route($route))->assertOk()->assertSee($text, false);
        }
    }

    public function test_contact_page_preselects_a_valid_service_from_the_query_string(): void
    {
        $response = $this->get(route('contact', ['service' => 'web-development']));

        $response->assertOk();
        $response->assertSee('value="web-development" selected', false);
    }

    public function test_contact_page_ignores_an_unknown_service_query_string(): void
    {
        $response = $this->get(route('contact', ['service' => 'not-a-service']));

        $response->assertOk();
        $response->assertDontSee('value="not-a-service" selected', false);
    }

    public function test_404_page_is_friendly_and_noindex(): void
    {
        $this->get('/this-page-does-not-exist')
            ->assertNotFound()
            ->assertSee('That page is not here')
            ->assertSee('noindex, follow', false);
    }

    public function test_sitemap_lists_every_page(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $response->assertSee(route('home'), false);

        foreach (config('teto.services') as $service) {
            $response->assertSee(route('services.show', $service['slug']), false);
        }
    }

    public function test_robots_txt_points_to_the_sitemap(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertOk();
        $response->assertSee('Sitemap: '.route('sitemap'), false);
        $response->assertSee('Allow: /', false);
    }

    public function test_security_headers_are_present(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        $csp = $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString('nonce-', $csp);
        $this->assertStringNotContainsString("'unsafe-eval'", $csp);
    }
}
