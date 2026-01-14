import { lazy, Suspense } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import LoadingFallback from '../components/LoadingFallback';

// Lazy load page components
const Landing = lazy(() => import('../pages/public/Landing'));
const Auth = lazy(() => import('../pages/public/Auth'));
const Lessons = lazy(() => import('../pages/public/Lessons'));
const NotFound = lazy(() => import('../pages/NotFound'));

const publicRoutes = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Auth />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Auth />
          </Suspense>
        ),
      },
      {
        path: 'lecciones',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Lessons />
          </Suspense>
        ),
      },
      // Catch-all route for 404
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
];

export default publicRoutes;

