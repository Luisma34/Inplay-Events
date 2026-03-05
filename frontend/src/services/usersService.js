// frontend/src/services/usersService.js
const STORAGE_KEY = "inplay_users_v1";

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("inplay:users-updated"));
}

function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((u) => u.id)) + 1;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export const usersService = {
  // Lista completa (admin)
  getAll() {
    return load().sort((a, b) => (a.email || "").localeCompare(b.email || ""));
  },

  getById(id) {
    return load().find((u) => u.id === id) || null;
  },

  getByEmail(email) {
    const em = normalizeEmail(email);
    return load().find((u) => normalizeEmail(u.email) === em) || null;
  },

  create(user) {
    const items = load();
    const email = normalizeEmail(user.email);

    if (!email) throw new Error("Email obligatorio");
    if (items.some((u) => normalizeEmail(u.email) === email)) {
      throw new Error("Ese email ya existe");
    }

    const newUser = {
      id: getNextId(items),
      name: (user.name || "").trim() || "Usuario",
      email,
      role: user.role || "USER", // USER | PROFESOR | ADMIN
      active: user.active ?? true,
      createdAt: new Date().toISOString(),
    };

    items.push(newUser);
    save(items);
    return newUser;
  },

  update(id, patch) {
    const items = load();
    const idx = items.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const next = { ...items[idx], ...patch };

    // si cambia email, validar duplicados
    if (patch.email !== undefined) {
      const email = normalizeEmail(patch.email);
      if (!email) throw new Error("Email obligatorio");
      const duplicated = items.some(
        (u) => u.id !== id && normalizeEmail(u.email) === email
      );
      if (duplicated) throw new Error("Ese email ya existe");
      next.email = email;
    }

    if (patch.name !== undefined) next.name = (patch.name || "").trim() || "Usuario";

    items[idx] = next;
    save(items);
    return next;
  },

  setRole(id, role) {
    return this.update(id, { role });
  },

  setActive(id, active) {
    return this.update(id, { active: !!active });
  },

  remove(id) {
    const items = load();
    const next = items.filter((u) => u.id !== id);
    save(next);
    return next.length !== items.length;
  },
};