interface Window {
  UMCONFUrls: {
    nonce: string;
  };
}

interface HTMLElement {
  createTextRange: VoidFunction;
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
