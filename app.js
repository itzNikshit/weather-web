const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

var foot = "&appid=a6648fa7212816048626feca6a55ff87&units=metric";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var q = req.body.place;
  https.get("https://api.openweathermap.org/data/2.5/weather?q="+q+foot, function(ans) {
    console.log(ans.statusCode);
    // this gives the weather data but in hexadecimal format
    // so in order to get it in json format we will use JSON.parse method;
    ans.on("data", function(data) {
      // console.log(data);
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      q = q.slice(0,1).toUpperCase() + q.slice(1,q.length);
      // res.send(weatherData);
      res.write("<p>The weather is currently " + description + ".</p>");
      res.write("<h1>The temperature in " + q + " is " + temp + " degrees Celcius.</h1>");
      res.write("<image src=" + imageUrl + " alt=weather-img>");
      res.send();
    });
  });
});

app.listen("3000", function() {
  console.log("Server listening on port 3000");
});
