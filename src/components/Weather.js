import React, { useState } from "react";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("default-bg");

  const API_KEY = "0566885c0ce15319df788f64fc6944ae";
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const getBackgroundClass = (weatherMain, weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return "thunderstorm-bg";
    if (weatherId >= 300 && weatherId < 600) return "rain-bg";
    if (weatherId >= 600 && weatherId < 700) return "snow-bg";
    if (weatherId >= 700 && weatherId < 800) return "fog-bg";
    if (weatherId === 800) return "clear-bg";
    if (weatherId > 800) return "clouds-bg";
    return "default-bg";
  };

  const searchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await fetch(
        `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`,
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the name.");
        } else if (response.status === 401) {
          throw new Error("API key invalid or expired");
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      }

      setWeatherData(data);
      setWeatherCondition(
        getBackgroundClass(data.weather[0].main, data.weather[0].id),
      );
    } catch (err) {
      setError(err.message);
      setWeatherCondition("default-bg");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`weather-container ${weatherCondition}`}>
      {/* Background Shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      <div className="weather-content">
        <h2>🌤️ Weather Dashboard</h2>
        <p className="subtitle">
          Search any city to get current weather information
        </p>

        <div className="search-box">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., Karachi)"
            onKeyPress={(e) => e.key === "Enter" && searchWeather()}
          />
          <button onClick={searchWeather}>Search</button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <button onClick={searchWeather}>Try Again</button>
          </div>
        )}

        {weatherData && !loading && !error && (
          <div className="weather-info">
            <h3>
              {weatherData.name}, {weatherData.sys.country}
            </h3>

            <div className="weather-main">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="weather-icon"
              />
              <div className="temp">
                <span className="value">
                  {Math.round(weatherData.main.temp)}°C
                </span>
              </div>
            </div>

            <div className="condition">
              <p className="weather-desc">
                {weatherData.weather[0].description}
              </p>
              <p className="feels-like">
                Feels like: {Math.round(weatherData.main.feels_like)}°C
              </p>
            </div>

            <div className="extra-info">
              <div className="info-card">
                <span className="label">Humidity</span>
                <span className="value">{weatherData.main.humidity}%</span>
              </div>
              <div className="info-card">
                <span className="label">Wind</span>
                <span className="value">{weatherData.wind.speed} m/s</span>
              </div>
              <div className="info-card">
                <span className="label">Pressure</span>
                <span className="value">{weatherData.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
