declare module '@emailjs/browser' {
  export function send(
    serviceId: string,
    templateId: string,
    templateParams: Record<string, string>,
    publicKey: string
  ): Promise<any>;

  export function sendForm(
    serviceId: string,
    templateId: string,
    form: HTMLFormElement,
    publicKey: string
  ): Promise<any>;

  export function init(publicKey: string): void;

  const emailjs: {
    send: typeof send;
    sendForm: typeof sendForm;
    init: typeof init;
  };
  export default emailjs;
}
