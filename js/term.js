// Logic to show form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.remove("active");
});

table = document.getElementById("table")
var dateAndTime = Date();
date = dateAndTime.substring(0, 15);
time = dateAndTime.substring(17, 24);
// var tableHeaders = ["#", "Company", "Position", "Date Applied", "Time Applied", "Status"]
var tableContent = [["#", "Company", "Position", "Date Applied", "Time Applied", "Status"],
                ["Apple", "Software Engineer", date, time],
                ["CashApp", "Software Engineer", date, time],
                ["Adobe", "Software Engineer", date, time],
                ["Amazon", "SWE", date, time]];

var ctr = 1;

for (let i = 1; i < tableContent.length; i++) {
    tableContent[i].unshift(ctr.toString());
    ctr++;
    tableContent[i].push("Active")
}

console.log(tableContent)


for (let i = 0; i < table.rows.length; i++) { // rows
    for (let j = 0; j < table.rows[i].cells.length; j++) { // cells
        table.rows[i].cells[j].innerHTML = tableContent[i][j];
    }
}