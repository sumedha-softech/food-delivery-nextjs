'use client';

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import classes from './addressModal.module.css';

const AddressModal = ({ isOpen, onClose, children }) => {
    const modalRoot = useRef(null);

    useEffect(() => {
        modalRoot.current = document.getElementById('modal-root');
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !modalRoot.current) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className={classes['address-modal']} onClick={handleBackdropClick}>
            <div className={classes['modal-content']}>
                <button className={classes['close-button']} onClick={onClose}>
                    ✕
                </button>
                {children}
            </div>
        </div>,
        modalRoot.current
    );
}

export default AddressModal