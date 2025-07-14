import sequelize from "@/config/database";

export const GetMealDetail = async (searchText) => {
    try {
        await sequelize.authenticate();
        const likeQuery = `%${searchText}%`;

        const [meals] = await sequelize.query(`
            SELECT r.id, r.title, re.name FROM 
            Recipe r
            INNER JOIN Restaurant re ON re.id = r.restaurant_id 
            WHERE r.title LIKE ?`, {
            replacements: [likeQuery]
        });

        const [restaurants] = await sequelize.query(`
            SELECT id, name FROM Restaurant WHERE name LIKE ?`, {
            replacements: [likeQuery]
        });

        return { meals, restaurants };
    } catch (error) {
        console.error("Search API Error: ", error);
        return { meals: [], restaurants: [] };
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q');

    if (!query) {
        return new Response(JSON.stringify({ meals: [], restaurants: [] }), { status: 200 });
    }

    const result = await GetMealDetail(query);
    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
    });
}