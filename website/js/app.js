const apiKey = "d045e9da599b205b164ad32e1a3c5469&units=imperial";
const baseUrl = "http://localhost:3000"; // URL of the Node.js server

/**
* @description fetching data from url
* @param {string} string of the server URL and route
*/
async function getData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

/**
* @description posting data to server
* @param {string} string of the server URL and route
* @param {object} object to send to server
*/
async function postData(url, data) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        await res.json();
    } catch (error) {
        console.warn(error);
        return null;
    }
}

/**
* @description dynamically changes the UI to the given input
*/
function handler() {
    const zip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;
    const weatherQuery = `${baseUrl}/weather?zip=${zip},de&appid=${apiKey}`;
    const answer = document.getElementById("answer-text");

    // Checks if length of zip code matches regulations
    if (!(zip.length === 5)) {
        //Shows message on UI
        answer.innerHTML = "not a valid ZIP code";
        answer.classList.remove("no-show");
        answer.classList.add("error");
    } else {
        //first gets weatherdata from weather API
        getData(weatherQuery)
            //then sends the data to the server to save including the textfield input
            .then(function (data) {
                postData(baseUrl + "/newEntry", {
                    temp: data.temp,
                    date: data.dt,
                    feel: feelings
                })
            //then gets updated data from server and update UI
            }).then(function () {
                retrieveData();
                answer.classList.add("no-show");
                answer.classList.remove("error");
            });
    }
}

const retrieveData = async () => {
    const request = await fetch(baseUrl + "/all");
    try {
        // Transform into JSON
        const allData = await request.json()
        console.log(allData)
        // Write updated data to DOM elements
        document.getElementById("temp").innerHTML = `It is currently:<br><br>${Math.round(allData.temp)} degrees`;
        document.getElementById("content").innerHTML = `What you had to say:<br><br>${allData.feel}`;
        document.getElementById("date").innerHTML = `Date:<br><br>${allData.date}`;
        document.getElementById("temp").classList.remove("no-show");
        document.getElementById("content").classList.remove("no-show");
        document.getElementById("date").classList.remove("no-show");
    }
    catch (error) {
        console.log("error", error);
    }
}

//event listener for the generate button
document.getElementById("generate").addEventListener("click", handler);
