fetch('https://maps.googleapis.com/maps/api/geocode/json?address=1200+Richmon+Ave+Houston+TX&key=AIzaSyDHy8QmVO1C4nSFZhTo9KZZ24Py0IuHrY4')
.then(response => response.json()).then(json => console.log(json))

