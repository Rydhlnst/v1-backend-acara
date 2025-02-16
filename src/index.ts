// Entry Point Backend -- Diawal dari sini backendnya

import express from "express";
import router from "./routes/api"

const app = express();
const PORT = 3000;

// Middleware
// Dengan pola /api akan mengarah ke router
app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})