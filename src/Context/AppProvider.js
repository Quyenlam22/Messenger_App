import { createContext, useContext, useMemo } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = createContext();

function AppProvider ({ children }) {
  const user = useContext(AuthContext);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
  //     const data = snapshot.docs.map(doc => ({
  //       ...doc.data(),
  //       id: doc.id
  //     }));
  //     console.log(data);
  //   })

  //   // const unsubscribe = onSnapshot(doc(db, "users", "SF"), (doc) => {
  //   //     console.log("Current data: ", doc.data());
  //   // });
  //   return () => unsubscribe();
  // }, []);

  const roomsCondition = useMemo(() => {
    if (!user?.uid) return null;
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user.uid
    };
  }, [user?.uid])

  const rooms = useFirestore("rooms", roomsCondition || {});

  return (
    <>
      <AppContext.Provider value={rooms}>
        {children}
      </AppContext.Provider>
    </>
  )
}

export default AppProvider;