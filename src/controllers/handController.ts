import { Request, Response } from 'express';
import { HandService } from '../services/handService';

export class HandController {
    private handService: HandService;

    constructor(handService: HandService) {
        this.handService = handService;
    }

    async uploadHandFile(req: Request, res: Response): Promise<Response> {
        const { userId } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await this.handService.processHandFile(file, userId);

        return res.json({ message: 'File uploaded and processed successfully', result });
    
    }

    async getHands(req: Request, res: Response): Promise<Response> {
        
        const { userId } = req.body;
        const hands = await this.handService.getHandsByUser(userId);
        return res.json({ hands });
    }

    async getUserHandById(req: Request, res: Response): Promise<Response> {
    
        const { handId } = req.params;
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'No user ID provided' });
        }

        if (!handId) {
            return res.status(400).json({ error: 'No hand ID provided' });
        }
        const hand = await this.handService.getHandById(userId, handId);

        return res.json({ hand });
    }


    async deleteUserHand(req: Request, res: Response): Promise<Response> {
        const { handId } = req.params;
        const { userId } = req.body;
        const deleted = await this.handService.deleteUserHand(userId, handId);

        if (!deleted) {
            return res.status(404).json({ error: 'Hand not found' });
        }

        return res.json({ message: 'Hand deleted successfully' });
        
    }

    async getHandsBySource(req: Request, res: Response): Promise<Response> {
        
        const { userId } = req.body;
        const source = req.query.source as string;
        
        let hands;
        if (!userId) {
            return res.status(400).json({ error: 'No user ID provided' });
        }

        if (source === 'user') {
            hands = await this.handService.getHandsByUser(userId);
        } else if (source === 'team') {
            hands = await this.handService.getAllTeamHands(userId);
            
        } else if (source === 'both') {
            const userHands = await this.handService.getHandsByUser(userId);
            const teamHands = await this.handService.getAllTeamHands(userId);
            hands = [...userHands, ...teamHands];
        } else {
            return res.status(400).json({ error: 'Invalid source parameter. Expected "user", "team", or "both"' });
        }

        return res.json({ hands });
    }
}
