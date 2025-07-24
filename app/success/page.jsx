import { GetAllOrders } from "../api/order/route";
import classes from './page.module.css';
import OrderTable from '@/_components/success/orderTable';

const OrderList = async () => {
    const res = await GetAllOrders();
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    
    return (
        <div className={classes.ordersPage}>
            <h1>Your Orders</h1>
            {data.length === 0 && <p>No orders found.</p>}

            <OrderTable orders={data} />
        </div>
    )
}

export default OrderList;