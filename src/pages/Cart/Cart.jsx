import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../components/product/Apiservice';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const userId = "user123"; // Replace with actual user ID, e.g., from authentication

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const cartData = await apiService.getCart(userId);
    setCart(cartData);
  };

  const handleRemoveItem = async (productId) => {
    await apiService.removeFromCart(userId, productId);
    fetchCart();
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    await apiService.updateCartItemQuantity(userId, productId, quantity);
    fetchCart();
  };

  const handleCheckout = () => {
    // Implement checkout logic
    console.log("Proceeding to checkout");
    // navigate('/checkout');
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {cart.Items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.Items.map((item) => (
            <div key={item.ProductId} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{item.ProductName}</h5>
                <p className="card-text">Price: ${item.Price}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleUpdateQuantity(item.ProductId, item.Quantity - 1)} disabled={item.Quantity === 1}>-</button>
                    <span className="mx-2">{item.Quantity}</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleUpdateQuantity(item.ProductId, item.Quantity + 1)}>+</button>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleRemoveItem(item.ProductId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-right">
            <h4>Total: ${cart.TotalPrice}</h4>
            <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;