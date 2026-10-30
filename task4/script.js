async function getWeather() {

    let city = document.getElementById("city").value;
    let msg = document.getElementById("msg");
    let box = document.getElementById("weather");

    if (!city)
        return msg.textContent = "Enter a city";

    msg.textContent = "Loading...";

    try {

        let g = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        ).then(r => r.json());

        if (!g.results)
            throw 0;

        let x = g.results[0];

        let w = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${x.latitude}&longitude=${x.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`
        ).then(r => r.json());

        box.innerHTML = `

        <div class="current">

            <h2>${x.name}, ${x.country}</h2>

            <div class="temp">
                ${Math.round(w.current.temperature_2m)}°C
            </div>

            <div class="info">
                <span>Humidity: ${w.current.relative_humidity_2m}%</span>
                <span>Wind: ${w.current.wind_speed_10m} km/h</span>
            </div>

        </div>

        <h2>5-Day Forecast</h2>

        <div class="forecast">

        ${w.daily.time.map((d, i) => `

            <div class="card">

                <b>
                ${new Date(d).toLocaleDateString("en",
            { weekday: "short" })}
                </b>

                <p>
                Max: ${Math.round(w.daily.temperature_2m_max[i])}°C
                </p>

                <p>
                Min: ${Math.round(w.daily.temperature_2m_min[i])}°C
                </p>

            </div>

        `).join("")}

        </div>
        `;

        msg.textContent = "";

    }

    catch {
        msg.textContent = "City not found";
    }

}