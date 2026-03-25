const RESERVAS_KEY = "inplay_reservas_v1";
const BLOCKS_KEY = "inplay_reservas_blocks_v1";

function load(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
  // avisar a otras páginas (MiCuenta, etc.)
  window.dispatchEvent(new Event("inplay:reservas-updated"));
}

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((x) => Number(x.id) || 0)) + 1;
}

// Genera una clave única por slot
export function slotKey({ date, time, court }) {
  return `${date}__${time}__${court}`;
}

export const reservasService = {
  // ===== Reservas =====
  getAll() {
    return load(RESERVAS_KEY).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  getByUser(email) {
    return this.getAll().filter((r) => r.userEmail === email);
  },

  isReserved({ date, time, court }) {
    const items = load(RESERVAS_KEY);
    const key = slotKey({ date, time, court });
    return items.some((r) => r.slotKey === key && r.status !== "Cancelada");
  },

  create({ date, time, court, userEmail, userName }) {
    const items = load(RESERVAS_KEY);

    const key = slotKey({ date, time, court });

    // no permitir si está bloqueado o reservado
    if (this.isBlocked({ date, time, court })) {
      return { ok: false, error: "Este horario está bloqueado por el club." };
    }
    if (items.some((r) => r.slotKey === key && r.status !== "Cancelada")) {
      return { ok: false, error: "Este horario ya está reservado." };
    }

    const newItem = {
      id: nextId(items),
      slotKey: key,
      date,
      time,
      court,
      userEmail,
      userName,
      status: "Confirmada",
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    save(RESERVAS_KEY, items);

    return { ok: true, data: newItem };
  },

  cancel(id) {
    const items = load(RESERVAS_KEY);
    const idx = items.findIndex((r) => Number(r.id) === Number(id));
    if (idx === -1) return false;

    items[idx] = { ...items[idx], status: "Cancelada", cancelledAt: new Date().toISOString() };
    save(RESERVAS_KEY, items);
    return true;
  },

  // ===== Bloqueos (Admin) =====
  getBlocks() {
    return load(BLOCKS_KEY);
  },

  isBlocked({ date, time, court }) {
    const blocks = load(BLOCKS_KEY);
    const key = slotKey({ date, time, court });
    return blocks.some((b) => b.slotKey === key);
  },

  block({ date, time, court, reason = "" }) {
    const blocks = load(BLOCKS_KEY);
    const key = slotKey({ date, time, court });

    if (blocks.some((b) => b.slotKey === key)) return false;

    blocks.push({
      id: nextId(blocks),
      slotKey: key,
      date,
      time,
      court,
      reason,
      createdAt: new Date().toISOString(),
    });

    save(BLOCKS_KEY, blocks);
    return true;
  },

  unblock(blockId) {
    const blocks = load(BLOCKS_KEY);
    const next = blocks.filter((b) => Number(b.id) !== Number(blockId));
    save(BLOCKS_KEY, next);
    return next.length !== blocks.length;
  },
};