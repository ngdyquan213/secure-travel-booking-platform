import { RouteObject } from 'react-router-dom'
import { GuestGuard } from './guards/GuestGuard'
import AuthLayout from '../../layouts/AuthLayout'
import LoginPage from '../../pages/auth/LoginPage'
import RegisterPage from '../../pages/auth/RegisterPage'
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage'

export const authRoutes: RouteObject[] = [
  {
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password/:token', element: <ResetPasswordPage /> },
    ],
  },
]
