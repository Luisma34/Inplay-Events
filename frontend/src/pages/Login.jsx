import { useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { setUser } from "../auth/auth";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  // Capturamos estado enviado desde RequireAuth
  const location = useLocation();
  const redirectMessage = location.state?.message;


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");


  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && isValidEmail;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail) {
      setError("Introduce un email válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // Login (form-urlencoded porque usamos formLogin en Spring)
      const loginRes = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!loginRes.ok) {
        throw new Error("Credenciales incorrectas");
      }

      //  Obtener usuario real desde backend
      const meRes = await fetch("http://localhost:8080/api/auth/me", {
        credentials: "include",
      });

      if (!meRes.ok) {
        throw new Error("No se pudo obtener el usuario");
      }

      const userData = await meRes.json();

      //  Guardar usuario real
      const user ={
        id: userData.id,
        name: userData.nombre,
        email: userData.email,
        role: userData.rol?.rol?.replace("ROLE_", ""), // viene como ROLE_ADMIN, ROLE_USUARIO...
      };

      setUser(user); // guarda en localStorage
      onLogin?.(user); // actualizado el estado de React 

      navigate("/");
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
              <h1 className="h3 fw-bold mb-2">Iniciar sesión</h1>
              <p className="text-secondary mb-4">
                Accede para gestionar reservas, ligas y clases.
              </p>

              {/* Mensaje cuando redirige RequireAuth */}
              {redirectMessage && (
                <Alert variant="warning">{redirectMessage}</Alert>
              )}

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
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
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
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

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Recordarme"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    type="button"
                    disabled
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-100"
                  size="lg"
                  disabled={!canSubmit}
                >
                  Entrar
                </Button>

                <div className="text-center mt-3 text-secondary">
                  ¿No tienes cuenta?{" "}
                  <Link to="/register" className="text-decoration-none">
                    Crear cuenta
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div
            className="text-center mt-3 text-secondary"
            style={{ fontSize: ".95rem" }}
          >
            Al iniciar sesión aceptas nuestras políticas de privacidad y
            cookies.
          </div>
        </Col>
      </Row>
    </Container>
  );
}
