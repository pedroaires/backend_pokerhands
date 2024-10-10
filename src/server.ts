import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { UserController } from './controllers/userController';
import { UserService } from './services/userService';
import { HandController } from './controllers/handController';
import { HandService } from './services/handService';
import { errorHandler } from './errors/errorHandler';
import { asyncWrapper } from './utils/asyncWrapper';

const app = express();
const port = 3000;


app.use(express.json());

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


app.post("/users", asyncWrapper((req: Request, res: Response) => userController.registerUser(req, res)));

app.get("/users", asyncWrapper((req: Request, res: Response) => userController.getAllUsers(req, res)));

app.get("/users/:id", asyncWrapper((req: Request, res: Response) => userController.getUserById(req, res)));

app.put("/users/:id", asyncWrapper((req: Request, res: Response) => userController.updateUser(req, res)));

app.delete("/users/:id", asyncWrapper((req: Request, res: Response) => userController.deleteUser(req, res)));


// Define the file upload route
app.post("/hands/upload/:userId", upload.single('file'), asyncWrapper((req: Request, res: Response) => handController.uploadHandFile(req, res)));
app.get("/hands/:userId", asyncWrapper((req: Request, res: Response) => handController.getHands(req, res)));
app.get("/hands/:userId/:handId", asyncWrapper((req: Request, res: Response) => handController.getHandById(req, res)));
app.delete("/hands/:handId", asyncWrapper((req: Request, res: Response) => handController.deleteHand(req, res)));

  

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
