import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    duration: {type: Number, required: true},
    description: {type: String, required: true}
});
const PostDB = mongoose.model("Post",postSchema);
export default PostDB;