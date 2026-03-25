import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // De momento solo mostramos mensaje de éxito.
    // Más adelante esto se puede conectar al backend.
    setEnviado(true);

    setForm({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: "",
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <h1 className="fw-bold mb-3">Contacto</h1>
              <p className="text-secondary mb-4">
                Si tienes dudas sobre reservas, ligas, clases o cualquier otro tema,
                puedes escribirnos a través de este formulario.
              </p>

              {enviado && (
                <Alert variant="success">
                  Tu mensaje se ha enviado correctamente.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tuemail@correo.com"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Asunto</Form.Label>
                      <Form.Control
                        type="text"
                        name="asunto"
                        value={form.asunto}
                        onChange={handleChange}
                        placeholder="Escribe el asunto"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Mensaje</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="mensaje"
                        value={form.mensaje}
                        onChange={handleChange}
                        placeholder="Escribe tu mensaje"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4 d-flex justify-content-end">
                  <Button type="submit" variant="primary">
                    Enviar mensaje
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              <div className="text-secondary">
                <div><strong>Email:</strong> info@inplaypadel.com</div>
                <div><strong>Ubicación:</strong> Las Palmas de Gran Canaria</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
