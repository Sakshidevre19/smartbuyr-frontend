import { useState, useEffect } from 'react'
import axios from "axios";
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import { getApiUrl } from './services/api'
import { AuthModal } from './AuthModal'
import { SizeGuide } from './SizeGuide'
import { Page } from './Page'
import { UserProfile } from './UserProfile'
import { Shop } from './Shop'
import { Products } from './Products'
import { About } from './About'
import { Contact } from './Contact'
import { ProductDetail } from './ProductDetail'
import Cart from './Cart'
import Wishlist from './Wishlist'
import Notification from './Notification'
import LoginPrompt from './LoginPrompt'
import './App.css'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: [0, 25000],
    rating: 0,
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(true)
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false })
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  useEffect(() => {
    setSearchQuery(query)
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    if (query) {
      fetchSearchResults(query)
    }
  }, [query])
  useEffect(() => {
    applyFilters()
  }, [products, filters])
  const applyFilters = () => {
    let filtered = [...products]
    
    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )
    
    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }
    
    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    
    setFilteredProducts(filtered)
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
    setUser(null)
    navigate('/')
  }
const fetchSearchResults = async (searchQuery) => {
  try {
    setLoading(true);
    const response = await fetch(
      `${getApiUrl()}/api/products/search/?q=${encodeURIComponent(searchQuery)}`
    );
    if (response.ok) {
      const data = await response.json();
      // Handle paginated response
      setProducts(data.results || []);
      if (data.results && data.results.length > 0) {
        fetchRecommendations(data.results[0].id);
      }
    }
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    setLoading(false);
  }
};

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 25000],
      rating: 0,
      sortBy: 'relevance'
    })
  }
  const fetchRecommendations = async (productId) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/products/${productId}/recommendations/`)
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error('Recommendations error:', error)
    }
  }
  const addToWishlistFromGrid = async (e, productId) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!user || !token) {
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
        body: JSON.stringify({ product_id: productId })
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

  const addToCartFromGrid = async (e, productId) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!user || !token) {
      setShowLoginPrompt(true)
      return
    }
    try {
      const response = await fetch(`${getApiUrl()}/api/accounts/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      })
      const data = await response.json()
      setNotification({ 
        message: data.message || 'Added to cart successfully!', 
        type: 'success', 
        isVisible: true 
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      setNotification({ message: 'Failed to add to cart', type: 'error', isVisible: true })
    }
  }
  return (
    <div className="search-page">
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
        <h1>Search Results for "{query}"</h1>
        
        {loading ? (
          <div className="loading">Searching...</div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <h2>No products found for "{query}"</h2>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <>
            <div className={`search-layout ${showFilters ? 'with-filters' : ''}`}>
              {showFilters && (
                <div className="filters-sidebar">
                  <div className="filter-header">
                    <h3>Filters</h3>
                    <button onClick={clearFilters} className="clear-filters">Clear All</button>
                  </div>
                  
                  <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [+e.target.value, filters.priceRange[1]])}
                        className="price-input"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], +e.target.value])}
                        className="price-input"
                      />
                    </div>
                  </div>
                  
                  <div className="filter-section">
                    <h4>Customer Rating</h4>
                    <div className="rating-filters">
                      {[4, 3, 2, 1].map(rating => (
                        <label key={rating} className="rating-option">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating}
                            onChange={() => handleFilterChange('rating', rating)}
                          />
                          <span>{'⭐'.repeat(rating)} & above</span>
                        </label>
                      ))}
                      <label className="rating-option">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === 0}
                          onChange={() => handleFilterChange('rating', 0)}
                        />
                        <span>All Ratings</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="search-content">
                <div className="search-header">
                  <div className="results-info">
                    <button 
                      onClick={() => setShowFilters(!showFilters)} 
                      className="filter-toggle"
                    >
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <span>Showing {filteredProducts.length} of {products.length} results</span>
                  </div>
                  <div className="sort-options">
                    <label>Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="sort-select"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                    </select>
                  </div>
                </div>
                
                <div className="search-results">
                  <div className="product-grid">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <div className="product-info">
                          <h3 className="product-title">{product.name}</h3>
                          <div className="product-price">₹{product.price}</div>
                          <div className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</div>
                          <button className="btn btn-secondary" onClick={(e) => addToCartFromGrid(e, product.id)}>Buy Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {recommendations.length > 0 && (
              <div className="recommendations">
                <h2>Recommended for You</h2>
                <div className="product-grid">
                  {recommendations.map(product => (
                    <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                      <div className="product-image">
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-price">₹{product.price}</div>
                        <div className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</div>
                        <button className="btn btn-secondary" onClick={(e) => addToCartFromGrid(e, product.id)}>Buy Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  )
}
function HomePage() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' })
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false })
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [page, setPage] = useState(1);
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    fetchProducts()
    
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.8s ease-out forwards'
        }
      })
    }, observerOptions)
    
    const animateElements = document.querySelectorAll('.animate-on-scroll')
    animateElements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getApiUrl()}/api/products/`);
      // Handle paginated response
      const productsData = response.data.results || response.data || [];
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }
  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode })
  }
  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'signin' })
  }
  const switchAuthMode = (mode) => {
    setAuthModal({ isOpen: true, mode })
  }
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  const addToWishlistFromHomepage = async (e, productId) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!user || !token) {
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
        body: JSON.stringify({ product_id: productId })
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

  const addToCartFromHomepage = async (e, productId) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!user || !token) {
      setShowLoginPrompt(true)
      return
    }
    try {
      const response = await fetch(`${getApiUrl()}/api/accounts/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      })
      const data = await response.json()
      setNotification({ 
        message: data.message || 'Added to cart successfully!', 
        type: 'success', 
        isVisible: true 
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      setNotification({ message: 'Failed to add to cart', type: 'error', isVisible: true })
    }
  }
  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">SmartBuyr</div>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#shop" onClick={(e) => {e.preventDefault(); navigate('/shop')}}>Shop</a></li>
              <li><a href="#products" onClick={(e) => {e.preventDefault(); navigate('/products')}}>Products</a></li>
              <li><a href="#about" onClick={(e) => {e.preventDefault(); navigate('/about')}}>About</a></li>
              <li><a href="#contact" onClick={(e) => {e.preventDefault(); navigate('/contact')}}>Contact</a></li>
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
                <span className="search-icon"></span>
              </form>
              {user ? (
                <>
                  <span title="Cart" onClick={() => navigate('/cart')} style={{cursor: 'pointer'}}>🛒</span>
                  <span title="Wishlist" onClick={() => navigate('/wishlist')} style={{cursor: 'pointer'}}>❤️</span>
                  <span title="Account" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>👤</span>
                  <button className="btn btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-auth" onClick={() => openAuthModal('signin')}>
                    Sign In
                  </button>
                  <button className="btn btn-auth btn-primary" onClick={() => openAuthModal('signup')}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Smart Shopping Made Simple</h1>
            <p>Discover amazing products with intelligent recommendations tailored just for you</p>
          </div>
        </div>
      </section>
      <section className="products animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Handpicked items that combine quality, innovation, and style</p>
          <div className="product-grid">
            {loading ? (
              <div style={{textAlign: 'center', padding: '2rem'}}>Loading products...</div>
            ) : products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <span>📦</span>
                    )}
                    <button className="wishlist-heart" onClick={(e) => addToWishlistFromHomepage(e, product.id)}>♡</button>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name || product.title}</h3>
                    <div className="product-price">₹{product.price}</div>
                    <button className="btn btn-secondary" onClick={(e) => addToCartFromHomepage(e, product.id)}>Buy Now</button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{textAlign: 'center', padding: '2rem'}}>No products found. Make sure Django server is running on port 8000.</div>
            )}
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-sections">
              <div className="footer-section">
                <h4>Customer Service</h4>
                <ul>
                  <li><a href="/contact">Contact Us</a></li>
                  <li><a href="/faq">FAQ</a></li>
                  <li><a href="/shipping">Shipping Info</a></li>
                  <li><a href="/returns">Returns & Exchanges</a></li>
                  <li><a href="/track">Track Your Order</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Size & Fit</h4>
                <ul>
                  <li><button onClick={() => setSizeGuideOpen(true)}>Size Guide</button></li>
                  <li><a href="#fit">Fit Guide</a></li>
                  <li><a href="#measurements">How to Measure</a></li>
                  <li><a href="#sizing-tips">Sizing Tips</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>About SmartBuyr</h4>
                <ul>
                  <li><a href="/about">Our Story</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#sustainability">Sustainability</a></li>
                  <li><a href="#press">Press</a></li>
                  <li><a href="#investors">Investors</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Legal</h4>
                <ul>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="#cookies">Cookie Policy</a></li>
                  <li><a href="#accessibility">Accessibility</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Connect</h4>
                <ul>
                  <li><a href="#newsletter">Newsletter</a></li>
                  <li><a href="#social">Social Media</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#reviews">Customer Reviews</a></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-payment">
                <span>We Accept: </span>
                <span className="payment-icons">💳 🏦 💰 📱</span>
              </div>
              <p>&copy; 2024 SmartBuyr. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onSwitchMode={switchAuthMode}
      />
      
      <SizeGuide
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
      
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
          openAuthModal('signin')
        }}
        onSignUp={() => {
          setShowLoginPrompt(false)
          openAuthModal('signup')
        }}
      />
    </div>
  )
}
function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (storedToken && userData) {
      setToken(storedToken)
      setUser(JSON.parse(userData))
    }
  }, [])
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart user={user} token={token} />} />
      <Route path="/wishlist" element={<Wishlist user={user} token={token} />} />
      <Route path="/:slug" element={<Page />} />
    </Routes>
  )
}
export default App
