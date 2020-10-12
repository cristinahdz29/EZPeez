// //file containing functions that get information from API


// //This function gets lat and long coordinates from google geocoding API
// async function getLatAndLogByAddress(address) {
//     let formatedAddress = address.split(' ').join('+');

//     let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyDHy8QmVO1C4nSFZhTo9KZZ24Py0IuHrY4`

//     let response = await fetch(url);
//     let data = await response.json();

//     return data.results[0].geometry.location
// }

// //this function passes latitude and longitude coordinates as arguments that we got from the top function into the restroom API to get nearby restroom locations
// async function getRestroomsByLatAndLog(lat, lng) {
//     let url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${lat}&lng=${lng}`

//     let response = await fetch(url);
//     let data = await response.json();

//     return data
// }
// //export these functions so they are available to use in our main index.js file
// export {
//     getLatAndLogByAddress,
//     getRestroomsByLatAndLog
// }