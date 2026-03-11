import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser } from "../auth/auth";

// DEMO V1 (ligas aún fake; luego backend)
const demoLigas = [
  { id: 1, name: "Liga InPlay - Intermedio", status: "Activa", position: 5 },
  { id: 2, name: "Liga Mixta - Intermedio", status: "Abierta", position: null },
];

function badgeVariantByStatus(status) {
  if (status === "Confirmada") return "success";
  if (status === "Pendiente") return "warning";
  if (status === "Cancelada") return "secondary";
  if (status === "Activa") return "primary";
  if (status === "Abierta") return "success";
  if (status === "Próximamente") return "secondary";
  return "dark";
}

export default function MiCuenta() {
  const user = getUser();

  const [myReservas, setMyReservas] = useState([]);
  
  // Cargar reservas del usuario al montar el componente
  useEffect(() => {
    fetch("http://localhost:8080/api/reservas/mis-reservas", {
      credentials: "include",
    })
    // El backend devuelve las horas como "HH:mm" o como objetos {hour: H, minute: M}, así que normalizamos ambos casos
      .then((res) => {
        // Si no es 200, probablemente no esté autenticado o haya un error, así que lanzamos para ir al catch
        if (!res.ok) {
          throw new Error("Error cargando reservas");
        }
        return res.json();
      })
      .then((data) => setMyReservas(data))
      .catch((err) => {
        console.error(err);
        setMyReservas([]);
      });
  }, []);

  // Perfil editable demo
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const canSaveProfile = useMemo(() => {
    return profile.name.trim().length >= 2 && profile.email.includes("@");
  }, [profile]);

  const handleSaveProfile = () => {
    alert("Guardado (demo). En V2 se conecta al backend.");
  };

  const handleCancelReserva = (id) => {
    const ok = window.confirm("¿Seguro que quieres cancelar esta reserva?");
    if (!ok) return;

    fetch(`http://localhost:8080/api/reservas/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cancelando");
        setMyReservas((prev) => prev.filter((r) => r.id !== id));
      })
      .catch(() => alert("Error al cancelar la reserva"));
  };

  return (
    <Container className="py-5">
      {/* Cabecera */}
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Mi cuenta</h1>
          <p className="text-secondary mb-0">
            Gestiona tus reservas, ligas y datos personales.
          </p>
        </Col>

        <Col md={5} className="d-flex gap-2 justify-content-md-end">
          <Button as={Link} to="/reservas" variant="primary">
            Reservar pista
          </Button>
          <Button as={Link} to="/buscar-partidos" variant="outline-primary">
            Buscar partido
          </Button>
        </Col>
      </Row>

      <Row className="g-4">
        {/* PERFIL */}
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-secondary" style={{ fontSize: ".9rem" }}>
                    Perfil
                  </div>
                  <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                    {user?.name || "Usuario"}
                  </div>
                  <div className="text-secondary">{user?.email}</div>
                </div>

                <Badge bg="dark">{user?.role || "USER"}</Badge>
              </div>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Nombre</Form.Label>
                  <Form.Control
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Tu nombre"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Email</Form.Label>
                  <Form.Control
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="tuemail@inplaypadel.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="mb-1">Teléfono (opcional)</Form.Label>
                  <Form.Control
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="600 000 000"
                  />
                </Form.Group>

                <Button
                  className="w-100"
                  variant="outline-secondary"
                  disabled={!canSaveProfile}
                  onClick={handleSaveProfile}
                >
                  Guardar cambios (demo)
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0 mt-4">
            <Card.Body>
              <div className="fw-bold mb-2">Accesos rápidos</div>
              <div className="d-grid gap-2">
                <Button as={Link} to="/ligas" variant="outline-secondary">
                  Ver ligas
                </Button>
                <Button as={Link} to="/clases" variant="outline-secondary">
                  Ver clases
                </Button>
                <Button as={Link} to="/reservas" variant="outline-secondary">
                  Hacer una reserva
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* MIS RESERVAS + MIS LIGAS */}
        <Col lg={8}>
          <Row className="g-4">
            {/* MIS RESERVAS */}
            <Col xs={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Mis reservas</div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: ".95rem" }}
                      >
                        Tus reservas confirmadas.
                      </div>
                    </div>
                    <Button
                      as={Link}
                      to="/reservas"
                      variant="primary"
                      size="sm"
                    >
                      Nueva reserva
                    </Button>
                  </div>

                  {myReservas.length === 0 ? (
                    <div className="text-secondary">
                      Aún no tienes reservas. Haz una desde{" "}
                      <Link to="/reservas">Reservas</Link>.
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {myReservas.map((r) => (
                        <ListGroup.Item key={r.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold">
                                {r.fecha} · {r.hora}
                              </div>
                              <div className="text-secondary">
                                {r.pista.nombre}
                              </div>
                            </div>

                            <div className="d-flex flex-column align-items-end gap-2">
                              <Badge bg={badgeVariantByStatus(r.estado)}>
                                {r.estado}
                              </Badge>

                              {/* ✅ CAMBIO: cancelar real */}
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={r.estado === "Cancelada"}
                                onClick={() => handleCancelReserva(r.id)}
                              >
                                {r.estado === "Cancelada"
                                  ? "Cancelada"
                                  : "Cancelar"}
                              </Button>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* MIS LIGAS */}
            <Col xs={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Mis ligas</div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: ".95rem" }}
                      >
                        Tus ligas activas y posición (V1 demo).
                      </div>
                    </div>
                    <Button
                      as={Link}
                      to="/ligas"
                      variant="outline-primary"
                      size="sm"
                    >
                      Ver ligas
                    </Button>
                  </div>

                  {demoLigas.length === 0 ? (
                    <div className="text-secondary">
                      Aún no estás inscrito en ninguna liga.
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {demoLigas.map((l) => (
                        <ListGroup.Item key={l.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold">{l.name}</div>
                              <div className="text-secondary">
                                {l.position
                                  ? `Posición: ${l.position}`
                                  : "Sin clasificación todavía"}
                              </div>
                            </div>
                            <Badge bg={badgeVariantByStatus(l.status)}>
                              {l.status}
                            </Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
