import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  async function fetchProductDetails() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories ( category_name ),
          vendors ( business_name, user_id ),
          listing_images ( image_id, image_url, is_primary )
        `)
        .eq("product_id", id)
        .single();

      if (error) throw error;

      setProduct(data);

      if (data?.listing_images && data.listing_images.length > 0) {
        const primary = data.listing_images.find((img) => img.is_primary) || data.listing_images[0];
        setSelectedImage(primary.image_url);
      }
    } catch (err) {
      console.error("Error loading product details:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // Add to Cart Logic
  const handleAddToCart = async () => {
    if (!user) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    try {
      setAddingToCart(true);

      // 1. Get or create active cart for user
      let { data: cart, error: cartError } = await supabase
        .from("cart")
        .select("cart_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cartError) throw cartError;

      if (!cart) {
        const res = await supabase
          .from("cart")
          .insert({ user_id: user.id })
          .select("cart_id")
          .single();
        if (res.error) throw res.error;
        cart = res.data;
      }

      // 2. Check if item is already in cart
      const { data: existing } = await supabase
        .from("cart_items")
        .select("cart_item_id, quantity")
        .eq("cart_id", cart.cart_id)
        .eq("product_id", Number(id))
        .maybeSingle();

      let error;
      if (existing) {
        ({ error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + 1 })
          .eq("cart_item_id", existing.cart_item_id));
      } else {
        ({ error } = await supabase.from("cart_items").insert({
          cart_id: cart.cart_id,
          product_id: Number(id),
          quantity: 1,
          unit_price: Number(product.price),
        }));
      }

      if (error) throw error;
      alert(`"${product.product_name}" added to your cart!`);
    } catch (err) {
      console.error("Add to cart failed:", err.message);
      alert("Could not add to cart: " + err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  // Report/Flag Handler
  async function handleFlagProduct() {
    if (!user) {
      alert("Please log in to report a listing.");
      return;
    }

    const reason = window.prompt("Why are you reporting this listing? (e.g., Scam, Prohibited item, Broken rule)");
    if (!reason || !reason.trim()) return;

    try {
      const { error } = await supabase.from("listing_flags").insert({
        product_id: Number(id),
        user_id: user.id,
        reason: reason.trim(),
        status: "open",
      });

      if (error) throw error;
      alert("Listing reported to campus admins for review.");
    } catch (err) {
      alert("Could not report listing: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <Header />
        <main className="details-main"><p>Loading listing details...</p></main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <Header />
        <main className="details-main">
          <h2>Product Not Found</h2>
          <button className="btn btn-dark" onClick={() => navigate("/browse")}>Back to Browse</button>
        </main>
        <Footer />
      </div>
    );
  }

  const defaultPlaceholder = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80";

  return (
    <div className="page">
      <Header />
      <main className="details-main">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

        <div className="details-grid">
          {/* Gallery View */}
          <div className="details-gallery">
            <div className="main-image-wrapper">
              <img
                src={selectedImage || defaultPlaceholder}
                alt={product.product_name}
                className="main-image"
              />
            </div>
            {product.listing_images?.length > 1 && (
              <div className="thumbnail-list">
                {product.listing_images.map((img) => (
                  <img
                    key={img.image_id}
                    src={img.image_url}
                    alt=""
                    className={`thumb ${selectedImage === img.image_url ? "active" : ""}`}
                    onClick={() => setSelectedImage(img.image_url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Item Details Panel */}
          <div className="details-info">
            <span className="badge-category">{product.categories?.category_name || "General"}</span>
            <h1>{product.product_name}</h1>
            <p className="details-price">R{product.price}</p>

            <div className="meta-box">
              <p><strong>Vendor:</strong> {product.vendors?.business_name || "Campus Seller"}</p>
              <p><strong>Condition:</strong> {product.condition || "Used"}</p>
              <p><strong>Stock Available:</strong> {product.quantity ?? 1}</p>
            </div>

            <div className="details-description">
              <h3>Description</h3>
              <p>{product.description || "No description provided for this listing."}</p>
            </div>

            {/* Action Buttons */}
            <div className="details-actions">
              <button 
                type="button" 
                className="add-to-cart-btn-large" 
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button type="button" className="btn-flag" onClick={handleFlagProduct}>
                🚩 Report Item
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}