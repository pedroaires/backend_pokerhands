import { Request, Response } from 'express';
import { HandService } from '../services/handService';

export class HandController {
    private handService: HandService;

    constructor(handService: HandService) {
        this.handService = handService;
    }

    async uploadHandFile(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const result = await this.handService.processHandFile(file, userId);

            return res.json({ message: 'File uploaded and processed successfully', result });
        } catch (error) {
            console.error('Error uploading hand file:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    }

    async getHands(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const hands = await this.handService.getHandsByUser(userId);
            return res.json({ hands });
        } catch (error) {
            console.error('Error retrieving hands:', error);
            return res.status(500).json({ error: 'Failed to retrieve hands' });
        }
    }

    async getHandById(req: Request, res: Response): Promise<Response> {
        try {
            const { handId } = req.params;
            const hand = await this.handService.getHandById(handId);

            if (!hand) {
                return res.status(404).json({ error: 'Hand not found' });
            }

            return res.json({ hand });
        } catch (error) {
            console.error('Error retrieving hand:', error);
            return res.status(500).json({ error: 'Failed to retrieve hand' });
        }
    }


    async deleteHand(req: Request, res: Response): Promise<Response> {
        try {
            const { handId } = req.params;
            const deleted = await this.handService.deleteHand(handId);

            if (!deleted) {
                return res.status(404).json({ error: 'Hand not found' });
            }

            return res.json({ message: 'Hand deleted successfully' });
        } catch (error) {
            console.error('Error deleting hand:', error);
            return res.status(500).json({ error: 'Failed to delete hand' });
        }
    }
}
