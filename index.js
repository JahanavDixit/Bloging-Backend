const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*'
}));

const key = process.env.KEY;
const PORT = process.env.PORT || 3001;

const mongoose = require('mongoose');

const mngdb = require('mongodb');


mongoose.connect(key,{ useNewUrlParser: true, useUnifiedTopology: true });

const {Schema} = mongoose;

const newBlog = new Schema({
    blog : String,
    sub : String,		
    time : String,
    date : String
});

let Blog = mongoose.model('Blog',newBlog);
app.use(express.static(path.resolve(__dirname, '../myblog/build')));
app.use(express.json());

app.post('/api',(req,res)=>{    
    let rsub = req.body.content.subject;
    let rblog = req.body.content.content;
    let rtime = req.body.time
    let rdate = req.body.date
    let curr = new Blog({blog:rblog,sub:rsub,time:rtime,date:rdate})
    curr.save(); 
});

app.get('/api',(req,res)=>{

    Blog.find({}, function(err,blogs){

        var blogsMap = {};

        blogs.forEach(function(blog){
            blogsMap[blog._id] = blog;
        });

        res.send(blogsMap);
    });
});

app.listen(PORT,()=>{
console.log("Server is running at port : " + PORT);
});
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../myblog/build', 'index.html'));
});