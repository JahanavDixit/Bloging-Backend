const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const NodeCache = require('node-cache');
const app = express();
const compression = require('compression');

app.use(compression());

app.use(cors({
    origin: '*'
}));

const key = process.env.KEY;
const PORT = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
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

newBlog.index({_id: 1});

let Blog = mongoose.model('Blog',newBlog);
app.use(express.static(path.resolve(__dirname, '../myblog/build')));
app.use(express.json());

app.post('/api',(req,res)=>{    
    let rsub = req.body.content.subject;
    let rblog = req.body.content.content;
    let rtime = req.body.time
    let rdate = req.body.date
    let curr = new Blog({blog:rblog,sub:rsub,time:rtime,date:rdate})
    cache.del('/api');
    curr.save(); 
});

app.get('/api', async (req,res)=>{
    try{
    const blogs= await Blogs.find({})
	.sort({ date: -1 })
	.lean();
    const blogsMap = {};
    blogs.forEach(function(blog){
            blogsMap[blog._id] = blog;
        });
    cache.set('/api', blogsMap);
    res.send(blogsMap);
    } catch(err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    }    
});

app.listen(PORT,()=>{
console.log("Server is running at port : " + PORT);
});