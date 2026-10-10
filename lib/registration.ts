/**
 * Shared registration rules.
 *
 * Safe to import from BOTH server code and browser components:
 * it contains no secrets and no database code.
 *
 * The limits below mirror the CHECK constraints in supabase/schema.sql.
 * If you change a rule here, change it there too (and vice versa).
 */

/* ------------------------------------------------------------------ */
/* Plans: edit labels/descriptions freely. If you add, remove or      */
/* rename a `value`, also update registrations_plan_allowed in        */
/* supabase/schema.sql.                                               */
/* ------------------------------------------------------------------ */
export const PLANS = [
  { value: "starter", label: "Starter", description: "A focused introduction to our styling services." },
  { value: "professional", label: "Professional", description: "Ongoing support for regular projects and occasions." },
  { value: "premium", label: "Premium", description: "Our most complete, hands-on service." },
] as const;

export type PlanValue = (typeof PLANS)[number]["value"];

const PLAN_VALUES: readonly string[] = PLANS.map((plan) => plan.value);

export function isPlanValue(value: string): value is PlanValue {
  return PLAN_VALUES.includes(value);
}

/* ------------------------------------------------------------------ */
/* Limits (keep in sync with supabase/schema.sql)                     */
/* ------------------------------------------------------------------ */
export const LIMITS = {
  fullNameMin: 2,
  fullNameMax: 120,
  emailMax: 254,
  phoneMaxLength: 25,
  phoneMinDigits: 7,
  phoneMaxDigits: 15,
  companyNameMax: 150,
  projectRequirementsMax: 2000,
  /** Furthest preferred start date allowed, in days from today. */
  startDateMaxDaysAhead: 729,
} as const;

/* ------------------------------------------------------------------ */
/* Form field names (shared by the form and the server action)        */
/* ------------------------------------------------------------------ */
export const FIELD_NAMES = {
  fullName: "fullName",
  email: "email",
  phone: "phone",
  companyName: "companyName",
  plan: "plan",
  preferredStartDate: "preferredStartDate",
  projectRequirements: "projectRequirements",
  consent: "consent",
} as const;

export type RegistrationField = keyof typeof FIELD_NAMES;

/**
 * Hidden spam-deterrent fields.
 * - HONEYPOT: real visitors never see or fill it; simple bots often do.
 *   The name is deliberately meaningless so browser autofill and password
 *   managers don't recognise it (names like "website", "url", "email" or
 *   "company" can be auto-filled, which would silently discard a real
 *   registration). In the form, also give it autoComplete="off",
 *   tabIndex={-1} and aria-hidden, and hide it off-screen (not display:none).
 * - STARTED_AT: set by the browser when the form appears (milliseconds).
 * These are lightweight deterrents, NOT rate limiting: a determined
 * attacker can bypass both.
 */
export const HONEYPOT_FIELD = "hp_x7k2";
export const STARTED_AT_FIELD = "formStartedAt";

/** Submissions faster than this (after the form appeared) are rejected. */
export const MIN_FILL_TIME_MS = 3000;

/* ------------------------------------------------------------------ */
/* Server action result shape (no submitted values are ever echoed)   */
/* ------------------------------------------------------------------ */
export type FieldErrors = Partial<Record<RegistrationField, string>>;

export type RegistrationState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: FieldErrors;
};

export const INITIAL_REGISTRATION_STATE: RegistrationState = { status: "idle", message: "" };

export const MESSAGES = {
  success: "Thank you — your registration has been received. We’ll be in touch soon.",
  invalid: "Please check the highlighted fields and try again.",
  tooFast: "That was a little quick. Please wait a moment, then submit the form again.",
  unavailable:
    "Sorry, we couldn’t submit your registration right now. Please try again later or contact us directly.",
} as const;

/* ------------------------------------------------------------------ */
/* Validation                                                         */
/* ------------------------------------------------------------------ */

/** Raw values as they arrive from the form (all strings / booleans). */
export type RegistrationInput = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  plan: string;
  preferredStartDate: string;
  projectRequirements: string;
  consent: string | boolean;
};

/** Clean values, shaped exactly like the database row. */
export type RegistrationRow = {
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  plan: PlanValue;
  preferred_start_date: string | null; // YYYY-MM-DD
  project_requirements: string | null;
  consent: true;
};

export type ValidationResult =
  | { success: true; data: RegistrationRow }
  | { success: false; errors: FieldErrors };

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_ALLOWED = /^[0-9 ()+.-]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
// Control characters (newlines/tabs are allowed only in the message field)
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const CONTROL_CHARS_EXCEPT_NEWLINE_TAB = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

/** Length in characters as PostgreSQL counts them (emoji count as 1). */
function charLength(value: string) {
  return Array.from(value).length;
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

/**
 * Validates and normalises a registration.
 * `now` is injectable for testing.
 */
export function validateRegistration(input: RegistrationInput, now: Date = new Date()): ValidationResult {
  const errors: FieldErrors = {};

  // Full name: trimmed, inner whitespace collapsed
  const fullName = String(input.fullName ?? "").trim().replace(/\s+/g, " ");
  if (!fullName) errors.fullName = "Please enter your full name.";
  else if (CONTROL_CHARS.test(fullName)) errors.fullName = "Your name contains characters we can’t accept.";
  else if (charLength(fullName) < LIMITS.fullNameMin) errors.fullName = "Please enter your full name.";
  else if (charLength(fullName) > LIMITS.fullNameMax)
    errors.fullName = `Please keep your name under ${LIMITS.fullNameMax} characters.`;

  // Email: trimmed + lowercase
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!email) errors.email = "Please enter your email address.";
  else if (charLength(email) > LIMITS.emailMax || !EMAIL_PATTERN.test(email) || CONTROL_CHARS.test(email))
    errors.email = "Please enter a valid email address.";

  // Phone: digits, spaces, ( ) + . - ; at most one "+"; 7–15 digits
  const phone = String(input.phone ?? "").trim();
  const phoneDigits = phone.replace(/[^0-9]/g, "").length;
  if (!phone) errors.phone = "Please enter your phone number.";
  else if (
    !PHONE_ALLOWED.test(phone) ||
    (phone.match(/\+/g) ?? []).length > 1 ||
    phone.length > LIMITS.phoneMaxLength ||
    phoneDigits < LIMITS.phoneMinDigits ||
    phoneDigits > LIMITS.phoneMaxDigits
  )
    errors.phone = "Please enter a valid phone number (digits, spaces, +, - and brackets only).";

  // Company / brand: optional
  const companyRaw = String(input.companyName ?? "").trim().replace(/\s+/g, " ");
  const companyName = companyRaw === "" ? null : companyRaw;
  if (companyName !== null) {
    if (CONTROL_CHARS.test(companyName)) errors.companyName = "This field contains characters we can’t accept.";
    else if (charLength(companyName) > LIMITS.companyNameMax)
      errors.companyName = `Please keep this under ${LIMITS.companyNameMax} characters.`;
  }

  // Plan: strict allowlist (never trust the value sent by the browser)
  const plan = String(input.plan ?? "").trim();
  if (!plan) errors.plan = "Please choose a plan.";
  else if (!isPlanValue(plan)) errors.plan = "Please choose one of the listed plans.";

  // Preferred start date: optional, real calendar date, from today up to ~2 years ahead.
  // "Today" allows one day of slack so visitors in any time zone can pick their own today.
  const dateRaw = String(input.preferredStartDate ?? "").trim();
  let preferredStartDate: string | null = null;
  if (dateRaw !== "") {
    const parsed = new Date(`${dateRaw}T00:00:00Z`);
    const isRealDate = DATE_PATTERN.test(dateRaw) && !Number.isNaN(parsed.getTime()) && toDateString(parsed) === dateRaw;
    if (!isRealDate) {
      errors.preferredStartDate = "Please enter a valid date.";
    } else if (dateRaw < toDateString(addDays(now, -1))) {
      errors.preferredStartDate = "Please choose today or a future date.";
    } else if (dateRaw > toDateString(addDays(now, LIMITS.startDateMaxDaysAhead))) {
      errors.preferredStartDate = "Please choose a date within the next two years.";
    } else {
      preferredStartDate = dateRaw;
    }
  }

  // Project requirements: optional, line breaks normalised, max 2000 characters
  const requirementsRaw = String(input.projectRequirements ?? "").replace(/\r\n?/g, "\n").trim();
  const projectRequirements = requirementsRaw === "" ? null : requirementsRaw;
  if (projectRequirements !== null) {
    if (CONTROL_CHARS_EXCEPT_NEWLINE_TAB.test(projectRequirements))
      errors.projectRequirements = "Your message contains characters we can’t accept.";
    else if (charLength(projectRequirements) > LIMITS.projectRequirementsMax)
      errors.projectRequirements = `Please keep this under ${LIMITS.projectRequirementsMax.toLocaleString("en")} characters.`;
  }

  // Consent: must be explicitly given (an HTML checkbox sends "on")
  const consentGiven = input.consent === true || input.consent === "on" || input.consent === "true";
  if (!consentGiven) errors.consent = "Please confirm that we may contact you about your registration.";

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      full_name: fullName,
      email,
      phone,
      company_name: companyName,
      plan: plan as PlanValue,
      preferred_start_date: preferredStartDate,
      project_requirements: projectRequirements,
      consent: true,
    },
  };
}
