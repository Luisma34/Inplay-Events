import { Container } from "react-bootstrap";

export default function PoliticaPrivacidad() {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Política de Privacidad</h1>

      <section className="mb-4">
        <p>
          En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la normativa
          española vigente, InPlay informa sobre el tratamiento de datos
          personales.
        </p>
      </section>

      <section className="mb-4">
        <h4>Responsable del tratamiento</h4>
        <ul>
          <li><strong>Responsable:</strong> InPlay</li>
          <li><strong>Ubicación:</strong> Las Palmas de Gran Canaria</li>
          <li><strong>Email:</strong> info@inplaypadel.com</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4>Datos que se recopilan</h4>
        <ul>
          <li>Nombre y apellidos</li>
          <li>Correo electrónico</li>
          <li>Teléfono</li>
          <li>Datos de reservas</li>
          <li>Información de uso del sitio web</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4>Finalidad del tratamiento</h4>
        <ul>
          <li>Gestionar reservas de pistas</li>
          <li>Gestionar inscripción en ligas y clases</li>
          <li>Atender consultas</li>
          <li>Enviar comunicaciones relacionadas con el servicio</li>
          <li>Cumplir obligaciones legales</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4>Base jurídica</h4>
        <ul>
          <li>Ejecución de un contrato</li>
          <li>Consentimiento del usuario</li>
          <li>Cumplimiento de obligaciones legales</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4>Conservación</h4>
        <p>
          Los datos se conservarán mientras exista relación con el usuario y
          durante los plazos legales correspondientes.
        </p>
      </section>

      <section className="mb-4">
        <h4>Derechos del usuario</h4>
        <p>
          El usuario puede ejercer sus derechos de acceso, rectificación,
          supresión, oposición, limitación y portabilidad enviando solicitud a:
          <strong> info@inplaypadel.com</strong>.
        </p>
        <p>
          También puede presentar reclamación ante la Agencia Española de
          Protección de Datos (www.aepd.es).
        </p>
      </section>
    </Container>
  );
}
