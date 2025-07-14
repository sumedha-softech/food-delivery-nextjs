import RestaurantItem from './restaurant-item'
import classes from './restaurant-grid.module.css'

const RestaurantGrid = ({ restaurant }) => {
    return (
        <ul className={classes.meals}>
            {restaurant.map(item => {
                return (
                    <li key={item.id}>
                        <RestaurantItem name={item.name} image={item.image} />
                    </li>
                )
            })}
        </ul>
    )
}

export default RestaurantGrid