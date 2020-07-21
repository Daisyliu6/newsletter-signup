const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

// set up the sign up page
app.get("/", function(req, res){
 res.sendFile(__dirname + '/signup.html');
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.post("/", function(req, res){
 const fname = req.body.fname;
 const lname = req.body.lname;
 const email = req.body.email;
  const data = {
    members: [
       {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: fname, LNAME: lname }
       }]
    }

const jsonData = JSON.stringify(data);
const url = process.env.URL;
const options = {
    method: "POST",
    auth: process.env.AUTH
}

const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
        console.log(JSON.parse(data));
    })
});

request.write(jsonData);
request.end();
});

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("Server is running on port 3000.")
});
