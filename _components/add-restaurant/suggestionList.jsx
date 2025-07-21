'use client';

import classes from './suggestionList.module.css';

const SuggestionList = ({ suggestions, onSelect, loading }) => {
    return (
        <ul className={classes["locations-dropdown"]}>
            {loading
                ? <li className={classes.loading}>Loading...</li>
                : suggestions.length > 0
                    ? suggestions.map((item, idx) => (
                        <li key={idx} onClick={() => onSelect(item)}>
                            {item.label}
                        </li>
                    ))
                    : <li className={classes.noResults}>No results found</li>
            }
        </ul>
    )
}

export default SuggestionList