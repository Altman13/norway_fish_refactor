import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// pages
import Login from './pages/Login';
import Archive from './pages/Archive';
import DepForm from './pages/DepForm';
import FisOperationForm from './pages/FisOperationForm';
import PorForm from './pages/PorForm';
import CoeForm from './pages/CoeForm';
import CoxForm from './pages/CoxForm';
import TraForm from './pages/TraForm';
import sseData from './pages/sse';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import DcaForm from './pages/DcaForm';
import DcaEditForm from './pages/DcaEditForm';
import Loop1 from './pages/Loop1';
import Loop2 from './pages/Loop2';
import Loop3 from './pages/Loop3';
import Loop4 from './pages/Loop4';
import ListActiveMessages from './pages/ListActiveMessages';
import FavoriteForm from './pages/FavoriteForm';
import AudForm from './pages/AudForm';
import FileUploader from './pages/FileUploader';
import TraStartComponent from './pages/TraStartComponent';

// ----------------------------------------------------------------------

const dashboardRoutes = [
  { path: 'app', element: <DashboardApp /> },
];

const formRoutes = [
  { path: 'archive', element: <Archive /> },
  { path: 'depform', element: <DepForm /> },
  { path: 'fisoperationform', element: <FisOperationForm /> },
  { path: 'favorite', element: <FavoriteForm /> },
  { path: 'aud', element: <AudForm /> },
  { path: 'loop1', element: <Loop1 /> },
  { path: 'loop2', element: <Loop2 /> },
  { path: 'loop3', element: <Loop3 /> },
  { path: 'loop4', element: <Loop4 /> },
  { path: 'sse', element: <sseData /> },
  { path: 'dcaform', element: <DcaForm /> },
  { path: 'dcaeditform', element: <DcaEditForm /> },
  { path: 'porform', element: <PorForm /> },
  { path: 'coeform', element: <CoeForm /> },
  { path: 'coxform', element: <CoxForm /> },
  { path: 'trastart', element: <TraStartComponent /> },
  { path: 'traform', element: <TraForm /> },
  { path: 'register', element: <Register /> },
  { path: 'active', element: <ListActiveMessages /> },
  { path: 'upload', element: <FileUploader /> },
];

export default function Router() {
  const bruker = localStorage.getItem('bruker');

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: dashboardRoutes,
    },
    { path: '/login', element: <Login /> },
    ...formRoutes,
    {
      path: '/',
      element: bruker ? <LogoOnlyLayout /> : <Navigate to="/login" />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
