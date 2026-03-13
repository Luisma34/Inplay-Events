import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, Badge, Tabs, Tab } from "react-bootstrap";

export default function LigaDetalle() {
  // obtenemos el id de la liga desde la url
  // ejemplo: /ligas/2
  const { id } = useParams();

  const [liga, setLiga] = useState(null);

  // al cargar la página, buscamos la liga por id
  useEffect(() => {
    fetch(`http://localhost:8080/api/ligas/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Liga no encontrada");
        return res.json();
      })
      .then((data) => setLiga(data))
      .catch(() => setLiga(null));
  }, [id]);

  // si la liga no existe
  if (!liga) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h4>Liga no encontrada</h4>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-2">{liga.nombre}</h1>

      <div className="mb-4">
        <Badge bg="secondary" className="me-2">
          Nivel: {liga.categoria}
        </Badge>

        <Badge bg="primary">Estado: {liga.estado}</Badge>
      </div>

      {/* 
        Usamos Tabs para organizar la información de la liga.
        Esto nos permite separar info / partidos / clasificación
        sin tener que crear muchas páginas.
      */}

      <Tabs defaultActiveKey="info" className="mb-3">
        <Tab eventKey="info" title="Información">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <p>{liga.descripcion}</p>

              <p>
                <b>Inscritos:</b> {liga.inscritos}
              </p>

              {/* Mostramos equipos en V2
                <p>
                  <b>Equipos:</b> {liga.teams}
                </p>
              */}

              <p>
                <b>Inicio:</b> {liga.fechaInicio}
              </p>

              {/* 
                Aquí luego podremos poner más información:
                - reglas de la liga
                - formato de competición
                - duración
              */}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="partidos" title="Partidos">
          <Card className="shadow-sm border-0">
            <Card.Body>
              {/* 
                Aquí irá la lista de partidos de la liga.

                En la V2 el backend enviará algo así:
                - equipoA
                - equipoB
                - fecha
                - resultado

                De momento lo dejamos preparado.
              */}

              <p className="text-secondary">
                Los partidos de esta liga aparecerán aquí.
              </p>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="clasificacion" title="Clasificación">
          <Card className="shadow-sm border-0">
            <Card.Body>
              {/* 
                Aquí se mostrará la tabla de clasificación.

                El backend calculará:
                - puntos
                - partidos jugados
                - victorias
                - derrotas

                De momento dejamos la estructura preparada.
              */}

              <p className="text-secondary">La clasificación aparecerá aquí.</p>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}
