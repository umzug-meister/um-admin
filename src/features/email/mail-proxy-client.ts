import { MailProxyUrls } from '../../api/Urls';
import { appRequest } from '../../api/fetch-client';

type EmailData = {
  type: 'offer' | 'rejection' | 'invoice';
  to: string;
  subject: string;
  variables: {
    /**
     * html text
     */
    content: string;
  };
  attachments?: {
    filename: string;
    content: string;
  }[];
};

const HEADERS = {
  'x-api-key': import.meta.env.VITE_MAIL_PROXY_API_KEY,
};

const URL = MailProxyUrls.sendMail;

export function sendMail(data: EmailData) {
  return appRequest('POST')(URL, data, HEADERS);
}
