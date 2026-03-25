import { useEffect, useMemo, useState } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";

export default function Noticias() {
  const [news, setNews] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Cargamos las noticias desde backend al entrar en la página
    fetch("http://localhost:8080/api/noticias", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error cargando noticias");
        }
        return res.json();
      })
      .then((data) => {
        setNews(data);
      })
      .catch((err) => {
        console.error(err);
        setMsg("No se pudieron cargar las noticias.");
        setNews([]);
      });
  }, []);

  const toggle = (id) => {
    // Si la noticia ya está abierta, la cerramos.
    // Si no, abrimos esa y cerramos la anterior.
    setOpenId((prev) => (prev === id ? null : id));
  };

  const empty = useMemo(() => news.length === 0, [news]);

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-3">Noticias</h1>

      {msg && (
        <Alert variant="warning" className="mb-3">
          {msg}
        </Alert>
      )}

      {empty ? (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h5 className="mb-2">Aún no hay noticias</h5>
            <p className="text-secondary mb-0">
              Cuando el administrador publique noticias, aparecerán aquí.
            </p>
          </Card.Body>
        </Card>
      ) : (
        news.map((n) => {
          const isOpen = openId === n.id;

          // En backend no tenemos excerpt, así que generamos un resumen corto
          // a partir del contenido si existe.
          const excerpt = n.contenido?.trim()
            ? n.contenido.trim().length > 180
              ? n.contenido.trim().slice(0, 180) + "..."
              : n.contenido.trim()
            : "";

          return (
            <Card key={n.id} className="shadow-sm border-0 mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{n.titulo}</h5>

                    {/* Si viene fecha, la mostramos debajo del título */}
                    {n.fechaPublicacion && (
                      <div
                        className="text-secondary mb-2"
                        style={{ fontSize: ".9rem" }}
                      >
                        {new Date(n.fechaPublicacion).toLocaleDateString()}
                      </div>
                    )}

                    {/* Mostramos resumen mientras la noticia está cerrada */}
                    {!isOpen && excerpt && (
                      <p
                        className="text-secondary mb-2"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {excerpt}
                      </p>
                    )}

                    {/* Mostramos contenido completo cuando está abierta */}
                    {isOpen && n.contenido?.trim() && (
                      <div
                        className="text-secondary"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {n.contenido}
                      </div>
                    )}
                  </div>

                  {/* Solo mostramos botón si la noticia tiene contenido */}
                  {n.contenido?.trim() && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => toggle(n.id)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {isOpen ? "Ver menos" : "Ver más"}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
}
