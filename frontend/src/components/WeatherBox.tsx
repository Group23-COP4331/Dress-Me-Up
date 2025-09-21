
import { useState, useEffect } from 'react';


function capitalizeWords(description: string): string {
    return description
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the words back into a single string
}

export default function WeatherBox() {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const storedUser = localStorage.getItem("user_data");
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    console.log("Stored user data:", userId);

    if (!userId) {
        console.error("User ID is missing or undefined.");
    }

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/weather?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchWeather();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (!weatherData) {
        return <p>Loading weather data...</p>;
    }

    return (
        <div className="bg-[#a8947c] shadow-md flex flex-col justify-center text-center p-5 rounded-xl max-w-sm aspect-square mx-auto text-white">
            <p className="w-full flex flex-start text-2xl font-medium">{weatherData.temperature}°F</p>
            <div className="w-full h-full flex flex-col justify-center items-center">
            <img 
        src={weatherData.icon} 
        alt="Weather Icon" 
        className="w-1/2 max-w-[100%] h-auto mx-auto" 
    />
                <p className="text-2xl">{capitalizeWords(weatherData.description)}</p>
                <h3 >{weatherData.city}, {weatherData.country}</h3>
            </div>
        </div>
    );
}