_id = (id) => {
    return document.getElementById(id);
}

_class = (className) => {
    return document.getElementsByClassName(className);
}

// Get cities data
let cityList = [];
fetch('./assets/city.list.json')
    .then(response => response.json())
    .then(data => {
        cityList = data.map(obj => 
            (obj.name + ', ' + obj.country)
        );
        cityList = [...new Set(cityList)];
    })
    .catch((error)=>console.log(error));

// Fetch OpenWeatherMap API
let title = _id('title');
let dateList = _class('date');
let timeList = _class('time');
let feelsLikeList = _class('weather-feels-like');
let tempList = _class('weather-temp');
let humidityList = _class('weather-humidity');
let iconList = _class('weather-icon');
let descriptionList = _class('weather-description');

let loadingElements = Array.from(_class('loading'));

var options = { year: 'numeric', month: 'short', day: 'numeric' };

let iconUrl = "https://openweathermap.org/img/wn/";
const apiKey = "4f86e04d8a74ca499849af04ab366ab5";
let fetchWeather = (cityName) => {
    title.innerHTML = "Weather in " + cityName;
    loadingElements.forEach((element) => element.classList.add('loading'));
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&cnt=8&appid=' + apiKey + '&units=metric')
    .then(response => response.json())
    .then(data => {
        data.list.forEach((obj,index)=>{
            let date = new Date(obj.dt_txt).toLocaleDateString('en-us',options);
            let time = obj.dt_txt.split(' ')[1].slice(0,5);
            let feelsLike = Math.round(obj.main.feels_like,1);
            let temp = Math.round(obj.main.temp,1);
            let humidity = obj.main.humidity;
            let iconSrc = iconUrl + obj.weather[0].icon + "@2x.png";
            let weatherDescription = obj.weather[0].description;
            // Capitalize first letter in each word
            weatherDescription = weatherDescription
            .split(' ')
            .map((string)=>string.charAt(0).toUpperCase() + string.substring(1))
            .join(' ');
            // Display the data in HTML
            dateList[index].innerHTML = date;
            timeList[index].innerHTML = time;
            feelsLikeList[index].innerHTML = 'Feels like ' + feelsLike + '°C';
            tempList[index].innerHTML = temp + '°C';
            humidityList[index].innerHTML = 'Humidity: ' + humidity + '%';
            iconList[index].innerHTML = '<img src="'+ iconSrc +'" alt="'+ weatherDescription + ' icon">'
            descriptionList[index].innerHTML = weatherDescription;
        });
        loadingElements.forEach((element) => element.classList.remove('loading'));
    })
    .catch((error)=>console.log(error));
}

fetchWeather('Jakarta, ID');

// Search and filter cityList
let autoCompleteBox = _id('autocomplete-box-wrapper');
filterCities = (cityName) => {
    if(cityName.length === 0){
        autoCompleteBox.innerHTML = "";
        return;
    }
    cityName = cityName.toLowerCase();
    let filteredCity = [], n = cityList.length;
    for(let i = 0; i < n; i++){
        if(cityList[i].toLowerCase().startsWith(cityName)){
            filteredCity.push(cityList[i]);
        }
        if(filteredCity.length === 5) break;
    }
    autoCompleteBox.innerHTML = filteredCity.reduce((html, city) => 
        html + ('<div class="autocomplete-box" onclick="fetchWeather(\''+ city +'\')">' + city + '</div>')
        ,"");
}

let timer;
const searchBox = _id('weather-search');
searchBox.addEventListener('keyup', (e)=>{
    if(e.key === "Enter"){
        findWeather();
        return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => filterCities(e.target.value), 1000);
});

// Find weather from search box
findWeather = () => {
    let cityName = searchBox.value.toLowerCase();
    if(cityName.length === 0){
        alert('Search box cannot be empty!');
        return;
    }
    let targetCity = cityList.find((city) => city.toLowerCase().startsWith(cityName));
    if(targetCity != null){
        fetchWeather(targetCity);
    }else{
        alert('City not found, please type a real city name');
    }
}

searchBox.addEventListener('focus', () => {
    autoCompleteBox.style.display = 'block';
})

searchBox.addEventListener('blur', () => {
    setTimeout(() => autoCompleteBox.style.display = 'none', 100);
})

// Dark Mode
toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    _id('toggle-btn-circle').classList.toggle('active')
}