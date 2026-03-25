const API_URL = "http://localhost:8080/api/sesiones";

export const sesionesService = {
  // Crear una nueva sesión
  async create(data) {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Si falla, intentamos leer el mensaje real del backend
    if (!response.ok) {
      let errorMsg = "No se pudo crear la sesión";

      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {
        try {
          errorMsg = await response.text();
        } catch {
          // dejamos el mensaje genérico
        }
      }

      throw new Error(errorMsg);
    }

    return response.json();
  },
};