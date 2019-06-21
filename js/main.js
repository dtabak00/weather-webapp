let temperatureDescription = document.querySelector(".temperature-description");
let temperatureDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector('.location-timezone');
let temperatureSection = document.querySelector(".temperature");
const temperatureSpan = document.querySelector(".temperature span");

window.addEventListener('load', () => {
    let long;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

            long = position.coords.longitude;
            lat = position.coords.latitude;
            
            const proxy = "https://cors-anywhere.herokuapp.com/"; //Get around the cors-issue (localhost)
            const api = `${proxy}https://api.darksky.net/forecast/91cec39d0f1e57c746c1a0a806aa1f1a/${lat},${long}`; //API call url

            //Makes http request that fetches the response from a url
            fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setDomElementValues(data);

            })
        });

    } else {
        h1.textContent = "If you don't enable geolocation, we can't help you!"
    }

});

function setDomElementValues(data) {
    const { temperature, summary, icon } = data.currently;

    //Set DOM Element values with the data from the API
    temperatureDegree.textContent = calculateCelsius(temperature);
    temperatureDescription.textContent = summary;
    locationTimezone.textContent = data.timezone;
    setIcons(icon, document.querySelector(".icon"));
}

function setIcons(icon, iconId) {
    //Declare and initialize the skycons class
    const skycons = new Skycons({ color: "white" });

    //Per instructions on https://darkskyapp.github.io/skycons/
    //We must capitalize all letters and replace all "-" with "_"
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    //Start animation
    skycons.play();

    return skycons.set(iconId, Skycons[currentIcon]);
}

temperatureSection.addEventListener("click", () => {
    if (temperatureSpan.textContent === "°C") {
        temperatureDegree.textContent = calculateFahrenheit(parseFloat(temperatureDegree.textContent));
        temperatureSpan.textContent = "°F";
    } else {
        temperatureDegree.textContent = calculateCelsius(parseFloat(temperatureDegree.textContent));
        temperatureSpan.textContent = "°C";
    }
});

function calculateCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5/9).toFixed(2);
}

function calculateFahrenheit(celsius) {
    return (celsius * 9/5 + 32).toFixed(2);
}