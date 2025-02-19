import dotenv from 'dotenv'

dotenv.config()

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET: string = process.env.SECRET || "";
export const EMAIL_SMPT_SECURE: boolean = Boolean(process.env.EMAIL_SMPT_SECURE) || false;
export const EMAIL_SMPT_HOST: string = process.env.EMAIL_SMPT_HOST || "";
export const EMAIL_SMPT_PORT: number = Number(process.env.EMAIL_SMPT_PORT) || 465;
export const EMAIL_SMPT_PASS: string = process.env.EMAIL_SMPT_PASS || "";
export const EMAIL_SMPT_USER: string = process.env.EMAIL_SMPT_USER || "";
export const EMAIL_SMPT_SERVICE: string = process.env.EMAIL_SMPT_SERVICE || "";
export const CLIENT_HOST: string = process.env.CLIENT_HOST || "http://localhost:3001"