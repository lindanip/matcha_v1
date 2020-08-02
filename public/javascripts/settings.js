console.log("Connected");

function getLocation() {
    var x = document.getElementById("demo");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var x = document.getElementById("demo");
    document.getElementById("Longitude").value = position.coords.longitude;
    document.getElementById("Latitude").value = position.coords.latitude;
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
}