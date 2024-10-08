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

        try {
            const user = await this.userService.createUser({ username, password });
            res.status(201).send({ message: 'User registered', user });
        } catch (error) {
            res.status(500).send({ message: 'Error creating user', error });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllUsers();
            res.send(users);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching users', error });
        }
    }

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(404).send({ message: 'User not found' });
                return;
            }
            res.send(user);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching user', error });
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send({ message: 'Missing username or password' });
            return;
        }

        try {
            const updatedUser = await this.userService.updateUser(id, { username, password });
            if (!updatedUser) {
                res.status(404).send({ message: 'User not found' });
                return;
            }
            res.send({ message: 'User updated', user: updatedUser });
        } catch (error) {
            res.status(500).send({ message: 'Error updating user', error });
        }
    }


    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deletedUser = await this.userService.deleteUser(id);
            if (!deletedUser) {
                res.status(404).send({ message: 'User not found' });
                return;
            }
            res.send({ message: 'User deleted' });
        } catch (error) {
            res.status(500).send({ message: 'Error deleting user', error });
        }
    }



}