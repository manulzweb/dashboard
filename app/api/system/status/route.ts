import { NextResponse } from 'next/server';

export async function GET() {
    const rawKey = process.env.BITUNIX_API_KEY || '';
    const hasKey = !!rawKey;
    const hasSecret = !!process.env.BITUNIX_API_SECRET;

    const trimmedKey = rawKey.trim();
    const keyLength = trimmedKey.length;

    // Return the first 4 characters to help the user verify they copied the right key
    // e.g. "2078..."
    const keyPrefix = hasKey ? trimmedKey.substring(0, 4) + '...' : 'NONE';

    return NextResponse.json({
        configured: hasKey && hasSecret,
        keyPresent: hasKey,
        secretPresent: hasSecret,
        keyLengthValid: keyLength > 10,
        keyPrefix: keyPrefix
    });
}
