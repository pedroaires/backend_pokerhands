import { Request, Response } from 'express';
import { HandService } from '../services/handService';

export class HandController {
    private handService: HandService;

    constructor(handService: HandService) {
        this.handService = handService;
    }

    async uploadHandFile(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await this.handService.processHandFile(file, userId);

        return res.json({ message: 'File uploaded and processed successfully', result });
    
    }

    async getHands(req: Request, res: Response): Promise<Response> {
        
        const { userId } = req.params;
        const hands = await this.handService.getHandsByUser(userId);
        return res.json({ hands });
    }

    async getHandById(req: Request, res: Response): Promise<Response> {
    
        const { handId } = req.params;
        const hand = await this.handService.getHandById(handId);

        if (!hand) {
            return res.status(404).json({ error: 'Hand not found' });
        }

        return res.json({ hand });
    }


    async deleteHand(req: Request, res: Response): Promise<Response> {
        const { handId } = req.params;
        const deleted = await this.handService.deleteHand(handId);

        if (!deleted) {
            return res.status(404).json({ error: 'Hand not found' });
        }

        return res.json({ message: 'Hand deleted successfully' });
        
    }
}
