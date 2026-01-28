import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getApiUrl } from './services/api'
import Notification from './Notification'
import LoginPrompt from './LoginPrompt'

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false })
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userToken = localStorage.getItem('token')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    if (userToken) {
      setToken(userToken)
    }
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/products/${id}/`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const getDeliveryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 3)
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const addToCart = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    try {
      await fetch(`${getApiUrl()}/api/accounts/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ product_id: product.id, quantity: parseInt(quantity) })
      })
      setNotification({ message: 'Added to cart successfully!', type: 'success', isVisible: true })
    } catch (error) {
      console.error('Error adding to cart:', error)
      setNotification({ message: 'Failed to add to cart', type: 'error', isVisible: true })
    }
  }

  const addToWishlist = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    try {
      const response = await fetch(`${getApiUrl()}/api/accounts/wishlist/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ product_id: product.id })
      })
      const data = await response.json()
      setNotification({ 
        message: data.message, 
        type: data.message.includes('Already') ? 'info' : 'success', 
        isVisible: true 
      })
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      setNotification({ message: 'Failed to add to wishlist', type: 'error', isVisible: true })
    }
  }

  const images = product ? [
    product.image,
    `https://picsum.photos/400/400?random=${product.id + 1000}`,
    `https://picsum.photos/400/400?random=${product.id + 2000}`,
    `https://picsum.photos/400/400?random=${product.id + 3000}`
  ] : []

  if (loading) return <div className="loading">Loading product...</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <div className="product-detail-page">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>SmartBuyr</div>
            <div className="nav-actions">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon"></span>
              </form>
              {user ? (
                <>
                  <span title="Cart" onClick={() => navigate('/cart')} style={{cursor: 'pointer'}}>🛒</span>
                  <span title="Wishlist" onClick={() => navigate('/wishlist')} style={{cursor: 'pointer'}}>❤️</span>
                  <span title="Account" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>👤</span>
                  <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="btn btn-auth" onClick={() => navigate('/')}>Sign In</button>
                  <button className="btn btn-auth btn-primary" onClick={() => navigate('/')}>Sign Up</button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <div className="container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Home</span> &gt; 
          <span onClick={() => navigate(-1)} style={{cursor: 'pointer'}}> Back</span> &gt; 
          <span> {product.name}</span>
        </div>

        <div className="product-detail-layout">
          <div className="product-images">
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="rating-section">
              <span className="rating">⭐ {product.rating}</span>
              <span className="reviews">({product.reviews} reviews)</span>
            </div>
            
            <div className="price-section">
              <span className="current-price">₹{product.price}</span>
              <span className="original-price">₹{Math.round(product.price * 1.3)}</span>
              <span className="discount">23% off</span>
            </div>

            <div className="delivery-info">
              <h3>Delivery Options</h3>
              <div className="delivery-item">
                <span className="delivery-icon">🚚</span>
                <div>
                  <p><strong>Free Delivery</strong> by {getDeliveryDate()}</p>
                  <p className="delivery-note">If ordered within 2 hrs 30 mins</p>
                </div>
              </div>
              <div className="delivery-item">
                <span className="delivery-icon">↩️</span>
                <div>
                  <p><strong>7 Days Return Policy</strong></p>
                  <p className="delivery-note">Easy returns & exchanges</p>
                </div>
              </div>
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
              <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary btn-large" onClick={addToCart}>Add to Cart</button>
              <button className="btn btn-secondary btn-large">Buy Now</button>
              <button className="btn btn-wishlist" onClick={addToWishlist}>❤️ Add to Wishlist</button>
            </div>

            <div className="payment-options">
              <h3>Payment Options</h3>
              <div className="payment-item">💳 Credit/Debit Cards</div>
              <div className="payment-item">🏦 Net Banking</div>
              <div className="payment-item">📱 UPI (GPay, PhonePe, Paytm)</div>
              <div className="payment-item">💰 Cash on Delivery</div>
            </div>
          </div>
        </div>

        <div className="product-details-section">
          <div className="details-tabs">
            <button className="tab-btn active">Description</button>
            <button className="tab-btn">Specifications</button>
            <button className="tab-btn">Reviews</button>
          </div>
          
          <div className="tab-content">
            <div className="description">
              <h3>Product Description</h3>
              <p>{product.description || 'High-quality product with excellent features and premium build quality. Perfect for daily use with long-lasting durability.'}</p>
              
              <h3>Key Features</h3>
              <ul>
                <li>Premium quality materials</li>
                <li>Durable construction</li>
                <li>Easy to use</li>
                <li>Great value for money</li>
                <li>Warranty included</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h3>Customer Reviews ({product.reviews})</h3>
          <div className="review-summary">
            <div className="rating-breakdown">
              <div className="rating-bar">
                <span>5 ⭐</span>
                <div className="bar"><div className="fill" style={{width: '60%'}}></div></div>
                <span>60%</span>
              </div>
              <div className="rating-bar">
                <span>4 ⭐</span>
                <div className="bar"><div className="fill" style={{width: '25%'}}></div></div>
                <span>25%</span>
              </div>
              <div className="rating-bar">
                <span>3 ⭐</span>
                <div className="bar"><div className="fill" style={{width: '10%'}}></div></div>
                <span>10%</span>
              </div>
              <div className="rating-bar">
                <span>2 ⭐</span>
                <div className="bar"><div className="fill" style={{width: '3%'}}></div></div>
                <span>3%</span>
              </div>
              <div className="rating-bar">
                <span>1 ⭐</span>
                <div className="bar"><div className="fill" style={{width: '2%'}}></div></div>
                <span>2%</span>
              </div>
            </div>
          </div>

          <div className="individual-reviews">
            <div className="review">
              <div className="reviewer">
                <span className="name">Rajesh K.</span>
                <span className="rating">⭐⭐⭐⭐⭐</span>
              </div>
              <p>Excellent product! Great quality and fast delivery. Highly recommended.</p>
              <span className="review-date">2 days ago</span>
            </div>
            
            <div className="review">
              <div className="reviewer">
                <span className="name">Priya S.</span>
                <span className="rating">⭐⭐⭐⭐</span>
              </div>
              <p>Good value for money. Product matches the description perfectly.</p>
              <span className="review-date">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
      
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
      
      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onSignIn={() => {
          setShowLoginPrompt(false)
          navigate('/')
        }}
        onSignUp={() => {
          setShowLoginPrompt(false)
          navigate('/')
        }}
      />
    </div>
  )
}