import { GetMealBySlug } from "../route";

export async function GET(req, { params }) {
    const { slug } = await params;

    try {
        const meal = await GetMealBySlug(slug);
        if (!meal) {
            return new Response('Meal not found', { status: 404 });
        }
        return new Response(JSON.stringify(meal), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response('Failed to fetch meal', { status: 500 });
    }
}