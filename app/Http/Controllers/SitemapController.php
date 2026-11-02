<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = [
            ['url' => route('home'), 'priority' => '1.0', 'changefreq' => 'monthly'],
            ['url' => route('services.index'), 'priority' => '0.9', 'changefreq' => 'monthly'],
            ['url' => route('portfolio'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => route('about'), 'priority' => '0.7', 'changefreq' => 'yearly'],
            ['url' => route('contact'), 'priority' => '0.9', 'changefreq' => 'yearly'],
            ['url' => route('privacy'), 'priority' => '0.2', 'changefreq' => 'yearly'],
            ['url' => route('terms'), 'priority' => '0.2', 'changefreq' => 'yearly'],
        ];

        foreach (config('teto.services') as $service) {
            $urls[] = [
                'url' => route('services.show', $service['slug']),
                'priority' => '0.8',
                'changefreq' => 'monthly',
            ];
        }

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function robots(): Response
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            '',
            'Sitemap: '.route('sitemap'),
            '',
        ]);

        return response($content, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
