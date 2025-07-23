import classes from './page.module.css'
import MealsGrid from '@/_components/meals/meals-grid'
import { GetMeals } from '../api/meal/route'
import { Suspense } from 'react'
import MealsLoadingPage from '../restaurants/loading-out'
import { notFound } from 'next/navigation'
import BackButton from '@/_components/backButton/backButton'

const MealsPage = async () => {
    const meals = await GetMeals();
    if (!meals) {
        notFound();
    }

    return <MealsGrid meals={meals} />
}

const Meals = () => {
    return (
        <>
            <header className={classes.header}>
                <BackButton />
                <h1>
                    Discover delicious meals <span className={classes.highlight}>near you</span>
                </h1>
                <p>Browse restaurants and explore their most popular dishes. Ordering made easy!</p>
            </header>
            <main className={classes.main}>
                <Suspense fallback={<MealsLoadingPage />}>
                    <MealsPage />
                </Suspense>
            </main>
        </>
    )
}

export default Meals