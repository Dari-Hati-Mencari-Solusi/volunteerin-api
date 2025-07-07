import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();

const { MAIL_API_KEY } = process.env;
const mailtrapConfig = MailtrapTransport({
  token: MAIL_API_KEY,
  testInboxId: 3449461,
});

export const sendEmailByMailtrap = async ({
  sender,
  recipients,
  subject,
  htmlContent,
}) => {
  const transport = nodemailer.createTransport(mailtrapConfig);
  await transport.sendMail({
    from: sender,
    to: recipients,
    subject,
    html: htmlContent,
    sandbox: true,
  });
};
