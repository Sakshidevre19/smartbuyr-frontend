import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function About() {
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

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

  return (
    <div className="about-page">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>SmartBuyr</div>
            <ul className="nav-links">
              <li><a href="/" onClick={(e) => {e.preventDefault(); navigate('/')}}>Home</a></li>
              <li><a href="/shop" onClick={(e) => {e.preventDefault(); navigate('/shop')}}>Shop</a></li>
              <li><a href="/products" onClick={(e) => {e.preventDefault(); navigate('/products')}}>Products</a></li>
              <li><a href="/about" onClick={(e) => {e.preventDefault(); navigate('/about')}}>About</a></li>
              <li><a href="/contact" onClick={(e) => {e.preventDefault(); navigate('/contact')}}>Contact</a></li>
            </ul>
            <div className="nav-actions">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">🔍</button>
              </form>
              {user ? (
                <>
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
        <div className="page-header">
          <button onClick={() => navigate('/')} className="back-btn">← Back to Home</button>
          <h1>About SmartBuyr</h1>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>SmartBuyr was founded with a mission to revolutionize online shopping through intelligent recommendations and personalized experiences. We believe that shopping should be smart, simple, and tailored to your unique needs.</p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>To make online shopping smarter and more personalized by leveraging AI-powered recommendations that help customers discover products they'll love.</p>
          </section>

          <section className="about-section">
            <h2>Why Choose SmartBuyr?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI-Powered Recommendations</h3>
                <p>Our advanced algorithms learn your preferences to suggest products you'll love.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3>Secure Shopping</h3>
                <p>Your data and payments are protected with industry-leading security measures.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Quick and reliable shipping to get your products to you as soon as possible.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3>24/7 Support</h3>
                <p>Our customer service team is always here to help with any questions.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li><strong>Innovation:</strong> We continuously improve our platform with cutting-edge technology.</li>
              <li><strong>Customer First:</strong> Every decision we make prioritizes our customers' needs.</li>
              <li><strong>Quality:</strong> We partner with trusted brands to ensure product quality.</li>
              <li><strong>Transparency:</strong> We believe in honest pricing and clear communication.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}