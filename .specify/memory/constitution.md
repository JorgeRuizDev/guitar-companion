<!--
SYNC IMPACT REPORT
==================
Version Change: 1.2.0 -> 1.3.0
Bump Rationale: MINOR - Added Core Principle VII (Domain-Agnostic, Embeddable & URL-Driven Quiz Engine) and corresponding technical and quality requirements for quiz-based learning systems.
Modified Principles: None
Added Principles:
  - VII. Motor de Cuestionarios Agnóstico, Embebible y Guiado por URL (Domain-Agnostic, Embeddable & URL-Driven Quiz Engine)
Added Sections / Requirements:
  - Requisitos Técnicos y Arquitectónicos: Arquitectura de Cuestionarios Desacoplada
  - Criterios de Calidad y Flujo de Trabajo: Validación de Cuestionarios y Parámetros
Removed Sections: None
Follow-up TODOs: None
-->

# Guitar Companion Constitution

## Core Principles

### I. Arquitectura Multi-Aplicación Independiente (Independent Multi-App Core)
La plataforma DEBE concebirse como un ecosistema modular donde múltiples aplicaciones o herramientas funcionales independientes coexisten armoniosamente.
- Cada aplicación DEBE operar con autonomía dentro de su dominio funcional, delimitando claramente su lógica de negocio, rutas, gestión de estado y componentes especializados.
- Las aplicaciones hermanas NO DEBEN acoplarse directamente entre sí; la interdependencia transversal entre apps queda estrictamente restringida.
- La infraestructura y recursos comunes (componentes de diseño atómicos, tokens de estilo, layout envolvente, servicios utilitarios y adaptadores de red) DEBEN residir en módulos compartidos (`core`/`shared`).
- La adición, modificación o eliminación de una aplicación no DEBE comprometer la estabilidad, el empaquetado o el despliegue del resto del ecosistema.
*Rationale*: Asegura la escalabilidad a largo plazo del catálogo de aplicaciones (afinador, metrónomo, acordes, progresiones, escalas, etc.) sin generar un monolito frágil e inmanejable.

### II. Optimización SEO Obligatoria por Aplicación (SEO-First per Application)
Cada aplicación y página pública indexable DEBE estar diseñada y renderizada a favor del posicionamiento en motores de búsqueda (SEO) desde su concepción.
- Toda aplicación pública DEBE proporcionar contenido legible en la primera carga HTML utilizando Server-Side Rendering (SSR), Static Site Generation (SSG) o pre-renderizado. Se PROHÍBE el uso de Client-Side Rendering (CSR) puro que sirva un documento HTML vacío para vistas indexables.
- Cada aplicación y ruta DEBE gestionar dinámicamente metadatos precisos y únicos: etiquetas `<title>` contextuales, `<meta name="description">`, URLs canónicas (`<link rel="canonical">`), Open Graph y Twitter Cards.
- Toda página con contenido informativo o interactivo DEBE estructurar metadatos semánticos mediante datos estructurados JSON-LD (Schema.org).
- La jerarquía del marcado HTML (`h1`, `h2`, `h3`, `nav`, `main`, `article`, `section`) DEBE respetar rigurosamente la semántica web y estándares de accesibilidad para facilitar el rastreo y la indexación por bots y buscadores.
*Rationale*: El tráfico orgánico es el motor primario de descubrimiento para herramientas web. Implementar SEO como un requisito no negociable de arquitectura previene rediseños costosos de renderizado.

### III. Diseño Mobile-First con Soporte de Escritorio de Alto Nivel
La experiencia de usuario DEBE diseñarse y codificarse priorizando dispositivos móviles como base estructural obligatoria.
- La maquetación, diseño de interacción y estilos CSS DEBEN comenzar en viewports móviles reducidos (a partir de 320px). Las hojas de estilo base DEBEN ser móviles y escalar progresivamente a escritorios mediante media queries de ampliación (`min-width`).
- Los elementos interactivos en vista móvil DEBEN garantizar áreas táctiles seguras y accesibles (mínimo 44x44px con márgenes adecuados).
- **Arquitectura de Navegación Dual (Dual Navigation Architecture)**:
  - En dispositivos móviles y teléfonos (pantallas `< 768px` / `md`), la barra de navegación superior (*PlatformHeader*) NO DEBE albergar enlaces horizontales que puedan provocar desbordamientos (*overflow*), roturas de línea o solapamientos visuales. En teléfonos, la cabecera superior se limita a la identidad de marca y el selector de idioma.
  - La navegación entre herramientas en teléfonos DEBE resolverse mediante un sistema de navegación específico para móviles: una barra de navegación inferior fija (*PlatformBottomNav* / *Bottom Tab Bar*) con iconos táctiles ergonómicos, etiquetas breves localizadas, indicador visual de ruta activa y soporte para zonas seguras (`safe-area-inset-bottom`).
  - En vistas de escritorio (`md` y superiores), los enlaces de navegación horizontal se presentan de forma expandida en la cabecera superior y la barra inferior se oculta.
  - En modos embebidos (`embed=true` o rutas `/embed`), tanto la cabecera superior como la navegación inferior deben suprimirse íntegramente.
- El soporte en escritorio DEBE ser de primera categoría: no debe consistir en un simple escalado o estiramiento de la interfaz móvil, sino en una adaptación enriquecida que aproveche layouts multicolumna, navegación expandida, atajos de teclado y estados hover ergonómicos.
- El rendimiento en redes móviles DEBE cumplir con los umbrales de Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) como criterio indispensable de aceptación.
*Rationale*: La mayoría de los músicos consultan utilidades e interfaces web desde teléfonos mientras sostienen su instrumento, pero los usuarios de escritorio demandan una experiencia de trabajo cómoda, rica y ergonómica. Una barra de navegación inferior es mucho más accesible al pulgar y evita desbordamientos en pantallas pequeñas.

### IV. Modelo Centrado en el Usuario sin Simulación de UI (Zero-Mock UI)
La arquitectura de datos DEBE estar concebida y modelada alrededor de la identidad del usuario, mientras que la interfaz de usuario DEBE permanecer estrictamente honesta y limpia.
- Los modelos de datos, esquemas de persistencia y APIs DEBEN incluir desde su origen conceptos de pertenencia y tenencia de información (campos como `userId`, `ownerId` o relaciones preparadas para multi-usuario y auditoría).
- PROHIBICIÓN ESTRICTA DE SIMULACIÓN VISUAL (Zero-Mock UI): La interfaz de usuario NO DEBE presentar avatares ficticios, perfiles de usuario simulados (ej. "John Doe"), menús desplegables de sesión simulados ni botones no funcionales de "Cerrar sesión" o "Iniciar sesión" mientras el sistema de autenticación real no esté formalmente implementado.
- La plataforma DEBE funcionar de forma limpia y productiva en modo invitado (Guest Mode / Anónimo), apoyándose en almacenamiento local (`localStorage` / `IndexedDB`) diseñado con contratos listos para sincronizarse o migrarse cuando la autenticación e identidad real sean introducidas.
*Rationale*: Permite que el backend y los modelos de datos nazcan maduros y preparados para el futuro sin incurrir en deuda técnica, a la vez que evita degradar la experiencia de usuario con elementos de interfaz falsos, confusos o inoperativos.

### V. Simplicidad, Modularidad y Rendimiento Web (Performance & Simplicity)
La arquitectura técnica DEBE adherirse a la máxima economía de recursos y evitar la sobreingeniería prematura.
- Se DEBE aplicar el principio YAGNI (You Aren't Gonna Need It); cualquier biblioteca o abstracción técnica agregada DEBE responder a una necesidad funcional verificable y concreta.
- Cada aplicación DEBE aprovechar mecanismos de partición de código (*code-splitting* y *lazy loading*) a nivel de ruta y componente para garantizar que el usuario descargue exclusivamente los recursos de la aplicación activa.
- Toda comunicación o intercambio de información entre aplicaciones independientes DEBE realizarse mediante interfaces bien documentadas, eventos estandarizados o almacenamiento común, sin acoplamiento de estados en memoria privada.
*Rationale*: Un ecosistema multi-aplicación corre el riesgo de degradar drásticamente los tiempos de carga y la mantenibilidad si no se controla rigurosamente el presupuesto de peso y la separación de responsabilidades.

### VI. Idioma Inglés Canónico por Defecto (Default English Language)
Toda la interfaz de usuario, textos informativos, etiquetas, controles interactivos, documentación técnica, identificadores de código y mensajes del sistema DEBEN redactarse e implementarse en inglés por defecto.
- Toda vista, componente o aplicación dentro del ecosistema DEBE mostrar de forma predeterminada su contenido y microcopia en inglés para garantizar una experiencia consistente, global y unificada.
- Queda estrictamente PROHIBIDO introducir textos visibles en español u otros idiomas como valores predeterminados en componentes de interfaz o plantillas sin un sistema formal de internacionalización (i18n).
- Cualquier funcionalidad futura de localización o soporte multi-idioma DEBE mantener el inglés (`en`) como idioma base, canónico y de respaldo (*fallback*).
*Rationale*: Asegura la homogeneidad estilística y técnica del ecosistema global, eliminando inconsistencias idiomáticas entre herramientas y garantizando accesibilidad universal para músicos de cualquier procedencia.

### VII. Motor de Cuestionarios Agnóstico, Embebible y Guiado por URL (Domain-Agnostic, Embeddable & URL-Driven Quiz Engine)
El sistema de aprendizaje basado en cuestionarios DEBE estructurarse como un motor modular, agnóstico al dominio, optimizado para su inserción en webviews y configurable de manera declarativa vía URL.
- **Desacoplamiento y Extracción Agnóstica (Domain-Agnostic Modularity)**:
  - La lógica, componentes de interfaz (renderizado de preguntas, opciones, feedback visual, contadores, métricas de resultado) y modelos de datos del cuestionario DEBEN implementarse en un módulo o grupo externo independiente (ej. capa compartida o paquete desacoplado).
  - El núcleo del cuestionario NO DEBE contener dependencias, terminología ni acoplamiento rígido con el dominio de la guitarra o la música. El contenido sobre guitarra debe inyectarse como datos o esquemas de contenido consumidos por dicho motor, garantizando que el sistema pueda extraerse o reutilizarse en el futuro para cualquier otra temática de aprendizaje.
- **Prioridad Embebible y Compatibilidad con Webviews (Webview-First & Embeddability)**:
  - Los componentes y vistas de cuestionarios DEBEN diseñarse con prioridad para ser embebidos sin fricción en webviews (aplicaciones móviles híbridas o nativas, iframes y contenedores embebidos).
  - Al operar en modo embebido (por ejemplo, vía parámetro `embed=true` o ruta dedicada), la interfaz DEBE suprimir automáticamente elementos globales del layout (cabeceras, barras de navegación de plataforma, footers) y adaptar su espaciado para aprovechar al máximo el área visual del contenedor.
- **Configuración Declarativa y Bidireccional por Parámetros de URL (URL-Driven Configuration)**:
  - Todas las variables esenciales de funcionamiento (selección de banco de preguntas, nivel de dificultad, límites de tiempo, modo de evaluación, temas visuales y comportamiento embebido) DEBEN ser configurables de forma declarativa mediante parámetros de consulta (`query params`).
  - La URL DEBE actuar como fuente fidedigna de configuración reproducible y compartible: SE RECOMIENDA que el sistema permita generar, sincronizar y configurar dinámicamente la propia URL a partir de la configuración seleccionada (configuración de la URL mediante la URL / deep linking de configuración), permitiendo que un usuario o aplicación externa comparta o preconfigure una sesión de cuestionario íntegra únicamente transmitiendo la URL parametrizada.
  - Los parámetros de URL DEBEN ser serializables, sanitizados y validados de forma estricta, contando siempre con valores de respaldo (*fallbacks*) seguros y predecibles ante parámetros inválidos o ausentes.
*Rationale*: Diseñar el sistema de cuestionarios desacoplado de la temática de guitarra asegura la reutilización futura de la plataforma educativa en múltiples disciplinas. Priorizar la compatibilidad con webviews y la configuración mediante URLs permite integrar los cuestionarios sin esfuerzo en aplicaciones móviles nativas o plataformas externas mediante enlaces directos autocontenidos y parametrizables.

## Requisitos Técnicos y Arquitectónicos

- **Estrategia de Renderizado y Framework**: Se DEBE utilizar una tecnología web moderna que soporte SSR/SSG nativo para cumplir simultáneamente con los objetivos de SEO y rendimiento de las múltiples aplicaciones.
- **Tipado Estricto de Dominio**: Todo el código DEBE implementarse con TypeScript en modo estricto (`strict: true`), garantizando contratos de datos sólidos entre la capa compartida, los modelos de usuario y las aplicaciones independientes.
- **Estrategia de Estilos Responsivos**: Los componentes DEBEN construirse siguiendo convenciones utilitarias o modulares con enfoque Mobile-First estricto, evitando dependencias pesadas de UI que comprometan el bundle móvil.
- **Abstracción de Almacenamiento Local**: La persistencia de datos del usuario anónimo DEBE implementarse mediante adaptadores desacoplados que faciliten una futura transición o sincronización con bases de datos en la nube una vez que el módulo de autenticación sea incorporado.
- **Arquitectura de Cuestionarios Desacoplada**: El motor de cuestionarios DEBE separar estrictamente el estado del runner de evaluación de los esquemas de preguntas. Los componentes DEBEN operar como componentes puros o controlados mediante configuración derivada de URL y props, permitiendo su renderizado aislado en vistas embebidas y webviews sin requerir acceso a contextos globales de la plataforma.

## Criterios de Calidad y Flujo de Trabajo

- **Verificación de Reglas Constitucionales**: Ninguna propuesta de especificación (`speckit-specify`), plan de arquitectura (`speckit-plan`) o tarea de implementación (`speckit-implement`) podrá ser aprobada si infringe los principios de SEO, Mobile-First, independencia multi-app o la prohibición de UI simulada.
- **Pruebas Automatizadas**: Toda lógica de negocio y utilidades de dominio musical o de datos DEBEN contar con pruebas unitarias exhaustivas antes de ser promovidas a integración.
- **Auditoría de SEO y Accesibilidad**: Las vistas públicas de cada aplicación DEBEN validar periódicamente su marcado semántico, títulos, metadatos y accesibilidad básica (WCAG AA).
- **Rigor en Dependencias**: Toda nueva dependencia que afecte el tamaño del bundle global DEBE ser evaluada y justificada.
- **Validación de Cuestionarios y Parámetros**: Toda implementación de cuestionario DEBE validar rigurosamente los query params de entrada mediante esquemas tipados (por ejemplo Zod o validadores equivalentes) y probarse en resoluciones embebidas típicas de webview sin dependencias del shell de la aplicación.

## Governance

- **Supremacía Constitucional**: Esta constitución prevalece sobre cualquier decisión informal, preferencia de diseño o convención previa de desarrollo. Cualquier desviación técnica o funcional respecto a estos principios DEBE ser rechazada.
- **Procedimiento de Enmienda**: Las modificaciones a este documento requieren una justificación formal, registro de impacto en los artefactos del proyecto y actualización correspondiente del número de versión.
- **Política de Versionado (SemVer)**:
  - **MAJOR**: Modificaciones que impliquen cambios incompatibles, eliminación de principios fundamentales o redefiniciones estructurales del modelo de gobierno.
  - **MINOR**: Incorporación de nuevos principios, adición de secciones técnicas sustanciales o ampliación de directrices obligatorias.
  - **PATCH**: Correcciones ortográficas, mejoras de redacción, precisiones terminológicas o refinamientos no semánticos.
- **Revisiones de Cumplimiento**: Todas las especificaciones, planes y revisiones de código DEBEN validar activamente la conformidad con las directrices aquí ratificadas.

**Version**: 1.3.0 | **Ratified**: 2026-10-31 | **Last Amended**: 2026-11-02
