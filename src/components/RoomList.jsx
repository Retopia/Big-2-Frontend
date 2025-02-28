// Status is either [waiting, playing, finished]
function Room({ name, playerCount, status, onRoomJoin, formData }) {
  return (
    <div>
      <p>Room Name: {name}</p>
      <p>Players: {playerCount}/4</p>
      <p>Status: {status}</p>
      <button onClick={() => onRoomJoin({ roomName: name, username: formData.username })}>Join Room</button>
    </div>
  );
}

function RoomList({ rooms, onRoomJoin, formData }) {
  return (
    <div>
      {rooms.map(room => {
        return (
          <Room
            key={room.name + "_" + room.status}
            name={room.name}
            playerCount={room.players.length}
            status={room.status}
            onRoomJoin={onRoomJoin}
            formData={formData}
          />
        )
      })}
    </div>
  );
}

export default RoomList;