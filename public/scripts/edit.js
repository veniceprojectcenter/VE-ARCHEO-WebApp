var dataCategories = ["Site info", "USM", "USR"];

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
