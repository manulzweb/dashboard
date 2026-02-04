import { NextRequest, NextResponse } from 'next/server';
import { bitunixFetch } from '@/lib/bitunix';
import { WithdrawalRequest } from '@/lib/types';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const auth = await isAuthenticated();
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body: WithdrawalRequest = await req.json();

        // Basic validation
        if (!body.amount || !body.currency || !body.address || !body.chain) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Endpoint assumption: /api/spot/v1/withdraw/apply
        const data = await bitunixFetch<any>(
            '/api/spot/v1/withdraw/apply',
            'POST',
            body
        );

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Withdraw API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
