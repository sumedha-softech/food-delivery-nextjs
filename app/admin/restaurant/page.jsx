import Link from 'next/link'
import classes from './page.module.css'
import Image from 'next/image'
import { GetRestaurantNameAndImage } from '@/app/api/restaurant/route'
import BackButton from '@/_components/backButton/backButton'

const RestaurantAdmin = async () => {
    let mockRestaurants;
    try {
        const res = await GetRestaurantNameAndImage();
        if (res.ok) {
            mockRestaurants = await res.json()
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <main className={classes.container}>
            <BackButton />
            <div className={classes.headerRow}>
                <h1>Restaurants</h1>
                <div className={classes.buttonGroup}>
                    <Link
                        href={`/admin/add-restaurant`}
                        className={classes.addButton}
                    >
                        + Add New Restaurant
                    </Link>
                </div>
            </div>
            <div className={classes.grid}>
                {mockRestaurants.map(restaurant => {
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
        </main>
    )
}

export default RestaurantAdmin