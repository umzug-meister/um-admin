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

interface HTMLElement {
  createTextRange: Function;
}

interface Date {
  addDays: (days: number) => Date;
}

interface Array<T> {
  from: (index: number) => Array<T>;
}

interface String {
  capitalize(): string;
}
