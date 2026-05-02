# Directiva: Products & Services Page Implementation

## Objective
Create a comprehensive, premium "Products & Services" page displaying 11 core printing and packaging categories. Each category must have a high-quality image, clear description, target use cases, and available options.

## Content Structure
The page will be organized into an editorial-style list or a sophisticated grid. Each item must include:
- **Product Name**
- **Image**: Professional product photography.
- **Description**: Marketing copy provided in the request.
- **Suitable For**: Bullet points or small tags showing target use cases.
- **Options**: Clear breakdown of available customizations (sizes, finishes, etc.).

### Product Categories:
1. Flyers & Leaflets
2. Business Cards
3. Brochures & Booklets
4. Stickers & Labels
5. Paper Bags
6. Pizza Boxes
7. Packaging Boxes
8. Books & Magazines
9. Posters & Banners
10. Menus
11. Custom Printing & Packaging

## Call to Action (Bottom)
- **Text**: "Need a custom quote? Send us your product name, size, quantity, material and delivery details."
- **Button**: "Get a Quote" linking to `/quote`.

## Design Rules
- Use `oklch` colors and `Fraunces` headings.
- Implement `framer-motion` for smooth entry animations.
- Ensure high visual contrast and premium white-space management.
- Use a "Product Card" component that feels tactile and high-end.

## Steps
1. Generate images for all 11 categories.
2. Update `src/routes/products.tsx` with the new layout and content.
3. Verify responsiveness and visual flow.
