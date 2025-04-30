import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from './pages/Root';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="chat" replace />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
