import { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      isValidEmail &&
      pass.length >= 6 &&
      pass === pass2
    );
  }, [name, isValidEmail, pass, pass2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (name.trim().length < 2) {
      setError("Introduce tu nombre (mínimo 2 caracteres).");
      return;
    }
    if (!isValidEmail) {
      setError("Introduce un email válido.");
      return;
    }
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (pass !== pass2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Enviar datos al backend
    try {
      const res = await fetch("http://localhost:8080/api/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Enviar solo los campos necesarios, sin pass2 ni showPass
        // Además, se recomienda enviar el nombre sin espacios al inicio o final
        body: JSON.stringify({
          nombre: name.trim(),
          email: email.trim(),
          password: pass,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo crear la cuenta");
      }

      // Si todo va bien, mostrar mensaje de éxito
      setOk("Cuenta creada correctamente");
      // Redirigir a login después de un breve mensaje de éxito
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold mb-2">Crear cuenta</h1>
              <p className="text-secondary mb-4">
                Regístrate para reservar pistas, apuntarte a ligas y clases.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {ok && <Alert variant="success">{ok}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    placeholder="tuemail@inplaypadel.com"
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={email.length > 0 && !isValidEmail}
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Email no válido.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPass ? "text" : "password"}
                      value={pass}
                      placeholder="••••••••"
                      onChange={(e) => setPass(e.target.value)}
                      autoComplete="new-password"
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                    >
                      {showPass ? "Ocultar" : "Ver"}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-secondary">
                    Mínimo 6 caracteres.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Repite contraseña</Form.Label>
                  <Form.Control
                    type={showPass ? "text" : "password"}
                    value={pass2}
                    placeholder="••••••••"
                    onChange={(e) => setPass2(e.target.value)}
                    autoComplete="new-password"
                    isInvalid={pass2.length > 0 && pass !== pass2}
                  />
                  <Form.Control.Feedback type="invalid">
                    No coincide con la contraseña.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  size="lg"
                  disabled={!canSubmit}
                >
                  Crear cuenta
                </Button>

                <div className="text-center mt-3 text-secondary">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-decoration-none">
                    Inicia sesión
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div
            className="text-center mt-3 text-secondary"
            style={{ fontSize: ".95rem" }}
          >
            Al registrarte aceptas nuestras políticas de privacidad y cookies.
          </div>
        </Col>
      </Row>
    </Container>
  );
}
