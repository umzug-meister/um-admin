interface Window {
  UMCONFUrls: {
    nonce: string;
  };
  JF: {
    initialize: Function;
    getSubmission: Function;
    getSubmissions: Function;
    getAPIKey: Function;
  };
}

interface Date {
  addDays: (days: number) => Date;
}

interface Array<T> {
  from: (index: number) => Array<T>;
}
