document.addEventListener('DOMContentLoaded', () => {
    const signup = document.querySelector('#signupForm');
    const login = document.querySelector('#loginForm');

    /*
     * The Supabase email confirmation link will return
     * the user to the confirm.html page on the same domain
     * where the signup was completed.
     *
     * Example:
     * https://your-site.vercel.app/confirm.html
     */
    const redirectUrl = () => {
        return `${window.location.origin}/confirm.html`;
    };

    // ==========================================
    // SIGNUP
    // ==========================================

    signup?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const f = new FormData(signup);

        const email = f.get('email');
        const password = f.get('password');
        const confirmPassword = f.get('confirmPassword');

        // Check passwords
        if (password !== confirmPassword) {
            return toast('Passwords do not match');
        }

        const profile = {
            fullname: f.get('fullname'),
            phone: f.get('phone'),
            address: f.get('address')
        };

        // ==========================================
        // SUPABASE AUTHENTICATION
        // ==========================================

        if (window.supabaseClient) {
            try {
                const { data, error } =
                    await window.supabaseClient.auth.signUp({
                        email: email,
                        password: password,

                        options: {
                            // Store additional user information
                            // in Supabase Auth metadata
                            data: profile,

                            // Where Supabase sends the user
                            // after clicking the confirmation email
                            emailRedirectTo: redirectUrl()
                        }
                    });

                // Signup error
                if (error) {
                    console.error('Signup error:', error);
                    return toast(error.message);
                }

                // ==========================================
                // EMAIL CONFIRMATION DISABLED
                // User is immediately signed in
                // ==========================================

                if (data?.user && data?.session) {

                    // Create/update the user's profile
                    const { error: profileError } =
                        await window.supabaseClient
                            .from('profiles')
                            .upsert({
                                id: data.user.id,
                                full_name: profile.fullname,
                                phone: profile.phone,
                                address: profile.address
                            });

                    if (profileError) {
                        console.error(
                            'Profile creation error:',
                            profileError
                        );
                    }

                    window.location.href = 'profile.html';
                    return;
                }

                // ==========================================
                // EMAIL CONFIRMATION REQUIRED
                // User needs to check their email
                // ==========================================

                window.location.href =
                    'confirm-email.html?email=' +
                    encodeURIComponent(email);

            } catch (error) {
                console.error('Unexpected signup error:', error);

                toast(
                    'Something went wrong while creating your account. Please try again.'
                );
            }

            return;
        }

        // ==========================================
        // FALLBACK LOCAL STORAGE AUTHENTICATION
        // Used only if Supabase is unavailable
        // ==========================================

        const users = JSON.parse(
            localStorage.getItem('foodplug_users') || '[]'
        );

        if (
            users.some(
                (u) =>
                    u.email.toLowerCase() === email.toLowerCase()
            )
        ) {
            return toast(
                'An account with that email already exists'
            );
        }

        const newUser = {
            email: email,
            password: password,
            ...profile
        };

        users.push(newUser);

        localStorage.setItem(
            'foodplug_users',
            JSON.stringify(users)
        );

        localStorage.setItem(
            'foodplug_current_user',
            JSON.stringify(newUser)
        );

        window.location.href = 'profile.html';
    });


    // ==========================================
    // LOGIN
    // ==========================================

    login?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = login.email.value;
        const password = login.password.value;

        // ==========================================
        // SUPABASE LOGIN
        // ==========================================

        if (window.supabaseClient) {
            try {
                const { data, error } =
                    await window.supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) {
                    console.error('Login error:', error);
                    return toast(error.message);
                }

                if (data?.session) {
                    window.location.href = 'profile.html';
                    return;
                }

            } catch (error) {
                console.error(
                    'Unexpected login error:',
                    error
                );

                toast(
                    'Something went wrong while logging in. Please try again.'
                );
            }

            return;
        }

        // ==========================================
        // FALLBACK LOCAL STORAGE LOGIN
        // ==========================================

        const users = JSON.parse(
            localStorage.getItem('foodplug_users') || '[]'
        );

        const user = users.find(
            (u) =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.password === password
        );

        if (!user) {
            return toast('Invalid email or password');
        }

        localStorage.setItem(
            'foodplug_current_user',
            JSON.stringify(user)
        );

        window.location.href = 'profile.html';
    });
});
