import {commentVibe,getComments,getCommentedVibe} from '../controllers/vibeControllers.js';
import authMiddleware from '../middleware/auth.js';
import Comment from '../models/Comment.js';
import express from 'express';

const router = express.Router();

router.route('/:id/comments').post(authMiddleware,commentVibe);
router.route('/allcomments').get(getComments);
router.route('/:id/comments').get(getCommentedVibe);

export default router;