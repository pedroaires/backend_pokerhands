import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt'; 

const userRouter = Router();
const userController = new UserController(new UserService());


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
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
 *       201:
 *         description: User registered successfully
 */
userRouter.post("/", asyncWrapper((req: Request, res: Response) => userController.registerUser(req, res)));

/**
 * @swagger
 * /users/getUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 */
userRouter.get("/getUsers", asyncWrapper((req: Request, res: Response) => userController.getAllUsers(req, res)));

/**
 * @swagger
 * /users/getUser:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: The requested user
 *       400:
 *         description: Missing user ID
 */
userRouter.get("/getUser", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.getUserById(req, res)));

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
userRouter.put("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.updateUser(req, res)));


/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Missing user ID
 */
userRouter.delete("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.deleteUser(req, res)));

export default userRouter;
