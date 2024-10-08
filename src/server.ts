import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { UserController } from './controllers/userController';
import { UserService } from './services/userService';
import { HandController } from './controllers/handController';
import { HandService } from './services/handService';

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
app.post("/users", (req, res) => userController.registerUser(req, res));         // Create
app.get("/users", (req, res) => userController.getAllUsers(req, res));           // Read all
app.get("/users/:id", (req, res) => userController.getUserById(req, res));       // Read by ID
app.put("/users/:id", (req, res) => userController.updateUser(req, res));        // Update
app.delete("/users/:id", (req, res) => userController.deleteUser(req, res));     // Delete

// Define the file upload route
app.post("/hands/upload/:userId", upload.single('file'), (req, res) => handController.uploadHandFile(req, res));

  

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
