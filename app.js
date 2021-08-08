
var port = process.env.PORT || 1337;
 var redis_port = process.env.PORT || 6379;

const express = require("express");
const redis = require("redis");
const router = express();
const bodyParser = require("body-parser");

const client = redis.createClient();

router.set("view engine", "ejs");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb+srv://admin:admin123@wpr252.xvrul.mongodb.net/librarydb?retryWrites=true&w=majority";
router.use(bodyParser.urlencoded({ extended: true }));



/* Commented out after they served their purpose
/////////Creating a DataBase and a Collection
//MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db_obj) {
//    if (err) {
//        console.log(err.message);
//    } else {
//         dbconnect = db_obj.db("librarydb");
//        console.log("using " + dbconnect.databaseName + " database");
//        /////
//        dbconnect.createCollection("books", function (err, result) {
//            if (err) {
//                console.log(err.message);
//            } else {
//                console.log(result, " collection created");
//            }
//        });
//    });
*/


router.get("/", function (request, response) {
    response.render("index");
});

router.get("/addBook", function (request, response) {
    response.render("addBook", { title: "Add a new Book :) " });
});

//Adding books
router.post("/addData", function (request, response) {
    
    MongoClient.connect(url, function (err, db_obj) {
        if (err) throw err;
        librarydb = db_obj.db("librarydb");
        console.log("Connected To Server");
       
        var adding = librarydb.collection("books");
        var newbook = { author: request.body.author, title: request.body.title, year: request.body.year };
        adding.insert([newbook], function (err, res) {
            if (err) throw err;
            console.log(res.insertedCount + " row added");
            
            response.redirect("/")
            db_obj.close();
        });
       
    });
   });

  
   //Deleting books
router.post('/deleteBook',(req,res)=>{
    MongoClient.connect(url, function (err, db_obj) {
        if (err) throw err;
        librarydb = db_obj.db("librarydb");
        console.log("Connected To Server");

        var deleting = librarydb.collection("books");
        var delQ={_id:req.body.id};
        deleting.deleteOne(delQ,function(err,doc) {
            if (err) throw err;
            else if (doc.length) {
                response.render("viewAll", { books: doc })
               
            }
            console.log("1 Book deleted")
            db_obj.close();
        });
    }); 
        
});

router.get("/viewAll", function (request, response) {
    MongoClient.connect(url, function (err, db_obj) {
        if (err) throw err;
        librarydb = db_obj.db("librarydb");
        console.log("Connected To Server");

        var display = librarydb.collection("books");
        display.find({}).sort({ author:1 }).toArray(function (err, doc) {
            if (err) throw err;
            else if (doc.length) {
                response.render("viewAll", { books: doc })
               
            }
           
            db_obj.close();
        });
            
       
    });
});

router.use(function (req, res) {
    res.render("404")

});


client.on("error",function (error){
    console.error("Error: ",error);
});
client.on("connect",function (error){
    console.log("Redis Connection success");
});
router.listen(port);
module.exports.router;
