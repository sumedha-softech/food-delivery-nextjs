import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MealsGrid from '@/_components/meals/meals-grid'
import MealsLoadingPage from '../restaurants/loading-out'
import BackButton from '@/_components/backButton/backButton'
import { GetMeals } from '../api/meal/route'
import classes from './page.module.css'

const FetchedMeals = async () => {
    const meals = await GetMeals();
    if (!meals || meals.length === 0) notFound();

    return <MealsGrid meals={meals} />
};

const MealsPage = () => {
    return (
        <>
            <header className={classes.header}>
                <BackButton />
                <h1>
                    Discover delicious meals&nbsp;
                    <span className={classes.highlight}>near you</span>
                </h1>
                <p>
                    Browse restaurants and explore their most popular dishes. Ordering made easy!
                </p>
            </header>
            <main className={classes.main}>
                <Suspense fallback={<MealsLoadingPage />}>
                    <FetchedMeals />
                </Suspense>
            </main>
        </>
    )
};

export default MealsPage;