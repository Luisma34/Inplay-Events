import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, Badge, Tabs, Tab } from "react-bootstrap";
import { leagueService } from "../services/leagueService";

export default function LigaDetalle() {

  // obtenemos el id de la liga desde la url
  // ejemplo: /ligas/2
  const { id } = useParams();

  const [liga, setLiga] = useState(null);

  useEffect(() => {

    // cargamos la liga concreta desde el service
    const data = leagueService.getById(id);
    setLiga(data);

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

      <h1 className="fw-bold mb-2">{liga.name}</h1>

      <div className="mb-4">
        <Badge bg="secondary" className="me-2">
          Nivel: {liga.level}
        </Badge>

        <Badge bg="primary">
          Estado: {liga.status}
        </Badge>
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

              <p>{liga.description}</p>

              <p>
                <b>Equipos:</b> {liga.teams}
              </p>

              <p>
                <b>Inicio:</b> {liga.startDate}
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

              <p className="text-secondary">
                La clasificación aparecerá aquí.
              </p>

            </Card.Body>
          </Card>

        </Tab>

      </Tabs>

    </Container>
  );
}