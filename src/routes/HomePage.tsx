import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

export default function HomePage() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      navigate(`/room/${data.roomId}`);
    } catch (err) {
      console.error("Failed to create room", err);
      alert("Error creating room. Is backend running on :8000?");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <main className="home">
      <section className="home-card">
        <h1 className="home-title">Seditor</h1>
        <p className="home-subtitle">
          Realtime collaborative code editor. Create a room, share the link, and
          start coding together.
        </p>

        <div className="home-actions">
          <button
            className="btn btn-primary"
            onClick={createRoom}
            disabled={loading}
          >
            {loading ? "Creating..." : "🚀 Create new room"}
          </button>

          <div className="home-join-row">
            <input
              className="input"
              placeholder="Enter existing Room ID"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={joinRoom}>
              Join
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
