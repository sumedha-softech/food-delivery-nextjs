import Image from 'next/image'
import classes from './mealCard.module.css'
import Link from 'next/link'

const MealCard = ({ item, restaurantName }) => {
    return (
        <li className={classes.mealCard}>
            <Image src={item.image} alt={item.title} width={120} height={120} />
            <div className={classes.mealInfo}>
                <p>{item.title}</p>
                <br />
                <p>{item.summary}</p>
                <div className={classes.mealActions}>
                    <span>{Number(item.price)?.toFixed(2) || '—'}</span>
                    <Link href={`/admin/${restaurantName}/edit-meal/${item.title}`}>
                        <button className={classes.cartBtn}>Edit</button>
                    </Link>
                </div>
            </div>
        </li>
    )
}

export default MealCard