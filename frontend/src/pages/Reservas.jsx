import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { getUser } from "../auth/auth";

const STORAGE_KEY = "inplay_reservas_v1";

// Horas disponibles (ejemplo)
const HOURS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00",
];

const COURTS = ["Pista 1", "Pista 2", "Pista 3", "Pista 4", "Pista 5", "Pista 6", "Pista 7", "Pista 8"];

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function loadReservas() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveReservas(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("inplay:reservas-updated"));
}

function isTaken(reservas, date, hour, court) {
  return reservas.some(
    (r) =>
      r.date === date &&
      r.time === hour &&
      r.court === court &&
      r.status !== "Cancelada"
  );
}

export default function Reservas() {
  const user = getUser(); // puede ser null si no está logueado (la ruta ahora es pública, pero puedes luego protegerla)

  const [reservas, setReservas] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [court, setCourt] = useState(COURTS[0]);
  const [selectedHour, setSelectedHour] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = () => setReservas(loadReservas());
    load();

    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) load();
    };
    const onInternal = () => load();

    window.addEventListener("storage", onStorage);
    window.addEventListener("inplay:reservas-updated", onInternal);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("inplay:reservas-updated", onInternal);
    };
  }, []);

  const hoursStatus = useMemo(() => {
    return HOURS.map((h) => ({
      hour: h,
      taken: isTaken(reservas, date, h, court),
    }));
  }, [reservas, date, court]);

  const handleConfirm = () => {
    setMsg("");

    if (!user) {
      setMsg("Tienes que iniciar sesión para confirmar una reserva.");
      return;
    }
    if (!selectedHour) {
      setMsg("Selecciona una hora.");
      return;
    }
    if (isTaken(reservas, date, selectedHour, court)) {
      setMsg("Esa hora ya está ocupada en esa pista.");
      return;
    }

    const newReserva = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      userEmail: user.email,
      userName: user.name,
      date,
      time: selectedHour,
      court,
      status: "Confirmada",
      createdAt: new Date().toISOString(),
    };

    const updated = [newReserva, ...reservas];
    setReservas(updated);
    saveReservas(updated);

    setSelectedHour("");
    setMsg("✅ Reserva confirmada.");
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Reservar pista</h1>
          <p className="text-secondary mb-0">
            Selecciona fecha, pista y hora. Verde = libre, Gris = ocupada.
          </p>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="g-2">
                <Col sm={6}>
                  <Form.Label className="mb-1">Fecha</Form.Label>
                  <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Col>

                <Col sm={6}>
                  <Form.Label className="mb-1">Pista</Form.Label>
                  <Form.Select value={court} onChange={(e) => setCourt(e.target.value)}>
                    {COURTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>

              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div className="text-secondary" style={{ fontSize: ".92rem" }}>
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
          onClose={() => setMsg("")}
          dismissible
        >
          {msg}
        </Alert>
      )}

      <Row className="g-3">
        {hoursStatus.map((h) => (
          <Col key={h.hour} xs={6} sm={4} md={3} lg={2}>
            <Button
              className="w-100"
              variant={h.taken ? "secondary" : selectedHour === h.hour ? "primary" : "success"}
              disabled={h.taken}
              onClick={() => setSelectedHour(h.hour)}
              style={{ fontWeight: 700 }}
            >
              {h.hour}
            </Button>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-end mt-4">
        <Button size="lg" variant="primary" onClick={handleConfirm}>
          Confirmar reserva
        </Button>
      </div>

      <Card className="shadow-sm border-0 mt-4">
        <Card.Body className="text-secondary" style={{ fontSize: ".92rem" }}>
         
        </Card.Body>
      </Card>
    </Container>
  );
}
