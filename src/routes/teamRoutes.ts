import { Router, Request, Response } from 'express';
import { TeamController } from '../controllers/teamController';
import { TeamService } from '../services/teamService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt';  

const teamRouter = Router();
const teamController = new TeamController(new TeamService());


/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Error creating team
 */
teamRouter.post("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.createTeam(req, res)));

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get teams for a user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of teams for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized access
 */
teamRouter.get("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.getTeamsByUser(req, res)));

/**
 * @swagger
 * /teams/{teamName}/hands:
 *   get:
 *     summary: Get hands for a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the team to get hands for
 *     responses:
 *       200:
 *         description: A list of hands for the team
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized access
 */
teamRouter.get("/:teamName/hands", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.getTeamHands(req, res)));

/**
 * @swagger
 * /teams/{teamName}:
 *   delete:
 *     summary: Delete a team by name
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the team to delete
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized access
 */
teamRouter.delete("/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.deleteTeam(req, res)));


/**
 * @swagger
 * /teams/{teamName}:
 *   put:
 *     summary: Update a team by name
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the team to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized access
 */
teamRouter.put("/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.updateTeam(req, res)));

/**
 * @swagger
 * /teams/{teamName}/users:
 *   get:
 *     summary: Get users for a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the team to get users for
 *     responses:
 *       200:
 *         description: A list of users in the team
 *       404:
 *         description: Team not found
 *       401:
 *         description: Unauthorized access
 */
teamRouter.get("/:teamName/users", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.listTeamUsers(req, res)));

export default teamRouter;
