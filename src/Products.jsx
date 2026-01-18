import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products/')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.slice(0, 20))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
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

  return (
    <div className="products-page">
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
          <h1>All Products</h1>
          <p>Browse our entire product catalog</p>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">📦</div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">${product.price}</div>
                  <div className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</div>
                  <button className="btn btn-secondary">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}