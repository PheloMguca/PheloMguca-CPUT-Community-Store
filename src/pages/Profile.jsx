import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Profile.css";

const emptyForm = {
  fullName: "",
  email: "",
  campus: "",
  studentNumber: "",
  phone: "",
  notifyOrders: true,
  notifyReviews: true,
  notifyBulletins: false,
};

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [roleName, setRoleName] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Send signed-out visitors to the auth page
  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  // Load the signed-in user's profile
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, email, phone, student_number, campus, notify_orders, notify_reviews, notify_bulletins, roles(role_name)"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (!data) {
        setError("No profile found for this account.");
      } else {
        setForm({
          fullName: data.full_name ?? "",
          email: data.email ?? user.email ?? "",
          phone: data.phone ?? "",
          studentNumber: data.student_number ?? "",
          campus: data.campus ?? "",
          notifyOrders: data.notify_orders ?? true,
          notifyReviews: data.notify_reviews ?? true,
          notifyBulletins: data.notify_bulletins ?? false,
        });
        setRoleName(data.roles?.role_name ?? "");
      }
      setFetching(false);
    };

    load();
  }, [user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.fullName,
        phone: form.phone || null,
        student_number: form.studentNumber || null,
        campus: form.campus || null,
        notify_orders: form.notifyOrders,
        notify_reviews: form.notifyReviews,
        notify_bulletins: form.notifyBulletins,
      })
      .eq("user_id", user.id);

    if (error) setError(error.message);
    else setSaved(true);
    setSaving(false);
  };

  if (authLoading || fetching) {
    return (
      <div className="page">
        <Header />
        <main className="member-main profile-main">
          <p>Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const missingFields = [
    !form.studentNumber && "student number",
    !form.phone && "phone number",
    !form.campus && "campus",
  ].filter(Boolean);

  return (
    <div className="page">
      <Header />
      <main className="member-main profile-main">
        <h1>Profile &amp; Settings</h1>
        <p className="browse-subtitle">
          Update your campus account details and notification preferences.
          {roleName && (
            <>
              {" "}
              Account type: <strong>{roleName}</strong>.
            </>
          )}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {missingFields.length > 0 && (
          <div className="auth-error">
            Complete your profile: add your {missingFields.join(", ")}.
          </div>
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <h2>Account</h2>
          <label>
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              readOnly
              disabled
            />
          </label>
          <label>
            Student number
            <input
              name="studentNumber"
              value={form.studentNumber}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Campus
            <select name="campus" value={form.campus} onChange={handleChange}>
              <option value="">Select your campus</option>
              <option>District Six</option>
              <option>Bellville</option>
              <option>Mowbray</option>
              <option>Wellington</option>
            </select>
          </label>

          <h2>Notifications</h2>
          <label className="profile-check">
            <input
              type="checkbox"
              name="notifyOrders"
              checked={form.notifyOrders}
              onChange={handleChange}
            />
            Order and payment updates
          </label>
          <label className="profile-check">
            <input
              type="checkbox"
              name="notifyReviews"
              checked={form.notifyReviews}
              onChange={handleChange}
            />
            New reviews on my listings
          </label>
          <label className="profile-check">
            <input
              type="checkbox"
              name="notifyBulletins"
              checked={form.notifyBulletins}
              onChange={handleChange}
            />
            Community bulletin posts
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-pill btn-dark"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved ? <span className="profile-saved">Settings saved.</span> : null}
          </div>
        </form>

        <p className="profile-admin-hint">
          Admin tools: <Link to="/admin">Dashboard</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}