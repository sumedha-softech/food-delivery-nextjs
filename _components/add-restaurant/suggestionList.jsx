'use client';

import classes from './suggestionList.module.css';

const SuggestionList = ({ suggestions, onSelect, onMapSelect, showFallback, loading }) => {
    if (suggestions.length === 0 && !showFallback) return null;

    return (
        <ul className={classes["locations-dropdown"]}>
            {loading
                ? <li className={classes.loading}>Loading...</li>
                : suggestions.length > 0 ? (
                    <>
                        {suggestions.map((item, idx) => (
                            <li key={idx} onClick={() => onSelect(item)}>
                                {item.label}
                            </li>
                        ))}
                        <li onClick={onMapSelect}>
                            <b>Select using map</b>
                        </li>
                    </>
                ) : (
                    <li onClick={onMapSelect}>
                        <b>Select using map</b>
                    </li>
                )}
        </ul>
    )
}

export default SuggestionList