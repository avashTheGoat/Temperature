//#region INPUT
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

const isCelsiusRadio = document.getElementById("celsius");
isCelsiusRadio.checked = true;
const isFahrenheitRadio = document.getElementById("fahrenheit");
//#endregion

const getWeatherButton = document.getElementById("get-weather");

//#region OUTPUT
const temperatureOutput = document.getElementById("weather-output");
//#endregion

getWeatherButton.addEventListener('click', _event => {
    
    const _LAT = Number(latitudeInput.value);
    const _LONG = Number(longitudeInput.value);
    
    if (isNaN(_LAT) || isNaN(_LONG) || _LAT === Math.E || _LONG === Math.E) {
        temperatureOutput.textContent = "Please enter a number."
        return;
    }

    if (_LAT < -90 || _LAT > 90) {
        temperatureOutput.textContent = "Please enter a valid latitude (>= -90, <= 90).";
        return;
    }

    if (_LONG < -180 || _LONG > 180) {
        temperatureOutput.textContent = "Please enter a valid longitude (>= -180, <= 180).";
        return;
    }

    temperatureOutput.textContent = "Loading...";
    fetch(`https://api.open-meteo.com/v1/gfs?latitude=${latitudeInput.value}&longitude=${longitudeInput.value}&hourly=temperature_2m&temperature_unit=${isCelsiusRadio.checked ? "celsius" : "fahrenheit"}&wind_speed_unit=ms&precipitation_unit=inch&forecast_days=1`)
    .then(_response => _response.json())
    .then(_response => {
        let _currentHour = new Date().getHours();
        temperatureOutput.textContent = `Temperature: ${_response.hourly.temperature_2m[_currentHour - 1]}°
        ${isCelsiusRadio.checked ? "C" : "F"}`;

        let _tempInFahrenheit = _response.hourly.temperature_2m[_currentHour - 1];
        if (isCelsiusRadio.checked) {
            _tempInFahrenheit = _tempInFahrenheit * 9 / 5 + 32;
        }

        if (_tempInFahrenheit <= 25) {
            temperatureOutput.textContent += " ❄";
        }

        else if (_tempInFahrenheit >= 81.5) {
            temperatureOutput.textContent += " 🔥";
        }
    })
    .catch(error => { console.error(error); temperatureOutput.textContent = "An error occured. Please try again." });
});