import {
  Box,
  Container,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Chip,
  IconButton,
  Grid,
  Tooltip,
  LinearProgress,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonQuestions } from '../../data/lessonQuestionsData';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);

  const lessonData = getLessonQuestions(parseInt(lessonId));
  
  // Calculate progress
  const progressPercentage = Math.round((completedQuestions.length / (lessonData?.totalQuestions || 1)) * 100);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lessonData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Lección no encontrada</Typography>
        <Button onClick={() => navigate('/estudiante/lecciones')} sx={{ mt: 2 }}>
          Volver a Lecciones
        </Button>
      </Box>
    );
  }

  const question = lessonData.questions[currentQuestion];
  const totalQuestions = lessonData.totalQuestions;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedAnswer && !completedQuestions.includes(currentQuestion)) {
      setCompletedQuestions([...completedQuestions, currentQuestion]);
    }
    if (currentQuestion < lessonData.questions.length - 1) {
      // Fade out animation
      setShowQuestion(false);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowQuestion(true);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // Fade out animation
      setShowQuestion(false);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedAnswer('');
        setShowQuestion(true);
      }, 200);
    }
  };

  const handleQuestionClick = (index) => {
    setShowQuestion(false);
    setTimeout(() => {
      setCurrentQuestion(index);
      setSelectedAnswer('');
      setShowQuestion(true);
    }, 200);
  };
  
  const handleFinish = () => {
    navigate('/estudiante/lecciones');
  };
  
  const isLastQuestion = currentQuestion === lessonData.questions.length - 1;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header - Enhanced with progress and timer */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 2,
                }}
              >
                <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                  {lessonData.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Lección {lessonId} • Pregunta {currentQuestion + 1} de {totalQuestions}
                </Typography>
              </Box>
            </Box>
            
            {/* Timer and Progress */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Timer */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  borderRadius: 2,
                  py: 0.75,
                  px: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <TimerIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography variant="body2" fontWeight="bold" sx={{ letterSpacing: 0.5, color: 'text.primary' }}>
                  {formatTime(timer)}
                </Typography>
              </Box>
              
              {/* Progress Badge */}
              <Chip
                icon={<CheckCircleIcon />}
                label={`${progressPercentage}% Completado`}
                sx={{
                  bgcolor: progressPercentage === 100 ? 'success.main' : alpha(theme.palette.secondary.main, 0.1),
                  color: progressPercentage === 100 ? 'white' : 'secondary.main',
                  fontWeight: 700,
                  '& .MuiChip-icon': {
                    color: progressPercentage === 100 ? 'white' : 'secondary.main',
                  },
                }}
              />
              
              {/* Close Button */}
              <Tooltip title="Salir de la lección" arrow>
                <IconButton
                  onClick={() => navigate('/estudiante/lecciones')}
                  aria-label="Salir de la lección"
                  sx={{ 
                    color: 'text.secondary',
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 4,
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: 'secondary.main',
                transition: 'transform 0.4s ease',
              },
            }}
          />
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: 500,
          }}
        >
          {/* Question Area */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              borderRight: { md: '1px solid' },
              borderRightColor: { md: 'divider' },
            }}
          >
            <Fade in={showQuestion} timeout={300}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: 700,
                  mx: 'auto',
                  width: '100%',
                }}
              >
                <Chip
                  label="Traducción"
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: 'secondary.main',
                    fontWeight: 700,
                    mb: 3,
                    alignSelf: 'center',
                    fontSize: '0.875rem',
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 4,
                    textAlign: 'center',
                    color: 'text.primary',
                  }}
                >
                  Traduce: <br />
                  <Typography
                    component="span"
                    variant="h4"
                    sx={{
                      fontStyle: 'italic',
                      color: 'secondary.main',
                      fontWeight: 700,
                    }}
                  >
                    "{question.question}"
                  </Typography>
                </Typography>

                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  >
                    {question.options.map((option, index) => {
                      const isSelected = selectedAnswer === option.id;
                      return (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={
                            <Radio
                              sx={{
                                color: 'secondary.main',
                                '&.Mui-checked': {
                                  color: 'secondary.main',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="h6" fontWeight={isSelected ? 700 : 500}>
                              {option.text}
                            </Typography>
                          }
                          sx={{
                            border: '2px solid',
                            borderColor: isSelected ? 'secondary.main' : 'divider',
                            borderRadius: 3,
                            p: 2.5,
                            mb: 2,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            bgcolor: isSelected ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
                            // Affordances - looks clickable
                            boxShadow: isSelected ? 2 : 0,
                            // Feedback - hover effects
                            '&:hover': {
                              borderColor: 'secondary.main',
                              bgcolor: alpha(theme.palette.secondary.main, 0.12),
                              transform: 'translateY(-2px)',
                              boxShadow: 2,
                            },
                            // Active state
                            '&:active': {
                              transform: 'translateY(0px)',
                              boxShadow: 1,
                            },
                          }}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Box>
            </Fade>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 6,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Tooltip 
                title={currentQuestion === 0 ? "Esta es la primera pregunta" : "Volver a la pregunta anterior"}
                arrow
              >
                <span>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ArrowBackIcon />}
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    sx={{
                      px: 3,
                      py: 1.5,
                      fontWeight: 'bold',
                      borderWidth: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateX(-4px)',
                      },
                    }}
                  >
                    Anterior
                  </Button>
                </span>
              </Tooltip>
              
              {isLastQuestion ? (
                <Tooltip title="Completar y salir de la lección" arrow>
                  <span>
                    <Button
                      variant="contained"
                      color="success"
                      endIcon={<CheckCircleIcon />}
                      onClick={handleFinish}
                      disabled={!selectedAnswer}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        boxShadow: 4,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      Finalizar
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip 
                  title={!selectedAnswer ? "Selecciona una respuesta para continuar" : "Ir a la siguiente pregunta"}
                  arrow
                >
                  <span>
                    <Button
                      variant="contained"
                      color="secondary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleNext}
                      disabled={!selectedAnswer}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        boxShadow: 4,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      Siguiente
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Progress Sidebar */}
          <Box
            sx={{
              width: { xs: '100%', md: 288 },
              bgcolor: alpha(theme.palette.secondary.main, 0.03),
              p: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                mb: 2,
                textAlign: 'center',
              }}
            >
              Progreso
            </Typography>
            
            {/* Progress percentage */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" color="secondary.main">
                {progressPercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {completedQuestions.length} de {totalQuestions} preguntas
              </Typography>
            </Box>

            <Grid container spacing={1.5} sx={{ mb: 'auto' }}>
              {[...Array(totalQuestions)].map((_, index) => {
                const isCompleted = completedQuestions.includes(index);
                const isCurrent = index === currentQuestion;

                return (
                  <Grid item xs={3} key={index}>
                    <Tooltip 
                      title={`Pregunta ${index + 1}${isCompleted ? ' - Completada' : isCurrent ? ' - Actual' : ''}`}
                      arrow
                    >
                      <IconButton
                        onClick={() => handleQuestionClick(index)}
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: isCompleted
                            ? 'success.main'
                            : isCurrent
                            ? 'secondary.main'
                            : alpha(theme.palette.text.disabled, 0.1),
                          color: isCompleted || isCurrent ? 'white' : 'text.disabled',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          transition: 'all 0.3s',
                          border: '2px solid',
                          borderColor: isCurrent ? 'secondary.main' : 'transparent',
                          ...(isCurrent && {
                            boxShadow: 3,
                            transform: 'scale(1.1)',
                          }),
                          '&:hover': {
                            bgcolor: isCompleted
                              ? 'success.dark'
                              : isCurrent
                              ? 'secondary.dark'
                              : alpha(theme.palette.text.disabled, 0.2),
                            transform: 'scale(1.15)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        {isCompleted ? <CheckIcon fontSize="small" /> : index + 1}
                      </IconButton>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LessonDetail;
