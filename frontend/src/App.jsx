import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservas from "./pages/Reservas";
import Ligas from "./pages/Ligas";
import Clases from "./pages/Clases";
import BuscarPartidos from "./pages/BuscarPartidos";
import Noticias from "./pages/Noticias";
import Register from "./pages/Register";
import Acceso from "./pages/Accseso.jsx";


import MiCuenta from "./pages/MiCuenta";
import Admin from "./pages/Admin";
import Profesor from "./pages/Profesor";
import AdminNoticias from "./pages/AdminNoticias";
import AdminLigas from "./pages/AdminLigas";
import AdminReservas from "./pages/AdminReservas";

import AvisoLegal from "./pages/AvisoLegal";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookies";

import RequireAuth from "./auth/RequireAuth";
import { getUser, setUser, clearUser } from "./auth/auth";



export default function App() {
  const [user, setUserState] = useState(null);

  // cargar sesión desde auth.js
  useEffect(() => {
    setUserState(getUser());
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    setUserState(u);
  };

  const handleLogout = () => {
    clearUser();
    setUserState(null);
  };

  return (
    <BrowserRouter>
      <AppHeader user={user} onLogout={handleLogout} />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route
          path="/reservas"
          element={
            <RequireAuth user={user}>
              <Reservas />
            </RequireAuth>
          }
        />
        <Route path="/ligas" element={<Ligas />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/buscar-partidos" element={<BuscarPartidos />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/acceso" element={<Acceso user={user} />} />

        {/* Privadas */}
        <Route
          path="/mi-cuenta"
          element={
            <RequireAuth user={user}>
              <MiCuenta />
            </RequireAuth>
          }
        />

        <Route
          path="/profesor"
          element={
            <RequireAuth user={user} allowedRoles={["PROFESOR"]}>
              <Profesor />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/noticias"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <AdminNoticias />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/ligas"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <AdminLigas />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/reservas"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <AdminReservas />
            </RequireAuth>
          }
        />

        {/* Legales */}
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
      </Routes>

      <AppFooter />
    </BrowserRouter>
  );
}
