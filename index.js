let map;
let marker;

//getting elements from HTML
let addressTextBox = document.getElementById("addressTextBox");
let searchButton = document.getElementById("searchButton");

//function to get location for map to show on load
function getLocation() {
    //if statement for when page loads, if user's device supports geolocation we will get their coordinates on load
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      console.log(position);
      //when position is consoled log, it is an object, that has lat and long as cooords
      //will create our own center object below with lat and lng as keys and their value will the lat and long from the current position object
      let center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Used the center object we created above to pass it into the renderMapandMarkers function, which needs to have center as an argument (hence us making a center object, with the lat and lng keys that the renderMapandMarkers needs)
      renderMapAndMarkers(center, []);
    });
  } else {
    console.log("Geolocation not supported by user device");
  }
}
//function to initialize map; have it show up on the screen on load
function initMap() {
  //
  // The location of Uluru
  var uluru = { lat: -25.344, lng: 131.036 };
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  marker = new google.maps.Marker({ position: uluru, map: map });
  getLocation();
}

//function to get lat and long coordinates by address
async function getLatAndLogByAddress(address) {
  let formatedAddress = address.split(" ").join("+");

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyDHy8QmVO1C4nSFZhTo9KZZ24Py0IuHrY4`;

  let response = await fetch(url);
  let data = await response.json();
  //returns just the lat and long from the JSON file
  return data.results[0].geometry.location;
}

//function get restrooms by lat and long coordinates using the restroom API
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

  let icon = {
    url:
      "https://i.pinimg.com/originals/a5/45/9c/a5459c891b38a381f434306920decc20.png", //url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0), // anchor
  };

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(center.lat, center.lng),
    icon: icon,
    map: map,
  });

  markers.forEach((marker) => {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(marker.latitude, marker.longitude),
      map: map,
    });
  });
}

//Adding event listener to search button
searchButton.addEventListener("click", async function () {
  const locationObj = await getLatAndLogByAddress(addressTextBox.value);
  const restrooms = await getRestroomsByLatAndLog(
    locationObj.lat,
    locationObj.lng
  );

  renderMapAndMarkers(locationObj, restrooms);

  console.log(restrooms);
});
