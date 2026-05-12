# Rebranding and Error Correction Directive

## Objective

Rename all occurrences of "S&S Printing and Packaging" or "S&S Printers and Packaging" to "S&S Printers". Also, identify and fix any existing errors in the codebase.

## Scope

- Files: All files in `src/` directory.
- Branding: Navbar, Footer, Hero section, Title, Meta tags.

## Search Patterns

- `S&S Printing and Packaging`
- `S&S Printers and Packaging`
- `S&S Printing & Packaging`

## Replacement

- New Name: `S&S Printers`

## Execution Steps

1. Run `grep` to find all occurrences of "S&S".
2. Create a Python script to perform the replacement.
3. Verify the changes manually, especially email links and branding text.
4. Run `npm run build` or `vite build` to check for errors.
5. Fix identified errors and remove development console logs.

## Known Risks

- Hardcoded URLs or IDs.
- Logo filenames.
- **Email Link Corruption**: Automated scripts might incorrectly replace display text of email links (e.g., changing `sandsprinters26@gmail.com` to `S&S Printers`). Always verify email `<a>` tags after rebranding.
- **Edge Functions**: Don't forget to update branding inside `supabase/functions/`.
