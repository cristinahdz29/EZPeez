let map;
let marker;
let locationObj = {};

//getting elements from HTML
let addressTextBox = document.getElementById("addressTextBox");
let searchButton = document.getElementById("searchButton");
let wheelchair = document.getElementById("wheelchair");
let changing_table = document.getElementById("changing_table");
let unisex = document.getElementById("unisex");
let restroomUL = document.getElementById("restroomUL");

//function to get location for map to show on load
async function getLocation() {
  //if statement for when page loads, if user's device supports geolocation we will get their coordinates on load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      console.log(position);
      //when position is consoled log, it is an object, that has lat and long as cooords
      //will create our own center object below with lat and lng as keys and their value will the lat and long from the current position object
      locationObj = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      restrooms = await getRestroomsByLatAndLog(
        locationObj.lat,
        locationObj.lng
      );
      renderMapAndMarkers(locationObj, restrooms);

      console.log(restrooms);

      let work = restrooms.map((restroom) => {
        return `
        <div class="separate">
        <div id="store2">
        <b id="store">${restroom.name} </b><i> ${restroom.distance.toFixed(2)} mi.</i>
        </div>
        <li>${restroom.street} ${restroom.city}, ${restroom.state}</li><br>
        <li>${restroom.comment != null ? `<i> ${restroom.comment}</i>` : ` `}</li><br>
        <li>${restroom.accessible == true ? `Wheelchair Accessible: Yes` : ` `}</li>
        <li>${restroom.changing_table == true ? `Changing Table: Yes` : ` `}</li>
        <li>${restroom.unisex == true ? `Unisex: Yes` : ` `}</li>
        <li style = "color: green;">${restroom.upvote > 0 ? `Upvotes: ${restroom.upvote}` : ` `}</li>
        <li style = "color: red;">${restroom.downvote > 0 ? `Downvotes: ${restroom.downvote}` : ` `}</li>
    </div>

    // <div>
        `;
      });
      restroomUL.insertAdjacentHTML("beforeend", work.join(" "));

      // Used the center object we created above to pass it into the renderMapandMarkers function, which needs to have center as an argument (hence us making a center object, with the lat and lng keys that the renderMapandMarkers needs)
    });
  } else {
    console.log("Geolocation not supported by user device");
  }
}
//function to initialize map; have it show up on the screen on load
async function initMap() {
  //
  // Default position of map is DC Atlanta/Atlanta Tech Village
  var atv = { lat: 33.849017, lng: -84.373373 };
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: atv,
  });
  

  await getLocation();
}

//function to get lat and long coordinates by address
async function getLatAndLogByAddress(address) {
  let formatedAddress = address.split(" ").join("+");

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyDHy8QmVO1C4nSFZhTo9KZZ24Py0IuHrY4`;

  let response = await fetch(url);
  let data = await response.json();

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
    zoom: 15,
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
    let mapMarker = new google.maps.Marker({
      position: new google.maps.LatLng(marker.latitude, marker.longitude),
      map: map,
    });

    let infowindow = new google.maps.InfoWindow();

    mapMarker.addListener("mouseover", function () {
      infowindow.open(map, mapMarker);
      infowindow.setContent(
        `
        <b id="store">${marker.name} </b><i> ${marker.distance.toFixed(2)} mi.</i>
        <li>${marker.street} ${marker.city}, ${marker.state}</li><br>
        
      `
      );
    });

    mapMarker.addListener("mouseout", function () {
      infowindow.close();
    });
  });
}

//Adding event listener to search button
searchButton.addEventListener("click", async function () {
  locationObj = await getLatAndLogByAddress(addressTextBox.value);
  console.log(locationObj)
  restrooms = await getRestroomsByLatAndLog(locationObj.lat, locationObj.lng);
  console.log(restrooms)
  renderMapAndMarkers(locationObj, restrooms);

  console.log(restrooms);
    
// pull information from the API and place on display -Dom
    let work = restrooms.map((restroom) => {
        return `
        <div class="separate">
        <div id="store2">
        <b id="store">${restroom.name} </b><i> ${restroom.distance.toFixed(2)} mi.</i>
        </div>
            <li>${restroom.street} ${restroom.city}, ${restroom.state}</li><br>
            <li>${
              restroom.comment != null ? `<i> ${restroom.comment}</i>` : ` `
            }</li><br>
            <li>${
              restroom.accessible == true ? `Wheelchair Accessible: Yes` : ` `
            }</li>
            <li>${
              restroom.changing_table == true ? `Changing Table: Yes` : ` `
            }</li>
            <li>${restroom.unisex == true ? `Unisex: Yes` : ` `}</li>
            <li style = "color: green;">${
              restroom.upvote > 0 ? `Upvotes: ${restroom.upvote}` : ` `
            }</li>
            <li style = "color: red;">${
              restroom.downvote > 0 ? `Downvotes: ${restroom.downvote}` : ` `
            }</li> 

            <div id="searchButton">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${restroom.latitude},${restroom.longitude}" target="_blank">Directions<a>
        </div>
        </div>
        `;
 // add ternary operators to get some of the information in conditional format       
    })
    restroomUL.innerHTML = work.join(" ")
     
});

//Adding event listener to addressTextBox (for hitting enter)
addressTextBox.addEventListener("keypress", async function (e) {
    if (e.key === "Enter") {
        locationObj = await getLatAndLogByAddress(addressTextBox.value);
        console.log(locationObj)
        restrooms = await getRestroomsByLatAndLog(locationObj.lat, locationObj.lng);
        console.log(restrooms)
        renderMapAndMarkers(locationObj, restrooms);
    
        console.log(restrooms);
        
    // pull information from the API and place on display -Dom

    let work = restrooms.map((restroom) => {
        return `
        <div class="separate">
            <div id="store2">
            <b id="store">${restroom.name} </b><i> ${restroom.distance.toFixed(2)} mi.</i>
            </div>
            <li>${restroom.street} ${restroom.city}, ${restroom.state}</li><br>
            <li>${
              restroom.comment != null ? `<i> ${restroom.comment}</i>` : ` `
            }</li><br>
            <li>${
              restroom.accessible == true ? `Wheelchair Accessible: Yes` : ` `
            }</li>
            <li>${
              restroom.changing_table == true ? `Changing Table: Yes` : ` `
            }</li>
            <li>${restroom.unisex == true ? `Unisex: Yes` : ` `}</li>
            <li style = "color: green;">${
              restroom.upvote > 0 ? `Upvotes: ${restroom.upvote}` : ` `
            }</li>
            <li style = "color: red;">${
              restroom.downvote > 0 ? `Downvotes: ${restroom.downvote}` : ` `
            }</li>

            <div id="searchButton">
            <a href="https://www.google.com/maps/dir/?api=1&${
              restroom.latitude
            },${restroom.longitude}" target="_blank">Directions<a>
        </div>
        </div>
            `;
  // add ternary operators to get some of the information in conditional format          
        })
        restroomUL.innerHTML = work.join(" ")
      
    }
  
  });

wheelchair.addEventListener("click", async function () {
  let wheelchairItems = []
  restroomUL.innerHTML = " "
  if (this.checked) {
    let response = await fetch(
      `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${locationObj.lat}&lng=${locationObj.lng}`
    );
    let json = await response.json();
    wheelchairItems = json.filter((restroom) => {
      return restroom.accessible == true;
    });
    console.log(wheelchairItems);
  }
  // pull information from the API and place on display -Dom
  let work = wheelchairItems.map((restroom) => {
    return `
    <div class="separate">
    <div id="store2">
    <b id="store">${restroom.name} </b><i> ${restroom.distance.toFixed(2)} mi.</i>
    </div>
        <li>${restroom.street} ${restroom.city}, ${restroom.state}</li><br>
        <li>${restroom.comment != null ? `<i> ${restroom.comment}</i>` : ` `}</li><br>
        <li>${restroom.accessible == true ? `Wheelchair Accessible: Yes` : ` `}</li>
        <li>${restroom.changing_table == true ? `Changing Table: Yes` : ` `}</li>
        <li>${restroom.unisex == true ? `Unisex: Yes` : ` `}</li>
        <li style = "color: green;">${restroom.upvote > 0 ? `Upvotes: ${restroom.upvote}` : ` `}</li>
        <li style = "color: red;">${restroom.downvote > 0 ? `Downvotes: ${restroom.downvote}` : ` `}</li>
    </div>
    `
    
})
restroomUL.innerHTML = work.join(" ")
});

changing_table.addEventListener("click", async function () {
  let changing_tableItems = []
  restroomUL.innerHTML = " "
  if (this.checked) {
    let response = await fetch(
      `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${locationObj.lat}&lng=${locationObj.lng}`
    );
    let json = await response.json();
    changing_tableItems = json.filter((restroom) => {
      return restroom.changing_table == true;
    });
    console.log(changing_tableItems);
  }
   // pull information from the API and place on display -Dom
   let work = changing_tableItems.map((restroom) => {
    return `
    <div class="separate">
    <div id="store2">
    <b id="store">${restroom.name} </b><i> ${restroom.distance.toFixed(2)} mi.</i>
    </div>
        <li>${restroom.street} ${restroom.city}, ${restroom.state}</li><br>
        <li>${restroom.comment != null ? `<i> ${restroom.comment}</i>` : ` `}</li><br>
        <li>${restroom.accessible == true ? `Wheelchair Accessible: Yes` : ` `}</li>
        <li>${restroom.changing_table == true ? `Changing Table: Yes` : ` `}</li>
        <li>${restroom.unisex == true ? `Unisex: Yes` : ` `}</li>
        <li style = "color: green;">${restroom.upvote > 0 ? `Upvotes: ${restroom.upvote}` : ` `}</li>
        <li style = "color: red;">${restroom.downvote > 0 ? `Downvotes: ${restroom.downvote}` : ` `}</li>
    </div>
    `
    
})
restroomUL.innerHTML = work.join(" ")
});

unisex.addEventListener("click", async function () {
  let unisexItems = []
  restroomUL.innerHTML = " "
  if (this.checked) {
    let response = await fetch(
      `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${locationObj.lat}&lng=${locationObj.lng}`
    );
    let json = await response.json();
    unisexItems = json.filter((restroom) => {
      return restroom.unisex == true;
    });
    console.log(unisexItems);
  }
   // pull information from the API and place on display -Dom
   let work = unisexItems.map((restroom) => {
    return `
    <div class="separate">
    <div id="store2">
    <b id="store">${restroom.name} </b><i> ${restroom.distance.toFixed(2)} mi.</i>
    </div>
        <li>${restroom.street} ${restroom.city}, ${restroom.state}</li><br>
        <li>${restroom.comment != null ? `<i> ${restroom.comment}</i>` : ` `}</li><br>
        <li>${restroom.accessible == true ? `Wheelchair Accessible: Yes` : ` `}</li>
        <li>${restroom.changing_table == true ? `Changing Table: Yes` : ` `}</li>
        <li>${restroom.unisex == true ? `Unisex: Yes` : ` `}</li>
        <li style = "color: green;">${restroom.upvote > 0 ? `Upvotes: ${restroom.upvote}` : ` `}</li>
        <li style = "color: red;">${restroom.downvote > 0 ? `Downvotes: ${restroom.downvote}` : ` `}</li>
    </div>
    `
    
})
restroomUL.innerHTML = work.join(" ")
});
