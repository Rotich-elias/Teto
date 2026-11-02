<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'service',
        'message',
        'ip',
        'user_agent',
    ];

    public function serviceName(): string
    {
        $service = collect(config('teto.services'))->firstWhere('slug', $this->service);

        return $service['name'] ?? $this->service;
    }
}
