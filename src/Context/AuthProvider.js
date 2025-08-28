import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export const AuthContext = createContext();

function AuthProvider ({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // const infoUser = {
        //   displayName: user.displayName,
        //   email: user.email,
        //   uid: user.uid,
        //   photoURL: user.photoURL
        // };

        localStorage.setItem("accessToken", user.stsTokenManager.accessToken);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const dbUser = { id: userDoc.id, ...userDoc.data() };

          if (dbUser.state === "offline") {
            await updateDoc(doc(db, "users", dbUser.id), {
              state: "online",
              last_changed: Date.now(),
            });
            dbUser.state = "online";
          }

          setUser(dbUser);
        } else {
          const infoUser = user.providerData[0];
          setUser(infoUser);
        }

        if(location.pathname === "/login") {
          navigate("/");
        }
      }
      else {
        setUser(null);
        
        // const isManualLogout = localStorage.getItem("accessToken") === "true";
        if (location.pathname !== "/login") {
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