import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async (options: EmailOptions) => {
    // Create the transporter using your email service configuration
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // We used Gmail as the email service, but you can use any other (e.g., Outlook, Yahoo) by changing this value and providing the appropriate configuration.
        auth: {
            user: process.env.EMAIL_USER, // Your email o app email
            pass: process.env.EMAIL_PASS, // Your app password
        },
    });

    // Define the options for the email
    const mailOptions = {
        from: '"StockMaster Admin" <no-reply@stockmaster.com>',
        to: options.email,
        subject: options.subject,
        html: options.message, // We used HTML to allow for better formatting of the email content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};