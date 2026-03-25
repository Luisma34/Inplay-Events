import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/pistas.jpg";
import featuresImage from "../assets/club-features.jpg";
import featuresClases from "../assets/clases.jpg";
import Collage from "../components/Collage";
import c1 from "../assets/collage/DJI_0033.JPG";
import c2 from "../assets/collage/foto-31.jpg";
import c3 from "../assets/collage/fotos-42.jpg";
import c4 from "../assets/collage/fotos-58.jpg";
import c5 from "../assets/collage/fotos-60.jpg";
import c6 from "../assets/collage/fotos-131.jpg";
import logoInplay from "../assets/collage/in-play-sombra.png";



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
    text: "Agenda semanal con profesor, nivel y reserva.",
    icon: "🎾",
    to: "/clases",
    buttonText: "Buscar clases",
    buttonClass: "btn-brand",
    disabled: true,
  },

   {
    title: "¿No tienes contra quién jugar",
    text: "Elige fecha y hora, mira disponibilidad y busca partido.",
    icon: "🆚",
    to: "/reservas",
    buttonText: "Próximamente",
    buttonClass: "btn-outline-brand",
    disabled: true,
  }
];

const pricingCards = [
  {
    title: "Clases en grupo (adultos)",
    subtitle: "Mismo nivel · plazas limitadas",
    items: [
      { label: "1 clase/semana", price: "30 €" },
      { label: "2 clases/semana", price: "55 €" },
      { label: "3 clases/semana", price: "70 €" },
    ],
  },
  {
    title: "Clases individuales",
    subtitle: "Entrenamiento 1:1",
    items: [
      { label: "1 sesión (60 min)", price: "25 €" },
      { label: "Bono 4 sesiones", price: "90 €" },
      { label: "Bono 8 sesiones", price: "170 €" },
    ],
  },
  {
    title: "Menores (grupo)",
    subtitle: "De iniciación a competición",
    items: [
      { label: "1 clase/semana", price: "25 €" },
      { label: "2 clases/semana", price: "45 €" },
      { label: "3 clases/semana", price: "60 €" },
    ],
  },
];


export default function Home() {
  return (
    <>
     <section className=" hero-bg">
  {/* Fondo + overlay */}
  <div
    className="hero-bg__image"
    style={{ backgroundImage: `url(${heroImage})` }}
  />
  <div className="hero-bg__overlay" />

  <Container fluid className="hero-bg__content">
  <Row className="justify-content-center text-center">
    <Col lg={8} xl={7}>
      
      <h1 className="hero-title mb-3">
        Bienvenido a InPlay
      </h1>

      <p className="hero-subtitle mb-4">
        Donde llevamos el pádel a otro nivel
      </p>

      <Button as={Link} to="/acceso" size="lg" className="btn-hero">
        ÚNETE AL CLUB
      </Button>

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
            <Col md={3} key={a.title}>
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

      <Collage
  images={[c1, c2, c3, c4, c5, c6]}
  logo={logoInplay}
/>

<section className="levelup-bg">
  <div
    className="levelup-bg__image"
    style={{ backgroundImage: `url(${featuresClases})` }}
  />
  <div className="levelup-bg__overlay" />

  <Container className="levelup-bg__content text-center">
    <h2 className="levelup-title mb-3">MEJORA TU NIVEL</h2>
    <p className="levelup-subtitle mb-4">
      Apúntate a clases por nivel y empieza a notar el cambio.
    </p>

    <Button
      as={Link}
      to="/clases"
      size="lg"
      className="btn-hero"
      
    >
      APÚNTATE
    </Button>
  </Container>
</section>
      

<section className="home-pricing">
  <Container className="home-wrap py-5">
    <Row className="mb-4 text-center">
      <Col>
        <h2 className="fw-bold home-sectionTitle">TarifasClases</h2>
        <p className="text-secondary mb-0">
          Elige el plan que mejor encaje contigo. (Precios orientativos)
        </p>
      </Col>
    </Row>

    <Row className="g-4 justify-content-center">
      {pricingCards.map((p) => (
        <Col key={p.title} xs={12} md={6} lg={4}>
          <Card className="h-100 pricing-card">
            <Card.Body>
              <div className="pricing-head">
                <h3 className="pricing-title">{p.title}</h3>
                <div className="pricing-subtitle">{p.subtitle}</div>
              </div>

              <div className="pricing-list">
                {p.items.map((it) => (
                  <div className="pricing-item" key={it.label}>
                    <span className="pricing-label">{it.label}</span>
                    <span className="pricing-price">{it.price}</span>
                  </div>
                ))}
              </div>

              <div className="pricing-note">
                Consulta disponibilidad y horarios en recepción.
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</section>





<section className="features-bg">
  <div
    className="features-bg__image"
    style={{ backgroundImage: `url(${featuresImage})` }}

  />
  <div className="features-bg__overlay" />

  <Container className="features-bg__content text-center">
    <h2 className="features-title mb-4">
      EN INPLAY ENCONTRARÁS
    </h2>

    <div className="features-list">
      <span>8 PISTAS</span>
      <span>APARCAMIENTO</span>
      <span>CAFETERÍA</span>
    </div>
  </Container>
</section>



      
    </>
  );
}
