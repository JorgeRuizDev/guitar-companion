# Directrices de Desarrollo para Agentes - Guitar Companion

## 1. Arquitectura y Entorno
- **Framework**: Next.js 15 (App Router) + React 19 + TailwindCSS v4.
- **Gestor de paquetes y tests**: Bun (`bun test --preload ./tests/setup.ts`).
- **Despliegue**: Docker en modo producción (`standalone`) exponiendo el puerto `3100`.
- **Integraciones**: Portainer stack `guitar-companion` y panel Homepage en `http://192.168.1.202`.

## 2. REGLA OBLIGATORIA: Recarga Automática de Docker
Este proyecto está desplegado activamente en Docker en producción.
Cada vez que realices cambios en ficheros de código (`src/`, `package.json`, configuraciones, assets, etc.):

1. **NO esperes a que el usuario te pida reconstruir o recargar el contenedor.** Es parte obligatoria de la definición de "hecho" (Definition of Done) de cualquier tarea o lote de cambios.
2. Ejecuta inmediatamente al finalizar tus cambios:
   ```bash
   bun run docker:reload
   ```
   (o en su defecto `docker compose up -d --build`).
3. Comprueba que el servicio está levantado y saludable:
   ```bash
   curl -f http://192.168.1.202:3100/api/health
   ```
4. Si el contenedor no responde o da error, inspecciona los logs con `bun run docker:logs` y corrige el problema antes de dar la tarea por finalizada.

## 3. Comandos Útiles del Proyecto
- `bun run dev` - Ejecutar servidor de desarrollo local en host (usar solo si se requiere depuración puntual sin Docker).
- `bun run test` - Ejecutar suite de pruebas unitarias con Vitest.
- `bun run build` - Compilar la aplicación en producción con Next.js standalone.
- `bun run docker:reload` - Reconstruir la imagen de producción y reiniciar el contenedor Docker.
- `bun run docker:restart` - Reiniciar el contenedor existente sin reconstruir.
- `bun run docker:logs` - Visualizar logs en tiempo real del contenedor `guitar-companion`.
- `bun run docker:down` - Detener el contenedor.
