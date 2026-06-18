import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Listings from './pages/Listings'
import Categories from './pages/Categories'
import Bookings from './pages/Bookings'
import Transactions from './pages/Transactions'
import Reviews from './pages/Reviews'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'listings', element: <Listings /> },
      { path: 'categories', element: <Categories /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
