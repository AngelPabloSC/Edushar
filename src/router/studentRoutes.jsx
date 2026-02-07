import { lazy, Suspense } from 'react';
import ProtectRoute from './ProtectRoute';
import PrivateLayout from '../layouts/PrivateLayout';
import LoadingFallback from '../components/LoadingFallback';

// Lazy load page components
import StudentLayout from '../layouts/StudentLayout';

// Lazy load page components
const LessonDetail = lazy(() => import('../pages/student/LessonDetail'));
const StudentHome = lazy(() => import('../pages/student/StudentHome'));
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentContributions = lazy(() => import('../pages/student/StudentContributions'));
const StudentStories = lazy(() => import('../pages/student/StudentStories'));
const StoryReader = lazy(() => import('../pages/student/StoryReader'));
const StudentDictionary = lazy(() => import('../pages/student/StudentDictionary'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const StudentTranslator = lazy(() => import('../pages/student/StudentTranslator'));

// Rutas para estudiantes autenticados - Protegidas con ProtectRoute
const studentRoutes = [
  // Rutas con Layout de Estudiante (Header Only)
  {
    path: '/estudiante',
    element: (
      <ProtectRoute requiredRole="ESTUDIANTE">
        <StudentLayout />
      </ProtectRoute>
    ),
    children: [
      {
        path: 'inicio', // /estudiante/inicio
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentHome />
          </Suspense>
        ),
      },
      {
        path: 'lecciones',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentDashboard />
          </Suspense>
        ),
      },
      {
        path: 'diccionario',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentDictionary />
          </Suspense>
        ),
      },
      {
        path: 'traductor',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentTranslator />
          </Suspense>
        ),
      },
      {
        path: 'cuentos',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentStories />
          </Suspense>
        ),
      },
      {
        path: 'contribuciones',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentContributions />
          </Suspense>
        ),
      },
      {
        path: 'perfil',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StudentProfile />
          </Suspense>
        ),
      },
      {
        path: 'cuentos/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <StoryReader />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/leccion/:lessonId',
    element: (
      <ProtectRoute requiredRole="ESTUDIANTE">
        <Suspense fallback={<LoadingFallback />}>
          <LessonDetail />
        </Suspense>
      </ProtectRoute>
    ),
  },
  {
    path: '/cuento/:storyId',
    element: (
      <ProtectRoute requiredRole="ESTUDIANTE">
        <Suspense fallback={<LoadingFallback />}>
          <StoryReader />
        </Suspense>
      </ProtectRoute>
    ),
  },
];

export default studentRoutes;

