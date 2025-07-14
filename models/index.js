import Recipe from './recipe.js';
import Restaurant from './restaurant.js';

Recipe.belongsTo(Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant',
});

Restaurant.hasMany(Recipe, {
  foreignKey: 'restaurant_id',
  as: 'recipes',
});

export { Recipe, Restaurant };