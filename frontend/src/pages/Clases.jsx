
// V1 usa localStorage.
// En V2 se conectará a backend.

import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { getUser } from "../auth/auth";
import { clasesService } from "../services/clasesService";

// Horas disponibles fijas en esta versión
// En V2 vendrán del backend.
const HOURS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00",
];

// Devuelve la fecha de hoy en formato ISO (yyyy-mm-dd)
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Clases() {
  const user = getUser();

  const [reservas, setReservas] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [selectedHour, setSelectedHour] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  // Cargar reservas y escuchar cambios
  useEffect(() => {
    const refresh = () => setReservas(clasesService.getAll());
    refresh();

    const onInternal = () => refresh();
    const onStorage = (e) => {
      if (e.key === "inplay_clases_v1") refresh();
    };

    window.addEventListener("inplay:clases-updated", onInternal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("inplay:clases-updated", onInternal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Calcula si cada hora está libre u ocupada
  const hoursStatus = useMemo(() => {
    const active = reservas.filter((r) => r.status !== "Cancelada");

    return HOURS.map((h) => {
      const taken = active.some((r) => r.date === date && r.time === h);
      return { hour: h, taken };
    });
  }, [reservas, date]);

  // Confirmación de reserva
  const handleConfirm = () => {
    setMsg("");

    if (!user) {
      setMsg("Tienes que iniciar sesión para reservar una clase.");
      return;
    }

    if (!selectedHour) {
      setMsg("Selecciona una hora.");
      return;
    }

    if (clasesService.isTaken({ date, time: selectedHour })) {
      setMsg("Esa hora ya está ocupada.");
      return;
    }

    clasesService.create({
      userEmail: user.email,
      userName: user.name,
      date,
      time: selectedHour,
      note,
    });

    setSelectedHour("");
    setNote("");
    setMsg("Reserva confirmada.");
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Clases</h1>
          <p className="text-secondary mb-0">
            Reserva una clase individual.
          </p>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Form.Label className="mt-3">Nota (opcional)</Form.Label>
              <Form.Control
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="mt-3">
                {selectedHour ? (
                  <Badge bg="primary">Hora seleccionada: {selectedHour}</Badge>
                ) : (
                  <Badge bg="secondary">Selecciona una hora</Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {msg && <Alert variant="warning">{msg}</Alert>}

      <Row className="g-3">
        {hoursStatus.map((h) => (
          <Col key={h.hour} xs={6} md={3}>
            <Button
              className="w-100"
              variant={h.taken ? "secondary" : "success"}
              disabled={h.taken}
              onClick={() => setSelectedHour(h.hour)}
            >
              {h.hour}
            </Button>
          </Col>
        ))}
      </Row>

      <div className="text-end mt-4">
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar clase
        </Button>
      </div>
    </Container>
  );
}