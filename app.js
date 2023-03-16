const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));  //to access static files I use this function of express
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
    
    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const user_email = req.body.userEmail;

    const data = {
        members: [
            {
                email_address : user_email,
                status : "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name,
                }

            }
        ]
    };
        const jsonData = JSON.stringify(data);
        const url = "https://us20.api.mailchimp.com/3.0/lists/fc527dac9e"

        const options = {
                method : "POST",
                auth : 'arslan:???-us20',  //use your API-KEY on the place of "???" and your server of mailchimp on "us20"
        }
        const request = https.request(url, options, function(response){
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");

            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
            response.on("data",function(data){
                console.log(JSON.parse(data));
            });
        });
        request.write(jsonData);
        request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server Started on Port 3000..!!!");
});

