import { Suspense, lazy } from 'react';
import ProtectRoute from './ProtectRoute';
import PrivateLayout from '@shared/layouts/PrivateLayout';
import LoadingFallback from '@shared/components/feedback/LoadingFallback';
const AdminModeration = lazy(() => import('@features/admin/pages/AdminModeration'));
const AdminLessons = lazy(() => import('@features/admin/pages/AdminLessons'));
const AdminLessonEditor = lazy(() => import('@features/admin/pages/AdminLessonEditor'));
const AdminStories = lazy(() => import('@features/admin/pages/AdminStories'));
const AdminStoryEditor = lazy(() => import('@features/admin/pages/AdminStoryEditor'));
const AdminDictionary = lazy(() => import('@features/admin/pages/AdminDictionary'));
const AdminDictionaryEditor = lazy(() => import('@features/admin/pages/AdminDictionaryEditor'));
const AdminProfile = lazy(() => import('@features/admin/pages/AdminProfile'));

// Rutas para administradores - Protegidas con ProtectRoute
const adminRoutes = [
  {
    path: '/admin',
    element: (
      <ProtectRoute requiredRole="ADMIN">
        <PrivateLayout />
      </ProtectRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Suspense fallback={<LoadingFallback />}><AdminModeration /></Suspense>,
      },
      {
        path: 'lecciones',
        element: <Suspense fallback={<LoadingFallback />}><AdminLessons /></Suspense>,
      },
      {
        path: 'lecciones/crear',
        element: <Suspense fallback={<LoadingFallback />}><AdminLessonEditor /></Suspense>,
      },
      {
        path: 'lecciones/editar/:id',
        element: <Suspense fallback={<LoadingFallback />}><AdminLessonEditor /></Suspense>,
      },
      {
        path: 'cuentos',
        element: <Suspense fallback={<LoadingFallback />}><AdminStories /></Suspense>,
      },
      {
        path: 'cuentos/crear',
        element: <Suspense fallback={<LoadingFallback />}><AdminStoryEditor /></Suspense>,
      },
      {
        path: 'cuentos/editar/:id',
        element: <Suspense fallback={<LoadingFallback />}><AdminStoryEditor /></Suspense>,
      },
      {
        path: 'diccionario',
        element: <Suspense fallback={<LoadingFallback />}><AdminDictionary /></Suspense>,
      },
      {
        path: 'diccionario/crear',
        element: <Suspense fallback={<LoadingFallback />}><AdminDictionaryEditor /></Suspense>,
      },
      {
        path: 'diccionario/editar/:id',
        element: <Suspense fallback={<LoadingFallback />}><AdminDictionaryEditor /></Suspense>,
      },
      {
        path: 'usuarios',
        element: <div>Gestión de Usuarios - En construcción</div>,
      },
      {
        path: 'editor',
        element: <div>Editor Shuar - En construcción</div>,
      },
      {
        path: 'configuracion',
        element: <div>Configuración - En construcción</div>,
      },
      {
        path: 'perfil',
        element: <Suspense fallback={<LoadingFallback />}><AdminProfile /></Suspense>,
      },
    ],
  },
];

export default adminRoutes;
