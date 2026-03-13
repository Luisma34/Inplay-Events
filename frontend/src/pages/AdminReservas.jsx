import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { reservasService } from "../services/reservasService";

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

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [date, setDate] = useState(todayISO());
  const [court, setCourt] = useState(COURTS[0]);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  // refrescar datos desde localStorage/service
  useEffect(() => {
    const refresh = () => {
      setReservas(reservasService.getAll());
      setBlocks(reservasService.getBlocks());
    };

    refresh();

    const onInternal = () => refresh();
    const onStorage = () => refresh();

    window.addEventListener("inplay:reservas-updated", onInternal);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("inplay:reservas-updated", onInternal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Grid de estado por hora (libre / reservada / bloqueada)
  const hoursStatus = useMemo(() => {
    return HOURS.map((h) => {
      const reserved = reservasService.isReserved({ date, time: h, court });
      const blocked = reservasService.isBlocked({ date, time: h, court });
      return { hour: h, reserved, blocked };
    });
  }, [date, court, reservas, blocks]);

  // Listado de reservas reales del día/pista
  const reservasDelDia = useMemo(() => {
    return reservas
      .filter((r) => r.date === date && r.court === court && r.status !== "Cancelada")
      .sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [reservas, date, court]);

  // Listado de bloqueos del día/pista (para poder desbloquear por lista)
  const blocksDelDia = useMemo(() => {
    return blocks
      .filter((b) => b.date === date && b.court === court)
      .sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [blocks, date, court]);

  const handleToggleBlock = (hour) => {
    setMsg("");

    // Si está bloqueada -> desbloquear
    const existing = blocksDelDia.find((b) => b.time === hour);
    if (existing) {
      const ok = reservasService.unblock(existing.id);
      setMsg(ok ? "✅ Hora desbloqueada." : "No se pudo desbloquear.");
      return;
    }

    // Si está reservada -> no permitir bloquear
    if (reservasService.isReserved({ date, time: hour, court })) {
      setMsg("No puedes bloquear: ya hay una reserva en esa hora.");
      return;
    }

    const ok = reservasService.block({ date, time: hour, court, reason });
    setMsg(ok ? "✅ Hora bloqueada." : "No se pudo bloquear (¿ya existe?).");
    if (ok) setReason("");
  };

  const handleCancelReserva = (id) => {
    const ok = reservasService.cancel(id);
    setMsg(ok ? "✅ Reserva cancelada." : "No se pudo cancelar la reserva.");
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Admin · Reservas</h1>
          <p className="text-secondary mb-0">
            Bloquea horarios y cancela reservas. (V1 en localStorage)
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
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Col>

                <Col sm={6}>
                  <Form.Label className="mb-1">Pista</Form.Label>
                  <Form.Select
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                  >
                    {COURTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col xs={12} className="mt-3">
                  <Form.Label className="mb-1">Motivo del bloqueo (opcional)</Form.Label>
                  <Form.Control
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej: mantenimiento, evento..."
                  />
                </Col>
              </Row>
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

      {/* GRID BLOQUEOS */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="fw-bold mb-2">Bloqueo de horas</div>
          <div className="text-secondary mb-3" style={{ fontSize: ".92rem" }}>
            🟢 Libre · ⚪ Reservada · ⚫ Bloqueada (clic para bloquear/desbloquear)
          </div>

          <Row className="g-2">
            {hoursStatus.map((h) => {
              const variant = h.blocked ? "dark" : h.reserved ? "secondary" : "success";
              const disabled = h.reserved; // si hay reserva, no permitimos bloquear

              return (
                <Col key={h.hour} xs={6} sm={4} md={3} lg={2}>
                  <Button
                    className="w-100"
                    variant={variant}
                    disabled={disabled}
                    onClick={() => handleToggleBlock(h.hour)}
                    style={{ fontWeight: 700 }}
                    title={h.reserved ? "Ya hay una reserva. Cancélala si quieres bloquear." : ""}
                  >
                    {h.blocked ? `${h.hour} 🔒` : h.hour}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* LISTADOS */}
      <Row className="g-4">
        <Col lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="fw-bold mb-2">Reservas del día</div>

              {reservasDelDia.length === 0 ? (
                <div className="text-secondary">No hay reservas confirmadas.</div>
              ) : (
                <ListGroup variant="flush">
                  {reservasDelDia.map((r) => (
                    <ListGroup.Item key={r.id} className="px-0">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">
                            {r.time} · {r.court}
                          </div>
                          <div className="text-secondary" style={{ fontSize: ".92rem" }}>
                            {r.userName} ({r.userEmail})
                          </div>
                        </div>

                        <div className="d-flex flex-column align-items-end gap-2">
                          <Badge bg="success">Confirmada</Badge>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelReserva(r.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="fw-bold mb-2">Bloqueos del día</div>

              {blocksDelDia.length === 0 ? (
                <div className="text-secondary">No hay bloqueos.</div>
              ) : (
                <ListGroup variant="flush">
                  {blocksDelDia.map((b) => (
                    <ListGroup.Item key={b.id} className="px-0">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">
                            {b.time} · {b.court}
                          </div>
                          <div className="text-secondary" style={{ fontSize: ".92rem" }}>
                            {b.reason ? `Motivo: ${b.reason}` : "Sin motivo"}
                          </div>
                        </div>

                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => reservasService.unblock(b.id)}
                        >
                          Desbloquear
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}