import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import consultasRoutes from "./routes/consultas.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // importante para base64 PDF

app.use("/api", consultasRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});