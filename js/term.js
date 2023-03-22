// Logic to show form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
    document.querySelector("#overlay").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", closePopup);

// Should also close after clicking enter
document.querySelector(".popup-form .enter-btn").addEventListener("click", closePopup);

var tableContent = [];
var ctr = 1;
// table = document.getElementById("table")

function closePopup() {
    document.querySelector(".popup-form").classList.remove("active");
    document.querySelector("#overlay").classList.remove("active");
    document.getElementById('company-name').value = '';
    document.getElementById('position-name').value = '';
}

function addApps() {
    // table = document.getElementById("table")
    
    var dateAndTime = Date();
    date = dateAndTime.substring(0, 15);
    time = dateAndTime.substring(17, 24);
    const comp = document.getElementById("company-name").value;
    const pos = document.getElementById("position-name").value;
    tableContent.push([comp, pos, date, time]);
    const tbodyEl = document.querySelector('tbody');
    tbodyEl.innerHTML += `
        <tr>
            <td>${ctr}</td>
            <td>${comp}</td>
            <td>${pos}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td>Active</td>
        </tr>
    `;
    ctr++;
    //renderTable();
}

function deleteLatestEntry() {
    console.log("Ello")
    if (tableContent.length == 0) return;
    tableContent.pop();
    renderTable();
}

function renderTable() {
    // Add the numbering and the status
    for (let i = ctr - 1; i < tableContent.length; i++) {
        tableContent[i].unshift(ctr.toString());
        ctr++;
        tableContent[i].push("Active");
    }

    // Populate the table
    for (let i = 1; i <= tableContent.length; i++) { // rows
        for (let j = 0; j < tableContent[i-1].length; j++) { // cells
            table.rows[i].cells[j].innerHTML = tableContent[i-1][j];
        }
    }
}