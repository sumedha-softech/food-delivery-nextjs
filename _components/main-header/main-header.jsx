import Link from "next/link";
import Image from "next/image";

import logoImg from '@/assets/logo.png';
import classes from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";
import SearchBar from "../search/search-bar";

const Header = () => {

    return (
        <>
            <MainHeaderBackground />
            <header className={classes.header}>
                <Link className={classes.logo} href="/">
                    <Image src={logoImg} alt="A place with food on it" priority />
                </Link>

                <SearchBar />

                <nav className={classes.nav}>
                    <ul>
                        <li>
                            <NavLink href="/meals">Meals</NavLink>
                        </li>
                        <li>
                            <NavLink href="/restaurants">Restaurants</NavLink>
                        </li>
                        <li>
                            <NavLink href="/cart">🛒 Cart</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header