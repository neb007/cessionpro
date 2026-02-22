-- Add VAT number to profiles for billing use

begin;

alter table public.profiles
  add column if not exists vat_number text;

commit;

