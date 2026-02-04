'use server';

import { login, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction() {
    await login();
    redirect('/dashboard');
}

export async function logoutAction() {
    await logout();
    redirect('/login');
}
