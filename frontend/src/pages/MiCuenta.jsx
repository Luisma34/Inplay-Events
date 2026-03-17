import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Form
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser } from "../auth/auth";

// Devuelve un color según el estado para mostrarlo visualmente
function badgeVariantByStatus(status) {
  if (status === "Confirmada") return "success";
  if (status === "Pendiente") return "warning";
  if (status === "Cancelada") return "secondary";
  if (status === "Activa") return "primary";
  if (status === "ACTIVA") return "primary";
  if (status === "Abierta") return "success";
  if (status === "ABIERTA") return "success";
  if (status === "Próximamente") return "secondary";
  return "dark";
}

export default function MiCuenta() {
  const user = getUser();

  // Guardamos las ligas del usuario autenticado
  const [misLigas, setMisLigas] = useState([]);

  // Guardamos las reservas de pista del usuario autenticado
  const [myReservas, setMyReservas] = useState([]);

  // Guardamos las clases reservadas del usuario autenticado
  const [misClases, setMisClases] = useState([]);

  // Estado local del formulario de perfil
  // De momento esto sigue sin guardarse en backend
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  // Validación mínima del formulario de perfil
  const canSaveProfile = useMemo(() => {
    return profile.name.trim().length >= 2 && profile.email.includes("@");
  }, [profile]);

  // Cargamos las reservas del usuario desde backend al montar la página
  useEffect(() => {
   const cargarReservas = () => {
    fetch("http://localhost:8080/api/reservas/mis-reservas", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error cargando reservas");
        }
        return res.json();
      })
      .then((data) => setMyReservas(data))
      .catch(() => setMyReservas([]));
   };

   cargarReservas();

    // Escuchar evento personalizado para recargar reservas cuando se haga una nueva reserva
    window.addEventListener("inplay:reservas-updated", cargarReservas);

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener("inplay:reservas-updated", cargarReservas);
    };
  }, []);

  // Cargamos las ligas del usuario desde backend al montar la página
  useEffect(() => {
    fetch("http://localhost:8080/api/ligas/mis-ligas", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando ligas");
        return res.json();
      })
      .then((data) => setMisLigas(data))
      .catch((err) => {
        console.error(err);
        setMisLigas([]);
      });
  }, []);

  // Cargamos las clases del usuario desde backend al montar la página
  useEffect(() => {
    fetch("http://localhost:8080/api/sesiones/mis-sesiones", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando clases");
        return res.json();
      })
      .then((data) => setMisClases(data))
      .catch((err) => {
        console.error(err);
        setMisClases([]);
      });
  }, []);

  // De momento el perfil sigue sin guardarse en backend
  const handleSaveProfile = () => {
    alert("La edición del perfil se conectará al backend más adelante.");
  };

  // Cancela la inscripción del usuario en una liga
  const handleCancelLiga = (ligaId) => {
    const ok = window.confirm(
      "¿Seguro que quieres cancelar tu inscripción en esta liga?"
    );
    if (!ok) return;

    fetch(`http://localhost:8080/api/ligas/${ligaId}/salir`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cancelando liga");

        // Si backend responde bien, quitamos la liga del estado local
        setMisLigas((prev) => prev.filter((l) => l.id !== ligaId));
      })
      .catch(() => alert("Error al cancelar la liga"));
  };

  // Cancela una reserva de pista
  const handleCancelReserva = (id) => {
    const ok = window.confirm("¿Seguro que quieres cancelar esta reserva?");
    if (!ok) return;

    fetch(`http://localhost:8080/api/reservas/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cancelando reserva");

        // Si backend responde bien, quitamos la reserva del estado local
        setMyReservas((prev) => prev.filter((r) => r.id !== id));
      })
      .catch(() => alert("Error al cancelar la reserva"));
  };

  // Cancela una clase reservada
  const handleCancelClase = (id) => {
    const ok = window.confirm("¿Seguro que quieres cancelar esta clase?");
    if (!ok) return;

    fetch(`http://localhost:8080/api/sesiones/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cancelando clase");

        // Si backend responde bien, quitamos la clase del estado local
        setMisClases((prev) => prev.filter((c) => c.id !== id));
      })
      .catch(() => alert("Error al cancelar la clase"));
  };

  return (
    <Container className="py-5">
      {/* Cabecera principal de la página */}
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Mi cuenta</h1>
          <p className="text-secondary mb-0">
            Gestiona tus reservas, ligas, clases y datos personales.
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
        {/* Bloque lateral con perfil y accesos rápidos */}
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
                  variant="outline-primary"
                  disabled={!canSaveProfile}
                  onClick={handleSaveProfile}
                >
                  Guardar cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0 mt-4">
            <Card.Body>
              <div className="fw-bold mb-2">Accesos rápidos</div>
              <div className="d-grid gap-2">
                <Button as={Link} to="/ligas" variant="outline-primary">
                  Ver ligas
                </Button>
                <Button as={Link} to="/clases" variant="outline-primary">
                  Ver clases
                </Button>
                <Button as={Link} to="/reservas" variant="outline-primary">
                  Hacer una reserva
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Bloque principal con reservas, clases y ligas */}
        <Col lg={8}>
          <Row className="g-4">
            {/* Mis reservas de pista */}
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
                        Tus reservas de pista confirmadas.
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
                                {r.pistaNombre || r.pista?.nombre || `Pista ${r.pistaId}`}
                              </div>
                            </div>

                            <div className="d-flex flex-column align-items-end gap-2">
                              <Badge bg={badgeVariantByStatus(r.estado)}>
                                {r.estado}
                              </Badge>

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

            {/* Mis clases */}
            <Col xs={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Mis clases</div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: ".95rem" }}
                      >
                        Tus clases reservadas actualmente.
                      </div>
                    </div>
                    <Button
                      as={Link}
                      to="/clases"
                      variant="outline-primary"
                      size="sm"
                    >
                      Ver clases
                    </Button>
                  </div>

                  {misClases.length === 0 ? (
                    <div className="text-secondary">
                      Aún no tienes clases reservadas.
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {misClases.map((c) => (
                        <ListGroup.Item key={c.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold">
                                {c.fecha} · {c.horaInicio}
                              </div>
                              <div className="text-secondary">
                                {c.clase?.nombre} · {c.pista?.nombre}
                              </div>
                            </div>

                            <div className="d-flex flex-column align-items-end gap-2">
                              <Badge bg={c.activa ? "primary" : "secondary"}>
                                {c.activa ? "Activa" : "Cancelada"}
                              </Badge>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={!c.activa}
                                onClick={() => handleCancelClase(c.id)}
                              >
                                {c.activa ? "Cancelar" : "Cancelada"}
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

            {/* Mis ligas */}
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
                        Tus ligas activas.
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

                  {misLigas.length === 0 ? (
                    <div className="text-secondary">
                      Aún no estás inscrito en ninguna liga.
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {misLigas.map((l) => (
                        <ListGroup.Item key={l.id} className="px-0">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold">{l.nombre}</div>
                            </div>

                            <div className="d-flex flex-column align-items-end gap-2">
                              <Badge bg={badgeVariantByStatus(l.estado)}>
                                {l.estado}
                              </Badge>

                              <div className="d-flex gap-2">
                                <Button
                                  as={Link}
                                  to={`/ligas/${l.id}`}
                                  size="sm"
                                  variant="outline-secondary"
                                >
                                  Ver liga
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  disabled={l.estado !== "ABIERTA"}
                                  onClick={() => handleCancelLiga(l.id)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
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
