import sequelize from "@/config/database";
import { Restaurant } from "@/models";

export const GetRestaurant = async () => {
    await sequelize.authenticate();
    return await Restaurant.findAll();
}

export const InsertRestaurant = async (restaurantData) => {
    try {
        await sequelize.authenticate();

        // await Restaurant.sync({ alter: true });

        const existingRestaurant = await Restaurant.findOne({
            where: {
                name: restaurantData.name
            }
        });

        if (existingRestaurant) {
            return new Response('Meal already exists', { status: 409 });
        }

        const newRestaurant = await Restaurant.create({
            name: restaurantData.name,
            email: restaurantData.email,
            image: restaurantData.image,
            description: restaurantData.description,
            location: restaurantData.location,
            lat: restaurantData.lat,
            lng: restaurantData.lng,
            rating: restaurantData.rating
        });

        return new Response(JSON.stringify(newRestaurant), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to insert restaurant', { status: 500 });
    }
}

export const GetRestaurantBySlug = async (resturantName) => {
    try {
        await sequelize.authenticate();

        const [rows] = await sequelize.query(`
            SELECT
                r.id, r.name, r.email, r.image, r.description, r.location, r.lat, r.lng, r.rating, re.id AS recipeId, re.title AS recipeTitle, re.summary AS recipeSummary, re.image AS recipeImage, re.price AS recipePrice
            FROM restaurant r
            LEFT OUTER JOIN recipe re ON re.restaurant_id = r.id
            WHERE LOWER(REPLACE(REPLACE(REPLACE(r.name, ' ', '-'), '''', ''), '&', '')) = ?
            `, { replacements: [resturantName] });

        if (rows.length === 0) return null;

        const { id, name, email, image, description, location, lat, lng, rating } = rows[0]

        const recipes = rows
            .filter(row => row.recipeId !== null)
            .map(row => ({
                id: row.recipeId,
                title: row.recipeTitle,
                summary: row.recipeSummary,
                image: row.recipeImage,
                price: row.recipePrice
            }));

        return {
            id,
            name,
            email,
            image,
            description,
            location,
            lat,
            lng,
            rating,
            recipes
        };

    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

export const GetRestaurantNameAndImage = async () => {
    try {
        await sequelize.authenticate();
        const restaurants = await Restaurant.findAll({
            attributes: ['id', 'name', 'image'],
            raw: true
        });
        return Response.json(restaurants)
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch name & image restaurants", { status: 500 });
    }
}

export const UpdateRestaurant = async (restaurantData) => {
    try {
        await sequelize.authenticate();

        // await Restaurant.sync({ alter: true });

        const [affectedCount] = await Restaurant.update(
            {
                name: restaurantData.name,
                email: restaurantData.email,
                image: restaurantData.image,
                description: restaurantData.description,
                location: restaurantData.location,
                lat: restaurantData.lat,
                lng: restaurantData.lng,
                rating: restaurantData.rating
            },
            {
                where: { id: restaurantData.id }
            });

        if (affectedCount === 0) {
            return new Response('Restaurant not found', { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, updated: affectedCount }), {
            status: 200
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to update Restaurant', { status: 500 });
    }
}

// === API handler ===
export const GET = async () => {
    try {
        const restaurants = await GetRestaurant();
        return Response.json(restaurants);
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch restaurants", { status: 500 });
    }
}