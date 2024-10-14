import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt'; 

const userRouter = Router();
const userController = new UserController(new UserService());


userRouter.post("/", asyncWrapper((req: Request, res: Response) => userController.registerUser(req, res)));

userRouter.get("/getUsers", asyncWrapper((req: Request, res: Response) => userController.getAllUsers(req, res)));

userRouter.get("/getUser", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.getUserById(req, res)));

userRouter.put("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.updateUser(req, res)));

userRouter.delete("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.deleteUser(req, res)));

export default userRouter;
