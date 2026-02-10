import { lazy, Suspense } from 'react';
import ProtectRoute from './ProtectRoute';
import PrivateLayout from '@shared/layouts/PrivateLayout';
import LoadingFallback from '@shared/components/feedback/LoadingFallback';

// Lazy load page components
import StudentLayout from '@shared/layouts/StudentLayout';

// Lazy load page components
// Lazy load page components
const LessonDetail = lazy(() => import('@features/student/pages/LessonDetail'));
const StudentHome = lazy(() => import('@features/student/pages/StudentHome'));
const StudentDashboard = lazy(() => import('@features/student/pages/StudentDashboard'));
const StudentContributions = lazy(() => import('@features/student/pages/StudentContributions'));
const StudentStories = lazy(() => import('@features/student/pages/StudentStories'));
const StoryReader = lazy(() => import('@features/student/pages/StoryReader'));
const StudentDictionary = lazy(() => import('@features/student/pages/StudentDictionary'));
const StudentProfile = lazy(() => import('@features/student/pages/StudentProfile'));
const StudentTranslator = lazy(() => import('@features/student/pages/StudentTranslator'));

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
        path: 'cuentos/:storyId',
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

