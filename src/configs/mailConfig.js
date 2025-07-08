import * as aws from '../lib/aws-ses.js';
import * as mailjet from '../lib/mailjet.js';

/**
 *
 * mailData is an object containing email details to be sent:
 * @property {string} sender - The sender's email address (e.g., 'noreply@volunteerin.id')
 * @property {string[]} recipients - An array of recipient email addresses (e.g., ['user1@example.com', 'user2@example.com'])
 * @property {string} subject - The subject line of the email
 * @property {string} htmlContent - The main content of the email in HTML format
 */
export const sendEmail = async (mailData) => {
  const { APP_ENV } = process.env;

  try {
    if (APP_ENV === 'production') {
      await aws.sendEmailByAWSSES(mailData);
    } else {
      await mailjet.sendEmailByMailjet(mailData);
    }
  } catch (_error) {
    throw new Error(
      'Account was successfully created, but verification email failed to send. Please try again.',
    );
  }
};
