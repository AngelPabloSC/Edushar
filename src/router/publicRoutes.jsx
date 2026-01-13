import PublicLayout from '../layouts/PublicLayout';
import Landing from '../pages/public/Landing';
import Auth from '../pages/public/Auth';
import Lessons from '../pages/public/Lessons';
import NotFound from '../pages/NotFound';

const publicRoutes = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'login',
        element: <Auth />,
      },
      {
        path: 'register',
        element: <Auth />,
      },
      {
        path: 'lecciones',
        element: <Lessons />,
      },
      // Catch-all route for 404
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default publicRoutes;
