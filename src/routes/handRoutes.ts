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


handRouter.post("/upload", verifyAccessToken, upload.single('file'), asyncWrapper((req: Request, res: Response) => handController.uploadHandFile(req, res)));

handRouter.get("/", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getHands(req, res)));

handRouter.get("/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getUserHandById(req, res)));

handRouter.delete("/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.deleteUserHand(req, res)));

export default handRouter;
