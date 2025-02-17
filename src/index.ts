// Entry Point Backend -- Diawal dari sini backendnya
import bodyParser from "body-parser";
import express from "express";
import router from "./routes/api";
import db from "./utils/database";

async function init() {
    try {
        // Koneksi ke database
        const result = await db();
        console.log("Database status : ", result);

        // Inisialisasi express
        const app = express();

        // Membaca data JSON
        app.use(bodyParser.json());

        const PORT = 3000;

        // Middleware
        // Dengan pola /api akan mengarah ke router
        app.use("/api", router);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

init();
