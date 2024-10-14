import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async registerUser(req: Request, res: Response) {
        const { username, password } = req.body;
        if (!username) {
            res.status(400).send({ message: 'Missing Username' });
            return;
        }

        if (!password) {
            res.status(400).send({ message: 'Missing Password' });
            return;
        }
        const user = await this.userService.createUser({ username, password });
        
        res.status(201).send({ message: 'User registered', user });
    
    }

    async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ message: 'Missing credentials' });
        }
        
        const { token } = await this.userService.loginUser(username, password);
        
        res.status(200).send({ message: 'Login successful', token });
        
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await this.userService.getAllUsers();
        res.send(users);
    }

    async getUserById(req: Request, res: Response) {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).send({ message: 'Missing user ID' });
            return;
        }
        const user = await this.userService.getUserById(userId);
        res.send(user);
    }

    async updateUser(req: Request, res: Response) {
        const { userId } = req.body;
        const { username, password } = req.body;
        if (!username) {
            res.status(400).send({ message: 'Missing username' });
            return;
        }

        if (!password) {
            res.status(400).send({ message: 'Missing password' });
            return;
        }
        if (!userId) {
            res.status(400).send({ message: 'Missing user ID' });
            return;
        }

        const updatedUser = await this.userService.updateUser(userId, { username, password });
    
        return res.send({ message: 'User updated', user: updatedUser });
    }


    async deleteUser(req: Request, res: Response) {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).send({ message: 'Missing user ID' });
            return;
        }
        const deletedUser = await this.userService.deleteUser(userId);
        res.send({ message: 'User deleted', user: deletedUser });
    }



}