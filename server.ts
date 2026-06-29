import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defaultCMSState } from "./src/cms/defaultContent";
import { CMSState, SiteContent } from "./src/cms/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 8787);

const dataDir = path.resolve(__dirname, "data");
const uploadsDir = path.resolve(dataDir, "uploads");
const storePath = path.resolve(dataDir, "cms-store.json");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.json({ limit: "20mb" }));
app.use("/uploads", express.static(uploadsDir));

function writeStore(state: CMSState) {
  fs.writeFileSync(storePath, JSON.stringify(state, null, 2), "utf8");
}

function readStore(): CMSState {
  if (!fs.existsSync(storePath)) {
    writeStore(defaultCMSState);
    return structuredClone(defaultCMSState);
  }

  const raw = fs.readFileSync(storePath, "utf8");
  const parsed = JSON.parse(raw) as CMSState;

  if (!parsed.draft || !parsed.published || !Array.isArray(parsed.versions)) {
    writeStore(defaultCMSState);
    return structuredClone(defaultCMSState);
  }

  return parsed;
}

function persistDraft(state: CMSState, draft: SiteContent): CMSState {
  const next: CMSState = {
    ...state,
    draft,
    updatedAt: new Date().toISOString(),
  };
  writeStore(next);
  return next;
}

app.get("/api/cms", (_req, res) => {
  res.json(readStore());
});

app.patch("/api/cms/draft", (req, res) => {
  const incoming = req.body?.draft as SiteContent | undefined;
  if (!incoming) {
    res.status(400).send("Missing draft payload.");
    return;
  }
  const state = readStore();
  const next = persistDraft(state, incoming);
  res.json(next);
});

app.post("/api/cms/publish", (req, res) => {
  const label = String(req.body?.label || "Published from editor");
  const state = readStore();
  const version = {
    id: `ver-${Date.now()}`,
    createdAt: new Date().toISOString(),
    label,
    content: structuredClone(state.draft),
  };

  const next: CMSState = {
    ...state,
    published: structuredClone(state.draft),
    versions: [version, ...state.versions].slice(0, 50),
    updatedAt: new Date().toISOString(),
  };
  writeStore(next);
  res.json(next);
});

app.post("/api/cms/restore-version", (req, res) => {
  const versionId = String(req.body?.versionId || "");
  const state = readStore();
  const version = state.versions.find((item) => item.id === versionId);
  if (!version) {
    res.status(404).send("Version not found.");
    return;
  }
  const next = persistDraft(state, structuredClone(version.content));
  res.json(next);
});

app.post("/api/cms/reset-section", (req, res) => {
  const pageId = String(req.body?.pageId || "");
  const sectionId = String(req.body?.sectionId || "");
  if (!pageId || !sectionId) {
    res.status(400).send("Missing pageId or sectionId.");
    return;
  }

  const state = readStore();
  const sourcePage = state.published.pages.find((page) => page.id === pageId);
  const sourceSection = sourcePage?.sections.find((section) => section.id === sectionId);

  if (!sourceSection) {
    res.status(404).send("Section not found in published version.");
    return;
  }

  const draft = structuredClone(state.draft);
  const targetPage = draft.pages.find((page) => page.id === pageId);
  if (!targetPage) {
    res.status(404).send("Page not found in draft.");
    return;
  }

  targetPage.sections = targetPage.sections.map((section) =>
    section.id === sectionId ? structuredClone(sourceSection) : section,
  );

  const next = persistDraft(state, draft);
  res.json(next);
});

app.post("/api/media/upload", (req, res) => {
  const name = String(req.body?.name || "file");
  const mimeType = String(req.body?.mimeType || "application/octet-stream");
  const dataUrl = String(req.body?.dataUrl || "");
  if (!dataUrl.startsWith("data:")) {
    res.status(400).send("Invalid data URL.");
    return;
  }

  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) {
    res.status(400).send("Invalid encoded file.");
    return;
  }

  const extFromMime = mimeType.split("/")[1] || "bin";
  const safeName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fileName = safeName.includes(".") ? safeName : `${safeName}.${extFromMime}`;
  const outputPath = path.resolve(uploadsDir, fileName);

  fs.writeFileSync(outputPath, Buffer.from(match[2], "base64"));

  const type = mimeType.startsWith("image/")
    ? (name.toLowerCase().includes("logo") ? "logo" : "image")
    : mimeType === "application/pdf"
    ? "pdf"
    : mimeType.startsWith("video/")
    ? "video"
    : "image";

  const state = readStore();
  state.draft.mediaLibrary.unshift({
    id: `media-${Date.now()}`,
    name,
    type,
    url: `/uploads/${fileName}`,
    uploadedAt: new Date().toISOString(),
  });
  state.updatedAt = new Date().toISOString();
  writeStore(state);

  res.json({ url: `/uploads/${fileName}`, type, name });
});

if (process.env.NODE_ENV === "production") {
  const distDir = path.resolve(__dirname, "dist");
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distDir, "index.html"));
  });
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`CMS API listening on http://localhost:${port}`);
});
