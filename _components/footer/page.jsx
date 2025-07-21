import Link from 'next/link'
import classes from './page.module.css'

const Footer = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.footerContent}>
                <p>&copy; {new Date().getFullYear()} FoodExpress. All rights reserved.</p>

                <p>Secure payments powered by <Link href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</Link>.</p>

                <p>Real-time delivery estimates via <Link href="https://openrouteservice.org/" target="_blank" rel="noopener noreferrer">OpenRouteService API</Link>.</p>
            </div>
        </footer>
    )
}

export default Footer