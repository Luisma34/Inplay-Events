
// Servicio de ligas para la V1 del proyecto.
// En esta versión NO hay backend conectado.
// Por eso usamos localStorage como si fuese una base de datos.
//
// La idea es que cuando conectemos el backend, este archivo se podrá rehacer
// para hacer fetch a la API, pero intentando mantener los mismos métodos
// (para no tener que reescribir todas las páginas).

const STORAGE_KEY = "inplay_ligas_v1";

// Datos iniciales (seed) para que al arrancar la app no esté todo vacío.
// Esto es solo para desarrollo.
// Si ya hay datos guardados en localStorage, el seed no se usa.
const seed = [
  {
    id: 1,
    name: "Liga InPlay - Iniciación",
    level: "Iniciación",
    status: "Abierta",
    teams: 12,
    startDate: "2026-03-01",
    description: "Ideal si estás empezando. Partidos guiados y buen ambiente.",
    published: true, // si es true se verá en la parte pública (/ligas)
    members: [], // en V1 guardamos aquí emails de usuarios inscritos
  },
  {
    id: 2,
    name: "Liga InPlay - Intermedio",
    level: "Intermedio",
    status: "Activa",
    teams: 16,
    startDate: "2026-02-01",
    description: "Competición equilibrada con jugadores de nivel medio.",
    published: true,
    members: [],
  },
  {
    id: 3,
    name: "Liga InPlay - Avanzado",
    level: "Avanzado",
    status: "Próximamente",
    teams: 10,
    startDate: "2026-04-10",
    description: "Para jugadores exigentes. Ritmo alto y partidos intensos.",
    published: true,
    members: [],
  },
  {
    id: 4,
    name: "Liga Mixta - Intermedio",
    level: "Intermedio",
    status: "Abierta",
    teams: 14,
    startDate: "2026-03-15",
    description: "Formato mixto. Compite y conoce gente del club.",
    published: true,
    members: [],
  },
];

// Lee el localStorage y devuelve un array con las ligas.
// Si no hay nada guardado todavía, crea el seed y lo devuelve.
// Si el JSON estuviese corrupto, lo reinicia al seed.
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

// Guarda en localStorage y lanza un evento para que otras pantallas refresquen.
// Esto nos evita tener que recargar la página manualmente.
function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  // Este evento lo escuchamos en Ligas.jsx para actualizar el listado.
  window.dispatchEvent(new Event("inplay:ligas-updated"));
}

// Generador simple de id incremental.
// En V1 nos vale, en backend seguramente el id vendrá generado en BD.
function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((l) => Number(l.id))) + 1;
}

export const leagueService = {
  // Devuelve SOLO ligas publicadas (para la vista pública /ligas).
  // Esto es importante: lo público no debe ver borradores.
  getAll() {
    return load()
      .filter((l) => (l.published ?? true) === true)
      .sort((a, b) => Number(a.id) - Number(b.id));
  },

  // Devuelve TODAS las ligas (para el panel admin).
  // Aquí el admin sí ve borradores.
  getAllAdmin() {
    return load().sort((a, b) => Number(a.id) - Number(b.id));
  },

  // Buscar una liga por id (lo usamos en /ligas/:id).
  getById(id) {
    const items = load();
    return items.find((l) => Number(l.id) === Number(id)) || null;
  },

  // Devuelve las ligas en las que está inscrito un usuario (por email).
  // Esto lo usaremos en "Mi Cuenta" para listar sus ligas.
  getByUserEmail(email) {
    if (!email) return [];

    return load().filter((l) => {
      const members = Array.isArray(l.members) ? l.members : [];
      return members.includes(email);
    });
  },

  // Inscribir a un usuario en una liga.
  // En V1 se hace guardando el email en el array "members".
  // En backend esto será una petición a la API: POST /ligas/:id/join (o similar).
  joinLeague({ leagueId, userEmail }) {
    const items = load();
    const idx = items.findIndex((l) => Number(l.id) === Number(leagueId));

    // si no existe la liga
    if (idx === -1) return { ok: false, reason: "NOT_FOUND" };

    const league = items[idx];

    // solo permitimos inscribirse si está abierta
    const status = league.status || "Próximamente";
    if (status !== "Abierta") return { ok: false, reason: "NOT_OPEN" };

    const members = Array.isArray(league.members) ? league.members : [];

    // evitar doble inscripción
    if (members.includes(userEmail)) {
      return { ok: false, reason: "ALREADY_JOINED" };
    }

    // guardamos la inscripción
    items[idx] = {
      ...league,
      members: [...members, userEmail],
    };

    save(items);
    return { ok: true };
  },

  // Crear liga (panel admin).
  // En backend esto será POST /ligas
  create(data) {
    const items = load();

    const newItem = {
      id: getNextId(items),
      name: (data.name || "").trim() || "Liga sin nombre",
      description: (data.description || "").trim(),
      level: data.level || "General",
      status: data.status || "Próximamente",
      teams: Number(data.teams) || 0,
      startDate: data.startDate || "",
      published: data.published ?? true, // si no viene, por defecto true
      members: [],
    };

    items.push(newItem);
    save(items);
    return newItem;
  },

  // Editar liga (panel admin).
  // En backend esto será PUT/PATCH /ligas/:id
  update(id, patch) {
    const items = load();
    const idx = items.findIndex((l) => Number(l.id) === Number(id));
    if (idx === -1) return null;

    const current = items[idx];

    // hacemos un merge controlado para no romper campos
    const updated = {
      ...current,
      ...patch,
      name:
        patch.name !== undefined
          ? patch.name.trim()
          : current.name,
      description:
        patch.description !== undefined
          ? patch.description.trim()
          : current.description,
      teams:
        patch.teams !== undefined
          ? Number(patch.teams) || 0
          : current.teams,
      published:
        patch.published !== undefined
          ? Boolean(patch.published)
          : (current.published ?? true),
    };

    items[idx] = updated;
    save(items);
    return updated;
  },

  // Eliminar liga (panel admin).
  // En backend esto será DELETE /ligas/:id
  remove(id) {
    const items = load();
    const next = items.filter((l) => Number(l.id) !== Number(id));
    save(next);
    return next.length !== items.length;
  },
};