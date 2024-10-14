import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class AuthenticationController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ message: 'Missing credentials' });
        }

        const { token } = await this.userService.loginUser(username, password);
        
        res.status(200).send({ message: 'Login successful', token });
    }
}
