import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Contact() {
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      setFormData(prev => ({
        ...prev,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email
      }))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="contact-page">
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
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>support@smartbuyr.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>1-800-SMART-BUY</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div>
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Address</h3>
                <p>123 Commerce St<br/>Shopping City, SC 12345</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Send us a Message</h2>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}