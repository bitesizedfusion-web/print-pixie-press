CREATE TABLE public.print_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.print_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit print inquiries"
ON public.print_inquiries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff and admins can view print inquiries"
ON public.print_inquiries
FOR SELECT
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Staff and admins can update print inquiries"
ON public.print_inquiries
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Admins can delete print inquiries"
ON public.print_inquiries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_print_inquiries_updated_at
BEFORE UPDATE ON public.print_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();