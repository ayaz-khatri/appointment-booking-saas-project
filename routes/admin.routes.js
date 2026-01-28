import express from 'express';
const router = express.Router();


// router.use(isLoggedIn);
// router.use(isAdmin);

router.get('/', async (req, res, next) => {
    try {
        res.render('admin/dashboard');
    } catch (error) {
        next(errorMessage("Something went wrong", 500));
    }
});




export default router;