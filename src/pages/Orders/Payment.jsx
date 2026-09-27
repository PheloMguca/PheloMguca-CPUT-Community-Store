import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const total = location.state?.total || 0;

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();

    navigate("/payment-confirmation", {
      state: {
        total,
        paymentMethod: "Online Payment",
      },
    });
  };

  return (
    <div className="page">
      <Header />

      <main className="payment-main">

        <div className="payment-header">
          <h1>Payment</h1>

          <p className="payment-subtitle">
            Enter your card details to complete your payment.
          </p>
        </div>

        <div className="payment-container">

          <form className="payment-card" onSubmit={handlePayment}>

            <h2>Card Details</h2>

            <div className="payment-form-group">
              <label>Cardholder Name</label>

              <input
                type="text"
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                placeholder="Enter cardholder name"
                required
              />
            </div>

            <div className="payment-form-group">
              <label>Card Number</label>

              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="payment-form-row">

              <div className="payment-form-group">
                <label>Expiry Date</label>

                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="payment-form-group">
                <label>CVV</label>

                <input
                  type="password"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>

            </div>

            <div className="payment-summary">

              <div className="payment-summary-row">
                <span>Payment Method</span>
                <span>Online Payment</span>
              </div>

              <div className="payment-summary-total">
                <span>Total</span>
                <span>R{Number(total).toFixed(2)}</span>
              </div>

            </div>

            <button
              type="submit"
              className="payment-button"
            >
              Pay R{Number(total).toFixed(2)}
            </button>

            <button
              type="button"
              className="payment-back-button"
              onClick={() => navigate("/checkout")}
            >
              Back to Checkout
            </button>

          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}