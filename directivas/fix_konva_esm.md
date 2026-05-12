# Directiva: Fix Konva ESM & Admin Dashboard Routes

## Objetivos

- Resolver el error "require() of ES Module" que ocurre en Netlify cuando `react-konva` intenta cargar `konva` en el servidor (SSR).
- Asegurar que el bundling de Vite/Netlify maneje correctamente estos paquetes.
- Garantizar que todas las rutas del panel de administración (`/admin/*`) estén correctamente definidas y sean accesibles.

## Entradas

- Archivos: `vite.config.ts`, `src/routes/admin.tsx`, `src/routes/admin.machines.tsx`.
- Error: `require() of ES Module ... konva/lib/index.js from ... react-konva/lib/ReactKonva.js not supported`.
- Error TS: `Type '"/admin/machines"' is not assignable to type 'keyof FileRoutesByPath'`.

## Flujo de Lógica

1. **Bundling ESM**: Configurar `ssr.noExternal: [/konva/, /react-konva/, /use-image/]` en `vite.config.ts`. Esto obliga a Vite a procesar estos módulos y empaquetarlos como ESM en el bundle de SSR, evitando el uso de `require`.
2. **Desactivar SSR Selectivo**: Para rutas que dependen fuertemente de APIs del navegador (como el Designer que usa Konva), añadir `ssr: false` en la configuración de la ruta para evitar que se intente renderizar en el servidor.
3. **Sincronización de Rutas**: Crear archivos de ruta faltantes (ej: `admin.machines.tsx`) y ejecutar el generador de rutas de TanStack para actualizar `src/routeTree.gen.ts`.
4. **Verificación de Tipos**: Ejecutar `tsc --noEmit` para confirmar que no hay errores de navegación o de tipos.

## Riesgos y Restricciones

- `konva` requiere el DOM. Nunca debe ejecutarse en el servidor.
- La regeneración de rutas debe ser manual si el plugin de Vite no lo detecta automáticamente tras añadir archivos nuevos.
- En Netlify, el bundle de SSR debe estar en formato ESM para evitar colisiones con paquetes modernos.

## Reglas

- Usar `ssr.noExternal` para librerías que no soportan bien SSR por defecto.
- Mantener la estructura de rutas plana (`admin.xxx.tsx`) o anidada (`admin/xxx.tsx`) de forma consistente para evitar errores de tipo.
- Siempre realizar un build local (`npm run build`) para validar el bundle de SSR antes de hacer push.
