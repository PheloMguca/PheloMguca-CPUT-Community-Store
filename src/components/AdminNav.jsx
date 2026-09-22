import { NavLink } from "react-router-dom";
import "./AdminNav.css";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/flagged", label: "Flagged Listings" },
];

export default function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => (isActive ? "admin-nav-link active" : "admin-nav-link")}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
