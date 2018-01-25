var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/Users");

var UserSchema=new mongoose.Schema({
    name: { type: String, sortable: true, sorted: 'descending'},
    email: String,
    phone: String,
    role: String,
    lastAction: { 
        type: [{
            type: String, 
            enum: ['Create', 'Read', 'Update', 'Delete'] 
    }],
    },
    lastLogIn: { type: Date, default: Date.now },
})

var User= mongoose.model("User",UserSchema);
   
app.get("/",function(req,res){
    res.redirect("/users");
})



app.get("/users",function(req,res){
    User.find({}, null, {sort: {'email': 1}},function(err,d){
        if(err){
            console.log("Error has occured while reading all users");
        }else{
                res.render("User",{users:d}); 
        }
    })
})

app.get("/users/new",function(req,res){
    res.render("new");
})

app.post("/users",function(req,res){
    User.create(req.body.d,function(err,user){
        if(err){
            console.log("Error while inserting user details");
        }else{
            res.redirect("/users");
        }
    })
})

app.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            console.log("Error has occured while getting the details of the user.");
        }else{
            res.render("userDetails", {user:foundUser});
        }
    })
})

app.get("/users/:id/edit",function(req,res){
    User.findById(req.params.id,function(err,userToEdit){
        if(err){
            console.log("Error has occured while going to the edit form");
        }else{
            res.render("edit",{user:userToEdit});   
        }
    })
})

app.put("/users/:id",function(req,res){
    User.findByIdAndUpdate(req.params.id,req.body.d,function(err,updatedUser){
        if(err){
            console.log("Error occured while updating the user!");
        }else{
            res.redirect("/users/"+req.params.id);
        }
    })
})

app.delete("/users/:id",function(req,res){
    User.findByIdAndRemove(req.params.id,function(err,deletedUser){
        if(err){
            console.log("Error has occured while deleting");
        }else{
            res.redirect("/users");
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started ... ");
})

