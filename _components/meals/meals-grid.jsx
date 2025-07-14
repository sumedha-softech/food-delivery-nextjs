import MealItem from './meal-item'
import classes from './meals-grid.module.css'

const MealsGrid = ({ meals }) => {
    return (
        <ul className={classes.meals}>
            {meals.map(item => {
                return (
                    <li key={item.id}>
                        <MealItem {...item} />
                    </li>
                )
            })}
        </ul>
    )
}

export default MealsGrid