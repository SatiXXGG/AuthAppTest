import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./Routes/Register";
import Login from "./Routes/Login";
import Home from "./Routes/Home";
import Settings from "./Routes/Settings";
import Verify from "./Routes/VerifyEmail";
import VerifyUrl from "./Routes/verifyUrl";
import CreateApp from "./Routes/CreateApp";
import AppView from "./Routes/AppView";
import AnswerTicket from "./Routes/AnswerTicket";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/verify-email",
    element: <Verify />,
  },
  {
    path: "/verify/:id/:code",
    element: <VerifyUrl />,
  },
  {
    path: "/create",
    element: <CreateApp></CreateApp>,
  },
  {
    path: "/apps/:id",
    element: <AppView></AppView>,
  },
  {
    path: "/app/:id/answer",
    element: <AnswerTicket></AnswerTicket>,
  },
]);

//creates a user-data context
export const UserContext = React.createContext({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContext.Provider value={{}}>
      <RouterProvider router={router}></RouterProvider>
    </UserContext.Provider>
  </React.StrictMode>
);
