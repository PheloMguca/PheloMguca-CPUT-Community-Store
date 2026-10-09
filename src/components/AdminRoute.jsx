import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading: authLoading } = useAuth();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setAllowed(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (error) {
        console.error("Admin check failed:", error.message);
        setAllowed(false);
        return;
      }

      setAllowed(data === true);
    }

    if (!authLoading) checkAdmin();
  }, [user, authLoading]);

  if (authLoading || allowed === null) {
    return <p>Checking access...</p>;
  }

  if (!allowed) {
    return <Navigate to={user ? "/" : "/auth"} replace />;
  }

  return <Outlet />;
}