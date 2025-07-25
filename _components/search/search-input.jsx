'use client';

import { useEffect, useRef, useState } from 'react';
import SearchResultsSection from './searchResultsSection';
import classes from './search-input.module.css';

const SearchInput = ({ initialQuery }) => {
    const [query, setQuery] = useState(initialQuery);
    const [meals, setMeals] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAllMeals, setShowAllMeals] = useState(false);
    const [showAllRestaurants, setShowAllRestaurants] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setMeals([]);
            setRestaurants([]);
            setDropdownOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setMeals(data.meals || []);
                setRestaurants(data.restaurants || []);
                setDropdownOpen(true);
            } catch (error) {
                console.error('Search fetch failed:', error);
                setMeals([]);
                setRestaurants([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = () => setDropdownOpen(false);

    return (
        <form className={classes.wrapper} onSubmit={(e) => e.preventDefault()} ref={dropdownRef}>
            <input
                className={classes.searchBar}
                type="text"
                placeholder="Search meals or restaurants..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {dropdownOpen && (
                <div className={classes.dropdown}>
                    <SearchResultsSection
                        label="Meals"
                        items={meals}
                        type="meals"
                        showAll={showAllMeals}
                        toggleShowAll={() => setShowAllMeals(prev => !prev)}
                        onItemClick={handleItemClick}
                    />
                    <SearchResultsSection
                        label="Restaurants"
                        items={restaurants}
                        type="restaurants"
                        showAll={showAllRestaurants}
                        toggleShowAll={() => setShowAllRestaurants(prev => !prev)}
                        onItemClick={handleItemClick}
                    />
                </div>
            )}
        </form>
    );
};

export default SearchInput;