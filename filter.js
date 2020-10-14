//this function passes latitude and longitude coordinates as arguments that we got from the top function into the restroom API to get nearby restroom locations
async function getRestroomsByLatAndLog(lat, lng) {
  let url = `https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&lat=${lat}&lng=${lng}`;

  let response = await fetch(url);
  let data = await response.json();

  return data;
}
//export these functions so they are available to use in our main index.js file
export { getLatAndLogByAddress, getRestroomsByLatAndLog };

// searchButton.addEventListener("click", function() {
//     menuUL.innerHTML = ""
//     let starters = dishes.filter(function(dish) {
//         return dish.course == "Starters"
//     })
//     let result = starters.map(function (dish) {
//         return `
//             <li>
//                 <p><b>${dish.title} </b><i>$${dish.price}</i></p>
//                 <p><img src = ${dish.imageURL}></img>${dish.description}</p>
//             </li>
//             `
//     })
// let output = `${result.join("")}`
// restroomUL.insertAdjacentHTML('beforeend', output)
// })
