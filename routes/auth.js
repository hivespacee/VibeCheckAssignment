import express from "express";
import User from "../models/User.js";
import {registerUser,loginUser,allUsers,followUser} from "../controllers/authControllers.js";
import authMiddleware from '../middleware/auth.js';

const router= express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/users').get(allUsers);

router.route('/:id/follow').post(authMiddleware, followUser);

export default router;

