import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    campus: "District Six",
    payment: "Pay at Collection",
  });

  useEffect(() => {
    async function loadCart() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: cart } = await supabase
        .from("cart")
        .select("cart_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cart) {
        const { data, error } = await supabase
          .from("cart_items")
          .select("cart_item_id, quantity, products(product_name, price, status)")
          .eq("cart_id", cart.cart_id)
          .order("cart_item_id");

        if (error) {
          console.error("Error loading cart:", error.message);
        } else {
          setItems(
            (data ?? [])
              .filter((row) => row.products?.status === "active")
              .map((row) => ({
                id: row.cart_item_id,
                name: row.products.product_name,
                price: Number(row.products.price),
                quantity: row.quantity,
              }))
          );
        }
      }
      setLoading(false);
    }

    if (!authLoading) loadCart();
  }, [user, authLoading]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);

    const paymentMethod = form.payment === "Online Payment" ? "payfast" : "cash";
    const address = [
      `Collection: ${form.campus}`,
      `${form.firstName} ${form.lastName}`,
      form.phone,
      notes && `Notes: ${notes}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const { data: orderId, error } = await supabase.rpc("place_order", {
      p_shipping_address: address,
      p_payment_method: paymentMethod,
    });

    setPlacing(false);

    if (error) {
      console.error("Place order failed:", error.message);
      alert("Could not place order: " + error.message);
      return;
    }

    if (paymentMethod === "payfast") {
      navigate("/payment", { state: { orderId, total } });
    } else {
      setOrderPlaced(true);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page">
        <Header />
        <main className="checkout-main">
          <p>Loading checkout...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <Header />
        <main className="checkout-main">
          <div className="order-confirmation">
            <h1>Please sign in</h1>
            <p>Sign in to check out.</p>
            <button className="return-store-button" onClick={() => navigate("/auth")}>
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="page">
        <Header />
        <main className="checkout-main">
          <div className="order-confirmation">
            <div className="order-confirmation-icon">✓</div>
            <h1>Order Placed Successfully</h1>
            <p>Thank you for your order, {form.firstName}. Your order has been received.</p>
            <p>Collection: {form.campus}</p>
            <button className="return-store-button" onClick={() => navigate("/browse")}>
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <Header />
        <main className="checkout-main">
          <div className="order-confirmation">
            <h1>No Order Found</h1>
            <p>There are no items available for checkout. Please add something to your cart first.</p>
            <button className="return-store-button" onClick={() => navigate("/browse")}>
              Back to Store
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
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p className="checkout-subtitle">Complete your details to place your order.</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-container">
            <section className="checkout-form-section">
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
                      <span className="checkout-option-title">CPUT District Six Campus</span>
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
                      <span className="checkout-option-title">CPUT Bellville Campus</span>
                      <span className="checkout-option-description">
                        Collect your order from the selected campus.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="checkout-card">
                <h2>Payment Method</h2>

                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="Pay at Collection"
                      checked={form.payment === "Pay at Collection"}
                      onChange={handleChange}
                    />
                    <span>Pay at Collection</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="Online Payment"
                      checked={form.payment === "Online Payment"}
                      onChange={handleChange}
                    />
                    <span>Online Payment</span>
                  </label>
                </div>
              </div>

              <div className="checkout-card">
                <h2>Additional Notes</h2>
                <div className="checkout-form-group">
                  <label>Order Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information about your order..."
                  />
                </div>
              </div>
            </section>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="checkout-summary-items">
                {items.map((item) => (
                  <div key={item.id} className="checkout-summary-item">
                    <div>
                      <p className="checkout-summary-item-name">{item.name}</p>
                      <span className="checkout-summary-item-quantity">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                    <p className="checkout-summary-item-price">
                      R{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Campus Collection</span>
                <span>Free</span>
              </div>

              <div className="checkout-summary-divider"></div>

              <div className="checkout-total">
                <span>Total</span>
                <strong className="checkout-total-price">R{total.toFixed(2)}</strong>
              </div>

              <button type="submit" className="place-order-button" disabled={placing}>
                {placing ? "Placing order..." : "Place Order"}
              </button>

              <button
                type="button"
                className="back-to-cart-button"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>

              <div className="checkout-security">
                <div className="checkout-security-item">✓ Secure checkout</div>
                <div className="checkout-security-item">✓ CPUT Community Store</div>
                <div className="checkout-security-item">✓ Campus collection available</div>
              </div>
            </aside>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}