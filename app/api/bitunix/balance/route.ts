export const runtime = 'nodejs'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function GET() {
    const API_KEY = process.env.BITUNIX_API_KEY!
    const API_SECRET = process.env.BITUNIX_API_SECRET!

    const timestamp = Date.now().toString()
    const method = 'GET'
    const requestPath = '/api/spot/v1/user/account'

    const preSign = timestamp + method + requestPath

    const signature = crypto
        .createHmac('sha256', API_SECRET)
        .update(preSign)
        .digest('hex')

    const res = await fetch(`https://api.bitunix.com${requestPath}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; BitunixBot/1.0)',
            'Origin': 'https://www.bitunix.com',
            'Referer': 'https://www.bitunix.com/',
            'X-BITUNIX-APIKEY': API_KEY,
            'X-BITUNIX-SIGN': signature,
            'X-BITUNIX-TIMESTAMP': timestamp
        }
    })

    const text = await res.text()

    return NextResponse.json({
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        raw: text
    })
}
