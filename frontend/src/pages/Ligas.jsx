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

  // función para comprobar si el usuario ya está inscrito en una liga
   const isJoined = (liga) => {
              if (!user) return false;
              return liga.usuarios?.some((u) => u.id === user.id);
            };

  // función para cargar las ligas desde la API
  const refresh = () => {
    fetch("http://localhost:8080/api/ligas", {
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

  function mapEstado(estado) {
    if (estado === "ABIERTA") return "Abierta";
    if (estado === "ACTIVA") return "Activa";
    if (estado === "FINALIZADA") return "FINALIZADA";
    return "Próximamente";
  }

  const filtered = useMemo(() => {
    return ligas.filter((l) => {
      const ligaStatus = mapEstado(l.estado);
      const okLevel = level === "Todos" || l.categoria === level;
      const okStatus = status === "Todos" || ligaStatus === status;
      return okLevel && okStatus;
    });
  }, [ligas, level, status]);

  // inscripción V1 (localStorage)
  // cuando conectemos backend, esto será un fetch a la API
  const handleJoin = (leagueId) => {
    setMsg("");

    fetch(`http://localhost:8080/api/ligas/${leagueId}/unirse`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          refresh();
          setMsg("Inscripción realizada.");
        } else {
          setMsg("No se pudo completar la inscripción.");
        }
      })
      .catch(() => setMsg("Error al conectar con el servidor."));
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Ligas</h1>
          <p className="text-secondary mb-0">
            Elige tu nivel, apúntate y sigue la clasificación. ¡A competir!
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
          // renderizamos las ligas que cumplen los filtros
          filtered.map((l) => {
            // comprobamos si el usuario ya está inscrito en esta liga para mostrar el estado correcto.
           const isJoined = (liga) => {              
              if (!user) return false;
              return liga.usuarios?.some((u) => u.id === user.id);
            };
            const joined = isJoined(l);
            
            // función para salir de la liga (solo si ya está inscrito)
            const handleLeave = (leagueId) => {
              fetch(`http://localhost:8080/api/ligas/${leagueId}/salir`, {
                method: "DELETE",
                credentials: "include", 
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.ok) {
                    refresh();
                    setMsg("Has salido de la liga.");
                  } else {
                    setMsg("No se pudo completar la acción.");
                  }
                })
                .catch(() => setMsg("Error al conectar con el servidor."));
            }
            
            // mapeamos el estado de la liga para mostrarlo bonito y para controlar la inscripción
            const ligaStatus = mapEstado(l.estado);
            const canJoin = user && ligaStatus === "Abierta" && !joined;

            return (
              <Col key={l.id} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <h3 className="h5 fw-bold mb-1">{l.nombre}</h3>
                        <div className="text-secondary">
                          Nivel:{" "}
                          <span className="fw-semibold">{l.categoria}</span>
                        </div>
                      </div>

                      <Badge bg={statusBadgeVariant(ligaStatus)}>
                        {ligaStatus}
                      </Badge>
                    </div>

                    <p className="text-secondary mt-3 mb-3">{l.descripcion}</p>

                    <div className="d-flex flex-wrap gap-2 mt-auto">
                      <Badge bg="light" text="dark">
                        Equipos: {l.equipos ?? 0}
                      </Badge>
                      <Badge bg="light" text="dark">
                        Inicio:{" "}
                        {l.fechaInicio ? l.fechaInicio : "Por confirmar"}
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
                          onClick={() => joined ? handleLeave(l.id) : handleJoin(l.id)}
                          disabled={!canJoin && !joined}
                        >
                          {joined
                            ? "Salir de la liga"
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
