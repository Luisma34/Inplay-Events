import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-2">Panel Admin</h1>
          <p className="text-secondary mb-0">
            Control total: noticias, ligas, reservas y usuarios.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {[
          {
            title: "Noticias",
            text: "Crear y publicar novedades del club.",
            to: "/admin/noticias",
          },
          {
            title: "Ligas",
            text: "Crear ligas, categorías y temporadas.",
            to: "/admin/ligas",
          },
          {
            title: "Reservas",
            text: "Ver/cancelar reservas y bloquear pistas.",
            to: "/admin/reservas",
          },
          {
            title: "Usuarios",
            text: "Roles, altas/bajas y permisos.",
            to: "/admin/usuarios",
          },
        ].map((x) => (
          <Col key={x.title} md={6} lg={3}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <div className="fw-bold mb-2">{x.title}</div>
                <div className="text-secondary mb-3">{x.text}</div>
               {x.to ? (
  <Button as={Link} to={x.to} className="mt-auto">
    Gestionar
  </Button>
) : (
  <Button className="mt-auto" disabled>
    Gestionar (próximamente)
  </Button>
)}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

