import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

export const sendEmail = async (sender, recipients, subject, htmlContent) => {
  try {
    const transport = nodemailer.createTransport(
      MailtrapTransport({
        token: process.env.MAIL_API_KEY,
        testInboxId: 3449461,
      }),
    );

    // const sender = {
    //   address: "diohevin@gmail.com",
    //   name: "Mailtrap Test",
    // };
    // const recipients = [
    //   "volunteerinbusiness@gmail.com",
    // ];

    await transport.sendMail({
      from: sender,
      to: recipients,
      subject,
      html: htmlContent,
      sandbox: true,
    });
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    throw new Error(
      'Akun berhasil dibuat, tetapi email verifikasi gagal dikirim. Silahkan coba lagi',
    );
  }
};
