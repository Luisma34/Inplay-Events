// frontend/src/pages/AdminUsuarios.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import { usersService } from "../services/usersService";
import { getUser } from "../auth/auth";

function roleBadge(role) {
  if (role === "ROLE_SUPERADMIN") return "dark";
  if (role === "ROLE_ADMIN") return "danger";
  if (role === "ROLE_PROFESOR") return "warning";
  return "secondary";
}

export default function AdminUsuarios() {
  const currentUser = getUser(); // para evitar “auto borrado” accidental

  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  // formulario alta
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ROLE_USUARIO");

  const refresh = async () => {
    try {
      const data = await usersService.getAll();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const admins = items.filter((u) => u.rol?.rol === "ROLE_ADMIN").length;
    const profes = items.filter((u) => u.rol?.rol === "ROLE_PROFESOR").length;
    const activos = items.filter((u) => u.active).length;
    return { total, admins, profes, activos };
  }, [items]);

  const handleCreate = async () => {
    setMsg("");
    
    if (!name || !email) {
      setMsg("Nombre y email obligatorios");
      return;
    }

    try {
      await usersService.create({ name, email, role });
      await refresh();
      setName("");
      setEmail("");
      setRole("ROLE_USUARIO");
      setMsg("Usuario creado.");
    } catch (e) {
      setMsg(`⚠️ ${e.message || "Error creando usuario"}`);
    }
  };

  const handleToggleActive = async (u) => {
    setMsg("");

    if (u.rol?.rol === "ROLE_SUPERADMIN") {
      setMsg(" No puedes desactivar el SUPERADMIN.");
      return;
    }
    try {
      await usersService.setActive(u.id, !u.active);
      await refresh();
      setMsg(u.active ? "Usuario desactivado." : " Usuario activado.");
    } catch (e) {
      setMsg(`⚠️ ${e.message || "Error"}`);
    }
  };

  const handleChangeRole = async (u, nextRole) => {
    setMsg("");

    if (u.rol?.rol === "ROLE_SUPERADMIN") {
      setMsg(" No puedes modificar el SUPERADMIN.");
      return;
    }

    try {
      await usersService.setRole(u.id, nextRole);
      await refresh();
      setMsg(" Rol actualizado.");
    } catch (e) {
      setMsg(` ${e.message || "Error"}`);
    }
  };

  const handleDelete = async (u) => {
    setMsg("");

    // evitar eliminar al SUPERADMIN
    if (u.rol?.rol === "ROLE_SUPERADMIN") {
      setMsg(" No puedes eliminar el SUPERADMIN.");
      return;
    }
    // evitar liadas típicas
    if (currentUser?.email?.toLowerCase() === u.email.toLowerCase()) {
      setMsg(" No puedes eliminarte a ti mismo.");
      return;
    }
    const ok = window.confirm(`¿Eliminar a ${u.email}?`);
    if (!ok) return;

    try {
      await usersService.remove(u.id);
      await refresh();
      setMsg(" Usuario eliminado.");
    } catch (e) {
      setMsg(` ${e.message || "Error"}`);
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-end g-3 mb-4">
        <Col md={7}>
          <h1 className="fw-bold mb-1">Admin · Usuarios</h1>
          <p className="text-secondary mb-0">
            Altas/bajas, roles y activación.
          </p>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex flex-wrap gap-2">
              <Badge bg="dark">Total: {stats.total}</Badge>
              <Badge bg="danger">Admins: {stats.admins}</Badge>
              <Badge bg="warning" text="dark">
                Profesores: {stats.profes}
              </Badge>
              <Badge bg="success">Activos: {stats.activos}</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {msg && (
        <Alert
          variant={msg.startsWith("✅") ? "success" : "warning"}
          dismissible
          onClose={() => setMsg("")}
        >
          {msg}
        </Alert>
      )}

      {/* Alta */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Nuevo usuario</h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label className="mb-1">Nombre</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
              />
            </Col>
            <Col md={4}>
              <Form.Label className="mb-1">Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </Col>
            <Col md={2}>
              <Form.Label className="mb-1">Rol</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="PROFESOR">PROFESOR</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              {/* El botón de crear se habilita al menos con nombre y email, el rol por defecto es USER */}
              <Button
                className="w-100"
                onClick={handleCreate}
                disabled={!name || !email}
              >
                Crear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th style={{ width: 160 }}>Rol</th>
                <th style={{ width: 120 }}>Estado</th>
                <th style={{ width: 260 }} className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-secondary py-5">
                    No hay usuarios creados aún.
                  </td>
                </tr>
              ) : (
                items
                  .filter((u) => u.rol?.rol !== "ROLE_SUPERADMIN")
                  .map((u) => (
                    <tr key={u.id}>
                      <td className="text-secondary">{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg={roleBadge(u.rol?.rol)}>{u.rol?.rol}</Badge>
                          <Form.Select
                            size="sm"
                            value={u.rol?.rol}
                            onChange={(e) =>
                              handleChangeRole(u, e.target.value)
                            }
                            style={{ maxWidth: 140 }}
                          >
                            <option value="ROLE_USUARIO">USER</option>
                            <option value="ROLE_PROFESOR">PROFESOR</option>
                            <option value="ROLE_ADMIN">ADMIN</option>
                          </Form.Select>
                        </div>
                      </td>
                      <td>
                        <Badge bg={u.active ? "success" : "secondary"}>
                          {u.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            size="sm"
                            variant={
                              u.active ? "outline-secondary" : "outline-success"
                            }
                            onClick={() => handleToggleActive(u)}
                          >
                            {u.active ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(u)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
