import Link from "next/link";

import classes from './page.module.css'
import ImageSlideshow from "@/_components/images/image-slideshow-api";

const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes.slideshow}>
        <ImageSlideshow />
      </div>
      <div>
        <HeroSection />
        <CallToAction />
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <div className={classes.hero}>
      <h1>NextLevel Food for Real Foodies</h1>
      <p>From street eats to gourmet treats - NextLevel Food brins it all to oyour plate.</p>
    </div>
  );
};

const CallToAction = () => {
  return (
    <div className={classes.cta}>
      <Link href="/restaurants">Explore Restaurants</Link>
      <Link href="/meals">Explore Meals</Link>
    </div>
  );
};

const MainContent = () => {
  return (
    <main>
      <section className={classes.section}>
        <h2>How it works</h2>
        <p>
          <b>NextLevel Food brings everything foodies love into one place.</b>&nbsp;
          <b>Order</b> meals from nearby restaurants.
        </p>
      </section>

      <section className={classes.section}>
        <h2>Why NextLevel Food?</h2>
        <p>
          <b>Because it&apos;s more than food—it&apos;s a movement.</b>&nbsp;
          NextLevel Food connects people who love discovering, tasting, and sharing food.
          Whether you're looking to try something new, support local cooks, or show off your own dishes, it all starts here.
        </p>
      </section>
    </main>
  );
};

const Home = () => {
  return (
    <>
      <Header />
      <MainContent />
    </>
  );
};

export default Home;
