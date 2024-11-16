import { MailProxyUrls } from '../../api/Urls';
import { appRequest } from '../../api/fetch-client';

type RejectionEmailData = {
  to: string;
  subject: string;
  type: 'rejection';
  attachment: {
    filename: string;
    content: string;
  };
  variables: {
    /**
     * html text
     */
    content: string;
  };
};

type OfferEmailData = {
  to: string;
  subject: string;
  type: 'offer' | 'rejection' | 'invoice';
  attachment: {
    filename: string;
    content: string;
  };
  variables: {
    /**
     * html text
     */
    content: string;
  };
};

type MailData = OfferEmailData | RejectionEmailData;

const HEADERS = {
  'x-api-key': import.meta.env.VITE_MAIL_PROXY_API_KEY,
};

const URL = MailProxyUrls.sendMail;

export function sendMail(data: MailData) {
  return appRequest('post')(URL, data, HEADERS);
}
