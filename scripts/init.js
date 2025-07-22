import sequelize from '../config/database.js'

export async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
}
