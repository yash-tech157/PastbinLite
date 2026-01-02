import express from "express";
import Paste from "../models/Paste.js";
import { getNow } from "../utils/time.js";
import escapeHtml from "escape-html";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const now = getNow(req);

  let paste;
  try {
    paste = await Paste.findById(req.params.id);
  } catch {
    return res.status(404).send("Not Found");
  }

  if (!paste) return res.status(404).send("Not Found");

  if (paste.expiresAt && paste.expiresAt <= now) {
    return res.status(404).send("Not Found");
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return res.status(404).send("Not Found");
  }

  paste.viewCount += 1;
  await paste.save();

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Paste</title>
        <style>
          body {
            font-family: monospace;
            padding: 20px;
            background: #0f172a;
            color: #e5e7eb;
          }
          pre {
            white-space: pre-wrap;
            word-break: break-word;
          }
        </style>
      </head>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});

export default router;
