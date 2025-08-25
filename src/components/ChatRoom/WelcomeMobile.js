import { useContext } from "react";
import { AppContext } from "../../Context/AppProvider";

function WelcomeMobile () {
  const { rooms, setSelectedRoomId } = useContext(AppContext);

  return (
    <div className="welcome-mobile res-mob">
      {
        rooms.length > 0 ? (
            rooms.map((room) => (
              <div 
                key={room.id} 
                className="welcome-mobile__item"
                onClick={() => setSelectedRoomId(room.id)}
              >
                <h1 className="welcome-mobile__title">{room.name}</h1>
                {room.desc && <p className="welcome-mobile__desc">{room.desc}</p>}
              </div>
            ))
        ) : (
          <></>
        )
      }
    </div>
  )
}

export default WelcomeMobile;