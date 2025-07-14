import { GetRestaurantNameAndImage } from '../api/restaurant/route';
import classes from './page.module.css';
import RestaurantGrid from '@/_components/restaurant/restaurant-grid';
import MealsLoadingPage from './loading-out';
import { Suspense } from 'react';
import BackButton from '@/_components/backButton/backButton';

const RestaurantPage = async () => {
  try {
    const res = await GetRestaurantNameAndImage();
    if (res.ok) {
      const data = await res.json()
      return <RestaurantGrid restaurant={data} />
    }
  } catch (error) {
    console.error(error);
  }
}

const Restaurant = () => {
  return (
    <>
      <header className={classes.header}>
        <BackButton />
        <h1>
          Discover restaurants <span className={classes.highlight}>near you</span>
        </h1>
        <p>Browse restaurants and explore their most popular dishes. Ordering made easy!</p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<MealsLoadingPage />}>
          <RestaurantPage />
        </Suspense>
      </main>
    </>
  );
}

export default Restaurant