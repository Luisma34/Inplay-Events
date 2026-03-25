import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

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
import LigaDetalle from "./pages/LigaDetalle";

import MiCuenta from "./pages/MiCuenta";
import Admin from "./pages/Admin";
import Profesor from "./pages/Profesor";
import AdminNoticias from "./pages/AdminNoticias";
import AdminUsuarios from "./pages/AdminUsuarios";

import AvisoLegal from "./pages/AvisoLegal";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookies";

import RequireAuth from "./auth/RequireAuth";
import { getUser, setUser, clearUser } from "./auth/auth";

export default function App() {
  const [user, setUserState] = useState(getUser());

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
        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/acceso" element={<Acceso user={user} />} />

        {/* RESERVAS requiere login */}
        <Route
          path="/reservas"
          element={
            <RequireAuth user={user}>
              <Reservas />
            </RequireAuth>
          }
        />

        {/* BUSCAR PARTIDOS requiere login */}
        <Route
          path="/buscar-partidos"
          element={
            <RequireAuth user={user}>
              <BuscarPartidos />
            </RequireAuth>
          }
        />

        {/* CLASES requiere login */}
        <Route
          path="/clases"
          element={
            <RequireAuth user={user}>
              <Clases />
            </RequireAuth>
          }
        />

        {/* LIGAS requiere login */}
        <Route
          path="/ligas"
          element={
            <RequireAuth user={user}>
              <Ligas />
            </RequireAuth>
          }
        />

        {/* LIGASDETALLE requiere login */}
        <Route
          path="/ligas/:id"
          element={
            <RequireAuth user={user}>
              <LigaDetalle />
            </RequireAuth>
          }
        />

        {/* CUENTA DEL USUARIO */}
        <Route
          path="/mi-cuenta"
          element={
            <RequireAuth user={user}>
              <MiCuenta />
            </RequireAuth>
          }
        />

        {/* PROFESOR */}
        <Route
          path="/profesor"
          element={
            <RequireAuth user={user} allowedRoles={["PROFESOR"]}>
              <Profesor />
            </RequireAuth>
          }
        />

        {/* ADMIN PRINCIPAL */}
        <Route
          path="/admin"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <Admin />
            </RequireAuth>
          }
        />

        {/* ADMIN NOTICIAS */}
        <Route
          path="/admin/noticias"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <AdminNoticias />
            </RequireAuth>
          }
        />

        {/* ADMIN USUARIOS */}
        <Route
          path="/admin/usuarios"
          element={
            <RequireAuth user={user} allowedRoles={["ADMIN"]}>
              <AdminUsuarios />
            </RequireAuth>
          }
        />

        {/* PAGINAS LEGALES */}
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
      </Routes>

      <CookieConsent
        location="bottom"
        buttonText="Aceptar"
        declineButtonText="Rechazar"
        enableDeclineButton
        cookieName="inplay_cookies"
        style={{ background: "#1f2937" }}
        buttonStyle={{ background: "#f3f4f6", color: "#111827",
          borderRadius: "5px",
          padding: "10px 20px",
          marginLeft: "10px"
         }}
        declineButtonStyle={{ background: "#f3f4f6", color: "#111827",
          borderRadius: "5px",
          padding: "10px 20px",
          marginLeft: "10px"
         }}
      >
        Utilizamos cookies para mejorar la experiencia.{" "}
        <Link to="/politica-cookies">Más información</Link>
        <Link to="/aviso-legal" style={{ marginLeft: "10px" }}>
          Aviso Legal
        </Link>
        <Link to="/politica-privacidad" style={{ marginLeft: "10px" }}>
          Política de Privacidad
        </Link>
      </CookieConsent>

      <AppFooter />
    </BrowserRouter>
  );
}
