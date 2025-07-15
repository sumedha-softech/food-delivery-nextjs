# NextLevel Food  - Next.js + SQL Server Food Delivery App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The backend uses **SQL Server** as the database, integrated via [Sequelize](https://sequelize.org/) and [tedious](https://www.npmjs.com/package/tedious).

## 📺 Project Demo

  ![File Uploader Package Project](./doc/nextLevel-food.gif)
   [Watch Preview](https://raw.githubusercontent.com/sumedha-softech/food-delivery-nextjs/main/doc/nextLevel-food.mp4)

## Features

- Modern Next.js 15 app directory structure
- SQL Server database integration for meals, restaurants, and orders
- Image upload and management
- Interactive UI with React 19
- Location features with Leaflet maps

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your SQL Server connection details:

```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_DATABASE=your_db_name
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Connect to your SQL Server instance and run the following SQL to create the database and tables:

```sql
-- Create the database
CREATE DATABASE next-level-food;
```

- The app uses Sequelize for ORM. Models are located in the [`models/`](models/) directory.
- On first run, Sequelize will attempt to connect and sync models to your database.

## Project Structure

- [`app/`](app/): Next.js app directory (pages, layouts, API routes)
- [`models/`](models/): Sequelize models for SQL Server
- [`lib/`](lib/): Server actions and utilities
- [`_components/`](./_components/): React components
- [`config/database.js`](config/database.js): Sequelize SQL Server connection

## Deployment

You can deploy this app to any platform that supports Node.js and SQL Server. For more, see [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

## License

MIT

---

**Note:** For database schema and migrations, see the [`models/`](models/) directory and update as needed for your