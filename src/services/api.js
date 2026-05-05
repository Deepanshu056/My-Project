// src/services/api.js
const API_URL = 'https://fakestoreapi.com/products'

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch')
    const data = await response.json()
    // Return first 8 products with clean structure
    return data.slice(0, 8).map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description
    }))
  } catch (error) {
    console.error('API Error:', error)
    // Fallback data in case API fails
    return [
      { id: 1, title: 'Classic White Tee', price: 29.99, image: 'https://via.placeholder.com/300x200?text=T-Shirt' },
      { id: 2, title: 'Slim Fit Jeans', price: 59.99, image: 'https://via.placeholder.com/300x200?text=Jeans' },
      { id: 3, title: 'Casual Sneakers', price: 89.99, image: 'https://via.placeholder.com/300x200?text=Sneakers' },
      { id: 4, title: 'Leather Jacket', price: 199.99, image: 'https://via.placeholder.com/300x200?text=Jacket' },
    ]
  }
}