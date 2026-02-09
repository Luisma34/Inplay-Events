import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/pistas.jpg";


const quickActions = [
  {
    title: "Reservas rápidas",
    text: "Elige fecha y hora, mira disponibilidad y confirma en segundos.",
    icon: "📅",
    to: "/reservas",
    buttonText: "Ir a reservas",
    buttonClass: "btn-brand",
    disabled: false,
  },
  {
    title: "Ligas por nivel",
    text: "Únete a ligas activas, consulta clasificación y próximos partidos.",
    icon: "🏆",
    to: "/ligas",
    buttonText: "Ver ligas",
    buttonClass: "btn-outline-brand",
    disabled: false,
  },
  {
    title: "Clases",
    text: "Agenda semanal con profesor, nivel y reserva (próximamente).",
    icon: "🎾",
    to: "/clases",
    buttonText: "Próximamente",
    buttonClass: "btn-outline-secondary",
    disabled: true,
  },

   {
    title: "¿No tienes contra quién jugar",
    text: "Elige fecha y hora, mira disponibilidad y busca partido.",
    icon: "🆚",
    to: "/reservas",
    buttonText: "Ir a buscar partidos",
    buttonClass: "btn-brand",
    disabled: false,
  }
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <Container fluid className="home-wrap">
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="home-badge mb-3">
                <span>✅</span> Club de Pádel · PWA (V1)
              </div>

              <h1 className="display-5 fw-bold home-title">
                Reserva tu pista
              </h1>

              <p className="lead home-lead">
                Gestiona tus reservas y participa en ligas por nivel. Rápido, claro y desde el móvil.
              </p>

              <div className="d-flex gap-2 flex-wrap">
                <Button as={Link} to="/reservas" size="lg" className="btn-brand">
                  Reservar pista
                </Button>
                <Button as={Link} to="/ligas" size="lg" className="btn-outline-brand">
                  Ver ligas
                </Button>
              </div>

              <div className="home-metrics">
                <span>✅ <b>8</b> pistas</span>
                <span>✅ Indoor/Outdoor</span>
                <span>✅ Ligas activas</span>
                <span>✅ Clases</span>
              </div>
            </Col>

            <Col lg={6}>
              <div className="home-heroMedia">
                <div
                  className="home-heroImage"
                  style={{
                    backgroundImage:
                      
                      `url(${heroImage})`,
                  }}
                />
                <div className="home-heroMeta">
                  <small>📍 Tu Ciudad</small>
                  <small>🕒 08:00 - 23:00</small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container fluid className="home-wrap py-5 home-quick-actions">
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold home-sectionTitle">Accesos rápidos</h2>
            <p className="text-secondary mb-0">
              En la V1 empezamos por reservas y ligas, pero lo dejamos preparado para crecer.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {quickActions.map((a) => (
            <Col md={4} key={a.title}>
              <Card className="h-100 home-card">
                <Card.Body className="d-flex flex-column">
                  <div className="fs-2 mb-2">{a.icon}</div>
                  <Card.Title className="fw-semibold">{a.title}</Card.Title>
                  <Card.Text className="text-secondary">{a.text}</Card.Text>

                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to={a.to}
                      className={`w-100 ${a.buttonClass}`}
                      disabled={a.disabled}
                    >
                      {a.buttonText}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container fluid className="home-wrap pb-5">
        <div className="p-4 p-md-5 bg-dark text-white home-cta">
          <Row className="align-items-center g-3">
            <Col md={8}>
              <h3 className="fw-bold mb-2">¿Quieres competir en liga?</h3>
              <p className="mb-0 text-white-50">
                Apúntate por nivel, consulta la clasificación y sigue tus resultados.
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button as={Link} to="/ligas" size="lg" className="btn-brand">
                Ver ligas
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}
