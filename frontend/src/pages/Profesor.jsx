import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Badge, Modal, Form, Alert, Table } from "react-bootstrap";
import { clasesService } from "../services/clasesService";

export default function Profesor() {
  const [clases, setClases] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    nivel: "Iniciación",
    capacidad: 4,
    activa: true,
  });

  const cargarClases = async () => {
    const data = await clasesService.getAll();
    setClases(data);
  };

  const cargarSesiones = async () => {
    const response = await fetch("http://localhost:8080/api/sesiones/profesor", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar las sesiones");
    }

    const data = await response.json();
    setSesiones(data);
  };

  const cargarTodo = async () => {
    try {
      setLoading(true);
      await cargarClases();
      await cargarSesiones();
      setMsg("");
    } catch (error) {
      setMsg("No se pudieron cargar los datos del panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombre: "",
      nivel: "Iniciación",
      capacidad: 4,
      activa: true,
    });
    setShowModal(true);
    setMsg("");
  };

  const openEdit = (clase) => {
    setEditing(clase);
    setForm({
      nombre: clase.nombre || "",
      nivel: clase.nivel || "Iniciación",
      capacidad: clase.capacidad || 4,
      activa: clase.activa ?? true,
    });
    setShowModal(true);
    setMsg("");
  };

  const handleSave = async () => {
    try {
      setMsg("");

      if (!form.nombre.trim()) {
        setMsg("El nombre es obligatorio.");
        return;
      }

      if (!form.capacidad || Number(form.capacidad) <= 0) {
        setMsg("La capacidad debe ser mayor que 0.");
        return;
      }

      const payload = {
        nombre: form.nombre.trim(),
        nivel: form.nivel,
        capacidad: Number(form.capacidad),
        activa: form.activa,
      };

      if (editing) {
        await clasesService.update(editing.id, payload);
        setMsg("Clase actualizada correctamente.");
      } else {
        await clasesService.create(payload);
        setMsg("Clase creada correctamente.");
      }

      setShowModal(false);
      await cargarTodo();
    } catch (error) {
      setMsg("No se pudo guardar la clase.");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que quieres eliminar esta clase?");
    if (!ok) return;

    try {
      await clasesService.remove(id);
      setMsg("Clase eliminada correctamente.");
      await cargarTodo();
    } catch (error) {
      setMsg("No se pudo eliminar la clase.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Panel Profesor</h1>
          <p className="text-secondary mb-0">
            Gestiona las clases y consulta las sesiones reservadas por los usuarios.
          </p>
        </Col>

        <Col md={5} className="d-flex justify-content-md-end">
          <Button onClick={openCreate}>+ Nueva clase</Button>
        </Col>
      </Row>

      {msg && <Alert variant="info">{msg}</Alert>}
      {loading && <Alert variant="info">Cargando datos...</Alert>}

      <h3 className="fw-bold mb-3">Clases</h3>

      <Row className="g-3 mb-5">
        {clases.map((clase) => (
          <Col key={clase.id} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold">{clase.nombre}</div>
                    <div className="text-secondary">{clase.nivel}</div>
                  </div>

                  <Badge bg={clase.activa ? "success" : "secondary"}>
                    {clase.activa ? "Activa" : "Inactiva"}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="text-secondary">Capacidad</div>
                  <div className="fw-semibold">{clase.capacidad}</div>
                </div>

                <div className="mt-auto pt-3 d-grid gap-2">
                  <Button variant="outline-primary" onClick={() => openEdit(clase)}>
                    Editar
                  </Button>

                  <Button variant="outline-danger" onClick={() => handleDelete(clase.id)}>
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="fw-bold mb-3">Sesiones reservadas</h3>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {sesiones.length === 0 ? (
            <div className="text-secondary">Todavía no hay usuarios apuntados a clases.</div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Clase</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Pista</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {sesiones.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombreClase}</td>
                    <td>{s.nombreUsuario}</td>
                    <td>{s.emailUsuario}</td>
                    <td>{s.nombrePista}</td>
                    <td>{s.fecha}</td>
                    <td>{s.horaInicio} - {s.horaFin}</td>
                    <td>
                      <Badge bg={s.activa ? "success" : "secondary"}>
                        {s.activa ? "Activa" : "Cancelada"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Editar clase" : "Nueva clase"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre de la clase"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nivel</Form.Label>
            <Form.Select
              value={form.nivel}
              onChange={(e) => setForm({ ...form, nivel: e.target.value })}
            >
              <option>Iniciación</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
              <option>Menores</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={form.capacidad}
              onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
            />
          </Form.Group>

          <Form.Check
            type="switch"
            label="Clase activa"
            checked={form.activa}
            onChange={(e) => setForm({ ...form, activa: e.target.checked })}
          />
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