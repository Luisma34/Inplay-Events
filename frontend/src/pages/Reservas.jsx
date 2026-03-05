import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { getUser } from "../auth/auth";

// Horas fijas del club (MVP)
const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Reservas() {
  const user = getUser();

  const [availableSlots, setAvailableSlots] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [court, setCourt] = useState("");
  const [courts, setCourts] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [msg, setMsg] = useState("");

  // 🔹 Cargar pistas desde backend
  useEffect(() => {
    fetch("http://localhost:8080/api/pistas", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar pistas");
        return res.json();
      })
      .then((data) => {
        setCourts(data);
        if (data.length > 0) {
          setCourt(data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Cargar disponibilidad real desde backend
  useEffect(() => {
    if (!court || !date) return;

    fetch(
      `http://localhost:8080/api/reservas/disponibilidad?pistaId=${court}&fecha=${date}`,
      { credentials: "include" },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando disponibilidad");
        return res.json();
      })
      .then((data) => {
        const limpio = data.map((h) =>
          typeof h === "string" ? h.slice(0, 5) : h,
        );

        console.log("Slots disponibles:", limpio);

        setAvailableSlots(limpio);
      })
      .catch(() => setAvailableSlots([]));
  }, [court, date]);

  // 🔹 Confirmar reserva real
  const handleConfirm = () => {
    setMsg("");

    if (!user) {
      setMsg("Debes iniciar sesión para reservar.");
      return;
    }

    if (!selectedHour) {
      setMsg("Selecciona una hora.");
      return;
    }

    fetch("http://localhost:8080/api/reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        fecha: date,
        hora: selectedHour,
        estado: "ACTIVA",
        pista: { id: court },
        usuario: { id: user.id },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Hora ocupada");
        return res.json();
      })
      .then(() => {
        setSelectedHour("");
        setMsg("✅ Reserva confirmada.");

        // Recargar disponibilidad
        return fetch(
          `http://localhost:8080/api/reservas/disponibilidad?pistaId=${court}&fecha=${date}`,
          { credentials: "include" },
        );
      })
      .then((res) => res.json())
      .then((data) => {
        const limpio = data.map((h) => h.substring(0, 5));
        setAvailableSlots(limpio);
      })
      .catch(() => {
        setMsg("Esa hora ya no está disponible.");
      });
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Reservar pista</h1>
          <p className="text-secondary mb-0">
            Selecciona fecha, pista y hora.
            <br />
            🟢 Verde = libre · ⚪ Gris = no disponible
          </p>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="g-2">
                <Col sm={6}>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedHour("");
                    }}
                  />
                </Col>

                <Col sm={6}>
                  <Form.Label>Pista</Form.Label>
                  <Form.Select
                    value={court}
                    onChange={(e) => {
                      setCourt(e.target.value);
                      setSelectedHour("");
                    }}
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>

              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div className="text-secondary">
                  {user ? (
                    <>
                      Sesión: <b>{user.email}</b>
                    </>
                  ) : (
                    <>Inicia sesión para confirmar</>
                  )}
                </div>

                {selectedHour ? (
                  <Badge bg="primary">Hora: {selectedHour}</Badge>
                ) : (
                  <Badge bg="secondary">Elige una hora</Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {msg && (
        <Alert
          variant={msg.startsWith("✅") ? "success" : "warning"}
          dismissible
          onClose={() => setMsg("")}
        >
          {msg}
        </Alert>
      )}

      {/* 🔹 Botones dinámicos reales */}
      <Row className="g-3">
        {HOURS.map((hour) => {
          const notAvailable = !availableSlots.includes(hour);

          return (
            <Col key={hour} xs={6} sm={4} md={3} lg={2}>
              <Button
                className="w-100"
                variant={
                  notAvailable
                    ? "secondary"
                    : selectedHour === hour
                      ? "primary"
                      : "success"
                }
                disabled={notAvailable}
                onClick={() => setSelectedHour(hour)}
                style={{ fontWeight: 700 }}
              >
                {hour}
              </Button>
            </Col>
          );
        })}
      </Row>

      <div className="d-flex justify-content-end mt-4">
        <Button size="lg" variant="primary" onClick={handleConfirm}>
          Confirmar reserva
        </Button>
      </div>

      <Card className="shadow-sm border-0 mt-4">
        <Card.Body className="text-secondary">
          Puedes gestionar tus reservas desde <b>Mi cuenta</b>.
        </Card.Body>
      </Card>
    </Container>
  );
}
