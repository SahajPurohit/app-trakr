// Logic to show form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.remove("active");
});