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

import MiCuenta from "./pages/MiCuenta";
import Admin from "./pages/Admin";
import Profesor from "./pages/Profesor";

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
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/ligas" element={<Ligas />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/buscar-partidos" element={<BuscarPartidos />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

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

        {/* Legales */}
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
      </Routes>

      <AppFooter />
    </BrowserRouter>
  );
}
