import { Suspense } from 'react';
import ProtectRoute from './ProtectRoute';
import PrivateLayout from '../layouts/PrivateLayout';
import LoadingFallback from '../components/LoadingFallback';

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
        element: <div>Dashboard Admin - En construcción</div>,
      },
      {
        path: 'lecciones',
        element: <div>Gestión de Lecciones - En construcción</div>,
      },
      {
        path: 'estudiantes',
        element: <div>Gestión de Estudiantes - En construcción</div>,
      },
      {
        path: 'diccionario',
        element: <div>Diccionario Admin - En construcción</div>,
      },
      {
        path: 'historias',
        element: <div>Historias Admin - En construcción</div>,
      },
      {
        path: 'perfil',
        element: <div>Perfil Admin - En construcción</div>,
      },
    ],
  },
];

export default adminRoutes;
