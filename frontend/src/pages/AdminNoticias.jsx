import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import { newsService } from "../services/newsService";

export default function AdminNoticias() {
  const [items, setItems] = useState([]);

  // Form
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);

  // Modo edición
  const [editingId, setEditingId] = useState(null);

  const isEditing = editingId !== null;

  const reload = () => setItems(newsService.getAllAdmin());

  useEffect(() => {
    reload();
  }, []);

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setPublished(true);
    setEditingId(null);
  };

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (!isEditing) {
      // Crear
      newsService.create({ title, excerpt, content, published });
    } else {
      // Guardar cambios
      newsService.update(editingId, { title, excerpt, content, published });
    }

    reload();
    resetForm();
  };

  const handleEdit = (n) => {
    setEditingId(n.id);
    setTitle(n.title ?? "");
    setExcerpt(n.excerpt ?? "");
    setContent(n.content ?? "");
    setPublished(!!n.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublished = (n) => {
    newsService.update(n.id, { published: !n.published });
    reload();
  };

  const handleDelete = (n) => {
    const ok = confirm(`¿Eliminar la noticia "${n.title}"?`);
    if (!ok) return;
    newsService.remove(n.id);
    reload();
    if (editingId === n.id) resetForm();
  };

  return (
    <Container className="py-5">
      <Row className="mb-3">
        <Col>
          <h1 className="fw-bold mb-1">Admin · Noticias</h1>
          <p className="text-secondary mb-0">
            Crea, edita, publica y elimina noticias (V1: localStorage).
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">{isEditing ? "Editar noticia" : "Nueva noticia"}</h5>
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
                  <Form.Label>Resumen (opcional)</Form.Label>
                  <Form.Control
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Una frase corta para la card de noticias"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenido (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
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

        <Col lg={4}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Listado (admin)</h6>
            <Button variant="outline-secondary" size="sm" onClick={reload}>
              Recargar
            </Button>
          </div>

          {items.length === 0 ? (
            <Card className="shadow-sm border-0">
              <Card.Body className="p-3 text-secondary">No hay noticias todavía.</Card.Body>
            </Card>
          ) : (
            items.map((n) => (
              <Card key={n.id} className="shadow-sm border-0 mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-bold">{n.title}</div>
                      <div className="text-secondary" style={{ fontSize: ".9rem" }}>
                        {new Date(n.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge bg={n.published ? "success" : "secondary"}>
                      {n.published ? "Publicada" : "Borrador"}
                    </Badge>
                  </div>

                  {n.excerpt ? (
                    <div className="text-secondary mt-2" style={{ fontSize: ".95rem" }}>
                      {n.excerpt}
                    </div>
                  ) : null}

                  <div className="d-grid gap-2 mt-3">
                    <Button variant="outline-primary" onClick={() => handleEdit(n)}>
                      Editar
                    </Button>

                    <Button
                      variant={n.published ? "outline-warning" : "outline-success"}
                      onClick={() => togglePublished(n)}
                    >
                      {n.published ? "Despublicar" : "Publicar"}
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