# S&S Printing and Packaging

A professional web application for **S&S Printing and Packaging**, a premier printing and packaging solution provider in Australia. Built with modern technologies for high performance, reliability, and premium user experience.

## 🚀 Technologies
- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/guide/start/overview) (SSR)
- **Styling**: Tailwind CSS 4.0
- **Database/Auth**: [Supabase](https://supabase.com)
- **Deployment**: Netlify
- **Animations**: Framer Motion
- **Design Tools**: Konva.js (for custom poster design)

## 🛠 Recent Updates & Fixes
- **Konva SSR Compatibility**: Resolved critical bundling issues on Netlify where `react-konva` attempted to use CommonJS `require` for ESM `konva`.
- **Admin Dashboard**: Fixed missing routes and navigation issues in the Prime Admin panel.
- **Type Safety**: Achieved 100% TypeScript coverage across all routes and components.
- **Performance**: Optimized asset delivery and bundled heavy dependencies like Konva and jsPDF.

## 📂 Project Structure
- `src/routes/`: File-based routing using TanStack Router.
- `src/components/`: Reusable UI components.
- `src/integrations/`: Third-party integrations (Supabase, etc.).
- `supabase/`: Database migrations and configuration.

## 💻 Local Development
```bash
npm install
npm run dev
```

## 🌐 Deployment
The project is configured for **Netlify** with SSR support.
Build command: `npm run build`
Publish directory: `dist/client`
