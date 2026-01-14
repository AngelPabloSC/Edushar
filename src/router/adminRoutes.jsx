import { Suspense, lazy } from 'react';
import ProtectRoute from './ProtectRoute';
import PrivateLayout from '../layouts/PrivateLayout';
import LoadingFallback from '../components/LoadingFallback';
import AdminModeration from '../pages/admin/AdminModeration';
import AdminLessons from '../pages/admin/AdminLessons';
const AdminLessonEditor = lazy(() => import('../pages/admin/AdminLessonEditor'));
const AdminStories = lazy(() => import('../pages/admin/AdminStories'));
const AdminStoryEditor = lazy(() => import('../pages/admin/AdminStoryEditor'));
const AdminDictionary = lazy(() => import('../pages/admin/AdminDictionary'));
const AdminDictionaryEditor = lazy(() => import('../pages/admin/AdminDictionaryEditor'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));

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
        element: <AdminModeration />,
      },
      {
        path: 'lecciones',
        element: <AdminLessons />,
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
