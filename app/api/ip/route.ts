import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const h = await headers()
    const forwardedFor = h.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] || 'unknown'

    return NextResponse.json({
        ip,
        raw: forwardedFor
    })
}
