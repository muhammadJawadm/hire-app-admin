import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Listings from "./pages/Listings";
import Categories from "./pages/Categories";
import Bookings from "./pages/Bookings";
import Transactions from "./pages/Transactions";
import Reviews from "./pages/Reviews";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true,           element: <Dashboard />     },
      { path: "users",         element: <Users />         },
      { path: "listings",      element: <Listings />      },
      { path: "categories",    element: <Categories />    },
      { path: "bookings",      element: <Bookings />      },
      { path: "transactions",  element: <Transactions />  },
      { path: "reviews",       element: <Reviews />       },
      { path: "reports",       element: <Reports />       },
      { path: "settings",      element: <Settings />      },
      { path: "profile",       element: <Profile />       },
      { path: "notifications", element: <Notifications /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
