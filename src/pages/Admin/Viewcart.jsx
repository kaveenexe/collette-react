import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../components/product/Apiservice';

const Viewcart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = "user123"; // Replace with actual user ID from authentication

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartData = await apiService.getCart(userId);
      setCart(cartData);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to fetch cart data. Please try again later.');
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    setLoading(true);
    setError(null);
    try {
      console.log('Updating quantity:', { userId, productId, quantity: newQuantity });
      await apiService.updateCartItemQuantity(userId, productId, newQuantity);
      await fetchCart(); // Refresh cart data after update
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(error.response?.data?.errors?.$[0] || 'Failed to update quantity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.removeFromCart(userId, productId);
      await fetchCart(); // Refresh cart data after removal
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout");
    // navigate('/checkout');
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="container mt-4"><h2>Your cart is empty</h2></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {cart.items.map((item) => (
          <div key={item.productId} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.productName}</h5>
                <p className="card-text">Price: ${item.price.toFixed(2)}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="input-group" style={{maxWidth: "120px"}}>
                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity === 1 || loading}>-</button>
                    <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} disabled={loading}>+</button>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.productId)} disabled={loading}>Remove</button>
                </div>
                <p className="mt-2">Total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4>Total Cost: ${cart.totalPrice.toFixed(2)}</h4>
        <button className="btn btn-primary" onClick={handleCheckout} disabled={loading}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Viewcart;