import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

import {
    EMAIL_SMPT_HOST,
    EMAIL_SMPT_PASS,
    EMAIL_SMPT_PORT,
    EMAIL_SMPT_SECURE,
    EMAIL_SMPT_SERVICE,
    EMAIL_SMPT_USER

} from "../env"

// Menyimpan konfigurasi NodeMailer
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    service: "Zoho",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_SMPT_USER,
        pass: EMAIL_SMPT_PASS
    },
    requireTLS: true
});

interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const sendMail = async ({
    ...mailParams
}: ISendMail) => {
    const result = await transporter.sendMail({
        ...mailParams
    })
    return result;
};

export const renderMailHtml = async (template: string, data: any): Promise<string> => {
     const content = await ejs.renderFile(path.join(__dirname, `templates/${template}`),data);
    return content as string;
};

