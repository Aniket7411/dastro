import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/** Legacy checkout route — Shopify handles all merchandise checkout externally */
const ShopCheckout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <Navigate to="/shop" replace state={{ fromCheckout: true, previous: location.state }} />;
};

export default ShopCheckout;
