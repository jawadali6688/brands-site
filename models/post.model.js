import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: { type: String, default: '' },
  mediaUrl: { type: String, required: true }, // Ensure it's mediaUrl
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

export const Post = mongoose.model('Post', postSchema);
