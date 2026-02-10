import { lazy, Suspense } from 'react';
import LoadingFallback from '@shared/components/feedback/LoadingFallback';
import PublicRoute from './PublicRoute';

// Lazy load page components
// Lazy load page components
const Landing = lazy(() => import('@features/landing/pages/Landing'));
const Auth = lazy(() => import('@features/auth/pages/Auth'));
const NotFound = lazy(() => import('@shared/pages/NotFound'));

const publicRoutes = [
  {
    path: '/',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Landing />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: 'login',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Auth />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

export default publicRoutes;
