import { NextRequest, NextResponse } from 'next/server';
import { bitunixFetch } from '@/lib/bitunix';
import { TransferRequest } from '@/lib/types';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const auth = await isAuthenticated();
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body: TransferRequest = await req.json();

        // Basic validation
        if (!body.amount || !body.currency || !body.fromAccountType || !body.toAccountType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Attempting internal transfer. 
        // Endpoint assumption based on common Bitunix/Exchange patterns: /api/spot/v1/transfer
        // If this is incorrect, it needs to be updated with the exact Bitunix docs endpoint.
        const data = await bitunixFetch<any>(
            '/api/spot/v1/transfer',
            'POST',
            body
        );

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Transfer API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
