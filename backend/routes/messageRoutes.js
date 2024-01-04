import express from 'express';
import { createMessage } from '../controllers/messageController.js';

const router = express.Router();

// Route for creating a new message
router.post('/', createMessage);

export default router;
