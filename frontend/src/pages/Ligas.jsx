import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser } from "../auth/auth";

function statusBadgeVariant(status) {
  if (status === "Abierta") return "success";
  if (status === "Activa") return "primary";
  if (status === "Próximamente") return "secondary";
  return "dark";
}

export default function Ligas() {
  const user = getUser(); // null si no está logueado

  const [ligas, setLigas] = useState([]);
  const [level, setLevel] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  // mensajes informativos (inscripción ok / errores)
  const [msg, setMsg] = useState("");

  // función para cargar las ligas desde la API
  const refresh = () => {
    fetch("http: //localhost:8080/api/ligas", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLigas(data))
      .catch(() => setLigas([]));
  };

  useEffect(() => {
    refresh();

    // si en otra parte de la app se cambia localStorage (admin, etc),
    // queremos que esta lista se refresque sin recargar la página
    const onInternal = () => refresh();

    window.addEventListener("inplay:ligas-updated", onInternal);

    return () => {
      window.removeEventListener("inplay:ligas-updated", onInternal);
    };
  }, []);

  const filtered = useMemo(() => {
    return ligas.filter((l) => {
      const ligaStatus = l.estado || "Próximamente";
      const okLevel = level === "Todos" || l.categoria === level;
      const okStatus = status === "Todos" || ligaStatus === status;
      return okLevel && okStatus;
    });
  }, [ligas, level, status]);

  // comprueba si el usuario actual está inscrito en una liga
  // en V1 guardamos la inscripción como email dentro de l.members
  const isJoined = (league) => {
    if (!user?.email) return false;
    const members = Array.isArray(league.members) ? league.members : [];
    return members.includes(user.email);
  };

  // inscripción V1 (localStorage)
  // cuando conectemos backend, esto será un fetch a la API
  const handleJoin = (leagueId) => {
    setMsg("");

    if (!user) {
      setMsg("Tienes que iniciar sesión para apuntarte.");
      return;
    }

    const res = leagueService.joinLeague({
      leagueId,
      userEmail: user.email,
    });

    if (!res.ok) {
      if (res.reason === "NOT_OPEN") setMsg("Esta liga no está abierta.");
      else if (res.reason === "ALREADY_JOINED")
        setMsg("Ya estás inscrito en esta liga.");
      else setMsg("No se pudo completar la inscripción.");
      return;
    }

    // actualizamos la lista para que el botón cambie a “ya inscrito”
    refresh();
    setMsg("Inscripción realizada.");
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Ligas</h1>
          <p className="text-secondary mb-0">
            Elige tu nivel, apúntate y sigue la clasificación. (V1 pública)
          </p>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="g-2">
                <Col sm={6}>
                  <Form.Label className="mb-1">Nivel</Form.Label>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Iniciación</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                    <option>General</option>
                    <option>Competición</option>
                  </Form.Select>
                </Col>

                <Col sm={6}>
                  <Form.Label className="mb-1">Estado</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Abierta</option>
                    <option>Activa</option>
                    <option>Próximamente</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {msg && (
        <Alert variant="info" onClose={() => setMsg("")} dismissible>
          {msg}
        </Alert>
      )}

      <Row className="g-3">
        {filtered.length === 0 ? (
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center text-secondary py-5">
                No hay ligas con esos filtros.
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filtered.map((l) => {
            const joined = isJoined(l);
            const ligaStatus = l.status || "Próximamente";
            const canJoin = user && ligaStatus === "Abierta" && !joined;

            return (
              <Col key={l.id} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h3 className="h5 fw-bold mb-1">{l.nombre}</h3>
                        <div className="text-secondary">
                          Nivel: <span className="fw-semibold">{l.categoria}</span>
                        </div>
                      </div>

                      <Badge bg={statusBadgeVariant(ligaStatus)}>
                        {ligaStatus}
                      </Badge>
                    </div>

                    <p className="text-secondary mt-3 mb-3">{l.description}</p>

                    <div className="d-flex flex-wrap gap-2 mt-auto">
                      <Badge bg="light" text="dark">
                        Equipos: {l.teams ?? 0}
                      </Badge>
                      <Badge bg="light" text="dark">
                        Inicio: {l.startDate ? l.startDate : "Por confirmar"}
                      </Badge>

                      {/* esto es útil para comprobar que se está guardando la inscripción */}
                      {joined && <Badge bg="success">Inscrito</Badge>}
                    </div>

                    <div className="mt-3 d-grid gap-2">
                      {/* Botón para ir al detalle de la liga */}
                      <Button
                        as={Link}
                        to={`/ligas/${l.id}`}
                        variant="outline-secondary"
                      >
                        Ver liga
                      </Button>

                      {/* Botón de inscripción */}
                      {!user ? (
                        <Button as={Link} to="/login" variant="primary">
                          Inicia sesión para apuntarte
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleJoin(l.id)}
                          disabled={!canJoin}
                        >
                          {joined
                            ? "Ya estás inscrito"
                            : ligaStatus === "Abierta"
                              ? "Apuntarme"
                              : "No disponible"}
                        </Button>
                      )}

                      {/* En V1 lo mandamos al detalle, donde están los Tabs */}
                      <Button
                        variant="outline-secondary"
                        as={Link}
                        to={`/ligas/${l.id}`}
                      >
                        Ver clasificación
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      <Card className="shadow-sm border-0 mt-5">
        <Card.Body className="p-4 p-md-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h2 className="h4 fw-bold mb-1">¿No sabes tu nivel?</h2>
            <div className="text-secondary">
              Te orientamos en el club y te recomendamos la liga adecuada.
            </div>
          </div>
          <Button as={Link} to="/clases" variant="outline-primary">
            Ver clases
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
