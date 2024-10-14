import { Router, Request, Response } from 'express';
import { InvitationController } from '../controllers/invitationController';
import { InvitationService } from '../services/invitationService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt';  

const invitationRouter = Router();
const invitationController = new InvitationController(new InvitationService());

invitationRouter.post("/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.sendInvitation(req, res)));
invitationRouter.get("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.getPendingInvitations(req, res)));
invitationRouter.put("/:invitationId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.respondToInvitation(req, res)));

export default invitationRouter;
