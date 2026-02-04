import crypto from 'crypto';
import { BitunixResponse } from './types';

const API_KEY = process.env.BITUNIX_API_KEY;
const API_SECRET = process.env.BITUNIX_API_SECRET;
const BASE_URL = 'https://openapi.bitunix.com'; // Verify if this is the correct base URL for Bitunix

if (!API_KEY || !API_SECRET) {
    console.error('Missing BITUNIX_API_KEY or BITUNIX_API_SECRET in environment variables');
}

/**
 * Generates the HMAC SHA256 signature for Bitunix API
 * payload = timestamp + HTTP_METHOD + requestPath + body
 */
function generateSignature(timestamp: string, method: string, path: string, body: string = ''): string {
    const payload = timestamp + method.toUpperCase() + path + body;
    const hmac = crypto.createHmac('sha256', API_SECRET || '');
    return hmac.update(payload).digest('hex');
}

/**
 * Secure server-side fetch wrapper for Bitunix
 */
export async function bitunixFetch<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, any>
): Promise<BitunixResponse<T>> {
    if (!API_KEY || !API_SECRET) {
        throw new Error('Server configuration error: Missing API keys');
    }

    const timestamp = Date.now().toString();
    const requestPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${requestPath}`;

    const bodyString = body ? JSON.stringify(body) : '';

    const signature = generateSignature(timestamp, method, requestPath, bodyString);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-BX-APIKEY': API_KEY,
        'X-BX-TIMESTAMP': timestamp,
        'X-BX-SIGNATURE': signature,
    };

    const options: RequestInit = {
        method,
        headers,
        cache: 'no-store', // Ensure fresh data
    };

    if (method === 'POST' && body) {
        options.body = bodyString;
    }

    console.log(`[Bitunix] Fetching ${method} ${url}`);

    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[Bitunix] Error ${res.status}: ${errorText}`);
            throw new Error(`Bitunix API error: ${res.status} ${res.statusText}`);
        }

        const data: BitunixResponse<T> = await res.json();
        return data;
    } catch (error) {
        console.error('[Bitunix] Network or Parsing Error:', error);
        throw error;
    }
}
