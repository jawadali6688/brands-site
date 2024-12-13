import express from 'express';
import { submitFeedback, getFeedbackStatistics, getProductFeedback } from '../controllers/FeedbackController.js';  // Adjust the import path as needed

const router = express.Router();

router.post('/', submitFeedback);
router.get('/statistics/:productId', getFeedbackStatistics);
router.get('/:productId', getProductFeedback);  // New route to fetch all feedback

export default router;
