import { Recipe } from "@/models";
import sequelize from "@/config/database";

export const GetMeals = async () => {
    try {
        await sequelize.authenticate();
        const [recipes] = await sequelize.query(`
            SELECT r.*, res.name AS restaurant_name
    FROM Recipe r
    JOIN (
        SELECT restaurant_id, MIN(id) AS min_id
        FROM Recipe
        GROUP BY restaurant_id
    ) AS grouped ON r.id = grouped.min_id
    JOIN Restaurant res ON r.restaurant_id = res.id
        `);

        return recipes.map(recipe => ({
            ...recipe,
            restaurant: { name: recipe.restaurant_name },
        }));
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const GetImagesOfMeals = async () => {
    try {
        await sequelize.authenticate();
        const recipe = await Recipe.findAll({
            attributes: ['title', 'image'],
            raw: true
        });
        return recipe
    } catch (err) {
        console.error(err);
        return new Response('Failed to fetch recipe', { status: 500 });
    }
}

export const InsertMeals = async (mealData) => {
    try {
        await sequelize.authenticate();

        const existingRecipe = await Recipe.findOne({
            where: {
                title: mealData.name,
                restaurant_id: mealData.restaurantId
            }
        });

        if (existingRecipe) {
            return new Response('Meal already exists', { status: 409 });
        }

        const newRecipe = await Recipe.create({
            title: mealData.name,
            restaurant_id: mealData.restaurantId,
            summary: mealData.description,
            price: mealData.price,
            image: mealData.image
        });

        return new Response(JSON.stringify(newRecipe), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to insert meal', { status: 500 });
    }
}

export const GetMealsByRestaurantName = async (resturantName) => {
    try {
        await sequelize.authenticate();
        const [rows] = await sequelize.query(`
            SELECT
                re.id AS recipeId, re.title AS recipeTitle, re.image AS recipeImage, re.summary AS recipeSummary, re.price AS recipePrice
            FROM Recipe re
            INNER JOIN Restaurant r ON r.id = re.restaurant_id
            WHERE LOWER(REPLACE(REPLACE(REPLACE(r.name, ' ', '-'), '''', ''), '&', '')) = ?
            `, { replacements: [resturantName] });

        if (rows.length === 0) return null;

        const recipes = rows.map(row => ({
            id: row.recipeId,
            title: row.recipeTitle,
            image: row.recipeImage,
            summary: row.recipeSummary,
            price: row.recipePrice
        }));

        return {
            recipes
        };

    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

export const GetMealBySlug = async (mealName) => {
    try {
        await sequelize.authenticate();

        const [rows] = await sequelize.query(`
            SELECT
                re.id AS recipeId, re.title AS recipeTitle, re.image AS recipeImage, re.summary AS recipeSummary, re.price AS recipePrice, re.restaurant_id, r.name
            FROM Recipe re
            INNER JOIN Restaurant r ON r.id = re.restaurant_id
             WHERE re.title = ?
            `, { replacements: [mealName] });

        if (rows.length === 0) return null;

        const { name } = rows[0];

        const recipes = rows.map(row => ({
            id: row.recipeId,
            title: row.recipeTitle,
            image: row.recipeImage,
            summary: row.recipeSummary,
            price: row.recipePrice,
            restaurant_id: row.restaurant_id
        }));

        return {
            recipes,
            name
        };

    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

export const UpdateMeals = async (mealData) => {
    try {
        await sequelize.authenticate();

        const [affectedCount] = await Recipe.update(
            {
                title: mealData.name,
                restaurant_id: mealData.restaurantId,
                summary: mealData.description,
                price: mealData.price,
                image: mealData.image
            },
            {
                where: { id: mealData.id }
            });

        if (affectedCount === 0) {
            return new Response('Meal not found', { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, updated: affectedCount }), {
            status: 200
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to update meal', { status: 500 });
    }
}