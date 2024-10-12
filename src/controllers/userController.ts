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

    async getAllUsers(req: Request, res: Response) {

        const users = await this.userService.getAllUsers();
        res.send(users);
  
    }

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;
        const user = await this.userService.getUserById(id);
        res.send(user);
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const { username, password } = req.body;
        if (!username) {
            res.status(400).send({ message: 'Missing username' });
            return;
        }

        if (!password) {
            res.status(400).send({ message: 'Missing password' });
            return;
        }

        const updatedUser = await this.userService.updateUser(id, { username, password });
    
        return res.send({ message: 'User updated', user: updatedUser });
    }


    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        res.send({ message: 'User deleted' });
    }



}