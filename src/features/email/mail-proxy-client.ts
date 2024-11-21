import { MailProxyUrls } from '../../api/Urls';
import { appRequest } from '../../api/fetch-client';

type BaseEmailData = {
  to: string;
  subject: string;
  variables: {
    /**
     * html text
     */
    content: string;
  };
};

type RejectionEmailData = {
  type: 'rejection';
} & BaseEmailData;

type InvoiceEmailData = {
  type: 'invoice';
  attachments: {
    filename: string;
    content: string;
  }[];
} & BaseEmailData;

type OfferEmailData = {
  type: 'offer';
  attachments: {
    filename: string;
    content: string;
  }[];
} & BaseEmailData;

type EmailData = OfferEmailData | RejectionEmailData | InvoiceEmailData;

const HEADERS = {
  'x-api-key': import.meta.env.VITE_MAIL_PROXY_API_KEY,
};

const URL = MailProxyUrls.sendMail;

export function sendMail(data: EmailData) {
  return appRequest('post')(URL, data, HEADERS);
}
