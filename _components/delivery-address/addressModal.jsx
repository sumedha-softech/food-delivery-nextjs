'use client';

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classes from './addressModal.module.css';

const AddressModal = ({ isOpen, onClose, children }) => {
    const [mounted, setMounted] = useState(false);
    const modalRootRef = useRef(null);

    useEffect(() => {
        modalRootRef.current = document.getElementById('modal-root');
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen || !mounted || !modalRootRef.current) return null;

    return createPortal(
        <div className={classes['address-modal']} onClick={handleBackdropClick}>
            <div className={classes['modal-content']}>
                <button className={classes['close-button']} onClick={onClose} aria-label="Close modal">
                    ✕
                </button>
                {children}
            </div>
        </div>,
        modalRootRef.current
    );
};

export default AddressModal;