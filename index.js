let map;
let marker;

let addressTextBox = document.getElementById("addressTextBox");
let searchButton = document.getElementById("searchButton");
let wheelchair = document.getElementById("wheelchair");
let changing_table = document.getElementById("changing_table");
let unisex = document.getElementById("unisex");
let restroomUL = document.getElementById("restroomUL")

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

async function getLatAndLogByAddress(address) {
    let formatedAddress = address.split(" ").join("+");

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyDHy8QmVO1C4nSFZhTo9KZZ24Py0IuHrY4`;

    let response = await fetch(url);
    let data = await response.json();

    return data.results[0].geometry.location;
}

async function getRestroomsByLatAndLog(lat, lng) {
    let url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${lat}&lng=${lng}`;

    let response = await fetch(url);
    let data = await response.json();

    return data;
}

function renderMapAndMarkers(center, markers) {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: new google.maps.LatLng(center.lat, center.lng),
    });

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(center.lat, center.lng),
        icon:
            "https://i.pinimg.com/originals/25/62/aa/2562aacd1a4c2af60cce9629b1e05cf2.png",
        map: map,
    });

    markers.forEach((marker) => {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(marker.latitude, marker.longitude),
            map: map,
        });
    });
}

getLocation()

//Adding event listener to search button
searchButton.addEventListener("click", async function () {
    

    const locationObj = await getLatAndLogByAddress(addressTextBox.value);
    const restrooms = await getRestroomsByLatAndLog(
        locationObj.lat,
        locationObj.lng



    );
    renderMapAndMarkers(locationObj, restrooms);

    
    
    console.log(restrooms);

    let work = restrooms.map((restrooms) => {
        return `
        <li><h2><b>${restrooms.name}</b><h2><br>
            <ul>
                <li>${restrooms.street} ${restrooms.city}, ${restrooms.state}</li>
                <li>${restrooms.comment}</li>
            </ul>
        </li>
        `
    })
    restroomUL.insertAdjacentHTML('beforeend', work.join(''))


});

wheelchair.addEventListener("click", async function() {

    if(this.checked) {
        let response = await fetch(`https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${locationObj.lat}&lng=${locationObj.lng}`)
        let json = await response.json()
        let wheelchairItems = json.filter((restroom) => {
            return restroom.accessible == true        
})
        console.log(wheelchairItems)

}
})

changing_table.addEventListener("click", async function() {

    if(this.checked) {
        let response = await fetch(`https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${locationObj.lat}&lng=${locationObj.lng}`)
        let json = await response.json()
        let changing_tableItems = json.filter((restroom) => {
            return restroom.changing_table == true        
})
        console.log(changing_tableItems)

}
})

unisex.addEventListener("click", async function() {

    if(this.checked) {
        let response = await fetch(`https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${locationObj.lat}&lng=${locationObj.lng}`)
        let json = await response.json()
        let unisexItems = json.filter((restroom) => {
            return restroom.unisex == true        
})
        console.log(unisexItems)

}
})