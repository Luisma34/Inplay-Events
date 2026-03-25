import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/collage/in-play-sombra.png";


export default function AppHeader({ user, onLogout }) {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
  <img
    src={logo}
    alt="InPlay"
    height="45"
    className="me-2"
  />
  <span className="fw-bold"></span>
</Navbar.Brand>


        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">

            <Nav.Link as={Link} to="/reservas">
              Reservar
            </Nav.Link>

            <Nav.Link as={Link} to="/clases">
            Clases
            </Nav.Link>


            <Nav.Link as={Link} to="/ligas">
              Ligas
            </Nav.Link>

            <Nav.Link as={Link} to="/noticias">
              Noticias
            </Nav.Link>

            <Nav.Link as={Link} to="/buscar-partidos">Buscar partidos</Nav.Link>


            {/* 👇 Si NO está logueado */}
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

            {/* 👇 Si está logueado */}
            {user && (
              <NavDropdown
                title={`${user.name} (${user.role})`}
                id="user-menu"
                align="end"
                className="ms-lg-2"
              >
                <NavDropdown.Item as={Link} to="/mi-cuenta">
                  Mi cuenta
                </NavDropdown.Item>

                {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Panel Admin
                  </NavDropdown.Item>
                )}

                {user.role === "PROFESOR" && (
                  <NavDropdown.Item as={Link} to="/profesor">
                    Panel Profesor
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />

                <NavDropdown.Item onClick={onLogout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
