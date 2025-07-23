import Image from 'next/image';
import Link from 'next/link';
import React, { memo } from 'react'
import classes from './restaurantList.module.css'

const RestaurantList = ({ restaurants }) => {
    return (
        <div className={classes.grid}>
            {restaurants.map(restaurant => {
                const slug = encodeURIComponent(
                    restaurant.name
                        .toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/'/g, '')
                        .replace(/&/g, '')
                );
                return (
                    <div key={restaurant.id} className={classes.card}>
                        <Image
                            src={restaurant.image}
                            alt={restaurant.name}
                            width={100}
                            height={150}
                            className={classes.image}
                        />
                        <h3>{restaurant.name}</h3>
                        <div className={classes.actions}>
                            <Link href={`/admin/${slug}`} className={classes.button}>
                                Edit Details
                            </Link>
                            <Link href={`/admin/${slug}/meals`} className={classes.buttonSecondary}>
                                Edit Meals
                            </Link>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default memo(RestaurantList)