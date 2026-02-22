import { useMemo, useState } from "react";
import { Container, Row, Col, Card, Badge, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser } from "../auth/auth";

// Datos demo (luego vendrán del backend)
const ligasDemo = [
  {
    id: 1,
    name: "Liga InPlay - Iniciación",
    level: "Iniciación",
    status: "Abierta",
    teams: 12,
    startDate: "2026-03-01",
    description: "Ideal si estás empezando. Partidos guiados y buen ambiente.",
  },
  {
    id: 2,
    name: "Liga InPlay - Intermedio",
    level: "Intermedio",
    status: "Activa",
    teams: 16,
    startDate: "2026-02-01",
    description: "Competición equilibrada con jugadores de nivel medio.",
  },
  {
    id: 3,
    name: "Liga InPlay - Avanzado",
    level: "Avanzado",
    status: "Próximamente",
    teams: 10,
    startDate: "2026-04-10",
    description: "Para jugadores exigentes. Ritmo alto y partidos intensos.",
  },
  {
    id: 4,
    name: "Liga Mixta - Intermedio",
    level: "Intermedio",
    status: "Abierta",
    teams: 14,
    startDate: "2026-03-15",
    description: "Formato mixto. Compite y conoce gente del club.",
  },
];

function statusBadgeVariant(status) {
  if (status === "Abierta") return "success";
  if (status === "Activa") return "primary";
  if (status === "Próximamente") return "secondary";
  return "dark";
}

export default function Ligas() {
  const user = getUser(); // null si no está logueado

  const [level, setLevel] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  const filtered = useMemo(() => {
    return ligasDemo.filter((l) => {
      const okLevel = level === "Todos" || l.level === level;
      const okStatus = status === "Todos" || l.status === status;
      return okLevel && okStatus;
    });
  }, [level, status]);

  return (
    <Container className="py-5">
      {/* Cabecera */}
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Ligas</h1>
          <p className="text-secondary mb-0">
            Elige tu nivel, apúntate y sigue la clasificación. (V1 pública)
          </p>
        </Col>

        {/* Filtros */}
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="g-2">
                <Col sm={6}>
                  <Form.Label className="mb-1">Nivel</Form.Label>
                  <Form.Select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option>Todos</option>
                    <option>Iniciación</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </Form.Select>
                </Col>

                <Col sm={6}>
                  <Form.Label className="mb-1">Estado</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Todos</option>
                    <option>Abierta</option>
                    <option>Activa</option>
                    <option>Próximamente</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Listado */}
      <Row className="g-3">
        {filtered.length === 0 ? (
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center text-secondary py-5">
                No hay ligas con esos filtros.
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filtered.map((l) => (
            <Col key={l.id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <h3 className="h5 fw-bold mb-1">{l.name}</h3>
                      <div className="text-secondary">
                        Nivel: <span className="fw-semibold">{l.level}</span>
                      </div>
                    </div>
                    <Badge bg={statusBadgeVariant(l.status)}>{l.status}</Badge>
                  </div>

                  <p className="text-secondary mt-3 mb-3">{l.description}</p>

                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    <Badge bg="light" text="dark">
                      Equipos: {l.teams}
                    </Badge>
                    <Badge bg="light" text="dark">
                      Inicio: {l.startDate}
                    </Badge>
                  </div>

                  <div className="mt-3 d-grid gap-2">
                    {/* CTA según login */}
                    {!user ? (
                      <Button as={Link} to="/login" variant="primary">
                        Inicia sesión para apuntarte
                      </Button>
                    ) : (
                      <Button variant="primary" disabled={l.status !== "Abierta"}>
                        {l.status === "Abierta" ? "Apuntarme (próximamente)" : "No disponible"}
                      </Button>
                    )}

                    <Button variant="outline-secondary" disabled>
                      Ver clasificación (próximamente)
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* CTA inferior */}
      <Card className="shadow-sm border-0 mt-5">
        <Card.Body className="p-4 p-md-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h2 className="h4 fw-bold mb-1">¿No sabes tu nivel?</h2>
            <div className="text-secondary">
              Te orientamos en el club y te recomendamos la liga adecuada.
            </div>
          </div>
          <Button as={Link} to="/clases" variant="outline-primary">
            Ver clases
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
