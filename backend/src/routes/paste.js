// // src/routes/pastes.js
// import express from "express";
// import Paste from "../models/Paste.js";
// import { nanoid } from "nanoid";
// import { getNow } from "../utils/time.js";

// const router = express.Router();

// // CREATE PASTE
// router.post("/", async (req, res) => {
//   const { content, ttl_seconds, max_views } = req.body;

//   if (!content || typeof content !== "string" || !content.trim()) {
//     return res.status(400).json({ error: "Invalid content" });
//   }

//   if (ttl_seconds && ttl_seconds < 1) {
//     return res.status(400).json({ error: "Invalid ttl_seconds" });
//   }

//   if (max_views && max_views < 1) {
//     return res.status(400).json({ error: "Invalid max_views" });
//   }

//   const now = getNow(req);
//   const expiresAt = ttl_seconds
//     ? new Date(now.getTime() + ttl_seconds * 1000)
//     : null;

//   const paste = await Paste.create({
//     content,
//     expiresAt,
//     maxViews: max_views ?? null
//   });

//   res.status(201).json({
//     id: paste._id.toString(),
//     url: `${req.protocol}://${req.get("host")}/p/${paste._id}`
//   });
// });


// // FETCH PASTE (counts as a view)
// router.get("/:id", async (req, res) => {
//   const now = getNow(req);

//   let paste;
//   try {
//     paste = await Paste.findById(req.params.id);
//   } catch {
//     return res.status(404).json({ error: "Not found" });
//   }

//   if (!paste) {
//     return res.status(404).json({ error: "Not found" });
//   }

//   // TTL check
//   if (paste.expiresAt && paste.expiresAt <= now) {
//     return res.status(404).json({ error: "Paste expired" });
//   }

//   // View limit check
//   if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
//     return res.status(404).json({ error: "View limit exceeded" });
//   }

//   // Increment view count
//   paste.viewCount += 1;
//   await paste.save();

//   res.status(200).json({
//     content: paste.content,
//     remaining_views:
//       paste.maxViews !== null
//         ? paste.maxViews - paste.viewCount
//         : null,
//     expires_at: paste.expiresAt
//   });
// });


// export default router;
import express from "express";
import Paste from "../models/Paste.js";
import { getNow } from "../utils/time.js";
import escapeHtml from "escape-html";

const router = express.Router();

/* =========================
   CREATE PASTE (POST)
========================= */
router.post("/", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const now = getNow(req);
  const expiresAt = ttl_seconds
    ? new Date(now.getTime() + ttl_seconds * 1000)
    : null;

  const paste = await Paste.create({
    content,
    expiresAt,
    maxViews: max_views ?? null
  });

  res.status(201).json({
    id: paste._id.toString(),
    url: `${req.protocol}://${req.get("host")}/p/${paste._id}`
  });
});

/* =========================
   FETCH PASTE (API)
========================= */
router.get("/:id", async (req, res) => {
  const now = getNow(req);

  let paste;
  try {
    paste = await Paste.findById(req.params.id);
  } catch {
    return res.status(404).json({ error: "Not found" });
  }

  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  if (paste.expiresAt && paste.expiresAt <= now) {
    return res.status(404).json({ error: "Paste expired" });
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  paste.viewCount += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views:
      paste.maxViews !== null
        ? paste.maxViews - paste.viewCount
        : null,
    expires_at: paste.expiresAt
  });
});

/* =========================
   VIEW PASTE (HTML)
========================= */
router.get("/view/:id", async (req, res) => {
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

  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});

export default router;
