import publicRoutes from './publicRoutes';
import studentRoutes from './studentRoutes';
import adminRoutes from './adminRoutes';

const router = [
    ...publicRoutes,
    ...studentRoutes,
    ...adminRoutes,
];

export default router;
