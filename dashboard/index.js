import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Lembre-se de alterar a URL!
    const socket = new WebSocket("wss://sua-api.render.com/ws");

    socket.onopen = () => {
      console.log("WebSocket connected!");
      setMessage("Conectado ao WebSocket...");
    };

    socket.onmessage = (event) => {
      console.log("Message from server: ", event.data);
      setMessage(event.data);
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
        setMessage("Erro no WebSocket!");
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected!");
        setMessage("WebSocket desconectado.");
    };

    // Cleanup function
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return <div>Mensagem em tempo real: {message}</div>;
}
