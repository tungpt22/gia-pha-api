import { Injectable } from '@nestjs/common';
const brevo = require('@getbrevo/brevo');

@Injectable()
export class SendEmailService {

    async sendPasswordResetEmail(toEmail: string, resetLink: string) {

        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(0, process.env.BREVO_API_KEY);
        const sender = { email: process.env.BREVO_SENDER_EMAIL, name: process.env.BREVO_SENDER_NAME }; // Set from email and name
        const receiver = [{ email: toEmail }];
        const subject = 'Reset Your Password';
        const htmlContent = `
      <p>Hello! <br /> <br /> You are receiving this email because we received a password reset request for your account.</p>
      <a href="${resetLink}">Reset Password</a>
      <br />
      This password reset link will expire in 60 minutes.
If you did not request a password resent, no further action is required.
        <br />
        Regards, <br /> Cow Play Cow Moo Malaysia <br />
        If you’re having trouble clicking the “Reset Password” button, copy and paste the URL below into your web browser:
${resetLink}
    `;
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = receiver;
        try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
        } catch (error) {
            throw new Error('Failed to send email: ' + error.message);
        }
    }
}