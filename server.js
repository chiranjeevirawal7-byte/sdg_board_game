import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5173;

const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`JANMA running on port ${PORT}`);
    console.log(`Local:   http://localhost:${PORT}`);
});