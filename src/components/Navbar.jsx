// src/components/Navbar.jsx
import React from 'react'

const Navbar = ({ cartCount, onCartClick }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">ShopHub</div>
        <div className="nav-links">
          <a href="#">Shop</a>
          <a href="#">About</a>
          <button className="cart-icon" onClick={onCartClick}>
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar