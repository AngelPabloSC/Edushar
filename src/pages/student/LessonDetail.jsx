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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import TimerIcon from '@mui/icons-material/Timer';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonQuestions } from '../../data/lessonQuestionsData';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [timer, setTimer] = useState(0);

  const lessonData = getLessonQuestions(parseInt(lessonId));

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
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer('');
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
    setSelectedAnswer('');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src="https://via.placeholder.com/48"
                alt="EduShar"
                sx={{ width: 48, height: 48, borderRadius: '50%' }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  EduShar
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Lección {lessonId}: {lessonData.title}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => navigate('/estudiante/lecciones')}
              aria-label="Salir de la lección"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
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
                  bgcolor: 'rgba(209, 154, 74, 0.1)',
                  color: 'secondary.main',
                  fontWeight: 600,
                  mb: 3,
                  alignSelf: 'center',
                }}
              />

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                Traduce: <br />
                <Typography
                  component="span"
                  variant="h4"
                  sx={{
                    fontStyle: 'italic',
                    color: 'secondary.main',
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
                  {question.options.map((option) => (
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
                        <Typography variant="h6" fontWeight={500}>
                          {option.text}
                        </Typography>
                      }
                      sx={{
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          bgcolor: 'rgba(209, 154, 74, 0.04)',
                        },
                        '&:has(.Mui-checked)': {
                          borderColor: 'secondary.main',
                          bgcolor: 'rgba(209, 154, 74, 0.08)',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

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
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Anterior
              </Button>
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
                }}
              >
                Siguiente
              </Button>
            </Box>
          </Box>

          {/* Progress Sidebar */}
          <Box
            sx={{
              width: { xs: '100%', md: 288 },
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 3,
                textAlign: 'center',
              }}
            >
              Progreso de la Lección
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 'auto' }}>
              {[...Array(totalQuestions)].map((_, index) => {
                const isCompleted = completedQuestions.includes(index);
                const isCurrent = index === currentQuestion;

                return (
                  <Grid item xs={3} key={index}>
                    <IconButton
                      onClick={() => handleQuestionClick(index)}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isCompleted
                          ? 'success.main'
                          : isCurrent
                          ? 'secondary.main'
                          : 'action.disabledBackground',
                        color: isCompleted || isCurrent ? 'white' : 'text.disabled',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        ...(isCurrent && {
                          boxShadow: 3,
                          transform: 'scale(1.05)',
                          border: '2px solid',
                          borderColor: 'secondary.main',
                        }),
                        '&:hover': {
                          bgcolor: isCompleted
                            ? 'success.dark'
                            : isCurrent
                            ? 'secondary.dark'
                            : 'action.disabled',
                        },
                      }}
                    >
                      {isCompleted ? <CheckIcon fontSize="small" /> : index + 1}
                    </IconButton>
                  </Grid>
                );
              })}
            </Grid>

            {/* Timer */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                bgcolor: 'background.paper',
                borderRadius: 2,
                py: 1.5,
                px: 2,
                boxShadow: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <TimerIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                {formatTime(timer)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LessonDetail;
