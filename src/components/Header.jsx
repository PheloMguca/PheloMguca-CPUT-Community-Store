import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-text">
          <span className="brand-name">CPUT Community Store</span>
          <span className="brand-tagline">Verified Campus Marketplace</span>
        </span>
      </Link>

      <div className="header-search">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Search textbooks, electronics, vendors.." />
      </div>

      <nav className="header-nav">
        <Link to="/browse">Browse</Link>
        <Link to="/bulletin">Bulletin</Link>
        <Link to="/vendor">Vendor</Link>
      </nav>

      <Link to="/cart" className="cart-icon" aria-label="Cart">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="21" r="1.4" fill="currentColor" />
          <circle cx="18" cy="21" r="1.4" fill="currentColor" />
        </svg>
      </Link>

      <Link to="/auth" className="btn btn-pill btn-dark">
        Sign In
      </Link>
    </header>
  );
}
