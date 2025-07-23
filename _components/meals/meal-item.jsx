import Image from 'next/image'
import Link from 'next/link'

import classes from './meal-item.module.css'
import { Suspense } from 'react'
import MealsLoadingPage from '@/app/restaurants/loading-out'

const MealItem = ({ title, image, summary, restaurant }) => {
    return (
        <article className={classes.meal}>
            <header>
                <div className={classes.image}>
                    <Image src={image} alt={title} fill sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className={classes.headerText}>
                    <h2>{title}</h2>
                    <p>by {restaurant.name}</p>
                </div>
            </header>
            <div className={classes.content}>
                <p className={classes.summary}>{summary}</p>
                <div className={classes.actions}>
                    <Suspense fallback={<MealsLoadingPage />}>
                        <Link href={`/restaurants/${restaurant.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll("&", "")}`}>View Restaurant</Link>
                    </Suspense>
                </div>
            </div>
        </article>
    )
}

export default MealItem