import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("sig_audit.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    data TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/problems", (req, res) => {
    const rows = db.prepare("SELECT data FROM problems").all();
    res.json(rows.map((r: any) => JSON.parse(r.data)));
  });

  app.post("/api/problems", (req, res) => {
    const problem = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO problems (id, data) VALUES (?, ?)");
    stmt.run(problem.id, JSON.stringify(problem));
    res.json({ success: true });
  });

  app.get("/api/problems/:id", (req, res) => {
    const row = db.prepare("SELECT data FROM problems WHERE id = ?").get(req.params.id);
    if (row) {
      res.json(JSON.parse((row as any).data));
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
