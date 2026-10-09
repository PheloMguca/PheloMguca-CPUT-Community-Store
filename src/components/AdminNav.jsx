import { NavLink, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AdminNav.css";

export default function AdminNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">C</div>

        <div>
          <strong>CPUT</strong>
          <span>COMMUNITY STORE</span>
        </div>
      </div>

      <p className="admin-panel-label">ADMIN PANEL</p>

      <nav className="admin-menu">
        <NavLink to="/admin" end>
          ◉ Dashboard
        </NavLink>

        <NavLink to="/admin/users">👥 Users</NavLink>

        <NavLink to="/admin/listings">▣ Listings</NavLink>

        <NavLink to="/admin/flagged">⚑ Flagged Listings</NavLink>

        <NavLink to="/admin/reviews">★ Reviews</NavLink>

        <NavLink to="/admin/settings">⚙ Settings</NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <Link to="/">↗ View Website</Link>

        <Link to="/auth" onClick={handleLogout}>
          ⇥ Logout
        </Link>
      </div>
    </aside>
  );
}