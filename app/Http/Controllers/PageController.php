<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class PageController extends Controller
{
    public function home(): View
    {
        return view('pages.home', [
            'services' => config('teto.services'),
            'portfolio' => config('teto.portfolio'),
        ]);
    }

    public function services(): View
    {
        return view('pages.services', [
            'services' => config('teto.services'),
        ]);
    }

    public function service(string $slug): View
    {
        $service = collect(config('teto.services'))->firstWhere('slug', $slug);

        abort_if($service === null, 404);

        $related = collect(config('teto.services'))
            ->where('slug', '!=', $slug)
            ->take(3)
            ->values();

        return view('pages.service', [
            'service' => $service,
            'related' => $related,
        ]);
    }

    public function portfolio(): View
    {
        return view('pages.portfolio', [
            'portfolio' => config('teto.portfolio'),
        ]);
    }

    public function about(): View
    {
        return view('pages.about', [
            'values' => config('teto.values'),
            'process' => config('teto.process'),
        ]);
    }

    public function contact(): View
    {
        $requested = request()->string('service')->toString();
        $validSlugs = array_column(config('teto.services'), 'slug');

        return view('pages.contact', [
            'services' => config('teto.services'),
            'selectedService' => in_array($requested, $validSlugs, true) ? $requested : '',
        ]);
    }

    public function privacy(): View
    {
        return view('pages.privacy');
    }

    public function terms(): View
    {
        return view('pages.terms');
    }
}
