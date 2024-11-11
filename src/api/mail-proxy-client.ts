import { MailProxyUrls } from './Urls';
import { appRequest } from './fetch-client';

type OfferEmailData = {
  to: string;
  subject: string;
  templateName: string;
  variables: {
    date: string;
    /**
     * html text
     */
    content: string;
  };
};

const HEADERS = {
  'x-api-key': import.meta.env.VITE_MAIL_PROXY_API_KEY,
};

const URL = MailProxyUrls.sendMail;

export function sendOffer(data: OfferEmailData) {
  return appRequest('post')(URL, data, HEADERS);
}
