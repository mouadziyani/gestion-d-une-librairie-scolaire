<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your account is ready</title>
</head>
<body style="margin:0; padding:0; background:#f7f5f0; color:#1a1a1a; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f5f0; margin:0; padding:34px 14px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; overflow:hidden; background:#ffffff; border:1px solid #eee4d7; border-radius:24px; box-shadow:0 24px 64px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="padding:28px 30px 20px; border-bottom:1px solid #f0ece6;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="vertical-align:middle;">
                                        <img src="{{ $logoUrl }}" width="112" alt="Library BOUGDIM" style="display:block; width:112px; max-width:112px; height:auto;">
                                    </td>
                                    <td align="right" style="vertical-align:middle; color:#8a8a8a; font-size:11px; font-weight:800; letter-spacing:1.4px; text-transform:uppercase;">
                                        New account
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:34px 30px 16px;">
                            <p style="margin:0 0 14px; color:#8a8a8a; font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;">Library BOUGDIM account</p>
                            <h1 style="margin:0; color:#111111; font-family:Georgia, 'Times New Roman', serif; font-size:42px; line-height:1.02; font-weight:700;">Welcome, {{ $userName }}</h1>
                            <p style="margin:22px 0 0; color:#555555; font-size:16px; line-height:1.8;">
                                Your Library BOUGDIM account has been created{{ $roleName ? ' with the '.$roleName.' role' : '' }}.
                                Use the login details below to access your dashboard.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:14px 30px 26px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf8f3; border:1px solid #eee4d7; border-radius:18px;">
                                <tr>
                                    <td style="padding:18px;">
                                        <p style="margin:0 0 10px; color:#5f4a31; font-size:13px; font-weight:800;">Email</p>
                                        <p style="margin:0 0 18px; color:#1a1a1a; font-size:15px; word-break:break-all;">{{ $email }}</p>
                                        <p style="margin:0 0 10px; color:#5f4a31; font-size:13px; font-weight:800;">Temporary password</p>
                                        <p style="margin:0; color:#1a1a1a; font-family:Consolas, 'Courier New', monospace; font-size:18px; font-weight:800; letter-spacing:0.5px; word-break:break-all;">{{ $password }}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 30px 28px;">
                            <a href="{{ $loginUrl }}" style="display:inline-block; background:#1a1a1a; color:#ffffff; text-decoration:none; padding:17px 28px; border-radius:999px; font-size:13px; font-weight:800; letter-spacing:0.4px; text-transform:uppercase; box-shadow:0 14px 30px rgba(26,26,26,0.18);">
                                Log in now
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 30px 32px;">
                            <p style="margin:0; color:#888888; font-size:12px; line-height:1.7;">
                                For security, change this password after your first login from your profile settings.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:20px 30px; background:#1a1a1a; color:#ffffff;">
                            <p style="margin:0; color:rgba(255,255,255,0.72); font-size:12px; line-height:1.7;">
                                Books, stationery, and school essentials in one calm place.
                            </p>
                            <p style="margin:8px 0 0; color:#ffffff; font-size:13px; font-weight:800;">Library BOUGDIM</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
