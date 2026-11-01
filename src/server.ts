import express from "express";
import errorHandler from "./middlewares/errorHandler";
import zoneRoutes from "./routes/zoneRoutes";
import speciesRoutes from "./routes/speciesRoutes";
import observationRoutes from "./routes/observationRoutes";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Réserve Naturelle API" });
});

app.use("/api/zones", zoneRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/observations", observationRoutes);

app.use(errorHandler);

export default app;
