import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;
const APPID = process.env.APPID || "default-app-id";

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from the Express backend!", appId: APPID });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    name: "dummy-backend",
    version: "1.0.0",
    node: process.version,
    appId: APPID,
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
