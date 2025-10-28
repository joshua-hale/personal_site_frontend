import { useEffect, useMemo, useState } from "react";
import { PostsAPI, slugify } from "../api/posts";

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  heroImage: "",
};

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("idle"); // idle | creating | editing
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [q, setQ] = useState("");

  // Load posts on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await PostsAPI.list();
        setPosts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Search filtering
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(needle) ||
        p.slug?.toLowerCase().includes(needle)
    );
  }, [posts, q]);

  // --- CRUD actions ---
  function startCreate() {
    setMode("creating");
    setSelectedId(null);
    setForm({ ...emptyForm });
    setError("");
  }

  async function startEdit(id) {
    setMode("editing");
    setSelectedId(id);
    setError("");
    try {
      const p = await PostsAPI.get(id);
      setForm({
        title: p.title ?? "",
        slug: p.slug ?? "",
        content: p.content ?? "",
        heroImage: p.heroImage ?? "",
      });
    } catch (e) {
      setError(e.message);
    }
  }

  async function onSave() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug || slugify(form.title)).trim(),
        content: form.content || "",
        heroImage: form.heroImage || null,
      };
      if (!payload.title) throw new Error("Title is required");
      if (!payload.slug) throw new Error("Slug is required");

      if (mode === "creating") {
        const created = await PostsAPI.create(payload);
        setPosts((xs) => [created, ...xs]);
        setMode("editing");
        setSelectedId(created.id);
      } else if (mode === "editing" && selectedId != null) {
        const updated = await PostsAPI.update(selectedId, payload);
        setPosts((xs) => xs.map((p) => (p.id === updated.id ? updated : p)));
      }
    } catch (e) {
      if (e.status === 409)
        setError("That slug is already in use. Try a different one.");
      else setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    const post = posts.find((p) => p.id === id);
    if (!confirm(`Delete "${post?.title || "this post"}"?`)) return;
    try {
      await PostsAPI.delete(id);
      setPosts((xs) => xs.filter((p) => p.id !== id));
      if (selectedId === id) {
        setMode("idle");
        setSelectedId(null);
        setForm({ ...emptyForm });
      }
    } catch (e) {
      setError(e.message);
    }
  }

  function onCancel() {
    setMode("idle");
    setSelectedId(null);
    setForm({ ...emptyForm });
    setError("");
  }

  function onTitleChange(val) {
    setForm((f) => {
      const shouldAuto = f.slug.trim() === "" || mode === "creating";
      return { ...f, title: val, slug: shouldAuto ? slugify(val) : f.slug };
    });
  }

  // --- UI ---
  return (
    <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: posts list */}
      <div>
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Posts</h2>
          <button
            onClick={startCreate}
            className="px-3 h-10 rounded-xl bg-accent text-bg hover:bg-accent-hover"
          >
            New Post
          </button>
        </header>

        <div className="mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or slug…"
            className="w-full bg-transparent border-b border-border focus:border-accent focus:outline-none py-2"
          />
        </div>

        {loading ? (
          <p className="text-text-muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-text-muted">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-text-muted truncate">
                    {p.slug} • updated{" "}
                    {new Date(p.updatedAt || p.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(p.id)}
                    className="px-2 h-9 rounded-lg border border-border hover:border-accent"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-2 h-9 rounded-lg border border-border hover:border-accent/70"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT: editor */}
      <div>
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {mode === "creating"
              ? "Create Post"
              : mode === "editing"
              ? "Edit Post"
              : "Editor"}
          </h2>
          {mode !== "idle" && (
            <button onClick={onCancel} className="text-text-muted hover:text-text">
              Cancel
            </button>
          )}
        </header>

        {error && (
          <p className="mb-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {mode === "idle" ? (
          <p className="text-text-muted">Select a post or click “New Post”.</p>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
          >
            <div>
              <label className="block text-sm text-text-muted mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full bg-transparent border-b border-border focus:border-accent focus:outline-none py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className="w-full bg-transparent border-b border-border focus:border-accent focus:outline-none py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">
                Hero Image (optional)
              </label>
              <input
                value={form.heroImage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, heroImage: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
                className="w-full bg-transparent border-b border-border focus:border-accent focus:outline-none py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={10}
                className="w-full bg-transparent border-b border-border focus:border-accent focus:outline-none py-2"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 h-11 rounded-xl bg-accent text-bg hover:bg-accent-hover disabled:opacity-60"
              >
                {saving
                  ? mode === "creating"
                    ? "Creating…"
                    : "Saving…"
                  : mode === "creating"
                  ? "Create"
                  : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
