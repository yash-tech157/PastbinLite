import { useState } from "react";

function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const submitPaste = async () => {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const body = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (views) body.max_views = Number(views);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setViews("");
    } catch {
      setError("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Pastebin Lite</h1>

        <textarea
          className="w-full p-3 rounded bg-slate-900 border border-slate-700 mb-3"
          rows="6"
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-3 mb-3">
          <input
            type="number"
            placeholder="TTL (seconds)"
            className="w-1/2 p-2 rounded bg-slate-900 border border-slate-700"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max views"
            className="w-1/2 p-2 rounded bg-slate-900 border border-slate-700"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
        </div>

        <button
          onClick={submitPaste}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          Create Paste
        </button>

        {error && <p className="text-red-400 mt-3">{error}</p>}

        {resultUrl && (
          <div className="mt-4 bg-slate-900 p-3 rounded">
            <p className="text-green-400 mb-1">Paste created!</p>
            <a
              href={resultUrl}
              target="_blank"
              className="text-blue-400 underline break-all"
            >
              {resultUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
