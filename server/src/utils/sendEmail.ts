import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Es más fiable definir el host directamente
        port: 465,             // Puerto para conexión segura SSL
        secure: true,          // true para puerto 465
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        // En Gmail, el 'from' debe ser preferiblemente tu mismo correo de EMAIL_USER
        from: `"StockMaster Admin" <${process.env.EMAIL_USER}>`, 
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};