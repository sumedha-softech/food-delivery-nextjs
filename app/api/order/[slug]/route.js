import { GetOrderByOrderId } from '../route';

export async function GET(req, { params }) {
    const { slug } = await params;

    try {
        const order = await GetOrderByOrderId(slug);
        if (!order) {
            return new Response('order not found', { status: 404 });
        }

        return new Response(JSON.stringify(order), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response('Failed to fetch order', { status: 500 });
    }
}