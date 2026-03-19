const API_URL = "http://localhost:8080/api/noticias";

export const newsService = {
  // Cargamos las noticias visibles para la parte pública
  async getAll() {
    const res = await fetch(API_URL, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando noticias");
    }

    return res.json();
  },

  // De momento en admin usamos el mismo endpoint
  // Si luego queréis ver también las no visibles, hará falta otro endpoint en backend
  async getAllAdmin() {
    const res = await fetch(API_URL, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando noticias");
    }

    return res.json();
  },

  // Obtener una noticia concreta por id
  async getById(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error cargando noticia");
    }

    return res.json();
  },

  // Crear una noticia nueva
  async create({ title, content, published, userId }) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        titulo: title,
        contenido: content,
        visible: published,
        usuario: { id: userId },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error creando noticia");
    }

    return res.json();
  },

  // Actualizar una noticia existente
  async update(id, { title, content, published, userId }) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        titulo: title,
        contenido: content,
        visible: published,
        usuario: userId ? { id: userId } : null,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error actualizando noticia");
    }

    return res.json();
  },

  // Eliminar una noticia
  async remove(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error eliminando noticia");
    }

    return true;
  },
};
