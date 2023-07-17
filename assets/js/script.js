// https://dev.to/ptprashanttripathi/how-to-hide-api-key-in-github-repo-2ik9
const API_KEY = config.API_KEY;
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArray = [];
    
    // Iterate through the options
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            // Push each value into a temporary array
            optArray.push(entry[1]);
        }
    }
    
    form.delete("options");

    // Convert the array back to a string
    form.append("options", optArray.join());

    return form;
}


// Make a POST request to the API
async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));
   
    // TEST CODE
    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }
    
    // authorise the form with the API key & attach it as the body of the request
    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Authorization": API_KEY,
                        },
                        body: form,
    });

    // convert the response to json and display it
    const data = await response.json();
    
    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

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
