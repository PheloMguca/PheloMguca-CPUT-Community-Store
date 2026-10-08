import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // "signin" | "create"

  const initialFormState = {
    fullName: "",
    email: "",
    password: "",
    role: "student",
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Clear messages and reset form state when mode changes
  const switchTab = (newMode) => {
    setMode(newMode);
    setForm(initialFormState);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Reset form inputs when entering or returning to the Auth page
  useEffect(() => {
    setForm(initialFormState);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (mode === "signin") {
        // ========== SIGN IN ==========
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });

        if (authError) throw authError;

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role_id, full_name")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // Fetch role name
        let roleName = "student";
        if (profile?.role_id) {
          const { data: roleData, error: roleError } = await supabase
            .from("roles")
            .select("role_name")
            .eq("role_id", profile.role_id)
            .maybeSingle();

          if (!roleError && roleData) {
            roleName = roleData.role_name.toLowerCase();
          }
        }

        // Clear credentials & navigate based on role
        setForm(initialFormState);

        if (roleName === "vendor") {
          navigate("/vendor");
        } else if (roleName === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // ========== CREATE ACCOUNT ==========
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
              role_name: form.role,
            },
          },
        });

        if (error) throw error;

        // Reset form & prompt user to sign in
        setForm(initialFormState);
        setMode("signin");
        setSuccessMessage("Account created successfully! You can now sign in.");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "signin" ? "auth-tab active" : "auth-tab"}
              onClick={() => switchTab("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "create" ? "auth-tab active" : "auth-tab"}
              onClick={() => switchTab("create")}
            >
              Create Account
            </button>
          </div>

          {errorMessage && <div className="auth-error">{errorMessage}</div>}
          {successMessage && <div className="auth-success">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            {/* Hidden inputs to capture browser autofill hijacking */}
            <input
              type="text"
              name="prevent_autofill_username"
              id="prevent_autofill_username"
              tabIndex="-1"
              style={{ display: "none" }}
              readOnly
            />
            <input
              type="password"
              name="prevent_autofill_password"
              id="prevent_autofill_password"
              tabIndex="-1"
              style={{ display: "none" }}
              readOnly
            />

            {mode === "create" && (
              <>
                <div className="role-selection">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={form.role === "student"}
                      onChange={handleChange}
                    />
                    Student
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="role"
                      value="vendor"
                      checked={form.role === "vendor"}
                      onChange={handleChange}
                    />
                    Vendor
                  </label>
                </div>

                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </>
            )}

            <h1 className="auth-heading">
              {mode === "signin" ? "Welcome Back" : "Hello, Join The Community."}
            </h1>

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Enter your password"
              required
            />

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? "Processing..."
                : mode === "signin"
                ? "Sign In"
                : "Create account"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}