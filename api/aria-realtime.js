export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
  const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

  if (!ELEVEN_KEY || !AGENT_ID) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), {
      status: 500,
    });
  }

  const target = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;

  const upgrade = req.headers.get("Upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  const ws = new WebSocket(target, {
    headers: {
      "xi-api-key": ELEVEN_KEY,
    },
  });

  ws.onmessage = (event) => socket.send(event.data);
  ws.onopen = () => console.log("Connected to ElevenLabs agent");
  ws.onerror = () => console.log("WS error");
  ws.onclose = () => socket.close();

  socket.onmessage = (event) => ws.send(event.data);
  socket.onclose = () => ws.close();

  return response;
}
