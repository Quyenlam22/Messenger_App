import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";

export const AuthContext = createContext();

function AuthProvider ({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
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

        localStorage.setItem("accessToken", user.stsTokenManager.accessToken);
        const infoUser = user.providerData[0];
        setUser(infoUser);
        if(location.pathname === "/login") {
          navigate("/");
        }
      }
      else {
        setUser(null);
        
        // const isManualLogout = localStorage.getItem("accessToken") === "true";
        if (location.pathname === "/") {
          navigate("/login");
        }

      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener when component unmount
  }, [navigate, location.pathname]);
      
  return (
    <>
      <AuthContext.Provider value={user}>
        {loading ? <Spin/> : children}
      </AuthContext.Provider>
    </>
  )
}

export default AuthProvider;