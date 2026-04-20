<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:contact,support,admin',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:180',
            'subject' => 'nullable|string|max:180',
            'category' => 'nullable|string|max:80',
            'message' => 'required|string|max:5000',
        ]);

        $recipient = match ($validated['type']) {
            'support' => 'support@bougdim.com',
            'admin' => 'admin@bougdim.com',
            default => 'contact@bougdim.com',
        };

        $sender = match ($validated['type']) {
            'support' => 'support@bougdim.com',
            'admin' => 'admin@bougdim.com',
            default => 'contact@bougdim.com',
        };

        $subject = $validated['subject']
            ?: ($validated['type'] === 'support' ? 'New support request' : 'New contact message');

        $body = implode("\n", [
            "Name: {$validated['name']}",
            "Email: {$validated['email']}",
            'Category: ' . ($validated['category'] ?? '-'),
            '',
            'Message:',
            $validated['message'],
        ]);

        Mail::raw($body, function ($message) use ($recipient, $sender, $subject, $validated) {
            $message
                ->from($sender, 'Library BOUGDIM')
                ->to($recipient)
                ->replyTo($validated['email'], $validated['name'])
                ->subject($subject);
        });

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'Your message has been sent successfully.',
        ], 201);
    }
}
