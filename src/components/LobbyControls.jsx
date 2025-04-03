function LobbyControls({ onRoomJoin, formData, setFormData, rooms = [] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Join a Game</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Enter username"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-1">
            Room Name
          </label>
          <input
            id="roomName"
            type="text"
            value={formData.roomName}
            onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            placeholder="Enter room name"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => onRoomJoin(formData)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create or Join Room
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button
          onClick={() => {
            // Find an available room or create a new one
            const availableRooms = rooms.filter(room =>
              room.status === "waiting" && room.players.length < 4
            );

            if (availableRooms.length > 0) {
              // Join a random available room
              const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
              onRoomJoin({ ...formData, roomName: randomRoom.name });
            } else {
              // Create a new quick room
              onRoomJoin({ ...formData, roomName: `Quick-${Math.floor(Math.random() * 1000)}` });
            }
          }}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Quick Join Random Game
        </button>
      </div>

      <div className="bg-indigo-900 rounded-lg p-6 border border-indigo-700">
        <h2 className="text-xl font-semibold mb-4">Play Against AI</h2>
        <p className="text-gray-300 mb-4">Practice your skills or enjoy a quick game against computer opponents</p>

        <div className="flex gap-3 mb-4">
          <select className="bg-indigo-800 p-2 rounded flex-1">
            <option>1 AI opponent</option>
            <option>2 AI opponents</option>
            <option>3 AI opponents</option>
          </select>

          <select className="bg-indigo-800 p-2 rounded flex-1">
            <option>Standard</option>
          </select>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-medium">
          Start AI Game
        </button>
      </div>
    </div>
  );
}

export default LobbyControls;