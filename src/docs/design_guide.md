# Guía de Diseño EduShar

Documento de referencia para el diseño y desarrollo de componentes en EduShar. Todos los componentes nuevos deben seguir estas directrices.

---

## 🎨 Paleta de Colores

> [!IMPORTANT]
> **SIEMPRE usa los colores definidos en los archivos del tema. NO uses colores hardcodeados.**

### Ubicación de los Colores del Tema

Los colores están definidos en:
- **Tema Claro**: [`src/theme/lightTheme.jsx`](file:///Users/angelsarango/Documents/Universidad/Septimo/HCI/EduShuar/Edushar/src/theme/lightTheme.jsx)
- **Tema Oscuro**: [`src/theme/darkTheme.jsx`](file:///Users/angelsarango/Documents/Universidad/Septimo/HCI/EduShuar/Edushar/src/theme/darkTheme.jsx)

### Cómo Usar los Colores del Tema

**✅ CORRECTO - Usar colores del tema:**
```jsx
// En componentes MUI
<Box sx={{ bgcolor: 'primary.main', color: 'text.primary' }}>

// En componentes MUI con useTheme
import { useTheme } from '@mui/material';
const theme = useTheme();
<Box sx={{ bgcolor: theme.palette.primary.main }}>

// Para colores secundarios
<Typography sx={{ color: 'secondary.main' }}>

// Para colores de fondo
<Paper sx={{ bgcolor: 'background.paper' }}>

// Para colores de texto
<Typography sx={{ color: 'text.secondary' }}>

// Para colores semánticos
<Alert severity="success" sx={{ bgcolor: 'success.main' }}>
```

**❌ INCORRECTO - Colores hardcodeados:**
```jsx
// NO HACER ESTO
<Box sx={{ bgcolor: '#F7E8C7', color: '#442A2A' }}>
<Typography sx={{ color: '#D19A4A' }}>
```

### Colores Disponibles en el Tema

Consulta siempre [`src/theme/lightTheme.jsx`](file:///Users/angelsarango/Documents/Universidad/Septimo/HCI/EduShuar/Edushar/src/theme/lightTheme.jsx) para ver los colores actuales. Los principales son:

- `primary.main` / `primary.light` / `primary.dark`
- `secondary.main` / `secondary.light` / `secondary.dark`
- `accent.main` / `accent.light` / `accent.dark`
- `text.primary` / `text.secondary` / `text.disabled`
- `background.default` / `background.paper`
- `error.main` / `success.main` / `warning.main`

---

## 📐 Principios de Don Norman

### 1. **Visibilidad (Visibility)**

> Los elementos importantes deben ser claramente visibles

**Reglas de Implementación:**
- ✅ Usar tamaños de fuente diferenciados (h2 > h4 > h6 > body1)
- ✅ Elementos interactivos deben tener `elevation` o `boxShadow`
- ✅ Información crítica debe usar colores contrastantes
- ✅ Badges y chips para destacar estados importantes
- ❌ No ocultar acciones principales en menús desplegables
- ❌ No usar texto gris claro sobre fondos claros

**Ejemplo:**
```jsx
// ✅ CORRECTO - Botón principal visible
<Button
  variant="contained"
  size="large"
  sx={{
    px: 5,
    py: 2.5,
    fontSize: '1.25rem',
    fontWeight: 'bold',
    boxShadow: 4,
  }}
>
  Continuar Aprendiendo
</Button>

// ❌ INCORRECTO - Botón poco visible
<Button variant="text" size="small">
  Continuar
</Button>
```

---

### 2. **Affordances (Posibilidades de Acción)**

> Los elementos deben sugerir cómo usarlos

**Reglas de Implementación:**
- ✅ Botones deben parecer clickeables (elevación, bordes redondeados)
- ✅ Links deben estar subrayados o coloreados
- ✅ Campos de entrada deben tener bordes visibles
- ✅ Iconos deben ser reconocibles y estándar
- ❌ No usar texto plano para acciones clickeables
- ❌ No hacer que elementos no-interactivos parezcan botones

**Ejemplo:**
```jsx
// ✅ CORRECTO - Card claramente clickeable
<Card
  elevation={2}
  sx={{
    borderRadius: 3,
    border: '2px solid',
    borderColor: 'primary.main',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: 6,
    },
  }}
>

// ❌ INCORRECTO - Card sin indicación de interactividad
<Card elevation={0}>
```

---

### 3. **Feedback (Retroalimentación)**

> El sistema debe responder a las acciones del usuario

**Reglas de Implementación:**
- ✅ Hover states en todos los elementos interactivos
- ✅ Loading states durante operaciones asíncronas
- ✅ Tooltips para información adicional
- ✅ Animaciones suaves (0.2s - 0.3s)
- ✅ Mensajes de confirmación para acciones importantes
- ❌ No dejar al usuario esperando sin indicación
- ❌ No usar animaciones largas (>0.5s)

**Ejemplo:**
```jsx
// ✅ CORRECTO - Feedback visual claro
<IconButton
  sx={{
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'scale(1.1) rotate(5deg)',
      bgcolor: 'primary.light',
    },
  }}
>
  <Icon />
</IconButton>

// Con Tooltip para información adicional
<Tooltip title="Información útil" arrow>
  <Button>Acción</Button>
</Tooltip>
```

---

### 4. **Mapping (Mapeo)**

> Relación clara entre controles y sus efectos

**Reglas de Implementación:**
- ✅ Agrupar elementos relacionados visualmente
- ✅ Usar proximidad para indicar relaciones
- ✅ Iconos que representen claramente su función
- ✅ Orden lógico de elementos (izq→der, arriba→abajo)
- ❌ No separar elementos relacionados
- ❌ No usar iconos ambiguos

**Ejemplo:**
```jsx
// ✅ CORRECTO - Progreso y acciones agrupados
<ProgressCard percentage={60} />
<Stack direction="row" spacing={2}>
  <Button>Continuar</Button>
  <Button>Ver Todas</Button>
</Stack>

// ❌ INCORRECTO - Elementos relacionados separados
<ProgressCard />
<Divider />
<OtherContent />
<Button>Continuar</Button>
```

---

### 5. **Constraints (Restricciones)**

> Prevenir errores limitando acciones posibles

**Reglas de Implementación:**
- ✅ Deshabilitar botones cuando la acción no es válida
- ✅ Validación de formularios en tiempo real
- ✅ Mostrar contenido bloqueado con icono de candado
- ✅ Tooltips explicando por qué algo está deshabilitado
- ❌ No permitir acciones que causen errores
- ❌ No ocultar completamente opciones no disponibles

**Ejemplo:**
```jsx
// ✅ CORRECTO - Restricción clara
<ActionCard
  disabled={!isUnlocked}
  icon={LockIcon}
  tooltip="Completa la lección anterior para desbloquear"
/>

// ✅ CORRECTO - Validación de formulario
<TextField
  error={!isValid}
  helperText={!isValid && "Campo requerido"}
/>
```

---

### 6. **Consistency (Consistencia)**

> Elementos similares deben verse y comportarse igual

**Reglas de Implementación:**
- ✅ Usar componentes reutilizables
- ✅ Mantener espaciado consistente (múltiplos de 8px)
- ✅ Colores semánticos consistentes (éxito=verde, error=rojo)
- ✅ Misma jerarquía tipográfica en toda la app
- ❌ No crear variaciones innecesarias de componentes
- ❌ No usar diferentes estilos para la misma acción

---

## 🎯 Mejores Prácticas UX/UI

### Jerarquía Visual

**Niveles de Importancia:**

1. **Primario** - Acción principal de la página
   - Botón grande, color primario, elevación alta
   - `fontSize: 1.25rem`, `py: 2.5`, `boxShadow: 4`

2. **Secundario** - Acciones alternativas
   - Botón outlined o contained con menor énfasis
   - `fontSize: 1.125rem`, `py: 2`, `boxShadow: 2`

3. **Terciario** - Acciones de exploración
   - Botón text o links
   - `fontSize: 1rem`, sin elevación

**Ejemplo:**
```jsx
// Primario
<Button variant="contained" size="large" sx={{ py: 2.5, fontSize: '1.25rem' }}>
  Continuar Aprendiendo
</Button>

// Secundario
<Button variant="outlined" size="large" sx={{ py: 2, fontSize: '1.125rem' }}>
  Ver Lecciones
</Button>

// Terciario
<Button variant="text">Explorar</Button>
```

---

### Espaciado y Layout

**Sistema de Espaciado (múltiplos de 8px):**

```javascript
spacing: {
  xs: 1,    // 8px
  sm: 2,    // 16px
  md: 3,    // 24px
  lg: 4,    // 32px
  xl: 5,    // 40px
  xxl: 6,   // 48px
}
```

**Reglas:**
- Elementos relacionados: `spacing={2}` (16px)
- Secciones diferentes: `spacing={4-5}` (32-40px)
- Padding de containers: `py={4}` (32px)
- Padding de cards: `p={3}` (24px)

---

### Tipografía

**Jerarquía:**

```javascript
h1: { fontSize: '2.75rem', fontWeight: 900 }  // Títulos principales
h2: { fontSize: '2.25rem', fontWeight: 800 }  // Subtítulos importantes
h4: { fontSize: '1.75rem', fontWeight: 700 }  // Secciones
h5: { fontSize: '1.5rem', fontWeight: 600 }   // Subsecciones
h6: { fontSize: '1.25rem', fontWeight: 600 }  // Títulos de cards
body1: { fontSize: '1rem', fontWeight: 400 }  // Texto normal
body2: { fontSize: '0.875rem' }               // Texto secundario
caption: { fontSize: '0.75rem' }              // Etiquetas pequeñas
```

**Reglas:**
- Un solo `h1` por página
- Usar `fontWeight` para diferenciar importancia
- `lineHeight: 1.6` para texto largo
- `letterSpacing: -0.02em` para títulos grandes

---

### Animaciones y Transiciones

**Duraciones Recomendadas:**

```javascript
transitions: {
  fast: '0.15s',      // Hover de iconos pequeños
  normal: '0.3s',     // Hover de botones y cards
  slow: '0.5s',       // Transiciones de página
}
```

**Easing Functions:**

```javascript
easing: {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',  // Uso general
  enter: 'cubic-bezier(0, 0, 0.2, 1)',       // Elementos entrando
  exit: 'cubic-bezier(0.4, 0, 1, 1)',        // Elementos saliendo
}
```

**Reglas:**
- ✅ Usar transiciones para feedback
- ✅ Mantener animaciones sutiles
- ❌ No animar todo simultáneamente
- ❌ No usar duraciones >0.5s

---

### Accesibilidad

**Checklist Obligatorio:**

- ✅ Contraste mínimo 4.5:1 para texto normal
- ✅ Contraste mínimo 3:1 para texto grande (>18px)
- ✅ Todos los botones tienen `aria-label` descriptivo
- ✅ Imágenes tienen `alt` text
- ✅ Navegación por teclado funciona
- ✅ Estados de focus visibles
- ✅ Tooltips para iconos sin texto

**Ejemplo:**
```jsx
// ✅ CORRECTO - Accesible
<Button
  aria-label="Continuar con la lección La Familia"
  startIcon={<PlayIcon />}
>
  Continuar Aprendiendo
</Button>

<Tooltip title="Información adicional" arrow>
  <IconButton aria-label="Más información">
    <InfoIcon />
  </IconButton>
</Tooltip>
```

---

## 📦 Componentes Reutilizables

### Cuándo Crear un Componente Nuevo

**Crear componente SI:**
- Se usa en 3+ lugares diferentes
- Tiene lógica compleja
- Necesita ser consistente en toda la app

**NO crear componente SI:**
- Solo se usa una vez
- Es muy simple (1-2 líneas de JSX)
- Varía mucho entre usos

---

### Template de Componente

```jsx
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * [Descripción del componente]
 * Sigue principios de Don Norman: [listar cuáles]
 */
const ComponentName = ({ 
  prop1, 
  prop2,
  disabled = false,
  onClick,
}) => {
  return (
    <Box
      sx={{
        // Usar valores del tema
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderRadius: 3,
        p: 3,
        // Affordances
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        // Feedback
        transition: 'all 0.3s',
        '&:hover': disabled ? {} : {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={disabled ? undefined : onClick}
    >
      <Typography variant="h6" fontWeight="bold">
        {prop1}
      </Typography>
    </Box>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ComponentName;
```

---

## ✅ Checklist Pre-Commit

Antes de hacer commit de un componente nuevo:

- [ ] ¿Sigue la paleta de colores del tema?
- [ ] ¿Aplica los 6 principios de Don Norman?
- [ ] ¿Tiene hover states y feedback visual?
- [ ] ¿Es accesible (contraste, aria-labels)?
- [ ] ¿Usa espaciado consistente (múltiplos de 8px)?
- [ ] ¿Tiene PropTypes definidos?
- [ ] ¿Funciona en móvil (responsive)?
- [ ] ¿Tiene estados disabled cuando corresponde?
- [ ] ¿Usa componentes de MUI cuando es posible?
- [ ] ¿Tiene comentarios explicando decisiones de diseño?

---

## 🚫 Anti-Patrones Comunes

### ❌ NO HACER:

```jsx
// Colores hardcodeados
<Box sx={{ color: '#ff0000' }}>

// Espaciado inconsistente
<Box sx={{ mb: 2.5, mt: 3.7 }}>

// Sin feedback visual
<Button onClick={handleClick}>Click</Button>

// Texto sin jerarquía
<Typography>Todo el mismo tamaño</Typography>

// Botón primario poco visible
<Button variant="text" size="small">Acción Principal</Button>
```

### ✅ HACER:

```jsx
// Usar colores del tema
<Box sx={{ color: 'error.main' }}>

// Espaciado consistente
<Box sx={{ mb: 2, mt: 3 }}>

// Con feedback visual
<Button 
  onClick={handleClick}
  sx={{
    transition: 'all 0.3s',
    '&:hover': { boxShadow: 4 },
  }}
>
  Click
</Button>

// Jerarquía clara
<Typography variant="h4" fontWeight="bold">
<Typography variant="body1">

// Botón primario prominente
<Button variant="contained" size="large">Acción Principal</Button>
```

---

## 📚 Recursos Adicionales

- **Material-UI Docs**: https://mui.com/
- **Don Norman - The Design of Everyday Things**
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

**Última actualización**: 2026-01-13  
**Versión**: 1.0
