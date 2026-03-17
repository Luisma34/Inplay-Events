import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { getUser } from "../auth/auth";

export default function AdminNoticias() {
  const user = getUser();

  // Aquí guardamos el listado de noticias que viene del backend
  const [items, setItems] = useState([]);

  // Estado del formulario
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  // Si editingId tiene valor, estamos editando una noticia existente
  // Si es null, estamos creando una nueva
  const [editingId, setEditingId] = useState(null);

  // Mensaje para mostrar errores o confirmaciones
  const [msg, setMsg] = useState("");

  const isEditing = editingId !== null;

  // Cargamos las noticias desde backend
  const reload = () => {
    setMsg("");

    fetch("http://localhost:8080/api/noticias", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error cargando noticias");
        }
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => {
        console.error(err);
        setItems([]);
        setMsg("No se pudieron cargar las noticias.");
      });
  };

  useEffect(() => {
    reload();
  }, []);

  // Reseteamos el formulario cuando terminamos de crear o editar
  const resetForm = () => {
    setTitle("");
    setContent("");
    setPublished(true);
    setEditingId(null);
  };

  // Validación mínima: al menos tiene que haber título
  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");

    if (!canSubmit) return;

    // Preparamos el body en el formato que espera el backend
    const payload = {
      titulo: title.trim(),
      contenido: content.trim(),
      visible: published,
      usuario: user?.id ? { id: user.id } : null,
    };

    // Si estamos editando, hacemos PUT
    if (isEditing) {
      fetch(`http://localhost:8080/api/noticias/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error actualizando noticia");
          }
          return res.json();
        })
        .then(() => {
          reload();
          resetForm();
          setMsg("Noticia actualizada correctamente.");
        })
        .catch((err) => {
          console.error(err);
          setMsg("No se pudo actualizar la noticia.");
        });

      return;
    }

    // Si no estamos editando, hacemos POST
    fetch("http://localhost:8080/api/noticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error creando noticia");
        }
        return res.json();
      })
      .then(() => {
        reload();
        resetForm();
        setMsg("Noticia creada correctamente.");
      })
      .catch((err) => {
        console.error(err);
        setMsg("No se pudo crear la noticia.");
      });
  };

  // Cargamos una noticia en el formulario para editarla
  const handleEdit = (n) => {
    setEditingId(n.id);
    setTitle(n.titulo ?? "");
    setContent(n.contenido ?? "");
    setPublished(!!n.visible);

    // Subimos arriba para que se vea el formulario al editar
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cambiamos visible true/false
  const togglePublished = (n) => {
    setMsg("");

    fetch(`http://localhost:8080/api/noticias/${n.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        titulo: n.titulo,
        contenido: n.contenido,
        visible: !n.visible,
        usuario: n.usuario ? { id: n.usuario.id } : user?.id ? { id: user.id } : null,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error cambiando visibilidad");
        }
        return res.json();
      })
      .then(() => {
        reload();
      })
      .catch((err) => {
        console.error(err);
        setMsg("No se pudo cambiar el estado de la noticia.");
      });
  };

  // Eliminamos una noticia
  const handleDelete = (n) => {
    const ok = window.confirm(`¿Eliminar la noticia "${n.titulo}"?`);
    if (!ok) return;

    setMsg("");

    fetch(`http://localhost:8080/api/noticias/${n.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error eliminando noticia");
        }

        reload();

        // Si justo estábamos editando esa noticia, reseteamos el form
        if (editingId === n.id) {
          resetForm();
        }
      })
      .catch((err) => {
        console.error(err);
        setMsg("No se pudo eliminar la noticia.");
      });
  };

  return (
    <Container className="py-5">
      <Row className="mb-3">
        <Col>
          <h1 className="fw-bold mb-1">Admin · Noticias</h1>
          <p className="text-secondary mb-0">
            Crea, edita, publica y elimina noticias.
          </p>
        </Col>
      </Row>

      {msg && (
        <Alert variant={msg.includes("correctamente") ? "success" : "warning"}>
          {msg}
        </Alert>
      )}

      <Row className="g-4">
        {/* Formulario para crear o editar noticias */}
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">
                  {isEditing ? "Editar noticia" : "Nueva noticia"}
                </h5>

                {isEditing && (
                  <Button variant="outline-secondary" size="sm" onClick={resetForm}>
                    Cancelar edición
                  </Button>
                )}
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Nuevo torneo este fin de semana"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Texto completo de la noticia"
                  />
                </Form.Group>

                <Form.Check
                  type="switch"
                  id="published-switch"
                  className="mb-3"
                  label="Publicada"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />

                <div className="d-flex justify-content-end">
                  <Button type="submit" disabled={!canSubmit}>
                    {isEditing ? "Guardar cambios" : "Crear noticia"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Listado de noticias para admin */}
        <Col lg={4}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Listado</h6>
            <Button variant="outline-secondary" size="sm" onClick={reload}>
              Recargar
            </Button>
          </div>

          {items.length === 0 ? (
            <Card className="shadow-sm border-0">
              <Card.Body className="p-3 text-secondary">
                No hay noticias todavía.
              </Card.Body>
            </Card>
          ) : (
            items.map((n) => (
              <Card key={n.id} className="shadow-sm border-0 mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-bold">{n.titulo}</div>

                      <div className="text-secondary" style={{ fontSize: ".9rem" }}>
                        {n.fechaPublicacion
                          ? new Date(n.fechaPublicacion).toLocaleDateString()
                          : "Sin fecha"}
                      </div>
                    </div>

                    <Badge bg={n.visible ? "success" : "secondary"}>
                      {n.visible ? "Publicada" : "Oculta"}
                    </Badge>
                  </div>

                  {n.contenido ? (
                    <div className="text-secondary mt-2" style={{ fontSize: ".95rem" }}>
                      {n.contenido.length > 100
                        ? n.contenido.slice(0, 100) + "..."
                        : n.contenido}
                    </div>
                  ) : null}

                  <div className="d-grid gap-2 mt-3">
                    <Button variant="outline-primary" onClick={() => handleEdit(n)}>
                      Editar
                    </Button>

                    <Button
                      variant={n.visible ? "outline-warning" : "outline-success"}
                      onClick={() => togglePublished(n)}
                    >
                      {n.visible ? "Ocultar" : "Publicar"}
                    </Button>

                    <Button variant="outline-danger" onClick={() => handleDelete(n)}>
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}
