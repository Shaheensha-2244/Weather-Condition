async function getData(e) {
    e.preventDefault();

    let loadingElem = document.getElementById("loading");
    let textboxElem = document.getElementById("textBox");

    let city = textboxElem.value.trim();

    if (city == "") {
        alert("Please enter city name");
        return;
    }

    loadingElem.style.display = "block";

    let api = `http://api.weatherapi.com/v1/forecast.json?key=76a368caa21646d7b5740739251402&q=${city}&days=3&aqi=no&alerts=no`;

    try {

        let res = await fetch(api);
        let data = await res.json();

        if (data.error) {
            alert(data.error.message);
            return;
        }

        display(data);

    }
    catch (err) {
        alert("Please check city name");
    }
    finally {
        loadingElem.style.display = "none";
        textboxElem.value = "";
    }
}

function display(data) {

    let todayHours = data.forecast.forecastday[0].hour;

    let hourlyForecast = "";

    let timings = [6, 9, 12, 15, 18, 21];

    timings.forEach((time) => {

        hourlyForecast += `
        
        <div class="forecast-item">
            <p>${formatTime(time)}</p>
            <img src="${todayHours[time].condition.icon}">
            <h5>${todayHours[time].temp_c}°</h5>
        </div>
        
        `;
    });

    let nextDays = "";

    data.forecast.forecastday.forEach((item, index) => {

        let dayName;

        if (index == 0) {
            dayName = "Today";
        }
        else {
            dayName = new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'short'
            });
        }

        nextDays += `
        
        <div class="day-card">
            <p>${dayName}</p>

            <div class="d-flex align-items-center gap-2">
                <img src="${item.day.condition.icon}">
                <span>${item.day.condition.text}</span>
            </div>

            <h6>${item.day.maxtemp_c}/${item.day.mintemp_c}</h6>
        </div>
        
        `;
    });

    let htmlCode = `

    <!-- LEFT SIDE -->
    <div class="col-lg-8">

        <div class="main-card">

            <!-- Top -->
            <div class="top-section">

                <div>
                    <h1>${data.location.name}</h1>
                    <p>Chance of rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>

                    <h2 class="temp">${data.current.temp_c}°</h2>
                </div>

                <div>
                    <img class="main-icon" src="${data.current.condition.icon}">
                </div>

            </div>

            <!-- Today's Forecast -->
            <div class="forecast-box">

                <h5 class="mb-4">TODAY'S FORECAST</h5>

                <div class="forecast-container">
                    ${hourlyForecast}
                </div>

            </div>

            <!-- Air Conditions -->
            <div class="air-box">

                <div class="air-header">
                    <h5>AIR CONDITIONS</h5>

                    <button>See More</button>
                </div>

                <div class="air-grid">

                    <div class="air-item">
                    
                        <p> <i class="fa-solid fa-temperature-three-quarters"></i>Real Feel</p>
                        <h3>${data.current.feelslike_c}°</h3>
                    </div>

                    <div class="air-item">
                        <p> <i class="fa-solid fa-wind"></i>Wind</p>
                        <h3>${data.current.wind_kph} km/h</h3>
                    </div>

                    <div class="air-item">
                        <p> <i class="fa-solid fa-droplet"></i>Chance of Rain</p>
                        <h3>${data.forecast.forecastday[0].day.daily_chance_of_rain}%</h3>
                    </div>

                    <div class="air-item">
                        <p> <i class="fa-solid fa-sun"></i>UV Index</p>
                        <h3>${data.current.uv}</h3>
                    </div>

                </div>

            </div>

        </div>

    </div>

    <!-- RIGHT SIDE -->
    <div class="col-lg-4">

        <div class="side-card">

            <h5 class="mb-4">3-DAY FORECAST</h5>

            ${nextDays}

        </div>

    </div>

    `;

    document.getElementById("ref").innerHTML = htmlCode;
}

function formatTime(hour) {

    let ampm = hour >= 12 ? "PM" : "AM";

    let formattedHour = hour % 12 || 12;

    return `${formattedHour}:00 ${ampm}`;
}