import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

const STORAGE_KEY = "inplay_class_sessions_v1";

const tarifas = [
  {
    title: "Adultos en grupo (mismo nivel)",
    subtitle: "Entrena con gente de tu nivel",
    items: [
      { label: "1 clase/semana", price: "30€" },
      { label: "2 clases/semana", price: "55€" },
      { label: "3 clases/semana", price: "70€" },
    ],
  },
  {
    title: "Clases individuales",
    subtitle: "Atención 100% personalizada",
    items: [
      { label: "1 clase suelta", price: "25€" },
      { label: "Bono 4 clases", price: "90€" },
      { label: "Bono 8 clases", price: "170€" },
    ],
  },
  {
    title: "Menores en grupo",
    subtitle: "Formación base + técnica",
    items: [
      { label: "1 clase/semana", price: "25€" },
      { label: "2 clases/semana", price: "45€" },
      { label: "3 clases/semana", price: "60€" },
    ],
  },
];

function levelBadgeVariant(level) {
  if (level === "Iniciación") return "secondary";
  if (level === "Intermedio") return "primary";
  if (level === "Avanzado") return "dark";
  if (level === "Menores") return "success";
  return "info";
}

export default function Clases() {
  const [sessions, setSessions] = useState([]);

  const loadSessions = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setSessions([]);
      return;
    }
    try {
      setSessions(JSON.parse(raw));
    } catch {
      setSessions([]);
    }
  };

  useEffect(() => {
    loadSessions();

    // Cambios desde otra pestaña
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) loadSessions();
    };

    // Cambios desde el panel profesor (misma pestaña)
    const onInternal = () => loadSessions();

    window.addEventListener("storage", onStorage);
    window.addEventListener("inplay:sessions-updated", onInternal);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("inplay:sessions-updated", onInternal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agrupar por día para mostrarlo bonito como antes
  const groupedByDay = useMemo(() => {
    const map = new Map();
    for (const s of sessions) {
      if (!map.has(s.day)) map.set(s.day, []);
      map.get(s.day).push(s);
    }
    // ordenar por hora dentro de cada día
    for (const [day, arr] of map.entries()) {
      arr.sort((a, b) => (a.time > b.time ? 1 : -1));
      map.set(day, arr);
    }
    // orden de días
    const order = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return order
      .filter((d) => map.has(d))
      .map((d) => ({ day: d, sessions: map.get(d) }));
  }, [sessions]);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-2">Clases</h1>
          <p className="text-secondary mb-0">
            Mejora tu nivel con grupos por nivel o clases individuales.
          </p>
        </Col>
      </Row>

      {/* Tarifas */}
      <Row className="g-4 mb-5">
        {tarifas.map((t) => (
          <Col key={t.title} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <h3 className="h5 fw-bold mb-1">{t.title}</h3>
                <div className="text-secondary mb-3">{t.subtitle}</div>

                {t.items.map((it) => (
                  <div
                    key={it.label}
                    className="d-flex justify-content-between align-items-center py-2 border-top"
                  >
                    <span>{it.label}</span>
                    <Badge bg="primary" pill>
                      {it.price}
                    </Badge>
                  </div>
                ))}

                <div className="mt-3 text-secondary" style={{ fontSize: ".92rem" }}>
                  Precios orientativos. Confirma disponibilidad en recepción.
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Horarios (desde el panel profesor) */}
      <Row className="mb-3">
        <Col>
          <h2 className="h4 fw-bold">Horarios</h2>
          <p className="text-secondary mb-0">
            Estos horarios se actualizan desde el panel de profesor.
          </p>
        </Col>
      </Row>

      <Row className="g-3">
        {groupedByDay.length === 0 ? (
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-secondary py-4 text-center">
                No hay clases publicadas todavía. (Crea sesiones desde el panel Profesor)
              </Card.Body>
            </Card>
          </Col>
        ) : (
          groupedByDay.map((d) => (
            <Col key={d.day} xs={12} md={6} lg={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="fw-bold mb-2">{d.day}</div>

                  <div className="d-flex flex-column gap-2">
                    {d.sessions.map((s) => (
                      <div
                        key={s.id}
                        className="d-flex justify-content-between align-items-center p-2 rounded"
                        style={{ background: "rgba(0,0,0,0.04)" }}
                      >
                        <div>
                          <div className="fw-semibold">{s.time}</div>
                          <div className="text-secondary" style={{ fontSize: ".9rem" }}>
                            {s.coach} · Plazas: {s.spots > 0 ? s.spots : "Completa"}
                          </div>
                        </div>

                        <Badge bg={levelBadgeVariant(s.level)}>{s.level}</Badge>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

