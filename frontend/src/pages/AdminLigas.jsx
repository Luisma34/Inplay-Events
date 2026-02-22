import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import { leagueService } from "../services/leagueService";

export default function AdminLigas() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("General");
  const [status, setStatus] = useState("Próximamente");
  const [teams, setTeams] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [published, setPublished] = useState(true);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  function refresh() {
    setItems(leagueService.getAllAdmin());
  }

  useEffect(() => {
    refresh();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setLevel("General");
    setStatus("Próximamente");
    setTeams(0);
    setStartDate("");
    setPublished(true);
  }

  function startEdit(l) {
    setEditingId(l.id);
    setName(l.name);
    setDescription(l.description || "");
    setLevel(l.level || "General");
    setStatus(l.status || "Próximamente");
    setTeams(l.teams || 0);
    setStartDate(l.startDate || "");
    setPublished(!!l.published);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      leagueService.update(editingId, {
        name,
        description,
        level,
        status,
        teams,
        startDate,
        published,
      });
    } else {
      leagueService.create({
        name,
        description,
        level,
        status,
        teams,
        startDate,
        published,
      });
    }

    refresh();
    resetForm();
  }

  function togglePublished(l) {
    leagueService.update(l.id, { published: !l.published });
    refresh();
  }

  function remove(l) {
    if (!confirm(`¿Eliminar la liga "${l.name}"?`)) return;
    leagueService.remove(l.id);
    refresh();
    if (editingId === l.id) resetForm();
  }

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-2">Admin · Ligas</h1>
      <p className="text-secondary mb-4">
        Crear, editar, publicar y eliminar ligas.
      </p>

      <Row className="g-4">
        {/* FORMULARIO */}
        <Col lg={7}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">
                {isEditing ? "Editar liga" : "Nueva liga"}
              </h5>

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Liga Intermedia Mixta"
                    />
                  </Col>

                  <Col xs={12}>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Breve descripción"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Nivel</Form.Label>
                    <Form.Select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <option>General</option>
                      <option>Iniciación</option>
                      <option>Intermedio</option>
                      <option>Avanzado</option>
                      <option>Competición</option>
                    </Form.Select>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>Abierta</option>
                      <option>Activa</option>
                      <option>Próximamente</option>
                    </Form.Select>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Equipos</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      value={teams}
                      onChange={(e) => setTeams(e.target.value)}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Fecha inicio</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>

                  <Col xs={12} className="d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      label="Publicada"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                  </Col>

                  <Col xs={12} className="d-flex gap-2 justify-content-end">
                    {isEditing && (
                      <Button variant="outline-secondary" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit">
                      {isEditing ? "Guardar cambios" : "Crear liga"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* LISTADO */}
        <Col lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Listado</h5>

              {items.length === 0 ? (
                <div className="text-secondary">
                  No hay ligas todavía.
                </div>
              ) : (
                items.map((l) => (
                  <div
                    key={l.id}
                    className="border rounded p-3 mb-3"
                  >
                    <div className="fw-bold">{l.name}</div>
                    <div className="text-secondary small">
                      {l.description || "Sin descripción"}
                    </div>

                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      <Badge bg="secondary">{l.level}</Badge>
                      <Badge bg="info">{l.status}</Badge>
                      {l.published ? (
                        <Badge bg="success">Publicada</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">
                          Borrador
                        </Badge>
                      )}
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => startEdit(l)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => togglePublished(l)}
                      >
                        {l.published ? "Despublicar" : "Publicar"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => remove(l)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}