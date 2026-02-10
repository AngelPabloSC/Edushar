import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Button,
  TextField,
  Tooltip,
  CircularProgress,
  Divider,
  Chip,
  Fade,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import {
  Translate,
  SwapHoriz,
  HelpOutline,
  Delete,
  ArrowForward,
  ContentCopy,
  VolumeUp,
  Campaign,
  MenuBook,
  AutoStories,
  ErrorOutline
} from '@mui/icons-material';
import { useTranslator } from '../hooks/useTranslator';
import { useShuarTTS } from '../hooks/useShuarTTS';
import PageHeader from '../../../shared/components/layout/PageHeader';

const StudentTranslator = () => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const {
    inputValue,
    setInputValue,
    translationResult,
    loading,
    error,
    handleTranslate,
    handleClear,
    speak
  } = useTranslator();

  const { play: playShuar, isPlaying: isPlayingShuar, isLoading: isLoadingShuar } = useShuarTTS();

  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingDots('');
      let count = 0;
      interval = setInterval(() => {
        count = (count + 1) % 4;
        setLoadingDots('.'.repeat(count));
      }, 500);
    } else {
      setLoadingDots('');
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleCopy = () => {
    if (translationResult?.translation) {
      navigator.clipboard.writeText(translationResult.translation);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 4 }}>

          {/* Input Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                height: 520,
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  borderColor: 'primary.main',
                  boxShadow: '0 10px 30px -5px rgba(25, 118, 210, 0.1)',
                }
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTranslate();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // Prevent default to avoid new line in multiline field
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Escribe aquí para traducir..."
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: '2rem', lineHeight: 1.3, fontWeight: 500 },
                      onKeyDown: (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleTranslate();
                        }
                      }
                    }}
                    inputRef={inputRef}
                    sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' } }}
                    value={inputValue}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/);
                      if (words.length <= 10 || e.target.value.length < inputValue.length) {
                        setInputValue(e.target.value);
                      }
                    }}
                  />

                  {/* Quick Phrases */}
                  {!inputValue && (
                    <Box sx={{ position: 'absolute', bottom: 80, left: 32, right: 32 }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                        Prueba rápida:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {['Hola', 'Gracias', 'Familia', 'Agua', 'Tierra'].map((phrase) => (
                          <Chip
                            key={phrase}
                            label={phrase}
                            onClick={() => {
                              setInputValue(phrase);
                              // Slightly longer timeout to ensure chips are unmounted and TextField is ready
                              setTimeout(() => inputRef.current?.focus(), 50);
                            }}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              color: 'primary.main',
                              border: '1px solid',
                              borderColor: 'transparent',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                borderColor: alpha(theme.palette.primary.main, 0.2)
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', borderRadius: 50, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.2) }}>
                        <Box sx={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                          <Box sx={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', bgcolor: 'info.main', opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                          <Box sx={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                        </Box>
                        <Typography variant="caption" fontWeight="bold">Buscando significado{loadingDots}</Typography>
                      </Box>
                    ) : (
                      <Box />
                    )}
                    <Typography variant="caption" fontWeight="bold" color={inputValue.trim().split(/\s+/).filter(Boolean).length >= 19 ? "error.main" : "text.disabled"} sx={{ letterSpacing: '0.05em' }}>
                      {inputValue.trim().split(/\s+/).filter(Boolean).length} / 10 palabras
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ px: 4, py: 3, bgcolor: alpha(theme.palette.grey[50], 0.5), borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    startIcon={<Delete />}
                    onClick={handleClear}
                    disabled={loading}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      borderRadius: 3,
                      px: 2,
                      '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }
                    }}
                  >
                    Borrar
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={!loading && <ArrowForward />}
                    disabled={loading || !inputValue.trim()}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      borderRadius: 4,
                      px: 5,
                      py: 1.5,
                      boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.3)',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.4)',
                      },
                      '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Traducir'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>

          {/* Output Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {translationResult ? (
              <Fade in={true}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                  {/* Result Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      bgcolor: '#F1F7FF', // card-blue
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.08)',
                      }
                    }}
                  >

                    <Box sx={{ position: 'absolute', top: -64, right: -64, width: 128, height: 128, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: '50%', filter: 'blur(40px)' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <Box>
                        <Box sx={{ display: 'inline-block', px: 1, py: 0.25, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 1, fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, mb: 2 }}>
                          Shuar
                        </Box>
                        <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 2, fontSize: '2.5rem', lineHeight: 1.1 }}>
                          {translationResult.translation}
                        </Typography>

                        {/* Phonetics Display - Only show if provided by API */}
                        {translationResult.phonetic ? (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: alpha('#ffffff', 0.6), backdropFilter: 'blur(4px)', px: 1.5, py: 0.75, borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                            <Campaign fontSize="small" color="primary" />
                            <Typography variant="body1" fontWeight={500} color="primary.dark" sx={{ fontFamily: 'monospace' }}>
                              [{translationResult.phonetic}]
                            </Typography>
                          </Box>
                        ) : null}
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Tooltip title="Escuchar">
                          <IconButton
                            onClick={() => speak(translationResult.translation)}
                            sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 3, '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' } }}
                          >
                            {isLoadingShuar ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <VolumeUp />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copiar">
                          <IconButton onClick={handleCopy} sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 3, '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' } }}>
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Justification Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                      <MenuBook color="primary" />
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                        Justificación Lingüística
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                      {translationResult.justification}
                    </Typography>
                  </Paper>

                  {/* References Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ p: 1.25, borderRadius: 3, bgcolor: alpha(theme.palette.grey[100], 0.8), border: '1px solid', borderColor: alpha(theme.palette.divider, 0.5), color: 'primary.main' }}>
                        <AutoStories />
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', mb: 0.5 }}>
                          Fuentes Consultadas
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="text.primary">
                          {translationResult.references || 'Diccionario Shuar-Español'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Módulo de fonética y morfología comparativa.
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                </Box>
              </Fade>
            ) : error ? (
              <Fade in={true}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#FFF4F4', border: '1px solid', borderColor: 'error.light', textAlign: 'center' }}>
                  <ErrorOutline color="error" sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
                  <Typography variant="h6" fontWeight="bold" color="error.main" gutterBottom>
                    Oops, algo salió mal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {error}
                  </Typography>
                </Paper>
              </Fade>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7, flexDirection: 'column', gap: 3, minHeight: 400, textAlign: 'center', px: 4 }}>
                <Box sx={{
                  p: 4,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: '1px dashed',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  mb: 1
                }}>
                  <Translate sx={{ fontSize: 64, color: 'primary.light', opacity: 0.8 }} />
                </Box>
                <Box>
                  <Typography variant="h6" color="text.primary" fontWeight={700} gutterBottom>
                    Listo para Traducir
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mx: 'auto', lineHeight: 1.6 }}>
                    Escribe cualquier texto en español y descubre su significado en Shuar. La sabiduría de la selva a tu alcance.
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.1) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HelpOutline fontSize="small" color="info" />
                    <Typography variant="caption" fontWeight={800} color="info.main" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      Sabías que...
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', maxWidth: 250 }}>
                    "El Shuar-Chicham es hablado por más de 35,000 personas en la Amazonía."
                  </Typography>
                </Box>
              </Box>
            )}

          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentTranslator;
