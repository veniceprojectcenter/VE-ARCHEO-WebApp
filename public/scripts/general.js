function toggle_visibility(idToHide, idToShow) {
    var hide = document.getElementById(idToHide);
    var show = document.getElementById(idToShow);
    show.style.display = 'block';
    hide.style.display = 'none';
    console.log("Hello!");
}

function setUpCategoryClicks(){
    dataCategories.forEach(function(category) {
        // for each categoryButton on top of edit page setup click functions
        $("#edit" + category.capitalize() + "Button").click(function(){
            hideAllData();
            showCategory(category);
        });
    });
}

function hideAllData(){
    dataCategories.forEach(function(category) {
        $("#" + category + "Data").hide();
    });
}

function showCategory(category){
    $("#" + category + "Data").show();
    // $("#dataCategorySpan").text( category.capitalize() );
}

// capitalize first word of string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

