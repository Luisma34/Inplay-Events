import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AppHeader({ user }) {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Club Pádel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={Link} to="/reservas">
              Reservar
            </Nav.Link>
            <Nav.Link as={Link} to="/ligas">
              Ligas
            </Nav.Link>

            {!user && (
              <Button
                as={Link}
                to="/login"
                variant="outline-primary"
                className="ms-lg-2"
              >
                Iniciar sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
