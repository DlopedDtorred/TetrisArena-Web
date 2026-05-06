import { Router } from "express";
import crypto from "crypto";

const router = Router();

const ADMIN_PASSWORD_HASH = crypto
  .createHash("sha256")
  .update("admin123")
  .digest("hex");

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };

  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  const inputHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (inputHash !== ADMIN_PASSWORD_HASH) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  res.json({ success: true, token: "admin-session-ok" });
});

export default router;
