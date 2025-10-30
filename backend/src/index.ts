import express from "express";
import { createClient } from "redis";
import cors from "cors";
import plantripController from "./controllers/plan.controller";
import connectDB from "./config/db.config";
import PostDB from "./models/post.model";
const app = express();
app.use(express.json());
app.use(cors());

async function connectRedis() {
  await client.connect();
  console.log("Connected to Redis");
  console.log("Connected to Redis at:", client.options?.url);
  
} 
const client = createClient({
    url : process.env.REDIS_URL || "redis://localhost:6379"
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/plan-trip", plantripController);
interface TripDetails {
  title: string;
  duration: number;
  description: string;
}
app.post("/api/post-trip", async (req, res) => {
  // make the db call here
  const { title, duration, description } = req.body as TripDetails;
  // to store the trip plan
  const newPost = new PostDB({ title, duration, description });
  await newPost.save();
 const posts = await PostDB.find();
  await client.del("all_posts"); // Invalidate cache
  await client.set("all_posts", JSON.stringify(posts)); // Reset cache
  res.status(201).json({ status: "ok" });
});

app.get("/api/get-trips", async (req, res) => {
  // make the db call here
  // to fetch all the trips

  const posts  = await client.get("all_posts");
  if(posts){
    console.log("Cache hit : all_posts");
    res.status(200).json(JSON.parse(posts));
    return;
  }
  else {
    console.log("Cache miss : all_posts");
      const posts = await PostDB.find();
      await client.setEx("all_posts", 3600, JSON.stringify(posts));
      res.status(200).json(posts);
    }
});
app.get("/api/get-trip/:id", async (req, res) => {
  const { id } = req.params;

  const cachedPost = await client.get(id);

  if (cachedPost) {
    console.log("Cache hit : individual post");
    return res.status(200).json(JSON.parse(cachedPost));
  }

  console.log("Cache miss : individual post");
  const post = await PostDB.findById(id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  await client.setEx(id, 3600, JSON.stringify(post));

  return res.status(200).json(post);
});

app.listen(5000, async () => {
  await connectDB();
  await connectRedis();
  console.log("server =>  http://localhost:5000");
});
