INSERT INTO public.user_roles (user_id, role)
VALUES ('157f2d61-f8d8-468b-b150-468c8a81fbff', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;