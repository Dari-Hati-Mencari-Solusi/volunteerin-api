import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import dotenv from 'dotenv';

dotenv.config();
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_SES_REGION } = process.env;

const AWSSESClientConfig = new SESClient({
  region: AWS_SES_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const sendEmailByAWSSES = async ({
  sender,
  recipients,
  subject,
  htmlContent,
}) => {
  const command = new SendEmailCommand({
    Source: sender,
    Destination: { ToAddresses: recipients },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: htmlContent } },
    },
  });

  await AWSSESClientConfig.send(command);
};
