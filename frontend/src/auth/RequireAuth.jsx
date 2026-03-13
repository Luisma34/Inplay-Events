import { Navigate } from "react-router-dom";

export default function RequireAuth({ user, allowedRoles, children }) {
  // No logueado -> login
  if (!user) return <Navigate to="/login" replace 
  state={{message: "Debes iniciar sesión para acceder a esta página."}}/>;

  // Logueado pero sin rol permitido -> home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
