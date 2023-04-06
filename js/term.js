window.onload = function() {
    document.getElementById('term').value = ''; // Clear term on refresh
    document.getElementById('uploader').value = ''; // Clear file uploader on window load
}

let stateOfEditButton = "unclicked";
let tableContent = [];

window.addEventListener('load', function() {
    let queryParams = new URLSearchParams(window.location.search);
    let source = queryParams.get('source');

    if (source === "create") {
        let tableHeaders = JSON.parse(localStorage.getItem("checkedHeaders"));
        localStorage.clear();
        setTableHeaders(tableHeaders);
    }

    else if (source === 'upload') {
        setTableHeaders(["Company", "Position", "Date", "Time", "Status"]);
        tableContent = JSON.parse(localStorage.getItem("uploadedTable"));
        localStorage.clear();
        renderTable();
    }
});


const tableEl = document.querySelector('table');
tableEl.addEventListener("click", deleteRow);

displayTotal();

// Logic to read csv
document.getElementById('uploader').addEventListener('change', readCSV);

// Logic to show form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
    document.querySelector("#overlay").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", closePopup);

// Should also close after clicking enter
document.querySelector(".popup-form .enter-btn").addEventListener("click", closePopup);


function closePopup() {
    document.querySelector(".popup-form").classList.remove("active");
    document.querySelector("#overlay").classList.remove("active");
    document.getElementById('company-name').value = '';
    document.getElementById('position-name').value = '';
}

function addApps() {
    let dateAndTime = Date();
    let date = dateAndTime.substring(0, 15);
    let time = dateAndTime.substring(16, 24);
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
    displayTotal();
}

function deleteRow(e) {
    if (!e.target.classList.contains('delete-btn')) return;
    let btn = e.target;
    let rowInnerHTML = btn.closest('tr');
    let idx = rowInnerHTML.querySelector('td:first-child').innerHTML;
    idx = parseInt(idx)
    tableContent.splice(idx - 1, 1);
    renderTable();
}

function deleteLatestEntry() {
    if (tableContent.length === 0) return;
    tableContent.pop();
    renderTable();
}

function renderTable() {
    const tbodyEl = document.querySelector('tbody');
    let toAdd = ``;
    for (let i = 0; i < tableContent.length; i++) {
        toAdd += `<tr><td>${i + 1}</td>`;
        for (let j = 0; j < tableContent[i].length; j++) toAdd += `<td>${tableContent[i][j]}</td>`;
        toAdd += `<td><button class='delete-btn'>&times;</button></td></tr>`;
    }
    tbodyEl.innerHTML = toAdd;
    displayTotal();
}

function htmlToCsv() {
    if (document.getElementById('term').value === '') {
        alert("Please fill out the term field as that will be the name of the csv.");
        return;
    }
    let filename = document.getElementById('term').value;
    let csvTable = [];
    csvTable.push(["#", "Company", "Position", "Date", "Time", "Status"])
    for (let i = 0; i < tableContent.length; i++) {
        let stringToAdd = (i + 1).toString() + ',' + tableContent[i].join(',');
        csvTable.push(stringToAdd);
    }
    downloadCSVFile(csvTable.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
    let csvFile, downloadLink;
    csvFile = new Blob([csv], { type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function readCSV() {
    let uploader = document.getElementById('uploader');
    let reader = new FileReader();
    reader.readAsText(uploader.files[0]);
    reader.onloadend = () => {
        let csv = reader.result;
        let csvTable = csv.split('\n');
        csvTable.shift(); // remove the table header line
        csvTable = csvTable.map((e) => e.split(',')); 
        csvTable = csvTable.map((e) => e.splice(1)); // remove the first element from each subarray, this is the '#'
        tableContent = csvTable;
        renderTable();
    }
}

function displayTotal() {
    document.getElementById('num-apps').innerHTML = "Total: " + tableContent.length;
}

function setTableHeaders(tableHeaderArr) {
    const theadEl = document.querySelector('thead');
    let toAdd = `<tr><th>#</th>`;
    for (let i = 0; i < tableHeaderArr.length; i++) {
        toAdd += `<th>${tableHeaderArr[i]}</th>`;
    }
    toAdd += `<th></th></tr>`;
    theadEl.innerHTML = toAdd;
}

function makeEditable() {
    const table = document.getElementById("table");
    const cells = table.getElementsByTagName("td");
    const editButton = document.getElementById("edit-btn");
    if (stateOfEditButton === "unclicked") {
        stateOfEditButton = "clicked";
        editButton.style.backgroundColor = "green";
        for (let i = 0; i < cells.length; i++) cells[i].contentEditable = true;
    }
    else if (stateOfEditButton === "clicked") {
        let oneDimTable = [];
        stateOfEditButton = "unclicked";
        editButton.style.backgroundColor = "white";
        for (let i = 0; i < cells.length; i++) {
            oneDimTable.push(cells[i].innerHTML);
            cells[i].contentEditable = false;
        }
        // Save changes on edit
        let newTable = [];
        for (let i = 0; i < oneDimTable.length; i += 7) newTable.push(oneDimTable.slice(i, i + 7));
        newTable = newTable.map(e => e.slice(1, -1));
        tableContent = newTable;
    }
}