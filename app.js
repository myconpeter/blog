var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override")
var expressSanitzer = require("express-sanitizer");
var express = require("express");
var moment = require('moment');

var app     = express();

// mongo connection
mongoose.connect('mongodb://localhost/BlogApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitzer())

app.use(methodOverride("_method"))

// schema mongoose
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogSchema = new Schema({

  name: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('blog', blogSchema);

// Blog.create(   
//     {
//         name: "Black Girl", 
//         image:"https://images.unsplash.com/photo-1549881349-017011b6122e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8bGFnb3N8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//         body:"This is a beatiful lady, no pimples"
//        });

// the routes ooo
app.get("/", function(req, res){
     res.redirect('/blogs')
});


app.get("/blogs", function(req, res){
    // get all the blog fro db
    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});
        }
    });
    
});

// /blog as a post
app.post("/blogs", function(req, res){
    // create blog
    // console.log(req.body)
    // console.log("before")
    req.body.blog.body = req.sanitize(req.body.blog.body)
    // console.log("after")
    // console.log(req.body)

Blog.create (req.body.blog, function(err, newBlog){

    
        if(err){
            res.render("new")
        }else{
                // redirect to campground page
           res.redirect("/blogs");
        }
    });
}); 


app.get("/blogs/new", function(req, res){
    res.render("new")

});
 
// show route

app.get("/blogs/:id", function(req, res){
Blog.findById(req.params.id, function(err, foundBlog){
if (err){
    res.redirect("/blogs")
}else {
    res.render('show', {blog: foundBlog});
}
});
});

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs")
        }else {
            res.render('edit', {blog: foundBlog});
        }
        });

});
        // update route
        app.put("/blogs/:id", function(req, res){
            req.body.blog.body = req.sanitize(req.body.blog.body)
            Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
if(err){
    res.redirect("/blogs")
}  else {
    res.redirect("/blogs/" + req.params.id)
}
            });
        });

        // delete route
app.delete("/blogs/:id", function(req, res){
Blog.findByIdAndRemove(req.params.id, function(err){
if(err){
    res.redirect("/blogs")
}  else {
    res.redirect("/blogs")
}
            });
        });

        // localhost
        
app.listen(3000, function (){
    console.log("BLOG is now running");
});
