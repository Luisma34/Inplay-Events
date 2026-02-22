

const STORAGE_KEY = "inplay_leagues";

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Genera id incremental simple
function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((x) => Number(x.id) || 0)) + 1;
}

function normalizeStatus(status) {
  const s = (status || "").trim();
  if (s === "Abierta" || s === "Activa" || s === "Próximamente") return s;
  return "Próximamente";
}

function normalizeLevel(level) {
  const l = (level || "").trim();
  return l || "General";
}

function normalizeStartDate(startDate) {
  const d = (startDate || "").trim();
  // dejamos string libre; si luego quieres validar formato YYYY-MM-DD lo hacemos
  return d;
}

function normalizeTeams(teams) {
  const n = Number(teams);
  if (Number.isFinite(n) && n >= 0) return Math.floor(n);
  return 0;
}

export const leagueService = {
  // Público: solo publicadas
  getAll() {
    return load()
      .filter((l) => l.published)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  },

  // Admin: todas
  getAllAdmin() {
    return load().sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  },

  getById(id) {
    const items = load();
    return items.find((l) => Number(l.id) === Number(id)) || null;
  },

  create(data) {
    const items = load();

    const newItem = {
      id: getNextId(items),
      name: data?.name?.trim() || "Sin nombre",
      description: data?.description?.trim() || "",
      level: normalizeLevel(data?.level),

      // Para tu UI
      status: normalizeStatus(data?.status), // Abierta | Activa | Próximamente
      teams: normalizeTeams(data?.teams),
      startDate: normalizeStartDate(data?.startDate),

      published: data?.published ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    save(items);
    return newItem;
  },

  update(id, patch) {
    const items = load();
    const idx = items.findIndex((l) => Number(l.id) === Number(id));
    if (idx === -1) return null;

    const current = items[idx];
    const next = {
      ...current,
      ...patch,

      name:
        patch?.name !== undefined ? String(patch.name).trim() : current.name,
      description:
        patch?.description !== undefined
          ? String(patch.description).trim()
          : current.description,
      level: patch?.level !== undefined ? normalizeLevel(patch.level) : current.level,

      status:
        patch?.status !== undefined ? normalizeStatus(patch.status) : current.status,
      teams:
        patch?.teams !== undefined ? normalizeTeams(patch.teams) : current.teams,
      startDate:
        patch?.startDate !== undefined
          ? normalizeStartDate(patch.startDate)
          : current.startDate,

      published:
        patch?.published !== undefined ? patch.published : current.published,

      updatedAt: new Date().toISOString(),
    };

    items[idx] = next;
    save(items);
    return next;
  },

  remove(id) {
    const items = load();
    const next = items.filter((l) => Number(l.id) !== Number(id));
    save(next);
    return next.length !== items.length;
  },

  // Helpers opcionales (por comodidad en Admin)
  publish(id) {
    return this.update(id, { published: true });
  },

  unpublish(id) {
    return this.update(id, { published: false });
  },
};