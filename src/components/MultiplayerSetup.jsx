import { useOutletContext } from "react-router";
import RoomList from "./RoomList";
import BackButton from "./BackButton";

const MultiplayerSetup = () => {
  const {
    rooms,
    lobbyControlsData,
    setLobbyControlsData,
    joinRoom
  } = useOutletContext();

  const handleQuickJoin = () => {
    // Find an available room or create a new one
    const availableRooms = rooms.filter(room =>
      room.status === "waiting" && room.players.length < 4
    );

    if (availableRooms.length > 0) {
      // Join a random available room
      const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
      joinRoom({ roomName: randomRoom.name, username: lobbyControlsData.username });
    } else {
      // Create a new quick room
      joinRoom({ roomName: `Quick-${Math.floor(Math.random() * 1000)}`, username: lobbyControlsData.username });
    }
  };

  return (
    // The h-full class and flex column with justify-center for vertical alignment
    <div className="h-full flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          {/* Small screens: stacked */}
          <div className="flex flex-col items-start sm:hidden space-y-2">
            <BackButton to="/" label="Back" />
            <h2 className="text-2xl font-semibold text-blue-400">Play with AI</h2>
          </div>

          {/* Medium+ screens: overlay */}
          <div className="relative h-10 hidden sm:block">
            <div className="absolute left-0 top-0">
              <BackButton to="/" label="Back" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-400 pb-2 text-center absolute inset-0 flex items-center justify-center pointer-events-none">
              Play with Friends
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-md font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={lobbyControlsData.username}
              onChange={(e) => setLobbyControlsData({ ...lobbyControlsData, username: e.target.value })}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="roomName" className="block text-md font-medium text-gray-300 mb-1">
              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              value={lobbyControlsData.roomName}
              onChange={(e) => setLobbyControlsData({ ...lobbyControlsData, roomName: e.target.value })}
              placeholder="Enter room name"
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => joinRoom(lobbyControlsData)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create or Join Room
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-2 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            onClick={handleQuickJoin}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Quick Join Random Game
          </button>

          <div>
            <h3 className="text-lg font-medium text-blue-300 mb-3">Available Rooms</h3>
            <RoomList
              rooms={rooms}
              onRoomJoin={joinRoom}
              formData={lobbyControlsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerSetup;