import express from "express";
import bodyParser from "body-parser";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
import { fileURLToPath } from 'url';
import  { dirname } from 'path';
const __fileUrl = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileUrl);
import * as date from './date.js';
var activityEnteredList= ["eat food","do homework", "go shopping"];
let workList = [];
let day = date.getDate();

app.use(express.static("public"));
// app.get("/",function(req,res){
//     var day = "";
// var today = new Date();
// var currentDate =  today.getDay();

// if(currentDate === 7)
// day = "Sunday";
// else if (currentDate === 6)
// day = "Saturday";
// else if (currentDate === 5)
// day = "Friday";
// else if (currentDate === 4)
// day = "Thursday";
// else if (currentDate === 3)
// day = "Wednesday";
// else if (currentDate === 2)
// day = "Tuesday";
// else 
// day ="Monday";
//     res.render("list",{kindOfDay : day});
// })

app.get("/",function(req,res){
    
    // var today = new Date();

    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    // };

  //  var day = today.toLocaleDateString("en-PK",options);  
    res.render("list",{kindOfDay : day, activity : activityEnteredList}); 
})

app.get("/about",function(req,res){
    res.render('about');
})
app.post('/',function(req,res){
    console.log(req.body);
 var  activityEntered = req.body.activity;
 if(activityEntered ==""){return;}
 if(req.body.list === "Work")
 {
    
    workList.push(activityEntered);
    res.redirect("/work");
 }
 else{
 
    activityEnteredList.push(activityEntered);
    res.redirect("/");
 }

  
})
app.get('/Work',function(req,res){
   
    res.render("list",{kindOfDay : "Work", activity : workList});
})
app.listen(process.env.PORT || 3000, function(){console.log("Server has been Started");});