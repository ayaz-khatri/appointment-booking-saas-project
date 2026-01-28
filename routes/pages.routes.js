import express from 'express';
const router = express.Router();
import pagesController from '../controllers/pages.controller.js';

router.get('/', pagesController.index);

export default router;