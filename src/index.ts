// Entry Point Backend -- Diawal dari sini backendnya
import bodyParser from "body-parser";
import express from "express";
import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";

async function init() {
    try {
        // Koneksi ke database
        const result = await db();
        console.log("Database status : ", result);

        // Inisialisasi express
        const app = express();

        // Cors
        app.use(cors());

        // Membaca data JSON
        app.use(bodyParser.json());

        const PORT = 3000;

        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Hello World",
                data: null
            })
        });

        // Middleware
        // Dengan pola /api akan mengarah ke router
        app.use("/api", router);
        docs(app);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

init();
