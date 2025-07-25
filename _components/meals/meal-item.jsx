import Image from 'next/image'
import Link from 'next/link'
import classes from './meal-item.module.css'

const MealItem = ({ title, image, summary, restaurant }) => {
    const restaurantSlug = restaurant.name
        .toLowerCase()
        .replace(/[\s&']/g, '-')
        .replace(/-+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-|-$/g, '');

    return (
        <article className={classes.meal}>
            <header>
                <div className={classes.image}>
                    <Image src={image} alt={title} fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectFit: 'cover' }} />
                </div>
                <div className={classes.headerText}>
                    <h2>{title}</h2>
                    <p>by {restaurant.name}</p>
                </div>
            </header>
            <div className={classes.content}>
                <p className={classes.summary}>{summary}</p>
                <div className={classes.actions}>
                    <Link href={`/restaurants/${restaurantSlug}`}>View Restaurant</Link>
                </div>
            </div>
        </article>
    );
};

export default MealItem;