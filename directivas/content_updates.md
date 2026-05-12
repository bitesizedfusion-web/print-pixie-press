# Directiva: Content and Navigation Updates

## Objective

Update the Home page, About Us page, and Navbar to align with the provided brand messaging and menu structure.

## Content Requirements

### Home Page

- **Headline**: S&S Printing and Packaging
- **Sub-headline**: All types of printing and packaging services in one place.
- **Product List Summary**: Flyers, business cards, brochures, stickers, labels, paper bags, pizza boxes, packaging boxes, books and more.
- **Tagline**: Quality work, fast service and Australia-wide delivery.
- **Call to Action**: Get a Quote button.

### About Us Page

- **Description**: Detailed history and mission of S&S Printing and Packaging.
- **Service List**:
  - Flyers and leaflets
  - Business cards
  - Brochures and booklets
  - Stickers and labels
  - Paper bags
  - Pizza boxes
  - Packaging boxes
  - Books and magazines
  - Posters and banners
  - Custom printing
  - Custom packaging
- **Closing**: "S&S Printing and Packaging — Your trusted partner for printing and packaging."

### Navbar (Menu)

- Home (/)
- About Us (/about)
- Products & Services (/products)
- Get a Quote (/quote)
- Gallery (/gallery)
- Contact Us (/contact)

## Logic Flow

1. **Navbar Update**: Rename "Products" to "Products & Services", add "Gallery".
2. **Home Page Update**: Modify `VexHero.tsx` or `index.tsx` to reflect the new copy.
3. **About Page Update**: Replace existing content in `src/routes/about.tsx`.

## Steps

1. Create/Update `src/routes/about.tsx`.
2. Update `src/components/Navbar.tsx`.
3. Update `src/routes/index.tsx` and `src/components/hero/VexHero.tsx`.
