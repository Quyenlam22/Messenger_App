import { createContext, useContext, useMemo, useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = createContext();

function AppProvider ({ children }) {
  const user = useContext(AuthContext);
  const [selectedRoomId, setSelectedRoomId] = useState('');

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

  const selectedRoom = useMemo(() => (
    rooms.find(room => room.id === selectedRoomId)
  ), [rooms, selectedRoomId]);
  const membersCondition = useMemo(() => {
    if (!selectedRoom?.members || selectedRoom.members.length === 0) return null;
    return {
      fieldName: 'uid',
      operator: "in",
      compareValue: selectedRoom.members
    };
  }, [selectedRoom?.members]);

  const members = useFirestore("users", membersCondition);
  
  return (
    <>
      <AppContext.Provider 
        value={{rooms, selectedRoomId, setSelectedRoomId, selectedRoom, members}}
      >
        {children}
      </AppContext.Provider>
    </>
  )
}

export default AppProvider;