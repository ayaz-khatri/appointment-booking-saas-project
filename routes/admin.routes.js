import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.controller.js';
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/', adminController.index);

export default router;