import { Router, Request, Response } from 'express';
import { AuthenticationController } from '../controllers/authenticationController';
import { UserService } from '../services/userService';
import { asyncWrapper } from '../utils/asyncWrapper';

const authRouter = Router();
const authenticationController = new AuthenticationController(new UserService());

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and return token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing credentials
 */
authRouter.post("/login", asyncWrapper((req: Request, res: Response) => authenticationController.loginUser(req, res)));

export default authRouter;
