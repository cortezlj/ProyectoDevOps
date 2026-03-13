import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout/MainLayout";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import LoginPage from "../pages/Login/LoginPage";
import ForgotPassword from "../pages/forgotPassword/ForgotPass";
import Home from "../pages/Home/Home";
import ConsultantDashboard from "../pages/ConsultantDashboard/ConsultantDashboard";
import CreateProject from "../pages/createProject/CreateProject";
import TimeTrackingPM from "../pages/timePM/TimeTrackingPM";
import NotFound from "../pages/notFound/NotFound";
import ChangeRequests from "@/pages/ChangeRequests/ChangeRequests";

export const router = createBrowserRouter([
  // Redirección inicial
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Rutas públicas (Auth)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },

  // Rutas privadas
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/consultant-dashboard",
            element: <ConsultantDashboard />,
          },
          {
            path: "/time-tracking",
            element: <TimeTrackingPM />,
          },
          // Rutas de admin
          {
            element: <AdminRoute />,
            children: [
              {
                path: "/home",
                element: <Home />,
              },
              {
                path: "/create-project",
                element: <CreateProject />,
              },
              {
                path: "/change-requests",
                element: <ChangeRequests />,
              },
            ],
          },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
