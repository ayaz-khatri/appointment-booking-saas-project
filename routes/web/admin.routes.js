import express from 'express';
const router = express.Router();
import adminController from '../../controllers/web/admin.controller.js';
import { isAuthenticated, isAdmin } from "../../middlewares/auth.middleware.js";

router.use(isAuthenticated);
router.use(isAdmin);

router.use('/', (req, res, next)=>{
  res.locals.layout = 'layouts/admin.layout.ejs';
  next();
});

router.get('/', adminController.index);

export default router;