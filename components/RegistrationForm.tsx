"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { registerAction } from "../app/actions/register";
import Link from "next/link";
import {
  FIELD_NAMES,
  HONEYPOT_FIELD,
  INITIAL_REGISTRATION_STATE,
  LIMITS,
  MESSAGES,
  PLANS,
  STARTED_AT_FIELD,
  validateRegistration,
  type FieldErrors,
  type RegistrationField,
  type RegistrationState,
} from "../lib/registration";
import { serif } from "./collection/fonts";

/**
 * /register form.
 *
 * - Submits ONLY through the existing Server Action (app/actions/register.ts),
 *   which re-validates everything on the server and saves via Supabase.
 * - The browser never talks to Supabase and never sees any key.
 * - Uses the shared rules in lib/registration.ts for instant feedback.
 * - Never logs or stores what visitors type.
 */

type Values = Record<RegistrationField, string>;

/**
 * Calls the Server Action. If the request itself fails (e.g. the visitor is
 * offline), show the same generic message instead of crashing the page.
 */
async function submitRegistration(previous: RegistrationState, formData: FormData): Promise<RegistrationState> {
  try {
    return await registerAction(previous, formData);
  } catch {
    return { status: "error", message: MESSAGES.unavailable };
  }
}

const EMPTY_VALUES: Values = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  plan: "",
  preferredStartDate: "",
  projectRequirements: "",
  consent: "",
};

/** Order used to move focus to the first problem. */
const FIELD_ORDER: RegistrationField[] = [
  "fullName",
  "email",
  "phone",
  "companyName",
  "plan",
  "preferredStartDate",
  "projectRequirements",
  "consent",
];

const fieldId = (field: RegistrationField) => `register-${field}`;
const errorId = (field: RegistrationField) => `register-${field}-error`;

/** YYYY-MM-DD in the visitor's own time zone. */
function localDateString(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export default function RegistrationForm() {
  const [state, formAction, isPending] = useActionState(submitRegistration, INITIAL_REGISTRATION_STATE);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  // Browser-side timestamp (ms) for the timing check; empty until the form is ready.
  const [startedAt, setStartedAt] = useState("");
  const [dateBounds, setDateBounds] = useState<{ min: string; max: string } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  // Guards against double submission even before React re-renders with isPending.
  const submittingRef = useRef(false);

  // Initialise browser-only values after the page loads.
  useEffect(() => {
    setStartedAt(String(Date.now()));
    const today = new Date();
    const max = new Date(today);
    max.setDate(max.getDate() + LIMITS.startDateMaxDaysAhead);
    setDateBounds({ min: localDateString(today), max: localDateString(max) });
  }, []);

  // React to each Server Action result.
  useEffect(() => {
    submittingRef.current = false;
    if (state.status === "success") {
      setValues(EMPTY_VALUES);
      setErrors({});
      setStartedAt(String(Date.now()));
      successRef.current?.focus();
    } else if (state.status === "error") {
      const serverErrors = state.fieldErrors ?? {};
      setErrors(serverErrors);
      const first = FIELD_ORDER.find((field) => serverErrors[field]);
      if (first) focusField(first);
      else statusRef.current?.focus();
    }
  }, [state]);

  function focusField(field: RegistrationField) {
    const target =
      field === "plan"
        ? formRef.current?.querySelector<HTMLInputElement>(`input[name="${FIELD_NAMES.plan}"]`)
        : document.getElementById(fieldId(field));
    target?.focus();
  }

  function update(field: RegistrationField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  const onText =
    (field: RegistrationField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update(field, event.target.value);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || submittingRef.current || !startedAt) return;

    // Same rules as the server, for instant feedback. The server checks again.
    const result = validateRegistration({ ...values, consent: values.consent === "on" });
    if ("errors" in result) {
      setErrors(result.errors);
      const first = FIELD_ORDER.find((field) => result.errors[field]);
      if (first) focusField(first);
      return;
    }

    submittingRef.current = true;
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  const isReady = startedAt !== "";
  const busy = isPending || !isReady;
  const showError = state.status === "error" && !isPending;

  if (state.status === "success" && !isPending) {
    return (
      <div className="rounded-2xl border border-stone-900/10 bg-white/60 p-8 text-center shadow-xl shadow-stone-900/5 backdrop-blur sm:p-12">
        <span aria-hidden className="mx-auto block h-2 w-2 rotate-45 bg-rose-800/70" />
        <h2
          ref={successRef}
          tabIndex={-1}
          className={`${serif.className} mt-6 text-4xl font-light outline-none sm:text-5xl`}
        >
          Registration <span className="italic text-rose-800">received</span>.
        </h2>
        <p role="status" className="mx-auto mt-4 max-w-md text-base leading-relaxed text-stone-600">
          {state.message}
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#f6f1eb] transition-colors hover:bg-rose-900"
        >
          Back to the site
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-900/10 bg-white/60 p-6 shadow-xl shadow-stone-900/5 backdrop-blur sm:p-10">
      <h2 className={`${serif.className} text-3xl font-light sm:text-4xl`}>Your details</h2>
      <p className="mt-2 text-sm text-stone-500">
        Fields marked <span aria-hidden className="text-rose-800">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <form
        ref={formRef}
        method="post"
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isPending}
        className="mt-8 grid gap-7 sm:grid-cols-2"
      >
        {/* Spam deterrents: hidden from visitors and assistive technology */}
        <input type="hidden" name={STARTED_AT_FIELD} value={startedAt} readOnly />
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-10000px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
        >
          <label>
            Leave this field empty
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <Field field="fullName" label="Full name" required error={errors.fullName}>
          <input
            id={fieldId("fullName")}
            name={FIELD_NAMES.fullName}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.fullNameMax}
            required
            value={values.fullName}
            onChange={onText("fullName")}
            {...describedBy("fullName", errors)}
            className={inputClass(!!errors.fullName)}
          />
        </Field>

        <Field field="email" label="Email address" required error={errors.email}>
          <input
            id={fieldId("email")}
            name={FIELD_NAMES.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.emailMax}
            required
            value={values.email}
            onChange={onText("email")}
            {...describedBy("email", errors)}
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field field="phone" label="Phone number" required error={errors.phone}>
          <input
            id={fieldId("phone")}
            name={FIELD_NAMES.phone}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={LIMITS.phoneMaxLength}
            required
            value={values.phone}
            onChange={onText("phone")}
            {...describedBy("phone", errors)}
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <Field field="companyName" label="Company or brand" optional error={errors.companyName}>
          <input
            id={fieldId("companyName")}
            name={FIELD_NAMES.companyName}
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.companyNameMax}
            value={values.companyName}
            onChange={onText("companyName")}
            {...describedBy("companyName", errors)}
            className={inputClass(!!errors.companyName)}
          />
        </Field>

        {/* Plan: radio cards */}
        <fieldset className="sm:col-span-2" aria-describedby={errors.plan ? errorId("plan") : undefined}>
          <legend className="block text-[10px] uppercase tracking-[0.3em] text-stone-500">
            Plan <span aria-hidden className="text-rose-800">*</span>
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PLANS.map((plan) => {
              const checked = values.plan === plan.value;
              return (
                <label
                  key={plan.value}
                  className={`group relative flex cursor-pointer flex-col rounded-xl border px-5 py-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-stone-900 has-[:focus-visible]:ring-offset-2 ${
                    checked
                      ? "border-stone-900 bg-stone-900 text-[#f6f1eb]"
                      : errors.plan
                        ? "border-rose-700/60 bg-white/40 hover:border-stone-900"
                        : "border-stone-900/15 bg-white/40 hover:border-stone-900"
                  }`}
                >
                  <input
                    type="radio"
                    name={FIELD_NAMES.plan}
                    value={plan.value}
                    checked={checked}
                    required
                    aria-invalid={errors.plan ? true : undefined}
                    onChange={() => update("plan", plan.value)}
                    className="sr-only"
                  />
                  <span className={`${serif.className} text-2xl font-light`}>{plan.label}</span>
                  <span className={`mt-1 text-xs leading-relaxed ${checked ? "text-stone-300" : "text-stone-500"}`}>
                    {plan.description}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.plan && (
            <p id={errorId("plan")} className="mt-2 text-xs text-rose-700">
              {errors.plan}
            </p>
          )}
        </fieldset>

        <Field field="preferredStartDate" label="Preferred start date" optional error={errors.preferredStartDate}>
          <input
            id={fieldId("preferredStartDate")}
            name={FIELD_NAMES.preferredStartDate}
            type="date"
            min={dateBounds?.min}
            max={dateBounds?.max}
            value={values.preferredStartDate}
            onChange={onText("preferredStartDate")}
            {...describedBy("preferredStartDate", errors)}
            className={`${inputClass(!!errors.preferredStartDate)} min-h-[3.125rem]`}
          />
        </Field>

        <div className="hidden sm:block" aria-hidden />

        <Field
          field="projectRequirements"
          label="Project requirements"
          optional
          wide
          error={errors.projectRequirements}
          hint={`${Array.from(values.projectRequirements).length.toLocaleString("en")} / ${LIMITS.projectRequirementsMax.toLocaleString("en")}`}
        >
          <textarea
            id={fieldId("projectRequirements")}
            name={FIELD_NAMES.projectRequirements}
            rows={5}
            maxLength={LIMITS.projectRequirementsMax}
            placeholder="Occasion, timeline, style preferences…"
            value={values.projectRequirements}
            onChange={onText("projectRequirements")}
            {...describedBy("projectRequirements", errors)}
            className={`${inputClass(!!errors.projectRequirements)} resize-y`}
          />
        </Field>

        {/* Consent */}
        <div className="sm:col-span-2">
          <label htmlFor={fieldId("consent")} className="flex cursor-pointer items-start gap-3">
            <input
              id={fieldId("consent")}
              name={FIELD_NAMES.consent}
              type="checkbox"
              required
              checked={values.consent === "on"}
              onChange={(event) => update("consent", event.target.checked ? "on" : "")}
              {...describedBy("consent", errors)}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-rose-800"
            />
            <span className="text-sm leading-relaxed text-stone-600">
              I agree that the information I submit may be used to respond to my registration enquiry.{" "}
              <span aria-hidden className="text-rose-800">*</span>
            </span>
          </label>
          {errors.consent && (
            <p id={errorId("consent")} className="mt-2 pl-8 text-xs text-rose-700">
              {errors.consent}
            </p>
          )}
        </div>

        {/* Submit + status */}
        <div className="flex flex-col gap-5 sm:col-span-2">
          <div
            ref={statusRef}
            tabIndex={-1}
            role={showError ? "alert" : "status"}
            aria-live={showError ? "assertive" : "polite"}
            className="outline-none"
          >
            {isPending && <p className="text-sm text-stone-500">Sending your registration…</p>}
            {showError && (
              <p className="rounded-lg bg-[#f6f1eb] px-4 py-3 text-sm text-rose-800">{state.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="group inline-flex items-center justify-center gap-3 self-start rounded-full bg-stone-900 px-8 py-4 text-xs uppercase tracking-[0.25em] text-[#f6f1eb] outline-none transition-colors hover:bg-rose-900 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-stone-900 max-sm:w-full"
          >
            {isPending ? "Sending…" : "Submit registration"}
            {!isPending && (
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Small helpers (same look as the Contact form) ---------- */

function describedBy(field: RegistrationField, errors: FieldErrors) {
  return {
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  };
}

function inputClass(hasError: boolean) {
  return `w-full border-0 border-b bg-transparent px-0 py-3 text-base text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:ring-0 ${
    hasError
      ? "border-rose-700 focus:border-rose-800"
      : "border-stone-900/20 hover:border-stone-900/40 focus:border-stone-900"
  }`;
}

function Field({
  field,
  label,
  required = false,
  optional = false,
  wide = false,
  error,
  hint,
  children,
}: {
  field: RegistrationField;
  label: string;
  required?: boolean;
  optional?: boolean;
  wide?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={fieldId(field)}
          className="block text-[10px] uppercase tracking-[0.3em] text-stone-500"
        >
          {label}
          {required && <span aria-hidden className="ml-1 text-rose-800">*</span>}
          {optional && <span className="ml-2 normal-case tracking-normal text-stone-400">(optional)</span>}
        </label>
        {hint && <span className="shrink-0 whitespace-nowrap text-[10px] tracking-wide text-stone-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={errorId(field)} className="mt-2 text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
