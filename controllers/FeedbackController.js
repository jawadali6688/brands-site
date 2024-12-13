// Import Feedback model
import Feedback from '../models/Feedback.js';
import vader from 'vader-sentiment';
import mongoose from 'mongoose';

// Submit Feedback Function (unchanged)
export const submitFeedback = async (req, res) => {
    const { productId, feedbackText } = req.body;
    const sentimentResult = vader.SentimentIntensityAnalyzer.polarity_scores(feedbackText);
    let sentiment;
    if (sentimentResult.compound >= 0.05) {
        sentiment = 'Positive';
    } else if (sentimentResult.compound <= -0.05) {
        sentiment = 'Negative';
    } else {
        sentiment = 'Neutral';
    }

    try {
        const feedback = new Feedback({
            productId,
            feedbackText,
            sentiment,
        });
        await feedback.save();
        res.json({ message: 'Feedback submitted successfully', sentiment });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};

// Get Feedback Statistics Function (unchanged)
export const getFeedbackStatistics = async (req, res) => {
    const { productId } = req.params;
    try {
        const feedbacks = await Feedback.find({ productId });
        const sentimentCounts = {
            positive: 0,
            neutral: 0,
            negative: 0
        };
        feedbacks.forEach(feedback => {
            if (feedback.sentiment === 'Positive') sentimentCounts.positive++;
            if (feedback.sentiment === 'Neutral') sentimentCounts.neutral++;
            if (feedback.sentiment === 'Negative') sentimentCounts.negative++;
        });
        const totalFeedbacks = feedbacks.length;
        const positivePercentage = (sentimentCounts.positive / totalFeedbacks) * 100;
        const neutralPercentage = (sentimentCounts.neutral / totalFeedbacks) * 100;
        const negativePercentage = (sentimentCounts.negative / totalFeedbacks) * 100;
        res.json({
            positive: positivePercentage,
            neutral: neutralPercentage,
            negative: negativePercentage
        });
    } catch (error) {
        console.error('Error fetching feedback statistics:', error);
        res.status(500).json({ message: 'Error fetching feedback statistics', error });
    }
};

// New Function: Fetch all feedbacks for a product
export const getProductFeedback = async (req, res) => {
    const { productId } = req.params;
    try {
        const feedbacks = await Feedback.find({ productId }).sort({ createdAt: -1 });  // Sort by most recent feedback
        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this product' });
        }
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Error fetching feedbacks', error });
    }
};
