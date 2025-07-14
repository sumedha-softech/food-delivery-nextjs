import { CartProvider } from '@/_components/cart/cart-context';
import './globals.css';
import MainHeader from '@/_components/main-header/main-header'

export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
        <MainHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
