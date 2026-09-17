import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { listings } from "../data/listings";
import "./MyListings.css";

const myVendorName = "Phelo M."; // change later to logged-in user

export default function MyListings() {
  const mine = listings.filter((item) => item.vendor === myVendorName);

  return (
    <div className="page">
      <Header />
      <main className="my-listings-main">
        <div className="my-listings-header">
          <h1>My Listings</h1>
          <Link to="/vendor/add-listing" className="btn btn-pill btn-dark">
            + Add New Listing
          </Link>
        </div>
        <p className="browse-subtitle">{mine.length} active listings</p>

        {mine.length === 0 ? (
          <p className="browse-empty">You have no listings yet.</p>
        ) : (
          <div className="my-listings-grid">
            {mine.map((item) => (
              <div key={item.id} className="my-listing-card">
                <ProductCard {...item} />
                <div className="my-listing-actions">
                  <Link to={`/vendor/edit-listing/${item.id}`} className="btn-small">
                    Edit
                  </Link>
                  <button type="button" className="btn-small btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
