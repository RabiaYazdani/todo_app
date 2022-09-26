import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
import { fileURLToPath } from 'url';
import  { dirname } from 'path';
const __fileUrl = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileUrl);
import * as date from './date.js';
// var activityEnteredList= ["eat food","do homework", "go shopping"];
// let workList = [];
let day = date.getDate();
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
app.use(express.static("public"));

// schema or model of the data
const itemsSchema = {
    name: String
};
// Declaring name and adding the schema 
const Item = mongoose.model("Item",itemsSchema);

const listSchema = {
    name: String, 
    items: [itemsSchema]
}
const List = mongoose.model("List",listSchema);

const defaultList = [Item({name: "Welcome to my todolist"}),Item({name:"Hit + button to add new activity"}),Item({name:"<-- Hit this to delete an item"})];

function addItems (){
Item.insertMany(defaultList,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Added successfully");
    }

})
}
app.get("/",function(req,res){
    Item.find(function(err, items){
        if(items.length==0)
        {
            addItems();
            res.redirect("/");
        }
        else 
        {
        res.render("list",{kindOfDay : day, activity : items}); }
    
    })
  
})

app.get("/:customListName",function(req,res){
    const customName = req.params.customListName;
    List.findOne({name:customName},function(err, foundList){
if(!err){
    if(!foundList)
    {
        const list = new List( {
            name: customName,
            items : defaultList,
        
    })
    list.save();
    res.redirect("/"+ customName);
    
    }else {
        res.render("list", 
        {kindOfDay: foundList.name, activity: foundList.items })
    }
}
    })

})
app.get("/about",function(req,res){
    res.render('about');
})

app.post('/',function(req,res){
   
 var  activityEntered = req.body.activity;
 var listName = req.body.list;
 const item = Item ({name: activityEntered});
 if(activityEntered =="")
 {
    res.redirect("/");return;
  }
 else{
    if(listName === day){
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
 
 }

  
})
app.post("/delete",function(req,res){
    const selectedItem = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day ){
        Item.findByIdAndRemove(selectedItem,function(err){
            if(err)
            {
                console.log('something went wrong');
            }
            else
                {
                    res.redirect("/");
                }
    }) }
    else
    {
        List.findOneAndUpdate({name: listName},{$pull :{items:{_id:selectedItem}}},function(err,foundList){
            if(!err)
            {
                res.redirect("/"+listName); 
            }
        })
    }
   

})

app.listen(process.env.PORT || 3000, function(){console.log("Server has been Started");});