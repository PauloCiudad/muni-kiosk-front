import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import consultasRoutes from "./routes/consultas.js";

// Función de Backend 2: Punto de entrada del servidor Express
// Configura middlewares: CORS, express.json con límite de 10mb (para base64)
// Monta las rutas de consultas bajo /api
// Inicia el servidor en el puerto definido en .env (o 4000 por defecto)
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // importante para base64 PDF

app.use("/api", consultasRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});