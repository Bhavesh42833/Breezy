import React, { useState } from "react";
import './styles.css'; // Make sure the path is correct based on your project structure

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [infoText, setInfoText] = useState("");
  const [error, setError] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const apiKey = "5a3f0973d0368f251ac468b7ca9a4a12";

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && city !== "") {
      requestApi(city);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Your browser does not support Geolocation");
    }
  };

  const requestApi = (city) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData(api);
  };

  const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData(api);
  };

  const onError = (error) => {
    setInfoText(error.message);
    setError(true);
  };

  const fetchData = (api) => {
    setInfoText("Receiving notifications");
    setError(false);
    fetch(api)
      .then((res) => res.json())
      .then((result) => weatherDetails(result))
      .catch(() => {
        setInfoText("Error");
        setError(true);
      });
  };

  const weatherDetails = (info) => {
    if (info.cod === "404") {
      setInfoText(`${city} isn't a valid city name`);
      setError(true);
    } else {
      const { name, sys, weather, main } = info;
      const { description, id } = weather[0];
      const { temp, feels_like, humidity } = main;

      setWeatherInfo({
        city: name,
        country: sys.country,
        description,
        id,
        temp: Math.floor(temp),
        feels_like: Math.floor(feels_like),
        humidity,
      });

      setInfoText("");
      setCity("");
      setIsActive(true);
    }
  };

  const getWeatherIcon = (id) => {
    if (id === 800) return "clear.svg";
    if (id >= 200 && id <= 232) return "storm.svg";
    if (id >= 600 && id <= 622) return "snowy.svg";
    if (id >= 701 && id <= 781) return "haze.svg";
    if (id >= 801 && id <= 804) return "cloudy.svg";
    if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) return "rainy.svg";
    return "";
  };

  return (
    <div className={`wrapper ${isActive ? "active" : ""}`}>
      <header>
        <i className="bx bx-left-arrow-alt" onClick={() => setIsActive(false)}></i>
        Weather
      </header>
      <section className="input-part">
        <p className={`info-txt ${error ? "error" : ""}`}>{infoText}</p>
        <div className="content">
          <input
            type="text"
            spellCheck="false"
            placeholder="Enter the city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyUp={handleKeyUp}
            required
          />
          <div className="separator"></div>
          <button onClick={handleLocationClick}>Location of the device</button>
        </div>
      </section>
      {weatherInfo && (
        <section className="weather-part">
          <img src={getWeatherIcon(weatherInfo.id)} alt="Weather Icon" />
          <div className="temp">
            <span className="numb">{weatherInfo.temp}</span>
            <span className="deg">°</span>C
          </div>
          <div className="weather">{weatherInfo.description}</div>
          <div className="location">
            <i className="bx bx-map"></i>
            <span>{`${weatherInfo.city}, ${weatherInfo.country}`}</span>
          </div>
          <div className="bottom-details">
            <div className="column feels">
              <i className="bx bxs-thermometer"></i>
              <div className="details">
                <div className="temp">
                  <span className="numb-2">{weatherInfo.feels_like}</span>
                  <span className="deg">°</span>C
                </div>
                <p>Feels Like</p>
              </div>
            </div>
            <div className="column humidity">
              <i className="bx bxs-droplet-half"></i>
              <div className="details">
                <span>{weatherInfo.humidity}</span>
                <p>Moisture</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default WeatherApp;
