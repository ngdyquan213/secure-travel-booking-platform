import type { RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { stitchPages } from '@/shared/config/stitchPages'

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: stitchPages.login.path, element: <LoginPage /> },
      { path: stitchPages.register.path, element: <RegisterPage /> },
      { path: stitchPages.forgotPassword.path, element: <ForgotPasswordPage /> },
      { path: stitchPages.resetPassword.path, element: <ResetPasswordPage /> },
    ],
  },
]
