import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    feedbackText: { type: String, required: true },
    sentiment: { type: String, required: true }, // 'Positive', 'Negative', 'Neutral'
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', feedbackSchema);
