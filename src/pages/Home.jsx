import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import "./Home.css";

const categories = ["Textbooks", "Electronics", "Stationery", "Food & Meals", "Apparel"];
const trustPoints = [
  { icon: "👥", label: "4 Campuses" },
  { icon: "🛡", label: "PayFast & SnapScan" },
  { icon: "♥", label: "Reviews & Ratings" },
];

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    async function loadFeatured() {
      // Update the query in your Home / VendorDashboard component:
const { data, error } = await supabase
  .from("products")
  .select(`
    *,
    categories ( category_name ),
    vendors ( business_name ),
    listing_images ( image_id, image_url, is_primary )
  `)
  .order("created_at", { ascending: false })
  .limit(4);

      if (error) {
        console.error("Error loading featured items:", error.message);
      } else {
        setFeaturedItems(data ?? []);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="page">
      <Header />

      <main className="home-hero">
        <div className="hero-copy">
          <h1>Buy, sell and connect on campus — safely.</h1>
          <p>
            Textbooks, electronics, dorm essentials and local services from people in your
            campus community. Verified accounts, secure payments, real reviews.
          </p>

          <div className="hero-actions">
            <Link to="/browse" className="btn btn-pill btn-dark">
              Browse Listings →
            </Link>
            <Link to="/vendor" className="btn btn-pill btn-outline">
              Sell as vendor
            </Link>
          </div>

          <div className="hero-trust">
            {trustPoints.map((point) => (
              <span key={point.label}>
                <span aria-hidden="true">{point.icon}</span> {point.label}
              </span>
            ))}
          </div>

          <div className="hero-categories">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/browse?category=${encodeURIComponent(category)}`}
                className="category-pill"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-gallery">
          <div className="hero-gallery-grid">
            {featuredItems.length === 0 ? (
              <p className="browse-empty">No listings yet.</p>
            ) : (
              featuredItems.map((item) => (
                <ProductCard
                  key={item.product_id}
                  {...item}
                  category={item.categories?.category_name}
                />
              ))
            )}
          </div>
          <Link to="/browse" className="view-all">
            View All →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}