import { useParams, Link, useNavigate } from 'react-router-dom'
import './Page.css'

const pageContent = {
  'contact': {
    title: 'Contact Us',
    content: (
      <div>
        <h3>Get in Touch</h3>
        <p>📧 Email: support@smartbuyr.com</p>
        <p>📞 Phone: 1-800-SMART-BUY</p>
        <p>💬 Live Chat: Available 24/7</p>
        <p>📍 Address: 123 Commerce St, Shopping City, SC 12345</p>
      </div>
    )
  },
  'faq': {
    title: 'Frequently Asked Questions',
    content: (
      <div>
        <h3>Common Questions</h3>
        <div className="faq-item">
          <h4>How do I track my order?</h4>
          <p>You can track your order using the tracking number sent to your email.</p>
        </div>
        <div className="faq-item">
          <h4>What is your return policy?</h4>
          <p>We offer 30-day returns on all items in original condition.</p>
        </div>
      </div>
    )
  },
  'shipping': {
    title: 'Shipping Information',
    content: (
      <div>
        <h3>Shipping Options</h3>
        <p>🚚 Standard Shipping: 5-7 business days - FREE on orders over $50</p>
        <p>⚡ Express Shipping: 2-3 business days - $9.99</p>
        <p>🚀 Overnight Shipping: Next business day - $19.99</p>
      </div>
    )
  },
  'returns': {
    title: 'Returns & Exchanges',
    content: (
      <div>
        <h3>Return Policy</h3>
        <p>✅ 30-day return window</p>
        <p>✅ Free return shipping</p>
        <p>✅ Full refund or exchange</p>
        <p>✅ Items must be in original condition</p>
      </div>
    )
  },
  'track': {
    title: 'Track Your Order',
    content: (
      <div>
        <h3>Order Tracking</h3>
        <input type="text" placeholder="Enter tracking number" className="track-input" />
        <button className="btn btn-primary">Track Order</button>
      </div>
    )
  },
  'privacy': {
    title: 'Privacy Policy',
    content: (
      <div>
        <h3>Your Privacy Matters</h3>
        <p>We collect and use your information to provide better service.</p>
        <p>We never sell your personal data to third parties.</p>
        <p>Your payment information is encrypted and secure.</p>
      </div>
    )
  },
  'terms': {
    title: 'Terms of Service',
    content: (
      <div>
        <h3>Terms & Conditions</h3>
        <p>By using SmartBuyr, you agree to our terms of service.</p>
        <p>All purchases are subject to availability.</p>
        <p>Prices are subject to change without notice.</p>
      </div>
    )
  },
  'about': {
    title: 'About SmartBuyr',
    content: (
      <div>
        <h3>Our Story</h3>
        <p>SmartBuyr was founded with a mission to make online shopping smarter and more personalized.</p>
        <p>We use AI-powered recommendations to help you find exactly what you need.</p>
        <p>Founded in 2024, we're committed to innovation and customer satisfaction.</p>
      </div>
    )
  }
}

export function Page() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const page = pageContent[slug]

  if (!page) {
    return (
      <div className="page-container">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <button onClick={() => navigate('/')} className="back-btn">← Back to Home</button>
          <h1>{page.title}</h1>
        </div>
        <div className="page-content">
          {page.content}
        </div>
      </div>
    </div>
  )
}