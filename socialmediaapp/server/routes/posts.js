import express from 'express';
import { getAllPosts, getUserPosts, likePost } from '../Controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */
router.get('/', verifyToken, getAllPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

/* UPDATE */
router.patch('/:id/like', verifyToken, likePost);

export default router;