"use server";

import { getSupabaseServerClient } from "../../lib/supabase/server";
import {
  FIELD_NAMES,
  HONEYPOT_FIELD,
  MESSAGES,
  MIN_FILL_TIME_MS,
  STARTED_AT_FIELD,
  validateRegistration,
  type RegistrationState,
} from "../../lib/registration";

/**
 * Server Action for the /register form.
 * Use with React's useActionState: registerAction(previousState, formData).
 *
 * Privacy rules followed here:
 * - Submitted values are never logged and never sent back to the browser.
 * - Database errors are logged by code only. Their message/details can
 *   contain the submitted row, so they are never logged or returned.
 */

/** Tolerated clock difference between browser and server (start time in the "future"). */
const MAX_CLOCK_SKEW_MS = 10 * 60_000;

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Only short, plain error codes (e.g. "23514", "42501", "PGRST205") are ever logged. */
function safeErrorCode(code: unknown): string {
  return typeof code === "string" && /^[A-Za-z0-9_]{1,12}$/.test(code) ? code : "unknown";
}

export async function registerAction(
  _previousState: RegistrationState,
  formData: FormData
): Promise<RegistrationState> {
  try {
    // 1. Honeypot: real visitors never fill this hidden field.
    //    Bots get a normal-looking success so they don't adapt; nothing is saved.
    if (readText(formData, HONEYPOT_FIELD).trim() !== "") {
      console.warn("[registration] Submission ignored (spam check).");
      return { status: "success", message: MESSAGES.success };
    }

    // 2. Timing check: a basic deterrent against instant automated posts.
    //    The browser sets this value (its own clock) when the form appears.
    //    It can be faked, so it is NOT a substitute for real rate limiting.
    //    Browser and server clocks can differ, so a start time slightly in
    //    the "future" is tolerated rather than treated as spam.
    const startedAtRaw = readText(formData, STARTED_AT_FIELD).trim();
    const startedAt = /^\d{1,15}$/.test(startedAtRaw) ? Number(startedAtRaw) : NaN;
    const elapsed = Date.now() - startedAt;
    const tooFast = elapsed >= 0 && elapsed < MIN_FILL_TIME_MS;
    const implausible = !Number.isFinite(startedAt) || elapsed < -MAX_CLOCK_SKEW_MS;
    if (tooFast || implausible) {
      return { status: "error", message: MESSAGES.tooFast };
    }

    // 3. Validate and normalise every field on the server.
    const result = validateRegistration({
      fullName: readText(formData, FIELD_NAMES.fullName),
      email: readText(formData, FIELD_NAMES.email),
      phone: readText(formData, FIELD_NAMES.phone),
      companyName: readText(formData, FIELD_NAMES.companyName),
      plan: readText(formData, FIELD_NAMES.plan),
      preferredStartDate: readText(formData, FIELD_NAMES.preferredStartDate),
      projectRequirements: readText(formData, FIELD_NAMES.projectRequirements),
      consent: readText(formData, FIELD_NAMES.consent),
    });

    // ("errors" in result) narrows the type even with tsconfig "strict": false
    if ("errors" in result) {
      return { status: "error", message: MESSAGES.invalid, fieldErrors: result.errors };
    }

    // 4. Save. Plain insert only: the database role may INSERT but not read,
    //    so no .select() / .upsert(), and nothing is returned to the browser.
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return { status: "error", message: MESSAGES.unavailable };
    }

    const { error } = await supabase.from("registrations").insert(result.data);
    if (error) {
      console.error(`[registration] Insert failed (code: ${safeErrorCode(error.code)})`);
      return { status: "error", message: MESSAGES.unavailable };
    }

    return { status: "success", message: MESSAGES.success };
  } catch (unexpected) {
    // Never log the error object itself: it could include request details.
    const name = unexpected instanceof Error ? unexpected.name : "UnknownError";
    console.error(`[registration] Unexpected error (${name})`);
    return { status: "error", message: MESSAGES.unavailable };
  }
}
