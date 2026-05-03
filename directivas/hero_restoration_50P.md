# Directive: Hero Section Restoration and Labeling

## Objective
Restore the Hero section to its high-end "previous version" layout while ensuring the button labels and primary messaging match the user's specific request.

## Requirements
### Messaging
- **Main Heading**: "S&S Printing & Packaging" (using `AnimatedHeading` if available or bold styled text).
- **Secondary Heading/Motto**: "Printing. Packaging. Delivered."
- **Description**: Keep the professional description about flyers, business cards, etc.

### Buttons
- **Primary Button**: "Get Quote" (linked to `/quote`).
- **Secondary Button**: "Explore Now" (linked to `/products`).

### Visual Style
- **Premium Aesthetics**: Maintain the glassmorphism (`glass-pro`), vibrant black/white/gold or black/white/orange accents.
- **Background**: Ensure the video background is present and optimized.
- **Logistics Card**: Keep the logistics info card on the right for desktop.

## Logic Flow
1. **Header**: Ensure "Get Quote" is in the navbar.
2. **Hero Text**: Re-implement the headline and sub-headline structure.
3. **Buttons**: Update labels to "Get Quote" and "Explore Now".
4. **Motto**: Place "Printing. Packaging. Delivered." in a prominent secondary position (e.g., in a glass box or as a large sub-headline).

## Steps
1. Modify `src/components/hero/VexHero.tsx`.
2. Update the `h1` or headline component to "S&S Printing & Packaging".
3. Update the buttons to "Get Quote" and "Explore Now".
4. Re-add the "Printing. Packaging. Delivered." text as requested.
