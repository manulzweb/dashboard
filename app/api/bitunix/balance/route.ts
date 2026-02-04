import { NextResponse } from 'next/server';
import { bitunixFetch } from '@/lib/bitunix';
import { UserAccount } from '@/lib/types';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    const auth = await isAuthenticated();
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verified endpoint from prompt: /api/spot/v1/user/account
        const data = await bitunixFetch<UserAccount>('/api/spot/v1/user/account');
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
