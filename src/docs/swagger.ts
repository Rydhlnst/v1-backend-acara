import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Acara API Documentation",
        description: "Acara API Documentation",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Development server",
        },
        {
            url: "https://v1-backend-acara.vercel.app/api",
            description: "Production Server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            }
        },
        schemas: {
            LoginRequest: {
                identifier: "rydhlnst",
                password: "12341234",
            }
        }
    }
}

const OutputFile = "./swagger_output.json";
const endPointFiles = ["../routes/api.ts"]

swaggerAutogen({openapi: "3.0.0", })(OutputFile, endPointFiles, doc);