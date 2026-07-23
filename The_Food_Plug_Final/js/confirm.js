document.addEventListener('DOMContentLoaded', async () => {
    const status = document.querySelector('#confirmStatus');

    if (!status) {
        console.error('Confirmation status element not found.');
        return;
    }

    // Make sure the Supabase client is available
    if (!window.supabaseClient) {
        status.textContent =
            'Supabase is not available. Please reopen the confirmation link from your email.';
        return;
    }

    try {
        const url = new URL(window.location.href);

        // Supabase PKCE confirmation flow:
        // /confirm.html?code=xxxxxxxx
        const code = url.searchParams.get('code');

        if (code) {
            status.textContent = 'Confirming your email...';

            // Exchange the confirmation code for a Supabase session
            const { data, error } =
                await window.supabaseClient.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Email confirmation error:', error);

                status.textContent =
                    'We could not confirm your email. The confirmation link may have expired or already been used. Please request a new confirmation email.';

                return;
            }

            if (data && data.session) {
                status.textContent =
                    'Your email has been confirmed successfully. You are now signed in.';

                // Remove the confirmation code from the browser URL
                // without refreshing the page.
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

                // Give the user time to see the success message
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1200);

                return;
            }
        }

        // Check whether a session already exists
        const {
            data: sessionData,
            error: sessionError
        } = await window.supabaseClient.auth.getSession();

        if (sessionError) {
            console.error('Session error:', sessionError);

            status.textContent =
                'We could not verify your confirmation. Please request a new confirmation email.';

            return;
        }

        if (sessionData && sessionData.session) {
            status.textContent =
                'Your email has been confirmed successfully. You are now signed in.';

            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1200);

            return;
        }

        // No confirmation code and no active session
        status.textContent =
            'Your email confirmation was processed. You can now log in to your account.';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error('Unexpected confirmation error:', error);

        status.textContent =
            'Something went wrong while confirming your email. Please request a new confirmation email.';
    }
});
