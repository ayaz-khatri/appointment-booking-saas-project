import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.controller.js';

// router.use(isLoggedIn);
// router.use(isAdmin);

router.get('/', adminController.index);

export default router;