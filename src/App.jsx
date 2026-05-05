// src/App.jsx
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import CartSidebar from './components/CartSidebar'
import { fetchProducts } from './services/api'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === id)
      if (!item) return prevCart
      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== id)
      }
      return prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    })
  }

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="app">
      <Navbar 
        cartCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <section className="hero">
        <div className="container">
          <h1>Fresh & Trendy Styles</h1>
          <p>Discover the best products curated just for you</p>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="loading">Loading amazing products...</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        )}
      </div>

      {isCartOpen && (
        <CartSidebar 
          cart={cart}
          total={cartTotal}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      )}
    </div>
  )
}

export default App