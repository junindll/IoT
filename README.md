# Projeto: Sistema de Monitoramento de Ambiente com IoT e Web Dashboard

[cite_start]Este projeto, desenvolvido para fins acadêmicos, simula um sistema distribuído para monitoramento de sensores IoT em tempo real. [cite_start]Ele integra tecnologias como microsserviços, cloud computing e processamento de dados em tempo real para criar uma solução robusta e moderna.

## Links para o Projeto no Ar

* **Dashboard Interativo (Vercel):** [https://io-t-eight.vercel.app](https://io-t-eight.vercel.app)
* **API de Dados (Render):** [https://iot-api-hwib.onrender.com](https://iot-api-hwib.onrender.com)

## Arquitetura do Sistema

[cite_start]O sistema é componentizado em uma arquitetura de microsserviços, onde cada parte tem uma responsabilidade única:

* [cite_start]**Simulador IoT (Local):** Um script em Python que simula múltiplos sensores enviando dados de temperatura e umidade via requisições HTTP.
* [cite_start]**API REST (Backend):** Desenvolvida com FastAPI (Python) e hospedada no Render.com, esta API recebe os dados dos sensores, armazena-os em um banco de dados e os distribui em tempo real via WebSockets.
* [cite_start]**Banco de Dados NoSQL:** Um cluster gratuito do MongoDB Atlas é usado para armazenar todos os dados históricos dos sensores de forma distribuída e escalável.
* [cite_start]**Painel Web (Dashboard):** Um frontend moderno desenvolvido com Next.js e hospedado na Vercel. [cite_start]Ele se conecta à API para exibir os dados em tempo real e permite visualizar gráficos com o histórico de cada sensor.

## Tecnologias Utilizadas

| Componente              | Ferramenta Gratuita       |
| ----------------------- | ------------------------- |
| API REST                | [cite_start]FastAPI (Python)           |
| Front-end               | [cite_start]Next.js (React)          |
| Banco NoSQL             | [cite_start]MongoDB Atlas            |
| Simulador IoT           | [cite_start]Script Python com aiohttp  |
| Hospedagem (Backend)    | [cite_start]Render.com               |
| Hospedagem (Frontend)   | [cite_start]Vercel                   |
| Comunicação Real-Time   | [cite_start]WebSockets               |

## Como Executar e Testar o Projeto

Para testar o sistema completo, siga os passos:

**Pré-requisitos:**
* Python 3 instalado.
* Acesso à internet.

**Passos:**
1.  **Clone este repositório:**
    ```bash
    git clone [https://github.com/junindll/IoT.git](https://github.com/junindll/IoT.git)
    cd IoT
    ```
2.  **Instale as dependências do simulador:**
    ```bash
    pip install aiohttp
    ```
3.  **Execute o Simulador:**
    ```bash
    python sensor_simulator/simulate.py
    ```
    O terminal começará a exibir `Status: 200`, indicando que os dados estão sendo enviados com sucesso para a API na nuvem.

4.  **Acesse o Dashboard:**
    * Abra o link a seguir no seu navegador: **[https://io-t-eight.vercel.app](https://io-t-eight.vercel.app)**
    * Você verá os "cards" dos sensores aparecendo e se atualizando em tempo real.
    * Clique em um dos cards para ver um gráfico com o histórico de dados daquele sensor.
