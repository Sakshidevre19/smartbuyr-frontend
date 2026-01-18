import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const Wishlist = ({ user, token }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/wishlist/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const data = await response.json();
      setWishlistItems(data.items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await fetch(`http://localhost:8000/api/accounts/wishlist/remove/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await fetch('http://localhost:8000/api/accounts/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      setNotification({ message: 'Added to cart successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({ message: 'Failed to add to cart', type: 'error', isVisible: true });
    }
  };

  if (loading) return <div className="loading">Loading wishlist...</div>;

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>My Wishlist ({wishlistItems.length} items)</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Your wishlist is empty</h2>
          <p>Add products you love to your wishlist!</p>
          <button onClick={() => navigate('/')} className="shop-now-btn">Shop Now</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image">
                <img src={item.product.image} alt={item.product.name} />
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="remove-wishlist-btn"
                >
                  ×
                </button>
              </div>
              <div className="item-info">
                <h3 onClick={() => navigate(`/product/${item.product.id}`)}>{item.product.name}</h3>
                <div className="item-rating">★ {item.product.rating}</div>
                <div className="item-price">₹{item.product.price.toLocaleString()}</div>
                <button 
                  onClick={() => addToCart(item.product.id)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  );
};

export default Wishlist;