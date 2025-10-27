import express from 'express';
import cors from 'cors';
import plantripController from './controllers/plan.controller';
import connectDB from './config/db.config';
import PostDB from './models/post.model';
const app = express();
app.use(express.json());
app.use(cors());

app.get("/health",(req,res)=>{
    res.json({status:"ok"});
})

app.post("/api/plan-trip",plantripController);
interface TripDetails{
    title: string;
    duration: number;
    description: string;
}
app.post("/api/post-trip",async (req,res)=>{
    // make the db call here
    const {title,duration,description} = req.body as TripDetails;
    // to store the trip plan
    const newPost = new PostDB({title,duration,description});
    await newPost.save();
    res.status(201).json({status:"ok"});
})

app.get("/api/get-trips",async (req,res)=>{
    // make the db call here
    // to fetch all the trips
    const posts = await PostDB.find();
    res.status(200).json(posts);
});
app.get("/api/get-trip/:id",async (req,res)=>{
    const {id} = req.params;
    const post =  await PostDB.findById(id);
    res.status(200).json(post);
});


app.listen(5000,()=>{
    connectDB();
    console.log("server =>  http://localhost:5000");
});