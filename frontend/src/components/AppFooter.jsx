import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AppFooter.css";
export default function AppFooter() {
  return (
    <footer className="app-footer mt-5">
      <Container fluid>
        <Row className="gy-4">

          {/* Marca */}
          <Col md={4}>
            <h5 className="footer-title">InPlay Pádel</h5>
            <p className="footer-text">
              Centro deportivo especializado en pádel. 
              Instalaciones modernas, ligas por nivel y formación profesional.
            </p>
            <small className="footer-copy">
              © {new Date().getFullYear()} InPlay. Todos los derechos reservados.
            </small>
          </Col>

          {/* Navegación */}
          <Col md={4}>
            <h6 className="footer-subtitle">Navegación</h6>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/reservas">Reservas</Link></li>
              <li><Link to="/ligas">Ligas</Link></li>
              <li><Link to="/clases">Clases</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </Col>

          {/* Legal */}
          <Col md={4}>
            <h6 className="footer-subtitle">Legal</h6>
            <ul className="footer-links">
              <li><Link to="/aviso-legal">Aviso legal</Link></li>
              <li><Link to="/politica-privacidad">Política de privacidad</Link></li>
              <li><Link to="/politica-cookies">Política de cookies</Link></li>
            </ul>

            <div className="footer-contact mt-3">
              <div>Email: info@inplaypadel.com</div>
              <div>Las Palmas de Gran Canaria</div>
            </div>
          </Col>

        </Row>
      </Container>
    </footer>
  );
}
