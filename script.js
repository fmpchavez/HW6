$(".search-btn").on("click", function () {
    let citySearch = $(".search-bar").val().trim();
    let newCity = $("<li>");
    // set and href attribute here to make li a link

    newCity.text(citySearch);
    $("<ul>").prepend(newCity);
    console.log(newCity)
})
