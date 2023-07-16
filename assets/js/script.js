// https://dev.to/ptprashanttripathi/how-to-hide-api-key-in-github-repo-2ik9
const API_KEY = config.API_KEY;
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    // make a GET request to the API URL with the API key
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    
    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }

    // pass the data to a display function
    function displayStatus(data) {
        let heading = document.getElementById("resultsModalTitle").innerText = "API Key Status";
        let body = document.getElementById("results-content").innerHTML = `Your key is valid until<br> ${data.expiry}`;
        resultsModal.show();

        // let heading = "API Key Status";
        // let results = `<div>Your key is valid until</div>`;
        // results += `<div class="key-status">${data.expiry}</div>`;
        
        // document.getElementById("resultsModalTitle").innerText = heading;
        // document.getElementById("results-content").innerText = results;
    }
}