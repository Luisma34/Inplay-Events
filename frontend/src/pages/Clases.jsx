import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Alert, Button, Form } from "react-bootstrap";
import { clasesService } from "../services/clasesService";
import { sesionesService } from "../services/sesionesService";

function hoyISO() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Clases() {
  const [clases, setClases] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [disponibilidad, setDisponibilidad] = useState({});

  const HORARIOS = [
    { inicio: "08:00", fin: "09:30" },
    { inicio: "09:30", fin: "11:00" },
    { inicio: "11:00", fin: "12:30" },
    { inicio: "12:30", fin: "14:00" },
    { inicio: "14:00", fin: "15:30" },
    { inicio: "15:30", fin: "17:00" },
    { inicio: "17:00", fin: "18:30" },
    { inicio: "18:30", fin: "20:00" },
    { inicio: "20:00", fin: "21:30" },
    { inicio: "21:30", fin: "23:00" },
  ];

  useEffect(() => {
    const cargarClases = async () => {
      try {
        setLoading(true);
        const data = await clasesService.getAll();
        setClases(data);
        setMsg("");
      } catch (error) {
        setMsg("No se pudieron cargar las clases");
      } finally {
        setLoading(false);
      }
    };

    cargarClases();
  }, []);

  const cargarDisponibilidad = async (idClase, fecha, horaInicio) => {
    try {
      if (!fecha || !horaInicio) return;

      const response = await fetch(
        `http://localhost:8080/api/sesiones/disponibilidad?idClase=${idClase}&fecha=${fecha}&horaInicio=${horaInicio}:00`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo cargar la disponibilidad");
      }

      const data = await response.json();

      setDisponibilidad((prev) => ({
        ...prev,
        [idClase]: data,
      }));
    } catch (error) {
      setDisponibilidad((prev) => ({
        ...prev,
        [idClase]: {
          ocupadas: 0,
          libres: 4,
          completa: false,
        },
      }));
    }
  };

  const handleChange = (idClase, field, value) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [idClase]: {
          ...prev[idClase],
          [field]: value,
        },
      };

      const fecha = field === "fecha" ? value : next[idClase]?.fecha;
      const horaInicio = field === "horaInicio" ? value : next[idClase]?.horaInicio;

      if (fecha && horaInicio) {
        cargarDisponibilidad(idClase, fecha, horaInicio);
      }

      return next;
    });
  };

  const handleApuntarse = async (idClase) => {
    try {
      setMsg("");

      const datos = formData[idClase];
      const dispo = disponibilidad[idClase];

      if (!datos?.idPista || !datos?.fecha || !datos?.horaInicio) {
        setMsg("Completa pista, fecha y horario antes de apuntarte.");
        return;
      }

      if (dispo?.completa) {
        setMsg("Esta sesión está completa.");
        return;
      }

      await sesionesService.create({
        idClase: idClase,
        idPista: Number(datos.idPista),
        fecha: datos.fecha,
        horaInicio: datos.horaInicio + ":00",
      });

      window.dispatchEvent(new Event("inplay:sesiones-updated"));

      await cargarDisponibilidad(idClase, datos.fecha, datos.horaInicio);

      setFormData((prev) => ({
        ...prev,
        [idClase]: {
          idPista: "",
          fecha: "",
          horaInicio: "",
        },
      }));

      setMsg("Sesión creada correctamente.");
    } catch (error) {
      console.error(error);
      setMsg(error.message || "No se pudo crear la sesión.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col>
          <h1 className="fw-bold mb-1">Clases</h1>
          <p className="text-secondary mb-0">
            Consulta las clases disponibles y apúntate.
          </p>
        </Col>
      </Row>

      {msg && <Alert variant="info">{msg}</Alert>}
      {loading && <Alert variant="info">Cargando clases...</Alert>}

      <Row className="g-4">
        {clases.map((clase) => {
          const dispo = disponibilidad[clase.id];

          return (
            <Col key={clase.id} xs={12} md={6} lg={4}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title>{clase.nombre}</Card.Title>

                  <Card.Text>
                    <strong>Nivel:</strong> {clase.nivel}
                  </Card.Text>

                  <Card.Text>
                    <strong>Capacidad por sesión:</strong> 4 personas
                  </Card.Text>

                  <Badge bg={clase.activa ? "success" : "secondary"} className="mb-3">
                    {clase.activa ? "Activa" : "Inactiva"}
                  </Badge>

                  <Form.Group className="mb-2">
                    <Form.Label>Pista</Form.Label>
                    <Form.Select
                      value={formData[clase.id]?.idPista || ""}
                      onChange={(e) => handleChange(clase.id, "idPista", e.target.value)}
                    >
                      <option value="">Selecciona una pista</option>
                      <option value="1">Pista 1</option>
                      <option value="2">Pista 2</option>
                      <option value="3">Pista 3</option>
                      <option value="4">Pista 4</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="date"
                      min={hoyISO()}
                      value={formData[clase.id]?.fecha || ""}
                      onChange={(e) => handleChange(clase.id, "fecha", e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Horario</Form.Label>
                    <Form.Select
                      value={formData[clase.id]?.horaInicio || ""}
                      onChange={(e) => handleChange(clase.id, "horaInicio", e.target.value)}
                    >
                      <option value="">Selecciona un horario</option>
                      {HORARIOS.map((horario) => (
                        <option key={horario.inicio} value={horario.inicio}>
                          {horario.inicio} - {horario.fin}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Todas las clases duran 1 hora y 30 minutos.
                    </Form.Text>
                  </Form.Group>

                  {formData[clase.id]?.fecha && formData[clase.id]?.horaInicio && dispo && (
                    <div className="mb-3">
                      <div>
                        <strong>Ocupadas:</strong> {dispo.ocupadas}
                      </div>
                      <div>
                        <strong>Libres:</strong> {dispo.libres}
                      </div>
                      <div className="mt-2">
                        <Badge bg={dispo.completa ? "danger" : "success"}>
                          {dispo.completa ? "Completa" : "Disponible"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    className="w-100"
                    disabled={!clase.activa || disponibilidad[clase.id]?.completa}
                    onClick={() => handleApuntarse(clase.id)}
                  >
                    {disponibilidad[clase.id]?.completa ? "Sesión completa" : "Apuntarse"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}