'use client';

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import classes from './search-input.module.css'

const SearchInput = ({ initialQuery }) => {
    const [query, setQuery] = useState(initialQuery);
    const [meals, setMeals] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showAllMeals, setShowAllMeals] = useState(false);
    const [showAllRestaurants, setShowAllRestaurants] = useState(false);

    useEffect(() => {
        if (!query) {
            setMeals([]);
            setRestaurants([]);
            setDropdownOpen(false);
            return;
        }

        const timer = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setMeals(data.meals);
                    setRestaurants(data.restaurants);
                    setDropdownOpen(true);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleItemClick = () => {
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <form className={classes.wrapper} onSubmit={handleSubmit} ref={dropdownRef}>
            <input
                className={classes.searchBar}
                type="text"
                placeholder="Search meals or restaurants..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {dropdownOpen && (
                <div className={classes.dropdown}>
                    <div className={classes.section}>
                        <h4>Meals</h4>
                        {meals.length > 0 ? (
                            <>
                                {(showAllMeals ? meals : meals.slice(0, 3)).map((item) => (
                                    <Link
                                        href={`/restaurants/${item.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll("&", "")}`}
                                        key={item.id}
                                        onClick={handleItemClick}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                                {meals.length > 3 && (
                                    <button
                                        type="button"
                                        className={classes.toggleButton}
                                        onClick={() => setShowAllMeals(!showAllMeals)}
                                    >
                                        {showAllMeals ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>No meals found.</p>
                        )}
                    </div>

                    <div className={classes.section}>
                        <h4>Restaurants</h4>
                        {restaurants.length > 0 ? (
                            <>
                                {(showAllRestaurants ? restaurants : restaurants.slice(0, 3)).map((item) => (
                                    <Link
                                        href={`/restaurants/${item.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "").replaceAll("&", "")}`}
                                        key={item.id}
                                        onClick={handleItemClick}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {restaurants.length > 3 && (
                                    <button
                                        type="button"
                                        className={classes.toggleButton}
                                        onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                                    >
                                        {showAllRestaurants ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>No restaurants found.</p>
                        )}
                    </div>
                </div>
            )}
        </form>
    );
}

export default SearchInput