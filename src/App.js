import React from "react";
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

const Layout = () => (
  <div>
    <h1>User Dashboard</h1>
    <nav className="navbar">
      <Link to="/">Dashboard</Link> | <Link to="/users">Users</Link>
    </nav>
    <Outlet />
  </div>
);

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "users", element: <Users /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
