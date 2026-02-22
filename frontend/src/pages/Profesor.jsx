import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Modal,
  Alert,
} from "react-bootstrap";

const STORAGE_KEY = "inplay_class_sessions_v1";

// Datos demo iniciales
const seedSessions = [
  { id: 1, day: "Lunes", time: "17:00", level: "Iniciación", coach: "Sergio", spots: 4 },
  { id: 2, day: "Lunes", time: "18:00", level: "Intermedio", coach: "Laura", spots: 2 },
  { id: 3, day: "Martes", time: "19:00", level: "Avanzado", coach: "Sergio", spots: 3 },
  { id: 4, day: "Miércoles", time: "17:00", level: "Menores", coach: "Marta", spots: 6 },
  { id: 5, day: "Jueves", time: "18:00", level: "Intermedio", coach: "Laura", spots: 0 },
  { id: 6, day: "Viernes", time: "20:00", level: "Avanzado", coach: "Sergio", spots: 1 },
];

function levelBadgeVariant(level) {
  if (level === "Iniciación") return "secondary";
  if (level === "Intermedio") return "primary";
  if (level === "Avanzado") return "dark";
  if (level === "Menores") return "success";
  return "info";
}

function nextId(items) {
  return items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

export default function Profesor() {
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState("");

  // filtros
  const [dayFilter, setDayFilter] = useState("Todos");
  const [levelFilter, setLevelFilter] = useState("Todos");

  // modal crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // session o null
  const [form, setForm] = useState({
    day: "Lunes",
    time: "17:00",
    level: "Iniciación",
    coach: "Profesor",
    spots: 4,
  });

  // Cargar sesiones desde localStorage (o seed si no existe)
  const loadSessions = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSessions(JSON.parse(raw));
      } catch {
        // Si estuviera corrupto
        setSessions(seedSessions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedSessions));
      }
    } else {
      setSessions(seedSessions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedSessions));
    }
  };

  useEffect(() => {
    loadSessions();

    // Si cambian datos desde otra pestaña o desde un evento interno
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) loadSessions();
    };
    const onInternal = () => loadSessions();

    window.addEventListener("storage", onStorage);
    window.addEventListener("inplay:sessions-updated", onInternal);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("inplay:sessions-updated", onInternal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const okDay = dayFilter === "Todos" || s.day === dayFilter;
      const okLevel = levelFilter === "Todos" || s.level === levelFilter;
      return okDay && okLevel;
    });
  }, [sessions, dayFilter, levelFilter]);

  const openCreate = () => {
    setMsg("");
    setEditing(null);
    setForm({
      day: "Lunes",
      time: "17:00",
      level: "Iniciación",
      coach: "Profesor",
      spots: 4,
    });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setMsg("");
    setEditing(s);
    setForm({
      day: s.day,
      time: s.time,
      level: s.level,
      coach: s.coach,
      spots: s.spots,
    });
    setShowModal(true);
  };

  // Guardar en estado + localStorage + notificar cambios (misma pestaña)
  const saveAll = (newSessions) => {
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    window.dispatchEvent(new Event("inplay:sessions-updated"));
  };

  const handleSave = () => {
    setMsg("");

    // validación mínima
    if (!form.coach.trim()) {
      setMsg("El nombre del profesor es obligatorio.");
      return;
    }
    if (!form.time || !form.time.match(/^\d{2}:\d{2}$/)) {
      setMsg("Hora inválida. Usa formato HH:MM.");
      return;
    }

    const spotsNum = Number(form.spots);
    if (Number.isNaN(spotsNum) || spotsNum < 0 || spotsNum > 16) {
      setMsg("Plazas debe ser un número entre 0 y 16.");
      return;
    }

    if (editing) {
      const updated = sessions.map((s) =>
        s.id === editing.id ? { ...s, ...form, spots: spotsNum } : s
      );
      saveAll(updated);
    } else {
      const created = { id: nextId(sessions), ...form, spots: spotsNum };
      saveAll([created, ...sessions]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const ok = window.confirm("¿Eliminar esta clase?");
    if (!ok) return;

    const updated = sessions.filter((s) => s.id !== id);
    saveAll(updated);
  };

  const resetDemo = () => {
    const ok = window.confirm("Esto restaurará los datos demo. ¿Continuar?");
    if (!ok) return;
    saveAll(seedSessions);
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Panel Profesor</h1>
          <p className="text-secondary mb-0">
            Gestiona horarios y sesiones. (V1: guardado en localStorage)
          </p>
        </Col>

        <Col md={5} className="d-flex gap-2 justify-content-md-end">
          <Button variant="outline-secondary" onClick={resetDemo}>
            Restaurar demo
          </Button>
          <Button onClick={openCreate}>+ Nueva clase</Button>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col sm={6} md={3}>
              <Form.Label className="mb-1">Filtrar por día</Form.Label>
              <Form.Select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Lunes</option>
                <option>Martes</option>
                <option>Miércoles</option>
                <option>Jueves</option>
                <option>Viernes</option>
              </Form.Select>
            </Col>

            <Col sm={6} md={3}>
              <Form.Label className="mb-1">Filtrar por nivel</Form.Label>
              <Form.Select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Iniciación</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
                <option>Menores</option>
              </Form.Select>
            </Col>

            <Col md={6} className="text-secondary">
              Total: <b>{filtered.length}</b> sesiones (de {sessions.length})
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {msg && (
        <Alert variant="warning" onClose={() => setMsg("")} dismissible>
          {msg}
        </Alert>
      )}

      <Row className="g-3">
        {filtered.length === 0 ? (
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center text-secondary py-5">
                No hay sesiones con esos filtros.
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filtered.map((s) => (
            <Col key={s.id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{s.day}</div>
                      <div className="text-secondary">{s.time}</div>
                    </div>
                    <Badge bg={levelBadgeVariant(s.level)}>{s.level}</Badge>
                  </div>

                  <div className="mt-3">
                    <div className="text-secondary">Profesor</div>
                    <div className="fw-semibold">{s.coach}</div>
                  </div>

                  <div className="mt-3">
                    <div className="text-secondary">Plazas</div>
                    <div className="fw-semibold">{s.spots > 0 ? s.spots : "Completa"}</div>
                  </div>

                  <div className="mt-auto pt-3 d-grid gap-2">
                    <Button variant="outline-primary" onClick={() => openEdit(s)}>
                      Editar
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleDelete(s.id)}>
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Modal crear/editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Editar clase" : "Nueva clase"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            <Col sm={6}>
              <Form.Label className="mb-1">Día</Form.Label>
              <Form.Select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                <option>Lunes</option>
                <option>Martes</option>
                <option>Miércoles</option>
                <option>Jueves</option>
                <option>Viernes</option>
              </Form.Select>
            </Col>

            <Col sm={6}>
              <Form.Label className="mb-1">Hora</Form.Label>
              <Form.Control
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </Col>

            <Col sm={6}>
              <Form.Label className="mb-1">Nivel</Form.Label>
              <Form.Select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option>Iniciación</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
                <option>Menores</option>
              </Form.Select>
            </Col>

            <Col sm={6}>
              <Form.Label className="mb-1">Plazas</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={16}
                value={form.spots}
                onChange={(e) => setForm({ ...form, spots: e.target.value })}
              />
            </Col>

            <Col xs={12}>
              <Form.Label className="mb-1">Profesor</Form.Label>
              <Form.Control
                value={form.coach}
                onChange={(e) => setForm({ ...form, coach: e.target.value })}
                placeholder="Nombre del profesor"
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editing ? "Guardar cambios" : "Crear clase"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

