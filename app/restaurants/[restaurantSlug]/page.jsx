import { cache, Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { GetRestaurantBySlug as getRestaurantBySlugUncached } from '../../api/restaurant/route';
import MealsLoadingPage from '../loading-out';
import MealsSlugGrid from '@/_components/mealSlug/meals-slug-grid';
import BackButton from '@/_components/backButton/backButton';
import classes from './page.module.css';

const getRestaurantBySlug = cache(getRestaurantBySlugUncached);

const RestaurantDetailPage = async ({ params }) => {
    const { restaurantSlug } = await params;
    const restaurant = await getRestaurantBySlug(restaurantSlug);

    if (!restaurant) {
        notFound();
    }

    return (
        <main className={classes.container}>
            <BackButton />
            <header className={classes.header}>
                <div className={classes.image}>
                    <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        width={140}
                        height={140}
                        priority
                    />
                </div>
                <div className={classes.headerText}>
                    <h1>{restaurant.name}</h1>
                    <p className={classes.creator}>
                        <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
                    </p>
                    <p className={classes.summary}>{restaurant.description}</p>
                </div>
            </header>

            <section className={classes.mealList}>
                <h2>Menu</h2>
                <Suspense fallback={<MealsLoadingPage />}>
                    {restaurant.recipes?.length > 0 ? (
                        <MealsSlugGrid
                            meal={restaurant.recipes}
                            restaurantName={restaurant.name}
                            restaurantId={restaurant.id}
                            lat={restaurant.lat}
                            lng={restaurant.lng}
                        />
                    ) : (
                        <p>No meals available for this restaurant.</p>
                    )}
                </Suspense>
            </section>
        </main>
    );
};

export default RestaurantDetailPage;