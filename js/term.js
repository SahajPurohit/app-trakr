// Logic to show form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.remove("active");
});

// Should also close after clicking enter
document.querySelector(".popup-form .enter-btn").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.remove("active");
});


var tableContent = [];
var ctr = 1;

function addApps() {
    table = document.getElementById("table")
    var dateAndTime = Date();
    date = dateAndTime.substring(0, 15);
    time = dateAndTime.substring(17, 24);
    const comp = document.getElementById("company-name").value;
    const pos = document.getElementById("position-name").value;
    tableContent.push([comp, pos, date, time]);
    for (let i = ctr - 1; i < tableContent.length; i++) {
        tableContent[i].unshift(ctr.toString());
        ctr++;
        tableContent[i].push("Active");
    }

    for (let i = 1; i <= tableContent.length; i++) { // rows
        for (let j = 0; j < tableContent[i-1].length; j++) { // cells
            table.rows[i].cells[j].innerHTML = tableContent[i-1][j];
        }
    }
}