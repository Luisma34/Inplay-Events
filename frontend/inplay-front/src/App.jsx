import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservas from "./pages/Reservas";
import Ligas from "./pages/Ligas";

export default function App() {
  const [user, setUser] = useState(null);

  // Al iniciar la app, comprobamos si hay sesión activa
  useEffect(() => {
    fetch("http://localhost:8080/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);


  return (
    <BrowserRouter>
      <AppHeader user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/ligas" element={<Ligas />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>

      <AppFooter />
    </BrowserRouter>
  );
}
