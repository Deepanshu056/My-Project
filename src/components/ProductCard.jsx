// src/components/ProductCard.jsx
import React from 'react'

const ProductCard = ({ product, onAddToCart }) => {
  const { image, title, price } = product

  return (
    <div className="product-card">
      <img 
        src={image} 
        alt={title} 
        className="product-image"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Product' }}
      />
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <div className="product-price">${price.toFixed(2)}</div>
        <button 
          className="add-to-cart"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard