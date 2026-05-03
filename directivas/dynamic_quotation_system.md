# Directive: Dynamic Product Quotation System

## Objective
To create a premium, responsive quotation form that dynamically adjusts its fields based on the selected product category. This reduces friction for the user and ensures the admin receives all necessary technical specifications for a quote.

## System Architecture

### 1. Data Structure (The Schema)
All products must be mapped to a configuration object that defines:
- **Common Fields**: Quantity, Material, Design Requirement, State, Postcode, Deadline.
- **Specific Fields**:
    - **Flyers/Brochures**: Fold Type, Page Count, Printing Sides.
    - **Business Cards**: Finish (Spot UV, Foil), Thickness (GSM).
    - **Stickers/Labels**: Shape (Round, Square, etc.), Adhesive Type, Format (Roll/Sheet).
    - **Packaging Boxes**: Box Style, Dimensions (L x W x H), Material Thickness (Wall).
    - **Banners**: Material (Vinyl, Mesh, Fabric), Finish (Eyelets, Hemming).

### 2. Logic Flow (Step 2 - Project Specifications)
1. **Product Selection**: The user selects a product from a categorized dropdown.
2. **Field Expansion**: The UI triggers an animation to reveal specific options for that product.
3. **Dynamic State Management**: A `dynamicFields` object in the React state stores the values of these conditional inputs.

### 3. Communication (The Email)
The `sendQuoteToAdmin` function must be updated to:
- Iterate through the `dynamicFields` object.
- Format all key-value pairs into the HTML body of the email.
- Ensure technical details like "Fold Type: Tri-fold" or "Finish: Spot UV" are clearly visible to the admin.

## Implementation Steps

### Step A: Update `quote.tsx`
- Define `PRODUCT_CONFIGS` constant.
- Replace the generic Step 2 inputs with a `renderDynamicFields()` function.
- Add `dynamicFields` to the `formData` state.
- Implement smooth transitions using `framer-motion`.

### Step B: Update `email.ts`
- Modify `sendQuoteToAdmin` to accept the new dynamic data.
- Build a dynamic HTML table or list for the email body.

## Known Risks / Constraints
- **Validation**: Ensure that required fields for a specific product are validated before moving to Step 3.
- **Complexity**: Keep the code clean by modularizing the field rendering components.
- **Mobile UX**: Long dynamic forms must remain readable on small screens.

## Memory Log (Updated as we learn)
- *Initial setup: 2026-05-03* - Integrated 18+ product categories from user specifications.
- *Note*: Packaging products require specialized dimension fields (L x W x H) while 2D products (Posters) only need Size presets.
