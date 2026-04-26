-- Drop the broad select policy that allowed listing all objects
drop policy if exists "Anyone can view poster artwork" on storage.objects;

-- Note: For public buckets, files are still accessible via their direct public URL
-- (https://.../storage/v1/object/public/poster-uploads/<path>) without needing a SELECT policy.
-- By NOT adding a select policy, we prevent listing the bucket contents while keeping
-- direct file access working. File paths use random UUIDs so they cannot be guessed.