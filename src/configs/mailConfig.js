import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

export const sendEmail = async (sender, recipients, subject, htmlContent) => {
  const { APP_ENV, MAIL_API_KEY } = process.env;

  try {
    const transport = nodemailer.createTransport(
      APP_ENV === 'production' ? 
        MailtrapTransport({
          token: MAIL_API_KEY,
        })
      :
        MailtrapTransport({
          token: MAIL_API_KEY,
          testInboxId: 3449461,
        }),
    );

    await transport.sendMail({
      from: sender,
      to: recipients,
      subject,
      html: htmlContent,
      sandbox: APP_ENV === 'production' ? false : true,
    });
  } catch (error) {
    throw new Error(
      'Akun berhasil dibuat, tetapi email verifikasi gagal dikirim. Silahkan coba lagi',
    );
  }
};
