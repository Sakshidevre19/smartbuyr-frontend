import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function UserProfile() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  })
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const savedAddress = localStorage.getItem('userAddress')
    
    if (!userData) {
      navigate('/')
      return
    }
    
    setUser(JSON.parse(userData))
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress))
    }
    
    // Mock data for orders and wishlist
    setOrders([
      { id: 1, date: '2024-01-15', total: 299.99, status: 'Delivered', items: 3 },
      { id: 2, date: '2024-01-10', total: 149.50, status: 'Shipped', items: 2 }
    ])
    
    setWishlist([
      { id: 1, name: 'Premium Headphones', price: 299, image: '🎧' },
      { id: 2, name: 'Smart Watch', price: 199, image: '⌚' }
    ])
  }, [navigate])

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('userAddress', JSON.stringify(address))
    setIsEditingAddress(false)
    alert('Address saved successfully!')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userAddress')
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="profile-page">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>SmartBuyr</div>
            <div className="nav-actions">
              <span title="Cart">🛒</span>
              <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-info">
              <div className="profile-avatar">👤</div>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>
            
            <nav className="profile-nav">
              <button 
                className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                📋 Profile & Address
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                📦 Orders
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                ❤️ Wishlist
              </button>
            </nav>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <h2>Delivery Address</h2>
                
                {!isEditingAddress && address.street ? (
                  <div className="address-display">
                    <div className="address-card">
                      <p><strong>{user.firstName} {user.lastName}</strong></p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>Phone: {address.phone}</p>
                    </div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      Update Address
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAddressSubmit} className="address-form">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => setAddress({...address, state: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={address.zipCode}
                      onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={address.phone}
                      onChange={(e) => setAddress({...address, phone: e.target.value})}
                      required
                    />
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Save Address</button>
                      {address.street && (
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setIsEditingAddress(false)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="profile-section">
                <h2>Order History</h2>
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">Order #{order.id}</span>
                        <span className={`order-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <p>Date: {order.date}</p>
                        <p>Items: {order.items}</p>
                        <p>Total: ${order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="profile-section">
                <h2>My Wishlist</h2>
                <div className="wishlist-grid">
                  {wishlist.map(item => (
                    <div key={item.id} className="wishlist-item">
                      <div className="product-image">{item.image}</div>
                      <div className="product-info">
                        <h4>{item.name}</h4>
                        <p>${item.price}</p>
                        <button className="btn btn-primary">Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}