import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { getUser } from "../auth/auth";
import { reservasService } from "../services/reservasService";

// Horas disponibles (ejemplo)
const HOURS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00",
];

const COURTS = [
  "Pista 1", "Pista 2", "Pista 3", "Pista 4",
  "Pista 5", "Pista 6", "Pista 7", "Pista 8",
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

  const [refreshKey, setRefreshKey] = useState(0); // solo para recalcular useMemo
  const [date, setDate] = useState(todayISO());
  const [court, setCourt] = useState(COURTS[0]);
  const [selectedHour, setSelectedHour] = useState("");
  const [msg, setMsg] = useState("");

  // 🔄 refresco cuando hay cambios (admin bloquea/cancela o usuario reserva)
  useEffect(() => {
    const refresh = () => setRefreshKey((k) => k + 1);

    refresh();
    window.addEventListener("inplay:reservas-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("inplay:reservas-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // 🟢 Estado de cada hora (NO distinguimos bloqueada/reservada para el usuario)
  const hoursStatus = useMemo(() => {
    return HOURS.map((h) => {
      const reserved = reservasService.isReserved({ date, time: h, court });
      const blocked = reservasService.isBlocked({ date, time: h, court });
      const notAvailable = reserved || blocked;

      return { hour: h, notAvailable };
    });
  }, [date, court, refreshKey]);

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

    // creamos la reserva usando el service (tu reservasService puede llamarse createBooking o create)
    // ✅ intentamos primero createBooking (lo normal)
    let res;

    if (typeof reservasService.createBooking === "function") {
      res = reservasService.createBooking({ user, date, time: selectedHour, court });
    } else if (typeof reservasService.create === "function") {
      // fallback por si tu service se llama create
      res = reservasService.create({ user, date, time: selectedHour, court });
    } else {
      setMsg("Error interno: falta createBooking/create en reservasService.");
      return;
    }

    // si tu service devuelve {ok, error}:
    if (res && res.ok === false) {
      setMsg("Esa hora no está disponible.");
      return;
    }

    // si tu service devuelve booleano:
    if (res === false) {
      setMsg("Esa hora no está disponible.");
      return;
    }

    setSelectedHour("");
    setMsg("✅ Reserva confirmada.");
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
                  <Form.Label className="mb-1">Fecha</Form.Label>
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
                  <Form.Label className="mb-1">Pista</Form.Label>
                  <Form.Select
                    value={court}
                    onChange={(e) => {
                      setCourt(e.target.value);
                      setSelectedHour("");
                    }}
                  >
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
              variant={
                h.notAvailable
                  ? "secondary" // 👈 bloqueada o reservada: igual
                  : selectedHour === h.hour
                  ? "primary"
                  : "success"
              }
              disabled={h.notAvailable}
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
          Puedes gestionar tus reservas desde <b>Mi cuenta</b>.
        </Card.Body>
      </Card>
    </Container>
  );
}