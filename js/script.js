const myKey = "13cd84c906da5d3f9680234220331d6b",
    notification = document.querySelector(".notification span"),
    searchButton = document.querySelector(".search button"),
    search = document.querySelector(".search-box"),
    clear = document.querySelector(".search-bar i"),
    date = document.querySelector(".date"),
    temperature = document.querySelector(".temperature .number"),
    userLocation = document.querySelector(".location"),
    weatherDescription = document.querySelector(".description"),
    icon = document.querySelector(".big-icon"),
    weatherHumidity = document.querySelector(".humidity"),
    weatherWind = document.querySelector(".wind"),
    feeling = document.querySelector(".feels");
let api;

// show notifications
const allow = () => {
    notification.textContent = "getting weather information";
    notification.parentElement.classList.remove("hide");
    notification.parentElement.classList.add("show");
    notification.parentElement.classList.remove("hideAlert");
    setTimeout(() => {
        notification.parentElement.classList.remove("show");
        notification.parentElement.classList.add("hide");
    }, 3000);
}, block = () => {
    notification.textContent = "allow location prompt";
    notification.parentElement.classList.remove("hide");
    notification.parentElement.classList.add("show");
    notification.parentElement.classList.remove("hideAlert");
    setTimeout(() => {
        notification.parentElement.classList.remove("show");
        notification.parentElement.classList.add("hide");
    }, 3000);
}, invalid = () => {
    notification.textContent = `${search.value} not found`;
    notification.parentElement.classList.remove("hide");
    notification.parentElement.classList.add("show");
    notification.parentElement.classList.remove("hideAlert");
    setTimeout(() => {
        notification.parentElement.classList.remove("show");
        notification.parentElement.classList.add("hide");
    }, 3000);
};

// show the date
const today = new Date(),
    dayOfMonth = today.getDate(),
    year = today.getFullYear(),
    months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ],
    monthOfYear = months[today.getMonth()],
    todaysDate = monthOfYear + " " + dayOfMonth + ", " + year;
date.textContent = todaysDate;

// clear search button
search.onkeyup = () => {
    if (search.value !== "") {
        clear.classList.remove("clear");
    } else {
        clear.classList.add("clear");
    }
};

clear.onclick = () => {
    if (search.value !== "") {
        search.value = "";
        clear.classList.add("clear");
    }
};

// get location of user
searchButton.addEventListener("click", () => {
    if (search.value === "") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    }
    if (search.value !== "") {
        findCity(search.value);
    }
    allow();
});

const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${myKey}`;
    fetchWeather();
}, onError = (position) => {
    block();
};

// fetch data from api
const fetchWeather = () => {
    fetch(api).then(request => request.json().then(response => weatherDetails(response)));
};

// search by city
search.addEventListener("keyup", (query) => {
    if (query.key == "Enter" && search.value != "") {
        findCity(search.value);
    }
});

const findCity = (city) => {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myKey}`;
    allow();
    fetchWeather();
};

// process weather information
const weatherDetails = (info) => {
    if (info.cod == "404") {
        invalid();
    } else {
        const city = info.name,
            country = info.sys.country,
            wind = info.wind.speed,
            { description, id } = info.weather[0],
            { feels_like, humidity, temp } = info.main;

        // send data to fronend
        temperature.textContent = Math.floor(temp);
        userLocation.textContent = `${city}, ${country}`;
        weatherDescription.textContent = description;
        weatherHumidity.textContent = humidity + "%";
        feeling.textContent = Math.floor(feels_like) + "°C";
        weatherWind.textContent = wind + "mph";

        if (id >= 200 && id <= 232) {
            icon.innerHTML = `<i class="uil uil-thunderstorm"></i>`;
        }
        if (id >= 300 && id <= 331) {
            icon.innerHTML = `<i class="uil uil-cloud-sun-rain-alt"></i>`;
        }
        if (id >= 500 && id <= 531) {
            icon.innerHTML = `<i class="uil uil-cloud-showers-heavy"></i>`;
        }
        if (id >= 600 && id <= 622) {
            icon.innerHTML = `<i class="uil uil-snowflake"></i>`;
        }
        if (id >= 700 && id <= 781) {
            icon.innerHTML = `<i class="uil uil-tornado"></i>`;
        }
        if (id == 800) {
            icon.innerHTML = `<i class="uil uil-sun"></i>`;
        }
        if (id >= 801 && id <= 804) {
            icon.innerHTML = `<i class="uil uil-clouds"></i>`;
        }
    };
};