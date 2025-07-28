import Image from 'next/image';
import Link from 'next/link';
import classes from './restaurant-item.module.css';

const RestaurantItem = ({ name, image }) => {
    let restaurantSlug = name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/'/g, '')
        .replace(/&/g, '')

    return (
        <article className={classes.meal}>
            <header>
                <div className={classes.image}>
                    <Image src={image} alt={name} fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectFit: 'cover' }} />
                </div>
                <div className={classes.headerText}>
                    <h2>{name}</h2>
                </div>
            </header>
            <div className={classes.content}>
                <div className={classes.actions}>
                    <Link href={`/restaurants/${restaurantSlug}`}>View Restaurant</Link>
                </div>
            </div>
        </article>
    );
};

export default RestaurantItem;