import Image from 'next/image'
import Link from 'next/link'

import classes from './restaurant-item.module.css'
import { Suspense } from 'react'
import MealsLoadingPage from '@/app/restaurants/loading-out'

const RestaurantItem = ({ name, image }) => {
    return (
        <article className={classes.meal}>
            <header>
                <div className={classes.image}>
                    <Image src={image} alt={name} fill sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className={classes.headerText}>
                    <h2>{name}</h2>
                </div>
            </header>
            <div className={classes.content}>
                <div className={classes.actions}>
                    <Suspense fallback={<MealsLoadingPage />}>
                        <Link href={`/restaurants/${name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll("&", "")}`}>View Restaurant</Link>
                    </Suspense>
                </div>
            </div>
        </article>
    )
}

export default RestaurantItem