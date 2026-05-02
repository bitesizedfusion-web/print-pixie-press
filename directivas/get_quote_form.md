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

### Product Specifications
- Product Name (Dropdown)
- Width in cm (Number)
- Length in cm (Number)
- Quantity (Number)

### Logistics & Urgency
- Delivery Option: Pickup, Standard Delivery, Express Delivery
- Urgency:
    - Urgent
    - Required within 1 week
    - Required within 2 weeks
    - Required within 3 weeks
    - No Deadline Specified

### Additional Information
- Describe Product Details (Textarea)
- Upload Product Images (6 slots): Front, Back, Top, Bottom, Left, Right.

## Logic Flow
1. **Form State**: Update React state to include all new fields.
2. **Success State**: After submission, hide the form and show the success message: "Thank you. We have received your quote request. Our team will contact you shortly."
3. **Validation**: Ensure all required fields (marked with *) are filled before submission.
4. **Navigation**: Ensure the "Main Menu" links work correctly within the success message or as global navigation.

## Rules
- Use consistent `oklch` colors and `Fraunces` headings.
- Image slots must be clearly labeled.
- Mobile responsiveness for the grid of 6 images is mandatory.

## Steps
1. Update `src/routes/quote.tsx` with the new schema and success view.
2. Verify field alignment and styling.
