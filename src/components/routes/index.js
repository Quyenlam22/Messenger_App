import ChatRoom from "../pages/ChatRoom";
import Login from "../pages/Login";

export const routes = [
  {
    path: '/',
    element: <ChatRoom/>
  },
  {
    path: '/login',
    element: <Login/>
  },
]