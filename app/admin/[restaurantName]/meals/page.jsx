import Link from 'next/link'
import classes from './page.module.css'
import Image from 'next/image'
import { GetMealsByRestaurantName } from '@/app/api/meal/route'
import BackButton from '@/_components/backButton/backButton'
import { notFound } from 'next/navigation'

const MealsAdmin = async ({ params }) => {
    const restaurantName = params.restaurantName;
    if (!restaurantName) {
        return <p>Restaurant slug is missing in the URL.</p>;
    }

    let data;
    try {
        data = await GetMealsByRestaurantName(restaurantName);
        if (!data || !Array.isArray(data.recipes)) {
            notFound();
        }
    } catch (error) {
        console.error(error);
        return <p>⚠️ Failed to fetch meals.</p>;
    }

    if (data.recipes.length === 0) {
        return <p>No meals found for this restaurant.</p>;
    }

    return (
        <main className={classes.container}>
            <BackButton />
            <div className={classes.headerRow}>
                <h1>Meals</h1>
            </div>
            <div className={classes.grid}>
                {data.recipes.map(meal => {
                    return (
                        <div key={meal.id} className={classes.card}>
                            <Image
                                src={meal.image}
                                alt={meal.title}
                                width={100}
                                height={150}
                                className={classes.image}
                            />
                            <h3>{meal.name}</h3>
                            <div className={classes.actions}>
                                <Link href={`/admin/${restaurantName}/edit-meal/${meal.title}`} className={classes.button}>
                                    Edit Details
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </main>
    )
}

export default MealsAdmin