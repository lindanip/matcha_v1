const searchCity = document.getElementById('searchCity');
const searchHobby = document.getElementById('searchHobby');
const ageDiv = document.getElementById('_filterByAgeDiv');
const locationDiv = document.getElementById('_filterByLocationDiv');
const hobbyDiv = document.getElementById('_filterByHobbyDiv');
let   hobbyInputCount = 0;



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












// 
// 
// 
// 
//-------------------- funtionalities below are not yet used  
// 
// 
// 
// 
// 








// (function below is not yet working) adding input text for hobby to dom must be
let inputCheck = () => 
{
    if (hobbyDiv.hasChildNodes()){
        if (!hobbyDiv.childNodes[(hobbyInputCount - 1)].value) return 0;
        else return 1;
    }
    else
        return 1;
}

function addHobbyDiv(){
    if (!inputCheck())
        console.log('tell the user to fill in the first input block');
    else
    {
        if (hobbyInputCount <= 4)
        {
            hobbyDiv.innerHTML +=  
                    `<input id="_hobbyInput${hobbyInputCount}" type="text" name="minAge" " value="" required>`;
            hobbyInputCount++;
        }else{
            alert('you are only allow 5 tags');
        }
    }
}


// (function not yet used) begin  toggle the add age div 

function addAgeDiv(){
    if (!ageDiv.hasChildNodes())
    {
        //better way is to use number inputs
        ageDiv.innerHTML = 
                `<input type="range" name="minAge" id="_minAge" min="18" max="130" required>
                <input type="range" name="maxAge" id="_maxAge" min="18" max="130" required>`;
        
        document.getElementById('_ageInputInfo').value = '1';
    }else
    {
        while (ageDiv.hasChildNodes())
            ageDiv.removeChild(ageDiv.childNodes[0])
        
        document.getElementById('_ageInputInfo').value = '0';
    }
}

// (functions and variables below are not used yet) fetch the cities form the database
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


// ( function not yet used )toggle the add location div
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