import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;
  const quantity = location.state?.quantity || 1;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    campus: "District Six",
    payment: "Pay at Collection",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!item) {
    return (
      <div className="page">
        <Header />

        <main className="checkout-main">
          <div className="order-confirmation">
            <h1>No Order Found</h1>

            <p>
              There are no items available for checkout.
              Please return to the store and select an item.
            </p>

            <button
              className="return-store-button"
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

  const itemPrice = Number(item.price);
  const subtotal = itemPrice * quantity;
  const collectionFee = 0;
  const total = subtotal + collectionFee;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="page">
        <Header />

        <main className="checkout-main">
          <div className="order-confirmation">

            <div className="order-confirmation-icon">
              ✓
            </div>

            <h1>Order Placed Successfully</h1>

            <p>
              Thank you for your order, {form.firstName}.
              Your order for {item.name} has been received.
            </p>

            <p>
              Collection: {form.campus}
            </p>

            <button
              className="return-store-button"
              onClick={() => navigate("/shop")}
            >
              Continue Shopping
            </button>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="checkout-main">

        {/* Checkout Header */}
        <div className="checkout-header">
          <h1>Checkout</h1>

          <p className="checkout-subtitle">
            Complete your details to place your order.
          </p>
        </div>

        <div className="checkout-container">

          {/* Checkout Form */}
          <section className="checkout-form-section">

            {/* Customer Information */}
            <div className="checkout-card">

              <h2>Customer Information</h2>

              <div className="checkout-form-row">

                <div className="checkout-form-group">
                  <label>First Name</label>

                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label>Last Name</label>

                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

              </div>

              <div className="checkout-form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="checkout-form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

            </div>

            {/* Collection Method */}
            <div className="checkout-card">

              <h2>Collection Method</h2>

              <div className="checkout-options">

                <label className="checkout-option">

                  <input
                    type="radio"
                    name="campus"
                    value="District Six"
                    checked={form.campus === "District Six"}
                    onChange={handleChange}
                  />

                  <div className="checkout-option-content">

                    <span className="checkout-option-title">
                      CPUT District Six Campus
                    </span>

                    <span className="checkout-option-description">
                      Collect your order from the CPUT Community Store.
                    </span>

                  </div>

                </label>

                <label className="checkout-option">

                  <input
                    type="radio"
                    name="campus"
                    value="Bellville"
                    checked={form.campus === "Bellville"}
                    onChange={handleChange}
                  />

                  <div className="checkout-option-content">

                    <span className="checkout-option-title">
                      CPUT Bellville Campus
                    </span>

                    <span className="checkout-option-description">
                      Collect your order from the selected campus.
                    </span>

                  </div>

                </label>

              </div>

            </div>

            {/* Payment Method */}
            <div className="checkout-card">

              <h2>Payment Method</h2>

              <div className="payment-options">

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="Pay at Collection"
                    checked={
                      form.payment === "Pay at Collection"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Pay at Collection
                  </span>

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="payment"
                    value="Online Payment"
                    checked={
                      form.payment === "Online Payment"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Online Payment
                  </span>

                </label>

              </div>

            </div>

            {/* Additional Notes */}
            <div className="checkout-card">

              <h2>Additional Notes</h2>

              <div className="checkout-form-group">

                <label>
                  Order Notes
                </label>

                <textarea
                  placeholder="Add any additional information about your order..."
                />

              </div>

            </div>

          </section>

          {/* Order Summary */}
          <aside className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-summary-items">

              <div className="checkout-summary-item">

                <div>

                  <p className="checkout-summary-item-name">
                    {item.name}
                  </p>

                  <span className="checkout-summary-item-quantity">
                    Quantity: {quantity}
                  </span>

                </div>

                <p className="checkout-summary-item-price">
                  R{subtotal.toFixed(2)}
                </p>

              </div>

            </div>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <span>
                R{subtotal.toFixed(2)}
              </span>

            </div>

            <div className="checkout-summary-row">

              <span>
                Campus Collection
              </span>

              <span>
                Free
              </span>

            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong className="checkout-total-price">
                R{total.toFixed(2)}
              </strong>

            </div>

            {/* Place Order */}
            <form onSubmit={handlePlaceOrder}>

              <button
                type="submit"
                className="place-order-button"
              >
                Place Order
              </button>

            </form>

            <button
              type="button"
              className="back-to-cart-button"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>

            <div className="checkout-security">

              <div className="checkout-security-item">
                ✓ Secure checkout
              </div>

              <div className="checkout-security-item">
                ✓ CPUT Community Store
              </div>

              <div className="checkout-security-item">
                ✓ Campus collection available
              </div>

            </div>

          </aside>

        </div>

      </main>

      <Footer />
    </div>
  );
}