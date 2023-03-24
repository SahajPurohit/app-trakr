window.onload = function() {
    document.getElementById('term').value = ''; // Clear term on refresh
    const theadEl = document.querySelector('thead');
    theadEl.innerHTML += `
        <tr>
            <th>#</th>
            <th>Company</th>
            <th>Position</th>
            <th>Date Applied</th>
            <th>Time Applied</th>
            <th>Status</th>
            <th></th>
         </tr>
    `
}

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

const tableEl = document.querySelector('table');
tableEl.addEventListener("click", deleteRow);

function closePopup() {
    document.querySelector(".popup-form").classList.remove("active");
    document.querySelector("#overlay").classList.remove("active");
    document.getElementById('company-name').value = '';
    document.getElementById('position-name').value = '';
}

function addApps() {
    var dateAndTime = Date();
    date = dateAndTime.substring(0, 15);
    time = dateAndTime.substring(16, 24);
    const comp = document.getElementById("company-name").value;
    const pos = document.getElementById("position-name").value;
    tableContent.push([comp, pos, date, time, "Active"]);
    const tbodyEl = document.querySelector('tbody');
    tbodyEl.innerHTML += `
        <tr>
            <td>${tableContent.length}</td>
            <td>${comp}</td>
            <td>${pos}</td>
            <td>${date}</td>
            <td>${time}</td>
            <td>Active</td>
            <td><button class='delete-btn'>&times;</button></td>
        </tr>
    `;
}

function deleteRow(e) {
    if (!e.target.classList.contains('delete-btn')) return;
    var btn = e.target;
    let rowInnerHTML = btn.closest('tr');
    var idx = rowInnerHTML.querySelector('td:first-child').innerHTML;
    idx = parseInt(idx)
    tableContent.splice(idx - 1, 1);
    renderTable();
}

function deleteLatestEntry() {
    if (tableContent.length == 0) return;
    tableContent.pop();
    renderTable();
}

function renderTable() {
    const tbodyEl = document.querySelector('tbody');
    toAdd = ``;
    for (let i = 0; i < tableContent.length; i++) {
        toAdd += `<tr><td>${i + 1}</td>`;
        for (let j = 0; j < tableContent[i].length; j++) {
            toAdd += `<td>${tableContent[i][j]}</td>`;
        }
        toAdd += `<td><button class='delete-btn'>&times;</button></td></tr>`;
    }
    tbodyEl.innerHTML = toAdd;
}

function htmlToCsv() {
    if (document.getElementById('term').value == '') {
        alert("Please fill out the term field as that will be the name of the csv.");
        return;
    }
    var filename = document.getElementById('term').value;
    var csvTable = [];
    csvTable.push(["#", "Company", "Position", "Date", "Time", "Status"])
    for (let i = 0; i < tableContent.length; i++) {
        var stringToAdd = (i + 1).toString() + ',' + tableContent[i].join(',');
        csvTable.push(stringToAdd);
    }
    downloadCSVFile(csvTable.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
    var csvFile, downloadLink;
    csvFile = new Blob([csv], { type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}