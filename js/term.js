// When the user clicks on <div>, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}


// Logic to show form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.remove("active");
});