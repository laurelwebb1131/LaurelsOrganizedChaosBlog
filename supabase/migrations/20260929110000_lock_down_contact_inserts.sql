-- Public visitors submit contact messages through the server function.
-- The service-role client inserts after validation and anti-spam checks.
DROP POLICY IF EXISTS "send message" ON public.contact_messages;
REVOKE INSERT ON public.contact_messages FROM anon;
