import { Request, Response } from "express";
import { TeamService } from "../services/teamService";

export class TeamController {
    private teamService: TeamService;

    constructor(teamService: TeamService) {
        this.teamService = teamService;
    }

    async createTeam(req: Request, res: Response) {
        const { userId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ message: 'Missing team name' });
        }
        if (!userId) {
            return res.status(400).send({ message: 'Missing user ID' });
        }

        
        const team = await this.teamService.createTeam(userId, { name });
        res.status(201).send({ message: 'Team created', team });
    }

    async getTeamsByUser(req: Request, res: Response) {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).send({ message: 'Missing user ID' });
        }
    
        const teams = await this.teamService.getTeamsByUser(userId);
        res.status(200).send({ teams });
    }

    async getTeamHands(req: Request, res: Response) {
        const { teamName, userId } = req.params;
        if (!teamName) {
            return res.status(400).send({ message: 'Missing team Name' });
        }
        if (!userId) {
            return res.status(400).send({ message: 'Missing user ID' });
        }
        const hands = await this.teamService.getTeamHands(userId, teamName);
        res.status(200).send({ hands });
        
    }

    async deleteTeam(req: Request, res: Response) {
        const { teamName, userId } = req.params;
        if (!teamName) {
            return res.status(400).send({ message: 'Missing team Name' });
        }
        if (!userId) {
            return res.status(400).send({ message: 'Missing user ID' });
        }
    
        const deletedTeam = await this.teamService.deleteTeam(teamName, userId);
        res.status(200).send({ message: 'Team deleted', deletedTeam });
    }

    async updateTeam(req: Request, res: Response) {
        const { teamName, userId } = req.params;
        const { newName } = req.body;
        
        if (!userId) {
            return res.status(400).send({ message: 'Missing the userId' });
        }
        if (!teamName) {
            return res.status(400).send({ message: 'Missing team Name' });
        }
        if (!newName) {
            return res.status(400).send({ message: 'Missing new team Name' });
        }

        const updatedTeam = await this.teamService.updateTeam(teamName, userId, { newName: newName });

        res.status(200).send({ message: 'Team updated', updatedTeam });
    }
}
