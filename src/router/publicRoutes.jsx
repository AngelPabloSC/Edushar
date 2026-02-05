import { lazy, Suspense } from 'react';
import LoadingFallback from '../components/LoadingFallback';
import PublicRoute from './PublicRoute';

// Lazy load page components
const Landing = lazy(() => import('../pages/public/Landing'));
const Auth = lazy(() => import('../pages/public/Auth'));
const NotFound = lazy(() => import('../pages/NotFound'));

const publicRoutes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Landing />
      </Suspense>
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
