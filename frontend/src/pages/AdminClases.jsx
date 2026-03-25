// AdminClases.jsx
// Panel de administración para gestionar reservas de clases.
// Permite ver, cancelar o eliminar reservas.

import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Badge } from "react-bootstrap";
import { clasesService } from "../services/clasesService";

export default function AdminClases() {
  const [items, setItems] = useState([]);

  const refresh = () => setItems(clasesService.getAll());

  useEffect(() => {
    refresh();

    const onInternal = () => refresh();
    window.addEventListener("inplay:clases-updated", onInternal);

    return () => {
      window.removeEventListener("inplay:clases-updated", onInternal);
    };
  }, []);

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-4">Admin · Clases</h1>

      {items.length === 0 ? (
        <Card className="p-4 text-secondary">
          No hay reservas registradas.
        </Card>
      ) : (
        <Row className="g-3">
          {items.map((r) => (
            <Col key={r.id} md={6} lg={4}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="fw-bold">{r.date} - {r.time}</div>
                  <div className="text-secondary">
                    {r.userName} · {r.userEmail}
                  </div>

                  <Badge
                    bg={r.status === "Confirmada" ? "success" : "secondary"}
                    className="mt-2"
                  >
                    {r.status}
                  </Badge>

                  <div className="mt-auto d-grid gap-2 pt-3">
                    <Button
                      variant="outline-secondary"
                      onClick={() => clasesService.cancel(r.id)}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="outline-danger"
                      onClick={() => clasesService.remove(r.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}