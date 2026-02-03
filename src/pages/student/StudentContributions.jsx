import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import TranslateIcon from '@mui/icons-material/Translate';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

/**
 * Página de Contribuciones del Estudiante
 * Permite a los estudiantes contribuir con palabras, cuentos y correcciones
 */
import { useDialong } from '../../hooks/ui/useDialog';
import { useSnackBarContext } from '../../hooks/context/SnackbarContext';
import validationRules from '../../utils/validationRules';

/**
 * Página de Contribuciones del Estudiante
 * Permite a los estudiantes contribuir con palabras, cuentos y correcciones
 */
const StudentContributions = () => {
  const { isOpen, dialongContent, handleOpenDialog, handleCloseDialog, setDialongContent } = useDialong();
  const { handleSetDataSnackbar } = useSnackBarContext();
  const [activeTab, setActiveTab] = useState('palabra');
  const [actionCallback, setActionCallback] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Story editor tabs
  const [storyLangTab, setStoryLangTab] = useState(0);

  const [formData, setFormData] = useState({
    // Word fields
    palabraShuar: '',
    traduccionEspanol: '',
    categoria: '',
    ejemploUso: '',
    
    // Story fields
    titleShuar: '',
    titleEs: '',
    categoryStory: 'Mito',
    author: '',
    contentShuar: '',
    contentEs: '',
    cover: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, cover: reader.result }));
        };
        reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === 'palabra') {
        if (!formData.palabraShuar) newErrors.palabraShuar = validationRules.required;
        if (!formData.traduccionEspanol) newErrors.traduccionEspanol = validationRules.required;
        if (!formData.categoria) newErrors.categoria = validationRules.required;
    } else if (activeTab === 'cuento') {
        if (!formData.titleShuar) newErrors.titleShuar = validationRules.required;
        if (!formData.titleEs) newErrors.titleEs = validationRules.required;
        if (!formData.author) newErrors.author = validationRules.required;
        if (!formData.contentShuar) newErrors.contentShuar = validationRules.required;
        if (!formData.contentEs) newErrors.contentEs = validationRules.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmSubmit = () => {
    // Aquí iría la lógica real para enviar la contribución a la API
    console.log('Enviando contribución:', formData);
    handleSetDataSnackbar({ message: '¡Gracias! Tu contribución ha sido enviada para revisión.', type: 'success' });

    // Resetear formulario
    setFormData({
      palabraShuar: '',
      traduccionEspanol: '',
      categoria: '',
      ejemploUso: '',
      titleShuar: '',
      titleEs: '',
      categoryStory: 'Mito',
      author: '',
      contentShuar: '',
      contentEs: '',
      cover: null
    });
    handleCloseDialog();
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      handleSetDataSnackbar({ message: 'Por favor corrige los errores antes de enviar', type: 'error' });
      return;
    }

    setDialongContent({
      title: '¿Confirmar envío?',
      message: 'Tu contribución será revisada por un administrador antes de ser publicada. ¿Deseas continuar?'
    });
    setActionCallback(() => handleConfirmSubmit);
    handleOpenDialog();
  };

  // Datos de ejemplo para el historial
  const contributions = [
    { id: 1, tipo: 'Palabra', contenido: 'Nántu (Luna)', fecha: '03/10/2023', estado: 'aprobado', timestamp: 'Ayer' },
    { id: 2, tipo: 'Palabra', contenido: 'Yawá (Perro)', fecha: '02/10/2023', estado: 'pendiente', timestamp: '2 oct' },
    { id: 3, tipo: 'Cuento', contenido: 'El origen del fuego', fecha: '28/09/2023', estado: 'revision', timestamp: '28 sep' },
  ];

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'revision': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (estado) => {
    switch (estado) {
      case 'aprobado': return 'Aprobado';
      case 'pendiente': return 'Pendiente';
      case 'revision': return 'En Revisión';
      default: return estado;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '2.75rem' },
            color: 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          Contribuir a EduShar
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 400,
          }}
        >
          Ayúdanos a preservar y expandir el conocimiento de la lengua Shuar.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Columna Izquierda: Formulario */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Button
                onClick={() => setActiveTab('palabra')}
                sx={{
                  pb: 2,
                  borderBottom: activeTab === 'palabra' ? 3 : 0,
                  borderColor: 'secondary.main',
                  borderRadius: 0,
                  color: activeTab === 'palabra' ? 'text.primary' : 'text.secondary',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'text.primary',
                  },
                }}
              >
                Nueva Palabra
              </Button>
              <Button
                onClick={() => setActiveTab('cuento')}
                sx={{
                  pb: 2,
                  borderBottom: activeTab === 'cuento' ? 3 : 0,
                  borderColor: 'secondary.main',
                  borderRadius: 0,
                  color: activeTab === 'cuento' ? 'text.primary' : 'text.secondary',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'text.primary',
                  },
                }}
              >
                Enviar Cuento
              </Button>
            </Box>
          </Box>

          {/* Formulario */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 1,
            }}
          >
            {activeTab === 'palabra' && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Palabra en Shuar"
                    placeholder="Ej: Kúshush"
                    value={formData.palabraShuar}
                    onChange={(e) => handleInputChange('palabraShuar', e.target.value)}
                    error={!!errors.palabraShuar}
                    helperText={errors.palabraShuar}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Traducción al Español"
                    placeholder="Ej: Armadillo"
                    value={formData.traduccionEspanol}
                    onChange={(e) => handleInputChange('traduccionEspanol', e.target.value)}
                    error={!!errors.traduccionEspanol}
                    helperText={errors.traduccionEspanol}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth error={!!errors.categoria}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={formData.categoria}
                      label="Categoría"
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="">Seleccione una categoría</MenuItem>
                      <MenuItem value="animales">Animales</MenuItem>
                      <MenuItem value="plantas">Plantas</MenuItem>
                      <MenuItem value="familia">Familia</MenuItem>
                      <MenuItem value="verbos">Verbos</MenuItem>
                      <MenuItem value="otros">Otros</MenuItem>
                    </Select>
                    {errors.categoria && (
                      <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                        {errors.categoria}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ejemplo de uso"
                    placeholder="Escriba una oración contextual en Shuar y su traducción..."
                    value={formData.ejemploUso}
                    onChange={(e) => handleInputChange('ejemploUso', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      height: 100,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      textTransform: 'none',
                      color: 'text.secondary',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'background.default' }}>
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      Subir una imagen o foto (Opcional)
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => console.log('File selected:', e.target.files[0])}
                    />
                  </Button>
                </Grid>
              </Grid>
            )}

            {activeTab === 'cuento' && (
                 <Grid container spacing={3}>
                    {/* Cover Image */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                            Portada del Cuento
                        </Typography>
                         <Button
                            component="label"
                            fullWidth
                            sx={{
                                height: 200,
                                bgcolor: 'grey.100',
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                borderColor: 'divider',
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                '&:hover': { bgcolor: 'grey.200' }
                            }}
                        >
                             {formData.cover ? (
                                <Box component="img" src={formData.cover} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#aaa' }}>image</span>
                                    <Typography color="text.secondary">Subir portada</Typography>
                                </>
                            )}
                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </Button>
                    </Grid>

                    {/* Meta Fields */}
                    <Grid size={{ xs: 12, md: 6 }}>
                         <TextField
                            fullWidth
                            label="Título en Shuar"
                            placeholder="Ej: Nunkui"
                            value={formData.titleShuar}
                            onChange={(e) => handleInputChange('titleShuar', e.target.value)}
                            error={!!errors.titleShuar}
                            helperText={errors.titleShuar}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Título en Español"
                            placeholder="Ej: Nunkui y la abundancia"
                            value={formData.titleEs}
                            onChange={(e) => handleInputChange('titleEs', e.target.value)}
                            error={!!errors.titleEs}
                            helperText={errors.titleEs}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Autor"
                            placeholder="Nombre del autor"
                            value={formData.author}
                            onChange={(e) => handleInputChange('author', e.target.value)}
                            error={!!errors.author}
                            helperText={errors.author}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                         <FormControl fullWidth>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={formData.categoryStory}
                                label="Categoría"
                                onChange={(e) => handleInputChange('categoryStory', e.target.value)}
                            >
                                <MenuItem value="Mito">Mito</MenuItem>
                                <MenuItem value="Leyenda">Leyenda</MenuItem>
                                <MenuItem value="Naturaleza">Naturaleza</MenuItem>
                                <MenuItem value="Tradición">Tradición</MenuItem>
                                <MenuItem value="Fábula">Fábula</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Content Editor */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1, mt: 1 }}>
                            Contenido del Historia
                        </Typography>
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                                <Button 
                                    onClick={() => setStoryLangTab(0)}
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        color: storyLangTab === 0 ? 'secondary.main' : 'text.secondary',
                                        borderBottom: storyLangTab === 0 ? 2 : 0,
                                        borderRadius: 0,
                                        borderColor: 'secondary.main',
                                        px: 3
                                    }}
                                >
                                    Shuar
                                </Button>
                                <Button 
                                    onClick={() => setStoryLangTab(1)}
                                    sx={{ 
                                        fontWeight: 'bold', 
                                        color: storyLangTab === 1 ? 'secondary.main' : 'text.secondary',
                                        borderBottom: storyLangTab === 1 ? 2 : 0,
                                        borderRadius: 0,
                                        borderColor: 'secondary.main',
                                        px: 3
                                    }}
                                >
                                    Español
                                </Button>
                            </Box>
                            <Box sx={{ p: 2, minHeight: 300, bgcolor: 'white' }}>
                                {storyLangTab === 0 ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={12}
                                        variant="standard"
                                        placeholder="Escribe la historia en Shuar..."
                                        InputProps={{ disableUnderline: true }}
                                        value={formData.contentShuar}
                                        onChange={(e) => handleInputChange('contentShuar', e.target.value)}
                                        error={!!errors.contentShuar}
                                        helperText={errors.contentShuar}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={12}
                                        variant="standard"
                                        placeholder="Escribe la historia en Español..."
                                        InputProps={{ disableUnderline: true }}
                                        value={formData.contentEs}
                                        onChange={(e) => handleInputChange('contentEs', e.target.value)}
                                        error={!!errors.contentEs}
                                        helperText={errors.contentEs}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Grid>
                 </Grid>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                onClick={handleSubmit}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s',
                }}
              >
                Enviar Contribución
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Columna Derecha: Historial y Stats */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header del historial */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Mis Contribuciones
              </Typography>
              <Typography
                variant="body2"
                color="secondary.main"
                fontWeight="bold"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                Ver todas
              </Typography>
            </Box>

            {/* Cards de historial */}
            {contributions.map((contrib) => (
              <Card
                key={contrib.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={getStatusLabel(contrib.estado)}
                      size="small"
                      color={getStatusColor(contrib.estado)}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.65rem',
                        height: 20,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {contrib.timestamp}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {contrib.tipo === 'Cuento' && <AutoStoriesIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
                    <Typography variant="body2" fontWeight="bold">
                      {contrib.contenido.split('(')[0].trim()}
                    </Typography>
                  </Box>
                  {contrib.contenido.includes('(') && (
                    <Typography variant="caption" color="text.secondary">
                      Traducción: {contrib.contenido.match(/\((.*?)\)/)?.[1]}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Widget de gamificación */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(209, 154, 74, 0.1) 0%, rgba(209, 154, 74, 0.05) 100%)',
                border: '1px solid',
                borderColor: 'rgba(209, 154, 74, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'secondary.main',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                  }}
                >
                  <WorkspacePremiumIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Nivel de Contribuidor
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Explorador Shuar
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{
                  height: 8,
                  borderRadius: 10,
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 10,
                    bgcolor: 'secondary.main',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
                650 / 1000 XP
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Tabla de resumen */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Resumen de Contribuciones
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contenido</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributions.map((contrib) => (
                <TableRow key={contrib.id} sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {contrib.tipo === 'Palabra' ? <TranslateIcon sx={{ fontSize: 18 }} /> : <AutoStoriesIcon sx={{ fontSize: 18 }} />}
                      {contrib.tipo}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{contrib.contenido}</TableCell>
                  <TableCell color="text.secondary">{contrib.fecha}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(contrib.estado)}
                      size="small"
                      color={getStatusColor(contrib.estado)}
                      sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


      {/* Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onClose={handleCloseDialog}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>{dialongContent.title}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {dialongContent.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button
            onClick={actionCallback}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, color: 'white' }}
            autoFocus
          >
            Confirmar Envío
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentContributions;
