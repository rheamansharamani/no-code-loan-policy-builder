import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import aiRouter from "./routes/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "builder.html"));
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(port, () => {
    console.log(`Rule builder server listening on http://localhost:${port}`);
});
