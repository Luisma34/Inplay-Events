const API_URL = "http://localhost:8080/api/usuarios";

// mapper backend → frontend
function mapUser(u) {
  return {
    id: u.id,
    name: u.nombre,
    email: u.email,
    role: mapRoleFromBackend(u.rol?.rol),
    active: u.active,
  };
}

// mapper frontend → backend
function mapRoleToBackend(role) {
  if (role === "ROLE_ADMIN") return "ROLE_ADMIN";
  if (role === "ROLE_PROFESOR") return "ROLE_PROFESOR";
  return "ROLE_USUARIO";
}

function mapRoleFromBackend(role) {
  if (role === "ROLE_ADMIN") return "ROLE_ADMIN";
  if (role === "ROLE_PROFESOR") return "ROLE_PROFESOR";
  return "ROLE_USUARIO";
}

export const usersService = {
  async getAll() {
    const res = await fetch(API_URL, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error cargando usuarios");

    const data = await res.json();
    return data.map(mapUser);
  },

  async create({ nombre, email, password, rol }) {
    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        rol,
        active: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error creando usuario");
    }

    return mapUser(await res.json());
  },

  async setActive(id, active) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active,
      }),
    });

    if (!res.ok) throw new Error("Error actualizando estado");

    return true;
  },

  // Devuelve el usuario actualizado (con el nuevo rol)
  async setRole(id, role) {
    const backendRole = role;

    const res = await fetch(`${API_URL}/${id}/rol`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nuevoRol: backendRole,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error cambiando rol");
    }

    return await res.json();
  },
  async remove(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error eliminando usuario");

    return true;
  },
};
