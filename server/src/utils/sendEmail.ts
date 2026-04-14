import { Resend } from 'resend';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

// Function to send an email using Resend API
export const sendEmail = async (options: EmailOptions) => {
    const resend = new Resend(process.env.RESEND_API_KEY); 

    const { data, error } = await resend.emails.send({
        from: 'StockMaster <onboarding@resend.dev>', 
        to: options.email,
        subject: options.subject,
        html: options.message,
    });

    if (error) {
        throw new Error(error.message);
    }
    
    return data;
};