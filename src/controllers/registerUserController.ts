import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class RegisterUserController {
    async handle(req: Request, res: Response) {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) {
            res.status(400).send({ message: 'Missing fields' });
            return;
        }

        const userService = new UserService();
        const user = await userService.createUser({ username, password });
        res.send({ message: 'User registered', user });
    }
}