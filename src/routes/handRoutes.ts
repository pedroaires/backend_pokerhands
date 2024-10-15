import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { HandController } from '../controllers/handController';
import { HandService } from '../services/handService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { verifyAccessToken } from '../utils/jwt'; 

const handRouter = Router();
const handController = new HandController(new HandService());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  
    }
});

const upload = multer({ storage });

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /hands/upload:
 *   post:
 *     summary: Upload a file containing poker hands from Hand2Note 4
 *     tags: [Hands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: A .txt file from Hand2Note 4 containing multiple poker hands
 *     responses:
 *       200:
 *         description: File uploaded and hands processed successfully
 *       400:
 *         description: Invalid file or authentication error
 */
handRouter.post("/upload", verifyAccessToken, upload.single('file'), asyncWrapper((req: Request, res: Response) => handController.uploadHandFile(req, res)));

/**
 * @swagger
 * /hands:
 *   get:
 *     summary: Get a list of all hands
 *     tags: [Hands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all hands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized access
 */
handRouter.get("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getHands(req, res)));

/**
 * @swagger
 * /hands/{handId}:
 *   get:
 *     summary: Get details of a specific hand by ID
 *     tags: [Hands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: handId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hand to retrieve
 *     responses:
 *       200:
 *         description: Details of the requested hand
 *       404:
 *         description: Hand not found
 *       401:
 *         description: Unauthorized access
 */
handRouter.get("/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getUserHandById(req, res)));

/**
 * @swagger
 * /hands/{handId}:
 *   delete:
 *     summary: Delete a hand by ID
 *     tags: [Hands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: handId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hand to delete
 *     responses:
 *       200:
 *         description: Hand deleted successfully
 *       404:
 *         description: Hand not found
 *       401:
 *         description: Unauthorized access
 */
handRouter.delete("/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.deleteUserHand(req, res)));

/**
 * @swagger
 * /hands/source:
 *   post:
 *     summary: Get hands based on the source (user, team, or both)
 *     tags: [Hands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *                 enum: [user, team, both]
 *                 description: The source of the hands ('user', 'team', or 'both')
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *             required:
 *               - source
 *               - userId
 *     responses:
 *       200:
 *         description: A list of hands based on the source
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Invalid source parameter
 *       401:
 *         description: Unauthorized access
 */
handRouter.post("/source", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getHandsBySource(req, res)));


handRouter.get("/withHeroData/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getHandsWithHeroData(req, res)));



export default handRouter;
