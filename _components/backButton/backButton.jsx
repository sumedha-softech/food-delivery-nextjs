'use client';

import { useRouter } from 'next/navigation';
import classes from './backButton.module.css'

const BackButton = () => {
    const router = useRouter();

    return (
        <button className={classes.backButton} onClick={() => router.back()}>
            ⬅ Go Back
        </button>
    );
}

export default BackButton