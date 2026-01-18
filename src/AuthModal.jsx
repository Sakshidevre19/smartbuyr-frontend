import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const endpoint = mode === 'signup' ? '/api/signup/' : '/api/signin/'
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onClose()
        navigate('/')
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>{mode === 'signup' ? 'Create Account' : 'Sign In'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          {mode === 'signup' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : (mode === 'signup' ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <p className="auth-switch">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => onSwitchMode(mode === 'signup' ? 'signin' : 'signup')}>
            {mode === 'signup' ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}