function LobbyControls({ onRoomJoin, formData, setFormData }) {

  return (
    <>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Enter username"
      />
      <input
        type="text"
        value={formData.roomName}
        onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
        placeholder="Enter room name"
      />
      <button onClick={() => onRoomJoin(formData)}>Create or Join Room</button>
    </>
  )
}

export default LobbyControls;