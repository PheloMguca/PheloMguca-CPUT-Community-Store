import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PaymentConfirmation.css";

export default function PaymentConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Header />

      <main className="payment-confirmation-main">

        <div className="payment-confirmation-card">

          <div className="payment-confirmation-icon">
            ✓
          </div>

          <h1>Payment Confirmed</h1>

          <p>
            Your payment has been successfully processed.
            Thank you for shopping at the CPUT Community Store.
          </p>

          <div className="payment-confirmation-details">

            <div className="payment-confirmation-row">
              <span>Payment Status</span>
              <strong>Successful</strong>
            </div>

            <div className="payment-confirmation-row">
              <span>Payment Method</span>
              <span>Online Payment</span>
            </div>

            <div className="payment-confirmation-row">
              <span>Collection</span>
              <span>Campus Collection</span>
            </div>

            <div className="payment-confirmation-row payment-confirmation-total">
              <span>Order Status</span>
              <span>Confirmed</span>
            </div>

          </div>

          <button
            className="payment-confirmation-button"
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