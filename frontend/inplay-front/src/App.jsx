import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservas from "./pages/Reservas";
import Ligas from "./pages/Ligas";

export default function App() {
  const user = null; // preparado para login

  return (
    <BrowserRouter>
      <AppHeader user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/ligas" element={<Ligas />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <AppFooter />
    </BrowserRouter>
  );
}

