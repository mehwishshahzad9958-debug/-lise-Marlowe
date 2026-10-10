-- =====================================================================
--  Client registrations: table, constraints, indexes and access rules
-- =====================================================================
--
--  WHAT THIS DOES
--    Creates public.registrations for the /register form and locks it
--    down so that ONLY the website's server code (using the Supabase
--    secret key) can add rows. Browsers, the publishable key, and
--    logged-in users cannot read, insert, update or delete anything.
--
--  HOW TO RUN (once)
--    Supabase dashboard → SQL Editor → New query → paste this whole
--    file → Run. It runs as one transaction: if any statement fails,
--    nothing is created. It stops with an error if the table already
--    exists, so it can never overwrite existing data.
--
--  ACCESS MODEL
--    • Row Level Security is ON with NO policies → anon/authenticated
--      can never see or change rows, even if a policy is added by
--      mistake elsewhere, because their table privileges are revoked.
--    • service_role (the role behind the secret key) gets INSERT only.
--      It cannot read rows back, so the website can never leak them.
--    • You can still view and edit rows in the Supabase Table Editor
--      (the dashboard uses its own admin connection).
--
--  CHANGING THE PLANS LATER
--    The allowed plan values are listed in registrations_plan_allowed
--    below AND in lib/registration.ts. Keep both in sync. See the
--    example at the bottom of this file.
-- =====================================================================

begin;

create table public.registrations (
  id                    uuid        primary key default gen_random_uuid(),
  full_name             text        not null,
  email                 text        not null,
  phone                 text        not null,
  company_name          text,
  plan                  text        not null,
  preferred_start_date  date,
  project_requirements  text,
  consent               boolean     not null,
  consent_at            timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  status                text        not null default 'new',

  -- Full name: 2–120 characters, no leading/trailing spaces
  constraint registrations_full_name_check
    check (char_length(full_name) between 2 and 120
           and full_name = btrim(full_name)),

  -- Email: basic format, max 254 characters, stored in lowercase
  constraint registrations_email_check
    check (char_length(email) <= 254
           and email = lower(btrim(email))
           and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),

  -- Phone: digits, spaces, brackets, hyphens, dots and at most one "+";
  -- 7–15 digits in total; no leading/trailing spaces
  constraint registrations_phone_check
    check (phone ~ '^[0-9 ()+.-]{7,25}$'
           and phone !~ '\+.*\+'
           and phone = btrim(phone)
           and char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 7 and 15),

  -- Company / brand: optional, 1–150 characters when given
  constraint registrations_company_name_check
    check (company_name is null
           or (char_length(company_name) between 1 and 150
               and company_name = btrim(company_name))),

  -- Plan: must be one of the allowed values (keep in sync with lib/registration.ts)
  constraint registrations_plan_allowed
    check (plan in ('starter', 'professional', 'premium')),

  -- Preferred start date: optional; from yesterday (time-zone slack) up to 2 years ahead
  constraint registrations_preferred_start_date_check
    check (preferred_start_date is null
           or preferred_start_date between (created_at - interval '1 day')::date
                                       and (created_at + interval '2 years')::date),

  -- Project requirements: optional, max 2000 characters
  constraint registrations_project_requirements_check
    check (project_requirements is null
           or char_length(project_requirements) between 1 and 2000),

  -- Consent: must be given
  constraint registrations_consent_required
    check (consent is true),

  -- Status: for future review of each registration
  constraint registrations_status_check
    check (status in ('new', 'contacted', 'in_progress', 'converted', 'declined', 'spam'))
);

comment on table public.registrations is
  'Client registrations submitted from the website /register page. Insert-only for the server; no public access.';

-- Indexes for reviewing registrations (newest first, by status, by email)
create index registrations_created_at_idx on public.registrations (created_at desc);
create index registrations_status_idx     on public.registrations (status);
create index registrations_email_idx      on public.registrations (email);

-- Row Level Security ON, with no policies
alter table public.registrations enable row level security;

-- Remove ALL table privileges from public-facing roles.
-- (Supabase grants new tables to anon/authenticated by default.)
revoke all on table public.registrations from public;
revoke all on table public.registrations from anon;
revoke all on table public.registrations from authenticated;

-- The server (secret key → service_role) may only INSERT. No reading back.
revoke all on table public.registrations from service_role;
grant insert on table public.registrations to service_role;

commit;


-- =====================================================================
--  OPTIONAL CHECKS: run these AFTER the script above, as a new query.
--  They only read settings; they change nothing.
-- =====================================================================
--
--  -- 1. RLS enabled? (expect: true)
--  select relrowsecurity from pg_class where oid = 'public.registrations'::regclass;
--
--  -- 2. Policies? (expect: 0 rows)
--  select * from pg_policies where tablename = 'registrations';
--
--  -- 3. Who has which privileges? (expect: only service_role → INSERT,
--  --    plus the owner "postgres"; no anon / authenticated rows)
--  select grantee, privilege_type
--  from information_schema.role_table_grants
--  where table_schema = 'public' and table_name = 'registrations'
--  order by grantee, privilege_type;
--
-- =====================================================================
--  EXAMPLE: replacing the plan list later (do NOT run now)
-- =====================================================================
--
--  alter table public.registrations drop constraint registrations_plan_allowed;
--  alter table public.registrations add constraint registrations_plan_allowed
--    check (plan in ('starter', 'professional', 'premium', 'bridal'));
--  -- then update the same list in lib/registration.ts
