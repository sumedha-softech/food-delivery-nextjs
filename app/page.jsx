import Link from "next/link";

import classes from './page.module.css'
import ImageSlideshow from "@/_components/images/image-slideshow-api";

export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>NextLevel Food for Real Foodies</h1>
            <p>From street eats to gourmet treats – NextLevel Food brings it all to your plate.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/restaurants">Explore Restaurants</Link>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            <b>NextLevel Food brings everything foodies love into one place.</b> <b>Order</b> meals from nearby restaurants.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why NextLevel Food?</h2>
          <p>
            <b>Because it&apos;s more than food—it&apos;s a movement.</b> NextLevel Food connects people who love discovering, tasting, and sharing food. Whether you're looking to try something new, support local cooks, or show off your own dishes, it all starts here.
          </p>
        </section>
      </main>
    </>
  );
}
