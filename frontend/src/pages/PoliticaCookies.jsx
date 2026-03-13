import { Container } from "react-bootstrap";

export default function PoliticaCookies() {
  return (
    <Container className="py-5">
      <h1>Política de Cookies</h1>

      <p>
        El sitio web de InPlay utiliza cookies para garantizar el correcto
        funcionamiento y mejorar la experiencia del usuario.
      </p>

      <h4>¿Qué son las cookies?</h4>
      <p>
        Son pequeños archivos que se almacenan en el dispositivo del usuario
        al visitar una página web.
      </p>

      <h4>Tipos de cookies utilizadas</h4>
      <ul>
        <li>
          <strong>Cookies técnicas:</strong> necesarias para el funcionamiento
          del sitio (inicio de sesión, reservas).
        </li>
        <li>
          <strong>Cookies analíticas:</strong> permiten analizar el uso del
          sitio si se utilizan herramientas de medición como Google Analytics.
        </li>
      </ul>

      <h4>Gestión de cookies</h4>
      <p>
        El usuario puede aceptar, rechazar o configurar el uso de cookies desde
        el banner correspondiente. También puede eliminarlas desde la
        configuración de su navegador.
      </p>
    </Container>
  );
}
