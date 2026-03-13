const STORAGE_KEY = "inplay_news";

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);

  // Si no existe aún, empezamos vacío
  if (!raw) {
    const empty = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    return empty;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Si estaba corrupto, lo reseteamos
    const empty = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    return empty;
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((n) => n.id)) + 1;
}

export const newsService = {
  // Pública: solo publicadas
  getAll() {
    return load()
      .filter((n) => n.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Admin: todas
  getAllAdmin() {
    return load().sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getById(id) {
    return load().find((n) => n.id === id) || null;
  },

  create(news) {
    const items = load();

    const newItem = {
      id: getNextId(items),
      title: news.title?.trim() || "Sin título",
      excerpt: news.excerpt?.trim() || "",
      content: news.content?.trim() || "",
      date: new Date().toISOString(),
      published: news.published ?? true,
    };

    const next = [newItem, ...items]; 
    save(next);
    return newItem;
  },

  update(id, patch) {
    const items = load();
    const idx = items.findIndex((n) => n.id === id);
    if (idx === -1) return null;

    items[idx] = {
      ...items[idx],
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() : items[idx].title,
      excerpt: patch.excerpt !== undefined ? patch.excerpt.trim() : items[idx].excerpt,
      content: patch.content !== undefined ? patch.content.trim() : items[idx].content,
    };

    save(items);
    return items[idx];
  },

  remove(id) {
    const items = load();
    const next = items.filter((n) => n.id !== id);
    save(next);
    return next.length !== items.length;
  },
};