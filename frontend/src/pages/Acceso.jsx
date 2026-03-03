import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";

export default function Acceso({ user }) {
  // Si ya está logueado, no tiene sentido ver esta página
  if (user) return <Navigate to="/mi-cuenta" replace />;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={9} lg={7}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5 text-center">
              <h1 className="fw-bold mb-2">Únete a InPlay</h1>
              <p className="text-secondary mb-4">
                Crea tu cuenta para reservar pistas, unirte a ligas y apuntarte a clases.
                Si ya tienes cuenta, inicia sesión.
              </p>

              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Button as={Link} to="/register" size="lg" className="px-4">
                  Crear cuenta
                </Button>
                <Button as={Link} to="/login" size="lg" variant="outline-primary" className="px-4">
                  Iniciar sesión
                </Button>
              </div>

              <div className="mt-4 text-secondary" style={{ fontSize: ".95rem" }}>
                Al continuar aceptas nuestras políticas de privacidad y cookies.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}