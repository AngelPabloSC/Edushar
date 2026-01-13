import PublicLayout from '../layouts/PublicLayout';
import Landing from '../pages/public/Landing';
import Auth from '../pages/public/Auth';

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
    ],
  },
];

export default publicRoutes;
