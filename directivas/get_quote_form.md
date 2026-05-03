# Directiva: Implementation of "Get a Quote" Form (v2)

## Objective
Update the "Get a Quote" form with comprehensive user details, urgency levels, and specific image slots. Implement a success state and ensure the design remains premium.

## Inputs
### Contact Details
- First Name (Required)
- Surname (Required)
- Company Name
- Email (Required)
- Mobile Phone Number (Required)
- Delivery Postcode (Required)

## Product List
### Printing Products
- Flyers & Leaflets
- Business Cards
- Brochures / Pamphlets
- Posters
- Banners (Vinyl / Fabric / Roll-up)
- Stickers & Labels
- Booklets / Catalogues / Magazines
- NCR / Carbonless Forms
- Envelopes
- Notepads
- Calendars
- Postcards
- Door Hangers
- Pull-up / Roll-up Banners

### Packaging Products
- Custom Boxes (Corrugated / Carton)
- Product Packaging Boxes
- Food Packaging (Boxes / Wrappers)
- Paper Bags
- Labels for Packaging
- Packaging Sleeves

## Logic Flow
1. **Form State**: Update React state to include all new fields.
2. **Success State**: After submission, hide the form and show the success message.
3. **Verification Fix (Mobile)**: Ensure `window.scrollTo({ top: 0 })` is called when switching to the verification state.
4. **Validation**: Ensure all required fields (marked with *) are filled.
5. **Navigation**: Ensure the "Main Menu" links work correctly.

## Rules
- Use consistent `oklch` colors and `Fraunces` headings.
- Image slots must be clearly labeled.
- Mobile responsiveness for the grid of 6 images is mandatory.
- **Mobile First**: Verification page must not show footer immediately; it must be focused and at the top of the viewport.

## Steps
1. Update `src/routes/quote.tsx` with the new product list.
2. Add `window.scrollTo(0,0)` in `nextStep` for Step 1 -> Verifying transition.
3. Ensure `PRODUCT_CONFIGS` and `PRODUCT_CATEGORIES` match the final list.
