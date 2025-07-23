import Image from 'next/image'
import Link from 'next/link'
import classes from './orderCard.module.css'

const OrderCard = ({ order, isActive }) => {
    return (
        <div key={order.orderId} className={classes.orderCard}>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress.replaceAll("\"", "")}</p>
            <p><strong>Restaurant:</strong> {order.items[0].restaurantName}</p>
            <h3>Items:</h3>
            <ul className={classes.itemsList}>
                {order.items.map(item => (
                    <li key={item.id} className={classes.item}>
                        <Image src={item.image} alt={item.title} width={50} height={50} />
                        <div>
                            <p>{item.title}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Price: ₹{item.price}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {isActive && (
                <Link href={`/success/${order.orderId}`} className={classes.trackNowButton}>
                    Track Now
                </Link>
            )}
        </div>
    )
}

export default OrderCard