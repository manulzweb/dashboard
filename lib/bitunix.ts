import crypto from 'crypto';
import { BitunixResponse } from './types';

const API_KEY = process.env.BITUNIX_API_KEY?.trim();
const API_SECRET = process.env.BITUNIX_API_SECRET?.trim();
const BASE_URL = 'https://openapi.bitunix.com';

if (!API_KEY || !API_SECRET) {
    console.error('Missing BITUNIX_API_KEY or BITUNIX_API_SECRET in environment variables');
}

/**
 * SHA256 Helper
 */
function sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generates the Double-SHA256 signature for Bitunix API
 * Step 1. digest = sha256(nonce + timestamp + api-key + queryParams + body)
 * Step 2. sign = sha256(digest + secretKey)
 */
function generateSignature(nonce: string, timestamp: string, body: string = ''): string {
    // Note: Query params are empty for current endpoints, so just skipping them in this implementation
    // If needed later, they must be sorted and appended here.

    // Step 1: Create Digest
    // payload = nonce + timestamp + api-key + queryParams(empty) + body
    const digestInput = nonce + timestamp + API_KEY + body;
    const digest = sha256(digestInput);

    // Step 2: Create Signature
    // sign = sha256(digest + secretKey)
    const signInput = digest + API_SECRET;
    const signature = sha256(signInput);

    return signature;
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
    const nonce = crypto.randomBytes(16).toString('hex'); // 32 characters
    const requestPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${requestPath}`;

    const bodyString = body ? JSON.stringify(body) : '';

    // Generate Signature with new Double-SHA256 Algorithm
    const signature = generateSignature(nonce, timestamp, bodyString);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
        'timestamp': timestamp,
        'sign': signature,
        'nonce': nonce,
    };

    const options: RequestInit = {
        method,
        headers,
        cache: 'no-store',
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
