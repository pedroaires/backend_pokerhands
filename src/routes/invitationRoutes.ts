import { Router, Request, Response } from 'express';
import { InvitationController } from '../controllers/invitationController';
import { InvitationService } from '../services/invitationService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt';  

const invitationRouter = Router();
const invitationController = new InvitationController(new InvitationService());

/**
 * @swagger
 * /invitations/{teamName}:
 *   post:
 *     summary: Send an invitation to a team
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the team to send an invitation to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user being invited
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *       400:
 *         description: Error sending invitation
 */
invitationRouter.post("/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.sendInvitation(req, res)));

/**
 * @swagger
 * /invitations:
 *   get:
 *     summary: Get a list of pending invitations
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending invitations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   invitationId:
 *                     type: string
 *                   teamName:
 *                     type: string
 *                   userId:
 *                     type: string
 *       401:
 *         description: Unauthorized access
 */
invitationRouter.get("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.getPendingInvitations(req, res)));

/**
 * @swagger
 * /invitations/{invitationId}:
 *   put:
 *     summary: Respond to an invitation
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the invitation to respond to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the invitation (e.g., accepted, rejected)
 *     responses:
 *       200:
 *         description: Invitation responded to successfully
 *       400:
 *         description: Invalid invitation response
 */
invitationRouter.put("/:invitationId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.respondToInvitation(req, res)));

export default invitationRouter;
