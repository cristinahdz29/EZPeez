let map;
let marker;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => console.log(position));
    } else {
        console.log("Geolocation not supported by user device")
    }
}

function initMap() {
    // The location of Uluru
    var uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: uluru });
    // The marker, positioned at Uluru
    marker = new google.maps.Marker({ position: uluru, map: map });
}


//restroom function
async function getRestroomsByLatAndLog(lat, lng) {
    let url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${lat}&lng=${lng}`

    let response = await fetch(url);
    let data = await response.json();

    return data
}

//getting geolocation on load
getLocation()