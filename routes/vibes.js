import express from "express";
import Vibe from '../models/Vibe.js';
import authMiddleware from '../middleware/auth.js';
import {addVibe,gettingSpecificUserVibes,gettingAllVibes,likingVibe,gettingAllFollowedVibes} from '../controllers/vibeControllers.js';

const router=express.Router();

router.route('/addVibes').post(authMiddleware,addVibe);
router.route('/getUserVibes').get(authMiddleware,gettingSpecificUserVibes);
router.route('/getVibes').get(gettingAllVibes);
router.route('/:id/like').put(authMiddleware,likingVibe);
router.route('/feed').get(authMiddleware,gettingAllFollowedVibes)
export default router;