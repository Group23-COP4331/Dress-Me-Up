import React, { useState, useEffect } from 'react';

function capitalizeWords(description: string): string {
    return description
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the words back into a single string
}

export default function WeatherBox() {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/weather?userId=67eb0d6b16530df2cf3fa74c'); // Replace `1` with the actual userId
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
        <div className="bg-[#b6c7a9] flex flex-col justify-center text-center p-5 border border-gray-300 rounded-lg max-w-sm aspect-square mx-auto ">
            <p className="w-full flex flex-start text-2xl">{weatherData.temperature}°C</p>
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