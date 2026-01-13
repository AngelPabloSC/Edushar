# Software Requirements Specification (SRS)
# EduShar - Plataforma de Aprendizaje del Idioma Shuar

**Versión:** 1.0  
**Fecha:** 2026-01-12  
**Basado en:** IEEE 29148

---

## 1. Introducción

### 1.1 Propósito del Documento
Este documento especifica los requisitos funcionales y no funcionales para EduShar, una plataforma web de aprendizaje del idioma Shuar. Está dirigido a desarrolladores, usuarios finales y estudiantes.

### 1.2 Alcance del Sistema
**Nombre:** EduShar  
**Tipo:** Aplicación web educativa  
**Objetivo:** Facilitar el aprendizaje del idioma Shuar mediante recursos digitales interactivos (cuentos, lecciones, diccionario, juegos).

**Incluye:**
- Sistema de autenticación y gestión de usuarios
- Diccionario Shuar-Español bidireccional
- Lecciones interactivas con ejercicios
- Biblioteca de cuentos e historias en Shuar
- Sistema de retroalimentación y corrección
- Panel administrativo para gestión de contenidos

**Excluye:**
- Reconocimiento de voz para pronunciación
- Audio de pronunciación de palabras
- Narración de cuentos en audio
- Aplicación móvil nativa


### 1.3 Definiciones, Acrónimos y Abreviaturas
- **SRS:** Software Requirements Specification
- **RF:** Requisito Funcional
- **RNF:** Requisito No Funcional
- **MUI:** Material UI
- **Firebase:** Backend as a Service (BaaS) de Google
- **Shuar:** Idioma indígena de Ecuador
- **MoSCoW:** Must have, Should have, Could have, Won't have

### 1.4 Referencias
- IEEE 29148:2018 - Systems and software engineering — Life cycle processes — Requirements engineering
- Material UI Documentation v5+
- Firebase Documentation v9+
- React 19 Documentation

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
EduShar es un sistema nuevo que busca preservar y promover el idioma Shuar mediante tecnología web moderna. Reemplaza métodos tradicionales (libros físicos, enseñanza oral exclusiva) con una plataforma digital accesible.

### 2.2 Funciones del Producto (Alto Nivel)
1. Autenticación y gestión de perfiles de usuario
2. Diccionario interactivo Shuar-Español
3. Lecciones estructuradas por niveles
4. Biblioteca de cuentos y leyendas Shuar
5. Juegos educativos para reforzar vocabulario
6. Sistema de progreso y retroalimentación
7. Panel administrativo para gestión de contenidos

### 2.3 Clases de Usuarios y Características

| Rol | Descripción | Necesidades Principales |
|-----|-------------|------------------------|
| **Estudiante** | Usuario que aprende Shuar (niños, jóvenes, adultos) | Acceso a lecciones, diccionario, cuentos, seguimiento de progreso |
| **Administrador** | Gestor de contenidos y usuarios | CRUD de lecciones, cuentos, palabras del diccionario, gestión de usuarios |

### 2.4 Entorno Operativo
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Desktop, tablet, móvil (responsive design)
- **Conectividad:** Requiere conexión a internet
- **Backend:** Firebase (Firestore, Authentication, Storage, Hosting)

### 2.5 Restricciones
- **Stack obligatorio:** React 19.2.0 + Vite + Material UI + Firebase
- **Idiomas:** Interfaz en español, contenido en Shuar/Español
- **Accesibilidad:** WCAG 2.1 nivel AA (mínimo)
- **Presupuesto:** Uso de Firebase free tier inicialmente

### 2.6 Suposiciones y Dependencias
- Los usuarios tienen acceso a internet
- Firebase mantiene disponibilidad del servicio
- Existe contenido Shuar validado por hablantes nativos
- Los administradores tienen conocimiento del idioma Shuar

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales

#### RF-001: Registro de Usuario
**Descripción:** El sistema debe permitir registro con email/contraseña  
**Actor:** Estudiante  
**Precondiciones:** Usuario no registrado  
**Flujo Básico:**
1. Usuario accede a página de registro
2. Ingresa datos requeridos:
   - Email
   - Contraseña
   - Nombre, apellido
   - Fecha de nacimiento
3. Sistema valida datos
4. Sistema crea cuenta en Firebase Auth
5. Sistema crea perfil en Firestore con datos adicionales
6. Sistema redirige a dashboard

**Flujos Alternos:**
- Email ya registrado → mostrar error
- Contraseña débil → mostrar requisitos
- Fecha de nacimiento inválida → mostrar error
- Usuario menor de 13 años → solicitar consentimiento parental (opcional)

**Postcondiciones:** Usuario registrado y autenticado  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario en página de registro  
- **When** completa formulario válido con nombre, apellidos, email, contraseña y fecha de nacimiento  
- **Then** cuenta creada y redirigido a dashboard

**Colecciones Firebase:** `users`

---

#### RF-002: Inicio de Sesión
**Descripción:** Autenticación con email/contraseña  
**Actor:** Estudiante, Administrador  
**Precondiciones:** Usuario registrado  
**Flujo Básico:**
1. Usuario ingresa credenciales
2. Sistema valida con Firebase Auth
3. Sistema carga perfil de Firestore
4. Sistema redirige según rol

**Flujos Alternos:**
- Credenciales inválidas → error
- Usuario no verificado → solicitar verificación

**Postcondiciones:** Usuario autenticado  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario registrado  
- **When** ingresa credenciales correctas  
- **Then** accede a dashboard correspondiente

**Colecciones Firebase:** `users`

---

#### RF-003: Diccionario Shuar-Español
**Descripción:** Búsqueda bidireccional de palabras  
**Actor:** Estudiante  
**Precondiciones:** Usuario autenticado  
**Flujo Básico:**
1. Usuario accede a diccionario
2. Ingresa palabra en Shuar o Español
3. Sistema busca en Firestore
4. Sistema muestra resultados con traducción, categoría, ejemplo de uso

**Flujos Alternos:**
- Sin resultados → sugerir palabras similares

**Postcondiciones:** Usuario visualiza traducción  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario en diccionario  
- **When** busca "machete"  
- **Then** muestra "machetes" con traducción y ejemplo

**Colecciones Firebase:** `dictionary`

---

#### RF-004: Lecciones Interactivas
**Descripción:** Lecciones estructuradas con ejercicios  
**Actor:** Estudiante  
**Precondiciones:** Usuario autenticado  
**Flujo Básico:**
1. Usuario selecciona lección
2. Sistema muestra contenido (texto, imágenes)
3. Usuario completa ejercicios
4. Sistema valida respuestas
5. Sistema muestra retroalimentación
6. Sistema actualiza progreso

**Flujos Alternos:**
- Respuesta incorrecta → mostrar corrección con explicación
- Lección bloqueada → completar prerequisitos

**Postcondiciones:** Progreso actualizado  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario en lección  
- **When** completa ejercicios correctamente  
- **Then** progreso guardado y siguiente lección desbloqueada

**Colecciones Firebase:** `lessons`, `user_progress`

---

#### RF-005: Biblioteca de Cuentos
**Descripción:** Acceso a cuentos en Shuar con traducción  
**Actor:** Estudiante  
**Precondiciones:** Usuario autenticado  
**Flujo Básico:**
1. Usuario accede a biblioteca
2. Sistema muestra lista de cuentos
3. Usuario selecciona cuento
4. Sistema muestra texto en Shuar
5. Usuario puede ver traducción al español

**Flujos Alternos:**
- Ninguno

**Postcondiciones:** Usuario lee cuento  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** usuario en biblioteca  
- **When** selecciona cuento  
- **Then** visualiza texto bilingüe

**Colecciones Firebase:** `stories`

---

#### RF-006: Juegos Educativos
**Descripción:** Juegos para reforzar vocabulario  
**Actor:** Estudiante  
**Precondiciones:** Usuario autenticado  
**Flujo Básico:**
1. Usuario selecciona juego
2. Sistema presenta desafío (matching, fill-in-blank, etc.)
3. Usuario responde
4. Sistema valida y muestra feedback inmediato
5. Sistema actualiza puntuación

**Flujos Alternos:**
- Respuesta incorrecta → mostrar corrección

**Postcondiciones:** Puntuación actualizada  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** usuario en juego  
- **When** completa actividad  
- **Then** recibe feedback y puntos

**Colecciones Firebase:** `games`, `user_scores`

---

#### RF-007: Retroalimentación Visual
**Descripción:** Corrección de errores con explicación clara  
**Actor:** Estudiante  
**Precondiciones:** Usuario completando ejercicio  
**Flujo Básico:**
1. Usuario comete error
2. Sistema identifica error
3. Sistema muestra palabra/frase correcta
4. Sistema explica el error con ejemplos

**Postcondiciones:** Usuario recibe corrección  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario con respuesta incorrecta  
- **When** sistema valida  
- **Then** muestra corrección con explicación clara

**Colecciones Firebase:** `lessons` (ejercicios incluyen explicaciones)

---

#### RF-008: Seguimiento de Progreso
**Descripción:** Dashboard con estadísticas de aprendizaje  
**Actor:** Estudiante  
**Precondiciones:** Usuario autenticado  
**Flujo Básico:**
1. Usuario accede a perfil
2. Sistema muestra lecciones completadas, puntuación, racha de estudio
3. Sistema muestra gráficos de progreso

**Postcondiciones:** Usuario visualiza progreso  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** usuario con actividad  
- **When** accede a perfil  
- **Then** visualiza estadísticas actualizadas

**Colecciones Firebase:** `user_progress`, `user_scores`

---

#### RF-009: Gestión de Diccionario (Admin)
**Descripción:** Vista administrativa para CRUD completo del diccionario  
**Actor:** Administrador  
**Precondiciones:** Usuario con rol admin  
**Flujo Básico:**
1. Admin accede a "Gestión de Diccionario"
2. Sistema muestra DataGrid con todas las palabras:
   - Columnas: Palabra Shuar, Español, Categoría, Ejemplos, Acciones
   - Filtros por categoría y búsqueda
   - Paginación
3. Admin puede realizar acciones:
   - **Crear:** Clic en "Agregar Palabra" → abre Dialog con formulario
   - **Editar:** Clic en icono editar → abre Dialog con datos precargados
   - **Eliminar:** Clic en icono eliminar → solicita confirmación
   - **Vista previa:** Ver cómo se muestra al estudiante
4. En formulario de palabra, admin ingresa:
   - Palabra en Shuar (requerido)
   - Traducción en Español (requerido)
   - Categoría (sustantivo, verbo, adjetivo, etc.)
   - Ejemplo en Shuar
   - Ejemplo en Español
5. Sistema valida y guarda en Firestore

**Flujos Alternos:**
- Eliminar palabra usada en lecciones → mostrar advertencia
- Palabra duplicada → mostrar error

**Postcondiciones:** Diccionario actualizado  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** admin en gestión de diccionario  
- **When** crea nueva palabra con datos válidos  
- **Then** palabra visible en diccionario para estudiantes

**Colecciones Firebase:** `dictionary`

---

#### RF-009b: Gestión de Cuentos (Admin)
**Descripción:** Vista administrativa para CRUD completo de cuentos  
**Actor:** Administrador  
**Precondiciones:** Usuario con rol admin  
**Flujo Básico:**
1. Admin accede a "Gestión de Cuentos"
2. Sistema muestra lista de cuentos con Cards:
   - Imagen de portada, título, categoría, autor
   - Opciones: Editar, Eliminar, Previsualizar
3. Admin puede realizar acciones:
   - **Crear:** Clic en "Agregar Cuento" → abre formulario
   - **Editar:** Clic en editar → abre formulario con datos
   - **Eliminar:** Solicita confirmación
   - **Previsualizar:** Ver cuento como lo verá estudiante
4. En formulario de cuento, admin ingresa:
   - Título (requerido)
   - Autor
   - Texto completo en Shuar (requerido)
   - Traducción completa en Español (requerido)
   - Categoría (leyenda, cuento, mito)
   - Imagen de portada (upload a Storage)
5. Sistema valida y guarda

**Flujos Alternos:**
- Error al subir imagen → permitir guardar sin imagen
- Cuento muy largo → advertir sobre rendimiento

**Postcondiciones:** Biblioteca de cuentos actualizada  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** admin en gestión de cuentos  
- **When** crea cuento con textos bilingües  
- **Then** cuento visible en biblioteca para estudiantes

**Colecciones Firebase:** `stories`, Storage para imágenes

---

#### RF-010: Gestión de Usuarios (Admin)
**Descripción:** Visualizar y gestionar usuarios  
**Actor:** Administrador  
**Precondiciones:** Usuario con rol admin  
**Flujo Básico:**
1. Admin accede a lista de usuarios
2. Sistema muestra usuarios con estadísticas
3. Admin puede desactivar/activar usuarios

**Postcondiciones:** Usuarios gestionados  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** admin en panel  
- **When** visualiza usuarios  
- **Then** ve lista con opciones de gestión

**Colecciones Firebase:** `users`

---

#### RF-011: Landing Page
**Descripción:** Página de inicio pública con información del proyecto  
**Actor:** Visitante (no autenticado)  
**Precondiciones:** Ninguna  
**Flujo Básico:**
1. Usuario accede a la URL raíz de la aplicación
2. Sistema muestra landing page con:
   - Descripción de EduShar y su propósito
   - Información sobre el idioma Shuar
   - Botones "Iniciar Sesión" y "Registrarse"
   - Características principales de la plataforma
3. Usuario hace clic en "Iniciar Sesión" o "Registrarse"
4. Sistema redirige a página correspondiente

**Flujos Alternos:**
- Usuario ya autenticado → redirigir a dashboard

**Postcondiciones:** Usuario visualiza información del proyecto  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario no autenticado  
- **When** accede a URL raíz  
- **Then** visualiza landing page con opciones de login/registro

**Colecciones Firebase:** Ninguna (página estática)

---

#### RF-012: Control de Acceso a Rutas Protegidas
**Descripción:** Protección de rutas que requieren autenticación  
**Actor:** Sistema  
**Precondiciones:** Usuario intenta acceder a ruta protegida  
**Flujo Básico:**
1. Usuario intenta acceder a ruta protegida (diccionario, lecciones, cuentos, juegos, perfil)
2. Sistema verifica estado de autenticación
3. Si usuario NO está autenticado:
   - Sistema guarda URL destino
   - Sistema redirige a página de login
   - Sistema muestra mensaje "Debes iniciar sesión para acceder"
4. Después de login exitoso, sistema redirige a URL destino guardada

**Flujos Alternos:**
- Usuario autenticado → permitir acceso directo
- Usuario sin rol adecuado (ej: estudiante intenta acceder a admin) → mostrar error 403

**Postcondiciones:** Solo usuarios autenticados acceden a contenido  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** usuario no autenticado  
- **When** intenta acceder a /diccionario  
- **Then** redirigido a /login con mensaje

**Colecciones Firebase:** `users` (verificación de rol)

---

#### RF-013: Página de Error 404
**Descripción:** Página personalizada para rutas no encontradas  
**Actor:** Usuario  
**Precondiciones:** Usuario accede a URL inexistente  
**Flujo Básico:**
1. Usuario accede a ruta que no existe
2. Sistema muestra página 404 con:
   - Mensaje amigable "Página no encontrada"
   - Ilustración o icono
   - Botón "Volver al inicio"
   - Botón "Ir al diccionario" (si está autenticado)
3. Usuario hace clic en botón
4. Sistema redirige a ruta correspondiente

**Flujos Alternos:**
- Ninguno

**Postcondiciones:** Usuario redirigido a página válida  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** usuario accede a /ruta-inexistente  
- **When** página no existe  
- **Then** muestra 404 personalizado con opciones de navegación

**Colecciones Firebase:** Ninguna

---

#### RF-014: Contribuciones de Usuarios
**Descripción:** Permitir a usuarios enviar contribuciones (palabras, cuentos, correcciones) para validación  
**Actor:** Estudiante  
**Precondiciones:** Usuario autenticado  
**Flujo Básico:**
1. Usuario accede a sección "Contribuir"
2. Selecciona tipo de contribución:
   - Nueva palabra para diccionario
   - Nuevo cuento/historia
   - Corrección de contenido existente
3. Completa formulario según tipo:
   - **Palabra:** Shuar, Español, categoría, ejemplo
   - **Cuento:** título, texto en Shuar, traducción español
   - **Corrección:** referencia al contenido, descripción del error, corrección sugerida
4. Usuario envía contribución
5. Sistema guarda en colección `contributions` con estado "pending"
6. Sistema muestra mensaje "Contribución enviada. Será revisada por un administrador"

**Flujos Alternos:**
- Campos incompletos → mostrar errores de validación
- Usuario cancela → descartar borrador

**Postcondiciones:** Contribución guardada para revisión  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** usuario autenticado  
- **When** envía nueva palabra con datos completos  
- **Then** contribución guardada con estado "pending"

**Colecciones Firebase:** `contributions`

---

#### RF-015: Gestión de Lecciones (Admin)
**Descripción:** Vista administrativa para crear, editar y organizar lecciones  
**Actor:** Administrador  
**Precondiciones:** Usuario con rol admin  
**Flujo Básico:**
1. Admin accede a "Gestión de Lecciones"
2. Sistema muestra lista de lecciones con:
   - Título, nivel, orden, estado (publicada/borrador)
   - Opciones: Editar, Eliminar, Previsualizar, Cambiar orden
3. Admin selecciona acción:
   - **Crear nueva:** Abre formulario de creación
   - **Editar:** Abre editor de lección
   - **Cambiar orden:** Permite arrastrar/soltar para reordenar
4. En editor de lección, admin puede:
   - Definir título, descripción, nivel
   - Agregar secciones de contenido (texto, imágenes)
   - Crear ejercicios (opción múltiple, llenar espacios, emparejar)
   - Establecer prerequisitos
   - Guardar como borrador o publicar
5. Sistema valida y guarda cambios

**Flujos Alternos:**
- Eliminar lección con progreso de usuarios → mostrar advertencia y confirmar
- Cambiar prerequisitos → validar que no cree dependencias circulares

**Postcondiciones:** Lecciones actualizadas  
**Prioridad:** Must Have  
**Criterios de Aceptación:**
- **Given** admin en gestión de lecciones  
- **When** crea nueva lección con ejercicios  
- **Then** lección guardada y visible para estudiantes si está publicada

**Colecciones Firebase:** `lessons`

---

#### RF-016: Revisión de Contribuciones (Admin)
**Descripción:** Panel para que admin revise y apruebe/rechace contribuciones de usuarios  
**Actor:** Administrador  
**Precondiciones:** Usuario con rol admin  
**Flujo Básico:**
1. Admin accede a "Contribuciones Pendientes"
2. Sistema muestra lista de contribuciones con estado "pending"
3. Admin selecciona contribución para revisar
4. Sistema muestra detalles completos y datos del usuario contribuyente
5. Admin puede:
   - **Aprobar:** Contenido se agrega a colección correspondiente (dictionary, stories)
   - **Rechazar:** Marca como rechazada con motivo
   - **Solicitar cambios:** Envía feedback al usuario
6. Sistema actualiza estado de contribución
7. Sistema notifica al usuario sobre decisión

**Flujos Alternos:**
- Aprobar con modificaciones → admin edita antes de aprobar

**Postcondiciones:** Contribución procesada  
**Prioridad:** Should Have  
**Criterios de Aceptación:**
- **Given** admin revisando contribución  
- **When** aprueba nueva palabra  
- **Then** palabra agregada a diccionario y usuario notificado

**Colecciones Firebase:** `contributions`, `dictionary`, `stories`

---

### 3.2 Requisitos No Funcionales

#### RNF-001: Rendimiento - Tiempo de Carga
**Descripción:** La aplicación debe cargar la página inicial en < 3 segundos en conexión 3G  
**Métrica:** Lighthouse Performance Score > 80  
**Prioridad:** Must Have

#### RNF-002: Rendimiento - Búsqueda en Diccionario
**Descripción:** Resultados de búsqueda en < 500ms  
**Métrica:** Medición con Firestore queries indexadas  
**Prioridad:** Must Have

#### RNF-003: Seguridad - Autenticación
**Descripción:** Contraseñas con mínimo 8 caracteres, 1 mayúscula, 1 número  
**Métrica:** Validación en formulario + Firebase Auth rules  
**Prioridad:** Must Have

#### RNF-004: Seguridad - Firestore Rules
**Descripción:** Usuarios solo acceden a sus datos, admins a todo  
**Métrica:** Firestore Security Rules implementadas y testeadas  
**Prioridad:** Must Have

#### RNF-005: Usabilidad - Navegación
**Descripción:** Usuario encuentra cualquier función en ≤ 3 clics  
**Métrica:** Testing de usabilidad  
**Prioridad:** Should Have

#### RNF-006: Usabilidad - Mensajes de Error
**Descripción:** Errores en español claro, sin tecnicismos  
**Métrica:** Revisión de UX  
**Prioridad:** Must Have

#### RNF-007: Accesibilidad - WCAG 2.1
**Descripción:** Cumplir WCAG 2.1 nivel AA  
**Métrica:** Lighthouse Accessibility Score > 90  
**Prioridad:** Should Have

#### RNF-008: Accesibilidad - Navegación por Teclado
**Descripción:** Todas las funciones accesibles por teclado  
**Métrica:** Testing manual  
**Prioridad:** Should Have

#### RNF-009: Disponibilidad
**Descripción:** 99.5% uptime (dependiente de Firebase)  
**Métrica:** Firebase Status Dashboard  
**Prioridad:** Should Have

#### RNF-010: Compatibilidad - Navegadores
**Descripción:** Funcional en Chrome, Firefox, Safari, Edge (últimas 2 versiones)  
**Métrica:** Testing cross-browser  
**Prioridad:** Must Have

#### RNF-011: Compatibilidad - Responsive
**Descripción:** Diseño responsive para móvil, tablet, desktop  
**Métrica:** Testing en viewports 320px, 768px, 1920px  
**Prioridad:** Must Have

#### RNF-012: Mantenibilidad - Código
**Descripción:** Componentes React reutilizables, código documentado  
**Métrica:** Code review  
**Prioridad:** Should Have

#### RNF-013: Auditoría - Logs
**Descripción:** Registrar acciones de admin (creación/edición/eliminación)  
**Métrica:** Colección `audit_logs` en Firestore  
**Prioridad:** Could Have

---

### 3.3 Requisitos de Interfaz

#### 3.3.1 Navegación Principal
- **AppBar** (MUI): Logo, menú, perfil de usuario
- **Drawer** (MUI): Navegación lateral con secciones
  - **Estudiantes:** Diccionario, Lecciones, Cuentos, Juegos, Perfil, Contribuir
  - **Admin:** Dashboard Admin, Diccionario, Cuentos, Lecciones, Contribuciones, Usuarios
- **Breadcrumbs** (MUI): Ubicación actual

#### 3.3.2 Pantallas Principales
1. **Landing Page:** Hero section, características, botones CTA (Call-to-Action)
2. **Login/Registro:** TextField, Button, Link
3. **Dashboard:** Grid con Cards de acceso rápido
4. **Diccionario:** TextField (búsqueda), List/DataGrid (resultados)
5. **Lecciones:** Stepper (progreso), Typography, Button, TextField (ejercicios)
6. **Cuentos:** Card (lista), Dialog (lectura), ToggleButton (Shuar/Español)
7. **Juegos:** Card (selección), Dialog (juego), Chip (puntuación)
8. **Perfil:** Avatar, Typography, LinearProgress (progreso)
9. **Contribuir:** Tabs (tipo de contribución), Form, Button
10. **Admin - Dashboard:** Cards con acceso a gestión
11. **Admin - Gestión de Diccionario:** DataGrid, Dialog (CRUD), filtros
12. **Admin - Gestión de Cuentos:** Cards, Dialog (CRUD), FileUpload
13. **Admin - Gestión de Lecciones:** DataGrid, Editor, Drag & Drop
14. **Admin - Contribuciones Pendientes:** List, Dialog (revisión), Botones
15. **Admin - Gestión de Usuarios:** DataGrid, opciones activar/desactivar
16. **404 Error:** Typography, Button, ilustración/icono

#### 3.3.3 Componentes MUI Sugeridos
- AppBar, Drawer, Toolbar
- Card, CardContent, CardActions
- TextField, Button, IconButton
- Dialog, DialogTitle, DialogContent
- DataGrid (MUI X)
- Stepper, Step, StepLabel
- Chip, Badge, Avatar
- Alert, Snackbar (notificaciones)
- LinearProgress, CircularProgress

#### 3.3.4 Mensajes y Validaciones
- **Landing:** "Aprende el idioma Shuar de forma interactiva"
- **Registro:** "El email ya está registrado", "La contraseña debe tener al menos 8 caracteres", "Debes ser mayor de 13 años", "Fecha de nacimiento inválida"
- **Login:** "Credenciales incorrectas", "Debes iniciar sesión para acceder"
- **Diccionario:** "No se encontraron resultados para '[palabra]'"
- **Lecciones:** "¡Correcto!", "Incorrecto. La respuesta correcta es '[respuesta]'"
- **Cuentos:** "Cargando cuento..."
- **Contribuir:** "Contribución enviada. Será revisada por un administrador", "Completa todos los campos requeridos"
- **Admin:** "Contenido guardado exitosamente", "Error al subir archivo"
- **Admin - Contribuciones:** "Contribución aprobada", "Contribución rechazada", "Feedback enviado al usuario"
- **404:** "Página no encontrada", "La página que buscas no existe"
- **403:** "Acceso denegado", "No tienes permisos para acceder a esta página"

---

### 3.4 Principios de UI/UX y Diseño de Interacción

Esta sección define los principios de diseño que deben guiar el desarrollo de la interfaz de EduShar, basados en las mejores prácticas de UI/UX y los **7 principios fundamentales de Don Norman** para el diseño de interacción.

#### 3.4.1 Principios de Don Norman Aplicados a EduShar

##### 1. Visibilidad (Visibility)
**Principio:** Las funciones importantes deben ser visibles y fáciles de descubrir.

**Aplicación en EduShar:**
- **Navegación principal:** Menú lateral (Drawer) siempre accesible con iconos + texto para Diccionario, Lecciones, Cuentos, Juegos
- **Progreso de lecciones:** Barra de progreso visible en todo momento durante una lección (Stepper de MUI)
- **Acciones disponibles:** Botones de acción (Siguiente, Enviar, Buscar) siempre visibles sin necesidad de scroll
- **Indicadores de estado:** Badges que muestren lecciones completadas, nuevas palabras aprendidas

**Requisitos relacionados:** RF-003, RF-004, RNF-005

---

##### 2. Retroalimentación (Feedback)
**Principio:** El sistema debe informar al usuario sobre el resultado de sus acciones inmediatamente.

**Aplicación en EduShar:**
- **Ejercicios:** Feedback inmediato al responder (✓ verde para correcto, ✗ rojo para incorrecto)
- **Carga de contenido:** CircularProgress o LinearProgress durante carga de lecciones/cuentos
- **Guardado de progreso:** Snackbar confirmando "Progreso guardado" después de completar lección
- **Errores de formulario:** Mensajes de error en tiempo real bajo cada campo (TextField con helperText)
- **Acciones admin:** Alert de éxito/error al crear/editar/eliminar contenido
- **Búsqueda en diccionario:** Mensaje "Buscando..." y "X resultados encontrados"

**Requisitos relacionados:** RF-007, RNF-006

---

##### 3. Mapeo (Mapping)
**Principio:** Relación clara entre controles y sus efectos. El diseño debe reflejar el modelo mental del usuario.

**Aplicación en EduShar:**
- **Navegación intuitiva:** Estructura de menú que refleja el flujo de aprendizaje (Diccionario → Lecciones → Práctica con Juegos)
- **Toggle Shuar/Español:** Switch claramente etiquetado para alternar entre idiomas en cuentos
- **Progreso de lecciones:** Stepper horizontal que muestra secuencia lógica (Introducción → Vocabulario → Ejercicios → Evaluación)
- **Niveles de dificultad:** Representación visual (estrellas, colores) que mapea fácil=verde, medio=amarillo, difícil=rojo
- **Breadcrumbs:** Ruta de navegación que refleja jerarquía (Inicio > Lecciones > Nivel 1 > Lección 1)

**Requisitos relacionados:** RF-004, RF-005, RNF-005

---

##### 4. Restricciones (Constraints)
**Principio:** Limitar las acciones posibles para prevenir errores y guiar al usuario.

**Aplicación en EduShar:**
- **Lecciones bloqueadas:** Deshabilitar lecciones avanzadas hasta completar prerequisitos (Button disabled con Tooltip explicativo)
- **Validación de formularios:** Campos de contraseña con requisitos mínimos (8 caracteres, 1 mayúscula, 1 número)
- **Roles de usuario:** Estudiantes no pueden acceder a panel admin (rutas protegidas)
- **Límite de intentos:** Máximo 3 intentos por ejercicio antes de mostrar respuesta correcta
- **Formato de archivos:** Admin solo puede subir JPG/PNG para imágenes
- **Campos obligatorios:** TextField con asterisco (*) y validación que impide envío sin completar
- **Desactivación temporal:** Botón "Enviar" deshabilitado mientras se procesa la respuesta

**Requisitos relacionados:** RF-001, RF-004, RNF-003, RNF-004

---

##### 5. Consistencia (Consistency)
**Principio:** Elementos similares deben verse y comportarse de manera similar en toda la aplicación.

**Aplicación en EduShar:**
- **Tema MUI unificado:** Paleta de colores, tipografía, espaciado consistente en toda la app
- **Patrones de botones:** 
  - Botón primario (contained) para acción principal
  - Botón secundario (outlined) para acciones secundarias
  - Botón de texto (text) para cancelar
- **Iconografía:** Mismo icono para misma función (🔊 siempre para audio, ✏️ para editar, 🗑️ para eliminar)
- **Mensajes de error:** Formato consistente "Error: [descripción clara]" en Alert rojo
- **Mensajes de éxito:** Alert verde con icono ✓
- **Layout de cards:** Todas las cards de lecciones/cuentos/juegos con misma estructura (imagen arriba, título, descripción, botón de acción)
- **Terminología:** Usar siempre "Lección" (no alternar con "Clase" o "Curso")

**Requisitos relacionados:** RNF-005, RNF-012

---

##### 6. Affordances
**Principio:** Las propiedades de un objeto deben sugerir cómo usarlo.

**Aplicación en EduShar:**
- **Botones:** Apariencia elevada (elevation) que invita a hacer clic
- **Campos de texto:** Borde y cursor que indica que se puede escribir
- **Cards interactivas:** Efecto hover (elevación, cambio de color) que indica que son clicables
- **Links:** Texto subrayado en color primario que indica navegación
- **Drag & drop (admin):** Área de carga de archivos con borde punteado y texto "Arrastra archivos aquí"
- **Sliders/Steppers:** Controles que visualmente sugieren movimiento horizontal
- **Toggle buttons:** Apariencia de interruptor que sugiere cambio de estado

**Requisitos relacionados:** RF-003, RF-005, RF-009

---

##### 7. Signifiers (Señalizadores)
**Principio:** Señales que comunican dónde debe ocurrir la acción.

**Aplicación en EduShar:**
- **Indicadores de interacción:**
  - Cursor pointer sobre elementos clicables
  - Subrayado en hover sobre links
  - Ripple effect en botones MUI al hacer clic
- **Estados visuales:**
  - Badge "Nuevo" en lecciones recién agregadas
  - Chip "Completado" en lecciones terminadas
  - Icono de candado 🔒 en lecciones bloqueadas
- **Guías visuales:**
  - Placeholder text en campos de búsqueda: "Buscar palabra en Shuar o Español..."
  - Tooltips en iconos para clarificar acciones
  - Helper text bajo campos: "Mínimo 8 caracteres"
- **Indicadores de progreso:**
  - Stepper con pasos completados en verde, actual en azul, pendientes en gris
  - LinearProgress que muestra % de lección completada
- **Señales de error:**
  - Borde rojo en campos con error
  - Icono ⚠️ junto a mensajes de error

**Requisitos relacionados:** RF-004, RF-007, RNF-006

---

#### 3.4.2 Principios Adicionales de UI/UX

##### Jerarquía Visual
- **Títulos:** Typography variant="h4" para títulos de página, "h5" para secciones
- **Contenido principal:** Mayor tamaño y peso que contenido secundario
- **Llamados a acción:** Botones primarios con mayor contraste y tamaño

##### Espacio en Blanco
- **Respiración:** Spacing de MUI (theme.spacing) para separación consistente
- **Agrupación:** Elementos relacionados más cercanos que elementos no relacionados
- **Legibilidad:** Máximo 80 caracteres por línea en textos largos (cuentos)

##### Accesibilidad (WCAG 2.1 AA)
- **Contraste:** Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Tamaño de fuente:** Mínimo 16px para cuerpo de texto
- **Áreas de toque:** Mínimo 44x44px para elementos interactivos (móvil)
- **Navegación por teclado:** Focus visible en todos los elementos interactivos
- **Alt text:** Descripciones en todas las imágenes
- **ARIA labels:** En iconos sin texto

##### Diseño Responsive
- **Mobile-first:** Diseño optimizado para móvil, luego adaptado a desktop
- **Breakpoints MUI:**
  - xs: 0-600px (móvil)
  - sm: 600-960px (tablet)
  - md: 960-1280px (desktop pequeño)
  - lg: 1280-1920px (desktop)
- **Navegación adaptativa:** Drawer permanente en desktop, temporal en móvil

##### Microinteracciones
- **Transiciones suaves:** Fade in/out, slide, grow (MUI Transitions)
- **Animaciones de carga:** Skeleton screens para contenido que carga
- **Confirmación visual:** Animación de check ✓ al completar lección
- **Gamificación:** Animación de confeti al alcanzar logros

---

#### 3.4.3 Guía de Estilo Visual (Propuesta)

##### Paleta de Colores
```javascript
// Tema principal (inspirado en cultura Shuar - tonos cálidos y tierra)
primary: {
  main: '#F7E8C7',      // Beige claro (fondo principal, elementos suaves)
  light: '#FFFBF0',     // Variante más clara
  dark: '#E5D6B5'       // Variante más oscura
}
secondary: {
  main: '#D19A4A',      // Dorado/mostaza (botones, énfasis)
  light: '#E0B76A',
  dark: '#B8823A'
}
accent: {
  main: '#FED7AE',      // Melocotón/durazno (acentos, highlights)
  light: '#FFECD6',
  dark: '#F5C89E'
}
text: {
  primary: '#442A2A',   // Marrón oscuro (texto principal)
  secondary: '#6B4E4E', // Marrón medio (texto secundario)
  disabled: '#9E8080'   // Marrón claro (texto deshabilitado)
}
background: {
  default: '#F7E8C7',   // Primary main
  paper: '#FFFFFF'      // Blanco para cards y superficies
}
error: {
  main: '#C84B31'       // Terracota para errores
}
success: {
  main: '#4CAF50'       // Verde estándar MUI
}
warning: {
  main: '#FF9800'       // Naranja estándar MUI
}
```

**Uso de colores:**
- **Primary (#F7E8C7):** Fondos principales, áreas grandes
- **Secondary (#D19A4A):** Botones primarios, enlaces, elementos interactivos
- **Accent (#FED7AE):** Highlights, badges, elementos de énfasis
- **Text (#442A2A):** Todo el texto principal para máxima legibilidad
- **Success (#4CAF50):** Mensajes de éxito, confirmaciones
- **Warning (#FF9800):** Advertencias, alertas

##### Tipografía
```javascript
fontFamily: "'Roboto', 'Arial', sans-serif"
// Alternativa: 'Inter' para mayor legibilidad

h1: { fontSize: '2.5rem', fontWeight: 500 }
h4: { fontSize: '2rem', fontWeight: 500 }    // Títulos de página
h5: { fontSize: '1.5rem', fontWeight: 500 }  // Subtítulos
body1: { fontSize: '1rem', lineHeight: 1.5 } // Texto normal
body2: { fontSize: '0.875rem' }              // Texto secundario
```

##### Iconografía
- **Biblioteca:** Material Icons (incluida en MUI)
- **Tamaño estándar:** 24px
- **Consistencia:** Mismo estilo (filled, outlined, rounded) en toda la app

---

#### 3.4.4 Matriz de Aplicación de Principios por Pantalla

| Pantalla | Visibilidad | Feedback | Mapeo | Restricciones | Consistencia | Affordances | Signifiers |
|----------|-------------|----------|-------|---------------|--------------|-------------|------------|
| **Landing** | Hero destacado | Hover en botones | CTA claro | Solo público | Tema principal | Botones grandes | "Comenzar ahora" |
| **Login** | Formulario centrado | Error en tiempo real | Email→contraseña→login | Validación campos | Botón primario | TextField clickable | Placeholder text |
| **Diccionario** | Barra búsqueda arriba | "X resultados" | Búsqueda→resultados | Solo texto válido | Cards uniformes | Cards clicables | Resultados destacados |
| **Lecciones** | Stepper progreso | Correcto/Incorrecto | Secuencia lógica | Prerequisitos | Ejercicios similares | Botones acción | Badge "Bloqueado" |
| **Cuentos** | Lista cards | Loading spinner | Grid→detalle | Solo lectura | Layout cards | Hover effect | Toggle Shuar/ES |
| **Juegos** | Opciones claras | Puntos inmediatos | Pregunta→respuesta | Tiempo límite | Mismo formato | Botones grandes | Timer visible |
| **Admin** | DataGrid completo | Confirmación guardado | CRUD estándar | Solo admin | Dialogs uniformes | Botón "Agregar" | Iconos editar/eliminar |
| **404** | Mensaje centrado | Ninguno | Botón→home | Ninguna | Tema principal | Botón destacado | "Volver al inicio" |

---

### 3.5 Modelo de Datos (Firebase)

#### 3.5.1 Colecciones Firestore

**users**
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,
  firstName: string,        // Nombre
  lastName: string,         // Apellidos
  birthdate: timestamp,     // Fecha de nacimiento
  role: "student" | "admin",
  createdAt: timestamp,
  lastLogin: timestamp,
  photoURL: string | null
}
```
**Índices:** uid, email, role

---

**dictionary**
```javascript
{
  id: string,
  wordShuar: string,
  wordSpanish: string,
  category: string,         // sustantivo, verbo, adjetivo
  exampleShuar: string,
  exampleSpanish: string,
  createdBy: string,        // admin uid
  createdAt: timestamp
}
```
**Índices:** wordShuar, wordSpanish (para búsqueda)

---

**lessons**
```javascript
{
  id: string,
  title: string,
  description: string,
  level: number,            // 1-10
  order: number,
  content: {
    sections: [
      {
        type: "text" | "image",
        content: string,
        imageURL?: string
      }
    ]
  },
  exercises: [
    {
      type: "multiple_choice" | "fill_blank" | "matching",
      question: string,
      options?: string[],
      correctAnswer: string,
      explanation: string
    }
  ],
  prerequisite: string | null, // lesson id
  createdAt: timestamp
}
```
**Índices:** level, order

---

**stories**
```javascript
{
  id: string,
  title: string,
  author: string,
  textShuar: string,
  textSpanish: string,
  coverImageURL: string | null,
  category: string,         // leyenda, cuento, mito
  createdAt: timestamp
}
```

---

**user_progress**
```javascript
{
  id: string,               // userId_lessonId
  userId: string,
  lessonId: string,
  completed: boolean,
  score: number,            // 0-100
  attempts: number,
  lastAttempt: timestamp,
  completedAt: timestamp | null
}
```
**Índices:** userId, lessonId, completed

---

**user_scores**
```javascript
{
  id: string,               // userId_gameId_timestamp
  userId: string,
  gameId: string,
  score: number,
  playedAt: timestamp
}
```
**Índices:** userId, gameId

---

**games**
```javascript
{
  id: string,
  name: string,
  type: "vocabulary_match" | "word_scramble" | "quiz",
  difficulty: "easy" | "medium" | "hard",
  content: object,          // Estructura según tipo de juego
  createdAt: timestamp
}
```

---

**contributions**
```javascript
{
  id: string,
  userId: string,           // Usuario que contribuyó
  type: "word" | "story" | "correction",
  status: "pending" | "approved" | "rejected" | "changes_requested",
  submittedAt: timestamp,
  reviewedAt: timestamp | null,
  reviewedBy: string | null, // admin uid
  
  // Campos específicos por tipo
  wordData?: {              // Si type === "word"
    wordShuar: string,
    wordSpanish: string,
    category: string,
    exampleShuar: string,
    exampleSpanish: string
  },
  
  storyData?: {             // Si type === "story"
    title: string,
    author: string,
    textShuar: string,
    textSpanish: string,
    category: string
  },
  
  correctionData?: {        // Si type === "correction"
    contentType: "word" | "story" | "lesson",
    contentId: string,
    errorDescription: string,
    suggestedCorrection: string
  },
  
  adminNotes: string | null, // Feedback del admin
  rejectionReason: string | null
}
```
**Índices:** userId, status, type, submittedAt

---

**audit_logs** (opcional)
```javascript
{
  id: string,
  adminId: string,
  action: "create" | "update" | "delete",
  collection: string,
  documentId: string,
  timestamp: timestamp,
  changes: object
}
```

---

#### 3.5.2 Firebase Storage
```
/images/
  /stories/
    /{storyId}_cover.jpg
  /lessons/
    /{lessonId}/{imageId}.jpg
/user_uploads/
  /{userId}/
    /profile.jpg
```

---

#### 3.5.3 Reglas de Seguridad (Alto Nivel)

**Firestore Rules:**
```javascript
// users: lectura propia, admin lee todo
// dictionary: lectura todos, escritura admin
// lessons: lectura todos, escritura admin
// stories: lectura todos, escritura admin
// user_progress: lectura/escritura propia
// user_scores: lectura/escritura propia
// games: lectura todos, escritura admin
```

**Storage Rules:**
```javascript
// images: lectura todos, escritura admin
// user_uploads: lectura/escritura propia
```

---

### 3.6 Casos de Uso

#### UC-001: Aprender Vocabulario con Diccionario
**Actor:** Estudiante  
**Objetivo:** Buscar y aprender palabras nuevas  
**Flujo:**
1. Usuario accede a diccionario
2. Busca "machete"
3. Sistema muestra "machetes" con ejemplo de uso
4. Usuario guarda palabra en favoritos (opcional)

**Alternos:**
- Palabra no existe → sugerir agregar

---

#### UC-002: Completar Lección
**Actor:** Estudiante  
**Objetivo:** Aprender contenido estructurado  
**Flujo:**
1. Usuario selecciona lección nivel 1
2. Lee contenido con imágenes
3. Completa ejercicios
4. Recibe retroalimentación
5. Sistema marca lección como completada
6. Desbloquea siguiente lección

**Alternos:**
- Falla ejercicio → puede reintentar

---

#### UC-003: Leer Cuento Bilingüe
**Actor:** Estudiante  
**Objetivo:** Practicar lectura en contexto  
**Flujo:**
1. Usuario accede a biblioteca
2. Selecciona cuento
3. Lee en Shuar
4. Alterna a traducción español

---

#### UC-004: Agregar Palabra al Diccionario
**Actor:** Administrador  
**Objetivo:** Expandir vocabulario disponible  
**Flujo:**
1. Admin accede a panel
2. Selecciona "Diccionario"
3. Clic en "Agregar palabra"
4. Completa formulario (Shuar, Español, categoría, ejemplo)
5. Guarda

**Alternos:**
- Ninguno

---

#### UC-005: Acceder desde Landing Page
**Actor:** Visitante  
**Objetivo:** Conocer la plataforma y registrarse  
**Flujo:**
1. Usuario accede a www.edushar.com
2. Visualiza landing page con información del proyecto
3. Lee características principales
4. Hace clic en "Registrarse"
5. Sistema redirige a formulario de registro
6. Usuario completa registro
7. Sistema redirige a dashboard

**Alternos:**
- Usuario hace clic en "Iniciar Sesión" → redirige a login

---

#### UC-006: Intento de Acceso sin Autenticación
**Actor:** Visitante  
**Objetivo:** Intentar acceder a contenido protegido  
**Flujo:**
1. Usuario no autenticado intenta acceder a /lecciones
2. Sistema detecta falta de autenticación
3. Sistema guarda URL destino (/lecciones)
4. Sistema redirige a /login
5. Sistema muestra mensaje "Debes iniciar sesión para acceder"
6. Usuario inicia sesión exitosamente
7. Sistema redirige automáticamente a /lecciones

**Alternos:**
- Usuario cancela login → permanece en landing page

---

## 4. Trazabilidad

| Insight de Entrevista | Requisito |
|----------------------|-----------|
| "Más en pronunciar" (Entrevista 3) | RF-003, RF-007 (diccionario con ejemplos y retroalimentación visual) |
| "Los videos, los cursos, las charlas" (Entrevista 3) | RF-004 (lecciones con multimedia) |
| "Las aplicaciones, los juegos" (Entrevista 3) | RF-006 (juegos educativos) |
| "Aprendí de mis padres" (Entrevista 2, Audio 4) | RF-005 (cuentos para transmitir cultura) |
| "Celulares, tecnología afecta" (Entrevista 2, Estrevista 1) | RF-006 (gamificación para competir con tecnología) |
| "Libros, diccionario" (Audio 29, Audio 30-3) | RF-003 (diccionario digital) |
| "Clases virtuales" (Audio 29) | RF-004 (lecciones estructuradas) |
| "Corregir" (Audio 30-2, Audio 30-3) | RF-007 (retroalimentación visual clara) |
| "Enseñar desde chiquitos" (Audio 30-4) | RNF-011 (accesibilidad para niños) |
| "Falta de tiempo" (Audio 29, Audio 30-2) | RNF-005 (usabilidad simple) |
| "No hay materiales" (múltiples) | RF-009 (admin crea contenido) |
| "Hablar y escribir" (Audio 30-5) | RF-004, RF-007 (ejercicios multimodales) |

---

## 5. Anexos

### 5.1 Hallazgos Principales de Entrevistas

**Problemas Identificados:**
1. **Pérdida del idioma:** Jóvenes prefieren tecnología/español sobre Shuar
2. **Falta de materiales:** Pocos recursos digitales disponibles
3. **Dificultad de pronunciación:** Mayor barrera de aprendizaje
4. **Falta de tiempo:** Adultos no pueden asistir a clases presenciales
5. **Desconexión generacional:** Abuelos hablan, nietos no

**Necesidades Expresadas:**
1. **Plataforma digital:** Accesible desde cualquier lugar
2. **Contenido cultural:** Cuentos, leyendas, historias tradicionales
3. **Gamificación:** Juegos para motivar a jóvenes
4. **Retroalimentación clara:** Correcciones con explicaciones visuales
5. **Libros/diccionarios digitales:** Traducción rápida
6. **Clases virtuales/lecciones:** Aprendizaje estructurado

**Preferencias de Aprendizaje:**
- **Visual:** Imágenes, textos claros, ejemplos
- **Práctico:** Ejercicios, juegos
- **Contextual:** Cuentos, ejemplos de uso

---

### 5.2 Preguntas Abiertas

1. **Contenido Inicial:**
   - ¿Cuántas palabras debe tener el diccionario en MVP?
   - ¿Cuántas lecciones y de qué temas?
   - ¿Qué cuentos específicos incluir?

2. **Autenticación:**
   - ¿Se requiere Google Sign-In además de email/password?
   - ¿Verificación de email obligatoria?

3. **Gamificación:**
   - ¿Qué tipos de juegos priorizar? (matching, quiz, word scramble)
   - ¿Sistema de puntos/badges/leaderboard?

4. **Roles:**
   - ¿Habrá rol "profesor" además de admin/estudiante?
   - ¿Usuarios pueden sugerir palabras para el diccionario?

5. **Monetización:**
   - ¿Modelo freemium o totalmente gratuito?
   - ¿Límites de uso en free tier de Firebase?

---

### 5.3 Riesgos y Supuestos Críticos

**Riesgos:**
1. **Contenido:** Falta de hablantes nativos para validar contenido escrito
2. **Técnico:** Límites de Firebase free tier
3. **Adopción:** Usuarios objetivo tienen acceso limitado a internet
4. **Calidad:** Contenido textual con errores afecta aprendizaje

**Supuestos:**
1. Existe comunidad Shuar dispuesta a colaborar con contenido
2. Usuarios tienen dispositivos con navegador moderno
3. Administradores tienen conocimiento técnico básico para usar panel
4. Firebase es suficiente para escala inicial (< 10,000 usuarios)

**Mitigaciones:**
1. Colaborar con comunidades Shuar para validar contenido
2. Optimizar uso de Firebase (caché, lazy loading)
3. Diseño offline-first para futuras versiones
4. Establecer proceso de revisión de contenido por hablantes nativos

---

## Fin del Documento

**Aprobaciones:**
- [ ] Product Owner
- [ ] Equipo de Desarrollo
- [ ] Representantes Comunidad Shuar
- [ ] Stakeholders

**Próximos Pasos:**
1. Revisión y aprobación del SRS
2. Diseño de UI/UX (wireframes, mockups)
3. Configuración de Firebase
4. Desarrollo de MVP (RF Must Have)
5. Testing con usuarios reales
6. Iteración basada en feedback
