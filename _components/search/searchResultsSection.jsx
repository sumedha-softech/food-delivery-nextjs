'use client';

import Link from 'next/link';
import classes from './searchResultsSection.module.css';

const formatURL = (name) =>
    encodeURIComponent(
        name.toLowerCase().replace(/[\s'&]+/g, '-')
    );

const SearchResultsSection = ({ label, items = [], type = 'meals', showAll, toggleShowAll, onItemClick }) => {
    const displayItems = showAll ? items : items.slice(0, 3);

    return (
        <div className={classes.section}>
            <h4>{label}</h4>
            {items.length > 0 ? (
                <>
                    {displayItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/restaurants/${formatURL(item.name)}`}
                            onClick={onItemClick}
                        >
                            {type === 'meals' ? item.title : item.name}
                        </Link>
                    ))}

                    {items.length > 3 && (
                        <button
                            type="button"
                            className={classes.toggleButton}
                            onClick={toggleShowAll}
                        >
                            {showAll ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </>
            ) : (
                <p>No {label.toLowerCase()} found.</p>
            )}
        </div>
    );
};

export default SearchResultsSection;