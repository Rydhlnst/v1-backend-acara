import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from "./swagger_output.json";
import fs from "fs"; // Import file system module
import path from "path"; // Import path module

// Read the css file
const css = fs.readFileSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), "utf8");

export default function docs(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput, {
        customCss: css,
    }));
}