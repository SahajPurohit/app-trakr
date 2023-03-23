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

const tableEl = document.querySelector('table');
tableEl.addEventListener("click", deleteRow);

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
    time = dateAndTime.substring(16, 24);
    const comp = document.getElementById("company-name").value;
    const pos = document.getElementById("position-name").value;
    tableContent.push([ctr, comp, pos, date, time, "Active"]);
    const tbodyEl = document.querySelector('tbody');
    tbodyEl.innerHTML += `
        <tr>
            <td>${ctr}</td>
            <td>${comp}</td>
            <td>${pos}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td>Active</td>
            <td><button class='delete-btn'>&times;</button></td>
        </tr>
    `;
    ctr++;
}

function deleteRow(e) {
    if (!e.target.classList.contains('delete-btn')) return;
    const btn = e.target;
    btn.closest('tr').remove();
    if (ctr != 0) ctr--;
}

function deleteLatestEntry() {
    if (tableContent.length == 0) return;
    tableContent.pop();
    renderTable();
    if (ctr != 0) ctr--;
}

function renderTable() {
    const tbodyEl = document.querySelector('tbody');
    toAdd = ``;
    for (let i = 0; i < tableContent.length; i++) {
        toAdd += `<tr>`;
        for (let j = 0; j < tableContent[i].length; j++) {
            toAdd += `<td>${tableContent[i][j]}</td>`
        }
        toAdd += `<td><button class='delete-btn'>&times;</button></td></tr>`
    } 
    tbodyEl.innerHTML = toAdd;
}