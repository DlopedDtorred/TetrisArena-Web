import { Router } from "express";
import multer from "multer";
import path from "path";
import { mkdirSync } from "fs";
import db from "../db/sqlite.js";

const router = Router();

const bannersDir = path.resolve(__dirname, "../public/banners");
mkdirSync(bannersDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, bannersDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `banner-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/competitions", (_req, res) => {
  const competitions = db
    .prepare("SELECT * FROM competitions ORDER BY created_at DESC")
    .all();
  res.json(competitions);
});

router.post("/competitions", upload.single("banner"), (req, res) => {
  const { name, description, rules, start_date, end_date } = req.body as {
    name?: string;
    description?: string;
    rules?: string;
    start_date?: string;
    end_date?: string;
  };

  if (!name || !start_date || !end_date) {
    res
      .status(400)
      .json({ error: "name, start_date and end_date are required" });
    return;
  }

  const bannerPath = req.file ? `/banners/${req.file.filename}` : null;

  const result = db
    .prepare(
      `INSERT INTO competitions (name, description, rules, start_date, end_date, banner)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(name, description ?? null, rules ?? null, start_date, end_date, bannerPath) as {
    lastInsertRowid: number;
  };

  const competition = db
    .prepare("SELECT * FROM competitions WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(competition);
});

export default router;
