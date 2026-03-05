import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { leagueService } from "../services/leagueService";

export default function AdminLigas() {
  /*
    items: listado de ligas que ve el admin (incluye borradores y publicadas)
    editingId: si es null estamos creando; si tiene un id estamos editando esa liga
  */
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  /*
    Estado del formulario.
    Lo guardamos en useState para que el form sea "controlado"
    (React controla el valor de cada input).
  */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("General");
  const [status, setStatus] = useState("Próximamente");
  const [teams, setTeams] = useState(0);
  const [startDate, setStartDate] = useState("");

  /*
    published: sirve para controlar si una liga se muestra en la parte pública.
    En V1 lo guardamos en localStorage. En V2 lo enviará y guardará el backend.
  */
  const [published, setPublished] = useState(true);

  /*
    isEditing es un valor derivado.
    No es obligatorio, pero hace el código más legible.
  */
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  /*
    refresh(): vuelve a cargar las ligas desde el service.
    Esto en V1 lee localStorage. En V2 será una llamada a la API.
  */
  function refresh() {
    setItems(leagueService.getAllAdmin());
  }

  /*
    Cuando se monta la página (primera vez), cargamos ligas.
  */
  useEffect(() => {
    refresh();
  }, []);

  /*
    resetForm(): vuelve el formulario a modo "crear" y limpia inputs.
    Lo llamamos después de crear/editar o si cancelamos la edición.
  */
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

  /*
    startEdit(l): carga una liga existente en el formulario para editarla.
    Importante:
    - published: si viene undefined (ligas antiguas), por defecto lo tratamos como true.
    - teams: lo convertimos a número para evitar strings.
  */
  function startEdit(l) {
    setEditingId(l.id);
    setName(l.name);
    setDescription(l.description || "");
    setLevel(l.level || "General");
    setStatus(l.status || "Próximamente");
    setTeams(Number(l.teams ?? 0));
    setStartDate(l.startDate || "");
    setPublished(l.published ?? true);
  }

  /*
    handleSubmit:
    - si estamos editando: hacemos update(id, datos)
    - si estamos creando: hacemos create(datos)
    Luego recargamos listado y reseteamos el formulario.

    En backend esto se convertirá en:
    - POST /ligas  (crear)
    - PUT/PATCH /ligas/:id (editar)
  */
  function handleSubmit(e) {
    e.preventDefault();

    // validación mínima: no dejamos crear/guardar sin nombre
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      level,
      status,
      teams: Number(teams),
      startDate,
      published,
    };

    if (isEditing) {
      leagueService.update(editingId, payload);
    } else {
      leagueService.create(payload);
    }

    refresh();
    resetForm();
  }

  /*
    togglePublished:
    Cambia una liga de publicada <-> borrador.
    En V1 se guarda en localStorage.
    En V2 será un PATCH al backend cambiando published.
  */
  function togglePublished(l) {
    leagueService.update(l.id, { published: !(l.published ?? true) });
    refresh();
  }

  /*
    remove:
    Borra una liga.
    Pedimos confirmación porque es destructivo.
  */
  function remove(l) {
    if (!confirm(`¿Eliminar la liga "${l.name}"?`)) return;

    leagueService.remove(l.id);
    refresh();

    // si justo estábamos editando esa liga, limpiamos el formulario
    if (editingId === l.id) resetForm();
  }

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-2">Admin · Ligas</h1>
      <p className="text-secondary mb-4">
        Crear, editar, publicar y eliminar ligas.
      </p>

      <Row className="g-4">
        {/* FORMULARIO: Crear / Editar */}
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
                      onChange={(e) => setTeams(Number(e.target.value))}
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

        {/* LISTADO: todas las ligas (admin) */}
        <Col lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Listado</h5>

              {items.length === 0 ? (
                <div className="text-secondary">No hay ligas todavía.</div>
              ) : (
                items.map((l) => (
                  <div key={l.id} className="border rounded p-3 mb-3">
                    <div className="fw-bold">{l.name}</div>
                    <div className="text-secondary small">
                      {l.description || "Sin descripción"}
                    </div>

                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      <Badge bg="secondary">{l.level}</Badge>
                      <Badge bg="info">{l.status || "Próximamente"}</Badge>

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