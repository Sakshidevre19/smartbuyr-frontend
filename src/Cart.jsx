import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ user, token }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/cart/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const data = await response.json();
      setCartItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await fetch(`http://localhost:8000/api/accounts/cart/remove/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>My Cart ({cartItems.length} items)</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate('/')} className="shop-now-btn">Shop Now</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <div className="item-price">₹{item.product.price.toLocaleString()}</div>
                  <div className="item-quantity">Quantity: {item.quantity}</div>
                  <div className="item-total">Total: ₹{item.total.toLocaleString()}</div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;