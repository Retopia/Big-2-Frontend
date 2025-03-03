function Room({ name, playerCount, status, onRoomJoin, formData }) {
  // Define status colors
  const statusColors = {
    waiting: "text-yellow-400",
    playing: "text-green-400",
    finished: "text-gray-400"
  };
  
  return (
    <div className="bg-gray-700 rounded-lg p-4 shadow mb-3 hover:bg-gray-650 transition duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <div className="flex space-x-4 mt-1 text-sm text-gray-300">
            <p>Players: <span className="font-medium">{playerCount}/4</span></p>
            <p>Status: <span className={`font-medium ${statusColors[status]}`}>{status}</span></p>
          </div>
        </div>
        
        <button 
          onClick={() => onRoomJoin({ roomName: name, username: formData.username })}
          disabled={status === "playing" || playerCount >= 4}
          className={`px-4 py-2 rounded text-sm font-medium ${
            status === "playing" || playerCount >= 4 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {status === "playing" ? "Game in Progress" : "Join Room"}
        </button>
      </div>
    </div>
  );
}

function RoomList({ rooms, onRoomJoin, formData }) {
  return (
    <div className="space-y-2">
      {rooms.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No active rooms. Create one to get started!</p>
      ) : (
        <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
          {rooms.map(room => (
            <Room
              key={room.name + "_" + room.status}
              name={room.name}
              playerCount={room.players.length}
              status={room.status}
              onRoomJoin={onRoomJoin}
              formData={formData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomList;