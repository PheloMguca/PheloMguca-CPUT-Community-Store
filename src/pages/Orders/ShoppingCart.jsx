import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./ShoppingCart.css";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

      if (!cart) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          "cart_item_id, quantity, unit_price, products(product_id, product_name, quantity, categories(category_name))"
        )
        .eq("cart_id", cart.cart_id)
        .order("cart_item_id");

      if (error) {
        console.error("Error loading cart:", error.message);
      } else {
        setCartItems(
          (data ?? []).map((row) => ({
            id: row.cart_item_id,
            product_id: row.products?.product_id,
            name: row.products?.product_name ?? "Unavailable item",
            category: row.products?.categories?.category_name,
            price: row.unit_price,
            quantity: row.quantity,
            stock: row.products?.quantity ?? row.quantity,
            image: null,
          }))
        );
      }
      setLoading(false);
    }

    if (!authLoading) loadCart();
  }, [user, authLoading]);

  const updateQuantity = async (item, newQty) => {
    if (newQty < 1 || newQty > item.stock) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("cart_item_id", item.id);

    if (error) {
      console.error("Update failed:", error.message);
      return;
    }
    setCartItems((items) =>
      items.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
    );
  };

  const removeItem = async (id) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_item_id", id);

    if (error) {
      console.error("Remove failed:", error.message);
      return;
    }
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems, subtotal } });
  };

  if (authLoading || loading) {
    return (
      <div className="page">
        <Header />
        <main className="shopping-cart-main">
          <p>Loading your cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <Header />
        <main className="shopping-cart-main">
          <div className="empty-cart">
            <h1>Please sign in</h1>
            <p>Sign in to view your cart.</p>
            <button className="empty-cart-button" onClick={() => navigate("/signin")}>
              Sign In
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

      <main className="shopping-cart-main">
        <div className="shopping-cart-header">
          <div>
            <h1>Shopping Cart</h1>
            <p className="shopping-cart-subtitle">Review your items before checkout.</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h1>Your cart is empty</h1>
            <p>You haven't added any items to your cart yet.</p>
            <button className="empty-cart-button" onClick={() => navigate("/browse")}>
              Browse Store
            </button>
          </div>
        ) : (
          <div className="shopping-cart-container">
            <section className="cart-items-section">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image-container">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <p className="cart-item-category">{item.category}</p>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">R{Number(item.price).toFixed(2)}</p>

                    <div className="cart-quantity">
                      <button
                        className="cart-quantity-button"
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                      >
                        −
                      </button>
                      <div className="cart-quantity-value">{item.quantity}</div>
                      <button
                        className="cart-quantity-button"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <p className="cart-item-total-price">
                      R{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button className="remove-cart-item" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Items ({totalItems})</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Campus Collection</span>
                <span>Free</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <strong className="summary-total-price">R{subtotal.toFixed(2)}</strong>
              </div>

              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <button
                className="continue-shopping-button"
                onClick={() => navigate("/browse")}
              >
                Continue Shopping
              </button>

              <div className="cart-checkout-info">
                <div className="cart-checkout-info-item">✓ Secure checkout</div>
                <div className="cart-checkout-info-item">✓ CPUT campus collection available</div>
                <div className="cart-checkout-info-item">✓ Community Store verified vendors</div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}