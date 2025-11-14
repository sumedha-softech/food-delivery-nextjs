# NextLevel Food  - A Feature-Rich Food Delivery App with Next.js and MySQL

Welcome to NextLevel Food, a full-stack food delivery application built with the latest web technologies. This project demonstrates a modern architecture using Next.js for the frontend and backend, MySQL for the database, and several other powerful libraries for a rich user experience.

# Live Demo URL: [food-delivery](food-delivery-nextjs-wine.vercel.app)

## 📺 NextLevel Food App Demo

  ![File Uploader Package Project](./doc/nextLevel-food.gif)
  
   [Watch Preview](https://raw.githubusercontent.com/sumedha-softech/food-delivery-nextjs/main/doc/nextLevel-food.mp4)

## Features

- **Modern Tech Stack**: Built with Next.js 15 (App Router) and React 19.
- **Robust Backend**: Uses MySQL as the database, managed with the Sequelize ORM.
<!-- - **Secure Payments**: Integrated with Stripe for secure and seamless online payment processing. -->
- **Real-time Delivery Tracking**: Provides delivery time and distance estimates using the OpenRouteService API.
- **Interactive Maps**: Displays restaurant and user locations using Leaflet maps.
- **Image Management**: Includes functionality for uploading and managing images for meals and restaurants.
- **Component-Based UI**: A clean and interactive user interface built with reusable React components.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A running MySQL server instance.

### 2. Installation

First, clone the repository and install the dependencies.

```bash
git clone https://github.com/sumedha-softech/food-delivery-nextjs.git
cd food-delivery-nextjs
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the `.env.example` to `.env`:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in your **MySQL** connection details and API keys:

```dotenv
# MySQL Database
DB_NAME = <DATABASE_NAME>
DB_HOST = <DATABASE_HOST>
DB_USERNAME = <DATABASE_USERNAME>
DB_PASSWORD = <DATABASE_PASSWORD>

# Stripe API Keys
STRIPE_SECRET_KEY = <sk_test_xxxxxxxxxxxxxxxx>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = <pk_test_xxxxxxxxxxxxxxxx>

# Application & Service Keys
NEXT_PUBLIC_BASE_URL = http://localhost:3000
OPENROUTESERVICE_API_KEY = <YOUR_API_KEY_HERE>
```

- **DB_**: Your MySQL database credentials.
<!-- - **STRIPE_SECRET_KEY**: Your secret key for processing payments with Stripe.
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Your public Stripe key for the frontend.
- **NEXT_PUBLIC_BASE_URL**: The base URL of your application, used for redirects from Stripe. -->
- **OPENROUTESERVICE_API_KEY**: Your API key for fetching delivery time/distance estimates.

### 4. Database Setup

Connect to your MySQL instance and create the database you specified in your `.env` file.

```sql
CREATE DATABASE <your_database_name>;
```

The application uses Sequelize as an ORM. When you run the app for the first time, Sequelize will automatically create all the necessary tables by syncing the models defined in the `models/` directory.

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

## 📂 Project Structure

The project follows a standard Next.js App Router structure:

- [`app/`](app/): Contains all the routes, pages, layouts, and API endpoints.
- [`models/`](models/): Sequelize models for the MySQL database.
- [`lib/`](lib/): Server-side helper functions, database actions, and utility scripts.
- [`_components/`](./_components/): Reusable React components used across the application.
- [`config/database.js`](config/database.js): Sequelize configuration for the MySQL database connection.

## 🔌 Key Integrations

<!-- ### Payment Integration

This app uses **Stripe** for processing payments securely. Payments are handled on the backend using the secret key, and order payment status is tracked in the database. -->

### Delivery Time Estimation (OpenRouteService)

To provide real-time delivery estimates, the app integrates with the OpenRouteService API. It calculates delivery distances and estimated arrival times based on restaurant and customer locations.

## Deployment 

You can deploy this app to any platform that supports Node.js and MySQL. For more details on deploying a Next.js application, see the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## License

This project is licensed under the MIT License.

---

**Note:** For database schema and migrations, see the [`models/`](models/) directory and update as needed for your
