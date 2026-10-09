import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./MyListings.css";

export default function MyListings() {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      fetchVendorProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchVendorProducts() {
    try {
      setLoading(true);
      setErrorMsg("");

      // 1. Fetch Vendor profile for the logged in user
      const { data: vendor, error: vendorError } = await supabase
        .from("vendors")
        .select("vendor_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vendorError) throw vendorError;

      // 2. Fetch active products matching vendor_id or user_id
      let query = supabase
        .from("products")
        .select(`
          *,
          categories ( category_name ),
          listing_images ( image_id, image_url, is_primary )
        `)
        .neq("status", "removed") // Exclude soft-deleted products
        .order("created_at", { ascending: false });

      if (vendor?.vendor_id) {
        query = query.eq("vendor_id", vendor.vendor_id);
      } else {
        query = query.eq("user_id", user.id);
      }

      const { data: products, error: productsError } = await query;

      if (productsError) throw productsError;

      setMyProducts(products || []);
    } catch (err) {
      console.error("Error fetching vendor listings:", err.message);
      setErrorMsg("Failed to load your listings: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;

    try {
      // Soft delete by setting status = 'removed'
      const { error } = await supabase
        .from("products")
        .update({ status: "removed" })
        .eq("product_id", productId);

      if (error) throw error;

      setMyProducts((prev) => prev.filter((p) => p.product_id !== productId));
    } catch (err) {
      alert("Could not remove listing: " + err.message);
    }
  }

  return (
    <div className="page">
      <Header />
      <main className="my-listings-main" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1>My Listings</h1>
            <p style={{ color: "#6b7280" }}>Manage items you are currently selling on campus.</p>
          </div>
          <Link to="/vendor/add-listing" className="btn btn-pill btn-dark" style={{ textDecoration: "none", padding: "0.75rem 1.25rem" }}>
            + Add New Listing
          </Link>
        </div>

        {errorMsg && (
          <p style={{ color: "#dc2626", background: "#fef2f2", padding: "1rem", borderRadius: "8px" }}>
            {errorMsg}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading your listings...</p>
        ) : myProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", background: "#f9fafb", borderRadius: "12px" }}>
            <p style={{ fontSize: "1.1rem", color: "#4b5563" }}>You haven't created any active listings yet.</p>
            <Link to="/vendor/add-listing" style={{ color: "#16324f", fontWeight: "bold" }}>
              Publish your first listing →
            </Link>
          </div>
        ) : (
          <div className="browse-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {myProducts.map((product) => (
              <div key={product.product_id} style={{ position: "relative" }}>
                <ProductCard
                  product_id={product.product_id}
                  product_name={product.product_name}
                  price={product.price}
                  category={product.categories?.category_name}
                  listing_images={product.listing_images}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    onClick={() => handleDeleteProduct(product.product_id)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#fee2e2",
                      color: "#991b1b",
                      border: "1px solid #fca5a5",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Delete Listing
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