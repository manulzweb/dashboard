import { NextResponse } from 'next/server';

export async function GET() {
    const hasKey = !!process.env.BITUNIX_API_KEY;
    const hasSecret = !!process.env.BITUNIX_API_SECRET;

    // Basic validation length check (Bitunix keys are usually long)
    const keyLength = process.env.BITUNIX_API_KEY?.length || 0;

    return NextResponse.json({
        configured: hasKey && hasSecret,
        keyPresent: hasKey,
        secretPresent: hasSecret,
        keyLengthValid: keyLength > 10 // Basic sanity check
    });
}
