//Importing the functions from API.JS file
import { getLatAndLogByAddress, getRestroomsByLatAndLog } from "./api.js";
import { renderMapAndMarkers } from "./map.js";

let addressTextBox = document.getElementById("addressTextBox");

let searchButton = document.getElementById("searchButton");

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
