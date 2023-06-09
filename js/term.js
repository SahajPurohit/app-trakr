window.onload = function() {
    document.getElementById('term-name').value = ''; // Clear term on refresh
    document.getElementById('uploader').value = ''; // Clear file uploader on window load
}

let tableContent = [];
let stateOfEditButton = "unclicked";
window.addEventListener('load', function() {
    let queryParams = new URLSearchParams(window.location.search);
    let source = queryParams.get('source');
    setTableHeaders(["Company", "Position", "Date Applied", "Time Applied", "Status"]); // temp fix for bug where table headers are not set when refreshing term
    renderAddPopup(["Company", "Position", "Date Applied", "Time Applied", "Status"]); // temp fix for bug where pop-up elements are not set when refreshing term
    if (source === "create") {
        let tableHeaders = JSON.parse(localStorage.getItem("checkedHeaders"));
        localStorage.clear();
        setTableHeaders(tableHeaders);
        renderAddPopup(tableHeaders);
    }

    else if (source === 'upload') {
        // setTableHeaders(["Company", "Position", "Date", "Time", "Status"]);
        let fileName = JSON.parse(localStorage.getItem("fileName"));
        document.getElementById("term-name").value = fileName.substring(0, fileName.length - 4); // Get rid of .csv
        tableContent = JSON.parse(localStorage.getItem("uploadedTable"));
        localStorage.clear();
        renderTable(tableContent);
    }
});

const tableEl = document.querySelector('table');
tableEl.addEventListener("click", deleteRow);

displayTotal();

// Logic to read csv
document.getElementById('uploader').addEventListener('change', readCSV);

function readCSV() {
    let uploader = document.getElementById('uploader');
    let fileName = uploader.files[0].name;
    document.getElementById('term-name').value = fileName.substring(0, fileName.length - 4);
    let reader = new FileReader();
    reader.readAsText(uploader.files[0]);
    reader.onloadend = () => {
        let csv = reader.result;
        let csvTable = csv.split('\n');
        csvTable.shift(); // remove the table header line
        csvTable = csvTable.map((e) => e.split(','));
        csvTable = csvTable.map((e) => e.splice(1)); // remove the first element from each subarray, this is the '#'
        tableContent = csvTable;
        renderTable(tableContent);
    }
}

// Logic to show add applications popup form
document.querySelector("#add-app").addEventListener("click", function() {
    document.querySelector(".popup-form").classList.add("active");
    document.querySelector("#overlay").classList.add("active");
});

// Close btn logic
document.querySelector(".popup-form .close-btn").addEventListener("click", closeAddAppPopup);

document.querySelector(".analytics-popup .close-btn").addEventListener("click", closeAnalyticsPopup);

// Should also close after clicking enter
document.querySelector(".popup-form .enter-btn").addEventListener("click", closeAddAppPopup);

function closeAddAppPopup() {
    document.querySelector(".popup-form").classList.remove("active");
    document.querySelector("#overlay").classList.remove("active");
    document.getElementById('company-name').value = '';
    document.getElementById('position-name').value = '';
    document.getElementById('date-applied').value = '';
    document.getElementById('autofill-date').checked = true;
}

function closeAnalyticsPopup() {
    document.querySelector(".analytics-popup").classList.remove("active");
    document.querySelector("#overlay").classList.remove("active");
    // Clear canvas on close
    // const canvas = document.getElementById('chart-canvas');
    // const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function addApps() {
    let dateAndTime = Date();
    let date;
    if (document.getElementById('autofill-date').checked) date = dateAndTime.substring(0, 15);
    else {
        const dateParts = document.getElementById('date-applied').value.split('-');
        const year = dateParts[0];
        const month = dateParts[1] - 1; // Month values in JavaScript start from 0 (January) instead of 1
        const day = dateParts[2];
        const dateObject = new Date(year, month, day); // This had to be done of time zone issues, otherwise the dates were off by one
        const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric'};
        date = dateObject.toLocaleDateString('en-US', options).replace(/,/g, ''); // Remove commas
    }
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
    renderTable(tableContent);
}

function deleteLatestEntry() {
    if (tableContent.length === 0) return;
    tableContent.pop();
    renderTable(tableContent);
}

function renderTable(tableToRender) {
    const tbodyEl = document.querySelector('tbody');
    let toAdd = ``;
    if (tableToRender === null) return; // temp fix for bug where tableContent is (always?) null on startup
    for (let i = 0; i < tableToRender.length; i++) {
        toAdd += `<tr><td>${i + 1}</td>`;
        for (let j = 0; j < tableToRender[i].length; j++) toAdd += `<td>${tableToRender[i][j]}</td>`;
        toAdd += `<td><button class='delete-btn'>&times;</button></td></tr>`;
    }
    tbodyEl.innerHTML = toAdd;
    displayTotal();
}

function htmlToCsv() {
    if (document.getElementById('term-name').value === '') {
        alert("Please fill out the term field as that will be the name of the csv.");
        return;
    }
    let filename = document.getElementById('term-name').value;
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

function displayTotal() {
    document.getElementById('num-apps').innerHTML = "Total: " + tableContent.length;
}

function setTableHeaders(tableHeaderArr) {
    const theadEl = document.querySelector('thead');
    let toAdd = `<tr><th>#</th>`;
    for (let i = 0; i < tableHeaderArr.length; i++) toAdd += `<th>${tableHeaderArr[i]}</th>`;
    toAdd += `<th></th></tr>`;
    theadEl.innerHTML = toAdd;
}

function renderAddPopup(tableHeaders) {
    const headerSet = new Set(tableHeaders);
    const div = document.getElementById('render-form-elements');
    div.innerHTML = '';
    const beginString = `<div class="form-element" 
                                style="color: lightblue;
                                display: block;
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: bold;
                                margin-bottom: 10px;
                                width: 100%;">`;
    if (headerSet.has("Company")) {
        div.innerHTML += `${beginString}<label for="company-name">Company: </label>
        <input type="text" id="company-name" placeholder="Enter company name"></div>`;
    }
    if (headerSet.has("Position")) {
        div.innerHTML += `${beginString}<label for="position-name">Position: </label>
        <input type="text" id="position-name" placeholder="Enter position name"></div>`;
    }
    if (headerSet.has("Date Applied")) {
        div.innerHTML += `${beginString}<label for="date-applied">Date: </label>
        <input type="date" id="date-applied">
        <label for="autofill-date" style="margin-left: 20px" id="autofill-date-label">Autofill: </label>
        <input type="checkbox" checked id="autofill-date"></div>`;
    }
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

let chart = null;

function displayAnalyticsPopup() {
    document.querySelector(".analytics-popup").classList.add("active");
    document.querySelector("#overlay").classList.add("active");
}

function displayChart() {
    let graphData = document.getElementById("graph-data");
    let selectedGraphDataIndex = graphData.selectedIndex;
    let selectedGraphDataOption = graphData.options[selectedGraphDataIndex];
    let selectedGraphDataValue = selectedGraphDataOption.value;

    let graphType = document.getElementById("graph-type");
    let selectedGraphTypeIndex = graphType.selectedIndex;
    let selectedGraphTypeOption = graphType.options[selectedGraphTypeIndex];
    let selectedGraphTypeValue = selectedGraphTypeOption.value;

    if (selectedGraphTypeValue === "bar") displayBarChart(prepChartData(tableContent, selectedGraphDataValue), selectedGraphDataValue);
    else if (selectedGraphTypeValue === "pie") displayPieChart(prepChartData(tableContent, selectedGraphDataValue), selectedGraphDataValue);
}

function prepChartData(dataTable, chartLabel) {
    let chartLabelIndex;
    if (chartLabel === "app-per-company") chartLabelIndex = 0;
    else if (chartLabel === "app-per-position") chartLabelIndex = 1;
    else if (chartLabel === "app-per-day") chartLabelIndex = 2;
    else if (chartLabel === "app-per-status") chartLabelIndex = 4;
    let chartContent = new Map();
    for (let i = 0; i < dataTable.length; i++) {
        if (!chartContent.has(dataTable[i][chartLabelIndex])) chartContent.set(dataTable[i][chartLabelIndex], 1);
        else chartContent.set(dataTable[i][chartLabelIndex], chartContent.get(dataTable[i][chartLabelIndex]) + 1);
    }
    return chartContent;
}

function displayBarChart(chartContent, chartLabel) {
    let processedChartLabel = "Number of applications per " + chartLabel.split("-").slice(-1);
    let colorScale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(3);
    let data = {
        labels: Array.from(chartContent.keys()),
        datasets: [{
            label: processedChartLabel,
            data: Array.from(chartContent.values()),
            backgroundColor: colorScale,
            borderWidth: 1
        }]
    };
    let ctx = document.getElementById('chart-canvas').getContext('2d');
    if (chart) chart.destroy(); // destroy previous chart if it exists
    chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayPieChart(chartContent, chartLabel) {
    let processedChartLabel = "Number of applications per " + chartLabel.split("-").slice(-1);
    let data = {
        labels: Array.from(chartContent.keys()),
        datasets: [{
            label: processedChartLabel,
            data: Array.from(chartContent.values()),
        }]
    };
    let ctx = document.getElementById('chart-canvas').getContext('2d');
    if (chart) chart.destroy(); // destroy previous chart if it exists
    chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Position per company'
            }
        }
    });
}