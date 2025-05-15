import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
import mailjet from 'node-mailjet';
// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const sendEmail = async (recipients, subject, htmlContent) => {
  const { APP_ENV, MAIL_API_KEY, MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
  const sender = 'noreply@volunteerin.id';

  try {
    if (APP_ENV === 'production') {
      // const ses = new SESClient({
      //   region: AWS_SES_REGION,
      //   credentials: {
      //     accessKeyId: AWS_ACCESS_KEY,
      //     secretAccessKey: AWS_SECRET_ACCESS_KEY
      //   }
      // });

      // const command = new SendEmailCommand({
      //   Source: `"Volunteerin" <${sender}>`,
      //   Destination: {
      //     ToAddresses: recipients,
      //   },
      //   Message: {
      //     Subject: {
      //       Data: subject,
      //     },
      //     Body: {
      //       Html: {
      //         Data: htmlContent,
      //       },
      //     },
      //   },
      // });

      // await ses.send(command);

      const mj = mailjet.apiConnect(
        MJ_APIKEY_PUBLIC,
        MJ_APIKEY_PRIVATE
      );

      await mj.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: sender,
              Name: 'Volunteerin',
            },
            To: [
              {
                Email: recipients,
              },
            ],
            Subject: subject,
            HTMLPart: htmlContent,
          },
        ],
      });

    } else {
      const transport = nodemailer.createTransport(
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
    }
  } catch (error) {
    console.log(error);
    throw new Error(
      'Akun berhasil dibuat, tetapi email verifikasi gagal dikirim. Silahkan coba lagi',
    );
  }
};
