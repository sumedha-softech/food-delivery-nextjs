import Link from 'next/link'
import classes from './page.module.css'
import { GetRestaurantNameAndImage } from '@/app/api/restaurant/route'
import BackButton from '@/_components/backButton/backButton'
import RestaurantList from '@/_components/restaurant/restaurantList'

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

    if (!mockRestaurants) {
        return <main className={classes.container}>
            <p>Failed to load restaurants.</p>
        </main>
    }

    return (
        <main className={classes.container}>
            <BackButton />
            <div className={classes.headerRow}>
                <h1>Restaurants</h1>
                <div className={classes.buttonGroup}>
                    <Link href={`/admin/add-restaurant`} className={classes.addButton}>
                        + Add New Restaurant
                    </Link>
                </div>
            </div>
            <RestaurantList restaurants={mockRestaurants} />
        </main>
    )
}

export default RestaurantAdmin