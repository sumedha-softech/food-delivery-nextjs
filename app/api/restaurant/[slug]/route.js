import { GetRestaurantBySlug } from "../route";

export async function GET(req, { params }) {
    const { slug } = await params;

    try {
        const restaurant = await GetRestaurantBySlug(slug);
        if (!restaurant) {
            return new Response('Restaurant not found', { status: 404 });
        }

        return new Response(JSON.stringify(restaurant), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response('Failed to fetch restaurant', { status: 500 });
    }
}