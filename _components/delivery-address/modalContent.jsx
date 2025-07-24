'use client';

import { useEffect, useRef, useState } from 'react';
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

    return (
        <div>
            <h3>Select Delivery Address</h3>

            {loading ? (
                <p>Loading...</p>
            ) : (
                addresses.length > 0 ? (
                    addresses.map(addr => (
                        <div
                            key={addr.id}
                            onClick={() => onSelect(addr)}
                            className={classes.addresses}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && onSelect(addr)}
                        >
                            <p>{addr.address}</p>
                        </div>
                    ))
                ) : (
                    <p>No addresses found. Please add a new address.</p>
                )
            )}

            <button onClick={onAddNew} style={{ marginTop: 10 }}>
                + Add New Address
            </button>
        </div>
    );
};

export default ModalContent;
