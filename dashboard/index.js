import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");

  useEffect(() => {
    const WSS_URL = "wss://iot-api-hwib.onrender.com/ws"; 
    const socket = new WebSocket(WSS_URL);

    socket.onopen = () => {
      console.log("WebSocket connected!");
      setConnectionStatus("Conectado");
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("New data:", newData);

        newData.receivedAt = new Date().toLocaleTimeString();

        setSensorData(prevData => ({
          ...prevData,
          [newData.sensor_id]: newData
        }));

      } catch (error) {
        console.warn("Received non-JSON message (maybe ping or other):", event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      setConnectionStatus("Erro!");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected!");
      setConnectionStatus("Desconectado. Tentando reconectar em 5s...");
    };

    return () => {
      socket.close();
    };
  }, []); 

  return (
    <div className="container">
      <Head>
        <title>IoT Dashboard</title>
        <meta name="description" content="Monitoramento IoT em tempo real" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1>Painel de Monitoramento IoT</h1>
        <p className={`status ${connectionStatus.toLowerCase()}`}>
          Status da Conexão: <strong>{connectionStatus}</strong>
        </p>

        <div className="grid">
          {Object.keys(sensorData).length > 0 ? (
            Object.keys(sensorData).map(sensorId => (
              <div className="card" key={sensorId}>
                <h2>{sensorId}</h2>
                <p>Temperatura: <span>{sensorData[sensorId].temperature}°C</span></p>
                <p>Umidade: <span>{sensorData[sensorId].humidity}%</span></p>
                <small>Última Att: {sensorData[sensorId].receivedAt}</small>
              </div>
            ))
          ) : (
            <p>Aguardando dados dos sensores...</p>
          )}
        </div>
      </main>

      {/* Estilos CSS embutidos para simplicidade */}
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          font-family: sans-serif;
        }
        .main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 {
            color: #333;
        }
        .status {
            font-size: 1.1em;
            margin-bottom: 2rem;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .status.conectado { background-color: #d4edda; color: #155724; }
        .status.erro! { background-color: #f8d7da; color: #721c24; }
        .status.conectando...,
        .status.desconectado { background-color: #fff3cd; color: #856404; }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 1rem;
        }
        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 220px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card:hover {
          border-color: #0070f3;
        }
        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #0070f3;
        }
        .card p {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.5;
          color: #555;
        }
        .card p span {
            font-weight: bold;
            color: #333;
        }
        .card small {
            display: block;
            margin-top: 1rem;
            font-size: 0.8em;
            color: #888;
        }
      `}</style>
    </div>
  );
}
