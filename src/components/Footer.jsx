import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-col">
        <h4>CPUT Community Store</h4>
        <p>Verified Campus Marketplace</p>
      </div>

      <div className="footer-col">
        <h4>Marketplace</h4>
        <a href="/browse">Browse Listings</a>
        <a href="/vendor">Sell as a vendor</a>
        <a href="/bulletin">Community Bulletin</a>
      </div>

      <div className="footer-col">
        <h4>Trust &amp; Safety</h4>
        <a href="#verified">Verified Accounts</a>
        <a href="#payments">Secure Payments</a>
        <a href="#reviews">Reviews &amp; Ratings</a>
      </div>

      <div className="footer-search">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Search textbooks, electronics, vendors.." />
      </div>
    </footer>
  );
}
