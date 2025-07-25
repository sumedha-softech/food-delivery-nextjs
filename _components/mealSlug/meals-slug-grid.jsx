import MealSlugItem from './meal-slug-item';
import classes from './meals-slug-grid.module.css';

const MealsSlugGrid = ({ meal, restaurantName, restaurantId, lat, lng }) => {
    return (
        <ul className={classes.grid}>
            {meal.map((item) => {
                return (
                    <li key={item.id} className={classes.mealCard}>
                        <MealSlugItem
                            {...item}
                            restaurantName={restaurantName}
                            restaurantId={restaurantId}
                            restaurantLat={lat}
                            restaurantLng={lng}
                        />
                    </li>
                )
            })}
        </ul>
    );
};

export default MealsSlugGrid;