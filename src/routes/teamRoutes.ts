import { Router, Request, Response } from 'express';
import { TeamController } from '../controllers/teamController';
import { TeamService } from '../services/teamService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt';  

const teamRouter = Router();
const teamController = new TeamController(new TeamService());

teamRouter.post("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.createTeam(req, res)));
teamRouter.get("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.getTeamsByUser(req, res)));
teamRouter.get("/:teamName/hands", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.getTeamHands(req, res)));
teamRouter.delete("/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.deleteTeam(req, res)));
teamRouter.put("/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.updateTeam(req, res)));
teamRouter.get("/:teamName/users", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.listTeamUsers(req, res)));

export default teamRouter;
