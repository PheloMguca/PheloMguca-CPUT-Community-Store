import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { listings } from "../../data/listings";
import "./ShoppingCart.css";

export default function ShoppingCart() {
  const navigate = useNavigate();

  // Mock cart using existing listings
  const [cartItems, setCartItems] = useState(
    listings.slice(0, 2).map((item) => ({
      ...item,
      quantity: 1,
    }))
  );

  const increaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity < item.stock
                  ? item.quantity + 1
                  : item.quantity,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity - 1),
              }
            : item
        )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
      },
    });
  };

  return (
    <div className="page">
      <Header />

      <main className="shopping-cart-main">

        <div className="shopping-cart-header">
          <div>
            <h1>Shopping Cart</h1>

            <p className="shopping-cart-subtitle">
              Review your items before checkout.
            </p>
          </div>
        </div>

        {cartItems.length === 0 ? (

          <div className="empty-cart">
            <h1>Your cart is empty</h1>

            <p>
              You haven't added any items to your cart yet.
            </p>

            <button
              className="empty-cart-button"
              onClick={() => navigate("/shop")}
            >
              Browse Store
            </button>
          </div>

        ) : (

          <div className="shopping-cart-container">

            {/* Cart Items */}
            <section className="cart-items-section">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="cart-item"
                >

                  {/* Product Image */}
                  <div className="cart-item-image-container">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                    ) : (
                      <span>No Image</span>
                    )}

                  </div>

                  {/* Product Details */}
                  <div className="cart-item-details">

                    <p className="cart-item-category">
                      {item.category}
                    </p>

                    <h3 className="cart-item-name">
                      {item.name}
                    </h3>

                    <p className="cart-item-price">
                      R{item.price}
                    </p>

                    <div className="cart-quantity">

                      <button
                        className="cart-quantity-button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        −
                      </button>

                      <div className="cart-quantity-value">
                        {item.quantity}
                      </div>

                      <button
                        className="cart-quantity-button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Item Total */}
                  <div className="cart-item-total">

                    <p className="cart-item-total-price">
                      R
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                    <button
                      className="remove-cart-item"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </section>

            {/* Order Summary */}
            <aside className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>
                  Items ({totalItems})
                </span>

                <span>
                  R{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="summary-row">
                <span>Campus Collection</span>

                <span>Free</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>

                <strong className="summary-total-price">
                  R{subtotal.toFixed(2)}
                </strong>
              </div>

              <button
                className="checkout-button"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <button
                className="continue-shopping-button"
                onClick={() => navigate("/shop")}
              >
                Continue Shopping
              </button>

              <div className="cart-checkout-info">

                <div className="cart-checkout-info-item">
                  ✓ Secure checkout
                </div>

                <div className="cart-checkout-info-item">
                  ✓ CPUT campus collection available
                </div>

                <div className="cart-checkout-info-item">
                  ✓ Community Store verified vendors
                </div>

              </div>

            </aside>

          </div>

        )}

      </main>

      <Footer />
    </div>
  );
}