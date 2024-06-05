// UserRouter.js
import express from "express";
import { UserController } from "../controller/UserController.mjs";
import { protectedWithRole, secure } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/', UserController.getHello);
router.get('/email/:email', secure, UserController.getUserByEmail);
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/registerWithRole', protectedWithRole('admin'), UserController.registerWithRole);
router.put('/update/:_id', UserController.updateUser);
router.put('/updateWithRole/:_id', protectedWithRole('admin'), UserController.updateUserWithRole);

export const UserRouter = router;
