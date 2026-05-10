# Directiva: Fix Konva ESM Require Error on Netlify

## Objetivos
- Resolver el error "require() of ES Module" que ocurre en Netlify cuando `react-konva` intenta cargar `konva` en el servidor (SSR).
- Asegurar que el bundling de Vite/Nitro maneje correctamente estos paquetes.

## Entradas
- Archivos: `vite.config.ts`, `package.json`.
- Error: `require() of ES Module ... konva/lib/index.js from ... react-konva/lib/ReactKonva.js not supported`.

## Flujo de Lógica
1. Configurar Vite para que no externalice `konva` y `react-konva` en el build de SSR. Esto obligará a Vite a procesarlos y empaquetarlos como código compatible.
2. Si es necesario, configurar Nitro (el motor de TanStack Start) para que maneje estos módulos.
3. Verificar si el uso de `react-konva` en el código fuente debe ser "client-only" para evitar que se ejecute en el servidor.

## Riesgos y Restricciones
- `konva` requiere el DOM. Si se ejecuta en el servidor (Node.js), fallará a menos que se use `canvas` mockeado o se restrinja al cliente.
- Modificar `vite.config.ts` de `@lovable.dev` debe hacerse respetando su estructura de `defineConfig({ vite: { ... } })`.

## Reglas
- Usar `ssr.noExternal` en la configuración de Vite.
- Si el error persiste, considerar mover `react-konva` a una carga dinámica (`import()`) dentro de componentes de cliente.
