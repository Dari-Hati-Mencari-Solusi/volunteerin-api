import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;

const mailjetConfig = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false,
  auth: {
    user: MJ_APIKEY_PUBLIC,
    pass: MJ_APIKEY_PRIVATE,
  },
});

export const sendEmailByMailjet = async ({
  sender,
  recipients,
  subject,
  htmlContent,
}) => {
  await mailjetConfig.sendMail({
    from: sender,
    to: recipients,
    subject,
    html: htmlContent,
  });
};
