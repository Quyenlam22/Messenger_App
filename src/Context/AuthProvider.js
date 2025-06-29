import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

export const AuthContext = createContext();

function AuthProvider ({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const infoUser = {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL
        };
        setUser(infoUser);
        navigate("/");
      }
      else {
        setUser({});
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener when component unmount
  }, [navigate]);

  return (
    <>
      <AuthContext.Provider value={user}>
        {loading ? <Spin/> : children}
      </AuthContext.Provider>
    </>
  )
}

export default AuthProvider;