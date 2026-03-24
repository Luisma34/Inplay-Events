const API_URL = "http://localhost:8080/api/clases";

export const clasesService = {
  async getAll() {
    const response = await fetch(API_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar las clases");
    }

    return response.json();
  },

  async create(data) {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la clase");
    }

    return response.json();
  },

  async update(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar la clase");
    }

    return response.json();
  },

  async remove(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar la clase");
    }
  },
};