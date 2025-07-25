'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import classes from './modalContent.module.css';

const ModalContent = ({ onSelect, onAddNew }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchAddresses = async () => {
            try {
                const res = await fetch('/api/user');
                if (!res.ok) throw new Error('Failed to fetch addresses');
                const data = await res.json();
                setAddresses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching addresses:', err);
                setAddresses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const handleSelect = useCallback((addr) => () => onSelect(addr), [onSelect]);

    const renderSkeletons = () =>
        Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={classes.skeleton} />
        ));

    return (
        <div>
            <h3>Select Delivery Address</h3>

            {loading ? (
                renderSkeletons()
            ) : (
                addresses.length > 0 ? (
                    <div>
                        {addresses.map(addr => (
                            <div
                                key={addr.id}
                                className={classes.addresses}
                                role="button"
                                tabIndex={0}
                                onClick={handleSelect(addr)}
                                onKeyDown={(e) => e.key === 'Enter' && onSelect(addr)}
                                aria-label={`Select address: ${addr.address}`}
                            >
                                <p>{addr.address}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No addresses found. Please add a new address.</p>
                )
            )}

            <button onClick={onAddNew} style={{ marginTop: 10 }}>
                + Add New Address
            </button>
        </div >
    );
};

export default ModalContent;
