window.onload = function() {
    uncheckAll();
}

document.getElementById("create-quad").addEventListener("click", function() {
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
    uncheckAll();
}

function checkAll() {
    document.querySelectorAll('input[type="checkbox"]').forEach(e => e.checked = true);
}

function uncheckAll() {
    document.querySelectorAll('input[type="checkbox"]').forEach(e => e.checked = false);
}

function createTable() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    checkedCheckboxes = checkedCheckboxes.map(e => e.name);
    localStorage.setItem("checkedHeaders", JSON.stringify(checkedCheckboxes));
    window.location.href = "term.html?source=" + encodeURIComponent("create");
}

document.getElementById('csv-uploader').addEventListener('change', readCSV);

function readCSV() {
    let uploader = document.getElementById('csv-uploader');
    let reader = new FileReader();
    reader.readAsText(uploader.files[0]);
    reader.onloadend = () => {
        let csv = reader.result;
        let csvTable = csv.split('\n');
        csvTable.shift(); // remove the table header line
        csvTable = csvTable.map((e) => e.split(','));
        csvTable = csvTable.map((e) => e.splice(1)); // remove the first element from each subarray, this is the '#'
        localStorage.setItem("uploadedTable", JSON.stringify(csvTable));
        window.location.href = "term.html?source=" + encodeURIComponent("upload");
    }
}