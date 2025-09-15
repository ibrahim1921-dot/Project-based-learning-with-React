import React, { useState, useEffect, useRef } from 'react';

function Weather () {
    const [cityName,setCityName] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    //function to handle input change
    const handleInputChange = (e)=>{
        setCityName(e.target.value);
    }
    
    //function to handle data fetching
    async function fetchWeatherData(city) {
        if(!navigator.onLine) {
            setError("No internet. Check your connection.");
            return;
        }

        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if(!apiKey) {
            setError("API key is not set. Please set your OpenWeatherMap API key in the .env file.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=5849da14dbc540b4a0836f9ecbc341ac`);
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
            const data = await response.json();
            setWeatherData(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // Apply current location weather data on initial render
    async function fetchCurrentLocationWeather(lat,lon) {
        if(!navigator.onLine) {
            setError("No internet. Check your connection.");
            return;
        }
        setLoading(true);
        setError(null);
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=5849da14dbc540b4a0836f9ecbc341ac`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
            const data = await response.json();
            setWeatherData(data);
        }catch(e){
            setError(e.message);
        }finally{
            setLoading(false);
        }
    }

    // function to get user's current location
    function getCurrentLocation() {
        if (!("geolocation" in navigator)){
            setError("Geolocation is not supported by your browser.");
            return;
        }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const {latitude,longitude} = pos.coords;
                fetchCurrentLocationWeather(latitude,longitude);
            }, (err) => {
                setLoading(false);
                if (err.code === 1) setError("Permission denied for location.");
                else if (err.code === 2) setError("Position unavailable.");
                else if (err.code === 3) setError("Location request timed out.");
                else setError("Failed to get location.");
            },
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 300000}
        )
    }
    //function to handle default weather data fetching for a default city
    useEffect(() => {
        function handleOnline() { setError(null);}
        function handleOffline() { setError("No internet. Check your connection and try again.");}
        window.addEventListener("online",handleOnline);
        window.addEventListener("offline",handleOffline);
        fetchWeatherData("Asafo");
        return () => {
            window.removeEventListener("online",handleOnline);
            window.removeEventListener("offline",handleOffline);
        }
    }, []);

    //function to handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (cityName.trim()) {
            fetchWeatherData(cityName.trim());
            inputRef.current?.blur();
        }
        setCityName("");
        
    }

    //constructing icon url
    const iconUrl = weatherData?.weather?.[0]?.icon
  ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  : null;
    return(
        <>
            <h1>Weather App</h1>
            <div>
                <form className='form-row' action="" onSubmit={handleFormSubmit}>
                    <input className='input-area'
                        ref={inputRef}
                        id='city-input'
                        type="text"
                        value={cityName}
                        onChange={handleInputChange}
                        placeholder="Enter city name"
                    />
                    <button className='search-btn'
                        type='submit'
                        disabled={loading || !cityName.trim()}
                    >Search</button>
                    <button className='clear-btn'
                        type='button'
                        onClick={()=>setCityName("")}
                        disabled={!cityName.trim()}
                    >Clear</button>
                    <button
                        type='button'
                        className='location-btn'
                        onClick={getCurrentLocation}
                        disabled={loading}
                        title='Use my current location'
                    >My Location</button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p style={{color:"red"}}>{error}</p>}
                {weatherData && (
                    <section>
                        <div className='weather-container'>
                            {iconUrl && (
                                <img
                                className='wather-icon'
                                src={iconUrl}
                                alt={weatherData.weather?.[0]?.description || 'Weather icon'}
                                />
                            )}
                            <h2 className='city-name'>{weatherData.name}</h2>
                            <p className='weather-description'>{weatherData.weather?.[0]?.description}</p>
                            <p className='weather-temp'>{Math.floor(weatherData.main?.temp)}°</p>
                        </div>
                    </section>
                )}
            </div>
        </>
    )
  }
  export default Weather;