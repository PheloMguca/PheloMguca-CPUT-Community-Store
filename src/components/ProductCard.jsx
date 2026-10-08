import React from "react";
import "./ProductCard.css";

export default function ProductCard({
  id,
  title,
  price,
  vendor,
  image,
  image_url,
  category,
  onAddToCart,
}) {
  const displayImage = image || image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60";
  
  // Format price safely: strips extra 'R' if already passed in as "R320"
  const formattedPrice = typeof price === "string" ? price.replace(/^R\s*/i, "") : price;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, title, price: formattedPrice, vendor, image: displayImage });
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        {category && <span className="product-card-badge">{category}</span>}
        <img
          src={displayImage}
          alt={title || "Product listing"}
          className="product-card-image"
        />
      </div>

      <div className="product-card-content">
        <div className="product-card-header">
          <p className="product-card-vendor">by {vendor || "Vendor"}</p>
          <h3 className="product-card-title">{title || "Untitled Product"}</h3>
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