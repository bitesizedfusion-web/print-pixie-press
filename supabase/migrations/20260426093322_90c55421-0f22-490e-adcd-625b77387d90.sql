-- Create public bucket for user-uploaded poster artwork
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'poster-uploads',
  'poster-uploads',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Allow anyone to upload to the poster-uploads bucket (anonymous designer flow)
create policy "Anyone can upload poster artwork"
on storage.objects for insert
to public
with check (bucket_id = 'poster-uploads');

-- Allow anyone to read files from the bucket (needed for previews and order processing)
create policy "Anyone can view poster artwork"
on storage.objects for select
to public
using (bucket_id = 'poster-uploads');