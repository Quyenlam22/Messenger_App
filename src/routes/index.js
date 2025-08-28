import LayoutDefault from "../layouts/LayoutDefault";
import ChatRoom from "../pages/ChatRoom";
import Login from "../pages/Login";
import Error404 from "../pages/Error404";
import User from "../pages/User";

export const routes = [
  {
    element: <LayoutDefault/>,
    children: [
      {
        path: '/',
        element: <ChatRoom/>
      },
      {
        path: '/users',
        element: <User/>
      },
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/*',
    element: <Error404/>
  },
]