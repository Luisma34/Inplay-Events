import { Container } from "react-bootstrap";

export default function AppFooter() {
  return (
    <footer className="border-top py-4 mt-5">
      <Container className="text-secondary d-flex justify-content-between flex-wrap gap-2">
        <div>© {new Date().getFullYear()} Club Pádel</div>
        <div>Aviso legal · Privacidad · Cookies</div>
      </Container>
    </footer>
  );
}
