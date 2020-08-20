const searchCity = document.getElementById('searchCity');
const searchHobby = document.getElementById('searchHobby');
const ageDiv = document.getElementById('_filterByAgeDiv');
const locationDiv = document.getElementById('_filterByLocationDiv');
    


// toggle the add age div 
function addAgeDiv(){
    if (!ageDiv.hasChildNodes())
    {
        ageDiv.innerHTML = 
                `<input type="range" name="minAge" id="_minAge" min="18" max="130">
                <input type="range" name="maxAge" id="_maxAge" min="18" max="130">`;
        
        document.getElementById('_ageInputInfo').value = '1';
    }else
    {
        while (ageDiv.hasChildNodes())
            ageDiv.removeChild(ageDiv.childNodes[0])
        
        document.getElementById('_ageInputInfo').value = '0';
    }
}

// fetch the cities form the database
let cities = [];

async function fetchCities(){
    try{
        const res = await fetch(`http://localhost:4000/fetch_req/return_cities`);
        const resCities = await res.json();
        
        // console.log(resCities);
        cities = resCities;
    }catch (err){
        console.log(err);
    }
}
// key up event for suggesting the cities while typing
// let searchCityTbx = NULL;
async function showCitySugg(){
    if (cities)
    {
        console.log('typing');
        // let cityValue = document.getElementById("_searchCityTbx").value;
        // let cityMatch = cities.filter((city) => {
        //     const regex = new RegExp(`^${cityValue}`, 'gi');
        //     return city.City.match(regex);
        // });

        // console.log(cityMatch);
    }
}


//toggle the add location div
async function addLocationDiv(){
    if (!locationDiv.hasChildNodes())
    {
        locationDiv.innerHTML = `<input onkeyup="showCitySugg()" type="search" name="byLocationSearch" id="_searchCityTbx">`
        
        document.getElementById('_locationInputInfo').value = '1';
        await fetchCities();
        console.log(cities);
    }else
    {
        while (locationDiv.hasChildNodes())
            locationDiv.removeChild(locationDiv.childNodes[0])
        
        document.getElementById('_locationInputInfo').value = '0';
    }
}




// searchCity.addEventListener('input', async () => {
//     console.log (searchCity.value);
//     try{
//         const res = await fetch(`http://localhost:4000/fetch_req/return_cities`);
//         const resCities = await res.json();
        
//         console.log(resCities);
//     }catch (err){
//         console.log(err);
//     }
    
// });







// const fetchCity = (searchCityVal) => {
//     const res = await fetch('http://localhost:4000/xhr/return_cities');
//     const cities = await res.json();

//     let cityMatch = cities.filter((city) => {
//         const regex = new RegExp(`^${searchCityVal}`, 'gi');
//         return city.name.match(regex);
//     });

//     console.log(matches);
// };

// searchCity.addEventListener('input', () => fetchCity(searchCity.value));















// ***
// toggle button for all the users connected to this user
function connections() 
{
    let connections = document.getElementById('connections');
    let suggestions = document.getElementById('suggestions');

    suggestions.style.display = 'none';
    if (connections.style.display == 'block')
        connections.style.display = 'none';
    else
        connections.style.display = 'block';
}

// ***
// toggle button for all the suggested users to this user
function suggestions() 
{
    let connections = document.getElementById('connections');
    let suggestions = document.getElementById('suggestions');

    connections.style.display = 'none';
    if (suggestions.style.display == 'block')
        suggestions.style.display = 'none';
    else
        suggestions.style.display = 'block';
}