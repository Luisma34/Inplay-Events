import { useEffect, useMemo, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { newsService } from "../services/newsService";

export default function Noticias() {
  const [news, setNews] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setNews(newsService.getAll());
  }, []);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const empty = useMemo(() => news.length === 0, [news]);

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-3">Noticias</h1>

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

          const excerpt =
            n.excerpt?.trim() ||
            (n.content?.trim()
              ? (n.content.trim().length > 180
                  ? n.content.trim().slice(0, 180) + "..."
                  : n.content.trim())
              : "");

          return (
            <Card key={n.id} className="shadow-sm border-0 mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{n.title}</h5>

                    {/* Resumen */}
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

                    {/* Contenido completo */}
                    {isOpen && n.content?.trim() && (
                      <div
                        className="text-secondary"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {n.content}
                      </div>
                    )}
                  </div>

                  {/* Botón */}
                  {n.content?.trim() && (
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