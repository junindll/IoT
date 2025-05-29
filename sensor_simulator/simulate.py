import asyncio
import random
import aiohttp

URL = "https://iot-api-hwib.onrender.com/data" # Lembre-se de alterar!

async def send_data(sensor_id):
    while True:
        data = {
            "sensor_id": sensor_id,
            "temperature": round(random.uniform(20, 35), 2),
            "humidity": round(random.uniform(30, 70), 2)
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(URL, json=data) as response:
                    print(f"Sent {data}, Status: {response.status}")
        except Exception as e:
            print(f"Error sending data: {e}")
        await asyncio.sleep(5)

async def main():
    tasks = [send_data(f"sensor_{i}") for i in range(5)]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
