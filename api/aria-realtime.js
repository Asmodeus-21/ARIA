// /api/aria-realtime.js (Vercel Edge Function)

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
  const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

  if (!ELEVEN_KEY || !AGENT_ID) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), { status: 500 });
  }

  const target = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;

  const upgradeHeader = req.headers.get("Upgrade") || "";
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  const ws = new WebSocket(target, {
    headers: {
      "xi-api-key": ELEVEN_KEY,
    },
  });

  ws.onopen = () => {
    socket.send(JSON.stringify({ type: "session_started" }));
  };

  ws.onmessage = (msg) => {
    socket.send(msg.data);
  };

  ws.onerror = (err) => {
    socket.close();
    ws.close();
  };

  socket.onmessage = (msg) => {
    ws.send(msg.data);
  };

  socket.onclose = () => {
    ws.close();
  };

  return response;
}
