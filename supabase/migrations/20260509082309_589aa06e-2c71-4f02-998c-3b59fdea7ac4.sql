
-- 1. Align print_inquiries columns with code
ALTER TABLE public.print_inquiries RENAME COLUMN name TO customer_name;
ALTER TABLE public.print_inquiries RENAME COLUMN email TO customer_email;
ALTER TABLE public.print_inquiries RENAME COLUMN phone TO customer_phone;
ALTER TABLE public.print_inquiries ALTER COLUMN subject DROP NOT NULL;

-- 2. Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Printing machines
CREATE TABLE public.printing_machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.printing_machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view machines" ON public.printing_machines
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert machines" ON public.printing_machines
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update machines" ON public.printing_machines
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete machines" ON public.printing_machines
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_printing_machines_updated_at
  BEFORE UPDATE ON public.printing_machines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
