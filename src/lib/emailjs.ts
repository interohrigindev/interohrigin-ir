import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface ContactForm {
  name: string;
  email: string;
  company: string;
  type: string;
  message: string;
}

export async function sendContactEmail(form: ContactForm) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured – skipping send');
    return { status: 200, text: 'OK (skipped – EmailJS not configured)' };
  }

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    from_name: form.name,
    from_email: form.email,
    company: form.company,
    inquiry_type: form.type,
    message: form.message,
  }, PUBLIC_KEY);
}
