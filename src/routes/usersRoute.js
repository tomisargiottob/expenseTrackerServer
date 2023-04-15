import express from 'express';
import UserController from '../controllers/users';

const router = express.Router();

router.post('/login', UserController.loginUser);

router.post('/register',UserController.registerUser);

router.get('/',UserController.getUserData);

export default router;
