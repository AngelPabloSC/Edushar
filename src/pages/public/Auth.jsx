import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Grid,
  Tabs,
  Tab,
  Stack,
  Fade,
  useTheme,
  Alert,
  CircularProgress,

} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLogin } from '../../hooks/auth/useLogin';
import { useRegister } from '../../hooks/auth/useRegister';

const Auth = () => {
  const theme = useTheme();
  
  // Login hook
  const {
    tabValue,
    showPassword,
    showConfirmPassword,
    loginData,
    loginErrors,
    isLoading: loginLoading,
    authError: loginError,
    setShowPassword,
    setShowConfirmPassword,
    handleTabChange,
    handleLoginChange,
    handleLoginSubmit,
    handleGoogleSignIn,
  } = useLogin();

  // Register hook
  const {
    registerData,
    registerErrors,
    isLoading: registerLoading,
    handleRegisterChange,
    handleRegisterSubmit,
  } = useRegister();

  // Combined loading and error states
  const isLoading = loginLoading || registerLoading;
  const authError = loginError;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left Side - Cultural Image */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          position: 'relative',
          backgroundImage: 'url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            color: 'white',
            p: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Nekas tuka iisasta
          </Typography>
          <Typography variant="h6" fontStyle="italic" sx={{ opacity: 0.9 }}>
            "Aprende la lengua Shuar con el corazón y conecta con la sabiduría ancestral de nuestra selva."
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 2, bgcolor: 'secondary.main' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ color: 'secondary.main' }}>
              CULTURA SHUAR
            </Typography>
          </Box>

          {/* Stats - Siempre visible */}
          <Box sx={{ mt: 6, display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">50+</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>LECCIONES</Typography>
            </Box>
            <Box sx={{ width: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">12k+</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>ESTUDIANTES</Typography>
            </Box>
            <Box sx={{ width: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">100%</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>CULTURAL</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Auth Forms with Tabs */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{
              sx: {
                height: 3,
                backgroundColor: 'secondary.main',
              }
            }}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                py: 2,
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '1rem',
                textTransform: 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: 'rgba(209, 154, 74, 0.04)',
                },
                '&.Mui-selected': {
                  color: 'secondary.main',
                  fontWeight: 700,
                },
              },
            }}
          >
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {/* LOGIN TAB */}
            {tabValue === 0 && (
              <Fade in={tabValue === 0} timeout={600}>
                <Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                      Bienvenido de nuevo
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ingresa tus credenciales para acceder a tu panel de aprendizaje
                    </Typography>
                  </Box>

                  {authError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {authError}
                    </Alert>
                  )}

                <Box component="form" onSubmit={handleLoginSubmit}>
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    name="email"
                    type="text"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    margin="normal"
                    placeholder="ejemplo@correo.com"
                    error={Boolean(loginErrors.email)}
                    helperText={loginErrors.email}
                  />

                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={handleLoginChange}
                    margin="normal"
                    placeholder="••••••••"
                    error={Boolean(loginErrors.password)}
                    helperText={loginErrors.password}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Link
                      href="#"
                      variant="body2"
                      sx={{ color: 'secondary.main', fontWeight: 600 }}
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 3, py: 1.5 }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Entrar a mi cuenta'
                    )}
                  </Button>

                  <Box sx={{ position: 'relative', my: 3 }}>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', borderTop: 1, borderColor: 'divider' }} />
                    </Box>
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ bgcolor: 'background.paper', px: 2, color: 'text.secondary' }}>
                        O continuar con
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    startIcon={
                      <Box
                        component="img"
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        sx={{ width: 20, height: 20 }}
                      />
                    }
                    sx={{ 
                      py: 1.5,
                      color: 'text.primary',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        bgcolor: 'rgba(209, 154, 74, 0.04)',
                      }
                    }}
                  >
                    Continuar con Google
                  </Button>

                  <Typography variant="caption" align="center" display="block" sx={{ mt: 3, color: 'text.secondary' }}>
                    Al iniciar sesión, aceptas nuestros{' '}
                    <Link href="#" sx={{ color: 'secondary.main' }}>
                      Términos de Servicio
                    </Link>{' '}
                    y{' '}
                    <Link href="#" sx={{ color: 'secondary.main' }}>
                      Política de Privacidad
                    </Link>
                    .
                  </Typography>
                </Box>
              </Box>
              </Fade>
            )}

            {/* REGISTER TAB */}
            {tabValue === 1 && (
              <Fade in={tabValue === 1} timeout={600}>
                <Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                      Regístrate en EduShar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aprende y preserva nuestra cultura milenaria
                    </Typography>
                  </Box>

                  {authError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {authError}
                    </Alert>
                  )}

                <Box component="form" onSubmit={handleRegisterSubmit}>
                  {/* Información Personal */}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                    Información Personal
                  </Typography>
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                  >
                    <TextField
                      fullWidth
                      label="Nombre(s)"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      placeholder="Ej: Juan"
                      error={Boolean(registerErrors.firstName)}
                      helperText={registerErrors.firstName}
                    />
                    <TextField
                      fullWidth
                      label="Apellido(s)"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      placeholder="Ej: Shuar"
                      error={Boolean(registerErrors.lastName)}
                      helperText={registerErrors.lastName}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    name="birthdate"
                    type="date"
                    value={registerData.birthdate}
                    onChange={handleRegisterChange}
                    margin="normal"
                    error={Boolean(registerErrors.birthdate)}
                    helperText={registerErrors.birthdate || "Debes ser mayor de 13 años"}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  {/* Información de Cuenta */}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                    Información de Cuenta
                  </Typography>

                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="email"
                    type="text"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="ejemplo@correo.com"
                    error={Boolean(registerErrors.email)}
                    helperText={registerErrors.email}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    error={Boolean(registerErrors.password)}
                    helperText={registerErrors.password || "Mínimo 8 caracteres, una letra y un número"}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    margin="normal"
                    placeholder="••••••••"
                    error={Boolean(registerErrors.confirmPassword)}
                    helperText={registerErrors.confirmPassword}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={registerData.acceptTerms}
                        onChange={handleRegisterChange}
                        sx={{ color: 'secondary.main' }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        Acepto los{' '}
                        <Link href="#" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                          términos y condiciones
                        </Link>{' '}
                        de uso y privacidad de EduShar
                      </Typography>
                    }
                    sx={{ mt: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={isLoading}
                    sx={{ mt: 3, py: 1.5 }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear mi cuenta'
                    )}
                  </Button>

                  <Box sx={{ position: 'relative', my: 3 }}>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', borderTop: 1, borderColor: 'divider' }} />
                    </Box>
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                      <Typography variant="caption" sx={{ bgcolor: 'background.paper', px: 2, color: 'text.secondary' }}>
                        O registrarse con
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    startIcon={
                      <Box
                        component="img"
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        sx={{ width: 20, height: 20 }}
                      />
                    }
                    sx={{ 
                      py: 1.5,
                      color: 'text.primary',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        bgcolor: 'rgba(209, 154, 74, 0.04)',
                      }
                    }}
                  >
                    Continuar con Google
                  </Button>
                </Box>
              </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
