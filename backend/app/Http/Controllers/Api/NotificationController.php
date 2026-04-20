<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => Notification::with(['order'])
                ->where('user_id', $user?->id)
                ->latest()
                ->get(),
            'message' => 'The operation was successful',
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $user = $request->user();

        $notification = Notification::where('user_id', $user?->id)->findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json([
            'success' => true,
            'data' => $notification->fresh(['order']),
            'message' => 'The operation was successful',
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        Notification::where('user_id', $user?->id)->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
