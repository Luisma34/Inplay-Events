const API_URL = "http://localhost:8080/api";

export const clasesService = {
  // Catálogo de clases
  async getClases() {
    const res = await fetch(`${API_URL}/clases`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando clases");
    }

    return res.json();
  },

  // Pistas disponibles
  async getPistas() {
    const res = await fetch(`${API_URL}/pistas`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando pistas");
    }

    return res.json();
  },

  // Horas libres para una pista y una fecha
  async getDisponibilidad({ pistaId, fecha }) {
    const params = new URLSearchParams({
      pistaId: String(pistaId),
      fecha,
    });

    const res = await fetch(`${API_URL}/sesiones/disponibilidad?${params}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando disponibilidad");
    }

    return res.json();
  },

  // Crear sesión = reservar clase
  async createSesion({ claseId, pistaId, usuarioId, fecha, horaInicio, horaFin }) {
    const res = await fetch(`${API_URL}/sesiones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        clase: { id: claseId },
        pista: { id: pistaId },
        usuario: { id: usuarioId },
        fecha,
        horaInicio,
        horaFin,
        activa: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error creando sesión");
    }

    return res.json();
  },

  // Mis clases
  async getMisSesiones() {
    const res = await fetch(`${API_URL}/sesiones/mis-sesiones`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando mis clases");
    }

    return res.json();
  },

  // Cancelar clase
  async cancelSesion(id) {
    const res = await fetch(`${API_URL}/sesiones/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cancelando clase");
    }

    return true;
  },
};
