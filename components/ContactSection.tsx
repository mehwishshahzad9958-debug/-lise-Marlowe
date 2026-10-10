"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { sans, serif } from "./collection/fonts";

/* =====================================================================
 * ✏️  CONTACT DETAILS — edit everything in this one object.
 *
 *  - email:            business email
 *  - phoneDisplay:     the number exactly as visitors should see it
 *  - phoneLink:        the same number for the tel: link — "+" then
 *                      country code and number, no spaces
 *  - whatsappNumber:   country code + number, DIGITS ONLY
 *                      (no +, spaces or dashes)
 *  - whatsappMessage:  the text pre-filled in the WhatsApp chat
 *  - instagramUrl /
 *    instagramHandle:  set both to "" to hide the Instagram row
 * ===================================================================== */
export const contactConfig = {
  brandName: "Élise Marlowe",
  email: "mehwishshahzad9958@gmail.com",
  phoneDisplay: "09958550656",
  phoneLink: "+919958550656",
  whatsappNumber: "919958550656",
  whatsappMessage: "Hello! I'd like to know more about your collection.",
  instagramUrl: "https://www.instagram.com/am_wish_/",
  instagramHandle: "am_wish_",
  /** Set to true to show a "placeholder details" reminder while developing. */
  usingPlaceholders: false,
};

const enquiryTypes = [
  "The collection",
  "Styling advice",
  "Size & availability",
  "Brand & collaborations",
  "Something else",
];

/* ---------- Links built from the config (no need to edit) ---------- */
const emailHref = `mailto:${contactConfig.email}`;
const phoneHref = `tel:${contactConfig.phoneLink}`;
const whatsappHref = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
  contactConfig.whatsappMessage
)}`;

/* ---------- Form types & validation ---------- */
type FormValues = { name: string; email: string; enquiry: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = { name: "", email: "", enquiry: "", message: "" };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!values.enquiry) errors.enquiry = "Please choose what your enquiry is about.";
  if (values.message.trim().length < 10)
    errors.message = "Please write a message of at least 10 characters.";
  // Very long mailto: links can be cut off by some email apps
  else if (values.message.trim().length > MAX_MESSAGE_LENGTH)
    errors.message = `Please keep your message under ${MAX_MESSAGE_LENGTH.toLocaleString()} characters, or email us directly.`;
  return errors;
}

const MAX_MESSAGE_LENGTH = 1500;

/** How long to wait for the email app to take focus before saying it didn't open. */
const OPEN_CHECK_MS = 1500;

/**
 * Builds the mailto: link. Subject and body are encoded with
 * encodeURIComponent, and line breaks use \r\n as the mailto standard
 * (RFC 6068) requires, so accents, "&", "?" and new lines all survive.
 */
function buildMailtoLink(values: FormValues) {
  const subject = `Enquiry: ${values.enquiry}`;
  const body = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Enquiry type: ${values.enquiry}`,
    "",
    "Message:",
    values.message.trim(),
  ]
    .join("\n")
    .replace(/\r?\n/g, "\r\n");

  return `${emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * idle      – nothing submitted yet
 * invalid   – visitor tried to submit with errors
 * checking  – mailto: link triggered, waiting to see if the email app opened
 * opened    – the browser lost focus, so an email app (or webmail tab) opened
 * notOpened – nothing happened; no email app seems to be set up
 */
type SubmitStatus = "idle" | "invalid" | "checking" | "opened" | "notOpened";

export default function ContactSection() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const stopWatchingRef = useRef<(() => void) | null>(null);

  // Stop listening for the email app if the visitor leaves the page
  useEffect(() => () => stopWatchingRef.current?.(), []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // Clear a field's error as soon as the visitor fixes it
    if (errors[name as keyof FormValues]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  /**
   * This site has no email service connected yet, so the form does NOT send
   * anything by itself. On submit it opens the visitor's own email app with
   * the enquiry pre-filled, ready for them to press "Send".
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);

    const firstInvalid = Object.keys(newErrors)[0];
    if (firstInvalid) {
      setStatus("invalid");
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    /*
     * A website can't know for certain whether an email app opened. When one
     * does open, the browser window loses focus (or the tab is hidden), so we
     * listen for that. If it doesn't happen, we say so instead of pretending
     * the enquiry went through. We keep listening for a while longer in case
     * the browser first asks "Open your email app?".
     */
    stopWatchingRef.current?.();
    setStatus("checking");

    const markOpened = () => {
      setStatus("opened");
      stopWatching();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") markOpened();
    };
    const fallbackTimer = window.setTimeout(() => {
      setStatus((current) => (current === "checking" ? "notOpened" : current));
    }, OPEN_CHECK_MS);
    const giveUpTimer = window.setTimeout(() => stopWatching(), 30000);

    function stopWatching() {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(giveUpTimer);
      window.removeEventListener("blur", markOpened);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopWatchingRef.current = null;
    }

    window.addEventListener("blur", markOpened);
    document.addEventListener("visibilitychange", onVisibilityChange);
    stopWatchingRef.current = stopWatching;

    window.location.href = buildMailtoLink(values);
  };

  const contactOptions = [
    { label: "Email", value: contactConfig.email, href: emailHref, icon: <MailIcon /> },
    { label: "Phone", value: contactConfig.phoneDisplay, href: phoneHref, icon: <PhoneIcon /> },
    {
      label: "WhatsApp",
      value: "Chat with us",
      href: whatsappHref,
      icon: <ChatIcon />,
      external: true,
    },
    // Instagram is only shown when a URL is set in contactConfig
    ...(contactConfig.instagramUrl
      ? [
          {
            label: "Instagram",
            value: `@${contactConfig.instagramHandle}`,
            href: contactConfig.instagramUrl,
            icon: <InstagramIcon />,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={`${sans.className} relative scroll-mt-4 overflow-hidden bg-[#f6f1eb] text-stone-900`}
    >
      {/* Soft accents, echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Left: intro + contact options ---------- */}
          <div className="lg:col-span-5">
            <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-rose-800">
              <span className="h-px w-10 bg-rose-800" />
              Contact
            </p>
            <h2
              id="contact-heading"
              className={`${serif.className} text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl`}
            >
              Let’s talk
              <br />
              <span className="italic text-rose-800">style</span>.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-stone-600">
              Questions about the collection, styling, availability or a brand
              enquiry? We’d love to hear from you — reach out however suits you
              best.
            </p>

            {contactConfig.usingPlaceholders &&
              process.env.NODE_ENV !== "production" && (
                <p className="mt-6 inline-block rounded-md border border-dashed border-amber-600/50 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Placeholder contact details — update{" "}
                  <code className="font-mono">contactConfig</code> in
                  ContactSection.tsx. (Only shown in development.)
                </p>
              )}

            <ul className="mt-10 border-t border-stone-900/10">
              {contactOptions.map((option) => (
                <li key={option.label} className="border-b border-stone-900/10">
                  <a
                    href={option.href}
                    target={option.external ? "_blank" : undefined}
                    rel={option.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-5 rounded-sm py-5 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1eb]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-900/15 text-stone-700 transition-colors duration-300 group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-[#f6f1eb]">
                      {option.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase tracking-[0.3em] text-stone-500">
                        {option.label}
                        {option.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </span>
                      <span
                        className={`${serif.className} mt-1 block text-lg [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-rose-800 sm:text-2xl`}
                      >
                        {breakBeforeAt(option.value)}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="text-stone-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-stone-900"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Right: enquiry form ---------- */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-stone-900/10 bg-white/60 p-6 shadow-xl shadow-stone-900/5 backdrop-blur sm:p-10">
              <h3 className={`${serif.className} text-3xl font-light sm:text-4xl`}>
                Send an enquiry
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                All fields are required.
              </p>

              <form noValidate onSubmit={handleSubmit} className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field id="name" label="Full name" error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={inputClass(!!errors.name)}
                  />
                </Field>

                <Field id="email" label="Email address" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={inputClass(!!errors.email)}
                  />
                </Field>

                <Field id="enquiry" label="Enquiry type" error={errors.enquiry} wide>
                  <select
                    id="contact-enquiry"
                    name="enquiry"
                    value={values.enquiry}
                    onChange={handleChange}
                    aria-invalid={!!errors.enquiry}
                    aria-describedby={errors.enquiry ? "contact-enquiry-error" : undefined}
                    className={`${inputClass(!!errors.enquiry)} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%2357534e'%20stroke-width='2'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-8`}
                  >
                    <option value="" disabled>
                      Choose an option
                    </option>
                    {enquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="message" label="Message" error={errors.message} wide>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${inputClass(!!errors.message)} resize-y`}
                  />
                </Field>

                <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-xs leading-relaxed text-stone-500">
                    Submitting opens your email app with your enquiry ready to
                    send.
                  </p>
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#f6f1eb] outline-none transition-colors hover:bg-rose-900 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                  >
                    Send Enquiry
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </div>

                <div aria-live="polite" className="sm:col-span-2">
                  {status === "invalid" && Object.values(errors).some(Boolean) && (
                    <p className="rounded-lg bg-[#f6f1eb] px-4 py-3 text-sm text-rose-700">
                      Please fill in the highlighted fields before sending.
                    </p>
                  )}
                  {status === "checking" && (
                    <p className="rounded-lg bg-[#f6f1eb] px-4 py-3 text-sm text-stone-600">
                      Opening your email app…
                    </p>
                  )}
                  {status === "opened" && (
                    <p className="rounded-lg bg-[#f6f1eb] px-4 py-3 text-sm text-stone-600">
                      Your email app has opened with your enquiry. It hasn’t
                      been sent yet — please review it and press{" "}
                      <strong className="font-medium">Send</strong> in your
                      email app.
                    </p>
                  )}
                  {status === "notOpened" && (
                    <p className="rounded-lg bg-[#f6f1eb] px-4 py-3 text-sm text-stone-600">
                      We couldn’t open an email app, so your enquiry has{" "}
                      <strong className="font-medium">not</strong> been sent.
                      If your browser asked to open an app, please allow it —
                      or email us directly at{" "}
                      <a
                        href={emailHref}
                        className="underline underline-offset-4 [overflow-wrap:anywhere] hover:text-rose-800"
                      >
                        {contactConfig.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <p
          className={`${serif.className} mt-24 text-center text-3xl font-light italic text-stone-700 sm:text-4xl`}
        >
          Every great look begins with a conversation.
        </p>
      </div>

      {/* Footer line */}
      <div className="relative border-t border-stone-900/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-[11px] uppercase tracking-[0.25em] text-stone-500 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
          <span>
            © {new Date().getFullYear()} {contactConfig.brandName}
          </span>
          <a href="#" className="transition-colors hover:text-stone-900">
            Back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Small helpers ---------- */

/** Lets a long email address wrap neatly before the "@" on small screens. */
function breakBeforeAt(text: string) {
  const at = text.indexOf("@");
  if (at <= 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <wbr />
      {text.slice(at)}
    </>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border-0 border-b bg-transparent px-0 py-3 text-base text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:ring-0 ${
    hasError
      ? "border-rose-700 focus:border-rose-800"
      : "border-stone-900/20 hover:border-stone-900/40 focus:border-stone-900"
  }`;
}

function Field({
  id,
  label,
  error,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={`contact-${id}`}
        className="block text-[10px] uppercase tracking-[0.3em] text-stone-500"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`contact-${id}-error`} className="mt-2 text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Inline icons (no icon library needed) ---------- */

function MailIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z" />
      <path d="M9 10h6M9 13.5h4" />
    </svg>
  );
}
