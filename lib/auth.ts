import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'bitunix_dashboard_session';

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has(SESSION_COOKIE_NAME);
}

export async function login() {
    const cookieStore = await cookies();
    // In a real app, validating credentials would happen here.
    // For this dashboard, we set a simple session cookie.
    cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
