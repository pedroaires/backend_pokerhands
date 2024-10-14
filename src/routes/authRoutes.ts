import { Router, Request, Response } from 'express';
import { AuthenticationController } from '../controllers/authenticationController';
import { UserService } from '../services/userService';
import { asyncWrapper } from '../utils/asyncWrapper';

const authRouter = Router();
const authenticationController = new AuthenticationController(new UserService());

authRouter.post("/login", asyncWrapper((req: Request, res: Response) => authenticationController.loginUser(req, res)));

export default authRouter;
