import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { listings } from "../data/listings";
import "./ItemDetail.css";

export default function ItemDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const item = listings.find(
    (listing) => String(listing.id) === String(id)
  );

  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return (
      <div className="page">
        <Header />

        <main className="item-detail-main">
          <div className="item-not-found">
            <h1>Item Not Found</h1>
            <p>
              The item you are looking for could not be found.
            </p>

            <button
              className="btn btn-pill btn-dark"
              onClick={() => navigate("/shop")}
            >
              Back to Store
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    alert(
      `${item.name} added to cart.\nQuantity: ${quantity}`
    );
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        item,
        quantity,
      },
    });
  };

  return (
    <div className="page">
      <Header />

      <main className="item-detail-main">

        <div className="item-detail-header">
          <button
            className="back-link"
            onClick={() => navigate("/shop")}
          >
            ← Back to Store
          </button>
        </div>

        <div className="item-detail-container">

          {/* Product Image */}
          <section className="item-image-section">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="item-image"
              />
            ) : (
              <div className="item-image-placeholder">
                No Image Available
              </div>
            )}
          </section>

          {/* Product Information */}
          <section className="item-info-section">

            <p className="item-category">
              {item.category}
            </p>

            <h1 className="item-title">
              {item.name}
            </h1>

            <p className="item-price">
              R{item.price}
            </p>

            <p className="item-description">
              {item.description || "No description available for this item."}
            </p>

            {/* Stock */}
            <div className="item-stock">
              {item.stock > 0 ? (
                <span>✓ {item.stock} items available</span>
              ) : (
                <span>Out of stock</span>
              )}
            </div>

            {/* Quantity */}
            {item.stock > 0 && (
              <div className="item-option">
                <span className="item-option-label">
                  Quantity
                </span>

                <div className="quantity-container">
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={decreaseQuantity}
                  >
                    −
                  </button>

                  <div className="quantity-value">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    className="quantity-button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Order Summary */}
            {item.stock > 0 && (
              <div className="checkout-summary">

                <div className="summary-row">
                  <span>Price</span>
                  <span>R{item.price}</span>
                </div>

                <div className="summary-row">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <strong>
                    R{(Number(item.price) * quantity).toFixed(2)}
                  </strong>
                </div>

              </div>
            )}

            {/* Actions */}
            {item.stock > 0 && (
              <div className="item-actions">

                <button
                  type="button"
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  className="buy-now-button"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>

              </div>
            )}

            {/* Store Information */}
            <div className="checkout-info">

              <div className="checkout-info-item">
                ✓ CPUT Community Store
              </div>

              <div className="checkout-info-item">
                ✓ Available for campus collection
              </div>

              <div className="checkout-info-item">
                ✓ Secure checkout
              </div>

            </div>

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}