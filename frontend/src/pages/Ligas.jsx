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
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUser } from "../auth/auth";

//
function statusBadgeVariant(status) {
  if (status === "Abierta") return "success";
  if (status === "Activa") return "primary";
  if (status === "Próximamente") return "secondary";
  return "dark";
}

// mapeo de estados para mostrar un texto más amigable en la UI
const estadoLabel = {
  ABIERTA: "Abierta",
  EN_CURSO: "En curso",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

export default function Ligas() {
  // obtenemos el usuario logueado para mostrar la información correcta y controlar las inscripciones.
  const user = getUser();


  // estado para almacenar las ligas obtenidas de la API y los filtros de nivel y estado
  const [ligas, setLigas] = useState([]);
  const [level, setLevel] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  // estado para controlar el modal de creación / edición de liga
  const [showModal, setShowModal] = useState(false);
  // estado para almacenar la liga que se está editando (null si se está creando una nueva)
  const [editingLiga, setEditingLiga] = useState(null);

  // estado del formulario de creación / edición de liga
  const [formLiga, setFormLiga] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    division: "",
    estado: "ABIERTA",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // mensajes informativos (inscripción ok / errores)
  const [msg, setMsg] = useState("");
  const [formError, setFormError] = useState("");

  // función para comprobar si el usuario ya está inscrito en una liga
  const isJoined = (liga) => {
    if (!user) return false;
    return liga.usuarios?.some((u) => u.id === user.id);
  };

  // función para cargar las ligas desde la API
  const refresh = () => {
    fetch("http://localhost:8080/api/ligas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLigas(data);
      })
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

  // función para mapear el estado de la liga a un formato más amigable
  function mapEstado(estado) {
    if (!estado) return "Abierta";
    return estadoLabel[estado] || "Abierta";
  }

  const filtered = useMemo(() => {
    return ligas.filter((l) => {
      const ligaStatus = mapEstado(l.estado);
      const okLevel = level === "Todos" || l.categoria === level;
      const okStatus = status === "Todos" || ligaStatus === status;
      return okLevel && okStatus;
    });
  }, [ligas, level, status]);

  // función para inscribirse en una liga
  const handleJoin = (leagueId) => {
    setMsg("");

    fetch(`http://localhost:8080/api/ligas/${leagueId}/unirse`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          setMsg(msg);
          return null;
        }

        return res.text();
      })
      .then((data) => {
        if (!data) return;

        refresh();
        setMsg("Inscripción realizada.");
      })
      .catch(() => setMsg("Error al conectar con el servidor."));
  };

  // función para eliminar una liga (solo admin)
  function deleteLiga(id) {
    fetch(`http://localhost:8080/api/ligas/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        refresh();
        setMsg("Liga eliminada.");
      })
      .catch(() => setMsg("No se pudo eliminar la liga."));
  }

  function saveLiga() {
    if (!formLiga.nombre) {
      setFormError("Debes introducir un nombre para la liga.");
      return;
    }

    if (!formLiga.categoria) {
      setFormError("Debes seleccionar una categoría.");
      return;
    }

    if (!formLiga.division) {
      setFormError("Debes seleccionar una división.");
      return;
    }

    const method = editingLiga ? "PUT" : "POST";

    const url = editingLiga
      ? `http://localhost:8080/api/ligas/${editingLiga.id}`
      : "http://localhost:8080/api/ligas";

    const payload = {
      ...formLiga,
      fecha_inicio: formLiga.fecha_inicio || null,
      fecha_fin: formLiga.fecha_fin || null,
    };

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setShowModal(false);
        refresh();
        setMsg(editingLiga ? "Liga actualizada" : "Liga creada");
      })
      .catch(() => setMsg("Error al guardar la liga"));
  }

  return (
    <>
      <Container className="py-5">
        <Row className="align-items-end g-3 mb-4">
          <Col md={7}>
            <h1 className="fw-bold mb-1">Ligas</h1>

            {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
              <Button
                variant="success"
                onClick={() => {
                  setEditingLiga(null);
                  setFormLiga({
                    nombre: "",
                    descripcion: "",
                    categoria: "",
                    division: "",
                    estado: "ABIERTA",
                    fecha_inicio: "",
                    fecha_fin: "",
                  });
                  setShowModal(true);
                }}
              >
                Crear liga
              </Button>
            )}

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
                      <option>En curso</option>
                      <option>Finalizada</option>
                      <option>Cancelada</option>
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
                console.log(l.estado);
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
              };

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

                      <p className="text-secondary mt-3 mb-3">
                        {l.descripcion}
                      </p>

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
                            onClick={() =>
                              joined ? handleLeave(l.id) : handleJoin(l.id)
                            }
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

                        {(user?.role === "ADMIN" ||
                          user?.role === "SUPERADMIN") && (
                          <Button
                            variant="outline-warning"
                            onClick={() => {
                              // al hacer clic en editar, abrimos el modal y preparamos el formulario con los datos de la liga
                              setEditingLiga(l);
                              // preparamos el formulario con los datos de la liga para editarla
                              setFormLiga({
                                nombre: l.nombre,
                                descripcion: l.descripcion,
                                categoria: l.categoria,
                                division: l.division,
                                estado: l.estado,
                                fecha_inicio: l.fecha_inicio,
                                fecha_fin: l.fecha_fin,
                              });
                              // abrimos el modal
                              setShowModal(true);
                            }}
                          >
                            Editar liga
                          </Button>
                        )}

                        {/* Botón de eliminar (solo para admin) */}
                        {(user?.role === "ADMIN" ||
                          user?.role === "SUPERADMIN") && (
                          <Button
                            variant="outline-danger"
                            onClick={() => deleteLiga(l.id)}
                          >
                            Eliminar liga
                          </Button>
                        )}
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

      {/* Modal crear / editar liga */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingLiga ? "Editar liga" : "Crear liga"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}

          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={formLiga.nombre}
              onChange={(e) =>
                setFormLiga({ ...formLiga, nombre: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              value={formLiga.descripcion}
              onChange={(e) =>
                setFormLiga({ ...formLiga, descripcion: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={formLiga.categoria}
              onChange={(e) =>
                setFormLiga({ ...formLiga, categoria: e.target.value })
              }
              as="select"
            >
              <option value="">Selecciona categoría</option>
              <option value="Iniciación">Iniciación</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="General">General</option>
              <option value="Competición">Competición</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>División</Form.Label>
            <Form.Select
              value={formLiga.division}
              onChange={(e) =>
                setFormLiga({ ...formLiga, division: e.target.value })
              }
            >
              <option value="">Selecciona división</option>
              <option value="Primera">Primera</option>
              <option value="Segunda">Segunda</option>
              <option value="Tercera">Tercera</option>
              <option value="Cuarta">Cuarta</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={formLiga.estado}
              onChange={(e) =>
                setFormLiga({ ...formLiga, estado: e.target.value })
              }
            >
              <option value="ABIERTA">Abierta</option>
              <option value="EN_CURSO">En curso</option>
              <option value="FINALIZADA">Finalizada</option>
              <option value="CANCELADA">Cancelada</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fecha inicio</Form.Label>
            <Form.Control
              type="date"
              value={formLiga.fecha_inicio}
              onChange={(e) =>
                setFormLiga({ ...formLiga, fecha_inicio: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fecha fin</Form.Label>
            <Form.Control
              type="date"
              value={formLiga.fecha_fin}
              onChange={(e) =>
                setFormLiga({ ...formLiga, fecha_fin: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>

          <Button variant="success" onClick={saveLiga}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
