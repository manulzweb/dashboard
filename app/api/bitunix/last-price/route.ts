export async function GET() {
    try {
        const symbol = 'BTCUSDT'

        const res = await fetch(
            `https://openapi.bitunix.com/api/spot/v1/market/last_price?symbol=${symbol}`,
            { cache: 'no-store' }
        )

        const data = await res.json()

        return Response.json(data)
    } catch (error) {
        return Response.json(
            { error: 'Bitunix fetch failed', detail: String(error) },
            { status: 500 }
        )
    }
}
