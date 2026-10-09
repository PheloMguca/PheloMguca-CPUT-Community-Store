import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../supabaseClient";

export default function AdminFlags() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlags();
  }, []);

  async function fetchFlags() {
    try {
      setLoading(true);
      // Fetch pending flags joined with product details
      const { data, error } = await supabase
        .from("listing_flags")
        .select(`
          flag_id,
          reason,
          status,
          created_at,
          products (
            product_id,
            product_name,
            price,
            vendors ( business_name )
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFlags(data || []);
    } catch (err) {
      console.error("Error fetching flags:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // Admin Action 1: Dismiss flag (Listing remains active)
  async function handleDismiss(flagId) {
    try {
      const { error } = await supabase
        .from("listing_flags")
        .update({ status: "dismissed" })
        .eq("flag_id", flagId);

      if (error) throw error;
      setFlags((prev) => prev.filter((f) => f.flag_id !== flagId));
    } catch (err) {
      alert("Error dismissing flag: " + err.message);
    }
  }

  // Admin Action 2: Remove Listing (Cascade deletes product and flags)
  async function handleRemoveListing(productId, flagId) {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", productId);

      if (error) throw error;

      // Remove from UI
      setFlags((prev) => prev.filter((f) => f.flag_id !== flagId));
      alert("Listing deleted successfully.");
    } catch (err) {
      alert("Error deleting listing: " + err.message);
    }
  }

  return (
    <div className="page">
      <Header />
      <main style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
        <h1>Flagged Listings (Admin)</h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          Review reported listings from students and moderate campus content.
        </p>

        {loading ? (
          <p>Loading flags...</p>
        ) : flags.length === 0 ? (
          <div style={{ background: "#f3f4f6", padding: "2rem", borderRadius: "8px", textAlign: "center" }}>
            <p>No pending listing reports!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {flags.map((flag) => (
              <div
                key={flag.flag_id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  background: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0" }}>
                    {flag.products?.product_name || "Unknown Product"}
                  </h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#4b5563", fontSize: "0.9rem" }}>
                    <strong>Vendor:</strong> {flag.products?.vendors?.business_name || "N/A"} |{" "}
                    <strong>Price:</strong> R{flag.products?.price}
                  </p>
                  <p style={{ margin: 0, color: "#dc2626", fontSize: "0.95rem" }}>
                    <strong>Reason for report:</strong> "{flag.reason}"
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleDismiss(flag.flag_id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleRemoveListing(flag.products?.product_id, flag.flag_id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#fee2e2",
                      color: "#991b1b",
                      border: "1px solid #fca5a5",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
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