import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./VendorDashboard.css";

export default function VendorDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch vendor row from public.vendors table matching user_id
        const { data: vendorData, error: vendorError } = await supabase
          .from("vendors")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (vendorError) {
          console.error("Error fetching vendor record:", vendorError.message);
        } else {
          setVendor(vendorData);
        }

        // 2. Fetch listings for this vendor if a vendor_id exists
        if (vendorData?.vendor_id) {
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("vendor_id", vendorData.vendor_id);

          if (!productError && productData) {
            setProducts(productData);
          }
        }
      } catch (err) {
        console.error("Unexpected error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchVendorData();
    }
  }, [user, authLoading]);

  // Loading state prevents white/blank screen flashes while fetching session
  if (authLoading || loading) {
    return (
      <div className="page">
        <Header />
        <main className="dashboard-main">
          <div className="dashboard-loading">Loading Vendor Dashboard...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Display name fallback chain
  const displayName =
    profile?.full_name || vendor?.business_name || user?.email || "Vendor";

  const stats = [
    { label: "Active Listings", value: products.length },
    { label: "Items Sold", value: 0 },
    { label: "Revenue", value: "R0" },
    { label: "Avg Rating", value: "N/A" },
  ];

  return (
    <div className="page">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Vendor Dashboard</h1>
            <p className="browse-subtitle">Welcome back, {displayName}</p>
          </div>
          <Link to="/vendor/add-listing" className="btn btn-pill btn-dark">
            + Add New Listing
          </Link>
        </div>

        <section className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </section>

        <div className="dashboard-section-header">
          <h2>Recent Listings</h2>
          <Link to="/vendor/my-listings" className="view-all-link">
            View all
          </Link>
        </div>

        <div className="dashboard-grid">
          {products.length > 0 ? (
            products.slice(0, 4).map((item) => (
              <ProductCard key={item.id || item.product_id} {...item} />
            ))
          ) : (
            <div className="no-listings">
              <p>You have no active listings yet.</p>
              <Link to="/vendor/add-listing" className="btn-link">
                Create your first listing
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}