const Room = ({ name, players, status, rated, onRoomJoin, formData, isAuthed }) => {
  // Define status colors
  const statusColors = {
    waiting: "text-yellow-400",
    playing: "text-green-400",
    finished: "text-gray-400"
  };

  const playerCount = players?.length ?? 0;
  const isFull = playerCount >= 4;
  // Ranked rooms require an account — block the join client-side instead of letting
  // the server bounce the guest after the fact.
  const rankedLocked = rated && !isAuthed;
  const disabled = status === "playing" || isFull || rankedLocked;

  const buttonLabel = rankedLocked
    ? "Login to Join"
    : status === "playing"
      ? "Game in Progress"
      : "Join Room";

  return (
    <div className="bg-gray-700 rounded-lg p-4 shadow mb-3 hover:bg-gray-650 transition duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <div className="flex space-x-4 mt-1 text-sm text-gray-300">
            <p>Players: <span className="font-medium">{playerCount}/4</span></p>
            <p>Status: <span className={`font-medium ${statusColors[status]}`}>{status}</span></p>
            {rated && <p className="font-medium text-blue-300">Ranked</p>}
          </div>
        </div>

        <button
          onClick={() => onRoomJoin({ roomName: name, username: formData.username, ranked: rated })}
          disabled={disabled}
          className={`px-4 py-2 rounded text-sm font-medium ${disabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

const RoomList = ({ rooms = [], onRoomJoin, formData, isAuthed = false }) => {
  return (
    <div className="space-y-2">
      {!rooms || rooms.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No active rooms. Create one to get started!</p>
      ) : (
        <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
          {rooms.map(room => (
            <Room
              key={room.name + "_" + room.status}
              name={room.name}
              players={room.players}
              status={room.status}
              rated={Boolean(room.rated)}
              onRoomJoin={onRoomJoin}
              formData={formData}
              isAuthed={isAuthed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
