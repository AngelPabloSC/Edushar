import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Grid,
  Typography,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAsyncAction } from '../../hooks/ui/useAsyncAction';

const EditProfileDialog = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: '',
    photoProfile: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { isExecuting, execute } = useAsyncAction();

  useEffect(() => {
    if (user && open) {
        // Parse name if split or single field
        const names = user.firstName || '';
        const lastNames = user.lastName || '';
        
        setFormData({
            firstName: names,
            lastName: lastNames,
            email: user.email || '',
            password: '', // Don't prefill password
            birthdate: user.birthdate ? user.birthdate.split('T')[0] : '',
            photoProfile: user.photoProfile || ''
        });
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoProfile: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
        setSnackbar({ open: true, message: 'Por favor completa los campos obligatorios', severity: 'warning' });
        return;
    }

    const { success, message } = await execute(async () => {
        return await onUpdate({
            ...formData,
            id: user.id || user.uid // Ensure ID is passed
        });
    });

    if (success) { // logic wrapper returns object { success: true, data: { success: true ... } } but here onUpdate returns directly the result object
         // Wait, execute returns { success: boolean, data: result, ... }
         // So if execute sets success=true, it means onUpdate didn't throw.
         // But onUpdate returns { success: boolean, message: string }
         // So we need to check message.success (which is confusing naming, let's restructure)
         // Actually, onUpdate in useUserProfile returns { success: boolean, message: string }
         // So result.data will be that object.
         // Let's refactor:
         
         // No, verify `useAsyncAction`:
         // const result = await asyncFn();
         // return { success: true, data: result, prevented: false };
    }
  };
  
  // Refined submit handler
  const handleSave = async () => {
      const result = await execute(async () => {
           return await onUpdate({
               id: user?.id,
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               birthdate: formData.birthdate,
               photoProfile: formData.photoProfile,
               ...(formData.password ? { password: formData.password } : {})
           });
      });
      
      if (result.success && result.data.success) {
          setSnackbar({ open: true, message: 'Perfil actualizado con éxito', severity: 'success' });
          setTimeout(() => {
              onClose();
          }, 1500);
      } else {
          setSnackbar({ open: true, message: result.data?.message || result.error?.message || 'Error al actualizar', severity: 'error' });
      }
  };

  return (
    <>
    <Dialog open={open} onClose={!isExecuting ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
        Editar Perfil
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={formData.photoProfile}
              sx={{ width: 100, height: 100, border: '4px solid', borderColor: 'primary.main', mb: 1 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="icon-button-file"
              type="file"
              onChange={handleImageChange}
              disabled={isExecuting}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.default' } }} disabled={isExecuting}>
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Toca la cámara para cambiar tu foto
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isExecuting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isExecuting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isExecuting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={isExecuting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nueva Contraseña (Opcional)"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={isExecuting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={isExecuting} color="inherit">
            Cancelar
        </Button>
        <Button
            onClick={handleSave}
            disabled={isExecuting}
            variant="contained"
            color="primary"
            sx={{ px: 4, fontWeight: 'bold' }}
            startIcon={isExecuting ? <CircularProgress size={20} color="inherit" /> : null}
        >
            {isExecuting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
        </Alert>
    </Snackbar>
    </>
  );
};

export default EditProfileDialog;
