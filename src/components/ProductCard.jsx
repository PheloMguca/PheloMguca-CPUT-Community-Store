import React from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

export default function ProductCard({
  id,
  product_id,
  title,
  product_name,
  price,
  vendor,
  vendor_public,
  image,
  image_url,
  category,
}) {
  const { user } = useAuth();
  const cardId = id ?? product_id;
  const cardTitle = title || product_name;
  const vendorName = vendor || vendor_public?.business_name;

  const displayImage =
    image ||
    image_url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";

  // Format price safely: strips extra 'R' if already passed in as "R320"
  const formattedPrice =
    typeof price === "string" ? price.replace(/^R\s*/i, "") : price;

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    // 1. Get this user's cart, or create it
    let { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("cart_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError) {
      alert("Could not add to cart: " + cartError.message);
      return;
    }

    if (!cart) {
      const res = await supabase
        .from("cart")
        .insert({ user_id: user.id })
        .select("cart_id")
        .single();
      if (res.error) {
        alert("Could not add to cart: " + res.error.message);
        return;
      }
      cart = res.data;
    }

    // 2. If the product is already in the cart, add 1 to the quantity
    const { data: existing } = await supabase
      .from("cart_items")
      .select("cart_item_id, quantity")
      .eq("cart_id", cart.cart_id)
      .eq("product_id", cardId)
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
        product_id: cardId,
        quantity: 1,
        unit_price: Number(formattedPrice),
      }));
    }

    if (error) {
      console.error("Add to cart failed:", error.message);
      alert("Could not add to cart: " + error.message);
    } else {
      alert("Added to cart!");
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        {category && <span className="product-card-badge">{category}</span>}
        <img
          src={displayImage}
          alt={cardTitle || "Product listing"}
          className="product-card-image"
        />
      </div>

      <div className="product-card-content">
        <div className="product-card-header">
          <p className="product-card-vendor">by {vendorName || "Campus Vendor"}</p>
          <h3 className="product-card-title">{cardTitle || "Untitled Product"}</h3>
        </div>

        <div className="product-card-footer">
          <div className="product-card-price-container">
            <span className="product-card-currency">R</span>
            <span className="product-card-price">{formattedPrice || "0"}</span>
          </div>

          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}