import React, { useState } from "react";
import "./App.css";
import Lottie from "lottie-react";

import sunnyAnim from "./animations/Sunny.json";
import rainAnim from "./animations/Rainy.json";
import thunderAnim from "./animations/thunder.json";
import cloudyAnim from "./animations/cloudy.json";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [bgAnim, setBgAnim] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&days=6`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setWeather(null);
        setBgAnim(null);
        return;
      }

      setError("");
      setWeather(data);

      const condition = data.current.condition.text.toLowerCase();
      if (condition.includes("thunder")) {
        setBgAnim(thunderAnim);
      } else if (condition.includes("rain")) {
        setBgAnim(rainAnim);
      } else if (condition.includes("sunny")) {
        setBgAnim(sunnyAnim);
      } else {
        setBgAnim(cloudyAnim);
      }
    } catch (error) {
      setError("Failed to fetch weather.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="App">
      {bgAnim && <Lottie animationData={bgAnim} loop className="bg-anim" />}

      <div className="content">
        <h1 className="main-heading">Weather Forecast</h1>
        <input
          className="search-box"
          type="text"
          placeholder="Enter city or state"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={fetchWeather}>Get Forecast</button>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>
              {weather.location.name}, {weather.location.country}
            </h2>
            <p>{weather.current.condition.text}</p>
            <p>Temperature: {weather.current.temp_c}°C</p>

            <div className="forecast">
              <h3>Next 3 Days Forecast</h3>
              <div className="forecast-cards">
                {weather.forecast.forecastday.slice(1).map((day, index) => (
                  <div className="card" key={index}>
                    <p>
                      <strong>{new Date(day.date).toDateString()}</strong>
                    </p>
                    <img
                      src={day.day.condition.icon}
                      alt={day.day.condition.text}
                    />
                    <p>{day.day.condition.text}</p>
                    <p>Max: {day.day.maxtemp_c}°C</p>
                    <p>Min: {day.day.mintemp_c}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
