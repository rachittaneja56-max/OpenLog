import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PublicTrackerPage } from '../pages/PublicTrackerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'learn/:slug',
        element: <PublicTrackerPage />,
      },
      {
        path: 'dashboard/:slug',
        element: <DashboardPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
