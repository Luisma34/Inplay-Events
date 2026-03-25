import { useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";

const fakeMatches = [
  { id: 1, date: "2026-02-10", hour: "18:00", level: "Intermedio", type: "Mixto", spots: 1 },
  { id: 2, date: "2026-02-10", hour: "19:30", level: "Avanzado", type: "Masculino", spots: 2 },
  { id: 3, date: "2026-02-11", hour: "17:00", level: "Iniciación", type: "Femenino", spots: 1 },
  { id: 4, date: "2026-02-12", hour: "20:00", level: "Intermedio", type: "Mixto", spots: 3 },
];

export default function BuscarPartidos() {
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("Todos");
  const [type, setType] = useState("Todos");

  const filtered = useMemo(() => {
    return fakeMatches.filter((m) => {
      const okDate = !date || m.date === date;
      const okLevel = level === "Todos" || m.level === level;
      const okType = type === "Todos" || m.type === type;
      return okDate && okLevel && okType;
    });
  }, [date, level, type]);

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={6}>
          <h1 className="fw-bold mb-1">Buscar partido</h1>
          <p className="text-secondary mb-0">
            Filtra por fecha, nivel y tipo. Los partidos disponibles aparecerán abajo.
          </p>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="g-2">
                <Col sm={4}>
                  <Form.Label className="mb-1">Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Col>

                <Col sm={4}>
                  <Form.Label className="mb-1">Nivel</Form.Label>
                  <Form.Select value={level} onChange={(e) => setLevel(e.target.value)}>
                    <option>Todos</option>
                    <option>Iniciación</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </Form.Select>
                </Col>

                <Col sm={4}>
                  <Form.Label className="mb-1">Tipo</Form.Label>
                  <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Todos</option>
                    <option>Masculino</option>
                    <option>Femenino</option>
                    <option>Mixto</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        {filtered.length === 0 ? (
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="py-4 text-center text-secondary">
                No hay partidos con esos filtros.
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filtered.map((m) => (
            <Col key={m.id} xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{m.date}</div>
                      <div className="text-secondary">{m.hour}</div>
                    </div>
                    <Badge bg="secondary">{m.level}</Badge>
                  </div>

                  <div className="mt-3">
                    <div className="text-secondary">Tipo</div>
                    <div className="fw-semibold">{m.type}</div>
                  </div>

                  <div className="mt-3">
                    <div className="text-secondary">Plazas libres</div>
                    <div className="fw-semibold">{m.spots}</div>
                  </div>

                  <div className="mt-auto pt-3">
                    <Button className="w-100" disabled>
                      Unirme (próximamente)
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
