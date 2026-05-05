import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

// Mock the API
vi.mock('../services/api', () => ({
  fetchProducts: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test Product', price: 49.99, image: 'test.jpg', description: 'Test description' },
    { id: 2, title: 'Another Product', price: 29.99, image: 'test2.jpg', description: 'Another description' }
  ])
}))

describe('E-commerce App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders hero section and product grid', async () => {
    render(<App />)
    
    expect(screen.getByText(/Fresh & Trendy Styles/i)).toBeInTheDocument()
    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('$49.99')).toBeInTheDocument()
    })
  })

  it('adds product to cart and updates cart count', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    
    const cartButton = screen.getByRole('button', { name: /🛒/i })
    expect(cartButton).toHaveTextContent('1')
  })

  it('opens cart sidebar and displays added item', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    
    const cartButton = screen.getByRole('button', { name: /🛒/i })
    fireEvent.click(cartButton)
    
    expect(screen.getByText('Your Cart')).toBeInTheDocument()
    // Use getAllByText and check first element or use more specific selector
    const cartItems = screen.getAllByText('Test Product')
    expect(cartItems.length).toBe(2) // One in product grid, one in cart
    expect(cartItems[1]).toBeInTheDocument() // The one in cart
  })

  it('updates item quantity in cart', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    
    const cartButton = screen.getByRole('button', { name: /🛒/i })
    fireEvent.click(cartButton)
    
    const incrementButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(incrementButton)
    
    // Use a more specific query - find the quantity in cart item
    const quantitySpan = screen.getAllByText('2')
    expect(quantitySpan.length).toBe(2) // One in cart badge, one in cart item
    expect(quantitySpan[1]).toBeInTheDocument() // The quantity in cart item
  })

  it('removes item from cart', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    
    const cartButton = screen.getByRole('button', { name: /🛒/i })
    fireEvent.click(cartButton)
    
    const removeButton = screen.getByText('Remove')
    fireEvent.click(removeButton)
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('calculates correct total price', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
    
    // Add first product
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    
    // Add second product
    fireEvent.click(addButtons[1])
    
    // Open cart
    const cartButton = screen.getByRole('button', { name: /🛒/i })
    fireEvent.click(cartButton)
    
    // Check total (49.99 + 29.99 = 79.98)
    expect(screen.getByText('$79.98')).toBeInTheDocument()
  })
})