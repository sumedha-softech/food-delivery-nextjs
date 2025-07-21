'use client';

import { useEffect, useRef, useState } from 'react';
import classes from './modalContent.module.css';

const ModalContent = ({ onSelect, onAddNew }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        try {
            const res = await fetch(`/api/user`);
            if (!res.ok) throw new Error('Failed to fetch restaurant');
            const data = await res.json();
            setAddresses(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Select Delivery Address</h3>

            {loading ? (
                <p>Loading...</p>
            ) : (
                addresses.length > 0 ? (
                    addresses.map(addr => (
                        <div key={addr.id} onClick={() => onSelect(addr)} className={classes.addresses}>
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
