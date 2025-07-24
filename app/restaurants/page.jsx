import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import RestaurantGrid from '@/_components/restaurant/restaurant-grid';
import MealsLoadingPage from './loading-out';
import BackButton from '@/_components/backButton/backButton';
import { GetRestaurantNameAndImage } from '../api/restaurant/route';
import classes from './page.module.css';

const Restaurant = async () => {
  const res = await GetRestaurantNameAndImage();
  if (!res.ok) notFound();

  const data = await res.json()
  return <RestaurantGrid restaurant={data} />
};

const RestaurantPage = () => {
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
          <Restaurant />
        </Suspense>
      </main>
    </>
  );
};

export default RestaurantPage;