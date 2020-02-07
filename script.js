// set Event Listener to Search Button when search is initiated

function clear() {
    $(".forecast").clear("");
}

$(".search-btn").on("click", function () {
    //set variables to initiate API search
    let citySearch = $("#searchBar").val().trim();
    let APIKey = "332531843cc1a103494cbb340f9ec7cd";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?"+ "q=" + citySearch + "&units=imperial&appid=" + APIKey;
    //seeting the retrieval of historical search
    const history = JSON.parse(localStorage.getItem("cities")) || [];

    
    //function that will run a list of the searched cities
    function createBtn() {
        // $('.cityList').html('')
        //for loop to continuously append searched cities
        for (let i = 0; i < history.length; i++) {
            let newListItem = $("<li>");
            newListItem.addClass("list-group-item")
            let newCity = $("<button>");
            let newSavedCity = newCity.text(history[i]);
            newCity.addClass("cityBtn");
            let newSH = newListItem.append(newSavedCity);
            $(".cityList").prepend(newSH)
            $(".cityList").addClass("cityList1");
            // let searchValue = $("#search-value").val().trim()
            if (!history.includes(citySearch)) {
                history.push(citySearch);
                localStorage.setItem("cities", JSON.stringify(history));
            }
        };
    }
    
    createBtn()
    renderCity()
    return false;
    
    
    function renderCity(){
        
        // set and href attribute here to make li a link
        //ajax inquiry for weather API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            //variables to retrieve information from the JSON generated
            let iconKey = response.weather[0].icon;
            // let genIcon = $("<img>");
            // let iconURL = "https://openweathermap.org/img/wn/"+iconKey+"@2x.png";
            let city = $(".city").text(response.name + " " + "(" + (new Date()).toLocaleDateString('en-US') + ")") ;
            $(".city").append(`<img src='https://openweathermap.org/img/wn/${iconKey}@2x.png'></img>`);
            let temp = $(".temperature").text("Temperature: " + response.main.temp + " F");
            let humidity = $(".humidity").text("Humidity: " + response.main.humidity + " %");
            let wind = $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
            
            //lay down variables for the ajax request for UV Index
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey + "&lat=" + lat + "&lon=" + lon;
            //retrieve UV Index info
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(response) {
                let uvIndex = $(".uv").text("UV Index : " + response.value);
                return uvIndex
              });

            //retrieve forecast info
            let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + APIKey;
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function(response) {
                //run a for loop to append the 5-day forecast. (Use i+=8 to retrive info every 24 hours)
                for (let i = 0; i < response.list.length; i+=8) {
                    let forecastDate = response.list[i].dt_txt;
                    // console.log(forecastDate)
                    let kel = response.list[i].main.temp;
                    let forecastTemp = ("Temperature (F): " + (((kel - 273.15) * 1.80 +32)).toFixed(2));
                    // console.log(forecastTemp)
                    let forecastHumidity = ("Humidity: " + response.list[i].main.humidity + " %");
                    // console.log(forecastHumidity)
                    //create elements via template literal
                    let divEl = $(
                        `<div class="col-sm-2 card-body day${i} foreDay">
                            <h5>${forecastDate}</h5>
                            <img src='https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png'></img>
                            <p>${forecastTemp}</p>
                            <p>${forecastHumidity}</p>
                        </div>               
                        `);
                    $(".forecast").append(divEl);
                        
                }
                clear()
            })
            

            
        });   
        return
    }
})

//Event Listener for buttons created from the search
$(".cityBtn").on("click", '.cityBtn', function () {
    renderCity($(this).text());
});

