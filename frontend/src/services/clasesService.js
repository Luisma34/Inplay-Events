
// Servicio encargado de gestionar las reservas de clases.
// En esta V1 trabaja con localStorage.
// En V2 se sustituirá por llamadas a la API del backend.

const STORAGE_KEY = "inplay_clases_v1";

// Carga las reservas desde localStorage
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Guarda la lista completa en localStorage
// Además dispara un evento para que otras páginas se actualicen.
function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("inplay:clases-updated"));
}

// Generador de id incremental simple
function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((x) => x.id)) + 1;
}

export const clasesService = {
  // Devuelve todas las reservas ordenadas por fecha de creación
  getAll() {
    return load().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  // Devuelve solo reservas activas (no canceladas)
  // Se usa para comprobar disponibilidad
  getActive() {
    return load().filter((r) => r.status !== "Cancelada");
  },

  // Comprueba si una franja ya está ocupada
  // En clase individual solo puede haber una reserva por hora
  isTaken({ date, time }) {
    const active = this.getActive();
    return active.some((r) => r.date === date && r.time === time);
  },

  // Crea una nueva reserva
  create({ userEmail, userName, date, time, note }) {
    const items = load();

    const newItem = {
      id: getNextId(items),
      userEmail,
      userName,
      date,
      time,
      note: note?.trim() || "",
      status: "Confirmada",
      createdAt: new Date().toISOString(),
    };

    items.unshift(newItem);
    save(items);

    return newItem;
  },

  // Cancela una reserva (no la elimina, solo cambia estado)
  cancel(id) {
    const items = load();
    const idx = items.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    items[idx] = { ...items[idx], status: "Cancelada" };
    save(items);

    return items[idx];
  },

  // Elimina definitivamente una reserva
  remove(id) {
    const items = load();
    const next = items.filter((r) => r.id !== id);
    save(next);

    return next.length !== items.length;
  },
};