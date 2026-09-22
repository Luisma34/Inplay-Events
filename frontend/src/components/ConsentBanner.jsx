import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("inplay_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("inplay_consent", "true");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("inplay_consent", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#1f2937",
        color: "#f9fafb",
        padding: "16px 24px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "12px",
        zIndex: 9999,
      }}
    >
      <span style={{ flex: 1, minWidth: "200px" }}>
        Utilizamos cookies para mejorar la experiencia.{" "}
        <Link to="/politica-cookies" style={{ color: "#93c5fd" }}>
          Más información
        </Link>
        <Link to="/aviso-legal" style={{ color: "#93c5fd", marginLeft: "10px" }}>
          Aviso Legal
        </Link>
        <Link to="/politica-privacidad" style={{ color: "#93c5fd", marginLeft: "10px" }}>
          Política de Privacidad
        </Link>
      </span>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={accept}
          style={{
            background: "#f3f4f6",
            color: "#111827",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Aceptar
        </button>
        <button
          onClick={decline}
          style={{
            background: "#f3f4f6",
            color: "#111827",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
