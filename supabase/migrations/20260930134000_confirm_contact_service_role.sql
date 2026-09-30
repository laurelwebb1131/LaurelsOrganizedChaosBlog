-- Keep the GitHub-first database permissions aligned with the Lovable project.
-- Public contact submissions go through the validated server function.
GRANT ALL ON public.contact_messages TO service_role;
