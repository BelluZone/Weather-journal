// const { log } = require("console");
const express = require("express");
const app = express()
const cors = require("cors");

const port = 3000;
const server = app.listen(port, listening);

app.use(cors());
app.use(express.static("website"));
app.use(express.json());

function listening() {
  console.log(`Server running on port ${port}`);
}

// init projectData as object
let projectData = {};

//post newEntry-route to get data from client to store 
app.post("/newEntry", (req, res) => {
  projectData = {
    temp: req.body.temp,
    date: req.body.date,
    feel: req.body.feel
  }
  res.json(`Success, created the new entry:
    temp: ${projectData.temp}
    date: ${projectData.date}
    feelings: ${projectData.feel}`
  );
})

//get weather-route to receive data from openweahtermap api
app.get("/weather", async (req, res) => {
  const zipCode = req.query.zip;
  const apiKey = req.query.appid;
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;

  try {
    const weatherResponse = await fetch(url);
    const weatherData = await weatherResponse.json();
    const { name, dt, main: { temp } } = weatherData; //name: / main: temp:
    const newObj = { name, dt, temp };
    const fromattedDate = new Date(dt * 1000);

    newObj.temp -= 273.15;
    newObj.dt = fromattedDate.toLocaleDateString();

    res.json(newObj); // Send the data to the client
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

//get all route to send projectData back to client
app.get("/all", (req, res) => {
  res.json(projectData);
})