// app/page.js
'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import SensorChart from '../components/SensorChart'; // <-- IMPORTA O NOVO COMPONENTE

export default function Dashboard() {
    const [sensorData, setSensorData] = useState({});
    const [connectionStatus, setConnectionStatus] = useState("Conectando...");
    const [selectedSensor, setSelectedSensor] = useState(null); // <-- NOVO ESTADO

    useEffect(() => {
        // ATENÇÃO: Use a sua URL real do Render aqui!
        const WSS_URL = "wss://iot-api-hwib.onrender.com/ws"; 
        const socket = new WebSocket(WSS_URL);

        socket.onopen = () => setConnectionStatus("Conectado");
        socket.onerror = () => setConnectionStatus("Erro!");
        socket.onclose = () => setConnectionStatus("Desconectado");

        socket.onmessage = (event) => {
            if (event.data === 'ping') return; // Ignora pings
            const newData = JSON.parse(event.data);
            newData.receivedAt = new Date().toLocaleTimeString();
            setSensorData(prevData => ({ ...prevData, [newData.sensor_id]: newData }));
        };

        return () => socket.close();
    }, []);

    return (
        <div className="container">
            <Head>
                <title>IoT Dashboard</title>
            </Head>
            <main className="main">
                <h1>Painel de Monitoramento IoT</h1>
                <p>Status da Conexão: <strong>{connectionStatus}</strong></p>

                {/* Div dos cards de sensores */}
                <div className="grid">
                    {Object.keys(sensorData).length > 0 ? (
                        Object.keys(sensorData).map(sensorId => (
                            // Adiciona um onClick para selecionar o sensor
                            <div className="card" key={sensorId} onClick={() => setSelectedSensor(sensorId)}>
                                <h2>{sensorId}</h2>
                                <p>Temperatura: <span>{sensorData[sensorId].temperature}°C</span></p>
                                <p>Umidade: <span>{sensorData[sensorId].humidity}%</span></p>
                                <small>Última Att: {sensorData[sensorId].receivedAt}</small>
                            </div>
                        ))
                    ) : ( <p>Aguardando dados dos sensores...</p> )}
                </div>

                <hr style={{width: '80%', margin: '2rem 0'}}/>

                {/* Div para o gráfico */}
                <div>
                    {selectedSensor ? (
                        <SensorChart sensorId={selectedSensor} />
                    ) : (
                        <h3>Clique em um sensor para ver o histórico</h3>
                    )}
                </div>
            </main>
            {/* O CSS continua o mesmo, não precisa mexer */}
            <style jsx>{`...`}</style>
        </div>
    );
}