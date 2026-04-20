<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return $this->passwordResetUrl($notifiable, $token);
        });

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $url = $this->passwordResetUrl($notifiable, $token);

            return (new MailMessage)
                ->subject('Reset your Library BOUGDIM password')
                ->view(
                    ['emails.auth.reset-password', 'emails.auth.reset-password-text'],
                    [
                        'userName' => $notifiable->name ?: 'there',
                        'resetUrl' => $url,
                        'logoUrl' => asset('images/library.png'),
                        'expiresIn' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire'),
                    ]
                );
        });
    }

    private function passwordResetUrl(object $notifiable, string $token): string
    {
        return rtrim(config('app.frontend_url'), '/').'/reset-password?'.http_build_query([
            'token' => $token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ]);
    }
}
