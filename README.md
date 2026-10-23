# Points

Sistema de fidelizacion para pymes en Chile.

## Primeros pasos en tu computador

1. `npm install`
2. Copia `.env.local.example` a `.env.local` (ya trae los valores reales de Supabase, son publicos).
3. `npm run dev` y abre http://localhost:3000

## Variables de entorno en Vercel

Al importar este repo en Vercel, agrega estas dos variables (Settings -> Environment Variables), con los mismos valores de `.env.local.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Paginas

- `/login` - acceso del dueno
- `/dashboard` - panel del dueno (clientes, puntos, registrar visita)
- `/registro?negocio=UUID` - pagina publica para el QR, el cliente se registra solo

El UUID de `negocio` es el `id` de la fila del negocio en la tabla `negocios` de Supabase.
