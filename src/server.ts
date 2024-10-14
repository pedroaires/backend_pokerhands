import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { asyncWrapper } from './utils/asyncWrapper';
import { verifyAccessToken } from './utils/jwt';

import { UserController } from './controllers/userController';
import { UserService } from './services/userService';

import { HandController } from './controllers/handController';
import { HandService } from './services/handService';

import { TeamController } from './controllers/teamController';
import { TeamService } from './services/teamService';

import { InvitationController } from './controllers/invitationController';
import { InvitationService } from './services/invitationService';

const cors = require('cors');

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use an absolute path for the uploads directory
        cb(null, path.join(__dirname, 'uploads'));  // Resolve absolute path using __dirname
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Unique filename
    }
});

const upload = multer({ storage });

const userController = new UserController(new UserService());
const handController = new HandController(new HandService());
const teamController = new TeamController(new TeamService());
const invitationController = new InvitationController(new InvitationService());



app.post("/auth/login", asyncWrapper((req: Request, res: Response) => userController.loginUser(req, res)));

app.post("/users", asyncWrapper((req: Request, res: Response) => userController.registerUser(req, res)));

app.get("/users/getUsers", asyncWrapper((req: Request, res: Response) => userController.getAllUsers(req, res)));

app.get("/users/getUser", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.getUserById(req, res)));

app.put("/users", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.updateUser(req, res)));

app.delete("/users", verifyAccessToken, asyncWrapper((req: Request, res: Response) => userController.deleteUser(req, res)));


app.post("/hands/upload", verifyAccessToken, upload.single('file'), asyncWrapper((req: Request, res: Response) => handController.uploadHandFile(req, res)));

app.get("/hands", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getHands(req, res)));

app.get("/hands/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.getUserHandById(req, res)));

app.delete("/hands/:handId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => handController.deleteUserHand(req, res)));


app.post("/teams", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.createTeam(req, res)));
app.get("/teams", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.getTeamsByUser(req, res)));
app.get("/teams/:teamName/hands", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.getTeamHands(req, res)));
app.delete("/teams/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.deleteTeam(req, res)));
app.put("/teams/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.updateTeam(req, res)));
app.get("/teams/:teamName/users", verifyAccessToken, asyncWrapper((req: Request, res: Response) => teamController.listTeamUsers(req, res)));


app.post("/invitations/:teamName", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.sendInvitation(req, res)));

app.get("/invitations", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.getPendingInvitations(req, res)));

app.put("/invitations/:invitationId", verifyAccessToken, asyncWrapper((req: Request, res: Response) => invitationController.respondToInvitation(req, res)));







app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
