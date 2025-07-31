import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Spin } from "antd";

export const AuthContext = createContext();

function AuthProvider ({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // const infoUser = {
        //   displayName: user.displayName,
        //   email: user.email,
        //   uid: user.uid,
        //   photoURL: user.photoURL
        // };
        const infoUser = user.providerData[0];
        setUser(infoUser);
        navigate("/");
      }
      else {
        setUser(null);
        
        const isManualLogout = sessionStorage.getItem("logout") === "true";
        if (location.pathname === "/" && !isManualLogout) {
          messageApi.open({
            type: "warning",
            content: "You must login to continue!",
            duration: 1,
          });
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          navigate("/login");
        }

        sessionStorage.removeItem("logout");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener when component unmount
  }, [navigate, location.pathname, messageApi]);

  return (
    <>
      {contextHolder}
      <AuthContext.Provider value={user}>
        {loading ? <Spin/> : children}
      </AuthContext.Provider>
    </>
  )
}

export default AuthProvider;