(function () {
    const cfg = window.FOOD_PLUG_CONFIG;

    // Always initialize the client as null first
    window.supabaseClient = null;

    // Create Supabase client
    if (
        window.supabase &&
        cfg?.SUPABASE_URL &&
        cfg?.SUPABASE_PUBLISHABLE_KEY
    ) {
        window.supabaseClient = window.supabase.createClient(
            cfg.SUPABASE_URL,
            cfg.SUPABASE_PUBLISHABLE_KEY
        );
    }

    // Get currently logged-in user
    window.getCurrentUser = async function () {
        if (!window.supabaseClient) {
            return null;
        }

        const {
            data,
            error
        } = await window.supabaseClient.auth.getUser();

        if (error) {
            console.error('Error getting current user:', error);
            return null;
        }

        return data?.user || null;
    };

    // Sign out user
    window.signOutUser = async function () {
        if (window.supabaseClient) {
            const { error } =
                await window.supabaseClient.auth.signOut();

            if (error) {
                console.error('Sign out error:', error);
            }
        }

        localStorage.removeItem('foodplug_current_user');

        window.location.href = 'login.html';
    };
})();
