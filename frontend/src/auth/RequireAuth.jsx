import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function RequireAuth({ user, allowedRoles, children }) {
  const location = useLocation();

  // No logueado -> login
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Debes iniciar sesión para acceder a esta página.",
          from: location.pathname,
        }}
      />
    );

  // Logueado pero sin rol permitido -> home
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role) &&
    user.role !== "SUPERADMIN"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
