import { RouteObject } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout'
import HomePage from '../../pages/public/HomePage'
import BlogListPage from '../../pages/public/BlogListPage'
import BlogDetailPage from '../../pages/public/BlogDetailPage'
import AboutPage from '../../pages/public/AboutPage'
import ServicesPage from '../../pages/public/ServicesPage'
import ContactPage from '../../pages/public/ContactPage'

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:id', element: <BlogDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },
]
