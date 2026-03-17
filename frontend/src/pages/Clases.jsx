import { useEffect, useMemo, useState } from "react";
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
import { clasesService } from "../services/clasesService";

// Devuelve la fecha de hoy en formato yyyy-mm-dd
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Calculamos hora fin sumando 1 hora a la hora de inicio
function addOneHour(time) {
  const [h, m] = time.split(":").map(Number);
  const next = String(h + 1).padStart(2, "0");
  return `${next}:${String(m).padStart(2, "0")}`;
}

export default function Clases() {
  const user = getUser();

  // Catálogo de clases
  const [clases, setClases] = useState([]);

  // Pistas disponibles
  const [pistas, setPistas] = useState([]);

  // Horas libres según pista y fecha
  const [slots, setSlots] = useState([]);

  // Formulario
  const [selectedClaseId, setSelectedClaseId] = useState("");
  const [selectedPistaId, setSelectedPistaId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [selectedHour, setSelectedHour] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargamos clases y pistas al entrar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clasesData, pistasData] = await Promise.all([
          clasesService.getClases(),
          clasesService.getPistas(),
        ]);

        // Solo mostramos clases activas
        const clasesActivas = clasesData.filter((c) => c.activa);

        // Solo mostramos pistas activas
        const pistasActivas = pistasData.filter((p) => p.activa);

        setClases(clasesActivas);
        setPistas(pistasActivas);

        // Ponemos valores iniciales si hay datos
        if (clasesActivas.length > 0) {
          setSelectedClaseId(clasesActivas[0].id);
        }

        if (pistasActivas.length > 0) {
          setSelectedPistaId(pistasActivas[0].id);
        }
      } catch (err) {
        setMsg(err.message);
      }
    };

    loadData();
  }, []);

  // Cada vez que cambie la pista o la fecha, pedimos disponibilidad
  useEffect(() => {
    const loadDisponibilidad = async () => {
      if (!selectedPistaId || !date) return;

      try {
        const data = await clasesService.getDisponibilidad({
          pistaId: selectedPistaId,
          fecha: date,
        });

        setSlots(data);
      } catch (err) {
        setSlots([]);
        setMsg(err.message);
      }
    };

    loadDisponibilidad();
  }, [selectedPistaId, date]);

  const selectedClase = useMemo(() => {
    return clases.find((c) => String(c.id) === String(selectedClaseId));
  }, [clases, selectedClaseId]);

  const handleConfirm = async () => {
    setMsg("");

    if (!user) {
      setMsg("Tienes que iniciar sesión para reservar una clase.");
      return;
    }

    if (!selectedClaseId) {
      setMsg("Selecciona una clase.");
      return;
    }

    if (!selectedPistaId) {
      setMsg("Selecciona una pista.");
      return;
    }

    if (!selectedHour) {
      setMsg("Selecciona una hora.");
      return;
    }

    try {
      setLoading(true);

      await clasesService.createSesion({
        claseId: Number(selectedClaseId),
        pistaId: Number(selectedPistaId),
        usuarioId: Number(user.id),
        fecha: date,
        horaInicio: selectedHour,
        horaFin: addOneHour(selectedHour),
      });

      setSelectedHour("");
      setMsg("Clase reservada correctamente.");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Clases</h1>
          <p className="text-secondary mb-0">
            Reserva una clase seleccionando tipo, pista, fecha y hora.
          </p>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Clase</Form.Label>
                <Form.Select
                  value={selectedClaseId}
                  onChange={(e) => setSelectedClaseId(e.target.value)}
                >
                  {clases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} · {c.nivel}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pista</Form.Label>
                <Form.Select
                  value={selectedPistaId}
                  onChange={(e) => setSelectedPistaId(e.target.value)}
                >
                  {pistas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>

              <div className="mt-3">
                {selectedHour ? (
                  <Badge bg="primary">Hora seleccionada: {selectedHour}</Badge>
                ) : (
                  <Badge bg="secondary">Selecciona una hora</Badge>
                )}
              </div>

              {selectedClase && (
                <div className="text-secondary mt-3" style={{ fontSize: ".95rem" }}>
                  Clase elegida: <b>{selectedClase.nombre}</b> · Nivel:{" "}
                  <b>{selectedClase.nivel}</b>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {msg && (
        <Alert variant={msg.includes("correctamente") ? "success" : "warning"}>
          {msg}
        </Alert>
      )}

      <Row className="g-3">
        {slots.length === 0 ? (
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-secondary text-center py-4">
                No hay horas disponibles para esa fecha y pista.
              </Card.Body>
            </Card>
          </Col>
        ) : (
          slots.map((h) => (
            <Col key={h} xs={6} md={3}>
              <Button
                className="w-100"
                variant={selectedHour === h ? "primary" : "success"}
                onClick={() => setSelectedHour(h)}
              >
                {h}
              </Button>
            </Col>
          ))
        )}
      </Row>

      <div className="text-end mt-4">
        <Button variant="primary" onClick={handleConfirm} disabled={loading}>
          {loading ? "Reservando..." : "Confirmar clase"}
        </Button>
      </div>
    </Container>
  );
}
