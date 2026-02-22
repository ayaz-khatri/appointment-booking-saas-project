import express from 'express';
const router = express.Router();
import pagesController from '../../controllers/web/pages.controller.js';

router.get('/', pagesController.index);

export default router;