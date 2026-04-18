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
import { Modal } from "react-bootstrap";

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

  // Función para mostrar el modal de confirmación con la acción a ejecutar
  const confirmAction = (text, callback) => {
    setModalText(text);
    setAction(() => callback);
    setShowModal(true);
  };

  // Modal de confirmación genérico
  const [showModal, setShowModal] = useState(false);

  // Callback a ejecutar al confirmar en el modal
  const [action, setAction] = useState(null); // "liga" o "reserva"

  // Texto del modal (puede ser dinámico según la acción)
  const [modalText, setModalText] = useState("");

  // Ligas del usuario
  const [misLigas, setMisLigas] = useState([]);

  // Reservas del usuario
  const [myReservas, setMyReservas] = useState([]);

  // Clases/sesiones del usuario
  const [misSesiones, setMisSesiones] = useState([]);

  // Cargar reservas del usuario
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

    // Recargar reservas cuando se cree/cancele una reserva
    window.addEventListener("inplay:reservas-updated", cargarReservas);

    return () => {
      window.removeEventListener("inplay:reservas-updated", cargarReservas);
    };
  }, []);

  // Cargar ligas del usuario
  useEffect(() => {
    fetch("http://localhost:8080/api/ligas/mis-ligas", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando ligas");
        return res.json();
      })
      .then((data) => setMisLigas(data))
      .catch(() => setMisLigas([]));
  }, []);

  // Cargar clases/sesiones del usuario
  useEffect(() => {
    const cargarSesiones = () => {
      fetch("http://localhost:8080/api/sesiones/mis-sesiones", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error cargando sesiones");
          return res.json();
        })
        .then((data) => setMisSesiones(data))
        .catch(() => setMisSesiones([]));
    };

    cargarSesiones();

    // Recargar mis clases cuando el usuario se apunte a una clase
    window.addEventListener("inplay:sesiones-updated", cargarSesiones);

    return () => {
      window.removeEventListener("inplay:sesiones-updated", cargarSesiones);
    };
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

  // Cancelar liga
  const handleCancelLiga = (ligaId) => {
    confirmAction(
      "¿Seguro que quieres cancelar tu inscripción en esta liga?",
      () => {
        fetch(`http://localhost:8080/api/ligas/${ligaId}/salir`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => {
            if (!res.ok) throw new Error();
            setMisLigas((prev) => prev.filter((l) => l.id !== ligaId));
          })
          .catch(() => alert("Error al cancelar la liga"));
      },
    );
  };

  // Cancelar reserva
  const handleCancelReserva = (id) => {
    confirmAction("¿Seguro que quieres cancelar esta reserva?", () => {
      fetch(`http://localhost:8080/api/reservas/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          setMyReservas((prev) => prev.filter((r) => r.id !== id));
        })
        .catch(() => alert("Error al cancelar la reserva"));
    });
  };

  // Cancelar clase/sesión
  const handleCancelSesion = (id) => {
    confirmAction("¿Seguro que quieres cancelar esta clase?", () => {
      fetch(`http://localhost:8080/api/sesiones/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          setMisSesiones((prev) =>
            prev.map((s) => (s.id === id ? { ...s, activa: false } : s)),
          );
        })
        .catch(() => alert("Error al cancelar la clase"));
    });
  };

  return (
    <>
      <Container className="py-5">
        {/* Cabecera */}
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
          {/* PERFIL */}
          <Col lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div
                      className="text-secondary"
                      style={{ fontSize: ".9rem" }}
                    >
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
                    <Form.Label className="mb-1">
                      Teléfono (opcional)
                    </Form.Label>
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

          {/* RESERVAS + CLASES + LIGAS */}
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
                                  {r.pista?.nombre || `Pista ${r.pistaId}`}
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

              {/* MIS CLASES */}
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
                          Tus clases reservadas.
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

                    {misSesiones.length === 0 ? (
                      <div className="text-secondary">
                        Aún no estás apuntado a ninguna clase.
                      </div>
                    ) : (
                      <ListGroup variant="flush">
                        {misSesiones.map((s) => (
                          <ListGroup.Item key={s.id} className="px-0">
                            <div className="d-flex justify-content-between align-items-start gap-3">
                              <div>
                                <div className="fw-semibold">
                                  {s.nombreClase || "Clase"}
                                </div>

                                <div className="text-secondary">
                                  {s.fecha} · {s.horaInicio} - {s.horaFin}
                                </div>

                                <div className="text-secondary">
                                  {s.nombrePista || "Pista"}
                                </div>
                              </div>

                              <div className="d-flex flex-column align-items-end gap-2">
                                <Badge bg={s.activa ? "success" : "secondary"}>
                                  {s.activa ? "Activa" : "Cancelada"}
                                </Badge>

                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  disabled={!s.activa}
                                  onClick={() => handleCancelSesion(s.id)}
                                >
                                  {s.activa ? "Cancelar" : "Cancelada"}
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalText}</Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (action) action();
              setShowModal(false);
            }}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
