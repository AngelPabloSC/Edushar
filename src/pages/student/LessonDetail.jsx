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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import { useLessonDetail } from '../../hooks/pages/useLessonDetail';
import { useAuth } from '../../hooks/context/LoginContext';
import { useFetchDataPromise } from '../../hooks/api/useFetchDataPromise';
import { CircularProgress } from '@mui/material';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { getFechData } = useFetchDataPromise();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [timer, setTimer] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  
  /* Completion Flow State */
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  const { lesson, loading, error } = useLessonDetail(lessonId);

  // Calculate progress
  // data is now in 'lesson', not 'lessonData'
  const lessonData = lesson; 
  const progressPercentage = lessonData ? Math.round((completedQuestions.length / (lessonData.totalQuestions || 1)) * 100) : 0;

  // Timer effect
  useEffect(() => {
    if (isFinished || showConfirmation) return; // Stop timer if finished or confirming

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, showConfirmation]);

  /* Navigation Handler */
  const handleExit = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/estudiante/lecciones');
    }
  };

  if (loading) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box sx={{ textAlign: 'center' }}>
                <CircularProgress color="secondary" size={60} thickness={4} />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>Cargando lección...</Typography>
            </Box>
        </Box>
     );
  }

  if (error || !lessonData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>{error || 'Lección no encontrada'}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
            No pudimos cargar la información de esta lección.
        </Typography>
        <Button onClick={handleExit} variant="contained" color="secondary">
          Volver
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
    // Save current answer
    if (selectedAnswer) {
        setUserAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
        if (!completedQuestions.includes(currentQuestion)) {
            setCompletedQuestions([...completedQuestions, currentQuestion]);
        }
    }

    if (currentQuestion < lessonData.questions.length - 1) {
      // Fade out animation
      setShowQuestion(false);
      setTimeout(() => {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        // Load existing answer if any
        setSelectedAnswer(userAnswers[nextQuestion] || '');
        setShowQuestion(true);
      }, 200);
    }
  };

  const handlePrevious = () => {
    // Save current answer before moving back (optional, but good UX)
    if (selectedAnswer) {
        setUserAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
    }

    if (currentQuestion > 0) {
      // Fade out animation
      setShowQuestion(false);
      setTimeout(() => {
        const prevQuestion = currentQuestion - 1;
        setCurrentQuestion(prevQuestion);
        // Load existing answer
        setSelectedAnswer(userAnswers[prevQuestion] || '');
        setShowQuestion(true);
      }, 200);
    }
  };

  const handleQuestionClick = (index) => {
    // Save current answer
    if (selectedAnswer) {
        setUserAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
    }
    
    setShowQuestion(false);
    setTimeout(() => {
      setCurrentQuestion(index);
      // Load existing answer
      setSelectedAnswer(userAnswers[index] || '');
      setShowQuestion(true);
    }, 200);
  };

  if (loading) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box sx={{ textAlign: 'center' }}>
                <CircularProgress color="secondary" size={60} thickness={4} />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>Cargando lección...</Typography>
            </Box>
        </Box>
     );
  }

  if (error || !lessonData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>{error || 'Lección no encontrada'}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
            No pudimos cargar la información de esta lección.
        </Typography>
        <Button onClick={handleExit} variant="contained" color="secondary">
          Volver a Lecciones
        </Button>
      </Box>
    );
  }

  /* Completion Logic Restored & isLastQuestion Defined */
  
  // Calculate Score based on correct answers
  const calculateScore = () => {
    if (!lessonData || !lessonData.questions) return 0;
    
    let correctCount = 0;
    lessonData.questions.forEach((q, index) => {
        // Check current/final answer in state or userAnswers map
        const answer = index === currentQuestion ? selectedAnswer : userAnswers[index];
        if (answer === q.correctAnswer) {
            correctCount++;
        }
    });
    
    const totalPoints = lessonData.totalPoints || 100;
    const totalQs = lessonData.totalQuestions || 1;
    return Math.round((correctCount / totalQs) * totalPoints);
  };

  const score = calculateScore();

  const handleFinishClick = () => {
    // Mark the last question as completed if an answer is selected
    if (selectedAnswer) {
        if (!completedQuestions.includes(currentQuestion)) {
             setCompletedQuestions(prev => [...prev, currentQuestion]);
        }
        // Save final answer
        setUserAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
    }
    setShowConfirmation(true);
  };

  const handleConfirmFinish = async () => {
    setShowConfirmation(false);
    
    // Calculate final score for submission
    const finalScore = calculateScore();
    const finalPercentage = progressPercentage; // Use current progress
    
    // Optimistic update to show completion screen immediately
    setIsFinished(true);
    
    // Set initial completion data from local state
    setCompletionData({
        score: finalScore,
        percentage: finalPercentage
        // status will be 'completed'
    });

    if (user && user.id) {
        try {
            const response = await getFechData({
                endPoint: 'api/progress/update',
                method: 'POST',
                additionalData: {
                    userId: user.id,
                    lessonId: lessonId,
                    status: 'completed',
                    score: finalScore,
                    percentage: finalPercentage
                }
            });
            
            if (response.code === 'COD_OK' && response.data?.progress) {
                 // Update with server confirmed data
                 setCompletionData(prev => ({
                    ...prev,
                    score: response.data.progress.score,
                    percentage: response.data.progress.percentage
                 }));
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    }
  };

  const handleReplay = () => {
    setIsFinished(false);
    setCurrentQuestion(0);
    setCompletedQuestions([]);
    setTimer(0);
    setSelectedAnswer('');
    setShowQuestion(true);
  };

  const isLastQuestion = lessonData.questions && currentQuestion === lessonData.questions.length - 1;

  /* Completion View */
  if (isFinished) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, ${alpha('#FFD700', 0.15)} 0%, transparent 20%),
            radial-gradient(circle at 50% 50%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 50%)
          `
        }}
      >
        <Paper
            elevation={3}
            sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                maxWidth: 800,
                width: '100%',
                textAlign: 'center',
                border: '1px solid',
                borderColor: alpha(theme.palette.secondary.main, 0.1),
                backdropFilter: 'blur(10px)',
                bgcolor: alpha(theme.palette.background.paper, 0.8)
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    {[1, 2, 3].map((star) => (
                        <SchoolIcon key={star} sx={{ fontSize: { xs: 40, md: 56 }, color: '#FFD700' }} />
                    ))}
                </Box>
                <Typography variant="h3" component="h1" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                    ¡Felicitaciones!
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="normal">
                    Has completado la lección <strong>{lessonData.title}</strong> con un desempeño excepcional.
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={4}>
                     <Box sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: alpha(theme.palette.secondary.main, 0.2),
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}>
                         <SchoolIcon color="secondary" />
                         <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                             Puntaje
                         </Typography>
                         <Typography variant="h4" fontWeight="900" color="secondary.main">
                             {completionData?.score ?? score} XP
                         </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}>
                         <TimerIcon color="secondary" />
                         <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                             Tiempo
                         </Typography>
                         <Typography variant="h4" fontWeight="900" color="text.primary">
                             {formatTime(timer)}
                         </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        border: '1px solid', 
                        borderColor: 'divider',
                         bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}>
                         <CheckCircleIcon color="secondary" />
                         <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                             Preguntas
                         </Typography>
                         <Typography variant="h4" fontWeight="900" color="text.primary">
                             {completedQuestions.length}
                         </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleReplay}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        borderRadius: 50,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderWidth: 2,
                         borderColor: alpha(theme.palette.secondary.main, 0.3),
                         color: 'text.primary',
                        '&:hover': {
                            borderWidth: 2,
                            borderColor: 'secondary.main',
                            bgcolor: alpha(theme.palette.secondary.main, 0.05)
                        }
                    }}
                >
                    Volver a Jugar
                </Button>
                 <Button
                    variant="contained"
                    size="large"
                    onClick={handleExit}
                    startIcon={<SchoolIcon />}
                    sx={{
                        borderRadius: 50,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        bgcolor: 'secondary.main',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                        '&:hover': {
                            bgcolor: 'secondary.dark',
                             transform: 'translateY(-2px)',
                             boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    Continuar
                </Button>
            </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        PaperProps={{
            sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            ¿Entregar Lección?
        </DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ textAlign: 'center' }}>
                Has respondido {completedQuestions.length} de {lessonData.questions.length || 0} preguntas. 
                ¿Estás seguro de que quieres finalizar esta lección?
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
            <Button 
                onClick={() => setShowConfirmation(false)} 
                variant="outlined" 
                color="inherit"
                sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
                Cancelar
            </Button>
            <Button 
                onClick={handleConfirmFinish} 
                variant="contained" 
                color="secondary"
                autoFocus
                sx={{ borderRadius: 2, fontWeight: 'bold', px: 3 }}
            >
                Entregar
            </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
        
        {/* Header Replacement - Clean Title Area */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h4" fontWeight="900" sx={{ color: 'text.primary', mb: 1 }}>
                    {lessonData.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                        label={`Lección ${lessonId}`} 
                        size="small" 
                        color="secondary" 
                        sx={{ fontWeight: 'bold', borderRadius: 1 }} 
                    />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Pregunta {currentQuestion + 1} de {totalQuestions}
                    </Typography>
                </Box>
            </Box>
            
            <Tooltip title="Salir de la lección">
                <IconButton 
                    onClick={handleExit}
                    sx={{ 
                        bgcolor: 'background.paper', 
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'error.main', color: 'white' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </Box>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
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
                  label={question.type === 'true_false' ? 'Verdadero / Falso' : 'Selección Múltiple'}
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
                  <Typography
                    component="span"
                    variant="h4"
                    sx={{
                      display: 'block',
                      mb: 2,
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
                            borderRadius: 2,
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
                      onClick={handleFinishClick}
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

            {/* Timer moved here */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3, bgcolor: alpha(theme.palette.secondary.main, 0.1), py: 1, borderRadius: 2 }}>
                <TimerIcon fontSize="small" color="secondary" />
                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    {formatTime(timer)}
                </Typography>
            </Box>

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
